#!/usr/bin/env node
// skill-keyword-injector.js — UserPromptSubmit 훅 (스킬/에이전트 추천 신호)
//
// 목적: 사용자 프롬프트를 skills/INDEX.md·agents/INDEX.md 의 trigger keywords 와 매칭,
//   가장 적합한 후보 1개를 "추천 skill/agent" 1줄로 컨텍스트에 주입. 이는 추천 신호일 뿐,
//   확정은 USAGE-GUIDE 결정 트리가 한다 (skills/USAGE-GUIDE.md 참조).
// 외부 클론 A1(키워드 라우팅) 차용 — 본 하네스의 파일 기반 INDEX 로 번역.
//
// 입력: stdin JSON { prompt, session_id, ... }
// 출력: 매칭 시 stdout JSON {"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"..."}}
//   매칭 임계 미달이면 무출력. 출력은 최대 1줄.
// 부수효과: INDEX 파싱 결과를 mtime 키로 캐시 (logs/.skill-index-cache.json)
// 에러 정책: 모든 경로 process.exit(0) — fail-open (어떤 오류도 프롬프트를 막지 않음).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MIN_SCORE = 2;        // 추천 임계: 매칭 키워드 2개 이상일 때만 노출 (노이즈 억제)
const STDIN_TIMEOUT_MS = 2000;

function readStdin() {
  return new Promise((resolve) => {
    let buf = '';
    const timer = setTimeout(() => resolve(buf), STDIN_TIMEOUT_MS);
    try {
      process.stdin.on('data', (c) => { buf += c; });
      process.stdin.on('end', () => { clearTimeout(timer); resolve(buf); });
      process.stdin.on('error', () => { clearTimeout(timer); resolve(buf); });
    } catch (_) { clearTimeout(timer); resolve(buf); }
  });
}

// 메인 레포 루트 (worktree 세션도 공통 루트로 통일 — INDEX 는 메인에 정본)
function resolveBase() {
  const projDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  try {
    const common = execSync('git rev-parse --git-common-dir',
      { cwd: projDir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (common) {
      const mainRepo = path.dirname(path.resolve(projDir, common));
      if (fs.existsSync(path.join(mainRepo, 'skills', 'INDEX.md'))) return mainRepo;
    }
  } catch (_) { /* git 부재 시 projDir */ }
  return projDir;
}

/**
 * INDEX.md 표 행에서 {name, kind, keywords[]} 항목을 추출한다.
 * 표 형식: | `name` | description | kw1, kw2, ... |
 * @param {string} content INDEX.md 본문
 * @param {string} kind 'skill' 또는 'agent'
 * @returns {Array<{name:string, kind:string, keywords:string[]}>}
 */
function parseIndex(content, kind) {
  const items = [];
  for (const line of content.split('\n')) {
    // 표 데이터 행만: 파이프 3개 이상 + 첫 셀이 백틱 name
    const m = line.match(/^\|\s*`([^`]+)`\s*\|[^|]*\|\s*([^|]+?)\s*\|/);
    if (!m) continue;
    const name = m[1].trim();
    const kwCell = m[2].trim();
    if (!kwCell || kwCell.toLowerCase() === 'trigger keywords') continue;
    const keywords = kwCell.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean);
    if (keywords.length) items.push({ name, kind, keywords });
  }
  return items;
}

/** mtime 캐시: INDEX 파일들의 최신 mtime 이 캐시와 같으면 파싱 생략 */
function loadIndexItems(base) {
  const skillIdx = path.join(base, 'skills', 'INDEX.md');
  const agentIdx = path.join(base, 'agents', 'INDEX.md');
  const cacheFile = path.join(base, 'logs', '.skill-index-cache.json');

  let maxMtime = 0;
  for (const f of [skillIdx, agentIdx]) {
    try { maxMtime = Math.max(maxMtime, fs.statSync(f).mtimeMs); } catch (_) { /* 부재 무시 */ }
  }

  // 캐시 적중 시 재사용
  try {
    const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    if (cache && cache.mtime === maxMtime && Array.isArray(cache.items)) return cache.items;
  } catch (_) { /* 캐시 부재·손상 → 재파싱 */ }

  let items = [];
  try { items = items.concat(parseIndex(fs.readFileSync(skillIdx, 'utf8'), 'skill')); } catch (_) {}
  try { items = items.concat(parseIndex(fs.readFileSync(agentIdx, 'utf8'), 'agent')); } catch (_) {}

  // 캐시 기록 (실패해도 무해)
  try {
    if (fs.existsSync(path.dirname(cacheFile))) {
      fs.writeFileSync(cacheFile, JSON.stringify({ mtime: maxMtime, items }));
    }
  } catch (_) {}

  return items;
}

/** prompt 에 포함된 키워드 수로 점수화. 최고 점수 후보 1개 반환 (동점은 키워드 많은 쪽) */
function bestMatch(prompt, items) {
  const lower = prompt.toLowerCase();
  let best = null;
  for (const it of items) {
    let score = 0;
    for (const kw of it.keywords) {
      if (kw.length >= 2 && lower.includes(kw)) score++;
    }
    if (score > 0 && (!best || score > best.score)) best = { ...it, score };
  }
  return best;
}

(async () => {
  try {
    const raw = await readStdin();
    let payload = {};
    try { payload = JSON.parse(raw || '{}'); } catch (_) { payload = {}; }
    const prompt = typeof payload.prompt === 'string' ? payload.prompt : '';
    if (!prompt.trim()) process.exit(0); // 빈 프롬프트 → 무출력

    const base = resolveBase();
    const items = loadIndexItems(base);
    if (!items.length) process.exit(0); // INDEX 파싱 실패 → 무출력 (fail-open)

    const best = bestMatch(prompt, items);
    if (!best || best.score < MIN_SCORE) process.exit(0); // 임계 미달 → 무출력

    const label = best.kind === 'agent' ? 'agent' : 'skill';
    const ctx = `추천 ${label}: ${best.name} (키워드 매칭 ${best.score}건 — 추천 신호일 뿐, 확정은 USAGE-GUIDE 결정 트리)`;

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: ctx,
      },
    }));
    process.exit(0);
  } catch (_) {
    process.exit(0); // 모든 에러에서 비차단 (fail-open)
  }
})();

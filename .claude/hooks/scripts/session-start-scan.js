#!/usr/bin/env node
// session-start-scan.js — SessionStart 훅 (worktree 고립 결재 + 미매핑 MCP 스캔)
//
// 목적: 세션 시작 시 (1) 각 git worktree 의 decisions/pending.md 가 main 과 다르면 고립 결재 경고,
//   (2) (있으면) 미매핑 MCP 후보를 경고 — 전수 감사 critic(worktree 마감 고립) 재발 방지.
// 규칙: 거버넌스 결정(worktree 고립 결재 스캔). 안전 계약은 context-usage-monitor.js 상속.
//
// 입력: stdin JSON (SessionStart payload — 미사용, 안전 위해 읽고 버림)
// 출력: stdout JSON {"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}
//   (SessionStart 훅의 additionalContext 는 세션 컨텍스트에 주입됨)
// 에러 정책: 모든 경로 process.exit(0). 발견 0건이면 무출력.
//
// 주의: 본 훅은 '경고만' — 차단·자동조치 없음 (AP2·AP3 정합, 15절 권고 원칙).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function readStdinThenContinue(cb) {
  let done = false;
  const finish = () => { if (!done) { done = true; cb(); } };
  const timer = setTimeout(finish, 1500);
  try {
    process.stdin.on('data', () => {});
    process.stdin.on('end', () => { clearTimeout(timer); finish(); });
    process.stdin.on('error', () => { clearTimeout(timer); finish(); });
  } catch (_) { clearTimeout(timer); finish(); }
}

function sh(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch (_) { return ''; }
}

// 메인 레포 루트 (worktree 세션에서 시작돼도 공통 루트로 통일)
function mainRepo() {
  const projDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const common = sh('git rev-parse --git-common-dir', projDir);
  if (common) {
    const root = path.dirname(path.resolve(projDir, common));
    if (fs.existsSync(path.join(root, '.claude'))) return root;
  }
  return projDir;
}

function readPending(repoPath) {
  // worktree 의 추적 파일 내용을 git 으로 읽음 (체크아웃 상태 무관 — HEAD 기준)
  try {
    const p = path.join(repoPath, 'decisions', 'pending.md');
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
  } catch (_) {}
  return null;
}

function countWaiting(md) {
  if (!md) return 0;
  // "## 대기 항목" 섹션 내 "### 항목" 헤더 수 (처리 완료 섹션 제외 근사)
  const idx = md.indexOf('## 대기 항목');
  if (idx < 0) return 0;
  const seg = md.slice(idx, md.indexOf('## 처리 완료', idx) >= 0 ? md.indexOf('## 처리 완료', idx) : undefined);
  const m = seg.match(/^### 항목/gm);
  return m ? m.length : 0;
}

readStdinThenContinue(() => {
  try {
    const root = mainRepo();
    const warns = [];

    // (1) worktree 고립 결재 스캔
    const wtRaw = sh('git worktree list --porcelain', root);
    const wtPaths = [];
    wtRaw.split('\n').forEach((line) => {
      if (line.startsWith('worktree ')) wtPaths.push(line.slice('worktree '.length).trim());
    });
    const mainPending = readPending(root);
    const mainCount = countWaiting(mainPending);
    wtPaths.forEach((wt) => {
      if (path.resolve(wt) === path.resolve(root)) return; // 메인 제외
      const wtPending = readPending(wt);
      if (!wtPending) return;
      const c = countWaiting(wtPending);
      // worktree 의 pending 이 main 과 내용이 다르고 대기 항목을 가질 때만
      if (c > 0 && wtPending !== mainPending) {
        warns.push(`worktree '${path.basename(wt)}' 의 decisions/pending.md 에 대기 결재 ${c}건 (main 미합류 가능 — 확인 요망)`);
      }
    });

    if (!warns.length) process.exit(0); // 발견 0건 → 무출력

    const ctx = [
      '[하네스 SessionStart 스캔 — worktree 고립 결재]',
      ...warns.map((w, i) => `  (${i + 1}) ${w}`),
      `  → main decisions/pending.md 대기 ${mainCount}건. worktree 고립 결재는 합류(또는 해당 worktree에서 처리) 필요.`,
    ].join('\n');

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: ctx },
    }));
    process.exit(0);
  } catch (_) {
    process.exit(0);
  }
});

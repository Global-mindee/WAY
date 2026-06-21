#!/usr/bin/env node
// context-usage-monitor.js — project-scoped Stop/PreCompact 훅
//
// 목적: 세션 컨텍스트 소비를 측정해 신호등(Green/Yellow/Red) 경고 + 로컬 로그 기록.
// 규칙: rules/context-management.md (2026-06-07)
//
// 입력: stdin JSON { transcript_path, hook_event_name, trigger, ... } (hook payload)
// 출력: stderr "CTX: <신호>" 1줄 (svop-auditor 와 채널 구분 — 'CTX:' 프리픽스)
// 부수효과: <repo>/logs/context-usage.local.log append (.gitignore — git churn 회피)
//           <repo>/logs/.ctx-state (직전 신호 상태 — 전이 de-dup 용)
// 에러 정책: 모든 경로에서 process.exit(0) 보장 (세션 비차단)
//
// 측정 원리: transcript 마지막 assistant '.message.usage' 의
//   input_tokens + cache_read_input_tokens + cache_creation_input_tokens 합산.
//   (누적 합산 금지 — cache_read 이중계상 시 169% 폭증: claude-code#13783)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- 임계 (rules/context-management.md 2. — 절대토큰 1차) ---
// 일반 작업 기준으로 측정. 추론·고정밀(32K/64K)은 작업유형 자동판별이 어려워
// 본문 규칙(수동)으로 보수 적용한다. (tech 검증 후 정교화 — 규칙 10.)
const GENERAL = { yellow: 100000, red: 200000 };

// 모델별 윈도우(분모, % 보조표시용). 미식별 시 절대토큰 단독.
// 주의: transcript model 필드는 [1m] 베타 플래그를 담지 않음(실측: 'claude-opus-4-8').
//       → opus 는 200K/1M 구분 불가하므로 null 반환(절대토큰 단독). 1M 사용 시 env 로 명시.
function windowSize(model) {
  // 1) 명시적 env override (활성 윈도우 확정 — transcript 로 구분 불가한 경우 사용)
  const envWin = parseInt(process.env.CLAUDE_CONTEXT_WINDOW || '', 10);
  if (envWin > 0) return envWin;
  // 2) transcript model id 에 명시적 윈도우 신호가 있을 때만
  if (model && /\[1m\]/.test(model)) return 1000000;
  if (model && /sonnet|haiku/.test(model)) return 200000;
  // 3) 그 외(opus 등 [1m] 여부 불명) → null: % 평가 생략, 절대토큰 단독 (SVOP — 불확실 분모로 % 단정 금지)
  return null;
}

function readStdin() {
  return new Promise((resolve) => {
    let buf = '';
    const timer = setTimeout(() => resolve(buf), 2000); // 2초 타임아웃
    try {
      process.stdin.on('data', (c) => { buf += c; });
      process.stdin.on('end', () => { clearTimeout(timer); resolve(buf); });
      process.stdin.on('error', () => { clearTimeout(timer); resolve(buf); });
    } catch (_) { clearTimeout(timer); resolve(buf); }
  });
}

// transcript 끝에서 역방향으로 마지막 usage 보유 항목의 컨텍스트 점유 토큰 계산
function measureFromTranscript(txPath) {
  const stat = fs.statSync(txPath);
  const readBytes = Math.min(stat.size, 512 * 1024); // 대용량 가드: tail 512KB
  const fd = fs.openSync(txPath, 'r');
  const buf = Buffer.alloc(readBytes);
  fs.readSync(fd, buf, 0, readBytes, stat.size - readBytes);
  fs.closeSync(fd);
  const lines = buf.toString('utf8').split('\n').filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    let obj;
    try { obj = JSON.parse(lines[i]); } catch (_) { continue; } // 손상 JSON skip
    const u = obj && obj.message && obj.message.usage;
    if (u && typeof u.input_tokens === 'number') {
      const ctx = (u.input_tokens || 0)
        + (u.cache_read_input_tokens || 0)
        + (u.cache_creation_input_tokens || 0);
      return { ctx, model: (obj.message.model || null), exact: true };
    }
  }
  return null;
}

// 경로 가드: 메인 레포 logs/ (worktree → git-common-dir 로 메인 통일). 없으면 null(no-op).
function resolveLogDir() {
  const projDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  let base = projDir;
  try {
    const common = execSync('git rev-parse --git-common-dir',
      { cwd: projDir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (common) {
      const mainRepo = path.dirname(path.resolve(projDir, common));
      if (fs.existsSync(path.join(mainRepo, 'logs'))) base = mainRepo;
    }
  } catch (_) { /* git 부재 시 projDir 유지 */ }
  const logDir = path.join(base, 'logs');
  return fs.existsSync(logDir) ? logDir : null;
}

// 절대토큰 OR % 중 "더 보수적인(먼저 도달하는)" 신호 채택 (규칙 2. '또는' 의 구현).
// 절대토큰은 큰 윈도우(1M)에서도 품질 저하를 잡고, % 는 작은 윈도우(200K)에서 조기 경고를 잡음.
const LEVELS = ['green', 'yellow', 'red'];
function classifyAbs(ctx) {
  if (ctx > GENERAL.red) return 2;
  if (ctx > GENERAL.yellow) return 1;
  return 0;
}
function classifyPct(ctx, win) {
  if (!win) return -1; // 윈도우 불명 → % 평가 생략(절대토큰만)
  const p = ctx / win;
  if (p > 0.5) return 2;
  if (p > 0.3) return 1;
  return 0;
}

(async () => {
  try {
    const raw = await readStdin();
    let payload = {};
    try { payload = JSON.parse(raw || '{}'); } catch (_) { payload = {}; }

    const logDir = resolveLogDir();
    const ts = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    const isPreCompact = process.argv.includes('--precompact')
      || payload.hook_event_name === 'PreCompact';

    // PreCompact: compact 직전 이벤트 기록
    if (isPreCompact) {
      const trigger = payload.trigger || 'unknown';
      if (logDir) {
        fs.appendFileSync(path.join(logDir, 'context-usage.local.log'),
          `[${ts}] context-compact: trigger=${trigger}\n`);
      }
      process.stderr.write(`CTX: context-compact (trigger=${trigger})\n`);
      process.exit(0);
    }

    const txPath = payload.transcript_path;
    if (!txPath || !fs.existsSync(txPath)) process.exit(0); // 측정 불가 → no-op

    const m = measureFromTranscript(txPath);
    if (!m) process.exit(0); // usage 없음 → no-op

    const win = windowSize(m.model);
    const level = LEVELS[Math.max(classifyAbs(m.ctx), classifyPct(m.ctx, win))];
    const pct = win ? ` (${Math.round(m.ctx / win * 100)}% of ${Math.round(win / 1000)}K)` : '';
    const srcMarker = m.exact ? '[B: usage]' : '[?]';

    // 상태 전이 de-dup
    let prev = 'green';
    const stateFile = logDir ? path.join(logDir, '.ctx-state') : null;
    if (stateFile && fs.existsSync(stateFile)) {
      try { prev = (fs.readFileSync(stateFile, 'utf8').trim() || 'green'); } catch (_) {}
    }
    if (level !== 'green' && level !== prev && logDir) {
      fs.appendFileSync(path.join(logDir, 'context-usage.local.log'),
        `[${ts}] context-${level}: ctx=${m.ctx}${pct} ${srcMarker}\n`);
    }
    if (stateFile) { try { fs.writeFileSync(stateFile, level); } catch (_) {} }

    if (level !== 'green') {
      const advice = level === 'red'
        ? '세션 분할/압축 권고(식별자 flush 후)'
        : '노이즈 작업 서브에이전트 격리 권고';
      process.stderr.write(`CTX: context-${level} ctx=${m.ctx}${pct} — ${advice}\n`);
    }
    process.exit(0);
  } catch (_) {
    process.exit(0); // 모든 에러에서 비차단
  }
})();

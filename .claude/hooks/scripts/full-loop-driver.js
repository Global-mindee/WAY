#!/usr/bin/env node
// full-loop-driver.js — project-scoped Stop 훅 (full-loop 루프 드라이버)
//
// 목적: full-loop 스킬(skills/07_orchestration/full-loop/SKILL.md)이 진행 중인 세션이
//   단계 중간에 멈추면, 상태 파일 기준으로 다음 단계 지시를 재주입해 루프를 재점화.
//   스킬이 1차 드라이버(한 턴 연속 진행), 본 훅은 안전망 — 공식 ralph-loop 패턴 차용.
// 규칙: 도입 계획(사용자 승인) / 안전 계약은
//   rules/context-management.md 8. + context-usage-monitor.js 상속.
//
// 입력: stdin JSON { session_id, transcript_path, stop_hook_active, ... }
// 정본 상태: <메인레포>/.claude/full-loop-state.local.json (쓰기 주체=모델, 훅은 카운터만)
// 출력: 차단 시 stdout {"decision":"block","reason":...} / 그 외 stderr "LOOP:" 1줄
// 부수효과: <메인레포>/logs/full-loop.local.log append (자기 증명 로그)
// 에러 정책: 모든 경로에서 process.exit(0) — 어떤 오류도 세션을 차단하지 않음(fail-open)
//
// 인간 게이트 보존(차단 면제 phase): awaiting_plan_approval(계획 승인),
//   awaiting_user(외부 영향·재시도 한도), done/aborted/stalled(종결).
// 무한루프 방지: 같은 phase 차단 2회(k) 또는 누적 차단 12회/iteration 상한 → stalled.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const K_PER_PHASE = 2;        // 같은 phase 연속 차단 상한 (모델이 state 갱신 실패 시 조기 정지)
const MAX_TOTAL_BLOCKS = 12;  // 전 단계 합산 폭주 절대 상한
const EXEMPT = ['awaiting_plan_approval', 'awaiting_user', 'done', 'aborted', 'stalled'];

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

// 기준 경로 해석.
//   우선순위: (1) worktree 로컬 state 우선 — CLAUDE_PROJECT_DIR 에 state 파일이 있으면
//     그 worktree 를 base 로 인식(오늘 발생한 "worktree 세션에서 훅 안전망 비활성" 해소).
//     worktree 에서 시작한 루프의 state 가 worktree 로컬에 있는데 메인으로 통일하면 no-op 되던 회귀를 차단.
//   (2) worktree 로컬 state 가 없으면 기존 동작 유지 — git-common-dir 로 메인 레포 통일(monitor 와 동일 패턴).
function resolveBase() {
  const projDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const localState = path.join(projDir, '.claude', 'full-loop-state.local.json');
  try {
    // (1) worktree 로컬 state 우선
    if (fs.existsSync(localState)) return projDir;
  } catch (_) { /* stat 실패 시 (2) 로 폴백 */ }
  try {
    // (2) 기존 동작: 메인 레포 통일
    const common = execSync('git rev-parse --git-common-dir',
      { cwd: projDir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (common) {
      const mainRepo = path.dirname(path.resolve(projDir, common));
      if (fs.existsSync(path.join(mainRepo, '.claude'))) return mainRepo;
    }
  } catch (_) { /* git 부재 시 projDir 유지 */ }
  return projDir;
}

function nowIso() { return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'); }

function appendLog(base, line) {
  try {
    const logDir = path.join(base, 'logs');
    if (fs.existsSync(logDir)) {
      fs.appendFileSync(path.join(logDir, 'full-loop.local.log'), `[${nowIso()}] ${line}\n`);
    }
  } catch (_) { /* 로그 실패는 무시 */ }
}

function saveState(file, state) {
  try {
    state.updated_at = nowIso();
    fs.writeFileSync(file, JSON.stringify(state, null, 2));
    return true;
  } catch (_) { return false; } // 쓰기 실패 → 차단 포기(fail-open)는 호출부에서
}

// state.ledger 에 추적 항목 append (없으면 생성). 차단·전이 이벤트의 자기 증명 기록.
// 상한 50개 — 폭주 방지(append-only 의 무한 성장 차단, 최신 50개만 보존).
function appendLedger(state, event, counters) {
  try {
    if (!Array.isArray(state.ledger)) state.ledger = [];
    state.ledger.push({ ts: nowIso(), event, phase: state.phase, counters });
    if (state.ledger.length > 50) state.ledger = state.ledger.slice(-50);
  } catch (_) { /* ledger 실패는 무시 (핵심 동작 비차단) */ }
}

(async () => {
  try {
    const raw = await readStdin();
    let payload = {};
    try { payload = JSON.parse(raw || '{}'); } catch (_) { payload = {}; }

    const base = resolveBase();
    const stateFile = path.join(base, '.claude', 'full-loop-state.local.json');
    if (!fs.existsSync(stateFile)) process.exit(0); // 루프 비활성 → no-op

    let state;
    try { state = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch (_) {
      process.exit(0); // 손상 state → 차단하지 않음 (삭제도 하지 않음 — 수동 복구 여지)
    }
    if (!state || typeof state !== 'object' || !state.phase) process.exit(0);

    // TTL: 만료 state 는 무시 (고지 1줄만)
    const ttlH = Number(state.ttl_hours) > 0 ? Number(state.ttl_hours) : 24;
    const created = Date.parse(state.created_at || '') || 0;
    if (created && Date.now() - created > ttlH * 3600 * 1000) {
      process.stderr.write(`LOOP: state TTL(${ttlH}h) 만료 — 무시. 재개하려면 state 파일 갱신 또는 삭제\n`);
      process.exit(0);
    }

    // 세션 격리: 타 세션의 Stop 에는 개입하지 않음 (ralph 선례)
    if (state.session_id && payload.session_id && state.session_id !== payload.session_id) {
      process.exit(0);
    }

    // 인간 게이트·종결 phase 면제
    if (EXEMPT.includes(state.phase)) process.exit(0);

    // 지식 적재 완료된 deposit → done 기록은 모델 몫, 훅은 통과
    if (state.phase === 'deposit' && state.knowledge_deposited === true) process.exit(0);

    // 상한 가드
    const iter = Number(state.iteration) || 0;
    const maxIter = Number(state.max_iterations) > 0 ? Number(state.max_iterations) : 3;
    const total = Number(state.total_blocks) || 0;
    const inPhase = Number(state.block_count_in_phase) || 0;

    if (total >= MAX_TOTAL_BLOCKS || iter >= maxIter) {
      state.phase = 'stalled';
      appendLedger(state, 'stalled', { reason: 'limit', total_blocks: total, iteration: iter, max_iterations: maxIter });
      saveState(stateFile, state);
      appendLog(base, `stalled: 상한 도달 (total_blocks=${total}, iteration=${iter}/${maxIter})`);
      process.stderr.write('LOOP: 반복 상한 도달 — stalled 전환, 수동 개입 필요\n');
      process.exit(0);
    }
    if (inPhase >= K_PER_PHASE) {
      state.phase = 'stalled';
      appendLedger(state, 'stalled', { reason: 'phase_stuck', block_count_in_phase: inPhase });
      saveState(stateFile, state);
      appendLog(base, `stalled: phase 정체 (phase 차단 ${inPhase}회 — state 갱신 실패 추정)`);
      process.stderr.write('LOOP: 같은 단계 정체 — stalled 전환, 수동 개입 필요\n');
      process.exit(0);
    }

    // 차단 + 다음 단계 지시 재주입
    state.block_count_in_phase = inPhase + 1;
    state.total_blocks = total + 1;
    appendLedger(state, 'block', {
      iteration: iter, max_iterations: maxIter,
      block_count_in_phase: state.block_count_in_phase, total_blocks: state.total_blocks,
    });
    if (!saveState(stateFile, state)) {
      process.stderr.write('LOOP: state 쓰기 실패 — 차단 포기(fail-open)\n');
      process.exit(0); // 카운터를 못 늘리면 차단하지 않음 (무한루프 방지 불가하므로)
    }
    appendLog(base, `block: phase=${state.phase} iter=${iter}/${maxIter} in_phase=${state.block_count_in_phase} total=${state.total_blocks}`);

    const criteria = Array.isArray(state.completion_criteria) && state.completion_criteria.length
      ? state.completion_criteria.join(' / ') : '(계획 승인 시 고정)';
    const instr = state.next_instruction
      || `full-loop 상태 파일(${stateFile})을 읽고 phase=${state.phase} 단계를 SKILL.md 규약대로 계속 진행하세요.`;

    // 컨텍스트 신호등 연동 (rules/context-management.md) — context-usage-monitor 가 유지하는
    // logs/.ctx-state 를 읽어 권고만 병기. Red 여도 강제 중단 없음(15절 — 압축·세션분할은 권고).
    let ctxSignal = null;
    try {
      const ctxFile = path.join(base, 'logs', '.ctx-state');
      if (fs.existsSync(ctxFile)) ctxSignal = (fs.readFileSync(ctxFile, 'utf8').trim() || null);
    } catch (_) { ctxSignal = null; }
    const ctxAdvice = ctxSignal === 'red'
      ? '컨텍스트 신호등: RED — 현 단계 산출을 state·파일에 즉시 flush. 무거운 다음 단계라면 사용자에게 /compact 또는 새 세션("루프 재개") 1줄 권고 후 자연 종료 가능(루프는 state로 재개됨).'
      : ctxSignal === 'yellow'
        ? '컨텍스트 신호등: YELLOW — 노이즈 작업(대량 검색·원문 인용)은 서브에이전트 격리, 요약 1~2K만 회수.'
        : null;

    const reason = [
      `[full-loop 재개] phase=${state.phase} (iteration ${iter}/${maxIter})`,
      `다음 지시: ${instr}`,
      `완료기준(AC): ${criteria}`,
      `규약: skills/07_orchestration/full-loop/SKILL.md 준수. 단계 전이 시 상태 파일의 phase·next_instruction 갱신 + block_count_in_phase=0 리셋.`,
      `게이트(계획 승인·외부 영향·재시도 한도) 도달 시 awaiting_* 로 전이 후 정지. 사용자가 "루프 중지"라 하면 phase=aborted 기록 후 종료.`,
    ].concat(ctxAdvice ? [ctxAdvice] : []).join('\n');

    process.stdout.write(JSON.stringify({
      decision: 'block',
      reason,
      systemMessage: `LOOP: phase=${state.phase} iter=${iter} block=${state.total_blocks}/${MAX_TOTAL_BLOCKS}${ctxSignal && ctxSignal !== 'green' ? ` ctx=${ctxSignal}` : ''}`,
    }));
    process.exit(0);
  } catch (_) {
    process.exit(0); // 모든 에러에서 비차단
  }
})();

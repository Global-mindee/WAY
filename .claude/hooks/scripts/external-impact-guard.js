#!/usr/bin/env node
/**
 * external-impact-guard.js — full-loop 게이트 2 메커니즘화 (v1.4)
 *
 * PreToolUse(Bash) 훅: full-loop 활성 중 외부 영향 명령(push·발송·결제류)을
 * 도구 레벨에서 차단한다 — executor 자진 신고(규율 2)에 의존하지 않는 결정적 방어선.
 *
 * 판정 흐름 (전 분기 fail-open — 훅 장애가 일반 작업을 막지 못함):
 *   비Bash → 통과
 *   차단 패턴 비매칭 → 통과
 *   state 파일 없음(루프 밖) → 통과 (일반 세션은 CLAUDE.md 14절 규율 관할)
 *   루프 종료 상태(done/aborted/stalled)·TTL 초과 → 통과
 *   pre_approved_external[] 매칭(게이트 1 사전 위임) → 통과
 *   그 외 → exit 2 차단 + stderr로 지연 큐 적재·속행 지시 (v1.4 (e))
 *
 * 차단 패턴은 보수적 최소셋(명백한 쓰기성 외부 전파만) — 과차단으로 루프
 * 자동화를 깎지 않는 것이 설계 원칙(2026-06-13 게이트 2 비판 분석).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const PREFIX = '[게이트2훅]'; // stderr 채널 구분 (CTX:·LOOP: 관례)

function out(code) { process.exit(code); }

let raw = '';
try { raw = fs.readFileSync(0, 'utf8'); } catch (e) { out(0); }
let data;
try { data = JSON.parse(raw); } catch (e) { out(0); }

if (!data || data.tool_name !== 'Bash') out(0);
const cmd = (data.tool_input && data.tool_input.command) || '';
if (!cmd) out(0);

// ── 외부 영향 차단 패턴 (최소셋 — 확장은 후속 결재) ──
const PATTERNS = [
  { re: /\bgit\s+([^\n;|&]*\s)?push\b/, label: 'git push' },
  { re: /\bgh\s+pr\s+(create|merge)\b/, label: 'gh pr 쓰기' },
  { re: /\bgh\s+(release|repo)\s+create\b/, label: 'gh 생성' },
  { re: /\bnpm\s+publish\b/, label: 'npm publish' },
  { re: /\b(sendmail|mailx)\b/, label: '메일 발송' },
];
const hit = PATTERNS.find((p) => p.re.test(cmd));
if (!hit) out(0);

// ── 루프 활성 판정: cwd에서 상위로 state 파일 탐색 (worktree 우선 인식) ──
function findState(startDir) {
  let dir = startDir || process.cwd();
  for (let i = 0; i < 8; i++) {
    const f = path.join(dir, '.claude', 'full-loop-state.local.json');
    try { if (fs.existsSync(f)) return f; } catch (e) { return null; }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
  return null;
}
const stateFile = findState(data.cwd);
if (!stateFile) out(0);

let st;
try { st = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch (e) { out(0); }
if (!st || typeof st !== 'object') out(0);

const TERMINAL = ['done', 'aborted', 'stalled'];
if (TERMINAL.includes(st.phase)) out(0);

// TTL 초과 state는 비활성 취급 (드라이버 훅과 동일 규약)
try {
  const upd = new Date(st.updated_at).getTime();
  const ttlMs = (Number(st.ttl_hours) || 24) * 3600 * 1000;
  if (Number.isFinite(upd) && Date.now() - upd > ttlMs) out(0);
} catch (e) { /* 파싱 불가 시 활성 가정 — 보수 */ }

// ── (c) 사전 위임 확인: 게이트 1에서 승인된 명령은 통과 ──
const approved = Array.isArray(st.pre_approved_external) ? st.pre_approved_external : [];
if (approved.some((a) => typeof a === 'string' && a.trim() && cmd.includes(a.trim()))) out(0);

// ── 차단 + (e) 지연 큐 지시 ──
const who = data.agent_id ? `서브에이전트(${data.agent_type || data.agent_id})` : '메인 세션';
process.stderr.write(
  `${PREFIX} 외부 영향 차단: "${hit.label}" — full-loop 활성(phase=${st.phase}, ${who}) 중 사전 위임 목록(pre_approved_external)에 없는 명령입니다. ` +
  `이 작업을 실행하지 말고 pending_external_actions 큐에 기록한 뒤 루프를 속행하세요(해당 작업 의존 AC는 S6에서 UNVERIFIABLE). ` +
  `이 작업이 후속 AC의 선행 조건이면 phase=awaiting_user로 정지하세요. ` +
  `위임 경로: 게이트 1 재승인 또는 사용자 명시 발화 → state.pre_approved_external에 명령 추가 후 재시도. (SKILL.md v1.4 게이트 2)`
);
out(2);

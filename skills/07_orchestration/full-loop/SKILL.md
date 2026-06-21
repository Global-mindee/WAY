---
name: full-loop
description: 자연어 지시 1건을 "프롬프트 구체화 → (조건부) 시장조사 → 플랜모드 계획(AC 고정) → 인간 승인 → 실행(opus·xhigh) → 독립 검수 → 미흡 시 재실행(한도 3시도) → 지식 적재"까지 자동 진행하는 8단계 오케스트레이션 루프. 인간 게이트 3곳(계획 승인·외부 영향·재시도 한도)은 절대 우회하지 않는다. 단순 질의·1~2파일 수정에는 사용 금지.
license: 내부 전용 (W.A.Y?)
metadata:
  version: 1.4.0
  category: 07_orchestration
  trigger-keywords: [이거 자동으로 진행해줘, 풀 루프로, 풀루프, 끝까지 알아서 해줘, 전 과정 자동, 기획부터 검수까지, 야간 자동 진행, 자동 루프, full loop, full-loop, autopilot, end-to-end run]
  human-gates: [plan-approval, external-impact, retry-exhausted]
  state-file: .claude/full-loop-state.local.json
  driver-hook: .claude/hooks/scripts/full-loop-driver.js
  gate2-hook: .claude/hooks/scripts/external-impact-guard.js (PreToolUse·Bash — 루프 활성 중 외부 영향 도구 차단, v1.4)
  context-rules: rules/context-management.md 연동 (신호등 .ctx-state 드라이버 병기, 단계 전이 flush)
  codex-reviewer: codex exec (GPT-5.5, read-only) — S4 계획 교차검토 + S6 이종 검수(자문 모드 파일럿, 전 루프 기본 ON). 보조 파일 codex-verdict.schema.json·codex-reviewer-prompt.md
  approved: 2026-06-10 (사용자, 플랜모드 승인. v1.1 자원계획 의무·컨텍스트 규약 추가 = 사용자 직접 지시)
  changelog:
    v1.2.0: 2026-06-11 외부 하네스 채택 13건 이식 — S1 모호성 5차원 채점(임계 0.3)·인텐트 9종 분류·과분류 가드 / S3 loop-critic 독립 비평(REJECT 재비평 ≤2회) / S6 검수 tier 라우팅(Critical N=3 불변) / S8 remember 스킬 참조 / state 스키마 ledger·s1.ambiguity·s1.intent 추가
    v1.3.0: 2026-06-13 codex(GPT-5.5) 이종 검수 편입 = 사용자 직접 지시(자문 파일럿·전 루프 기본 ON 확정) — S1 codex_review 게이팅(민감 과제 자동 제외) / S4 codex 계획 교차검토 / S6 검수 3종화(Claude 차단권 + codex 자문·blocker 예외 차단·fail-open·일치율 계측) / S7 검수자 출처 표기 합산 / state 스키마 codex_review 추가. 합류: 이식(v1.2)→codex(v1.3) 순 merge, 2026-06-13
    v1.4.0: 2026-06-13 게이트 2 재설계 = 사용자 직접 지시((c)+(e)+(b) 확정, 거버넌스 결정) — (c) 사전 위임 pre_approved_external[](게이트 1에서 계획과 함께 승인) / (e) 정지→지연 큐(미위임 외부 영향은 큐 적재 후 루프 속행, 선행 조건일 때만 정지) / (b) PreToolUse 훅 external-impact-guard.js 도구 레벨 차단(자진 신고 의존 해소, 단위테스트 10/10). 근거: 비판 분석 — 발동 0회·강제 장치 부재·전체 정지의 야간 무인 비용 실측
---

# full-loop — 자연 발화 → 8단계 자동 진행 루프

## When to use

- 조사+계획+구현+검증이 모두 필요한 다단계 과제
- 사용자가 "알아서 끝까지", "자동으로 진행", "풀 루프로" 류 발화를 한 경우
- 야간 무인 진행을 원하는 과제 (인간 게이트에서 자연 정지 후 아침 승인)

## When NOT to use

- 단순 질의응답, 1~2파일 수정, 5분 내 과제
- 기존 전용 스킬 1개로 끝나는 작업 (INDEX 의미론적 매칭 우선)
- 위 경우 "full-loop 부적합 — 직접 처리합니다" 1줄 알림 후 일반 응답

## 아키텍처

본 스킬이 1차 드라이버 — 한 턴에서 단계를 최대한 연속 진행한다. 턴이 중간에 끊기면 Stop 훅 `full-loop-driver.js`가 상태 파일을 읽어 다음 단계 지시를 재주입한다(phase당 차단 최대 2회, 누적 12회 상한 — 초과 시 stalled로 정직 정지). 인간 게이트 phase(`awaiting_*`)에서 훅은 개입하지 않는다.

## 상태 파일 규약 (.claude/full-loop-state.local.json)

루프 시작 시 생성, **단계 전이 시마다 즉시 갱신**(컴팩션·세션 끊김 내성 — 식별자·기준을 파일에 flush):

```json
{ "schema_version": 2, "session_id": "<현 세션 ID>", "task_digest": "<P6 익명화 1줄 요약>",
  "phase": "refine|research|plan|awaiting_plan_approval|execute|review|deposit|awaiting_user|done|aborted|stalled",
  "next_instruction": "<훅이 재주입할 다음 단계 지시 — 전이 때마다 갱신>",
  "iteration": 0, "max_iterations": 3, "block_count_in_phase": 0, "total_blocks": 0,
  "completion_criteria": ["AC-1 ...", "AC-2 ..."], "review": {"verdicts": [], "bon": null},
  "critical_path": false, "codex_review": true,
  "pre_approved_external": [], "pending_external_actions": [],
  "knowledge_deposited": false, "deposited_refs": [],
  "ledger": [],
  "s1": { "ambiguity": null, "intent": null }, "s2": {}, "s3": {}, "s4": {}, "s5": {}, "s6": {}, "s7": {}, "s8": {},
  "created_at": "ISO", "updated_at": "ISO", "ttl_hours": 24 }
```

스키마 v2 추가 필드:
- `ledger[]` — 드라이버 훅이 차단할 때마다 append하는 추적 기록 `{ts, event, phase, counters}` (드라이버가 append, 모델은 읽기만). 루프 진행 이력 자기 증명용
- `s1.ambiguity` — S1 모호성 채점 결과 `{score, dimensions, threshold:0.3, passed}` (아래 S1 참조)
- `s1.intent` — S1 인텐트 분류 결과 `{family, budget}` (9종 중 1택)
- `codex_review` — codex(GPT-5.5) 이종 검수 활성 여부 (v1.3, 기본 true — S1에서 민감 과제 자동 제외)
- `pre_approved_external[]` — 게이트 1에서 계획과 함께 승인된 외부 영향 위임 목록 (v1.4 — 게이트 2 훅이 이 목록의 명령만 통과시킴)
- `pending_external_actions[]` — 미위임 외부 영향의 지연 큐 (v1.4 — 정지 대신 적재 후 속행, 최종 보고에서 일괄 결정)

규칙: phase 전이 시 `block_count_in_phase`를 0으로 리셋. 게이트 도달 시 `awaiting_plan_approval`/`awaiting_user`로 전이 후 턴 종료(훅 면제). 사용자가 "루프 중지" 발화 시 `aborted` 기록 후 state 파일 삭제. 종료(done/stalled/aborted) 시 state 파일은 삭제한다(잔존 시 훅이 TTL까지 무시).

## 8단계 파이프라인

### S1 프롬프트 구체화 (phase=refine)
- 지시를 task-brief로 구조화: 목표 / 범위·경계 / 제약 / 대상 레포 / 산출물 형태 / Critical Path 여부(CLAUDE.md 7절 4기준)
- 모호점이 결과를 가르면 **최대 2~3개만** AskUserQuestion. 지시가 이미 명세형이면 패스스루
- **codex 검수 게이팅 (v1.3)**: 기본 `codex_review=true`(전 루프 ON — 사용자 확정). 단 과제 대상에 민감 데이터(개인정보·비공개 운영 수치·실명·git 격리 폴더)가 포함되면 **false로 자동 제외 + 첫 보고에 1줄 고지** (P6 — codex 호출은 코드·산출물의 OpenAI 전송임). 사용자 1줄 override 가능
- 기록: `s1: {brief, critical_path, ambiguity, intent, codex_review}` → phase=research 또는 plan

#### S1-a 인텐트 분류 (9종 — 질문 슬레이트 결정)

질문하기 전에 과제를 다음 9 패밀리 중 **하나로 분류**한다. 잘못된 패밀리는 사용자 시간을 낭비하고 일반적 군더더기 질문을 낳는다. 결과는 `s1.intent.family`에 기록.

| 패밀리 | 정의 | 질문 예산 |
|--------|------|----------|
| trivial | 오타·1줄 버그·문서 수정·잘 한정된 1파일 변경 | **인터뷰 없음(0)** — 안전 가정 명시 후 직행 |
| simple | 1~3파일·명확 범위·아키텍처 결정 없음 | 전체 인터뷰에서 **1~2개만** |
| refactor | 외부 관찰 동작 불변의 재구성 | 보존 경계·롤백 트리거·회귀 커버리지·범위 캡 축 |
| build-from-scratch | 선행 구현 없는 신규 기능·모듈·서비스 | 종료 기준·테스트 전략·범위 경계·의존성·핸드오프 축 |
| research | 조사 후 결정(산출물=결정, 코드 아님) | 트레이드오프 축·성공 지표·타임박스·증거 출처. **S2 리서치 선행 필요** |
| spec-driven | 기존 PRD·RFC·이슈·티켓·명세 참조 | 명세에서 선채움(prefill) 먼저, 명세가 못 푸는 공백만 질문 |
| test-infra | 테스트 설정 변경(CI·러너·커버리지 게이트·플레이키 정책) | 커버리지 목표·CI 통합·플레이크 정책 축 |
| architecture | 시스템 간 설계 결정(경계·인터페이스·계약·마이그레이션) | 모듈 경계·와이어 계약·마이그레이션·롤백·소비자 영향 축 |
| collaboration | 다중 소유자·공유 표면·레인 분할 | 소유권 분할·충돌 해결·핸드오프·소통 주기 축 |

두 패밀리에 걸치면 **더 인터뷰가 많은 쪽**을 택하고 질문 축을 합집합한다. 가벼운 쪽으로 무음 강등 금지.

**과분류 방지 가드 (anti-over-classification)** — 패밀리 선택 전 적용:
- **10단어 미만 + 명시적 신규 키워드 없음**(`새 기능`·`처음부터`·`from scratch`·`greenfield`·`신규 프로젝트`): 직전 맥락으로 범위가 명확하면 `simple`, 아니면 분류 전 탐색(explore) 먼저. 짧고 모호한 입력을 build-from-scratch로 점프 금지
- **모호 동사만 사용**(`개선`·`디벨롭`·`디베롭`·`정리`·`보완`·`improve`·`fix it`·`clean up`)하고 구체 산출물·파일·명령·제약을 명명하지 않음: `simple`(1~2개 좁은 질문)로 분류하거나 탐색 먼저. "디벨롭"·"개선" 단어 하나로 5축 build-from-scratch 슬레이트로 가지 않는다
- **build-from-scratch는 명시 신호 필요**: 신규 모듈·서비스 명명 또는 "from scratch"·"신규" 없이는 분류 금지
- **architecture는 다중 시스템 범위 필요**: 기존 모듈·서비스 2개 이상 명명 또는 "시스템 간"·"마이그레이션 경로" 명시 또는 결정 문서(RFC/ADR)일 때만
- **research는 결정 산출물 필요**: "어떻게 동작하나?"는 `simple`, "X와 Y 중 무엇?"이 `research`

모호한 짧은 입력의 기본값은 `simple`(1~2개 날카로운 질문) 또는 탐색 선행. 절대 기본값으로 5축 build-from-scratch 슬레이트로 가지 않는다.

#### S1-b 모호성 채점 (5차원 — 임계 0.3)

답변 후 명확성을 차원별로 0.0~1.0 채점한다. 모호성 점수가 **임계 0.3 이하**가 될 때까지 진행하지 않는다(본 하네스용 임계 — deep-interview 기본값을 본 루프에 맞춰 명기).

차원과 가중치 (greenfield 기준):

| 차원 | 질문 스타일 | 가중치 |
|------|------------|--------|
| 목표 명확성(goal) | "정확히 무슨 일이 일어나는가?" | 0.40 |
| 제약 명확성(constraints) | "경계는 무엇인가?" | 0.30 |
| 성공 기준(criteria) | "어떻게 작동을 아는가? 테스트를 쓸 수 있는가?" | 0.30 |
| (brownfield) 맥락 명확성(context) | "기존 시스템에 어떻게 맞물리는가?" | — |

**모호성 공식**:
- Greenfield: `ambiguity = 1 − (goal×0.40 + constraints×0.30 + criteria×0.30)`
- Brownfield: `ambiguity = 1 − (goal×0.35 + constraints×0.25 + criteria×0.25 + context×0.15)`

`ambiguity ≤ 0.3`이면 통과(질문 상한 2~3 유지 — 임계 미달이어도 인텐트 예산을 초과하지 않는다). 초과면 가장 약한 차원을 표적해 추가 질문 1개. 기록: `s1.ambiguity = {score, dimensions:{goal,constraints,criteria[,context]}, threshold:0.3, passed}`

### S2 시장조사 (phase=research) — 조건부
- **진입 조건**: 답에 외부 사실(시장·가격·경쟁·법령·통계)이 필요할 때만. 순수 코드·내부 리팩토링·창작은 스킵하고 `s2: {skipped_reason}` 기록
- **라우팅 (CLAUDE.md 5절 정합)**:
  1. 시장 구조 전반 → `market-intelligence` (03_business, 필요한 MIP 단계만 발췌)
  2. 다출처 교차검증 보고 → `/deep-research` (플러그인)
  3. 차단 가능 소스(소셜·커머스·포털) fetch → `/insane-search` (플러그인, 시장분석 fetch 의무 — 출처: `fivetaku/insane-search`, MIT 라이선스)
  4. 광범위 병렬 조사 → `research-analyst`(agents/02_research) 팬아웃 또는 Workflow
- **플러그인 부재 시**: WebSearch로 강등 + 결과에 `[PARTIAL]` 명시 + `s2.degraded=true` (무음 강등 금지)
- SVOP: 모든 사실에 출처 마커, 실패는 5모드 보고. 기록: `s2: {route, sources[], notes_path}`

### S3 계획 작성 (phase=plan)
- **EnterPlanMode 강제 진입** 후 계획 작성. 메인 세션이 최고 모델이 아니면 `loop-planner` 서브에이전트(model: fable, effort: max)에 초안 위임
- `agents/01_dev-workflow/plan-architect.md` 원칙 차용 (현실적 추정·생략 근거)
- **자원 활용 계획 (의무 — v1.1)**: 계획 작성 전 보유 자원 4계층을 전수 검토하고, 계획서에 **"단계 × 사용 자원 × 사유" 표**를 반드시 포함한다:
  1. `skills/INDEX.md` 6개 카테고리 (124종) — 카테고리 단위 전수 스캔, 후보 skill을 단계별 매핑
  2. `agents/INDEX.md` 14종 — plan-architect·plan-reviewer·execution-worker·research-analyst·history-curator 등 단계 매핑
  3. 플러그인 스킬 — /deep-research·/insane-search (세션 가용 여부 명시)
  4. 내장 오케스트레이션 — Workflow(대규모 팬아웃)·Agent(서브에이전트)·서브에이전트 격리
  채택 0건인 카테고리는 "해당 없음 — <사유 1줄>"로 전수 검토를 증명(나열 생략 가능, 누락 금지). **이 표가 없는 계획은 S4(승인) 진입 불가.** 기록: `s3.resource_plan`
- **AC 체크리스트를 계획서에 고정** — `AC-1..n`, 항목별 검증 방법(명령·경로·기대 출력) 병기. 승인 후 변경 금지(이동 골대 차단)
- **외부 영향 사전 위임 목록 (v1.4)**: 계획상 예상되는 외부 영향 작업(push·발송·결제 등)을 `pre_approved_external` 후보 목록으로 계획서에 명시 — 게이트 1에서 계획과 **한 번에** 승인받아 야간 정지를 설계로 제거. 예상 못 한 외부 영향은 S5 지연 큐가 받는다
- 기록: `s3: {plan_path, ac_count, resource_plan}` + `completion_criteria`에 AC 복사

### S4 계획 검토·승인 (phase=plan → awaiting_plan_approval)
- **(1) plan-reviewer 자가검토**: `agents/01_dev-workflow/plan-reviewer.md` 5관점 자가검토를 계획에 append
- **(2) loop-critic 독립 비평** (v1.2 추가): 자가검토 직후 `loop-critic` 서브에이전트(`.claude/agents/loop-critic.md`, model: fable)에 계획을 넘겨 독립 비평을 받는다. critic 규약은 `agents/01_dev-workflow/critic.md`(OKAY/REJECT 이분 + 4축). **REJECT면 top 3~5 개선안을 받아 계획을 차분 수정 후 재비평 — 최대 2회**. 2회 후에도 REJECT면 phase=awaiting_user로 전이해 사용자 판단을 받는다(무한 비평 루프 방지). critic은 plan-reviewer 결과를 추인하지 않고 독립 채점한다. Critical 과제면 critic이 deliberate 모드로 pre-mortem과 확장 테스트 계획을 요구한다. 기록: `s4: {critic_verdict, critic_rounds}`
- **(3) codex 계획 교차검토 (v1.3)**: critic 통과(OKAY) 후 `codex_review=true`면 최종 계획 전문을 1회 교차검토 — `codex exec --sandbox read-only --ephemeral -m gpt-5.5 "<계획 전문> 비판적 검토: 결함·공백·과소추정·리스크만 (스타일 평가 금지)"` → 결과를 계획서 "교차검토(GPT-5.5)" 절에 append. **인간이 게이트 1에서 Claude 자가검토·critic 비평·GPT 교차검토를 함께 본다.** 실패 시 fail-open — (1)(2)만으로 진행 + `s4.codex=TOOL_FAILED`
- phase=awaiting_plan_approval 기록 → **ExitPlanMode = 인간 승인 게이트 1** (훅 면제 — 자연 정지). **승인 대상에 외부 영향 위임 목록 포함** (v1.4)
- 승인 시 phase=execute + 승인된 위임 목록을 `state.pre_approved_external`에 기록, 거부·수정 지시 시 phase=plan 회귀. 기록: `s4: {approved_at, critic_verdict, critic_rounds, codex, approved_external[]}`

### S5 실행 (phase=execute)
- **`loop-executor` 서브에이전트(model: opus, effort: xhigh) 호출** — 산출물 경로와 `MODEL_USED`를 받아 `s5: {attempt_n, model_used, artifacts[]}`에 자기 증명 기록. 대규모 병렬 작업이면 Workflow 팬아웃(에이전트 model: opus)
- 파일 변경은 worktree 격리 규칙 준수(백그라운드 세션)
- **게이트 2 (v1.4 — 3단 처리)**: 외부 영향 작업(push·발송·결제·외부 API 쓰기)을 만나면 —
  1. **위임됨**: `pre_approved_external[]`에 있으면 즉시 실행 + `logs/operations.log` 1줄(위임 실행 자기 증명)
  2. **미위임 + 비선행**: 실행하지 않고 `pending_external_actions` 큐에 적재 → **루프 속행**(해당 작업 의존 AC는 S6에서 UNVERIFIABLE) → S8 후 최종 보고에 큐 일괄 제시
  3. **미위임 + 후속 AC의 선행 조건**: 즉시 phase=awaiting_user 정지(종전과 동일)
  **자동 실행 절대 금지 원칙 불변**(CLAUDE.md 14절 우선순위 1) — v1.4가 바꾼 것은 정지 범위(전체→해당 작업만)와 강제 계층(규율→훅)
- **게이트 2 훅 강제 (v1.4)**: PreToolUse 훅 `external-impact-guard.js`가 루프 활성 중 차단 패턴(git push·gh pr 쓰기·npm publish·메일 발송)을 **도구 레벨에서 deny** — executor 자진 신고에 의존하지 않음(서브에이전트 호출 포함). 차단 시 stderr 지시(큐 적재·속행)가 모델에 전달. awaiting_user에서 사용자가 승인하면 해당 명령을 `pre_approved_external`에 추가 후 재시도(훅 통과). 훅 부재·손상 시 fail-open — executor 규율 2가 후방 방어

### S6 검수 (phase=review)
- 독립 검수 병렬 (v1.3 — Claude 2종 + codex 이종 1종): `loop-reviewer-spec`(AC 명세 대조, Claude) + `loop-reviewer-verify`(기능 실증, Claude) + **codex 이종 검수(GPT-5.5, 자문)** — 전원 **산출 컨텍스트 미공유, AC+산출물 경로만 전달** (스타일 편향 통제: 기준명세 우선)
- **검수 tier 라우팅 (v1.2 추가)**: Claude 검수 강도를 산출물 성격에 따라 차등한다. 단, **차등은 비Critical 소형 산출물에만 적용** —
  - tier-light: 비Critical + 소형 산출물(1~2 파일·되돌리기 쉬움) → spec 1기 + verify 1기(2종 병렬 유지)
  - tier-full: 그 외 모든 경우 → spec + verify (+ 필요 시 무결성 전담 1기 추가)
  - codex 이종 검수는 tier와 무관하게 `codex_review=true`면 병설 (v1.3 — 자문이라 차단 비용 없음)
- **codex 이종 검수 호출 (v1.3, 자문 모드 파일럿)**: `codex_review=true`면 Claude 검수의 Agent 병렬과 동시에 Bash 백그라운드로:
  ```bash
  codex exec --sandbox read-only --ephemeral -C <작업디렉토리> -m gpt-5.5 \
    --output-schema skills/07_orchestration/full-loop/codex-verdict.schema.json \
    -o <세션tmp>/codex-verdict.json "<codex-reviewer-prompt.md 템플릿에 AC·경로 치환>"
  ```
  - 프롬프트 정본: `codex-reviewer-prompt.md` (loop-reviewer-spec과 동일 편향 통제 규율 주입)
  - verdict JSON은 파일로만 회수(메인 컨텍스트에 원문 적재 금지 — 컨텍스트 규약 1 정합), 요약만 s6에 기록
  - **실패 시 fail-open**: Claude 검수만으로 속행 + `s6.codex=TOOL_FAILED` 정직 기록 (외부 도구 장애가 루프를 차단하지 못함)
- **판정 (v1.3 자문 모드)**: 항목별 PASS/FAIL, PARTIAL=FAIL. **합격 차단권은 Claude 검수자 — 전 에이전트 전 항목 PASS만 합격**. codex FAIL은 차단하지 않되 S7 차분 피드백에 합산. **예외**: codex가 blocker(중대 버그·보안·데이터 손실)를 재현 증거로 입증하면 합격 차단. 판정 불일치 시 FAIL 측 증거 우선
- **일치율 계측 (동등 투표권 승격 결재의 데이터)**: codex vs Claude 판정 일치/불일치를 `logs/meta-feedback.log`에 `[작동 관찰]` 1줄 기록 — AC 단위 일치율·codex 단독 발견 건수
- **지연 큐 연계 (v1.4)**: `pending_external_actions`에 적재된 작업에 의존하는 AC는 UNVERIFIABLE로 채점(loop-reviewer-verify 규율 4 정합 — 외부 영향 명령은 검증 목적이라도 실행 금지). UNVERIFIABLE은 FAIL 집계가 아니라 최종 보고의 큐 결정란에 연결
- **Critical N=3 불변**: `critical_path=true`면 tier 라우팅과 무관하게 **검수자 3명(Best-of-N N=3) 불변** — rules/critical-path.md의 Best-of-N(N=3) 의무를 절대 축소하지 않는다. tier-light로 강등 금지. **v1.3: 구성은 Claude×2 + codex×1 이종으로 충족** (codex TOOL_FAILED 시 Claude 3종 폴백). 분산(3 모두 다름) 시 답변 보류 + phase=awaiting_user + decisions/pending.md 등록(CLAUDE.md 7절)
- 기록: `s6: {tier, verdicts[], fail_acs[], bon, codex: {verdict_path, agreement, blocker_found}}` → 합격 시 phase=deposit

### S7 재실행 (phase=review → execute)
- 조건: FAIL 존재 ∧ iteration < max_iterations(3)
- iteration++ 후 S5 재호출 — FAIL 항목별 `{AC-ID, 검수자(claude-spec|claude-verify|codex), 증거, 기대 vs 실제, 수정지시 1줄}` **차분 피드백만** 주입(전체 재작업 금지). codex 자문 FAIL도 동일 포맷으로 합산(v1.3) — executor가 검수자 간 불일치를 인지 가능
- **게이트 3**: 한도 소진 시 → 미해결 AC 목록 + 시도별 실패 원인 + 5모드 분포 + "부분 수용 / 중단 / 직접 지시" 3택을 보고하고 phase=awaiting_user. **성공 위장 절대 금지**

### S8 지식 적재 (phase=deposit) — 강제
합격 또는 한도 보고 후 **반드시 수행** — 훅이 `knowledge_deposited=true` 전까지 done 전이를 차단한다. 적재 분류·적재처 매핑·[UNCERTAIN] 규칙은 **`skills/05_knowledge-and-memory/remember/SKILL.md`(remember 스킬)의 워크플로를 따른다** (v1.2 추가 — 4분류·적재처 매핑·미검증 사실 저장 금지의 SSOT):
1. **리서치 산출물**: 프로젝트 과제 → 해당 레포 `docs/_shared/knowledge/`(또는 그 레포 관행 경로) / 하네스 과제 → `_reference/YYYY-MM-DD-*.md`. **P6 경계**: 운영 수치·고객 정보·실명은 하네스 반입 금지(토큰화)
2. **교훈**: auto-memory(`~/.claude/projects/<프로젝트>/memory/`)에 저장 + MEMORY.md 인덱스 갱신. remember 스킬의 [UNCERTAIN] 규칙 적용 — 미검증 사실은 사실로 저장하지 않고 `[UNCERTAIN]` 마커 또는 5종 출처 검증 후 저장(SVOP 정합)
3. **이벤트**: `logs/operations.log` 1줄 `[ISO] full-loop: <익명화 요약> — 시도 N, AC x/y, 산출물 <경로> [B]` + `logs/meta-feedback.log` `[작동 관찰]` 1줄
4. memory/ 3-tier에는 직접 쓰지 않음 — 승격 후보 발견 시 `decisions/pending.md` 등록만 (auto-memory 정본 원칙). remember 매핑표의 "결재 등록만" 규칙과 정합
- 적재 후 grep으로 로그 라인 재확인 → `knowledge_deposited=true, deposited_refs[]` 기록
- **큐 정산 (v1.4)**: `pending_external_actions`가 비어 있으면 phase=done → **state 파일 삭제** → 최종 보고. 큐 잔존 시 phase=awaiting_user로 종료 — 최종 보고에 큐 목록+각 작업의 의존 AC(UNVERIFIABLE분)를 일괄 제시, 사용자 결정(실행 승인/포기) 후 done·state 삭제

## 컨텍스트 관리 규약 (rules/context-management.md 연동 — v1.1)

루프는 컨텍스트 관리 규칙(CLAUDE.md 15절·rules/context-management.md)을 다음 메커니즘으로 자동 이행한다:

1. **1차 사전 예방 — 서브에이전트 격리 의무**: S2(리서치)·S5(실행)·S6(검수)의 노이즈 큰 작업은 반드시 서브에이전트/Workflow로 격리하고 메인 루프에는 **요약 1~2K 토큰만 회수**. 원문 대량 인용을 메인 컨텍스트에 적재 금지
2. **식별자 flush = 상태 파일**: 단계 전이 시마다 state 파일에 산출 경로·AC·다음 지시를 기록하는 본 스킬의 규약이 곧 15절 "압축 전 식별자 flush"의 구현 — 컴팩션·세션 재시작 후에도 state만으로 재개 가능
3. **신호등 연동 (드라이버 자동 병기)**: 드라이버 훅이 `logs/.ctx-state`(context-usage-monitor가 유지)를 읽어 재점화 지시에 신호를 병기한다 — Yellow: "노이즈 작업 서브에이전트 격리 강화" / Red: "단계 산출 전부 flush 후 /compact 또는 새 세션에서 '루프 재개' 권장". **Red여도 강제 중단하지 않음** — 압축·세션분할은 권고(15절, SVOP 정합: 부정확 수치로 비가역 조치 강제 금지)
4. **Red에서의 모델 행동**: 신호가 Red면 현 단계 산출을 state·파일로 즉시 flush하고, 다음 단계가 무겁다면(전권 작업 등) awaiting_user 대신 **사용자에게 1줄 권고 후 턴을 자연 종료** — 드라이버가 다음 턴(컴팩션 후 포함)에 재점화한다

## Failure modes

| 상황 | 동작 |
|------|------|
| 같은 phase에서 2회 차단 | 훅이 stalled 전환 — 수동 개입 보고 (무한루프 방지) |
| 누적 차단 12회 / iteration 3 도달 | stalled — 5모드 정직 보고 |
| state 파일 손상 | 훅 무반응(fail-open) — 스킬이 재생성 또는 사용자 보고 |
| 세션 재시작·컴팩션 | 사용자 "루프 재개" 발화 → state 읽고 session_id 갱신 후 해당 phase부터 속행 |
| 플러그인 스킬 부재 | WebSearch 강등 + [PARTIAL] 명시 |
| codex 검수 호출 실패 (타임아웃·인증·CLI 크래시) | fail-open — Claude 검수만으로 속행 + `s6.codex=TOOL_FAILED` 기록. 자문 모드라 합격 판정 불변, Critical N=3은 Claude 3종 폴백 |
| codex 미설치·PATH 부재 | S1에서 `which codex` 실패 시 `codex_review=false` + 첫 보고 1줄 고지 (P4 — 환경 무관 루프 자체는 동일 작동) |
| 게이트 2 훅 차단 발동 | stderr 지시대로 큐 적재 후 속행(비선행) 또는 awaiting_user(선행 조건). **차단 우회 시도 금지** — 위임은 사용자 발화·게이트 1 경유만 |
| 게이트 2 훅 부재·손상 | fail-open(훅 무반응) — executor 규율 2(자진 신고)가 후방 방어. 부재 감지 시 첫 보고 1줄 고지 |
| 수동 탈출 | "루프 중지" → aborted 기록 + state 삭제. 폴백: `rm .claude/full-loop-state.local.json` |

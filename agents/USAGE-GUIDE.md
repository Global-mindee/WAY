# agents/USAGE-GUIDE.md — AI 강제 사용 지침서

> **목적**: AI가 사용자 발화 → 적합 agent 1개 자동 선택·호출하는 결정 트리·프로토콜
> **버전**: v1.1 (2026-06-11)
> **강제 로드**: `CLAUDE.md 0.` 작업 시작 절차에 자동 로드 명시 (의무)
> **참조**: `agents/INDEX.md` (활성 14 agent 압축 메타 + 네이티브 등록 loop-* 5종)

---

## 1. 강제 로드 선언

`skills/USAGE-GUIDE.md 1.` 과 동일 메커니즘. CLAUDE.md 0. 절차에 다음이 추가되어 있어야 함:

```
5. agents/USAGE-GUIDE.md + agents/INDEX.md (agent 선택 결정 트리)
```

---

## 2. 결정 트리 (5단계) — skills와 동일 패턴

### Step 1. 사용자 발화 수신
의도 1~3문장 내부 CoT.

### Step 2. agents/INDEX.md 의미론적 평가
4개 카테고리 절(활성 14 agent) 전수 후보 → description·trigger 의미론적 비교.

### Step 3. 후보 분기

| 후보 수 | 처리 |
|--------|------|
| **0개** | "관련 agent 없음" 명시 → skills 매칭 재시도 → 둘 다 0이면 일반 응답 |
| **1개** | 자동 채택 + 이유 1줄 알림 + 호출 |
| **2개 이상** | 점수 최고 1개 자동 채택 + 이유 1줄 알림 + 호출 |

### Step 4. Critical Path 보강
`rules/critical-path.md` 4기준 해당 시 사용자 1줄 확인 + `logs/operations.log` 기록.

### Step 5. agent 호출 + 본 작업 진행
3. 호출 형식 참조.

---

## 3. agent 호출 형식 — 인라인 주입 패턴

Claude Code의 `Agent` 도구는 글로벌에 등록된 `subagent_type` 만 호출 가능 (예: `general-purpose`, `Explore`, `Plan`).

본 하네스 agents/는 **로컬 정의**이므로 그대로 `subagent_type` 으로 사용 불가. 대신 다음 패턴으로 인라인 주입:

```
Agent({
  subagent_type: "general-purpose",
  description: "<agent name 기반 짧은 설명>",
  prompt: "
    <agent-definition file=\"agents/01_dev-workflow/developer.md\">
    {agent 본문 전체 인라인}
    </agent-definition>

    위 agent-definition을 따라 다음 작업을 수행:
    {사용자의 원 요청}
  "
})
```

이 방식은 본 plan(`virtual-hopping-catmull`) Phase 3 결재에서 채택. 향후 settings.json 정식 등록이 필요해지면 별도 결재 등록.

---

## 3-1. 도구 제약 frontmatter 표준 (C2 — 외부 하네스 클론 AgentDefinition 차용)

agent를 정의할 때 권한·라우팅 경계를 frontmatter(또는 본문 표)에 **5속성 표준**으로 명시한다. 검수자·실행자가 추측 없이 권한 경계를 알 수 있게 하기 위함이며, 특히 읽기 전용 비평 에이전트(`critic`)나 외부 영향 차단이 필요한 단계에서 의무다. 외부 하네스 클론의 `AgentDefinition` 속성 체계를 본 하네스 관행으로 번역해 채용.

| 속성 | 의미 | 값 예시 |
|------|------|---------|
| **tools** | 허용 도구 화이트리스트 | `Read, Grep, Glob, Bash`(읽기 전용) — 쓰기·편집·커밋·push 금지 시 명시 |
| **bashAllowedPrefixes** | 허용 bash 명령 prefix(쓰기 차단의 핵심) | `ls`, `cat`, `head`, `git log`, `git diff`, `grep`, `node --check` |
| **thinking-level** | 사고 깊이(난이도 대비 비용) | `low` / `medium` / `high` |
| **model-class** | 모델 등급(품질 게이트) | `frontier`(최고) / `standard` / `fast` |
| **routing-role** | 파이프라인 내 역할·에스컬레이션 규칙 | `specialist`(전담, 범위 밖은 상위 위임) / `orchestrator` / `worker` |

적용 규칙:
- **읽기 전용 에이전트**는 `tools`에서 Write/Edit/NotebookEdit을 제외하고 `bashAllowedPrefixes`를 읽기 명령으로 한정한다. `critic`(`agents/01_dev-workflow/critic.md`)이 이 표준의 준수 예시다 — tools: Read/Grep/Glob/Bash(읽기 prefix만), 쓰기·편집·커밋·push 금지.
- **외부 영향(push·발송·결제) 도구**는 어떤 agent에도 자동 허용하지 않는다(CLAUDE.md 14절 우선순위 1 — 명시 게이트 대기).
- 네이티브 등록 에이전트(`.claude/agents/` loop-*)는 model·effort를 frontmatter로 강제하고 권한 본체는 `agents/01_dev-workflow/`의 규약을 Read로 상속한다(이중 정본 방지).

---

## 4. 이유 알림 1줄 형식

```
[Agent: <name> 선택] — 사유: <T의 의도 요약> · <매칭 근거>
```

예시:
```
[Agent: research-analyst 선택] — 사유: "신규 시장 조사" → 공공·민간 리서치 description 정합
[Agent: ui-designer 선택, 차순위: ux-designer] — 사유: "shadcn 컴포넌트 색상 토큰" → ui-designer 명시 일치
```

---

## 5. 사용자 명시 지정 — 결정 트리 우회

| 발화 패턴 | 처리 |
|----------|------|
| "developer 에이전트로" | 명시 호출, 트리 skip |
| "/sec-start" | security-coordinator 명시 호출 |
| "다른 agent로" | 차순위 후보 채택 |
| "agent 쓰지마" | agent 미호출, 일반 응답 |

---

## 6. agent 연쇄 호출 (체인)

특정 작업은 agent를 체인으로 호출. 예:

### 보안 검토 5단계 체인
```
사용자 "보안 검토 해줘" 또는 "/sec-start"
  ↓
1. security-coordinator (총괄, 03_ops-automation)
   ↓ 자동 호출
2. project-profiler (Stage 0, 02_research)  → project-profile.md 생성
   ↓
3. plan-architect (Stage 1, 01_dev-workflow) → 보안 검토 계획서 작성
   ↓
4. plan-reviewer (Stage 2, 01_dev-workflow) → 5관점 자가 검토 + 사용자 승인
   ↓
5. execution-worker (Stage 3, 01_dev-workflow) → 단계별 실행 + 산출물 생성
   ↓
6. history-curator (Stage 4, 02_research) → timeline.md 갱신
```

### 서비스 기획·구현 체인
```
사용자 "새 서비스 만들자" / "PRD 짜줘" / "구현해줘"
  ↓
1. research-analyst (시장 조사)
   ↓
2. idea-generator (아이디어 발산·수렴)
   ↓
3. service-planner (PRD)
   ↓
4. ux-designer (와이어프레임)
   ↓
5. ui-designer (시각 토큰·컴포넌트)
   ↓
6. developer (실제 구현·배포)
   ↓
7. document-writer (산출 보고서)
```

체인 자동 진행 시 AI는 각 단계 종료마다 사용자에게 1줄 알림 + 다음 단계 호출 전 확인 옵션 제공. Critical Path 작업이면 단계마다 명시 승인 의무.

---

## 7. 예외 처리

skills/USAGE-GUIDE 5. 와 동일 정책. 차이점:
- agent 호출 실패 → skills 매칭 재시도 (대체)
- 후보 0개 + 사용자가 "agent로 해줘" 명시 → "사용 가능한 agent 없음 — skills 또는 일반 응답으로 진행" 명시

---

## 8. logs 기록 정책

`logs/operations.log` 에 기록할 agent 이벤트 3종:

```
[ISO-8601 timestamp] agent-select: <name>, category=<카테고리>, 사유="<1줄 요약>"
[ISO-8601 timestamp] agent-chain: <chain-name>, steps=<n>, completed=<m>
[ISO-8601 timestamp] agent-fail: <name>, 에러="<요약>"
```

---

## 9. 예시 시나리오

### A. 단일 명확 매칭
- 입력: "이 프로젝트 PRD 작성해줘"
- 매칭: `service-planner` 점수 최고
- 출력 첫 줄: `[Agent: service-planner 선택] — 사유: "PRD" → trigger 명시 일치`

### B. 체인 자동 진입
- 입력: "project-alpha 보안 검토 시작"
- 매칭: `security-coordinator` 점수 최고
- 체인 자동 진입 (5단계) — 각 단계 1줄 알림 + Critical Path 보강

### C. 매칭 없음
- 입력: "오늘 점심 추천"
- 매칭: 0건
- 출력: `[Agent: 매칭 없음] — skills 매칭 재시도 또는 일반 응답`

---

## 10. 우선순위 충돌 (CLAUDE.md 14. 정합)

skills/USAGE-GUIDE 9. 와 동일. 사용자 명시 override가 결정 트리보다 우선.

추가 규칙:
- agent + skill 동시 매칭 가능 시 **agent 우선** (agent가 보통 더 큰 워크플로우 단위)
- 사용자가 "skill로 해줘" / "agent로 해줘" 명시 시 그쪽 우선

---

## 11. 갱신 로그

- **2026-05-27**: 초기 작성 (v1.0) — skills/USAGE-GUIDE와 동일 패턴 + agent 인라인 주입 + 체인 호출 규약 추가
- **2026-06-11**: 도구 제약 frontmatter 표준 절(제3-1) 신설 (v1.1) — 외부 하네스 클론 AgentDefinition 5속성(tools·bashAllowedPrefixes·thinking-level·model-class·routing-role) 차용. `critic` 에이전트 편입 반영해 활성 agent 13→14 동기화. 거버넌스 결정(외부 하네스 채택 백로그)에 따른 집행

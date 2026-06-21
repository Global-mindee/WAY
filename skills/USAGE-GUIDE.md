# skills/USAGE-GUIDE.md — AI 강제 사용 지침서

> **목적**: AI가 사용자 발화 → 적합 skill 1개 자동 선택·호출하는 결정 트리·프로토콜
> **버전**: v1.1 (2026-06-11)
> **강제 로드**: `CLAUDE.md 0.` 작업 시작 절차에 자동 로드 명시 (의무)
> **참조**: `skills/INDEX.md` (활성 124 skill, 6개 카테고리 압축 메타)
> **A1 키워드 훅과의 역할 구분**: `.claude/hooks/scripts/skill-keyword-injector.js`(UserPromptSubmit 훅)는 INDEX trigger 매칭으로 "추천 skill" 1줄을 띄우는 **추천 신호**일 뿐이고, **최종 채택 결정은 본 결정 트리**가 내린다(훅 신호는 참고, 트리가 확정).

---

## 1. 강제 로드 선언

본 파일은 **모든 AI 작업 시작 시점에 강제 로드**됩니다. CLAUDE.md 0. 작업 시작 절차에 다음이 추가되어 있어야 합니다:

```
4. skills/USAGE-GUIDE.md + skills/INDEX.md (skill 선택 결정 트리)
```

본 지침서 위반 시:
- skill 사용 가능 작업인데 skill 미호출 → `logs/operations.log`에 `[작동 관찰] skill-skip` 1줄 기록
- 임계치(skill-skip > 20%/월) 초과 시 `decisions/pending.md` 자동 결재 등록

---

## 2. 결정 트리 (5단계)

### Step 1. 사용자 발화 수신

사용자 입력 텍스트 T를 AI가 1~3문장으로 의도 파악(내부 CoT). 단 본 단계의 내부 추론은 출력에 노출하지 않음.

### Step 2. INDEX.md 의미론적 평가

`skills/INDEX.md` 의 6개 카테고리 절을 전수 후보로 두고 각 행의 `description`·`trigger keywords`와 T의 의도를 의미론적으로 비교 (LLM 내부 점수).

평가 우선순위:
1. **명시적 trigger 키워드 정확 일치** — 사용자가 "qa", "tdd", "copy", "design-review" 등 INDEX의 trigger를 직접 발화
2. **description 의미 일치** — trigger 직접 일치는 없으나 description 의미와 T가 강하게 정합
3. **카테고리 일치** — 위 둘 다 약하면 카테고리 수준 매칭

### Step 3. 후보 분기

| 후보 수 | 처리 |
|--------|------|
| **0개** | "관련 skill 없음 — 일반 응답으로 진행" 명시 후 skill 미호출 |
| **1개** | 자동 채택 + 이유 1줄 알림 + 호출 |
| **2개 이상 (N개)** | **점수 최고 1개 자동 채택** + 이유 1줄 알림 + 차순위 후보 alert (선택적) + 호출 |

### Step 4. Critical Path 보강

본 작업이 `rules/critical-path.md` 4기준 중 하나라도 해당하면 추가:
- 채택된 skill을 사용자에게 1줄 알림 (취소 가능)
- `logs/operations.log`에 `[2026-05-27T...] skill-select: <name>, 사유=<요약>` 기록
- Best-of-N (N=3) 시 같은 skill로 3회 호출 (idempotent 보장 시) 또는 "관점 3종 사전 검증" 방식 적용

### Step 5. skill 호출 + 본 작업 진행

채택된 skill을 호출(Claude Code `Skill` 도구 사용)한 결과를 본 응답 구성에 반영. skill 호출 실패 시 `rules/unknown-modes.md` TOOL_FAILED 매핑.

---

## 3. 이유 알림 1줄 형식

채택 시 본 응답 첫 줄(또는 인사 직후)에 다음 형식으로 알림:

```
[Skill: <name> 선택] — 사유: <T의 의도 요약> · <매칭 근거>
```

예시:
```
[Skill: tdd-mastery 선택] — 사유: "테스트 짜줘" 발화 → INDEX trigger "test, tdd, red-green" 명시 일치
[Skill: copywriting 선택] — 사유: "마케팅 카피 새로 써줘" → 03_business/copywriting description 정합
[Skill: cso 선택, 차순위: security-hardening] — 사유: "보안 감사" → cso(점수 최고), security-hardening(점수 차순위)
```

---

## 4. 사용자 명시 지정 — 결정 트리 우회

사용자가 직접 skill 이름을 명시한 경우 결정 트리를 우회하고 직접 호출:

| 발화 패턴 | 처리 |
|----------|------|
| "tdd-mastery로 해줘" | 결정 트리 skip, 명시 skill 호출 |
| "/qa 돌려줘" (slash command) | 동일 |
| "다른 skill로 해줘" | 차순위 후보 1개 채택 후 호출 |
| "skill 쓰지마" | skill 미호출, 일반 응답 |

이 우회는 CLAUDE.md 14. 우선순위 3번(사용자 명시 override)에 정합.

---

## 5. 예외 처리 (5종)

### 5-1. INDEX.md 부재
TOOL_FAILED 보고 + 본 USAGE-GUIDE 적용 중단 (skill 미호출).

### 5-2. skill 호출 실패
`rules/unknown-modes.md` TOOL_FAILED 5모드 적용 + 일반 응답 fallback + `logs/operations.log`에 `skill-fail` 기록.

### 5-3. skill 다중 매칭 점수 차이 < 5%
1개 자동 채택 + 차순위 후보를 `[DISAGREE]` 마커로 알림. 점수 차이가 미세하므로 사용자가 1줄 재지정 가능.

### 5-4. 후보 0개 + Critical Path
`rules/critical-path.md` 4기준 해당 + skill 매칭 0건 → "관련 skill 없음 — Critical 작업이므로 사용자 확인 권고" 명시.

### 5-5. 같은 카테고리 내 N>3 매칭
점수 top-3만 표시 + 1개 자동 채택. 나머지 후보는 logs에만 기록.

---

## 6. logs 기록 정책

`logs/operations.log` 에 기록할 skill 이벤트 3종:

```
[ISO-8601 timestamp] skill-select: <name>, category=<카테고리>, 사유="<1줄 요약>"
[ISO-8601 timestamp] skill-skip: 발화="<요약>", 사유="관련 skill 없음" (UNKNOWN 시)
[ISO-8601 timestamp] skill-fail: <name>, 에러="<에러 요약>" (TOOL_FAILED 시)
```

본 로그는 Blueprint (4) 영역 D 메타 피드백의 입력. 임계치(skill-skip > 20%/월) 초과 시 자동 결재 등록.

---

## 7. 카테고리 우선순위 (충돌 시)

같은 점수의 매칭 후보가 여러 카테고리에 분산될 때 다음 우선순위 적용 (휴리스틱):

1. **사용자 발화의 도메인이 명확**: 그 도메인 카테고리 우선
   - "마케팅" → 03_business
   - "인프라/DB/k8s" → 04_infra-platform
   - "테스트/품질" → 01_dx-and-quality
   - "gstack/배포" → 02_gstack-ops
   - "자기 정의" → 05_knowledge-and-memory
   - "다단계 자동 진행/풀 루프/끝까지 알아서/야간 자동" → 07_orchestration (단, 단순 질의·1~2파일 수정은 full-loop 부적합 — SKILL.md When NOT to use)
2. **도메인 불명확**: description 의미 정합도 점수만 사용
3. **여전히 동점**: 알파벳순 첫 번째 채택

---

## 8. 예시 시나리오

### 시나리오 A — 단일 명확 매칭
- 입력: "이 함수에 단위 테스트 짜줘"
- Step 2 평가: `tdd-mastery` 점수 최고
- Step 3: 1개 → 자동 채택
- 출력 첫 줄: `[Skill: tdd-mastery 선택] — 사유: "단위 테스트" → trigger 명시 일치`
- 호출 후 본 작업

### 시나리오 B — 다중 매칭
- 입력: "이 인프라 보안 감사해줘"
- Step 2 평가: `cso`(02_gstack-ops, 점수 0.85) · `security-hardening`(04_infra-platform, 점수 0.80)
- Step 3: N=2 → 최고 점수 `cso` 채택
- 출력 첫 줄: `[Skill: cso 선택, 차순위: security-hardening] — 사유: "보안 감사" → cso description 정합 최고`
- 호출 후 본 작업

### 시나리오 C — 매칭 없음
- 입력: "오늘 점심 뭐 먹을까?"
- Step 2 평가: 점수 임계치 미달 (전 카테고리 무 매칭)
- Step 3: 0개 → 일반 응답
- 출력 첫 줄: `[Skill: 매칭 없음] — 일반 응답으로 진행`
- 일반 응답

### 시나리오 D — Critical Path
- 입력: "이 PR을 main에 머지해줘"
- Critical 4기준 #1 (외부 영향) 해당
- Step 2 평가: `gstack-land-and-deploy` 점수 최고
- Step 4 발동: 사용자에게 1줄 확인 요청 + logs 기록
- 사용자 승인 후 호출

---

## 9. 우선순위 충돌 (CLAUDE.md 14. 정합)

본 USAGE-GUIDE는 CLAUDE.md 14. 우선순위에 종속:

1. 안전 (외부 영향 작업 명시 요청 대기) — Critical Path 우회 안 됨
2. SVOP default-deny — skill 호출 결과도 SVOP 적용
3. **사용자 명시 override** — 본 USAGE-GUIDE의 결정 트리 우회 (4.)
4. 자동 분류 — 본 USAGE-GUIDE의 결정 트리
5. 권고 사항

---

## 10. 갱신 로그

- **2026-05-27**: 초기 작성 (v1.0) — 거버넌스 결정 4건 반영 (CLAUDE.md 0. 자동 로드 / skills+agents 같은 패턴 / 자동 1개 채택 + 이유 알림 / 의미론적 매칭)
- **2026-06-10**: 07_orchestration 카테고리 신설 반영 — 제7조 도메인 매핑에 "다단계 자동 진행/풀 루프" → 07 추가 (`full-loop` 1종, 플랜모드 승인)
- **2026-06-11**: 활성 skill 수·카테고리 수 실측 갱신 (v1.1) — 6개 카테고리(외부 하네스 채택 신규 3종 `visual-verdict`·`ai-slop-cleaner`·`remember` 편입). A1 키워드 훅(skill-keyword-injector.js)과의 역할 구분 1줄 추가(훅=추천 신호, 결정 트리=확정). 거버넌스 결정에 따른 집행

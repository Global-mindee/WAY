---
name: remember
description: 세션에서 발견한 재사용 가능한 지식을 분류해 알맞은 적재처(auto-memory·_reference·logs·결재 등록)에 보존한다. SVOP 정합 — 미검증 사실은 [UNCERTAIN]로 표기하고 사실로 저장하지 않는다.
trigger-keywords: [기억해, 메모리 저장, 이거 기록, remember, 적재, 지식 보존, 메모리 정리]
---

# remember (지식 적재)

세션 중 발견한 유용한 지식을 채팅 기록에 묻어두지 않고, W.A.Y?의 알맞은 메모리 표면으로 승격시킨다.

## 목적

내구성 있고 재사용 가능한 지식을 올바른 적재처로 올린다. 한 곳에 전부 쏟아붓지 않는다.

## W.A.Y? 적재처 매핑

| 적재처 | 용도 | 쓰기 방식 |
|--------|------|----------|
| auto-memory (`~/.claude/projects/.../memory/`) + `MEMORY.md` 인덱스 | 세션 간 지속되는 프로젝트 사실·교훈 | 직접 쓰기 (+ MEMORY.md 1줄 인덱스 추가) |
| `_reference/` | 비교 노트·벤치마크·참조 산출물 | 직접 쓰기 |
| `logs/operations.log` · `logs/meta-feedback.log` | 운영 이벤트·메타 피드백 | append 1줄 |
| `memory/` 3-Tier (public·quarantine·archive) | 결재 통과한 Tier 이동 항목 | **결재 등록만** (직접 이동 금지 — CLAUDE.md 11.) |
| `CLAUDE.md` · `rules/` | 운영 규칙·관행 변경 | **결재 등록만** (자기 정의 변경 = Critical) |

## 워크플로 (2단계)

### 1단계 — 세션 추출
1. 이번 세션의 관련 발견을 모은다.
2. 각 항목을 분류한다 (4분류):
   - **durable** — 내구성 있는 프로젝트 사실
   - **working** — 임시 작업 노트 (다음 턴용)
   - **preference** — 운영자(사용자) 선호·지시
   - **duplicate/stale/conflict** — 중복·낡음·충돌 정보
3. 각 항목의 최적 적재처를 위 매핑표에서 제안한다.

### 2단계 — 교차 통합
4. 적합한 메모리 표면 1곳에만 쓰거나 갱신한다 (다중 적재 금지).
5. 정리가 필요한 중복·충돌을 호출해 보고한다.
6. 자기 정의·규칙 변경은 직접 쓰지 않고 `decisions/pending.md`에 결재 등록한다.

## 규칙

- 전부를 한 저장소에 덤프하지 않는다.
- durable은 auto-memory, working은 임시 노트로 분리한다.
- 항목은 간결하고 실행 가능하게 유지한다.
- **[UNCERTAIN] 규칙 (SVOP 정합)**: 불확실한 정보는 사실로 저장하지 않는다. 반드시 `[UNCERTAIN]` 마커를 붙여 표기하거나, 5종 출처(USER/READ/BASH/WEB/MEMORY) 중 하나로 검증한 뒤 저장한다. 추측·기억 기반 사실 단정은 적재 금지.

## 출력

- 무엇을 저장했는가
- 어디에 저장했는가
- 발견한 중복·충돌
- 결재 등록이 필요한 항목 (있으면)

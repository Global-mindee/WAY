# agents/ — 분류 관리체계표

> **목적**: 하네스 agents 일원화 — 작업 머신의 여러 출처 폴더 + `~/.claude/agents` 글로벌 전수 통합
> **버전**: v1.0 (2026-05-26 harness-init)
> **출처**: 초기 통합 plan Phase 4 산출물

---

## 1. 일원화 결과 요약

| 카테고리 | 디렉토리 | 항목 수 |
|---------|---------|--------|
| 01. 개발 워크플로우 | `01_dev-workflow/` | 4 |
| 02. 리서치·탐색 | `02_research/` | 3 |
| 03. 운영 자동화 | `03_ops-automation/` | 1 |
| 04. 창작·디자인 | `04_creative/` | 5 |
| **활성 합계** | | **13** |
| _archive | `_archive/` | 0 |

---

## 2. 카테고리 정의

### 01. 개발 워크플로우 (dev-workflow)
계획·검토·실행·QA 등 코드 작업 lifecycle agent.

### 02. 리서치·탐색 (research)
정보 수집·분석·히스토리 큐레이션 agent.

### 03. 운영 자동화 (ops-automation)
보안·인프라 운영 자동화 agent.

### 04. 창작·디자인 (creative)
아이디어·서비스 설계·UI/UX·문서 작성 agent.

---

## 3. 복제 원본 매핑

| 원본 경로 | 항목 수 | 처리 |
|----------|---------|------|
| 외부 참조 하네스 A (`agency-*/.claude/agents/`) | 7 | 01·02·04 분류 |
| 개인 운영 하네스 (`operations/quality/agents/`) | 6 | 01·02·03 분류 |
| 개인 운영 하네스 (`operations/marketing/agents/`) | 0 | 빈 디렉토리 |
| 외부 참조 하네스 B (`gstack-*` skill-bound `.agents/skills/*/agents/`) | 다수 | **skill-bound** — `skills/02_gstack-ops/` 안에 통째 보존 (별도 복제 안 함) |
| `~/.claude/agents/` (글로벌) | **부재** | 디렉토리 자체 없음 (후속 결재 대기) |

---

## 4. ~/.claude/agents 부재 (`pending#7`)

`~/.claude/agents` 디렉토리 자체가 존재하지 않음 [B: ls -la ~/.claude/agents → No such file].

Plan 결재 시 "작업 머신 출처 폴더 + 글로벌 + ~/.claude/agents 전수" 합의했으나, 글로벌 전제가 충족되지 않음. 후속 결재: `decisions/pending.md` 참조.

---

## 5. 외부 참조 하네스 B의 gstack-* skill-bound agents 정책

외부 참조 하네스 B(`gstack-*` skill 묶음)의 `.agents/skills/*/agents/` 의 agent들은 **각 gstack-* skill에 종속**된 형태(같은 폴더 묶음).

본 일원화에서는:
- skill 자체와 agent 묶음을 함께 `skills/02_gstack-ops/<skill>/agents/` 안에 그대로 보존
- `agents/` 활성 디렉토리에는 **별도 복제 안 함** (중복 방지)

후속 결재 필요 시점: gstack agent를 다른 카테고리(예: 01·02)에서도 호출 가능하게 만들 때 symlink 또는 metadata 매니페스트 작성 결재.

---

## 6. 카테고리별 활성 agent 목록

### 01_dev-workflow (4)
- `developer.md` — 코드 구현 담당 (출처: 외부 참조 하네스 A)
- `plan-architect.md` — 계획 설계 (출처: 개인 운영 하네스 quality)
- `plan-reviewer.md` — 계획 검토 (출처: 개인 운영 하네스 quality)
- `execution-worker.md` — 실행 처리 (출처: 개인 운영 하네스 quality)

### 02_research (3)
- `research-analyst.md` — 리서치 분석 (출처: 외부 참조 하네스 A)
- `history-curator.md` — 히스토리 큐레이션 (출처: 개인 운영 하네스 quality)
- `project-profiler.md` — 프로젝트 프로파일링 (출처: 개인 운영 하네스 quality)

### 03_ops-automation (1)
- `security-coordinator.md` — 보안 코디네이션 (출처: 개인 운영 하네스 quality)

### 04_creative (5)
- `idea-generator.md` — 아이디어 발산 (출처: 외부 참조 하네스 A)
- `service-planner.md` — 서비스 기획 (출처: 외부 참조 하네스 A)
- `ui-designer.md` — UI 디자인 (출처: 외부 참조 하네스 A)
- `ux-designer.md` — UX 디자인 (출처: 외부 참조 하네스 A)
- `document-writer.md` — 문서 작성 (출처: 외부 참조 하네스 A)

---

## 7. 추가·삭제·갱신 절차

skills/README 9. 와 동일 정책 (활성 → archive 이동, 직접 삭제 금지, AP3 정합).

---

## 8. 미구현·후속 작업

- 후속 결재 — ~/.claude/agents 부재 처리 (글로벌 신설 여부 결재)
- gstack skill-bound agent를 글로벌에서 호출 가능하게 할지 매니페스트 작성 결재
- 개인 운영 하네스 marketing/agents 가 빈 디렉토리 — 향후 마케팅 agent 정착 시 04_creative 또는 03_ops-automation에 매핑

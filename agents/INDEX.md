# agents/INDEX.md — 활성 agents 의미론적 매칭 인덱스

> **목적**: AI가 사용자 발화 → 적합 agent 1개 자동 선택할 때 참조하는 압축 메타 정보
> **버전**: v1.1 (2026-06-11)
> **연동**: `agents/USAGE-GUIDE.md` 결정 트리가 본 파일을 참조
> **갱신 정책**: agent 추가·삭제·재분류 시 본 파일 동기 갱신 (수동)

---

## 사용법 (USAGE-GUIDE.md 참조)

skills/INDEX.md와 동일 — 4개 카테고리 절 전수 후보 → 의미론적 매칭 → 1개 자동 채택. 세부는 `agents/USAGE-GUIDE.md`.

agent 호출은 Claude Code `Agent` 도구를 사용하되, `subagent_type` 글로벌 등록이 없으므로 **agent 본문을 prompt에 인라인 주입**하는 방식. USAGE-GUIDE 3. 참조.

---

## 카테고리 요약

| # | 카테고리 | agent 수 | 영역 |
|---|---------|---------|------|
| 01 | `01_dev-workflow/` | 5 | 개발 워크플로우 (계획·비평·검토·실행·구현) |
| 02 | `02_research/` | 3 | 리서치·탐색 (히스토리·프로파일링·시장 조사) |
| 03 | `03_ops-automation/` | 1 | 운영 자동화 (보안 코디네이션) |
| 04 | `04_creative/` | 5 | 창작·디자인 (아이디어·기획·UI/UX·문서) |
|    | **합계** | **14** | |

---

## 01_dev-workflow (5)

| agent | description (compressed) | trigger keywords |
|-------|--------------------------|------------------|
| `critic` | 실행 전 계획 실행가능성 판정. OKAY/REJECT 이분 + 4축(명확성·검증가능성·완전성·큰그림) + top 3~5 개선안. full-loop S3 비평·Critical pre-mortem 모드. 읽기 전용(도구 제약 frontmatter 표준 준수) | 비평, 계획 검토, critic, OKAY, REJECT, pre-mortem |
| `developer` | 서비스 기획·UX 가이드 기반 코드 구현·배포. agent-skills 파이프라인(/spec→/plan→/build→/test→/ship) 활용 | 개발, 구현, 코딩, 배포, build |
| `execution-worker` | 승인된 계획 단계별 실행 + 산출물 생성. manifest.md 상태 추적. security-coordinator Stage 3 호출 | 실행, manifest, security-execute, stage-3 |
| `plan-architect` | project-profile.md 기반 보안 검토 계획서 작성. security-coordinator Stage 1 호출 | 보안 계획, 계획서, security-plan, stage-1 |
| `plan-reviewer` | plan-architect 계획서 5관점 자가 검토 + 사용자 승인 요청. Stage 2 | 검토, 자가 검토, security-review, stage-2 |

---

## 02_research (3)

| agent | description (compressed) | trigger keywords |
|-------|--------------------------|------------------|
| `history-curator` | 보안 감사 이력(timeline.md) 관리·감사 간 비교. /sec-history, /sec-compare | 이력, 감사, security-history, sec-history, sec-compare |
| `project-profiler` | 프로젝트 기술 스택·데이터 민감도·시장·보안 진단 → project-profile.md 생성. Stage 0 | 진단, project-profile, security-discover, stage-0 |
| `research-analyst` | 공공·민간 시장 조사·경쟁 분석. 공공데이터·정부 보고서·기업 IR·고객 리뷰 기반 | 시장 조사, 경쟁 분석, 리서치, 공공 데이터, IR |

---

## 03_ops-automation (1)

| agent | description (compressed) | trigger keywords |
|-------|--------------------------|------------------|
| `security-coordinator` | 보안 검토 5단계 파이프라인(진단→계획→검토→실행→이력) 전체 조율 총괄 | 보안 검토, 보안 감사, /sec-start, 파이프라인 조율 |

---

## 04_creative (5)

| agent | description (compressed) | trigger keywords |
|-------|--------------------------|------------------|
| `document-writer` | 보고서·제안서·사업계획서 작성. Word/PPT/Markdown. 공공/민간/RFP/pitch | 보고서, 제안서, 사업계획서, Word, PPT, pitch |
| `idea-generator` | 공공·민간 사업 아이디어 발산·수렴 → 제안 초안. 리서치 근거 직접 연결 | 아이디어, 사업 아이디어, 발산, 수렴, 제안 초안 |
| `service-planner` | 아이디어 → PRD·기능 정의서·사용자 스토리 작성. ux-designer·developer 인풋 | PRD, 기획, 기능 정의서, 사용자 스토리, 서비스 기획 |
| `ui-designer` | 시각 토큰·shadcn 컴포넌트·접근성 규격화. globals.css 동기화, WCAG AA | 색상 토큰, shadcn, WCAG, globals.css, OG 이미지 |
| `ux-designer` | 사용자 경험 설계. 와이어프레임·화면 흐름도·사용자 여정. 09-ux-brief.md 전담 | 와이어프레임, 사용자 여정, UX, 09-ux-brief, 화면 흐름 |

---

## 글로벌 알파벳 인덱스 (부록)

- `critic` → 01_dev-workflow/critic
- `developer` → 01_dev-workflow/developer
- `document-writer` → 04_creative/document-writer
- `execution-worker` → 01_dev-workflow/execution-worker
- `history-curator` → 02_research/history-curator
- `idea-generator` → 04_creative/idea-generator
- `plan-architect` → 01_dev-workflow/plan-architect
- `plan-reviewer` → 01_dev-workflow/plan-reviewer
- `project-profiler` → 02_research/project-profiler
- `research-analyst` → 02_research/research-analyst
- `security-coordinator` → 03_ops-automation/security-coordinator
- `service-planner` → 04_creative/service-planner
- `ui-designer` → 04_creative/ui-designer
- `ux-designer` → 04_creative/ux-designer

---

## 네이티브 등록 에이전트 (.claude/agents/ — full-loop 전용)

위 카테고리(`agents/` 폴더)는 인라인 주입용 정의이고, full-loop 파이프라인은 별도로 `.claude/agents/`에 **네이티브 등록 에이전트 5종**(`loop-*`)을 둔다. 이들은 `Agent` 도구의 `subagent_type`으로 직접 호출되며, 각자 본문에서 `agents/01_dev-workflow/`의 해당 규약을 Read로 로드해 준수한다(이중 정본 방지 — 네이티브 정의는 모델·effort 강제와 루프 결합부만 둔다).

| 네이티브 에이전트 | 단계 | model·effort | 규약 출처 (Read 로드) |
|------------------|------|--------------|----------------------|
| `loop-planner` | S3 계획 초안 | fable·max | `agents/01_dev-workflow/plan-architect.md` |
| `loop-critic` | S3 계획 비평 | fable·high | `agents/01_dev-workflow/critic.md` |
| `loop-executor` | S5 실행 | opus·xhigh | `agents/01_dev-workflow/execution-worker.md` |
| `loop-reviewer-spec` | S6 검수 1(명세 대조) | opus | `agents/01_dev-workflow/plan-reviewer.md` 정신 |
| `loop-reviewer-verify` | S6 검수 2(기능 실증) | opus | (BASH 실증 — 독립 채점) |

세부 결합은 `skills/07_orchestration/full-loop/SKILL.md`(S3·S5·S6) 참조.

---

## 매칭 미달 시 처리

본 INDEX.md에 적합 agent가 없을 때:
1. "관련 agent 없음" 명시
2. `rules/unknown-modes.md` UNKNOWN 마커 부착
3. 일반 응답으로 진행 (혹은 skills 매칭 재시도)

---

## agent 연쇄 호출 (체인)

일부 agent는 다른 agent를 자동 호출:
- `security-coordinator` (총괄) → project-profiler(S0) → plan-architect(S1) → plan-reviewer(S2) → execution-worker(S3) → history-curator(S4)

이 체인은 USAGE-GUIDE.md 6. 참조.

---

## 갱신 로그

- **2026-05-27**: 초기 작성 (v1.0) — 활성 13개 agent 일괄 추출
- **2026-06-11**: `critic` 에이전트 편입 (v1.1) — 01_dev-workflow 4→5, 합계 13→14. 외부 클론 critic 번역 이식(OKAY/REJECT 이분 + 4축 + 도구 제약 frontmatter 표준). 네이티브 등록 에이전트(`.claude/agents/` loop-* 5종) 안내 절 추가. 거버넌스 결정(외부 하네스 채택 백로그)에 따른 집행

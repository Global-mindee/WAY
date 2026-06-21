# skills/ — 분류 관리체계표

> **목적**: 하네스 skills 일원화 — 여러 소스 하네스 폴더 + 글로벌 `~/.claude/skills` 전수 통합
> **버전**: v1.0 (2026-05-26 harness-init)
> **출처**: 일원화 plan Phase 3 산출물

---

## 1. 일원화 결과 요약

| 카테고리 | 디렉토리 | 항목 수 |
|---------|---------|--------|
| 01. DX & 코드 품질 | `01_dx-and-quality/` | 18 |
| 02. Gstack 운영 자동화 | `02_gstack-ops/` | 46 |
| 03. 비즈니스 (마케팅·세일즈·CRO) | `03_business/` | 32 |
| 04. 인프라 & 플랫폼 | `04_infra-platform/` | 23 |
| 05. 지식·메모리 관리 | `05_knowledge-and-memory/` | 1 |
| 07. 오케스트레이션 | `07_orchestration/` | 1 |
| **활성 합계** | | **121** |
| _archive (충돌·이전 사본) | `_archive/` | 52 |
| _uncategorized (미분류) | `_uncategorized/` | 0 |

---

## 2. 카테고리 정의

### 01. DX & 코드 품질 (Developer Experience & Quality)
개발 워크플로우·테스트·CI·문서·디자인 시스템·콘텐츠 전략 등 **개발 생산성·품질 향상** 영역.

### 02. Gstack 운영 자동화
`gstack-*` 접두사로 묶인 Gstack 프로젝트 운영 전용 skill 묶음. QA·deploy·design-review·plan-* 등.

### 03. 비즈니스 (마케팅·세일즈·CRO)
마케팅 카피·SEO·CRO·세일즈·고객 리서치·법무 등 **수익 창출·전환율 최적화** 영역.

### 04. 인프라 & 플랫폼
DB·k8s·docker·언어 베스트 프랙티스(python/golang/rust/typescript 등)·보안 등 **시스템 인프라** 영역.

### 05. 지식·메모리 관리
SDE(Self-Definition Extractor)·context 저장/복원 등 **자기 정의·메모리** 영역.

### 07. 오케스트레이션 (Orchestration)
자연 발화 1건으로 다단계 과제를 자동 진행하는 **메타-오케스트레이션** 영역. `full-loop`(8단계 자동 루프 — 구체화→조사→플랜모드 계획→인간 승인→실행→독립 검수→재실행→지식 적재, Stop 훅 드라이버 연동). 인간 게이트 3곳은 절대 우회하지 않는다. (2026-06-10 신설, 플랜모드 승인)

---

## 3. 복제 원본 매핑

| 원본 경로 | 항목 수 | 처리 |
|----------|---------|------|
| Toolkit 하네스 `.claude/skills/` | 71 | 01·03·04 분류 |
| Toolkit 하네스 `source/skills/` | 35 | `_archive/toolkit-source-skills/` 통째 보존 |
| 사업 하네스 `.claude/skills/` | 1 (diagram-design) | 01 |
| 사업 하네스 `platform/knowledge/skills/` | 6 | 비충돌 1(legal-compliance)→03 · 충돌 5(`_archive/conflicts/`) |
| 사업 하네스 `operations/marketing/skills/` | 12 | 전부 Toolkit `.claude`와 동명 중복 → `_archive/conflicts/marketing-<name>/` 격리 |
| Gstack 하네스 `.agents/skills/` | 46 | 02 통째 |
| 글로벌 `~/.claude/skills/` | 46 디렉토리 | **전수 깨진 심볼릭 링크** — Gstack 하네스가 사실상 원본이라 패스 (pending#6) |
| 기존 `WAY/skills/sde-extractor` | 1 | 05 이동 |

---

## 4. 중복 처리 정책

Plan 결재 [U]:
- **내용 동일하면 1개만 채택**
- **상이하면 `_archive/conflicts/`로 격리** (Blueprint AP3 never_delete 정합)

### 우선순위
> `~/.claude/skills` (글로벌) → `.claude/skills` (프로젝트) → `source/skills` (사본)

본 일원화에서 글로벌은 깨진 링크로 사용 불가, 프로젝트 `.claude/skills`가 사실상 최우선.

### 본 일원화에서 발생한 충돌

#### 4-1. Toolkit source vs .claude (35쌍)
- 처리: `.claude/skills` 71개를 활성 채택, `source/skills` 35개는 `_archive/toolkit-source-skills/` 통째 보존
- 사유: 같은 이름이 두 경로에 동시 존재 → 시점 비교용으로 source 사본 보존
- 결재 필요 시점: 다음 일원화 작업에서 활성-아카이브 동기화 정책 표준화

#### 4-2. Toolkit .claude vs 사업 하네스 platform (5쌍)
- 충돌 항목: `design-system`, `llm-integration`, `market-intelligence`, `prompt-engineering`, `security-hardening`
- 처리: Toolkit .claude 채택 (활성), 사업 하네스 platform 사본은 `_archive/conflicts/platform-<name>/` 로 격리
- 사유: `.claude/skills` 가 일반적 우선순위 + 신선도 동등 시 toolkit 채택

#### 4-3. Toolkit .claude vs 사업 하네스 operations/marketing (12쌍)
- 충돌 항목: `ad-creative`, `analytics-tracking`, `content-strategy`, `copywriting`, `customer-research`, `email-sequence`, `launch-strategy`, `page-cro`, `pricing-strategy`, `product-marketing-context`, `seo-audit`, `social-content`
- 처리: Toolkit .claude 채택 (활성), 사업 하네스 marketing 사본은 `_archive/conflicts/marketing-<name>/` 로 격리
- 사유: Toolkit이 일반 마케팅 skill의 standard 모음. 사업 하네스 operations 내 사본은 시점적 비교용 보존

---

## 5. _archive 정책 (never_delete)

`_archive/` 하위 항목은 **삭제 금지**. Blueprint AP3 정합.

- `_archive/toolkit-source-skills/` — Toolkit source/ 사본 35개 (시점 비교용)
- `_archive/conflicts/platform-<name>/` — 사업 하네스 platform 충돌본 5개
- `_archive/conflicts/marketing-<name>/` — 사업 하네스 marketing 충돌본 12개

향후 활성 skill 갱신 시 archive에 사본을 추가 (덮어쓰기 금지).

---

## 6. _uncategorized 정책

자동 분류 신뢰도가 낮은 항목을 임시 보관 후 결재 요청.

본 일원화에서는 **0건** (mapping 명시 완료).

---

## 7. ~/.claude/skills 글로벌 깨진 링크 (`pending#6`)

`~/.claude/skills` 의 46개 디렉토리는 모두 존재하나 안의 `SKILL.md`가 깨진 심볼릭 링크:
- 가리키는 경로: 부재하는 로컬 경로 `<홈>/New/<name>/SKILL.md`
- 해당 경로 부재 [B: ls → No such file]
- 동명 폴더 대다수는 Gstack 하네스 `.agents/skills/` 에 정상 존재 → `02_gstack-ops/` 에 통째 복제로 충당

후속 처리: `decisions/pending.md` 항목 6번.

---

## 8. ~/.claude/agents 부재 (`pending#7`)

`~/.claude/agents` 디렉토리 자체가 없음 [B: ls -la ~/.claude/agents → No such file].

후속 처리: `decisions/pending.md` 항목 7번. `agents/README.md` 참조.

---

## 9. 추가·삭제·갱신 절차

### 새 skill 추가
1. 적합 카테고리 선택 (01~05)
2. `<카테고리>/<skill-name>/SKILL.md` 형식으로 생성
3. `logs/operations.log` 에 1줄 기록 (`skill-added: <name>`)
4. 본 README의 1. 표 항목 수 갱신

### 삭제
1. **활성 → archive 이동** (직접 삭제 금지, AP3 정합)
2. `_archive/removed-<YYYY-MM-DD>-<name>/` 로 이동
3. `logs/operations.log` 기록

### 갱신 (덮어쓰기)
1. 기존 활성본을 `_archive/superseded-<YYYY-MM-DD>-<name>/` 로 사본 백업
2. 활성본 갱신
3. `logs/operations.log` 기록

### 카테고리 재분류
1. 결재 요청 (`decisions/pending.md`)
2. 사용자 승인 후 이동
3. README 1. 갱신

---

## 10. 카테고리별 활성 skill 목록

### 01_dx-and-quality (18)
ab-test-setup, accessibility-wcag, analytics-tracking, api-design-patterns, ci-cd-pipelines, content-strategy, continuous-learning, copy-editing, design-system, devops-automation, diagram-design, frontend-excellence, git-advanced, monitoring-observability, performance-optimization, prompt-engineering, tdd-mastery, testing-strategies

### 02_gstack-ops (46)
gstack, gstack-autoplan, gstack-benchmark, gstack-benchmark-models, gstack-browse, gstack-canary, gstack-careful, gstack-claude, gstack-context-restore, gstack-context-save, gstack-cso, gstack-design-consultation, gstack-design-html, gstack-design-review, gstack-design-shotgun, gstack-devex-review, gstack-document-release, gstack-freeze, gstack-guard, gstack-health, gstack-investigate, gstack-land-and-deploy, gstack-landing-report, gstack-learn, gstack-make-pdf, gstack-office-hours, gstack-open-gstack-browser, gstack-pair-agent, gstack-plan-ceo-review, gstack-plan-design-review, gstack-plan-devex-review, gstack-plan-eng-review, gstack-plan-tune, gstack-qa, gstack-qa-only, gstack-retro, gstack-review, gstack-scrape, gstack-setup-browser-cookies, gstack-setup-deploy, gstack-setup-gbrain, gstack-ship, gstack-skillify, gstack-sync-gbrain, gstack-unfreeze, gstack-upgrade

### 03_business (32)
ad-creative, ai-seo, churn-prevention, cold-email, competitor-alternatives, copywriting, customer-research, email-sequence, form-cro, free-tool-strategy, launch-strategy, lead-magnets, legal-compliance, market-intelligence, marketing-ideas, marketing-psychology, onboarding-cro, page-cro, paid-ads, paywall-upgrade-cro, popup-cro, pricing-strategy, product-marketing-context, programmatic-seo, referral-program, revops, sales-enablement, schema-markup, seo-audit, signup-flow-cro, site-architecture, social-content

### 04_infra-platform (23)
authentication-patterns, aws-cloud-patterns, data-engineering, database-optimization, django-patterns, docker-best-practices, golang-idioms, graphql-design, kubernetes-operations, llm-integration, mcp-development, microservices-design, mobile-development, nextjs-mastery, postgres-optimization, python-best-practices, react-patterns, redis-patterns, rust-systems, security-hardening, springboot-patterns, typescript-advanced, websocket-realtime

### 05_knowledge-and-memory (1)
sde-extractor

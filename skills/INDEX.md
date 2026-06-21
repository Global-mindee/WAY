# skills/INDEX.md — 활성 skills 의미론적 매칭 인덱스

> **목적**: AI가 사용자 발화 → 적합 skill 1개 자동 선택할 때 참조하는 압축 메타 정보
> **버전**: v1.4 (2026-06-11)
> **연동**: `skills/USAGE-GUIDE.md` 결정 트리가 본 파일을 참조
> **갱신 정책**: skill 추가·삭제·재분류 시 본 파일 동기 갱신 (수동)

---

## 사용법 (USAGE-GUIDE.md 참조)

1. 사용자 발화 수신 → AI가 의도를 내부 파악
2. 본 INDEX.md 6개 카테고리 절 전수 후보로 두고 description·trigger와 의미론적 비교
3. 최고 점수 1개 자동 채택 + 이유 1줄 알림
4. 0건이면 "관련 skill 없음" 명시 후 일반 응답

세부 결정 트리는 `skills/USAGE-GUIDE.md` 참조.

---

## 카테고리 요약

| # | 카테고리 | skill 수 | 영역 |
|---|---------|---------|------|
| 01 | `01_dx-and-quality/` | 20 | DX·코드 품질 (테스트·CI·디자인 시스템·콘텐츠·비주얼 판정·슬로프 정리) |
| 02 | `02_gstack-ops/` | 46 | Gstack 운영 자동화 (gstack-*) |
| 03 | `03_business/` | 32 | 비즈니스 (마케팅·세일즈·CRO·법무) |
| 04 | `04_infra-platform/` | 23 | 인프라·플랫폼 (DB·k8s·언어 best practice) |
| 05 | `05_knowledge-and-memory/` | 2 | 지식·메모리 관리 (SDE·지식 적재) |
| 07 | `07_orchestration/` | 1 | 오케스트레이션 (자연 발화 → 다단계 자동 진행 루프) |
|    | **합계** | **124** | |

---

## 01_dx-and-quality (20)

| skill | description | trigger keywords |
|-------|-------------|------------------|
| `ab-test-setup` | When the user wants to plan, design, or implement an A/B test or experiment, or build a growth exper… | A/B test, split test, experiment, test this change, variant copy |
| `accessibility-wcag` | Web accessibility patterns for WCAG 2.2 compliance including ARIA, keyboard navigation, screen reade… | accessibility, patterns, WCAG, compliance, including |
| `ai-slop-cleaner` | AI가 생성한 코드 슬로프(군더더기)를 회귀 안전·삭제 우선 워크플로로 정리. 동작 보존·중복/죽은코드/과다래퍼/경계위반 제거·회귀 테스트 선행. 리뷰 전용 모드(--review) 지원 | 슬로프 정리, deslop, 코드 정리, ai-slop, 군더더기 제거, 리팩터 정리, 과다 추상화 제거 |
| `analytics-tracking` | When the user wants to set up, improve, or audit analytics tracking and measurement. Also use when t… | set up tracking, GA4, Google Analytics, conversion tracking, event tracking |
| `api-design-patterns` | REST API design with resource naming, pagination, versioning, and OpenAPI spec generation | REST, design, resource, naming, pagination |
| `ci-cd-pipelines` | CI/CD pipeline patterns for GitHub Actions, GitLab CI, testing strategies, and deployment automation | CI/CD, pipeline, patterns, GitHub, Actions |
| `content-strategy` | When the user wants to plan a content strategy, decide what content to create, or figure out what to… | content strategy, what should I write about, content ideas, blog strategy, topic clusters |
| `continuous-learning` | Auto-extract patterns from coding sessions, track corrections, and build reusable knowledge with con… | Auto-extract, patterns, from, coding, sessions |
| `copy-editing` | "When the user wants to edit, review, or improve existing marketing copy, or refresh outdated conten… | edit, review, improve, existing, marketing |
| `design-system` | 웹사이트, 랜딩 페이지, UI 컴포넌트, shadcn/ui, Tailwind CSS 제작 시 색상 팔레트, 타이포그래피, 버튼/카드/폼 스타일, 그림자 체계, 반응형 breakpo… | shadcn/ui, Tailwind, breakpoint, Claude, Linear |
| `devops-automation` | CI/CD pipeline design with GitHub Actions, Docker, Kubernetes, Helm, and GitOps patterns | CI/CD, pipeline, design, GitHub, Actions |
| `diagram-design` | Create technical and product diagrams — architecture, flowchart, sequence, state machine, ER / data … | Create, technical, product, diagrams, architecture |
| `frontend-excellence` | Modern frontend patterns for React Server Components, performance optimization, and Core Web Vitals | Modern, frontend, patterns, React, Server |
| `git-advanced` | Advanced git workflows including worktrees, bisect, interactive rebase, hooks, and recovery techniqu… | Advanced, workflows, including, worktrees, bisect |
| `monitoring-observability` | Monitoring and observability with OpenTelemetry, Prometheus, Grafana dashboards, and structured logg… | Monitoring, observability, OpenTelemetry, Prometheus, Grafana |
| `performance-optimization` | Web performance optimization including bundle analysis, lazy loading, caching strategies, and Core W… | performance, optimization, including, bundle, analysis |
| `prompt-engineering` | Prompt engineering patterns including structured prompts, chain-of-thought, few-shot learning, and s… | Prompt, engineering, patterns, including, structured |
| `tdd-mastery` | Test-driven development workflow with Red-Green-Refactor cycle across languages | Test-driven, development, workflow, Red-Green-Refactor, cycle |
| `testing-strategies` | Testing strategies including contract testing, snapshot testing, mutation testing, property-based te… | Testing, strategies, including, contract, testing |
| `visual-verdict` | 생성 UI 스크린샷을 기준 이미지와 대조해 엄격한 JSON 판정(score 0~100·verdict·suggestions) 반환. 임계 90 미만이면 수정 후 재판정. html-deliverable-render-verify 판정 표준으로 연결 | 비주얼 검수, 스크린샷 비교, UI 판정, visual-verdict, 디자인 대조, 화면 비교 |

---

## 02_gstack-ops (46)

| skill | description | trigger keywords |
|-------|-------------|------------------|
| `gstack` | Fast headless browser for QA testing and site dogfooding. Navigate pages, interact with elements, ve… | Fast, headless, browser, testing, site |
| `gstack-autoplan` | Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them… | auto review, autoplan, run all reviews, review this plan automatically, make the decisions for me |
| `gstack-benchmark` | Performance regression detection using the browse daemon. Establishes baselines for page load times,… | performance, benchmark, page speed, lighthouse, web vitals |
| `gstack-benchmark-models` | Cross-model benchmark for gstack skills. Runs the same prompt through Claude, GPT (via Codex CLI), a… | benchmark models, compare models, which model is best for X, cross-model comparison, model shootout |
| `gstack-browse` | Fast headless browser for QA testing and site dogfooding. Navigate any URL, interact with elements, … | open in browser, test the site, take a screenshot, dogfood this |
| `gstack-canary` | Post-deploy canary monitoring. Watches the live app for console errors, performance regressions, and… | monitor deploy, canary, post-deploy check, watch production, verify deploy |
| `gstack-careful` | Safety guardrails for destructive commands. Warns before rm -rf, DROP TABLE, force-push, git reset -… | be careful, safety mode, prod mode, careful mode |
| `gstack-claude` | Claude Code CLI wrapper for non-Claude hosts - three modes. Review: independent diff review via clau… | claude review, claude challenge, ask claude, second opinion from claude, outside voice |
| `gstack-context-restore` | Restore working context saved earlier by /context-save. Loads the most recent saved state (across al… | resume, restore context, where was I, pick up where I left off |
| `gstack-context-save` | Save working context. Captures git state, decisions made, and remaining work so any future session c… | save progress, save state, context save, save my work |
| `gstack-cso` | Chief Security Officer mode. Infrastructure-first security audit: secrets archaeology, dependency su… | security audit, threat model, pentest review, OWASP, CSO review |
| `gstack-design-consultation` | Design consultation: understands your product, researches the landscape, proposes a complete design … | design system, brand guidelines, create DESIGN.md |
| `gstack-design-html` | Design finalization: generates production-quality Pretext-native HTML/CSS. Works with approved mocku… | finalize this design, turn this into HTML, build me a page, implement this design, build the design |
| `gstack-design-review` | Designer's eye QA: finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns,… | audit the design, visual QA, check if it looks good, design polish |
| `gstack-design-shotgun` | Design shotgun: generate multiple AI design variants, open a comparison board, collect structured fe… | explore designs, show me options, design variants, visual brainstorm, I don't like how this looks |
| `gstack-devex-review` | Live developer experience audit. Uses the browse tool to actually TEST the developer experience: nav… | test the DX, DX audit, developer experience test, try the onboarding, dx audit |
| `gstack-document-release` | Post-ship documentation update. Reads all project docs, cross-references the diff, updates README/AR… | update the docs, sync documentation, post-ship docs |
| `gstack-freeze` | Restrict file edits to a specific directory for the session. Blocks Edit and Write outside the allow… | fixing, freeze, restrict edits, only edit this folder, lock down edits |
| `gstack-guard` | Full safety mode: destructive command warnings + directory-scoped edits. Combines /careful (warns be… | guard mode, full safety, lock it down, maximum safety |
| `gstack-health` | Code quality dashboard. Wraps existing project tools (type checker, linter, test runner, dead code d… | health check, code quality, how healthy is the codebase, run all checks, quality score |
| `gstack-investigate` | Systematic debugging with root cause investigation. Four phases: investigate, analyze, hypothesize, … | debug this, fix this bug, why is this broken, investigate this error, root cause analysis |
| `gstack-land-and-deploy` | Land and deploy workflow. Merges the PR, waits for CI and deploy, verifies production health via can… | merge, land, deploy, merge and verify, land it |
| `gstack-landing-report` | Read-only queue dashboard for workspace-aware ship. Shows which VERSION slots are currently claimed … | landing report, what's in the queue, show me open PRs, which version do I claim next |
| `gstack-learn` | Manage project learnings. Review, search, prune, and export what gstack has learned across sessions.… | what have we learned, show learnings, prune stale learnings, export learnings, didn't we fix this before? |
| `gstack-make-pdf` | Turn any markdown file into a publication-quality PDF. Proper 1in margins, intelligent page breaks, … | make a PDF, export to PDF, turn this markdown into a PDF, generate a document, make this a pdf |
| `gstack-office-hours` | YC Office Hours — two modes. Startup mode: six forcing questions that expose demand reality, status … | brainstorm this, I have an idea, help me think through this, office hours, is this worth building |
| `gstack-open-gstack-browser` | Launch GStack Browser — AI-controlled Chromium with the sidebar extension baked in. Opens a visible … | open gstack browser, launch browser, connect chrome, open chrome, real browser |
| `gstack-pair-agent` | Pair a remote AI agent with your browser. One command generates a setup key and prints instructions … | pair agent, connect agent, share browser, remote browser, let another agent use my browser |
| `gstack-plan-ceo-review` | CEO/founder-mode plan review. Rethink the problem, find the 10-star product, challenge premises, exp… | think bigger, expand scope, strategy review, rethink this, is this ambitious enough |
| `gstack-plan-design-review` | Designer's eye plan review — interactive, like CEO and Eng review. Rates each design dimension 0-10,… | review the design plan, design critique, Designer, plan, review |
| `gstack-plan-devex-review` | Interactive developer experience plan review. Explores developer personas, benchmarks against compet… | DX review, developer experience audit, devex review, API design review, dx review |
| `gstack-plan-eng-review` | Eng manager-mode plan review. Lock in the execution plan — architecture, data flow, diagrams, edge c… | review the architecture, engineering review, lock in the plan, tech review, technical review |
| `gstack-plan-tune` | Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). Review wh… | tune questions, stop asking me that, too many questions, show my profile, what questions have I been asked |
| `gstack-qa` | Systematically QA test a web application and fix bugs found. Runs QA testing, then iteratively fixes… | qa, QA, test this site, find bugs, test and fix |
| `gstack-qa-only` | Report-only QA testing. Systematically tests a web application and produces a structured report with… | just report bugs, qa report only, test but don't fix, bug report, just check for bugs |
| `gstack-retro` | Weekly engineering retrospective. Analyzes commit history, work patterns, and code quality metrics w… | weekly retro, what did we ship, engineering retrospective |
| `gstack-review` | Pre-landing PR review. Analyzes diff against the base branch for SQL safety, LLM trust boundary viol… | review this PR, code review, pre-landing review, check my diff |
| `gstack-scrape` | Pull data from a web page. First call on a new intent prototypes the flow via $B primitives and retu… | scrape, get data from, pull, extract from, what's on |
| `gstack-setup-browser-cookies` | Import cookies from your real Chromium browser into the headless browse session. Opens an interactiv… | import cookies, login to the site, authenticate the browser |
| `gstack-setup-deploy` | Configure deployment settings for /land-and-deploy. Detects your deploy platform (Fly.io, Render, Ve… | setup deploy, configure deployment, set up land-and-deploy, how do I deploy with gstack, add deploy config |
| `gstack-setup-gbrain` | Set up gbrain for this coding agent: install the CLI, initialize a local PGLite or Supabase brain, r… | Use when:, ,, gbrain, this, coding |
| `gstack-ship` | Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, c… | ship, deploy, push to main, create a PR, merge and push |
| `gstack-skillify` | Codify the most recent successful /scrape flow into a permanent browser-skill on disk. Future /scrap… | skillify, codify, save this scrape, make this permanent |
| `gstack-sync-gbrain` | Keep gbrain current with this repo's code and refresh agent search guidance in CLAUDE.md. Wraps the … | sync gbrain, refresh gbrain, re-index this repo |
| `gstack-unfreeze` | Clear the freeze boundary set by /freeze, allowing edits to all directories again. Use when you want… | unfreeze, unlock edits, remove freeze, allow all edits |
| `gstack-upgrade` | Upgrade gstack to the latest version. Detects global vs vendored install, runs the upgrade, and show… | upgrade gstack, update gstack, get latest version, upgrade the tools, update the tools |

---

## 03_business (32)

| skill | description | trigger keywords |
|-------|-------------|------------------|
| `ad-creative` | "When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary t… | generate, iterate, scale, creative, headlines |
| `ai-seo` | "When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-g… | optimize, content, search, engines, cited |
| `churn-prevention` | "When the user wants to reduce churn, build cancellation flows, set up save offers, recover failed p… | reduce, churn, build, cancellation, flows |
| `cold-email` | Write B2B cold emails and follow-up sequences that get replies. Use when the user wants to write col… | cold outreach, prospecting email, outbound email, email to leads, reach out to prospects |
| `competitor-alternatives` | "When the user wants to create competitor comparison or alternative pages for SEO and sales enableme… | create, competitor, comparison, alternative, pages |
| `copywriting` | When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, … | write copy for, improve this copy, rewrite this page, marketing copy, headline help |
| `customer-research` | When the user wants to conduct, analyze, or synthesize customer research. Use when the user mentions… | customer research, ICP research, talk to customers, analyze transcripts, customer interviews |
| `email-sequence` | When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or… | email sequence, drip campaign, nurture sequence, onboarding emails, welcome sequence |
| `form-cro` | When the user wants to optimize any form that is NOT signup/registration — including lead capture fo… | form optimization, lead form conversions, form friction, form fields, form completion rate |
| `free-tool-strategy` | When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation… | engineering as marketing, free tool, marketing tool, calculator, generator |
| `launch-strategy` | "When the user wants to plan a product launch, feature announcement, or release strategy. Also use w… | plan, product, launch, feature, announcement |
| `lead-magnets` | When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation.… | lead magnet, gated content, content upgrade, downloadable, ebook |
| `legal-compliance` | 법률·compliance·규제·약관·프라이버시·개인정보 처리·결제 규제·국가별 사업자 셋업 작업 시 자동 활성화. TRIGGER 키워드 — 약관(ToS) · 개인정보처리방침(Pri… | compliance, TRIGGER, Privacy, Policy, GDPR |
| `market-intelligence` | 신규 사업 진입 전 시장을 체계적으로 이해하기 위한 순차적 리서치 프로세스 (MIP v1.0) |  |
| `marketing-ideas` | "When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product.… | needs, marketing, ideas, inspiration, strategies |
| `marketing-psychology` | "When the user wants to apply psychological principles, mental models, or behavioral science to mark… | apply, psychological, principles, mental, models |
| `onboarding-cro` | When the user wants to optimize post-signup onboarding, user activation, first-run experience, or ti… | onboarding flow, activation rate, user activation, first-run experience, empty states |
| `page-cro` | When the user wants to optimize, improve, or increase conversions on any marketing page — including … | CRO, conversion rate optimization, this page isn't converting, improve conversions, why isn't this page working |
| `paid-ads` | "When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), … | help, paid, advertising, campaigns, Google |
| `paywall-upgrade-cro` | When the user wants to create or optimize in-app paywalls, upgrade screens, upsell modals, or featur… | paywall, upgrade screen, upgrade modal, upsell, feature gate |
| `popup-cro` | When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conver… | exit intent, popup conversions, modal optimization, lead capture popup, email popup |
| `pricing-strategy` | "When the user wants help with pricing decisions, packaging, or monetization strategy. Also use when… | help, pricing, decisions, packaging, monetization |
| `product-marketing-context` | "When the user wants to create or update their product marketing context document. Also use when the… | create, update, their, product, marketing |
| `programmatic-seo` | When the user wants to create SEO-driven pages at scale using templates and data. Also use when the … | programmatic SEO, template pages, pages at scale, directory pages, location pages |
| `referral-program` | "When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-… | create, optimize, analyze, referral, program |
| `revops` | "When the user wants help with revenue operations, lead lifecycle management, or marketing-to-sales … | help, revenue, operations, lead, lifecycle |
| `sales-enablement` | "When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, o… | create, sales, collateral, pitch, decks |
| `schema-markup` | When the user wants to add, fix, or optimize schema markup and structured data on their site. Also u… | schema markup, structured data, JSON-LD, rich snippets, schema.org |
| `seo-audit` | When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user m… | SEO audit, technical SEO, why am I not ranking, SEO issues, on-page SEO |
| `signup-flow-cro` | When the user wants to optimize signup, registration, account creation, or trial activation flows. A… | signup conversions, registration friction, signup form optimization, free trial signup, reduce signup dropoff |
| `site-architecture` | When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL str… | sitemap, site map, visual sitemap, site structure, page hierarchy |
| `social-content` | "When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twi… | help, creating, scheduling, optimizing, social |

---

## 04_infra-platform (23)

| skill | description | trigger keywords |
|-------|-------------|------------------|
| `authentication-patterns` | Authentication and authorization patterns including OAuth2, JWT, RBAC, session management, and PKCE … | Authentication, authorization, patterns, including, OAuth2 |
| `aws-cloud-patterns` | AWS cloud patterns for Lambda, ECS, S3, DynamoDB, and Infrastructure as Code with CDK/Terraform | cloud, patterns, Lambda, DynamoDB, Infrastructure |
| `data-engineering` | Data engineering patterns for ETL pipelines, data warehousing, Apache Spark, and data quality valida… | Data, engineering, patterns, pipelines, data |
| `database-optimization` | Query optimization, indexing strategies, and database performance tuning for PostgreSQL and MySQL | Query, optimization, indexing, strategies, database |
| `django-patterns` | Django architecture patterns including DRF, ORM optimization, signals, middleware, and project struc… | Django, architecture, patterns, including, optimization |
| `docker-best-practices` | Docker best practices including multi-stage builds, compose patterns, image optimization, and securi… | Docker, best, practices, including, multi-stage |
| `golang-idioms` | Idiomatic Go patterns for error handling, interfaces, concurrency, testing, and module management | Idiomatic, patterns, error, handling, interfaces |
| `graphql-design` | GraphQL schema design, resolver patterns, subscriptions, DataLoader for N+1 prevention, and error ha… | GraphQL, schema, design, resolver, patterns |
| `kubernetes-operations` | Kubernetes operations including manifests, Helm charts, operators, troubleshooting, and resource man… | Kubernetes, operations, including, manifests, Helm |
| `llm-integration` | LLM integration patterns including API usage, streaming, function calling, RAG pipelines, and cost o… | integration, patterns, including, usage, streaming |
| `mcp-development` | MCP server development including tool design, resource endpoints, prompt templates, and transport co… | server, development, including, tool, design |
| `microservices-design` | Microservices design patterns including service mesh, event-driven architecture, saga pattern, and A… | Microservices, design, patterns, including, service |
| `mobile-development` | Mobile development patterns for React Native and Flutter including navigation, state management, and… | Mobile, development, patterns, React, Native |
| `nextjs-mastery` | Next.js 14+ App Router patterns including RSC, ISR, middleware, parallel routes, and data fetching | Next, Router, patterns, including, middleware |
| `postgres-optimization` | PostgreSQL optimization including indexes, query plans, partitioning, JSONB operations, and connecti… | PostgreSQL, optimization, including, indexes, query |
| `python-best-practices` | Pythonic code with modern type hints, dataclasses, async patterns, packaging, and testing | Pythonic, code, modern, type, hints |
| `react-patterns` | React 19 patterns including Server Components, Actions, Suspense, hooks, and component composition | React, patterns, including, Server, Components |
| `redis-patterns` | Redis patterns including caching strategies, pub/sub, streams for event processing, Lua scripts, and… | Redis, patterns, including, caching, strategies |
| `rust-systems` | Rust systems programming patterns including ownership, traits, async runtime, error handling, and un… | Rust, systems, programming, patterns, including |
| `security-hardening` | Application security covering input validation, auth, headers, secrets management, and dependency au… | Application, security, covering, input, validation |
| `springboot-patterns` | Spring Boot patterns including JPA repositories, REST controllers, layered services, and configurati… | Spring, Boot, patterns, including, repositories |
| `typescript-advanced` | Advanced TypeScript patterns including generics, conditional types, mapped types, template literals,… | Advanced, TypeScript, patterns, including, generics |
| `websocket-realtime` | Real-time communication patterns with WebSocket, Socket.io, Server-Sent Events, and scaling strategi… | Real-time, communication, patterns, WebSocket, Socket |

---

## 05_knowledge-and-memory (2)

| skill | description | trigger keywords |
|-------|-------------|------------------|
| `remember` | 세션에서 발견한 재사용 지식을 4분류(durable·working·preference·중복충돌)해 알맞은 적재처(auto-memory·_reference·logs·결재 등록)에 보존. 미검증 사실은 [UNCERTAIN] 표기·사실 저장 금지(SVOP 정합). full-loop S8이 참조 | 기억해, 메모리 저장, 이거 기록, remember, 적재, 지식 보존, 메모리 정리 |
| `sde-extractor` |  |  |

---

## 07_orchestration (1)

> 다단계 과제(조사+계획+구현+검증)를 자연 발화 1건으로 자동 진행하는 메타-오케스트레이션. 인간 게이트(계획 승인·외부 영향·재시도 한도)는 절대 우회하지 않음. 2026-06-10 신설 (플랜모드 승인).

| skill | description | trigger keywords |
|-------|-------------|------------------|
| `full-loop` | 자연어 지시 1건을 구체화→(조건부)시장조사→플랜모드 계획(보유 자원 124스킬·14에이전트 활용계획 표 의무 + AC 고정)→인간 승인→실행(opus·xhigh)→독립 검수→재실행(한도 3시도)→지식 적재까지 자동 진행하는 8단계 루프. Stop 훅 드라이버가 중단 시 재점화 + 컨텍스트 신호등(.ctx-state) 권고 병기, 상태 파일 `.claude/full-loop-state.local.json`. 단순 질의·1~2파일 수정엔 부적합 (v1.2) | 이거 자동으로 진행해줘, 풀 루프로, 풀루프, 끝까지 알아서 해줘, 전 과정 자동, 기획부터 검수까지, 야간 자동 진행, 자동 루프, full loop, autopilot |

---

## 글로벌 알파벳 인덱스 (부록)

- `ab-test-setup` → 01_dx-and-quality/ab-test-setup
- `accessibility-wcag` → 01_dx-and-quality/accessibility-wcag
- `ad-creative` → 03_business/ad-creative
- `ai-slop-cleaner` → 01_dx-and-quality/ai-slop-cleaner
- `ai-seo` → 03_business/ai-seo
- `analytics-tracking` → 01_dx-and-quality/analytics-tracking
- `api-design-patterns` → 01_dx-and-quality/api-design-patterns
- `authentication-patterns` → 04_infra-platform/authentication-patterns
- `aws-cloud-patterns` → 04_infra-platform/aws-cloud-patterns
- `churn-prevention` → 03_business/churn-prevention
- `ci-cd-pipelines` → 01_dx-and-quality/ci-cd-pipelines
- `cold-email` → 03_business/cold-email
- `competitor-alternatives` → 03_business/competitor-alternatives
- `content-strategy` → 01_dx-and-quality/content-strategy
- `continuous-learning` → 01_dx-and-quality/continuous-learning
- `copy-editing` → 01_dx-and-quality/copy-editing
- `copywriting` → 03_business/copywriting
- `customer-research` → 03_business/customer-research
- `data-engineering` → 04_infra-platform/data-engineering
- `database-optimization` → 04_infra-platform/database-optimization
- `design-system` → 01_dx-and-quality/design-system
- `devops-automation` → 01_dx-and-quality/devops-automation
- `diagram-design` → 01_dx-and-quality/diagram-design
- `django-patterns` → 04_infra-platform/django-patterns
- `docker-best-practices` → 04_infra-platform/docker-best-practices
- `email-sequence` → 03_business/email-sequence
- `form-cro` → 03_business/form-cro
- `free-tool-strategy` → 03_business/free-tool-strategy
- `frontend-excellence` → 01_dx-and-quality/frontend-excellence
- `full-loop` → 07_orchestration/full-loop
- `git-advanced` → 01_dx-and-quality/git-advanced
- `golang-idioms` → 04_infra-platform/golang-idioms
- `graphql-design` → 04_infra-platform/graphql-design
- `gstack` → 02_gstack-ops/gstack
- `gstack-autoplan` → 02_gstack-ops/gstack-autoplan
- `gstack-benchmark` → 02_gstack-ops/gstack-benchmark
- `gstack-benchmark-models` → 02_gstack-ops/gstack-benchmark-models
- `gstack-browse` → 02_gstack-ops/gstack-browse
- `gstack-canary` → 02_gstack-ops/gstack-canary
- `gstack-careful` → 02_gstack-ops/gstack-careful
- `gstack-claude` → 02_gstack-ops/gstack-claude
- `gstack-context-restore` → 02_gstack-ops/gstack-context-restore
- `gstack-context-save` → 02_gstack-ops/gstack-context-save
- `gstack-cso` → 02_gstack-ops/gstack-cso
- `gstack-design-consultation` → 02_gstack-ops/gstack-design-consultation
- `gstack-design-html` → 02_gstack-ops/gstack-design-html
- `gstack-design-review` → 02_gstack-ops/gstack-design-review
- `gstack-design-shotgun` → 02_gstack-ops/gstack-design-shotgun
- `gstack-devex-review` → 02_gstack-ops/gstack-devex-review
- `gstack-document-release` → 02_gstack-ops/gstack-document-release
- `gstack-freeze` → 02_gstack-ops/gstack-freeze
- `gstack-guard` → 02_gstack-ops/gstack-guard
- `gstack-health` → 02_gstack-ops/gstack-health
- `gstack-investigate` → 02_gstack-ops/gstack-investigate
- `gstack-land-and-deploy` → 02_gstack-ops/gstack-land-and-deploy
- `gstack-landing-report` → 02_gstack-ops/gstack-landing-report
- `gstack-learn` → 02_gstack-ops/gstack-learn
- `gstack-make-pdf` → 02_gstack-ops/gstack-make-pdf
- `gstack-office-hours` → 02_gstack-ops/gstack-office-hours
- `gstack-open-gstack-browser` → 02_gstack-ops/gstack-open-gstack-browser
- `gstack-pair-agent` → 02_gstack-ops/gstack-pair-agent
- `gstack-plan-ceo-review` → 02_gstack-ops/gstack-plan-ceo-review
- `gstack-plan-design-review` → 02_gstack-ops/gstack-plan-design-review
- `gstack-plan-devex-review` → 02_gstack-ops/gstack-plan-devex-review
- `gstack-plan-eng-review` → 02_gstack-ops/gstack-plan-eng-review
- `gstack-plan-tune` → 02_gstack-ops/gstack-plan-tune
- `gstack-qa` → 02_gstack-ops/gstack-qa
- `gstack-qa-only` → 02_gstack-ops/gstack-qa-only
- `gstack-retro` → 02_gstack-ops/gstack-retro
- `gstack-review` → 02_gstack-ops/gstack-review
- `gstack-scrape` → 02_gstack-ops/gstack-scrape
- `gstack-setup-browser-cookies` → 02_gstack-ops/gstack-setup-browser-cookies
- `gstack-setup-deploy` → 02_gstack-ops/gstack-setup-deploy
- `gstack-setup-gbrain` → 02_gstack-ops/gstack-setup-gbrain
- `gstack-ship` → 02_gstack-ops/gstack-ship
- `gstack-skillify` → 02_gstack-ops/gstack-skillify
- `gstack-sync-gbrain` → 02_gstack-ops/gstack-sync-gbrain
- `gstack-unfreeze` → 02_gstack-ops/gstack-unfreeze
- `gstack-upgrade` → 02_gstack-ops/gstack-upgrade
- `kubernetes-operations` → 04_infra-platform/kubernetes-operations
- `launch-strategy` → 03_business/launch-strategy
- `lead-magnets` → 03_business/lead-magnets
- `legal-compliance` → 03_business/legal-compliance
- `llm-integration` → 04_infra-platform/llm-integration
- `market-intelligence` → 03_business/market-intelligence
- `marketing-ideas` → 03_business/marketing-ideas
- `marketing-psychology` → 03_business/marketing-psychology
- `mcp-development` → 04_infra-platform/mcp-development
- `microservices-design` → 04_infra-platform/microservices-design
- `mobile-development` → 04_infra-platform/mobile-development
- `monitoring-observability` → 01_dx-and-quality/monitoring-observability
- `nextjs-mastery` → 04_infra-platform/nextjs-mastery
- `onboarding-cro` → 03_business/onboarding-cro
- `page-cro` → 03_business/page-cro
- `paid-ads` → 03_business/paid-ads
- `paywall-upgrade-cro` → 03_business/paywall-upgrade-cro
- `performance-optimization` → 01_dx-and-quality/performance-optimization
- `popup-cro` → 03_business/popup-cro
- `postgres-optimization` → 04_infra-platform/postgres-optimization
- `pricing-strategy` → 03_business/pricing-strategy
- `product-marketing-context` → 03_business/product-marketing-context
- `programmatic-seo` → 03_business/programmatic-seo
- `prompt-engineering` → 01_dx-and-quality/prompt-engineering
- `python-best-practices` → 04_infra-platform/python-best-practices
- `react-patterns` → 04_infra-platform/react-patterns
- `redis-patterns` → 04_infra-platform/redis-patterns
- `referral-program` → 03_business/referral-program
- `remember` → 05_knowledge-and-memory/remember
- `revops` → 03_business/revops
- `rust-systems` → 04_infra-platform/rust-systems
- `sales-enablement` → 03_business/sales-enablement
- `schema-markup` → 03_business/schema-markup
- `sde-extractor` → 05_knowledge-and-memory/sde-extractor
- `security-hardening` → 04_infra-platform/security-hardening
- `seo-audit` → 03_business/seo-audit
- `signup-flow-cro` → 03_business/signup-flow-cro
- `site-architecture` → 03_business/site-architecture
- `social-content` → 03_business/social-content
- `springboot-patterns` → 04_infra-platform/springboot-patterns
- `tdd-mastery` → 01_dx-and-quality/tdd-mastery
- `testing-strategies` → 01_dx-and-quality/testing-strategies
- `typescript-advanced` → 04_infra-platform/typescript-advanced
- `visual-verdict` → 01_dx-and-quality/visual-verdict
- `websocket-realtime` → 04_infra-platform/websocket-realtime

---

## 매칭 미달 시 처리

본 INDEX.md에 적합 skill이 없을 때 AI는:
1. "관련 skill 없음" 명시
2. `rules/unknown-modes.md` 5모드 중 UNKNOWN 마커 부착
3. 일반 응답으로 진행 (skill 없이)

---

## 갱신 로그

- **2026-05-27**: 초기 작성 (v1.0) — 활성 120개 skill 일괄 추출
- **2026-06-10**: 07_orchestration 카테고리 신설 — `full-loop` 1종 편입(자연 발화 → 8단계 자동 진행 루프, 플랜모드 승인). 헤더 버전·카테고리 합계의 기존 stale 표기도 실측값으로 정정 (전수 감사 발견 반영)
- **2026-06-11**: 외부 하네스 채택 신규 3종 편입 (v1.4) — 01_dx-and-quality에 `visual-verdict`(외부 클론, 비주얼 JSON 판정)·`ai-slop-cleaner`(외부 클론, 슬로프 삭제 우선 정리) 2종(18→20), 05_knowledge-and-memory에 `remember`(외부 클론+신규, 지식 적재·SVOP 정합) 1종(1→2). 활성 121→124. 거버넌스 결정(외부 하네스 채택 백로그)에 따른 집행, 키워드 훅(skill-keyword-injector.js)이 본 INDEX trigger-keywords를 추천 신호로 사용

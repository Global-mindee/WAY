# rules/fetch-policy.md

> **목적**: CLAUDE.md 5. 외부 데이터 조회(fetch) 정책의 상세 운영 규칙
> **적용 범위**: 모든 사실 단정이 답변에 포함되는 작업 (Mode 무관)
> **버전**: v1.0
> **출처**: `harness-blueprint.md` Item 2 + 영역 C + `CLAUDE.md` 5. / 8.

---

## 1. 주요 용어

- **사실 단정 (factual claim)**: 답변에 포함되는 수치·이름·날짜·고유명사·인용·정책 문장 등.
- **fetch**: 외부 데이터 조회 — 5종 + 1 출처(USER/READ/BASH/WEB/MEMORY/MCP) 중 하나를 도구로 호출.
- **5모드 보고**: fetch 실패 시 사용자에게 객관 보고하는 방식(UNKNOWN/PARTIAL/TOOL_FAILED/OUT_OF_SCOPE/UNCERTAIN).

---

## 2. fetch 의무 트리거

답변에 사실 단정이 1건이라도 포함되면 **Mode 무관**으로 fetch 의무 발동:

- Research Mode + 사실 단정 → fetch 의무
- Creative Mode + 사실 단정 → fetch 의무 (창작 본문 안의 구체 식별자 단위)

fetch 호출 0회 + 사실 단정 포함 → **답변 거부** (CLAUDE.md SVOP 3. R5).

응답 거부 시 표준 문구:
```
확인이 필요합니다. 어떤 출처를 사용할까요?
(1) 웹 검색  (2) 파일 읽기  (3) 명령 실행
```

---

## 3. 출처 우선순위 (6종)

> **USER → BASH → READ → MCP → WEB → MEMORY**

같은 사실에 두 출처가 충돌하면 위 순서로 우선 채택. 단 충돌 자체는 운영자에게 **명시**.

### 6종 출처 정의

| # | 출처 | 마커 | 도구 |
|---|------|------|------|
| 1 | USER | `[U]` | 사용자 직접 입력 |
| 2 | BASH | `[B: cmd]` | Bash 도구 출력 |
| 3 | READ | `[R: path:line]` | Read 도구 결과 |
| 4 | MCP | `(출처: <MCP명>, 신뢰도: <H/M/L>)` | Layer 3 외부 시스템 |
| 5 | WEB | `[W: url]` | WebFetch / WebSearch |
| 6 | MEMORY | `[M: entity]` | 메모리·이전 대화 |

MCP의 세부 신뢰도 분기는 `rules/mcp-trust-levels.md` 참조.

---

## 4. fetch 실패 시 — 5모드 보고

| 모드 | 의미 | 인라인 마커 |
|------|------|----------|
| UNKNOWN | 5종 출처 모두 시도했으나 결과 0건 | `[UNKNOWN]` |
| PARTIAL | 일부만 fetch 성공 | `[PARTIAL]` |
| TOOL_FAILED | 도구 자체 실패 (API 에러·네트워크 에러·타임아웃) | `[TOOL_FAILED]` |
| OUT_OF_SCOPE | LLM 능력·도구 범위 밖 | `[OUT_OF_SCOPE]` |
| UNCERTAIN | 데이터는 있으나 신뢰도 낮음 | `[UNCERTAIN]` |

**추측 fallback 절대 금지**. fetch 실패는 반드시 "I don't know" 발동 + 5모드 표면화.

---

## 5. WEB 출처 처리 (2026-05-27 결재 반영)

WebFetch / WebSearch 호출 시:
- URL 1줄 인용: `[W: https://example.com/path]`
- 본문 직접 인용은 큰따옴표로 포위 + 출처 URL 끝에 부착

### 도메인별 신뢰도 등급 (결재 완료)

| 도메인 유형 | 등급 | 표기 의무 |
|----------|------|---------|
| **기사·뉴스·논문** (정식 매체·학술지) | **High** | 생략 가능 |
| **유튜브·SNS** (X, Instagram, TikTok, LinkedIn 등) | **Medium** | `(출처: WEB, 신뢰도: Medium)` |
| 그 외 default (블로그·위키·기업 페이지 등) | **Medium** | `(출처: WEB, 신뢰도: Medium)` |

이는 `rules/mcp-trust-levels.md` 의 등급 체계와 호환. WEB Low는 본 결재에서 정의 안 했으며, 미확인 출처일 때 한해 `[UNCERTAIN]` 마커 부착으로 대체.

### 시장분석 웹 fetch — insane-search 우선 활용 (2026-06-27 v0.8.2 동기화)

**시장분석(market analysis) 목적으로 웹 조회(fetch)를 진행할 때는 `insane-search` 스킬을 우선 활용합니다.**

- **트리거**: 시장 규모·경쟁사·가격·점유율·트렌드·수요 등 시장분석 목적의 외부 웹 조회
- **이유**: 일반 WebFetch/WebSearch가 차단당하는 소스(X/Twitter, Reddit, Stack Overflow, LinkedIn, 커머스·소셜·뉴스 포털 등)를 **Phase 0 공식 API 라우터 → Phase 1 적응형 격자(curl_cffi TLS 임퍼소네이션) → Phase 3 Playwright** 순으로 적응형 접근(adaptive access) → 시장 데이터 누락·편향 방지
- **적용 규칙**:
  - 차단 가능성이 높은 소스(소셜·커머스·뉴스 포털·해외 사이트)는 **처음부터 insane-search 우선**
  - 일반 WebFetch/WebSearch가 차단·빈 결과·타임아웃 반환 시 **즉시 insane-search로 에스컬레이션** (5모드 보고 전 1차 시도)
  - 미설치 환경에서는 WebSearch 폴백 + `[PARTIAL]` 명시 (무음 강등 금지)
- **출처 표기**: insane-search 경유 결과도 WEB 출처로 동일 표기 — `[W: <url>]`
- **출처(attribution)**: insane-search **v0.8.2** by **fivetaku**, MIT License — `github.com/fivetaku/insane-search`, `gptaku-plugins` 마켓플레이스. 외부 플러그인이므로 공개본은 코드 미포함·참조/설치 안내만 제공합니다.
- **유의**: 본 도구는 접근 제한 우회(TLS 임퍼소네이션 등) 성격을 가지므로, 적법한 시장조사·연구 목적에 한해 사용합니다.
- **신규 인지 (v0.8.2)**: v0.8.0부터 호스트별 성공 경로를 `~/.insane_search/learned.json`(홈·git 외부)에 캐시하는 자가학습 추가(라우팅 힌트, `INSANE_LEARN=0`로 비활성). v0.6.0부터 SSRF/리다이렉트 가드·curl_cffi≥0.15.0 적용.

---

## 6. MEMORY 출처 처리

- 메모리 호출 시 `[M: ...]` 마커 부착 — 스토어 구분: `[M: auto/<이름>]`(내장 auto-memory 정본) / `[M: harness/<tier>/<이름>]`(하네스 3-Tier 승격분) (거버넌스 결정)
- 메모리는 **시간이 흐를수록 stale 위험**: 사용 전 현재 파일 상태로 재검증 (CLAUDE.md 11절 메모리 라이프사이클)
- 새 사실 단정 → MEMORY 단독으로 부착 시 신중 (가능하면 READ·BASH로 cross-check)

---

## 7. 예시 시나리오

**시나리오 A — 단순 사실 질의**
- 입력: "특정 금융기관의 식별코드(SWIFT 등)를 알려줘"
- 처리: WebSearch fetch → 결과 1건 → `[W: <url>]` 부착 답변
- 추측 fallback 금지 시그널: 금융기관 식별코드를 기억으로 단정했다가 실제 코드와 어긋난 환각 사례가 SVOP 활성화 트리거였음

**시나리오 B — fetch 실패**
- 입력: "어제 프로젝트 예시의 매출"
- 처리 시도: DB MCP → 결과 0건 → UNKNOWN
- 답변: "[UNKNOWN] 확인된 정보 없음. 시도한 출처: DB MCP(0건). 다른 출처를 알려주시면 재시도하겠습니다."

**시나리오 C — 출처 충돌**
- 입력: "이번 주 화요일 일정"
- 캘린더 MCP: "팀 미팅 14:00"
- 메일 MCP (수신함 자동발송): "팀 미팅 15:00"
- 처리: 두 출처 모두 명시 + PARTIAL 매핑 + Critical 작업이면 Best-of-N 진입 (`rules/critical-path.md`)

---

## 8. 답변 거부 시점 (가장 무거운 안전망)

다음 3조건이 동시에 성립하면 답변 거부:
1. 사실 질의가 들어옴
2. 도구 호출 0회
3. 답변에 미검증 사실([?]) 포함 예정

→ "확인이 필요합니다" 발화 + 출처 옵션 3종 제시.

---

## 9. 결재 이력 (예시 골격)

- WEB 도메인 신뢰도 등급 정식화 결재 기록을 `decisions/archive/`에 남깁니다.
- **MEMORY 단독 사실 단정 정책**: 미해결 (cross-check 의무 명문화 vs 권고 수준 미결정 — 필요 시 추가 결재 등록 가능)

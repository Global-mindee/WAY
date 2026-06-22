# W.A.Y? — Harness/Loop : Who Are You?

<p align="center">
  <img src="../../assets/hero.png" alt="W.A.Y? — Harness/Loop : Who Are You?" width="100%">
</p>

**한국어** | [English](README.en.md) | [中文](README.zh.md)

![License](https://img.shields.io/badge/license-MIT-blue) ![Built for](https://img.shields.io/badge/built%20for-Claude%20Code-8A2BE2) ![For](https://img.shields.io/badge/for-non--developers-orange) ![Harness](https://img.shields.io/badge/harness-v0.1-green)

**함께 포함된 Repo : 인사이트 주신 @fivetaku님께 감사드립니다 :)** [insane-search](https://github.com/fivetaku/insane-search) · [deep-research](https://github.com/fivetaku/gptaku_plugins) — [fivetaku](https://github.com/fivetaku) 제작 (MIT) · 전체 출처 [CREDITS.md](../../CREDITS.md) 

> *"가장 개인적인 게 가장 창의적인 것이다."* — 마틴 스코세이지

저는 개발자가 아니며, 프로그램 전문가가 아닙니다. 하지만 기획 분야에서 일하며 폭넓게 일하는 사람이라고 생각해요. 작년부터 AI 씬에 유명한 사람들의 말들을 쫓아다니며, 안드레 카파시의 wiki, 개리 탄의 gstack 등 수많은 유명인들의 harness, skills, loop 등을 사용해 봤지만 그건 제 것도 아니고, 제 것이 아니기에 제가 원하는 결과를 만들어 내기 어려웠습니다.

결국 현시점에 내린 결론은 가장 개인적인 게 가장 효과적인 것(마치 마틴 스코세이지가 한 말처럼요)이라는 것입니다. 개인마다 생각하는 방식과 AI에게 말하는 방식, 기대하는 내용 등 하나부터 열까지 모두 다를 수밖에 없습니다.

그래서 준비했습니다. 가장 개인적인 것을 만들어내기 위해 필요한 키트와 최소한의 안정성을 확보하는 기능이요! W.A.Y?(Who Are You?) 하네스/루프는 지금까지 여러분이 작업해 온 각자의 Claude에 축적되어 있는 세션과 memory를 읽고, 개인의 업무 방식과 발화 특징, 기대 결과 등을 추측해 당신만의 하네스를 만들어 주는 초보자 키트입니다.

가장 기본적으로 지켜져야 한다고 생각하는 부분을 구조적으로 준비해 보았습니다. 3가지 핵심 개념과 1개의 핵심 도구(/full-loop), 9개의 기초적인 규칙(철학이?) 담겨 있습니다 :)

이렇게 만들어 놓은 키트도 결국 당신을 완전히 대변하지는 못할 겁니다. 이것을 기반으로 더욱 당신다운 환경을 정교하고도 유연하게 키워가시길 추천드립니다.

---

## W.A.Y?가 강조하는 세 가지

### (1) 신뢰성 확보 : 할루시네이션 방지 — SVOP (Source-Verified Output Protocol, default-deny)

모든 사실 주장은 6종의 신뢰 출처 중 하나로 추적되어야 합니다: **USER, READ(파일),
BASH(셸), WEB, MEMORY, MCP(외부 시스템).** 그 외의 것은 단정하지 않습니다 — 자신 있는
추측으로 매끄럽게 덮는 대신, 보류한 뒤 5가지 정직 모드(honesty mode) 중 하나로 보고합니다.
빈자리 채우기 없음, "보통 / 아마" 없음, 사용자가 원할 듯한 답 합성 없음. 이 규칙은 실제
실패(그럴듯하지만 틀린 코드로 환각된 금융기관 식별코드 사례)에서 태어나 일반화되었습니다.
출처가 비었으면 그렇다고 말하고, 어떤 출처를 시도했는지 명시합니다.

### (2) 일관성 : 깨지지 않는 핵심 구조 (불변성)

이것이 하네스의 핵심 명제입니다 — 규칙은 간단명료할수록 강하지만, 어떤 상황에서도 깨지지
않아야 합니다. 깨지지 않는 소수의 핵심 규칙은 휘어지는 많은 규칙보다 강합니다. 작업·머신·
모델이 달라져도 구조가 그대로이기에(불변성 원칙), 하네스는 프로젝트를 가로지르는 *불변의
OS*처럼 작동합니다. 이 예측 가능성이 곧 (1) 할루시네이션 방지와 (3) 지식 축적이 매번 동일하게
작동하는 토대입니다.

### (3) 복리 성장 : 새지 않는 지식 축적

각 작업은 하네스를 조금 더 유능하게 남길 수 있습니다 — 리서치 산출물은 올바른 지식
저장소로, 교훈은 기억으로, 한 줄 이벤트는 로그로 — 운영 데이터 누출 없이 전부. 하네스는
시간이 지나며 복리로 쌓이며, 견고한 지식을 결코 조용히 덮어쓰지 않습니다.

### +alpha 슬래쉬 커멘드: /full-loop

위 세 속성이 토대입니다. **full-loop**는 그 보상입니다 — 하나의 지시를 8단계에 걸쳐
끝까지 실행하되, 중요한 인간 게이트(human gate)에서만 멈춥니다. 아래
["full-loop"](#full-loop--종단-간end-to-end-오케스트레이션)을 참조하세요.

---

## 철학

### 원칙 (P1–P6)

- **P1 Plan-First** — 원하는 결과가 구체적으로 정의되기 전에는 어떤 작업도 시작하지
  않습니다.
- **P2 Sync-Before-Execute** — 사용자와 AI가 약 90% 정렬된 뒤에만 실행을 시작합니다.
- **P3 Plan–Execute Separation** — 계획은 인간 주도, 실행은 AI 주도. 절대 섞지 않습니다.
- **P4 Immutability** — 구조는 환경과 모델이 달라도 동일하게 작동합니다.
- **P5 Data-Driven Dependency** — 새로운 데이터나 새로운 관점을 가져올 때만 의존을
  받아들입니다. 얇은 프롬프트 래퍼(wrapper)는 거부합니다.
- **P6 Operational One-Way + Meta Feedback** — 데이터는 새지 않되, 교훈은 수집됩니다.

### 안티원칙 (AP1–AP3)

무엇이 원칙이 *아닌지* 선언하는 것은, 무엇이 원칙인지 선언하는 것만큼 중요합니다.

- **AP1 비결정성은 자산이다** — 같은 입력에서 출력이 달라지는 것은 정상이며 환영합니다.
  하네스는 그 변동성을 억제하지 않습니다.
- **AP2 명시성은 원칙이 아니다** — 모든 출력의 완전한 감사 가능성은 목표가 아닙니다.
  검증을 당신에게 떠넘기기 위해서가 아니라, 메타 피드백을 위한 가벼운 로그만 둡니다.
- **AP3 능동적 데이터 격리 없음** — 시간·신호 기반 자동 약화(auto-staling)는 없습니다.
  계층(tier)과 신뢰도는 새 데이터가 기존 것에 도전할 때만 바뀌며(push 기반), AI는 분석만
  제공하고 결정은 당신이 합니다.

---

## 다섯 가지 신뢰 메커니즘

| # | 메커니즘 | 하는 일 |
|---|----------|---------|
| 1 | **Mode Toggle** | 각 작업을 사실 우선·창작 우선·혼합으로 자동 분류하고(혼합은 보수적 선택인 research로 기본 설정), 검증 엄격도를 조정합니다. 당신의 한 줄 override로 전환됩니다. |
| 2 | **출처 조회(fetch) 정책** | 사실 주장(수치·이름·날짜·고유명사·인용)은 Mode 무관 의무 조회를 발동합니다. 출처 우선순위: USER → BASH → READ → MCP → WEB → MEMORY. 추측 fallback 없음. |
| 3 | **다섯 가지 정직 모드** | 조회 실패 시 하네스는 추측하지 않고 UNKNOWN, PARTIAL, TOOL_FAILED, OUT_OF_SCOPE, UNCERTAIN으로 — 인라인 및 답변 끝 요약으로 — 보고합니다. |
| 4 | **Critical Path + Best-of-N** | 고위험 작업(외부 영향, 하류 자동화 연계, 되돌리기 비용 큼, 또는 당신이 "중요" 표시)은 research 모드·의무 조회·**Best-of-N 검증(N=3)** 을 강제합니다: 3/3 일치 → 채택; 2/1 → 불일치 마커와 함께 채택; 모두 다름 → 보류 후 당신에게 질의. |
| 5 | **MCP 출처 신뢰도 등급** | 외부 시스템 데이터를 High / Medium / Low로 등급화합니다. Medium·Low는 출처를 명시해야 하며(Low는 사유까지 명시). 충돌 시 두 출처를 모두 노출하고, Critical 작업이면 Best-of-N으로 흐릅니다. |

상세 규칙은 [`rules/`](../../rules/) 아래에 있습니다: `mode-toggle.md`, `fetch-policy.md`,
`unknown-modes.md`, `critical-path.md`, `mcp-trust-levels.md`.

---

## 사용자 모델의 진화

자기 정의는 동결되어 있지 않습니다. 네 가지 메커니즘을 통해 진화하지만, 새 데이터가 기존
것에 도전할 때만 — 그리고 실질적 변경은 당신의 승인을 거치며, 결코 조용한 자기 재작성은
없습니다(AP3와 정합).

- **SDE (Self-Definition Extraction)** — 당신의 맥락을 읽어, 신뢰도 마커와 함께 다섯 영역
  모델을 초안 작성/갱신하는 추출기.
- **변경 추적** — `self/changelog.md`가 시간에 따른 모델 변화를 기록합니다.
- **갭 추적** — `self/conflicts.md`가 미해결 긴장과 열린 질문을 덮지 않고 보관합니다.
- **3계층 기억** — 승인된 지식의 승격 보관소:

| 계층 | 위치 | 접근 |
|------|------|------|
| Public | `memory/public/` | 명시 호출 (승격된, 승인된 지식) |
| Quarantine | `memory/quarantine/` | 명시 호출만 |
| Archive | `memory/archive/` | 명시 호출만, **절대 삭제 안 함(never deleted)** |

MEMORY 출처의 정본(canonical)은 CLI 내장 auto-memory입니다. 하네스 `memory/` 계층은
승인을 통과한 지식의 승격 보관소입니다.

---

## full-loop — 종단 간(end-to-end) 오케스트레이션

**full-loop**는 하나의 자연어 지시를 받아, 8단계에 걸쳐 자율적으로 실행합니다:

1. 프롬프트 구체화(작업 구조화, 의도 분류, 모호성 점수화)
2. 조건부 시장/웹 리서치
3. 동결된 **수용 기준(acceptance criteria)** 과 함께하는 플랜 모드 계획
4. **인간 승인** (게이트)
5. 실행
6. 독립 검수(Claude 검수, 그리고 선택적 이종 codex 검수)
7. 제한된 재시도 — 최대 **3회** 시도
8. 지식 적재

세 개의 인간 게이트는 **결코 우회되지 않습니다**:

- **계획 승인** — 실행 전에 당신이 계획(과 사전 위임된 외부 행위)을 승인합니다.
- **외부 영향** — 외부 세계에 닿는 행위(push, 발송, API 호출)는 계획과 함께 사전 승인되거나,
  루프가 계속 도는 동안 큐에 담겨 지연된 뒤, 최종 보고에서 결정됩니다. 도구 수준 가드가 이를
  강제하며, 모델의 자기 보고에 의존하지 않습니다.
- **재시도 소진** — 예산 내에 기준을 충족할 수 없으면, 거짓 성공을 선언하는 대신 정직하게
  멈추고 질의합니다.

다단계 작업 — 리서치 + 계획 + 빌드 + 검증 — 에, 인간 게이트에서 멈추는 무인 야간 실행을
포함해 사용하세요. 한 줄 수정이나 빠른 질문에는 **사용하지 마세요**. 참조:
[`skills/07_orchestration/full-loop/SKILL.md`](../../skills/07_orchestration/full-loop/SKILL.md).

> **독립 공개 배포 예정(다음 작업).** full-loop는 단독으로 사용·기여할 수 있도록 별도의
> 독립 저장소로 분리될 예정입니다.

---

## 어떻게 시작하나요

1. 이 저장소를 clone 합니다.
2. Claude Code에서 `sde-extractor`를 실행하면(또는 `/full-loop`로 온보딩), 당신의 CLI에
   쌓인 세션과 기억(memory)을 읽어 self-definition 초안을 만들어 줍니다.
3. 초안을 검토하고 승인하면, 당신만의 하네스가 작동합니다.

자세한 절차는 아래 [빠른 시작](#빠른-시작-quick-start)과 [온보딩 가이드](ONBOARDING.ko.md)에,
더 깊은 배경은 [CONCEPT.ko.md](CONCEPT.ko.md)에 있습니다.

---

## 디렉터리 구조

| 경로 | 역할 |
|------|------|
| `CLAUDE.md` | 모든 AI 에이전트가 여기서 작업 시작 시 자동 로드하는 베이스 지침 |
| `harness-blueprint.md` | 하네스 설계 문서 |
| `self/` | 당신의 통합 자기 정의 + 변경/갭/배경 로그 |
| `memory/` | 3계층 기억 (public / quarantine / archive) |
| `rules/` | 상세 운영 규칙 (mode-toggle, fetch-policy, unknown-modes, critical-path, mcp-trust-levels, context-management, p6-log-anonymization) |
| `agents/` | 작업 유형별 서브 에이전트 정의 (+ INDEX, USAGE-GUIDE) |
| `skills/` | 재사용 가능한 스킬 모듈 (`sde-extractor`, `full-loop` 포함) (+ INDEX, USAGE-GUIDE) |
| `decisions/` | 결재 큐 (`pending.md`) + 보관 |
| `logs/` | operations / decisions / meta-feedback 로그 |
| `projects/` | 프로젝트별 메타 정보만 (실제 운영 데이터는 외부 저장소에 있음) |
| `_reference/` | 외부 참조 자료 (인용/인사이트용, 실행용 아님) |
| `docs/i18n/` | 현지화된 README (ko / en / zh) |

---

## 요구 사항

| 요구 사항 | 필요한 이유 |
|-----------|------------|
| **Claude Code** (또는 당신의 기억·git 이력·설정을 읽을 수 있는 모든 CLI 에이전트) | 하네스 실행 및 추출 단계 |
| **git** | 저장소 클론; 추출기가 당신의 커밋 리듬을 읽습니다 |
| 선택 플러그인: **insane-search**, **deep-research** | 더 강력한 웹 리서치 (차단된 출처 우회, 다중 출처 사실 검증) |
| 선택: **codex / GPT-5.5** (유료, opt-in) | full-loop 내부의 이종(cross-vendor) 독립 검수 |

앞의 두 가지만 필수입니다. 나머지는 전부 opt-in이며, 없어도 하네스는 작동합니다.

---

## 시작하기

### 빠른 시작 (Quick Start)

```bash
# 1. 하네스를 클론합니다
git clone https://github.com/Global-mindee/WAY.git
cd WAY

# 2. (선택) Claude Code 안에서 웹 리서치 플러그인을 설치합니다
/plugin install insane-search
/plugin install deep-research

# 3. 온보딩 — 추출기가 당신의 CLI 기억·git·설정을 읽어,
#    당신의 자기 정의(self-definition)를 초안으로 작성합니다
run the sde-extractor

# 4. 초안을 검토한 뒤, decisions/pending.md에서 승인합니다
#    (당신이 승인하기 전까지 실질적인 것은 아무것도 적용되지 않습니다)
```

짧은 체크리스트입니다 — 클론, (선택) 플러그인(`insane-search`, `deep-research`) 설치,
`sde-extractor` 실행, 자기 정의 검토 및 승인, 그러면 하네스가 가동됩니다. 각 단계는 자신이
건드리는 파일을 명시합니다.

전체 안내: [`ONBOARDING.ko.md`](ONBOARDING.ko.md).

---

## 사용 예시

하네스는 평범한 말로 움직입니다 — 특별한 문법이 없습니다. 자주 쓰는 시작 문구 몇 가지:

- **무언가를 종단 간으로 실행:** *"이거 full-loop 돌려줘"* / *"끝까지 알아서 하고, 게이트에서만
  물어봐"* — 8단계 자율 루프를 시작해, 계획 승인·외부 영향·재시도 소진에서만 멈춥니다.
- **온보딩 또는 재온보딩:** *"sde-extractor 실행해줘"* / *"내 기억 다시 읽고 자기 정의 갱신해줘"*
  — 쌓인 맥락에서 당신의 사용자 모델을 초안 작성하거나 갱신합니다.
- **결재 큐 처리:** *"결재 대기 중인 항목 보여줘"* — `decisions/pending.md`에서 대기 중인 항목을
  노출합니다. 당신은 파일을 편집해 승인합니다.
- **출처가 달린 심층 리서치:** *"X를 출처와 함께 조사해줘"* — 웹 검색을 펼쳐 주장을 검증하고,
  추측 대신 출처가 달린 보고서를 돌려줍니다.

---

## 서드파티 출처

W.A.Y?는 다른 이들의 작업 위에 서 있습니다 — 선택적 `insane-search`·`deep-research`
플러그인(fivetaku, MIT / 업스트림), 선택적 이종 codex / GPT-5.5 검수자(OpenAI, 유료,
opt-in), 그리고 insane-search 자체의 의존성. 전체 출처 표기와 라이선스:
[`CREDITS.md`](../../CREDITS.md).

라이선스: MIT — [`LICENSE`](../../LICENSE) 참조.

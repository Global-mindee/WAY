# CHANGELOG — W.A.Y?

> 세션 단위 변경이력 (사람이 읽는 통합 기록).
> 보조 이력: `git log`(커밋) · `logs/operations.log`(이벤트) · `decisions/archive/`(결재) · 각 `rules/*.md`·`CLAUDE.md`의 "버전".
> 형식: 날짜 역순. 각 엔트리 = 무엇 · 왜 · 변경 · 근거 · 검증 · 미해결.

---

## v1.0 — 공개본 초기 릴리스

**무엇**: W.A.Y?(Who Are You? : I'm not a developer) 공개본 초기 릴리스. 한 1인 운영자용 개인 AI 협업 하네스의 구조적 개념을, 누구나 자기 Claude Code 환경에 적용할 수 있도록 일반화하여 공개합니다.

**핵심 구성**:
- 할루시네이션 방지(SVOP) — 6종 출처 검증 + 모름 5모드(UNKNOWN/PARTIAL/TOOL_FAILED/OUT_OF_SCOPE/UNCERTAIN)
- 신뢰성 운영 규칙(`rules/`) — Mode Toggle(Research/Creative) · fetch 의무 · Critical Path Best-of-N(N=3) · MCP 3단계 신뢰도
- 사용자 모델 진화(`self/`) — self-definition 5영역(정체성·지식·사고방식·작업패턴·선호) + SDE 자기정의 추출 + 변화추적·Gap 추적·메모리 3-Tier
- 자동화 루프 — full-loop 8단계 오케스트레이션(계획 승인·외부 영향·재시도 한도 인간 게이트 3곳)
- 온보딩 — `sde-extractor`가 사용자 자신의 메모리·git·설정을 분석해 `self/self-definition.md`를 자동 생성

**온보딩 진입**: `ONBOARDING.md`(또는 `docs/i18n/ONBOARDING.{ko,en,zh}.md`). 3개국어 언어팩 `docs/i18n/`.

**제3자 출처**: `CREDITS.md` — insane-search(fivetaku, MIT) · deep-research · codex 등 외부 도구 출처 명시.

**다음 예정**: full-loop 독립 레포 분리 공개.

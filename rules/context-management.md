# rules/context-management.md

> **목적**: CLAUDE.md 15. 세션·컨텍스트 관리 정책의 상세 운영 규칙
> **적용 범위**: 컨텍스트 윈도우 소비 관리 — context rot 방지·세션 분할·압축·서브에이전트 격리
> **버전**: v1.0
> **출처**: 4중 리서치(시장조사 12소스 + GitHub deep-research 99에이전트 + 계획비평 11에이전트 + scope 5차원) + `self/self-definition.md` D영역 승격

---

## 1. 목적·배경 (왜 이 규칙이 필요한가)

컨텍스트 윈도우가 길어질수록 출력 품질이 측정 가능하게 저하된다 (**context rot, 컨텍스트 부패**). 윈도우가 가득 차지 않아도 발생한다.

- Chroma 연구: 18개 프런티어 모델(Claude·GPT·Gemini·Qwen) 전수가 입력 길이 증가에 따라 저하 [W: trychroma.com/research/context-rot]
- Databricks: 대부분 모델이 32K~64K 토큰 초과 시 RAG 성능 저하 시작 [W: databricks.com/blog/long-context-rag-performance-llms]
- 추론(reasoning) 작업이 가장 빨리 붕괴 — "컨텍스트의 10~20%만 효과적 활용" [W: agentpatterns.ai]

**핵심 명제**: 컨텍스트는 유한 자원(finite resource)이며 토큰마다 attention budget(주의력 예산)을 소진한다 [W: anthropic.com/engineering/effective-context-engineering-for-ai-agents]. 본 규칙은 `self-definition.md` D영역 "세션 관리 의식"(개인 의식)을 **시스템 규칙으로 승격**한 것이다.

---

## 2. 목표 지표 (작업유형별 하이브리드)

**절대 토큰을 모델 무관 1차 축, 소비율 %를 보조**로 한다. (1M 윈도우에서 30%=300K는 이미 저하 구간이므로 % 단독은 오해를 부른다.)

| 작업 유형 | Green (정상) | Yellow (정리 권고) | Red (분할·압축) |
|----------|-------------|------------------|----------------|
| **일반 작업** | < 100K (또는 <30%) | 100K~200K (또는 30~50%) | > 200K (또는 >50%) |
| **추론·고정밀** | < 32K | > 32K | > 64K |

- **분모(%)**: 활성 모델 공시 윈도우(opus-*[1m]=1M, sonnet=200K). 모델 미식별 시 **절대 토큰 단독** 적용.
- "추론·고정밀"은 정밀 판단이 결과를 좌우하는 작업(결재 판단·법적 근거·수치 추정 등). `critical-path.md`의 "Critical 4기준"과는 별개 개념(동음이의 주의).
- 초기 수치이며 운영 중 P6 메타피드백으로 조정한다 (자동 약화 없음 — AP3).

---

## 3. 신호등별 조치

| 신호 | 조치 |
|------|------|
| **Green** | 정상 진행. 별도 조치 없음 |
| **Yellow** | (1) 노이즈 큰 작업(grep 스윕·웹조사·대량 파일 읽기)을 서브에이전트로 격리(5. 규약) (2) 중간 산출물을 파일로 flush(`memory/` 또는 `$CLAUDE_JOB_DIR/tmp`) |
| **Red** | (1) 식별자·미해결 이슈를 파일로 **선제 flush** 후 (2) 수동 새 세션 권고 또는 능동 `/compact` (3) 응답 끝 5모드에 [UNCERTAIN] 부착(7. 참조) |

**추론·고정밀 + Best-of-N 진행 중 Red 도달 시**: 압축보다 **각 시도를 서브에이전트로 격리**(메인 컨텍스트 보호)를 우선한다. Best-of-N(N=3)은 토큰을 3배 소모하므로(`critical-path.md` 제3조·제4조), 격리로 메인 점유를 낮춘 뒤 완수한다.

---

## 4. 압축(Compaction) 규약 — SVOP 정합

요약은 정보를 손실한다 (요약 시 정확도 66.7%→57.1% 하락 보고 [W: devocean.sk.com]). 따라서:

1. **출처 마커 무손실(loss-less marker)**: [U]/[R]/[B]/[W]/[M]/[?] 마커가 붙은 사실 단정은 **값과 마커를 한 단위로 보존**한다. 마커만 분리 폐기 금지. (출처 소실은 SWIFT 환각 사고와 동형의 위험 — SVOP 창설 트리거.)
2. **정확 식별자 보존**: 코드·번호·결재 내용·파일경로·에러 메시지는 요약 금지, 파일 보존(Write)한다. 보존 우선순위 = 아키텍처 결정·미해결 이슈 보존, 중복 출력 폐기 [W: anthropic.com].
3. **선제 flush**: auto-compact(~95%) 전 Red 시점에 보존 대상을 `memory/`·`$CLAUDE_JOB_DIR/tmp`로 능동 flush 후 `/compact`. 자동 요약이 마커를 보존한다는 보장이 없으므로, Red 기본값은 "자동 /compact"보다 "수동 flush 후 새 세션".
4. **auditor 정합**: 압축 요약 응답은 (a) 보존 마커를 그대로 인용해 단정형이라도 출처 동반, (b) 끝에 [검증:] 통계 마커 재집계. (svop-auditor의 `no_tool_with_assertion`·`missing_stats_marker` 오탐 방지.)

---

## 5. 서브에이전트 격리 규약

- 노이즈 큰 작업(대량 검색·웹 조사·로그 트롤)은 서브에이전트로 격리하고 **1~2K 요약만 반환**받는다 [W: anthropic.com].
- 에이전트에 본문 전체를 주입하지 말고 **파일 경로 참조**를 권고(인라인 주입 비용 절감).
- **서브에이전트 자체 컨텍스트 측정은 [OUT_OF_SCOPE]**: 모니터는 메인 세션만 측정한다. 격리의 효과는 메인 윈도우 소비 감소로만 한정해 정직하게 본다.

---

## 6. 자동화 적용 매트릭스 (P4 정정 — 정책 불변·메커니즘 환경별 차등)

P4(환경 무관)는 **"정책은 환경 불변, 메커니즘은 환경별 차등"**으로 적용한다.

| 환경 | 측정 메커니즘 |
|------|--------------|
| Claude Code CLI (로컬 작업 머신) | 훅 자동 측정(8. 참조) |
| claude.ai 웹 (훅 미지원 환경) | 훅 미지원 → **LLM 자가 체크**(턴마다 컨텍스트 길이 자각 + 메타 질문) |

웹 환경은 훅이 없으므로 `self-definition.md` "현재 세션 계속 vs 새 세션" 메타 질문을 수동 폴백으로 유지한다.

---

## 7. 로그·모름 모드 연계

- **로그 출처 표기**: 신호등 이벤트의 토큰 수치는 정확 측정 시 `[B: usage]`, 바이트 fallback 시 `[?]+UNCERTAIN`으로 표기. (무출처 수치가 P6 통계를 오염시키지 않도록.)
- **Red → 모름 모드**: Red 도달 시 응답 끝 5모드 요약에 [UNCERTAIN] 또는 [OUT_OF_SCOPE] 1건 부착(컨텍스트 부패로 응답 신뢰도 저하 가능). `rules/unknown-modes.md`와 연계.
- **신호등 ↔ 알림 3계층**: Green=무알림 / Yellow=알림 계층 1 1줄 / Red=계층 1 강조. 컨텍스트 경고는 결재 큐와 **별도 채널**(stderr `CTX:` 프리픽스).
- **로그 위치**: `logs/context-usage.local.log` (.gitignore — git churn 회피). 상태 전이(Green→Yellow→Red) 시 **1회만** 기록(de-dup).

---

## 8. 훅 자동화 (project-scoped)

- **위치**: `WAY/.claude/settings.json` (project-scoped — 글로벌 `~/.claude` 미오염, blast radius 격리).
- **measure**: `context-usage-monitor.js` (Stop 훅) — transcript 마지막 assistant `.message.usage`에서 `input_tokens + cache_read_input_tokens + cache_creation_input_tokens` 합산 (**누적 금지** — 이중계상 시 169% 폭증 [W: claude-code/issues/13783]). 부재 시에만 바이트 근사 fallback([UNCERTAIN]).
- **cadence**: Stop 훅은 **턴 경계 1회** 발동(매 응답 아님). 멀티툴 턴 진행 중 폭주 구간은 미포착(한계 명시).
- **안전계약**: try/catch + finally `process.exit(0)`, stdin 2초 타임아웃, 손상 JSON skip, 대용량 transcript tail-only. (`svop-auditor.js` 패턴 차용.)
- **경로 가드**: `cwd/logs/` 존재 시에만 append(없으면 no-op, 신규 생성 금지). worktree는 `git rev-parse --git-common-dir`로 메인 레포 logs 통일.
- **PreCompact 훅**: `context-compact` 이벤트 기록 + trigger(manual/auto) 구분. exit(0) 보장.
- **변경 0단계**: `settings.json.bak-{날짜}` 백업 선행. 롤백 = 신규 훅 제거 → JSON.parse 재검증 → 새 세션 확인.

---

## 9. 우선순위 충돌

CLAUDE.md 14. 우선순위 적용:
1. 외부 영향 작업의 명시 요청 대기
2. SVOP default-deny — 부정확한 수치로 비가역 조치(세션 분할) 강제 금지
3. 운영자 override
4. 자동 분류
5. 본 규칙의 권고

신호등 Red는 **권고**이며 강제 실행이 아니다 (2번 정합).

---

## 10. tech 검증 항목 (미확인 — 훅 운영 중 실측)

다음은 "확인 안 됨"이며 운영 중 실측해 정교화한다:
1. statusLine `used_percentage`가 auto-compact 후 refresh되는가
2. PreCompact 입력 스키마(토큰 수 포함?)·exit-2 block 신뢰성·auto/manual 구분
3. SubagentStop 별도 발동 + 서브에이전트 transcript 측정 가능성
4. Stop 훅 cadence(턴 경계) 재확인 + 멀티툴 턴 진행 중 미발동 구간
5. 단일 usage vs 바이트 근사 오차율

**1차 실측** [B]: transcript `.message.usage` 실재 확인 — `input + cache_read + cache_creation` 합산이 정확 측정. usage 부재 라인 존재(63/240) → **마지막 usage 보유 항목** 채택.

---

## 11. P6 메타피드백 연계

- CLAUDE.md 10. 자동수집 표에 "Context 신호등 도달 분포(Green/Yellow/Red)" 행 추가 (`[작동 관찰]`).
- 모니터가 `logs/meta-feedback.log`에 출처태그 1줄 append (운영 중 도입).
- 임계치 자동 결재(검토): Red 도달 비율 또는 auto-compact 발동 횟수 (AP3 정합 — 분석·통계만, 자동 권고안 작성 안 함).

---

## 12. 결재 이력 (예시 골격)

- 본 규칙 신설 + `self-definition.md` 승격 + project-scoped 훅 도입을 운영자 일괄 승인으로 진행한 기록을 남깁니다. 적용범위 = **hybrid** (문서·로그·자기정의 = 로컬 / 훅 = project-scoped). archive: `decisions/archive/`에 결정 요약 보관.
- **tech 검증 5항목**: 일부 미해결(statusLine refresh·PreCompact block·SubagentStop) — 훅 운영 중 실측 예정.

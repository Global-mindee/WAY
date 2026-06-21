# rules/mode-toggle.md

> **목적**: CLAUDE.md 4. Mode Toggle 정책의 상세 운영 규칙
> **적용 범위**: 모든 AI 작업 진입 시점
> **버전**: v1.0
> **출처**: `harness-blueprint.md` Item 1 + `CLAUDE.md` 4.

---

## 1. 주요 용어

- **Mode**: 한 작업의 처리 방식. 본 규칙에서는 2종 — Research / Creative.
- **자동 분류**: AI가 입력 텍스트의 작업 유형을 사실/창작/혼합 3종으로 분류.
- **override**: 운영자의 1줄 지시로 자동 분류 결과를 뒤집는 것.
- **자연 전환**: 한 대화 안에서 작업 단계 변경이 감지될 때 자동으로 모드가 바뀌는 것.

---

## 2. 작업 유형 자동 분류 — 3종

| 유형 | 매핑 모드 | 예시 |
|------|---------|------|
| 사실 진술 우선 | Research | 통계 인용, 시장 규모, 정책 검토, 사실 확인 |
| 창작·탐색 우선 | Creative | 브레인스토밍, 글쓰기, 디자인 안 제시, 가설 발산 |
| 혼합 (회색 영역) | **Research (보수적 기본)** | "브레인스토밍 후 시장 규모 추정" 등 |

분류 결과는 작업 시작 시 1줄 알림(예: `[Mode: Research — 자동 분류]`).

---

## 3. Research Mode — 활성 규칙

1. **"I don't know" 허용 + 강제** — 모름은 숨기지 않고 표면화. 5모드 보고는 `rules/unknown-modes.md` 준수.
2. **External knowledge restriction** — 모델 내부 지식 단독 사실 단정 금지. `rules/fetch-policy.md` 출처 우선순위 강제.
3. **Citations 의무화** — 사실 단정마다 [U]/[R]/[B]/[W]/[M] 마커 부착.
4. **Chain-of-Thought verification** — 사실 사슬이 길어지면 단계별 검증 (특히 수치 추정·인용 비교).
5. **Direct quotes** — 20K 토큰 초과 장문 문서 참조 시 원문 직접 인용 권고.

---

## 4. Creative Mode — 활성 규칙

1. **"I don't know" 허용만** (강제 안 함, 창작 흐름 보호)
2. 나머지 4종 규칙은 **비활성화**

단, **창작 답변 내부에 구체적 식별자**(코드·번호·이름·고유명사)가 포함되면 SVOP 적용 — 그 식별자 단위로 출처 마커 부착 의무.

---

## 5. override — 운영자의 1줄 지시

운영자가 자동 분류 결과를 뒤집을 때:

```
"이건 창작이야"     → Research → Creative
"사실로 확인해줘"   → Creative → Research
```

override 발생 시 자동 기록:

- 위치: `logs/operations.log`
- 형식: `[2026-05-26T14:30:00] mode-override: AI=Research, 운영자=Creative, 작업="시장 규모 추정"`

본 로그는 Blueprint 영역 D 메타 피드백 임계치(Mode override 비율 > 30%) 분석의 입력.

---

## 6. 자연 전환

한 대화 안에서 작업 단계가 바뀌면 모드 자동 전환 + 운영자에게 1줄 알림.

예:
```
[운영자] 새 사업 아이디어 5개 발산해줘 (→ Creative)
[운영자] 5번 아이디어의 시장 규모 추정해줘 (→ Research 자동 전환 + 알림)
```

자연 전환의 트리거: 입력에 사실 진술 요구가 명시(수치·날짜·고유명사·인용 등)되면 Research로 전환.

---

## 7. 우선순위 충돌 시

CLAUDE.md 14. 우선순위 적용:
1. 안전 (외부 영향 작업 명시 요청 대기)
2. SVOP default-deny
3. 운영자 명시 override
4. 자동 분류
5. 권고 사항

즉 운영자 1줄 override는 자동 분류보다 항상 우선.

---

## 8. 예시 시나리오

**시나리오 A — 회색 영역 자동 보수적 처리**
- 입력: "프로젝트 예시 6월 매출 추정 + 마케팅 카피 3종 발산"
- 분류: 사실 진술 + 창작 혼합 → Research (보수적 기본)
- 처리: 매출 추정은 fetch 의무 + 카피는 Creative처럼 발산하되 카피 내 숫자는 SVOP 적용
- 알림: `[Mode: Research — 회색 영역 보수적 자동 분류]`

**시나리오 B — 운영자 override**
- 입력: "이건 브레인스토밍이야, 자유롭게 가자"
- 분류 결과: Research → Creative override
- 로그: `[timestamp] mode-override: AI=Research, 운영자=Creative, 작업="..."`

---

## 9. 결재 이력 (예시 골격)

- 회색 영역 자동 분류 정확도 측정 기준 → **override 비율 30% 임계치 유지** (추가 측정 미도입) 결재 기록을 `decisions/archive/`에 남깁니다.

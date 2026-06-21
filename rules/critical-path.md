# rules/critical-path.md

> **목적**: CLAUDE.md 7. Critical Path 정책의 상세 운영 규칙
> **적용 범위**: 위험도 높은 작업 — Best-of-N 검증 등 강화 메커니즘 발동
> **버전**: v1.0
> **출처**: `harness-blueprint.md` Item 4 + `CLAUDE.md` 7.

---

## 1. 주요 용어

- **Critical Path**: 위험도 4기준 중 하나라도 해당하는 작업.
- **Best-of-N**: 같은 작업을 N개 독립 시도로 실행 후 결과 일치도 비교 (본 규칙 N=3).
- **`[DISAGREE]` 마커**: Best-of-N에서 2/1 일치 시 소수 의견 표기 마커.
- **답변 보류**: Best-of-N이 3개 모두 다를 때 답변 채택하지 않고 운영자 검토 요청 발동.

---

## 2. Critical 4기준 (하나라도 해당하면 Critical)

| # | 기준 | 예시 |
|---|------|------|
| 1 | **외부 영향** | git push, 결재, API 호출, 메신저·메일 발송, 메시지·외부 데이터 변경 |
| 2 | **자동화 연계** | 본 작업의 출력이 cron·다음 자동 작업의 입력이 됨 |
| 3 | **되돌리기 비용** | 데이터 손실·외부 시스템 상태 변경 등 복구 비용 큰 작업 |
| 4 | **명시 표시** | 운영자가 "중요"라고 명시한 작업 |

분류 체계: **이진 (Critical / Non-Critical)**. 회색 영역 없음.

---

## 3. Critical 진입 시 자동 발동 메커니즘 (4종)

| 메커니즘 | 내용 |
|---------|------|
| 1. 강제 Research Mode | `rules/mode-toggle.md` 자동 분류 결과 무시, Research 강제 |
| 2. 의무 fetch | `rules/fetch-policy.md` fetch 정책 강화 적용 |
| 3. **Best-of-N (N=3) 검증** | 같은 작업 3개 독립 실행 |
| 4. 답변 끝 5모드 요약 | `rules/unknown-modes.md` 끝 요약 의무화 |

---

## 4. Best-of-N (N=3) — 절차

**채점 시트 (거버넌스 결정 — arXiv 실증: 기준 명세 > CoT 유도, 스타일 편향이 위치 편향의 수십 배):**
- 비교 전 **사전 정의 일치 기준표**를 먼저 작성한다(무엇이 "일치"인지 사실 단위로 명시) — 즉흥 판정 금지
- **형식·길이·문체가 아닌 사실 일치만 비교**한다 (스타일 편향 통제)

1. 같은 작업 프롬프트를 3번 독립 실행
2. 각 결과를 동등 가중치로 비교 (사실 단정 단위 — 위 기준표 기준)
3. 결과 분류:

| 결과 | 처리 |
|------|------|
| **3/3 일치** | 답변 채택 + Citation (5종 출처 마커) |
| **2/1 일치** | 다수 답변 채택 + 소수 의견에 `[DISAGREE]` 마커 부착 |
| **분산 (3개 모두 다름)** | **답변 보류** + `decisions/pending.md` 자동 등록 + 운영자 검토 요청 |

---

## 5. `[DISAGREE]` 마커 — 사용 형식

2/1 일치 시 소수 의견을 본문에 명시:
```
프로젝트 예시 6월 매출 = (다수 값)
[DISAGREE] 3번째 시도: (소수 값) (출처 차이 — DB view 다른 timestamp 사용)
```

소수 의견은 답변 마지막 단락 또는 별도 박스로 분리.

---

## 6. 답변 보류 (분산) — 처리 절차

분산 발생 시:
1. **답변 채택 안 함** — 운영자에게 일치된 결론 제시 금지
2. `decisions/pending.md` 자동 등록:
   ```
   ## ☐ 항목 N: Best-of-N 분산 (작업명)
   - 범주: critical-path-disagree
   - 근거: 3개 시도 결과 모두 상이
   - 시도 결과:
     1. ...
     2. ...
     3. ...
   - [ ] 운영자 1번 채택
   - [ ] 운영자 2번 채택
   - [ ] 운영자 3번 채택
   - [ ] 모두 폐기 + 재시도
   ```
3. `logs/operations.log`에 `[timestamp] critical-path-disagree: 작업명, pending#N 등록`

---

## 7. 로그 형식

Critical Path 진입 + Best-of-N 결과를 모두 `logs/operations.log`에 1줄 기록:

```
[2026-05-26T15:20:00] critical-path-enter: 외부영향, 작업="git push to origin"
[2026-05-26T15:20:30] critical-path-bon3: 3/3 일치, 작업="git push to origin"
[2026-05-26T16:01:00] critical-path-bon3: 2/1 일치 [DISAGREE], 작업="6월 매출 추정"
[2026-05-26T16:30:00] critical-path-bon3: 분산, 작업="신규 사업 우선순위 결정", pending#N 등록
```

본 로그는 Blueprint 영역 D 메타 피드백 임계치(Best-of-N 분산 비율 > 10%) 분석의 입력.

---

## 8. 예시 시나리오

**시나리오 A — 외부 영향 작업**
- 입력: "변경된 파일들을 main에 푸시해줘"
- Critical 4기준 #1(외부 영향) 해당 → Critical 진입
- Best-of-N: git push 자체는 3번 실행 안 함 (idempotent하지 않음). 대신 push 전 검증을 3가지 관점으로 (status·diff·log 확인)
- 답변 끝 5모드 요약 부착 + 푸시 실행 전 운영자 명시 승인 (CLAUDE.md 14. 우선순위 1)

**시나리오 B — 자동화 연계 작업**
- 입력: "self-definition.md를 갱신해줘 (월 1회 SDE 트리거)"
- Critical 4기준 #2(자동화 연계) 해당 → Critical 진입
- Best-of-N: 같은 추출 프롬프트 3회 실행 → 일치도 분석
- 결과 분산 시 답변 보류 + 운영자 결재

**시나리오 C — 일반 작업 (Non-Critical)**
- 입력: "이 코드 스타일 검토해줘"
- Critical 4기준 0건 해당 → Non-Critical
- 일반 Mode Toggle만 적용 (Research/Creative 자동 분류)

---

## 9. 우선순위 충돌

CLAUDE.md 14. 우선순위 적용:
1. 외부 영향 작업의 명시 요청 대기 — Critical 진입 후에도 운영자 명시 승인 필요
2. SVOP default-deny
3. 운영자 override (Critical 강제 해제 가능: "이건 Critical 아냐")
4. 자동 분류
5. 본 규칙의 권고

---

## 10. 결재 이력 (예시 골격)

- Best-of-N → **N=3 고정 유지** (적응형 미채택) 결재 기록을 `decisions/archive/`에 남깁니다.
- **Idempotent하지 않은 작업의 Best-of-N**: 미해결 (git push·DB write의 "관점 3종 사전 검증" 방식 표준화는 추후 결재 필요)

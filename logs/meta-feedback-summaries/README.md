# logs/meta-feedback-summaries/

> **목적**: P6 메타 피드백(meta-feedback.log)의 월 1회 집계 보관소
> **출처**: `CLAUDE.md` P6 메타 피드백 수집 절

---

## 이 폴더가 무엇인가

`logs/meta-feedback.log`는 append-only raw 로그입니다. 이 폴더는 그 raw 로그를 **월 단위로 집계한 요약본**을 보관합니다.

- **파일명 규약**: `{YYYY-MM}.md` (예: `2026-06.md`)
- **집계 주기**: 월 1회. 자동화(cron/스케줄러)가 구현되어 있으면 매월 첫 실행에 전월 집계를 생성하고, 자동화가 없으면 매월 첫 세션에서 AI가 operations.log·meta-feedback.log 기반으로 집계를 대행합니다.

---

## 집계 내용 (5종 분포)

월간 요약은 다음 분포를 담습니다.

1. Mode override 누적 (자동 분류 정확도 측정)
2. MCP 출처 충돌 누적
3. Best-of-N 결과 분포 (3/3 vs 2/1 vs 분산)
4. 결재 미응답 패턴
5. 자기 정의 변화 누적

임계치 초과 분포는 `decisions/pending.md`에 자동 결재 요청으로 연계됩니다.

---

## AI 역할 제한

집계는 **분석·통계만 제공**합니다. 변경 권고안을 자동 작성하지 않습니다 (능동적 격리·자동 강등 없음 — Push 기반 정신).

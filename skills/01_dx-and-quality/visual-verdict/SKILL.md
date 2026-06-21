---
name: visual-verdict
description: 생성된 UI 스크린샷을 기준 이미지와 대조해 다음 수정 반복을 구동할 엄격한 JSON 판정을 반환한다. 캡처 vs 기준 비교 → score(0~100)·verdict·suggestions. 임계 90 미만이면 수정 후 재판정.
trigger-keywords: [비주얼 검수, 스크린샷 비교, UI 판정, visual-verdict, 디자인 대조, 화면 비교]
---

# visual-verdict (비주얼 판정)

생성된 UI 스크린샷을 하나 이상의 기준 이미지와 대조해, 다음 수정 반복을 구동할 수 있는 엄격한 JSON 판정을 반환한다.

## 언제 사용하나

- 과제에 시각 충실도 요건(레이아웃·간격·타이포그래피·컴포넌트 스타일)이 있을 때
- 생성된 스크린샷과 기준 이미지가 1장 이상 있을 때
- 수정을 계속하기 전에 결정론적 통과/실패 가이드가 필요할 때

이 스킬은 메모리 `html-deliverable-render-verify`(HTML 산출물 렌더링 검수 의무) 절차의 판정 표준으로 연결된다 — 정적 검사만으로 불충분한 HTML 산출물의 시각 검수 결과를 정량화한다.

## 입력

- `reference_images[]` — 기준 이미지 경로 1개 이상
- `generated_screenshot` — 현재 산출 이미지
- 선택: `category_hint` — 의도한 UI 카테고리/스타일 (예: `dashboard`, `report`, `landing`)

## 출력 계약

**JSON만** 반환한다. 다음 정확한 형태를 따른다.

```json
{
  "score": 0,
  "verdict": "revise",
  "category_match": false,
  "differences": ["..."],
  "suggestions": ["..."],
  "reasoning": "짧은 설명"
}
```

규칙:
- `score`: 정수 0~100
- `verdict`: 짧은 상태값 (`pass` / `revise` / `fail`)
- `category_match`: 생성 스크린샷이 의도한 UI 카테고리/스타일에 부합하면 `true`
- `differences[]`: 구체적인 시각 불일치 (레이아웃·간격·타이포그래피·색상·위계)
- `suggestions[]`: differences에 직결된 실행 가능한 다음 수정안
- `reasoning`: 1~2문장 요약

## 임계와 루프

- 통과 목표 임계는 **90 이상**.
- `score < 90`이면 수정을 계속하고, 다음 시각 검수 패스 전에 visual-verdict를 재실행한다.
- 다음 스크린샷이 임계를 넘기 전까지 시각 과제를 완료로 취급하지 않는다.

## 디버그 시각화

불일치 진단이 어려울 때:
1. visual-verdict를 권위 있는 결정 기준으로 유지한다.
2. 픽셀 단위 diff 도구(pixelmatch 오버레이 등)를 보조 디버그 수단으로만 사용해 hotspot을 국소화한다.
3. 픽셀 diff hotspot을 구체적인 `differences[]`·`suggestions[]` 갱신으로 변환한다.

주의: 캡처는 16,384px 텍스처 한계가 있으므로 동적 scale 후 픽셀 열람으로 측정한다(HTML 렌더링 검수 교훈). 보고서형 산출물은 등장 애니메이션을 금지한다.

## 예시

```json
{
  "score": 87,
  "verdict": "revise",
  "category_match": true,
  "differences": [
    "상단 내비게이션 간격이 기준보다 좁음",
    "주요 버튼이 더 작은 폰트 굵기를 사용함"
  ],
  "suggestions": [
    "내비 항목 좌우 패딩을 4px 늘릴 것",
    "주요 버튼 font-weight를 600으로 설정할 것"
  ],
  "reasoning": "핵심 레이아웃은 일치하나 스타일 세부가 아직 어긋남."
}
```

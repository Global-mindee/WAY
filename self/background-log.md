# self/background-log.md

> **목적**: 자기 정의 Background 등급 변경 누적 (메인 changelog 노이즈 방지)
> **등급**: Background = Critical도 Notable도 아닌 소규모/잡음 변경
> **never_delete 충족**: 변경 흔적 자체는 보존, 메인 changelog는 깔끔하게 유지
> **출처**: `harness-blueprint.md` (2) Item 1

---

## 이 파일이 무엇인가

자기 정의에 일어나는 모든 변경 중, Critical(자동 결재 대상)도 Notable(참고 가치)도 아닌 **소규모 잡음 변경**만 여기에 1줄씩 append-only로 쌓입니다. 이렇게 분리해야 메인 `changelog.md`가 의미 있는 변경만 담아 깨끗하게 유지됩니다. 단, never_delete 원칙상 잡음이라도 흔적은 영구 보존합니다.

---

## 형식

```
[YYYY-MM-DD] {영역}: {짧은 변경 요약}
```

한 줄 append-only.

---

## 로그

(아직 Background 등급 변경 누적 없음 — 첫 SDE 트리거 이후 채워집니다)

(가상 예시) [YYYY-MM-DD] E 선호: 자료 형식 선호에 "표 우선" 단서 1건 추가

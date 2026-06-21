# memory/quarantine/

> **Tier**: Quarantine (3-Tier 메모리 중 2단계)
> **접근**: 명시 호출만

---

## 이 Tier가 무엇인가

Quarantine은 **검증이 끝나지 않았거나, 격리가 필요한 지식**을 보관합니다. Public처럼 결재를 통과한 정본이 아니라, 도전받았거나 제3자 식별 정보 등으로 분리 보관이 필요한 항목이 머무는 중간 지대입니다.

| Tier | 위치 | 접근 |
|------|------|------|
| Public | `memory/public/` | 명시 호출 (결재 통과 지식 승격분) |
| **Quarantine** | `memory/quarantine/` (여기) | 명시 호출만 |
| Archive | `memory/archive/` | 명시 호출만, never_delete |

---

## 4타입 분류

Public과 동일하게 User / Project / Feedback / Reference 4타입으로 분류합니다. (상세는 `memory/public/README.md` 참조)

---

## Tier 이동

- 새 데이터가 기존 데이터에 도전 + Critical 결재 통과 시 Public ↔ Quarantine ↔ Archive 이동.
- 매뉴얼 결정만, 자동 이동 없음 (Push 기반 신선도, AP3 정합).

`.gitkeep`은 빈 폴더 추적을 위해 유지합니다 (삭제 금지).

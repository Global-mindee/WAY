# memory/archive/

> **Tier**: Archive (3-Tier 메모리 중 3단계)
> **접근**: 명시 호출만, **never_delete**

---

## 이 Tier가 무엇인가

Archive는 **폐기·약화된 지식의 영구 보관소**입니다. 더 이상 Public 정본으로 쓰이지 않게 된 항목도 삭제하지 않고 여기로 이동합니다.

| Tier | 위치 | 접근 |
|------|------|------|
| Public | `memory/public/` | 명시 호출 (결재 통과 지식 승격분) |
| Quarantine | `memory/quarantine/` | 명시 호출만 |
| **Archive** | `memory/archive/` (여기) | 명시 호출만, **never_delete** |

---

## never_delete의 의미

- **삭제 ≠ 폐기**: 폐기 결정도 "Tier 이동"으로 이행됩니다. 흔적은 영구 보존됩니다.
- **이유**: 약화·폐기된 지식이 나중에 다시 도전받을 때 비교 기준이 되고, 지식의 변천 경로가 보존됩니다.

---

## 4타입 분류 · auto-memory 정본 관계

Public과 동일하게 User / Project / Feedback / Reference 4타입으로 분류하며, MEMORY 출처의 정본은 Claude Code 내장 auto-memory입니다. (상세는 `memory/public/README.md` 참조)

`.gitkeep`은 빈 폴더 추적을 위해 유지합니다 (삭제 금지).

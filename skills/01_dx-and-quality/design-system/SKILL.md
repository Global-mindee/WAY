---
name: design-system
description: 웹사이트, 랜딩 페이지, UI 컴포넌트, shadcn/ui, Tailwind CSS 제작 시 색상 팔레트, 타이포그래피, 버튼/카드/폼 스타일, 그림자 체계, 반응형 breakpoint 가이드. 브랜드별 디자인 레퍼런스 (Claude, Linear, Stripe, Vercel) 포함. 디자인 시스템, 컴포넌트 스타일링, UI 비주얼 가이드.
---

# Design System Skill

## 사용 시점
이 스킬은 다음 작업에 자동 활성화됩니다:
- 새 웹사이트 / 랜딩 페이지 제작
- React / Next.js 컴포넌트 비주얼 스타일 결정
- shadcn/ui 테마 커스터마이징
- Tailwind CSS 기반 UI 구현
- 특정 브랜드 스타일로 UI 생성 요청
- 색상, 타이포그래피, 레이아웃 결정

## 워크플로

1. **브랜드 확인**: 사용자에게 참고 브랜드 확인 (또는 아래 표에서 분위기에 맞는 것 추천)
2. **레퍼런스 로드**: `references/{brand}.md` 를 Read 툴로 읽기
3. **적용**: 해당 파일의 9개 섹션 (색상/타이포/컴포넌트/레이아웃/그림자/반응형/AI 프롬프트) 기반으로 UI 구현
4. **접근성 우선**: `accessibility-wcag` 스킬과 충돌 시 **WCAG 기준 우선 적용**

## 브랜드 레퍼런스 목록

| 브랜드 | 분위기 | 주요 색상 | 파일 |
|--------|--------|----------|------|
| **Claude** | 따뜻함, editorial, 페이퍼 톤 | Parchment `#f5f4ed`, Terracotta `#c96442` | `references/claude.md` |
| **Linear** | Dark-first, 샤프, 미니멀 | Deep black, 보라 악센트 | `references/linear.md` |
| **Stripe** | Clean, 신뢰감, 파스텔 | White, Indigo `#635bff` | `references/stripe.md` |
| **Vercel** | Monochrome, 모던 개발자 툴 | Black/White, Geist 폰트 | `references/vercel.md` |

## 공통 원칙 (브랜드 무관)

### 색상
- CSS 변수로 정의 → 다크모드 대응 용이
- 시맨틱 이름 사용: `--color-primary`, `--color-surface`, `--color-text-secondary`
- WCAG AA 색상 대비 4.5:1 이상 준수

### 컴포넌트
- shadcn/ui 기반 확장 우선
- Tailwind CSS 유틸리티 클래스 우선, 커스텀 CSS 최소화
- 상태별 스타일 명시: default / hover / focus / active / disabled

### 타이포그래피
- 폰트 계층 최대 3단계: display → body → caption
- `next/font` 사용으로 CLS 방지
- body line-height 최소 1.5 이상

### 반응형
- Mobile-first 작성: `sm:` `md:` `lg:` 순서
- 터치 타겟 최소 44×44px

## 사용 예시

```
사용자: "Claude 스타일의 랜딩 페이지 hero 섹션 만들어줘"
→ references/claude.md 읽기 → Section 2(색상) + Section 4(버튼) + Section 9(AI 프롬프트) 적용

사용자: "Linear처럼 다크 모드 대시보드 카드 컴포넌트"
→ references/linear.md 읽기 → 해당 카드 스타일 적용

사용자: "결제 폼 UI, Stripe 느낌으로"
→ references/stripe.md 읽기 → 폼/인풋/버튼 스타일 적용
```

## 레퍼런스 추가 방법

새 브랜드가 필요하면 `npx getdesign@latest add {brand}` 로 DESIGN.md를 받아
`references/{brand}.md` 로 저장 후 위 테이블에 항목 추가.

사용 가능한 전체 브랜드: airbnb, airtable, apple, cursor, figma, framer, notion,
spotify, stripe, supabase, tesla, uber, vercel, zapier 등 66개.
(전체 목록: `npx getdesign@latest list`)

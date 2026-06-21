---
name: legal-compliance
description: 법률·compliance·규제·약관·프라이버시·개인정보 처리·결제 규제·국가별 사업자 셋업 작업 시 자동 활성화. TRIGGER 키워드 — 약관(ToS) · 개인정보처리방침(Privacy Policy) · GDPR · EU geoblock · 환불 정책 · 쿠키 정책 · age gate · COPPA · CCPA · PIPA · PIPEDA · Quebec Law 25 · 사업자등록 · 통신판매업 · MoR · Lemon Squeezy · Stripe PCI · CAN-SPAM · CASL · endorsement disclosure · 인플루언서 광고 · US state law (PA/OK/CA/NY) · Canada compliance · 한국 전자상거래법 · 외환 · fortune telling 규제 · 사업자 명의 · 취업규칙 겸업. SKIP — 일반 TypeScript/React 코딩 · 디자인 작업 · 순수 알고리즘 · 단순 리팩토링.
---

# legal-compliance skill

## 언제 활성화되나

법무·compliance·규제 키워드를 감지하면 자동 호출됩니다. 어떤 business 폴더에서 작업하든, 이 skill이 **platform/knowledge/wiki/legal/** 중앙 자산을 먼저 참조합니다.

대표 상황:
- 새 서비스의 약관·프라이버시·쿠키 정책 작성
- 결제·환불 정책 설계 (MoR, Stripe, LS 등)
- 지역 규제 대응 (EU/US/Canada/Korea)
- Age gate·COPPA·ToS 갱신
- CEO가 법적 리스크 질문

## Central references (first stop)

### 범용 프레임워크 (지역·법률체계 단위)
- [[platform/knowledge/wiki/legal/frameworks/gdpr-eu]] — EU GDPR 조사·요건 (geoblock 미적용 시)
- [[platform/knowledge/wiki/legal/frameworks/eu-geoblock-legal-analysis]] — EU 32국 차단 법적 근거
- [[platform/knowledge/wiki/legal/frameworks/us-federal]] — FTC·COPPA·CAN-SPAM·Dot Com·Endorsement
- [[platform/knowledge/wiki/legal/frameworks/us-state-matrix]] — 50주 프라이버시·Fortune Telling 매트릭스
- [[platform/knowledge/wiki/legal/frameworks/canada]] — PIPEDA·CASL·Quebec Law 25
- [[platform/knowledge/wiki/legal/frameworks/korea-business-setup]] — 한국 사업자·통신판매·PIPA·외환
- [[platform/knowledge/wiki/legal/frameworks/lemonsqueezy-mor-scope]] — LS MoR 책임 범위 + 포지셔닝 경고

### 재사용 가능한 policy 조각 (서비스 공통)
- [[platform/knowledge/wiki/legal/components/age-gate-spec]] — 13+/16+ 차단 spec + SQL
- [[platform/knowledge/wiki/legal/components/can-spam-email]] — 이메일 마케팅 (CAN-SPAM+CASL+Quebec)
- [[platform/knowledge/wiki/legal/components/endorsement-influencer]] — 16 CFR 255 인플루언서 계약 템플릿

### 한국 법령 entities (참조)
- [[platform/knowledge/wiki/legal/entities/개인정보보호법]]
- [[platform/knowledge/wiki/legal/entities/변호사법]]

### 연결 지식
- 결제 MoR 결정: [[platform/knowledge/playbooks/migration/payment-provider-decision]]

## 프로젝트 특화 사례 (참고용, 재사용 금지)

- **B2C 디지털 서비스 (북미 런칭) 예시**: 서비스별 실적용 ToS/Privacy/환불 예시 (예: Delaware 준거법 + LS MoR + 엔터테인먼트 표기 판례)
- **매칭 플랫폼 예시**: 플랫폼 법적 체크리스트 (사업자·중개·개인정보)

> ⚠️ 주의: 프로젝트별 약관·프라이버시 문서는 **서비스별 커스텀 조항(브랜드명, 영업 주소, 서비스 특성)** 포함. 그대로 복사하지 말고 **frameworks/ + components/** 를 재료로 해당 프로젝트용 문서를 생성.

## Workflow

### 1. 도메인 식별
- **지역**: EU / US / Canada / Korea / 복수
- **주제**: 프라이버시 / ToS / 환불 / 쿠키 / age / 결제 / 마케팅

### 2. 중앙 자산 로드
해당 지역 `frameworks/` + 관련 `components/` Read. 전체 로드보다 **필요한 섹션만** 인용.

### 3. 프로젝트 특화 작성
- `<project>/docs/legal-drafts/` 신규 작성 (대상 프로젝트가 해당 도메인 처음이면)
- 기존 있으면 수정 — **단, 범용 부분은 중앙 정본 그대로 링크/인용**

### 4. 새로운 범용 지식 발견 시 승격
- `_pending/` 또는 직접 `legal/_pending/` 에 제출
- `/wiki:ingest` 자동 트리거 (SessionEnd hook)
- `confidence ≥ 0.85` AND `sample_size ≥ 5` AND `pii_detected: false` → 자동 Tier 1
- PII/민감 키워드 → 자동 Tier 2 격리
- 미달 → `_pending/` 대기, 주간 리포트에 포함

## Gate 체계 (런칭 전 의무 통과)

일부 프로젝트는 C3(북미) / K1(한국) 게이트 체크리스트를 운용. (예시 — README C3 Gate):
- **C3 Gate**: Privacy/ToS/Refund/Cookie/Disclaimer/Age/Marketing Consent/Fortune Telling/LS 포지셔닝/물리 주소 — 10개
- **K1 Gate**: 사업자등록/계좌/Wise/통신판매업/Footer/PIPA/보험/취업규칙 — 8개

신규 프로젝트에서 유사한 게이트 필요 시 **본 체크리스트를 템플릿으로 재사용**.

## Re-review Trigger (정식 변호사 리뷰 필수 시점)

기본 원칙 = self-compliance framework, 공식 `.gov` / `.gc.ca` / `.gouv.qc.ca` 인용 기반. 다음 중 하나 달성 시 **즉시** 정식 변호사 리뷰:

- 매출 **$25M/year** 초과 (CCPA/CPRA 기업 의무 급증)
- 가입자 **5만 명** 초과
- 주별 프라이버시법 집단소송·AG inquiry 수신
- 신규 관할 진출 (EU unblock, 아시아 확장 등)
- **런칭 +6개월** 정기 재평가

## Anti-patterns

- ❌ 프로젝트 A의 ToS를 프로젝트 B에 그대로 복사 (브랜드·관할 불일치)
- ❌ `[COUNSEL]` 태그 남기고 방치 — 공식 URL 인용으로 대체
- ❌ "참고용" 면책 문구 없이 AI 법률 응답 노출 — 한국은 변호사법 위반 리스크
- ❌ Fortune telling 단어 사용 (엔터테인먼트 표기 필수, 관련 판례 참고)
- ❌ geo-block 미적용 상태에서 EU 트래픽 수신 (GDPR 의무 발동)

## Checklist (새 프로젝트 법무 스택 작성 시)

- [ ] 지역·주제 도메인 식별 완료
- [ ] `frameworks/` 해당 지역 문서 Read
- [ ] `components/` 필요 조각 Read (age-gate · CAN-SPAM · endorsement 등)
- [ ] 프로젝트별 `docs/legal-drafts/` 생성 (또는 갱신)
- [ ] 브랜드·관할·준거법·결제방식 특화 조항 작성
- [ ] 공식 소스 URL 본문에 인용 (self-compliance 근거)
- [ ] `middleware.ts` 에 geo-block 적용 (해당 시)
- [ ] Age gate·COPPA 코드 구현 (해당 시)
- [ ] Gate 체크리스트 작성 및 자가 점검
- [ ] 신규 범용 지식 발견 → `_pending/` 제출 트리거

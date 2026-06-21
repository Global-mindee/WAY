# MoR (Merchant of Record) — Summary

> **정본**: [[../../../wiki/legal/frameworks/lemonsqueezy-mor-scope]] · LS 중심 상세
> **관련 playbook**: [[../../../playbooks/migration/payment-provider-decision]]

## MoR 개념

**Merchant of Record**: 결제 시 법적 판매자 역할을 하는 주체. 고객 신용카드 명세서에 찍히는 이름.

- **MoR 사용**: LS, Paddle, FastSpring, Gumroad 등이 MoR 흡수 → 판매자는 컨텐츠 제공자 역할
- **Direct merchant**: Stripe + 개별 사업자 → 판매자가 모든 법적 책임

## LS (Lemon Squeezy)가 흡수하는 범위

1. **결제 처리·PCI-DSS 준수** — 카드 정보 보관 0건
2. **세금 징수·송금** — 100여 국가 VAT/GST/Sales Tax 자동
3. **Chargeback 1차 대응** — 일부 케이스 흡수 (evidence 요구)
4. **국가별 결제 규제** — PSD2, SCA, MAS 등 LS가 준수
5. **환불 처리** — 판매자 정책 따라 LS가 실행

## LS가 흡수하지 않는 범위 (판매자 의무)

1. **ToS / Privacy Policy** — 서비스 자체의 법적 관계는 판매자 책임
2. **서비스 disclaimer** — "entertainment only" 등
3. **Age gate** — COPPA 13+, CCPA 16+ 구현
4. **마케팅 규제** — CAN-SPAM, CASL, 인플루언서 공개
5. **한국 사업자 등록** — LS가 대체하지 않음 (한국 결제 ≠ 한국 사업 면제)
6. **Fortune telling 주법** — PA/OK 차단 판매자 책임
7. **DSAR (데이터 요청)** — 판매자가 직접 응답

## 포지셔닝 경고

**LS는 "software/app/digital product" 판매자만 허용**. 서비스·consulting·subscription-with-service 분류 시 거부·정지 리스크.
- 마케팅 카피: "service" 단어 주의
- 서비스 성격 강한 제품: Stripe + 자체 사업자가 나을 수 있음

## 실전 판단 가이드

1. **초기 런칭 ($0~$25M 매출)**: MoR 사용 권장 (법적 부담↓)
2. **성장 단계 ($25M+)**: Direct merchant + 자체 법무팀 검토
3. **서비스 성격 제품**: Stripe + 자체 사업자 검토

## 관련

- [[../../../wiki/legal/frameworks/us-federal]] — FTC disclosure + Miss Cleo 판례
- [[../../../wiki/legal/frameworks/us-state-matrix]] — 주별 환불 규제
- [[../../../wiki/legal/frameworks/canada]] — 캐나다 VAT + 퀘벡 Law 25

## Skill 사용 시

결제 공급자 결정 → playbook 먼저 → 본 요약 → LS 세부 스펙 필요 시 정본.

# GDPR EU — Summary

> **정본**: [[../../../wiki/legal/frameworks/gdpr-eu]] · 상세는 정본 참조
> **적용**: EU 사용자 대상 서비스. `eu-geoblock-legal-analysis` 적용 시 회피 가능.

## 핵심 개념

- **법적 근거 (Art. 6)**: 동의·계약·법적 의무·생명이익·공공임무·정당한 이익 중 1개 이상 명시 필요
- **데이터 주체 권리 (Art. 12–22)**: 접근·정정·삭제·처리 제한·이동·반대·자동 의사결정 반대
- **처리자 의무 (Art. 24–30)**: records of processing, privacy by design, DPIA, DPO 지정
- **Extraterritorial (Art. 3)**: EU 내 사용자 대상 서비스면 비EU 업체도 적용
- **위반 시 과태료 (Art. 83)**: 글로벌 매출 4% 또는 2천만유로 중 큰 값

## 판단 가이드

- EU 사용자 **수신** → 적용 (단순 접근 가능성 아닌, 타겟팅 여부)
- EU geo-block 구현 시 → **적용 회피 전략** ([[../../../wiki/legal/frameworks/eu-geoblock-legal-analysis]] 참조)
- 한국 PIPA와 양자 모두 적용 경우 **강한 쪽 기준** 준수

## 관련 components

- [[../../../wiki/legal/components/age-gate-spec]] — Art. 8 미성년 동의 (16세 기본, 회원국 13–16 재량)
- [[../../../wiki/legal/components/can-spam-email]] — Art. 6(1)(a) 마케팅 이메일 별도 동의

## Skill 사용 시

이 요약은 skill 호출 시 **빠른 컨텍스트**용. 실제 정책 작성·리스크 평가 시 정본(frameworks/gdpr-eu) 전체 Read 필수.

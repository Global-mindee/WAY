# 할루시네이션 완화 기법 — 데스크 리서치

> **v2.0** — Anthropic 공식 가이드 및 2025-2026 최신 benchmark 통합본
> Generated: 2026-05-23
> Purpose: (3) 신뢰성 층위 의사결정의 근거 자료
> 합의된 방향: **Prevention over Verification (검증보다 차단)**

## 변경 이력

| 버전 | 주요 변경 |
|------|----------|
| v1.0 | Self-Refine·Multi-Agent Debate·RAG 3개 방법론 비교. 시나리오 1~4 권고. |
| **v2.0** | **Anthropic 공식 7가지 기법 추가. "Refusal over Guessing" 패러다임 발견. AA-Omniscience·FACTS 새 benchmark 반영. Claude 모델별 실제 hallucination rate 추가. 시나리오 5 (Anthropic Native) 신규 권고로 채택.** |

---

## 0. 리서치 목적

(1) 작업 시 합의된 (3) 핵심 방향(Prevention over Verification)을 구현하기 위한 구체적 메커니즘을 비교한다. v2.0에서는 Anthropic의 공식 가이드와 최신 benchmark 데이터를 추가로 반영한다.

---

## 1. 방법론별 분석

### 1A. Self-Refine (자기 검증·재작성)

**원리**: 단일 LLM이 자기 출력에 대해 피드백을 생성하고, 그 피드백으로 출력을 재작성하는 과정을 반복.

**효과 (Madaan et al. 2023)**:
- 7개 다양한 작업에서 평균 약 20% 절대 성능 향상
- 코드 최적화·대화 응답·수학 풀이 등에서 효과

**한계 (Huang et al. 2023, ICLR 2024)**:
- 외부 피드백 없이는 reasoning 자기수정 **불가**
- 자기수정 후 성능이 오히려 떨어지는 경우 보고됨
- Tyen et al. 2023: LLM은 "오류를 찾는" 능력이 부족

**영역별 효과**:
- ✓ 스타일·품질·코드 최적화·구조 개선
- ✗ 사실(factual)·추론(reasoning) 영역

### 1B. Multi-Agent Debate (다중 에이전트 토론)

**원리**: 여러 LLM 인스턴스가 답을 제시하고 다중 라운드 토론으로 합의 수렴.

**효과 (Du et al. 2023, MIT — ICML 2024)**:
- 수학·전략적 추론·사실성 전 영역 개선
- 에이전트 수·라운드 수 증가 → 성능 향상
- 단일 baseline (zero-shot CoT, Self-Refine, Reflexion) 모두 능가

**한계**:
- 비용 증가 (에이전트 × 라운드)
- 같은 모델 패밀리는 합의된 환각 위험
- 직렬 다중 라운드의 problem drift 현상

### 1C. RAG (Retrieval-Augmented Generation)

**원리**: 답변 생성 전 외부 지식 베이스에서 관련 정보를 검색해 컨텍스트로 받음.

**효과**:
- 의료 정보 도메인: hallucination rate 유의미 감소 (JMIR Cancer 2025)
- 하이브리드 RAG: 35~60% 에러 감소
- MEGA-RAG (공중보건 2025): 40%+ 감소
- NVIDIA NeMo Guardrails: 92% 검출률
- "Guardian agent" 접근: 1% 미만 hallucination 보고 사례

**한계**:
- 잘못된 retrieval → 잘못된 grounding
- Context-Knowledge Conflict (LUMINA 2025)
- Retrieval 자체에서 hallucination 발생 가능

### 1D. ★ Anthropic 공식 7가지 기법 (v2.0 신규)

Anthropic이 직접 권장하는 hallucination 완화 기법 (`docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations`).

**기본 전략**:

| 기법 | 원리 | 하네스 정합 |
|------|------|------------|
| **"I don't know" 명시적 허용** | LLM에게 불확실성을 인정할 권한 부여 | 모름 보고 4모드와 일치 |
| **Direct quotes for grounding** | 긴 문서(>20K 토큰) 작업 전 단어 단위 인용 추출 | SVOP READ 출처 정합 |
| **Citations 의무화** | 모든 주장에 출처 인용. 인용 못 찾으면 주장 철회 | SVOP default-deny 정합 |

**고급 전략**:

| 기법 | 원리 | 하네스 정합 |
|------|------|------------|
| **Chain-of-thought verification** | 답변 전 추론 단계별 설명 | C 영역 추상→구체 패턴 정합 |
| **Best-of-N verification** | 같은 프롬프트 N회 실행 + 비교, 불일치 = 환각 신호 | Multi-Agent의 경량화 버전 |
| **Iterative refinement** | 출력을 다음 프롬프트 입력으로 사용해 검증·확장 | 보조 용도 |
| **External knowledge restriction** | 제공된 문서·일반 지식만 사용하도록 명시 제한 | RAG 정신과 일치 |

**중요한 트레이드오프 (paper 2307.02185)**:
- Citation 강제는 **창의성 감소**를 유발
- 해결: **Toggle 방식** — Research Mode(모든 규칙 활성화) vs Default Mode(자유)

**Production 사례**:
- "Allow I don't know" + "FAQ만 사용" 조합 → 고객 지원 환각 크게 감소 (Reddit user case)

---

## 2. 비판적 비교 매트릭스 (v2.0 확장)

| 영역 | Self-Refine | Multi-Agent | RAG | Anthropic 7기법 |
|------|-------------|-------------|-----|----------------|
| **사실 환각** | ✗ 낮음 | △ 중간 | ✓✓ 높음 (35~60%↓) | ✓✓ 높음 (특히 I don't know) |
| **추론** | ✗ 낮음 | ✓ 높음 | △ 중간 | ✓ 높음 (CoT verification) |
| **스타일·품질** | ✓✓ 높음 | △ 보통 | △ 보통 | △ 보통 |
| **비용** | ✓ 낮음 | ✗ 높음 | △ 중간 | ✓ 낮음 (prompting만) |
| **구현 복잡도** | ✓✓ 낮음 | △ 중간 | ✗ 높음 | ✓✓ 낮음 |
| **하네스 SVOP 정합** | △ 낮음 | △ 중간 | ✓✓ 매우 높음 | ✓✓ 매우 높음 |
| **(1) 원칙 정합** | 보통 | 보통 | 매우 높음 | **매우 높음** |
| **1인 운영 적합** | ○ | △ | ○ | ✓✓ 매우 적합 |

### 핵심 비판

| 방법 | 결정적 약점 |
|------|------------|
| Self-Refine | 사실 환각에 무력. 사용자 신뢰만 높이는 역효과 |
| Multi-Agent | 합의된 환각 위험 + 비용 증가 |
| RAG | Retrieval 자체의 품질이 전체를 좌우 |
| **Anthropic 7기법** | **prompting 기반이라 강제성 약함. 시스템 프롬프트 무력화 시 무용지물** |

**어느 단일 방법도 완전한 해결이 아닙니다.** 조합이 정답.

---

## 3. ★ Anthropic의 "Refusal over Guessing" 패러다임 (v2.0 신규)

가장 중요한 발견입니다. Anthropic은 Claude 모델 자체를 **"추측보다 거부"로 의도적으로 calibrate**합니다.

### 직접 인용

> "Long-context retrieval dropped to 32.2% (down from Opus 4.6's 78.3%) — Anthropic explicitly attributes this to the model now reporting errors when information is missing rather than fabricating an answer."
> — Claude 4.x 모델 calibration에 대한 Anthropic 입장

### 시사점

| 시사점 | 내용 |
|--------|------|
| 이미 Claude는 (3) 정신을 일부 구현 중 | Anthropic의 model-level calibration이 우리 (3) "Prevention over Verification"의 부분 구현 |
| Raw accuracy 일부 희생 | 일부러 답을 안 함으로써 잘못된 답을 안 함 |
| 트레이드오프 명시 | 답이 줄어드는 대신 답의 신뢰도 향상 |
| 하네스 SVOP와 완벽 일치 | "5종 출처(USER·READ·BASH·WEB·MEMORY) 외 사실 단정 차단"과 동일 정신 |
| 우리 하네스의 토대 | 이 패러다임을 Claude의 model layer가 이미 제공 → 하네스는 보강만 |

### OpenAI 2025 분석 — 같은 결론

> "Hallucinations are not a constant. They're a symptom of pressure — pressure to answer, pressure to be fluent, pressure to appear helpful, pressure embedded in how we score and train."

즉 hallucination은 모델의 속성이 아니라 **incentive structure의 증상**. 우리 하네스 설계도 incentive 측면에서 접근해야 함.

---

## 4. 새 평가 benchmark 동향 (v2.0 신규)

### 4A. AA-Omniscience (Artificial Analysis, 2025년 11월)

**핵심 혁신**: 잘못된 답 = 페널티, 거부 = 페널티 없음

| 특징 | 내용 |
|------|------|
| 규모 | 6,000 questions × 42 topics × 6 domains |
| Incentive | 표준 incentive structure를 뒤집음 |
| 결과 | 40개 테스트 모델 중 단 4개만 양의 점수 |

이 benchmark의 incentive는 **(1) 정신과 가장 잘 정합**합니다.

### 4B. FACTS benchmark (Google DeepMind, 2025년 12월)

Hallucination을 4차원으로 분리:
- **Grounding** — 제공된 문서에 충실
- **Multimodal** — 시각 + 텍스트 정확도
- **Parametric** — 저장된 학습 지식
- **Search** — 웹 검색 도구 정확도

우리 (3)에서 작업 유형별 방어 전략을 세분화할 때 참고 가능한 분류.

### 4C. Vectara HHEM benchmark

문서 기반 요약에서 hallucination 측정 — RAG 시스템의 직접 proxy.

### 4D. SimpleQA (OpenAI)

"Guessing vs Abstaining" 동학에 집중. 거부를 first-class outcome으로 다룸. 4,326 문항, 단일 명확한 정답.

---

## 5. Claude 모델별 실제 Hallucination Rate (v2.0 신규)

본 하네스가 Claude 기반이므로 실제 수치를 알아두면 baseline 파악에 유용합니다.

### AA-Omniscience 기준 (2025년 11월 ~ 2026년 4월)

| 모델 | Hallucination Rate | 비고 |
|------|------------------:|------|
| Claude 4.1 Opus | **0%** | 거부 우선 전략 (모든 불확실 답변 거부) |
| Claude 4.5 Haiku | 25-26% | |
| Claude 4.6 (다른 benchmark) | 17.8% | 다른 측정 기준 |
| Claude 4.5 Sonnet | 48% | |
| Claude Opus 4.5 (Thinking) | 58% | Thinking 모델은 적극적 답변 |
| GPT-5.1 (High) | 51% | |
| Gemini 3 Pro | 88% | |
| Gemini 3 Flash | 91% | |

### 시사점

| 시사점 | 내용 |
|--------|------|
| Claude는 frontier 중 우위 | 다른 모델 대비 hallucination rate 낮음 |
| Thinking 모델 트레이드오프 | 적극적 답변으로 hallucination 증가 |
| 본 하네스 baseline | Claude 사용 시 17.8~58% 범위 (작업 유형별) |
| 추가 mitigation 가능 | 위 baseline에 7가지 기법 적용 시 추가 감소 |

---

## 6. 2025-2026 통합·하이브리드 동향

| 프레임워크 | 출처 | 구조 |
|-----------|------|------|
| **DRAG** (Debate-Augmented RAG) | ACL 2025 | Multi-Agent Debate + RAG |
| **VOTE-RAG** | arXiv 2026 | Ensemble Voting + RAG |
| **RAG-KG-IL** | arXiv 2025 | RAG + Knowledge Graph + Incremental Learning |
| **MEGA-RAG** | 2025 | 다중 출처 evidence retrieval + cross-encoder reranking |
| **InEx** | AAAI 2026 | Introspection + Cross-modal multi-agent (6.5~26.7% 향상) |

**공통 트렌드**:
1. RAG가 토대
2. Multi-Agent 또는 Voting을 Critical 영역에 추가
3. 단일 방법론은 점차 비주류

---

## 7. 하네스 적용 시나리오 (v2.0 — 시나리오 5 추가)

### 시나리오 1 — RAG 중심
단순함 우선. 사실 환각 차단 충분, 추가 메커니즘 없음.

### 시나리오 2 — RAG + Critical Multi-Agent (v1.0 권고)
차등 적용. Critical Path 정의 필요. 균형형.

### 시나리오 3 — Full Hybrid (DRAG/VOTE-RAG 수준)
최고 효과 추구. 1인 운영에는 과잉.

### 시나리오 5 — Anthropic Native ★★★ (v2.0 권고)

```
[기본 prompting layer — 모든 작업에 자동 적용]
    ├─ "I don't know" 명시적 허용 (모름 보고 4모드 통합)
    ├─ External knowledge restriction (요청 시)
    └─ Citations 의무화 (사실 작업 한정)

[Mode Toggle]
    ├─ Research Mode → 기본 + Chain-of-thought verification + Direct quotes
    └─ Default Mode → 기본만 (창의 작업 보호)

[Critical Path 작업 한정]
    ├─ Best-of-N verification (N=3, Multi-Agent 경량 대체)
    └─ 의무 RAG (MCP·외부 데이터 fetch)

[추가 강화 (선택적)]
    └─ Chain-of-thought verification (추론 영역만)
```

**채택 근거**:
1. **Claude와 정합도 최고** — Anthropic이 직접 권장하는 패턴
2. **1인 운영 최적** — Multi-Agent 같은 무거운 인프라 없이도 강력
3. **하네스 SVOP 직접 흡수** — "Refusal over Guessing" 패러다임이 SVOP default-deny와 일치
4. **Toggle로 P3 정합** — 사실 작업 vs 창의 작업의 트레이드오프 명시적 분리
5. **점진적 도입 가능** — prompting부터 시작해 RAG, Best-of-N 순차 적용

### 시나리오 4 — 사용자 정의 조합
직접 정의.

---

## 8. v2.0 최종 권고 — 시나리오 5 (Anthropic Native) ★

### 채택 결정 (운영자 직접 확인)
2026-05-23 — 운영자는 v2.0 권고대로 **시나리오 5 (Anthropic Native)**를 채택했습니다.

### (3) 신뢰성 본격 작업의 출발점

시나리오 5를 토대로 (3)의 5개 항목을 다음과 같이 풀어갑니다.

| (3) 항목 | 시나리오 5의 대응 |
|--------|-----------------|
| 사실 진술 vs 추론·창작의 분리 메커니즘 | **Mode Toggle** (Research vs Default) |
| 외부 데이터 fetch 의무화의 구체 조건 | **Critical Path 정의 + External knowledge restriction** |
| "모름을 강제로 표면화" (카파시 #1 흡수) | **"I don't know" 명시적 허용 + Citations 의무화** |
| 위험도 분류 및 critical path 방어 | **Best-of-N + 의무 RAG (Critical 작업 한정)** |
| Layer 3 MCP 데이터 출처별 검증 정책 | **출처별 신뢰도 가중치 + Citations 의무화로 통합** |

### 시나리오 5의 한계 (솔직히 짚어둘 점)

1. **Prompting 기반의 약점** — 시스템 프롬프트가 무력화되거나 회피되면 무용지물
2. **Best-of-N도 같은 모델의 같은 편향 공유** — 다양성 한계
3. **Citation의 신뢰성** — AI가 citation 자체를 hallucinate 가능 (Direct quotes는 해결책)
4. **Mode Toggle의 분류 정확도** — "사실 작업" vs "창의 작업"의 경계가 항상 명확하지 않음

이 한계는 (3) 본격 작업 시 구체적으로 다룰 영역.

---

## 9. 추출 메타 정보

### 검토된 자료 (v2.0 신규 추가분)
- Anthropic 공식 가이드: `docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations`
- Artificial Analysis AA-Omniscience benchmark (2025-11)
- Google DeepMind FACTS benchmark (2025-12)
- Anthropic Claude 4.x calibration 정책 (Anthropic 자체 언급)
- OpenAI 2025 SimpleQA 분석
- Vectara HHEM benchmark
- HalluLens benchmark (2025)
- Claude 4.1/4.5/4.6 모델별 hallucination rate 데이터 (2025-11 ~ 2026-04)
- 실제 production 사례 (Reddit ColdPlankton9273, Mean_Smell_6469 등 보고)
- arXiv 2307.02185 (citation constraints trade-off)

### v1.0 대비 검증 강화 항목
| v1.0 추측 | v2.0 확인 |
|-----------|----------|
| Self-Refine 효과 ~20% | ✓ Madaan et al. 직접 확인 |
| Huang 비판 신뢰도 | ✓ ICLR 2024 채택 확인 |
| Du Multi-Agent | ✓ ICML 2024 채택 확인 |
| RAG 35-60% 감소 | ✓ 다수 도메인 보고 확인 |

### 한계
- 본 리서치는 일반 LLM 적용 사례 기반
- 1인 운영·자율 실행 선호 환경에 특화된 사례는 미발견 (본 하네스의 SVOP·운영자 정의 entity 등 기존 인프라가 사실 가장 좋은 사례)
- Chrome 직접 접근은 권한 이슈로 제한됨 (향후 사이트 권한 정리 시 활용 가능)

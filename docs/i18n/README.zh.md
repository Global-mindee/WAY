# W.A.Y? — Who Are You?（我不是开发者）

[한국어](README.ko.md) | [English](README.en.md) | **中文**

> 最个人化的，就是最契合的环境。
> W.A.Y? 是一个学习**你**的个人 AI 框架（harness），而不是一个要你去学的框架（framework）。

---

## W.A.Y? 是什么

W.A.Y?（"Who Are You?"）是为单个用户的 AI 协作打造的一层轻薄而耐久的运行层，
建立在 **"我不是开发者"** 这一前提之上。它不是为想再要一个框架的工程师准备的，
而是为任何希望自己的 AI 智能体已经懂得 *自己* 如何思考、如何工作的人准备的。

你不需要填写资料来配置它。你只需运行它，它便会分析你本地的 Claude Code（或其他 CLI
智能体）已经积累的关于你的工作记忆（working memory）——过往对话、设置、代码仓库（repo）、
提交节奏——并将其转化为关于你的指令风格、偏好与语气的结构化、耐久模型。你的工作方式
由此成为框架可复用的**资产（asset）**，而不再是每个会话都要重新解释的上下文。

框架只保留**元信息**（事件、模式、定义、统计）。真实的运营数据——实际数字、审批内容、
客户信息——隔离在各自独立的项目仓库中。数据不外泄，教训得以汇集。

---

## 核心理念

- **最个人化 = 最契合。** 通用智能体对谁都不是最优。W.A.Y? 从已经描述你的数据中推导出
  契合度，让你更少与工具较劲，更多地放心委派。
- **不为开发者而设。** 无需写代码即可获得价值。一个抽取（extraction）步骤读取你的上下文
  并起草模型，由你审阅并批准。
- **记忆成为资产。** 一次（可重跑的）抽取，将 CLI 中积累的记忆变为经过审阅、不断演进的
  自我定义（self-definition）。

详情：[`CONCEPT.zh.md`](CONCEPT.zh.md)。

---

## W.A.Y? 强调的三件事

### (1) 反幻觉 —— SVOP（默认拒绝，default-deny）

每一项事实主张都必须可追溯到六类可信来源之一：**USER、READ（文件）、BASH（shell）、
WEB、MEMORY、MCP（外部系统）。** 其余一律不予断言——不会用一个自信的猜测把它抹平，
而是先搁置，再通过五种诚实模式（honesty mode）之一进行报告。不填空，不说"通常 / 也许"，
不合成用户似乎想要的答案。这条规则源自一次真实失败（一个金融机构识别码被幻化为貌似合理
却错误的编码），并由此推广开来：来源若为空，就如实说明，并指出尝试过哪些来源。

### (2) 结构

少数永不破裂的承重规则，强过众多会弯折的规则。结构在不同任务、机器与模型之间保持完全
一致（不变性原则），这正是让行为可预测到足以信任的根本。

### (3) 知识积累

每个任务都能让框架略微更有能力——研究产出归入正确的知识库，教训归入记忆，一行事件归入
日志——全程不泄露运营数据。框架随时间复利累积，绝不悄然覆盖耐久知识。

### 然后是：full-loop

以上三种特性是地基。**full-loop** 则是其回报——它将一条指令端到端地推进八个阶段，
仅在真正重要的人工关卡（human gate）处停下。见下文
["full-loop"](#full-loop--端到端end-to-end编排)。

---

## 理念

### 原则（P1–P6）

- **P1 Plan-First** —— 在预期结果被具体定义之前，任何工作都不开始。
- **P2 Sync-Before-Execute** —— 仅在用户与 AI 约 90% 对齐之后才开始执行。
- **P3 Plan–Execute Separation** —— 计划由人主导，执行由 AI 主导。绝不混淆。
- **P4 Immutability** —— 结构在不同环境与模型之间运行一致。
- **P5 Data-Driven Dependency** —— 仅当依赖带来新数据或新视角时才接受；拒绝单薄的
  提示词封装（wrapper）。
- **P6 Operational One-Way + Meta Feedback** —— 数据不外泄，教训得以汇集。

### 反原则（AP1–AP3）

声明什么 *不是* 原则，与声明什么是原则同样重要。

- **AP1 非确定性是一种特性** —— 同一输入产生不同输出是正常且受欢迎的；框架不抑制这种
  变动性。
- **AP2 显式性不是原则** —— 对每个输出的完全可审计并非目标；只保留用于元反馈的轻量
  日志，而非把验证负担转嫁给你。
- **AP3 不主动隔离数据** —— 没有基于时间或信号的自动衰减（auto-staling）。层级（tier）
  与信任度仅在新数据挑战旧数据时才变化（push 驱动）；AI 只提供分析，由你决定。

---

## 五种信任机制

| # | 机制 | 作用 |
|---|------|------|
| 1 | **Mode Toggle** | 将每个任务自动归类为事实优先 / 创作优先 / 混合（混合默认归入保守的 research），并调整验证的严格度。你的一行 override 即可切换。 |
| 2 | **来源抓取（fetch）策略** | 任何事实主张（数字、姓名、日期、专有名词、引文）都触发强制抓取，与 Mode 无关。来源优先级：USER → BASH → READ → MCP → WEB → MEMORY。无猜测回退。 |
| 3 | **五种诚实模式** | 抓取失败时，框架以 UNKNOWN、PARTIAL、TOOL_FAILED、OUT_OF_SCOPE 或 UNCERTAIN 报告，而非猜测——既在行内标注，也在答尾汇总。 |
| 4 | **Critical Path + Best-of-N** | 高风险工作（外部影响、下游自动化衔接、回退代价高，或你标注"重要"）强制 research 模式、强制抓取，以及 **Best-of-N 验证（N=3）**：3/3 一致 → 采纳；2/1 → 带不一致标记采纳；全部不同 → 搁置并征询你。 |
| 5 | **MCP 来源信任分级** | 外部系统数据分为 High / Medium / Low 三级。Medium 与 Low 必须标注来源（Low 还须注明原因）；冲突时同时呈现两个来源，若属 Critical 工作则汇入 Best-of-N。 |

详细规则位于 [`rules/`](../../rules/) 下：`mode-toggle.md`、`fetch-policy.md`、
`unknown-modes.md`、`critical-path.md`、`mcp-trust-levels.md`。

---

## 用户模型的演进

自我定义并非冻结。它通过四种机制演进，但仅在新数据挑战旧数据时——且实质性变更须经你
批准，绝无悄然的自我改写（与 AP3 一致）。

- **SDE（Self-Definition Extraction）** —— 读取你的上下文，连同置信度标记起草/更新
  五大领域模型的抽取器。
- **变更追踪** —— `self/changelog.md` 记录模型随时间的变化。
- **缺口追踪** —— `self/conflicts.md` 保存尚未解决的张力与待答问题，而不加以掩盖。
- **三层记忆** —— 已批准知识的晋升库：

| 层级 | 位置 | 访问 |
|------|------|------|
| Public | `memory/public/` | 显式调用（已晋升、已批准的知识） |
| Quarantine | `memory/quarantine/` | 仅显式调用 |
| Archive | `memory/archive/` | 仅显式调用，**绝不删除（never deleted）** |

MEMORY 来源的正本（canonical）是 CLI 内置的 auto-memory；框架的 `memory/` 层级是
通过批准之知识的晋升库。

---

## full-loop —— 端到端（end-to-end）编排

**full-loop** 接收一条自然语言指令，自主地推进八个阶段：

1. 提示词精化（结构化任务、归类意图、为模糊度评分）
2. 条件性市场/网络研究
3. 带冻结**验收标准（acceptance criteria）**的 plan 模式规划
4. **人工批准**（关卡）
5. 执行
6. 独立评审（Claude 评审，外加可选的异厂 codex 评审）
7. 有限重试 —— 至多 **三次** 尝试
8. 知识沉淀

三道人工关卡**绝不绕过**：

- **计划批准** —— 在执行前，由你批准计划（以及任何预先委派的外部行为）。
- **外部影响** —— 触及外部世界的行为（push、发送、API 调用）要么随计划预先批准，要么在
  循环继续运行期间入队延后，再在最终报告中决定。由工具级护栏强制执行，而不依赖模型自报。
- **重试耗尽** —— 若在预算内无法满足标准，则诚实停下并征询，而非宣布虚假的成功。

请用于多步骤工作 —— 研究 + 规划 + 构建 + 验证 —— 包括在人工关卡处暂停的无人值守夜间运行。
**不要**用于一行修复或一个快速提问。见
[`skills/07_orchestration/full-loop/SKILL.md`](../../skills/07_orchestration/full-loop/SKILL.md)。

> **计划独立公开发布（下一步工作）。** full-loop 将被拆分为独立的仓库，以便单独使用与
> 贡献。

---

## 目录结构

| 路径 | 作用 |
|------|------|
| `CLAUDE.md` | 每个 AI 智能体在此开始工作时自动加载的基础指令 |
| `harness-blueprint.md` | 框架设计文档 |
| `self/` | 你的整合自我定义 + 变更/缺口/背景日志 |
| `memory/` | 三层记忆（public / quarantine / archive） |
| `rules/` | 详细运行规则（mode-toggle、fetch-policy、unknown-modes、critical-path、mcp-trust-levels、context-management、p6-log-anonymization） |
| `agents/` | 按任务类型划分的子智能体定义（+ INDEX、USAGE-GUIDE） |
| `skills/` | 可复用的技能模块（含 `sde-extractor`、`full-loop`）（+ INDEX、USAGE-GUIDE） |
| `decisions/` | 审批队列（`pending.md`）+ 归档 |
| `logs/` | operations / decisions / meta-feedback 日志 |
| `projects/` | 仅含各项目的元信息（真实运营数据存于外部仓库） |
| `_reference/` | 外部参考资料（用于引用/洞察，非用于执行） |
| `docs/i18n/` | 本地化 README（ko / en / zh） |

---

## 入门

入门是一份简短的清单 —— 克隆、（可选）安装插件、运行抽取器、审阅并批准你的自我定义，
框架便已上线。每一步都会注明它所触及的文件。

完整指引：[`ONBOARDING.zh.md`](ONBOARDING.zh.md)。

---

## 第三方来源

W.A.Y? 立足于他人的工作 —— 可选的 `insane-search`、`deep-research` 插件（fivetaku，
MIT / 上游），可选的异厂 codex / GPT-5.5 评审器（OpenAI，付费，可选启用），以及
insane-search 自身的依赖。完整署名与许可证：[`CREDITS.md`](../../CREDITS.md)。

许可证：MIT —— 见 [`LICENSE`](../../LICENSE)。

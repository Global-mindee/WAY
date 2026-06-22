# W.A.Y? — Who Are You? (I'm not a developer)

<p align="center">
  <img src="../../assets/hero.png" alt="W.A.Y? — Who Are You?" width="100%">
</p>

[한국어](README.ko.md) | **English** | [中文](README.zh.md)

![License](https://img.shields.io/badge/license-MIT-blue) ![Built for](https://img.shields.io/badge/built%20for-Claude%20Code-8A2BE2) ![For](https://img.shields.io/badge/for-non--developers-orange) ![Harness](https://img.shields.io/badge/harness-v0.1-green)

**Built with** [insane-search](https://github.com/fivetaku/insane-search) and [deep-research](https://github.com/fivetaku/gptaku_plugins) by [fivetaku](https://github.com/fivetaku) (MIT) · full attribution in [CREDITS.md](../../CREDITS.md)

> *"The most personal is the most creative."* — Martin Scorsese

I'm not a developer, and I'm no programming expert. But I work in planning, and I think
of myself as someone who works across a lot of areas. For the past year I chased the
words of well-known people in the AI scene — I tried Andrej Karpathy's wiki, Garry Tan's
gstack, and many others' harnesses, skills, and loops — but they were never mine, and
because they weren't mine, it was hard to get the results I wanted out of them.

The conclusion I've reached, as of now, is that the most personal thing is the most
effective one (just like Scorsese said). Everyone is bound to differ in every way — how
they think, how they talk to their AI, what they expect back — from start to finish.

So I prepared this: a kit to make the most personal thing, plus the features to secure a
minimum of stability. The W.A.Y? ("Who Are You?") harness is a beginner's kit that reads
the sessions and memory accumulated in the Claude you've each been working with, guesses
your way of working, your speech patterns, and your expected results, and builds a
harness that's yours.

I tried to lay out, structurally, the parts I think most need to hold. It carries three
core concepts, one core tool (`/full-loop`), and nine foundational pieces of philosophy.

Even a kit built this way won't end up speaking for you. I recommend using it as a base
to grow an environment that's even more you — precisely, and flexibly.

---

## Three things W.A.Y? emphasizes

### (1) Anti-hallucination — SVOP (default-deny)

Every factual claim must trace to one of six trusted sources: **USER, READ (file), BASH
(shell), WEB, MEMORY, MCP (external system).** Anything else is not asserted — it is
held and reported through one of five honesty modes instead of being smoothed over with
a confident guess. No filling blanks, no "usually / probably," no synthesizing the
answer the user seems to want. The rule was born from a real failure (a
financial-institution identifier hallucinated as a plausible-but-wrong code) and
generalized: if the sources came up empty, say so and name which sources you tried.

### (2) Structure

A small set of load-bearing rules that never break is stronger than many rules that
bend. The structure stays identical across tasks, machines, and models (the
immutability principle), which is what makes behavior predictable enough to trust.

### (3) Knowledge accumulation

Each task can leave the harness slightly more capable — research outputs to the right
knowledge store, lessons to memory, a one-line event to the log — all without leaking
operational data. The harness compounds over time and never silently overwrites durable
knowledge.

### And then: full-loop

The three properties above are the foundation. **full-loop** is the payoff — it runs a
single instruction end-to-end through eight stages while stopping only at the human
gates that matter. See ["full-loop"](#full-loop--end-to-end-orchestration) below.

---

## Philosophy

### Principles (P1–P6)

- **P1 Plan-First** — no work starts until the desired outcome is concretely defined.
- **P2 Sync-Before-Execute** — execution begins only after user and AI are ~90% aligned.
- **P3 Plan–Execute Separation** — planning is human-led; execution is AI-led. Never mix.
- **P4 Immutability** — the structure works identically across environments and models.
- **P5 Data-Driven Dependency** — accept a dependency only if it brings new data or a
  new vantage point; reject thin prompt wrappers.
- **P6 Operational One-Way + Meta Feedback** — data doesn't leak; lessons do.

### Anti-Principles (AP1–AP3)

Declaring what is *not* a principle matters as much as declaring what is.

- **AP1 Non-determinism is a feature** — varying output from the same input is normal
  and welcome; the harness does not suppress that variability.
- **AP2 Explicitness is not a principle** — full auditability of every output is not a
  goal; only light logging, for meta-feedback, not for offloading verification onto you.
- **AP3 No active data quarantine** — no time- or signal-based auto-staling. Tiers and
  trust change only when new data challenges the old (push-based); the AI provides
  analysis only, and you decide.

---

## Five trust mechanisms

| # | Mechanism | What it does |
|---|-----------|--------------|
| 1 | **Mode Toggle** | Auto-classifies each task as research-first, creative-first, or mixed (mixed defaults to research, the conservative choice), and tunes how strict verification is. A one-line override from you switches it. |
| 2 | **Source fetch policy** | Any factual claim (numbers, names, dates, proper nouns, quotes) triggers a mandatory source fetch, regardless of mode. Source priority: USER → BASH → READ → MCP → WEB → MEMORY. No guessing fallback. |
| 3 | **Five honesty modes** | When a fetch fails, the harness reports — not guesses — via UNKNOWN, PARTIAL, TOOL_FAILED, OUT_OF_SCOPE, or UNCERTAIN, inline and in an end-of-answer summary. |
| 4 | **Critical Path + Best-of-N** | High-stakes work (external impact, downstream automation, costly-to-reverse, or you flag it "important") forces research mode, mandatory fetch, and **Best-of-N verification (N=3)**: 3/3 agree → accept; 2/1 → accept with a disagree marker; all-different → hold and ask you. |
| 5 | **MCP source-trust grading** | External-system data is graded High / Medium / Low. Medium and Low must cite their source (Low must also name the reason). Conflicts surface both sources; on Critical work this flows into Best-of-N. |

Details live under [`rules/`](../../rules/): `mode-toggle.md`, `fetch-policy.md`,
`unknown-modes.md`, `critical-path.md`, `mcp-trust-levels.md`.

---

## User-model evolution

The self-definition is not frozen. It evolves through four mechanisms, but only when new
data challenges the old — and material changes go through your approval, never silent
self-rewrites (consistent with AP3).

- **SDE (Self-Definition Extraction)** — the extractor that reads your context and
  drafts/updates the five-area model with confidence markers.
- **Change tracking** — `self/changelog.md` records how the model shifts over time.
- **Gap tracking** — `self/conflicts.md` holds unresolved tensions and open questions
  rather than papering over them.
- **Three-tier memory** — a promotion store for approved knowledge:

| Tier | Location | Access |
|------|----------|--------|
| Public | `memory/public/` | explicit call (promoted, approved knowledge) |
| Quarantine | `memory/quarantine/` | explicit call only |
| Archive | `memory/archive/` | explicit call only, **never deleted** |

The canonical MEMORY source is the CLI's built-in auto-memory; the harness `memory/`
tiers are a promotion store for knowledge that has passed approval.

---

## full-loop — end-to-end orchestration

**full-loop** takes one natural-language instruction and drives it autonomously through
eight stages:

1. Prompt refinement (structure the task; classify intent; score ambiguity)
2. Conditional market/web research
3. Plan-mode planning with frozen **acceptance criteria**
4. **Human approval** (gate)
5. Execution
6. Independent review (Claude review, plus optional cross-vendor codex review)
7. Bounded retry — up to **three** attempts
8. Knowledge deposit

Three human gates are **never bypassed**:

- **Plan approval** — you approve the plan (and any pre-delegated external actions)
  before execution.
- **External impact** — outside-world actions (pushes, sends, API calls) are either
  pre-approved with the plan, or queued and deferred while the loop keeps running, then
  decided in the final report. A tool-level guard enforces this rather than trusting
  the model to self-report.
- **Retry exhausted** — if the criteria cannot be met within the budget, it stops
  honestly and asks, instead of declaring false success.

Use it for multi-step work — research + plan + build + verify — including unattended
overnight runs that pause at the human gates. Do **not** use it for a one-line fix or a
quick question. See [`skills/07_orchestration/full-loop/SKILL.md`](../../skills/07_orchestration/full-loop/SKILL.md).

> **Independent public release planned (next work).** full-loop will be split out into
> its own standalone repository so it can be used and contributed to on its own.

---

## How to start

1. Clone this repository.
2. Run the `sde-extractor` in Claude Code (or onboard via `/full-loop`). It reads the
   sessions and memory built up in your CLI and drafts a self-definition for you.
3. Review the draft and approve it, and your own harness goes live.

See [Quick Start](#quick-start) and [ONBOARDING.en.md](../../ONBOARDING.en.md), with
deeper background in [CONCEPT.en.md](../../CONCEPT.en.md).

---

## Directory structure

| Path | Role |
|------|------|
| `CLAUDE.md` | Base instructions every AI agent auto-loads when it starts work here |
| `harness-blueprint.md` | The harness design document |
| `self/` | Your integrated self-definition + change/gap/background logs |
| `memory/` | Three-tier memory (public / quarantine / archive) |
| `rules/` | Detailed operating rules (mode-toggle, fetch-policy, unknown-modes, critical-path, mcp-trust-levels, context-management, p6-log-anonymization) |
| `agents/` | Sub-agent definitions by task type (+ INDEX, USAGE-GUIDE) |
| `skills/` | Reusable skill modules (incl. `sde-extractor`, `full-loop`) (+ INDEX, USAGE-GUIDE) |
| `decisions/` | Approval queue (`pending.md`) + archive |
| `logs/` | operations / decisions / meta-feedback logs |
| `projects/` | Per-project meta-info only (real operational data lives in external repos) |
| `_reference/` | External reference material (for citation/insight, not for execution) |
| `docs/i18n/` | Localized READMEs (ko / en / zh) |

---

## Requirements

| Requirement | Needed for |
|-------------|-----------|
| **Claude Code** (or any CLI agent that can read your memory, git history, and settings) | Running the harness and the extraction step |
| **git** | Cloning the repo; the extractor reads your commit rhythm |
| Optional plugins: **insane-search**, **deep-research** | Stronger web research (bypasses blocked sources, multi-source fact-checking) |
| Optional: **codex / GPT-5.5** (paid, opt-in) | Cross-vendor independent review inside full-loop |

Only the first two are required. Everything else is opt-in and the harness runs without it.

---

## Getting started

### Quick Start

```bash
# 1. Clone the harness
git clone https://github.com/Global-mindee/WAY.git
cd WAY

# 2. (optional) Install web-research plugins inside Claude Code
/plugin install insane-search
/plugin install deep-research

# 3. Onboard — the extractor reads your CLI memory, git, and settings,
#    then drafts your self-definition
run the sde-extractor

# 4. Review the draft, then approve it in decisions/pending.md
#    (nothing material is applied until you approve)
```

A short checklist — clone, optionally install plugins (`insane-search`, `deep-research`),
run the `sde-extractor`, review and approve your self-definition, and the harness is
live. Each step names the files it touches.

Full walkthrough: [`ONBOARDING.en.md`](../../ONBOARDING.en.md).

---

## Usage examples

You drive the harness with plain language — no special syntax. A few common openers:

- **Run something end-to-end:** *"full-loop this"* / *"run this end-to-end, ask me only at the gates"* — kicks off the eight-stage autonomous loop, stopping only at plan approval, external impact, and retry-exhausted.
- **Onboard or re-onboard:** *"run the sde-extractor"* / *"re-read my memory and update my self-definition"* — drafts or refreshes your user model from accumulated context.
- **Work the approval queue:** *"show me what's pending approval"* — surfaces the items waiting in `decisions/pending.md`; you approve by editing the file.
- **Deep research with sources:** *"research X with citations"* — fans out web searches, verifies claims, and returns a cited report instead of a guess.

---

## Third-party sources

W.A.Y? stands on others' work — the optional `insane-search` and `deep-research`
plugins (fivetaku, MIT / upstream), the optional cross-vendor codex / GPT-5.5 reviewer
(OpenAI, paid, opt-in), and insane-search's own dependencies. Full attribution and
licenses: [`CREDITS.md`](../../CREDITS.md).

License: MIT — see [`LICENSE`](../../LICENSE).

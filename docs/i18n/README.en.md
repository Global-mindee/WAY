# W.A.Y? — Who Are You? (I'm not a developer)

[한국어](README.ko.md) | **English** | [中文](README.zh.md)

> The most personal thing is the best-fitting environment.
> W.A.Y? is a personal AI harness that learns **you** — not a framework you learn.

---

## What W.A.Y? is

W.A.Y? ("Who Are You?") is a thin, durable operating layer for a single person's AI
collaboration — built on the premise **"I'm not a developer."** It is not for engineers
who want yet another framework. It is for anyone who wants their AI agent to already
understand how *they* think and work.

You do not configure it by filling in a profile. You run it, and it analyzes the working
memory your local Claude Code (or another CLI agent) already holds about you — past
conversations, settings, repos, commit rhythm — and turns that into a structured,
durable model of your instruction style, preferences, and voice. Your way of working
becomes an **asset** the harness reuses, instead of context you re-explain every
session.

The harness keeps only **meta-information** (events, patterns, definitions, statistics).
Real operational data — actual numbers, approvals, customer info — stays isolated in
separate project repos. Data doesn't leak; lessons do.

---

## The core concept

- **Most personal = best fit.** A generic agent is optimal for nobody. W.A.Y? derives
  the fit from data that already describes you, so you fight the tool less and can
  delegate more.
- **Not for developers.** No code required to get value. An extraction step reads your
  context and drafts your model; you review and approve.
- **Memory becomes an asset.** A one-time (re-runnable) extraction turns your CLI's
  accumulated memory into a reviewed, evolving self-definition the harness acts on.

Full detail: [`CONCEPT.en.md`](../../CONCEPT.en.md).

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

## Getting started

Onboarding is a short checklist — clone, optionally install plugins, run the extractor,
review and approve your self-definition, and the harness is live. Each step names the
files it touches.

Full walkthrough: [`ONBOARDING.en.md`](../../ONBOARDING.en.md).

---

## Third-party sources

W.A.Y? stands on others' work — the optional `insane-search` and `deep-research`
plugins (fivetaku, MIT / upstream), the optional cross-vendor codex / GPT-5.5 reviewer
(OpenAI, paid, opt-in), and insane-search's own dependencies. Full attribution and
licenses: [`CREDITS.md`](../../CREDITS.md).

License: MIT — see [`LICENSE`](../../LICENSE).

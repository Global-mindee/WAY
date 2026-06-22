# W.A.Y? — Harness/Loop : Who Are You?

<p align="center">
  <img src="assets/hero.png" alt="W.A.Y? — Harness/Loop : Who Are You?" width="100%">
</p>

**Language:** [한국어](docs/i18n/README.ko.md) | [English](docs/i18n/README.en.md) | [中文](docs/i18n/README.zh.md)

![License](https://img.shields.io/badge/license-MIT-blue) ![Built for](https://img.shields.io/badge/built%20for-Claude%20Code-8A2BE2) ![For](https://img.shields.io/badge/for-non--developers-orange) ![Harness](https://img.shields.io/badge/harness-v0.1-green)

**Built with** [insane-search](https://github.com/fivetaku/insane-search) and [deep-research](https://github.com/fivetaku/gptaku_plugins) by [fivetaku](https://github.com/fivetaku) (MIT) · full attribution in [CREDITS.md](CREDITS.md)

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

## Three things it emphasizes

1. **Anti-hallucination (SVOP)** — default-deny: every factual claim must trace to a
   trusted source; otherwise it is held and reported honestly, never guessed.
2. **Structure** — a small set of load-bearing rules that never break, identical across
   tasks, machines, and models.
3. **Knowledge accumulation** — each task can leave the harness more capable, without
   leaking operational data.

And then **full-loop** — the payoff that runs a task end-to-end while stopping only at
the human gates that matter.

---

## Philosophy

**Principles**
- **P1 Plan-First** — no work starts until the outcome is concretely defined.
- **P2 Sync-Before-Execute** — execute only after user and AI are ~90% aligned.
- **P3 Plan–Execute Separation** — planning is human-led; execution is AI-led.
- **P4 Immutability** — the structure works identically across environments and models.
- **P5 Data-Driven Dependency** — accept a dependency only if it brings new data or a
  new vantage point; reject thin wrappers.
- **P6 Operational One-Way + Meta Feedback** — data doesn't leak; lessons do.

**Anti-Principles**
- **AP1** — non-determinism is a feature (variability is not suppressed).
- **AP2** — explicitness is not a principle (light logging only, not user-offloaded
  verification).
- **AP3** — no active data quarantine (push-based; tiers/trust change only when new data
  challenges the old).

---

## Five trust mechanisms

| # | Mechanism | What it does |
|---|-----------|--------------|
| 1 | **Mode Toggle** | Classifies each task as research- / creative-first / mixed and tunes verification strictness; a one-line override switches it. |
| 2 | **Source fetch policy** | Any factual claim triggers a mandatory fetch. Priority: USER → BASH → READ → MCP → WEB → MEMORY. No guessing fallback. |
| 3 | **Five honesty modes** | On fetch failure, reports via UNKNOWN / PARTIAL / TOOL_FAILED / OUT_OF_SCOPE / UNCERTAIN — inline and in a closing summary. |
| 4 | **Critical Path + Best-of-N** | High-stakes work forces research mode, mandatory fetch, and N=3 verification (3/3 accept · 2/1 accept+flag · all-different hold and ask). |
| 5 | **MCP source-trust grading** | External data graded High / Medium / Low; Medium and Low must cite (Low names the reason); conflicts surface both. |

Details: [`rules/`](rules/).

---

## User-model evolution

Not frozen — it evolves through **SDE** (the context-reading extractor), **change
tracking** (`self/changelog.md`), **gap tracking** (`self/conflicts.md`), and a
**three-tier memory** (public / quarantine / archive — archive is never deleted). It
only changes when new data challenges the old, and material changes go through your
approval.

---

## full-loop

One natural-language instruction → eight autonomous stages (refine → conditional
research → plan with frozen acceptance criteria → **human approval** → execute →
independent review → bounded retry, max 3 → knowledge deposit). Three human gates are
never bypassed: **plan approval**, **external impact**, **retry exhausted**. Use it for
multi-step work and unattended overnight runs; not for one-line fixes.
See [`skills/07_orchestration/full-loop/SKILL.md`](skills/07_orchestration/full-loop/SKILL.md).

> **Independent public release planned (next work)** — full-loop will be split into its
> own standalone repository.

---

## How to start

1. Clone this repository.
2. Run the `sde-extractor` in Claude Code (or onboard via `/full-loop`). It reads the
   sessions and memory built up in your CLI and drafts a self-definition for you.
3. Review the draft and approve it, and your own harness goes live.

See [Quick Start](#quick-start) and [ONBOARDING.en.md](ONBOARDING.en.md), with deeper
background in [CONCEPT.en.md](CONCEPT.en.md).

---

## Directory structure

> Prefer a picture? Open [`docs/architecture.html`](docs/architecture.html) in a browser
> for a one-page diagram of how the harness is put together.

| Path | Role |
|------|------|
| `CLAUDE.md` | Base instructions every AI agent auto-loads here |
| `harness-blueprint.md` | The harness design document |
| `self/` | Your self-definition + change/gap/background logs |
| `memory/` | Three-tier memory (public / quarantine / archive) |
| `rules/` | Operating rules (mode-toggle, fetch-policy, unknown-modes, critical-path, mcp-trust-levels, context-management, p6-log-anonymization) |
| `agents/` | Sub-agent definitions by task type (+ INDEX, USAGE-GUIDE) |
| `skills/` | Reusable skill modules (incl. `sde-extractor`, `full-loop`) (+ INDEX, USAGE-GUIDE) |
| `decisions/` | Approval queue (`pending.md`) + archive |
| `logs/` | operations / decisions / meta-feedback logs |
| `projects/` | Per-project meta-info only (operational data lives in external repos) |
| `_reference/` | External reference material (citation/insight, not execution) |
| `docs/i18n/` | Localized READMEs (ko / en / zh) |
| `docs/architecture.html` | One-page visual architecture diagram (open in a browser) |

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
git clone https://github.com/minjun8702-byte/WAY.git
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

Full walkthrough: [`ONBOARDING.en.md`](ONBOARDING.en.md).

---

## Usage examples

You drive the harness with plain language — no special syntax. A few common openers:

- **Run something end-to-end:** *"full-loop this"* / *"run this end-to-end, ask me only at the gates"* — kicks off the eight-stage autonomous loop, stopping only at plan approval, external impact, and retry-exhausted.
- **Onboard or re-onboard:** *"run the sde-extractor"* / *"re-read my memory and update my self-definition"* — drafts or refreshes your user model from accumulated context.
- **Work the approval queue:** *"show me what's pending approval"* — surfaces the items waiting in `decisions/pending.md`; you approve by editing the file.
- **Deep research with sources:** *"research X with citations"* — fans out web searches, verifies claims, and returns a cited report instead of a guess.

---

## Third-party sources

Optional plugins (`insane-search`, `deep-research` — fivetaku, MIT / upstream), an
optional cross-vendor codex / GPT-5.5 reviewer (OpenAI, paid, opt-in), and
insane-search's own dependencies. Full attribution: [`CREDITS.md`](CREDITS.md).

License: MIT — see [`LICENSE`](LICENSE).

# W.A.Y? — Who Are You? (I'm not a developer)

**Language:** [한국어](docs/i18n/README.ko.md) | [English](docs/i18n/README.en.md) | [中文](docs/i18n/README.zh.md)

> The most personal thing is the best-fitting environment.
> A personal AI harness that learns **you** — not a framework you learn.

---

## What this is

W.A.Y? ("Who Are You?") is a thin, durable operating layer for one person's AI
collaboration, built on the premise **"I'm not a developer."** You do not configure it
by filling in a profile. You run it, and it analyzes the working memory your local
Claude Code (or another CLI agent) already holds about you — past conversations,
settings, repos, commit rhythm — and turns that into a structured, durable model of your
instruction style, preferences, and voice. Your way of working becomes an **asset** the
harness reuses, instead of context you re-explain every session.

The harness keeps only **meta-information** (events, patterns, definitions, statistics).
Real operational data stays isolated in separate project repos. Data doesn't leak;
lessons do.

---

## Core concept

- **Most personal = best fit** — a generic agent is optimal for nobody; W.A.Y? derives
  the fit from data that already describes you.
- **Not for developers** — no code required; an extraction step drafts your model, you
  review and approve.
- **Memory becomes an asset** — a one-time, re-runnable extraction turns your CLI's
  accumulated memory into a reviewed, evolving self-definition.

Deep dive: [`CONCEPT.en.md`](CONCEPT.en.md).

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

## Directory structure

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

---

## Getting started

A short checklist — clone, optionally install plugins (`insane-search`, `deep-research`),
run the `sde-extractor`, review and approve your self-definition, and the harness is
live. Each step names the files it touches.

Full walkthrough: [`ONBOARDING.en.md`](ONBOARDING.en.md).

---

## Third-party sources

Optional plugins (`insane-search`, `deep-research` — fivetaku, MIT / upstream), an
optional cross-vendor codex / GPT-5.5 reviewer (OpenAI, paid, opt-in), and
insane-search's own dependencies. Full attribution: [`CREDITS.md`](CREDITS.md).

License: MIT — see [`LICENSE`](LICENSE).

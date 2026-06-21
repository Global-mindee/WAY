# Getting Started with W.A.Y?

> A step-by-step checklist to take W.A.Y? from "just cloned" to "running as your
> personal harness." You do not need to be a developer to finish this. The hard part —
> reading your context and drafting your model — is done for you; your job is to review
> and approve.

Each step notes **which files it touches**, so nothing happens to your environment that
you cannot see.

---

## Before you start

- A local CLI agent (Claude Code, or another CLI that can read your environment).
- A few minutes of attention at the review step — that is the one place that needs
  **you**.

The harness works on its core alone. The optional plugins below only widen its reach;
skip them if you want a minimal setup.

---

## Step 1 — Clone

Get the repository onto the machine where your CLI agent runs.

```bash
git clone <your-fork-or-this-repo-url> WAY
cd WAY
```

- **Touches**: a new `WAY/` working directory. Nothing in your home or other repos.
- The `CLAUDE.md` at the repo root is the base instruction every agent auto-loads when
  it starts work here. You do not edit it to onboard.

---

## Step 2 — Install plugins (optional)

W.A.Y? runs without any plugins. Two are recommended if you want stronger web research:

- **insane-search** — adaptive bypass for blocked / bot-protected sources, so market
  and web research does not silently lose data. (fivetaku, MIT — see `CREDITS.md`.)
- **deep-research** — multi-source, fact-checked research with cited synthesis, pairing
  with the full-loop research phase. (fivetaku — see `CREDITS.md`.)

Install via your CLI's plugin command (for Claude Code, the `/plugin` flow, from the
`gptaku-plugins` marketplace). Plugins typically activate after a session restart.

- **Touches**: your CLI's plugin configuration (user scope), not the harness files.
- **Skip-friendly**: if you skip this, the harness falls back to ordinary web fetch and
  the honesty modes; you lose only coverage of bot-protected sources.

---

## Step 3 — Run the self-definition extractor

This is the heart of onboarding. Run the `sde-extractor` skill (its prompt lives at
`skills/05_knowledge-and-memory/sde-extractor/SKILL.md`). You can paste that prompt as
the first message to your CLI agent, or invoke the skill directly.

The extractor reads — in order — your accessible context: prior conversations,
home-directory config, the harness files, your active project repos, your git activity,
your shell setup, and your recent working directories. It reports what it found at each
source (and what it could not access).

- **Touches (reads only)**: your CLI's memory, `~/` config files, this harness, your
  project repos, `git log`, shell config. It does **not** modify any of these.
- **Writes (draft)**: a draft of `self/self-definition.md`.

---

## Step 4 — Self-definition is drafted automatically

From what it read, the extractor fills five areas — identity, knowledge, thinking style,
work patterns, preferences — and tags every item with a confidence marker:

- confirmed directly from data,
- strongly inferred from a pattern (the pattern is noted),
- unknown — needs to ask you.

It will **not** guess the unknowns. It gathers them and asks you **once**, in a single
batched question (the five most important first, if there are many). Answer those, and
it folds your answers back in.

- **Writes**: `self/self-definition.md` (the structured model).
- Companion files that track how the model changes over time live alongside it:
  `self/changelog.md`, `self/conflicts.md`, `self/background-log.md`.

---

## Step 5 — Review and approve

Open `self/self-definition.md` and read it. This is the one step that requires your
judgment — the harness will act on this model, so it should reflect the real you.

- Correct anything mis-inferred. Fill or fix items the extractor marked unknown.
- Approve when it looks right.

Changes to self-definition that are significant go through this approval rather than
silent self-rewrites — both now and later, as the model evolves.

- **Touches**: `self/self-definition.md` (your edits), and an approval/decision trail
  in `decisions/pending.md` for anything that needs sign-off.

---

## Step 6 — The harness is live

From here, every time your agent starts work in this repo it auto-loads, in order:

1. `self/self-definition.md` — your current identity and work patterns.
2. `decisions/pending.md` — any approvals waiting on you (surfaced in the first reply).
3. `rules/` — the operating rules, called as needed.
4. `skills/USAGE-GUIDE.md` + `skills/INDEX.md` — to pick the right skill for your
   request.
5. `agents/USAGE-GUIDE.md` + `agents/INDEX.md` — to pick the right sub-agent.

The trust machinery now runs automatically: source-verified output (SVOP), the Mode
Toggle, the five honesty modes, Critical Path with Best-of-N verification, and
source-trust grading.

---

## Step 7 — Try full-loop (when you have a multi-step task)

For anything that needs research + planning + building + verifying, hand it to
**full-loop** (`skills/07_orchestration/full-loop/SKILL.md`). Say something like
"run this end-to-end" or "full-loop this," and it drives the eight-stage pipeline —
stopping at the human gates (plan approval, external impact, retry exhausted) and
nowhere else.

- **Touches**: a local loop-state file (`.claude/full-loop-state.local.json`) so the
  loop survives interruptions, plus whatever the task itself targets.
- **Do not** use full-loop for a one-line fix or a quick question — it will tell you so
  and just answer directly.

---

## What good looks like

- `self/self-definition.md` exists, reviewed by you, with unknowns resolved rather than
  guessed.
- Your agent's first reply in the repo surfaces any pending approvals.
- Factual answers carry source markers; gaps are reported honestly instead of filled.

That is a live, personal harness. From here it gets more useful the more you use it —
because lessons accumulate while your operational data stays where it belongs.

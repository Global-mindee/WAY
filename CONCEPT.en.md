# W.A.Y? — The Concept

> **Who Are You? — "I'm not a developer."**
>
> The most personal thing is the best-fitting environment.

---

## The one-line thesis

Most AI tooling is built for developers, then asks everyone else to adapt to it.
W.A.Y? inverts that. It is not a framework you learn — it is a harness that learns
**you**, then carries your way of thinking across every task you hand it.

You do not configure W.A.Y? by filling in a profile. You run it, and it reads the
working memory your local Claude Code (or another CLI agent) has already accumulated
about you — your past conversations, your settings, your repos, your commit rhythm —
and turns that into a structured, durable model of how you give instructions, what you
prefer, and how you write. Your way of working becomes an **asset** the harness owns
and reuses, instead of context you re-explain every session.

---

## Why "most personal = best fit"

A generic agent is optimized for the average user, which means it is optimal for
nobody. The friction you feel is the gap between "what this tool assumes about a user"
and "who you actually are."

W.A.Y? closes that gap from the other direction. Instead of a one-size config, it
derives the fit from data that already describes you:

- **What you know** — your domains, the tools and methods you reach for by default.
- **How you think** — your decision style, whether you move abstract-to-concrete or
  the reverse, your meta-cognitive habits.
- **How you work** — your flow, your hours, how you collaborate, your tool patterns.
- **What you prefer** — output format, tone, length, depth (treated as secondary —
  surface, not substance).

The closer the harness sits to the real you, the less you fight it, and the more of
each task you can safely delegate. Personalization here is not a skin on the output.
It changes **the flow of the interaction itself** — which mode a request is handled in,
how much it syncs with you before executing, when it stops to ask.

---

## This is not for developers

"I'm not a developer" is the design premise, not an apology.

- You do not need to write code to get value from W.A.Y?.
- The onboarding does not ask you to author a config file. An extraction step
  (`sde-extractor`) does the reading and drafts the model; you review and approve.
- The hard machinery — verification, structure, escalation — runs underneath. What you
  see is a collaborator that already understands your defaults.

A developer can extend it. A non-developer can simply **be understood by it.** Both
get the same trustworthy core.

---

## The memory-to-asset mechanism

The thing that makes the fit personal is a one-time (and re-runnable) extraction:

1. Your local CLI agent already holds memory about you — prior sessions, home-directory
   config, harness files, active project repos, git activity, shell setup, recent
   working directories.
2. `sde-extractor` walks those sources in order, noting what it found at each step.
3. It drafts a structured `self/self-definition.md` across five areas (identity,
   knowledge, thinking style, work patterns, preferences), tagging every single item
   with a confidence marker:
   - confirmed directly from data,
   - strongly inferred from a pattern (with the pattern noted),
   - unknown — must ask you.
4. It does **not** quietly fill the unknowns. It collects them and asks you, once, in a
   single batched question.
5. You review and approve. Only then does the harness treat the definition as live.

This is deliberately the opposite of "tell me about yourself in five paragraphs." That
would be a self-declaration, not an extraction — and self-declarations drift from
reality. Data-grounded extraction, with honest unknowns surfaced rather than guessed,
is what makes the resulting model trustworthy enough to act on.

The model is **not frozen.** It evolves through a Self-Definition Extraction (SDE) loop,
explicit change tracking, gap tracking, and a three-tier memory — but it only changes
when new data challenges the old, and material changes go through your approval, never
silent self-rewrites.

---

## Why structure, anti-hallucination, and knowledge accumulation create trust

Personalization is only useful if you can trust what the harness does with it. Three
properties, working together, are what make delegation safe.

### (1) Anti-hallucination (SVOP)

SVOP — Source-Verified Output Policy — is **default-deny**. Every factual claim must
trace to one of a small set of trusted sources: the user, a file read, a shell command,
the web, memory, or an external system. Anything else is not asserted — it is held, and
reported through one of five honesty modes (unknown, partial, tool-failed,
out-of-scope, uncertain) instead of being smoothed over with a confident guess.

The discipline came from a real failure: a financial-institution identifier was once
hallucinated as a plausible-looking but wrong code. The lesson generalized into a rule —
no filling the blanks, no "usually / generally / probably" rationalizations, no
synthesizing the answer the user seems to want. If the sources came up empty, the
harness says so and names which sources it tried.

A few simple rules that never break are stronger than many rules that bend. SVOP is the
first of those.

### (2) Structure

The harness is a **thin, durable operating layer** that sits across all your projects.
The structure is what makes behavior predictable regardless of which task, which
machine, or which model you are on (the immutability principle, P4):

- A **Mode Toggle** classifies each task — research-first, creative-first, or mixed —
  and adjusts how strict verification is.
- A **Critical Path** policy recognizes high-stakes work (external impact,
  downstream automation, costly-to-reverse, or you flagging it "important") and forces
  the careful path: research mode, mandatory source fetch, Best-of-N verification, and
  an honesty summary.
- **Operational data stays isolated** from the harness; only meta-lessons flow back
  (P6 — "data doesn't leak, lessons do"). Your real numbers live in project repos; the
  harness keeps only patterns and definitions.

Structure is not bureaucracy. It is the small set of load-bearing walls that let
everything else stay flexible.

### (3) Knowledge accumulation

Each task can leave the harness slightly more capable than it found it — without
leaking operational data. Research outputs land in the right project's knowledge store
or the harness reference area (with operational numbers and real names tokenized at the
boundary). Lessons land in memory. A one-line event lands in the log. Over time the
harness compounds: it remembers what worked, surfaces what it does not know, and never
silently overwrites durable knowledge (the push-based, no-active-quarantine stance,
AP3).

---

## And then: full-loop

The three properties above are the foundation. **full-loop** is what they make possible.

full-loop takes a single natural-language instruction and drives it — autonomously —
through eight stages: prompt refinement, conditional market research, plan-mode
planning with frozen acceptance criteria, **human approval**, execution, independent
review, bounded retry (up to three attempts), and knowledge deposit.

The crucial part is what it will **not** do on its own. Three human gates are never
bypassed:

1. **Plan approval** — you approve the plan (and any pre-delegated external actions)
   before execution begins.
2. **External impact** — actions that touch the outside world (pushes, sends, API
   calls) are either pre-approved with the plan, or queued and deferred while the loop
   keeps going, then decided in the final report. A tool-level guard enforces this; it
   does not rely on the model self-reporting.
3. **Retry exhausted** — if execution cannot meet the criteria within the attempt
   budget, it stops honestly and asks, rather than declaring false success.

This is the payoff of "most personal = best fit." Because the harness already models
how you instruct and decide, and because every factual step is source-verified and
every high-stakes step is gated, you can hand it a multi-step task — even overnight,
unattended — and trust it to stop at exactly the points where a human decision is
required, and only there.

---

## In one breath

W.A.Y? is a personal harness for people who are not developers. It learns who you are
from the memory your CLI already holds, refuses to hallucinate, gives your work a
durable structure, accumulates knowledge as it goes, and then — through full-loop — runs
your tasks end-to-end while stopping at the human gates that matter.

The most personal thing turns out to be the best-fitting environment.

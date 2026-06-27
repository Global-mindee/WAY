# Credits & Third-Party Sources

W.A.Y? stands on the shoulders of work done by others. This document records every
third-party component the harness leans on, the people behind them, and their licenses.
If you redistribute or fork W.A.Y?, keep this attribution intact.

---

## Plugins

### insane-search (v0.8.2)

- **Author**: fivetaku
- **License**: MIT
- **Source**: github.com/fivetaku/insane-search
- **Distribution**: `gptaku-plugins` marketplace
- **Role in W.A.Y?**: Adaptive access for blocked sources during web research.
  When ordinary `WebFetch` / `WebSearch` is blocked, returns empty, or times out
  (social platforms, commerce portals, news aggregators, region-locked sites), the
  harness escalates to insane-search before falling back to the "unknown" reporting
  modes. Results obtained this way are still tagged as a WEB source — `[W: <url>]`.
- **Status in this repo**: optional. The harness functions without it; it only
  improves coverage of bot-protected sources.

### deep-research

- **Author**: fivetaku
- **License**: see upstream
- **Distribution**: `gptaku-plugins` marketplace
- **Role in W.A.Y?**: Optional multi-source, fact-checked research harness — fan-out
  web searches, source fetching, adversarial claim verification, and cited synthesis.
  Pairs naturally with the full-loop research phase (S2) and the Critical Path
  Best-of-N verification flow.
- **Status in this repo**: optional.

---

## External Model / Reviewer

### codex / GPT-5.5 (OpenAI)

- **Vendor**: OpenAI
- **Role in W.A.Y?**: Heterogeneous (cross-vendor) reviewer inside the full-loop
  orchestration. In an advisory, read-only capacity it cross-checks plans (full-loop
  S4) and independently reviews execution output (full-loop S6), giving a second,
  architecturally different pair of eyes that catches blind spots a single model
  family tends to share.
- **Cost note**: this is a **paid, opt-in** external call. Because invoking it sends
  code and deliverables to OpenAI, the harness automatically excludes tasks that touch
  sensitive data (personal information, private operational numbers, real names,
  git-isolated folders) from cross-vendor review, and discloses that exclusion in its
  first report. This is a deliberate boundary, consistent with the P6 one-way data
  principle.
- **Status in this repo**: optional. The Claude-only review path is fully functional
  on its own; codex review is an additive safety layer.

---

## Transitive Dependencies (via insane-search)

insane-search itself relies on the following libraries. Each carries its own upstream
license, which governs that component — consult the respective project for terms.

| Component | Purpose |
|-----------|---------|
| curl_cffi (≥ 0.15.0) | TLS impersonation (Chrome 146, HTTP/3) for bot-protected pages; SSRF-safe redirects |
| yt-dlp | Media/transcript extraction across a large catalog of sites |
| Jina Reader | Readable-content extraction from arbitrary URLs |
| feedparser | RSS / Atom feed parsing |
| Playwright | Real-Chrome headless fetch for the hardest WAF cases |
| Patchright (optional) | Drop-in Playwright replacement when installed (added v0.6.0) |

Since v0.8.0, insane-search caches per-host successful routes in `~/.insane_search/learned.json`
(home directory, outside any repo — never committed). It holds routing hints only, not
operational data, and can be disabled with `INSANE_LEARN=0`.

---

## A Note on Scope

These tools provide **data and perspective channels** (consistent with the P5
dependency criterion: accept dependencies that bring new data or a new vantage point;
reject thin prompt wrappers). They do not change the harness's core principles, which
remain model- and environment-independent.

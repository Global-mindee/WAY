# Security Policy

W.A.Y? ("Who Are You? — I'm not a developer") is a personal AI collaboration harness.
Its security model is unusual for a software project, because the most valuable thing it
protects is not a running service — it is **your data and your privacy**. This policy
covers both classic software vulnerabilities and the harness-specific risk of personal
information (PII) exposure.

---

## 1. What makes W.A.Y?'s security model different

Three properties of the harness are also its primary defenses. They are worth stating
plainly, because they shape what counts as a vulnerability here.

- **PII stays isolated in external repos.** The harness holds only meta-information —
  events, patterns, definitions, statistics. Real operational data (revenue, approval
  contents, API responses, customer data, real names, private identifiers) lives in
  separate project repos, never in the harness itself. This is the P6 one-way isolation
  principle: **data doesn't leak; lessons do.** A PII leak into this repository is
  therefore treated as a security issue, not merely a content mistake.

- **SVOP is default-deny.** The Source-Verified Output Policy refuses to assert any fact
  that does not trace to a trusted source (user, file read, shell command, web, memory,
  external system). Anything else is held and reported honestly through the five honesty
  modes, never guessed. This blocks a whole class of failure where a confident
  hallucination becomes an action.

- **Operational data flows one way.** Lessons and meta-patterns flow back into the
  harness; raw operational data does not. Research outputs are tokenized at the boundary
  (operational numbers and real names replaced with placeholders) before anything lands
  in the harness reference area.

A report that demonstrates a way to **break** any of these three guarantees — for
example, a path that causes PII to be written into harness files, or that lets an
unverified claim be asserted as fact and acted on — is exactly the kind of finding this
policy wants to hear about.

---

## 2. What to report

Please report:

- a **vulnerability** in any script, hook, skill, or automation shipped in this repo
  (for example, a command-injection or path-traversal risk in a helper script),
- a **PII exposure** already present in the repository (a real name, email, key, token,
  or operational value that slipped past review),
- a **leak path** — a documented or reproducible way the harness could write personal
  or operational data into tracked files,
- a **secret or credential** committed by mistake (so it can be rotated and purged).

If you are unsure whether something qualifies, report it. A false alarm costs a few
minutes; an unreported leak can cost much more.

---

## 3. How to report

**Do not open a public issue for a security or PII finding.** Public disclosure of a
leak before it is fixed only widens the exposure.

Use, in order of preference:

1. **GitHub Security Advisory (preferred).** Open a private advisory through the
   repository's Security tab:
   `https://github.com/Global-mindee/WAY/security/advisories/new`
   This keeps the report confidential between you and the maintainers until a fix is
   ready.
2. **A private channel** arranged via the repository, if a Security Advisory is not
   available to you. Avoid putting sensitive details (the leaked value itself, an
   exploit payload) in any public thread.

When you report, please include — without pasting the raw secret value if you can
reference it instead:

- a clear description of the issue and its impact,
- the file path(s) and line(s) involved, or steps to reproduce,
- if it is a leak path, a minimal example of how data could reach tracked files.

---

## 4. What to expect

- We aim to acknowledge a report promptly and keep you updated as we assess and fix it.
- For a committed secret or PII, the immediate priority is **containment** — rotating
  the secret, purging the value from history where feasible, and confirming the leak
  path is closed.
- Coordinated disclosure is appreciated: please give us a reasonable window to ship a
  fix before any public discussion.
- This is a personal, volunteer-maintained project, not a commercial product with an
  SLA. Response is best-effort, but security and PII reports are prioritized over
  ordinary issues.

---

## 5. Supported versions

| Version | Supported |
|---------|-----------|
| v0.x    | Yes — receives security and PII fixes. |
| < v0.1  | No — pre-release; please upgrade to v0.x. |

Security and PII fixes target the current v0.x line.

---

## 6. A note for contributors

The single most effective security measure here is the discipline already described in
[`CONTRIBUTING.md`](CONTRIBUTING.md): **never commit operational data or PII, and read
your full staged diff before every push.** Most leaks are prevented at the keyboard, not
caught after the fact. Thank you for keeping the harness honest and the data where it
belongs.

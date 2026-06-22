<!--
Thanks for contributing to W.A.Y? Keep changes small and aligned with the harness's
scope: built for non-developers, anti-hallucination first, structure that works the
same everywhere. The checklist below maps to the project's hard rules — please tick
each box honestly, or strike it through with a one-line reason if it doesn't apply.
-->

## Summary

What does this change do, and why? One or two plain-language sentences.

## Related issue

<!-- e.g. Closes #123 — or "none" -->

## Type of change

- [ ] Documentation (README, CONCEPT, ONBOARDING, docs/i18n, etc.)
- [ ] Rules / harness behavior (`CLAUDE.md`, `rules/`, `harness-blueprint.md`)
- [ ] Skill / agent definition
- [ ] Templates / repo meta (`.github/`, `assets/`)
- [ ] Other (explain below)

## Checklist

- [ ] **No personal information.** No real names, emails, private numbers, customer
      data, or contents of git-isolated folders anywhere in the diff. (The public repo
      URL `github.com/Global-mindee/WAY` is fine — that account is public.)
- [ ] **No operational data.** Only meta-information (events, patterns, definitions,
      statistics) is added — real operational data stays in external project repos
      (principle P6: data doesn't leak, lessons do).
- [ ] **Existing sections preserved.** I extended docs rather than dropping or
      silently rewriting existing sections; structural changes are called out in the
      summary above.
- [ ] **Three-language sync.** If I changed the README or other localized content, the
      `docs/i18n/` versions (ko / en / zh) are updated together — or I noted which
      remain to be translated.
- [ ] **Symbol rules followed.** No section-sign diamonds and no enclosed/circled
      numbers (use `(1)` `(2)` `(3)` form instead).
- [ ] **Honest about state.** Any feature described as working is actually working in
      this repo; anything unbuilt is marked as such, not implied to exist.

## Notes for reviewers

Anything that needs context, a trade-off you made, or a part you're unsure about.

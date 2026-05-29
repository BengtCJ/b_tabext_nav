# docs/tasks — Backlog

Deferred work orders. Promote to a numbered task (`NNNN-slug.md`) when ready to run.

- **Verification harness** — headless (Playwright) run that drives the table→chart→back
  swap, checks each metric's default chart against `CHART_SPEC.md`, and lints the
  `STYLE_SPEC.md` token rules + the ES2020 ban. **Land before task 0003 (charts)** —
  it's the keystone for unattended/autonomous runs (turns "self-verify" from a manual
  check into one command). _Deferred 2026-05-29._

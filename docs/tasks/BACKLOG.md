# docs/tasks — Backlog

Deferred work orders. Promote to a numbered task (`NNNN-slug.md`) when ready to run.

- **Verification harness** — headless (Playwright) run that drives the table→chart→back
  swap, checks each metric's default chart against `CHART_SPEC.md`, and lints the
  `STYLE_SPEC.md` token rules + the ES2020 ban. _Deferred 2026-05-29._
  **Status 2026-06-04:** The original gate ("land before task 0003") is gone — 0003 is
  closed. In-page coverage now exists: `runBanShellHarness()` (15 checks, ban shell only,
  console-callable). The gap is: (a) static lint (ES2020 `??`/`?.` ban, `vw`/`vh` ban,
  geometry font-size ban) run without a browser; (b) a single command that renders every
  metric's default chart and asserts no error + non-empty container. Promote only if the
  manual console-eval loop becomes a bottleneck or unattended runs are needed.

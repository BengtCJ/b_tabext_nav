# Task: 0001 — Subgroup resolution (dashboard.name → indicators)

Goal: On each detail dashboard, the extension reliably identifies its subgroup and
renders only that subgroup's indicators.

Why: Foundation for everything downstream (table, then charts). Pattern A — the subgroup
comes from the host dashboard. See CLAUDE.md → Architecture; TABLEAU_API_REALITY.md →
Recommended interaction patterns (Pattern A) + Migration path.

Read first: CLAUDE.md; TABLEAU_API_REALITY.md (Pattern A, Migration path, the
`dashboard.name` To-verify item); `CONFIG` / `DEFAULTS` in index.html.

## Decision (confirm before building — author's call, not Claude Code's)
Detail dashboards are named exactly their `subcategory_id` (`cmoaf`, `sbr`, …), so
`dashboard.name` maps to the subgroup directly. Resolution still reads the mapping from
**one place in CONFIG** (identity by default) so human-readable tab names can be added
later as a map entry, not a rewrite. If you'd rather name them human-readably now, say so
and populate that map instead.

## Pre-check (Rule 6 — verify the foundation in isolation, before building on it)
- [ ] `tableau.extensions.dashboardContent.dashboard.name` returns the dashboard's tab
  name. Record the result in TABLEAU_API_REALITY.md (move the `dashboard.name` item from
  To-verify → Confirmed, `[tested]` + date).
- [ ] The source worksheet actually carries `subcategory_id` (`CONFIG.subcategoryIdField`)
  with values matching the dashboard names / the 12 ids. If it doesn't, **stop and kick
  back to chat** — don't invent a column.

## In scope
- A single `resolveSubgroup()` with the documented precedence: in-extension selection
  (future — stub) → parameter (future — stub) → `dashboard.name` (live). Only the name
  branch active.
- Filter the cached all-subgroups rows (`_rawData`) to the resolved subgroup in JS, then
  render the existing indicator table for it (table sharpening is task 0002).
- Preview/sample mode: simulate a subgroup via URL (e.g. `?subgroup=cmoaf`) so it's
  testable without Tableau.

## Out of scope (do not touch)
- Table styling/layout (task 0002) and chart rendering (task 0003).
- Any real parameter/selection wiring — leave those branches as stubs.
- The native overview dashboards.

## Acceptance criteria (all must hold)
- [ ] On a detail dashboard named for subgroup X, the table shows only subgroup X's
  indicators, deduped by `indicator_id`.
- [ ] Subgroup is resolved by one function with the precedence above; only the name branch
  is live; adding the others later is a new branch, not a rewrite.
- [ ] Unknown/blank dashboard name → a clear empty/needs-config state, not a crash.
- [ ] Preview mode renders a chosen subgroup from the URL using sample data.
- [ ] Pre-check results recorded in TABLEAU_API_REALITY.md.

## Constraints (hard)
- Tokens only (STYLE_SPEC); no ES2020 (no `??` / `?.`); single file; size from
  offsetWidth/offsetHeight.
- Read field/parameter names from `CONFIG` / `DEFAULTS` — don't hardcode from memory.
- Verify any unconfirmed Tableau capability before building on it (reality doc rules 3 & 6).
- Don't change the specs or architecture — if one needs changing, stop and ask in chat.

## Verify by
- Open the live URL with `?subgroup=<id>` for two different subgroups and confirm the
  table swaps to the correct indicator set. (Verification harness not built yet — manual
  until a later task adds it.)

## On uncertainty
- Stop, record the finding in TABLEAU_API_REALITY.md, kick back to chat. Do not guess.

End with the Docs sync report (CLAUDE.md → End of session).

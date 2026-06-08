# Task: 0026 — cell-frame rule: make it explicit, checked, enforced

Goal: Turn the "grouped cells live in a hugging frame with a 2px hairline gutter"
      treatment from an implicit rule into an explicit one that the teardown checklist
      catches and the harness enforces — so it stops slipping (the Growth page shipped
      with free-floating cards despite the rule already existing).
Why:  Teardown of the Growth solution page — cards rendered as separate boxes with wide
      gaps, not cells of a table. The §Spacing rule already covers "grouped cells on
      detail/chart pages" but was never operationalized for native pages, surfaced in the
      teardown tiers, or asserted by the harness beyond the scorecard.

Read first: CLAUDE.md, STYLE_SPEC §Spacing / §Enforcement, WORKFLOW §Per-surface,
            TABLEAU_API_REALITY §Recommended interaction patterns (Pattern A native nav).

In scope:
- Apply the three verbatim Spec edits below to the repo docs.
- Extend the harness so the grouped-cell gutter/radius assertion is one shared check
  applied to EVERY grouped-cell container the extension renders (scorecard, ban context
  cells, scale segments), not scorecard-only.

Out of scope (do not touch):
- The native Tableau "Potential Growth" dashboard page itself — it is native dashboard
  objects (Containers/Text), authored in Tableau by the user, NOT extension code. Code
  cannot and must not try to build or assert against it. (Its compliance is a teardown
  check, per the §Enforcement edit's parenthetical.)
- The throwaway prototype HTML, any chart-rendering logic, any token VALUES.

Spec edit 1 (apply verbatim to STYLE_SPEC.md §Spacing — add as a new bullet immediately
after the existing "Cell gutter = 2px" override bullet, i.e. after the line ending
"...inherit that card's padding, not a 2px inset."):

  - **Native pages too.** The 2px-gutter / frame-shows-through treatment applies to
    **native Tableau dashboard pages** (e.g. the solution pages), not only the extension.
    Realise it with an outer Container holding the light-grey frame background + Corner
    Radius (frame radius = cell radius + 2), white child cells at the cell radius, and
    per-object padding tuned to a uniform 2px cell↔cell and cell↔frame. Forward
    navigation on these pages is a native **Navigation object** (Pattern A) — never a CTA
    rendered inside the card.

Spec edit 2 (apply verbatim to WORKFLOW.md §Per-surface — REPLACE the Tier-4 line
"4. **Spacing** — gaps, gutters, padding, inset; on the 4px grid + named overrides."
with the following two lines):

  4. **Spacing** — gaps, gutters, padding, inset; on the 4px grid + named overrides.
     **Grouping check (high-miss):** where the design groups cells, are they tiled inside
     a hugging frame with the 2px hairline gutter (frame shows through; radii nest,
     frame = cell + 2), or rendered as separate boxes with wide gaps? Free-floating boxes
     where the reference groups cells is a **Tier-2/4 blocker, not Tier-4 polish** — it
     kills the "cells of a table" reading. This is the recurring teardown miss; check it
     on native pages as well as extension-rendered ones.

Spec edit 3 (apply verbatim to STYLE_SPEC.md §Enforcement → "Visual fidelity" list — add
as a new bullet immediately after the "Corner radii nest:" bullet):

  - Grouped-cell containers the extension renders on **detail/chart surfaces** (not the
    scorecard only) use the 2px gutter and nested radii (frame = cell + gutter); the
    harness asserts no extension-rendered grouped-cell group ships with off-token gaps or
    a flat (non-nested) radius. (Native Tableau pages are out of harness reach — verify
    those by teardown.)

Acceptance criteria (definition of done — all must hold):
- [x] STYLE_SPEC.md contains Spec edits 1 and 3 verbatim at the stated locations; no other lines changed.
- [x] WORKFLOW.md contains Spec edit 2 verbatim (Tier-4 line replaced); no other lines changed.
- [x] The harness has ONE shared grouped-cell assertion (extend the existing scorecard /
      BAN-context-cell checks; do not duplicate) applied to every grouped-cell container
      the extension renders.
- [x] That assertion PASSES on current extension output, and FAILS a synthetic group with
      a >2px (off-token) gap or a non-nested radius (add/adjust a harness fixture to prove
      both directions).

Constraints (hard):
- Tokens only (STYLE_SPEC); change no token VALUES — this work order adds rules + a check,
  it does not retune sizes/colours/radii.
- No ES2020 (no ?? / ?.); single file; size from offsetWidth/offsetHeight.
- Apply ONLY the verbatim Spec edits named here; make no other spec/architecture change —
  if one seems needed, STOP and kick back to chat.
- Verify any unconfirmed Tableau capability against TABLEAU_API_REALITY before relying on
  it (this order relies only on Pattern A native nav, already confirmed).

Verify by:
- Run the harness: it passes on current output, and the new fixture fails as designed.
- Diff the two docs: only the three verbatim blocks changed, at the stated anchors.

On uncertainty:
- Stop, record the finding in TABLEAU_API_REALITY.md, kick back to chat. Do not guess.

Note (not an acceptance criterion): if the teardown skill keeps its own copy of the tier
list, mirror Spec edit 2 there so the operational checklist matches WORKFLOW. Flag in the
Docs-sync report if it's outside this repo.

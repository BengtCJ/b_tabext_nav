# 0029 — Docs: composite-cell description pass + nested-tile default

**Type:** DOCS ONLY — no code, no harness, no build.
**Status:** DONE

## Goal

Capture two process/spec lessons so the next composite surface is a one-pass spec
instead of round-tripping: a "composite-cell description pass" in the teardown loop,
and a "nested tile" default in the spacing tokens.

## Why

The In Practice anchor churned v4→v8 because its internal composition was described
in relative words ("double height", "within", "slightly inset") instead of grid units
and tokens — exactly the one-property-per-turn failure WORKFLOW §Per-surface already
warns against. These edits make "state the nameable ones in one pass" actionable.

## Edits applied

### Spec edit 1 — WORKFLOW.md §Per-surface step 3

Appended immediately after "...state the nameable ones in one pass rather than
discovering them one per turn.":

> **Composite-cell pass.** When a cell contains other elements, pin these six in one pass
> before prototyping: (a) the container and what it spans (in rows/cols), (b) each child =
> *container or tile*, (c) child insets *in gutter units*, (d) child sizes *in row/cell units*,
> (e) fixed vs fills, (f) the empty / no-data variant. Describe in grid units and tokens —
> never relative words ("double", "within", "slightly") or guessed px/%; those force
> one-property-per-turn discovery (the In Practice anchor burned v4→v8 on exactly this).

### Spec edit 2 — STYLE_SPEC.md §Spacing named-overrides list

Added as new bullet after the "Native pages too." bullet:

> - **Nested tile (default).** An element nested *inside* a cell (a tile within a card —
>   e.g. the In Practice image inside its card) is inset from the cell edge by the 2px gutter,
>   its radius nests (tile radius = cell radius − gutter), and its size is expressed in
>   cell/row units (e.g. "one solution-cell row"), not a % or guessed px. Saying "tile"
>   inherits all three; do not re-derive the inset/radius/size per surface.

## Acceptance criteria — verified

- [x] WORKFLOW.md contains Spec edit 1 verbatim at the stated location; no other lines changed.
- [x] STYLE_SPEC.md contains Spec edit 2 verbatim at the stated location; no other lines changed.
- [x] No code, harness, or other files touched.

## Note on teardown skill

The teardown skill may keep its own copy of the per-surface checklist. If so, Spec edit 1
should be mirrored there. The teardown skill lives outside this repo — flagged in Docs-sync.

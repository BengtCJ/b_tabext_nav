# Task: 0028 — BP Solutions: 6-cell scaffold + In Practice anchor (v8 design)

Goal: Bring `solutions_nav.html` to the v8 design — a fixed 6-cell solution scaffold +
      an In Practice anchor that is ONE white card spanning both rows, with image inset
      2px from the card edge and sized to one solution-card row at the top, text beneath
      (image drops if no case study) — with word pills, on-scale type, and overspill clamps.
Why:  Iterated design review against the Figma. Replaces the free-flow grid + trailing
      In Practice cell with a structured 3×2 scaffold + right-column anchor.

Read first: CLAUDE.md, STYLE_SPEC § Solutions surface + § Spacing + § Type roles +
            § Enforcement, CHART_SPEC § Solutions grid, WORKFLOW § Per-surface.

## Decisions confirmed

- SCAFFOLD COUNT: always 6 cells (default). Growth = 2 filled + 4 faint empty.
- VERDICT SIZE: 24px Baskerville italic (reuse ban-shell verdict size).
- EMPTY-SLOT LOOK: faint fill (`--empty: #F5F5F5`).
- TYPE bumps: Display 40→56, Heading 16→18, subtitle 13→19; Label/Caption held at 13/11.

## In scope (edits applied)

### `solutions_nav.html`
- Frame grid: `grid-template-columns: repeat(3, 1fr) minmax(0, 1fr)` + `grid-template-rows: 1fr 1fr` (3 sol columns + 1 anchor column, 2 rows; 2px gutter unchanged).
- Fixed 6-cell scaffold: always render 6 holding cells; fill from `shown` in display_order; surplus = `.sol-empty` (faint `--empty` fill).
- `.sol-name`: Heading 18px, `text-transform: uppercase`.
- `.sol-desc`: `margin-top: auto` (bottom-pinned), `-webkit-line-clamp: 3`, `overflow: hidden`.
- `.in-practice-anchor`: `grid-column: 4; grid-row: 1 / 3`; white `--card-bg`; `display: flex; flex-direction: column`; no border.
  - `.ip-img-wrap`: `padding: var(--gutter)` (2px inset); `height: calc((100% - var(--gutter)) / 2)` (one solution-row height).
  - `.ip-img`: `border-radius: 6px` (card 8 − gutter 2); `object-fit: cover`.
  - `.ip-text`: `flex: 1`; `padding: var(--sp-section)`.
  - `.ip-label`: Caption 11px, uppercase.
  - `.ip-verdict`: Baskerville italic 24px.
  - `.ip-reading`: Label 13px; `-webkit-line-clamp: 5`; `overflow: hidden`.
- New token: `--empty: #F5F5F5`.
- Type bumps: `.construct-title` 40→56px; `.construct-subtitle` 13→19px; `.sol-name` 16→18px.
- Removed: old `.in-practice-alt` / `.in-practice-primary` / related classes.
- Added: `resolveInPracticeVerdict()` for the Baskerville lead sentence.
- Harness: extended with type-role checks (56/19/18), slot-count check (6 solution slots), anchor-existence check, clamp/overflow checks.
- VERSION bumped to `2026-06-09.4`.

### `docs/CHART_SPEC.md`
Spec edits A1–A4 applied verbatim (see task brief).

### `docs/STYLE_SPEC.md`
Spec edits B and C reconciled into live § Solutions surface + § Enforcement sections.

### `docs/TABLEAU_API_REALITY.md`
Added `-webkit-line-clamp` confirmed-working entry (preview-verified; infer Tableau embedded Chromium).

## Acceptance criteria

- [ ] `?construct=growth` preview: 6-cell scaffold (2 filled + 4 faint empties), In Practice = one white card spanning both rows, image inset 2px, one row tall at top.
- [ ] Word pills (ESSENTIAL/IMPORTANT/OPTIONAL), outlined, top-right.
- [ ] Descriptions bottom-pinned; long description and long reading clamp without overspill.
- [ ] Type: Display 56 / Heading 18 / subtitle 19 / Label 13 / Caption 11 / verdict 24px.
- [ ] CHART_SPEC contains edits A1–A4; STYLE_SPEC § Solutions + § Enforcement reflect B and C.
- [ ] Too-small / no-data states still render; construct resolution unchanged; no in-card CTA.
- [ ] VERSION bumped.

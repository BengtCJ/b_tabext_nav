# Task: 0027 — BP Solutions: cell-frame treatment, pill top-right, drop in-card CTA

**SUPERSEDES** task 0026 (`cell-frame rule: docs + harness only`). That draft was written
on the wrong premise — the Growth solution page was assumed to be native Tableau; it is the
BP Solutions **extension** (`solutions_nav.html`). Task 0026's doc edits (Spec edits 1, 2, 3
to STYLE_SPEC § Spacing / WORKFLOW Tier-4 / STYLE_SPEC § Enforcement) were applied to the
repo and are now live; 0027 adds the matching code change plus updated doc rules.

Goal: Make the BP Solutions cards render as tiled cells inside one hugging frame (2px
      hairline gutter, nested radii) instead of free-floating boxes; move the status pill
      to top-right; remove the in-card CTA (forward nav is a native Navigation object).
Why:  Teardown vs Figma — cards float with 8px gaps + per-card borders, In Practice is a
      separate footer bar, leaving stranded whitespace and breaking the "cells of a table"
      read the design intends. Matches the agreed prototype.

Read first: CLAUDE.md, STYLE_SPEC § Solutions surface + § Spacing + § Enforcement,
            WORKFLOW § Per-surface, TABLEAU_API_REALITY § Recommended interaction patterns
            (Pattern A native nav). Live repo § Solutions surface — the chat's mirrored copy
            predates this edit; code reads the repo, not the chat copy.

## In scope (solutions_nav.html only)

1. **Cell-frame layout** — replace free-floating `.sol-grid`/`.sol-card` with:
   - `.sol-frame` wrapper: `--frame-bg` background (= `--panel-bg`, confirm-against-Figma),
     `border-radius: 10px` (= cell 8 + gutter 2), `padding: var(--gutter)`,
     `display: grid`, `gap: var(--gutter)` (2px). `flex: 1`.
   - `.sol-card` cells: white (`--card-bg`), `border-radius: 8px`, **NO own border**.
   - New CSS tokens added: `--gutter: 2px`, `--frame-bg: var(--panel-bg)`.
   - No other token values changed.

2. **In Practice as cell** — rendered as the trailing cell inside `.sol-frame` (same
   white/radius chrome as solution cards). `.page-footer` wrapper removed.
   `resolveInPractice` and both variants (primary/alternate) kept intact.

3. **Pill top-right** — each card has `.sol-card-header` (name left, pill right, flex
   space-between). Description below. Pill colour/outline unchanged.

4. **CTA removed** — `.page-cta`, `.cta-btn`, `resolveCta`, `_ctaClick` deleted.

5. **Harness** — `runSolutionsHarness()` added; mirrors `checkGroupedCellFrame()` from
   `index.html`. Uses `data-grouped-cell` attribute on cell elements (same convention).
   Asserts live `.sol-frame` has `gap === 2px` and `frameRadius === cellRadius + 2`.
   Synthetic fixture with `gap: 8px` / flat radius must FAIL both checks.
   Runs automatically in preview mode (`typeof tableau === 'undefined'`).

6. **VERSION** bumped to `2026-06-09.1`.

## Out of scope (do not touch)

- Construct resolver, §4 live-view TODO/adapter, settings panel, sample fixture.
- Title/subtitle copy + sizes (Display 40px stays). Pill colours/outline treatment.
- Any chart/scorecard code. Token values beyond adding `--gutter` / `--frame-bg`.

## Spec edits applied in this task

**Spec edit A** → `STYLE_SPEC.md § Solutions surface` — new subsection `### Card-frame and cell layout`
inserted after `### Grid (fixed order, N-robust)`, before `### Pink-accent exemption`. Verbatim:

> Cards are tiled cells in one hugging frame: frame carries the light-grey background +
> frame radius (= cell radius + 2px gutter); cells are white at the cell radius with NO
> own border; a uniform 2px hairline gutter shows cell↔cell and cell↔frame (per § Spacing
> override). Free-floating cards with off-token gaps are non-conformant.
> In Practice is a cell within that frame, not a separate footer panel; the frame fills the
> container (no stranded whitespace).
> Status pill sits top-right of the card.
> Forward navigation is a native Navigation object — no CTA rendered inside the card.

**Spec edit B** → `WORKFLOW.md § Per-surface` Tier-4 line — **already satisfied** by the
superset text applied in task 0026 ("…This is the recurring teardown miss; check it on
native pages as well as extension-rendered ones."). No change needed; the current text is
strictly more complete than the verbatim B text and does not contradict it.

**Spec edit C** → `STYLE_SPEC.md § Enforcement → Visual fidelity` — **replaces** the 0026
Grouped-cell bullet (which was scoped to "detail/chart surfaces") with the explicit-surface
version. Verbatim:

> Every grouped-cell container the extension renders (scorecard, ban context cells,
> scale segments, the solutions frame) uses the 2px gutter and nested radii
> (frame = cell + gutter); the harness asserts none ships with off-token gaps or a flat
> (non-nested) radius.

(The "native Tableau pages are out of harness reach" parenthetical from 0026 is dropped
here — it belongs in the STYLE_SPEC § Spacing native-pages bullet, not the harness rule.)

## Open value (not blocking)

`--frame-bg` is set to `var(--panel-bg)` (#F5F5F5) as the light-grey frame background.
Confirm against Figma; if the frame grey differs from `--panel-bg`, update `--frame-bg`
to the exact hex and record it as locked in STYLE_SPEC § Light-theme tokens.

## Acceptance criteria (all must hold)

- [ ] STYLE_SPEC § Solutions surface contains Spec edit A (new subsection, reconciled).
- [ ] STYLE_SPEC § Enforcement Visual-fidelity list contains Spec edit C verbatim (0026 bullet replaced).
- [ ] WORKFLOW.md Tier-4 line confirmed as superset of Spec edit B; no change applied.
- [ ] In `?construct=growth` preview: two cards + In Practice render as cells in ONE grey
      frame, uniform 2px hairline gutter, cell radius 8 / frame radius 10, no per-card border.
- [ ] In Practice is inside the frame; frame fills the container; no stranded whitespace.
- [ ] Pill renders top-right of each card; description below; pill colour/outline unchanged.
- [ ] No CTA in the DOM; `resolveCta`/`_ctaClick`/`.page-cta` removed; nothing else broken.
- [ ] Too-small and no-data states still render; construct resolution unchanged.
- [ ] `runSolutionsHarness()` PASSES on current output; synthetic fixture checks FAIL as designed.
- [ ] VERSION bumped to `2026-06-09.1`.

## Constraints (hard)

- Tokens only (STYLE_SPEC); add only `--gutter` (2px) and `--frame-bg`. No other token values changed.
- No ES2020 (no `??` / `?.`); single file; size from `offsetWidth`/`offsetHeight`.
- Apply ONLY the verbatim/reconciled Spec edits named here; any other spec/architecture change → STOP.
- `--frame-bg` grey is indicative (confirm-against-Figma); do not invent a locked hex.

## Verify by

1. Open `solutions_nav.html?construct=growth` (sample data). Check against prototype.
2. Run `runSolutionsHarness()` in console; confirm live checks PASS and fixture checks FAIL.
3. Diff docs: only named blocks changed.

## On uncertainty

Stop, record the finding in TABLEAU_API_REALITY.md, kick back to chat. Do not guess.

# Task: 0002 — Indicator table scorecard: visual fidelity (styling)

Goal: Style the WO-1 scorecard to the Figma using STYLE_SPEC tokens only — parametric
spacing/type/colour, rounded-cell grid, client column flagged, BULLETPROOF wordmark, and
the title/question block. No data or structure changes.
Why:  Match the Figma "Opportunity Pathway" look. **Gated: hand off only after WO-1
(structure & data) is verified** — WO-2 restyles the same `renderTable`/CSS, so it runs
after WO-1, never in parallel.

Read first: CLAUDE.md, STYLE_SPEC.md (the parametric tokens — authoritative), CHART_SPEC
(table data shape), and the WO-1 output.

## Foundation check (verify first — TABLEAU_API_REALITY rule 6)
Confirm CSS custom properties + **nested `calc()`** render in the Tableau embedded browser
before building the token system on them. Custom properties are already in use
(`--primary-900` etc.) → observed; nested `calc()` is the unconfirmed bit. If it fails,
stop and record the finding — fall back to precomputed values, don't guess.

## In scope
- **Define the `:root` knobs** from STYLE_SPEC: `--space-unit`, `--type-base`, `--radius`,
  and the colour roots. Use the values in STYLE_SPEC verbatim. Where a value is a `‹confirm›`
  placeholder, use the labelled default **as a token** and do NOT substitute an invented
  hex — it stays tunable.
- **Spacing:** every gap/margin/padding is a `--space-*` step (or named alias). Grid gutter
  `--gap-default`, cell padding `--space-3`, corner radius `--radius`. No raw px.
- **Type:** apply the six `--fs-*` roles per the STYLE_SPEC role map. No `font-size` literal
  outside the scale; no size derived from element geometry.
- **Grid:** wider name column + N equal-fraction brand columns
  (`minmax(...,1.6fr) repeat(var(--brand-count),1fr)`). Client column **first**, flagged by
  class (not a different width). Individually rounded cells with the gutter — not full-width
  bands.
- **Header row:** BULLETPROOF wordmark (inline SVG, `currentColor`, from STYLE_SPEC →
  Brand asset) in the left cell, with an optional "Survey Score" caption (`--fs-label`,
  `--text-muted`) beneath it. Brand columns = title-case display names (`--fs-heading`).
  Client header cell in `--client-strong`; competitors on the header surface. **No per-brand
  aggregate score** (dropped in WO-1).
- **Indicator rows:** left cell = indicator name (`--fs-heading`) + "+snowflake"
  (`--fs-caption`, muted) + circled arrow & "Jump to" (`--fs-caption`). Score cells = score
  in Baskervville italic (`--fs-score`) with a small "/5" suffix (`--fs-caption`, muted).
  Client body cells `--client-surface`; competitors `--cell-surface`.
- **RAG — client column scores only:** `> 4 → --rag-green`, `< 2 → --rag-red`, else
  `--rag-amber`. Competitor scores stay `--text`.
- **Title block:** "OPPORTUNITY PATHWAY" (`--fs-title`) + the question (`--fs-label`, muted)
  above the grid, from WO-1's per-subgroup map.
- **"Too small" state** below the documented minimum container size, instead of shrinking
  text. (Min size value still `‹px ×px›` in STYLE_SPEC — use the placeholder and flag.)

## Out of scope (do not touch)
- Any data/structure change — row set, filtering, level/subcategory logic, drill-down. WO-1
  owns it.
- The aggregate/subgroup header score (dropped).
- Chart rendering and styling.

## Acceptance criteria (all must hold)
- [ ] Every `font-size` is a `--fs-*` token (title/hero override excepted); none geometry-derived.
- [ ] Every gap/margin/padding is a `--space-*` step (or named alias); radius uses `--radius`.
- [ ] Cells are individually rounded with the grid gutter (not full-width bands).
- [ ] Header: wordmark renders (scales by its 8.84:1 aspect ratio, `currentColor`), brand
      names title-case, client header cell flagged; no aggregate score shown.
- [ ] Indicator scores render Baskervville italic with a small "/5"; client-column scores are
      RAG-coloured by the bands; competitor scores are neutral.
- [ ] Title + question render above the grid.
- [ ] **Knob test:** changing `--type-base` alone rescales the whole type ramp
      proportionally; changing `--space-unit` rescales all spacing. Verify by toggling each.
- [ ] "Too small" state shows below the min container instead of shrinking text.
- [ ] `?subgroup=cmoaf` preview matches the Figma treatment at the real container size.

## Constraints (hard)
- Tokens only: no off-scale font size, no non-multiple spacing, no inline hex outside the
  `:root` roots. No `??` / `?.`; single `index.html`; size from `offsetWidth`/`offsetHeight`.
- Do not change data/structure or the specs. If a token value is **genuinely missing** (not
  just a `‹confirm›` default), stop and kick back — don't invent it.

## Verify by
- Lint/harness: no off-token `font-size` or spacing value; type sizes identical per role
  across all charts; radius/colours reference the roots.
- Visual: `?subgroup=cmoaf` at the real container px matches the Figma — rounded cells,
  client column flagged, wordmark, italic scores with "/5", title block.
- Knob test as above.

## Docs to update in this commit
- `STYLE_SPEC.md` — fill the min container size and any `‹confirm›` colours once known;
  tick the four→six role ratification.
- Bump `VERSION`.

## Dependencies / on uncertainty
- Real container pixel size is needed to validate the type ramp + min-size; until then build
  to the tokens and tune `--type-base` against the live dashboard.
- `‹confirm›` colours (RAG green/amber, client/competitor greys, surface) stay at their
  labelled defaults until confirmed against the existing palette / overview pills.
- The cmoaf row count (1 vs several) follows the WO-1 data check; a sparse 1-row table may
  want a sensible min-row treatment — if so, stop and confirm rather than inventing one.
- On any unknown: stop, record in the relevant doc, kick back to chat. Do not guess.

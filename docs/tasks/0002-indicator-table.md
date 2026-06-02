# Task: 0002 — Indicator table (real data, data-driven granularity, token structure)

Goal: The indicator table renders correctly and sharply for the resolved subgroup against
the real score data, with data-driven monthly/quarterly controls and the row→chart
drill-down wired.

Why: Second step in the build order (data → table → charts), sitting on 0001's subgroup
resolution. See CLAUDE.md → Architecture; CHART_SPEC.md → Period granularity & gaps;
STYLE_SPEC.md.

Read first: CLAUDE.md; CHART_SPEC.md (Period granularity & gaps; data-shape classes);
STYLE_SPEC.md (type roles, spacing); `CONFIG` / `DEFAULTS` in index.html; 0001's output
(`resolveSubgroup`, the filtered render path).

## Depends on
- 0001 subgroup resolution (done) — the table already renders for the resolved subgroup.
- Data: builds against the current related/stand-in source. The real-source swap is the
  still-open input contract (BACKLOG) — don't hardcode anything that assumes the final
  source.

## In scope
- One row per indicator in the resolved subgroup, laid out per STYLE_SPEC → **Scorecard
  table**: a labelled row (indicator name + `+source` subtitle), brand columns
  (data-driven count, not hardcoded), Baskervville numerals with `/5` suffix, the client
  column highlighted and RAG-coloured, and the "View chart" affordance inside the label
  column. Display Name / Source / values from the real data, deduped by `indicator_id`.
- Data-driven granularity controls (CHART_SPEC → Period granularity & gaps): for the
  current indicator, offer monthly and/or quarterly only where it has non-null data at
  that grain; a single-period indicator shows no trend toggle. Derive grains from the
  data, not a static list.
- Row → chart via "View chart"; chart → table via the matching "back to table"
  affordance (`switchToChart` / `switchToTable`). Both per the Scorecard affordances spec.
- Apply STYLE_SPEC tokens exactly (Scorecard section is authoritative for the table): no
  geometry-derived font sizing; gaps on the named set incl. the 2px gutter override;
  client highlight pink `#e994a2`. Validate at `1421 × 773`.

## Out of scope (do not touch)
- Chart internals and the edge-trim switch — task 0003.
- The real-source swap — open input contract, separate.
- The **minimum container size** ("too small" floor) — still TBD in STYLE_SPEC; don't
  invent it.

## Styling note (read)
The type scale and spacing are now concrete in STYLE_SPEC (a standard ≈1.2 scale, not the
Figma values, which were inconsistent). Apply them directly — no snapshots needed. Validate
the result at `1421 × 773`; the scale is adjustable if the client reacts (e.g. Heading → 18),
but don't introduce sizes outside the four roles or gaps off the named set. The minimum
"too small" container size is still TBD — leave it, don't guess.

## Acceptance criteria (all must hold)
- [ ] On a subgroup, the table shows one row per that subgroup's indicators (deduped),
  each with Display Name + Source from the real data.
- [ ] The monthly/quarterly options shown for an indicator match exactly the grains it has
  data for; a single-period indicator shows no toggle and renders as a snapshot.
- [ ] No granularity option is selectable that produces an empty view.
- [ ] Clicking a row opens that indicator's default chart (`METRIC_CHARTS`) against real
  data; back returns to the table; `_view` / `_viewMode` behave.
- [ ] No `font-size` outside the four STYLE_SPEC roles; no geometry-derived font sizing
  anywhere; all gaps are 4px-base multiples (or named overrides).
- [ ] The table matches STYLE_SPEC → Scorecard table: labelled rows (name + `+source`),
  data-driven brand column count, Baskervville `/5` numerals, pink client header +
  client-column RAG on the `/5` scale, "View chart" affordance in the label column, and a
  matching back-to-table affordance from the chart. Validated at `1421 × 773`.

## Constraints (hard)
- Tokens only; no ES2020 (`??` / `?.`); single file; size from offsetWidth/offsetHeight.
- Read field names from `CONFIG` / `DEFAULTS` — don't hardcode from memory.
- Verify any unconfirmed Tableau capability before building on it (reality doc rules 3 & 6).
- Don't change the specs or architecture — if one needs changing, stop and ask in chat.

## Verify by
- Open the live URL with `?subgroup=<id>` for two subgroups (include one that mixes
  monthly and annual indicators); confirm the rows, that granularity options match each
  indicator's data, and that no option yields an empty chart.
- Click a row → correct default chart; back → table.
- (Harness not built yet — manual until it lands; it's the next backlog item.)

## On uncertainty
- Stop, record the finding in TABLEAU_API_REALITY.md, kick back to chat. Do not guess.

End with the Docs sync report (CLAUDE.md → End of session).

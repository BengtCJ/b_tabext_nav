# Examples Extension — Design Notes

## Zone-fit model (EX-W7)

The extension fills its Tableau iframe exactly, with no outer/page scrollbar.

- `html, body` — `width:100%; height:100%; overflow:hidden; background:transparent`. The host
  dashboard shows through the transparent root; the dark surface (`var(--card)`) belongs to
  `#ex-root`, not the window.
- `#ex-root` — the outermost rendered container: `width:100%; height:100%; overflow:hidden;
  background:var(--card)`. In Tableau this fills the zone; in preview it is resized to `684px`
  by the `body.demo-mode #ex-root` rule.
- `.stage` — the single inner scroll region: `height:100%; overflow-y:auto`. Inner fixed heights
  (`.drawer-body 356px`, etc.) scroll within `.stage`, never the page.
- **Preview-only chrome** (`.demo-cap`, simulated `684px` frame, `.demo-note`) is injected by
  a JS IIFE at script start when `typeof tableau === 'undefined'`. The IIFE wraps `#ex-root`
  in `.demo-wrap` and adds `demo-mode` to both `<html>` and `<body>`, unlocking page scroll
  for the standalone preview. No demo chrome is present in the DOM in the Tableau path.

## Data layer

### Subgroup scoping + live header

Subgroup scoping is derived from `dashboard.name` — filter only when the tab name (trim+lower)
matches a `subcategory_id` present in the score data; generic/unmatched/no-dashboard shows all.
The detail header is the live label for the scope: `.dh-title` = the resolved
`subcategory_name` (uppercased, one word per line), `.dh-q` = the interim question template with
the client display name interpolated; both hidden when unscoped. Name-derived, no config flag.
The `.dh-title` 56px STYLE_SPEC token vs the PoC 44px is reconciled in EX-W3, not here.

**Implementation** (`index_examples.html` — DATA module):
- `resolveSubgroup(subcatIds)` — takes a plain-object set of normalised subcategory_ids
  built from the score worksheet's metric rows; returns the matching id or `null`.
- Called inside `fetchScoreData` after `normalised` is built, before `buildScoreModel`.
- Precedence stub: in-extension selection (future) → parameter (future) → `dashboard.name` (live).

### Per-brand metric series and default aggregate

**Contract:**
- `metric.series = { BRAND: [{period, value}, …] }` — per-brand period data from the raw
  worksheet. Brand keys uppercased + aliased; `coffee_general` excluded; null values dropped.
  `period` is `YYYY-MM` (Year+Month), `YYYY-QN` (Year+Quarter), or `null` (unresolvable).
- `metric.vals = { BRAND: aggregate }` — default aggregate derived from `series[BRAND]`.
  Feeds the existing snapshot chart forms unchanged.
- Score mirror fallback: when a non-market indicator is missing raw coverage for any brand,
  `metric.vals = scores` (the 0–5 score), `metric.unit = '/5'`, no `series` key. This keeps
  every chart render-safe with no undefined/NaN reaching a form.
- Market indicators (`tam`, `cagr`, `mcon`): unchanged — `metric.market:true`, no `vals`.

**`metricAgg(id)` / `INDICATOR_AGG`:**
`INDICATOR_AGG` is a plain object seam for the future Google-Sheet single source. Interim
value: `{}` (all-average). `metricAgg(id)` returns `INDICATOR_AGG[id] || 'avg'`. Never
scatter agg logic inline — add to the map and use the accessor.

**`svt` zero exclusion (`guardSvtZeros`):**
Exact-zero `svt` values are excluded from the aggregate (not from `series`). A brand whose
`svt` series contains only zeros has no usable aggregate → the indicator keeps the score mirror.

**Missing-months robustness (hard rule):**
- Aggregate over the periods that exist; missing months are skipped, not zero-filled.
- A brand missing some months still aggregates over its remaining periods.
- A brand missing entirely from the raw worksheet → aggregate null → score mirror for that
  indicator. Never a thrown error or broken chart.

## Drawer empty-state guards (EX-W8)

### `laySource` guard
`laySource` is called when `detectLayout` returns `"source-strip"` (all market indicators).
If `ind.sources` is empty or undefined, it returns an explicit no-data string — "Market context
lands in a later pass — the figure still scores." — and never reads `ind.sources[0]`. Only the
seeded `EXAMPLES_SCOPE` indicators will have `ind.sources` populated; all others hit this guard.

### `banEditorial` guard
`banEditorial` reads `ind.metric.headline[0]`. If `headline` is empty (live market BANs before
headline-from-raw lands), it returns a no-data string — "Figure not yet sourced — Market-level
figures are sourced in a later pass." — rather than leaving a blank hero or throwing on `.n`.

### Content-aware default mode
The open-drawer site (`openFocus`) sets `viewMode[ind.id]` only once per indicator (on first open).
Rule: a market indicator with no sources defaults to `"chart"` (lead with the BAN — the point of a
market metric); a market indicator that has sources defaults via `defaultMode("source-strip")` →
`"examples"` as before; non-market indicators continue to default via `defaultMode(layout)` →
`"split"`. General invariant: a drawer never opens onto an empty pane.

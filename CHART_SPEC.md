# CHART_SPEC.md — what "correct" means per chart

The checkable brief. Every chart must satisfy the global rules, its data-shape class,
and its metric's invariants. Self-check against this before handing work back; the
verification harness asserts it.

Human-readable metric names and units live in `INDICATOR_DISPLAY_NAMES` /
`INDICATOR_UNITS` in `index.html` — read them there, don't restate from memory here.

## Global rules (every chart)
- The **client/primary brand** is always drawn in `selectedColor` (`#e994a2`); all
  others in the neutral grey. The primary is positioned per the chart's convention
  (e.g. forced to top/last so it reads first).
- Brand names: uppercase, Tableau Light.
- Honour the **"too small"** and **"no data"** states — never render a broken chart into
  a tiny or empty container.
- Selection of a brand highlights it across the chart (and cross-highlights other
  worksheets via `selectMarksByValueAsync`).

## Data-shape classes (this drives which charts are valid)
| Class | Metrics | Shape | Charts |
|---|---|---|---|
| Headline | `tam`, `cagr`, `mcon` | one number | `ban` only |
| Ratio 0–1 | `eqr`, `ebl`, `sstsr` | per-brand per-month, 0–1 | snapshot **and** trend charts |
| Compositional share | `sov`, `bss` | per-brand, brands ≈ 100% together | share charts (area-100, treemap-bar, stream, …) |
| Signed float | `vom`, `svt` | can be negative | **trend charts only** — negatives break snapshot bars |
| Likert 1–5 snapshot | `bt`, `nps`, `sop`, `dvtr` | mean rating 1–5 | scale-figma / hbar / bans / slope / ban — **no waffle, arc, or progress-ring** (not true ratios) |

Defaults and the full allowed list per metric live in `METRIC_CHARTS` in `index.html`
(first entry = default). Treat that object as the source of truth and keep it consistent
with the classes above.

## Period granularity & gaps (data-driven)
- **Offer only the granularities the data has.** The monthly/quarterly view controls are
  data-driven, not a static list: for the current indicator, a granularity is offered
  only if that indicator has non-null values at that grain. An indicator with no monthly
  data never shows a month option; one with a single period (annual / point-in-time)
  shows no trend toggle at all — it renders as a snapshot. Derive available grains from
  the data rather than relying solely on a hardcoded trend list (reconcile with
  `INDICATOR_TREND` if that static map stays).
- **Edge-trim switch.** An optional setting trims periods with no data at the **start or
  end** of the displayed series so trends don't render with empty/flat edges. A leading
  or trailing period is trimmed only if **no** displayed series has data there. Interior
  gaps (a hole mid-series) are NOT touched by this switch — that's a separate rendering
  decision (see Open items). Suggested default: on.

Why this matters: monthly indicators (`eqr`, `ebl`, `sov`, `bss`, `sstsr`, `vom`, `svt`)
get month + quarter options; annual / point-in-time indicators (`tam`, `cagr`, `mcon`,
`ba`; `nps`, `bt`, `sop`, `dvtr`) get neither — snapshot only.

## Invariants (from the data guards — do not regress these)
- **Likert ≠ percent:** values in 1–5 are Likert means, not percentages. Don't render
  them as ratios/percentages. (`guardLikertNotPercent`)
- **NPS is Likert here, not true NPS:** `nps` values are means around 1–5, **not** a
  true −100…+100 NPS. The **arc** chart needs a recalculated true NPS and must stay
  blocked until that exists. (`guardNpsRecalculated`)
- **svt Q4 zeros = unpopulated pipeline:** when recent-period `svt` values are 0, that's
  a data-pipeline gap — render with an annotation, don't present 0 as a real reading.
  (`guardSvtZeros`)
- **Attribute charts need attribute columns:** `multiscale` requires
  `Trust / Innovation / Value / Style / Heritage` columns. Don't route a single-scalar
  metric to it. (`guardBaAttributes`)
- **Sanity:** the client and expected competitor set (e.g. Starbucks) should be present;
  warn if missing. (`guardStarbucksPresent`)

## Open items to resolve (known data/spec mismatches)
- The data (`Raw Values`) contains `ba` and `cra` rows, but the combined `METRIC_CHARTS`
  may not map them — confirm whether they're intended, and if so add them to a class
  above. Don't silently drop or invent a mapping.
- `ba` in the data is a single scalar per brand, not the five attribute columns
  `multiscale` needs — so `ba → multiscale` cannot render from current data. Resolve the
  data shape or the chart choice before wiring it.
- Confirm `nps` should display as Likert means (current data) or be recalculated to true
  NPS (required for `arc`).
- Edge-trim switch default (on/off) — confirm. And how to render **interior** gaps (a
  missing period mid-series): break the line, span it, or mark it? Not decided — the
  edge-trim switch deliberately doesn't touch these.

## "Looks wrong if…" (quick visual checks)
- A primary brand isn't highlighted, or two brands share the highlight colour.
- A signed-float metric (`vom`, `svt`) rendered as a snapshot bar (negatives clipped).
- A Likert metric drawn as a 0–100% ratio.
- Text size varies between charts for the same role (means geometry-driven font sizing
  crept back in — see `STYLE_SPEC.md`).
- A chart rendered into a container too small for it instead of the "too small" state.
- A period/granularity option is selectable but produces an empty chart (it should have
  been hidden).
- A trend opens with blank leading or trailing periods while the edge-trim switch is on.

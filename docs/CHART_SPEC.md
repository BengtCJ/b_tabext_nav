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
- **Headline-class bans are market-level, not brand.** `tam`, `cagr`, `mcon` are
  single `coffee_general` figures with no brand in frame — the hero number is drawn
  **neutral** (`#ededed`), not the client pink. `#e994a2` marks the client *brand*;
  a market figure has no brand to mark. Reserve the hero pink for a ban that
  represents the client brand specifically (e.g. a per-brand Likert ban).
- **Client identity is matched on the raw `Brand Name Upper` value** — the form the
  `Select Client Brand` parameter holds. Brand-name normalization (title-case, display
  formatting) is **display-only** and must never be applied to the value used for the client
  match. One shared resolver performs this match for both the scorecard table and the charts, so
  the two surfaces cannot drift apart (the recurring "client not highlighted" regressions came
  from normalising the match value or hardcoding the client).
- Brand names: uppercase, Tableau Light.
- Honour the **"too small"** and **"no data"** states — never render a broken chart into
  a tiny or empty container.
- Selection of a brand highlights it across the chart (and cross-highlights other
  worksheets via `selectMarksByValueAsync`).

## Data-shape classes (this drives which charts are valid)
| Class | Metrics | Shape | Charts |
|---|---|---|---|
| Headline | `tam`, `cagr`, `mcon` | one number | `ban` shell (shared left-hero + verdict/reading; optional band rail) — fed per-indicator by a content object (STYLE_SPEC § Headline / ban shell). Band content is data-driven per metric: `cagr` = illustrative growth bands (active highlighted); `tam`/`mcon` = no band scheme yet → render hero-led (a complete layout, not a placeholder). The TAM/SAM/SOM funnel is a TAM-only specialisation BLOCKED until SAM/SOM are sourced. Headline figures use neutral emphasis with a guaranteed pink accent; `#e994a2` is never the figure colour. Three switchable directions — `ban_editorial` (default), `ban_radial`, `ban_ledger` — registered in METRIC_CHARTS per metric; `ban_radial` is offered only where bands exist (band metrics), excluded for band-less metrics until they gain a band scheme. |
| Ratio 0–1 | `eqr`, `ebl`, `sstsr` | per-brand per-month, 0–1 | snapshot **and** trend charts |
| Compositional share | `sov`, `bss` | per-brand, brands ≈ 100% together | share charts (area-100, treemap-bar, stream, …) |
| Signed float | `vom`, `svt` | can be negative | **trend charts only** — negatives break snapshot bars |
| Likert 1–5 snapshot | `bt`, `nps`, `sop`, `dvtr` | mean rating 1–5 | scale-figma / hbar / bans / slope / ban — **no waffle, arc, or progress-ring** (not true ratios) |

Defaults and the full allowed list per metric live in `METRIC_CHARTS` in `index.html`
(first entry = default). Treat that object as the source of truth and keep it consistent
with the classes above.

### Per-class chart menu and uniform default (locked)
One default per class — siblings render the same chart so the dashboard reads
consistently; everything else is a user-selectable alternate (the `METRIC_CHARTS` allowed
list, default first).

| Class | Uniform default | Also offered (alternates) |
|---|---|---|
| Headline | `ban` | — |
| Ratio 0–1 | `vbar` (grouped) | `hbar`, `progress-ring`, `line-straight`, `line-smooth`, `small-multiples` |
| Compositional share | `treemap` | `inset-bubble`, `bubbles`, `area-100`, `treemap-bar`, `stream` |
| Signed float | `line-straight` | `line-smooth`, `small-multiples` |
| Likert 1–5 | `scale-figma` | `hbar`, `vbar`, `bans`, `ban` |

Part-of-whole idioms are **class-gated, not blanket-banned**: `progress-ring`, `waffle` and
`donut` are valid for a **true 0–1 ratio** (each value is a genuine fraction) and for
**compositional share** (parts of ~100%), but stay banned for **Likert** (a 1–5 mean is not
a fraction). Class-validity is not the same as the offered list — only the alternates above
are wired in today.

`ba` and `cra` keep their current (`hbar`) default and are out of scope until their
data-shape class is resolved (see Open items).

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
- **Independent ratios are never stacked:** `eqr`, `ebl`, `sstsr` are independent per-brand
  fractions that do not sum to 100% — a stacked bar draws a total that does not exist.
  Snapshot them as grouped (non-stacked) bars. (enforce in harness)
- **Signed-float trends are straight, with a zero baseline:** smoothing a signed series with
  few points can fabricate a zero-crossing the data never makes, and would glide through
  `svt`'s pipeline-zero tail. Default `vom`/`svt` to `line-straight` with the zero line
  drawn; `line-smooth` is alternate-only. (enforce in harness)

## Table data shape (scorecard matrix)

- **Subgroup:** Opportunity Pathway = `cmoaf`.
- **Columns:** brands, client first (`COMPETITOR_ORDER`: Nespresso, Starbucks, Peet's, Lavazza).
- **Rows:** metric-level only (`level = metric`); no aggregate/subgroup header score row.
- **RAG:** client column only — score > 4 → `--rag-green`; score < 2 → `--rag-red`; else `--rag-amber`. Competitor scores stay neutral text.
- **`cmoaf` metric membership at metric level:** `cagr`, `mcon`, `svt`, `tam` (per the subcategory→indicator mapping; subgroup id is `cmoaf`). `svt` is per-brand. `cagr`/`mcon`/`tam` come from **market-level** raw values (single `coffee_general` rows, no per-brand split) yet render as **per-brand scores** in the matrix — whether that is correct-by-construction (a market-level indicator scoring identically across all brands) or a placeholder is an **open data-contract question** (see Data sanity checklist). *Correction:* this line previously read "`svt` only … do not appear" under a "(confirmed)" tag and was wrong; the four-indicator membership is confirmed against the data.

## Data sanity checklist (the data-contract track)
Run on every surface, separate from the visual teardown (WORKFLOW §6). Visual checks won't catch these — the `cmoaf` membership miss proved it.
- **Membership matches the mapping.** Rows/columns shown for a subgroup must equal that subgroup's indicators in the subcategory→indicator mapping — verified against source data, not memory or a guess.
- **A "(confirmed)" tag is earned, not assumed.** The `cmoaf` line carried "(confirmed)" while wrong; a tag without a check is the bug.
- **Per-brand vs market-level.** A market-level indicator (single `coffee_general` value: `cagr`, `mcon`, `tam`) shown as a per-brand score is suspect until confirmed correct-by-construction or fixed. (Open: the `cmoaf` per-brand 5.0s.)
- **Constant-down-a-column is a stub smell.** Identical values for every brand on a metric usually mean placeholder scoring — flag, don't present as real.
- **Field presence.** A field the design reads (`subcategory_name`, score field) must exist in the source for the current subgroup, or the surface blanks/falls back (the new-sheet title issue).

## BAN context cells (the headline / single-number view)
The BAN renderer may show three greyscale context cells grounding the number high/low. This
is contextual chrome on the existing `ban` — **not a new chart type**; `METRIC_CHARTS` and the
data-shape classes are unchanged. Styling lives in `STYLE_SPEC → BAN detail screen`.
Per-indicator membership:

| Indicator | Cell type | Cells / source |
|---|---|---|
| `mcon` | threshold standard | DOJ/FTC HHI bands (2023): <1500 / 1500–1800 / >1800. `[docs]` current US merger guidelines, Dec 2023 |
| `nps` `bt` `sop` `dvtr` | scale bands (greyscale) | locked 1–5 thresholds <2 / 2–4 / >4; grounding = `coffee_general` category mean |
| `cagr` | illustrative ranges | example sectors (low/declining · mature · high-growth); generic illustrative copy, NOT sourced |
| `tam` | none (magnitude-only) | no cells until SAM/SOM or comparator market sizes are sourced |

Invariant carried: `nps` here is a **Likert mean, not true NPS** (`guardNpsRecalculated`) — the
definition string must say so; cells are greyscale scale-bands, never RAG.

## Open items to resolve (known data/spec mismatches)
- `tam` unit/scale unconfirmed (data `14.4`; the Figma `$12.4B` was placeholder) and `mcon`
  scale unconfirmed (`2002`, possibly an HHI) — confirm before either earns a band scheme.
  SAM/SOM absent from source, so the TAM funnel stays blocked.
- `ba` and `cra` subgroup membership is now known from the mapping (`ba` → Narrative Power `ps`; `cra` → Strategic Strength `sbr`) — **verify against source** before relying on it. Their **data-shape class is still open** (`ba` is a single scalar per brand, so it cannot feed `multiscale`). Don't silently drop or invent a mapping.
- `ba` in the data is a single scalar per brand, not the five attribute columns
  `multiscale` needs — so `ba → multiscale` cannot render from current data. Resolve the
  data shape or the chart choice before wiring it.
- Confirm `nps` should display as Likert means (current data) or be recalculated to true
  NPS (required for `arc`).
- Edge-trim switch default (on/off) — confirm. And how to render **interior** gaps (a
  missing period mid-series): break the line, span it, or mark it? Not decided — the
  edge-trim switch deliberately doesn't touch these.
- BAN context data: `cagr` cells are illustrative generic copy (accepted interim); `tam` has
  no context cells until reference market sizes are sourced — do not invent either.
- Verify `mcon`/`cagr`/`tam` display units against `INDICATOR_UNITS` before rendering: `mcon`
  is an integer HHI (2002, not a 0.2002 decimal), `cagr` is `%`, `tam` is `$B`. The HHI band
  thresholds assume the integer scale.

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
- A 0–1 ratio (`eqr`/`ebl`/`sstsr`) drawn as a **stacked** bar (implies a brand total that
  isn't real) instead of grouped bars.
- A signed-float trend (`vom`/`svt`) drawn with a **smoothed** line that crosses or
  approaches zero where the straight segments don't.

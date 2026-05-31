# STYLE_SPEC.md — type & spacing tokens

The client cares most about typography and spacing, so these are locked as tokens and
enforced. Colours and motion were not friction points — codify the existing values and
move on.

**Principle: fixed type scale, fluid layout.** Type sizes are locked; only layout flexes
by rule. This is what keeps typography tight and kills the geometry-driven font sizing
that read as inconsistent. Validate at the real Tableau container pixel size.

- **Validation / design container size:** `1421 × 773` (current; may change — design fluid
  so a change is absorbed by layout, not type). This is the canvas to check the scale
  against, NOT the minimum.

> **Approach:** type uses a standard modular scale (≈1.2 minor third, base 13, rounded to
> whole px), NOT the Figma values — the Figma spacing/sizing is inconsistent (14/19/20,
> differing H vs V), so transcribing it would bake in drift. The snapshots are a
> cross-check on the adopted scale, not its source. Validate the scale at `1421 × 773`.

## Type roles (exactly four — fixed sizes)
Scale: ≈1.2 (minor third), base 13, rounded. Adjust `Heading` to 18 if more contrast is
wanted; validate at the container size before final sign-off.

| Role | Face | Use | Size |
|---|---|---|---|
| **Hero** | Baskervville italic | the BAN figure, arc centre — the focal number | per-chart override |
| **Heading** | Tableau Light | table indicator names, section labels | 16px |
| **Label** | Tableau Light (brands UPPERCASE) / Regular (values) | brand names, value labels | 13px |
| **Caption** | Tableau Light | axis ticks, legend, small notes | 11px |

- **Hero is the only sanctioned size override.** It may be sized per chart where it is
  the focal element, and nowhere else.
- No other element sets its own font size. In particular, **no font size derived from
  geometry** (`Math.min(11, cellW * 0.22)` and similar must go).
- Below the documented **minimum container size**, a chart shows its "too small" state
  rather than shrinking text. Minimum size: `‹px ×px›` — separate from the validation
  size above; derive it from where a chart actually breaks, not from the current canvas.

## Faces (existing constants — keep)
- Baskervville italic — hero numbers.
- Tableau Regular — value labels / body.
- Tableau Light — brand names (always uppercase) and axis/caption text.

## Spacing
- **One base unit:** 4px. Every gap/margin is a multiple of it.
- Named gaps: `tight` = 4px, `default` = 8px, `section` = 16px, `loose` = 24px. The Figma's
  14/19/20 snap into these (14→16, 19/20→16 or 24 by role); H-vs-V differences are
  regularised away unless one is genuinely intentional.
- A short, **named** list of overrides for the few places that genuinely need them — each
  documented here so it reads as intentional, not drift:
  - **Scorecard cell gutter = 2px** — the gap between scorecard cells, deliberately off the
    4px grid so the dark frame shows through as a hairline; 4px reads clunky here.

## Colour (codify existing — not a friction point)
- Primary / client highlight: `#e994a2` (pink). Used wherever the client brand is marked —
  charts and the scorecard client header cell alike (one constant, so it stays consistent).
  **Future:** this may be driven by a parameter for per-client theming — keep it read from
  one constant so that becomes an additive change, not a rewrite. Deliberate treatment.
- Neutral (other brands): grey per existing palette.
- Status pills on the overview: STRONG = green, NEUTRAL = amber (match existing).
- Scorecard-table cell fills and the client-column score RAG live in the Scorecard section
  below.

## Detail page header (above the card, in the transparent area)

Fixed tokens. Renders outside the `sc-frame` card, left-aligned to the card edge.
The transparent body/root shows through beneath it.

**Title** — Tableau Regular, 116px, `#ededed`, `line-height:1`, `text-transform:uppercase`
- Text = `subcategory_name` for the current subgroup (from worksheet; falls back to `SUBGROUP_META.title`).

**Question** — Tableau Light, 19px, `#888`, `line-height:1.3`
- A single hardcoded sentence (interim) with the client brand interpolated from `CONFIG.clientBrand`.
  Template lives in `SUBGROUP_META[subgroup].questionTemplate` with `{{client}}` placeholder;
  resolved in `switchToTable()` so it re-interpolates on ParameterChanged.
- Shows on every subgroup until sourced per-subgroup from data. Accepted as interim.

**Spacing** — title and question separated by `8px` (`default` gap); parent flex gap to card is `8px`.

## Scorecard table (locked from prototype review — BULLETPROOF Survey Score frame)
Fixed tokens. Render from these; do not re-derive. Where this conflicts with the generic
roles above, this section wins **for the scorecard table**.

**Numerals (scores & values)** — `'Baskervville','Baskerville',Georgia,serif`, italic 400
- Header brand score: 31px · Body value: 21px (uniform across client and comparator cells)
- Suffix always `/5` (these tables): `font-size:0.5em`, italic, muted `#7c7c7c`, inline
  immediately after the value, baseline-aligned. Values to 1 decimal (`5.0/5`, `3.3/5`).

**Labels / text** — Tableau Light / Regular (NOT a different sans)
- Indicator name: 14px, `#ededed`, normal case (not uppercase)
- Source subtitle: 11px, `#777`, prefixed `+` (e.g. `+snowflake`)
- Brand name (header): 13px, `#bfbfbf` (white on the pink client cell)
- Drill / back affordance label: 11px, `#888`

**Affordances** (the in-extension view-swap — no Tableau navigation)
- To chart: a **chart-view icon** (bar/line-chart glyph) 17px + label **"View chart"**,
  inside the label column, right-aligned. (Replaces the old `circle-arrow-down` / "Jump to".)
- Back from chart: a **back icon** (left-arrow / "back to table" glyph) 17px + matching
  label, same 11px `#888` treatment, mirroring "View chart". Returns to the table view.

**Layout**
- Columns: `minmax(232px, 1.66fr)` label, then `repeat(N, 1fr)` brand columns where **N =
  the comparator count from the data** — do NOT hardcode 5; it can move by one or two.
- Gap: 2px (named override above; frame shows through). Cell radius 8px.
- Drill affordance lives INSIDE the label column (right-aligned), not its own column.
- Frame: `#0d0d0d`, 1px border `#262626`, radius 16px, 8px padding. The frame is a
  **contained card** sized to the scorecard, NOT a full-window fill. The extension's
  root/body behind it is **transparent** so the host dashboard background shows through —
  the `#0d0d0d` belongs to the card element only, never the window.

**Cell fills**
| Cell | Fill | Notes |
|---|---|---|
| Header band (comparators) | transparent | brand name + score on dark frame |
| Header — client cell | `#e994a2` (pink) | client brand only; see Colour + future param |
| Label cells (body) | `#181818` | |
| Client value cells (body) | `#3a3a3a` (light grey) | client = 2nd column, full height |
| Comparator value cells (body) | `#242424` | calm text `#d2d2d2` |

No brand colours anywhere except the pink client header cell.

**Score colour rule — CLIENT COLUMN body values only**, on the `/5` scale:
`value < 2 → red #e0584f` · `2 ≤ value ≤ 4 → orange #e0992e` · `value > 4 → green #57bf6a`.
Comparator values are never colour-coded (`#d2d2d2`); the header overall score is not
colour-coded (white text).

**Title block**
- `BULLETPROOF` wordmark + subtitle. Subtitle is DYNAMIC per score type (`Survey Score`,
  etc.) — live text, not baked into the wordmark vector. A supplied SVG wordmark renders
  `BULLETPROOF` only; the score-type word is the live subtitle beneath.

**Commentary box (optional — extension-rendered, inside the card)**
- Placement: inside the card, BELOW the table, full content width. Toggled from the
  Settings panel (config default lives in CONFIG/DEFAULTS, not here). When off it does NOT
  render — the card shrinks to fit, no empty gap.
- Panel: 1px border `#262626`, radius 8px, fill `#181818` (reuses the cell tokens);
  padding `section` (16px). Gap from the table above: `section` (16px).
- Verdict (lead sentence): Tableau Regular, 16px, `#ededed`.
- Reading (paragraph): Tableau Regular, 13px, `#b0b0b0`, line-height ~1.5.
- Verdict → reading gap: `default` (8px).
- Content is PLACEHOLDER for now — two slots (verdict, reading) resolved through one
  function so a real source (sheet column / LLM field) is an additive swap, not a rewrite.
  Generic and brand-interpolated; the same placeholder shows on every subgroup until sourced.
- Locked vs review: placement + panel tokens (reused cell border/radius/fill) are locked;
  text sizes (16/13), colours, padding/gaps and line-height are build-and-review at 1421×773.

## Detail page header (above the card — extension-rendered)
The page-level header that sits in the **transparent area above the card**, left-aligned
to the card edge. **Distinct from** the Scorecard "Title block" (the `BULLETPROOF` SVG
wordmark + live Survey Score subtitle), which stays **inside** the card and is unchanged
by this section.

- **Title** = the subgroup display name = `subcategory_name` (read from the source sheet,
  same rows as `subcategory_id`), uppercased. **Tableau Regular**, `text-transform:
  uppercase`, **116px**, `#ededed`.
  - 116 is the nearest modular-scale step to the Figma cross-check of ~110 — on-scale,
    not transcribed (97 / 116 are the steps either side; ~110 → 116).
- **Question** = subtitle sentence; **hardcoded for now** with the client brand
  interpolated (re-interpolates on `ParameterChanged`). **Tableau Light**, normal case,
  19px, `#888`.
  - Interim: a single hardcoded sentence shows on **every** subgroup until it is sourced
    per-subgroup. Accepted as interim.
- **Spacing:** title → question = `default` (8px); header block → card = `loose` (24px).
- **Locked vs review:** **116px is locked.** Question 19px and the two gaps are
  build-and-review values — confirm on the first render at `1421 × 773`, don't re-derive
  from the Figma.

## Enforcement (what the harness / lint checks)
- No `font-size` value that isn't one of the four roles or a Scorecard-section locked size
  (hero override excepted).
- No font size computed from element geometry.
- No gap/margin off the 4px base unit, except the named overrides (incl. the 2px gutter).
- Type sizes identical for the same role across all charts.

## TODO before this is final
- Validate the type scale + spacing at `1421 × 773` (and adjust if the client reacts).
- Confirm the Detail page header question size (19px) and gaps (8 / 24) on the first
  render — only the 116px title is hard-locked.
- Set the **minimum container size** (the "too small" floor) — derive from where a chart
  first breaks, not from the current canvas.
- Confirm the overview card copy against the design (e.g. "STRATEGIC STRENTH" looks like
  a dropped G).
- Confirm the Commentary box text sizes (16 / 13), colours, padding/gaps and line-height
  on the first render.

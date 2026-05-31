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
| **Hero** | Baskerville italic (stack in Faces) | the BAN figure, arc centre — the focal number | per-chart override |
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
- Baskerville italic — hero numbers and scorecard numerals. Stack `'Baskerville','Libre Baskerville',Georgia,serif`: macOS **Baskerville** (Monotype) renders where installed and matches the Figma; **Libre Baskerville** (loaded webfont, OFL) is the cross-viewer fallback. Both default to lining figures. The old double-v **Baskervville** (ANRT webfont) is removed — it defaulted to old-style figures and, being first in the cascade, shadowed Baskerville (the uneven-digit bug). Cross-viewer note: Mac viewers see Monotype Baskerville, others see Libre Baskerville; identical rendering for all viewers is a licensing decision, not assumed here.
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

**Numerals (scores & values)** — `'Baskerville','Libre Baskerville',Georgia,serif`, italic 400
- Header brand score: 31px · Body value: **comparator 21px, client column ~28px** (the client
  is the emphasised column; size build-and-review)
- Suffix `/5`: **client column only** (comparators show the bare number, per the Figma — header
  and body alike); `font-size:0.5em`, italic, muted `#7c7c7c`, inline after the value,
  baseline-aligned. Values to 1 decimal (client `5.0/5`; comparator `5.0`).
  The `0.5em` applies to the literal `/5` glyphs **only** — never to a value digit. The integer and decimal digits of a value (both `4`s in `4.4`) render at the **same size and on the same baseline**; wrap only `/5` in the suffix span, not the decimal portion. No value digit is shrunk or raised.
- **Cell alignment:** value numerals sit **bottom-left**, clearly **inset** by the cell padding — left inset is **generous (~22px) at typical row counts (≤5)** so the numeral reads well off the corner, tightening only near the row-count max. **The inset applies to comparator cells as well as the client cell** (comparators were reading too tight to the edge). Brand-name header labels left-aligned to match.

**Labels / text** — Tableau Light / Regular (NOT a different sans)
- Indicator name: 14px, `#ededed`, normal case; **wraps to 2 lines, never truncates/ellipsis**
  (label column widened to suit — see Layout)
- Source subtitle: 11px, `#777`, prefixed `+` (e.g. `+snowflake`)
- Brand name (header): 13px, `#bfbfbf`, **title-case** (normalize source casing — e.g.
  `Peet's Coffee`, not `PEET'S COFFEE`); on the **pink client cell use black text** for
  contrast (white fails WCAG on the light pink; if the client highlight ever becomes a
  per-client parameter, compute the text colour for contrast rather than hardcoding black).
- Drill / back affordance label: 11px, `#888`

**Affordances** (the in-extension view-swap — no Tableau navigation)
- To chart: a **chart-view icon** (bar/line-chart glyph) 17px + label **"View chart"**,
  inside the label column, right-aligned. (Replaces the old `circle-arrow-down` / "Jump to".)
- Back from chart: a **back icon** (left-arrow / "back to table" glyph) 17px + matching
  label, same 11px `#888` treatment, mirroring "View chart". Returns to the table view.

**Layout**
- Columns: **`minmax(320px, 2.2fr)` label** (wider so long names show — they wrap, never
  truncate), then a **slightly wider client column (~1.3fr)** and `repeat(N−1, 1fr)` comparator
  columns, where **N = the comparator count from the data** — do NOT hardcode 5. Widths build-and-review.
- Gap: 2px (named override above; frame shows through). Cell radius 8px. Cell padding flexes
  ~10–20px with row height (see Detail page header → Vertical layout → Row height & padding).
- Drill affordance lives INSIDE the label column (right-aligned), not its own column.
- Frame: `#0d0d0d`, 1px border `#262626`, radius 16px, **2px padding** — the 2px gutter is uniform throughout (cell↔cell, cell↔frame,
  table↔commentary), so the dark frame reads as a consistent hairline. The frame is a
  **contained card** sized to the scorecard, NOT a full-window fill. The extension's
  root/body behind it is **transparent** so the host dashboard background shows through —
  the `#0d0d0d` belongs to the card element only, never the window.

**Cell fills**
| Cell | Fill | Notes |
|---|---|---|
| Header band (comparators) | transparent | brand name + score on dark frame |
| Header — client cell | `#e994a2` (pink) | client brand only; see Colour + future param |
| Label cells (body) | `#242424` (matches comparator) | one continuous field with the comparator value cells |
| Client value cells (body) | `#484848` (light grey) | client = 2nd column, full height |
| Comparator value cells (body) | `#242424` | calm text `#d2d2d2` |

No brand colours anywhere except the pink client header cell.

**Score colour rule — CLIENT COLUMN body values only**, on the `/5` scale:
`value < 2 → red #e0584f` · `2 ≤ value ≤ 4 → orange #e0992e` · `value > 4 → green #57bf6a`.
Comparator values are never colour-coded (`#d2d2d2`); the header overall score is not
colour-coded (white text).

**Header row (the table's first row — full height)**
- The header is the table's **first row**, full height — not a strip above the table.
- **Label cell** (transparent): the `BULLETPROOF` SVG wordmark + the subtitle **`Score`**
  beneath it, **normal case (not uppercased)** (live text under the wordmark vector; was "Survey Score").
- **Brand cells:** brand name (13px) above an **overall score** (31px, not RAG-coloured); `/5`
  on the **client column only** (comparators bare). Overall = the **mean of that brand's visible
  indicator scores** (interim). Text white on comparator cells; **black on the pink client cell** for contrast.
- Fills per Cell fills below: client cell pink, comparator header cells transparent (names +
  scores sit on the dark frame).

**Commentary box (optional — extension-rendered, inside the card)**
- Placement: inside the card, BELOW the table, full content width. Toggled from the
  Settings panel (config default lives in CONFIG/DEFAULTS, not here). When off it does NOT
  render — the card shrinks to fit, no empty gap.
- Panel: radius 8px, fill `#181818`, padding `section` (16px); **no own border**. Sits
  **2px** below the table (the same 2px gutter as the cells).
- Verdict (lead sentence): Tableau Regular, 16px, `#b0b0b0` (matches reading — unified, not white).
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
  uppercase`, **56px**, `#ededed`. Renders **one word per line** — `subcategory_name` is
  always two words, so the title is always two lines (split on whitespace; do not rely on
  width-wrapping).
  - 56 ≈ half the original 116 and is the nearest modular-scale step in range (47 / 56 / 67).
- **Question** = subtitle sentence; **hardcoded for now** with the client brand
  interpolated (re-interpolates on `ParameterChanged`). **Tableau Light**, normal case,
  19px, `#ededed` (white).
  - Interim: a single hardcoded sentence shows on **every** subgroup until it is sourced
    per-subgroup. Accepted as interim.
- **Spacing:** title → question = `default` (8px). Header → card spacing is governed by
  **Vertical layout** below (flexible, bounded), not a fixed gap.
- **Locked vs review:** **56px title is locked.** Question 19px, the title→question gap,
  and the Vertical-layout cap are build-and-review values — confirm on the first render at
  `1421 × 773`, don't re-derive from the Figma.

### Vertical layout (header ↔ card)
- Header block pinned to the top; the card is **bottom-weighted** in the space beneath it.
- **Bottom inset:** the card is never flush to the container bottom — always ≥ `loose`
  (24px) clear of it.
- **Row height & padding (flexible):** the header row + indicator rows fill the card's table
  zone. The **header row** is the one consistently tall row (it carries the wordmark and the
  31px overall scores). **Indicator rows** clamp between a generous **max ~88px** (few rows)
  and a compact **min ~52px** (many); cell padding flexes ~10–20px in tandem. Name + `+source`
  + numeral are kept across the range. Type stays fixed — only the row box and padding flex.
  Min/max height + padding are build-and-review at `1421 × 773`.
- **Crowding priority:** if rows at the compact min plus the commentary box would overflow,
  **commentary yields first** (hidden); then the "too small" state. Rows never compress below
  the min.
- **Top-gap minimum:** ≥ `section` (16px) between header and card; only the densest case
  (≈7 indicator rows + commentary on) may surrender this toward 0.
- **Anti-drop cap:** the empty space *above* the card is capped — when content is sparse
  enough that the natural gap would exceed the cap, the surplus is placed *below* the card
  so a short card (e.g. 2 rows, commentary off) lifts clear of the bottom instead of
  stranding against it. Implement with a capped top spacer + a min bottom inset; the cap is
  a build-and-review value tuned at `1421 × 773`.
- **Row-count robustness:** must hold for **2–7 indicator rows** with rows + padding flexing
  per above. Validate at `1421 × 773`: 2 rows + commentary (rows tall, ~20px padding,
  bottom-weighted) and 7 rows (rows at compact min, ~10px padding, commentary yielded). ~6 rows
  is the practical limit with commentary on; beyond that commentary hides.

## Enforcement (what the harness / lint checks)
- No `font-size` value that isn't one of the four roles or a Scorecard-section locked size
  (hero override excepted).
- No font size computed from element geometry.
- No gap/margin off the 4px base unit, except the named overrides (incl. the 2px gutter).
- Type sizes identical for the same role across all charts.
- **Visual fidelity (measurable — the harness asserts these so the reviewer doesn't have to):**
  - Gutter is uniform: cell↔cell, cell↔frame, and table↔commentary are all the same 2px.
  - Corner radii nest: frame radius = cell radius + gutter (e.g. 8 + 2 = 10); cells and the
    commentary panel share one radius.
  - No clipped or ellipsised text: indicator names and labels render in full (wrap, don't truncate).
  - Text on any coloured fill meets contrast (WCAG AA): e.g. the pink client cell uses dark
    text, never white.
  - Value suffix appears only where intended (client column only — never on comparators).
  - Value digits are uniform: every digit of a value (including the post-decimal digit) renders at the same size and on the same baseline; only the `/5` suffix may be `0.5em`.
  - Numerals are inset from the cell edge (padding > 0 — not hugging the corner).

## TODO before this is final
- Validate the type scale + spacing at `1421 × 773` (and adjust if the client reacts).
- Confirm the Detail page header question size (19px) and gaps (8 / 24) on the first
  render — only the 56px title is hard-locked.
- Tune the Detail page Vertical-layout anti-drop cap at `1421 × 773` against the
  2-row / commentary-off case; validate the 2–7 row extremes.
- Header overall score is the mean of the brand's visible indicators (interim) — swap to a
  dedicated field if one appears.
- Set the **minimum container size** (the "too small" floor) — derive from where a chart
  first breaks, not from the current canvas.
- Confirm the overview card copy against the design (e.g. "STRATEGIC STRENTH" looks like
  a dropped G).
- Confirm the Commentary box text sizes (16 / 13), colours, padding/gaps and line-height
  on the first render.

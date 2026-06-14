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
| **Heading** | Tableau Light | table indicator names, section labels | 18px (was 16; sanctioned bump for solutions surface contrast — validate at 1421×773) |
| **Label** | Tableau Light (brands UPPERCASE) / Regular (values) | brand names, value labels | 13px |
| **Caption** | Tableau Light | axis ticks, legend, small notes | 11px |
| **Title** | Baskerville italic (FONT_TITLE stack) | the chart-view indicator title (`#chart-name`) | ~39px (scale step 13×1.2⁶; confirm at 1421×773) |
| **Display** | Baskerville italic (stack in Faces) | construct page title — solutions surface only | 56px (re-decision: was 40; bumped for scale — record as intentional) |
| **Value numeral** | Baskerville italic (stack in Faces) | per-brand numeric value on chart marks (bars, bubbles, tiles, rings, line-end); excludes BAN family | 24px · client fill `#e994a2`, others `#ededed` |

- **Hero is the only sanctioned size override. It uses a fixed size per direction (not
  fit-to-box).** Design review (spec_022) found that free fit-to-box caused the same value
  to render at different sizes across cards, making the hero role unstable. Fixed sizes:
  **Editorial 160px · Ledger 120px** (Baskerville italic). A character-count clamp floors at
  **100px** for unusually long values — the hero never goes below this or above the base.
  Radial uses a fixed SVG-scale approach inside the rings (unchanged). Every OTHER element
  keeps a fixed role size — the ban on geometry-derived font size binds all non-hero type.
  Chart graphics (radial rings) are not type and scale freely.
- **The chart-view title uses the Title role — Baskerville italic, pinned to the modular
  scale (~39px at 1421×773).** Serif now spans hero + title (the editorial 'voice'); sans (Tableau
  Light/Regular) stays for labels, axes, captions, and in-table/section Headings. The ban on
  geometry-driven sizing still binds — the Title is a fixed scale step, not fit-to-box.
- No other element sets its own font size. In particular, **no font size derived from
  geometry** (`Math.min(11, cellW * 0.22)` and similar must go).
- **Display is the solutions-surface exception to the Baskerville-as-numerals rule.** The
  construct page title on the solutions surface uses Baskerville italic, Title-case, 56px — the
  only sanctioned use of Baskerville for non-numeral text. Scope: solutions surface only. Do not
  apply Display to chart titles, indicator names, or any dark-theme surface. 56px is the v8
  re-decision (was 40; bumped for scale against the Figma — record as intentional).
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
  - **Cell gutter = 2px** — the gap between adjacent cell-like elements, deliberately off the
    4px grid so the dark frame shows through as a hairline; 4px reads clunky here. Applies to
    **scorecard cells and any grouped cells on detail/chart pages alike** (e.g. ban reference
    bands, scale segments, context chips). Cell↔cell wherever cells are grouped; where a cell
    group sits inside a hugging frame, cell↔frame padding is also 2px and radii nest (frame
    radius = cell radius + 2). Free cells inside a larger padded card use the 2px gutter
    between themselves but inherit that card's padding, not a 2px inset.
  - **Native pages too.** The 2px-gutter / frame-shows-through treatment applies to
    **native Tableau dashboard pages** (e.g. the solution pages), not only the extension.
    Realise it with an outer Container holding the light-grey frame background + Corner
    Radius (frame radius = cell radius + 2), white child cells at the cell radius, and
    per-object padding tuned to a uniform 2px cell↔cell and cell↔frame. Forward
    navigation on these pages is a native **Navigation object** (Pattern A) — never a CTA
    rendered inside the card.
  - **Nested tile (default).** An element nested *inside* a cell (a tile within a card —
    e.g. the In Practice image inside its card) is inset from the cell edge by the 2px gutter,
    its radius nests (tile radius = cell radius − gutter), and its size is expressed in
    cell/row units (e.g. "one solution-cell row"), not a % or guessed px. Saying "tile"
    inherits all three; do not re-derive the inset/radius/size per surface.

## Colour (codify existing — not a friction point)
- Primary / client highlight: `#e994a2` (pink). Used wherever the client brand is marked —
  charts and the scorecard client header cell alike (one constant, so it stays consistent).
  **Future:** this may be driven by a parameter for per-client theming — keep it read from
  one constant so that becomes an additive change, not a rewrite. Deliberate treatment.
- **Guaranteed accent:** every chart/ban render carries at least one `#e994a2` accent to
  anchor the eye, independent of available content. Content-driven pink (active-band marker,
  ring dot, "you are here" dot) provides it where bands exist; where a metric has no bands, a
  short pink rule tied to the hero figure provides it. A render must never appear with no pink
  at all. The hero figure stays neutral-bright (`#ededed`) — pink anchors as an accent, it is
  not the figure colour.
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
  baseline-aligned. Value precision is set per indicator by `INDICATOR_DECIMALS` (see BAN detail screen) — the single source; Likert values resolve to 1 decimal there (client `5.0/5`; comparator `5.0`).
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

**Affordances** (the in-extension view-swap — no Tableau navigation). Two affordances tuned to
their context, tied together by **one shared chip treatment** (not a mirror icon): the OPEN
DATA chip repeats once per row, so it stays quiet; the close control appears once on the detail
view, so it is a single clear ✕. Both use the same rest fill + hover pill, so they read as one
family. The view swap is JS (`switchToChart` / `switchToTable`) — nothing navigates.
- **OPEN DATA chip (table) — text only, no icon.** Label `OPEN DATA`, Tableau Light, 11px,
  uppercase, ~0.06em tracking. No icon: an expand glyph repeated down every row reads as noise;
  the column stays calm. Right-aligned in the label cell (bottom-right).
- **Close control (expanded view) — ✕ icon only, no label.** Material Symbols `close` (the
  cross), ~18px, inline SVG (no icon-font dependency); an X is unambiguous, so a simple
  two-stroke cross is acceptable if the named path isn't to hand. Top-right of the expanded
  view. The universal dismiss; a label would be redundant on a single focused view.
- **Shared chip treatment (both).** Rest: fill `#202020`, text `#888`, radius 8px, padding
  4/8px, 0.5px transparent border — the rest fill is what makes each read as a control before
  hover. Hover/focus: a light pill — fill `#ededed`, text `#141414` (WCAG AA); the pill is the
  only hover chrome. The ✕ uses a square ~26px target; the OPEN DATA chip hugs its text.

**Expanded (single-indicator) view.** When a row's chip opens, the view swaps in place to
that one indicator's chart and the **scorecard header row is not rendered** (no wordmark, no
per-brand overall scores) — it is stale chrome for a single-metric view, and the layout is a
fixed zone, not a scroll surface, so there is no scroll-to alternative. The expanded view
shows only: the **indicator name** (14px `#ededed`) + its `+source` subtitle (11px `#777`)
top-left, the **close ✕** top-right, and the chart filling the remaining height.
Returns to the full table on close.

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

## Headline / ban shell — Editorial · Radial · Ledger (locked layout + type)

The Headline class (`cagr`, `tam`, `mcon`) renders as a ban shell with three switchable
directions (EDITORIAL / RADIAL / LEDGER — wiring per CHART_SPEC `METRIC_CHARTS`, not re-specced
here). All three inherit the frame chrome, 2px gutter, radius nesting, fills and states from the
Scorecard frame rules above; each is a small layout delta over that shared base.

**Shared (all directions)**
- Hero number — Baskerville italic; fixed size per direction (see Type roles for the decision).
  **Editorial 160px · Ledger 120px** (HTML div, `white-space:nowrap`); char-count clamp floors at
  100px. Radial: a fixed override sized to sit inside the ring (SVG-scale approach unchanged).
  Suffix (`%` for `cagr`) ~0.43em, muted grey, baseline-aligned; suffix/unit text per CHART_SPEC
  + Task 0023, not here.
- Pink accent is guaranteed in every direction: Editorial = a short pink rule beneath the hero;
  Ledger = a short pink rule above the verdict cell only; Radial = the pink emphasis ring + dot.
  1px, `selectedColor`, ~120px where a rule.
- Active band = `--active` (#3a3a3a) fill + bright text + a 7px `selectedColor` dot at the band
  header's right edge. Inactive bands = `--cell` (#242424) + muted text, no dot. Never a pink
  fill, never white-on-pink. (Radial legend: active row = pink dot + bright text; others muted.)
- Verdict (lead serif sentence) = 24px Baskerville italic — the same size in all three directions.
  Reading paragraph = 13px (Label). Disclaimer (`Ranges are illustrative…`) = 11px (Caption)
  italic, BAND-METRIC ONLY (it references ranges; absent on band-less metrics).
- Benchmark numerals (band range figures, e.g. `< 3%`) = 40px Baskerville italic, identical
  across all three directions.
- All other text maps to the four Type roles: indicator title = Heading 16; band label = Label 13
  (uppercase); subline / `e.g.` / explainer = Caption 11. No off-role sizes; no geometry-derived
  size except the hero.

**Editorial — 3×3 (band metric)** — grid: 3 columns × (title row + 3 content rows):
    title   title    title
    hero    hero     bandL
    hero    hero     bandM
    verdict reading  bandH
- Hero = a 2×2 block (cols 1–2, content rows 1–2), transparent, 160px fixed number + pink rule beneath.
- Verdict (col 1, row 3) and Reading (col 2, row 3): transparent, top-aligned beneath the hero.
- Bands fill the full-height right column (col 3).

**Editorial — band-less (`tam`,`mcon`)** — a **two-column grid that tiles the card full
height**, never free placement (no number stranded in a corner with a centre void — the
failure this rule fixes). Tracks `minmax(0, 5fr)` | `minmax(0, 7fr)`; the `minmax(0, …)`
clamp is what prevents the fixed-size hero from overflowing into the
rail. **Left track = hero**, vertically centred in its track: the 160px fixed number with the
short pink rule **beneath** it (per the shared pink-accent rule). **Right track = text rail**,
vertically centred: **definition → verdict → reading**, each in its existing role/colour
(definition & reading = Label; verdict = 24px Baskerville italic), separated by the `section`
gap. No band cells, no ranges-disclaimer (band-less). **Locked:** grid-tiles-full-height,
the `minmax(0,…)` track clamp, fixed-size hero (160px), pink rule beneath the hero. **Build-and-review
at 1421×773:** the 5/7 track ratio, the inter-track gap, and whether the hero is centred vs
bottom-anchored in its track.

**Radial — 2 columns (band metric only; not offered band-less)** — grid: 2 columns × (title row +
2 content rows):
    title  title
    rings  legend
    rings  commentary
- Rings (col 1, spanning both content rows): a faint outer ring + a `selectedColor` emphasis ring
  + the centred hero number + a dot on the emphasis ring. DECORATIVE — NOT value-proportional:
  `cagr` is not a 0–1 ratio, so the ring is never a progress arc of the value (cf. CHART_SPEC
  no-progress-ring for non-ratios). The active band is shown by the legend, not ring geometry.
- Legend (col 2, row 1): the 3-row band table, active row highlighted; benchmark numerals 40px.
- Commentary (col 2, row 2): verdict + reading, top-justified.

**Ledger — 3×2 (band metric)** — grid: 3 columns × (title row + 2 content rows):
    title  title    title
    hero   verdict  reading
    bandL  bandM    bandH
- Top row is a uniform `--panel` (#181818): hero, verdict and reading cells all `--panel`.
- Hero: 120px fixed number, generous interior padding so the figure is inset from the cell edges
  (loose end of the cell-padding range); NO pink rule.
- Verdict (middle): a short pink rule ABOVE the text, then the verdict; content vertically centred.
- Reading (right): NO rule; reading + disclaimer centred together as one block (not floor-pinned).
- Bottom row: the three band cells, each distributing label (top) / numeral (middle) /
  explainer + `e.g.` (bottom). Benchmark numerals 40px.

**Ledger — band-less (`tam`,`mcon`)**: drop the bottom band row; the top row (hero | verdict |
reading) fills the card height; no ranges-disclaimer.

**States** — too-small and no-data inherited from the shared rules; band-less is a normal render,
not a degraded state. Validate at `1421 × 773` and at the host `1600 × 900` (PowerPoint).

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

## BAN detail screen (the headline / single-number view)
The in-extension view an indicator swaps to when its chosen chart is a BAN. Layout: a focal
number (main, left) with a generic definition beneath it, and an optional right rail of three
context cells that ground the number high/low. Reuses the Scorecard frame chrome — do not
re-derive.

**Focal number (Hero).** Baskerville italic — the locked
`'Baskerville','Libre Baskerville',Georgia,serif` stack, never the removed Baskervville —
colour `#e994a2`. The pink is the *focal* accent here even on market-level metrics that have
no client brand: a documented exception to the client-only rule, kept as one constant so
per-client theming stays additive. Size is the sanctioned per-chart Hero override. The
unit/suffix (`%`, `/5`, `$…B`) renders muted `#6f6f6f`, ~0.3em, italic.

**Decimals — `INDICATOR_DECIMALS` (single source of value precision).** Per-indicator integer
decimal places, applied to the **displayed** value (after any `INDICATOR_UNITS` conversion),
never the raw. No thousands separator. This map is the single source for value precision
across all surfaces; the Scorecard "Values to 1 decimal" rule defers to it. Values:
`mcon` 0 · `cagr` 1 · `tam` 1 · `nps`/`bt`/`sop`/`dvtr`/`ba` 1 · `svt`/`vom` 2.

**Definition.** A generic per-indicator sentence stating what the metric is — stable, never a
per-value reading, so it needs no maintenance as data refreshes. Tableau Light/Regular,
13–14px, `#a4a4a4`.

**Caveat (optional, per-indicator).** A generic italic note, 11–12px `#6f6f6f`, for indicators
whose benchmark needs qualifying (`cagr`: no absolute good/bad line; `mcon`: 2023 guidelines,
other vintages/jurisdictions differ). Omitted where unset.

**Context cells (right rail).** Three cells in the Scorecard frame: frame `#0d0d0d`, 1px
`#262626`, 2px gutter and padding, frame radius 10 = cell radius 8 + 2px gutter. Cells are
**greyscale only — never RAG on this surface**: default `#222222`, the cell the value lands in
lighter `#363636` ("active"), with a quiet grey marker note `#cfcfcf`. Cell type is
per-indicator:
- **Threshold standard** (`mcon`) — an external standard's bands, decisive. DOJ/FTC HHI bands
  (2023): `< 1500` unconcentrated · `1500–1800` moderate · `> 1800` highly concentrated.
- **Scale bands** (`nps`/`bt`/`sop`/`dvtr`) — the locked 1–5 thresholds `< 2` / `2–4` / `> 4`,
  rendered greyscale here (RAG belongs to the Scorecard table, not this surface), with a
  category-average grounding marker (`coffee_general`).
- **Illustrative ranges** (`cagr`) — no absolute standard, so the cells characterise the
  spectrum by example sector (low/declining · mature/steady · high-growth) with loose ranges;
  generic illustrative copy, not sourced data.
- **None** (`tam`) — magnitude-only; no cells until reference sizes are sourced.

Locked: frame chrome (reused), greyscale-only rule, decimals-via-map, generic-definition rule.
Build-and-review at 1421×773: exact number/definition sizes, cell proportions, the active grey.

**Enforcement adds (harness asserts):** BAN context cells contain no RAG colour (greyscale
only); value precision matches `INDICATOR_DECIMALS` with no thousands separator; the gutter is
the uniform 2px and frame radius = cell radius + gutter; the definition string contains no
interpolated value (it is generic).

## Copy & interim text (all surfaces)
- **Copy the layout depends on is always real static interim text — never a visible
  placeholder token or an empty/"pending" state.** Where an element needs text to read as
  complete (verdict, reading, definition, subtitle, band labels), ship a hardcoded interim
  sentence — generic, brand-interpolated where natural — that renders cleanly now and is
  swapped for a real source later (additive). Figma working-state tokens
  (`{{.llm.interpretation}}` and the like) are never a render target.
- **Bespoke via brand interpolation:** interim copy interpolates `CONFIG.clientBrand`
  (≈ one mention per text block — enough to feel bespoke, not spammy), re-resolving on
  `ParameterChanged`, same resolver as the question subtitle.
- A genuinely absent *data-driven* element (a band scheme that doesn't exist, a funnel with
  no SAM/SOM) is handled by a **complete alternate layout** (hero + commentary), not by
  rendering an empty slot.
- A disclaimer or note that describes a specific element (e.g. "bands follow…") renders ONLY
  where that element is present. Band-referencing copy never appears on a band-less layout.

## Enforcement (what the harness / lint checks)
- No `font-size` value that isn't one of the four roles or a Scorecard-section locked size
  (hero override excepted).
- Ban-shell locked sizes (allowed in addition to the four roles + the hero fixed-size override):
  verdict 24px and benchmark numerals 40px, both Baskerville italic. No other ban-shell text
  leaves the four roles.
- No font size computed from element geometry.
- No gap/margin off the 4px base unit, except the named overrides (incl. the 2px gutter).
- Type sizes identical for the same role across all charts.
- **Value numeral:** every non-BAN chart mark carries its numeric value in the Value-numeral role (Baskerville italic 24px); client brand fill = `#e994a2`, all others = `#ededed`. BAN family is exempt (hero is a separate, larger role). Decimals from `INDICATOR_DECIMALS`.
- **Visual fidelity (measurable — the harness asserts these so the reviewer doesn't have to):**
  - Gutter is uniform: cell↔cell, cell↔frame, and table↔commentary are all the same 2px.
  - Corner radii nest: frame radius = cell radius + gutter (e.g. 8 + 2 = 10); cells and the
    commentary panel share one radius.
  - Every grouped-cell container the extension renders (scorecard, ban context cells,
    scale segments, the solutions frame) uses the 2px gutter and nested radii
    (frame = cell + gutter); the harness asserts none ships with off-token gaps or a flat
    (non-nested) radius.
  - Solutions descriptions and the In Practice reading clamp (no overspill / clipped
    overflow); the In Practice anchor is ONE white border-less card spanning both rows
    with the image inset 2px from the card edge (one solution-card row, not full-bleed)
    and text beneath — not separate cells, not a bordered card.
  - No clipped or ellipsised text: indicator names and labels render in full (wrap, don't truncate).
  - Text on any coloured fill meets contrast (WCAG AA): e.g. the pink client cell uses dark
    text, never white.
  - Value suffix appears only where intended (client column only — never on comparators).
  - Value digits are uniform: every digit of a value (including the post-decimal digit) renders at the same size and on the same baseline; only the `/5` suffix may be `0.5em`.
  - Numerals are inset from the cell edge (padding > 0 — not hugging the corner).

## Solutions surface

### Theme options (assigned per surface, not a runtime toggle)

This project supports two surface themes — **dark** (existing scorecard and chart surfaces) and
**light** (solutions surface). Theme is assigned to a surface type in code; there is no runtime
user-toggle between themes. The dark token set is the existing Scorecard / BAN shell sections
above.

### Light-theme tokens

| Token | Value | Notes |
|---|---|---|
| Card background | `#FFFFFF` | White card; host dashboard transparent behind |
| Card border / gutter | `~#CCCCCC` | Indicative — **confirm-against-Figma** |
| Title text (near-black) | indicative | **confirm-against-Figma** |
| Body text (dark-grey) | indicative | **confirm-against-Figma** |
| Tier-3 pill text + border (grey) | indicative | **confirm-against-Figma** |
| Empty holding cell (`--empty`) | `#F5F5F5` | Faint fill for unfilled scaffold slots; lighter than frame bg (`#E0E0E0`), darker than white |
| Subtitle | 19px Tableau Light | Construct subtitle beneath Display title (reuse §Detail-header Question size) |

Spacing, type-role sizes (Heading 16px, Label 13px, Caption 11px), and face stack are shared with
the dark theme. Tokens marked **confirm-against-Figma** are indicative; finalise on the first
Figma cross-check.

### Solution-pill component

Pill style: **outlined** (transparent fill, coloured border + text). **No red pill.** No filled
pill. Text colour follows the border colour — the "black text on coloured fill" rule does
**not** apply here (the pill has no fill).

Tier-to-colour mapping:

| Tier | Light hex | Dark hex | Colour name | Pill label text |
|---|---|---|---|---|
| 1 (best) | `#4ADE80` | `#57bf6a` | green | ESSENTIAL |
| 2 | `#F5AF00` | `#e0992e` | amber | IMPORTANT |
| 3 | neutral grey | neutral grey | grey-outline | OPTIONAL |

Full light RAG palette (for reference): `#E42F4D` / `#F5AF00` / `#4ADE80`. Red (`#E42F4D`) is
defined for completeness but **not used on this surface** — see pink-accent exemption below.
Full dark RAG palette (for reference): `#e0584f` / `#e0992e` / `#57bf6a` (matching existing
Scorecard RAG constants).

### Grid (fixed 6-cell scaffold)

Card grid renders solutions in `display_order` (fixed; never re-sorted by tier or any other
field). Layout is a **fixed 3×2 scaffold** (3 solution columns × 2 rows) with one In Practice
anchor column at right — always 4 columns, 2 rows. Always render six solution holding cells:
fill from the construct's solutions in display_order; surplus cells render as empty holding
cells (faint `--empty` fill, not omitted). The anchor spans both rows (grid-column 4,
grid-row 1/3). `--gutter: 2px` is unchanged throughout.

### Card-frame and cell layout

Cards are tiled cells in one hugging frame: frame carries the light-grey background +
frame radius (= cell radius + 2px gutter); cells are white at the cell radius with NO
own border; a uniform 2px hairline gutter shows cell↔cell and cell↔frame (per § Spacing
override). Free-floating cards with off-token gaps are non-conformant.
Status pill (ESSENTIAL/IMPORTANT/OPTIONAL, outlined, no fill) sits top-right of each solution card.
Solution name: Heading 18px, uppercase. Solution description: bottom-pinned (`margin-top: auto`)
and clamped (`-webkit-line-clamp`) — never overspills the cell.
Forward navigation is a native Navigation object — no CTA rendered inside the card.

**In Practice anchor** — ONE white, border-less card spanning both rows (grid-column 4,
grid-row 1/3). When a case-study image exists: image inset 2px from the card edge (the
`--gutter`; inner radius nests = card radius − 2 = 6px) and sized to exactly one
solution-card row (`calc((100% − var(--gutter)) / 2)`) at the top; text beneath fills
the rest. No case study → no image; text fills the whole card. Text = default editorial:
label (Caption 11, uppercase) + verdict (Baskerville italic 24px) + reading (Label 13),
reading clamped. Image is inset 2px, **not full-bleed** (intentional divergence from the
Figma). The 2px inset and one-row height align the image with the solution cells.

### Insight lead paragraph (per-construct commentary)
Extension-rendered. Bespoke per-construct commentary read from the `insights` worksheet,
placed below the Display construct title, above the card grid, full content width.
- Source: sheet `insights`, one text column per construct — `opps_growth` / `opps_standout`
  / `opps_fandom`. Construct→column map hardcoded (no settings cog); the matching column for
  the self-identified construct is read verbatim.
- Type: Label role, 13px, Tableau, body grey `#3C3C3C`, line-height ~1.5. Sanctioned bump to
  Heading 18px if the lead needs more presence — build-and-review at 1421×773, record as
  intentional. No other size.
- No pink: the solutions-surface pink-accent exemption applies; no `#e994a2`.
- Spacing: Display title → insight = `section` (16px); insight → grid = `section` (16px).
  Build-and-review at 1421×773.
- Fallback (value empty / `'%null%'` / `'Null'` / `''` / null): render the generic fallback
  sentence with `{{client}}` interpolated (`CONFIG.clientBrand`, re-resolved on
  `ParameterChanged`, same resolver as the question subtitle). Real interim copy, never a token.
- Load-failure diagnostic (structural): when `insights` is absent, the construct's column is
  missing / not on a shelf, the read returns 0 columns, or the construct is unresolved (tab
  name has 0 or ≥2 construct tokens), render an actionable hint in the slot — naming the
  expected sheet, the expected column, and the Rows/Columns-shelf requirement — and log the
  same to console. Distinct from the empty-value fallback.
- Preview mode (`typeof tableau === 'undefined'`): render a sample insight sentence.

### Pink-accent exemption

The **solutions surface carries no pink accent** — it is fully exempt from the
guaranteed-pink-accent rule (§ Colour above). `#e994a2` does not appear anywhere on this
surface. Documented as intentional; do not add a pink rule or dot to solutions renders.

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

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

- **Hero is the only sanctioned size override, and the only geometry-responsive size.** It may
  be sized per chart AND may scale with the container (bounded min/max) so the focal figure
  fills the canvas. No OTHER type derives its size from geometry — the ban on geometry-driven
  font size (`Math.min(11, cellW*0.22)` and similar) still binds every non-hero element.
  Chart graphics (e.g. radial rings) are not type and scale freely to fill.
- **A chart-view title uses the Heading role (Tableau Light), never Baskerville.**
  Baskerville italic is hero numerals only; an indicator name shown as a chart
  title is a Heading, not a hero. If 16px reads with too little title contrast at
  1421×773, bump Heading to 18 per the Heading note — do not switch the face.
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
  - **Cell gutter = 2px** — the gap between adjacent cell-like elements, deliberately off the
    4px grid so the dark frame shows through as a hairline; 4px reads clunky here. Applies to
    **scorecard cells and any grouped cells on detail/chart pages alike** (e.g. ban reference
    bands, scale segments, context chips). Cell↔cell wherever cells are grouped; where a cell
    group sits inside a hugging frame, cell↔frame padding is also 2px and radii nest (frame
    radius = cell radius + 2). Free cells inside a larger padded card use the 2px gutter
    between themselves but inherit that card's padding, not a 2px inset.

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

## Headline / ban shell (Direction 1 — editorial dispatch)
Shared layout for the Headline class (`tam`, `cagr`, `mcon`). One template fed per-indicator
by a content object `{title, code, unit, scope, value, def, disclaimer, bands[], verdict,
reading}`. Renders in the same contained card as the scorecard (`#0d0d0d`, 1px `#262626`,
radius 16px); body transparent.
- **Hero figure:** the value in Baskerville-italic (the sanctioned Hero override),
  neutral-bright `#ededed`; unit as a reduced italic suffix (`0.32em`, muted). Anchored left;
  a short `#e994a2` rule beneath it (the guaranteed accent).
- **Title block:** `title` (Heading 16px) + caption subline `code · unit · scope` (Caption 11px `#777`).
- **Logic pill (band metrics only):** the band chain arrow-joined (`Low → Mature → High`),
  1px `#2d2d2d` border, pill radius; active label bright, rest muted. Top-right of title row.
- **Band rail (band metrics only):** bands in a right-hand rail; active band marked (bright
  text + pink marker). Band labels uppercase Tableau Light; range numerals Baskerville-italic;
  `e.g.` examples Caption italic. Bands are illustrative copy (see Copy) and carry the
  "illustrative, not a benchmark" disclaimer.
- **Verdict + reading:** the scorecard commentary device reused — verdict (Baskerville-italic
  ~26px) + reading (13px `#9a9a9a`), interim copy, brand-interpolated.
- **Band-less metrics (`tam`, `mcon` today):** no pill, no rail — figure + definition +
  verdict + reading is the complete layout; the pink hero rule still anchors.
- **States:** honour too-small and no-data per global rules.
Locked: the content model, the band vs band-less split, the guaranteed pink rule, Baskerville
hero, neutral hero figure. Build-and-review at `1421 × 773`: hero size, rail/hero proportion,
pill placement, verdict/reading sizes.

### Direction 2 — Radial (band metrics only)
Concentric rings encode the bands (inner→outer by the band order); the hero figure sits centred
in the rings; a pink dot marks the active band's ring (the guaranteed accent). A right-hand
legend lists the bands — serif-italic ranges, `e.g.` examples, bullet markers, hairline
dividers. Offered only where bands exist; not shown for band-less metrics. Honours the
size-&-aspect rules: rings + legend centred and bounded, never stretched.
### Direction 3 — Ledger (scorecard sibling)
Hero in a cell plus the bands as hairline 2px cells (the scorecard cell system); active band in
the emphasis fill (`#3a3a3a`) with a pink "you are here" dot; a verdict + reading commentary
panel below in the scorecard commentary style. Band-less metrics render hero cell + commentary
(complete, not empty). Cells content-sized per the size-&-aspect rules.

**Fluid layout & aspect robustness (fixed type, fluid layout).** Type never changes with the
container — only layout flexes.
- Hero + text are one coherent lockup, never detached islands with a dead gap. Bounded
  max-width, centred in the card; the composition FILLS the container: the hero figure and any chart graphic scale up to fill
  (bounded), and the layout distributes to use the space. Only a small residual is balanced
  margin — the content is never a tiny island in a large canvas. Cells still never stretch to
  absurd empty heights (Task 020); fill comes from the scaled hero/graphic + distributed layout.
- Text measure is capped (~60ch reading) so prose never runs the full width of a wide card —
  cap by max-width, never by shrinking type.
- Stacked text (title, subline, definition, verdict, reading, disclaimer) is normal-flow with
  explicit 4px-grid margins; it can never overlap at any height. No collidable absolute positioning.
- Vertical: lockup centred with a min inset. **Crowding priority at short heights** — if content
  can't fit, optional text yields in order (disclaimer → reading), keeping hero + title + verdict;
  below that, the too-small state. Type never compresses.
- **Cells are content-sized, not stretched.** Ban band cells (rail / ledger) size to their
  content and the rail is centred as a group — they do NOT flex to fill the card height (unlike
  scorecard rows, which do fill). The composition holds at any *size* of a given aspect, not
  just `1421 × 773` — surplus space (horizontal or vertical) becomes balanced margin.
- **Validate at size and aspect extremes, not only `1421 × 773`:** the same aspect scaled
  larger, a wide/short strip, and a narrow/tall column. All go in the harness/manual checklist.

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

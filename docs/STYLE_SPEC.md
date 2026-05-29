# STYLE_SPEC.md — parametric type & spacing tokens

The client cares most about typography and spacing, so these are locked as tokens and
enforced. Colours and motion were not friction points — codify existing values and move on.

**Principle: fixed type scale, fluid layout — driven by a few parameters.** A small set of
root knobs derives everything; tuning the look means changing a knob, not editing values
across the file. Type sizes are locked (derived from a constant base, never from element
geometry); only layout flexes by rule. Validate at the real Tableau container pixel sizes.

> **Defaults vs truth.** The numeric defaults below are a sensible starting point (Material-
> style 4-based spacing; type anchored near the current code's working sizes). They are
> meant to be tuned via the knobs — they are *not* measured from a final Figma frame.
> Where a value must match an existing asset/colour and isn't yet confirmed, it's tagged
> `‹confirm›`.

> **Foundation check (verify first).** This whole system relies on CSS custom properties +
> nested `calc()` rendering in the Tableau embedded browser. Custom properties are already
> in use in `index.html` (`--primary-900` etc.) → observed-working. Confirm nested `calc()`
> in isolation before WO-2 builds on it (TABLEAU_API_REALITY rule 6). `[to verify]`

---

## The knobs (`:root`)
Change these to change the whole look and feel.

```css
:root {
  /* Spacing — Material-style 4-based scale */
  --space-unit: 4px;            /* the one spacing knob */

  /* Type — fixed scale, parametric base */
  --type-base: 14px;            /* the one type knob; rescales the whole ramp */

  /* Shape */
  --radius: 8px;                /* cell corner radius */
  --radius-sm: 4px;             /* inner / small radius */

  /* Colour roots (a few; everything derives) */
  --client-strong:  #D73F58;    /* Illycaffè header cell (= --primary-900) ‹confirm vs brand red› */
  --client-surface: #6f6f6f;    /* Illycaffè body cells (lighter grey) ‹confirm› */
  --cell-surface:   #2a2a2a;    /* competitor body cells (darker grey) ‹confirm› */
  --surface-0:      #000000;    /* table / header background ‹confirm› */
  --client-highlight: #e994a2;  /* CHART client highlight — existing, unchanged */
  --text:           #ffffff;    /* primary text */
  --text-muted:     #b9b9b9;    /* captions, /5 suffix, "Jump to" */

  /* RAG — client column only */
  --rag-green: ‹confirm — match overview STRONG pill›;
  --rag-amber: ‹confirm — match overview NEUTRAL pill›;
  --rag-red:   #D73F58;         /* = --primary-900 */
}
```

---

## Spacing scale (derived from `--space-unit`)
Every gap, margin and padding is a step on this scale — no off-scale values.

| Token | calc | Default | Typical use |
|---|---|---|---|
| `--space-1` | `calc(var(--space-unit) * 1)` | 4px | hairline gaps, icon↔label |
| `--space-2` | `* 2` | 8px | cell gap (grid gutter) |
| `--space-3` | `* 3` | 12px | cell padding |
| `--space-4` | `* 4` | 16px | block gap |
| `--space-6` | `* 6` | 24px | section gap |
| `--space-8` | `* 8` | 32px | title block margin |

Named aliases (use these in code, not raw steps where a name fits):
`--gap-tight: var(--space-1)` · `--gap-default: var(--space-2)` · `--gap-section: var(--space-6)`.

Named overrides (the few places that genuinely deviate — documented so they read as
intentional, not drift): *none yet — add here as needed.*

---

## Type scale (fixed; derived from `--type-base`)
Closed set of size **steps**; every `font-size` is one of these (the only sanctioned sizes).
Changing `--type-base` rescales them all proportionally; the factors set the relationships.

| Step token | calc (factor × base) | Default @ base 14 | Face | Role / use |
|---|---|---|---|---|
| `--fs-title` | `calc(var(--type-base) * 3.1)` | ~44px | Tableau Light | display title ("OPPORTUNITY PATHWAY") |
| `--fs-hero` | `calc(var(--type-base) * 3.1)` | ~44px | Baskervville italic | chart BAN / arc focal number (per-chart override allowed) |
| `--fs-score` | `calc(var(--type-base) * 1.6)` | ~22px | Baskervville italic | the X.X score number in cells/header |
| `--fs-heading` | `calc(var(--type-base) * 1.0)` | 14px | Tableau Light | indicator names, brand-column names, section labels |
| `--fs-label` | `calc(var(--type-base) * 0.86)` | ~12px | Tableau Regular (values) / Light (brands) | value labels, "Survey Score" subtitle |
| `--fs-caption` | `calc(var(--type-base) * 0.79)` | ~11px | Tableau Light | "+snowflake", `/5` suffix, "Jump to", axis ticks, legend |

- **Hero / display** is the only per-element size override, and only where it's the focal
  element (chart BAN, the title). Nowhere else sets its own size.
- **No font size derived from geometry** (`Math.min(11, cellW * 0.22)` and similar must go).
  Steps derive from the constant base, never from container/cell size.
- Below the **minimum container size**, a chart shows its "too small" state rather than
  shrinking text. Minimum size: `‹px × px›` (fill from real container).

> **Flagged change for ratification:** this replaces the previous "exactly four roles" with
> a closed six-step modular scale + role map. Reason: the table introduces a display title
> and a distinct score number the four roles didn't cover. Enforcement intent is unchanged
> (no off-scale or geometry-derived sizes) and arguably tighter.

## Faces (existing constants — keep)
- Baskervville italic — hero numbers and the score numbers.
- Tableau Regular — value labels / body.
- Tableau Light — headings, axis/caption text, and brand names.
- **Brand-name casing:** chart brand labels are UPPERCASE; the **indicator-table header**
  uses title-case display names (named override below), not uppercase.

### Brand display map (table header only — named override)
`Illy → Illycaffè` · `Peets → Peet's Coffee` · Nespresso / Starbucks / Lavazza unchanged.
Title case, table header only. Charts keep uppercase.

### Brand asset — BULLETPROOF wordmark (header-left cell)
A brand mark, **not type** — sized as layout, exempt from the type scale. Inline SVG in
`index.html` (no external asset → no CDN safe-list issue; works in the `?subgroup=` preview).
- viewBox `0 0 336 38`, aspect ratio ≈ **8.84:1** — reserve cell height from width accordingly.
- `fill="currentColor"` so the cell's text colour themes it (parametric).
- Sits above the "Survey Score" label (`--fs-label`, `--text-muted`) in the top-left cell.
- Width fills the name-column content box; `max-width` = natural 336px (never upscale);
  `height: auto`.
- Same mark across all subgroups (it's the survey provider's wordmark), so embed once.

```html
<svg viewBox="0 0 336 38" fill="none" role="img" aria-label="Bulletproof"
     xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:336px;height:auto;display:block">
<path fill="currentColor" d="M313.09 36.9728H320.867V22.4493H330.769L333.116 16.7268H320.864V6.60378L334.36 6.52934L335.092 0.806863L313.084 0.881297V36.9728H313.09ZM277.731 17.0186C277.731 9.39058 281.765 5.9428 287.488 5.9428C294.749 5.9428 300.838 12.9843 300.838 20.9814C300.838 27.2904 297.465 32.352 291.081 32.352C283.745 32.352 277.731 25.1616 277.731 17.0215V17.0186ZM269.367 20.1001C269.367 29.4907 277.365 38 287.779 38C298.194 38 308.978 30.2976 308.978 17.5337C308.978 8.2175 301.055 0 290.932 0C279.708 0 269.364 8.14307 269.364 20.1001H269.367ZM235.184 17.0186C235.184 9.39058 239.219 5.9428 244.941 5.9428C252.203 5.9428 258.292 12.9843 258.292 20.9814C258.292 27.2904 254.918 32.352 248.535 32.352C241.199 32.352 235.184 25.1616 235.184 17.0215V17.0186ZM226.821 20.1001C226.821 29.4907 234.818 38 245.233 38C255.648 38 266.432 30.2976 266.432 17.5337C266.432 8.2175 258.509 0 248.386 0C237.161 0 226.818 8.14307 226.818 20.1001H226.821ZM205.84 17.8999V6.67523H210.094C213.908 6.67523 216.478 9.68236 216.478 12.8384C216.478 15.0386 215.817 16.6524 214.131 17.8999H205.842H205.84ZM198.137 36.9728H205.84V23.1073H207.748L219.193 36.9728H228.068L215.745 21.8598C217.359 21.1988 218.973 20.1716 220.295 19.0729C222.641 17.093 224.183 15.1845 224.183 11.8826C224.183 4.91264 218.606 0.87832 211.785 0.87832H198.14V36.9698L198.137 36.9728ZM177.084 18.5608V6.67821H180.752C184.566 6.67821 187.061 9.53945 187.061 13.2076C187.061 15.7026 186.4 17.3163 184.715 18.5638H177.087L177.084 18.5608ZM169.382 36.9728H177.084V24.3548H180.678C183.539 24.3548 187.94 22.4463 190.801 20.1746C193.221 18.2661 194.835 15.4078 194.835 12.2518C194.835 4.76973 188.892 0.881297 183.685 0.881297H169.382V36.9728ZM139.671 6.45491H148.621V36.9728H156.398V6.45491H165.273V0.87832H139.671V6.45491ZM114.658 36.9728H135.199L135.931 31.2503H122.435V21.2732H131.897L134.243 15.5507H122.432V6.6008H135.196L135.928 0.87832H114.655V36.9698L114.658 36.9728ZM89.7167 36.9728H110.037L110.77 31.1789H97.4906V0.881297H89.7137V36.9728H89.7167ZM64.9213 36.9728H85.2417L85.9741 31.1789H72.6951V0.881297H64.9183V36.9728H64.9213ZM7.62799 15.5507V6.67523H11.2961C16.2117 6.67523 18.5579 12.9098 14.4491 15.5507H7.62799ZM7.62799 31.2503V21.3476H12.1774C15.9914 21.3476 18.4864 23.9886 18.4864 26.9242C18.4864 28.3921 17.8254 30.0058 16.1402 31.2533H7.63096L7.62799 31.2503ZM0 36.9728H11.9571C15.4793 36.9728 20.3919 34.6981 22.3748 33.1588C24.5751 31.4707 26.2633 28.8297 26.2633 25.897C26.2633 21.4221 23.2561 18.3405 19.8084 16.8012C27.9514 11.7397 24.2833 0.881297 13.94 0.881297H0V36.9728ZM43.2074 37.9256C47.462 37.9256 52.2318 35.7253 58.0257 31.6165V0.881297H50.3977V30.7382C44.1631 33.8198 37.8541 31.1789 37.8541 22.8155V0.881297H30.2261L30.1517 24.6495C30.1517 32.8641 34.7011 37.9285 43.2104 37.9285L43.2074 37.9256Z"/>
</svg>
```

---

## Layout (fluid — grid rules, not fixed px)
Type is fixed; layout flexes by these rules. The scorecard is one CSS grid.

- **Columns:** a wider indicator-name column + N equal-fraction brand columns, e.g.
  `grid-template-columns: minmax(‹name-min›, 1.6fr) repeat(var(--brand-count), 1fr)`.
  Client column is first; flagged by class, not by a different width.
- **Gaps:** grid gutter = `--gap-default` (8px); cell padding = `--space-3` (12px).
- **Radius:** every cell `border-radius: var(--radius)`.
- **Title block:** margin-bottom `--gap-section`; question line `--fs-label`, `--text-muted`.
- Size from `offsetWidth`/`offsetHeight`, never `vw`/`vh`.

---

## Colour (codify existing — not a friction point)
- Chart client highlight: `--client-highlight` (`#e994a2`) — unchanged.
- Table client header cell: `--client-strong`; client body cells `--client-surface`;
  competitor cells `--cell-surface`.
- Neutral text `--text`; muted `--text-muted`.
- **RAG (client column only):** score **> 4 → `--rag-green`**, **< 2 → `--rag-red`**, else
  **`--rag-amber`**. Competitor scores stay `--text` (no RAG).
- Status pills on the overview: STRONG = green, NEUTRAL = amber (match existing).

---

## Enforcement (what the harness / lint checks)
- Every `font-size` is one of the `--fs-*` step tokens (hero/title override excepted). No
  raw px font sizes; no size computed from element geometry.
- Every gap / margin / padding is a `--space-*` step (or a named alias/override). No raw px.
- `border-radius` uses `--radius` / `--radius-sm`.
- Type sizes identical for the same role across all charts.
- Colours reference the roots, not inline hexes.

---

## TODO before this is final
- Ratify the four→six role change above.
- Confirm nested `calc()` in the embedded browser (foundation check).
- Fill `‹confirm›` colours from the existing palette / overview pills (RAG green & amber,
  client greys, surface-0) — match existing, don't invent.
- Fill the minimum container size `‹px × px›` and validate the type base against the real
  container pixel size; tune `--type-base` if the ramp reads small/large there.
- ~~Supply the BULLETPROOF wordmark as an inline SVG~~ — **done**, recorded under Faces →
  Brand asset (currentColor, aspect ratio 8.84:1, header-left cell).
- Confirm the overview card copy against the design (e.g. "STRATEGIC STRENTH" dropped G).

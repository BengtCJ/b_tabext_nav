# Task: 0024 — BAN shell relayout (Editorial · Radial · Ledger): final layout + locked type

Goal: Build the three ban directions to the final relayout, with their distinctive sizes
locked, so the shipped charts match the approved prototype and don't drift on the way into the
real extension.
Why:  The prototype converged across several rounds; this captures the result and pre-empts the
predictable ways a literal transcription would diverge (fonts, tokens, live data, band-less
metrics). Supersedes the § Headline/ban shell layout model drafted in Task 0022.

Reference prototype: `ban_grids_relayout.html` (dummy data, standalone). It is the **look**
target only — its literal px, webfonts and hardcoded values are NOT the spec; the sections below
say what to carry over and what to correct.

Read first: CLAUDE.md, STYLE_SPEC.md (§ Type roles, § Scorecard table, § Enforcement),
CHART_SPEC.md (§ Headline class, § Period granularity, § Invariants), TABLEAU_API_REALITY.md
(sizing/offset, font-availability, ES2020).

Dependency: **build Task 0023 first** (content correctness — `mcon` not-a-year, `tam` unit,
single canonical title, no ranges-disclaimer on band-less). This relayout sits on top of correct
content; do not re-solve those here.

In scope:
- The per-direction layout (grid areas) + the shared chrome, for Editorial, Radial, Ledger.
- Locking the two distinctive ban sizes (verdict 24px, benchmark numerals 40px) + hero fit-to-box.
- Band-less collapse for `tam`/`mcon` (Radial not offered; Editorial/Ledger drop band cells).

Out of scope (do not touch):
- The direction switcher + `METRIC_CHARTS` wiring and Radial's band-metric gating (Task 0021 — keep as is).
- Content/units/title text (Task 0023).
- Other chart classes.

---

## Spec edit 1 (apply verbatim to STYLE_SPEC.md)

Replace the entire `## Headline / ban shell` section with the text below. If that section is not
yet in the repo, insert this text immediately after the `## Scorecard table` section. (Keep the
hero fit-to-box note added to § Type roles by Task 0022; this does not remove it.)

```
## Headline / ban shell — Editorial · Radial · Ledger (locked layout + type)

The Headline class (`cagr`, `tam`, `mcon`) renders as a ban shell with three switchable
directions (EDITORIAL / RADIAL / LEDGER — wiring per CHART_SPEC `METRIC_CHARTS`, not re-specced
here). All three inherit the frame chrome, 2px gutter, radius nesting, fills and states from the
Scorecard frame rules above; each is a small layout delta over that shared base.

**Shared (all directions)**
- Hero number — Baskerville italic; the ONLY geometry-responsive size (see Type roles).
  Fit-to-box via SVG `getBBox`→`viewBox` in Editorial & Ledger; a fixed hero override sized to
  sit inside the ring in Radial (Radial is band-metric-only, so the value is short/bounded).
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
- Hero = a 2×2 block (cols 1–2, content rows 1–2), transparent, fit-to-box number + pink rule beneath.
- Verdict (col 1, row 3) and Reading (col 2, row 3): transparent, top-aligned beneath the hero.
- Bands fill the full-height right column (col 3).

**Editorial — band-less (`tam`,`mcon`)**: no band column; hero + verdict + reading fill the card
(hero dominant); no band cells, no ranges-disclaimer. Exact split build-and-review.

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
- Hero: fit-to-box number, generous interior padding so the figure is inset from the cell edges
  (loose end of the cell-padding range); NO pink rule.
- Verdict (middle): a short pink rule ABOVE the text, then the verdict; content vertically centred.
- Reading (right): NO rule; reading + disclaimer centred together as one block (not floor-pinned).
- Bottom row: the three band cells, each distributing label (top) / numeral (middle) /
  explainer + `e.g.` (bottom). Benchmark numerals 40px.

**Ledger — band-less (`tam`,`mcon`)**: drop the bottom band row; the top row (hero | verdict |
reading) fills the card height; no ranges-disclaimer.

**States** — too-small and no-data inherited from the shared rules; band-less is a normal render,
not a degraded state. Validate at `1421 × 773` and at the host `1600 × 900` (PowerPoint).
```

## Spec edit 2 (apply verbatim to STYLE_SPEC.md → ## Enforcement)

Add this bullet under the first enforcement bullet (the "No font-size value that isn't one of the
four roles…" line):

```
- Ban-shell locked sizes (allowed in addition to the four roles + the hero fit-to-box override):
  verdict 24px and benchmark numerals 40px, both Baskerville italic. No other ban-shell text
  leaves the four roles.
```

---

## Prototype → build: anticipated deviations & counter-instructions

The prototype is dummy-data static HTML. These are the ways a literal port will diverge — each
has a required counter. **Read this before coding; the harness/lint backs the measurable ones.**

1. **Fonts.** Prototype loads Libre Baskerville + Helvetica/Arial. Build uses the locked Faces:
   serif stack `'Baskerville','Libre Baskerville',Georgia,serif` (Mac → Monotype Baskerville,
   others → Libre) and Tableau Light/Regular for sans. Do NOT hardcode Libre/Helvetica. Because
   Baskerville's metrics differ from Libre's, the fit-to-box hero and the 40/24px numerals will
   measure differently — never tune layout to one font's widths.

2. **Fit-to-box timing / zero-size.** `getBBox` returns 0 before layout, before fonts load, or in
   a hidden/zero-size container. The prototype's `setTimeout(150)` is a hack. Build: fit after
   `document.fonts.ready` AND on container resize (offset-based, see #3); guard `getBBox` width 0
   with a `requestAnimationFrame`/short retry; never bake a fixed `viewBox`.

3. **Sizing.** Prototype is fixed `1600×840`. Build sizes from `offsetWidth`/`offsetHeight` only
   (no `vw`/`vh` — breaks in the iframe). Re-fit the hero and re-flow on resize. Validate at
   `1421×773` and the host `1600×900`.

4. **Hardcoded value + active band.** Prototype hardcodes `1.9` and LOW-active. Build: read the
   metric value from the worksheet; format per metric (`cagr` → 1 decimal + `%`); compute the
   active band from value vs thresholds. Nothing about value/active is hardcoded in render.

5. **Band copy/thresholds are interim.** Prototype inlines `cagr`'s labels/ranges/explainers/
   `e.g.`. Build: resolve all band copy (including the explainer text added this round) through
   the single interim-copy resolver (per Task 0019's Copy & interim-text rule) so a real
   per-metric source is an additive swap, not a rewrite. No inline band strings in render.

6. **Band-less metrics (`tam`, `mcon`).** The prototype only shows the band (`cagr`) case. Build
   the collapse per the spec edit: Radial not offered; Editorial drops its band column; Ledger
   drops its band row; NO ranges-disclaimer when there are no bands. Do not render empty band
   cells. (Content of `mcon`/`tam` themselves is Task 0023.)

7. **Type sizes that aren't roles.** The prototype carries off-role px (title 17, reading 14,
   band label 12, explainer 12, radial verdict 21). Correct to: title → Heading 16; reading →
   Label 13; band label → Label 13; explainer/`e.g.`/subline → Caption 11; radial verdict → the
   locked 24 (fix the prototype's 21 drift — same role = same size). Only verdict 24 + benchmark
   40 + the hero override leave the four roles. No geometry-derived size except the hero.

8. **Spacing off-grid.** The prototype's paddings/margins (30, 34, 48, 52, 22, 18, 14…) are off
   the 4px base. Snap to the named gaps (tight 4 / default 8 / section 16 / loose 24) or 4px
   multiples; cell padding follows the Scorecard flex range; the hero cell takes the generous end.
   Keep the 2px gutter uniform (cell↔cell, cell↔frame, table↔commentary) and the radius nesting
   (frame = cell + gutter). Do not transcribe prototype px.

9. **Colour literals → tokens.** Map every hex to a token: `--panel` #181818 (top-row cells),
   `--cell` #242424 (inactive bands), `--active` #3a3a3a (active band), `selectedColor` #e994a2
   (pink), text #ededed/#9a9a9a/#888. Pink is read from the one `selectedColor` constant (future
   per-client param) — never a second pink literal.

10. **Radial ring is decorative, not a gauge.** Risk: "improving" the ring into a progress arc
    showing 1.9%. Forbidden — `cagr` is not a 0–1 ratio; a proportional arc would misrepresent it.
    Keep faint outer ring + pink emphasis ring + dot; the active band reads off the legend.

11. **Hero suffix.** `%` at ~0.43em, muted grey, baseline-aligned — part of the hero override.
    For `tam`/`mcon` the unit/suffix differs (Task 0023); don't assume `%`.

12. **Double title.** Screenshots show Tableau's chrome title above the extension's own — that's
    the Task 0023 single-canonical-title fix. Render exactly one (the extension's); don't add a
    second, and assume 0023 has turned the host title off.

13. **Decorative field rings.** The faint rings layer (low opacity, top-right) is decorative, not
    token-governed. Keep it below content (`pointer-events:none`, low z-index); it must not
    intercept clicks or affect layout.

14. **ES2020.** Stay ES5-safe (no `??`/`?.`; `||`, `&&`/ternary). The prototype's `rule===false`
    guard and `try/catch` around `getBBox` are fine to mirror.

15. **Don't rebuild the switcher.** The EDITORIAL/RADIAL/LEDGER pills, `METRIC_CHARTS` and Radial
    gating already exist (Task 0021). This work order changes only per-direction layout/style +
    the locked sizes.

---

Acceptance criteria (definition of done — all must hold):
- [ ] STYLE_SPEC.md contains Spec edit 1 (the replacement § Headline/ban shell) and Spec edit 2
      (Enforcement bullet) verbatim at the stated locations; no other lines changed.
- [ ] Lint allows verdict 24 + benchmark 40 + hero fit-to-box and flags any other off-role or
      geometry-derived size.
- [ ] Each direction renders its grid areas as specified, at `1421×773` and `1600×900`:
  - [ ] Editorial: hero is the 2×2 top-left block; verdict/reading in the two cells below; bands
        in the full-height right column; pink rule beneath the hero.
  - [ ] Radial: rings span col 1 (decorative, not a value arc); legend in col 2 row 1 (numerals
        40px, active row highlighted); commentary col 2 row 2 top-justified; verdict 24px.
  - [ ] Ledger: top row uniform `--panel`; hero inset with generous padding and no rule; verdict
        centred with a pink rule above it; reading centred with no rule; bands bottom row;
        numerals 40px.
- [ ] Band-less (`tam`,`mcon`): no band cells, no ranges-disclaimer; Radial not offered;
      Editorial/Ledger collapse per spec.
- [ ] Hero re-fits after `document.fonts.ready` and on resize; never zero-size, clipped, or a
      baked viewBox.
- [ ] Active band = `--active` + bright text + 7px pink dot; never pink fill or white-on-pink;
      pink accent present in every direction.
- [ ] Value + active band derived from data; band copy via the single resolver; colours via tokens.
- [ ] 2px gutter uniform; radius nesting holds; no off-grid spacing (named overrides excepted).
- [ ] ES5-safe; sizes from `offsetWidth`/`offsetHeight`.

Constraints (hard):
- Tokens only (STYLE_SPEC); no ES2020 (`??`/`?.`); single file; size from offsetWidth/Height.
- Verify any unconfirmed Tableau capability before building on it (TABLEAU_API_REALITY rules 3 & 6).
- Apply ONLY the verbatim Spec edits named here; make no other spec/architecture change — if one
  is needed, stop and kick back to chat.

Verify by:
- Run the harness (font-size roles incl. the two ban sizes; gutter uniformity; radius nesting;
  no clipped/ellipsised text; WCAG on coloured fills; suffix/accent only where intended; no
  geometry-derived size except the hero).
- Manual: render each direction at `1421×773` and `1600×900`, plus one band-less metric
  (`tam` or `mcon`) in Editorial and Ledger, and confirm Radial is not offered for it.

On uncertainty:
- Stop, record the finding in TABLEAU_API_REALITY.md, kick back to chat. Do not guess.

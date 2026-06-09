# Task: 022 (final) — Ban directions as equal grids with a fit-to-box hero

Supersedes all earlier 0022 drafts (hero-scaling, and the first grid draft). This is the
finalised version. Builds the three ban directions as full-frame grids; the hero figure is
fit-to-box (sizes to its zone) — a deliberate, user-approved carve-out to "fixed type."

Goal: Rebuild Editorial / Radial / Ledger as equal-column grids that tile the container, with a
      fit-to-box hero figure and the locked treatments below.
Why:  The floating/clustered layouts left voids; a grid fills by partitioning, matches the house
      language (scorecard, Figma), and a fit-to-box hero fills its zone regardless of value width.

Read first: CLAUDE.md, STYLE_SPEC § Type roles + § Headline / ban shell + § Spacing + § Colour +
            § Copy & interim text, CHART_SPEC § Data-shape classes, TABLEAU_API_REALITY § Gotchas
            (no vw/vh; size from offsetWidth/Height).
            Visual reference (throwaway, authoritative = STYLE_SPEC): `ban_grids_equal.html`.

In scope:
- Each direction is a CSS grid filling the card (2px hairline gutters throughout; the frame shows
  through). Equal tracks: Editorial 3 equal cols, Radial 2 equal cols, Ledger 3 equal cols with
  equal content rows. Non-hero type is FIXED and anchored top-aligned in each zone.
- **Fit-to-box hero:** the figure scales to fit its zone (suggested technique: SVG `<text>` whose
  `viewBox` is set from its own `getBBox()` after `document.fonts.ready`, then scaled via
  `preserveAspectRatio` — no vw/vh, no ES2020). Hero stays neutral-bright Baskerville italic;
  unit suffix ~0.42em; a short `#e994a2` rule sits beneath it (guaranteed accent).
- **Active band = light grey `#3a3a3a`** (scorecard emphasis fill), bright text, small pink dot
  marker. Inactive bands `#242424`, muted text. NOT white, NOT a pink fill.
- Benchmark numerals: Ledger ~42px, Editorial ~28px, Radial legend ~24px. Generous spacing at
  every sans↔serif seam (e.g. label→numeral ~16px). Single canonical INDICATOR_DISPLAY_NAMES
  title (no inline duplicate). Radial dot small (~r5), on the active band's ring (ring stroked pink).
- Apply across band and band-less; keep Task 019 tokens, Task 023 (MCON content) unaffected.

Spec edit (apply each verbatim):

— STYLE_SPEC.md, § Type roles, REPLACE the "Hero is the only sanctioned size override…" bullet with:
"- **Hero is the only sanctioned size override, and the only geometry-responsive size: it is
  fit-to-box.** The focal figure scales to fit its zone (so `1.9`, `2002`, `14.4` each fill the
  same box), implemented without vw/vh (measure the glyphs and scale — e.g. SVG `getBBox` →
  `viewBox`, after fonts load). Every OTHER element keeps a fixed role size — the ban on
  geometry-driven font size still binds all non-hero type. Optional: a shared min/max bound so the
  hero doesn't diverge wildly in size between directions (build-and-review). Chart graphics (radial
  rings) are not type and scale freely."

— STYLE_SPEC.md, § Headline / ban shell, REPLACE the per-direction descriptions (from the earlier
  tasks) with this section model (keep the Fluid-layout / size-&-aspect block and the Copy rules):
"### Section model — all directions are full-frame grids
Every direction partitions the card into zones tiling the whole frame (2px hairline gutters
throughout; non-hero content anchored top-aligned, fixed type; hero fit-to-box). Active band =
`#3a3a3a` + bright text + small pink dot; inactive bands `#242424`, muted text. Single canonical
title. Generous spacing at sans↔serif seams.
- **Editorial (equal 3-col, open):** zones `title / hero / verdict / reading / bandL,M,H`. Hero
  fills the full-height left column; verdict + reading the middle column; the three bands stack
  right. Zones transparent (open); only band cells carry the `#242424`/`#3a3a3a` fills.
- **Ledger (equal 3-col, equal rows; celled):** title strip, then row 1 = `hero | headline(verdict)
  | text(reading)`, row 2 = the three bands beneath. All cells dark grey `#242424` (active band
  `#3a3a3a`); benchmark numerals ~42px.
- **Radial (equal 2-col):** zones `title / rings / legend / commentary`. The rings SVG scales to
  fill its zone; the active band's ring is stroked `#e994a2` with a small dot (~r5) at its 12
  o'clock; the legend lists the bands (text rows; active row bright text + pink bullet); verdict +
  reading in commentary.
- **Band-less metrics:** drop the band zones — `title / hero / verdict / reading` still tile the
  frame; no band-referencing copy (§ Copy)."

Acceptance criteria (all must hold):
- [ ] Both Spec edits appear verbatim; the § Headline / ban shell per-direction descriptions are
      REPLACED (not appended); no other doc lines changed.
- [ ] Each direction is an equal-track grid filling the card — no large voids at 1600×900, the
      validation size, or a wide/short strip.
- [ ] Hero figure is fit-to-box (scales to its zone per value); every non-hero type size is
      constant across container sizes.
- [ ] Active band is `#3a3a3a` with bright text + small pink dot (not white, not pink-fill);
      inactive `#242424`. Ledger benchmark numerals ~42px.
- [ ] Radial dot is small and on the active band's ring; the active ring is stroked pink.
- [ ] Single canonical title; sans↔serif seams have breathing room; ≥1 pink accent; 2px gutter
      throughout; no overlap; band-less drops band zones with no band-referencing copy.
- [ ] Harness: grid-fills-frame, fit-to-box-hero (only the hero scales with geometry),
      non-hero-type-constant, gutter-uniform, guaranteed-pink, single-title checks pass.

Constraints (hard):
- Tokens only; the ONLY geometry-responsive type is the hero (fit-to-box) — all else fixed. No
  vw/vh (offsetWidth/Height or SVG-bbox); no `??`/`?.`; single file.
- Apply ONLY the verbatim Spec edits; any other change → stop, kick back to chat. Do not invent
  band schemes/units (Task 023 / data track).

Verify by:
- Harness, then manual at 1600×900 + validation size + wide/short strip: switch all three
  directions; confirm fill, fit-to-box hero, `#3a3a3a` active, sizes, no overlap, fixed non-hero type.

On uncertainty:
- Stop, record finding, kick back. The shared hero min/max bound and exact zone proportions are
  build-and-review — flag rather than guess if they read wrong at 1600×900.

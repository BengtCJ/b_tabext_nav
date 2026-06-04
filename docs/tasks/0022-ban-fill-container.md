# Task: 022 — Ban shell: fill the container (hero & graphic scale)

Goal: Make all three ban directions fill their container instead of floating as a small
      island in negative space — by scaling the hero figure and the chart graphic, not the
      body type.
Why:  In situ on a 1600×900 canvas the content reads as a tiny island. This collides with the
      Task-020 "surplus becomes balanced margin" rule; resolution is to let the focal elements
      scale to fill while body type stays fixed.

⚠ Sign-off required: this AMENDS a locked STYLE_SPEC principle ("fixed type scale"). Do not
  build until chat confirms the hero-and-graphic-scale approach (vs uniform whole-composition
  scaling). If unconfirmed, stop.

Read first: CLAUDE.md, STYLE_SPEC § "fixed type, fluid layout" principle + § Enforcement +
            § Headline / ban shell (incl. Task-020 size-&-aspect block), CHART_SPEC § Global rules.

In scope:
- Hero figure scales with the container, bounded by a sensible min/max, so it fills a large
  canvas and never overflows a small one. It remains the ONLY geometry-responsive size.
- Chart graphics (the radial rings) scale to fill — the radial chart must read at canvas scale,
  not get lost inside the decorative background field.
- Layout distributes to use the space (the composition fills; small residual is balanced margin).
  Cells stay content-sized in the sense of Task 020 (no absurd full-height stretch of an empty
  cell), but the composition as a whole fills via the scaled hero/graphic + distributed layout.
- Applies to all three directions (Editorial / Radial / Ledger) and both band & band-less.

Out of scope:
- Body/label/caption/verdict/reading type sizes — these stay FIXED (the four roles).
- MCON content fixes (Task 023); the TAM funnel; inventing bands/units.

Spec edit (apply verbatim):

— STYLE_SPEC.md, § Type roles, REPLACE the bullet "Hero is the only sanctioned size override…"
   (keep its meaning, extend it) with:
"- **Hero is the only sanctioned size override, and the only geometry-responsive size.** It may
  be sized per chart AND may scale with the container (bounded min/max) so the focal figure
  fills the canvas. No OTHER type derives its size from geometry — the ban on geometry-driven
  font size (`Math.min(11, cellW*0.22)` and similar) still binds every non-hero element.
  Chart graphics (e.g. radial rings) are not type and scale freely to fill."

— STYLE_SPEC.md, § Headline / ban shell → Fluid-layout block (from Task 020), REPLACE the line
   "...surplus width becomes balanced margin, never a one-sided void." with:
"...the composition FILLS the container: the hero figure and any chart graphic scale up to fill
  (bounded), and the layout distributes to use the space. Only a small residual is balanced
  margin — the content is never a tiny island in a large canvas. Cells still never stretch to
  absurd empty heights (Task 020); fill comes from the scaled hero/graphic + distributed layout."

Acceptance criteria (all must hold):
- [ ] Both Spec edits appear verbatim; no other doc lines changed.
- [ ] At 1600×900 (PowerPoint) each direction fills the canvas — the hero figure is large and
      commanding, no tiny-island look; residual empty space is minor and balanced.
- [ ] The radial rings scale to read at canvas size — not lost inside the background field.
- [ ] At the small validation size and a wide/short strip the hero scales DOWN and never
      overflows; no overlap (Task 020 still holds).
- [ ] Body / label / caption / verdict / reading type sizes are unchanged across all container
      sizes (only the hero scales).
- [ ] Harness: hero-scales-bounded check added; non-hero type-size-constant-across-sizes check
      passes; existing no-overlap / content-sized-cell / guaranteed-pink checks still pass.

Constraints (hard):
- Only the hero (type) and chart graphics scale with geometry; everything else fixed. No `??`/`?.`;
  single file; size from offsetWidth/offsetHeight, never vw/vh.
- Apply ONLY the verbatim Spec edits named here; any other change → stop, kick back to chat.

Verify by:
- Run the harness. Manual at 1600×900, the validation size, and a wide/short strip: confirm fill,
  bounded hero, fixed body type, no overlap, radial legibility.

On uncertainty:
- Stop, record finding, kick back to chat. Do not guess the min/max hero bounds — tune in chat
  against the real container sizes if unclear.

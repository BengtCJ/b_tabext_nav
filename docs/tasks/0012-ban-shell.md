# Task: 019 — Headline ban shell (Direction 1, interchangeable across indicators)

Goal: Build one shared "ban shell" for the Headline data-shape class, data-driven from a
      per-indicator content object, rendering CAGR with bands and TAM/MCON hero-led.
Why:  The headline `ban` is now a structured shell (left editorial hero + verdict/reading,
      optional band rail), not a bare number — see new STYLE_SPEC § Headline / ban shell.
      Replaces the unstructured BAN (number floating away from disconnected bands).

Read first: CLAUDE.md, CHART_SPEC § Data-shape classes (Headline) + § Invariants,
            STYLE_SPEC § Headline / ban shell + § Colour + § Spacing + § Copy & interim text,
            TABLEAU_API_REALITY § Gotchas (getSummaryDataAsync field exposure).
            Visual reference (non-authoritative, throwaway prototype): Direction 1 in the
            chat prototype `ban_shell_interchangeable_static.html`. The STYLE_SPEC section
            is the definition of correct, not the prototype.

In scope:
- A ban-shell renderer in index.html for the Headline class (`tam`, `cagr`, `mcon`),
  reached via the existing `switchToChart` row path — no new navigation, no parameter.
- A per-indicator content object: `{title, code, unit, scope, value, def, disclaimer,
  bands[], verdict, reading}`. One renderer reads it; swapping indicator swaps the object.
- CAGR: populated with the illustrative growth bands + active-band highlight + the
  "illustrative, not a benchmark" disclaimer; verdict/reading interim copy (brand-interpolated).
- TAM, MCON: hero-led (no pill, no rail) — figure + definition + verdict + reading, all
  static interim copy. This is a complete layout, NOT an empty/pending state.
- Guaranteed `#e994a2` accent on every render (the hero pink rule), per STYLE_SPEC.
- too-small / no-data states per global rules.
- Extend the verification harness with the new measurable fidelity checks (see Verify by).

Out of scope (do not touch):
- Directions 2 (radial) and 3 (stat ledger) — parked.
- The TAM/SAM/SOM funnel and nested-circle motif — BLOCKED (no SAM/SOM in source).
- Inventing band schemes or confirming units for `tam`/`mcon` — data track; render hero-led.
- `svt` (cmoaf but signed-float → trend chart, separate work order).
- Scorecard "OPEN DATA" affordance and the "Growth hp" breadcrumb stray — Task 018.

Spec edit (apply each verbatim to the named doc at the stated location):

— STYLE_SPEC.md, § Spacing → named-overrides list: REPLACE the "Scorecard cell gutter = 2px" bullet with:
"- **Cell gutter = 2px** — the gap between adjacent cell-like elements, deliberately off the
  4px grid so the dark frame shows through as a hairline; 4px reads clunky here. Applies to
  **scorecard cells and any grouped cells on detail/chart pages alike** (e.g. ban reference
  bands, scale segments, context chips). Cell↔cell wherever cells are grouped; where a cell
  group sits inside a hugging frame, cell↔frame padding is also 2px and radii nest (frame
  radius = cell radius + 2). Free cells inside a larger padded card use the 2px gutter
  between themselves but inherit that card's padding, not a 2px inset."

— STYLE_SPEC.md, § Colour → after the primary/pink bullet, ADD:
"- **Guaranteed accent:** every chart/ban render carries at least one `#e994a2` accent to
  anchor the eye, independent of available content. Content-driven pink (active-band marker,
  ring dot, "you are here" dot) provides it where bands exist; where a metric has no bands, a
  short pink rule tied to the hero figure provides it. A render must never appear with no pink
  at all. The hero figure stays neutral-bright (`#ededed`) — pink anchors as an accent, it is
  not the figure colour."

— STYLE_SPEC.md, NEW section immediately before "## Enforcement", ADD:
"## Copy & interim text (all surfaces)
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
  rendering an empty slot."

— STYLE_SPEC.md, NEW section immediately after "## Scorecard table …", ADD:
"## Headline / ban shell (Direction 1 — editorial dispatch)
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
pill placement, verdict/reading sizes."

— CHART_SPEC.md, § Data-shape classes table, Headline row, Charts cell: REPLACE "`ban` only" with:
"`ban` shell (shared left-hero + verdict/reading; optional band rail) — fed per-indicator by
a content object (STYLE_SPEC § Headline / ban shell). Band content is data-driven per metric:
`cagr` = illustrative growth bands (active highlighted); `tam`/`mcon` = no band scheme yet →
render hero-led (a complete layout, not a placeholder). The TAM/SAM/SOM funnel is a TAM-only
specialisation BLOCKED until SAM/SOM are sourced. Headline figures use neutral emphasis with a
guaranteed pink accent; `#e994a2` is never the figure colour."

— CHART_SPEC.md, § Open items to resolve, ADD a bullet:
"- `tam` unit/scale unconfirmed (data `14.4`; the Figma `$12.4B` was placeholder) and `mcon`
  scale unconfirmed (`2002`, possibly an HHI) — confirm before either earns a band scheme.
  SAM/SOM absent from source, so the TAM funnel stays blocked."

— WORKFLOW.md, § Per-surface visual loop, step 2, AFTER the measurable-inventory sentence
   (before "Prototype only the gaps…"), ADD:
"**Also inventory the reference's *signature devices* and its *aesthetic direction* —
separately from the measurable properties above.** Name the distinctive devices that carry
its character (logic/breadcrumb pill, oversized italic annotation, verdict figure,
nested-circle motif, hairline-cell grid, etc.) and state the one-line direction (editorial /
luxury-dark / dense-system…). A prototype must *deploy the devices and commit to the
direction*, not replicate the box structure with neutral defaults. The recurring generation
failure mirrors the measurement one: reading a reference's structure but dropping its devices
and warmth, yielding competent-but-generic output. When offering options, make them diverge by
*concept* (different devices/direction), not by rearranging one safe layout."

Acceptance criteria (definition of done — all must hold):
- [ ] Each Spec edit above appears verbatim at its stated location; no other doc lines changed.
- [ ] One ban-shell renderer drives all three headline indicators from a single content object;
      switching indicator changes only the object's data, not the layout code.
- [ ] CAGR renders the hero (`1.9` + `%` suffix), the logic pill, the band rail with the
      `< 3%` band highlighted, verdict + reading, and the illustrative disclaimer.
- [ ] TAM and MCON render hero-led (figure + definition + verdict + reading) with NO pill, NO
      rail, NO visible placeholder token or "pending" box.
- [ ] Every render (CAGR, TAM, MCON) shows at least one `#e994a2` accent; the hero figure is
      neutral-bright, never pink.
- [ ] All interim copy interpolates `CONFIG.clientBrand` (≈ one mention per block) and
      re-resolves on `ParameterChanged`.
- [ ] Grouped cells (where present) use the 2px gutter; figures are lining (only the unit
      suffix reduced); no font size derived from geometry; hero is the only size override.
- [ ] too-small and no-data states render rather than a broken chart.
- [ ] Harness extended and passing for the checks in "Verify by".

Constraints (hard):
- Tokens only (STYLE_SPEC); Hero is the only sanctioned size override. No `??` / `?.`; single
  HTML file; size from offsetWidth/offsetHeight, never vw/vh.
- Read headline values via the existing data path. Per TABLEAU_API_REALITY, getSummaryDataAsync
  only returns fields on shelves — if a headline row (`tam`/`cagr`/`mcon`, market-level
  `coffee_general`) is not exposed by the current worksheet, STOP and kick back; do not assume.
- Apply ONLY the verbatim Spec edits named above; make no other spec/architecture change. If
  one is needed, stop and kick back to chat. Do not invent `tam`/`mcon` band schemes or units.

Verify by (extend the harness, then run it):
- gutter-uniform on any ban cell clusters (2px); figures-lining; no geometry-derived font size;
  hero-is-only-override; guaranteed-pink-present (≥1 `#e994a2` element per render); no visible
  `{{…}}`/"pending" text in any rendered headline state.
- Manual at `1421 × 773`: CAGR active-band highlight reads; TAM/MCON read as finished hero-led
  layouts; brand name appears and updates on ParameterChanged.

On uncertainty:
- Stop, record the finding in TABLEAU_API_REALITY.md (if API) or kick back to chat (if design/
  data). Do not guess. Data-track items (tam/mcon units, SAM/SOM) stay blocked, not invented.

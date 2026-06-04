# Task: 021 — Ban shell: three switchable directions (Editorial / Radial / Ledger)

Goal: Offer the three ban directions as switchable chart options for the Headline class,
      registered in METRIC_CHARTS with a switcher, data-driven per metric.
Why:  Requested: BAN-Editorial, BAN-Radial, BAN-Ledger all built and switchable. Editorial
      exists (Task 019); Radial and Ledger are pinned in the chat prototype
      `ban_shell_interchangeable_static.html` and need building + wiring.

Read first: CLAUDE.md, CHART_SPEC § Data-shape classes (Headline) + § Period granularity,
            STYLE_SPEC § Headline / ban shell (incl. the Fluid-layout / size-&-aspect block
            from Task 020), the METRIC_CHARTS object in index.html.
            Visual reference (throwaway): the three directions in
            `ban_shell_interchangeable_static.html`; size/aspect behaviour in
            `ban_shell_rail_at_size.html`. STYLE_SPEC sections are authoritative.

Depends on: Task 020 (size-&-aspect rules) — all three directions must honour them
            (content-sized cells, centred composition, capped measure, no overlap).

In scope:
- Build `ban_radial` and `ban_ledger` renderers reading the same per-indicator content
  object as `ban_editorial`; one content model, three renderers.
- Register the directions in METRIC_CHARTS for the Headline metrics, data-driven:
  `cagr` → [editorial (default), radial, ledger]; `tam`/`mcon` → [editorial (default), ledger].
  Radial is offered only where bands exist (CHART_SPEC § Period granularity logic — offer only
  what the data supports); it returns for tam/mcon if/when they gain a band scheme.
- A switcher control listing only the directions valid for the current metric; defaults to the
  METRIC_CHARTS first entry. Switch is a JS view-swap (no parameter, no navigation). Persisting
  the choice via Settings is OUT of scope (future).
- All three honour Task 019 tokens (2px gutter, guaranteed pink, neutral hero, brand-interpolated
  copy) and Task 020 size/aspect rules. too-small / no-data states per global rules.

Also fix (ban-surface correctness — observed in situ):
- **Granularity toggle is data-driven.** A snapshot-only / point-in-time metric (`cagr`, `tam`,
  `mcon`) shows NO month/quarter toggle (CHART_SPEC § Period granularity). The in-situ
  "QUARTERS" control on CAGR is a bug — derive the toggle from the indicator's available grains.
- **Single canonical display name.** One name per metric from `INDICATOR_DISPLAY_NAMES`; the
  card title and any inline title must match (the in-situ "Compound Annual Growth Rate (CAGR)"
  vs inline "Market Growth Rate" mismatch must go).
- **Pill spacing.** The logic-pill band chain reads "High growth", not "Highgrowth".

Out of scope (do not touch):
- The TAM/SAM/SOM funnel; inventing band schemes or units for tam/mcon.
- The MCON = HHI data-contract question and its band-referencing disclaimer (data track, Task 020 Note).
- Directions' copy content (Task 019 — unchanged).

Spec edit (apply verbatim to the named doc at the stated location):

— STYLE_SPEC.md, § Headline / ban shell, ADD two sub-sections after the Direction-1 description:
"### Direction 2 — Radial (band metrics only)
Concentric rings encode the bands (inner→outer by the band order); the hero figure sits centred
in the rings; a pink dot marks the active band's ring (the guaranteed accent). A right-hand
legend lists the bands — serif-italic ranges, `e.g.` examples, bullet markers, hairline
dividers. Offered only where bands exist; not shown for band-less metrics. Honours the
size-&-aspect rules: rings + legend centred and bounded, never stretched.
### Direction 3 — Ledger (scorecard sibling)
Hero in a cell plus the bands as hairline 2px cells (the scorecard cell system); active band in
the emphasis fill (`#3a3a3a`) with a pink "you are here" dot; a verdict + reading commentary
panel below in the scorecard commentary style. Band-less metrics render hero cell + commentary
(complete, not empty). Cells content-sized per the size-&-aspect rules."

— CHART_SPEC.md, § Data-shape classes table, Headline row, Charts cell: APPEND to the existing
   text: "Three switchable directions — `ban_editorial` (default), `ban_radial`, `ban_ledger`
   — registered in METRIC_CHARTS per metric; `ban_radial` is offered only where bands exist
   (band metrics), excluded for band-less metrics until they gain a band scheme."

Acceptance criteria (all must hold):
- [ ] Each Spec edit appears verbatim at its stated location; no other doc lines changed.
- [ ] `ban_radial` and `ban_ledger` render from the same content object as `ban_editorial`.
- [ ] METRIC_CHARTS lists the directions per metric as above; the switcher shows only the valid
      ones (CAGR: 3; TAM/MCON: 2) and defaults to the first entry.
- [ ] Switching direction re-renders in place (JS view-swap), no parameter/navigation.
- [ ] All three directions hold at the validation size, a larger same-aspect container, a
      wide/short strip and a narrow/tall column (Task 020 rules) — no overlap, content-sized
      cells, capped measure, ≥1 pink accent.
- [ ] CAGR (and other point-in-time metrics) show NO granularity toggle.
- [ ] Card title and inline title use one canonical `INDICATOR_DISPLAY_NAMES` name.
- [ ] The logic pill reads "High growth" (spacing fixed).
- [ ] Harness extended for the switcher (valid-set per metric) and passing.

Constraints (hard):
- Tokens only; Hero is the only size override and is constant per chart; no type size from
  container size/aspect. No `??` / `?.`; single file; size from offsetWidth/offsetHeight.
- Apply ONLY the verbatim Spec edits named here; any other spec/architecture change → stop,
  kick back to chat. Do not invent tam/mcon bands or units; do not offer radial without bands.

Verify by:
- Run the extended harness. Manual at multiple sizes/aspects: switch CAGR through all three
  directions and TAM/MCON through their two; confirm no granularity toggle on point-in-time
  metrics, single title, pill spacing, and Task 020 size/aspect behaviour per direction.

On uncertainty:
- Stop, record finding (API → TABLEAU_API_REALITY; design/data → chat). Do not guess.

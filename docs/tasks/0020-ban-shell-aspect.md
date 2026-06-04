# Task: 020 — Ban shell: fluid layout & aspect robustness

Goal: Make the Headline ban shell hold its layout at aspect extremes — specifically the
      wide/short in-situ container — with no text collision, capped measure, and a coherent
      hero+text lockup.
Why:  In situ on a wide/short strip the shell breaks: stacked text overlaps, the hero
      detaches from its text across a dead gap, and the verdict/reading run the full width.
      It was only validated at 1421×773. (Defect from Task 019 render.)

Read first: CLAUDE.md, STYLE_SPEC § Headline / ban shell (incl. the new Fluid-layout block),
            STYLE_SPEC § "fixed type, fluid layout" principle.
            Visual reference (throwaway): chat prototype `ban_shell_width_fix.html` (band-less
            MCON at ~1500×340). The STYLE_SPEC section is authoritative, not the prototype.

In scope:
- Rebuild the ban-shell layout (all three headline indicators; both band and band-less) so it
  is governed for aspect, per the Spec edit below.
- Stack all text (title, subline, definition, verdict, reading, disclaimer) in normal flow with
  explicit 4px-grid margins — remove any absolute positioning that can collide.
- Hero + text as one bounded, centred lockup; cap the text measure (~60ch reading); surplus
  container width is balanced margin, not a one-sided void.
- Crowding priority at short height: optional text yields disclaimer → reading before the
  too-small state; hero + title + verdict are never dropped; type never compresses.
- Confirm the band metric (CAGR) layout also holds at the wide/short aspect (the rail must not
  strand or overlap either).

Out of scope (do not touch):
- The copy itself, the content model, the pink/gutter/brand rules (Task 019 — unchanged).
- The MCON = HHI data-contract question and its disclaimer wording (data track — see Note).
- Directions 2/3, the TAM funnel.

Spec edit (apply verbatim to STYLE_SPEC.md, § Headline / ban shell, as a new sub-block at the
end of that section):
"**Fluid layout & aspect robustness (fixed type, fluid layout).** Type never changes with the
container — only layout flexes.
- Hero + text are one coherent lockup, never detached islands with a dead gap. Bounded
  max-width, centred in the card; surplus width becomes balanced margin, never a one-sided void.
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
  larger, a wide/short strip, and a narrow/tall column. All go in the harness/manual checklist."

Acceptance criteria (all must hold):
- [ ] Spec edit appears verbatim at the stated location; no other doc lines changed.
- [ ] At a wide/short container (e.g. the in-situ aspect) no two text elements overlap, for all
      three indicators, band and band-less.
- [ ] Hero and text read as one lockup (no dead centre gap); surplus width is balanced margin.
- [ ] Verdict and reading measure is capped (~60ch), not full container width.
- [ ] At a height too short to fit everything, disclaimer then reading yield; hero + title +
      verdict remain; type unchanged; below the floor, the too-small state shows.
- [ ] At a larger container of the validation aspect (e.g. 1500×800), band cells stay
      content-sized (not stretched full-height) and the whole composition is centred — no
      stranded top-cluster + bottom void.
- [ ] Harness extended with a wide/short and a narrow/tall aspect case and passing the
      no-overlap + capped-measure + guaranteed-pink checks at those aspects.

Constraints (hard):
- Tokens only; fixed type — NO type size driven by container width/height/aspect (that is the
  banned geometry-driven sizing). Hero remains the only size override and is constant per chart.
- No `??` / `?.`; single file; size from offsetWidth/offsetHeight, never vw/vh.
- Apply ONLY the verbatim Spec edit named here; any other spec change → stop, kick back to chat.

Verify by:
- Run the extended harness. Manual: render each indicator at ~1500×340 (wide/short) and a
  narrow/tall box; confirm no overlap, capped measure, coherent centred lockup, pink present.

On uncertainty:
- Stop, record finding (API → TABLEAU_API_REALITY; design/data → chat). Do not guess.

Note (data track — do NOT act on in this work order):
- The in-situ MCON render asserts the scale is HHI and carries a disclaimer about "bands follow
  US merger guidelines (2023)", yet renders no bands. Two things to resolve in chat/data track:
  (1) confirm MCON actually IS HHI in the source — if confirmed, HHI has a real, sourced band
  scheme (not invented), so MCON could move from band-less to a band metric; (2) until then, a
  disclaimer referencing bands must not appear on a band-less render.

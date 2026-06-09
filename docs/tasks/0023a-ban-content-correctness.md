# Task: 023 — Ban surface content correctness (MCON unit, dangling disclaimer, double title)

Goal: Stop the Market Concentration data-contract problems leaking into the UI, and fix the
      duplicate metric title across the ban surface.
Why:  In situ, MCON shows a wrong `(%)` unit, a bare `2002` that reads as a calendar year, and a
      "bands follow US merger guidelines" disclaimer on a band-less render with no bands. The
      card title and inline title also disagree.

Read first: CLAUDE.md, CHART_SPEC § Table data shape + § Data sanity checklist + § Open items,
            STYLE_SPEC § Copy & interim text, the INDICATOR_DISPLAY_NAMES / INDICATOR_UNITS objects.

In scope:
- **MCON unit:** remove `(%)`. MCON is a concentration index, not a percentage. Use the correct
  unit/label from INDICATOR_UNITS (e.g. `index` / `HHI` per the data-track confirmation below).
- **MCON figure legibility:** `2002` must not read as a year — show its unit/label with the
  figure (e.g. a suffix or label) so it reads as a concentration index, not a date.
- **Dangling disclaimer:** band-referencing copy (the "bands follow…" disclaimer) must NOT
  render on a band-less layout. A disclaimer only appears where the bands it describes are shown.
- **Single canonical name:** one name per metric from INDICATOR_DISPLAY_NAMES; card title and
  any inline title match (the `…(CAGR) (%)` vs `…(CAGR)` and the MCON equivalents must reconcile).

Out of scope:
- The fill-the-container work (Task 022); the TAM funnel; inventing a band scheme.
- Confirming whether MCON *is* HHI — that's the data-track item below; this work order only stops
  the wrong unit / dangling disclaimer and fixes the title. If HHI is later confirmed, MCON gains
  real bands via a follow-up (and Radial returns), which is NOT this work order.

Spec edit (apply verbatim):

— STYLE_SPEC.md, § Copy & interim text, ADD a bullet:
"- A disclaimer or note that describes a specific element (e.g. "bands follow…") renders ONLY
  where that element is present. Band-referencing copy never appears on a band-less layout."

— CHART_SPEC.md, § Open items, REPLACE the existing tam/mcon bullet with:
"- `tam` unit/scale and `mcon` unit/scale are unconfirmed. `mcon` must NOT display as `%`; it is
  a concentration index — confirm whether it is HHI. If HHI is confirmed, `mcon` gains the
  standard merger-guideline concentration bands (a real, sourced scheme — verify current
  thresholds) and moves to a band metric (Radial returns); until confirmed it stays band-less
  with no band-referencing copy. `tam`: data `14.4`, Figma `$12.4B` was placeholder. SAM/SOM
  absent → TAM funnel blocked."

Acceptance criteria (all must hold):
- [ ] Both Spec edits appear verbatim; no other doc lines changed.
- [ ] MCON title shows no `(%)`; the unit/label comes from INDICATOR_UNITS.
- [ ] The MCON figure renders with a unit/label so `2002` cannot be read as a year.
- [ ] No band-referencing disclaimer appears on any band-less render (MCON, TAM).
- [ ] Card title and inline title use one INDICATOR_DISPLAY_NAMES value per metric, across all
      three directions.
- [ ] Harness: a check that no band-referencing copy appears when bands == none; title-source
      single-name check.

Constraints (hard):
- Tokens only; no `??`/`?.`; single file; size from offsetWidth/offsetHeight.
- Do NOT assert MCON is HHI in code beyond the unit label already required; the HHI confirmation
  and any band scheme are data-track / a future work order. Apply ONLY the verbatim Spec edits.

Verify by:
- Run the harness. Manual: MCON in both Editorial and Ledger shows correct unit, legible figure,
  no dangling disclaimer; titles match.

On uncertainty:
- Stop, record finding, kick back to chat. Do not invent the unit label — if INDICATOR_UNITS has
  no MCON entry, kick back rather than guessing `%` or `HHI`.

# Task: 00NN — Band-less Editorial ban: pin to a clamped grid

Goal: Make the band-less Editorial ban layout (`tam`, `mcon`) a two-column grid that
      tiles the card, so the hero can't strand in a corner or overflow the text rail.
Why:  Teardown of the live MCON ban — the EDITORIAL number floated bottom-left with a
      centre void, and a fixed-size hero overflowed its track into the rail. The spec
      left this layout as "exact split build-and-review", i.e. undefined.

Read first: CLAUDE.md, STYLE_SPEC § "Headline / ban shell" + § "Type roles",
            CHART_SPEC § "Data-shape classes" (Headline) + BAN context cells

In scope:
- The band-less Editorial direction of the ban shell (`tam`, `mcon`).
Out of scope (do not touch):
- Ledger and Radial directions; the band-metric Editorial (3×3); the scorecard table.
- mcon HHI-bands / Radial enablement (still gated — see Open items).
- Any change to hero value formatting (stays per INDICATOR_DECIMALS — see Open items).

Spec edit (apply verbatim to STYLE_SPEC.md):
In § "Headline / ban shell — Editorial · Radial · Ledger", REPLACE the paragraph:

  **Editorial — band-less (`tam`,`mcon`)**: no band column; hero + verdict + reading fill the card
  (hero dominant); no band cells, no ranges-disclaimer. Exact split build-and-review.

WITH:

  **Editorial — band-less (`tam`,`mcon`)** — a **two-column grid that tiles the card full
  height**, never free placement (no number stranded in a corner with a centre void — the
  failure this rule fixes). Tracks `minmax(0, 5fr)` | `minmax(0, 7fr)`; the `minmax(0, …)`
  clamp is what lets the fit-to-box hero scale to its track instead of overflowing into the
  rail. **Left track = hero**, vertically centred in its track: the fit-to-box number with the
  short pink rule **beneath** it (per the shared pink-accent rule). **Right track = text rail**,
  vertically centred: **definition → verdict → reading**, each in its existing role/colour
  (definition & reading = Label; verdict = 24px Baskerville italic), separated by the `section`
  gap. No band cells, no ranges-disclaimer (band-less). **Locked:** grid-tiles-full-height,
  the `minmax(0,…)` track clamp, fit-to-box hero, pink rule beneath the hero. **Build-and-review
  at 1421×773:** the 5/7 track ratio, the inter-track gap, and whether the hero is centred vs
  bottom-anchored in its track.

Acceptance criteria (all must hold):
- [ ] STYLE_SPEC contains the Spec edit verbatim at the stated location; no other lines changed.
- [ ] Band-less Editorial (`tam`, `mcon`) renders as a 2-column grid that fills the card full
      height — no free-placed/corner-stranded element, no centre void. Validate at 1421×773.
- [ ] Hero is fit-to-box (SVG `getBBox`→`viewBox` or equivalent), scales to its track, and does
      NOT overflow into the rail — verify in Editorial AND that the same hero fits its narrower
      Ledger track (regression guard for the overlap).
- [ ] Grid tracks use `minmax(0, …)` (no track blow-out from min-content).
- [ ] Exactly one `#e994a2` accent, placed as the short pink rule BENEATH the hero.
- [ ] Verdict = 24px Baskerville italic; definition + reading at the Label role; no off-role
      font sizes introduced (harness: type-size count holds at four roles + hero + locked
      ban-shell sizes).
- [ ] Hero value unchanged: per INDICATOR_DECIMALS, `mcon` = 0 decimals, NO thousands separator
      (renders `2002`, not `2,002`).
- [ ] Too-small / no-data states still hold for this direction.

Constraints (hard):
- Tokens only (STYLE_SPEC); no ES2020 (no `??` / `?.`); single file; size from
  offsetWidth/offsetHeight, never vw/vh.
- Apply ONLY the verbatim Spec edit above; make no other spec/architecture change — if one is
  needed, stop and kick back to chat.

Verify by:
- Run the harness (type-size count, single-accent, gutter/radius checks).
- Eye-check at 1421×773: the gridded Editorial fills the card; toggle to Ledger — the hero
  resizes to each track with no overlap into the rail.

On uncertainty:
- Stop, record the finding in TABLEAU_API_REALITY.md, kick back to chat. Do not guess.

---
## Decisions confirmed this session (no doc edit needed)
- **Pull-quote stays serif.** It IS the verdict — already locked as 24px Baskerville italic in
  STYLE_SPEC § ban shell. No new role; the prototype's 30px serif should drop to the locked 24px.
- **Pink rule beneath the hero** (Editorial), matching the existing shared pink-accent rule. The
  prototype showed it above the hero — corrected in the Spec edit above.

## Open items deliberately NOT in this work order
- **Hero reads as a year.** `2002` (spec-compliant: no separator) is visually a year. Whether to
  allow a thousands separator or a unit-forward treatment is a CHART_SPEC/INDICATOR_DECIMALS
  decision — do NOT add a separator under the current rule. Flagged for a separate call.
- **Definition placement in Ledger band-less.** STYLE_SPEC's Ledger band-less row lists
  hero | verdict | reading and doesn't place the definition sentence; reconcile on the copy track.
- **mcon HHI bands / Radial.** Still gated on confirming `mcon` = HHI (CHART_SPEC Open items).
  Until confirmed, mcon stays band-less and Radial is not offered for it.

# spec_021 — Fix BP editorial extension: transparent frame + de-duplicated header

**Type:** fix
**Branch:** `fix/bp-editorial-frame`
**Surface:** BP Diagnostic Tool (v2.2) → CAGR editorial card (Tableau dashboard extension)
**Source:** teardown of `1780861284796_image.png` (one-image heuristic review)

## Problem

The editorial extension paints an opaque near-black fill into its iframe instead of
rendering transparent, producing a hard black letterbox border and three stacked dark
rectangles (outer fill → starfield panel → inner card). The section title and the
close control are each duplicated between the chrome header and the inner card.

Inventory was otherwise healthy: 2 type families, 1 accent (status dot), disciplined
rules. The fixes are structural, not a restyle.

## Acceptance criteria (all must pass to ship)

- [ ] **A1** Extension root/iframe background is transparent — host dashboard shows
  through; no black letterbox margin on any edge.
- [ ] **A2** Card renders as a single surface — the separate darker inner-card fill is
  gone; one continuous background tone behind the content.
- [ ] **A3** "Compound Annual Growth Rate (CAGR)" appears exactly once in the rendered
  view.
- [ ] **A4** Exactly one close affordance, aligned to the header grid (no floating
  CLOSE box in the margin).
- [ ] **A5** Caption-role text (subtitle · footnote · ladder examples) renders at a
  single size.
- [ ] **A6** No visual regression to the type/accent inventory: still 2 families, 1
  accent.

## Tasks

### Group A — Transparent frame (blocker → A1, A2)
1. Set the extension root + iframe background to transparent; remove the opaque dark
   fill that spans the iframe.
2. Collapse the nesting to one editorial surface: keep the starfield as *the*
   background, drop the separate darker inner-card fill (or invert — one of the two,
   not both).

### Group B — De-duplicate the header (major → A3)
3. Pick the title owner. Either the chrome header carries the title and the inner card
   keeps only the "CAGR · % · Global coffee market" subtitle, or the inner card owns
   the full lockup and the chrome shows only breadcrumb + toggle + close. Remove the
   other instance.

### Group C — One close control (major → A4)
4. Remove the floating white CLOSE box; keep the chrome X (or vice-versa), single
   control only, snapped to a header line rather than floating in the margin.

### Group D — Caption role (minor → A5)
5. Snap subtitle, footnote, and ladder "e.g." examples to one shared caption size.

### Group E — Grid the left zone (optional, minor)
6. Anchor hero numeral + pull-quote + body to the same column lines the ladder uses so
   the left half stops floating. Skip if out of scope for this pass.

## Verify by

Harness checks to add so these don't recur:
- `root-bg-transparent` — assert root/iframe background alpha = 0 (→ A1)
- `single-title` — assert the CAGR title string renders exactly once (→ A3)
- `single-close` — assert exactly one close control in the DOM (→ A4)
- `caption-size-count` — assert caption role resolves to one computed size (→ A5)
- `inventory-guard` — assert ≤2 type families and 1 accent hue (→ A6)

Eye-judgement (this skill, re-run teardown on a fresh screenshot): no black letterbox;
one continuous surface; title and close each appear once.

## Notes

- Exact px/hex/gutter values were NOT asserted from the screenshot — push them to the
  harness/spec rather than hard-coding from the image.
- Group A is the blocker; A–C are required for ship, D–E are nice-to-have and can be
  dropped without blocking.

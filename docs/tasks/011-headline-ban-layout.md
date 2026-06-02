# Task: 011 — Headline (ban) view: layout balance + chrome/colour fixes

Goal: Make the headline/ban view read as intended — focal number, calm context
      rail, clean header — by fixing the stranded BAN, uneven benchmark cards,
      stray breadcrumb token, off-role title face, and the market-level hero colour.
Why:  Teardown (2026-06-02, CAGR ban) flagged Tier 1–3 "way off" layout issues plus
      two role/colour deviations on the Headline-class surface.

Read first: CLAUDE.md, CHART_SPEC §Data-shape classes (Headline→`ban`) + §Global rules,
            STYLE_SPEC §Type roles + §Detail page header/Vertical layout + §Colour,
            TABLEAU_API_REALITY §Gotchas/quirks.

Applies to: the Headline-class ban view shared by `tam`, `cagr`, `mcon`. Validate on
`cagr` (= 1.9%, `coffee_general`) at the 1421×773 container.

In scope:
- The ban chart layout (focal number position/weight, empty-space balance).
- The right-hand benchmark/context card rail (equal height, padding, hierarchy).
- The chart-view breadcrumb / header text.
- The ban title face and the ban hero colour for Headline-class metrics.

Out of scope (do not touch):
- The scorecard table; other chart classes; any data/membership wiring.
- The native Tableau CLOSE control (see Spec edit 3 — it is host chrome, not ours).

---

## Spec edits (apply verbatim; the repo doc is the source of truth)

**Spec edit 1 — STYLE_SPEC.md → "Type roles" section.**
Insert as a new bullet immediately AFTER the existing
`- **Hero is the only sanctioned size override.** ...` bullet:

```
- **A chart-view title uses the Heading role (Tableau Light), never Baskerville.**
  Baskerville italic is hero numerals only; an indicator name shown as a chart
  title is a Heading, not a hero. If 16px reads with too little title contrast at
  1421×773, bump Heading to 18 per the Heading note — do not switch the face.
```

**Spec edit 2 — CHART_SPEC.md → "Global rules (every chart)" section.**
Insert as a new bullet immediately AFTER the existing
`- The **client/primary brand** is always drawn in `selectedColor` ...` bullet:

```
- **Headline-class bans are market-level, not brand.** `tam`, `cagr`, `mcon` are
  single `coffee_general` figures with no brand in frame — the hero number is drawn
  **neutral** (`#ededed`), not the client pink. `#e994a2` marks the client *brand*;
  a market figure has no brand to mark. Reserve the hero pink for a ban that
  represents the client brand specifically (e.g. a per-brand Likert ban).
```

**Spec edit 3 — TABLEAU_API_REALITY.md → "Gotchas / quirks" table.**
Insert as a new row at the end of that table:

```
| Native CLOSE / object control appears on the extension object | This is native Tableau chrome (the dashboard floating-object / extension close control), **not** extension-rendered. The Extensions API exposes no host-chrome styling — you cannot restyle, recolour, or hide it from extension code. Expected; do not flag it as an extension bug. | `[observed]` 2026-06-02 teardown |
```

---

## Acceptance criteria (definition of done — all must hold)

- [ ] STYLE_SPEC.md, CHART_SPEC.md, TABLEAU_API_REALITY.md each contain their Spec
      edit verbatim at the stated insertion point; no other lines changed.
- [ ] **Focal number:** the BAN is the visually dominant element — centred/weighted
      per a documented rule, not stranded in a corner with the majority of the
      canvas empty. Size from the hero override only; no geometry-derived font size.
- [ ] **Title face:** the title renders in the Heading role (Tableau Light), not
      Baskerville italic. (Build-and-review the 16-vs-18 size at 1421×773.)
- [ ] **Hero colour:** on `tam`/`cagr`/`mcon` the hero number is `#ededed`, not
      `#e994a2`. (Build-and-review — confirm with client on first render.)
- [ ] **Context rail:** the three benchmark cards are equal height with consistent
      internal padding on the 4px grid (named overrides only); content aligned by
      one rule, no uneven stretch. The rail reads as clearly secondary to the BAN.
- [ ] **Bands respect the caption:** no band is marked pass/fail (the caption
      disclaims a benchmark). The value→band connection is NOT implied. (A subtle
      position marker is a separate chat decision — do not add it here.)
- [ ] **Breadcrumb:** renders the resolved subgroup display name only — no stray
      `hp` token or raw id fragment. (See data-track note below.)
- [ ] Caption + "e.g." example lines meet WCAG AA against the dark fill (harness).
- [ ] Too-small / no-data states still honoured for the ban (CHART_SPEC §Global).

## Constraints (hard)
- Tokens only (STYLE_SPEC); no `font-size` outside the four roles + the sanctioned
  hero override; no font size computed from geometry.
- No gap/margin off the 4px base unit except the named overrides.
- No ES2020 (`??` / `?.`); single HTML file; size from `offsetWidth`/`offsetHeight`,
  never `vw`/`vh`.
- Apply ONLY the three verbatim Spec edits above; make no other spec/architecture
  change — if one is needed, stop and kick back to chat.

## Verify by
- Harness: equal card heights; padding/gaps on the 4px grid; no geometry-driven font
  sizes; type sizes identical per role across charts; WCAG AA on caption/example text.
- Eye re-check (teardown skill) on the next 1421×773 screenshot for the Tier 1–3
  items: focal BAN, calm equal-height rail, clean breadcrumb, Heading-role title,
  neutral hero colour.

## Data-track note (separate from the visual loop — CHART_SPEC §Data sanity checklist)
- Is `hp` the Growth subgroup's `subcategory_id` leaking into the breadcrumb display,
  or a stray fragment? Confirm the breadcrumb sources `subcategory_name` (display),
  not the id, for the current subgroup. Record the finding; do not guess the fix.

## On uncertainty
- Stop, record the finding in TABLEAU_API_REALITY.md, kick back to chat. Do not guess.
- The two confirm-on-render items (title size 16/18; neutral vs pink hero) are
  build-and-review, not blockers — implement the spec'd default and surface them in
  the report for the first-render review.

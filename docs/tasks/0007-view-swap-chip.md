# Task: 0007 — view-swap chip (OPEN DATA / CLOSE DATA) + header-less expanded view

Goal: Make the table↔chart drill-down read as **one control in two states**, and strip the
      scorecard header from the expanded single-indicator view.
Why:  Open/Close currently feel like two unrelated affordances (chart-glyph vs left-arrow),
      and the scorecard header is stale chrome in a single-metric view.
      (STYLE_SPEC → Scorecard table → Affordances.)

Read first: CLAUDE.md, STYLE_SPEC §Scorecard table (Affordances + the new Expanded view),
            CHART_SPEC §Table data shape, TABLEAU_API_REALITY §Confirmed NOT possible
            (no navigation) + §Version & library-loading (webfont/iframe).

## In scope
- Replace the Open/Close affordance with the one-component **view-swap chip** (Spec edit 1).
- Drop the scorecard header row in the **expanded** view; render indicator name + `+source`
  + Close chip + chart only (Spec edit 2).

## Out of scope (do not touch)
- The header row in the **table** view; cell fills; RAG; column order; commentary box.
- The `switchToChart` / `switchToTable` swap mechanism itself — reuse as-is (no new
  parameter, no navigation; this is an in-place JS view swap).

---

## Spec edits (apply verbatim to STYLE_SPEC.md)

### Spec edit 1 — replace the Affordances block
In `STYLE_SPEC.md`, section **## Scorecard table (locked from prototype review …)**,
find the **Affordances** block and replace its two bullets — i.e. replace this exact text:

```
**Affordances** (the in-extension view-swap — no Tableau navigation)
- To chart: a **chart-view icon** (bar/line-chart glyph) 17px + label **"View chart"**,
  inside the label column, right-aligned. (Replaces the old `circle-arrow-down` / "Jump to".)
- Back from chart: a **back icon** (left-arrow / "back to table" glyph) 17px + matching
  label, same 11px `#888` treatment, mirroring "View chart". Returns to the table view.
```

with:

```
**Affordances** (the in-extension view-swap — no Tableau navigation). OPEN DATA and CLOSE
DATA are **one component in two states** (the "view-swap chip"), not two affordances — same
type, padding, radius, hover; only the glyph and word change. They read as one control
inverting in place, matching the JS `switchToChart` / `switchToTable` swap (nothing navigates).
- **Icon = a true mirror pair**, Material Symbols `open_in_full` (open) ↔ `close_fullscreen`
  (close), 17px. Implement as **inline SVG paths** (no icon-font dependency; single file).
  Replaces the old chart-glyph / left-arrow mix — two unrelated glyphs read as separate
  buttons; one concept inverted reads as a pair. (Inline SVG also sidesteps the pending
  Cloud webfont safe-list question in TABLEAU_API_REALITY.)
- **Label = action + object, uppercase:** `OPEN DATA` / `CLOSE DATA` — Tableau Light, 11px,
  ~0.06em tracking. "Data" (not "chart") because a drill-down may be a BAN, scale, treemap or
  share chart, not always a chart; it names the detail behind the score, content-agnostic
  across all forms, and matches the reference "DATA VIEW" language.
- **Rest:** text `#888`, no fill, 0.5px transparent border. **Hover/focus:** a light pill —
  fill `#ededed`, text `#141414` (WCAG AA), padding 4/8px, radius 8px (reuses cell radius).
  The pill is the only hover chrome.
- **Anchor:** OPEN DATA is right-aligned in the label cell; CLOSE DATA is right-aligned at the
  top of the expanded view — the chip inverts roughly **in place**, it does not move to a new
  region.
```

### Spec edit 2 — new subsection (expanded view drops the header)
In `STYLE_SPEC.md`, **## Scorecard table**, insert the following **immediately after the
Affordances block and before the `**Layout**` block**:

```
**Expanded (single-indicator) view.** When a row's chip opens, the view swaps in place to
that one indicator's chart and the **scorecard header row is not rendered** (no wordmark, no
per-brand overall scores) — it is stale chrome for a single-metric view, and the layout is a
fixed zone, not a scroll surface, so there is no scroll-to alternative. The expanded view
shows only: the **indicator name** (14px `#ededed`) + its `+source` subtitle (11px `#777`)
top-left, the **CLOSE DATA chip** top-right, and the chart filling the remaining height.
Returns to the full table on close.
```

---

## Acceptance criteria (definition of done — all must hold)
- [ ] `STYLE_SPEC.md` contains **Spec edit 1** verbatim, replacing the old Affordances bullets at the stated location, no other lines changed.
- [ ] `STYLE_SPEC.md` contains **Spec edit 2** verbatim, inserted after Affordances and before `**Layout**`, no other lines changed.
- [ ] Open chip: `OPEN DATA` (uppercase) + `open_in_full` SVG, right-aligned in the label cell, rest `#888` / no fill.
- [ ] Close chip: `CLOSE DATA` (uppercase) + `close_fullscreen` SVG, right-aligned at the top of the expanded view.
- [ ] Hover/focus on either chip shows the `#ededed` pill with `#141414` text and no other hover chrome.
- [ ] Icons are **inline SVG** — no Material icon-font `<link>` or `@font-face` added.
- [ ] Expanded view renders **no** wordmark and **no** per-brand overall scores; shows indicator name + `+source` + CLOSE DATA + chart.
- [ ] Chip uses only token sizes (11px label / 17px icon), 4/8px padding, 8px radius — lint clean.
- [ ] Keyboard: both chips are focusable and activate on Enter/Space.

## Constraints (hard)
- Tokens only (STYLE_SPEC); no ES2020 (no `??` / `?.`); single file; size from `offsetWidth`/`offsetHeight`.
- No new font sizes or off-grid spacing; reuse the `#ededed` / `#141414` pair — do **not** add a palette entry.
- Apply ONLY the two verbatim Spec edits named here; make no other spec/architecture change — if one is needed, **stop and kick back to chat**.
- Verify any unconfirmed Tableau capability before building on it (TABLEAU_API_REALITY rules 3 & 6). Note: inline SVG needs no API capability; the no-navigation / in-place-swap path is already confirmed.

## Verify by
- Harness lint (font-size roles only; 4px grid + named overrides) passes.
- Visual check at `1421 × 773`: chip **rest**, chip **hover** (pill), and the full
  **table → expanded → table** swap, for both a **2-row** and a **6-row** subgroup
  (confirm OPEN DATA fits right-aligned at the narrowest label-column width in range, and the
  expanded view shows no header row).

## On uncertainty
- Stop, record the finding in `TABLEAU_API_REALITY.md`, kick back to chat. Do not guess.

## On completion (ship)
- When all acceptance criteria are green and the harness passes, bump `VERSION`
  (`'YYYY-MM-DD.N'`) and **ship per the `/ship` flow** (verify → commit → push → draft PR).
- Then mirror the updated `STYLE_SPEC.md` back to Claude.ai project knowledge.

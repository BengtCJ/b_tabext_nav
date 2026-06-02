# Task: NNNN — BAN detail screen: definition + greyscale context cells

> Set `NNNN` to the next number in `docs/tasks/` before committing.

Goal: Give the single-number (BAN) detail view a generic definition beneath the number and
an optional right rail of three **greyscale** context cells that ground it high/low, plus a
per-indicator decimals map — replacing the current bare number.
Why:  The bare BAN reads facile; it needs context that doesn't require per-value maintenance.
Decided in chat; durable rules captured in the Spec edits below.

Read first: CLAUDE.md, STYLE_SPEC (Faces, Spacing, Scorecard table, Colour),
CHART_SPEC (Data-shape classes, Invariants, Open items), TABLEAU_API_REALITY (no new API).

---

## In scope
- The BAN renderer for the Headline class (`tam`, `cagr`, `mcon` — `ban` only) and the
  Likert-snapshot indicators where `ban` is the chosen chart (`nps`, `bt`, `sop`, `dvtr`).
- New per-indicator config in `index.html`, placed with and named in the **same convention
  as** the existing `INDICATOR_DISPLAY_NAMES` / `INDICATOR_UNITS` siblings (confirm exact
  names/style in the file — do not invent a divergent convention):
  - `INDICATOR_DECIMALS` — integer decimal places.
  - `INDICATOR_DEFINITION` — generic per-indicator definition string.
  - a context-cell config — per-indicator cell type + cells + optional caveat + which cell is "active".
- The font-stack fix in WORKFLOW.md (Spec edit D) — it surfaced here.

## Out of scope (do not touch)
- `METRIC_CHARTS` / the data-shape classes — this is contextual chrome on the existing
  `ban`, NOT a new chart type. Do not re-map any metric.
- The Scorecard table surface and its RAG colouring (the BAN cells are greyscale; the
  Scorecard client-column RAG is unchanged).
- `tam` context cells — magnitude-only for now (no SAM/SOM data); render `tam` with the
  definition and no cells. Do not invent reference sizes.
- Any new Tableau API capability — this is JS rendering of already-carried data.

---

## Spec edit A — apply verbatim to STYLE_SPEC.md
Insert as a new section **immediately before** `## Enforcement (what the harness / lint checks)`:

```
## BAN detail screen (the headline / single-number view)
The in-extension view an indicator swaps to when its chosen chart is a BAN. Layout: a focal
number (main, left) with a generic definition beneath it, and an optional right rail of three
context cells that ground the number high/low. Reuses the Scorecard frame chrome — do not
re-derive.

**Focal number (Hero).** Baskerville italic — the locked
`'Baskerville','Libre Baskerville',Georgia,serif` stack, never the removed Baskervville —
colour `#e994a2`. The pink is the *focal* accent here even on market-level metrics that have
no client brand: a documented exception to the client-only rule, kept as one constant so
per-client theming stays additive. Size is the sanctioned per-chart Hero override. The
unit/suffix (`%`, `/5`, `$…B`) renders muted `#6f6f6f`, ~0.3em, italic.

**Decimals — `INDICATOR_DECIMALS` (single source of value precision).** Per-indicator integer
decimal places, applied to the **displayed** value (after any `INDICATOR_UNITS` conversion),
never the raw. No thousands separator. This map is the single source for value precision
across all surfaces; the Scorecard "Values to 1 decimal" rule defers to it. Values:
`mcon` 0 · `cagr` 1 · `tam` 1 · `nps`/`bt`/`sop`/`dvtr`/`ba` 1 · `svt`/`vom` 2.

**Definition.** A generic per-indicator sentence stating what the metric is — stable, never a
per-value reading, so it needs no maintenance as data refreshes. Tableau Light/Regular,
13–14px, `#a4a4a4`.

**Caveat (optional, per-indicator).** A generic italic note, 11–12px `#6f6f6f`, for indicators
whose benchmark needs qualifying (`cagr`: no absolute good/bad line; `mcon`: 2023 guidelines,
other vintages/jurisdictions differ). Omitted where unset.

**Context cells (right rail).** Three cells in the Scorecard frame: frame `#0d0d0d`, 1px
`#262626`, 2px gutter and padding, frame radius 10 = cell radius 8 + 2px gutter. Cells are
**greyscale only — never RAG on this surface**: default `#222222`, the cell the value lands in
lighter `#363636` ("active"), with a quiet grey marker note `#cfcfcf`. Cell type is
per-indicator:
- **Threshold standard** (`mcon`) — an external standard's bands, decisive. DOJ/FTC HHI bands
  (2023): `< 1500` unconcentrated · `1500–1800` moderate · `> 1800` highly concentrated.
- **Scale bands** (`nps`/`bt`/`sop`/`dvtr`) — the locked 1–5 thresholds `< 2` / `2–4` / `> 4`,
  rendered greyscale here (RAG belongs to the Scorecard table, not this surface), with a
  category-average grounding marker (`coffee_general`).
- **Illustrative ranges** (`cagr`) — no absolute standard, so the cells characterise the
  spectrum by example sector (low/declining · mature/steady · high-growth) with loose ranges;
  generic illustrative copy, not sourced data.
- **None** (`tam`) — magnitude-only; no cells until reference sizes are sourced.

Locked: frame chrome (reused), greyscale-only rule, decimals-via-map, generic-definition rule.
Build-and-review at 1421×773: exact number/definition sizes, cell proportions, the active grey.

**Enforcement adds (harness asserts):** BAN context cells contain no RAG colour (greyscale
only); value precision matches `INDICATOR_DECIMALS` with no thousands separator; the gutter is
the uniform 2px and frame radius = cell radius + gutter; the definition string contains no
interpolated value (it is generic).
```

## Spec edit B — apply verbatim to STYLE_SPEC.md
In the Scorecard table → **Numerals** bullet, replace the sentence:
`Values to 1 decimal (client `5.0/5`; comparator `5.0`).`
with:
`Value precision is set per indicator by `INDICATOR_DECIMALS` (see BAN detail screen) — the single source; Likert values resolve to 1 decimal there (client `5.0/5`; comparator `5.0`).`

## Spec edit C — apply verbatim to CHART_SPEC.md
Insert as a new section **immediately before** `## Open items to resolve (known data/spec mismatches)`:

```
## BAN context cells (the headline / single-number view)
The BAN renderer may show three greyscale context cells grounding the number high/low. This
is contextual chrome on the existing `ban` — **not a new chart type**; `METRIC_CHARTS` and the
data-shape classes are unchanged. Styling lives in `STYLE_SPEC → BAN detail screen`.
Per-indicator membership:

| Indicator | Cell type | Cells / source |
|---|---|---|
| `mcon` | threshold standard | DOJ/FTC HHI bands (2023): <1500 / 1500–1800 / >1800. `[docs]` current US merger guidelines, Dec 2023 |
| `nps` `bt` `sop` `dvtr` | scale bands (greyscale) | locked 1–5 thresholds <2 / 2–4 / >4; grounding = `coffee_general` category mean |
| `cagr` | illustrative ranges | example sectors (low/declining · mature · high-growth); generic illustrative copy, NOT sourced |
| `tam` | none (magnitude-only) | no cells until SAM/SOM or comparator market sizes are sourced |

Invariant carried: `nps` here is a **Likert mean, not true NPS** (`guardNpsRecalculated`) — the
definition string must say so; cells are greyscale scale-bands, never RAG.
```

Also append two bullets to **## Open items to resolve**:
```
- BAN context data: `cagr` cells are illustrative generic copy (accepted interim); `tam` has
  no context cells until reference market sizes are sourced — do not invent either.
- Verify `mcon`/`cagr`/`tam` display units against `INDICATOR_UNITS` before rendering: `mcon`
  is an integer HHI (2002, not a 0.2002 decimal), `cagr` is `%`, `tam` is `$B`. The HHI band
  thresholds assume the integer scale.
```

## Spec edit D — apply verbatim to WORKFLOW.md
Two occurrences of the removed font name; correct both:
- `Baskervville italic was already locked` → `Baskerville / Libre Baskerville italic was already locked`
- `(Baskervville numerals,` → `(Baskerville numerals,`

---

## Acceptance criteria (all must hold)
- [ ] STYLE_SPEC, CHART_SPEC, WORKFLOW contain Spec edits A–D verbatim at the stated points; no other doc lines changed.
- [ ] BAN view renders: focal number (`#e994a2`, Baskerville/Libre Baskerville italic), generic definition beneath, optional caveat, optional 3-cell right rail.
- [ ] Value precision comes from `INDICATOR_DECIMALS` (displayed value, no thousands separator): `mcon`→`2002`, `cagr`→`1.9%`, `tam`→`$14.4B`, `nps`→`3.2/5`.
- [ ] Context cells are greyscale only — no red/amber/green anywhere on the BAN surface; the value's cell is the lighter `#363636` with a grey marker.
- [ ] `mcon` cells are the 2023 HHI bands; `nps`/`bt`/`sop`/`dvtr` cells are the 1–5 scale bands greyscale with `coffee_general` grounding; `cagr` cells are illustrative sector ranges; `tam` shows no cells.
- [ ] `nps` definition states it is a Likert mean, not true NPS.
- [ ] Gutter is the uniform 2px; frame radius = cell radius + gutter; definition contains no interpolated value.
- [ ] Font: loads Libre Baskerville and uses the locked stack — the removed `Baskervville` appears nowhere; digits render as uniform lining figures.

## Constraints (hard)
- Tokens only (STYLE_SPEC); no ES2020 (`||` not `??`, ternary/`&&` not `?.`); single `index.html`; size from `offsetWidth`/`offsetHeight`, never `vw`/`vh`.
- New config named in the existing `INDICATOR_*` sibling convention; read exact names/placement from `index.html` — do not hardcode from memory.
- No `METRIC_CHARTS` / class remap; no new Tableau API capability (rendering only, data already carried).
- Apply ONLY Spec edits A–D; make no other spec/architecture change. If one is needed, stop and kick back to chat.

## Verify by
- Run the harness (greyscale-on-BAN, decimals-from-map, gutter/radius-nest, generic-definition asserts).
- Open the live URL with `?chart=mcon`, `?chart=cagr`, `?chart=nps` against sample data; eyeball the four acceptance rows above at 1421×773.

## On uncertainty
- Stop, record the finding in TABLEAU_API_REALITY.md, kick back to chat. Do not guess —
  especially on units (`mcon` integer vs decimal) and the config naming convention.

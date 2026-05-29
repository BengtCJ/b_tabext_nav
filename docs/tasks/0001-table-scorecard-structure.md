# Task: 0001 — Indicator table → scorecard matrix (structure & data)

Goal: Turn the indicator-list table into the Figma scorecard matrix — indicator rows ×
brand columns of /5 scores, RAG on the client column — fed by a new scores worksheet,
with the drill-down preserved. **No aggregate/subgroup header score row for now** — the
header carries brand names only; only the indicators are scored.
Why:  Match the Figma "Opportunity Pathway" layout functionally. Pixel/type fidelity is
deferred to WO-2, which is gated on STYLE_SPEC being filled.

Read first: CLAUDE.md, TABLEAU_API_REALITY §"Confirmed working" + rule 6, CHART_SPEC
(table data shape), STYLE_SPEC (type roles — note: sizes still pending; see Out of scope).

## Context (current code — do not re-derive)
- `renderTable(indicators, onIndicatorSelected, onBack)` (≈line 1821) renders full-width
  `.ind-row` bands of `{id, name, source}` with a circled-arrow labelled **"View"**.
  No brand columns. Renders into `#table-view`.
- `name`/`source` already come from the worksheet (`CONFIG.nameField` = "Display Name",
  `CONFIG.sourceField` = "Source").
- Orchestrator: `switchToTable()` (≈2890) builds the indicator list for the resolved
  subgroup and calls `renderTable(list, switchToChart, null)`; `switchToChart(id)` (≈2915)
  flips `_view` to 'chart' and renders that indicator's default chart from the **existing
  raw worksheet**. Subgroup resolves from `dashboard.name` via `resolveSubgroup()`.
- `DEFAULTS`/`CONFIG` (≈2396): one `worksheet` today. Fields: indicatorIdField, nameField,
  sourceField, subcategoryIdField, brandField ("Brand Name Upper"), valueField, etc.

## In scope
- **Second worksheet.** Add `scoreWorksheet` and `scoreField` to DEFAULTS, the settings
  dialog (`renderConfigDialog`), and save handler. The scores sheet reuses the same
  column names as the raw sheet for brand / indicator_id / Display Name / Source /
  subcategory_id, plus the `scoreField` measure — so no new field configs beyond those two.
- **Verify the read in isolation FIRST** (TABLEAU_API_REALITY rule 6): confirm
  `getSummaryDataAsync` on `scoreWorksheet` returns rows before building the pivot on it.
  If it doesn't, stop and record the finding — do not build the matrix blind.
- **Build the matrix model** from the scores sheet:
  - Read **metric-level rows only** (`level = metric`); ignore subgroup- and group-level rows.
  - Filter to the resolved subgroup by `subcategory_id` (same normalise: trim+lowercase).
  - Drop `category_id === 'coffee_general'` and NaN/empty scores.
  - Pivot long→wide into:
    `{ brands:[orderedKeys], rows:[{id,name,source,scores:{brandKey:score}}] }`
  - No `header`/`overall` aggregate — the header row shows brand names only.
  - Brand column order: **client first**, then the rest in a fixed order. Client brand =
    `_clientBrand` (already resolved); default competitor order Nespresso, Starbucks,
    Peet's, Lavazza.
- **Extend `renderTable`** to take the model and render a grid: a header row (left label
  cell + one cell per brand showing the brand display name, **no score**), then one row
  per indicator (left cell = name + source + arrow/"Jump to"; one score cell per brand).
  Keep `onIndicatorSelected(id)` firing on the indicator row (preserves drill-down).
- **"View" → "Jump to"** label.
- **Brand display map (locked).** Column headers use title-case display names, table
  header only — charts keep uppercase brand labels. Map (keyed off the brand value):
  `ILLY → Illycaffè`, `NESPRESSO → Nespresso`, `STARBUCKS → Starbucks`,
  `PEETS → Peet's Coffee`, `LAVAZZA → Lavazza`. (Note the accent and apostrophe.)
- **RAG logic, client column only:** score > 4 → `--rag-green`; score < 2 → `--rag-red`;
  else `--rag-amber`. Competitor scores stay neutral. Use CSS variables; if a var is
  undefined, that is a STYLE_SPEC gap — fall back to the neutral text colour and note it,
  do not invent a hex.
- **Missing score** for a brand/indicator → blank cell (not 0, not "—" unless STYLE_SPEC
  later says so).
- **Title + question block:** render a per-subgroup title and question above the matrix,
  from a map keyed by `subcategory_id`. Seed the one entry we have —
  `cmoaf → { title: "OPPORTUNITY PATHWAY", question: "Is there a clear market opportunity
  for Illy Coffee and a clear demand for the product/service?" }` — leave others empty.
- Sample-data path: add `SAMPLE_SCORES` (below) so the preview/`?subgroup=` flow renders
  the matrix with no Tableau.

## Out of scope (do not touch — these are WO-2 / other)
- Exact type sizes, faces, the title's display size, exact RAG/cell/client-red hexes,
  exact spacing. WO-1 reuses existing tokens/greys and existing role sizes only; it must
  NOT introduce new hardcoded font sizes. Pixel fidelity to the Figma is WO-2.
- Chart rendering and the raw worksheet read path — unchanged.
- Subgroup resolution precedence — unchanged.

## Docs to update in this commit (keep docs/code in sync)
- `STYLE_SPEC.md` — scope the brand-uppercase rule: chart labels stay uppercase; add a
  named override "Brand display map (table header): Illy → Illycaffè, Peets → Peet's
  Coffee (others unchanged), title case, table header only."
- `CLAUDE.md` — change "Brand names always uppercase + Tableau Light" to "Chart brand
  labels always uppercase + Tableau Light; the indicator-table header is the exception
  (title-case display map in STYLE_SPEC)."
- `CHART_SPEC.md` — table data shape: Opportunity Pathway = subgroup `cmoaf`; columns =
  brands client-first; **metric-level rows only, no aggregate/subgroup header score for now**;
  RAG on the client column only. (cmoaf metric membership pending confirmation against the
  full Snowflake table — see Sample data.)
- Bump `VERSION` (`'YYYY-MM-DD.N'`) before commit, per CLAUDE.md.

## Acceptance criteria (all must hold)
- [ ] Settings dialog exposes `scoreWorksheet` + `scoreField`; both persist via Settings API.
- [ ] On load, the second-worksheet read is confirmed before the pivot runs; failure logs
      a clear message and shows the empty state rather than throwing.
- [ ] Matrix renders: one header row (brand names only) + one row per subgroup indicator;
      columns = brands, client first.
- [ ] Body cells show per-indicator scores; the header carries no aggregate score.
- [ ] Client column scores are RAG-coloured by the >4 / <2 bands; competitor scores are not.
- [ ] Clicking an indicator row calls `switchToChart(id)` and renders that indicator's
      chart from the raw worksheet (drill-down unchanged); back returns to the matrix.
- [ ] `coffee_general` and NaN/empty scores are dropped; a missing score renders blank.
- [ ] Row arrow label reads "Jump to".
- [ ] Title + question render above the matrix for a subgroup that has a map entry.
- [ ] Preview mode (`?subgroup=cmoaf`) renders the full matrix from `SAMPLE_SCORES`.
- [ ] STYLE_SPEC / CLAUDE.md brand-uppercase rule scoped to charts; CHART_SPEC table shape
      recorded; `VERSION` bumped.

## Constraints (hard)
- No `??` / `?.` (pre-ES2020 embedded browser). Single `index.html`. Size from
  `offsetWidth`/`offsetHeight`, never vw/vh.
- Tokens only; introduce no new font-size literals (WO-2 owns sizing). No new abstractions.
- Verify the `scoreWorksheet` read before building on it (rule 6). Do not change specs or
  architecture — if one needs changing, stop and kick back to chat.

## Sample data (for offline verify — Opportunity Pathway)
Per the Snowflake source, `cmoaf` at metric level contains only **`svt`** (the four-indicator
Figma was a mock; `cagr`/`mcon`/`tam` are market-level headline numbers, not per-brand scores).
**Pending confirmation** of the full-table cmoaf metric list — if more metrics come back,
add them as rows here. No `overall` row (aggregate header dropped).
```
SAMPLE_SCORES = metric-level long rows
  {brand, indicator_id, name, source:'+snowflake', subcategory_id:'cmoaf', score}
svt "Search Volume and trends" (Q3 scores, the last populated quarter — svt Q4 is the
    unpopulated-pipeline gap and must NOT render as 5; see CHART_SPEC guardSvtZeros):
    Illy 1.25, Nespresso 0.00, Starbucks 0.13, Peets 1.70, Lavazza 5.00
```
(Under the >4/<2 rule the client (Illy) cell reads amber. Add a second sample metric only
if the cmoaf membership check returns one.)

## Verify by
- Open the live URL with `?subgroup=cmoaf`: matrix renders with a brand-name header row (no
  aggregate score), the indicator row(s) with per-brand scores, RAG only on the client
  column, "Jump to" labels, title+question above. Click a row → its chart; back → matrix.
- Console clean; no vw/vh; no new font-size literals introduced.

## On uncertainty
- Stop, record the finding in TABLEAU_API_REALITY.md, kick back to chat. Do not guess —
  in particular about the second-worksheet read or any colour/size not yet in a spec.

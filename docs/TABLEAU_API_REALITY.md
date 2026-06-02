# Tableau Extensions — Limitations & Workarounds

Single source of truth for what the Tableau Dashboard Extensions API **and the Tableau
product** actually allow in the BP extensions' real environment (Tableau Cloud +
Desktop authoring): the API facts, the product limitations that aren't in the API at
all (like selection styling), and the workaround for each. Every extension's
`CLAUDE.md` links here. The point is to stop each extension re-discovering — and
re-breaking on — the same limits.

---

## Governing rules (these are what make this doc trustworthy)

1. **Every entry is sourced.** Each fact is tagged with one of:
   - `[tested]` — confirmed by running it in Tableau (add date + which extension).
   - `[docs]` — from the official Extensions API reference (add URL + date checked).
   - `[observed]` — in active use in shipped extension code, so working in our setup,
     but not separately confirmed against docs.
   An unsourced claim is not an entry — it goes under **To verify**.

2. **Assumptions are not facts.** If it hasn't been tested or read in the docs,
   it lives in **To verify**, never in **Confirmed**.

3. **This doc overrides model priors.** Before using any API capability, check here.
   If it's not listed, verify against the current docs or test it — do **not** assume
   it works because it "should." This applies to Claude/Claude Code: the doc and the
   live docs win over anything the model believes.

4. **The deprecated / do-not-use list is binding.** Never reach for anything on it,
   regardless of how a tutorial or model suggests it.

5. **Lessons land here before the session ends.** Any new API fact learned in any
   extension is added here as part of the end-of-session ritual, with its source tag.

6. **Verify a capability before building a path on it.** If an approach depends on an
   API behaviour that isn't yet `[tested]` or `[docs]`-confirmed, confirm that one
   behaviour in isolation *first*, before designing the rest around it. Most dead ends
   below came from committing to a path whose foundation turned out not to exist. The
   recurring failure mode is **overstating the API** — assuming a capability is there
   because it seems like it should be.

Official references to verify `[docs]` entries against: the Extensions API docs at
tableau.github.io/extensions-api and the Tableau product help at help.tableau.com.
For questions the docs don't answer, the official channels are the DataDev Slack and
GitHub issues on `tableau/extensions-api`. Record the URL + date checked in each entry.

---

## Confirmed working

| Capability | Notes | Source |
|---|---|---|
| Read worksheet summary data (`getSummaryDataAsync`) | Used to build the indicator table and chart data. Calling it on **two different worksheets** in the same extension (main data + score worksheet) works — confirmed by `[scoreWorksheet probe] OK` in console. | `[observed]` — in use in index.html; `[tested]` 2026-05-31 b_tabext_nav |
| Read parameters + `currentValue` | `getParametersAsync()` is on the `Sheet` class (which `Dashboard` extends), **not** on `tableau.extensions.workbook`. Correct call: `await tableau.extensions.dashboardContent.dashboard.getParametersAsync()`. Each `Parameter` object has `.currentValue`. | `[tested]` 2026-06-01 b_tabext_nav |
| Listen to `ParameterChanged` events | After `getParametersAsync()`, call `parameter.addEventListener(tableau.TableauEventType.ParameterChanged, handler)` on each parameter object. Re-renders the table/chart on brand or other parameter change. | `[tested]` 2026-06-01 b_tabext_nav |
| Select / highlight marks (`selectMarksByValueAsync`) | Cross-worksheet highlight on brand click | `[observed]` |
| Settings API (`settings.set` / `saveAsync` / `getAll`) | Config persists in the `.twb` workbook | `[observed]` + relied on in architecture |
| `initializeAsync` with a `configure` callback | Powers the ⚙ settings dialog | `[observed]` |
| `dashboardContent.dashboard.name` | Returns the dashboard's **tab name** as a plain string (e.g. `"Growth"`). Confirmed working. **Caution:** tab names are human-readable, not necessarily subcategory_ids — identity mapping requires that the author names each tab with its subcategory_id, or a subgroupMap translates name → id. | `[tested]` 2026-05-29 b_tabext_nav |

## Confirmed NOT possible

| Attempted | Reality | Source |
|---|---|---|
| Programmatic navigation to another dashboard / sheet tab from an extension | No navigation API exists. The Extensions API exposes worksheets, filters, marks, parameters and data only — it can apply filters and read selected marks, but cannot move the user between dashboards. This is why the indicator drill-down was rebuilt **inside** the extension (table ↔ chart view swap) instead of jumping dashboards. | `[tested]` your finding + `[docs]` tableau.github.io/extensions-api (overview), 2026-05 |
| Treating "navigation" as one thing | Three mechanisms get conflated. (1) The **Navigation object** moves the user from one dashboard to another directly, with no data interaction. (2) The **Go to Sheet** action switches to a related sheet when the user selects a mark. (3) An **extension** is dashboard content and does neither. Decide which mechanism a requirement needs *before* writing anything: if the design must change dashboard, it is a Navigation object or Go to Sheet action, never extension code. | `[tested]` your finding + `[docs]` help.tableau.com "Actions and Dashboards", 2026-05 |

> Important distinction this doc must preserve: **setting parameters and selecting
> marks works; switching the active dashboard does not.** These get conflated and
> lead to wasted time designing navigation that can't exist.

**Native navigation = the Navigation object (Button).** Dashboard→dashboard navigation
is a native dashboard object: one click, styled as image or text, no marks, no actions,
no calculated fields — it replaces the old worksheet-action navigation workarounds (the
sheets-as-buttons + two actions each + filter override + true/false show/hide). **But it
carries no state** — it cannot set a parameter or tell the destination which button was
clicked, so the destination must already know its own identity. `[docs]`
help.tableau.com "Create a Dashboard", 2026-05.

## Recommended interaction patterns (drill-down without extension navigation)

Two sanctioned patterns. Both avoid extension-driven navigation (impossible) and the
selection-blue mess. Pick by whether you want **native overview nav** or **one detail
surface** — you can't have both, because a Navigation object passes no state.
**Current choice: Pattern A** (native overview), migrating toward B over time — see
Migration path below.

**Pattern A — native overview nav** (chosen; overview stays native Tableau):
- Overview = native Navigation-object cards (image/text), one per subgroup → each points
  to that subgroup's detail dashboard. (Three overview dashboards × four cards = twelve.)
- Each detail dashboard = the combined extension + a "back to overview" Navigation button.
- The extension self-identifies its subgroup by reading its host `dashboard.name` (the
  tab name) — so all twelve are the **same file and settings**; you just name each
  dashboard for its subgroup. Zero per-instance config.
- No parameters, no actions, no calc fields, no DZV, no blue.
- Trade: twelve detail dashboards exist — trivial, since each is one extension + a back
  button, distinguished only by name.

**Pattern B — single detail surface** (preferred when one extension must serve all 12):
- One dashboard. `overview_nav` extension sets `Source Dashboard` on click (extension
  sets it → no mark → no blue).
- DZV keyed to `Source Dashboard` swaps the cards zone for the detail-extension zone
  (two rules: empty → cards, set → detail).
- The combined extension reads `Source Dashboard` and re-renders on `ParameterChanged`
  (same mechanism as the brand parameter).
- Trade: the cards are an extension, not native Tableau.

Both patterns: the table→chart drill-down stays **inside** the combined extension as a
JS view-swap (`switchToChart` / `switchToTable`) — no parameter, no navigation, no
selection. The source worksheet should carry all subgroups' rows and filter in JS.

**Migration path (chosen direction).** Native overview now (Pattern A); over time the
extension absorbs more, eventually rendering the overview cards itself (Pattern B) so the
extension becomes the app. To keep that additive rather than a rewrite, resolve the
subgroup in **one function with a precedence**: explicit in-extension selection (future)
→ parameter (future) → `dashboard.name` (now). Today only the name path is live; adding
the others later is a new branch, not a rebuild. Carrying all subgroups' rows in the
source worksheet (above) also means the extension already holds the data to render the
overview when that day comes.

Depends only on: native Navigation object (A) or extension-set parameter + DZV (B) —
both confirmed working or already in use.

## Deprecated / do not use

| Item | Use instead | Source |
|---|---|---|
| _(none recorded yet — add deprecated endpoints here as you hit them, with what replaced them)_ | | |

## Version & library-loading notes

| Question | Status |
|---|---|
| Minimum Tableau version | Dashboard extensions are supported on Tableau Desktop / Server **2018.2+** and Tableau Cloud. (Viz extensions need 2024.2+ — not what we build.) `[docs]` tableau.com/developer, 2026-05 |
| How to load the Extensions API library reliably | **To verify in our setup.** Library is `tableau.extensions.n.n.n.js`. Inconsistency across repos: the original chart manifest referenced a **local** copy; the new `index.html` loads `tableau.extensions.1.latest.js` from a **jsDelivr CDN**. Standardise on one, and confirm a CDN load is allowed under the workbook's extension safe-list / network rules on Cloud. |
| External webfont loading (Google Fonts CDN) from an extension iframe | **Confirmed working in preview; inferred working in Tableau** from the fact that the Baskervville webfont (loaded from `fonts.googleapis.com` via a `<link>` tag in `index.html`) was successfully loaded and rendered in the extension for the duration of the project. Swapped to Libre Baskerville on the same CDN (same origin, same mechanism) — CDN fetch returned HTTP 200 and the font loaded in the preview iframe. Confirmed the font-availability model: extension iframes have access to host-OS installed fonts **plus** any fonts loaded via `@font-face` / `<link>` in the extension's own HTML. `[observed]` — Baskervville in active use; Libre Baskerville load confirmed 2026-05-31 b_tabext_nav. Full Tableau Cloud CDN safe-list confirmation still pending a live Tableau test. |
| `min-api-version` in the `.trex` | Old manifest declared `1.4`. Confirm the minimum that still supports the calls in use. `[docs]` needed. |

## Gotchas / quirks

| Quirk | Workaround | Source |
|---|---|---|
| `getSummaryDataAsync` only returns fields present in the worksheet view (rows/columns/marks shelves) — **not** all fields in the data source | A field must be on a shelf to appear in the result. Adding to Detail marks did not reliably surface new fields in testing; adding to Rows/Columns does. Consequence: `subcategory_name` was absent from the main data worksheet (which only exposes `Brand Name Upper`, `subcategory_id`, `indicator_id`, `Year`, `Quarter`, `SUM(Raw Value)`) but IS present in the score worksheet. Read each field from whichever worksheet exposes it. | `[tested]` 2026-05-31 b_tabext_nav |
| Embedded browser does not support ES2020+ | No `??` (use `||`), no `?.` (use `&&`/ternary). Lint for these. | `[tested]` — your code-style rule |
| `vw`/`vh` units break inside the extension iframe | Size from `offsetWidth` / `offsetHeight` only | `[tested]` — your rule |
| Removing the default blue mark-selection highlight / grey-out | **Not** a formatting toggle — there is no setting for it. Documented workarounds: **(a) Highlight-action trick** — add a calculated field that is the same constant for every row (e.g. `True` = `TRUE`) to the Detail shelf, then create a Highlight action targeting "Selected Fields" on that field; every mark shares the value, so selecting one highlights all and nothing greys out. **(b) Transparent-shape trick** for text/KPI marks — set the mark to a transparent custom shape so a click shows no blue box. **(c) Fit "Entire view"** on a text sheet so the selection outline falls outside the visible area. Our highlight comes from `selectMarksByValueAsync`, so (a) on the target worksheets is the relevant fix. | community-confirmed: thedataschool.co.uk, biztory.com, domoorewithdata.com — verify in our workbook |
| Data-reading methods silently fail without manifest permission | If the extension calls data methods (e.g. `getSummaryDataAsync`, underlying data) **without declaring full data permission in the `.trex` manifest**, the extension loads fine but those calls fail. Declare full data permission in the manifest. Classic "no error, just broken" dead end. | `[docs]` help.tableau.com "Manage Extensions in Tableau Cloud", 2026-05 |
| Extension can freeze on Tableau Desktop (Windows) | Reported: extensions freeze when navigating between sheets/dashboards, and consistently when **duplicating a dashboard** — and it affects *any* extension on the dashboard, not just ours. Watch for it during Desktop authoring; reloading recovers it. | `[docs]` github.com/tableau/extensions-api issue #377 |
| Navigation button seems dead in Desktop | In Tableau Desktop a plain click doesn't fire a Navigation button — Alt-click (Windows) / Option-click (Mac), or use Presentation mode. On Server / Cloud / Reader a normal click works. People think the button is broken otherwise. | `[docs]` help.tableau.com "Create a Dashboard", 2026-05 |
| "No data available" can be a downstream symptom, not a data fault | A thrown exception in a parameter/event listener (e.g. calling `getParametersAsync` on an undefined dashboard ref) aborts the render path, leaving the chart in its no-data state and — because the period controls are data-driven — hiding the granularity buttons too. Before assuming a worksheet/filter/data problem, check the console for an upstream listener throw. Listeners must reference the dashboard object captured in `initializeAsync`, and must no-op when there is no dashboard (`?chart=` fallback). | `[tested]` 2026-06-01 bp-nav-charts |
| `tableau.extensions.workbook` is NOT the object for `getParametersAsync` | `tableau.extensions.workbook` exists and returns a `Workbook` instance, but its only public method is `getAllDataSourcesAsync()`. `getParametersAsync` is on the `Sheet` class — call it on the `Dashboard`: `dashboard.getParametersAsync()`. Using `tableau.extensions.workbook.getParametersAsync()` throws `TypeError: getParametersAsync is not a function`. | `[tested]` 2026-06-01 b_tabext_nav |
| Native CLOSE / object control appears on the extension object | This is native Tableau chrome (the dashboard floating-object / extension close control), **not** extension-rendered. The Extensions API exposes no host-chrome styling — you cannot restyle, recolour, or hide it from extension code. Expected; do not flag it as an extension bug. | `[observed]` 2026-06-02 teardown |

## To verify (open questions)

- `dashboard.name` (via `dashboardContent.dashboard`) — **resolved and moved to Confirmed**. Decision: detail dashboard tabs are named with their subcategory_id (e.g. `cmoaf`) so the mapping is identity (no subgroupMap needed for now).
- Setting a parameter value from the extension — confirmed working in practice; record
  the exact call/signature here for reference. `[tested]` your finding; signature TBD.
- Whether `getSummaryDataAsync` row/column limits or formatting options matter for the
  largest worksheets in use. `[docs]` / `[tested]` needed.
- Library-loading + `min-api-version` items above.
- Library-loading + `min-api-version` items above.

## Dead ends — do not retry

Paths that cost time and led nowhere. Recorded so they are not attempted again.

| Path | Why it failed | Source |
|---|---|---|
| Building dashboard-to-dashboard navigation inside the extension | No navigation API (see above). Use a native navigation object instead. | `[tested]` |
| Hunting through sheet / workbook format menus to kill the default selection blue | There is no format setting for it — use the highlight-action workaround under Gotchas. | `[tested]` |

---

*Add to this doc, don't rewrite it. Each new line is one lesson the next extension
won't have to relearn.*

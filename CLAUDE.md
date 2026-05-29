# bp-nav-charts — CLAUDE.md

## Project
One combined Tableau dashboard extension: an **indicator table** that drills down to
**D3 charts**, in place. Single file `index.html` (inlines `charts.js` + `table.js` +
the orchestrator). No build step. Deploy = `git push` to GitHub Pages.

This extension is now the **only** home for chart development. The old
`b_tableau_extensions_2` repo is frozen — do not edit charts there.

## Read these first (source-of-truth order)
1. **`TABLEAU_API_REALITY.md`** — what the Tableau API and product actually allow, the
   limitations, and the workarounds. **This and the live Tableau docs override any
   assumption you (or I) have about Tableau.** Before using any API capability, check it
   there; if it's not listed, verify or test it — never assert a capability from memory.
2. **`CHART_SPEC.md`** — what each metric's chart must show and the data-shape
   invariants. This is the definition of "correct" — self-check against it.
3. **`STYLE_SPEC.md`** — the type and spacing tokens. Tokens only.

Per-task work orders and the chat↔Code handoff follow **`WORKFLOW.md`**.

## Architecture (current)
- **Overview** stays **native Tableau** for now: 3 overview dashboards × 4 cards = 12
  subgroups. Each card's "EXPLORE" is a native **Navigation object** → that subgroup's
  detail dashboard. No worksheet actions, no parameter, no calculated fields, no
  selection-blue. (See `TABLEAU_API_REALITY.md` → Recommended interaction patterns,
  Pattern A.)
- **Detail dashboards (×12)** each host this extension + a "back" Navigation button.
  The extension **self-identifies its subgroup from `dashboard.name`** (the tab name),
  so all 12 are the same file and settings — just name each dashboard for its subgroup.
- **Subgroup resolution** is one function with a precedence so the future migration is
  additive: in-extension selection (future) → parameter (future) → `dashboard.name`
  (now). Only the name branch is live today.
- **Inside the extension:** render the indicator table for the subgroup; a row click
  swaps to that indicator's chart **in JS** (`switchToChart` / `switchToTable`, `_view`
  flag) — no parameter, no navigation. `_viewMode` toggles monthly/quarterly.
- **Data:** the source worksheet carries **all** subgroups' rows; filter to the current
  `subcategory_id` in JS (keeps logic in the extension and pre-loads the data for the
  future in-extension overview).
- **Config** persists via the Tableau Settings API. Read exact field/parameter names
  from `CONFIG` / `DEFAULTS` in `index.html` — do not hardcode them from memory.

## Migration direction
Native overview now; the extension gradually absorbs more and may eventually render the
overview cards itself (Pattern B), becoming the app. Keep subgroup resolution and the
"carry all rows" rule intact so that step stays additive, not a rewrite.

## Working rules
- **Verify the foundation before building on it.** If a path depends on an API behaviour
  not yet confirmed in `TABLEAU_API_REALITY.md`, confirm that one behaviour in isolation
  first. The recurring failure is overstating the API.
- **Plan before coding.** State the plan, get it confirmed, then execute the whole unit —
  don't drift mid-build.
- **Self-check against the specs** (`CHART_SPEC.md`, `STYLE_SPEC.md`) before handing
  back. Once the harness exists, it must pass.
- **Styling: tokens only.** No `font-size` outside the four roles in `STYLE_SPEC.md`; no
  font size computed from geometry (e.g. `Math.min(11, cellW * 0.22)`); no gap that
  isn't a base-unit multiple except the named overrides.

## Code style
- No `??` (use `||`), no `?.` (use `&&` / ternary) — the embedded browser is pre-ES2020.
- Single HTML file per extension. Keep it that way.
- Size from `offsetWidth` / `offsetHeight`, never `vw` / `vh` (breaks in the iframe).
- Chart brand labels always `text-transform: uppercase` + Tableau Light; the indicator-table header uses title-case display names (see `STYLE_SPEC.md` → Brand display map).

## Deploy & test
- Open the live URL with `?chart=...` to fall back to sample data (no Tableau needed).
- Bump `VERSION` (`'YYYY-MM-DD.N'`) before every commit. `git add . ; git commit -m "..." ; git push`.

## Anti-overengineering
Minimal changes only. Read relevant code before editing. No new abstractions, no extra
files, unless asked. Prove a concept in ~10 lines before full implementation.

## End of session — Docs sync report
Always end a session with a short **Docs sync** report, even when nothing changed:

- **Updated this session:** `<doc>` — `<one-line reason>` (one line per doc actually changed).
- **Should update but didn't:** `<doc>` — `<what's missing>` — e.g. a new Tableau finding
  for `TABLEAU_API_REALITY.md`, a new rule, a resolved or newly-opened question, a spec
  item to tick. Flag it here rather than leaving it unrecorded.
- **Mirror to project knowledge:** list every doc named above so the user knows which
  Claude.ai project-knowledge copies to refresh. If none, say "none".

If nothing changed and nothing should, say exactly: `Docs sync: no changes needed.`

New Tableau lessons must be **written into** `TABLEAU_API_REALITY.md` (with a source tag)
before this report — not merely mentioned in it.

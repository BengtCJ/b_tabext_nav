# bp-indicator-nav — CLAUDE.md

## Project
Two lightweight Tableau navigation extensions for the BP Diagnostic Tool.
No build step. Deploy = `git push` to GitHub Pages.

## Live URLs
- https://bengtcj.github.io/b_tabext_nav/overview_nav.html
- https://bengtcj.github.io/b_tabext_nav/index.html

## Test in browser
Open either URL directly — falls back to settings dialog and sample data (no Tableau needed).

## Extensions

### overview_nav — Subcategory card navigation
Sits on the overview dashboard. Reads subcategory rows from a configured worksheet.
On card click: sets `Source Dashboard` parameter = `subcategory_id`, navigates to indicator table dashboard.

**Settings**
| Field | Default |
|---|---|
| Worksheet | — |
| Name field | `subcategory_name` |
| Subtext field | `subcategory_description` |
| subcategory_id field | `subcategory_id` |
| Subcategory parameter name | `Source Dashboard` |
| Target dashboard name | *(exact tab name)* |

---

### indicator_nav — Indicator row navigation
Sits on the parent dashboard (one per category). Reads indicator rows from a configured worksheet.
On row click: sets `Selected Indicator` parameter = `indicator_id` AND `Source Dashboard` parameter = `subcategory_id`, then navigates to child dashboard.

**Settings**
| Field | Default |
|---|---|
| Worksheet | — |
| Display Name field | `Display Name` |
| Source field | `Source` |
| indicator_id field | `indicator_id` |
| subcategory_id field | `subcategory_id` |
| Indicator parameter name | `Selected Indicator` |
| Subcategory parameter name | `Source Dashboard` |
| Target dashboard name | *(exact tab name)* |

## Tableau setup required (on the dashboard side)
1. Parameter: `Selected Indicator` (string) — set by indicator_nav on row click
2. Parameter: `Source Dashboard` (string) — set by both extensions on click
3. Child dashboard: 12 containers with Dynamic Zone Visibility driven by `[Source Dashboard] = "subcategory_id"`
4. Worksheets feeding each extension must contain the required fields (see settings above)
5. subcategory_id values: `cmoaf`, `sbr`, `hp`, `ct`, `maar`, `dba`, `qa`, `ce`, `cs`, `crabh`, `daiae`, `ps`

## Architecture
- Two single-file apps — all JS/CSS/HTML per file
- Settings stored in Tableau Extensions Settings API (persists in .twb)
- No external dependencies except `tableau.extensions.js`
- Preview mode when Tableau API unavailable (sample data + settings dialog)

## Code style rules
- No ?. optional chaining — use ternary or && checks
- No ?? nullish coalescing — use ||
- No arrow functions in event handlers that need `this` — use function()
- All sizing uses offsetWidth / offsetHeight (not vw/vh — breaks in iframes)
- Same colour variables as b_tableau_extensions_2

## Deploy
Before every commit, bump `VERSION` in each file. Format: `'YYYY-MM-DD.N'`

```powershell
git add . ; git commit -m "..." ; git push
```

## Anti-overengineering
Minimal changes only. No new abstractions. Single HTML file per extension — keep it that way.
Functionality before polish. Read all relevant code before editing.

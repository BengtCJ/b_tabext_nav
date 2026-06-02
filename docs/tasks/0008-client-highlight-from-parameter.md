# Task: 0008 — Client highlight: resolve from the parameter, match on Brand Name Upper, normalize for display only

Goal: Charts and the scorecard table draw the client/primary brand in `selectedColor`
(`#e994a2`) by resolving the client from the **`Select Client Brand` parameter** and matching on
the raw **`Brand Name Upper`** value. Brand-name normalization is **display-only**. Remove the
hardcoded client.

Why:  0007 found the client **hardcoded**; the pink drops whenever that literal (or a normalized
value) doesn't equal the data's `Brand Name Upper`. The parameter holds values in `Brand Name
Upper` form (confirmed) — the **same field/form as the chart data** — so `Brand Name Upper` is the
shared match key. The recurring loss (table earlier, charts now) is normalization or a hardcode
leaking onto the match value.

Read first: `CLAUDE.md` (Code style → brand casing), `CHART_SPEC.md` (Global rules → client in
`selectedColor`; "Looks wrong if… a primary brand isn't highlighted"), `STYLE_SPEC.md` (Colour —
one constant), `TABLEAU_API_REALITY.md` (Confirmed working → read parameters + `currentValue`,
`ParameterChanged`). Prior: **0006** (`getParametersAsync` throw), **0010** (title-case
normalizer), **0007** (diagnosis: hardcoded).

Known constants (verify they exist; don't assume): `selectedColor:'#e994a2'`,
`neutralColor:'#7d7d7d'`, `parameter:'Select Client Brand'`, `brandField:'Brand Name Upper'`,
`_selectedBrand`, `CONFIG.clientBrand`.

---

## Prerequisite

- The parameter read must work. If **0006**'s listener fix (init-scoped dashboard ref, guarded
  for `?chart=`) has not landed, fixing the read is **in scope here too** — same fix. Do **not**
  reintroduce a hardcode as a workaround for a broken read.

## In scope

- **Resolve the client from the parameter.** Read `Select Client Brand` `currentValue` into
  `CONFIG.clientBrand` / `_selectedBrand`; re-read on `ParameterChanged`; default to the client's
  `Brand Name Upper` value. **Remove the hardcoded client literal.**
- **Match on the raw value.** `row['Brand Name Upper'] === clientBrand` → `selectedColor`, else
  `neutralColor`. **No normalization applied to either side of this comparison.**
- **Normalization is display-only.** 0010's title-case (and any casing transform) applies to
  rendered labels/headers only — never to the value fed into the match.
- **One shared resolver/match** used by **both** the table and the charts (no duplicated logic
  that can drift apart).

## Out of scope (do not touch)

- Adding `business_id` or any shelf change — `Brand Name Upper` is the key; nothing to surface.
- The svt no-data / grain-fallback work (0006's chart-body half), the font/WOFF2 issue, the
  scoreWorksheet `level` warning, the `hp` breadcrumb.
- Making the colour value itself a parameter (per-client theming) — stays one constant; future.

## Spec edit (apply verbatim to `CHART_SPEC.md`, as a new bullet under `## Global rules (every chart)`)

```
- **Client identity is matched on the raw `Brand Name Upper` value** — the form the
  `Select Client Brand` parameter holds. Brand-name normalization (title-case, display
  formatting) is **display-only** and must never be applied to the value used for the client
  match. One shared resolver performs this match for both the scorecard table and the charts, so
  the two surfaces cannot drift apart (the recurring "client not highlighted" regressions came
  from normalising the match value or hardcoding the client).
```

## Acceptance criteria (all must hold)

- [ ] The Spec edit is in `CHART_SPEC.md` verbatim at the stated location; no other lines changed.
- [ ] No hardcoded client literal remains; the client comes from the `Select Client Brand` parameter.
- [ ] The client renders in `#e994a2` in **both** charts and the table; all other brands `neutralColor`. (`CHART_SPEC` "Looks wrong if… a primary brand isn't highlighted" passes.)
- [ ] Changing the parameter re-highlights the new client live (`ParameterChanged`); in `?chart=` fallback the default client is highlighted.
- [ ] No `[param listener] TypeError` on load or `ParameterChanged` — live and `?chart=`.
- [ ] The match value is un-normalized; normalization affects only displayed labels — verified with the accented brand (`ILLYCAFFÈ`) still matching.
- [ ] A single shared resolver does the match for table + charts (no second copy of the logic).
- [ ] If the harness exists, a gate asserts the client highlight is present and equals `#e994a2` in chart **and** table.

## Stop-and-verify gates (confirm at build; kick back to chat if they fail — do not work around)

- **Parameter value form.** The parameter's allowed values must be byte-identical to the data's
  `Brand Name Upper`, **accent-exact** (`ILLYCAFFÈ` vs `ILLYCAFFE`). If they differ (hand-typed vs
  field-sourced), STOP — the key needs reconciling, kick back.
- **0007 Q6 — existing resolver?** If the table's pink already works via a resolver, wire the
  charts into **that** one; if both surfaces are broken, build the shared resolver. Confirm which
  before duplicating any match logic.

## Constraints (hard)

- Tokens only (`STYLE_SPEC`); no ES2020 (`||` not `??`, `&&` not `?.`); single file; size from
  `offsetWidth`/`offsetHeight`.
- The parameter read is confirmed in `TABLEAU_API_REALITY`; the **parameter value form/accent** is
  the unconfirmed thing — verify it before relying on the raw `===` (rule 6).
- Apply ONLY the named Spec edit; make no other spec/architecture change. If one is needed, stop
  and kick back.

## Verify by

- With the parameter set to the client: confirm pink in chart **and** table; change the parameter
  and confirm the highlight follows; load `?chart=` and confirm the default client is pink; clean
  console (no listener throw) in both modes. Run the harness highlight gate if it exists; else
  verify manually and note the harness is still pending.

## On uncertainty

- Stop, record the finding in `TABLEAU_API_REALITY.md`, kick back to chat. Do not hardcode, do not guess.

# Task: chart-defaults — Chart→class defaults + two integrity fixes

Goal: Lock one uniform chart default per data-shape class, enrich each class's offered
alternates, and fix the two defaults that misrepresent the data (stacked ratios, smoothed
signed-float trends).
Why:  Adds chart diversity without crossing data-shape classes (CHART_SPEC "Looks wrong
if…"); removes two charts that imply structure the data doesn't have.

Read first: CLAUDE.md, CHART_SPEC.md (Data-shape classes, Invariants, Looks-wrong-if),
STYLE_SPEC.md (tokens — unchanged here).

## In scope
- **METRIC_CHARTS in index.html** — set first entry (= default) per metric to the locked
  uniform class default, and set the allowed list to the offered charts below. Default
  first, alternates after.

  | Metric(s) | Class | Default (first) | Allowed list (offered, default first) |
  |---|---|---|---|
  | tam, cagr, mcon | Headline | `ban` | `ban` |
  | eqr, ebl, sstsr | Ratio 0–1 | `vbar` (grouped) | `vbar`, `hbar`, `progress-ring`, `line-straight`, `line-smooth`, `small-multiples` |
  | sov, bss | Comp. share | `treemap` | `treemap`, `inset-bubble`, `bubbles`, `area-100`, `treemap-bar`, `stream` |
  | vom, svt | Signed float | `line-straight` | `line-straight`, `line-smooth`, `small-multiples` |
  | bt, nps, sop, dvtr | Likert 1–5 | `scale-figma` | `scale-figma`, `hbar`, `vbar`, `bans`, `ban` |

- **Integrity fix 1 — ratios never stacked.** The Ratio 0–1 snapshot is a **grouped
  (non-stacked) `vbar`**, one bar per brand. If only a stacked vbar renderer exists,
  add/flag a grouped mode.
- **Integrity fix 2 — signed floats are straight.** `vom`/`svt` default to `line-straight`
  with the zero baseline drawn. `svt`'s pipeline-zero tail keeps its existing zero
  annotation (`guardSvtZeros`). `line-smooth` becomes alternate-only.
- **Renderers used as defaults must render correctly** at typical container size and honour
  the too-small / no-data states: `vbar` (grouped), `treemap` (standard), `line-straight`,
  `scale-figma`, `ban`.
- **Offered list = working renderers only.** Do **not** list an alternate whose renderer
  is missing or renders empty (it would trip "a selectable option produces an empty chart").
  If a wanted alternate above has no working renderer yet, drop it from the offered list and
  **report it** as "wanted, not yet implemented" — building it is a later work order, not
  this one.
- Apply the **Spec edit** below to CHART_SPEC.md.
- Bump `VERSION`.

## Out of scope (do not touch)
- Scorecard table, brand order, STYLE_SPEC tokens, highlight colour.
- `ba` and `cra`: keep their current `hbar` default — their data-shape class is unresolved
  (CHART_SPEC Open items). Do not relocate them on this pass.
- `nps` true-NPS recalculation / `arc` (stays blocked); edge-trim default. Unchanged.
- Building brand-new alternate renderers beyond the five defaults (report, don't build).

## Spec edit (apply verbatim to CHART_SPEC.md)

**(a)** Immediately AFTER the paragraph ending `…and keep it consistent / with the classes
above.` (the line below the data-shape class table), insert:

```
### Per-class chart menu and uniform default (locked)
One default per class — siblings render the same chart so the dashboard reads
consistently; everything else is a user-selectable alternate (the `METRIC_CHARTS` allowed
list, default first).

| Class | Uniform default | Also offered (alternates) |
|---|---|---|
| Headline | `ban` | — |
| Ratio 0–1 | `vbar` (grouped) | `hbar`, `progress-ring`, `line-straight`, `line-smooth`, `small-multiples` |
| Compositional share | `treemap` | `inset-bubble`, `bubbles`, `area-100`, `treemap-bar`, `stream` |
| Signed float | `line-straight` | `line-smooth`, `small-multiples` |
| Likert 1–5 | `scale-figma` | `hbar`, `vbar`, `bans`, `ban` |

Part-of-whole idioms are **class-gated, not blanket-banned**: `progress-ring`, `waffle` and
`donut` are valid for a **true 0–1 ratio** (each value is a genuine fraction) and for
**compositional share** (parts of ~100%), but stay banned for **Likert** (a 1–5 mean is not
a fraction). Class-validity is not the same as the offered list — only the alternates above
are wired in today.

`ba` and `cra` keep their current (`hbar`) default and are out of scope until their
data-shape class is resolved (see Open items).
```

**(b)** In the **Invariants** section, AFTER the `guardStarbucksPresent` bullet, insert:

```
- **Independent ratios are never stacked:** `eqr`, `ebl`, `sstsr` are independent per-brand
  fractions that do not sum to 100% — a stacked bar draws a total that does not exist.
  Snapshot them as grouped (non-stacked) bars. (enforce in harness)
- **Signed-float trends are straight, with a zero baseline:** smoothing a signed series with
  few points can fabricate a zero-crossing the data never makes, and would glide through
  `svt`'s pipeline-zero tail. Default `vom`/`svt` to `line-straight` with the zero line
  drawn; `line-smooth` is alternate-only. (enforce in harness)
```

**(c)** In the **"Looks wrong if…"** section, append:

```
- A 0–1 ratio (`eqr`/`ebl`/`sstsr`) drawn as a **stacked** bar (implies a brand total that
  isn't real) instead of grouped bars.
- A signed-float trend (`vom`/`svt`) drawn with a **smoothed** line that crosses or
  approaches zero where the straight segments don't.
```

## Acceptance criteria (all must hold)
- [ ] CHART_SPEC.md contains Spec edits (a), (b), (c) verbatim at the stated locations; no
      other lines changed.
- [ ] `METRIC_CHARTS` first entry per metric equals the locked default in the table above
      (tam/cagr/mcon→`ban`; eqr/ebl/sstsr→`vbar` grouped; sov/bss→`treemap`;
      vom/svt→`line-straight`; bt/nps/sop/dvtr→`scale-figma`). Harness asserts this.
- [ ] No Ratio-0–1 metric renders as a stacked bar; the `vbar` snapshot is grouped. Harness
      asserts no stacked rendering for the ratio class.
- [ ] `vom`/`svt` open as `line-straight` with a zero baseline; no smoothed default. `svt`
      zero-tail annotation still present. Harness asserts the default chart id + zero line.
- [ ] `arc` is absent from `nps`'s allowed list (stays blocked).
- [ ] `ba`/`cra` defaults unchanged.
- [ ] Every chart in each offered list has a working renderer and a valid too-small /
      no-data state; any wanted-but-unimplemented alternate is reported, not shipped.
- [ ] `VERSION` bumped; existing guards and brand-highlight / uppercase-label rules unregressed.

## Constraints (hard)
- Tokens only (STYLE_SPEC); no ES2020 (no `??` / `?.`); single file; size from
  offsetWidth/Height.
- Verify any unconfirmed Tableau capability before building on it (TABLEAU_API_REALITY
  rules 3 & 6). (Chart choice is in-extension D3 — no Tableau API surface — but the data
  read still goes through `getSummaryDataAsync`; don't regress field/shelf assumptions.)
- Apply ONLY the verbatim Spec edits named here; make no other spec/architecture change —
  if one is needed, stop and kick back to chat.

## Verify by
- Run the harness (default-id assertions + the two new integrity checks).
- Open the live URL with `?chart=…` against sample data for each of the five defaults and
  spot-check the offered alternates render (no empty options).

## On uncertainty
- If `treemap` or grouped-`vbar` needs a renderer that doesn't exist, or an offered
  alternate has no renderer, stop, record the finding in TABLEAU_API_REALITY.md if it's an
  API/product limit, otherwise report the missing renderer and kick back to chat. Do not
  guess or ship an empty option.

# Task 0009 — SVT: support quarterly-only period data

Goal: Make the SVT line chart render when the source worksheet carries Year + Quarter
columns but no Month column.  Currently every SVT row gets `period = null` (the parser
requires both Year *and* Month), so `computeAvailableGrains` returns
`{ monthly: false, quarterly: false }`, `isTrend` is false, the indicator is treated as a
snapshot, and the line chart receives data with no period dimension → blank/broken render.

Why: SVT data is quarterly-resolution (Snowflake pipeline); the monthly path will never
be populated for this indicator.

Read first: CLAUDE.md, CHART_SPEC (Period granularity & gaps, Signed float class),
STYLE_SPEC (tokens only).  No new Tableau API capability — this is parser + logic only.

---

## Actual root cause (confirmed by console diagnostics 2026-06-02)

The spec above described the expected root cause. Live testing revealed a deeper issue:

**`Year` is `'%null%'` (Tableau null sentinel) for all SVT rows.**

The worksheet (`raw_values_filtered`) exposes `Year | Quarter | SUM(Raw Value)`. Year is
correctly populated for other indicators (survey-sourced). For SVT (Snowflake-sourced),
the underlying date dimension does not map to the worksheet's `Year` field → `Year = null`.
Quarter is populated (integer 1–4) but carries no year context on its own.

Consequence: even after adding `quarterIdx` support (Change 3 in the original plan),
`year && quarter` = `NaN && 4` = falsy → `period = null` still.

No code-side inference is reliable: cross-row year lookup breaks when the same quarter
number appears in multiple years (e.g. Q1 spans 2024 and 2025 in a 5-quarter dataset).

**Real fix: `periodField` config + one Tableau calculated field.**

---

## Root cause (original — still partially relevant)

1. **Parser** (`_rawData = rows.map(...)`, ~line 3848):
   `period = (year && month) ? toYearMonth(year, month) : null`
   No quarter path — SVT rows always get `period = null`.
   → Fixed (Changes 1–3 below) but insufficient alone because Year is also null.

2. **`computeAvailableGrains`** (~line 3855):
   Filters for `d.period` (non-null) → finds nothing for SVT →
   returns `{ monthly: false, quarterly: false }`.

3. **`processIndicator`** (~line 3963):
   `isTrend = _availableGrains.monthly` → `false` → snapshot branch →
   data has no meaningful period → line chart fails to render.

---

## In scope

- Add a `quarterField` config key so the extension can read a Quarter column.
- Teach the parser to produce `"YYYY-Q#"` period strings when Quarter is present.
- Teach `computeAvailableGrains` to recognise quarterly-format periods and return
  the correct flags.
- Fix `processIndicator` so quarterly-only data is treated as a trend (not snapshot),
  with auto-fallback from monthly → quarterly view when monthly data is absent.
- Add a Quarter Field input to the settings panel.

## Out of scope

- `aggregateByQuarter` — untouched; it only runs when collapsing monthly data.
- Chart renderers — no changes; the line chart already handles `"YYYY-Q#"` period
  strings correctly (they sort lexicographically and are used as axis labels as-is).
- Sample data — no changes.
- Other indicators — this fix is general but motivated by SVT; do not change the
  behaviour of monthly-data indicators.

---

## Implementation — 6 changes, all in `index.html`

### Change 1 — `DEFAULTS` (line ~2884)
Add after `monthField`:
```js
quarterField:       'Quarter',
```

### Change 2 — column index discovery (in `loadData`, line ~3706)
Add after the `monthIdx` line:
```js
var quarterIdx = colIdx(CONFIG.quarterField);
```

### Change 3 — period construction in the parser (line ~3726)
Replace:
```js
var period = (year && month && !isNaN(year) && !isNaN(month))
  ? toYearMonth(year, month) : null;
```
With:
```js
var quarter = quarterIdx !== -1 ? parseFloat(row[quarterIdx].value) : null;
var period  = (year && month && !isNaN(year) && !isNaN(month))
  ? toYearMonth(year, month)
  : (year && quarter && !isNaN(year) && !isNaN(quarter))
    ? (year + '-Q' + quarter)
    : null;
```

### Change 4 — `computeAvailableGrains` (line ~3790)
Currently returns `{ monthly: true, ... }` for any indicator with ≥2 distinct periods,
regardless of format.  Replace the whole function body:

```js
function computeAvailableGrains(indicatorId) {
  var rows = _rawData.filter(function(d) { return d.indicator === indicatorId && d.period; });
  if (rows.length < 2) return { monthly: false, quarterly: false };

  // Partition by period format: YYYY-MM vs YYYY-Q#
  var moPeriods = [], qPeriods = [];
  rows.forEach(function(d) {
    if (/^\d{4}-\d{2}$/.test(d.period)) {
      if (moPeriods.indexOf(d.period) === -1) moPeriods.push(d.period);
    } else if (/^\d{4}-Q\d$/.test(d.period)) {
      if (qPeriods.indexOf(d.period) === -1) qPeriods.push(d.period);
    }
  });

  var hasMonthly = moPeriods.length >= 2;

  // Quarterly: directly if already Q-format, OR by aggregating monthly rows
  var hasQuarterly = qPeriods.length >= 2;
  if (!hasQuarterly && hasMonthly) {
    var agg = aggregateByQuarter(rows, indicatorId);
    var aggQs = [];
    agg.forEach(function(d) {
      if (d.period && aggQs.indexOf(d.period) === -1) aggQs.push(d.period);
    });
    hasQuarterly = aggQs.length >= 2;
  }

  return { monthly: hasMonthly, quarterly: hasQuarterly };
}
```

### Change 5 — `processIndicator` (line ~3814)
Three sub-changes:

**5a.** Extend the existing auto-fallback block (currently only quarterly→monthly):
```js
if (_viewMode === 'quarterly' && !_availableGrains.quarterly) {
  _viewMode = 'monthly';
}
// NEW: symmetric fallback — monthly→quarterly when only quarterly data exists
if (_viewMode === 'monthly' && !_availableGrains.monthly && _availableGrains.quarterly) {
  _viewMode = 'quarterly';
}
```

**5b.** Fix `isTrend` (line ~3820):
```js
var isTrend = _availableGrains.monthly || _availableGrains.quarterly;
```

**5c.** In the `if (isTrend)` → quarterly branch, skip `aggregateByQuarter` when data is
already in `"YYYY-Q#"` format (i.e. when `!_availableGrains.monthly`):
```js
if (_viewMode === 'quarterly') {
  data = _availableGrains.monthly
    ? aggregateByQuarter(data, indicatorId)
    : sortByPeriod(data.filter(function(d) { return d.period; }));
} else {
  data = sortByPeriod(data.filter(function(d) { return d.period; }));
}
```

### Change 6 — settings UI + save handler
**UI** (after the `s-monthField` block, line ~3930):
```html
'<div class="field"><label>Quarter field</label>' +
  '<input type="text" id="s-quarterField" value="' + escAttr(CONFIG.quarterField) + '" list="s-columns">' +
'</div>' +
```

**Save handler** (after the `monthField` line, line ~4005):
```js
CONFIG.quarterField = document.getElementById('s-quarterField').value.trim();
```

---

## Change 7 — `periodField` config (actual fix for null-Year SVT rows)

Added after the 6 original changes to handle the confirmed root cause.

**`DEFAULTS`**: `periodField: ''`

**Column lookup**: `var periodIdx = CONFIG.periodField ? colIdx(CONFIG.periodField) : -1;`

**Parser** — check `periodIdx` *before* Year+Month/Year+Quarter:
```js
var period = null;
if (periodIdx !== -1) {
  var pRaw = row[periodIdx].value || row[periodIdx].formattedValue || '';
  if (pRaw && pRaw !== '%null%' && pRaw !== 'Null') period = String(pRaw).trim();
}
if (!period) {
  period = (year && month && !isNaN(year) && !isNaN(month))
    ? toYearMonth(year, month)
    : (year && quarter && !isNaN(year) && !isNaN(quarter))
      ? (year + '-Q' + quarter)
      : null;
}
```

**Settings UI**: "Period field (optional override)" input after Quarter field.

**Save handler**: `CONFIG.periodField = document.getElementById('s-periodField').value.trim();`

### Tableau action required to complete the fix

In `raw_values_filtered`, create a calculated field (e.g. `Period String`) that produces
`"YYYY-Q#"` using SVT's actual Snowflake date column:
```
STR(YEAR([<svt-date-field>])) + '-Q' + STR(DATEPART('quarter', [<svt-date-field>]))
```
Add it to the Detail shelf. Then set `periodField = 'Period String'` (or whatever name
was used) in extension settings. The `periodField` takes precedence over Year+Quarter
for rows where it's non-null, and falls back cleanly for rows where it's null.

---

## Acceptance criteria

- [ ] SVT line chart renders with quarterly period labels (`2025-Q1`, `2025-Q2`, …) when
      `periodField` is configured and the calculated field is present in the worksheet.
- [ ] The Monthly button is hidden for SVT; the Quarterly button is visible and active.
- [ ] Monthly-data indicators (`eqr`, `ebl`, `sov`, `bss`, `sstsr`, `vom`) are unaffected:
      `periodField` falls through to the Year+Month path for those rows (periodField value
      is null/empty for them, or periodField is blank entirely).
- [ ] `quarterField` and `periodField` both persist via the Settings API and round-trip
      through the settings panel.
- [ ] Preview / `?chart=svt` sample-data path still renders.

## Constraints (hard)

- No `??` / `?.` — use `||` and ternary/`&&` (pre-ES2020 embedded browser).
- Single `index.html` — no new files.
- `aggregateByQuarter` must not be called on already-quarterly data.
- Read exact CONFIG/DEFAULTS field names and settings-panel pattern from the file.

## Verify by

1. Create the `Period String` calculated field in `raw_values_filtered`, set `periodField`
   in extension settings, reload — SVT line chart renders with quarterly labels.
2. Clear `periodField` in settings — SVT falls back to no period (null Year) and shows
   "No data available" as before. Confirms the field is the active fix.
3. Switch to `eqr` — still renders (Year+Month path unaffected).

## On uncertainty

Stop, record the finding, kick back to chat.

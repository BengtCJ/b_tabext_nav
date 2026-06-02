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

## Root cause (confirmed in code)

1. **Parser** (`_rawData = rows.map(...)`, line ~3726):
   `period = (year && month) ? toYearMonth(year, month) : null`
   No quarter path — SVT rows always get `period = null`.

2. **`computeAvailableGrains`** (line ~3790):
   Filters for `d.period` (non-null) → finds nothing for SVT →
   returns `{ monthly: false, quarterly: false }`.

3. **`processIndicator`** (line ~3820):
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

## Acceptance criteria

- [ ] SVT line chart renders with quarterly period labels (`2025-Q1`, `2025-Q2`, …) when
      only Year + Quarter columns are present in the worksheet.
- [ ] The Monthly button is hidden for SVT; the Quarterly button is visible and active by
      default.  (`refreshViewToggle` already derives this from `_availableGrains` — no
      change needed there; verify it works.)
- [ ] Monthly-data indicators (`eqr`, `ebl`, `sov`, `bss`, `sstsr`, `vom`) are unaffected:
      their `computeAvailableGrains` results and `aggregateByQuarter` path are unchanged.
- [ ] An indicator with *both* monthly and quarterly format rows (unlikely but possible)
      continues to show both buttons; the quarterly view still uses `aggregateByQuarter`.
- [ ] `quarterField` persists via the Settings API and round-trips through the settings panel.
- [ ] Preview / `?chart=svt` sample-data path still renders (sample data uses period strings
      already — no quarterly column parsing happens there; line 3477 preview fallback
      unchanged).

## Constraints (hard)

- No `??` / `?.` — use `||` and ternary/`&&` (pre-ES2020 embedded browser).
- Tokens only for any styling (STYLE_SPEC); no geometry-driven sizes.
- Single `index.html` — no new files.
- `aggregateByQuarter` must not be called on already-quarterly data (it would call
  `toYearQuarter("2025-Q1")` → `NaN` → silently drop all rows).
- Read exact CONFIG/DEFAULTS field names and settings-panel pattern from the file before
  writing — do not invent a different convention.

## Verify by

1. Open the live URL with `?chart=svt` — should render a multi-period line chart using
   the quarterly sample data (or confirm the preview fallback still shows something).
2. In a real Tableau dashboard: set Quarter field in settings to the actual column name,
   confirm SVT rows now have non-null periods, confirm the line chart loads.
3. Switch to another monthly indicator (`eqr`) — confirm it still shows both M/Q buttons
   and its data is unchanged.

## On uncertainty

Stop, record the finding, kick back to chat.  Do not guess — especially on how the
Tableau worksheet exposes the Quarter column (field name, value type — integer 1–4 vs
string "Q1" vs "1").  The `parseFloat` assumption in Change 3 covers integer quarters
(1, 2, 3, 4); if the column holds strings like `"Q1"`, `parseFloat` returns `NaN` and
the period will be null — that case needs a separate branch.  Verify the actual column
format before shipping.

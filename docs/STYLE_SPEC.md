# STYLE_SPEC.md — type & spacing tokens

The client cares most about typography and spacing, so these are locked as tokens and
enforced. Colours and motion were not friction points — codify the existing values and
move on.

**Principle: fixed type scale, fluid layout.** Type sizes are locked; only layout flexes
by rule. This is what keeps typography tight and kills the geometry-driven font sizing
that read as inconsistent. Validate at the real Tableau container pixel size.

- **Validation / design container size:** `1421 × 773` (current; may change — design fluid
  so a change is absorbed by layout, not type). This is the canvas to check the scale
  against, NOT the minimum.

> **Approach:** type uses a standard modular scale (≈1.2 minor third, base 13, rounded to
> whole px), NOT the Figma values — the Figma spacing/sizing is inconsistent (14/19/20,
> differing H vs V), so transcribing it would bake in drift. The snapshots are a
> cross-check on the adopted scale, not its source. Validate the scale at `1421 × 773`.

## Type roles (exactly four — fixed sizes)
Scale: ≈1.2 (minor third), base 13, rounded. Adjust `Heading` to 18 if more contrast is
wanted; validate at the container size before final sign-off.

| Role | Face | Use | Size |
|---|---|---|---|
| **Hero** | Baskervville italic | the BAN figure, arc centre — the focal number | per-chart override |
| **Heading** | Tableau Light | table indicator names, section labels | 16px |
| **Label** | Tableau Light (brands UPPERCASE) / Regular (values) | brand names, value labels | 13px |
| **Caption** | Tableau Light | axis ticks, legend, small notes | 11px |

- **Hero is the only sanctioned size override.** It may be sized per chart where it is
  the focal element, and nowhere else.
- No other element sets its own font size. In particular, **no font size derived from
  geometry** (`Math.min(11, cellW * 0.22)` and similar must go).
- Below the documented **minimum container size**, a chart shows its "too small" state
  rather than shrinking text. Minimum size: `‹px ×px›` — separate from the validation
  size above; derive it from where a chart actually breaks, not from the current canvas.

## Faces (existing constants — keep)
- Baskervville italic — hero numbers.
- Tableau Regular — value labels / body.
- Tableau Light — brand names (always uppercase) and axis/caption text.

## Spacing
- **One base unit:** 4px. Every gap/margin is a multiple of it.
- Named gaps: `tight` = 4px, `default` = 8px, `section` = 16px, `loose` = 24px. The Figma's
  14/19/20 snap into these (14→16, 19/20→16 or 24 by role); H-vs-V differences are
  regularised away unless one is genuinely intentional.
- A short, **named** list of overrides for the few places that genuinely need them — each
  documented here so it reads as intentional, not drift.

  | Override | Element | Value | Reason |
  |---|---|---|---|
  | Chart-shell title | `#chart-title` | 26px, Baskervville italic | Display header for the indicator name in chart view; sized as a Hero-adjacent focal element. Revisit in task 0003 alongside BAN Hero sizing. |

## Colour (codify existing — not a friction point)
- Primary / client highlight: `#e994a2`.
- Neutral (other brands): grey per existing palette.
- Status pills on the overview: STRONG = green, NEUTRAL = amber (match existing).

## Enforcement (what the harness / lint checks)
- No `font-size` value that isn't one of the four roles (hero override excepted).
- No font size computed from element geometry.
- No gap/margin that isn't a multiple of the 4px base unit, except the named overrides.
- Type sizes identical for the same role across all charts.

## TODO before this is final
- Validate the type scale + spacing at `1421 × 773` (and adjust if the client reacts).
- Set the **minimum container size** (the "too small" floor) — derive from where a chart
  first breaks, not from the current canvas.
- Confirm the overview card copy against the design (e.g. "STRATEGIC STRENTH" looks like
  a dropped G).

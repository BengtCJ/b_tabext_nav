# STYLE_SPEC.md — type & spacing tokens

The client cares most about typography and spacing, so these are locked as tokens and
enforced. Colours and motion were not friction points — codify the existing values and
move on.

**Principle: fixed type scale, fluid layout.** Type sizes are locked; only layout flexes
by rule. This is what keeps typography tight and kills the geometry-driven font sizing
that read as inconsistent. Validate at the real Tableau container pixel sizes.

> **Pending inputs:** exact px values come from the Figma frames / snapshots and the real
> container dimensions. Placeholders below are marked `‹px›` — fill them from the
> reference, don't guess.

## Type roles (exactly four — fixed sizes)
| Role | Face | Use | Size |
|---|---|---|---|
| **Hero** | Baskervville italic | the BAN figure, arc centre — the focal number | `‹px›` |
| **Heading** | Tableau Light | table indicator names, section labels | `‹px›` |
| **Label** | Tableau Light (brands UPPERCASE) / Regular (values) | brand names, value labels | `‹px›` |
| **Caption** | Tableau Light | axis ticks, legend, small notes | `‹px›` |

- **Hero is the only sanctioned size override.** It may be sized per chart where it is
  the focal element, and nowhere else.
- No other element sets its own font size. In particular, **no font size derived from
  geometry** (`Math.min(11, cellW * 0.22)` and similar must go).
- Below the documented **minimum container size**, a chart shows its "too small" state
  rather than shrinking text. Minimum size: `‹px ×px›`.

## Faces (existing constants — keep)
- Baskervville italic — hero numbers.
- Tableau Regular — value labels / body.
- Tableau Light — brand names (always uppercase) and axis/caption text.

## Spacing
- **One base unit:** 4px. Every gap/margin is a multiple of it.
- Named gaps: `tight` = `‹×4px›`, `default` = `‹×4px›`, `section` = `‹×4px›`.
- A short, **named** list of overrides for the few places that genuinely need them — each
  documented here so it reads as intentional, not drift. (None yet — add as needed.)

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
- Fill every `‹px›` from the snapshots + container sizes.
- Confirm the overview card copy against the design (e.g. "STRATEGIC STRENTH" looks like
  a dropped G).

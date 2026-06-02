# WORKFLOW.md — spec in chat, build in Claude Code

One loop so design happens where it's cheap to change (chat) and code happens where it
runs (Claude Code), without divergence or slow per-step oversight.

## Division of labour
| Claude chat (here) | Claude Code |
|---|---|
| Research & verification (web, Tableau docs) | Implementing within a work order |
| Architecture & design decisions | Editing files, running the harness, deploying |
| Styling decisions from snapshots | Self-checking against the specs |
| Writing/updating the docs & specs | Reporting what changed + verification results |
| Producing the per-task **work order** | — |

**Rule of thumb:** if the answer would change a doc/spec or needs the web, it's a chat
job. If it's editing files to meet an already-defined spec, it's a Code job. Claude Code
does **not** make architecture, research, or spec decisions on its own — if one is
needed, it stops and kicks back to chat.

## The loop
1. **Chat — spec.** Resolve the question/decision. If a durable rule changed, **decide it
   here and write the exact doc edit — verbatim text + insertion point — into the work
   order** (a "Spec edit" block), rather than editing the doc in chat. Claude Code applies
   it to the repo doc as part of the build, so the repo stays the single source of truth;
   after the build you mirror the updated repo doc to project knowledge. Affected docs:
   `TABLEAU_API_REALITY.md`, `CHART_SPEC.md`, `STYLE_SPEC.md`, `CLAUDE.md`. Output one
   **work order** for one milestone-sized unit, with acceptance criteria.
2. **Hand off.** Commit the work order as `docs/tasks/NNNN-slug.md` (or paste it into
   Claude Code). Claude Code auto-reads `CLAUDE.md` → the specs → the work order.
3. **Code — build.** Enter **plan mode**; produce a plan from the work order; you approve
   the plan. (This is the cheap divergence catch — one approval covers the whole unit.)
   Execute. **Self-verify** against the acceptance criteria / harness. Report pass/fail +
   what changed.
4. **Return.** If Code hits an unknown (API limit, design fork, spec gap) it **stops**,
   records the finding in `TABLEAU_API_REALITY.md`, and kicks back to chat — it does not
   guess. New durable lessons always land in the reality doc before the session ends.

You review **twice, both cheap**: the plan (intent) and the verified output (result) —
not every step. That's the throughput fix.

## Sizing
One work order = one milestone. Big enough to be worth a plan, small enough to verify in
one pass. If it needs more than about one plan to hold, split it.

## Per-surface visual loop (styling a chart / table / card)
Pin the look in chat before Claude Code builds it — the cheap place to catch "way off".
Learned from the scorecard round, which converged but took too many turns.

1. **Inherit, don't re-decide.** Start from the locked tokens (STYLE_SPEC) and the metric's
   data-shape class + valid charts (CHART_SPEC). Apply them as the prototype's defaults.
   **Never guess a value that's already in the spec** (the scorecard burned a round
   defaulting to Playfair when Baskerville / Libre Baskerville italic was already locked).
2. **Tear down the reference frame, in writing, first.** Before prototyping or speccing,
   produce a written property inventory read straight off the Figma frame / screenshot — not
   a loose glance. List, with values: gutters/gaps and whether they're uniform; corner radii
   and how inner/outer nest (outer = inner + gutter); alignment (where the number sits in its
   cell — corner, centred?); relative type sizes (which element is largest); fills (which
   cells are filled vs transparent; which column is the client/emphasised); text format
   (suffix placement; truncation risk on long values); and contrast of any text on a coloured
   fill. Reconcile each against the locked tokens. The recurring failure is reading structure
   ("table, header, commentary") but not these fine properties — most "way off" catches live
   on this list. Prototype only the gaps the frame doesn't pin.
3. **Prototype the delta in chat** — static HTML, dummy data, renders inline. Live-tune
   only the "know-it-when-I-see-it" values (proportion, elegance); state the nameable ones
   in one pass rather than discovering them one per turn.
4. **Reconcile stated rules vs the frame; flag conflicts before locking** (e.g. a stated
   2-colour rule vs an amber cell in the screenshot).
5. **Lock to a per-chart CHART_SPEC / STYLE_SPEC entry + tighten the work order's
   acceptance criteria.** The prototype is throwaway; the spec entry is the durable output.
6. **Keep data/contract questions on a separate track** (field presence, value sanity) —
   don't let them ride the visual loop or they get lost (Display Name + the 5.0-across rows
   sat unresolved through the whole scorecard chat).

**Batch by class, not one-at-a-time-from-scratch.** Charts share chrome (Baskerville numerals, `#e994a2` highlight, fills, radius, gaps, too-small/no-data states). Lock that
shared base **once**, then each chart is a small delta; charts in the same data-shape class
(e.g. the share charts) get prototyped together. "One at a time" = one small delta each,
not a full loop each.

## Work order template
```
# Task: <id> — <short title>

Goal: <the outcome in one sentence>
Why:  <one line; link a doc section if relevant>

Read first: CLAUDE.md, <CHART_SPEC §… / STYLE_SPEC §… / TABLEAU_API_REALITY §…>

In scope:
- <...>
Out of scope (do not touch):
- <...>

Spec edit (apply verbatim to <doc>, if any):
- <insertion point> then the exact text to add. "None" if this work order changes no doc.

Acceptance criteria (definition of done — all must hold):
- [ ] <doc> contains the Spec edit verbatim at the stated location, no other lines changed (omit if none)
- [ ] <checkable outcome>
- [ ] <checkable outcome>

Constraints (hard):
- Tokens only (STYLE_SPEC); no ES2020 (no ?? / ?.); single file; size from offsetWidth/Height
- Verify any unconfirmed Tableau capability before building on it (TABLEAU_API_REALITY rules 3 & 6)
- Apply ONLY the verbatim doc edit(s) named in this work order's "Spec edit"; make no other spec/architecture change — if one is needed, stop and kick back to chat

Verify by:
- <run the harness / the specific check that proves the acceptance criteria>

On uncertainty:
- Stop, record the finding in TABLEAU_API_REALITY.md, kick back to chat. Do not guess.
```

## Connects to
- `CLAUDE.md` — the standing rules Claude Code reads every session; this template assumes
  them, so work orders stay short.
- The **verification harness** — the mechanical half of "self-verify". Build it once,
  then every work order's "Verify by" points at it.

## Why this holds the line
The original problems were divergence and slow oversight. This loop fixes both: divergence
is caught at the plan, before code; oversight drops to two cheap checkpoints; and the
"stop and kick back, don't guess" rule keeps the execution phase from re-introducing the
overstated-API mistakes the way the planning phase used to.

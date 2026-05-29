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
1. **Chat — spec.** Resolve the question/decision. If a durable rule changed, update the
   relevant doc (`TABLEAU_API_REALITY.md`, `CHART_SPEC.md`, `STYLE_SPEC.md`, `CLAUDE.md`).
   Output one **work order** for one milestone-sized unit, with acceptance criteria.
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

Acceptance criteria (definition of done — all must hold):
- [ ] <checkable outcome>
- [ ] <checkable outcome>

Constraints (hard):
- Tokens only (STYLE_SPEC); no ES2020 (no ?? / ?.); single file; size from offsetWidth/Height
- Verify any unconfirmed Tableau capability before building on it (TABLEAU_API_REALITY rules 3 & 6)
- Do not change the specs or architecture — if one needs changing, stop and ask in chat

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

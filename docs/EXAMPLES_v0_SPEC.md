# Examples extension — v0 spike brief

Last updated: 2026-06-12
Status: SPIKE. Throwaway data wiring, keepable rendering shell.
Lives OUTSIDE the pipeline project (no PIPELINE_STATE.md, no CLAUDE.md).
This is front-end prototype work — a standalone Network Enabled Tableau
dashboard extension with hardcoded data.

---

## 1. What this is

A separate Tableau dashboard extension that renders a **qualitative case
study** to anchor a single indicator's quantitative reading. It is the
"queen" of the new extension: a real post / video / webpage that makes an
abstract metric concrete, with the number doing its own job beside it.

v0 exists to answer two questions cheaply, before any data is wired:

1. **Does it render?** Will a YouTube embed (and a webpage-preview card)
   render inside a Network Enabled extension iframe, in the client's actual
   Tableau environment, under the host's CSP/clickjack protection?
2. **Does it feel right?** Is the card layout — queen, support stats,
   chart + BAN, characterisation — the right shape, at the widths it will
   actually be given?

## 2. What v0 deliberately does NOT do

- No Snowflake / `run_id` keying / `SCORER_EXAMPLES` table.
- No engine module, no generation, no LLM call.
- No server-side OG fetch, no Meta token, no live support-stat fetch.
- No real curation. Data is hardcoded in one place behind a single
  swappable seam (`getExamplesForIndicator`).

The moment a spike reads committed data it stops being cheap and stops
being throwaway. Hold the line.

## 3. The card model (locked in design discussion)

One composable card, parameterised by indicator. Four elements:

- **Case study — the queen.** Embedded post/video, or a webpage-preview
  card. The reason the extension exists. Visually dominant.
- **Support stats.** The artifact's *own* reach — views, likes, comments,
  shares. They justify why this example earns its place. In v1 these come
  from the **platform**, snapshotted at generation (real, frozen "as of"
  the run) — never from the LLM, never confused with the committed metric.
- **Chart + BAN.** The committed indicator metric, doing its own
  quantitative job: a headline figure (BAN) plus an optional comparative
  bar. In v1 this comes by join to committed pipeline data.
- **Characterisation — always present.** LLM-derived 'typical' reactions /
  comments. Characterised, never verbatim (copyright- and privacy-clean).

The card **reads the indicator parameter** to self-configure. One widget,
no per-indicator design — an indicator differs only in which elements are
populated and how rich the queen is.

## 4. Architecture decisions carried in from design

- **Separate extension**, not folded into the chart extension — isolates
  the network / embed / copyright surface from the (stable) charting
  extension and lets the spike iterate without risk to production.
- **Coordinated by a shared indicator parameter**, not cross-extension
  messaging. Both the chart extension and this one subscribe to the same
  selected-indicator parameter. (Confirm the chart extension is Network
  Enabled, not Sandboxed — if Sandboxed, separation is mandatory anyway.)
- **Responsive from the start.** The card reflows between a wide band and
  a narrow stacked column based on its own frame width, so placement never
  forces the chart extension to be redesigned narrow. Default placement is
  a full-width band **beneath** the chart (or an on-demand floating
  drawer) — never a fixed side-by-side tile that steals the chart's width.
- **Permitted-use media only.** Official embeds (oEmbed/iframe) and OG
  webpage previews — both are the platform/owner's intended third-party
  display path. No scraped screenshots. A rendered chart is the *anchored
  quant*, never the qualitative visual.

## 5. The three test indicators (chosen to stress the model)

Picked to span the archetypes, not one happy path:

- **`ebl` (engagement beyond likes)** — rich: YouTube embed + heavy
  support stats + comments characterisation. The flagship case.
- **`dvtr` (distinctive verbal tone)** — showcase: the embed *is* the
  evidence, the stat is weak. Tests the queen carrying a thin quant.
- **`tam` (total addressable market)** — floor: a webpage-preview card
  (market-intel page) + a headline BAN, no brand support stats. Tests the
  "no social post" rescue and the thin-card risk.

If one card design carries those three, it carries the other twelve.

## 6. Exit criteria

v0 is done when, in the client's real Tableau environment:

- [x] YouTube embed renders inside the extension iframe — requires `youtube.com` (not `youtube-nocookie.com`) + `?origin=<host>`. Tested 2026-06-12.
- [x] The webpage-preview card renders (image hotlinked) — external `img-src` not blocked by Tableau Cloud CSP. Tested 2026-06-12.
- [ ] The card reflows cleanly between a wide band and a narrow column —
      the queen survives being squeezed.
- [ ] The card reads a Tableau parameter for the selected indicator and
      re-renders on change.
- [ ] Stakeholders agree the rough feel of the card.

Then: settle the open items (extension type, v1 platform set, token home),
write `EXAMPLES_DESIGN.md` and the v1 spec inside the pipeline project.

## 7. Deploy / test notes

1. **Get the Extensions API library.** Download
   `tableau.extensions.1.latest.js` from the official `tableau/extensions-api`
   repo (`/lib`) and place it at `./lib/tableau.extensions.1.latest.js`
   next to `index.html`. (Not vendored here.)
2. **Host it.** Push `index.html`, `examples.trex`, and `lib/` to the
   GitHub Pages site (this makes it a Network Enabled extension — it must
   be able to make outbound calls for the embed/fonts).
3. **Point the manifest.** Edit `<source-location><url>` in
   `examples.trex` to the GitHub Pages URL of `index.html`. Fill in the
   `author` fields and replace the placeholder icon.
4. **Add to a dashboard.** Objects → Extension → "My Extensions" → pick
   `examples.trex`. Allow it when prompted.
5. **Wire the parameter (optional for first render).** Create a string
   parameter named `Selected Indicator` with values `ebl` / `dvtr` /
   `tam`. The card subscribes to it. Without it, the card falls back to a
   default and the in-card **dev toggle** (remove in v1) lets you flip
   indicators to test all three + the reflow.
6. **Preview the feel without Tableau.** Opening `index.html` directly in
   a browser also renders (the Tableau calls are guarded), so the design
   can be eyeballed before deploy — but the embed-in-sandbox question can
   only be answered inside real Tableau.

## 8. Path forward

- **v0.1** — same shell, swap the hardcoded characterisation for real
  LLM-written 'typical reactions' (hand-run prompts are fine — testing the
  *writing*, not the plumbing) and hand-type a couple of real committed
  indicator values into the BAN to feel the whole exhibit together.
- **v1** — inside the pipeline project: `EXAMPLES_DESIGN.md`,
  `SCORER_EXAMPLES` keyed `(run_id, business_id, indicator_id)`, the engine
  module (joins the blast-radius grep scope), the discovery +
  render-verification guardrail, the OG/Meta-token fetch home, subject
  brand defaulting to the best exemplar with client switchable. The
  rendering shell from v0 graduates; the hardcoded data seam is replaced
  by a query.

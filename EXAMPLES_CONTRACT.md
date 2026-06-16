# EXAMPLES_CONTRACT.md — flat row schema + loadExamples seam

## Flat row fields

Every row in `EXAMPLES_DATA` (and in the future `SCORER_EXAMPLES_VIEW`) carries:

| Field | Type | Notes |
|---|---|---|
| `run_id` | string | Identifies the scoring run (e.g. `"POC_RUN"`). Filter key. |
| `business_id` | string | The **client** running the analysis (e.g. `"ILLY"`). Filter key. NOT the brand in the example — that is `brand`. |
| `indicator_id` | string | Grouping key (e.g. `"svt"`, `"tam"`). Explicit in every row. |
| `brand` | string \| null | The brand **illustrated** by this example (one of the 5 competitive brands), or `null` for `scope='category'`. |
| `scope` | `'brand'` \| `'category'` | Governs coverage rule + drawer layout dispatch. |
| `example_id` | string | Unique per row **within an indicator** (NOT equal to `indicator_id`). Enables >1 row per `(indicator, brand)` and latest-wins dedup. |
| `role` | string | `'client'`, `'exemplar'`, `'competitor'`, or `'category'`. |
| `source` | string | Human-readable origin label (e.g. `"YouTube"`, `"Google Trends"`, `"Social"`, `"Report"`). |
| `embed` | object | Media descriptor — see **Embed platforms** below. |
| `own_stats` | `[{k,v}]` | Artifact's own reach/engagement stats. Array of `{k: label, v: value}`. |
| `summary_text` | string | Characterised summary. Illustrative — its own reach, not the score. |
| `comment_digest` | string \| null | Reserved for Phase-B digest extraction. |
| `market_note` | string (optional) | Used for `scope='category'` rows to populate `ind.note` in the drawer. |
| `layout_hint` | string (optional) | Reserved; not read by `loadExamples` or `detectLayout`. |

### Reserved (unused now, for real search)
`rank`, `relevance`, `query`, `discovered_at`

---

## Embed platforms (`embed.platform`)

`embedToMedia(embed)` is the single extension point for media types:

| `embed.platform` | Result `media.type` | Notes |
|---|---|---|
| `'youtube'` | `'youtube'` | `embed.id` = YouTube video ID (non-null/non-REPLACE_ID → live iframe). |
| `'trends'` | `'trends'` | With `embed.query` → `live:true` (Google Trends widget). Without → sparkline-only render. |
| `'link'` | `'webpage'` | `embed.url`, `embed.title`, `embed.source`, `embed.desc` → web card. |
| `'placeholder'` | `'placeholder'` | `embed.note` = descriptive label. Renders a styled placeholder tile. |

Add new platform cases **only in `embedToMedia`** — never in the renderers.

---

## Scope rule

- **`scope='brand'`**: per-brand indicators. Every brand in the competitive set must have ≥1 row for `detectLayout` brand toggles to work. Base coverage: 1 row per brand (5 rows total → `"strip"` layout).
- **`scope='category'`**: market indicators (`tam`, `cagr`, `mcon`). Exactly **one** row per indicator; `brand=null`. Renders as `"source-strip"` via `detectLayout`.

---

## `loadExamples(runId, businessId)` — filter / group / latest-wins

```
loadExamples(runId, businessId)
  → filter EXAMPLES_DATA where run_id === runId AND business_id === businessId
  → group by indicator_id
  → within each group, deduplicate by key = brand + '|' + example_id (latest row wins)
  → return { indicator_id: [rows] }  ← same shape the drawer consumes
```

`rowToExample(r)` maps each row to the drawer's example object: `{brand, role, source, media, own, react}`.

---

## Real-view swap

When `SCORER_EXAMPLES_VIEW` is live, replace only the body of `loadExamples` with a `getSummaryDataAsync` call on that view, mapping its columns to the same flat row shape. The filter/group/latest-wins logic, `rowToExample`, `embedToMedia`, and all drawer code remain unchanged.

Column contract for `SCORER_EXAMPLES_VIEW` (to be confirmed at swap time in `TABLEAU_API_REALITY.md`):
`run_id`, `business_id`, `indicator_id`, `brand`, `scope`, `example_id`, `role`, `source`, `embed_platform`, `embed_id`, `embed_query`, `embed_geo`, `embed_time`, `embed_url`, `embed_title`, `embed_source`, `embed_desc`, `own_stats_json`, `summary_text`, `comment_digest`, `market_note`, `rank`, `relevance`, `discovered_at`

Fields on Rows/Columns shelf: every column the read uses (Tableau fields-on-shelf constraint — see `TABLEAU_API_REALITY.md`).

---

*Last updated: 2026-06-16 (EX-W4 — data externalisation)*

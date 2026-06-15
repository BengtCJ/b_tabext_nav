/* ============================================================================
   EXAMPLES_SEED.js — Phase 2A static seed (the complete example layer)

   SINGLE SOURCE OF EXAMPLE CONTENT for all 15 live indicators. The prototype
   (index_examples_proto.html) and the graduated extension (index_examples.html)
   both read this via loadExamples() — there is no other copy.

   Each entry is keyed by example_id and is shaped like one future
   SCORER_EXAMPLES_VIEW row, so Phase 2B is a one-line swap of loadExamples()'s
   body (read the view instead of this object). The drawer consumes a lighter
   shape; rowToExample() (in the extension) adapts a row to it:

     business_id   <- brand            embed.platform 'youtube' {id}
     role                              embed.platform 'trends'  {query?,sparkline}
     source                            embed.platform 'link'    {url,title,desc}
     embed         <- media            embed.platform 'placeholder' {note}
     own_stats     <- own  (REAL pull, refresh each time; never model-authored)
     summary_text  <- react (hand-written now; LLM-generated in Phase B)
     comment_digest        (null now; LLM abstracts comments in Phase B)
     market_note           (category/source-strip indicators only)
     layout_hint           (optional override; else auto-detected from rows)

   Real now: embed (a one-time static pull) + own_stats. Placeholder embeds mark
   exactly what the pull/pipeline must still fill.
   ============================================================================ */

const RUN_ID = "POC_RUN";

const EXAMPLES_SEED = {
    "tam": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "tam",
        "role": "category",
        "source": "YouTube",
        "embed": {
          "platform": "youtube",
          "id": null
        },
        "own_stats": [
          {
            "k": "views",
            "v": "840K"
          }
        ],
        "summary_text": "A category-sizing explainer — what a $4.2B premium segment looks like. Illustrative context, not a brand result.",
        "comment_digest": null,
        "market_note": "Category-level context — the headroom the brand plays into, not a brand-specific result.",
        "layout_hint": "source-strip"
      }
    ],
    "cagr": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "cagr",
        "role": "category",
        "source": "YouTube",
        "embed": {
          "platform": "youtube",
          "id": null
        },
        "own_stats": [
          {
            "k": "views",
            "v": "410K"
          }
        ],
        "summary_text": "A growth-outlook explainer — why premium coffee is compounding. Illustrative, not a brand result.",
        "comment_digest": null,
        "market_note": "Category growth context — the tailwind the brand rides, not a brand-specific result.",
        "layout_hint": "source-strip"
      }
    ],
    "svt": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "svt_1",
        "role": "client",
        "source": "Google Trends",
        "embed": {
          "platform": "trends",
          "query": "illy",
          "geo": "US",
          "time": "today 12-m",
          "sparkline": [
            20,
            22,
            19,
            24,
            21,
            23,
            20,
            26,
            22,
            21,
            23,
            22
          ]
        },
        "own_stats": [
          {
            "k": "peak",
            "v": "26"
          }
        ],
        "summary_text": "Live Google Trends for “illy” — branded search over 12 months. A real Trends artifact, not the score.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "svt_2",
        "role": "client",
        "source": "Google Trends",
        "embed": {
          "platform": "trends",
          "sparkline": [
            12,
            14,
            11,
            13,
            18,
            16,
            14,
            12,
            15,
            13,
            12,
            14
          ]
        },
        "own_stats": [
          {
            "k": "query",
            "v": "“illy pods”"
          }
        ],
        "summary_text": "Product-query interest is thin against pod-led peers.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "svt_3",
        "role": "client",
        "source": "Google Trends",
        "embed": {
          "platform": "trends",
          "sparkline": [
            8,
            9,
            10,
            12,
            15,
            19,
            22,
            26,
            30,
            33,
            36,
            38
          ]
        },
        "own_stats": [
          {
            "k": "query",
            "v": "sustainable coffee"
          }
        ],
        "summary_text": "A rising category query the brand could lean into.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "svt_4",
        "role": "client",
        "source": "Google Trends",
        "embed": {
          "platform": "trends",
          "sparkline": [
            30,
            28,
            26,
            24,
            22,
            20,
            18,
            17,
            16,
            15,
            14,
            13
          ]
        },
        "own_stats": [
          {
            "k": "query",
            "v": "“capsules”"
          }
        ],
        "summary_text": "Declining generic interest — context, not a brand result.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "svt_5",
        "role": "client",
        "source": "Google Trends",
        "embed": {
          "platform": "trends",
          "sparkline": [
            18,
            19,
            17,
            20,
            22,
            21,
            24,
            23,
            25,
            24,
            26,
            27
          ]
        },
        "own_stats": [
          {
            "k": "query",
            "v": "“espresso at home”"
          }
        ],
        "summary_text": "At-home espresso interest ticking up.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "svt_6",
        "role": "client",
        "source": "Google Trends",
        "embed": {
          "platform": "trends",
          "sparkline": [
            22,
            24,
            21,
            23,
            20,
            22,
            19,
            21,
            18,
            20,
            19,
            18
          ]
        },
        "own_stats": [
          {
            "k": "region",
            "v": "US metros"
          }
        ],
        "summary_text": "Interest concentrates in a few metros; national reach is shallow.",
        "comment_digest": null
      }
    ],
    "sop": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sop_1",
        "role": "client",
        "source": "YouTube",
        "embed": {
          "platform": "youtube",
          "id": "Ym1xYASwZS0"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "220K"
          }
        ],
        "summary_text": "illy vs the field on roast depth — a comparison clip; choice content, not the preference score.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sop_2",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "blind taste test"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "410K"
          }
        ],
        "summary_text": "Blind taste test; preference split on body.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sop_3",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "pods vs beans"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "180K"
          }
        ],
        "summary_text": "Format comparison — where illy wins and loses.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sop_4",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "barista pick"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "96K"
          }
        ],
        "summary_text": "A barista's head-to-head pick.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sop_5",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "price-vs-quality"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "140K"
          }
        ],
        "summary_text": "The value comparison viewers keep making.",
        "comment_digest": null
      }
    ],
    "cra": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "cra_1",
        "role": "client",
        "source": "Press",
        "embed": {
          "platform": "placeholder",
          "note": "funnel write-up"
        },
        "own_stats": [
          {
            "k": "source",
            "v": "analytics"
          }
        ],
        "summary_text": "A conversion-funnel write-up vs competitors — thin on social artifact; link-card floor.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "cra_2",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "DTC funnel"
        },
        "own_stats": [
          {
            "k": "source",
            "v": "case study"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "cra_3",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "app funnel"
        },
        "own_stats": [
          {
            "k": "source",
            "v": "report"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "cra_4",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "store funnel"
        },
        "own_stats": [
          {
            "k": "source",
            "v": "note"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "cra_5",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "retail funnel"
        },
        "own_stats": [
          {
            "k": "source",
            "v": "note"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      }
    ],
    "bss": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "bss_1",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 1"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "40K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "bss_2",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 2"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "55K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "bss_3",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 3"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "70K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "bss_4",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 1"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "40K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "bss_5",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 2"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "55K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "bss_6",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 3"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "70K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "bss_7",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 4"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "85K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "bss_8",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 5"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "100K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "bss_9",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 1"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "40K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "bss_10",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 2"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "55K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "bss_11",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 3"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "70K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "bss_12",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 4"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "85K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "bss_13",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 1"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "40K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "bss_14",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 2"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "55K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "bss_15",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 1"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "40K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "bss_16",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "search result 2"
        },
        "own_stats": [
          {
            "k": "impressions",
            "v": "55K"
          }
        ],
        "summary_text": "A branded-search result in the set.",
        "comment_digest": null
      }
    ],
    "dvtr": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "dvtr_1",
        "role": "client",
        "source": "YouTube",
        "embed": {
          "platform": "youtube",
          "id": "j3GAuYfQSSA"
        },
        "own_stats": [
          {
            "k": "shares",
            "v": "3.4K"
          }
        ],
        "summary_text": "illy's own voice on screen — the tone carries it; the stat is incidental (showcase).",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "dvtr_2",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "caption post"
        },
        "own_stats": [
          {
            "k": "shares",
            "v": "9K"
          }
        ],
        "summary_text": "A recognisable house voice.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "dvtr_3",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "brand reply"
        },
        "own_stats": [
          {
            "k": "shares",
            "v": "6K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "dvtr_4",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "caption"
        },
        "own_stats": [
          {
            "k": "shares",
            "v": "1K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "dvtr_5",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "ad voiceover"
        },
        "own_stats": [
          {
            "k": "shares",
            "v": "2K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      }
    ],
    "sstsr": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sstsr_1",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "hook short 1"
        },
        "own_stats": [
          {
            "k": "3s view",
            "v": "62%"
          }
        ],
        "summary_text": "The scroll-stopper — a hooky first-3-seconds short.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sstsr_2",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "hook short 2"
        },
        "own_stats": [
          {
            "k": "3s view",
            "v": "48%"
          }
        ],
        "summary_text": "A weaker open; viewers drop before the reveal.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sstsr_3",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "hook short 3"
        },
        "own_stats": [
          {
            "k": "3s view",
            "v": "55%"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sstsr_4",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "hook short 4"
        },
        "own_stats": [
          {
            "k": "3s view",
            "v": "51%"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sstsr_5",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "hook short 5"
        },
        "own_stats": [
          {
            "k": "3s view",
            "v": "44%"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sstsr_6",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "hook short 6"
        },
        "own_stats": [
          {
            "k": "3s view",
            "v": "58%"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      }
    ],
    "eqr": [
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "eqr_1",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "saves-heavy reel"
        },
        "own_stats": [
          {
            "k": "saves",
            "v": "31K"
          }
        ],
        "summary_text": "Saves and shares beat likes — quality over volume.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "eqr_2",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "tutorial"
        },
        "own_stats": [
          {
            "k": "shares",
            "v": "18K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "eqr_3",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "client reel"
        },
        "own_stats": [
          {
            "k": "saves",
            "v": "2.4K"
          }
        ],
        "summary_text": "Some saves, lighter sharing.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "eqr_4",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "recipe post"
        },
        "own_stats": [
          {
            "k": "shares",
            "v": "1.1K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "eqr_5",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "clip"
        },
        "own_stats": [
          {
            "k": "shares",
            "v": "12K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "eqr_6",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "poll"
        },
        "own_stats": [
          {
            "k": "saves",
            "v": "6K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "eqr_7",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "reel"
        },
        "own_stats": [
          {
            "k": "saves",
            "v": "4K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "eqr_8",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "post"
        },
        "own_stats": [
          {
            "k": "shares",
            "v": "800"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      }
    ],
    "sov": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sov_1",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 1"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "300K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sov_2",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 2"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "500K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "sov_3",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 3"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "700K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "sov_4",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 1"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "300K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "sov_5",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 2"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "500K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "sov_6",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 3"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "700K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "sov_7",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 4"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "900K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "sov_8",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 5"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "1100K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "sov_9",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 1"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "300K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "sov_10",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 2"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "500K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "sov_11",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 3"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "700K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "sov_12",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 4"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "900K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "sov_13",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 1"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "300K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "sov_14",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 2"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "500K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "sov_15",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 1"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "300K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "sov_16",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 2"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "500K"
          }
        ],
        "summary_text": "A mention in the conversation.",
        "comment_digest": null
      }
    ],
    "vom": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "vom_1",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 1"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "2K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "vom_2",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 2"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "3K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "vom_3",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 3"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "4K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "vom_4",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 1"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "2K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "vom_5",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 2"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "3K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "vom_6",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 3"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "4K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "vom_7",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 4"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "5K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "vom_8",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 5"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "6K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "vom_9",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 1"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "2K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "vom_10",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 2"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "3K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "vom_11",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 3"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "4K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "vom_12",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 4"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "5K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "vom_13",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 5"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "6K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "vom_14",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 1"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "2K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "vom_15",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 2"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "3K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "vom_16",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 1"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "2K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "vom_17",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 2"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "3K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "vom_18",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "mention 3"
        },
        "own_stats": [
          {
            "k": "reach",
            "v": "4K"
          }
        ],
        "summary_text": "A mention in the spike.",
        "comment_digest": null
      }
    ],
    "nps": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "nps_1",
        "role": "client",
        "source": "YouTube",
        "embed": {
          "platform": "youtube",
          "id": "Zr14oI1mGyM"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "318K"
          },
          {
            "k": "likes",
            "v": "12K"
          }
        ],
        "summary_text": "A 'why I recommend illy' advocacy review — illustrative of loyalty, not a measure of it.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "nps_2",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "switch story"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "1.1M"
          }
        ],
        "summary_text": "A high-reach 'why I switched' video.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "nps_3",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "loyalty vlog"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "540K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "nps_4",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "recommend"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "96K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "nps_5",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "review"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "210K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      }
    ],
    "ba": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "ba_1",
        "role": "client",
        "source": "YouTube",
        "embed": {
          "platform": "youtube",
          "id": "Ym1xYASwZS0"
        },
        "own_stats": [
          {
            "k": "likes",
            "v": "24K"
          }
        ],
        "summary_text": "An unprompted morning-ritual video featuring illy — affinity shown, not asked for.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "ba_2",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "fan ritual"
        },
        "own_stats": [
          {
            "k": "likes",
            "v": "12K"
          }
        ],
        "summary_text": "A daily-ritual post; quiet, habitual affection.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "ba_3",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "desk setup"
        },
        "own_stats": [
          {
            "k": "likes",
            "v": "8K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "ba_4",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "ritual reel"
        },
        "own_stats": [
          {
            "k": "likes",
            "v": "58K"
          }
        ],
        "summary_text": "Strong unprompted affection.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "ba_5",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "collection"
        },
        "own_stats": [
          {
            "k": "likes",
            "v": "41K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "ba_6",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "haul"
        },
        "own_stats": [
          {
            "k": "likes",
            "v": "31K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "ba_7",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "routine"
        },
        "own_stats": [
          {
            "k": "likes",
            "v": "22K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "ba_8",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "ritual"
        },
        "own_stats": [
          {
            "k": "likes",
            "v": "15K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "ba_9",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "routine"
        },
        "own_stats": [
          {
            "k": "likes",
            "v": "9K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      }
    ],
    "ebl": [
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "ebl_1",
        "role": "exemplar",
        "source": "YouTube",
        "embed": {
          "platform": "youtube",
          "id": null
        },
        "own_stats": [
          {
            "k": "comments",
            "v": "9.7K"
          }
        ],
        "summary_text": "Comments run long and conversational — viewers debate technique and tag friends.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "ebl_2",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "reel thread"
        },
        "own_stats": [
          {
            "k": "comments",
            "v": "6.1K"
          }
        ],
        "summary_text": "Strong reply threads carry the conversation.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "ebl_3",
        "role": "client",
        "source": "YouTube",
        "embed": {
          "platform": "youtube",
          "id": "j3GAuYfQSSA"
        },
        "own_stats": [
          {
            "k": "comments",
            "v": "1.1K"
          }
        ],
        "summary_text": "An illy coffee-shops clip — a real comment thread to abstract in Phase B.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "ebl_4",
        "role": "client",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "client post"
        },
        "own_stats": [
          {
            "k": "saves",
            "v": "820"
          }
        ],
        "summary_text": "Some saves, little discussion.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "ebl_5",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "clip"
        },
        "own_stats": [
          {
            "k": "comments",
            "v": "4.0K"
          }
        ],
        "summary_text": "High views, lighter discussion.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "ebl_6",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "poll post"
        },
        "own_stats": [
          {
            "k": "replies",
            "v": "3.2K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "ebl_7",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "reel"
        },
        "own_stats": [
          {
            "k": "comments",
            "v": "2.2K"
          }
        ],
        "summary_text": "Steady engagement.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "ebl_8",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "story set"
        },
        "own_stats": [
          {
            "k": "replies",
            "v": "1.4K"
          }
        ],
        "summary_text": "A representative artifact in the wild.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "ebl_9",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "post"
        },
        "own_stats": [
          {
            "k": "comments",
            "v": "410"
          }
        ],
        "summary_text": "Limited reach.",
        "comment_digest": null
      }
    ],
    "bt": [
      {
        "run_id": "POC_RUN",
        "business_id": "ILLY",
        "example_id": "bt_1",
        "role": "client",
        "source": "YouTube",
        "embed": {
          "platform": "youtube",
          "id": "Zr14oI1mGyM"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "318K"
          },
          {
            "k": "likes",
            "v": "12K"
          }
        ],
        "summary_text": "illy's own brand film — heritage and craft. Illustrative of the trust the survey captures, not a measure of it.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "NESPRESSO",
        "example_id": "bt_2",
        "role": "exemplar",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "sustainability explainer"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "1.1M"
          }
        ],
        "summary_text": "Widely-shared explainer; reach reflects spread, not the trust score.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "PEETS",
        "example_id": "bt_3",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "founder story"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "96K"
          }
        ],
        "summary_text": "Founder-story piece; modest reach.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "STARBUCKS",
        "example_id": "bt_4",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "news segment"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "540K"
          }
        ],
        "summary_text": "Mixed-sentiment news segment.",
        "comment_digest": null
      },
      {
        "run_id": "POC_RUN",
        "business_id": "LAVAZZA",
        "example_id": "bt_5",
        "role": "competitor",
        "source": "Social",
        "embed": {
          "platform": "placeholder",
          "note": "heritage film"
        },
        "own_stats": [
          {
            "k": "views",
            "v": "210K"
          }
        ],
        "summary_text": "Heritage brand film.",
        "comment_digest": null
      }
    ]
  };

/* Phase A: return the seed. Phase B swap:
   async function loadExamples(runId, businessId){
     const rows = await readView('SCORER_EXAMPLES_VIEW', {run_id:runId, business_id:businessId});
     const map = {}; rows.forEach(r => (map[r.example_id.replace(/_\d+$/,'')] ||= []).push(r));
     return map;
   }                                                   // same row shape — drawer unchanged */
function loadExamples(runId, businessId){ return EXAMPLES_SEED; }

if (typeof module !== "undefined") module.exports = { EXAMPLES_SEED, RUN_ID, loadExamples };

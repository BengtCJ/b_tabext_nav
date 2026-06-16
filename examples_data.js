"use strict";
// EXAMPLES_DATA — flat row array; one row per (run_id, business_id, indicator_id, brand, example_id).
// Schema: see EXAMPLES_CONTRACT.md
// Swap seam: loadExamples() filters by run_id + business_id, groups by indicator_id,
// latest-wins per (indicator_id, brand, example_id). The drawer and adapters are unchanged.
var EXAMPLES_DATA = [

// ── MARKET INDICATORS (scope='category', brand=null) ──────────────────────────

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"tam",brand:null,scope:"category",
 example_id:"tam_1",role:"category",source:"YouTube",
 embed:{platform:"youtube",id:null},own_stats:[{k:"views",v:"840K"}],
 summary_text:"A category-sizing explainer — what a $4.2B premium segment looks like. Illustrative context, not a brand result.",
 comment_digest:null,market_note:"Category-level context — the headroom the brand plays into, not a brand-specific result.",layout_hint:"source-strip"},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"cagr",brand:null,scope:"category",
 example_id:"cagr_1",role:"category",source:"YouTube",
 embed:{platform:"youtube",id:null},own_stats:[{k:"views",v:"410K"}],
 summary_text:"A growth-outlook explainer — why premium coffee is compounding. Illustrative, not a brand result.",
 comment_digest:null,market_note:"Category growth context — the tailwind the brand rides, not a brand-specific result.",layout_hint:"source-strip"},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"mcon",brand:null,scope:"category",
 example_id:"mcon_1",role:"category",source:"Report",
 embed:{platform:"placeholder",note:"market concentration report"},own_stats:[{k:"coverage",v:"10 brands"}],
 summary_text:"A market-structure report — where share is concentrated and how it shifts. Illustrative context, not a brand result.",
 comment_digest:null,market_note:"Category-level context — the competitive structure the brand operates within.",layout_hint:"source-strip"},

// ── SVT — Search Volume and Trends (scope='brand', media: Google Trends) ─────────────
// ILLY row preserved from Phase-2A verified seed. Other brands are scaffold rows.

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"svt",brand:"ILLY",scope:"brand",
 example_id:"svt_1",role:"client",source:"Google Trends",
 embed:{platform:"trends",query:"illy",geo:"US",time:"today 12-m",sparkline:[20,22,19,24,21,23,20,26,22,21,23,22]},
 own_stats:[{k:"peak",v:"26"}],
 summary_text:"Live Google Trends for “illy” — branded search over 12 months. A real Trends artifact, not the score.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"svt",brand:"NESPRESSO",scope:"brand",
 example_id:"svt_2",role:"exemplar",source:"Google Trends",
 embed:{platform:"trends",query:"nespresso",geo:"US",time:"today 12-m",sparkline:[75,78,80,82,81,84,85,88,86,84,87,90]},
 own_stats:[{k:"peak",v:"90"}],
 summary_text:"Nespresso dominates branded search — consistently high volume. Illustrative of category leadership, not the score.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"svt",brand:"STARBUCKS",scope:"brand",
 example_id:"svt_3",role:"competitor",source:"Google Trends",
 embed:{platform:"trends",query:"starbucks",geo:"US",time:"today 12-m",sparkline:[65,68,70,72,69,74,76,75,73,77,80,79]},
 own_stats:[{k:"peak",v:"80"}],
 summary_text:"Starbucks search volume stays high year-round with a seasonal peak. Illustrative, not the score.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"svt",brand:"PEETS",scope:"brand",
 example_id:"svt_4",role:"competitor",source:"Google Trends",
 embed:{platform:"trends",query:"peet's coffee",geo:"US",time:"today 12-m",sparkline:[28,30,29,32,31,30,28,33,31,30,32,29]},
 own_stats:[{k:"peak",v:"33"}],
 summary_text:"Peet’s search volume is modest and regional. Illustrative, not the score.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"svt",brand:"LAVAZZA",scope:"brand",
 example_id:"svt_5",role:"competitor",source:"Google Trends",
 embed:{platform:"trends",query:"lavazza",geo:"US",time:"today 12-m",sparkline:[38,40,39,42,41,44,43,46,44,43,45,46]},
 own_stats:[{k:"peak",v:"46"}],
 summary_text:"Lavazza search interest is moderate and slowly rising. Illustrative, not the score.",
 comment_digest:null},

// ── SOP — Share of Preference (scope='brand', media: link/youtube) ─────────────────
// ILLY row (sop_1, YouTube Ym1xYASwZS0) preserved from Phase-2A verified seed.

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sop",brand:"ILLY",scope:"brand",
 example_id:"sop_1",role:"client",source:"YouTube",
 embed:{platform:"youtube",id:"Ym1xYASwZS0"},own_stats:[{k:"views",v:"220K"}],
 summary_text:"illy vs the field on roast depth — a comparison clip; choice content, not the preference score.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sop",brand:"NESPRESSO",scope:"brand",
 example_id:"sop_2",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"preference survey reveal"},own_stats:[{k:"views",v:"1.2M"}],
 summary_text:"A Nespresso preference reveal — voted top in blind tasting. Illustrative, not the survey score.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sop",brand:"STARBUCKS",scope:"brand",
 example_id:"sop_3",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"taste test"},own_stats:[{k:"views",v:"840K"}],
 summary_text:"A Starbucks taste test clip — broad reach, mixed preference signals.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sop",brand:"PEETS",scope:"brand",
 example_id:"sop_4",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"preference clip"},own_stats:[{k:"views",v:"96K"}],
 summary_text:"A Peet’s preference clip — regional loyalty, limited national reach.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sop",brand:"LAVAZZA",scope:"brand",
 example_id:"sop_5",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"choice content"},own_stats:[{k:"views",v:"210K"}],
 summary_text:"A Lavazza preference piece — European positioning resonates with niche audience.",
 comment_digest:null},

// ── CRA — Conversion Rate Analysis (scope='brand', media: link) ─────────────────────

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"cra",brand:"ILLY",scope:"brand",
 example_id:"cra_1",role:"client",source:"Press",
 embed:{platform:"placeholder",note:"funnel write-up"},own_stats:[{k:"source",v:"analytics"}],
 summary_text:"A conversion-funnel write-up vs competitors — thin on social artifact; link-card floor.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"cra",brand:"NESPRESSO",scope:"brand",
 example_id:"cra_2",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"DTC funnel"},own_stats:[{k:"source",v:"case study"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"cra",brand:"STARBUCKS",scope:"brand",
 example_id:"cra_3",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"app funnel"},own_stats:[{k:"source",v:"report"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"cra",brand:"PEETS",scope:"brand",
 example_id:"cra_4",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"store funnel"},own_stats:[{k:"source",v:"note"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"cra",brand:"LAVAZZA",scope:"brand",
 example_id:"cra_5",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"retail funnel"},own_stats:[{k:"source",v:"note"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

// ── BSS — Branded Search Share (scope='brand', media: link/placeholder, mosaic layout) ─

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"ILLY",scope:"brand",
 example_id:"bss_1",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"search result 1"},own_stats:[{k:"impressions",v:"40K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"ILLY",scope:"brand",
 example_id:"bss_2",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"search result 2"},own_stats:[{k:"impressions",v:"55K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"ILLY",scope:"brand",
 example_id:"bss_3",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"search result 3"},own_stats:[{k:"impressions",v:"70K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"NESPRESSO",scope:"brand",
 example_id:"bss_4",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"search result 1"},own_stats:[{k:"impressions",v:"40K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"NESPRESSO",scope:"brand",
 example_id:"bss_5",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"search result 2"},own_stats:[{k:"impressions",v:"55K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"NESPRESSO",scope:"brand",
 example_id:"bss_6",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"search result 3"},own_stats:[{k:"impressions",v:"70K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"NESPRESSO",scope:"brand",
 example_id:"bss_7",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"search result 4"},own_stats:[{k:"impressions",v:"85K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"NESPRESSO",scope:"brand",
 example_id:"bss_8",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"search result 5"},own_stats:[{k:"impressions",v:"100K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"STARBUCKS",scope:"brand",
 example_id:"bss_9",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"search result 1"},own_stats:[{k:"impressions",v:"40K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"STARBUCKS",scope:"brand",
 example_id:"bss_10",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"search result 2"},own_stats:[{k:"impressions",v:"55K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"STARBUCKS",scope:"brand",
 example_id:"bss_11",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"search result 3"},own_stats:[{k:"impressions",v:"70K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"STARBUCKS",scope:"brand",
 example_id:"bss_12",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"search result 4"},own_stats:[{k:"impressions",v:"85K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"PEETS",scope:"brand",
 example_id:"bss_13",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"search result 1"},own_stats:[{k:"impressions",v:"40K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"PEETS",scope:"brand",
 example_id:"bss_14",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"search result 2"},own_stats:[{k:"impressions",v:"55K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"LAVAZZA",scope:"brand",
 example_id:"bss_15",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"search result 1"},own_stats:[{k:"impressions",v:"40K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bss",brand:"LAVAZZA",scope:"brand",
 example_id:"bss_16",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"search result 2"},own_stats:[{k:"impressions",v:"55K"}],
 summary_text:"A branded-search result in the set.",comment_digest:null},

// ── DVTR — Distinctive Verbal Tone Recognition (scope='brand', media: link/youtube) ─
// ILLY row (dvtr_1, YouTube j3GAuYfQSSA) preserved from Phase-2A verified seed.

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"dvtr",brand:"ILLY",scope:"brand",
 example_id:"dvtr_1",role:"client",source:"YouTube",
 embed:{platform:"youtube",id:"j3GAuYfQSSA"},own_stats:[{k:"shares",v:"3.4K"}],
 summary_text:"illy’s own voice on screen — the tone carries it; the stat is incidental (showcase).",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"dvtr",brand:"NESPRESSO",scope:"brand",
 example_id:"dvtr_2",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"caption post"},own_stats:[{k:"shares",v:"9K"}],
 summary_text:"A recognisable house voice.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"dvtr",brand:"STARBUCKS",scope:"brand",
 example_id:"dvtr_3",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"brand reply"},own_stats:[{k:"shares",v:"6K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"dvtr",brand:"PEETS",scope:"brand",
 example_id:"dvtr_4",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"caption"},own_stats:[{k:"shares",v:"1K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"dvtr",brand:"LAVAZZA",scope:"brand",
 example_id:"dvtr_5",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"ad voiceover"},own_stats:[{k:"shares",v:"2K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

// ── SSTSR — Scroll-stop / Thumb-stop Ratio (scope='brand', media: youtube/social) ────
// ILLY row preserved; other brands are scaffold placeholder rows.

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sstsr",brand:"ILLY",scope:"brand",
 example_id:"sstsr_1",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"hook short"},own_stats:[{k:"3s view",v:"62%"}],
 summary_text:"The scroll-stopper — a hooky first-3-seconds short.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sstsr",brand:"NESPRESSO",scope:"brand",
 example_id:"sstsr_2",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"hook reel"},own_stats:[{k:"3s view",v:"78%"}],
 summary_text:"Nespresso’s best-performing scroll-stopper — high 3s view rate. Illustrative, not the score.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sstsr",brand:"STARBUCKS",scope:"brand",
 example_id:"sstsr_3",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"seasonal hook"},own_stats:[{k:"3s view",v:"71%"}],
 summary_text:"A Starbucks seasonal hook — high thumb-stop rate around product launch.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sstsr",brand:"PEETS",scope:"brand",
 example_id:"sstsr_4",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"brew short"},own_stats:[{k:"3s view",v:"44%"}],
 summary_text:"A Peet’s brew short — moderate thumb-stop; regional appeal limits scale.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sstsr",brand:"LAVAZZA",scope:"brand",
 example_id:"sstsr_5",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"lifestyle short"},own_stats:[{k:"3s view",v:"51%"}],
 summary_text:"A Lavazza lifestyle short — European aesthetic, moderate engagement.",
 comment_digest:null},

// ── EQR — Engagement Quality Ratio (scope='brand', media: youtube/social, grid layout) ─

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"eqr",brand:"NESPRESSO",scope:"brand",
 example_id:"eqr_1",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"saves-heavy reel"},own_stats:[{k:"saves",v:"31K"}],
 summary_text:"Saves and shares beat likes — quality over volume.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"eqr",brand:"NESPRESSO",scope:"brand",
 example_id:"eqr_2",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"tutorial"},own_stats:[{k:"shares",v:"18K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"eqr",brand:"ILLY",scope:"brand",
 example_id:"eqr_3",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"client reel"},own_stats:[{k:"saves",v:"2.4K"}],
 summary_text:"Some saves, lighter sharing.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"eqr",brand:"ILLY",scope:"brand",
 example_id:"eqr_4",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"recipe post"},own_stats:[{k:"shares",v:"1.1K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"eqr",brand:"STARBUCKS",scope:"brand",
 example_id:"eqr_5",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"clip"},own_stats:[{k:"shares",v:"12K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"eqr",brand:"STARBUCKS",scope:"brand",
 example_id:"eqr_6",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"poll"},own_stats:[{k:"saves",v:"6K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"eqr",brand:"LAVAZZA",scope:"brand",
 example_id:"eqr_7",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"reel"},own_stats:[{k:"saves",v:"4K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"eqr",brand:"PEETS",scope:"brand",
 example_id:"eqr_8",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"post"},own_stats:[{k:"shares",v:"800"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

// ── SOV — Share of Voice (scope='brand', media: social, mosaic layout) ──────────────

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"ILLY",scope:"brand",
 example_id:"sov_1",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"mention 1"},own_stats:[{k:"reach",v:"300K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"ILLY",scope:"brand",
 example_id:"sov_2",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"mention 2"},own_stats:[{k:"reach",v:"500K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"ILLY",scope:"brand",
 example_id:"sov_3",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"mention 3"},own_stats:[{k:"reach",v:"700K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"NESPRESSO",scope:"brand",
 example_id:"sov_4",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 1"},own_stats:[{k:"reach",v:"300K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"NESPRESSO",scope:"brand",
 example_id:"sov_5",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 2"},own_stats:[{k:"reach",v:"500K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"NESPRESSO",scope:"brand",
 example_id:"sov_6",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 3"},own_stats:[{k:"reach",v:"700K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"NESPRESSO",scope:"brand",
 example_id:"sov_7",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 4"},own_stats:[{k:"reach",v:"900K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"NESPRESSO",scope:"brand",
 example_id:"sov_8",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 5"},own_stats:[{k:"reach",v:"1100K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"STARBUCKS",scope:"brand",
 example_id:"sov_9",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 1"},own_stats:[{k:"reach",v:"300K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"STARBUCKS",scope:"brand",
 example_id:"sov_10",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 2"},own_stats:[{k:"reach",v:"500K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"STARBUCKS",scope:"brand",
 example_id:"sov_11",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 3"},own_stats:[{k:"reach",v:"700K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"STARBUCKS",scope:"brand",
 example_id:"sov_12",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 4"},own_stats:[{k:"reach",v:"900K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"PEETS",scope:"brand",
 example_id:"sov_13",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"mention 1"},own_stats:[{k:"reach",v:"300K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"PEETS",scope:"brand",
 example_id:"sov_14",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"mention 2"},own_stats:[{k:"reach",v:"500K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"LAVAZZA",scope:"brand",
 example_id:"sov_15",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"mention 1"},own_stats:[{k:"reach",v:"300K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"sov",brand:"LAVAZZA",scope:"brand",
 example_id:"sov_16",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"mention 2"},own_stats:[{k:"reach",v:"500K"}],
 summary_text:"A mention in the conversation.",comment_digest:null},

// ── VOM — Velocity of Mentions (scope='brand', media: social, mosaic layout) ──────

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"ILLY",scope:"brand",
 example_id:"vom_1",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"mention 1"},own_stats:[{k:"reach",v:"2K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"ILLY",scope:"brand",
 example_id:"vom_2",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"mention 2"},own_stats:[{k:"reach",v:"3K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"ILLY",scope:"brand",
 example_id:"vom_3",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"mention 3"},own_stats:[{k:"reach",v:"4K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"NESPRESSO",scope:"brand",
 example_id:"vom_4",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 1"},own_stats:[{k:"reach",v:"2K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"NESPRESSO",scope:"brand",
 example_id:"vom_5",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 2"},own_stats:[{k:"reach",v:"3K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"NESPRESSO",scope:"brand",
 example_id:"vom_6",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 3"},own_stats:[{k:"reach",v:"4K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"NESPRESSO",scope:"brand",
 example_id:"vom_7",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 4"},own_stats:[{k:"reach",v:"5K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"NESPRESSO",scope:"brand",
 example_id:"vom_8",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 5"},own_stats:[{k:"reach",v:"6K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"STARBUCKS",scope:"brand",
 example_id:"vom_9",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 1"},own_stats:[{k:"reach",v:"2K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"STARBUCKS",scope:"brand",
 example_id:"vom_10",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 2"},own_stats:[{k:"reach",v:"3K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"STARBUCKS",scope:"brand",
 example_id:"vom_11",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 3"},own_stats:[{k:"reach",v:"4K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"STARBUCKS",scope:"brand",
 example_id:"vom_12",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 4"},own_stats:[{k:"reach",v:"5K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"STARBUCKS",scope:"brand",
 example_id:"vom_13",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"mention 5"},own_stats:[{k:"reach",v:"6K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"PEETS",scope:"brand",
 example_id:"vom_14",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"mention 1"},own_stats:[{k:"reach",v:"2K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"PEETS",scope:"brand",
 example_id:"vom_15",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"mention 2"},own_stats:[{k:"reach",v:"3K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"LAVAZZA",scope:"brand",
 example_id:"vom_16",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"mention 1"},own_stats:[{k:"reach",v:"2K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"LAVAZZA",scope:"brand",
 example_id:"vom_17",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"mention 2"},own_stats:[{k:"reach",v:"3K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"vom",brand:"LAVAZZA",scope:"brand",
 example_id:"vom_18",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"mention 3"},own_stats:[{k:"reach",v:"4K"}],
 summary_text:"A mention in the spike.",comment_digest:null},

// ── NPS — Brand Loyalty / NPS (scope='brand', media: link/youtube) ───────────────
// ILLY row (nps_1, YouTube Zr14oI1mGyM) preserved from Phase-2A verified seed.

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"nps",brand:"ILLY",scope:"brand",
 example_id:"nps_1",role:"client",source:"YouTube",
 embed:{platform:"youtube",id:"Zr14oI1mGyM"},own_stats:[{k:"views",v:"318K"},{k:"likes",v:"12K"}],
 summary_text:"A ‘why I recommend illy’ advocacy review — illustrative of loyalty, not a measure of it.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"nps",brand:"NESPRESSO",scope:"brand",
 example_id:"nps_2",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"switch story"},own_stats:[{k:"views",v:"1.1M"}],
 summary_text:"A high-reach ‘why I switched’ video.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"nps",brand:"STARBUCKS",scope:"brand",
 example_id:"nps_3",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"loyalty vlog"},own_stats:[{k:"views",v:"540K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"nps",brand:"PEETS",scope:"brand",
 example_id:"nps_4",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"recommend"},own_stats:[{k:"views",v:"96K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"nps",brand:"LAVAZZA",scope:"brand",
 example_id:"nps_5",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"review"},own_stats:[{k:"views",v:"210K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

// ── BA — Brand Affinity (scope='brand', media: link/social, grid layout) ──────────
// ILLY row (ba_1, YouTube Ym1xYASwZS0) preserved from Phase-2A verified seed.

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ba",brand:"ILLY",scope:"brand",
 example_id:"ba_1",role:"client",source:"YouTube",
 embed:{platform:"youtube",id:"Ym1xYASwZS0"},own_stats:[{k:"likes",v:"24K"}],
 summary_text:"An unprompted morning-ritual video featuring illy — affinity shown, not asked for.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ba",brand:"ILLY",scope:"brand",
 example_id:"ba_2",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"fan ritual"},own_stats:[{k:"likes",v:"12K"}],
 summary_text:"A daily-ritual post; quiet, habitual affection.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ba",brand:"ILLY",scope:"brand",
 example_id:"ba_3",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"desk setup"},own_stats:[{k:"likes",v:"8K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ba",brand:"NESPRESSO",scope:"brand",
 example_id:"ba_4",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"ritual reel"},own_stats:[{k:"likes",v:"58K"}],
 summary_text:"Strong unprompted affection.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ba",brand:"NESPRESSO",scope:"brand",
 example_id:"ba_5",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"collection"},own_stats:[{k:"likes",v:"41K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ba",brand:"STARBUCKS",scope:"brand",
 example_id:"ba_6",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"haul"},own_stats:[{k:"likes",v:"31K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ba",brand:"STARBUCKS",scope:"brand",
 example_id:"ba_7",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"routine"},own_stats:[{k:"likes",v:"22K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ba",brand:"LAVAZZA",scope:"brand",
 example_id:"ba_8",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"ritual"},own_stats:[{k:"likes",v:"15K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ba",brand:"PEETS",scope:"brand",
 example_id:"ba_9",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"routine"},own_stats:[{k:"likes",v:"9K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

// ── EBL — Brand Engagement (scope='brand', media: youtube/social, grid layout) ────
// ILLY row (ebl_3, YouTube j3GAuYfQSSA) preserved from Phase-2A verified seed.

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ebl",brand:"NESPRESSO",scope:"brand",
 example_id:"ebl_1",role:"exemplar",source:"YouTube",
 embed:{platform:"youtube",id:null},own_stats:[{k:"comments",v:"9.7K"}],
 summary_text:"Comments run long and conversational — viewers debate technique and tag friends.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ebl",brand:"NESPRESSO",scope:"brand",
 example_id:"ebl_2",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"reel thread"},own_stats:[{k:"comments",v:"6.1K"}],
 summary_text:"Strong reply threads carry the conversation.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ebl",brand:"ILLY",scope:"brand",
 example_id:"ebl_3",role:"client",source:"YouTube",
 embed:{platform:"youtube",id:"j3GAuYfQSSA"},own_stats:[{k:"comments",v:"1.1K"}],
 summary_text:"An illy coffee-shops clip — a real comment thread to abstract in Phase B.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ebl",brand:"ILLY",scope:"brand",
 example_id:"ebl_4",role:"client",source:"Social",
 embed:{platform:"placeholder",note:"client post"},own_stats:[{k:"saves",v:"820"}],
 summary_text:"Some saves, little discussion.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ebl",brand:"STARBUCKS",scope:"brand",
 example_id:"ebl_5",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"clip"},own_stats:[{k:"comments",v:"4.0K"}],
 summary_text:"High views, lighter discussion.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ebl",brand:"STARBUCKS",scope:"brand",
 example_id:"ebl_6",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"poll post"},own_stats:[{k:"replies",v:"3.2K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ebl",brand:"LAVAZZA",scope:"brand",
 example_id:"ebl_7",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"reel"},own_stats:[{k:"comments",v:"2.2K"}],
 summary_text:"Steady engagement.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ebl",brand:"LAVAZZA",scope:"brand",
 example_id:"ebl_8",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"story set"},own_stats:[{k:"replies",v:"1.4K"}],
 summary_text:"A representative artifact in the wild.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"ebl",brand:"PEETS",scope:"brand",
 example_id:"ebl_9",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"post"},own_stats:[{k:"comments",v:"410"}],
 summary_text:"Limited reach.",comment_digest:null},

// ── BT — Brand Trust (scope='brand', media: link/youtube) ──────────────────────────
// ILLY row (bt_1, YouTube Zr14oI1mGyM) preserved from Phase-2A verified seed.

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bt",brand:"ILLY",scope:"brand",
 example_id:"bt_1",role:"client",source:"YouTube",
 embed:{platform:"youtube",id:"Zr14oI1mGyM"},own_stats:[{k:"views",v:"318K"},{k:"likes",v:"12K"}],
 summary_text:"illy’s own brand film — heritage and craft. Illustrative of the trust the survey captures, not a measure of it.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bt",brand:"NESPRESSO",scope:"brand",
 example_id:"bt_2",role:"exemplar",source:"Social",
 embed:{platform:"placeholder",note:"sustainability explainer"},own_stats:[{k:"views",v:"1.1M"}],
 summary_text:"Widely-shared explainer; reach reflects spread, not the trust score.",
 comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bt",brand:"PEETS",scope:"brand",
 example_id:"bt_3",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"founder story"},own_stats:[{k:"views",v:"96K"}],
 summary_text:"Founder-story piece; modest reach.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bt",brand:"STARBUCKS",scope:"brand",
 example_id:"bt_4",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"news segment"},own_stats:[{k:"views",v:"540K"}],
 summary_text:"Mixed-sentiment news segment.",comment_digest:null},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"bt",brand:"LAVAZZA",scope:"brand",
 example_id:"bt_5",role:"competitor",source:"Social",
 embed:{platform:"placeholder",note:"heritage film"},own_stats:[{k:"views",v:"210K"}],
 summary_text:"Heritage brand film.",comment_digest:null}

,

// ── POC_RUN v2 — real links replacing placeholder scaffolds ───────────────────────────

// MARKET INDICATORS — link embeds with real sources
{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"tam",brand:null,
 example_id:"tam_mordor_size",scope:"category",role:"category",source:"Mordor Intelligence",
 embed:{platform:"link",url:"https://www.mordorintelligence.com/industry-reports/coffee-market",
        source:"Mordor Intelligence",title:"Coffee Market — Size & Share Analysis",
        desc:"Global coffee market valued at USD 176.55B in 2025, projected to USD 238.99B by 2031."},
 own_stats:[{k:"market size",v:"$176.55B"},{k:"year",v:"2025"}],
 summary_text:"Category sizing — the global coffee market Illycaffè plays into. Illustrative context, not a brand result.",
 comment_digest:null,market_note:"Category-level headroom — the addressable market, not an Illycaffè-specific reading.",layout_hint:"source-strip"},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"cagr",brand:null,
 example_id:"cagr_gvr_growth",scope:"category",role:"category",source:"Grand View Research",
 embed:{platform:"link",url:"https://www.grandviewresearch.com/industry-analysis/coffee-market",
        source:"Grand View Research",title:"Coffee Market Size, Share & Trends Report, 2033",
        desc:"Global coffee market projected to grow at a 5.4% CAGR (2026–2033), USD 249.34B to 380.28B."},
 own_stats:[{k:"CAGR",v:"5.4%"},{k:"to",v:"2033"}],
 summary_text:"Category growth — the tailwind Illycaffè rides. Illustrative rate, not a brand-specific figure.",
 comment_digest:null,market_note:"Category growth (CAGR), not an Illycaffè-specific result.",layout_hint:"source-strip"},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"mcon",brand:null,
 example_id:"mcon_precedence_landscape",scope:"category",role:"category",source:"Precedence Research",
 embed:{platform:"link",url:"https://www.precedenceresearch.com/coffee-market",
        source:"Precedence Research",title:"Coffee Market — Competitive Landscape & Leading Companies",
        desc:"Category led by a handful of multinationals — Nestlé, JDE Peet's, Starbucks, Lavazza, J.M. Smucker."},
 own_stats:[{k:"top players",v:"Nestlé · JDE Peet's"},{k:"structure",v:"concentrated"}],
 summary_text:"Category concentration — how the market splits across the majors. Illustrative, not an Illycaffè reading.",
 comment_digest:null,market_note:"Competitive concentration of the category, not an Illycaffè-specific result.",layout_hint:"source-strip"},

// SVT — worldwide Trends embeds (no sparkline, geo='')
{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"svt",brand:"ILLY",
 example_id:"svt_trends_illy",scope:"brand",role:"organic",source:"Google Trends",
 embed:{platform:"trends",query:"Illy coffee",geo:"",time:"today 12-m",sparkline:[]},
 own_stats:[{k:"signal",v:"search interest"},{k:"window",v:"12 mo"}],
 summary_text:"Worldwide search interest for Illycaffè over the last 12 months — the demand signal behind the metric. Illustrative.",
 comment_digest:null,market_note:null,layout_hint:"strip"},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"svt",brand:"NESPRESSO",
 example_id:"svt_trends_nespresso",scope:"brand",role:"organic",source:"Google Trends",
 embed:{platform:"trends",query:"Nespresso",geo:"",time:"today 12-m",sparkline:[]},
 own_stats:[{k:"signal",v:"search interest"},{k:"window",v:"12 mo"}],
 summary_text:"Worldwide search interest for Nespresso over the last 12 months — its demand signal. Illustrative.",
 comment_digest:null,market_note:null,layout_hint:"strip"},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"svt",brand:"STARBUCKS",
 example_id:"svt_trends_starbucks",scope:"brand",role:"organic",source:"Google Trends",
 embed:{platform:"trends",query:"Starbucks",geo:"",time:"today 12-m",sparkline:[]},
 own_stats:[{k:"signal",v:"search interest"},{k:"window",v:"12 mo"}],
 summary_text:"Worldwide search interest for Starbucks over the last 12 months — its demand signal. Illustrative.",
 comment_digest:null,market_note:null,layout_hint:"strip"},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"svt",brand:"PEETS",
 example_id:"svt_trends_peets",scope:"brand",role:"organic",source:"Google Trends",
 embed:{platform:"trends",query:"Peet's Coffee",geo:"",time:"today 12-m",sparkline:[]},
 own_stats:[{k:"signal",v:"search interest"},{k:"window",v:"12 mo"}],
 summary_text:"Worldwide search interest for Peet's Coffee over the last 12 months — its demand signal. Illustrative.",
 comment_digest:null,market_note:null,layout_hint:"strip"},

{run_id:"POC_RUN",business_id:"ILLY",indicator_id:"svt",brand:"LAVAZZA",
 example_id:"svt_trends_lavazza",scope:"brand",role:"organic",source:"Google Trends",
 embed:{platform:"trends",query:"Lavazza",geo:"",time:"today 12-m",sparkline:[]},
 own_stats:[{k:"signal",v:"search interest"},{k:"window",v:"12 mo"}],
 summary_text:"Worldwide search interest for Lavazza over the last 12 months — its demand signal. Illustrative.",
 comment_digest:null,market_note:null,layout_hint:"strip"}

]; // end EXAMPLES_DATA

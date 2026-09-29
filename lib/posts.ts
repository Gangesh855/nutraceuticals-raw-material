export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Science" | "Manufacturing" | "Regulation" | "Market";
  date: string;
  readMins: number;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "standardised-botanical-extracts-explained",
    title: "Why Standardised Botanical Extracts Matter for Nutraceutical Brands",
    excerpt: "Consistent marker compounds turn a plant into a reliable ingredient. Here is how standardisation works and what buyers should ask for.",
    category: "Science", date: "2026-08-12", readMins: 6,
    body: [
      "A botanical extract is only as useful as it is consistent. Standardisation fixes the concentration of one or more marker compounds — withanolides in ashwagandha, curcuminoids in turmeric, bacosides in bacopa — so every batch behaves the same in your formulation.",
      "Ask suppliers for the assay method (typically HPLC), the reference standard used, and a batch-specific certificate of analysis. A specification without a validated method is only a claim.",
      "Beyond potency, request heavy-metal, pesticide-residue and microbial results. Together they form the identity, purity and strength profile that regulators and brand owners expect.",
    ],
  },
  {
    slug: "from-farm-to-drum-traceability",
    title: "From Farm to Drum: Building Traceability into Botanical Sourcing",
    excerpt: "Batch-level traceability starts in the field. A look at the checkpoints that protect quality and supply continuity.",
    category: "Manufacturing", date: "2026-07-03", readMins: 5,
    body: [
      "Traceability begins with the grower: documented cultivation practices, harvest dates, and lot identifiers that follow the raw material into the plant.",
      "At intake, botanical identity is verified by macroscopic, microscopic and chromatographic checks before material is released to extraction.",
      "Each finished drum carries a batch code that links back to the farm lot, the extraction run and the test results — so any question can be answered quickly.",
    ],
  },
  {
    slug: "navigating-global-supplement-regulation",
    title: "Navigating Global Supplement Regulation: A Buyer's Checklist",
    excerpt: "GMP, ISO and organic requirements differ by market. A concise checklist for qualifying an ingredient supplier.",
    category: "Regulation", date: "2026-05-21", readMins: 7,
    body: [
      "Start with the quality system: is the site audited to GMP and a recognised ISO standard, and can the supplier share the scope and validity of each certificate?",
      "For organic and specialty claims, confirm the certifying body and the specific products covered.",
      "Finally, evaluate change control, deviation handling and recall readiness — the day-to-day disciplines that certificates only summarise.",
    ],
  },
];

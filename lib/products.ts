export type Product = {
  slug: string;
  name: string;
  latin: string;
  marker: string;
  spec: string;
  method: string;
  benefits: string[];
  color: string;
  blurb: string;
};

export const PRODUCTS: Product[] = [
  { slug: "moringa", name: "Moringa", latin: "Moringa oleifera", marker: "Leaf extract", spec: "Standardised leaf powder / 10:1 extract", method: "Gravimetric, HPLC", benefits: ["Nutrient-dense", "Antioxidant", "Energy"], color: "#34D399", blurb: "Nutrient-rich leaf extract from traceable farms." },
  { slug: "ashwagandha", name: "Ashwagandha", latin: "Withania somnifera", marker: "Withanolides", spec: "2.5% – 10% withanolides", method: "HPLC", benefits: ["Adaptogen", "Stress", "Sleep"], color: "#C9A14A", blurb: "Root extract standardised for withanolides." },
  { slug: "turmeric-curcumin", name: "Turmeric / Curcumin", latin: "Curcuma longa", marker: "Curcuminoids", spec: "95% curcuminoids", method: "HPLC", benefits: ["Joint health", "Antioxidant", "Inflammation balance"], color: "#F59E0B", blurb: "High-purity curcuminoids from selected rhizomes." },
  { slug: "bacopa", name: "Bacopa", latin: "Bacopa monnieri", marker: "Bacosides", spec: "20% – 50% bacosides", method: "HPLC", benefits: ["Cognition", "Memory", "Focus"], color: "#6EE7B7", blurb: "Nootropic herb extract standardised for bacosides." },
  { slug: "ginger", name: "Ginger Extracts", latin: "Zingiber officinale", marker: "Gingerols", spec: "5% – 20% gingerols", method: "HPLC", benefits: ["Digestion", "Immunity", "Comfort"], color: "#E7B15A", blurb: "Pungent rhizome extract with defined gingerols." },
  { slug: "boswellia", name: "Boswellia", latin: "Boswellia serrata", marker: "AKBA / Boswellic acids", spec: "65% boswellic acids, AKBA 10–30%", method: "HPLC", benefits: ["Joint mobility", "Inflammation balance", "Flexibility"], color: "#D4AF37", blurb: "Resin extract with high boswellic-acid content." },
  { slug: "shatavari", name: "Shatavari", latin: "Asparagus racemosus", marker: "Shatavarins", spec: "20% saponins", method: "UV / HPLC", benefits: ["Women's health", "Vitality", "Balance"], color: "#A7F3D0", blurb: "Traditional root extract for women's wellness." },
  { slug: "custom", name: "Custom Extracts", latin: "Made to spec", marker: "Your marker", spec: "Tailored ratios & assays", method: "As required", benefits: ["Bespoke", "Scalable", "Private label"], color: "#F2E2A6", blurb: "Co-developed extracts to your specification." },
];

import { CertificateOfAnalysis, CertList, Eyebrow, QualityTest } from "@gk/ui";

export default function Quality() {
  return (
  <>
      <section id="quality" className="quality band" aria-labelledby="qTitle">
        <div className="wrap">
          <div className="sec-head">
            <div><Eyebrow>Quality</Eyebrow><h2 id="qTitle" data-split>A certificate travels with <strong>every drum</strong></h2></div>
            <p className="sec-copy">Our laboratory sits between the extraction hall and the vault. Nothing ships until it has passed every test below and a second analyst has signed.</p>
          </div>
          <div className="q-grid">
            <div className="tests">
              <QualityTest name="Identity" method="HPTLC" what="Fingerprint matched to a voucher specimen" />
              <QualityTest name="Actives" method="HPLC" what="Marker molecules quantified against USP reference standards" />
              <QualityTest name="Consistency" method="HPLC fingerprint" what="Compared with our library of past batches" />
              <QualityTest name="Heavy metals" method="ICP-MS" what="Lead, cadmium, arsenic, mercury" />
              <QualityTest name="Pesticides" method="LC-MS/MS · GC-MS/MS" what="Multi-residue screen" />
              <QualityTest name="Residual solvents" method="GC headspace" what="Within ICH Q3C limits" />
              <QualityTest name="Microbiology" method="Plate & enrichment" what="Total count, yeast and mould, E. coli, Salmonella" />
            </div>
            <CertificateOfAnalysis
              meta={[
                { label: "Product", value: "Turmeric extract, curcuminoids 95 %" },
                { label: "Source", value: <><i>Curcuma longa</i> rhizome · Erode</> },
                { label: "Batch", value: "GK-CL-260418" },
                { label: "Made · Best before", value: "04/2026 · 03/2029" },
              ]}
              rows={[
                { parameter: "Curcuminoids (HPLC)", specification: "≥ 95.0 %", result: "95.8 %" },
                { parameter: "Loss on drying", specification: "≤ 2.0 %", result: "0.9 %" },
                { parameter: "Lead (ICP-MS)", specification: "≤ 3.0 ppm", result: "0.21 ppm" },
                { parameter: "Arsenic (ICP-MS)", specification: "≤ 1.0 ppm", result: "0.08 ppm" },
                { parameter: "Residual solvents", specification: "ICH Q3C", result: "Complies" },
                { parameter: "Total plate count", specification: "≤ 1,000 cfu/g", result: "110 cfu/g" },
                { parameter: "Salmonella", specification: "Absent in 25 g", result: "Absent" },
              ]}
            />
          </div>
          <CertList items={["NSF GMP", "US FDA registered", "FSSC 22000", "ISO 9001", "ISO 22000", "HACCP", "AYUSH GMP", "FAMI-QS", "USDA Organic", "EU Organic", "Halal", "Kosher", "FSSAI"]} />
        </div>
      </section>
  </>
  );
}

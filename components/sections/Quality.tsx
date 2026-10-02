export default function Quality() {
  return (
  <>
      <section id="quality" className="quality band" aria-labelledby="qTitle">
        <div className="wrap">
          <div className="sec-head">
            <div><p className="eyebrow">Quality</p><h2 id="qTitle" data-split>A certificate travels with <strong>every drum</strong></h2></div>
            <p className="sec-copy">Our laboratory sits between the extraction hall and the vault. Nothing ships until it has passed every test below and a second analyst has signed.</p>
          </div>
          <div className="q-grid">
            <div className="tests">
              <div className="test"><b>Identity</b><span className="m">HPTLC</span><span className="w">Fingerprint matched to a voucher specimen</span></div>
              <div className="test"><b>Actives</b><span className="m">HPLC</span><span className="w">Marker molecules quantified against USP reference standards</span></div>
              <div className="test"><b>Consistency</b><span className="m">HPLC fingerprint</span><span className="w">Compared with our library of past batches</span></div>
              <div className="test"><b>Heavy metals</b><span className="m">ICP-MS</span><span className="w">Lead, cadmium, arsenic, mercury</span></div>
              <div className="test"><b>Pesticides</b><span className="m">LC-MS/MS · GC-MS/MS</span><span className="w">Multi-residue screen</span></div>
              <div className="test"><b>Residual solvents</b><span className="m">GC headspace</span><span className="w">Within ICH Q3C limits</span></div>
              <div className="test"><b>Microbiology</b><span className="m">Plate &amp; enrichment</span><span className="w">Total count, yeast and mould, E. coli, Salmonella</span></div>
            </div>
            <article className="coa" aria-label="Specimen certificate of analysis">
              <div className="coa-head">
                <div><p className="coa-brand">GK Botanical</p><p className="coa-doc">Certificate of analysis</p></div>
                <span className="stamp">Specimen</span>
              </div>
              <dl className="coa-meta">
                <dt>Product</dt><dd>Turmeric extract, curcuminoids 95 %</dd>
                <dt>Source</dt><dd><i>Curcuma longa</i> rhizome · Erode</dd>
                <dt>Batch</dt><dd>GK-CL-260418</dd>
                <dt>Made · Best before</dt><dd>04/2026 · 03/2029</dd>
              </dl>
              <div className="coa-scroll">
                <table>
                  <thead><tr><th>Parameter</th><th>Specification</th><th>Result</th></tr></thead>
                  <tbody>
                    <tr><td>Curcuminoids (HPLC)</td><td>≥ 95.0 %</td><td>95.8 %</td></tr>
                    <tr><td>Loss on drying</td><td>≤ 2.0 %</td><td>0.9 %</td></tr>
                    <tr><td>Lead (ICP-MS)</td><td>≤ 3.0 ppm</td><td>0.21 ppm</td></tr>
                    <tr><td>Arsenic (ICP-MS)</td><td>≤ 1.0 ppm</td><td>0.08 ppm</td></tr>
                    <tr><td>Residual solvents</td><td>ICH Q3C</td><td>Complies</td></tr>
                    <tr><td>Total plate count</td><td>≤ 1,000 cfu/g</td><td>110 cfu/g</td></tr>
                    <tr><td>Salmonella</td><td>Absent in 25 g</td><td>Absent</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="coa-sign">
                <span>Released by Quality Assurance</span>
                <svg viewBox="0 0 120 40" aria-hidden="true"><path d="M4 28c10-14 16-20 20-14s-6 18 0 16 14-22 20-18-4 16 4 14 12-12 18-10 2 10 10 8 14-8 20-8 8 2 18 0"/></svg>
              </div>
            </article>
          </div>
          <ul className="certs" aria-label="Certifications">
            <li>NSF GMP</li><li>US FDA registered</li><li>FSSC 22000</li><li>ISO 9001</li><li>ISO 22000</li><li>HACCP</li><li>AYUSH GMP</li><li>FAMI-QS</li><li>USDA Organic</li><li>EU Organic</li><li>Halal</li><li>Kosher</li><li>FSSAI</li>
          </ul>
        </div>
      </section>
  </>
  );
}

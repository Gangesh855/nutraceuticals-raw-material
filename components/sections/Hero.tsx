export default function Hero() {
  return (
  <>
      <section className="hero" id="top" data-scene aria-label="Introduction">
        <div className="hero-pin">
          <div className="drop-label" aria-hidden="true"><b>95.8 %</b><span>Curcuminoids · Batch GK-CL-260418</span></div>
          <div className="wrap hero-copy">
            <p className="eyebrow">Curcuma longa · Erode · Standardized by HPLC</p>
            <h1 data-split data-now>Three&nbsp;per&nbsp;cent in&nbsp;the&nbsp;root.<br /><strong>Ninety-five in every&nbsp;capsule.</strong></h1>
            <p className="lede">GK Botanical manufactures standardized botanical extracts for nutraceutical, beverage, food, personal care and animal health brands. Every batch is assayed by HPLC against USP reference standards and ships with its own certificate.</p>
            <div className="hero-cta">
              <a className="btn" href="#atelier">Request samples</a>
              <a className="textlink" href="#library">Explore ingredients</a>
            </div>
          </div>
          <div className="readout" aria-label="Standardization readout">
            <div className="wrap">
              <span>Curcuminoids <b id="roPct">3.0 %</b></span>
              <span>Raw rhizome <b>2–5 %</b></span>
              <span>Assay <b>HPLC</b></span>
              <span className="hint">Scroll to concentrate ↓</span>
            </div>
          </div>
        </div>
      </section>
  </>
  );
}

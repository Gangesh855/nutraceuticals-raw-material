export default function Console() {
  return (
  <>
      <section id="console" className="console band" aria-labelledby="coTitle">
        <div className="wrap">
          <div className="sec-head">
            <div><p className="eyebrow">The CO₂ laboratory</p><h2 id="coTitle" data-split>Tune the <strong>solvent</strong></h2></div>
            <p className="sec-copy">We use supercritical CO₂ for turmeric oleoresin and other fat-soluble actives. Above 31.1 °C and 73.8 bar it spreads like a gas and dissolves like a liquid, and every change in pressure changes what it pulls from the plant. Drag the point or set the dials.</p>
          </div>
          <div className="console-grid">
            <div className="panel">
              <div>
                <p className="eyebrow">State of the vessel</p>
                <p className="phase" id="phase" aria-live="polite">Supercritical</p>
              </div>
              <p className="phase-desc" id="phaseDesc">Total extract. CO₂ now carries the full lipophilic profile, including oleoresins, pigments, waxes and heavier actives.</p>
              <div className="knob">
                <label htmlFor="temp">Temperature <output id="tOut" htmlFor="temp">50.0 °C</output></label>
                <input type="range" id="temp" min="0" max="80" step="0.5" defaultValue="50" />
              </div>
              <div className="knob">
                <label htmlFor="pres">Pressure <output id="pOut" htmlFor="pres">300 bar</output></label>
                <input type="range" id="pres" min="1" max="400" step="1" defaultValue="300" />
              </div>
              <div className="presets"><span className="eyebrow">Try</span>
                <button type="button" data-t="40" data-p="110">Select extract</button>
                <button type="button" data-t="50" data-p="300">Total extract</button>
                <button type="button" data-t="20" data-p="70">Liquid CO₂</button>
                <button type="button" data-t="72" data-p="320">Too hot</button>
              </div>
            </div>
            <figure className="chart">
              <svg id="phaseSvg" viewBox="0 0 560 420" role="img" aria-label="Phase diagram of carbon dioxide from 0 to 80 °C and 0 to 400 bar, showing gas, liquid and supercritical regions, the critical point at 31.1 °C and 73.8 bar, and the select and total extraction windows."></svg>
              <figcaption>Phase boundaries for pure CO₂. The vapour curve is approximated with the Clausius–Clapeyron relation; dashed boxes mark our working windows.</figcaption>
            </figure>
          </div>
        </div>
      </section>
  </>
  );
}

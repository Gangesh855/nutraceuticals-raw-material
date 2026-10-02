export default function Atelier() {
  return (
  <>
      <section id="atelier" className="atelier" aria-labelledby="atTitle">
        <div className="wrap atelier-grid band">
          <div className="at-copy">
            <p className="eyebrow">The atelier</p>
            <h2 id="atTitle" data-split>Begin with <strong>a sample</strong></h2>
            <p className="sec-copy">Tell us what you're formulating. We send 50–100 g samples with a specification sheet and full certificate of analysis, usually within ten working days.</p>
            <dl className="at-facts">
              <div><dt>Samples</dt><dd>50–100 g, with CoA and spec sheet</dd></div>
              <div><dt>Minimum order</dt><dd>25 kg for standard extracts</dd></div>
              <div><dt>Custom work</dt><dd>Your marker, ratio, solubility or carrier, developed by our R&amp;D team</dd></div>
              <div><dt>Markets</dt><dd>Supplements, functional beverages and RTDs, food, personal care, animal and aquatic health</dd></div>
            </dl>
          </div>
          <div>
            <form className="form" id="reqForm">
              <div className="field"><label htmlFor="fName">Name</label><input id="fName" name="name" autoComplete="name" required /></div>
              <div className="field"><label htmlFor="fCompany">Company</label><input id="fCompany" name="company" autoComplete="organization" required /></div>
              <div className="field full"><label htmlFor="fEmail">Work email</label><input id="fEmail" name="email" type="email" autoComplete="email" required /></div>
              <div className="field"><label htmlFor="fApp">Application</label>
                <select id="fApp" name="application" required>
                  <option value="">Choose one</option>
                  <option>Nutraceuticals &amp; supplements</option><option>Functional beverages &amp; RTDs</option><option>Food</option><option>Personal care &amp; cosmetics</option><option>Animal &amp; aquatic health</option><option>Custom specialty ingredient</option>
                </select>
              </div>
              <div className="field"><label htmlFor="fVol">Annual volume</label>
                <select id="fVol" name="volume" required>
                  <option value="">Choose one</option>
                  <option>Under 100 kg</option><option>100 kg – 1 t</option><option>1–10 t</option><option>Over 10 t</option>
                </select>
              </div>
              <fieldset>
                <legend>Botanicals</legend>
                <div className="chips" id="chips"></div>
                <p className="hint" id="chipsEmpty">None selected yet. Add from <a href="#library">the library</a>, or describe what you need below.</p>
              </fieldset>
              <div className="field full"><label htmlFor="fNotes">Notes</label><textarea id="fNotes" name="notes" placeholder="Target specification, carrier preferences, timelines" /></div>
              <div className="submit-row"><button className="btn" type="submit">Draft my request</button><small>Nothing is sent until you choose to.</small></div>
            </form>
            <div className="done" id="reqDone" tabIndex={-1} hidden>
              <p className="eyebrow">Request drafted</p>
              <pre id="reqText"></pre>
              <div className="done-actions">
                <button type="button" className="btn" id="copyReq">Copy request</button>
                <span className="hint">then send it to <span className="addr">samples@gkbotanical.example</span></span>
              </div>
              <p className="hint" id="copyStatus" aria-live="polite"></p>
              <div><button type="button" className="textlink" id="editReq">Edit request</button></div>
            </div>
          </div>
        </div>
      </section>
  </>
  );
}

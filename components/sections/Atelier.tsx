import { Button, Eyebrow, FormField } from "@gk/ui";

export default function Atelier() {
  return (
  <>
      <section id="atelier" className="atelier" aria-labelledby="atTitle">
        <div className="wrap atelier-grid band">
          <div className="at-copy">
            <Eyebrow>The atelier</Eyebrow>
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
              <FormField id="fName" label="Name" name="name" autoComplete="name" required />
              <FormField id="fCompany" label="Company" name="company" autoComplete="organization" required />
              <FormField id="fEmail" label="Work email" name="email" type="email" autoComplete="email" required full />
              <FormField kind="select" id="fApp" label="Application" name="application" required options={["Nutraceuticals & supplements", "Functional beverages & RTDs", "Food", "Personal care & cosmetics", "Animal & aquatic health", "Custom specialty ingredient"]} />
              <FormField kind="select" id="fVol" label="Annual volume" name="volume" required options={["Under 100 kg", "100 kg – 1 t", "1–10 t", "Over 10 t"]} />
              <fieldset>
                <legend>Botanicals</legend>
                <div className="chips" id="chips"></div>
                <p className="hint" id="chipsEmpty">None selected yet. Add from <a href="#library">the library</a>, or describe what you need below.</p>
              </fieldset>
              <FormField kind="textarea" id="fNotes" label="Notes" name="notes" placeholder="Target specification, carrier preferences, timelines" full />
              <div className="submit-row"><Button type="submit">Draft my request</Button><small>Nothing is sent until you choose to.</small></div>
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

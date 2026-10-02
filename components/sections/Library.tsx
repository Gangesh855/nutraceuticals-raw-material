import type { CSSProperties } from "react";
import { BOTANICALS, CATS, CAT_DESC } from "@/lib/botanicals";

export default function Library() {
  return (
  <>
      <section id="library" className="library" data-scene aria-labelledby="libTitle">
        <div className="lib-pin">
          <div className="wrap lib-head">
            <div><p className="eyebrow">Ingredients · Fifteen standardized extracts</p><h2 id="libTitle" data-split>Specimens <strong>in glass</strong></h2></div>
            <div>
              <div className="filters" role="group" aria-label="Filter by application">
                <button type="button" data-f="all" aria-pressed="true">All</button>
                <button type="button" data-f="wellness" aria-pressed="false">Nutraceutical</button>
                <button type="button" data-f="food" aria-pressed="false">Food &amp; beverage</button>
                <button type="button" data-f="personal" aria-pressed="false">Personal care</button>
                <button type="button" data-f="animal" aria-pressed="false">Animal health</button>
                <button type="button" data-f="herbal" aria-pressed="false">Popular herbal</button>
              </div>
              <p className="cat-desc" id="catDesc" aria-live="polite">{CAT_DESC.all}</p>
            </div>
          </div>
          <div className="lib-viewport" id="libView"><div className="track" id="grid">
            {BOTANICALS.map((b) => (
              <article className="specimen" data-cats={b.cats.join(" ")} key={b.id}>
                <div className={`plinth${b.clip ? " has-media" : ""}`} style={{ "--liquid": b.color, "--level": b.level } as CSSProperties} aria-hidden="true">
                  {b.clip?.kind === "video" && (
                    <video className="pv" muted loop playsInline preload="none" poster={`/media/${b.clip.file}.jpg`}>
                      <source src={`/media/${b.clip.file}.mp4`} type="video/mp4" />
                    </video>
                  )}
                  {b.clip?.kind === "image" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="pv pi" src={`/media/${b.clip.file}.jpg`} alt="" loading="lazy" decoding="async" />
                  )}
                  <div className="vial powder"><span className="cap"></span><span className="glass"><span className="liquid"></span><span className="shine"></span></span></div>
                </div>
                <p className="latin">{b.latin}</p>
                <h3>{b.name}</h3>
                <p className="desc">{b.desc}</p>
                <dl className="spec">
                  <div><dt>Part</dt><dd>{b.part}</dd></div>
                  <div><dt>Actives</dt><dd>{b.actives}</dd></div>
                  <div><dt>Standard</dt><dd>{b.std}</dd></div>
                  <div><dt>Supports</dt><dd>{b.supports}</dd></div>
                </dl>
                <p className="tags">{b.cats.map((c) => CATS[c]).join(" · ")}</p>
                <button type="button" className="btn ghost add" data-id={b.id} aria-pressed="false">Add to sample request</button>
              </article>
            ))}
            <article className="custom">
              <div>
                <p className="eyebrow">Custom specialty</p>
                <h3>Your specification, developed in our lab</h3>
                <p className="body">Need a marker, ratio, solubility or carrier we don&apos;t list? Our R&amp;D team develops pharmaceutical-grade extracts to your brief and validates the actives by HPLC.</p>
                <ul><li>Custom markers and ratios</li><li>Water-soluble and beadlet grades</li><li>Clean-label carriers</li></ul>
              </div>
              <a className="btn" href="#atelier">Brief our R&amp;D team</a>
            </article>
          </div></div>
          <div className="wrap lib-foot">
            <span className="lib-count" aria-live="polite"><b id="libNow">01</b>&nbsp;/&nbsp;<span id="libTotal">{String(BOTANICALS.length).padStart(2, "0")}</span></span>
            <span className="lib-bar" aria-hidden="true"><i></i></span>
            <span className="lib-hint-d">Scroll or drag to browse</span><span className="lib-hint-m">Swipe to browse →</span>
          </div>
        </div>
      </section>
  </>
  );
}

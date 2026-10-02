import { CustomSpecialtyCard, Eyebrow, SpecimenCard } from "@gk/ui";
import { BOTANICALS, CATS, CAT_DESC } from "@/lib/botanicals";

export default function Library() {
  return (
  <>
      <section id="library" className="library" data-scene aria-labelledby="libTitle">
        <div className="lib-pin">
          <div className="wrap lib-head">
            <div><Eyebrow>Ingredients · Fifteen standardized extracts</Eyebrow><h2 id="libTitle" data-split>Specimens <strong>in glass</strong></h2></div>
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
              <SpecimenCard
                key={b.id}
                id={b.id}
                name={b.name}
                latin={b.latin}
                description={b.desc}
                part={b.part}
                actives={b.actives}
                standard={b.std}
                supports={b.supports}
                categories={b.cats.map((c) => CATS[c])}
                filterKeys={b.cats}
                color={b.color}
                level={b.level}
                clip={b.clip}
              />
            ))}
            <CustomSpecialtyCard />
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

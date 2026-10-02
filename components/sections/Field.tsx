export default function Field() {
  return (
  <>
      <section className="attar" id="attar" data-scene aria-label="Contract farming and traceability">
        <div className="attar-pin">
          <video id="fieldVid" muted playsInline preload="auto" poster="/media/field.jpg" aria-hidden="true"><source src="/media/field.mp4" type="video/mp4" /></video>
          <div className="attar-mask" aria-hidden="true"><span className="aw">F<span id="attarT">I</span>ELD</span></div>
          <div className="wrap attar-copy">
            <p className="eyebrow">Sourcing &amp; traceability</p>
            <p className="attar-line">Every lot traces back to its field. We qualify each grower and supplier, and test every harvest in our lab before we buy it.</p>
          </div>
        </div>
      </section>
  </>
  );
}

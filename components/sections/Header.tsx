export default function Header() {
  return (
  <>
    <header className="nav" id="nav">
      <a className="mark" href="#top" aria-label="GK Botanical, back to top"><span className="m1">GK</span><span className="m2">Botanical</span></a>
      <nav aria-label="Sections">
        <a href="#library">Ingredients</a>
        <a href="#process">Process</a>
        <a href="#console">CO₂ lab</a>
        <a href="#quality">Quality</a>
      </nav>
      <a className="btn" href="#atelier">Samples <span className="tray-n" id="trayN" hidden>0</span></a>
    </header>
  </>
  );
}

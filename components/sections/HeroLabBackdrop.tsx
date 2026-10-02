/** A calm, out-of-focus laboratory: glass flasks and tubes catching window light, soft bokeh, a herb sprig in the foreground.
 *  Pure SVG/CSS (no photo needed), blurred so it reads as depth behind the hero copy. */
export default function HeroLabBackdrop() {
  const glass = "rgba(255,255,255,.16)", edge = "rgba(255,255,255,.42)";
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* bokeh: distant window and ceiling lights */}
      <div className="kb absolute inset-0 opacity-70" style={{
        backgroundImage:
          "radial-gradient(circle at 12% 22%, rgba(255,255,255,.55) 0 3.2%, transparent 3.6%), radial-gradient(circle at 30% 12%, rgba(255,255,255,.4) 0 2.2%, transparent 2.6%), radial-gradient(circle at 46% 30%, rgba(255,255,255,.34) 0 2.8%, transparent 3.2%), radial-gradient(circle at 58% 10%, rgba(255,255,255,.5) 0 2.4%, transparent 2.8%), radial-gradient(circle at 86% 18%, rgba(255,255,255,.45) 0 3.4%, transparent 3.8%), radial-gradient(circle at 74% 40%, rgba(255,255,255,.3) 0 2.2%, transparent 2.6%)",
        filter: "blur(6px)",
      }} />
      {/* glassware */}
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="kb absolute inset-0 h-full w-full" style={{ filter: "blur(6px)" }}>
        <defs>
          <linearGradient id="liqG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d7e8a4" stopOpacity=".5" /><stop offset="1" stopColor="#7fb36a" stopOpacity=".7" /></linearGradient>
          <linearGradient id="liqA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3d186" stopOpacity=".55" /><stop offset="1" stopColor="#d99a3a" stopOpacity=".75" /></linearGradient>
        </defs>
        {/* Erlenmeyer flask, far right */}
        <g transform="translate(1180 190)">
          <path d="M70 0h60v150l110 250q10 28-18 28H-22q-28 0-18-28L70 150z" fill={glass} stroke={edge} strokeWidth="5" />
          <path d="M-8 330h228l30 70q10 28-18 28H-22q-28 0-18-28z" fill="url(#liqG)" />
        </g>
        {/* round-bottom flask */}
        <g transform="translate(820 250)">
          <path d="M60 0h50v110a130 130 0 1 1-150 0z" transform="translate(30 0)" fill={glass} stroke={edge} strokeWidth="5" />
          <path d="M-60 250a130 130 0 0 0 250 0z" fill="url(#liqA)" transform="translate(0 20)" />
        </g>
        {/* test tubes */}
        {[1330, 1400, 1470].map((x, i) => (
          <g key={x} transform={`translate(${x} ${470 - i * 40})`}>
            <rect width="46" height={320 + i * 40} rx="23" fill={glass} stroke={edge} strokeWidth="4" />
            <rect y={140 + i * 20} width="46" height={180 + i * 20} rx="23" fill={i === 1 ? "url(#liqA)" : "url(#liqG)"} />
          </g>
        ))}
        {/* beaker, left-back */}
        <g transform="translate(420 380)">
          <path d="M0 0h170l-10 330q0 20-20 20H30q-20 0-20-20z" fill={glass} stroke={edge} strokeWidth="5" />
          <path d="M6 200h158l-6 130q0 20-20 20H32q-20 0-20-20z" fill="url(#liqG)" />
        </g>
        {/* bench line */}
        <rect y="780" width="1600" height="120" fill="rgba(255,255,255,.10)" />
        {/* herb sprig, foreground left */}
        <g transform="translate(-30 560) rotate(-12)" fill="#6f9a60" fillOpacity=".7">
          <path d="M0 200C80 150 220 120 360 60" stroke="#4d7a45" strokeWidth="8" fill="none" />
          {[[60, 170, -35], [130, 140, -50], [200, 118, -42], [270, 92, -55], [330, 70, -48]].map(([x, y, r]) => (
            <ellipse key={x} cx={x} cy={y} rx="46" ry="20" transform={`rotate(${r} ${x} ${y})`} />
          ))}
        </g>
      </svg>
      {/* window light from the upper right */}
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_45%,rgba(255,255,255,.22)_62%,transparent_78%)] mix-blend-soft-light" />
    </div>
  );
}

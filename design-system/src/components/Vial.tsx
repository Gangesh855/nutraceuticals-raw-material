import type { CSSProperties } from "react";

export type VialProps = {
  /** CSS colour of the extract powder in the capsule. */
  color: string;
  /** Fill level of the capsule from 0 to 1. */
  level?: number;
};

/** A glass capsule filled with a coloured extract powder: the brand's specimen mark. Decorative. */
export function Vial({ color, level = 0.55 }: VialProps) {
  return (
    <div className="plinth" style={{ "--liquid": color, "--level": level } as CSSProperties} aria-hidden="true">
      <div className="vial powder"><span className="cap"></span><span className="glass"><span className="liquid"></span><span className="shine"></span></span></div>
    </div>
  );
}

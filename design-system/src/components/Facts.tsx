import type { ReactNode } from "react";

export type FactsProps = {
  /** Three or four proof points: a short bold figure and one line of explanation. */
  items: Array<{ figure: ReactNode; text: ReactNode }>;
};

/** A row of large figures with a short caption each ("95 %", "HPLC", "1 : 1"). Use it to back up a statement with numbers. */
export function Facts({ items }: FactsProps) {
  return (
    <dl className="facts">
      {items.map((f, i) => <div key={i}><dt>{f.figure}</dt><dd>{f.text}</dd></div>)}
    </dl>
  );
}

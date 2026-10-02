import type { ReactNode } from "react";
import { cx } from "../cx";

export type ProcessStageProps = {
  /** Two digit step number, e.g. "01". */
  number: string;
  /** One word stage name, e.g. "Extract". */
  title: ReactNode;
  /** A short line that states the idea of the stage. */
  headline: ReactNode;
  /** Two or three sentences of explanation. */
  body: ReactNode;
  /** Key readings as label/value pairs, e.g. `{ label: "CO₂ line", value: "300 bar" }`. */
  readings: Array<{ label: ReactNode; value: ReactNode }>;
  /** Marks the stage currently in view; only one stage in a set should be active. */
  active?: boolean;
};

/** One stage of the extraction train (Receive, Extract, Concentrate, Standardize, Release) with its key readings. */
export function ProcessStage({ number, title, headline, body, readings, active }: ProcessStageProps) {
  return (
    <article className={cx("stage", active && "on")}>
      <span className="num">{number}</span><h3>{title}</h3>
      <p className="big">{headline}</p>
      <p className="body">{body}</p>
      <ul className="readings">{readings.map((r, i) => <li key={i}><span>{r.label}</span><b>{r.value}</b></li>)}</ul>
    </article>
  );
}

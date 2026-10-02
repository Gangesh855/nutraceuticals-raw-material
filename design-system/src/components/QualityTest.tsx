import type { ReactNode } from "react";

export type QualityTestProps = {
  /** What is tested, e.g. "Heavy metals". */
  name: ReactNode;
  /** Method, e.g. "ICP-MS". */
  method: ReactNode;
  /** What the test covers. */
  what: ReactNode;
};

/** One row of the quality test list: the test, its analytical method and what it covers. Stack several in a column. */
export function QualityTest({ name, method, what }: QualityTestProps) {
  return <div className="test"><b>{name}</b><span className="m">{method}</span><span className="w">{what}</span></div>;
}

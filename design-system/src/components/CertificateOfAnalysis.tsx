import { Fragment, type ReactNode } from "react";

export type CertificateOfAnalysisProps = {
  /** Company name at the top left. */
  brand?: string;
  /** Document title. */
  title?: string;
  /** Stamp text in the corner, e.g. "Specimen". */
  stamp?: string;
  /** Header facts such as product, source, batch and dates. */
  meta: Array<{ label: ReactNode; value: ReactNode }>;
  /** Test results: parameter, specification, result. */
  rows: Array<{ parameter: ReactNode; specification: ReactNode; result: ReactNode }>;
  /** Text next to the signature. */
  signedBy?: string;
};

/** A specimen certificate of analysis: batch details, a results table and a signature line. Shows visitors what ships with every drum. */
export function CertificateOfAnalysis({ brand = "GK Botanical", title = "Certificate of analysis", stamp = "Specimen", meta, rows, signedBy = "Released by Quality Assurance" }: CertificateOfAnalysisProps) {
  return (
    <article className="coa" aria-label={`${stamp} ${title.toLowerCase()}`}>
      <div className="coa-head">
        <div><p className="coa-brand">{brand}</p><p className="coa-doc">{title}</p></div>
        <span className="stamp">{stamp}</span>
      </div>
      <dl className="coa-meta">
        {meta.map((m, i) => <Fragment key={i}><dt>{m.label}</dt><dd>{m.value}</dd></Fragment>)}
      </dl>
      <div className="coa-scroll">
        <table>
          <thead><tr><th>Parameter</th><th>Specification</th><th>Result</th></tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}><td>{r.parameter}</td><td>{r.specification}</td><td>{r.result}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="coa-sign">
        <span>{signedBy}</span>
        <svg viewBox="0 0 120 40" aria-hidden="true"><path d="M4 28c10-14 16-20 20-14s-6 18 0 16 14-22 20-18-4 16 4 14 12-12 18-10 2 10 10 8 14-8 20-8 8 2 18 0" /></svg>
      </div>
    </article>
  );
}

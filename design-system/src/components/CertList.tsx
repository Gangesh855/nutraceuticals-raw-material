export type CertListProps = {
  /** Names of held certifications, e.g. "NSF GMP", "ISO 9001". Only list ones that are verified. */
  items: string[];
};

/** A wrapped row of certification badges. */
export function CertList({ items }: CertListProps) {
  return <ul className="certs" aria-label="Certifications">{items.map((c) => <li key={c}>{c}</li>)}</ul>;
}

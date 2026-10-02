import { CertList } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const Default = () => (
  <Night width={720}>
    <CertList items={["NSF GMP", "US FDA registered", "FSSC 22000", "ISO 9001", "HACCP", "USDA Organic", "EU Organic", "Halal", "Kosher"]} />
  </Night>
);

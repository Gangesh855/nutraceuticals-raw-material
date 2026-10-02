import { Facts } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const ProofPoints = () => (
  <Night pad={36}>
    <Facts
      items={[
        { figure: "95 %", text: "Curcuminoids in our turmeric extract, from a root that holds 2–5 %" },
        { figure: "HPLC", text: "Marker-specific assay against USP reference standards, never gravimetric" },
        { figure: "1 : 1", text: "One certificate of analysis for every batch released" },
      ]}
    />
  </Night>
);

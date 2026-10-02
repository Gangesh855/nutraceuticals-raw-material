import { CertificateOfAnalysis } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const Turmeric = () => (
  <Night pad={64} width={540}>
    <CertificateOfAnalysis
      meta={[
        { label: "Product", value: "Turmeric extract, curcuminoids 95 %" },
        { label: "Source", value: <><i>Curcuma longa</i> rhizome · Erode</> },
        { label: "Batch", value: "GK-CL-260418" },
        { label: "Made · Best before", value: "04/2026 · 03/2029" },
      ]}
      rows={[
        { parameter: "Curcuminoids (HPLC)", specification: "≥ 95.0 %", result: "95.8 %" },
        { parameter: "Loss on drying", specification: "≤ 2.0 %", result: "0.9 %" },
        { parameter: "Lead (ICP-MS)", specification: "≤ 3.0 ppm", result: "0.21 ppm" },
        { parameter: "Residual solvents", specification: "ICH Q3C", result: "Complies" },
        { parameter: "Salmonella", specification: "Absent in 25 g", result: "Absent" },
      ]}
    />
  </Night>
);

import { ProcessStage } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const Extract = () => (
  <Night width={560}>
    <ProcessStage
      number="02" title="Extract" headline="A different solvent for every plant."
      body="Water and food-grade ethanol for most standardized extracts, supercritical CO₂ for oleoresins and fat-soluble actives, and a dedicated line for certified organic material."
      readings={[
        { label: "Solvents", value: "Water · ethanol · CO₂" },
        { label: "CO₂ line", value: "300 bar" },
        { label: "Organic", value: "Dedicated line" },
      ]}
      active
    />
  </Night>
);
export const Standardize = () => (
  <Night width={560}>
    <ProcessStage
      number="04" title="Standardize" headline="Measured to the marker."
      body="HPLC quantifies the exact marker molecules against USP reference standards, ICP-MS checks heavy metals and LC-MS/MS screens for pesticide residues."
      readings={[
        { label: "Actives", value: "HPLC" },
        { label: "Metals", value: "ICP-MS" },
        { label: "Residues", value: "LC-MS/MS" },
      ]}
      active
    />
  </Night>
);

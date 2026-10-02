import { Chip } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const Selected = () => (
  <Night>
    <div className="chips" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <Chip aria-label="Remove Amla Extract">Amla Extract</Chip>
      <Chip aria-label="Remove Ashwagandha Extract">Ashwagandha Extract</Chip>
      <Chip aria-label="Remove Boswellia Extract">Boswellia Extract</Chip>
    </div>
  </Night>
);

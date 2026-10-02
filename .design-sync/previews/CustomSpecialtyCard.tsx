import { CustomSpecialtyCard } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const Default = () => <Night width={460}><CustomSpecialtyCard /></Night>;
export const CustomCopy = () => (
  <Night width={460}>
    <CustomSpecialtyCard
      title="A beadlet grade for your beverage"
      body="Tell us the pH, the process and the shelf life. We will develop a water-soluble carrier and validate the active by HPLC."
      points={["Water-soluble beadlets", "Heat-stable through pasteurization"]}
      ctaLabel="Start a brief"
    />
  </Night>
);

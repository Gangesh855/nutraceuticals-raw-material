import { Button, TextLink } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const Default = () => <Night><TextLink href="#library">Explore ingredients</TextLink></Night>;
export const BesideButton = () => (
  <Night>
    <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
      <Button href="#atelier">Request samples</Button>
      <TextLink href="#library">Explore ingredients</TextLink>
    </div>
  </Night>
);

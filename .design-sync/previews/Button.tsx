import { Button } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const Solid = () => <Night><Button href="#atelier">Request samples</Button></Night>;
export const Ghost = () => <Night><Button variant="ghost" href="#library">Browse ingredients</Button></Night>;
export const AsButton = () => (
  <Night>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Button type="submit">Draft my request</Button>
      <Button variant="ghost">Add to sample request</Button>
    </div>
  </Night>
);

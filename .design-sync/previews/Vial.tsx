import { Vial } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const Turmeric = () => <Night pad={0} width={260}><Vial color="#E39B12" level={0.64} /></Night>;
export const Palette = () => (
  <Night pad={0}>
    <div style={{ display: "flex" }}>
      {[["#B39A72", 0.56], ["#8A3E2E", 0.6], ["#C4532A", 0.5], ["#B8A46A", 0.58]].map(([c, l]) => (
        <div key={String(c)} style={{ width: 170 }}><Vial color={String(c)} level={Number(l)} /></div>
      ))}
    </div>
  </Night>
);

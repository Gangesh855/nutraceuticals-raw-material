import { Eyebrow } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const Default = () => <Night><Eyebrow>Quality</Eyebrow></Night>;
export const AboveHeading = () => (
  <Night width={460}>
    <Eyebrow>Curcuma longa · Erode · Standardized by HPLC</Eyebrow>
    <h2>A certificate travels with <strong>every drum</strong></h2>
  </Night>
);

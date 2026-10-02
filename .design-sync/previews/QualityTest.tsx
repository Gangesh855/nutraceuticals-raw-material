import { QualityTest } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const TestList = () => (
  <Night width={720}>
    <div className="tests">
      <QualityTest name="Identity" method="HPTLC" what="Fingerprint matched to a voucher specimen" />
      <QualityTest name="Actives" method="HPLC" what="Marker molecules quantified against USP reference standards" />
      <QualityTest name="Heavy metals" method="ICP-MS" what="Lead, cadmium, arsenic, mercury" />
      <QualityTest name="Pesticides" method="LC-MS/MS · GC-MS/MS" what="Multi-residue screen" />
    </div>
  </Night>
);

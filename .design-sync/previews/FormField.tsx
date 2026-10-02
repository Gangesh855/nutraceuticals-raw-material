import { FormField } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

export const RequestForm = () => (
  <Night width={560}>
    <div className="form">
      <FormField id="fName" label="Name" name="name" autoComplete="name" required />
      <FormField id="fCompany" label="Company" name="company" autoComplete="organization" required />
      <FormField id="fEmail" label="Work email" name="email" type="email" required full />
      <FormField kind="select" id="fApp" label="Application" name="application" options={["Nutraceuticals & supplements", "Functional beverages & RTDs", "Food", "Personal care & cosmetics"]} />
      <FormField kind="select" id="fVol" label="Annual volume" name="volume" options={["Under 100 kg", "100 kg – 1 t", "1–10 t", "Over 10 t"]} />
      <FormField kind="textarea" id="fNotes" label="Notes" name="notes" placeholder="Target specification, carrier preferences, timelines" full />
    </div>
  </Night>
);

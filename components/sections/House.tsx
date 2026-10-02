import { Eyebrow, Facts } from "@gk/ui";

export default function House() {
  return (
  <>
      <section className="wrap house" aria-label="The house">
        <Eyebrow>The house</Eyebrow>
        <p className="statement" data-split>Standardization is only as honest as <strong>the method behind it.</strong> We assay the marker molecule by HPLC, never by weight, and we sign for it on every certificate.</p>
        <Facts
          items={[
            { figure: "95 %", text: "Curcuminoids in our turmeric extract, from a root that holds 2–5 %" },
            { figure: "HPLC", text: "Marker-specific assay against USP reference standards, never gravimetric" },
            { figure: "1 : 1", text: "One certificate of analysis for every batch released" },
          ]}
        />
      </section>
  </>
  );
}

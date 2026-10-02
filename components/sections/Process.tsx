import type { CSSProperties } from "react";
import { Eyebrow, ProcessStage } from "@gk/ui";

export default function Process() {
  return (
  <>
      <section id="process" className="process" data-scene aria-labelledby="procTitle">
        <div className="wrap process-pin">
          <div>
            <Eyebrow id="procTitle">The extraction train · Five stages</Eyebrow>
            <div className="stages">
              <ProcessStage
                number="01" title="Receive" headline="Field to factory, traced."
                body="Every leaf, seed, berry, root and mushroom arrives with its origin and harvest date on the bag. Each lot is dried below 10 % moisture and matched by HPTLC against a voucher specimen before production can use it."
                readings={[{ label: "Moisture", value: "≤ 10 %" }, { label: "Identity", value: "HPTLC" }, { label: "Lot opened", value: "Farm · plot · day" }]}
                active
              />
              <ProcessStage
                number="02" title="Extract" headline="A different solvent for every plant."
                body="Water and food-grade ethanol for most standardized extracts, supercritical CO₂ for oleoresins and fat-soluble actives, and a dedicated line for certified organic material."
                readings={[{ label: "Solvents", value: "Water · ethanol · CO₂" }, { label: "CO₂ line", value: "300 bar" }, { label: "Organic", value: "Dedicated line" }]}
              />
              <ProcessStage
                number="03" title="Concentrate" headline="Low heat, long patience."
                body="Extracts are concentrated under vacuum below 50 °C, then spray-dried into free-flowing powders or water-soluble grades that disperse clear in beverages and hold up through pasteurization."
                readings={[{ label: "Evaporation", value: "< 50 °C" }, { label: "Powders", value: "80 mesh" }, { label: "Beverage grade", value: "Water-soluble" }]}
              />
              <ProcessStage
                number="04" title="Standardize" headline="Measured to the marker."
                body="HPLC quantifies the exact marker molecules against USP reference standards, ICP-MS checks heavy metals and LC-MS/MS screens for pesticide residues. Each batch is adjusted to its label claim before release."
                readings={[{ label: "Actives", value: "HPLC" }, { label: "Metals", value: "ICP-MS" }, { label: "Residues", value: "LC-MS/MS" }]}
              />
              <ProcessStage
                number="05" title="Release" headline="Signed, sealed, retained."
                body="Every drum ships with its certificate of analysis. A retained sample of each batch stays in our vault for its full shelf life plus one year, so any question can be answered from the original material."
                readings={[{ label: "Certificate", value: "1 per batch" }, { label: "Packing", value: "Amber · N₂" }, { label: "Retained", value: "Shelf life + 1 yr" }]}
              />
            </div>
          </div>
          <ol className="tubes" aria-label="Jump to stage">
            <li><button type="button" className="tube" style={{"--liq": "rgba(205,228,214,.26)"} as CSSProperties} aria-label="Stage 1, Receive" aria-current="step"><span className="g"><span className="liq"></span><svg viewBox="0 0 40 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="M20 198V36" stroke="#6E9E4C" strokeWidth="3.2" fill="none"/><path d="M16.5 150h7M16.5 112h7M16.5 74h7" stroke="#3E6B2C" strokeWidth="2"/><ellipse cx="11" cy="68" rx="10" ry="4.2" transform="rotate(-32 11 68)" fill="#6FA552"/><ellipse cx="29.5" cy="62" rx="10" ry="4.2" transform="rotate(32 29.5 62)" fill="#7DB35E"/><ellipse cx="12" cy="106" rx="8.5" ry="3.6" transform="rotate(-24 12 106)" fill="#5E9446"/><ellipse cx="23" cy="34" rx="4" ry="8" transform="rotate(18 23 34)" fill="#86BB66"/></svg></span><span className="tl">01 <b>Receive</b></span></button></li>
            <li><button type="button" className="tube" style={{"--liq": "rgba(217,169,63,.8)"} as CSSProperties} aria-label="Stage 2, Extract"><span className="g"><span className="liq"></span><svg viewBox="0 0 40 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="M20 198C19 160 22 110 20 44" stroke="#8B9A4A" strokeWidth="1.6" fill="none"/><path d="M20 160l-9-15M20 140l9-13M20 120l-8-13M20 100l8-12M20 82l-7-11M20 66l6-10" stroke="#8B9A4A" strokeWidth="1.1"/><g fill="#B3C26C"><circle cx="11" cy="145" r="2.4"/><circle cx="29" cy="127" r="2.4"/><circle cx="12" cy="107" r="2.2"/><circle cx="28" cy="88" r="2.2"/><circle cx="13" cy="71" r="2"/><circle cx="26" cy="56" r="2"/><circle cx="20" cy="42" r="2.4"/><circle cx="15" cy="152" r="1.8"/><circle cx="25" cy="134" r="1.8"/><circle cx="16" cy="114" r="1.8"/><circle cx="24" cy="95" r="1.8"/></g></svg></span><span className="tl">02 <b>Extract</b></span></button></li>
            <li><button type="button" className="tube" style={{"--liq": "rgba(160,82,30,.85)"} as CSSProperties} aria-label="Stage 3, Concentrate"><span className="g"><span className="liq"></span><svg viewBox="0 0 40 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="M15 196C31 176 9 156 24 134S9 96 22 74S15 46 20 30" stroke="#6E3415" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M26 196C11 174 30 154 16 132S31 98 18 76" stroke="#C47838" strokeWidth="3" fill="none" strokeLinecap="round"/></svg></span><span className="tl">03 <b>Concentrate</b></span></button></li>
            <li><button type="button" className="tube" style={{"--liq": "rgba(232,214,150,.45)"} as CSSProperties} aria-label="Stage 4, Standardize"><span className="g"><span className="liq"></span><svg viewBox="0 0 40 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="M20 198V52" stroke="#C2A85A" strokeWidth="1.5"/><g fill="#E6CF86"><ellipse cx="14" cy="60" rx="3.4" ry="1.4" transform="rotate(-35 14 60)"/><ellipse cx="26" cy="68" rx="3.4" ry="1.4" transform="rotate(35 26 68)"/><ellipse cx="14" cy="76" rx="3.4" ry="1.4" transform="rotate(-35 14 76)"/><ellipse cx="26" cy="84" rx="3.4" ry="1.4" transform="rotate(35 26 84)"/><ellipse cx="14" cy="92" rx="3.4" ry="1.4" transform="rotate(-35 14 92)"/><ellipse cx="26" cy="100" rx="3.4" ry="1.4" transform="rotate(35 26 100)"/><ellipse cx="14" cy="108" rx="3.4" ry="1.4" transform="rotate(-35 14 108)"/><ellipse cx="26" cy="116" rx="3.4" ry="1.4" transform="rotate(35 26 116)"/><ellipse cx="14" cy="124" rx="3.4" ry="1.4" transform="rotate(-35 14 124)"/><ellipse cx="26" cy="132" rx="3.4" ry="1.4" transform="rotate(35 26 132)"/><ellipse cx="20" cy="50" rx="1.6" ry="4.2"/></g></svg></span><span className="tl">04 <b>Standardize</b></span></button></li>
            <li><button type="button" className="tube" style={{"--liq": "rgba(190,226,190,.24)"} as CSSProperties} aria-label="Stage 5, Release"><span className="g"><span className="liq"></span><svg viewBox="0 0 40 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="M20 198V46" stroke="#4F8A3A" strokeWidth="2.6"/><ellipse cx="10.5" cy="74" rx="10.5" ry="5" transform="rotate(-36 10.5 74)" fill="#4F9A44"/><ellipse cx="29.5" cy="66" rx="10.5" ry="5" transform="rotate(36 29.5 66)" fill="#62AA55"/><ellipse cx="11.5" cy="108" rx="9" ry="4.4" transform="rotate(-30 11.5 108)" fill="#4A8F3F"/><ellipse cx="28.5" cy="100" rx="9" ry="4.4" transform="rotate(30 28.5 100)" fill="#5BA34E"/><ellipse cx="20" cy="44" rx="5" ry="8.5" fill="#6DB45E"/></svg></span><span className="tl">05 <b>Release</b></span></button></li>
          </ol>
        </div>
      </section>
  </>
  );
}

import { SpecimenCard } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

const ashwa = {
  id: "ashwa", name: "Ashwagandha Extract", latin: "Withania somnifera",
  description: "Indian ginseng, native to India and North Africa and grown across the drier regions of Madhya Pradesh, Rajasthan and Kerala.",
  part: "Root", actives: "Withanolides", standard: "Withanolides 5 % (HPLC)", supports: "Stress resilience, energy and vitality",
  categories: ["Nutraceutical", "Food & beverage", "Popular herbal"], filterKeys: ["wellness", "food", "herbal"], color: "#B39A72", level: 0.56,
};
const amla = {
  id: "amla", name: "Amla Extract", latin: "Phyllanthus emblica",
  description: "Indian gooseberry, an Ayurvedic superfood for hair and skin, rich in vitamins, minerals and phytonutrients.",
  part: "Fruit", actives: "Vitamin C, tannins, polyphenols", standard: "Tannins 40 %", supports: "Hair and skin care, healthy circulation",
  categories: ["Nutraceutical", "Personal care", "Popular herbal"], filterKeys: ["wellness", "personal", "herbal"], color: "#A57C4E", level: 0.54,
};
const pomegranate = {
  id: "pomegranate", name: "Pomegranate Extract", latin: "Punica granatum",
  description: "Revered for thousands of years across Greek, Hebrew, Buddhist, Islamic and Christian writings.",
  part: "Fruit peel", actives: "Ellagic acid, punicalagins", standard: "Ellagic acid 40 % (HPLC)", supports: "Antioxidant protection",
  categories: ["Nutraceutical", "Food & beverage", "Personal care"], filterKeys: ["wellness", "food", "personal"], color: "#93453A", level: 0.5,
};

export const Default = () => <Night width={420} pad={36}><SpecimenCard {...ashwa} /><div style={{ height: 24 }} /></Night>;
export const InRequest = () => <Night width={420} pad={36}><SpecimenCard {...amla} added /><div style={{ height: 24 }} /></Night>;
export const Row = () => (
  <Night pad={36}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 300px)", gap: 28 }}>
      <SpecimenCard {...ashwa} /><SpecimenCard {...pomegranate} />
    </div>
    <div style={{ height: 24 }} />
  </Night>
);

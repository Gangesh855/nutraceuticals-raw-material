import Experience from "@/components/Experience";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import House from "@/components/sections/House";
import Library from "@/components/sections/Library";
import Field from "@/components/sections/Field";
import Approach from "@/components/sections/Approach";
import Process from "@/components/sections/Process";
import Console from "@/components/sections/Console";
import Quality from "@/components/sections/Quality";
import Atelier from "@/components/sections/Atelier";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <div className="progress" aria-hidden="true" />
      <canvas id="petals" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Ticker />
        <House />
        <Library />
        <Field />
        <Approach />
        <Process />
        <Console />
        <Quality />
        <Atelier />
      </main>
      <Footer />
      <Experience />
    </>
  );
}

"use client";
import { Canvas } from "@react-three/fiber";
import Particles from "./Particles";

export default function FooterScene() {
  return (
    <Canvas dpr={[1, 1.25]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true }}>
      <Particles count={140} color="#34D399" size={0.05} spread={10} />
      <Particles count={60} color="#F2E2A6" size={0.035} spread={8} />
    </Canvas>
  );
}

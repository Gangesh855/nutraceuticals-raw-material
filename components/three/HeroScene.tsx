"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import Rhizome from "./Rhizome";
import Particles from "./Particles";
import PauseOffscreen from "./PauseOffscreen";
import Molecule from "./Molecule";

export default function HeroScene() {
  return (
    <PauseOffscreen>{(visible) => (
    <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 4, 4]} intensity={2} color="#F2E2A6" />
      <pointLight position={[-4, -1, 2]} intensity={25} color="#10B981" />
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={3} color="#F2E2A6" position={[3, 3, 3]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#10B981" position={[-4, -1, 2]} scale={[4, 6, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 4, -3]} scale={4} />
      </Environment>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}><Rhizome /></Float>
      <Molecule scale={0.4} position={[3.2, 1.6, -1]} />
      <Molecule scale={0.28} position={[-3.4, -1.4, -0.5]} />
      <Particles count={450} />
      <Particles count={120} color="#34D399" size={0.045} spread={9} />
    </Canvas>
    )}</PauseOffscreen>
  );
}

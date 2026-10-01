"use client";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Particles from "./Particles";
import PauseOffscreen from "./PauseOffscreen";
import { HardCapsule, Softgel } from "./Capsule";
import Droplet from "./Droplet";

type Item =
  | { k: "hard"; fx: number; fy: number; s: number; a: string; b: string; p: string; rot: number; depth: number }
  | { k: "gel"; fx: number; fy: number; s: number; rot: number; depth: number };

// Positions are fractions of the visible width/height so the layout holds on any screen.
const WIDE: Item[] = [
  { k: "hard", fx: 0.58, fy: 0.24, s: 1.0, a: "#2f9e6e", b: "#f2e8c9", p: "#7fae4a", rot: 0.7, depth: 1 },
  { k: "gel", fx: 0.91, fy: 0.26, s: 1.05, rot: -0.5, depth: 1.4 },
  { k: "hard", fx: 0.6, fy: 0.8, s: 0.9, a: "#d4af37", b: "#f2e8c9", p: "#e0a010", rot: -0.9, depth: 0.8 },
  { k: "hard", fx: 0.965, fy: 0.9, s: 1.0, a: "#e9dcb5", b: "#e9dcb5", p: "#c8802a", rot: 0.4, depth: 1.5 },
  { k: "gel", fx: 0.74, fy: 0.07, s: 0.7, rot: 0.9, depth: 0.6 },
  { k: "hard", fx: 0.5, fy: 0.52, s: 0.55, a: "#2f9e6e", b: "#2f9e6e", p: "#9ccf6d", rot: 1.2, depth: 0.5 },
];
const NARROW: Item[] = [
  { k: "gel", fx: 0.9, fy: 0.93, s: 0.7, rot: -0.5, depth: 1.3 },
  { k: "hard", fx: 0.9, fy: 0.19, s: 0.5, a: "#d4af37", b: "#f2e8c9", p: "#e0a010", rot: -0.9, depth: 0.7 },
  { k: "hard", fx: 0.55, fy: 0.96, s: 0.5, a: "#2f9e6e", b: "#f2e8c9", p: "#7fae4a", rot: 0.7, depth: 1 },
];

function Layout() {
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const narrow = viewport.width / viewport.height < 1.2;
  const items = narrow ? NARROW : WIDE;
  const w = (fx: number) => (fx - 0.5) * viewport.width;
  const h = (fy: number) => (0.5 - fy) * viewport.height;

  useFrame((state) => {
    const g = group.current; if (!g) return;
    // gentle parallax: whole set drifts opposite the cursor
    g.position.x += (-state.pointer.x * 0.18 - g.position.x) * 0.04;
    g.position.y += (-state.pointer.y * 0.1 - g.position.y) * 0.04;
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Float key={i} speed={1 + (i % 3) * 0.35} rotationIntensity={0.9} floatIntensity={0.9 + it.depth * 0.3}>
          <group position={[w(it.fx), h(it.fy), it.depth - 0.8]} rotation={[0.5, 0, it.rot]}>
            {it.k === "hard"
              ? <HardCapsule colorA={it.a} colorB={it.b} powder={it.p} scale={it.s * (narrow ? 0.9 : 1.15)} />
              : <Softgel scale={it.s * (narrow ? 0.9 : 1.15)} />}
          </group>
        </Float>
      ))}
      {!narrow && (
        <>
          <Droplet x={w(0.665)} top={h(0.06)} fall={viewport.height * 0.2} phase={0.0} />
          <Droplet x={w(0.83)} top={h(0.05)} fall={viewport.height * 0.22} phase={0.42} size={0.17} speed={0.15} />
        </>
      )}
    </group>
  );
}

export default function HeroScene() {
  return (
    <PauseOffscreen>{(visible) => (
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        {/* Cinematic sunlight: warm key from upper right, cool leaf-green bounce, soft white strip for specular streaks */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 5, 4]} intensity={2.6} color="#ffd88a" />
        <pointLight position={[-4, -2, 3]} intensity={18} color="#5fd39a" />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={5} color="#ffd48a" position={[4, 4, 3]} scale={[3, 5, 1]} />
          <Lightformer form="rect" intensity={2.4} color="#8be6b0" position={[-5, 0, 2]} scale={[3, 7, 1]} />
          <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[0, 5, -2]} scale={[10, 1.2, 1]} />
          <Lightformer form="ring" intensity={1.4} color="#fff3d0" position={[0, -3, 4]} scale={4} />
        </Environment>
        <Layout />
        {/* dust motes catching the light */}
        <Particles count={140} color="#ffe2a0" size={0.028} spread={9} />
      </Canvas>
    )}</PauseOffscreen>
  );
}

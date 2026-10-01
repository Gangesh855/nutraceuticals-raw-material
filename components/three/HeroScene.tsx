"use client";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Particles from "./Particles";
import PauseOffscreen from "./PauseOffscreen";
import { HardCapsule, Softgel } from "./Capsule";
import Droplet from "./Droplet";
import BigCapsule from "./BigCapsule";
import Streams from "./Streams";
import type { Seq } from "@/lib/heroSeq";

type Item =
  | { k: "hard"; fx: number; fy: number; s: number; a: string; b: string; p: string; rot: number; depth: number }
  | { k: "gel"; fx: number; fy: number; s: number; rot: number; depth: number };

// Positions are fractions of the visible width/height so the layout holds on any screen.
const WIDE: Item[] = [
  { k: "hard", fx: 0.5, fy: 0.16, s: 0.62, a: "#2f9e6e", b: "#f2e8c9", p: "#7fae4a", rot: 0.7, depth: 0.8 },
  { k: "gel", fx: 0.965, fy: 0.14, s: 0.7, rot: -0.5, depth: 1.2 },
  { k: "hard", fx: 0.52, fy: 0.9, s: 0.6, a: "#d4af37", b: "#f2e8c9", p: "#e0a010", rot: -0.9, depth: 0.7 },
  { k: "gel", fx: 0.97, fy: 0.62, s: 0.55, rot: 0.9, depth: 0.6 },
];
const NARROW: Item[] = [
  { k: "gel", fx: 0.9, fy: 0.93, s: 0.7, rot: -0.5, depth: 1.3 },
  { k: "hard", fx: 0.88, fy: 0.07, s: 0.45, a: "#d4af37", b: "#f2e8c9", p: "#e0a010", rot: -0.9, depth: 0.7 },
  { k: "hard", fx: 0.18, fy: 0.96, s: 0.5, a: "#2f9e6e", b: "#f2e8c9", p: "#7fae4a", rot: 0.7, depth: 1 },
];

function Accents({ seq }: { seq: React.MutableRefObject<Seq> }) {
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const narrow = viewport.width / viewport.height < 1.2;
  const items = narrow ? NARROW : WIDE;
  const w = (fx: number) => (fx - 0.5) * viewport.width;
  const h = (fy: number) => (0.5 - fy) * viewport.height;

  useFrame((state) => {
    const g = group.current; if (!g) return;
    const k = seq.current.settle;
    g.visible = k > 0.02;
    g.scale.setScalar(Math.max(0.001, k));
    g.position.x += (-state.pointer.x * 0.18 - g.position.x) * 0.04;
    g.position.y += (-state.pointer.y * 0.1 - g.position.y) * 0.04;
  });

  return (
    <group ref={group} visible={false}>
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
          <Droplet x={w(0.585)} top={h(0.05)} fall={viewport.height * 0.16} phase={0.0} size={0.16} />
          <Droplet x={w(0.9)} top={h(0.05)} fall={viewport.height * 0.2} phase={0.42} size={0.14} speed={0.15} />
        </>
      )}
    </group>
  );
}

function Sequence({ seq, mobile }: { seq: React.MutableRefObject<Seq>; mobile: boolean }) {
  const mouth = useRef(new THREE.Vector3(0, 1.4, 0));
  return (
    <>
      <BigCapsule seq={seq} mouth={mouth} />
      <Streams seq={seq} mouth={mouth} count={mobile ? 1100 : 3200} />
      <Accents seq={seq} />
    </>
  );
}

export default function HeroScene({ seq, mobile = false }: { seq: React.MutableRefObject<Seq>; mobile?: boolean }) {
  return (
    <PauseOffscreen>{(visible) => (
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, mobile ? 1.4 : 1.75]} camera={{ position: [0, 0, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
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
        <Sequence seq={seq} mobile={mobile} />
        {/* dust motes catching the light */}
        <Particles count={mobile ? 70 : 140} color="#ffe2a0" size={0.028} spread={9} />
      </Canvas>
    )}</PauseOffscreen>
  );
}

"use client";
import { useRef } from "react";
import SafeCanvas from "./SafeCanvas";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import PauseOffscreen from "./PauseOffscreen";
import BigCapsule from "./BigCapsule";
import Streams from "./Streams";
import type { Seq } from "@/lib/heroSeq";

function Sequence({ seq }: { seq: React.MutableRefObject<Seq> }) {
  const mouth = useRef(new THREE.Vector3(0, 1.4, 0));
  return (
    <>
      <BigCapsule seq={seq} mouth={mouth} />
      <Streams seq={seq} />
    </>
  );
}

export default function HeroScene({ seq, mobile = false }: { seq: React.MutableRefObject<Seq>; mobile?: boolean }) {
  return (
    <PauseOffscreen>{(visible) => (
      <SafeCanvas frameloop={visible ? "always" : "never"} dpr={[1, mobile ? 1.4 : 1.75]} camera={{ position: [0, 0, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
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
        <Sequence seq={seq} />
      </SafeCanvas>
    )}</PauseOffscreen>
  );
}

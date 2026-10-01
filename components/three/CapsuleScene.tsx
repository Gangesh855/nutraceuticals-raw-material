"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import SafeCanvas from "./SafeCanvas";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Particles from "./Particles";

function Capsule({ color, open }: { color: string; open: boolean }) {
  const top = useRef<THREE.Mesh>(null);
  const bottom = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (group.current) { group.current.rotation.y += dt * 0.8; group.current.rotation.z = 0.5 + state.pointer.x * 0.3; }
    const gap = open ? 0.35 : 0.02;
    if (top.current) top.current.position.y += (gap - top.current.position.y) * 0.1;
    if (bottom.current) bottom.current.position.y += (-gap - bottom.current.position.y) * 0.1;
  });
  return (
    <group ref={group}>
      <mesh ref={top}>
        <capsuleGeometry args={[0.45, 0.5, 16, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.15} clearcoat={1} transmission={0.35} thickness={0.5} />
      </mesh>
      <mesh ref={bottom}>
        <capsuleGeometry args={[0.44, 0.5, 16, 32]} />
        <meshPhysicalMaterial color="#F2E2A6" roughness={0.15} clearcoat={1} transmission={0.35} thickness={0.5} />
      </mesh>
    </group>
  );
}

export default function CapsuleScene({ color, open = false }: { color: string; open?: boolean }) {
  return (
    <SafeCanvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 40 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 3]} intensity={2} />
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={3} color="#F2E2A6" position={[3, 3, 3]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#10B981" position={[-4, -1, 2]} scale={[4, 6, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 4, -3]} scale={4} />
      </Environment>
      <Float speed={2} floatIntensity={0.5}><Capsule color={color} open={open} /></Float>
      {open && <Particles count={140} color={color} spread={3} size={0.05} />}
    </SafeCanvas>
  );
}

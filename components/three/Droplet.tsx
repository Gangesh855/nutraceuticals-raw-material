"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function teardrop() {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 48; i++) {
    const u = i / 48;
    pts.push(new THREE.Vector2(0.5 * Math.sin(Math.PI * Math.pow(u, 0.75)) * (1 - 0.15 * u), u * 1.5 - 0.35));
  }
  return new THREE.LatheGeometry(pts, 36);
}

type Props = { x: number; top: number; fall: number; phase: number; color?: string; size?: number; speed?: number };

/** A glossy extract droplet that falls, stretches slightly, and loops. */
export default function Droplet({ x, top, fall, phase, color = "#d98a06", size = 0.22, speed = 0.18 }: Props) {
  const ref = useRef<THREE.Mesh>(null);
  const { geo, mat } = useMemo(() => ({
    geo: teardrop(),
    mat: new THREE.MeshPhysicalMaterial({
      color, transparent: true, opacity: 0.9, roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02,
      envMapIntensity: 2.4, ior: 1.46, emissive: "#6b3a00", emissiveIntensity: 0.35,
    }),
  }), [color]);
  useFrame((s) => {
    const m = ref.current; if (!m) return;
    const t = (s.clock.elapsedTime * speed + phase) % 1;
    const e = t * t; // accelerates like gravity
    m.position.set(x + Math.sin(t * 6 + phase * 9) * 0.015, top - e * fall, 0);
    m.scale.set(size * (1 - e * 0.18), size * (1 + e * 0.55), size * (1 - e * 0.18));
    mat.opacity = Math.min(1, t * 8) * Math.min(1, (1 - t) * 6) * 0.92;
  });
  return <mesh ref={ref} geometry={geo} material={mat} />;
}

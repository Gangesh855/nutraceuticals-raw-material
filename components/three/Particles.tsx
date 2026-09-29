"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles({ count = 500, color = "#D4AF37", spread = 7, size = 0.03 }: { count?: number; color?: string; spread?: number; size?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread * 1.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      speeds[i] = 0.05 + Math.random() * 0.15;
    }
    return { positions, speeds };
  }, [count, spread]);

  useFrame((state, dt) => {
    const g = ref.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!g) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      let y = g.getY(i) + speeds[i] * dt;
      if (y > spread / 2) y = -spread / 2;
      g.setY(i, y);
      g.setX(i, g.getX(i) + Math.sin(t * 0.4 + i) * 0.0008);
    }
    g.needsUpdate = true;
    if (ref.current) ref.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

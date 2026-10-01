"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function lumpy(geo: THREE.BufferGeometry, amp: number, seed: number) {
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * 5 + seed) * Math.cos(v.y * 4 + seed * 2) * Math.sin(v.z * 5 + seed * 3);
    v.multiplyScalar(1 + n * amp);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

const FINGERS: { pos: [number, number, number]; rot: [number, number, number]; len: number; r: number }[] = [
  { pos: [0, 0, 0], rot: [0, 0, Math.PI / 2], len: 1.8, r: 0.5 },
  { pos: [0.5, 0.6, 0.1], rot: [0.2, 0, 0.35], len: 1.2, r: 0.32 },
  { pos: [-0.6, 0.55, -0.1], rot: [-0.2, 0, -0.5], len: 1.1, r: 0.3 },
  { pos: [0.9, -0.5, 0.2], rot: [0.3, 0, -0.4], len: 0.9, r: 0.26 },
  { pos: [-1.0, -0.45, 0], rot: [0, 0.2, 0.5], len: 0.8, r: 0.25 },
];

export default function Rhizome() {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  // Wide screens: sit to the right of the headline. Narrow/portrait: centre, lower and smaller so it never clips or covers copy.
  const narrow = viewport.width / viewport.height < 1.2;
  const BASE_X = narrow ? 0 : viewport.width * 0.27;
  const BASE_Y = narrow ? -viewport.height * 0.36 : 0;
  const SCALE = narrow ? 0.45 : 0.8;
  const geos = useMemo(() => FINGERS.map((f, i) => lumpy(new THREE.CapsuleGeometry(f.r, f.len, 12, 32), 0.12, i * 1.7)), []);
  const rings = useMemo(() => new THREE.TorusGeometry(1, 0.008, 6, 48), []);

  useFrame((state, dt) => {
    const g = group.current; if (!g) return;
    g.rotation.y += dt * 0.25;
    g.rotation.x += ((state.pointer.y * 0.3) - g.rotation.x) * 0.05;
    g.position.x += ((BASE_X + state.pointer.x * 0.4) - g.position.x) * 0.05;
    g.position.y += ((BASE_Y + Math.sin(state.clock.elapsedTime * 0.8) * 0.08) - g.position.y) * 0.1;
  });

  return (
    <group ref={group} scale={SCALE} position={[BASE_X, BASE_Y, 0]}>
      {FINGERS.map((f, i) => (
        <mesh key={i} geometry={geos[i]} position={f.pos} rotation={f.rot}>
          <meshPhysicalMaterial color="#D9861A" roughness={0.55} metalness={0.05} clearcoat={0.2} emissive="#5a2d00" emissiveIntensity={0.35} />
        </mesh>
      ))}
      {[-0.8, -0.3, 0.3, 0.8].map((x) => (
        <mesh key={x} geometry={rings} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={0.52}>
          <meshBasicMaterial color="#8a4a00" />
        </mesh>
      ))}
    </group>
  );
}

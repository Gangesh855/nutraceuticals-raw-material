"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";

const ATOMS: [number, number, number][] = [[0, 0, 0], [0.9, 0.5, 0.1], [1.8, 0, -0.1], [-0.9, 0.5, 0.2], [-1.8, 0, 0], [0.9, -0.6, 0.4], [-0.9, -0.6, -0.3]];
const BONDS: [number, number][] = [[0, 1], [1, 2], [0, 3], [3, 4], [0, 5], [0, 6]];

function Bond({ a, b }: { a: THREE.Vector3; b: THREE.Vector3 }) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const dir = b.clone().sub(a);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return (
    <mesh position={mid} quaternion={q}>
      <cylinderGeometry args={[0.03, 0.03, dir.length(), 8]} />
      <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.4} />
    </mesh>
  );
}

export default function Molecule({ scale = 1, ...props }: { scale?: number } & ThreeElements["group"]) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (ref.current) { ref.current.rotation.y += dt * 0.3; ref.current.rotation.x += dt * 0.1; } });
  const vecs = ATOMS.map((p) => new THREE.Vector3(...p));
  return (
    <group ref={ref} scale={scale} {...props}>
      {vecs.map((v, i) => (
        <mesh key={i} position={v}>
          <sphereGeometry args={[i === 0 ? 0.2 : 0.14, 24, 24]} />
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.35} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {BONDS.map(([i, j]) => <Bond key={`${i}-${j}`} a={vecs[i]} b={vecs[j]} />)}
    </group>
  );
}

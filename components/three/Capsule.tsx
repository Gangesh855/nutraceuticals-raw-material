"use client";
import { useMemo } from "react";
import * as THREE from "three";

/** Half of a two-piece capsule: open end at y=0, straight wall, hemispherical cap. */
function halfCapsule(r: number, h: number) {
  const pts: THREE.Vector2[] = [new THREE.Vector2(r, 0), new THREE.Vector2(r, h)];
  const N = 14;
  for (let i = 1; i <= N; i++) {
    const a = (i / N) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.cos(a) * r, h + Math.sin(a) * r));
  }
  return new THREE.LatheGeometry(pts, 40);
}

const shell = (color: string, opacity = 0.8) =>
  new THREE.MeshPhysicalMaterial({
    color, transparent: true, opacity, roughness: 0.07, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04,
    envMapIntensity: 1.9, specularIntensity: 1, depthWrite: false,
  });

type Props = { colorA: string; colorB: string; powder: string; scale?: number } & React.ComponentProps<"group">;

/** Two-piece hard capsule: glossy translucent shells with visible powder fill. */
export function HardCapsule({ colorA, colorB, powder, scale = 1, ...rest }: Props) {
  const r = 0.26, h = 0.3;
  const { a, b, core, ma, mb, mc } = useMemo(() => ({
    a: halfCapsule(r, h), b: halfCapsule(r * 1.025, h),
    core: new THREE.CapsuleGeometry(r * 0.8, h * 1.3, 8, 20),
    ma: shell(colorA), mb: shell(colorB),
    mc: new THREE.MeshStandardMaterial({ color: powder, roughness: 1, emissive: powder, emissiveIntensity: 0.12 }),
  }), [colorA, colorB, powder]);
  return (
    <group scale={scale} {...rest}>
      <mesh geometry={core} material={mc} />
      <mesh geometry={a} material={ma} position={[0, -0.05, 0]} />
      <mesh geometry={b} material={mb} position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]} />
    </group>
  );
}

/** One-piece softgel filled with golden oil. */
export function Softgel({ scale = 1, ...rest }: { scale?: number } & React.ComponentProps<"group">) {
  const { g, m, inner, mi } = useMemo(() => ({
    g: new THREE.CapsuleGeometry(0.27, 0.34, 12, 36),
    m: shell("#e8a317", 0.72),
    inner: new THREE.SphereGeometry(0.12, 20, 20),
    mi: new THREE.MeshBasicMaterial({ color: "#fff1b8", transparent: true, opacity: 0.35 }),
  }), []);
  return (
    <group scale={scale} {...rest}>
      <mesh geometry={g} material={m} />
      <mesh geometry={inner} material={mi} position={[-0.07, 0.12, 0.17]} scale={[0.6, 1.1, 0.4]} />
    </group>
  );
}

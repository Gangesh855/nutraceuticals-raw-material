"use client";
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Seq } from "@/lib/heroSeq";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }
`;
// A slow, soft band of light travels along each thread; the thread itself stays faint.
const FRAG = /* glsl */ `
  uniform vec3 uCol; uniform float uAmt, uTime, uPhase, uWide;
  varying vec2 vUv;
  void main(){
    float t = vUv.x;
    float flow = fract(t*1.2 - uTime*.16 + uPhase);
    float band = smoothstep(0.,.35,flow)*smoothstep(1.,.55,flow);
    float ends = smoothstep(0.,.08,t)*smoothstep(1.,.86,t);
    float a = uAmt*ends*(.12 + .6*band) * mix(1., .35, uWide);
    gl_FragColor = vec4(uCol, a);
  }
`;
// moringa, turmeric, ginger, bacopa, boswellia
const COLORS = ["#6fe08a", "#ffab2e", "#f4dc83", "#a3ea7e", "#f59a1b"].map((c) => new THREE.Color(c));

/** Five slender threads of coloured light that run from the screen edges into the capsule mouth while it fills. */
export default function Streams({ seq }: { seq: React.MutableRefObject<Seq> }) {
  const { viewport } = useThree();
  const vw = viewport.width, vh = viewport.height;

  const items = useMemo(() => {
    const dst = new THREE.Vector3(0, 0.55, 0); // the open rim of the lower half
    const src: [number, number][] = [[-0.62, 0.3], [-0.62, -0.14], [0.62, 0.34], [0.62, -0.2], [0, 0.7]];
    return src.flatMap(([fx, fy], i) => {
      const a = new THREE.Vector3(fx * vw, fy * vh, 0);
      const mid = new THREE.Vector3(THREE.MathUtils.lerp(a.x, dst.x, 0.45), Math.max(a.y, dst.y) + 0.35 * vh, 0);
      const curve = new THREE.CatmullRomCurve3([a, mid, dst.clone().add(new THREE.Vector3(0, 0.25, 0)), dst]);
      return [0.011, 0.045].map((r, k) => ({
        geo: new THREE.TubeGeometry(curve, 90, r, 6, false),
        mat: new THREE.ShaderMaterial({
          vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
          uniforms: { uCol: { value: COLORS[i] }, uAmt: { value: 0 }, uTime: { value: 0 }, uPhase: { value: i * 0.21 }, uWide: { value: k } },
        }),
      }));
    });
  }, [vw, vh]);

  useFrame((state) => {
    const s = seq.current, amt = Math.max(0, Math.min(1, s.stream)) * Math.min(1, s.capsuleIn * 2);
    for (const it of items) { it.mat.uniforms.uAmt.value = amt; it.mat.uniforms.uTime.value = state.clock.elapsedTime; }
  });

  return <group renderOrder={3}>{items.map((it, i) => <mesh key={i} geometry={it.geo} material={it.mat} frustumCulled={false} />)}</group>;
}

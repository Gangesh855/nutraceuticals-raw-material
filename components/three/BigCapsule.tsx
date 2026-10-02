"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { halfCapsule } from "./Capsule";
import type { Seq } from "@/lib/heroSeq";

const R = 0.5, HS = 0.72, OV = 0.1;
export const CAP_LEN = 2 * (HS + R) - OV; // outer length of the capsule in local units

const LIQ_VERT = /* glsl */ `
  varying vec3 vW; varying vec3 vN;
  void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*w; }
`;
// Five extracts layered bottom → top: moringa green, turmeric orange, ginger gold, bacopa green, boswellia amber.
const LIQ_FRAG = /* glsl */ `
  uniform float uLevel, uBottom, uHeight, uTime, uGlow; varying vec3 vW; varying vec3 vN;
  vec3 ramp(float h){
    vec3 c0=vec3(.27,.76,.43), c1=vec3(.96,.60,.09), c2=vec3(.94,.79,.30), c3=vec3(.50,.85,.44), c4=vec3(.90,.52,.05);
    h = clamp(h,0.,1.)*4.;
    if(h<1.) return mix(c0,c1,smoothstep(0.,1.,h));
    if(h<2.) return mix(c1,c2,smoothstep(0.,1.,h-1.));
    if(h<3.) return mix(c2,c3,smoothstep(0.,1.,h-2.));
    return mix(c3,c4,smoothstep(0.,1.,h-3.));
  }
  void main(){
    float wave = sin(vW.x*6.+uTime*2.)*.012 + sin(vW.z*5.-uTime*1.7)*.01;
    float lvl = uLevel + wave;
    if (vW.y > lvl) discard;
    float h = (vW.y-uBottom)/uHeight;
    float swirl = sin(h*9.+uTime*.8+vW.x*2.)*.04;
    vec3 col = ramp(h+swirl);
    vec3 V = normalize(cameraPosition - vW);
    float fres = pow(1.-abs(dot(normalize(vN),V)),2.2);
    float surf = smoothstep(.07,0.,lvl - vW.y);
    vec3 outc = col*.82 + col*(.3+uGlow*.75)*.45 + fres*vec3(1.,.93,.7)*(.3+uGlow*.4) + surf*vec3(1.,.95,.75)*.8;
    gl_FragColor = vec4(outc, .94);
  }
`;

function haloTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d")!; const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(255,226,150,1)"); grd.addColorStop(0.25, "rgba(255,196,96,.45)"); grd.addColorStop(1, "rgba(255,170,60,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// Same five-colour ramp as the liquid shader (moringa, turmeric, ginger, bacopa, boswellia), bottom → top.
const RAMP = ["#45c26e", "#f59a17", "#efca4d", "#7fd871", "#e6850d"].map((c) => new THREE.Color(c));
const rampAt = (h: number, out: THREE.Color) => {
  const x = Math.min(0.9999, Math.max(0, h)) * 4, i = Math.floor(x);
  return out.copy(RAMP[i]).lerp(RAMP[i + 1], x - i);
};

/** Granules and berry-like beads suspended in the capsule; each appears as the fill level passes it. */
function Contents({ seq }: { seq: React.MutableRefObject<Seq> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const N = 64;
  const data = useMemo(() => Array.from({ length: N }, () => {
    const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 0.34, y = (Math.random() * 2 - 1) * 1.0;
    return { x: Math.cos(a) * r, z: Math.sin(a) * r, y, s: 0.024 + Math.pow(Math.random(), 2) * 0.05, ph: Math.random() * 6.28 };
  }), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const coloured = useRef(false);
  useFrame((state) => {
    const m = ref.current; if (!m) return;
    if (!coloured.current) {
      data.forEach((d, i) => m.setColorAt(i, rampAt((d.y + 1) / 2, col)));
      (m.instanceColor as THREE.InstancedBufferAttribute).needsUpdate = true;
      coloured.current = true;
    }
    const s = seq.current, t = state.clock.elapsedTime, level = -1.1 + s.fill * 2.2 * 1.03;
    data.forEach((d, i) => {
      const vis = Math.min(1, Math.max(0, (level - d.y - 0.04) / 0.18));
      dummy.position.set(d.x + Math.sin(t * 0.7 + d.ph) * 0.012, d.y + Math.sin(t * 0.9 + d.ph) * 0.014, d.z);
      dummy.scale.setScalar(d.s * vis * (0.92 + 0.08 * Math.sin(t * 2 + d.ph)));
      dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.12 + s.glow * 0.55;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]} renderOrder={1}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial roughness={0.45} metalness={0.05} emissive="#ffb347" />
    </instancedMesh>
  );
}

/** A soft plume of extract powder that lifts out of the open capsule while it fills, then fades as the cap closes. */
function Powder({ seq }: { seq: React.MutableRefObject<Seq> }) {
  const mat = useRef<THREE.PointsMaterial>(null);
  const N = 70;
  const { geo, seed } = useMemo(() => {
    const seed = Array.from({ length: N }, () => ({ a: Math.random() * 6.28, r: Math.random() * 0.3, v: 0.25 + Math.random() * 0.45, o: Math.random() }));
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
    return { geo: g, seed };
  }, []);
  useFrame((state) => {
    const s = seq.current, t = state.clock.elapsedTime;
    const on = Math.min(1, Math.max(0, (s.fill - 0.04) / 0.1)) * (1 - Math.min(1, Math.max(0, (s.fill - 0.5) / 0.2)));
    if (mat.current) mat.current.opacity = on * 0.45;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    seed.forEach((d, i) => {
      const k = (t * d.v * 0.35 + d.o) % 1; // 0 at the mouth → 1 at the top of the plume
      pos.setXYZ(i, Math.cos(d.a + t * 0.2) * (d.r + k * 0.35), 1.0 + k * 1.1, Math.sin(d.a + t * 0.2) * (d.r + k * 0.35));
    });
    pos.needsUpdate = true;
  });
  return <points geometry={geo} renderOrder={4}><pointsMaterial ref={mat} color="#f3e6b0" size={0.03} sizeAttenuation transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
}

/** Thin dotted orbit rings around the finished capsule. */
function OrbitRings({ seq }: { seq: React.MutableRefObject<Seq> }) {
  const g = useRef<THREE.Group>(null);
  const mats = useRef<THREE.PointsMaterial[]>([]);
  const geos = useMemo(() => [0.05].map((y, k) => {
    const pts: number[] = [], n = 150, a = 1.18 + k * 0.05, b = 0.46;
    for (let i = 0; i < n; i++) { const th = (i / n) * Math.PI * 2; pts.push(Math.cos(th) * a, y, Math.sin(th) * b * 1.6); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); return geo;
  }), []);
  useFrame((state) => {
    const s = seq.current, t = state.clock.elapsedTime, vis = Math.max(0, s.settle - 0.3) / 0.7 * s.glow;
    if (g.current) { g.current.visible = vis > 0.01; g.current.rotation.y = t * 0.08; g.current.rotation.x = 0.5; }
    mats.current.forEach((m, i) => { if (m) m.opacity = vis * 0.3; });
  });
  return (
    <group ref={g} visible={false}>
      {geos.map((geo, i) => (
        <points key={i} geometry={geo}>
          <pointsMaterial ref={(m) => { if (m) mats.current[i] = m; }} color="#e9e06a" size={0.034} sizeAttenuation transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
      ))}
    </group>
  );
}

type Props = { seq: React.MutableRefObject<Seq>; mouth: React.MutableRefObject<THREE.Vector3> };

/** The hero capsule: transparent glass shells, layered liquid that fills with the sequence, and a glow that rises with the fill. */
export default function BigCapsule({ seq, mouth }: Props) {
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const cap = useRef<THREE.Group>(null); // the top half: floats above while the capsule fills, then lowers to close
  const halo = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const { shellA, shellB, liquid, liqMat, shellMat, haloMat } = useMemo(() => {
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: "#eef8f2", transparent: true, opacity: 0.4, roughness: 0.16, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08,
      envMapIntensity: 2.4, depthWrite: false, side: THREE.DoubleSide,
    });
    const liqMat = new THREE.ShaderMaterial({
      vertexShader: LIQ_VERT, fragmentShader: LIQ_FRAG, transparent: true, side: THREE.DoubleSide,
      uniforms: { uLevel: { value: -9 }, uBottom: { value: 0 }, uHeight: { value: 1 }, uTime: { value: 0 }, uGlow: { value: 0 } },
    });
    const L = 2 * HS + 2 * R - 0.14 - 2 * R * 0.93;
    return {
      shellA: halfCapsule(R, HS), shellB: halfCapsule(R * 1.025, HS),
      liquid: new THREE.CapsuleGeometry(R * 0.93, L, 14, 40),
      liqMat, shellMat,
      haloMat: new THREE.MeshBasicMaterial({ map: haloTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }),
    };
  }, []);

  useFrame((state, dt) => {
    const g = group.current, sp = spin.current; if (!g || !sp) return;
    const s = seq.current, t = state.clock.elapsedTime;
    const k = Math.min(1, Math.max(0, (s.fill - 0.42) / 0.28)); // closes between 42 % and 70 % full
    if (cap.current) { const lift = 1 - k * k * (3 - 2 * k); cap.current.position.y = 1.05 * lift; cap.current.rotation.z = 0.2 * lift * Math.sin(t * 0.8 + 1); }
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.05;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.05;

    const narrow = viewport.width / viewport.height < 1.2;
    const e = s.settle * s.settle * (3 - 2 * s.settle);
    const tx = narrow ? 0 : (0.74 - 0.5) * viewport.width, ty = narrow ? (0.5 - 0.225) * viewport.height : (0.5 - 0.4) * viewport.height;
    const tScale = narrow ? 0.44 : 0.86, sScale = narrow ? 0.85 : 1.05;
    const pop = 0.82 + 0.18 * s.capsuleIn;
    const sc = (sScale + (tScale - sScale) * e) * pop;
    g.visible = s.capsuleIn > 0.01;
    g.scale.setScalar(sc);
    g.position.set(tx * e + pointer.current.x * 0.25, ty * e + Math.sin(t * 0.9) * 0.07 + pointer.current.y * 0.15, 0);
    sp.rotation.y = t * 0.3 + pointer.current.x * 0.5;
    sp.rotation.x = 0.06 + pointer.current.y * 0.12;
    g.rotation.z = 0.2 + pointer.current.x * 0.08;

    // liquid level in world space (stays horizontal while the capsule tilts)
    const wy = g.position.y, h = CAP_LEN * sc, bottom = wy - h / 2 + 0.07 * sc, height = h - 0.14 * sc;
    const u = liqMat.uniforms;
    u.uBottom.value = bottom; u.uHeight.value = height; u.uLevel.value = bottom + s.fill * height * 1.03 - (s.fill <= 0 ? 1 : 0);
    u.uTime.value = t; u.uGlow.value = s.glow;
    shellMat.opacity = 0.4 * s.capsuleIn;
    // illumination
    if (halo.current) { halo.current.scale.setScalar(5.2 + s.glow * 1.4 + Math.sin(t * 2) * 0.08 * s.glow); haloMat.opacity = Math.min(1, s.glow) * 0.55 * s.capsuleIn; }
    if (light.current) light.current.intensity = 1 + s.glow * 26;
    mouth.current.set(g.position.x, wy + (CAP_LEN * sc) / 2 + 0.12, 0);
  });

  return (
    <group ref={group} visible={false}>
      <mesh ref={halo} material={haloMat} position={[0, 0, -0.8]} renderOrder={0}><planeGeometry args={[1, 1]} /></mesh>
      <pointLight ref={light} color="#ffd27a" distance={9} decay={1.6} />
      <group ref={spin}>
        <mesh geometry={liquid} material={liqMat} renderOrder={1} />
        <Contents seq={seq} />
        <Powder seq={seq} />
        {/* seam where the two halves meet */}
        <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={3}>
          <torusGeometry args={[R * 1.035, 0.013, 12, 72]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.6} roughness={0.08} clearcoat={1} envMapIntensity={2.6} depthWrite={false} />
        </mesh>
        <group ref={cap}><mesh geometry={shellA} material={shellMat} position={[0, -0.05, 0]} renderOrder={2} /></group>
        <mesh geometry={shellB} material={shellMat} position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]} renderOrder={2} />
      </group>
      <OrbitRings seq={seq} />
    </group>
  );
}

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
    vec3 outc = col*.75 + col*(.35+uGlow*1.35)*.55 + fres*vec3(1.,.93,.7)*(.35+uGlow*.6) + surf*vec3(1.,.95,.75)*.9;
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

type Props = { seq: React.MutableRefObject<Seq>; mouth: React.MutableRefObject<THREE.Vector3> };

/** The hero capsule: transparent glass shells, layered liquid that fills with the sequence, and a glow that rises with the fill. */
export default function BigCapsule({ seq, mouth }: Props) {
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const { shellA, shellB, liquid, liqMat, shellMat, haloMat } = useMemo(() => {
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: "#e8f6ef", transparent: true, opacity: 0.2, roughness: 0.03, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03,
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
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.05;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.05;

    const narrow = viewport.width / viewport.height < 1.2;
    const e = s.settle * s.settle * (3 - 2 * s.settle);
    const tx = narrow ? 0 : (0.72 - 0.5) * viewport.width, ty = narrow ? (0.5 - 0.17) * viewport.height : (0.5 - 0.4) * viewport.height;
    const tScale = narrow ? 0.5 : 0.86, sScale = narrow ? 0.85 : 1.05;
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
    shellMat.opacity = 0.2 * s.capsuleIn;
    // illumination
    if (halo.current) { halo.current.scale.setScalar(5.2 + s.glow * 1.4 + Math.sin(t * 2) * 0.08 * s.glow); haloMat.opacity = Math.min(1, s.glow) * 0.75 * s.capsuleIn; }
    if (light.current) light.current.intensity = 1 + s.glow * 26;
    mouth.current.set(g.position.x, wy + (CAP_LEN * sc) / 2 + 0.12, 0);
  });

  return (
    <group ref={group} visible={false}>
      <mesh ref={halo} material={haloMat} position={[0, 0, -0.8]} renderOrder={0}><planeGeometry args={[1, 1]} /></mesh>
      <pointLight ref={light} color="#ffd27a" distance={9} decay={1.6} />
      <group ref={spin}>
        <mesh geometry={liquid} material={liqMat} renderOrder={1} />
        <mesh geometry={shellA} material={shellMat} position={[0, -0.05, 0]} renderOrder={2} />
        <mesh geometry={shellB} material={shellMat} position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]} renderOrder={2} />
      </group>
    </group>
  );
}

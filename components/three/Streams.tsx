"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Seq } from "@/lib/heroSeq";

const VERT = /* glsl */ `
  uniform float uTime, uStream, uPx; uniform vec3 uSrc[5]; uniform vec3 uCol[5]; uniform vec3 uDst;
  attribute vec4 aR; varying vec3 vC; varying float vA;
  void main(){
    int si = int(aR.x + .5);
    vec3 a = uSrc[si]; vec3 d = uDst;
    vec3 m = vec3(mix(a.x, d.x, .35), mix(a.y, d.y, .5) + 1.3, 0.);
    float t = fract(aR.y*7. + uTime*aR.z);
    vec3 p = (1.-t)*(1.-t)*a + 2.*(1.-t)*t*m + t*t*d;
    float amp = sin(t*3.14159)*.2;
    p.x += sin(t*18.+aR.y*40.+uTime*2.)*amp; p.z += cos(t*16.+aR.y*30.)*amp; p.y += sin(t*14.+aR.y*20.)*amp*.5;
    float on = step(aR.y, uStream);
    float edge = smoothstep(0.,.08,t)*smoothstep(1.,.9,t);
    vA = on*edge*(.35+.65*aR.w);
    vC = uCol[si];
    vec4 mv = modelViewMatrix*vec4(p,1.);
    gl_Position = projectionMatrix*mv;
    gl_PointSize = (3.+aR.w*8.)*uPx*(7./-mv.z);
  }
`;
const FRAG = /* glsl */ `
  varying vec3 vC; varying float vA;
  void main(){ float d = length(gl_PointCoord-.5); if(d>.5) discard; float a = pow(smoothstep(.5,0.,d),1.7)*vA; gl_FragColor = vec4(vC*1.25, a); }
`;
// moringa, turmeric, ginger, bacopa, boswellia
const COLORS = ["#59d973", "#ff9d1a", "#f2d36b", "#8fe26a", "#f08c0c"].map((c) => new THREE.Color(c));

/** Glowing particle streams that flow from five sources into the mouth of the capsule. */
export default function Streams({ seq, mouth, count }: { seq: React.MutableRefObject<Seq>; mouth: React.MutableRefObject<THREE.Vector3>; count: number }) {
  const { viewport } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { geo, uniforms } = useMemo(() => {
    const pos = new Float32Array(count * 3), r = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) r.set([i % 5, Math.random(), 0.05 + Math.random() * 0.1, Math.pow(Math.random(), 2)], i * 4);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aR", new THREE.BufferAttribute(r, 4));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4); // positions are computed on the GPU
    return {
      geo,
      uniforms: {
        uTime: { value: 0 }, uStream: { value: 0 }, uPx: { value: 1 },
        uSrc: { value: Array.from({ length: 5 }, () => new THREE.Vector3()) },
        uCol: { value: COLORS }, uDst: { value: new THREE.Vector3() },
      },
    };
  }, [count]);

  useFrame((state) => {
    const u = uniforms, s = seq.current, vw = viewport.width, vh = viewport.height;
    u.uTime.value = state.clock.elapsedTime;
    u.uStream.value = Math.max(0, Math.min(1, s.stream)) * Math.min(1, s.capsuleIn * 2);
    u.uPx.value = state.gl.getPixelRatio();
    const S = u.uSrc.value;
    S[0].set(-0.62 * vw, 0.3 * vh, 0); S[1].set(-0.62 * vw, -0.14 * vh, 0); S[2].set(0.62 * vw, 0.34 * vh, 0);
    S[3].set(0.62 * vw, -0.2 * vh, 0); S[4].set(0, 0.7 * vh, 0);
    u.uDst.value.copy(mouth.current);
  });

  return (
    <points geometry={geo} frustumCulled={false} renderOrder={3}>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

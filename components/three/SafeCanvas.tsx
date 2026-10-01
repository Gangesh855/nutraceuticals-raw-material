"use client";
import { Component, useEffect, useState } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";

/** True if this browser can create a WebGL context (false when GPU acceleration is off, blocked by policy, etc.). */
export function webglOK(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext(); // don't hold a context just for the probe
    return true;
  } catch {
    return false;
  }
}

class Boundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) { console.warn("3D scene disabled:", err); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** A <Canvas> that never takes the page down: renders nothing without WebGL, and swallows scene errors. */
export default function SafeCanvas(props: CanvasProps) {
  const [ok, setOk] = useState(false);
  useEffect(() => { setOk(webglOK()); }, []);
  if (!ok) return null;
  return <Boundary><Canvas {...props} /></Boundary>;
}

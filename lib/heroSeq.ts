/** Mutable state for the hero opening sequence. A GSAP timeline tweens these plain numbers; the WebGL scene and the
 *  2D close-up layers read them every frame (no React re-renders). */
export type Seq = {
  sceneF: number;   // 0..5  which close-up is on screen (integer part) and how far through it (fraction)
  lab: number;      // 1 → 0  close-ups (lab look) fade out
  veil: number;     // 0 → 1  frosted-glass transition between lab and final hero
  capsuleIn: number; // 0 → 1 the large capsule appears
  stream: number;   // 0 → 1 → 0 extract streams flowing into the capsule
  fill: number;     // 0 → 1 capsule fill level
  glow: number;     // 0 → 1 capsule illumination
  settle: number;   // 0 → 1 capsule moves to its final place; floating accents appear
};

export const makeSeq = (final: boolean): Seq =>
  final
    ? { sceneF: 5, lab: 0, veil: 1, capsuleIn: 1, stream: 0, fill: 1, glow: 1, settle: 1 }
    : { sceneF: 0, lab: 1, veil: 0, capsuleIn: 0, stream: 0, fill: 0, glow: 0, settle: 0 };

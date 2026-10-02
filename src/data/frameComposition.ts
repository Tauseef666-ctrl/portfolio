export type CompositionSide = "left" | "right" | "center";

export type FrameComposition = {
  p: number;
  x: number;
  y: number;
  side: CompositionSide;
};

/**
 * Character composition map computed from the actual frame assets
 * (luminance-mass centroid per sampled frame).
 * `p` is the scrub progress (0..1), `x`/`y` the character centroid (0..1),
 * `side` the negative-space side the character leaves open.
 */
export const FRAME_COMPOSITION: FrameComposition[] = [
  { p: 0.0, x: 0.544, y: 0.512, side: "center" },
  { p: 0.042, x: 0.511, y: 0.495, side: "center" },
  { p: 0.084, x: 0.482, y: 0.487, side: "center" },
  { p: 0.126, x: 0.413, y: 0.487, side: "center" },
  { p: 0.167, x: 0.348, y: 0.452, side: "left" },
  { p: 0.209, x: 0.371, y: 0.418, side: "left" },
  { p: 0.251, x: 0.38, y: 0.412, side: "left" },
  { p: 0.293, x: 0.365, y: 0.41, side: "left" },
  { p: 0.335, x: 0.361, y: 0.436, side: "left" },
  { p: 0.377, x: 0.335, y: 0.454, side: "left" },
  { p: 0.418, x: 0.295, y: 0.461, side: "left" },
  { p: 0.46, x: 0.28, y: 0.455, side: "left" },
  { p: 0.502, x: 0.278, y: 0.443, side: "left" },
  { p: 0.544, x: 0.292, y: 0.417, side: "left" },
  { p: 0.586, x: 0.372, y: 0.396, side: "left" },
  { p: 0.628, x: 0.411, y: 0.373, side: "center" },
  { p: 0.669, x: 0.431, y: 0.357, side: "center" },
  { p: 0.711, x: 0.488, y: 0.361, side: "center" },
  { p: 0.753, x: 0.498, y: 0.377, side: "center" },
  { p: 0.795, x: 0.573, y: 0.373, side: "center" },
  { p: 0.837, x: 0.645, y: 0.366, side: "right" },
  { p: 0.879, x: 0.635, y: 0.371, side: "right" },
  { p: 0.921, x: 0.625, y: 0.383, side: "right" },
  { p: 0.962, x: 0.615, y: 0.412, side: "right" },
];

export function sampleComposition(p: number): FrameComposition {
  let best = FRAME_COMPOSITION[0];
  for (const sample of FRAME_COMPOSITION) {
    if (Math.abs(sample.p - p) < Math.abs(best.p - p)) best = sample;
  }
  return best;
}
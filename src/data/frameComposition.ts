/**
 * Frame/stage geometry for the character-centred experience.
 *
 * Derived from analysis of the actual 240-frame asset: the character is a
 * centred figure that never leaves a central band of the frame —
 *   horizontal:  ~0.38–0.72, centre ~0.55
 *   vertical:    ~0.10 (head) to ~0.75 (feet)
 * The environment animates around it; bright regions occupy the outer edges.
 * Content is therefore always placed in the negative-space zones OUTSIDE this
 * protected band. Because frames are drawn contained (never cropped) on a 16:9
 * stage, these fractions map 1:1 to the on-screen stage.
 */

export const STAGE_RATIO = 16 / 9;

export const CHAR_BAND = {
  x0: 0.38,
  x1: 0.72,
  cx: 0.55,
  y0: 0.1,
  y1: 0.75,
};

export type StageZone = "intro" | "left" | "right" | "bottom" | "center" | "split";

/** Named negative-space zones a designer can place act content into. */
export const ZONE_BOUNDS: { left: number; right: number } = {
  left: 0.32,
  right: 0.68,
};

/** Viewport-safe central band so scrims never sit on top of the character. */
export function protectedWidth(): number {
  return CHAR_BAND.x1 - CHAR_BAND.x0;
}

/** True when `x` (0..1 stage fraction) overlaps the protected character band. */
export function overlapsCharacter(x0: number, x1: number): boolean {
  return x0 < CHAR_BAND.x1 && x1 > CHAR_BAND.x0;
}
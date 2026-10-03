/**
 * The journey is one continuous act list. Each act wins a window of the
 * pinned film (progress 0..1), and its content is placed in one negative-space
 * zone around the persistent centred character.
 *
 * The `window` also lets us snapshot a matching film frame so the character's
 * pose/state roughly suits the act (e.g. the calm end at the final frames).
 */

import type { StageZone } from "./frameComposition";

export type Act = {
  id: string;
  num: string;
  label: string;
  title: string;
  shot: string;
  zone: StageZone;
  window: [number, number];
};

export const ACTS: Act[] = [
  {
    id: "intro",
    num: "01",
    label: "Prologue",
    title: "An introduction",
    shot: "Isolated, in motion.",
    zone: "intro",
    window: [0.0, 0.08],
  },
  {
    id: "about",
    num: "02",
    label: "About",
    title: "Who I am",
    shot: "Human, first.",
    zone: "left",
    window: [0.08, 0.22],
  },
  {
    id: "craft",
    num: "03",
    label: "Craft",
    title: "What I build with",
    shot: "Tools of the trade.",
    zone: "split",
    window: [0.22, 0.44],
  },
  {
    id: "work",
    num: "04",
    label: "Work",
    title: "Things I've shipped",
    shot: "Every repo, one by one.",
    zone: "split",
    window: [0.44, 0.68],
  },
  {
    id: "proof",
    num: "05",
    label: "Proof",
    title: "Certified & credited",
    shot: "The evidence trail.",
    zone: "split",
    window: [0.68, 0.8],
  },
  {
    id: "explore",
    num: "06",
    label: "Experiments",
    title: "AI & testing playground",
    shot: "Curiosity, unterminated.",
    zone: "right",
    window: [0.8, 0.91],
  },
  {
    id: "reach",
    num: "07",
    label: "Reach",
    title: "Say hello",
    shot: "The character, finally still.",
    zone: "center",
    window: [0.91, 1.0],
  },
];

export function actAt(progress: number): Act {
  const clamped = Math.min(0.999999, Math.max(0, progress));
  for (const act of ACTS) {
    if (clamped >= act.window[0] && clamped < act.window[1]) return act;
  }
  return ACTS[ACTS.length - 1];
}

export function shotFrame(act: Act): number {
  return Math.min(
    239,
    Math.max(0, Math.round((act.window[1] - (act.window[1] - act.window[0]) / 3) * 239))
  );
}
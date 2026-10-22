// The film's camera. Shots aim it with a centre and a zoom (1 = the screen's width fills the frame) and name the
// width and height of what must stay in view; here it becomes a scale and an offset for a frame of any size. A phone's
// portrait frame (under 640 wide) leans in toward the subject instead of shrinking the whole screen; any wider frame
// sees exactly what the shot asks, so the wide shot is the whole screen. The camera never shows past the screen's
// edge. Pure.

import { clamp } from "./ease";
import { STAGE } from "./tokens";

export type Aim = { cx: number; cy: number; z: number; minW: number; minH: number };
export type Fit = { s: number; tx: number; ty: number };

export function fitCamera(aim: Aim, frameW: number, frameH: number): Fit {
  const lean = frameW < 640 ? clamp(1100 / frameW, 1, 3) : 1;
  const cover = Math.max(frameW / STAGE.w, frameH / STAGE.h);
  let s = (frameW / STAGE.w) * aim.z * lean;
  s = Math.min(s, frameW / aim.minW, frameH / aim.minH);
  s = Math.max(s, cover);
  const tx = clamp(frameW / 2 - aim.cx * s, frameW - STAGE.w * s, 0);
  const ty = clamp(frameH / 2 - aim.cy * s, frameH - STAGE.h * s, 0);
  return { s, tx, ty };
}

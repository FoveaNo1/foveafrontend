// A flat rectangle laid onto any four-cornered shape: the homography that takes a w × h box to four points, and the
// CSS matrix3d that draws it (with transform-origin at the box's top left). The page uses it to put the film on a
// laptop's screen in a photograph, however the laptop is turned, and to carry it from there to its own frame. Pure.

export type Pt = { x: number; y: number };
/** Corners in order: top left, top right, bottom right, bottom left. */
export type Quad = [Pt, Pt, Pt, Pt];

/** Solve the 8 × 8 system for the homography taking the box's corners to the quad's (h33 = 1). */
export function homography(w: number, h: number, q: Quad): number[] {
  const src: Pt[] = [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h }];
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = src[i], { x: u, y: v } = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  // Gaussian elimination with partial pivoting
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = c + 1; r < 8; r++) {
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const s = new Array(8).fill(0);
  for (let r = 7; r >= 0; r--) {
    let acc = b[r];
    for (let k = r + 1; k < 8; k++) acc -= A[r][k] * s[k];
    s[r] = acc / A[r][r];
  }
  return [s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], 1];
}

/** Where the homography takes a point. */
export function apply(H: number[], p: Pt): Pt {
  const d = H[6] * p.x + H[7] * p.y + H[8];
  return { x: (H[0] * p.x + H[1] * p.y + H[2]) / d, y: (H[3] * p.x + H[4] * p.y + H[5]) / d };
}

/** The CSS for it: a box w × h with transform-origin 0 0 lands exactly on the quad. */
export function matrix3d(w: number, h: number, q: Quad): string {
  const H = homography(w, h, q);
  const v = [H[0], H[3], 0, H[6], H[1], H[4], 0, H[7], 0, 0, 1, 0, H[2], H[5], 0, H[8]];
  return `matrix3d(${v.map((n) => +n.toFixed(9)).join(",")})`;
}

export const lerpPt = (a: Pt, b: Pt, p: number): Pt => ({ x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p });
export const lerpQuad = (a: Quad, b: Quad, p: number): Quad => [lerpPt(a[0], b[0], p), lerpPt(a[1], b[1], p), lerpPt(a[2], b[2], p), lerpPt(a[3], b[3], p)];
export const rectQuad = (x: number, y: number, w: number, h: number): Quad => [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
/** The quad's bounding box. */
export function bbox(q: Quad) {
  const xs = q.map((p) => p.x), ys = q.map((p) => p.y);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

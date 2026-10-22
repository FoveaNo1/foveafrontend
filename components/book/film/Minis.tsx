// A capture's picture: exactly what was taken, as it looked on the screen, at whatever size it is shown (the bar's
// stack, Choose chat's pile, the opened row, a flight). Each is drawn in the captured region's own coordinates, so
// it is the region itself, scaled: the board's glaze, the HDR file as Finder shows it, the brief's words as Fovea
// keeps them (a paper card), Maya's chart, the merged pull requests, the whole screen. One element holds every kind
// and shows the one its data-state names.
import { useId } from "react";
import { IN, PRS, type Agent } from "../../../lib/landing/film/content";

/** The vase in the film's Blender scene, in a 100 × 140 box: a lip, a neck, a round body (shared by the viewport, the
 *  render's thumbnail and the reference board). */
export const VASE = "M40 6 H60 C60 14 57 22 57 30 C57 42 86 56 86 88 C86 116 70 134 50 134 C30 134 14 116 14 88 C14 56 43 42 43 30 C43 22 40 14 40 6 Z";

const g = IN.board.glaze;
/** The ⌘ region on the reference board: the terracotta photograph, the vase's body filling it. The photo's vase sits
 *  at (35.3, 114) in the window, its 100 × 140 drawing at 1.114 (Desk.tsx Board). */
function ShotGlaze() {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="shot" viewBox={`0 0 ${g.w} ${g.h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`gz${id}`} gradientUnits="userSpaceOnUse" cx={61.8 - g.x} cy={130 - g.y} r="185">
          <stop offset="0" stopColor="#F1E7D8" /><stop offset="1" stopColor="#D9C9B4" />
        </radialGradient>
      </defs>
      <rect width={g.w} height={g.h} fill={`url(#gz${id})`} />
      <path d={VASE} transform={`translate(${35.3 - g.x} ${114 - g.y}) scale(1.1143)`} fill="#B4553A" />
    </svg>
  );
}

/** The HDR file, as Finder shows it in icon view: its preview and its name (dragged onto the notch, the file itself is taken). */
function ShotHdr() {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="shot" viewBox="0 0 100 106" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs>
        <linearGradient id={`hd${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#F5D6A6" /><stop offset=".3" stopColor="#F5D6A6" /><stop offset=".6" stopColor="#C98B54" /><stop offset="1" stopColor="#5E3C26" />
        </linearGradient>
      </defs>
      <rect width="100" height="106" fill="#fff" />
      <rect x="8.25" y=".25" width="83.5" height="55.5" rx="4" fill={`url(#hd${id})`} stroke="rgba(0,0,0,.15)" strokeWidth=".5" />
      <text x="50" y="72.5" fontSize="11" textAnchor="middle" fill="#222">golden_hour_loft.h</text>
      <text x="50" y="86.25" fontSize="11" textAnchor="middle" fill="#222">dr</text>
    </svg>
  );
}

/** The brief's words: words selected while Fovea listens are taken, which Fovea keeps as a paper card (a quote mark, then
 *  the lines). */
const ShotBrief = () => (
  <svg className="shot" viewBox="0 0 120 84" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="120" height="84" fill="#fff" />
    <text x="11" y="27" fontSize="24" fill="#B4B4B4" fontFamily="Georgia, serif">“</text>
    <text x="12" y="45" fontSize="13.5" fill="#222">4:5, eye level,</text>
    <text x="12" y="63" fontSize="13.5" fill="#222">soft shadows</text>
  </svg>
);

/** Maya's Signups chart, the card as it sits in her thread (IN.chat.chart, 392 × 230; Desk.tsx Chart). */
const TICKS: [string, number][] = [["Mon", 27], ["Tue", 77.5], ["Wednesday", 144.5], ["Thu", 211.5], ["Fri", 258], ["Saturday", 317.5], ["Sun", 380]];
const ShotChart = () => (
  <svg className="shot" viewBox="0 0 392 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect x=".5" y=".5" width="391" height="229" rx="14" fill="#fff" stroke="rgba(0,0,0,.1)" />
    <text x="16" y="27.5" fontSize="14" fontWeight="700" fill="#1D1D1F">Signups</text>
    <text x="376" y="27.5" fontSize="14" fontWeight="600" textAnchor="end" fill="#34C759">+18%</text>
    <g transform="translate(16 32.55) scale(.9184)">
      <path d="M14 132 L70 118 L126 124 L182 96 L238 100 L294 70 L378 34" fill="none" stroke="#0A84FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 146 H378" stroke="rgba(0,0,0,.12)" />
    </g>
    {TICKS.map(([d, x]) => <text key={d} x={x} y="191" fontSize="11" textAnchor="middle" fill="#8E8E93">{d}</text>)}
  </svg>
);

/** The merged pull requests, the region the eyes rested on (IN.browser.prs, 760 × 300: the six rows). */
const ShotPrs = () => (
  <svg className="shot" viewBox="0 0 760 300" preserveAspectRatio="xMinYMin slice" aria-hidden="true">
    <rect width="760" height="300" fill="#fff" />
    {PRS.map((p, i) => {
      const y = 14 + i * 50;
      return (
        <g key={p}>
          <circle cx="5" cy={y + 24.5} r="5" fill="#8250DF" />
          <text x="22" y={y + 29.5} fontSize="14.5" fill="#1D1D1F">{p}</text>
          <text x="760" y={y + 29} fontSize="12.5" textAnchor="end" fill="#8E8E93">merged</text>
          <path d={`M0 ${y + 49.5} H760`} stroke="rgba(0,0,0,.07)" />
        </g>
      );
    })}
  </svg>
);

/** `screen`: the whole screen, drawn once more (a still copy of the desk), only where a whole-screen capture can show,
 *  since it is heavy. */
export function Mini({ screen }: { screen?: React.ReactNode }) {
  return (
    <>
      <span data-m="glaze"><ShotGlaze /></span>
      <span data-m="hdr"><ShotHdr /></span>
      <span data-m="brief"><ShotBrief /></span>
      <span data-m="chart"><ShotChart /></span>
      <span data-m="prs"><ShotPrs /></span>
      {screen && <span data-m="screen" className="m-screen">{screen}</span>}
    </>
  );
}

export const Mark = ({ agent, size = 18 }: { agent: Agent; size?: number }) => (
  // eslint-disable-next-line @next/next/no-img-element -- a small static mark inside the film
  <img className="mark" src={agent === "fovea" ? "/landing/film/fovea-mark.png" : `/landing/agents/${agent}.png`} alt="" width={size} height={size} />
);

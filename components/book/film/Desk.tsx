import { DRAFT, IN, POS, PRS, WIN } from "../../../lib/landing/film/content";
import { useId } from "react";
import { Mini, VASE } from "./Minis";

// The Mac the film happens on: a 13-inch screen in points, its wallpaper, a plain menu bar, windows drawn in HTML (no
// app icons, no logos), and what moves over them: selections, taken words, the pointer, the gaze ring, captures in
// flight. The film places all of it (film.ts). `still` draws Today's desk once more, as a picture: the whole-screen
// capture's screenshot, with no keys for the film to move (the renderer skips anything inside [data-still]).

const Lights = () => <span className="lights"><i /><i /><i /></span>;
/** The film's handle on an element, or none in the still copy. */
const key = (still: boolean | undefined, k: string) => (still ? {} : { "data-k": k });

function Win({ id, title, children, className = "", still }: { id: keyof typeof WIN; title?: string; children: React.ReactNode; className?: string; still?: boolean }) {
  const { w, h } = WIN[id];
  const pos = still ? (POS.desk3 as Record<string, { x: number; y: number }>)[id] : undefined;
  return (
    <section {...key(still, `w:${id}`)} className={`win win-${id} ${className}`} aria-hidden="true"
      style={{ width: w, height: h, ...(pos ? { transform: `translate(${pos.x}px, ${pos.y}px)`, opacity: 1 } : {}) }}>
      {title !== undefined && <header className="tbar"><Lights /><span className="ttl">{title}</span></header>}
      {children}
    </section>
  );
}

const TICKETS = ["Map PDF won’t open on iPad", "Can I download a trail for offline use?", "Wrong elevation on Ridge Loop", "Newsletter arrives twice a week"];
const TRAILS = [
  { name: "Lake Loop", note: "4.2 mi · easy · the first snow on the far shore", img: "thumb-1036" },
  { name: "Ridge Walk", note: "6.8 mi · moderate · views to the east", img: "thumb-29" },
  { name: "Pine Hollow", note: "3.1 mi · easy · shade all afternoon", img: "thumb-216" },
];

function Browser() {
  const { btnMid } = IN.browser;
  return (
    <Win id="browser">
      <header className="tabs">
        <Lights />
        <span className="tab" data-tab="fieldnotes">Field Notes</span>
        <span className="tab" data-tab="prs">Merged pull requests</span>
        <span className="tab" data-tab="support">Support</span>
      </header>
      <div data-k="br:tab" className="brow-body" data-state="fieldnotes">
        <div className="url"><span className="u-fieldnotes">localhost:3000/trails</span><span className="u-prs">code.fieldnotes.dev/pulls?merged</span><span className="u-support">help.fieldnotes.dev/inbox</span></div>
        <div className="pg pg-fieldnotes">
          <div className="fn-top"><b>Field Notes</b><span>Trails</span><span>Maps</span><span>Journal</span></div>
          <h4>Three trails for the first snow</h4>
          {TRAILS.map((t, i) => (
            <div key={t.name} className="card" style={{ left: 64 + i * 380 }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- a film prop */}
              <img src={`/landing/film/${t.img}.jpg`} alt="" />
              <b>{t.name}</b>
              <span>{t.note}</span>
            </div>
          ))}
          {[0, 1, 2].map((i) => (
            <span key={i} className="mapbtn" style={{ left: 64 + i * 380 + (340 - btnMid.w) / 2, top: btnMid.y, ...(i === 1 ? { transform: `translateY(${IN.browser.low}px)` } : {}) }}>Get the map</span>
          ))}
        </div>
        <div className="pg pg-prs">
          <h5>Merged this week</h5>
          {PRS.map((p) => <div key={p} className="lrow"><span className="ld m" />{p}<span className="who">merged</span></div>)}
        </div>
        <div className="pg pg-support">
          <h5>Open tickets</h5>
          {TICKETS.map((p) => <div key={p} className="lrow"><span className="ld" />{p}<span className="who">2 replies</span></div>)}
        </div>
      </div>
    </Win>
  );
}

export function Chart() {
  const { chart } = IN.chat;
  return (
    <div className="chart" style={{ left: chart.x, top: chart.y, width: chart.w, height: chart.h }}>
      <p><b>Signups</b><span>+18%</span></p>
      <svg viewBox="0 0 392 160" width="392" height="150" aria-hidden="true">
        <path d="M14 132 L70 118 L126 124 L182 96 L238 100 L294 70 L378 34" fill="none" stroke="#0A84FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 146 H378" stroke="rgba(0,0,0,.12)" />
      </svg>
      <p className="ticks"><span>Mon</span><span>Tue</span><span>Wednesday</span><span>Thu</span><span>Fri</span><span>Saturday</span><span>Sun</span></p>
    </div>
  );
}

/** The merged pull requests as the browser shows them, for Soon's close look. */
export const PrList = () => (
  <div className="prl">
    <h5>Merged this week</h5>
    {PRS.map((p) => <div key={p} className="lrow"><span className="ld m" />{p}<span className="who">merged</span></div>)}
  </div>
);

function Chat() {
  return (
    <Win id="chat" title="Maya Lin">
      <div className="thread">
        <p className="them">Can you send the weekly update before 4? Signups look good.</p>
        <Chart />
        <p className="them t2">Merged PRs and the support inbox are in the usual tabs.</p>
        <p className="mine">On it.</p>
      </div>
    </Win>
  );
}

// ———————————————————————————— Blender 5.2, the default Layout workspace, drawn (no logo)

/** Blender's icons, as small line drawings in its 16-unit grid. */
const ICON: Record<string, React.ReactNode> = {
  box: <path d="M3.5 3.5h9v9h-9z" strokeDasharray="2 1.6" />,
  arrow: <path d="M5 3.5v8.2l2.1-1.9 1.5 3.3 1.4-.6-1.4-3.2h2.9z" fill="currentColor" stroke="none" />,
  cursor: <><circle cx="8" cy="8" r="4.2" strokeDasharray="2.2 1.6" /><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3" /></>,
  move: <path d="M8 1.8v12.4M1.8 8h12.4M8 1.8 6.2 3.6M8 1.8l1.8 1.8M8 14.2l-1.8-1.8M8 14.2l1.8-1.8M1.8 8l1.8-1.8M1.8 8l1.8 1.8M14.2 8l-1.8-1.8M14.2 8l-1.8 1.8" />,
  rotate: <><path d="M12.6 6.2A5 5 0 1 0 13 9.6" /><path d="M13.4 3.4v3.2h-3.2" /></>,
  scale: <><path d="M2.5 6.5v7h7" /><path d="M6.5 9.5 13.5 2.5M9.5 2.5h4v4" /></>,
  transform: <><path d="M3 3h10v10H3z" /><path d="M8 5.2v5.6M5.2 8h5.6" /></>,
  annotate: <><path d="M3 13l.8-3.2 7.4-7.4 2.4 2.4-7.4 7.4z" /><path d="M10 3.6l2.4 2.4" /></>,
  measure: <><path d="M2.5 11.5 11.5 2.5l2 2-9 9z" /><path d="M5 9l1.2 1.2M7 7l1.2 1.2M9 5l1.2 1.2" /></>,
  cube: <><path d="M8 2.2 13.4 5v6L8 13.8 2.6 11V5z" /><path d="M2.6 5 8 7.8 13.4 5M8 7.8v6" /></>,
  zoom: <><circle cx="7" cy="7" r="4.2" /><path d="M10.2 10.2l3.6 3.6M5 7h4M7 5v4" /></>,
  hand: <path d="M5.2 8.2V3.6a1 1 0 0 1 2 0v3.8M7.2 7V2.8a1 1 0 0 1 2 0V7M9.2 7.2V3.6a1 1 0 0 1 2 0v5.2M11.2 6.2a1 1 0 0 1 2 0v3.6a4.4 4.4 0 0 1-4.4 4.4H8a4 4 0 0 1-3.2-1.6L2.6 9.8a1 1 0 0 1 1.5-1.3L5.2 9.6" />,
  camera: <><path d="M2 5h8.4v6.2H2z" /><path d="M10.4 7l3.6-2v6.2l-3.6-2" /></>,
  grid: <path d="M2.5 2.5h11v11h-11zM2.5 6.2h11M2.5 9.8h11M6.2 2.5v11M9.8 2.5v11" />,
  eye: <><path d="M1.6 8s2.4-4 6.4-4 6.4 4 6.4 4-2.4 4-6.4 4-6.4-4-6.4-4z" /><circle cx="8" cy="8" r="1.8" fill="currentColor" /></>,
  cam: <><path d="M2.4 5.2h8v5.6h-8z" /><path d="M10.4 7.2l3.2-1.8v5.2l-3.2-1.8" /></>,
  coll: <><path d="M2.5 4.5h11v8h-11z" /><path d="M2.5 4.5 4 2.5h8l1.5 2" /></>,
  light: <><circle cx="8" cy="6.5" r="3.6" /><path d="M6.4 11.5h3.2M6.8 13.5h2.4" /></>,
  mesh: <path d="M8 3 13.5 12.5h-11z" />,
  globe: <><circle cx="8" cy="8" r="5.4" /><path d="M2.6 8h10.8M8 2.6c2 2.4 2 8.4 0 10.8M8 2.6c-2 2.4-2 8.4 0 10.8" /></>,
  sphere: <><circle cx="8" cy="8" r="5.2" /><path d="M5.6 6.4a2.6 2.6 0 0 1 2.6-2" /></>,
  wrench: <path d="M10.8 2.6a3.2 3.2 0 0 0-3.4 4.2L2.8 11.4a1.2 1.2 0 0 0 1.7 1.7l4.6-4.6a3.2 3.2 0 0 0 4.2-3.4l-2 2-1.9-.4-.4-1.9z" />,
  tool: <><path d="M3 13l5-5" /><path d="M7.6 4.2a3 3 0 0 0 4.2 4.2l1.6 1.6-1.6 1.6-1.6-1.6" /></>,
  render: <><path d="M2.6 4.6h10.8v7.8H2.6z" /><circle cx="8" cy="8.5" r="2.2" /></>,
  output: <><path d="M4 2.8h8v4H4zM2.8 6.8h10.4v5H2.8z" /><path d="M4.8 11.8h6.4v2H4.8z" /></>,
  layers: <path d="M8 2.6 14 6 8 9.4 2 6zM2 9l6 3.4L14 9" />,
  scene: <><path d="M3 12.5 6 5l3 7.5z" /><circle cx="11" cy="9.5" r="2.6" /></>,
  particles: <><circle cx="4.5" cy="5" r="1.4" /><circle cx="11" cy="4.5" r="1.4" /><circle cx="8" cy="9" r="1.4" /><circle cx="4" cy="12" r="1.4" /><circle cx="12" cy="11.5" r="1.4" /></>,
  physics: <><circle cx="8" cy="8" r="2" /><ellipse cx="8" cy="8" rx="6" ry="2.6" transform="rotate(-30 8 8)" /></>,
  constraint: <path d="M5.5 10.5 3.6 12.4a2 2 0 0 1-2.8-2.8l2.6-2.6a2 2 0 0 1 2.8 0M10.5 5.5l1.9-1.9a2 2 0 0 1 2.8 2.8l-2.6 2.6a2 2 0 0 1-2.8 0M6 10l4-4" />,
  pin: <path d="M6.2 2.6h3.6l-.6 4.2 2 1.8H4.8l2-1.8zM8 8.6v4.8" />,
  search: <><circle cx="7" cy="7" r="3.8" /><path d="M10 10l3.4 3.4" /></>,
  filter: <path d="M2.5 3.5h11L9.2 8.5v4.5l-2.4-1.2V8.5z" />,
  editor: <><path d="M2.6 4.2h10.8v7.6H2.6z" /><path d="M2.6 6.6h10.8" /></>,
  mouseL: <><rect x="4.4" y="2.4" width="7.2" height="11.2" rx="3.6" /><path d="M4.6 6.6H8V2.6" fill="currentColor" /></>,
  mouseM: <><rect x="4.4" y="2.4" width="7.2" height="11.2" rx="3.6" /><path d="M8 3.8v2.6" strokeWidth="2" /></>,
  mouseR: <><rect x="4.4" y="2.4" width="7.2" height="11.2" rx="3.6" /><path d="M11.4 6.6H8V2.6" fill="currentColor" /></>,
  clock: <><circle cx="8" cy="8.6" r="4.6" /><path d="M8 6v2.8l1.8 1.2M6.6 2.2h2.8" /></>,
};
const Ic = ({ n, className = "" }: { n: keyof typeof ICON; className?: string }) => (
  <svg className={`bi ${className}`} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">{ICON[n]}</g>
  </svg>
);
const Caret = () => <svg className="bcar" viewBox="0 0 8 8" width="8" height="8" aria-hidden="true"><path d="M1.6 3l2.4 2.4L6.4 3" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>;
/** The four viewport-shading buttons: wireframe, solid, Material Preview, Rendered (Rendered on). */
const Shade = ({ kind }: { kind: "wire" | "solid" | "mat" | "rend" }) => (
  <i className={`bsh bsh-${kind}`} aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14">
    {kind === "wire" && <g fill="none" stroke="currentColor" strokeWidth="1.1"><circle cx="8" cy="8" r="6" /><ellipse cx="8" cy="8" rx="2.6" ry="6" /><path d="M2 8h12" /></g>}
    {kind === "solid" && <circle cx="8" cy="8" r="6" fill="currentColor" />}
    {kind === "mat" && <><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.1" /><path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" opacity=".55" /></>}
    {kind === "rend" && <><circle cx="8" cy="8" r="6" fill="currentColor" opacity=".35" /><circle cx="6.4" cy="6.2" r="2.6" fill="currentColor" /></>}
  </svg></i>
);

const TOOLS: (keyof typeof ICON | "|")[] = ["box", "cursor", "move", "rotate", "scale", "transform", "|", "annotate", "measure", "|", "cube"];
const TABS = ["Layout", "Modeling", "Sculpting", "UV Editing", "Texture Paint", "Shading", "Animation", "Rendering", "Compositing"];
/** The Properties editor's tabs, top down, in groups (the Material tab on); each tab's icon in its own colour. */
const PTABS: ([keyof typeof ICON, string] | "|")[] = [
  ["tool", "#B4B4B4"], "|", ["render", "#E6E6E6"], ["output", "#E6E6E6"], ["layers", "#E6E6E6"], ["scene", "#E6E6E6"], ["globe", "#E05A50"], "|",
  ["coll", "#E6E6E6"], "|", ["cube", "#F0A04A"], ["wrench", "#7AA4E2"], ["particles", "#E6E6E6"], ["physics", "#7AA4E2"], ["constraint", "#E6E6E6"], "|",
  ["mesh", "#6CC56C"], ["sphere", "#E87470"],
];
const OUTLINE_ROWS: { n: string; icon: keyof typeof ICON; data?: keyof typeof ICON; on?: boolean }[] = [
  { n: "Camera", icon: "camera", data: "cam" },
  { n: "Light", icon: "light", data: "light" },
  { n: "Plinth", icon: "mesh", data: "mesh" },
  { n: "Vase", icon: "mesh", data: "mesh", on: true },
];

/** Blender, as it opens in the Layout workspace: the top bar; the 3D viewport in Rendered shading, through the
 *  camera, with its header, tools, gizmo and buttons; the Outliner; the Properties editor on the Material tab; the
 *  Timeline; the status bar (Blender 5.2's default theme). The film sets three numbers on it, 0 to 1: --g the glaze,
 *  --l the loft's light, --c the 4:5 camera; the viewport and the fields both read them. */
function Blender({ still }: { still?: boolean }) {
  const id = useId().replace(/:/g, "");
  const g = (s: string) => `${s}${id}`;
  const done = still ? { "--g": 1, "--l": 1, "--c": 1 } as React.CSSProperties : undefined;
  return (
    <Win id="blender" title="vase_studio_nord.blend — Blender 5.2" className="dark" still={still}>
      <div {...key(still, "bl")} className="bl" style={done}>
        {/* the top bar: menus, the workspaces as pills, the scene */}
        <div className="bl-top">
          <span className="bl-menus"><span>File</span><span>Edit</span><span>Render</span><span>Window</span><span>Help</span></span>
          <span className="bl-tabs">{TABS.map((t, i) => <span key={t} className={i === 0 ? "on" : ""}>{t}</span>)}</span>
          <span className="bl-scene"><Ic n="scene" /><b>Scene</b><Caret /></span>
        </div>

        {/* the 3D viewport, Rendered, through the camera */}
        <div className="bv">
          <svg className="bv-r" viewBox="0 0 680 406" width="680" height="406" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={g("wall")} x1="0" x2="0" y1="0" y2="1"><stop offset="0" className="bw0" /><stop offset="1" className="bw1" /></linearGradient>
              <linearGradient id={g("floor")} x1="0" x2="0" y1="0" y2="1"><stop offset="0" className="bf0" /><stop offset="1" className="bf1" /></linearGradient>
              <radialGradient id={g("vig")} cx=".5" cy=".55" r=".75"><stop offset=".55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".42" /></radialGradient>
              <linearGradient id={g("pl")} x1="0" x2="1"><stop offset="0" className="bp0" /><stop offset=".45" className="bp1" /><stop offset="1" className="bp2" /></linearGradient>
              <linearGradient id={g("vase")} x1="0" x2="1">
                <stop offset="0" className="bv0" /><stop offset=".2" className="bv1" /><stop offset=".36" className="bv2" /><stop offset=".62" className="bv3" /><stop offset=".86" className="bv4" /><stop offset="1" className="bv5" />
              </linearGradient>
              <linearGradient id={g("pool")} x1="0" x2="0" y1="0" y2="1"><stop offset=".45" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#1A0A04" stopOpacity=".34" /></linearGradient>
              <clipPath id={g("vclip")}><path d={VASE} /></clipPath>
              <filter id={g("b2")} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" /></filter>
              <filter id={g("b6")} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
              <filter id={g("b16")} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16" /></filter>
            </defs>
            <g className="bv-shot">
              {/* the studio sweep: the wall bending into the floor */}
              <rect x="-200" y="-100" width="1080" height="380" fill={`url(#${g("wall")})`} />
              <path d="M-200 250 C 200 236 480 236 880 250 L 880 520 L -200 520 Z" fill={`url(#${g("floor")})`} />
              {/* the loft's window, its light thrown across the sweep */}
              <path className="bv-win" d="M118 34 L246 18 L330 258 L200 286 Z" filter={`url(#${g("b16")})`} />
              {/* the plinth */}
              <ellipse className="bv-cast" cx="340" cy="336" rx="96" ry="12" filter={`url(#${g("b6")})`} />
              <path d="M266 292 L266 334 Q340 352 414 334 L414 292 Z" fill={`url(#${g("pl")})`} />
              <ellipse className="bp-top" cx="340" cy="292" rx="74" ry="12" />
              {/* the vase's shadow, longer and softer in the loft's light */}
              <ellipse className="bv-shadow" cx="340" cy="291" rx="44" ry="6.5" filter={`url(#${g("b2")})`} />
              <g transform="translate(277.5 121) scale(1.25)">
                <path d={VASE} fill={`url(#${g("vase")})`} />
                <g clipPath={`url(#${g("vclip")})`}>
                  <rect x="0" y="0" width="100" height="140" fill={`url(#${g("pool")})`} className="bv-pool" />
                  {/* the unglazed foot, raw clay once the glaze is on */}
                  <rect x="0" y="125" width="100" height="10" className="bv-foot" />
                  <ellipse className="bv-rim" cx="86" cy="92" rx="6" ry="34" filter={`url(#${g("b2")})`} />
                  <ellipse className="bv-spec" cx="27" cy="88" rx="3.2" ry="24" filter={`url(#${g("b2")})`} />
                  <ellipse className="bv-sheen" cx="35" cy="50" rx="7" ry="6" filter={`url(#${g("b2")})`} />
                  <ellipse className="bv-lip" cx="50" cy="7.5" rx="9" ry="1.6" />
                </g>
                <path className="bv-sel" d={VASE} />
              </g>
              <rect x="-200" y="-100" width="1080" height="620" fill={`url(#${g("vig")})`} />
            </g>
          </svg>
          {/* the camera's frame, and the passepartout outside it */}
          <div className="bv-cam" />
          <span {...key(still, "bl:g2")} className="bv-camglow" />
          <div {...key(still, "bl:noise")} className="bl-noise" />
          {/* the header, over the view */}
          <div className="bv-h">
            <span className="bb"><Ic n="editor" /><Caret /></span>
            <span className="bb bdd"><Ic n="cube" className="or" />Object Mode<Caret /></span>
            <span className="bm">View</span><span className="bm">Select</span><span className="bm">Add</span><span className="bm">Object</span>
            <span className="bb bdd sm"><Ic n="globe" />Global<Caret /></span>
            <span className="bv-hr">
              <span className="bb"><Ic n="eye" /><Caret /></span>
              <span className="bb on"><Ic n="move" /></span><span className="bb on"><Ic n="sphere" /></span>
              <span className="bb"><Ic n="transform" /></span>
              <span className="bsh-g"><Shade kind="wire" /><Shade kind="solid" /><Shade kind="mat" /><Shade kind="rend" /></span>
              <Caret />
            </span>
          </div>
          <p className="bv-txt">Camera Perspective<br />(1) Collection | Vase</p>
          {/* the toolbar */}
          <div className="bv-tools">{TOOLS.map((t, i) => (t === "|" ? <i key={i} className="gap" /> : <span key={i} className={i === 0 ? "on" : ""}><Ic n={t} /></span>))}</div>
          {/* the navigation gizmo, and its four buttons */}
          <svg className="bv-giz" viewBox="0 0 80 80" width="80" height="80" aria-hidden="true">
            <circle cx="24" cy="58" r="8" fill="#5B3F45" /><circle cx="14" cy="30" r="8" fill="#6A3D45" /><circle cx="40" cy="72" r="8" fill="#3A4C68" />
            <path d="M40 40 L66 50 M40 40 L56 22 M40 40 L40 10" strokeWidth="2" strokeLinecap="round" fill="none" stroke="#999" />
            <path d="M40 40 L66 50" stroke="#FF3352" strokeWidth="2" /><path d="M40 40 L56 22" stroke="#8BDC00" strokeWidth="2" /><path d="M40 40 L40 10" stroke="#2890FF" strokeWidth="2" />
            <circle cx="56" cy="22" r="8" fill="#8BDC00" /><text x="56" y="25.4">Y</text>
            <circle cx="66" cy="50" r="8" fill="#FF3352" /><text x="66" y="53.4">X</text>
            <circle cx="40" cy="10" r="8" fill="#2890FF" /><text x="40" y="13.4">Z</text>
          </svg>
          <div className="bv-nav"><span><Ic n="zoom" /></span><span><Ic n="hand" /></span><span><Ic n="camera" /></span><span><Ic n="grid" /></span></div>
        </div>

        {/* the Outliner */}
        <div className="bo">
          <div className="bh"><span className="bb"><Ic n="layers" /><Caret /></span><span className="bb"><Ic n="eye" /><Caret /></span><span className="bsearch"><Ic n="search" /></span><span className="bb"><Ic n="filter" /><Caret /></span></div>
          <p className="br r0"><Ic n="coll" />Scene Collection</p>
          <p className="br r1"><i className="tw">▾</i><Ic n="coll" />Collection<span className="bvis"><i className="ck" /><Ic n="eye" /><Ic n="cam" /></span></p>
          {OUTLINE_ROWS.map((r, i) => (
            <p key={r.n} className={`br r2${r.on ? " on" : ""}${i % 2 ? " alt" : ""}`}>
              <i className="tw">▸</i><Ic n={r.icon} className="or" /><span className="bn">{r.n}</span>{r.data && <Ic n={r.data} className="gr" />}
              <span className="bvis"><Ic n="eye" /><Ic n="cam" /></span>
            </p>
          ))}
        </div>

        {/* the Properties editor, on the Material tab */}
        <div className="bp">
          <div className="bh"><span className="bb"><Ic n="editor" /><Caret /></span><span className="bsearch wide"><Ic n="search" /></span><span className="bb"><Ic n="pin" /></span></div>
          <div className="bp-tabs">{PTABS.map((t, i) => (t === "|" ? <i key={i} className="gap" /> : <span key={i} className={t[0] === "sphere" ? "on" : ""} style={{ color: t[1] }}><Ic n={t[0]} /></span>))}</div>
          <div className="bp-body">
            <p className="bp-path"><Ic n="mesh" className="or" />Vase<span>›</span><Ic n="sphere" className="pk" />Glaze</p>
            <div className="bp-list"><p className="on"><Ic n="sphere" className="pk" />Glaze</p></div>
            <p className="bp-db"><span className="bfld"><Ic n="sphere" className="pk" />Glaze</span></p>
            <p className="bp-ph">▸ Preview</p>
            <div className="bp-panel">
              <p className="bp-ph">▾ Surface</p>
              <p className="bp-r"><span>Surface</span><i className="bfld"><b className="bdot" />Principled BSDF</i></p>
              <p className="bp-r"><span>Base Color</span><i className="bsw" /></p>
              <p className="bp-r"><span>Metallic</span><i className="bsl"><em>0.000</em></i></p>
              <p className="bp-r"><span>Roughness</span><i className="bsl rough"><b /><em {...key(still, "bl:rough")} data-text="">{still ? "0.350" : "0.500"}</em></i></p>
              <p className="bp-r"><span>IOR</span><i className="bsl"><em>1.500</em></i></p>
              <p className="bp-r"><span>Alpha</span><i className="bsl full"><b /><em>1.000</em></i></p>
              <span {...key(still, "bl:g0")} className="bl-glow" />
            </div>
            <p className="bp-ph">▸ Subsurface</p>
            <p className="bp-ph">▸ Specular</p>
          </div>
        </div>

        {/* the Timeline */}
        <div className="bt">
          <div className="bh">
            <span className="bb"><Ic n="clock" /><Caret /></span><span className="bm">View</span><span className="bm">Marker</span>
            <span className="bt-play"><i className="rec" /><span>⏮</span><span>◀◆</span><span>◀</span><span>▶</span><span>◆▶</span><span>⏭</span></span>
            <span className="bt-fr"><b>1</b></span><span className="bt-se"><span>Start</span><b>1</b><span>End</span><b>250</b></span>
          </div>
          <div className="bt-ruler">{Array.from({ length: 13 }, (_, i) => <span key={i} style={{ left: 28 + i * 52 }}>{i * 20}</span>)}<i className="bt-head">1</i></div>
          <i className="bt-line" />
        </div>

        {/* the status bar */}
        <div className="bs"><span><Ic n="mouseL" />Select</span><span><Ic n="mouseM" />Rotate View</span><span><Ic n="mouseR" />Object</span><em>5.2</em></div>
      </div>
    </Win>
  );
}

/** The client's reference board (a board of photographs, PureRef's kind): three glazes. */
function Board({ still }: { still?: boolean }) {
  const vessels = [
    { cls: "terra", d: VASE },
    { cls: "celadon", d: "M14 70 C14 104 30 124 50 124 C70 124 86 104 86 70 Z" },
    { cls: "ash", d: "M44 8 H56 V40 C56 50 78 58 78 92 C78 118 66 132 50 132 C34 132 22 118 22 92 C22 58 44 50 44 40 Z" },
  ];
  return (
    <Win id="board" title="Studio Nord · references" className="dark" still={still}>
      <div className="rb">
        {vessels.map((v, i) => (
          <figure key={v.cls} className={`rb-ph ${v.cls}`} style={{ left: 18 + i * 160 }}>
            <svg viewBox="0 0 100 140" width="112" height="156" aria-hidden="true"><path d={v.d} /></svg>
          </figure>
        ))}
      </div>
    </Win>
  );
}

const FILES = [
  { name: "golden_hour_loft.hdr", cls: "loft" }, { name: "overcast_studio.hdr", cls: "overcast" }, { name: "river_walk.hdr", cls: "river" },
  { name: "vase_v2.png", cls: "v2" }, { name: "vase_v3.png", cls: "v3", k: "fd:v3" },
];
function Finder({ still }: { still?: boolean }) {
  return (
    <Win id="finder" title="Studio Nord" still={still}>
      <div className="fd">
        <div className="fd-side"><b>Favorites</b><span>Desktop</span><span>Documents</span><span>Downloads</span><span className="on">Studio Nord</span></div>
        {FILES.map((f, i) => {
          const r = IN.finder.item(i % 3, Math.floor(i / 3));
          return (
            <span key={f.name} className="fd-item" style={{ left: r.x, top: r.y, width: r.w, height: r.h }} {...(f.k ? key(still, f.k) : {})}>
              <i className={`fd-th ${f.cls}`}>{(f.cls === "v2" || f.cls === "v3") && <svg viewBox="0 0 100 140" width="30" height="44" aria-hidden="true"><path d={VASE} /></svg>}</i>
              <b>{f.name}</b>
            </span>
          );
        })}
      </div>
    </Win>
  );
}

/** Mail, open on Dana's message. When the agent drafts the reply, the reading pane makes room beside her message and
 *  the reply is written there, in the Mail that was already open: a draft, never sent for you. */
function Mail({ still }: { still?: boolean }) {
  return (
    <Win id="mail" title="Inbox" still={still}>
      <div className="ml">
        <div className="ml-list">
          <p className="on"><b>Dana Okafor</b><span>Vase, first look</span><em>2:14 PM</em></p>
          <p><b>Studio Nord</b><span>Shop page, final copy</span><em>11:02 AM</em></p>
          <p><b>Ines Park</b><span>Kiln schedule, next week</span><em>Yesterday</em></p>
        </div>
        <div {...key(still, "ml:read")} className="ml-read">
          <div className="ml-msg">
            <p className="ml-from"><b>Dana Okafor</b><span>Vase, first look</span></p>
            <p className="ml-body">Hi! For the shop page we’d like it <span className="ml-brief">4:5, eye level, soft shadows</span>, with the glaze from the board, the terracotta one.</p>
            <p className="ml-body">First look before 5?</p>
          </div>
          <div className="ml-reply">
            <p className="ml-rh"><b>{DRAFT.subject}</b><span className="ml-draft">Draft</span></p>
            <p className="ml-rf"><span>To:</span><i className="tok">{DRAFT.to}</i></p>
            <p className="ml-rf"><span>Subject:</span>{DRAFT.subject}</p>
            <div className="ml-rb">{DRAFT.body.map((p, i) => <p key={i} {...key(still, `ml:b${i}`)} data-text="">{p}</p>)}</div>
            <span {...key(still, "ml:att")} className="ml-att"><i><svg viewBox="0 0 100 140" width="22" height="31" aria-hidden="true"><path d={VASE} /></svg></i><b>{DRAFT.attach.name}</b><em>{DRAFT.attach.size}</em></span>
          </div>
        </div>
      </div>
    </Win>
  );
}

export default function Desk({ still }: { still?: boolean }) {
  return (
    <div {...(still ? { "data-still": "" } : { "data-k": "desk" })} className="desk">
      {/* eslint-disable-next-line @next/next/no-img-element -- the wallpaper */}
      <img className="wall" src="/landing/film/wall.jpg" alt="" />
      <div className="menubar" />
      {!still && <Browser />}
      {!still && <Chat />}
      <Blender still={still} />
      <Board still={still} />
      <Finder still={still} />
      <Mail still={still} />
    </div>
  );
}

/** What moves over the screen, above the island: the ⌘ selection, words selected and taken, a file dragged to the
 *  notch, captures in flight, the whole screen taken, the gaze ring, a click, the pointer. */
export function Marks() {
  return (
    <div className="marks">
      <span data-k="sel" className="capsel" />
      {/* words selected while Fovea listens (no key, Oct 17): the selection, then Fovea's highlight in the accent,
          kept until the request is sent */}
      <span data-k="mk:text" className="mk mk-text" data-state="sel" />
      {/* Soon: what Fovea chose by itself, named under Choose chat's two pills */}
      <span data-k="rt:session" className="rtag" style={{ left: 790, top: 142 }}>the session, chosen</span>
      <span data-k="rt:model" className="rtag" style={{ left: 934, top: 142 }}>the model, chosen</span>
      <span data-k="gazeMark" className="gazemark" />
      {[0, 1, 2].map((i) => <span key={i} data-k={`fl:${i}`} className="mini flight"><Mini /></span>)}
      {/* a file dragged from Finder onto the notch (Oct 17: a file is taken by a drag, never a click) */}
      <span data-k="fl:drag" className="mini flight drag" data-state="hdr"><Mini /></span>
      {/* ⌘ ⌘: the whole screen, a flash, then its picture lifting off and flying into the bar */}
      <span data-k="flash:screen" className="flash-screen" />
      <span data-k="scr:fly" className="scr-fly"><span className="scr-shot"><Desk still /></span></span>
      <span data-k="ring" className="ring"><span data-k="ringLabel" className="ring-label">what you’re looking at, as context</span></span>
      <span data-k="click" className="clickring" />
      <span data-k="cursor" className="cursor" data-state="arrow">
        <svg className="c-arrow" viewBox="0 0 14 21" width="15" height="22" aria-hidden="true"><path d="M1 1v15.4l3.9-3.5 2.6 6.1 2.6-1.1-2.6-6h5.1z" fill="#000" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg>
        <svg className="c-ibeam" viewBox="0 0 10 20" width="10" height="20" aria-hidden="true"><path d="M2 1.5h1.6c.8 0 1.4.6 1.4 1.4v14.2c0 .8.6 1.4 1.4 1.4H8M8 1.5H6.4c-.8 0-1.4.6-1.4 1.4M2 18.5h1.6c.8 0 1.4-.6 1.4-1.4M3.4 10h3.2" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /><path d="M2 1.5h1.6c.8 0 1.4.6 1.4 1.4v14.2c0 .8.6 1.4 1.4 1.4H8M8 1.5H6.4c-.8 0-1.4.6-1.4 1.4M2 18.5h1.6c.8 0 1.4-.6 1.4-1.4M3.4 10h3.2" fill="none" stroke="#000" strokeWidth="1.1" strokeLinecap="round" /></svg>
        <svg className="c-cross" viewBox="0 0 22 22" width="22" height="22" aria-hidden="true"><path d="M11 1v20M1 11h20" stroke="#000" strokeWidth="1.4" /><path d="M11 1v20M1 11h20" stroke="#fff" strokeWidth=".6" /></svg>
      </span>
    </div>
  );
}

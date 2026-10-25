import { MORE_LINE, NP, NQ, N_BAND, POINT_CHAT, POINT_LINE, PT, SC_KEYS, TALK, TALK_OUT, TK, TK_LINES, type ScKey, type SceneId } from "../../../lib/landing/film/showcase";
import type { Line } from "../../../lib/landing/film/speech";
import { AURORA } from "../../../lib/landing/film/aurora";
import type { Agent } from "../../../lib/landing/film/content";
import { Again, Back, Brain, Chevron, Close, Copy, DocPlus, Expand, Ext, OpenSq, Right, StepLine, Up } from "../film/Island";
import { Mark } from "../film/Minis";

// The showcase's three scenes, drawn (lib/landing/film/showcase.ts moves them): a Mac's whole screen in points, in dark
// mode (its wallpaper at dusk, the menu bar, the windows of the moment, drawn in HTML with no app icons or logos),
// Fovea's island as FoveaV1 draws it today in its dark see-through glass (showcase.css), what moves over the screen,
// and over all of it the keys and the words. Each scene is a World (under the frame's one transform) and an Over
// (sized to the frame).

const Lights = () => <span className="lights"><i /><i /><i /></span>;
const Wall = () => (
  // eslint-disable-next-line @next/next/no-img-element -- the film's wallpaper
  <img className="wall" src="/landing/film/wall.jpg" alt="" />
);

/** magnifyingglass, stop.fill, paperplane: the few glyphs the film's island doesn't draw. */
const Search = () => <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><circle cx="5.2" cy="5.2" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m7.9 7.9 2.6 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
const Stop = () => <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true"><rect x="1.5" y="1.5" width="7" height="7" rx="1.4" fill="currentColor" /></svg>;
const Plane = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M1.6 7.2 14.4 1.6 9.8 14.4 7.6 8.6Z M7.6 8.6 14.4 1.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>;

/** The aurora while the person talks to their agent (lib/landing/film/aurora.ts, FoveaV1 VoiceGlow.swift): the inner
 *  light hugging the edge, the bloom over it, the lit edge and its white core; seven lobes each, in the palette's
 *  colours, which the film moves and sizes. */
function Aurora() {
  const lobes = (k: string) => AURORA.colors.map((c, i) => <i key={i} data-k={`au:${k}${i}`} style={{ ["--c" as string]: c.join(" ") }} />);
  return (
    <div data-k="au" className="aur" aria-hidden="true">
      <div data-k="au:gi" className="aur-l aur-inner"><div>{lobes("i")}</div></div>
      <div data-k="au:gb" className="aur-l aur-bloom"><div>{lobes("b")}</div></div>
      <div data-k="au:gs" className="aur-l aur-stroke"><div className="aur-ring">{lobes("s")}<i data-k="au:core" className="core" /></div></div>
    </div>
  );
}

/** The island, back to front as the film draws it: the glass and its ears, the rim, the contents clipped to the
 *  outline (the aurora over them, where the scene has one), the black notch on top. */
function Isl({ children, aurora }: { children: React.ReactNode; aurora?: boolean }) {
  return (
    <div className="isl">
      <div data-k="is:glass" className="is-glass" />
      <svg data-k="is:ears" className="is-ears" aria-hidden="true"><path /></svg>
      <svg data-k="is:rim" className="is-rim" aria-hidden="true"><path /></svg>
      <div data-k="is:clip" className="is-clip">{children}{aurora && <Aurora />}</div>
      <div className="is-notch" />
    </div>
  );
}

const Wave = ({ k = "vb:wave" }: { k?: string }) => <span data-k={k} className="wave">{Array.from({ length: 9 }, (_, i) => <i key={i} data-k={`vb:b${i}`} />)}</span>;
const Ellipsis = () => <span data-k="tr:dots" className="ell"><i /><i /><i /></span>;
const Trans = () => <div data-k="is:trans" className="slot s-trans"><p>Transcribing<Ellipsis /></p></div>;

/** The pointer, in its three shapes, and a click made visible. */
function Pointer() {
  return (
    <>
      <span data-k="click" className="clickring" />
      <span data-k="cursor" className="cursor" data-state="arrow">
        <svg className="c-arrow" viewBox="0 0 14 21" width="15" height="22" aria-hidden="true"><path d="M1 1v15.4l3.9-3.5 2.6 6.1 2.6-1.1-2.6-6h5.1z" fill="#000" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg>
        <svg className="c-ibeam" viewBox="0 0 10 20" width="10" height="20" aria-hidden="true"><path d="M2 1.5h1.6c.8 0 1.4.6 1.4 1.4v14.2c0 .8.6 1.4 1.4 1.4H8M8 1.5H6.4c-.8 0-1.4.6-1.4 1.4M2 18.5h1.6c.8 0 1.4-.6 1.4-1.4M3.4 10h3.2" fill="none" stroke="#000" strokeWidth="2.6" strokeLinecap="round" /><path d="M2 1.5h1.6c.8 0 1.4.6 1.4 1.4v14.2c0 .8.6 1.4 1.4 1.4H8M8 1.5H6.4c-.8 0-1.4.6-1.4 1.4M2 18.5h1.6c.8 0 1.4-.6 1.4-1.4M3.4 10h3.2" fill="none" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" /></svg>
        <svg className="c-cross" viewBox="0 0 22 22" width="22" height="22" aria-hidden="true"><path d="M11 1v20M1 11h20" stroke="#000" strokeWidth="1.4" /><path d="M11 1v20M1 11h20" stroke="#fff" strokeWidth=".6" /></svg>
      </span>
    </>
  );
}

/** The keys pressed, each with what it does. */
const Keys = ({ keys }: { keys: ScKey[] }) => (
  <div className="keys">
    {[...new Set(keys)].map((id) => (
      <span key={id} data-k={`key:${id}`} className="kc" data-state="up">
        {SC_KEYS[id].caps.map((cap, i) => <kbd key={i} className={cap.length > 1 ? "wide" : ""}>{cap}</kbd>)}
        <em>{SC_KEYS[id].label}</em>
      </span>
    ))}
  </div>
);

/** Over the screen: the keys pressed, a tag, the words said. */
function Over({ keys, line, tag }: { keys: ScKey[]; line: Line; tag?: string }) {
  return (
    <div className="over" aria-hidden="true">
      <Keys keys={keys} />
      {tag && <span data-k="tag:fast" className="tag tag1">{tag}</span>}
      <div className="subs">
        <p data-k={`sub:${line.id}`} className="sub">
          {line.words.map((w, i) => (
            <span key={i}><span data-k={`sw:${line.id}:${i}`} className={`w${w.mark ? ` ${w.mark}` : ""}`}>{w.text}</span>{i < line.words.length - 1 ? " " : ""}</span>
          ))}
        </p>
      </div>
    </div>
  );
}

/** The board's bar on the real Mac (OpenChat.swift): the greeting, and the search beside it. */
const Hello = () => <div className="sc-hello"><b>Hello, Ryan.</b><span className="sc-search"><Search /></span></div>;

/** A session's header (V2ChatContent): back to the board, its agent, the chat, the project; expand and close. */
function Head({ agent, title, badge }: { agent: Agent; title: string; badge: string }) {
  return (
    <div className="head">
      <span className="circ sm"><Back /></span>
      <Mark agent={agent} size={22} />
      <b>{title}</b>
      <span className="badge-t">{badge}</span>
      <span className="circ"><Expand /></span>
      <span className="circ"><Close /></span>
    </div>
  );
}

/** The agent at work under a request: its ring, the step, how long it has run. */
const Working = ({ verb, obj, time, k, style }: { verb: string; obj: string; time: string; k?: string; style?: React.CSSProperties }) => (
  <p data-k={k} className="sc-work" style={style}><i className="sc-ring" />{verb} <b>{obj}</b><em>{time}</em></p>
);

/** A row of the board (Badges): the agent's icon with its state, the title over one line, the time. */
function Row({ agent, title, line, time, state, step }: { agent: Agent; title: string; line?: string; time: string; state: "done" | "working"; step?: { verb: string; obj: string; mono?: boolean } }) {
  return (
    <div className="brow" data-state={state}>
      <span className="ic"><Mark agent={agent} size={26} /><span className="badge" /></span>
      <span className="tx">
        <b>{title}</b>
        {step ? <span className="steps one"><StepLine s={{ glyph: "run", ...step }} /></span> : <span className="line">{line}</span>}
      </span>
      <span className="tm">{time}</span>
    </div>
  );
}

// ———————————————————————————— 1 · point

const TRAILS = [
  { name: "Lake Loop", note: "4.2 mi · easy · the first snow on the far shore", img: "thumb-1036" },
  { name: "Ridge Walk", note: "6.8 mi · moderate · views to the east", img: "thumb-29" },
  { name: "Pine Hollow", note: "3.1 mi · easy · shade all afternoon", img: "thumb-216" },
];

/** A button as ⌘ took it: the region round it, the card's paper and the button (the same picture for either). */
const ShotButton = () => (
  <svg className="shot" viewBox="0 0 166 52" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="166" height="52" fill="#F1EEE6" />
    <rect x="8" y="8" width="150" height="36" rx="18" fill="#1E3A2B" />
    <text x="83" y="30.6" fontSize="13.5" fontWeight="600" textAnchor="middle" fill="#fff">Get the map</text>
  </svg>
);
/** The spec, as the desktop shows a PDF: a page, its corner turned, a red band. */
const ShotSpec = () => (
  <svg className="shot" viewBox="0 0 52 65" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect width="52" height="65" fill="#fff" />
    <path d="M9 3h24l11 11v48H9z" fill="#fff" stroke="rgba(0,0,0,.28)" strokeWidth="1" />
    <path d="M33 3v11h11" fill="#F1F1F1" stroke="rgba(0,0,0,.28)" strokeWidth="1" />
    <rect x="9" y="38" width="35" height="12" fill="#E5433A" />
    <text x="26.5" y="47.2" fontSize="8.5" fontWeight="700" textAnchor="middle" fill="#fff">PDF</text>
    <path d="M15 20h20M15 25h22M15 30h16" stroke="rgba(0,0,0,.18)" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
/** What point takes, by kind (the bar's stack, Choose chat's pile, the flights). */
const PointMini = () => (
  <>
    <span data-m="low"><ShotButton /></span>
    <span data-m="ok"><ShotButton /></span>
    <span data-m="spec"><ShotSpec /></span>
  </>
);

function PointWorld() {
  const { win, btn } = PT;
  const fixedTop = PT.card(1).y + btn.y;
  return (
    <>
      <div className="desk">
        <Wall />
        <div className="menubar" />
        <span className="dicon" style={{ left: PT.file.x, top: PT.file.y }}><i className="pdf"><ShotSpec /></i><em>card-spec.pdf</em></span>
        <span className="dicon" style={{ left: PT.file.x, top: PT.file.y + 116 }}><i className="folder" /><em>Screenshots</em></span>
        <section className="win sc-win sc-br" style={{ left: win.x, top: win.y, width: win.w, height: win.h }}>
          <header className="sc-tabs"><Lights /><span className="on">Field Notes</span><span>Pull requests</span></header>
          <div className="sc-url"><span>localhost:3000/trails</span></div>
          <div className="sc-page">
            <p className="sc-fn"><b>Field Notes</b><span>Trails</span><span>Maps</span><span>Journal</span></p>
            <h4>Three trails for the first snow</h4>
          </div>
          {TRAILS.map((t, i) => {
            const c = PT.card(i);
            return (
              <div key={t.name} className="sc-card" style={{ left: c.x, top: c.y, width: c.w, height: c.h }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- a film prop */}
                <img src={`/landing/film/${t.img}.jpg`} alt="" />
                <b>{t.name}</b>
                <span>{t.note}</span>
              </div>
            );
          })}
          {TRAILS.map((t, i) => {
            const c = PT.card(i);
            return (
              <span key={t.name} {...(i === 1 ? { "data-k": "pt:low" } : {})} className="sc-btn"
                style={{ left: c.x + btn.x, top: c.y + btn.y, width: btn.w, height: btn.h, ...(i === 1 ? { transform: `translateY(${PT.low}px)` } : {}) }}>Get the map</span>
            );
          })}
          <span data-k="pt:glow" className="sc-glow" style={{ left: PT.card(1).x + btn.x, top: fixedTop, width: btn.w, height: btn.h }} />
        </section>
      </div>
      <Isl aurora>
        <div data-k="is:voice" className="slot s-voice">
          <span className="stack">
            {[2, 1, 0].map((i) => <span key={i} data-k={`vb:t${i}`} className={`mini th th${i}`}><PointMini /></span>)}
          </span>
          <Wave />
          <span data-k="vb:drop" className="drop"><DocPlus />Drop to take it</span>
        </div>
        <Trans />
        <div data-k="is:choose" className="slot s-choose">
          <div className="cwrap">
            <p className="creq">{POINT_LINE.plain}</p>
            <div className="row">
              <span className="pile">
                {["low", "ok", "spec"].map((k, i) => <span key={k} className="mini" data-state={k} style={{ ["--i" as string]: i, zIndex: 3 - i }}><PointMini /></span>).reverse()}
              </span>
              <span className="pills">
                <span className="pill chat">
                  <span data-k="ch:glow" className="glow" />
                  <span className="settled"><Mark agent={POINT_CHAT.agent} /><span className="name">{POINT_CHAT.name}</span><Chevron /></span>
                </span>
                <span className="pill model"><Brain />Auto<Chevron /></span>
                <span className="send"><Up /></span>
              </span>
            </div>
            <div className="sug">
              <span className="lab">Suggested</span>
              {POINT_CHAT.chips.map((ch, i) => <span key={ch.name} className={`chip${i === 0 ? " on" : ""}`}><Mark agent={ch.agent} size={14} />{ch.name}</span>)}
            </div>
          </div>
        </div>
        <div data-k="is:board" className="slot s-board">
          <Hello />
          <div className="bsec">
            <Row agent="claude-code" title="Studio Nord vase" line="Glazed, lit and framed." time="2m" state="done" />
          </div>
          <div className="bsec sep">
            <div className="brow focus" data-k="pt:row" data-state="working">
              <span className="ic"><Mark agent="codex" size={26} /><span className="badge" /></span>
              <span className="tx">
                <b>{POINT_CHAT.name}</b>
                <span className="steps" data-k="pt:steps" data-state="0">
                  <span data-i="0"><StepLine s={{ glyph: "read", verb: "Reading", obj: "3 attachments" }} /></span>
                  <span data-i="1"><StepLine s={{ glyph: "edit", verb: "Editing", obj: "TrailCard.tsx", mono: true }} /></span>
                </span>
                <span className="line sc-done">Lined up with the others.</span>
              </span>
              <span className="tm">now</span>
            </div>
          </div>
        </div>
      </Isl>
      <div className="marks">
        <span data-k="sel" className="capsel" />
        {[0, 1].map((i) => <span key={i} data-k={`fl:${i}`} className="mini flight"><PointMini /></span>)}
        <span data-k="fl:drag" className="mini flight drag" data-state="spec"><PointMini /></span>
        <Pointer />
      </div>
    </>
  );
}

// ———————————————————————————— 2 · notch

const CODE: [string, string][][] = [
  [["import", "k"], [" { MapButton } ", ""], ["from", "k"], [" \"./MapButton\"", "s"], [";", ""]],
  [],
  [["type", "k"], [" Props = { trail: ", ""], ["Trail", "y"], [" };", ""]],
  [],
  [["export function", "k"], [" TrailCard", "f"], ["({ trail }: ", ""], ["Props", "y"], [") {", ""]],
  [["  return", "k"], [" (", ""]],
  [["    <", ""], ["article", "g"], [" className", "a"], ["=", ""], ["\"card\"", "s"], [">", ""]],
  [["      <", ""], ["img", "g"], [" src", "a"], ["={trail.photo} ", ""], ["alt", "a"], ["=", ""], ["\"\"", "s"], [" />", ""]],
  [["      <", ""], ["h3", "g"], [">{trail.name}</", ""], ["h3", "g"], [">", ""]],
  [["      <", ""], ["p", "g"], [">{trail.note}</", ""], ["p", "g"], [">", ""]],
  [["      <", ""], ["MapButton", "y"], [" href", "a"], ["={trail.map} />", ""]],
  [["    </", ""], ["article", "g"], [">", ""]],
  [["  );", ""]],
  [["}", ""]],
];

/** What Codex wrote, as the session shows it, and again with the banner (the chat pulled out). */
const NOTE = "Trail pages load twice as fast, and every map opens in a new tab.";
const NOTE2 = "Trail pages load twice as fast, show snow banners, and open maps in a new tab.";

/** The session's bar (V2SessionBar): Open in its agent at the left; at the right, Copy Answer and Answer again once
 *  it's done, Stop while it works. Narrow (pulled out), the chips keep their glyphs only. */
function Bar({ k, top, narrow, style }: { k: string; top: number; narrow?: boolean; style?: React.CSSProperties }) {
  return (
    <div data-k={k} className={`sc-sbar${narrow ? " narrow" : ""}`} data-state="done" style={{ top, ...style }}>
      <span className="sc-chip"><Ext />{!narrow && "Open in Codex"}</span>
      <span className="sp" />
      <span className="sc-chip when-done"><Copy />{!narrow && "Copy Answer"}</span>
      <span className="sc-chip when-done"><Again />{!narrow && "Answer again"}</span>
      <span className="sc-chip when-work"><Stop />Stop</span>
    </div>
  );
}

/** The chat pulled out of the notch (V2DetachedWindow): its header, both exchanges (each request in its bubble at the
 *  right, a short line for each at the far right, the first in view lit), the bar, the box. Window-local points. */
function Pulled() {
  const L = 12, R = 34;
  return (
    <div data-k="pw" className="sc-pull">
      <div data-k="pw:glass" className="sc-pull-glass" />
      <div data-k="pw:body" className="sc-pull-body">
        <div className="pw-head"><Mark agent="codex" size={18} /><b>Release note</b><span className="circ"><Close /></span></div>
        <p className="sc-bub" style={{ top: 44, right: R }}>Shorten the release note.</p>
        <span className="sc-rail" style={{ top: 50 }}><i className="on" /><i /></span>
        <p className="worked" style={{ top: 87, left: L }}>Worked for 48s · Edited 1 file<Right /></p>
        <p className="ans" style={{ top: 119, left: L, right: R }}>Done. 14 words now:</p>
        <div className="quote" style={{ top: 146, left: L, right: R }}><p>{NOTE}</p></div>
        <p className="sc-bub" style={{ top: 230, right: R }}>{MORE_LINE.plain}</p>
        <Working k="pw:line" verb="Editing" obj="CHANGELOG.md" time="0:04" style={{ top: 273, left: L, right: R }} />
        <div data-k="pw:a2" className="pw-a2">
          <p className="ans" style={{ top: 273, left: L, right: R }}>Done, with the banner:</p>
          <div className="quote" style={{ top: 300, left: L, right: R }}><p>{NOTE2}</p></div>
        </div>
        <Bar k="pw:bar" top={382} narrow style={{ left: L, right: L }} />
        <div className="follow" style={{ top: 422, left: L, right: L }}>Ask a follow-up<span className="send2"><Up size={11} /></span></div>
      </div>
    </div>
  );
}

function NotchWorld() {
  return (
    <>
      <div className="desk">
        <Wall />
        <div className="menubar" />
        <section className="win sc-win sc-ed" style={{ left: 56, top: 120, width: 660, height: 560 }}>
          <header className="tbar"><Lights /><span className="ttl">TrailCard.tsx — field-notes</span></header>
          <div className="sc-tree">
            <b>FIELD-NOTES</b>
            <span>▾ src</span><span className="in">▾ components</span>
            <span className="in2 on">TrailCard.tsx</span><span className="in2">TrailList.tsx</span><span className="in2">MapButton.tsx</span>
            <span className="in">▸ pages</span><span>CHANGELOG.md</span><span>package.json</span>
          </div>
          <div className="sc-code">
            {CODE.map((ln, i) => (
              <p key={i}><i>{i + 1}</i>{ln.map(([text, cls], j) => <span key={j} className={cls || undefined}>{text}</span>)}</p>
            ))}
          </div>
        </section>
        <Pulled />
      </div>
      <Isl aurora>
        <div data-k="is:board" className="slot s-board">
          <Hello />
          <div className="bsec">
            <div className="brow sc-ask" data-k="nd:a" data-state="needs">
              <span className="ic"><Mark agent="claude-code" size={26} /><span className="badge" /></span>
              <span className="tx">
                <b>Checkout page</b>
                <span className="line sc-q">Run <code>npm test</code>?</span>
                <span className="steps one sc-run"><StepLine s={{ glyph: "run", verb: "Running", obj: "npm test", mono: true }} /></span>
              </span>
              <span className="sc-acts"><span className="sc-abtn">Deny</span><span data-k="nd:run" className="sc-abtn pri">Run Tests</span></span>
              <span className="tm sc-now">now</span>
            </div>
          </div>
          <div className="bsec sep">
            <div className="brow" data-state="done">
              <span data-k="nd:bh" className="sc-hov" />
              <span className="ic"><Mark agent="codex" size={26} /><span className="badge" /></span>
              <span className="tx"><b>Release note</b><span className="line">14 words, ready to review.</span></span>
              <span className="tm">1m</span>
            </div>
          </div>
          <div className="bsec sep">
            <Row agent="claude-code" title="Product photos" time="6m" state="working" step={{ verb: "Renaming", obj: "24 files" }} />
          </div>
        </div>
        <div data-k="is:answer" className="slot s-answer" style={{ height: NQ.h + N_BAND }}>
          <div data-k="an:body" className="sc-anbody">
            <Head agent="codex" title="Release note" badge="field-notes" />
            <p data-k="an:b1" className="sc-bub" style={{ top: NP.bubble, right: 35 }}>Shorten the release note.</p>
            <p className="worked" style={{ top: NP.worked }}>Worked for 48s · Edited 1 file<Right /></p>
            <p className="ans" style={{ top: NP.lead }}>Done. 14 words now:</p>
            <div data-k="an:quote" className="quote" style={{ top: NP.quote, right: "auto", width: 590 }}><p>{NOTE}</p></div>
            <span data-k="an:open" className="openbtn" style={{ top: NP.open }}><OpenSq />Open CHANGELOG.md</span>
            <div data-k="an:q2" className="sc-q2">
              <span className="sc-rail sc-outline" style={{ top: NP.bubble + 6 }}><i className="on" /><i /></span>
              <p className="sc-bub" style={{ top: NQ.bubble, right: 35 + NQ.gutter }}>{MORE_LINE.plain}</p>
              <Working verb="Editing" obj="CHANGELOG.md" time="0:02" style={{ top: NQ.line, left: 35, right: 35 + NQ.gutter }} />
            </div>
            <Bar k="an:bar" top={NP.bar} />
            <div data-k="an:follow" className="follow" style={{ top: NP.follow }}>Ask a follow-up<span className="send2"><Up size={11} /></span></div>
            <span data-k="an:grab" className="grab" style={{ top: NP.grab }} />
          </div>
        </div>
        {/* asking more by voice: the voice bar's band between the notch and the session (Voiceflow's waveform) */}
        <div data-k="is:band" className="slot s-band">
          <Wave k="bd:wave" />
          <p data-k="bd:trans" className="bd-trans">Transcribing<Ellipsis /></p>
        </div>
        {/* let go out of the notch, the board a moment: every session at work, the pulled-out one too */}
        <div data-k="is:board2" className="slot s-board">
          <Hello />
          <div className="bsec">
            <Row agent="claude-code" title="Checkout page" time="now" state="working" step={{ verb: "Running", obj: "npm test", mono: true }} />
            <Row agent="codex" title="Release note" time="now" state="working" step={{ verb: "Editing", obj: "CHANGELOG.md", mono: true }} />
            <Row agent="claude-code" title="Product photos" time="6m" state="working" step={{ verb: "Renaming", obj: "24 files" }} />
          </div>
        </div>
      </Isl>
      <div className="marks"><Pointer /></div>
    </>
  );
}

// ———————————————————————————— 3 · talk

/** The site's banner on the phone, as ⌘ took it: the banner edge to edge, a little of the page above and under it. */
const ShotBanner = () => (
  <svg className="shot" viewBox="0 0 226 48" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="226" height="48" fill="#F7F5EF" />
    <rect y="6" width="226" height="36" fill="#1E3A2B" />
    <text x="12" y="28.4" fontSize="12.5" fontWeight="600" fill="#fff">First snow: every trail map is now free to dow</text>
  </svg>
);
const TalkMini = () => <span data-m="banner"><ShotBanner /></span>;

function TalkWorld() {
  const { win, phone } = TK;
  const L = TK_LINES;
  return (
    <>
      <div className="desk">
        <Wall />
        <div className="menubar" />
        <section className="win sc-win sc-mail" style={{ left: win.x, top: win.y, width: win.w, height: win.h }}>
          <header className="tbar"><Lights /><span className="send"><Plane /></span><span className="ttl">Friday’s launch</span></header>
          <div className="sc-mrow" style={{ top: 52 }}><span className="k">To:</span><span className="tok">Launch team</span></div>
          <div className="sc-mrow" style={{ top: 88 }}><span className="k">Subject:</span>Friday’s launch</div>
          <span data-k="tk:land" className="sc-land" style={{ left: 14, top: 130, width: win.w - 28, height: win.h - 144 }} />
          <i data-k="tk:caret0" className="caret" style={{ left: TK.body.x, top: L.lead + 3 }} />
          <div data-k="tk:text" className="sc-body">
            <p style={{ top: L.lead }}>{TALK_OUT.lead}</p>
            {TALK_OUT.list.map((it, i) => <p key={it} className="li" style={{ top: L.list[i] }}><span>{i + 1}.</span>{it}</p>)}
            <p style={{ top: L.also }}>{TALK_OUT.also}</p>
          </div>
          <span data-k="tk:shot" className="sc-shot" style={{ left: TK.body.x, top: L.shot, width: TK.shot.w, height: TK.shot.h }}><ShotBanner /></span>
          <i data-k="tk:caret1" className="caret" style={{ left: TK.body.x + TK.shot.w + 3, top: L.shot + TK.shot.h - 19 }} />
        </section>
        <div className="sc-phone" style={{ left: phone.x, top: phone.y, width: phone.w, height: phone.h }}>
          <div className="scr">
            <div className="sb"><span>9:41</span><span className="bat" /></div>
            <span className="di" />
            <div className="bn">First snow: every trail map is now free to download</div>
            <div className="nav"><b>Field Notes</b><i /></div>
            {/* eslint-disable-next-line @next/next/no-img-element -- a film prop */}
            <img src="/landing/film/trail.jpg" alt="" />
            <h5>Three trails for the first snow</h5>
            <p className="p">The first storm moved through overnight. Here’s where to walk this weekend.</p>
          </div>
        </div>
      </div>
      <Isl>
        <div data-k="is:voice" className="slot s-voice">
          <span className="stack"><span data-k="vb:t0" className="mini th th0"><TalkMini /></span></span>
          <Wave />
        </div>
        <Trans />
      </Isl>
      <div className="marks">
        <span data-k="sel" className="capsel" />
        <span data-k="fl:0" className="mini flight"><TalkMini /></span>
        <Pointer />
      </div>
    </>
  );
}

/** Over the screen in the talk scene: the keys, and everything said so far in one box under them, what's taken back
 *  struck through, the item remembered last marked. */
function TalkOver() {
  return (
    <div className="over" aria-hidden="true">
      <Keys keys={["vf", "cmd", "vfDone"]} />
      <div className="subs">
        <p data-k="tr:box" className="sub tr-box">
          {TALK.map((line) => line.words.map((w, i) => (
            <span key={`${line.id}${i}`} data-k={`sw:${line.id}:${i}`} className={`w${w.mark ? ` ${w.mark}` : ""}`} data-state="later"><span className="t">{w.text}</span> </span>
          )))}
        </p>
      </div>
    </div>
  );
}

export const VIEWS: Record<SceneId, { World: () => React.ReactElement; Over: () => React.ReactElement }> = {
  point: { World: PointWorld, Over: () => <Over keys={["fn", "cmd", "fnDone", "toCodex"]} line={POINT_LINE} tag="Your Codex at work, sped up" /> },
  notch: { World: NotchWorld, Over: () => <Over keys={["more", "moreDone"]} line={MORE_LINE} /> },
  talk: { World: TalkWorld, Over: TalkOver },
};

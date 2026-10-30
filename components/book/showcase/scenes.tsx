import { MORE_LINE, NA, NP, NQ, POINT_CHAT, POINT_LINE, PT, SC_KEYS, TALK, TALK_OUT, TK, TK_LINES, type ScKey, type SceneId } from "../../../lib/landing/film/showcase";
import type { Line } from "../../../lib/landing/film/speech";
import type { Agent } from "../../../lib/landing/film/content";
import { Again, Close, Copy, Expand, Ext, OpenSq, Right, StepLine, Up } from "../film/Island";
import { Mark } from "../film/Minis";
import { DropZone, NotchShell, Search, Sentence, Wings } from "../film/Notch";

// The showcase's three scenes, drawn (lib/landing/film/showcase.ts moves them): a Mac's whole screen in points, in dark
// mode (its wallpaper at dusk, the menu bar, the windows of the moment, drawn in HTML with no app icons or logos),
// Fovea's notch as FoveaV1 draws it since Oct 28 (components/book/film/Notch.tsx: the notch black at rest, Wings while
// it listens, Choose chat's sentence, the board and the sessions in dark glass with the Halo), what moves over the
// screen, and over all of it the keys and the words. Each scene is a World (under the frame's one transform) and an
// Over (sized to the frame).

const Lights = () => <span className="lights"><i /><i /><i /></span>;
const Wall = () => (
  // eslint-disable-next-line @next/next/no-img-element -- the film's wallpaper
  <img className="wall" src="/landing/film/wall.jpg" alt="" />
);

/** stop.fill, paperplane: the few glyphs the film's island doesn't draw. */
const Stop = () => <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true"><rect x="1.5" y="1.5" width="7" height="7" rx="1.4" fill="currentColor" /></svg>;
const Plane = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M1.6 7.2 14.4 1.6 9.8 14.4 7.6 8.6Z M7.6 8.6 14.4 1.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>;
const Check = () => <svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true"><path d="M2.6 6.4 5 8.6l4.4-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

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

/** A session's header (V2ChatContent, Compact): its agent, the chat, the project; expand and close. */
function Head({ agent, title, badge }: { agent: Agent; title: string; badge: string }) {
  return (
    <div className="head">
      <Mark agent={agent} size={14} />
      <b>{title}</b>
      <span className="badge-t">{badge}</span>
      <span className="hg"><Expand /></span>
      <span className="hg"><Close /></span>
    </div>
  );
}

/** The agent at work under a request: its ring, the step, how long it has run. */
const Working = ({ verb, obj, time, k, style }: { verb: string; obj: string; time: string; k?: string; style?: React.CSSProperties }) => (
  <p data-k={k} className="sc-work" style={style}><i className="sc-ring" />{verb} <b>{obj}</b><em>{time}</em></p>
);

/** A row of the board: the agent's icon with its state, the title over one line, the time. */
function Row({ agent, title, line, time, state, step }: { agent: Agent; title: string; line?: string; time: string; state: "done" | "working"; step?: { verb: string; obj: string; mono?: boolean } }) {
  return (
    <div className="brow" data-state={state}>
      <span className="ic"><Mark agent={agent} size={20} /><span className="badge" /></span>
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
/** What point takes, by kind (the bar's pile, Choose chat's, the flights). */
const PointMini = () => (
  <>
    <span data-m="low"><ShotButton /></span>
    <span data-m="ok"><ShotButton /></span>
    <span data-m="spec"><ShotSpec /></span>
  </>
);
/** The bar's pile: what's taken, the first in front, the next two behind it (keys wb:c0…). */
const PilePoint = () => (
  <>
    {[2, 1, 0].map((i) => <span key={i} data-k={`wb:c${i}`} className={`mini l${i}`}><PointMini /></span>)}
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
      <DropZone />
      <NotchShell bars={<Wings pile={<PilePoint />} />}>
        <Sentence k="is:sent" request={POINT_LINE.plain} chat={POINT_CHAT}
          pile={<>{["low", "ok", "spec"].map((k, i) => <span key={k} className="mini" data-state={k} style={{ ["--i" as string]: i, zIndex: 3 - i }}><PointMini /></span>).reverse()}</>} />
        <div data-k="is:board" className="slot s-board">
          <Hello />
          <div className="bsec">
            <Row agent="claude-code" title="Studio Nord vase" line="Glazed, lit and framed." time="2m" state="done" />
          </div>
          <div className="bsec sep">
            <div className="brow focus" data-k="pt:row" data-state="working">
              <span className="ic"><Mark agent="codex" size={20} /><span className="badge" /></span>
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
      </NotchShell>
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
function Bar({ k, top, agent, narrow, style }: { k: string; top: number; agent: string; narrow?: boolean; style?: React.CSSProperties }) {
  return (
    <div data-k={k} className={`sc-sbar${narrow ? " narrow" : ""}`} data-state="done" style={{ top, ...style }}>
      <span className="sc-chip"><Ext />{!narrow && `Open in ${agent}`}</span>
      <span className="sp" />
      <span className="sc-chip when-done"><Copy />{!narrow && "Copy Answer"}</span>
      <span className="sc-chip when-done"><Again />{!narrow && "Answer again"}</span>
      <span className="sc-chip when-work"><Stop />Stop</span>
    </div>
  );
}
const Follow = ({ k, top, style }: { k?: string; top: number; style?: React.CSSProperties }) => (
  <div data-k={k} className="follow" style={{ top, ...style }}>Ask a follow-up<span className="send2"><Up size={10} /></span></div>
);

/** The chat pulled out of the notch (V2DetachedWindow, Compact): its header, both exchanges (each request in its bubble
 *  at the right, a short line for each at the far right, the first in view lit), the bar, the box. Window-local. */
function Pulled() {
  const L = 12, R = 30;
  return (
    <div data-k="pw" className="sc-pull">
      <div data-k="pw:glass" className="sc-pull-glass" />
      <div data-k="pw:body" className="sc-pull-body">
        <div className="pw-head"><Mark agent="codex" size={14} /><b>Release note</b><span className="hg"><Close /></span></div>
        <p className="sc-bub" style={{ top: 44, right: R }}>Shorten the release note.</p>
        <span className="sc-rail" style={{ top: 50 }}><i className="on" /><i /></span>
        <p className="worked" style={{ top: 82, left: L }}>Worked for 48s · Edited 1 file<Right /></p>
        <p className="ans" style={{ top: 108, left: L, right: R }}>Done. 14 words now:</p>
        <div className="quote" style={{ top: 132, left: L, right: R }}><p>{NOTE}</p></div>
        <p className="sc-bub" style={{ top: 202, right: R }}>{MORE_LINE.plain}</p>
        <Working k="pw:line" verb="Editing" obj="CHANGELOG.md" time="0:04" style={{ top: 240, left: L, right: R }} />
        <div data-k="pw:a2" className="pw-a2">
          <p className="ans" style={{ top: 242, left: L, right: R }}>Done, with the banner:</p>
          <div className="quote" style={{ top: 266, left: L, right: R }}><p>{NOTE2}</p></div>
        </div>
        <Bar k="pw:bar" top={354} agent="Codex" narrow style={{ left: L, right: L }} />
        <Follow top={388} style={{ left: L, right: L }} />
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
      <NotchShell bars={<Wings k="wo" over />}>
        {/* Claude Code's chat, popped up by itself: it needs you, Allow and Deny in place */}
        <div data-k="is:asks" className="slot s-answer">
          <div data-k="na:body" className="sc-anbody na" data-state="needs">
            <Head agent="claude-code" title="Checkout page" badge="field-notes" />
            <p className="sc-bub" style={{ top: NA.bubble, right: 32 }}>Run the checkout tests and fix what fails.</p>
            <p className="ask-q" style={{ top: NA.q }}>Run <code>npm test</code>?</p>
            <p className="ask-kv" style={{ top: NA.kv[0] }}><span>Runs</span><code>npm test</code></p>
            <p className="ask-kv" style={{ top: NA.kv[1] }}><span>Changes</span><span>No files</span></p>
            <p className="ask-kv" style={{ top: NA.kv[2] }}><span>Allow</span><span className="opt"><span className="on">Just This Once<Check /></span><span>For This Session</span></span></p>
            <Working verb="Running" obj="npm test" time="0:01" style={{ top: NA.q, left: 32, right: 32 }} />
            <div className="sc-sbar" style={{ top: NA.bar }}>
              <span className="sc-chip"><Ext />Open in Claude Code</span>
              <span className="sp" />
              <span className="sc-chip ask-b">Deny</span>
              <span data-k="na:run" className="sc-chip pri ask-b">Run Tests</span>
              <span className="sc-chip work-b"><Stop />Stop</span>
            </div>
            <Follow top={NA.follow} />
            <span className="grab" style={{ top: NA.grab }} />
          </div>
        </div>
        {/* Codex's chat, popped up done; asked more by voice, both exchanges */}
        <div data-k="is:answer" className="slot s-answer" style={{ height: NQ.h }}>
          <div data-k="an:body" className="sc-anbody">
            <Head agent="codex" title="Release note" badge="field-notes" />
            <p data-k="an:b1" className="sc-bub" style={{ top: NP.bubble, right: 32 }}>Shorten the release note.</p>
            <p className="worked" style={{ top: NP.worked }}>Worked for 48s · Edited 1 file<Right /></p>
            <p className="ans" style={{ top: NP.lead, left: 32 }}>Done. 14 words now:</p>
            <div data-k="an:quote" className="quote" style={{ top: NP.quote, left: 32, right: "auto", width: 452 }}><p>{NOTE}</p></div>
            <span data-k="an:open" className="openbtn" style={{ top: NP.open }}><OpenSq />Open CHANGELOG.md</span>
            <div data-k="an:q2" className="sc-q2">
              <span className="sc-rail sc-outline" style={{ top: NP.bubble + 6 }}><i className="on" /><i /></span>
              <p className="sc-bub" style={{ top: NQ.bubble, right: 32 + NQ.gutter }}>{MORE_LINE.plain}</p>
              <Working verb="Editing" obj="CHANGELOG.md" time="0:02" style={{ top: NQ.line, left: 32, right: 32 + NQ.gutter }} />
            </div>
            <Bar k="an:bar" top={NP.bar} agent="Codex" />
            <Follow k="an:follow" top={NP.follow} />
            <span data-k="an:grab" className="grab" style={{ top: NP.grab }} />
          </div>
        </div>
        {/* let go out of the notch, the board a moment: every session at work, the pulled-out one too */}
        <div data-k="is:board2" className="slot s-board">
          <Hello />
          <div className="bsec">
            <Row agent="claude-code" title="Checkout page" time="now" state="working" step={{ verb: "Running", obj: "npm test", mono: true }} />
            <Row agent="codex" title="Release note" time="now" state="working" step={{ verb: "Editing", obj: "CHANGELOG.md", mono: true }} />
          </div>
        </div>
      </NotchShell>
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
      <NotchShell bars={<Wings pile={<span data-k="wb:c0" className="mini"><TalkMini /></span>} />} />
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

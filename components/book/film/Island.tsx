import { ANSWER, BOARDS, CHOOSE, DRAFT, PANEL, REFS, type Agent, type Board as BoardT, type Choose as ChooseT, type Row, type Step } from "../../../lib/landing/film/content";
import Desk, { PrList } from "./Desk";
import { Mark, Mini, VASE } from "./Minis";

// Fovea 1.0's island in the Native design, light glass, laid out as the real app lays it out (FoveaV1
// WorkbenchTokens.swift, Spacious; the pictures DSP-01, -02, -03, -10, -14, -15, -16, -18). Back to front, all siblings
// so the glass can blur what is behind it: the glass (its body) and its ears, the rim, the contents (each at its own
// size, clipped to the outline), the black notch on top, and what drops from Choose chat over the screen (the
// attachments, opened). No drop shadow on the island: the real Mac draws none. The film moves all of it
// (lib/landing/film/film.ts). Every icon carries its own size, so a missing rule can never blow one up.

export const Chevron = () => <svg viewBox="0 0 10 10" width="9" height="9" className="chev" aria-hidden="true"><path d="M2 3.6l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
export const Right = () => <svg viewBox="0 0 10 10" width="9" height="9" className="chev" aria-hidden="true"><path d="M3.6 2l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
export const Up = ({ size = 13 }: { size?: number }) => <svg viewBox="0 0 12 12" width={size} height={size} aria-hidden="true"><path d="M6 10.2V2.2M2.6 5.4 6 2l3.4 3.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
export const Brain = () => <svg viewBox="0 0 16 16" width="12" height="12" className="model" aria-hidden="true"><path d="M5.5 3.5a2.5 2.5 0 0 0-2.4 3.2A2.5 2.5 0 0 0 4 11.5a2.5 2.5 0 0 0 4 1.3 2.5 2.5 0 0 0 4-1.3 2.5 2.5 0 0 0 .9-4.8A2.5 2.5 0 0 0 8 3a2.5 2.5 0 0 0-2.5.5Z M8 3v10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>;
export const Again = () => <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M9.6 6.4A3.7 3.7 0 1 1 8.5 3.2M8.8 1.4v2.2H6.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
export const Copy = () => <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M4 4h6v6.2H4zM2 7.8V2h5.6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>;
export const Fork = () => <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M3 2v8M3 7c0-2 6-1.5 6-4.6M9 2v.4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>;
export const Expand = () => <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M2.5 5V2.5H5M9.5 7v2.5H7M2.5 2.5 5.2 5.2M9.5 9.5 6.8 6.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>;
export const Close = () => <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="m3 3 6 6m0-6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>;
export const Back = () => <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M7.4 2.6 4 6l3.4 3.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
/** doc.badge.plus, on the well a dragged file lights */
export const DocPlus = () => <svg viewBox="0 0 14 14" width="13" height="13" aria-hidden="true"><path d="M3 1.6h4.6L10.4 4.4V7M3 1.6v10.8h4.4M7.4 1.6v3h3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><circle cx="10.6" cy="10.6" r="2.9" fill="currentColor" /><path d="M10.6 9.2v2.8M9.2 10.6h2.8" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" /></svg>;
export const Ext = () => <svg viewBox="0 0 10 10" width="9" height="9" className="ext" aria-hidden="true"><path d="M3 7 7 3M3.6 3H7v3.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
/** arrow.up.forward.square, on the capsules that open what the agent made */
export const OpenSq = () => <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 2h8v8H2z" fill="none" stroke="currentColor" strokeWidth="1.1" /><path d="M4.4 7.6 7.6 4.4M5 4.4h2.6V7" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const GLYPH: Record<Step["glyph"], React.ReactNode> = {
  read: <path d="M2 2.5h3.5a1 1 0 0 1 1 1V10a1 1 0 0 0-1-1H2zM10 2.5H6.5a1 1 0 0 0-1 1V10a1 1 0 0 1 1-1H10z" />,
  think: <path d="M6 1.5v2M6 8.5v2M1.5 6h2M8.5 6h2M2.8 2.8l1.4 1.4M7.8 7.8l1.4 1.4M2.8 9.2l1.4-1.4M7.8 4.2l1.4-1.4" />,
  write: <path d="M2 10l.6-2.4L8 2.2l1.8 1.8L4.4 9.4zM7 3.2l1.8 1.8" />,
  edit: <path d="M2 10l.6-2.4L8 2.2l1.8 1.8L4.4 9.4zM7 3.2l1.8 1.8" />,
  run: <path d="M2 2.5h8v7H2zM3.6 4.6 5 6 3.6 7.4M6 7.5h2.2" />,
  add: <path d="M6 2.5v7M2.5 6h7" />,
  fork: <path d="M3.5 2v8M3.5 6.5c0-2 5-1.5 5-4.5M8.5 2v.5" />,
};
export const StepLine = ({ s }: { s: Step }) => (
  <span className="step">
    <svg viewBox="0 0 12 12" width="10" height="10" className="sg" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">{GLYPH[s.glyph]}</g></svg>
    <span className="verb">{s.verb}</span>
    {s.obj && <span className={`obj${s.mono ? " mono" : ""}`}>{s.obj}</span>}
    {s.add && <span className="add">{s.add}</span>}
    {s.del && <span className="del">{s.del}</span>}
  </span>
);

/** The whole screen, as a capture shows it: a still copy of the desk, scaled into its card. */
const Screen = () => <Desk still />;

function Pile({ kinds }: { kinds: string[] }) {
  // the first capture in front and upright; the others behind it, smaller, turned, right-aligned (V2ReferentPile)
  return (
    <span className="pile">
      {kinds.map((k, i) => <span key={i} className="mini" data-state={k} style={{ ["--i" as string]: i, zIndex: 3 - i }}><Mini screen={k === "screen" ? <Screen /> : undefined} /></span>).reverse()}
    </span>
  );
}

function Choose({ c }: { c: ChooseT }) {
  const choosing = c.id === "c2";
  const keyed = choosing ? { "data-k": "ch:c2", "data-state": "choosing" } : {};
  return (
    <div data-k={`is:choose:${c.id}`} className="slot s-choose">
      <div className="cwrap" {...keyed}>
        <p className="creq">{c.request}</p>
        <div className="row">
          <Pile kinds={c.kinds} />
          <span className="pills">
            <span className="pill chat">
              <span data-k={`ch:${c.id}glow`} className="glow" />
              {/* Soon: a ring circles where the chat's icon will be while Fovea thinks, then the chat takes its place */}
              {choosing && (
                <span data-k="ch:c2wait" className="choosing">
                  <svg data-k="ch:c2ring" className="think" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
                    <circle className="trk" cx="9" cy="9" r="7.5" /><circle className="arc" cx="9" cy="9" r="7.5" />
                  </svg>
                  Choosing chat
                </span>
              )}
              <span {...(choosing ? { "data-k": "ch:c2pick" } : {})} className="settled"><Mark agent={c.agent} /><span className="name">{c.chat}</span><Chevron /></span>
            </span>
            <span className="pill model">
              {choosing && <span data-k="ch:c2mglow" className="glow" />}
              <Brain />{choosing ? <><span className="mauto">Auto</span><span className="mpick">Sonnet 5</span></> : "Auto"}<Chevron />
            </span>
            <span className="send"><Up /></span>
          </span>
        </div>
        {c.chips?.length ? (
          <div className="sug">
            <span className="lab">Suggested</span>
            {c.chips.map((ch, i) => <span key={ch.name} className={`chip${i === 0 ? " on" : ""}`}><Mark agent={ch.agent} size={14} />{ch.name}</span>)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** A session's header (V2ChatContent): its agent, the chat, the project; expand and close; a back button when it was
 *  opened from the board. */
function Head({ agent, title, badge, back }: { agent: Agent; title: string; badge: string; back?: boolean }) {
  return (
    <div className="head">
      {back && <span className="circ sm"><Back /></span>}
      <Mark agent={agent} size={22} />
      <b>{title}</b>
      <span className="badge-t">{badge}</span>
      <span className="circ"><Expand /></span>
      <span className="circ"><Close /></span>
    </div>
  );
}

/** Below every answer: what opens it where it lives, then the bar, the follow-up field and the grab handle. */
function Foot({ open, at }: { open: string; at: { open: number; bar: number; follow: number; grab: number } }) {
  return (
    <>
      <span className="openbtn" style={{ top: at.open }}><OpenSq />{open}</span>
      <span className="openin" style={{ top: at.bar }}>{ANSWER.openIn}<Ext /></span>
      <span className="sbar" style={{ top: at.bar }}>
        <span className="again"><Fork />Continue in…</span><span className="again"><Copy />Copy Answer</span><span className="again"><Again />Answer again</span>
      </span>
      <div className="follow" style={{ top: at.follow }}>Ask a follow-up<span className="send2"><Up size={11} /></span></div>
      <span className="grab" style={{ top: at.grab }} />
    </>
  );
}

/** What changed in Blender, opened from the board (DSP-16's layout). */
function AnswerB1() {
  const L = PANEL.b1;
  return (
    <div data-k="is:answer:b1" className="slot s-answer" style={{ height: L.h }}>
      <Head agent={ANSWER.agent} title={ANSWER.chat} badge={ANSWER.project} back />
      <p className="q" style={{ top: L.q }}>{ANSWER.question}</p>
      <p className="worked" style={{ top: L.worked }}>{ANSWER.worked}<Right /></p>
      <p className="ans" style={{ top: L.lead }}>{ANSWER.lead}</p>
      <div className="trow th" style={{ top: L.th }}><span>{ANSWER.head[0]}</span><span>{ANSWER.head[1]}</span></div>
      {ANSWER.rows.map(([a, b], i) => (
        <div key={a} className="trow" style={{ top: L.row + i * 24 }}><span className="term">{a}</span><span>{b}</span></div>
      ))}
      <p className="ans" style={{ top: L.close }}>{ANSWER.close}</p>
      <Foot open={ANSWER.open} at={L} />
    </div>
  );
}

/** The reply to Dana, back in the notch as the app's draft is (DSP-18): the draft in a quote card. */
function AnswerB2() {
  const L = PANEL.b2;
  return (
    <div data-k="is:answer:b2" className="slot s-answer" style={{ height: L.h }}>
      <Head agent={DRAFT.agent} title={DRAFT.chat} badge={DRAFT.project} />
      <p className="q" style={{ top: L.q }}>{DRAFT.question}</p>
      <p className="worked" style={{ top: L.worked }}>{DRAFT.worked}<Right /></p>
      <p className="ans" style={{ top: L.lead }}>{DRAFT.lead}</p>
      <div className="quote" style={{ top: L.quote }}>
        {DRAFT.body.map((p, i) => <p key={i}>{p}</p>)}
        <span className="qatt"><i><svg viewBox="0 0 100 140" width="14" height="20" aria-hidden="true"><path d={VASE} /></svg></i>{DRAFT.attach.name}<em>{DRAFT.attach.size}</em></span>
      </div>
      <Foot open={DRAFT.open} at={L} />
    </div>
  );
}

function BoardRow({ r, id, i }: { r: Row; id: string; i: number }) {
  const keyed = r.focus ? { "data-k": `rw:${id}:${i}` } : {};
  return (
    <div className={`brow${r.focus ? " focus" : ""}`} data-state={r.state} {...keyed}>
      <span className="ic"><Mark agent={r.agent} size={26} /><span className="badge" /></span>
      <span className="tx">
        <b>{r.title}</b>
        {r.state === "done" && <span className="line">{r.line}</span>}
        {r.state === "working" && r.steps && (r.focus && r.steps.length > 1
          ? <span className="steps" data-k={`step:${id}`} data-state="0">{r.steps.map((s, j) => <span key={j} data-i={j}><StepLine s={s} /></span>)}</span>
          : <span className="steps one"><StepLine s={r.steps[0]} /></span>)}
      </span>
      <span className="tm">{r.time}</span>
    </div>
  );
}

function Board({ b }: { b: BoardT }) {
  let i = 0;
  return (
    <div data-k={`is:board:${b.id}`} className="slot s-board">
      {b.sections.map((rows, si) => (
        <div key={si} className={`bsec${si > 0 ? " sep" : ""}`}>
          {rows.map((r) => <BoardRow key={r.title} r={r} id={b.id} i={i++} />)}
        </div>
      ))}
    </div>
  );
}

/** Soon's attachments, opened from Choose chat's pile: a numbered row, then the second up close (V2FeedbackViews). */
function Refs() {
  return (
    <>
      <div data-k="c2:row" className="refrow" style={{ left: REFS.row.x, top: REFS.row.y, width: REFS.row.w, height: REFS.row.h }}>
        {REFS.items.map((it, i) => (
          <span key={it.kind} className={`refc refc-${it.kind}`}><span className="mini" data-state={it.kind}><Mini /></span><b className="num">{i + 1}</b></span>
        ))}
      </div>
      <div data-k="c2:look" className="reflook">
        <div className="reflook-in" style={{ width: REFS.look.w, height: REFS.look.h }}>
          <div className="reflook-pic"><PrList /></div>
          <p className="reflook-cap">{REFS.items[1].label}</p>
          <span className="reflook-esc"><Back />esc</span>
        </div>
      </div>
    </>
  );
}

export default function Island() {
  return (
    <div className="isl">
      <div data-k="is:glass" className="is-glass" />
      <svg data-k="is:ears" className="is-ears" aria-hidden="true"><path /></svg>
      <svg data-k="is:rim" className="is-rim" aria-hidden="true"><path /></svg>
      <div data-k="is:clip" className="is-clip">
        {/* the voice bar: the stack and nine bars (no glow under it, Oct 18) */}
        <div data-k="is:voice" className="slot s-voice" data-state="0">
          <span className="stack">
            {[2, 1, 0].map((i) => <span key={i} data-k={`vb:t${i}`} className={`mini th th${i}`}><Mini screen={i === 0 ? <Screen /> : undefined} /></span>)}
          </span>
          <span data-k="vb:wave" className="wave">{Array.from({ length: 9 }, (_, i) => <i key={i} data-k={`vb:b${i}`} />)}</span>
          {/* a file dragged over the notch: the bar lights as a well and says what letting go does (Oct 17) */}
          <span data-k="vb:drop" className="drop"><DocPlus />Drop to take it</span>
        </div>
        {/* Transcribing: the word and its ellipsis */}
        <div data-k="is:trans" className="slot s-trans">
          <p>Transcribing<span data-k="tr:dots" className="ell"><i /><i /><i /></span></p>
        </div>

        {Object.values(CHOOSE).map((c) => <Choose key={c.id} c={c} />)}

        {/* what came back: from the board after the look-dev, by itself after the draft (DSP-16, DSP-18) */}
        <AnswerB1 />
        <AnswerB2 />

        {Object.values(BOARDS).map((b) => <Board key={b.id} b={b} />)}
      </div>
      <div className="is-notch" />
      <Refs />
    </div>
  );
}

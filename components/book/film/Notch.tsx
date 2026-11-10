import { AURORA_COLORS } from "../../../lib/landing/film/notch";
import type { Agent } from "../../../lib/landing/film/content";
import { Mark } from "./Minis";
import "./notch.css";

// Fovea's notch as the app draws it since Nov 8, in markup (lib/landing/film/notch.ts moves it): black at rest, as Wings
// and as what opens under it, its ears into the menu bar, what it holds clipped to its outline, the bar's sides beside
// the notch, the notch on top; at the notch every agent's mark is one ink. Shared by the first screen
// (heroes/HeroDesk.tsx) and the showcase (showcase/scenes.tsx).

/** return, Send's key; tray.and.arrow.down, the drop zone's; magnifyingglass, the board's search; chevron.left, back. */
export const Return = () => <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M10 2.6v3.6a1.4 1.4 0 0 1-1.4 1.4H2.6M5 5.2 2.6 7.6 5 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Tray = () => <svg viewBox="0 0 18 18" width="16" height="16" aria-hidden="true"><path d="M2.5 10.5 4.4 5.2c.2-.5.6-.7 1.1-.7H6M12 4.5h.5c.5 0 .9.2 1.1.7l1.9 5.3M2.5 10.5v3.4c0 .8.6 1.4 1.4 1.4h10.2c.8 0 1.4-.6 1.4-1.4v-3.4H11.8a2.8 2.8 0 0 1-5.6 0zM9 1.8v6.6M6.4 6 9 8.6 11.6 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
export const Search = () => <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><circle cx="5.2" cy="5.2" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m7.9 7.9 2.6 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
export const Back = () => <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M7.4 2.4 3.8 6l3.6 3.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const UpDown = () => <svg viewBox="0 0 8 12" width="6" height="9" aria-hidden="true"><path d="M1.5 4.2 4 1.7l2.5 2.5M1.5 7.8 4 10.3l2.5-2.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/** The island, back to front: its black and its ears, the hairline round what's open, what it holds clipped to its
 *  outline, the bar's sides (`bars`), the notch. */
export function NotchShell({ children, bars }: { children?: React.ReactNode; bars?: React.ReactNode }) {
  return (
    <div className="isl nt">
      <div data-k="is:blk" className="is-blk" />
      <svg data-k="is:ears" className="is-ears" aria-hidden="true"><path /></svg>
      <svg data-k="is:rim" className="is-rim" aria-hidden="true"><path /></svg>
      <div data-k="is:clip" className="is-clip">{children}</div>
      {bars}
      <div className="is-notch" />
    </div>
  );
}

const Dots = ({ k }: { k: string }) => <span data-k={k} className="wdots"><i /><i /><i /></span>;

/** Wings' sides (keys `${k}…`): the words, the pile of what's taken (`pile`, its cards, and its count `${k}:n2…` up to
 *  `count`), the six bars, the ring and Ask your agent's light. `over`, the bar is drawn black over a panel. */
export function Wings({ k = "wb", pile, count = 0, over }: { k?: string; pile?: React.ReactNode; count?: number; over?: boolean }) {
  return (
    <div data-k={k} className="wb" aria-hidden="true">
      {over && <i className="wbg" />}
      <span data-k={`${k}:aur`} className="waur">
        {AURORA_COLORS.map((c, i) => <i key={i} data-k={`${k}:l${i}`} style={{ background: c }} />)}
        <svg data-k={`${k}:rim`} className="wrim" viewBox="0 0 64 32" width="64" height="32"><path d="M64 4V20Q64 32 52 32H36" stroke={AURORA_COLORS[0]} /></svg>
      </span>
      <span data-k={`${k}:listen`} className="wword">Listening</span>
      <span data-k={`${k}:trans`} className="wword">Transcribing<Dots k={`${k}:dots`} /></span>
      <span data-k={`${k}:think`} className="wword">Thinking<Dots k={`${k}:dots2`} /></span>
      <span data-k={`${k}:pile`} className="wpile">
        {pile}
        {Array.from({ length: Math.max(0, count - 1) }, (_, i) => (
          <b key={i} data-k={`${k}:n${i + 2}`} className="wcount" style={{ left: 12 + 18 + (Math.min(i + 2, 3) - 1) * 5 + 6 }}>{i + 2}</b>
        ))}
      </span>
      <span data-k={`${k}:wave`} className="wwave">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} data-k={`${k}:b${i}`} />)}</span>
      <svg data-k={`${k}:ring`} className="wring" viewBox="0 0 14 14" width="14" height="14"><circle cx="7" cy="7" r="6" /><path data-k={`${k}:arc`} d="M7,1" /></svg>
    </div>
  );
}

/** Choose chat at its usual size (Nov 8, "p6"; IslandChatStageView): ‹, the request as said, what was taken at its
 *  right (`pile`); a hairline; To the chat (Fovea's pick, one ink), "⌃ more chats", Send ↵. */
export function ChooseChat({ k, request, pile, count = 0, chat }: { k: string; request: string; pile?: React.ReactNode; count?: number; chat: { agent: Agent; name: string; sub?: string } }) {
  return (
    <div data-k={k} className="slot s-choose">
      <div className="ch-head">
        <span className="ch-back"><Back /></span>
        <p className="ch-words">{request}</p>
        {pile && <span className="ch-pile"><span className="stack" style={{ width: 32 + (Math.min(Math.max(count, 1), 3) - 1) * 5 }}>{pile}</span>{count > 1 && <b className="ch-count">{count}</b>}</span>}
      </div>
      <i className="ch-rule" />
      <div className="ch-foot">
        <span className="ch-to">To</span>
        <span className="ch-chat"><span data-k="ch:glow" className="glow" /><Mark agent={chat.agent} size={14} ink /><b>{chat.name}</b>{chat.sub && <em>{chat.sub}</em>}</span>
        <span className="sp" />
        <span className="ch-hint">⌃ more chats</span>
        <span data-k={`${k}:send`} className="ch-send">Send<Return /></span>
      </div>
    </div>
  );
}

/** The board's top (Focus): the greeting, the clock it shows (the last hour), the search. */
export const BoardHead = () => (
  <div className="fb-head"><b>Hello, Ryan.</b><span className="sp" /><span className="fb-clock">Last hour<UpDown /></span><span className="fb-search"><Search /></span></div>
);

export type Seg = "done" | "now" | "needs" | "todo";
/** The session in focus, a task (FocusTaskCard): its agent and title, the % of its own plan (or none yet), the plan as
 *  segments, the step it's on and where it runs, then what it's doing (`children`), and its requests as ticks. `pct`
 *  and the segments can move: keys `${k}:pct` (its text) and `${k}:s${i}` (their state). */
export function FocusCard({ k, agent, title, pct, segs, step, meta, ticks = [], children }: {
  k?: string; agent: Agent; title: string; pct: string; segs: Seg[]; step: React.ReactNode; meta: string; ticks?: number[]; children?: React.ReactNode;
}) {
  return (
    <div data-k={k} className="fb-card">
      <div className="fc-top"><Mark agent={agent} size={16} ink /><b>{title}</b><span className="sp" /><span data-k={k && `${k}:pct`} data-text className="fc-pct">{pct}</span></div>
      <div className="fc-segs">{segs.map((s, i) => <i key={i} data-k={k && `${k}:s${i}`} data-state={s} />)}</div>
      <div className="fc-step"><span>{step}</span><span className="sp" /><span>{meta}</span></div>
      {children}
      <div className="fc-strip">{ticks.map((x, i) => <i key={i} style={{ left: `${x * 100}%` }} />)}</div>
    </div>
  );
}

/** A task's line (FocusTaskRow): its agent, its title, its thread on the last hour's clock (`from` to `to`, fractions of
 *  the hour) ending in a dot of its state, the % at the right. */
export function FocusRow({ agent, title, from, to, state, pct }: { agent: Agent; title: string; from: number; to: number; state: "working" | "needs" | "done" | "failed"; pct: string }) {
  return (
    <div className="fb-row" data-state={state}>
      <Mark agent={agent} size={12} ink />
      <b>{title}</b>
      <span className="fr-clock"><i className="fr-line" style={{ left: `${from * 100}%`, width: `${(to - from) * 100}%` }} /><i className="fr-dot" style={{ left: `${to * 100}%` }} /></span>
      <span className="fr-pct">{pct}</span>
    </div>
  );
}

/** "Chats", and a chat's line (FocusChatRow): no clock, no %, no plan; the reply itself, then how long ago. */
export const ChatsHead = () => <div className="fb-sec">Chats</div>;
export function FocusChat({ agent, title, reply, time, unread }: { agent: Agent; title: string; reply: string; time: string; unread?: boolean }) {
  return (
    <div className="fb-chat">
      <Mark agent={agent} size={12} ink />
      <b>{title}</b>
      <span className="fch-reply">{reply}</span>
      <span className="fch-time">{unread && <i />}{time}</span>
    </div>
  );
}

/** What a chat that needs you asks (Nov 7): the question, every choice numbered on a key cap (`lit`, the one a key
 *  chooses), and a field for an answer of your own. */
export function Ask({ q, choices, lit = 0, k }: { q: React.ReactNode; choices: string[]; lit?: number; k?: string }) {
  return (
    <div data-k={k} className="ask">
      <p className="ask-wait">Waiting for approval</p>
      <p className="ask-q">{q}</p>
      {choices.map((c, i) => <p key={c} data-k={k && `${k}:c${i}`} className={`ask-c${i === lit ? " lit" : ""}`}><i className="ask-k">{i + 1}</i>{c}</p>)}
      <p className="ask-own">Or tell it what to do instead</p>
    </div>
  );
}

/** The drop zone, floating 8 pt under the bar: "Drop files here" in a well with dashes; a file over it, the well lit in
 *  the accent, "Let go to add it". */
export const DropZone = () => (
  <div data-k="dz" className="dz" aria-hidden="true">
    <i className="dwell" />
    <span className="dtx"><Tray />Drop files here</span>
    <span className="dtx on"><Tray />Let go to add it</span>
  </div>
);

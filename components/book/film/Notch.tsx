import { AURORA_COLORS } from "../../../lib/landing/film/notch";
import type { Agent } from "../../../lib/landing/film/content";
import { Mark } from "./Minis";
import "./notch.css";

// Fovea's notch as FoveaV1 draws it since Oct 28, in markup (lib/landing/film/notch.ts moves it): the black at rest and
// as Wings, the glass with its ears and rim, the Halo, what it holds clipped to its outline, the bar's sides beside the
// notch, the notch on top. Shared by the first screen (heroes/HeroDesk.tsx) and the showcase (showcase/scenes.tsx).

/** return, Send's key; tray.and.arrow.down, the drop zone's; magnifyingglass, the board's search. */
export const Return = () => <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M10 2.6v3.6a1.4 1.4 0 0 1-1.4 1.4H2.6M5 5.2 2.6 7.6 5 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Tray = () => <svg viewBox="0 0 18 18" width="16" height="16" aria-hidden="true"><path d="M2.5 10.5 4.4 5.2c.2-.5.6-.7 1.1-.7H6M12 4.5h.5c.5 0 .9.2 1.1.7l1.9 5.3M2.5 10.5v3.4c0 .8.6 1.4 1.4 1.4h10.2c.8 0 1.4-.6 1.4-1.4v-3.4H11.8a2.8 2.8 0 0 1-5.6 0zM9 1.8v6.6M6.4 6 9 8.6 11.6 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
export const Search = () => <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><circle cx="5.2" cy="5.2" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m7.9 7.9 2.6 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;

/** The island, back to front: the black and its ears, the glass and its ears and rim, what it holds clipped to its
 *  outline (the Halo first), the bar's sides (`bars`), the notch. */
export function NotchShell({ children, bars }: { children?: React.ReactNode; bars?: React.ReactNode }) {
  return (
    <div className="isl nt">
      <div data-k="is:blk" className="is-blk" />
      <svg data-k="is:bears" className="is-bears" aria-hidden="true"><path /></svg>
      <div data-k="is:glass" className="is-glass" />
      <svg data-k="is:ears" className="is-ears" aria-hidden="true"><path /></svg>
      <svg data-k="is:rim" className="is-rim" aria-hidden="true"><path /></svg>
      <div data-k="is:clip" className="is-clip">
        <div data-k="is:halo" className="is-halo" />
        {children}
      </div>
      {bars}
      <div className="is-notch" />
    </div>
  );
}

const Dots = ({ k }: { k: string }) => <span data-k={k} className="wdots"><i /><i /><i /></span>;

/** Wings' sides (keys `${k}…`): the words, the pile of what's taken (`pile`, its cards), the waveform, the ring and the
 *  corner's light. `over`, the bar is drawn black over a panel. */
export function Wings({ k = "wb", pile, over }: { k?: string; pile?: React.ReactNode; over?: boolean }) {
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
      <span data-k={`${k}:pile`} className="wpile">{pile}</span>
      <span data-k={`${k}:wave`} className="wwave">{[0, 1, 2, 3, 4].map((i) => <i key={i} data-k={`${k}:b${i}`} />)}</span>
      <svg data-k={`${k}:ring`} className="wring" viewBox="0 0 14 14" width="14" height="14"><circle cx="7" cy="7" r="6" /><path data-k={`${k}:arc`} d="M7,1" /></svg>
    </div>
  );
}

/** Choose chat, the Sentence (ChooseChatSentence.swift): the request as said, a hairline, and one line that reads as a
 *  sentence, its words the controls: what was taken (`pile`), To the chat, thinking how hard, Send ↵. */
export function Sentence({ k, request, pile, chat, effort = "default" }: { k: string; request: string; pile?: React.ReactNode; chat: { agent: Agent; name: string }; effort?: string }) {
  return (
    <div data-k={k} className="slot s-sent">
      <p className="sreq">{request}</p>
      <i className="srule" />
      <div className="srow">
        {pile && <span className="spile">{pile}</span>}
        <span className="stx">To</span>
        <span className="stok"><span data-k="ch:glow" className="glow" /><Mark agent={chat.agent} size={13} /><span className="nm">{chat.name}</span></span>
        <span className="stx">· thinking</span>
        <span className="stok"><span className="nm">{effort}</span></span>
        <span className="sp" />
        <span data-k={`${k}:send`} className="ssend">Send<Return /></span>
      </div>
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

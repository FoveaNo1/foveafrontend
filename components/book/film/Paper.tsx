import { AGENT_ROW, CAPTIONS, CARDS, DAY, KEYS, LINES } from "../../../lib/landing/film/content";
import { VASE } from "./Minis";

// The film's own page, over the screen and sized to the frame: the paper its cards are set on (in the landing page's
// faces), the notch that carries across every card, the Fovea Bar, the day seen through the eyes, what the day leaves
// behind, and the last line; then what sits on top of everything: key caps, the "Coming soon" tag, captions and the
// spoken words.

function Card({ k, text, className = "" }: { k: string; text: React.ReactNode; className?: string }) {
  return <p data-k={k} className={`pc ${className}`}>{text}</p>;
}

export function PaperLayer() {
  const lastWords = CARDS.last.text.split(" ");
  const lookAt = lastWords.findIndex((w) => w.startsWith("look"));
  return (
    <div data-k="paper" className="paper">
      <span data-k="pnotch" className="pnotch" />
      {/* the opening line, a sentence a line */}
      <Card k="cd:title" className="big title" text={CARDS.title.text.split(/(?<=\.) /).map((s, i) => <span key={i}>{s}</span>)} />
      <p data-k="cd:eyes" className="pc big">
        {CARDS.eyes.text.replace(/eyes\.$/, "")}<span className="eyes">eyes<span data-k="cd:eyesRing" className="pring" /></span>.
      </p>
      <Card k="cd:eyesSmall" text={CARDS.eyes.small} className="small below" />
      <Card k="cd:agents" text={CARDS.agents.text} className="big" />
      <Card k="cd:agentsSmall" text={CARDS.agents.small} className="small below" />
      <Card k="cd:next" text={CARDS.next.text} className="big" />

      {/* eslint-disable-next-line @next/next/no-img-element -- the Fovea Bar render */}
      <img data-k="bar" className="pbar" src="/landing/film/fovea-bar.png" alt="" />
      <Card k="cd:bar" text={CARDS.bar.text} className="mid lower" />
      <Card k="cd:barSmall" text={CARDS.bar.small} className="small lowest" />

      <figure data-k="ph:1" className="photo">
        {/* eslint-disable-next-line @next/next/no-img-element -- a stand-in photograph (public/landing/SOURCES.md) */}
        <img src="/landing/film/trail.jpg" alt="" />
        <span data-k="ph:1ring" className="pring in" />
      </figure>
      <Card k="cd:wear" text={CARDS.wear.text} className="big" />
      <Card k="cd:wearSmall" text={CARDS.wear.small} className="small below" />

      {/* the day, morning to evening, as it was seen: a line drawn across it, each moment with its time */}
      <span data-k="dayLine" className="dayline" />
      <div className="memory">
        {DAY.map(({ id: m, at }, i) => (
          <span key={m} className="memc">
            <span data-k={`mem:${i}`} className={`mem mem-${m}`} style={{ ["--dx" as string]: `${((DAY.length - 1) / 2 - i) * 11.6}cqw` }}>
              {m === "vase" && <svg viewBox="0 0 100 140" aria-hidden="true"><path d={VASE} fill="#B4553A" /></svg>}
              {m === "chart" && <svg viewBox="0 0 40 28" aria-hidden="true"><path d="M4 22 L11 19 L17 20 L23 14 L29 15 L36 7" fill="none" stroke="#0A84FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            <span data-k={`memt:${i}`} className="memt">{at}</span>
          </span>
        ))}
      </div>
      {/* and from the notch, to every agent you use */}
      <div className="agents">
        {AGENT_ROW.map((a, i) => (
          <span key={a.name} className="agw" style={{ ["--i" as string]: i - (AGENT_ROW.length - 1) / 2 }}>
            <span data-k={`adot:${i}`} className="adot" />
            <span data-k={`agent:${i}`} className={`ag${a.own ? " own" : ""}`} title={a.name}>
              {/* eslint-disable-next-line @next/next/no-img-element -- an agent's icon, small */}
              <img src={a.mark} alt="" width="128" height="128" />
            </span>
            <span data-k={`agentName:${i}`} className="agn">{a.name}</span>
          </span>
        ))}
      </div>
      <Card k="cd:saw" text={CARDS.saw.text} className="small saw" />
      <Card k="cd:you" text={CARDS.you.text} className="big you" />
      <p data-k="cd:last" className="pc big last">
        {lastWords.map((w, i) => (
          <span key={i}>{i === lookAt ? <span className="look">{w}<span data-k="endRing" className="pring" /></span> : w}{i < lastWords.length - 1 ? " " : ""}</span>
        ))}
      </p>
    </div>
  );
}

export function Over() {
  return (
    <div className="over">
      <div className="keys">
        {Object.entries(KEYS).map(([id, k]) => (
          <span key={id} data-k={`key:${id}`} className="kc" data-state="up">
            {k.caps.map((c, i) => <kbd key={i} className={c.length > 1 ? "wide" : ""}>{c}</kbd>)}
            <em>{k.label}</em>
          </span>
        ))}
      </div>
      <span data-k="tag:preview" className="tag">In preview</span>
      <span data-k="tag:fast" className="tag tag2">The agent’s work, sped up</span>
      <span data-k="tag:soon" className="tag">Coming soon</span>
      <span data-k="tag:next" className="tag">Next</span>
      <div className="subs">
        {Object.entries(CAPTIONS).map(([id, text]) => <p key={id} data-k={`cap:${id}`} className="cap">{text}</p>)}
        {LINES.map((l) => (
          <p key={l.id} data-k={`sub:${l.id}`} className="sub">
            {l.words.map((w, i) => (
              <span key={i}><span data-k={`sw:${l.id}:${i}`} className={`w${w.mark ? ` ${w.mark}` : ""}`}>{w.text}</span>{i < l.words.length - 1 ? " " : ""}</span>
            ))}
          </p>
        ))}
      </div>
      <span data-k="fade" className="fadeblack" />
    </div>
  );
}

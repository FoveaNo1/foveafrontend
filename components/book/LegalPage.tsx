import Link from "next/link";
import { Fragment } from "react";
import type { LegalDoc } from "../../lib/landing/legal";
import SiteFoot from "./SiteFoot";
import TopBar from "./TopBar";

// A legal page set like a book's appendix: one reading column, its contents in the margin, the text word for word.
// Paragraphs written "Term — text" set the term in the heavier weight, as the site had them.

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[\[([^|]+)\|([^\]]+)\]\]$/);
        return m ? <Link key={i} href={m[2]}>{m[1]}</Link> : <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

function Para({ text }: { text: string }) {
  const m = text.match(/^([^—[]{2,48}) — (.+)$/);
  if (m) return <p><strong>{m[1]}</strong> — <Inline text={m[2]} /></p>;
  return <p><Inline text={text} /></p>;
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const heads = doc.blocks.filter((b) => b.k === "h2");
  return (
    <>
      <TopBar />
      <main className="legal">
        <header className="legal-head">
          <h1 className="rise">{doc.title}</h1>
          <p className="meta">{doc.updated}</p>
        </header>
        <nav className="legal-toc" aria-label="Contents">
          {heads.map((h) => <a key={h.t} href={`#${slug(h.t)}`}>{h.t}</a>)}
        </nav>
        <article className="legal-text">
          {doc.blocks.map((b, i) =>
            b.k === "h2" ? <h2 key={i} id={slug(b.t)}>{b.t}</h2> : b.k === "h3" ? <h3 key={i}>{b.t}</h3> : <Para key={i} text={b.t} />,
          )}
        </article>
      </main>
      <SiteFoot />
    </>
  );
}

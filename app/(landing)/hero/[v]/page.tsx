import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFoot from "../../../../components/book/SiteFoot";
import Hero from "../../../../components/book/heroes/Hero";
import { HEROES, PICTURED, ROUND3 } from "../../../../lib/landing/heroes";
import "../heroes.css";

// One of the first screens under review (Oct 17): its hero, then the page as it is (only the way in). Not linked, not indexed.
// ?p= picks a picture for round three's (lib/landing/pictures.ts); ?t= holds the desktop's gesture at that second.

export const metadata: Metadata = { title: "Fovea · first screens", robots: { index: false, follow: false } };
export const dynamicParams = false;
export function generateStaticParams() {
  return [...HEROES, ...PICTURED, ...ROUND3].map((h) => ({ v: h.id }));
}

export default async function HeroPage({ params, searchParams }: { params: Promise<{ v: string }>; searchParams: Promise<{ p?: string; t?: string }> }) {
  const { v } = await params;
  const { p, t } = await searchParams;
  const at = t !== undefined && t !== "" && Number.isFinite(Number(t)) ? Number(t) : undefined;
  const h = [...HEROES, ...PICTURED, ...ROUND3].find((x) => x.id === v);
  if (!h) notFound();
  const cls = h.id.startsWith("notch") ? "notch" : h.id === "framed" ? "inframe" : h.id;
  return (
    <main className={`hx hv-${cls}`}>
      <Hero id={h.id} pic={p} at={at} />
      <SiteFoot />
    </main>
  );
}

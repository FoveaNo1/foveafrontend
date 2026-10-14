import type { Metadata } from "next";
import Link from "next/link";
import SiteFoot from "../../../components/book/SiteFoot";
import TopBar from "../../../components/book/TopBar";
import { LandingCopy } from "../../../lib/landing/copy";

// "What leaves your Mac", on its own page, linked from the foot, set as a page of plain text in the landing page's
// type. Its facts are to be confirmed against the 1.0 build.

export const metadata: Metadata = {
  title: `${LandingCopy.leaves.title} · Fovea`,
  description: LandingCopy.leaves.body,
  alternates: { canonical: LandingCopy.leaves.href },
};

export default function WhatLeavesYourMac() {
  return (
    <>
      <TopBar />
      <main className="text-page">
        <h1>{LandingCopy.leaves.title}</h1>
        <p>{LandingCopy.leaves.body}</p>
        <p className="back-line"><Link className="act-line small" href="/">{LandingCopy.toHome} <span className="ar" aria-hidden="true">→</span></Link></p>
      </main>
      <SiteFoot />
    </>
  );
}

import type { Metadata } from "next";
import { VisionBody } from "../../../components/book/BookBody";
import SiteFoot from "../../../components/book/SiteFoot";
import TopBar from "../../../components/book/TopBar";
import { BookCopy as c } from "../../../lib/landing/bookCopy";

// Fovea Vision (Oct 17): why Fovea, its own page, linked first in the foot. "What personal agents are missing is
// you." and all of it, set exactly as it was on the front page (the book's type and sizes), with no picture.

export const metadata: Metadata = {
  title: `${c.foot.vision} · Fovea`,
  description: `${c.s3.title} ${c.s3.before} ${c.s3.context}`,
  alternates: { canonical: "/vision" },
};

export default function Vision() {
  return (
    <>
      <TopBar />
      <main>
        <VisionBody />
      </main>
      <SiteFoot />
    </>
  );
}

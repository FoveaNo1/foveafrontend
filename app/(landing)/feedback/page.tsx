import type { Metadata } from "next";
import FeedbackForm from "../../../components/book/FeedbackForm";
import SiteFoot from "../../../components/book/SiteFoot";
import TopBar from "../../../components/book/TopBar";
import { buildPageMetadata } from "../../../lib/site-metadata";

export const metadata: Metadata = buildPageMetadata("feedback");

export default function FeedbackPage() {
  return (
    <>
      <TopBar />
      <main className="text-page">
        <h1 className="rise">Send feedback</h1>
        <p className="rise" style={{ ["--i" as string]: 1 }}>Report bugs, request features, or share your thoughts. Your feedback helps us improve Fovea.</p>
        <FeedbackForm />
      </main>
      <SiteFoot />
    </>
  );
}

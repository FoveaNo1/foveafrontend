import type { Metadata } from "next";
import LegalPage from "../../../components/book/LegalPage";
import { Terms } from "../../../lib/landing/legal";

export const metadata: Metadata = {
  title: "Terms of Service · Fovea",
  description: "Terms of Service for Fovea for Mac.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage doc={Terms} />;
}

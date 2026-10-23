import type { Metadata } from "next";
import LegalPage from "../../../components/book/LegalPage";
import { Privacy } from "../../../lib/landing/legal";
import { buildPageMetadata } from "../../../lib/site-metadata";

export const metadata: Metadata = buildPageMetadata("privacy");

export default function PrivacyPage() {
  return <LegalPage doc={Privacy} />;
}

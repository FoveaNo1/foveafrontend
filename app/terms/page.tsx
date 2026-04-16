import type { Metadata } from "next";
import TermsPageContent from "../../components/TermsPageContent";

export const metadata: Metadata = {
  title: "Terms of Service | Fovea",
  description: "Terms of Service for Fovea for Mac.",
  alternates: {
    canonical: "/terms",
  },
};

export default function Page() {
  return <TermsPageContent />;
}

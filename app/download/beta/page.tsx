import type { Metadata } from "next";
import BetaDownloadPageContent from "../../../components/BetaDownloadPageContent";

export const metadata: Metadata = {
  title: "Fovea — Beta & Eye Tracking Downloads",
  description:
    "Choose the right Fovea beta, eye-tracking companion, or invited research download for macOS.",
  alternates: {
    canonical: "/download/beta",
  },
};

export default function Page() {
  return <BetaDownloadPageContent />;
}

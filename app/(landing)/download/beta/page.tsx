import type { Metadata } from "next";
import BetaDownloads from "../../../../components/book/account/BetaDownloads";
import SiteFoot from "../../../../components/book/SiteFoot";
import TopBar from "../../../../components/book/TopBar";

export const metadata: Metadata = {
  title: "Beta downloads · Fovea",
  description: "Fovea Beta, FoveaGaze and FoveaGazeCollect for invited users.",
  alternates: { canonical: "/download/beta" },
  robots: { index: false, follow: false },
};

export default function BetaDownloadPage() {
  return (
    <>
      <TopBar />
      <BetaDownloads />
      <SiteFoot />
    </>
  );
}

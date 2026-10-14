import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import DownloadTracker from "../../components/landing/ui/DownloadTracker";
import PaperPanel from "../../components/book/PaperPanel";
import { PAPER_KEY } from "../../lib/landing/paper";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, EB_Garamond, Mrs_Saint_Delafield } from "next/font/google";
import "./book.css";

// The landing page's own root layout ("the book", Oct 13): Cormorant Garamond for the few large lines, EB Garamond
// for the words, the system face for the smallest things; ink on #FAFAFA. Mrs Saint Delafield only signs the
// founding member's letter. The rest of the site keeps app/(site)/layout.tsx. The gradient landing it replaces is
// in landing/backups/2026-10-13-before-book-landing.tgz.
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const eb = EB_Garamond({ variable: "--font-eb", subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], display: "swap" });
const signature = Mrs_Saint_Delafield({ variable: "--font-signature", subsets: ["latin"], weight: "400", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL("https://hellofovea.com"),
};

export const viewport: Viewport = {
  themeColor: "#FAFAFA",
  colorScheme: "light",
};

// The paper colour chosen in the Paper panel (this browser only), applied before the first paint so it never flashes.
const paperBoot = `try{var p=localStorage.getItem(${JSON.stringify(PAPER_KEY)});if(p)document.documentElement.style.setProperty("--paper",p)}catch(e){}`;

export default function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${eb.variable} ${signature.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: paperBoot }} />
      </head>
      <body>
        {children}
        <PaperPanel always={process.env.NODE_ENV !== "production"} />
        <DownloadTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

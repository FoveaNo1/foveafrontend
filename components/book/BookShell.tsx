import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import DownloadTracker from "../landing/ui/DownloadTracker";
import { cormorant, eb, signature } from "../../lib/landing/fonts";
import ReturnWatch from "./ReturnWatch";

// The <html> of every page in the landing page's type (app/(landing)/layout.tsx).
export default function BookShell({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${cormorant.variable} ${eb.variable} ${signature.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        {children}
        <ReturnWatch />
        <DownloadTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

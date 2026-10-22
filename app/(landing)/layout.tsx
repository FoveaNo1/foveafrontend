import type { Metadata, Viewport } from "next";
import BookShell from "../../components/book/BookShell";
import { SITE_URL } from "../../lib/site-metadata";
import "./book.css";

// The landing page's own root layout ("the book", Oct 13): Cormorant Garamond for the few large lines, EB Garamond
// for the words, the system face for the smallest things; ink on warm paper. Every page is in it (Oct 21: signing in,
// checkout and the account moved in from app/(site), the earlier green design).
// The gradient landing this replaced is in landing/backups/2026-10-13-before-book-landing.tgz.

export const metadata: Metadata = {
  // the address the site is served at (hellofovea.com redirects here), so canonical links don't redirect
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  themeColor: "#F8F8F5",
  colorScheme: "light",
};

export default function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <BookShell lang="en">{children}</BookShell>;
}

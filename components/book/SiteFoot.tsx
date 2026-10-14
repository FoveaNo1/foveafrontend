import Link from "next/link";

// The quiet foot shared by every page in the landing page's type: where to read more, and how to reach us.
export default function SiteFoot() {
  return (
    <footer className="site-foot">
      <span>© 2026 Fovea</span>
      <Link href="/pricing">Pricing</Link>
      <Link href="/feedback">Feedback</Link>
      <Link href="/what-leaves-your-mac">What leaves your Mac</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
      <a href="mailto:hello@hellofovea.com">Contact</a>
    </footer>
  );
}

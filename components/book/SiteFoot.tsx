import Link from "next/link";
import { BookCopy } from "../../lib/landing/bookCopy";

// The quiet foot shared by every page in the landing page's type: where to read more, and how to reach us. Fovea
// Vision isn't in it (Oct 18, Yulun): its way in is beside "Download for Mac" under the film. Account (Oct 21): the
// way to sign in and to the plan and billing, as the earlier site's "Sign in" was (signed out, it asks first). Nov 8
// (Yulun: "remove pricing, we will go with free trial"): no Pricing.
export default function SiteFoot() {
  const f = BookCopy.foot;
  return (
    <footer className="site-foot">
      <span>© 2026 Fovea</span>
      <Link href="/account">{f.account}</Link>
      <Link href="/feedback">{f.feedback}</Link>
      <Link href="/what-leaves-your-mac">{f.leaves}</Link>
      <Link href="/privacy">{f.privacy}</Link>
      <Link href="/terms">{f.terms}</Link>
      <a href="mailto:hello@hellofovea.com">{f.contact}</a>
    </footer>
  );
}

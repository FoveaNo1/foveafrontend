import Link from "next/link";

// The quiet top of every page but the landing page: the name, which is the way back (Oct 20, Yulun: no "Back" link
// and no arrow; the browser has its own). Back on the landing page, the reader is where they left it
// (lib/landing/place.ts).
export default function TopBar() {
  return (
    <header className="gp-top" id="top">
      <Link className="name" href="/">Fovea</Link>
    </header>
  );
}

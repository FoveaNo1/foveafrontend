import Link from "next/link";

// The quiet top of every page but the landing page: the name, and the way back.
export default function TopBar({ back = "/", backLabel = "Back" }: { back?: string; backLabel?: string }) {
  return (
    <header className="gp-top" id="top">
      <Link className="name" href="/">Fovea</Link>
      <Link className="back" href={back}>{backLabel}</Link>
    </header>
  );
}

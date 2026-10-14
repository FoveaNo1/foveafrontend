import type { Metadata } from "next";
import Link from "next/link";
import "./(landing)/landing.css";

// The 404 for any URL no page matches. With two root layouts ((landing) and (site)) there is no
// top-level layout to draw it in, so it brings its own <html>, in the landing page's ink on paper.

export const metadata: Metadata = {
  title: "Not found · Fovea",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "0 var(--gutter)",
            textAlign: "center",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 500, letterSpacing: "-0.015em" }}>
              Nothing is here.
            </h1>
            <p style={{ margin: "14px 0 0", color: "var(--color-ink-2)" }}>
              <Link href="/" style={{ color: "inherit" }}>
                Back to Fovea
              </Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}

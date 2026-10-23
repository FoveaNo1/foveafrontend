import { LandingCopy, page, type PageId } from "../../lib/landing/copy";
import { DMG_URL } from "../../lib/download";
import { MarkPaths, MarkViewBox } from "./brand/loopMarkPaths";
import styles from "./page.module.css";

// The pill at the top of the card, the reference's: the mark, the pages, and Download in black.
// It stays at the top while the page moves under it.

/** `home`: where the page links point from another page ("/"), so "#today" becomes "/#today". */
export default function Nav({ home = "" }: { home?: string }) {
  return (
    <header className={styles.navWrap}>
      <nav className={styles.nav} aria-label={LandingCopy.nav.label}>
        <a href={`${home}#what`} className={styles.navMark} aria-label={LandingCopy.markLabel}>
          <svg viewBox={`0 0 ${MarkViewBox.width} ${MarkViewBox.height}`} aria-hidden>
            <path d={MarkPaths.loop} fill="#EFD993" />
            <path d={MarkPaths.loopDeep} fill="#ECCE6A" />
            <path d={MarkPaths.dot} fill="#EFD993" />
            <path d={MarkPaths.dotDeep} fill="#ECCE6A" />
          </svg>
        </a>
        <ul className={styles.navLinks}>
          {LandingCopy.nav.pages.map((id) => (
            <li key={id}>
              <a href={`${home}#${id}`}>{page(id as PageId).label}</a>
            </li>
          ))}
        </ul>
        <a className={styles.navDownload} href={DMG_URL} data-download="top">
          {LandingCopy.nav.download}
        </a>
      </nav>
    </header>
  );
}

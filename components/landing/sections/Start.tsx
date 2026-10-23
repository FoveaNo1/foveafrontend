import Link from "next/link";
import { LandingCopy, page } from "../../../lib/landing/copy";
import { DMG_URL, REQUIREMENTS } from "../../../lib/download";
import GradientCanvas from "../media/GradientCanvas";
import Reveal from "../motion/Reveal";
import Rise from "../motion/Rise";
import styles from "../page.module.css";

// Page 5: the last line on a picture of soft light, and Download. Then the foot.

const P = page("start");

export default function Start() {
  return (
    <>
      <section id="start" className={styles.closing} aria-labelledby="start-title">
        <GradientCanvas preset="closing" className={styles.canvas} />
        <div className={styles.closingInner}>
          <Reveal as="h2" id="start-title" className={styles.display} text={P.title} />
          <Rise after={0.3}>
            <div className={styles.buttons}>
              <a className={styles.buttonDark} href={DMG_URL} data-download="closing">
                {LandingCopy.download}
              </a>
            </div>
            <p className={styles.smallCenter}>{REQUIREMENTS}</p>
          </Rise>
        </div>
      </section>
      <footer className={styles.foot}>
        <span>{LandingCopy.footer.copyright}</span>
        <nav aria-label="Legal">
          <Link href={LandingCopy.leaves.href}>{LandingCopy.leaves.title}</Link>
          <Link href="/privacy">{LandingCopy.footer.privacy}</Link>
          <Link href="/terms">{LandingCopy.footer.terms}</Link>
          <a href={LandingCopy.footer.contactHref}>{LandingCopy.footer.contact}</a>
          <a href="#what">{LandingCopy.toTop}</a>
        </nav>
      </footer>
    </>
  );
}

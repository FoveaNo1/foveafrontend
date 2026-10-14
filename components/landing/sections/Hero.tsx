"use client";

import Link from "next/link";
import { useEffect } from "react";
import { blocks, LandingCopy, page } from "../../../lib/landing/copy";
import { DMG_URL, REQUIREMENTS } from "../../../lib/download";
import HeroNotch from "../HeroNotch";
import GradientCanvas from "../media/GradientCanvas";
import Reveal from "../motion/Reveal";
import Rise from "../motion/Rise";
import styles from "../page.module.css";

// Page 1, the reference's hero: the line large at the left, its second half in grey; at the right
// what it needs and the two buttons; under them the picture, a screen of moving light with the
// notch at its top.

const P = page("what");
const LEAD = blocks(P, "lead")[0];

export default function Hero() {
  useEffect(() => {
    (window as unknown as { __foveaReady?: boolean }).__foveaReady = true;
  }, []);
  return (
    <section id="what" className={styles.hero}>
      <div className={styles.heroHead}>
        <Reveal as="h1" className={styles.display} text={P.title} quiet={LEAD.text} quietClassName={styles.quiet} />
        <Rise className={styles.heroSide} after={0.35}>
          <p className={styles.small}>{REQUIREMENTS}</p>
          <div className={styles.buttons}>
            <a className={styles.buttonDark} href={DMG_URL} data-download="hero">
              {LandingCopy.download}
            </a>
            <Link className={styles.buttonLight} href={LandingCopy.leaves.href}>
              {LandingCopy.secondary}
            </Link>
          </div>
        </Rise>
      </div>
      <Rise className={styles.heroMedia} after={0.15}>
        <GradientCanvas preset="hero" className={styles.canvas} />
        <HeroNotch />
      </Rise>
    </section>
  );
}

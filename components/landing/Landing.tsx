import Nav from "./Nav";
import Hero from "./sections/Hero";
import Next from "./sections/Next";
import Start from "./sections/Start";
import Today from "./sections/Today";
import Why from "./sections/Why";
import styles from "./page.module.css";

// The landing page (Oct 10, after the reference Yulun picked): one white card on a light grey, a
// pill nav at its top, five parts on it. The design, its reference and how each motion is made:
// landing/README.md and landing/REFERENCES.md.

export default function Landing() {
  return (
    <div className={styles.frame}>
      <div className={styles.card}>
        <Nav />
        <main>
          <Hero />
          <Today />
          <Next />
          <Why />
          <Start />
        </main>
      </div>
    </div>
  );
}

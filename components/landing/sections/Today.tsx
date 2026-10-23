import Image from "next/image";
import { blocks, page } from "../../../lib/landing/copy";
import { MarkPaths, MarkViewBox } from "../brand/loopMarkPaths";
import GradientCanvas from "../media/GradientCanvas";
import Rise from "../motion/Rise";
import ScrollWords from "../motion/ScrollWords";
import styles from "../page.module.css";

// Page 2, the reference's statement: the title and its sentence as one large line, grey until you
// read down to it; then three columns: the promise, the agents it works with today (their icons in
// a row, as the reference stacks faces), and a small picture with the mark.

const P = page("today");

export default function Today() {
  const [say, why] = blocks(P, "p");
  const note = blocks(P, "note")[0];
  return (
    <section id="today" className={styles.section} aria-label={P.title}>
      <ScrollWords className={styles.statement} text={`${P.title} ${say.text}`} />
      <div className={styles.columns}>
        <Rise>
          <p className={styles.small}>{why.text}</p>
        </Rise>
        <Rise after={0.08}>
          <p className={styles.small}>{note.text}</p>
          <div className={styles.agents}>
            <Image src="/landing/agents/claude-code.png" alt="Claude Code" width={28} height={28} />
            <Image src="/landing/agents/codex.png" alt="Codex" width={28} height={28} />
          </div>
        </Rise>
        <Rise className={styles.cardMedia} after={0.16}>
          <GradientCanvas preset="card" className={styles.canvas} />
          <svg className={styles.cardMark} viewBox={`0 0 ${MarkViewBox.width} ${MarkViewBox.height}`} aria-hidden>
            <path d={MarkPaths.loop} />
            <path d={MarkPaths.dot} />
          </svg>
        </Rise>
      </div>
    </section>
  );
}

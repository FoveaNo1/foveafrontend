import { blocks, page } from "../../../lib/landing/copy";
import Reveal from "../motion/Reveal";
import ScrollWords from "../motion/ScrollWords";
import styles from "../page.module.css";

// Page 4: the line, then the paragraph as the reference's statement, grey until you read down to it,
// and the last sentence quietly under it.

const P = page("context");

export default function Why() {
  const [context, next] = blocks(P, "p");
  return (
    <section id="context" className={styles.section} aria-labelledby="context-title">
      <Reveal as="h2" id="context-title" className={styles.display} text={P.title} />
      <ScrollWords className={`${styles.statement} ${styles.statementAfter}`} text={context.text} />
      <Reveal className={styles.closingLine} text={next.text} />
    </section>
  );
}

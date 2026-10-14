import { blocks, page } from "../../../lib/landing/copy";
import Reveal from "../motion/Reveal";
import Rise from "../motion/Rise";
import styles from "../page.module.css";

// Page 3: the line large at the left, then what comes next in four short columns, numbered.

const P = page("next");

export default function Next() {
  const items = blocks(P, "list")[0].items;
  return (
    <section id="next" className={styles.section} aria-labelledby="next-title">
      <Reveal as="h2" id="next-title" className={styles.display} text={P.title} />
      <ol className={styles.items}>
        {items.map((item, i) => (
          <li key={item.term}>
            <Rise after={0.06 * i}>
              <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
              <p className={styles.term}>{item.term.replace(/\.$/, "")}</p>
              <p className={styles.small}>{item.text}</p>
            </Rise>
          </li>
        ))}
      </ol>
    </section>
  );
}

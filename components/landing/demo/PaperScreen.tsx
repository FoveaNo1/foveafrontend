import BrowserWindow from "./BrowserWindow";
import styles from "./paper.module.css";

// A formula you don't follow: notes on attention, the formula in the middle of the page.

export default function PaperScreen() {
  return (
    <BrowserWindow url="notes.example/attention" frame={{ x: 210, y: 92, width: 1050, height: 720 }}>
      <article className={styles.paper}>
        <p className={styles.kicker}>Reading notes · Chapter 3</p>
        <h1 className={styles.title}>Attention, step by step</h1>
        <p className={styles.body}>
          Every word in a sentence asks a question of every other word, and how much it listens to each answer decides
          what it becomes in the next layer. The whole of it fits in one line:
        </p>
        <div className={styles.formula} data-target="formula">
          <span>Attention(</span>
          <i>Q</i>, <i>K</i>, <i>V</i>
          <span>) = softmax</span>
          <span className={styles.paren}>(</span>
          <span className={styles.frac}>
            <span>
              <i>QK</i>
              <sup>T</sup>
            </span>
            <span className={styles.den}>
              √<i>d</i>
              <sub>k</sub>
            </span>
          </span>
          <span className={styles.paren}>)</span>
          <i>V</i>
        </div>
        <p className={styles.body}>
          Q, K and V are the same words seen three ways: as questions, as what they offer to be found by, and as what they
          carry. The rest of this chapter takes the line apart, one piece at a time.
        </p>
      </article>
    </BrowserWindow>
  );
}

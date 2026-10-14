import Image from "next/image";
import styles from "./fieldNotes.module.css";

// The page the layout-bug scenario fixes: a small trail site on localhost, three cards in a row.
// The middle card's button sits 7 pt low and is padded wider than the other two; when the agent's
// change lands, it eases into line. Elements a capture can take carry data-target.

export const TRAILS = [
  { id: "ridge", title: "Ridge loop", meta: "6.2 mi · 4 h · Moderate", photo: "/landing/photos/mountain.jpg" },
  { id: "lake", title: "Lake basin", meta: "9.8 mi · 6 h · Long day", photo: "/landing/photos/forest.jpg" },
  { id: "tower", title: "Old tower trail", meta: "3.1 mi · 2 h · Easy", photo: "/landing/photos/building.jpg" },
] as const;

type Props = {
  /** The agent's change has landed: the middle button lines up. */
  fixed?: boolean;
};

export default function FieldNotesPage({ fixed = false }: Props) {
  return (
    <div className={styles.site}>
      <header className={styles.nav}>
        <span className={styles.logo}>Field Notes</span>
        <nav className={styles.links}>
          <span className={styles.current}>Trails</span>
          <span>Weather</span>
          <span>Journal</span>
        </nav>
      </header>
      <h1 className={styles.heading}>Trails this week</h1>
      <p className={styles.lede}>Three walks for the first cold weekend, with maps you can print.</p>
      <div className={styles.cards}>
        {TRAILS.map((trail, i) => {
          const off = i === 1 && !fixed;
          return (
            <article key={trail.id} className={styles.card} data-target={`card-${trail.id}`}>
              <div className={styles.photo}>
                <Image src={trail.photo} alt="" fill sizes="280px" />
              </div>
              <h2 className={styles.title}>{trail.title}</h2>
              <p className={styles.meta}>{trail.meta}</p>
              <span
                className={`${styles.button} ${off ? styles.off : ""}`}
                data-target={`button-${trail.id}`}
              >
                Get the map
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}

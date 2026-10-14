import { Display } from "../../../lib/landing/tokens";
import type { Rect, ScenarioId } from "../../../lib/landing/engine/types";
import ScreenPicture from "./ScreenPicture";
import styles from "./demo.module.css";

// A referent's picture: the part of the screen it took, filling a card of the given size (cover,
// centred), drawn from the screen's own picture as it was when taken (its scenario and tab).

type Props = {
  rect: Rect;
  width: number;
  height: number;
  scenario?: ScenarioId;
  tab?: number;
};

export default function Thumb({ rect, width, height, scenario, tab }: Props) {
  const k = Math.max(width / rect.width, height / rect.height);
  const dx = (width - rect.width * k) / 2 - rect.x * k;
  const dy = (height - rect.height * k) / 2 - rect.y * k;
  return (
    <span className={styles.thumb} style={{ width, height }} data-picture aria-hidden>
      <span
        className={styles.thumbScreen}
        style={{ width: Display.width, height: Display.height, transform: `translate(${dx}px, ${dy}px) scale(${k})` }}
      >
        <ScreenPicture scenario={scenario} tab={tab} />
      </span>
    </span>
  );
}

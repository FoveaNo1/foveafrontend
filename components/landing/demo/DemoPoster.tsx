import Island from "../island/Island";
import ChooseChat from "../island/content/ChooseChat";
import MacStage from "./MacStage";
import ScreenPicture from "./ScreenPicture";
import styles from "./demo.module.css";
import thumbs from "./thumbs.module.css";
import { V2, Island as I } from "../../../lib/landing/tokens";

// The demo's first picture, drawn on the server: the layout-bug scenario at Choose chat, the two
// buttons taken, the words bound to them. It is what shows before the live demo loads, without
// scripts, and under Reduce Motion before a step is chosen.

export default function DemoPoster({ label }: { label: string }) {
  return (
    <MacStage label={label}>
      <ScreenPicture />
      <div className={styles.islandSlot}>
        <Island width={V2.width} topRadius={I.openTopRadius} bottomRadius={V2.bottomRadius}>
          <ChooseChat
            request={[
              "Make ",
              { text: "this one", referents: [1] },
              " line up with ",
              { text: "that one", referents: [2] },
              ".",
            ]}
            referents={[<ButtonThumb key="1" off />, <ButtonThumb key="2" />]}
            chat={{ name: "Trail cards line up", agent: "claude-code" }}
            suggestions={[
              { name: "Trail cards line up", agent: "claude-code", chosen: true },
              { name: "Field Notes site", agent: "codex" },
              { name: "New chat", agent: "claude-code" },
            ]}
          />
        </Island>
      </div>
    </MacStage>
  );
}

/** A referent's picture: the card's foot with its button, as captured. */
export function ButtonThumb({ off = false }: { off?: boolean }) {
  return (
    <span className={thumbs.card}>
      <span className={thumbs.line} />
      <span className={thumbs.lineShort} />
      <span className={`${thumbs.button} ${off ? thumbs.off : ""}`}>Get the map</span>
    </span>
  );
}

import type { ScenarioId } from "../../../lib/landing/engine/types";
import { scenario as scenarioFor } from "../../../lib/landing/scenarios";
import BrowserWindow from "./BrowserWindow";
import FieldNotesPage from "./FieldNotesPage";
import { Dock, MenuBar, Wallpaper } from "./MockMac";
import PaperScreen from "./PaperScreen";
import WeeklyScreen from "./WeeklyScreen";

// What's on the mock screen under the island: the wallpaper, the menu bar, the scenario's windows,
// the Dock. Drawn once for the screen and again, small, for each referent's picture (a re-render
// rather than a copy of the page, so the pictures stay sharp).

export const BROWSER_FRAME = { x: 210, y: 92, width: 1050, height: 720 };

type Props = {
  scenario?: ScenarioId;
  tab?: number;
  landed?: boolean;
  onTab?: (index: number) => void;
};

export default function ScreenPicture({ scenario = "layoutBug", tab = 0, landed = false, onTab }: Props) {
  const screen = scenarioFor(scenario).screen;
  return (
    <>
      <Wallpaper />
      <MenuBar app={screen === "weekly" ? "Chat" : "Safari"} />
      {screen === "fieldNotes" && (
        <BrowserWindow url="localhost:3000/trails" frame={BROWSER_FRAME}>
          <FieldNotesPage fixed={landed} />
        </BrowserWindow>
      )}
      {screen === "weekly" && <WeeklyScreen tab={tab} landed={landed} onTab={onTab} />}
      {screen === "paper" && <PaperScreen />}
      <Dock />
    </>
  );
}

import { DMG_URL, REQUIREMENTS } from "../../../lib/download";
import styles from "./ui.module.css";

// Download for Mac, and what it needs under it: the one button on the page, an ink pill with ivory
// words (Macula's pill), and in the dark the other way round.

type Props = {
  label: string;
  /** Where on the page, for analytics. */
  location: "hero" | "closing";
  tone?: "light" | "dark";
  showRequirements?: boolean;
};

export default function DownloadButton({ label, location, tone = "light", showRequirements = true }: Props) {
  return (
    <div className={styles.downloadBlock} data-tone={tone}>
      <a className={styles.download} href={DMG_URL} data-download={location}>
        <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden>
          <path d="M8 2.5v8M4.5 7.2L8 10.7l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {label}
      </a>
      {showRequirements && <p className={styles.requirements}>{REQUIREMENTS}</p>}
    </div>
  );
}

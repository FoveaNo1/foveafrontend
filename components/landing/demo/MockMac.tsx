import Image from "next/image";
import styles from "./demo.module.css";

// The mock desktop's furniture, after the Workbench's MockDesktop and the onboarding's lid: the
// wallpaper (the onboarding's coast), a menu bar of material with the notch cut out of its middle,
// and a Dock. No Apple logo and no Apple app icons: the Dock holds plain glyphs.

export function Wallpaper() {
  return (
    <Image
      className={styles.wallpaper}
      src="/landing/photos/coast.jpg"
      alt=""
      fill
      sizes="(min-width: 1280px) 1240px, 100vw"
      loading="eager"
    />
  );
}

export function MenuBar({ app = "Safari", items = ["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"] }: { app?: string; items?: string[] }) {
  return (
    <div className={styles.menuBar} aria-hidden>
      <div className={styles.menuLeft}>
        <span className={styles.menuApp}>{app}</span>
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className={styles.menuRight}>
        <WifiGlyph />
        <BatteryGlyph />
        <SearchGlyph />
        <ControlsGlyph />
        <span className={styles.clock}>Thu Oct 9&nbsp;&nbsp;9:41 AM</span>
      </div>
    </div>
  );
}

const DOCK = [
  { id: "files", color: "#3B82F6", glyph: "files" },
  { id: "browser", color: "#0EA5E9", glyph: "compass" },
  { id: "messages", color: "#22C55E", glyph: "bubble" },
  { id: "mail", color: "#60A5FA", glyph: "mail" },
  { id: "notes", color: "#FACC15", glyph: "lines" },
  { id: "terminal", color: "#1F2937", glyph: "prompt" },
  { id: "settings", color: "#9CA3AF", glyph: "gear" },
] as const;

export function Dock() {
  return (
    <div className={styles.dock} aria-hidden>
      {DOCK.map((app) => (
        <span key={app.id} className={styles.dockIcon} style={{ background: app.color }}>
          <DockGlyph kind={app.glyph} />
        </span>
      ))}
    </div>
  );
}

function DockGlyph({ kind }: { kind: (typeof DOCK)[number]["glyph"] }) {
  const common = { fill: "none", stroke: "#fff", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "files":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22"><path {...common} d="M3.5 7.5h6l2 2h9v9a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" /></svg>
      );
    case "compass":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22"><circle {...common} cx="12" cy="12" r="8.5" /><path {...common} d="M15.5 8.5l-2 5-5 2 2-5z" /></svg>
      );
    case "bubble":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22"><path {...common} d="M4 11.5c0-4 3.6-7 8-7s8 3 8 7-3.6 7-8 7c-1 0-2-.1-2.9-.4L5 19.5l1.2-3.4C4.8 14.9 4 13.3 4 11.5z" /></svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22"><rect {...common} x="3.5" y="6" width="17" height="12" rx="1.5" /><path {...common} d="M4 7l8 6 8-6" /></svg>
      );
    case "lines":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22"><path {...common} stroke="#7C5E00" d="M6 8h12M6 12h12M6 16h8" /></svg>
      );
    case "prompt":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22"><path {...common} d="M6 8l4 4-4 4M12 16h6" /></svg>
      );
    case "gear":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22"><circle {...common} cx="12" cy="12" r="3" /><path {...common} d="M12 3.5v2.5M12 18v2.5M3.5 12H6M18 12h2.5M6 6l1.8 1.8M16.2 16.2L18 18M6 18l1.8-1.8M16.2 7.8L18 6" /></svg>
      );
  }
}

function WifiGlyph() {
  return (
    <svg viewBox="0 0 16 12" width="16" height="12" aria-hidden>
      <path d="M8 11.2l1.6-1.9a2.4 2.4 0 0 0-3.2 0z" fill="currentColor" />
      <path d="M3.3 6.6a6.8 6.8 0 0 1 9.4 0M5.2 8.5a4.1 4.1 0 0 1 5.6 0M1.3 4.6a9.7 9.7 0 0 1 13.4 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg viewBox="0 0 26 12" width="25" height="12" aria-hidden>
      <rect x="0.75" y="0.75" width="21" height="10.5" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
      <rect x="2.5" y="2.5" width="15" height="7" rx="1.6" fill="currentColor" />
      <path d="M23.6 4.2v3.6c.8-.3 1.3-1 1.3-1.8s-.5-1.5-1.3-1.8z" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden>
      <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.3 9.3l3.4 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ControlsGlyph() {
  return (
    <svg viewBox="0 0 16 14" width="16" height="14" aria-hidden>
      <rect x="0.8" y="1" width="14.4" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12.6" cy="3.5" r="1.4" fill="currentColor" />
      <rect x="0.8" y="8" width="14.4" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="3.4" cy="10.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

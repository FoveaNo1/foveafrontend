import type { CSSProperties, ReactNode } from "react";
import styles from "./demo.module.css";

// A browser window on the mock desktop: its toolbar (the window's buttons, back and forward, the
// address) over a page, and its tabs when it has more than one. Placed in screen points.

type Tab = { title: string; target: string };

type Props = {
  url: string;
  frame: { x: number; y: number; width: number; height: number };
  children: ReactNode;
  style?: CSSProperties;
  tabs?: Tab[];
  activeTab?: number;
  /** Try mode: a click on a tab switches to it. */
  onTab?: (index: number) => void;
};

export default function BrowserWindow({ url, frame, children, style, tabs, activeTab = 0, onTab }: Props) {
  return (
    <div className={styles.window} style={{ left: frame.x, top: frame.y, width: frame.width, height: frame.height, ...style }}>
      <div className={styles.toolbar}>
        <span className={styles.lights} aria-hidden>
          <i style={{ background: "#FF5F57" }} />
          <i style={{ background: "#FEBC2E" }} />
          <i style={{ background: "#28C840" }} />
        </span>
        <span className={styles.navGlyphs} aria-hidden>
          <svg viewBox="0 0 16 16" width="16" height="16"><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <svg viewBox="0 0 16 16" width="16" height="16" style={{ opacity: 0.35 }}><path d="M6 3.5L10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <span className={styles.address}>
          <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden><path d="M3.5 5V3.8a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" strokeWidth="1.2" /><rect x="2.5" y="5" width="7" height="5.5" rx="1.2" fill="currentColor" /></svg>
          {url}
        </span>
      </div>
      {tabs && (
        <div className={styles.tabs}>
          {tabs.map((tab, i) => (
            <span
              key={tab.target}
              className={`${styles.tab} ${i === activeTab ? styles.tabActive : ""}`}
              data-target={tab.target}
              onPointerDown={
                onTab
                  ? (e) => {
                      e.stopPropagation();
                      onTab(i);
                    }
                  : undefined
              }
            >
              {tab.title}
            </span>
          ))}
        </div>
      )}
      <div className={styles.page}>{children}</div>
    </div>
  );
}

import BrowserWindow from "./BrowserWindow";
import FieldNotesPage from "./FieldNotesPage";
import styles from "./weekly.module.css";

// This week's update: a chat with Maya (her ask and her signups chart) beside a browser with the
// project's merged pull requests and this week's support tickets, each a tab. When the draft is
// written it lands on the desktop as weekly-update.md.

export const WEEKLY_TABS = [
  { title: "Field Notes", target: "tab-home" },
  { title: "Merged pull requests", target: "tab-prs" },
  { title: "Support · This week", target: "tab-support" },
];

const PRS = [
  { title: "Trail cards line up", n: 212, who: "jamie", when: "2 days ago" },
  { title: "Cache map tiles for a day", n: 209, who: "ana", when: "3 days ago" },
  { title: "Offline maps, first pass", n: 205, who: "ryan", when: "4 days ago" },
  { title: "Fix the sign-in redirect loop", n: 201, who: "ana", when: "5 days ago" },
];

const TICKETS = [
  { title: "Offline maps don't load in the tunnel", open: true },
  { title: "Can't save a trail without signal", open: true },
  { title: "Sign-in loops on Safari", open: false },
  { title: "Map tiles slow on 3G", open: false },
  { title: "Typo on the Lake basin page", open: false },
  { title: "Dark mode, please", open: false },
];

const SIGNUPS = [42, 38, 51, 47, 63, 71, 78];

export function ChatWindow() {
  return (
    <div className={styles.chat} style={{ left: 64, top: 88, width: 560, height: 640 }}>
      <div className={styles.chatHead}>
        <span className={styles.lights} aria-hidden>
          <i style={{ background: "#FF5F57" }} />
          <i style={{ background: "#FEBC2E" }} />
          <i style={{ background: "#28C840" }} />
        </span>
        <span className={styles.avatar}>M</span>
        <span className={styles.name}>Maya Chen</span>
      </div>
      <div className={styles.thread}>
        <p className={styles.them}>Can you send this week&apos;s update before 4? Here&apos;s how signups went.</p>
        <div className={`${styles.them} ${styles.chartBubble}`}>
          <span className={styles.chartTitle}>
            Signups, this week <b>+18 %</b>
          </span>
          <span className={styles.chart}>
            {SIGNUPS.map((v, i) => (
              <i key={i} style={{ height: `${(v / 80) * 100}%` }} />
            ))}
          </span>
          <span className={styles.days}>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </span>
        </div>
        <p className={styles.me}>On it.</p>
      </div>
    </div>
  );
}

function PullRequests() {
  return (
    <div className={styles.repo}>
      <p className={styles.crumb}>field-notes / Pull requests</p>
      <h1 className={styles.repoTitle}>Merged this week</h1>
      <ul className={styles.list} data-target="pr-list">
        {PRS.map((pr) => (
          <li key={pr.n}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
              <circle cx="4.5" cy="3.5" r="1.8" fill="none" stroke="#8250df" strokeWidth="1.6" />
              <circle cx="4.5" cy="12.5" r="1.8" fill="none" stroke="#8250df" strokeWidth="1.6" />
              <circle cx="11.5" cy="12.5" r="1.8" fill="none" stroke="#8250df" strokeWidth="1.6" />
              <path d="M4.5 5.3v5.4M4.5 5.5c0 3 7 2 7 5.2" fill="none" stroke="#8250df" strokeWidth="1.6" />
            </svg>
            <span>
              <b>{pr.title}</b>
              <small>
                #{pr.n} · merged {pr.when} by {pr.who}
              </small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Support() {
  return (
    <div className={styles.repo}>
      <p className={styles.crumb}>Support</p>
      <h1 className={styles.repoTitle}>This week</h1>
      <ul className={styles.list} data-target="ticket-list">
        {TICKETS.map((t) => (
          <li key={t.title}>
            <span className={`${styles.status} ${t.open ? styles.open : ""}`}>{t.open ? "Open" : "Closed"}</span>
            <span>
              <b>{t.title}</b>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WeeklyScreen({ tab, landed, onTab }: { tab: number; landed: boolean; onTab?: (index: number) => void }) {
  return (
    <>
      <ChatWindow />
      <BrowserWindow
        url={["localhost:3000", "code.example/field-notes/pulls", "help.example/inbox"][tab] ?? "localhost:3000"}
        frame={{ x: 660, y: 112, width: 746, height: 680 }}
        tabs={WEEKLY_TABS}
        activeTab={tab}
        onTab={onTab}
      >
        {tab === 0 && <FieldNotesPage fixed />}
        {tab === 1 && <PullRequests />}
        {tab === 2 && <Support />}
      </BrowserWindow>
      {landed && (
        <span className={styles.file} aria-hidden>
          <svg viewBox="0 0 40 48" width="40" height="48">
            <path d="M4 2h22l10 10v32a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#fff" stroke="rgb(0 0 0 / 0.18)" />
            <path d="M26 2v8a2 2 0 0 0 2 2h8" fill="none" stroke="rgb(0 0 0 / 0.18)" />
            <text x="19" y="34" textAnchor="middle" fontSize="9" fontWeight="700" fill="#555" fontFamily="system-ui">MD</text>
          </svg>
          weekly-update.md
        </span>
      )}
    </>
  );
}

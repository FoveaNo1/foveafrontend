// /download/beta, in the landing page's type (Oct 21): the three beta apps for invited users, word for word as the
// earlier BetaDownloadPageContent had them (Aug 5). Each is a plain link to its DMG on updates.hellofovea.com;
// the app itself asks for the invited email.

const Apps = [
  { name: "Fovea Beta", role: "Main app", description: "The main Fovea app for voice input, screen capture, Quick Q&A, and Memory.", requirement: "macOS 14+ · Apple Silicon", button: "Download Fovea Beta", href: "https://updates.hellofovea.com/beta/fovea-mac/releases/latest.dmg", track: "beta-mac" },
  { name: "FoveaGaze", role: "Eye-tracking companion", description: "Adds gaze input and calibration to Fovea. Install it with Fovea Beta for Eye Tracking.", requirement: "Apple Silicon", button: "Download FoveaGaze", href: "https://updates.hellofovea.com/beta/fovea-gaze/releases/latest.dmg", track: "beta-gaze" },
  { name: "FoveaGazeCollect", role: "Data collection", description: "A separate app for invited participants to record and upload gaze data for model improvement.", requirement: "Apple Silicon", button: "Download GazeCollect", href: "https://updates.hellofovea.com/beta/fovea-gaze-collect/releases/latest.dmg", track: "beta-gaze-collect" },
] as const;

export default function BetaDownloads() {
  return (
    <main className="text-page acct">
      <h1 className="rise">Choose your Fovea app.</h1>
      <p className="rise" style={{ ["--i" as string]: 1 }}>Currently available to invited users only. When prompted, use the email address that received your invitation.</p>
      <ul className="acct-apps" role="list">
        {Apps.map((a) => (
          <li key={a.name}>
            <p className="acct-label">{a.role}</p>
            <h2>{a.name}</h2>
            <p>{a.description}</p>
            <p className="acct-go"><a className="act-line small down" href={a.href} data-download={a.track}>{a.button} <span className="ar" aria-hidden="true">↓</span></a></p>
            <p className="req">Latest beta · {a.requirement}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

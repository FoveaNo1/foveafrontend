import Link from "next/link";
import { REQUIREMENTS } from "../../lib/download";
import { Pictures, sized } from "../../lib/landing/book";
import Room from "./Room";
import SiteFoot from "./SiteFoot";

// Fovea's landing page, "the book" (Oct 13): a title page facing the hall, whose light comes on when you reach it;
// then three short sections in one reading column, numbered in the margin; then the last line and the way in.
// The copy is Yulun's, unchanged. Design and research: landing/research/drafts (draft-2.html).

const HALL_SIZE = [Pictures.hall.width, Pictures.hall.height] as const;

export default function Landing() {
  return (
    <main>
      <section className="lp-front">
        <div className="lp-title">
          <p className="name rise">Fovea</p>
          <div>
            <h1 className="display rise" style={{ ["--i" as string]: 1 }}>
              Talk to your agents from the notch. <span className="soft">Just for now.</span>
            </h1>
            <p className="lp-dl rise" style={{ ["--i" as string]: 2 }}>
              <Link href="/download" data-download="hero">Download for Mac</Link>
              <span>{REQUIREMENTS}</span>
            </p>
          </div>
        </div>
        <Room src={sized(Pictures.hall.src, 1000)} alt={Pictures.hall.alt} sun={Pictures.hall.sun} size={HALL_SIZE} pos="50% 0%" lightsPage />
      </section>

      <div className="lp-page">
        <p className="lp-num">1</p>
        <div className="lp-main">
          <h2 className="lead">Fovea starts in your workspace.</h2>
          <p>Just your voice, and soon, your eyes, and tasks automatically assigned to the chat it belongs to. Look at it, say it, and get it done.</p>
          <p>No tab switching. No manual re-explaining, copying, and pasting.</p>
          <figure className="lp-fig">
            {/* eslint-disable-next-line @next/next/no-img-element -- a stand-in hotlinked picture (lib/landing/book.ts) */}
            <img src={sized(Pictures.dancer.src, 800)} alt={Pictures.dancer.alt} loading="lazy" />
          </figure>
        </div>

        <p className="lp-num">2</p>
        <div className="lp-main">
          <h2 className="lead">Then any device. Then anywhere.</h2>
          <p className="lp-para">
            <span className="run"><b>Fovea Bar.</b> A small bar that attaches to any computer, a laptop, a desktop or a tablet. All your gaze tracking data stay local.</span>
            <span className="run"><b>Then, something you wear.</b> Small and light enough to sit on whatever you already wear. We’re not making another pair of glasses, a necklace or a ring: whatever you choose, Fovea attaches to it, almost unnoticed.</span>
            <span className="run"><b>Input, not another screen.</b> Others are building better displays. Fovea builds the way in: where you look, what you say, and what’s worth keeping.</span>
            <span className="run"><b>From anywhere.</b> Your agents, and the devices around you, a sentence away wherever you are.</span>
          </p>
        </div>

        <p className="lp-num">3</p>
        <div className="lp-main lp-why">
          <h2 className="ttl">What personal agents are missing is you.</h2>
          <p>
            What stands between us and agents that are truly personal isn’t how smart they are. <span className="ctx">It’s context.</span> An agent can’t know you until it has been through the day with you:{" "}
            <span className="steps">
              <span>what you saw,</span>
              <span>what you heard,</span>
              <span>what you said,</span>
              <span>how you actually felt,</span>
              <span>and what you actually liked.</span>
            </span>
          </p>
          <p className="coda">Fovea starts at your desk, and truly personal agents come closer with everything we build next.</p>
        </div>

        <div className="lp-main lp-last">
          <h2 className="display">Today, the notch. Next, everything you look at.</h2>
          <p className="lp-dl">
            <Link href="/download" data-download="closing">Download for Mac</Link>
            <span>{REQUIREMENTS}</span>
          </p>
        </div>
      </div>

      <SiteFoot />
    </main>
  );
}

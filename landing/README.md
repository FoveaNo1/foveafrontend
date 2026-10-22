# Fovea: the landing page

## Accounts, payments and going live (Oct 21)

What the site talks to, and how it reaches www.hellofovea.com. Signing in, checkout and the account were the
earlier green pages (`app/(site)`, Sep 5); they are now in the landing page's type (`app/(landing)`,
`components/book/account`, `lib/account.ts`) with the same logic and the same addresses.

- **Signing in** is Supabase's (email link, Google, Apple), in the browser (`lib/supabase-browser.ts`); an account is
  made on first sign-in. Supabase's redirect allow-list must hold `https://www.hellofovea.com/auth/callback` (and
  `http://localhost:3000/auth/callback` to work locally).
- **Paying** is the Fovea backend's, which owns Stripe (Go, `hellofovea/fovea-backend-legacy`, https://api.hellofovea.com;
  the site holds no Stripe key):
  - `POST /api/billing/checkout {billingCycle: "yearly" | "monthly"}` makes a Stripe Checkout session. The payment
    panel (`CheckoutSheet`, on /download and /pricing) and /checkout go there, or to sign-in first.
  - Stripe sends people back to the backend's `STRIPE_SUCCESS_URL` (`/checkout/success?session_id={CHECKOUT_SESSION_ID}`)
    or `STRIPE_CANCEL_URL` (`/checkout?canceled=1`). The success page asks `GET /api/billing/checkout/status` until Pro
    is on, then opens the welcome (no founding number: nothing keeps one yet).
  - `POST /api/billing/portal` opens Stripe's Customer Portal (card, cancelling, invoices), which returns to `/account`;
    `GET /api/billing/status` gives the account page its plan and use.
  - The prices shown (`Prices` in `lib/landing/book.ts`, `Plans.tsx`, /pricing) must match the backend's
    `STRIPE_PRICE_PRO_YEARLY` ($108) and `STRIPE_PRICE_PRO_MONTHLY` ($20).
  - The backend answers browsers only from its CORS list: www.hellofovea.com, hellofovea.com, localhost:3000 and :3001
    (more through its `CORS_ALLOWED_ORIGINS`). Vercel's preview links can't pay or show an account: try those on
    localhost or the live domain.
- **Feedback** posts to `/api/feedback` → Supabase `feedback` (publishable key); without its settings a deployed site
  now answers 503 instead of dropping it. **Hear about it first** (/vision, part 2; the earlier site's hardware
  waitlist) posts to `/api/interest` → `lead_interests`: run `supabase/migrations/20261010000000_lead_interests.sql`
  once in Supabase's SQL editor. `/api/subscribe` (the waitlist, `leads`) is kept for the earlier forms.
- **Settings** (Vercel project `foveafrontend`, team foveadevops; already set for the live site): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `WAITLIST_PROFILE_SECRET`,
  `NEXT_PUBLIC_FOVEA_API_BASE_URL` (https://api.hellofovea.com). Locally, `.env.local` (not committed) holds the public
  three; with them, feedback sent from localhost goes to the live table.
- **Going live:** Vercel builds every push to GitHub (FoveaNo1/foveafrontend) as a preview; the live site is built from
  the branch **`landing/point-and-tell`** (its production branch since September), not `main`. So a merge into
  `landing/point-and-tell` publishes www.hellofovea.com (DNS on Cloudflare; hellofovea.com redirects to www). To undo:
  Vercel → Deployments → promote the previous one. Later, merge into `main` and make `main` the production branch in
  Vercel's settings again (PR #7 is open for that).
- **Still open before launch:** the stand-in pictures (`lib/landing/book.ts`, `lib/landing/pictures.ts`: hotlinked,
  not ours to publish); the legal text's review by a lawyer (`lib/landing/legal.ts`); whether founding members get
  numbers (the server would have to give them out); the FAQ's "Team plans support invoicing" (there is no team plan).

## Now (Oct 18): the sea, full screen; the app's own notch

`/` opens on a Mac's desktop filling the first screen, the sea its picture: Yulun's pick (P7 with B, "On the desktop",
the full-screen one) from round three (`landing/research/hero-round3-oct17.html`). Before it: six first screens
(`hero-transitions-oct17.html`), the notch chosen, the dancer tried with it (`hero-picture-oct17.html`).

- **`/`** is in `components/book/Landing.tsx` (`OnDesktop` in `heroes/Desktop.tsx`, with `picture("sea")`):
  - **The first screen**: the sea covers it; along its top the Mac's menu bar, the notch in the middle and the page's
    own "Fovea" and "Download for Mac" in it, in EB Garamond's italic as the film's key captions are (Oct 18); the line
    ("Stay in your window. / Talk to any agent from the notch.", `BookCopy.hero`) in white at its foot, under the
    horizon, and under the line the way in (Oct 20, Yulun: was the download obvious enough to others? The menu bar's
    read as part of the picture): the download page's "Download for Mac", with an arrow as it leads to `/download`, and
    "macOS 14 or later · Apple silicon · Free to start" under it (`FootAct` in `heroes/shared.tsx`); it hangs from the
    line, which keeps its place, and fades with it. On arrival Fovea does what it does, once, as the app does it
    (`lib/landing/film/hero.ts`, drawn by `heroes/HeroDesk.tsx` with the film's own island, keys, words, styles and
    renderer, so the notch is the film's and the app's): fn ⌃ opens the voice bar; ⌘ ⌘ takes the whole screen (a flash, a picture of what the screen shows
    lifting from it inset 40 pt and flying into the bar); "The future of human agent interaction is here." (Yulun's
    words) is said, as subtitles; fn ⌃ again, Transcribing; Choose chat with "Landing page" (Claude Code) already
    picked; Return; the board shows it at work for 3 s; the notch closes. About 13 s. Each key shows as the film shows
    it. Nothing glows under the notch (Oct 18: the rainbow went from every hand-over and from the film's voice bar).
    The clock runs only while the page is in front, from when the picture has loaded; under Reduce Motion one still
    (the session on the board). On a phone the island leans in so it can be read, and the top bar steps aside while
    Choose chat or the board is open.
  - **Scrolling**, the stage is held (`Pin.tsx`) while the notch grows into the film's frame (the hand-over chosen on
    Oct 17, now with no glow), the picture gives way to the paper, and the film plays from its first screen; the top
    bar stays, as the page's.
  - **The film** (`components/book/InlineFilm.tsx`), Yulun's rule (Oct 17): it starts at its first screen every time it
    comes into view; leaving it (scrolling away, another tab, another app) pauses it; coming back to the page resumes
    it, unless the reader paused it or it had ended. It plays once and stops on its last frame with a replay mark; a
    click pauses and plays, and after the end plays it again from the start. Under it only a bar in its three parts
    (Today, Soon, Next), draggable; no button, no times.
  - **Under it** "Download for Mac" and, beside it, "Learn about Fovea’s vision" (Oct 18), underlined words like the
    others (`After` in `heroes/shared.tsx`); then the foot.
  - **Coming back** (Oct 20, Yulun): back on `/` from another page, by "Fovea" at its top, any link home or the
    browser's Back, the reader is where they left it, not on the first screen: as far down, the first screen's scene at
    the moment it had reached, the film playing on from where it was, or held there paused or ended
    (`lib/landing/place.ts`, kept in sessionStorage for the tab's life; `components/book/ReturnWatch.tsx` says when a
    return is coming; `tests/landing/place.test.mjs`). A fresh visit, a reload or a link to `/#…` opens as before.
- **`/vision`, Fovea Vision**, beside the download under the film (Oct 18: not in the foot): the whole book, set as it was
  on the front page (`VisionBody` in `BookBody.tsx`): 1, "Fovea starts in your workspace." with the line on the eyes
  and the dancer back under it (Oct 18; a stand-in, `lib/landing/book.ts`); 2, "Then any
  device. Then anywhere." with its four parts; 3, "What personal agents are missing is you."; then "Today, the notch.
  Next, everything you look at." and Download.
- **`/hero`** (not linked, not indexed): the first screens under review, newest first.
  - **Round three, pointed at** (`ROUND3` in `lib/landing/heroes.ts`):
    - A, `/hero/screen`, Into the screen (after Mercury): a photograph of a laptop in a room, the film's first screen
      laid onto its screen by a homography (`lib/landing/quad.ts`, CSS `matrix3d`), so it stays sharp and true;
      scrolling, the camera moves in until the screen is the film's frame (`heroes/Screen.tsx`).
    - B, `/hero/desktop`, On the desktop (after Perplexity's Personal Computer): what `/` is now, with any picture.
    - C, `/hero/framed`, In the frame: the same desktop framed on the paper under the line; the film takes its place.
    - `?p=` picks a picture, `?t=` holds B's and C's scene at that second (for stills).
  - The notch with the dancer three ways (`/hero/notch-wallpaper`, `-plate`, `-pointed`), and round one's six.
- **The pictures are stand-ins** found on Cosmos and hotlinked: `lib/landing/pictures.ts` (five laptops for A, sixteen
  pictures for B and C, each with its Cosmos page) and the dancer (`lib/landing/book.ts`). None may go on the page as it
  is: the chosen one gets licensed or commissioned, with leave to put interface over it.
- Kept in `landing/backups/2026-10-16-before-screening.tgz`: the hall photograph and its light (`Room.tsx`), "Watch
  the demo" with its pop-up player and dock (`WatchDemo.tsx`), the first round of page versions and the three
  directions.
- **`/download`** is in `components/book/get/`. It holds:
  - the download, as a real link to `DMG_URL`, with the install steps appearing under it
  - a frame of four photographs in turn, with a slow dissolve and drift (`Rotation.tsx`)
  - the plans as quiet lines in three columns (`Plans.tsx`)
  - the checkout sheet (`CheckoutSheet.tsx`)
  - the founding member's welcome (`Welcome.tsx`)

  `?preview=welcome` opens the welcome directly.
- **Type** is Cormorant Garamond and EB Garamond, loaded with `next/font`. Every style is in `app/(landing)/book.css`.
- **Before launch:**
  - **Pictures.** Every picture is a stand-in hotlinked from cosmos (`lib/landing/book.ts`, `Pictures`). The hall
    is Olafur Eliasson's work and the rest belong to their photographers. Replace them with Fovea's own.
  - **Payment.** It is a demo, as asked: `CHECKOUT_MODE = "demo"` charges nothing. Set it to `"stripe"` and the
    pay line goes to the existing `/checkout`, which already starts a Stripe Checkout session.
  - **Founding places.** The count ("588 of 1,000") is a placeholder (`Founding`).
- **Moved and replaced:**
  - The old `/download` page (Geist, green) is replaced; `/download/beta` is unchanged.
  - "What leaves your Mac" is restyled in the same type.
  - The gradient landing and the old `/download` are kept in `landing/backups/2026-10-13-before-book-landing.tgz`.
    Their components (`components/landing/`) are still in the tree, unused by `/`.

- **Privacy, Terms, Pricing and Feedback** moved into the same type (Oct 13, later). They are in `app/(landing)/`,
  and the footer on every page now also lists Pricing and Feedback.
  - The legal text is word for word, in `lib/landing/legal.ts`: Max's copy (`fovea-product-frontend`, Jul 20), Yulun's
    pick on Oct 20, checked block by block against it and the live pages. Engineers drafted it; the June 21 handoff
    asks for a lawyer's review.
  - Their top (`components/book/TopBar.tsx`, on every page but `/`): only the name, which is the way back home, to
    where the reader left it (Oct 20, Yulun: no "Back" link and no arrow; the browser has its own).
  - Pricing reuses the plans, the checkout and the welcome.
  - Feedback posts to `/api/feedback` exactly as before.
  - The old versions are in `landing/backups/2026-10-13-site-pages-before-book.tgz`.
  - `/login`, `/account`, `/checkout`, `/checkout/success`, `/auth/callback` and `/download/beta` were in the old green look until Oct 21; now in this type (see the top of this file).

- **English only** (Oct 13, later). The Chinese edition (`/zh` and the "English · 中文" switcher) was taken down:
  the page needs to show what Fovea does, not be translated. It is kept in
  `landing/backups/2026-10-13-chinese-edition.tgz`; the translation research is in `landing/research/chinese/`.
- **Paper** (`#F8F8F5`, Oct 15) is the site's colour: between the first warm paper (`#F7F5F0`) and the live site's grey (`#FAFAFA`), chosen by eye from steps between them.

## The film (Oct 13–17)

**Oct 17, Yulun's twelve notes** (1:25 → 1:45; tests in `tests/landing/film.test.mjs` hold each of these):
- **No "Before".** The film opens on what the product is, a sentence a line: "Stay in your window. / Talk to any
  agent from the notch." "Just your voice." is gone. Three chapters: Today 0:00, Soon 0:52, Next 1:21.
- **The answer panel is the app's** (FoveaV1 V2ChatContent; DSP-16, DSP-18). The Oct 16 prune had dropped the
  follow-up field's rules, so its arrow filled the frame; restored, and every icon now carries its own size. "Worked
  for 1 m 52 s ›", the table's first column in serif italic, "Open vase_v3.png", the bar (Open in Claude Code;
  Continue in…, Copy Answer, Answer again), "Ask a follow-up", the grab handle.
- **Blender is Blender 5.2's Layout workspace** in its default theme (userdef_default_theme.c and the manual): top
  bar with the workspaces as pills, the viewport header, tools, gizmo and buttons, the Outliner, the Properties on
  the Material tab (Principled BSDF), the Timeline, the status bar; the viewport in Rendered shading through the
  camera, the vase in clay, then glazed, lit by the loft and framed 4:5 at 50 mm. No logo.
- **The captures are slow enough to follow:** each about 3 s, its mark held over a second, its picture flying 0.6 s
  (the app's 0.45) into the bar while the notch is in view; each "this" said as its capture is made (`speak()` cues).
  Oct 18, as Fovea takes things (Yulun's keys for the site: ⌘ once, the area selected; ⌘ twice, the whole screen): the glaze with ⌘ and a drag; the
  light, its file dragged from Finder onto the notch (the bar lit as a well in the accent, "Drop to take it", the
  waveform stepping aside; let go, it flies into the stack); the brief's words simply selected, no key, Fovea's
  highlight in the accent (.32) staying on them until the request is sent.
- **The agent only knows what it was given:** "Glaze it like this, light it with this, and frame it like this." (the
  third "this" is the brief's words); Dana is named only in the second scene, after ⌘ ⌘ took the whole screen with
  her email on it.
- **Send it to Dana:** ⌘ ⌘ (the whole screen: a flash; a still copy of the desk lifts from the screen inset 40 and
  flies into the bar), "Send this to Dana.", Choose chat, Return; the Mail that is already open writes the reply
  beside her message, the render attached, "Draft"; back within 8 s, the draft opens in the notch by itself (DSP-18).
- **The whole screen, mostly:** the camera no longer leans in on laptop frames (only phones', under 640 wide), opens
  each scene on the whole screen for 2 s or more, and leans in (1.3–1.45×, never past 1.5) only to do or read
  something small, returning to the whole screen between (research: full screen, cue, zoom, return).
- **Blender work takes minutes, so its answer waits on the board:** the pointer rests on the notch, the board opens
  ("Glazed, lit and framed."), its row opens the session (the app opens an answer by itself only within 8 s).
- **Soon:** "And soon, your eyes." over "Not a cursor but a brand new way of capturing attention."; then a second
  card for session routing, Yulun's pick of four framings: "And all your agents, as one." over "Fovea automatically
  routes the session and the model for you." (Yulun's line, Oct 18; every running agent answers as one being). In
  the scene nobody picks a chat: Choose chat offers no list (Yulun: a list being scanned reads as you choosing); in the
  chat's own pill, kept at the chat's width as the app keeps it, a ring circles where the chat's icon will be, a turn
  a second, filling as Fovea thinks (1.8 s), then Weekly update appears in its place; then the model. The ring's label stays about
  4 s; before it sends, the pointer opens the attachments (the pile fans into a numbered row; the merged pull
  requests up close, "2 · Merged pull requests", esc).
- **Every capture is the exact thing taken**, not a sketch of it (`Minis.tsx`): each is drawn in its own region's
  coordinates and scaled to its card, in the bar, the pile, the opened row and in flight: the board's glaze, the HDR
  as Finder shows it, the brief's words as a paper card, Maya's chart, the six merged pull requests, and the whole
  screen (a still copy of the desk).
- **Next:** "Then, something you wear." over "Not a pair of glasses. Not a ring. And not a necklace."; six agents,
  each its real icon (Muse, Claude Code, Codex, Grok Bot, Instinct, Manus).
- **Looking at any moment:** in development, `window.foveaFilm` (`seek`, `play`, `pause`); `?film=` is not wired.

**The film** is drawn live in the browser, the way hellofovea.com's four demos were:
- `lib/landing/film/film.ts` says what everything does at any moment: `evaluate(t)` returns the camera, each window,
  the island's outline and contents, captures in flight, the pointer, the gaze ring, key caps, subtitles and cards.
  Springs, cross-fades, flights, saccades and typing are all worked out from time, so playing and seeking show the
  same frame. `components/book/film/` builds the picture once and applies each frame (`renderer.ts`); no CSS
  transitions or animations run inside it.
- **The island is Fovea 1.0's** (Oct 14, checked interaction by interaction against `FoveaV1` and its pictures,
  `app-ui-v1/handoff/Fovea-1.0-design-pictures`), Native in light glass:
  - **Sizes** (`WorkbenchTokens.swift`, Spacious): the voice bar 192 × 76; Choose chat 660 wide and 171 tall, its
    content 35 pt in (ear 19 + margin 16); the board 400 wide, 42 pt above its rows, 46 a row, 9 between Done and
    Running with a hairline; the session panel 660 wide, its header 42–82 with a rule, the answer's table at a 24 pt
    pitch with its second column 173 in. No drop shadow; the notch's corners 8.
  - **The voice bar:** the stack 14 pt in (the first capture in front, the next two behind at .92 and .84, turned);
    the nine bars move aside on a 0.3 s spring as each capture lands; no glow on the bottom edge (Oct 18: Yulun, no rainbow under the notch).
    Transcribing is the word and its ellipsis, for at least 1.4 s.
  - **Keys** (Oct 18, Yulun, for the site; the app's code had moved the region to ⌥ on Oct 17): fn ⌃ starts and the
    next fn ⌃ stops; ⌘ takes the area selected, one press and a drag (the selection goes at release); ⌘ twice the
    whole screen; words and files need no key (selected
    words are taken, and a file dragged onto the notch). Keys act on release, so each cap shows about 0.2 s before the
    island answers, named once beside it ("talk", "part of the screen", "whole screen", "done", "send").
  - **Dispatch:** Choose chat waits for Return; after Send the board holds 3 s (Done above Running, newest first, only
    the new row highlighted, a working badge of an accent arc on a light disc); an answer back within 8 s then opens by
    itself. The steps under a row are the agent's, one at a time ("Reading the formula", "Working out each term",
    "Editing TrailCard.tsx +3 −1").
  - **What Today shows coming back is simulated in 1.0**, so the desk carries an "In preview" tag from the first
    request until the Soon card. Gaze, Choosing chat by itself and forking a session are concepts (not in the spec):
    they appear only after "And soon, your eyes." and under "Coming soon".
- **Pace** (Oct 14). A viewer from the audience (a senior engineer, sound off) watched the first cut and found it too
  quick to follow; a second viewer watched the revision and asked for more on four beats. This cut gives each thing
  time to land (the tests hold it to this):
  - every card is whole for at least 1.8 s, and each spoken line stays whole 1.2 s after its last word;
  - the Quick answer is held 5.7 s, the session 4.7 s, the document 5.9 s, and every board as long as the app holds it;
  - a caption comes in only after its result has been read for at least 2.5 s;
  - the camera reaches Choose chat as it opens, and the chat Fovea picked glows once; in Soon the chosen chat holds
    2.2 s before it sends itself;
  - after each cut, a second to see the whole screen before the camera moves; Maya's message is held 2 s;
  - the bug fix is seen before and after: the camera settles on the buttons 1.2 s before the low one slides 16 pt into
    line over 0.7 s, then holds 2.2 s;
  - in Soon the voice bar stays in frame while the eyes pick, and each thing they rest on is marked for about a second
    as it is named; the second request starts its own empty stack and takes the chart's labels;
  - paid for in part by a shorter first card and a shorter Fovea Bar still.
- **The cut** (Oct 16, 1:25). The team's notes: before and after comparisons are tired (one line is enough), the
  first scene should feel like talking to the computer while it does the work, and the eyes must read as context,
  never control.
  - **Before** (4 s): one line on paper, "It’s right here. Your agent is somewhere else." (the brand has no
    questions; calm brands open with a statement; the choices are `TITLES` in content.ts). The old way's
    demonstration is cut entirely (kept in `landing/backups/2026-10-16-before-screening.tgz`). Then "Just your voice."
  - **Today, look-dev** (22.6 s): a clay vase in Blender (drawn in HTML and SVG, no logo; --g, --l, --c set the glaze,
    the loft's light and the 4:5 camera), the client's reference board, the Studio Nord folder, Dana's brief in Mail.
    One sentence while pointing three times: "Glaze it like this, light it with this, and frame it how Dana asked."
    (⌘ a glaze on the board, ⌥ a light in Finder, ⌥ the brief's line). Choose chat: Claude Code's "Studio Nord vase".
    The agent's steps on the board and, in front of you, the vase glazed, lit and framed, the render landing in the
    folder; then what changed comes back to the notch. Honest: Claude Code and Codex drive Blender today through
    Blender MCP (community) and Blender's own MCP server (an Anthropic connector since Apr 28, 2026), and Fovea's own
    beta sent Codex two Blender tasks on Sep 13. The agent's time is shown sped up, and says so.
  - **Today, everyday** (13.4 s): Dana asks for a first look; ⌥ the render; "Send her this; second angle Friday."; a
    reply drafted in Mail with the render attached. A draft: it is never sent for you.
  - **Soon**: "And soon, your eyes." with "Not to control anything. Only to know what you mean."; the ring is
    labelled "what you’re looking at, as context"; the session and the model picked by themselves.
  - **Next**: unchanged.
- **Craft** (Murch, Linear's launch films, NN/g, Apple HIG): about ten cuts a minute; payoffs held; each shot ends
  where the next one's subject is; camera moves of 1.2–2.2 s eased in and out; chapter breaks dip to paper; depth of
  field from a pre-blurred wallpaper, never an animated blur; the person's words as subtitles in EB Garamond (the
  film is silent), the machine in SF; one colour accent, the ring's blue.
- **Phones:** the camera leans toward each shot's subject (`camera.ts`), so the island stays legible in a 366-wide
  frame. **Reduce Motion:** the camera cuts between its marks and the ring doesn't tremble.
- **Looking at any moment:** in development `window.foveaFilm` is the handle (`seek`, `play`, `pause`). The film's
  `at` and `debug` props (a paused start; the shot and time, `,` / `.` a frame) exist but no page passes them yet.
- **Tests:** `tests/landing/film.test.mjs` (the same moment is the same frame; nothing jumps outside the cuts; the
  ring only after the Soon card; results under In preview; cards, lines and results held long enough to read; the
  cards are the landing's words; the camera fits any frame; the player).
- **Pictures:** the wallpaper and the trail are Unsplash photographs through
  picsum.photos (`public/landing/SOURCES.md`); the Fovea Bar is your render. Photographs of your own, taken at eye
  level, would suit the "through the eyes" shots better before launch.

## Before (Oct 10)

`/` is one white card on a light grey with five parts on it (Oct 10), after the reference Yulun
picked: a pill nav, a large tight sans headline with its second half in grey, a big rounded picture
of moving light, a statement that fills in as you read, and small columns under it. The words are
Yulun's, all in `lib/landing/copy.ts`; the design adds no sentences, only the nav's page names and
the buttons. The reference and how each motion is made: `landing/REFERENCES.md`.

The page's one job: the sense that the next generation's input goes through Fovea, and that work is
where it starts. It says what Fovea wants to become rather than walking through today's app.

1. **Fovea.** "Talk to your agents from the notch. *Just for now.*" (the second half in grey). At the
   right, what it needs, Download and What leaves your Mac. Under it the picture: a screen of moving
   light with the notch at its top, which now and then listens and says "Sent".
2. **Today.** "Fovea starts in your workspace." and its sentence as one large statement, grey until
   you read down to it. Then three columns: no tab switching; Claude Code and Codex, in preview, with
   their icons; a small picture with the mark.
3. **Next.** "Then any device. Then anywhere." Four numbered columns: the Fovea Bar, something you
   wear, input not another screen, from anywhere.
4. **Why.** "What personal agents are missing is you." The paragraph as a statement that fills in as
   you read; its last sentence quietly under it.
5. **Start.** "Today, the notch. Next, everything you look at." on soft light, and Download. Then
   the foot.

"What leaves your Mac" is its own page (`app/(landing)/what-leaves-your-mac`), linked from the hero
and the foot.

## The look

- **A white card on a light grey** (`#FFFFFF` on `#EFEEEB`), rounded 20 px, inset 12 px. Words in
  near-black (`#0E0E0E`); what's said second in greys (`#6E6E6E`, `#A3A3A3`). All in
  `lib/landing/tokens.ts` `Site`, mirrored in `app/(landing)/landing.css`.
- **Inter** for every word, its optical sizes on, headlines set large and tight (−0.038 em).
- **Pill buttons:** black for Download, light grey for the second.
- **The pictures** are drawn live by a small WebGL shader (`components/landing/media/GradientCanvas.tsx`,
  looks in `lib/landing/gradient.ts`): cream above, a blue haze, warm orange and pink at the foot, the
  icon's yellow, pulled in the middle into stretched, wavering columns. Rendered at half resolution,
  only while on screen; one still frame with reduced motion; CSS light without WebGL.
- **The mark** is the app icon's highlighter loop, in the nav and in white on the small picture.
- **Motion:** headlines rise in word by word at the onboarding's pace (0.7 s,
  `cubic-bezier(0.2, 0.9, 0.3, 1)`, blur 8, rise a quarter of their size); statements fill from grey
  to black as you read; blocks rise in once. `?motion=reduce` shows the page as it is with reduced
  motion; without scripts everything shows.

## Decisions (Oct 9–10)

- **No demo** (Oct 10). The page sells where Fovea is going, not what today's app does, and the
  onboarding already walks people through the app once. The demo's code (`lib/landing/engine`,
  `lib/landing/scenarios`, `components/landing/demo`, `island`) is still in the repo, unused by the
  page, until it's decided whether anything else needs it.
- **Five pages** (Oct 10), with Yulun's words for each.
- **The design** (Oct 10): Yulun's reference (`REFERENCES.md`). A first design (Macula ivory,
  Newsreader, born.com's reveals, pictures drawn as concepts) was dropped the same day.
- **The accessory is clear but unnamed:** "something small enough to sit on whatever you already
  wear". It is never named and never pictured.
- **Download for Mac.** The link lives in `lib/download.ts`. It is the beta DMG until 1.0 is hosted.
- **Requirements:** "macOS 14 or later · Apple silicon".
- **Sending to agents is "in preview"; eyes are "soon".** Sending is simulated in 1.0, and eye
  tracking is in beta.
- **Not on the page:** pricing, the history and the founder story.

## Where things are

```
app/(landing)/            the page's own root layout (Inter, the boot script), landing.css (tokens,
                          the reveal), the page, what-leaves-your-mac, share image
app/(site)/               every other page, unchanged, under the site's own root layout (mint, Geist)
app/global-not-found.tsx  the 404 (two root layouts leave no top-level one)
app/icon.svg, apple-icon  the highlighter loop icon
lib/landing/copy.ts       every word
lib/landing/tokens.ts     Site, Reveal, and the app's island tokens (the old demo's)
lib/landing/gradient.ts   the pictures' looks (pure, tested)
lib/landing/reveal.ts     words and their timing (pure, tested)
components/landing/       Landing.tsx (the card), Nav.tsx, HeroNotch.tsx, page.module.css
  sections/               Hero, Today, Next, Why, Start (with the foot)
  media/                  GradientCanvas (the shader)
  motion/                 Reveal (words), Rise (blocks), ScrollWords (statements)
  brand/                  loopMarkPaths (the mark, from Brand/fovea-mark.svg)
  ui/                     DownloadTracker (and the old demo's controls)
  island/, demo/          the old demo, unused
public/landing/           agent icons, the old demo's photos, SOURCES.md
tests/landing/            node:test, run with the rest by `npm test`
legacy-point-and-tell/    the previous static site, archived (git tag landing-v1-point-and-tell)
```

## The old demo (unused by the page)

**What's real and what's scripted**

- The demo plays Dispatch Version 2 as the Notch Workbench plays it (`WorkbenchModel+DispatchV2.swift`).
- Pressing the keys, taking regions and choosing what to say are real: the visitor does them in
  Try mode.
- The agent's work is scripted, and the page says so.

**How a run flows**

- One reducer (`lib/landing/engine/reducer.ts`) handles both modes:
  - **Watch:** the script in `scenarios/scripts.ts` presses the keys and moves the hand.
  - **Try:** the visitor presses the keys.
  - A click, a modifier key, or "Try it yourself" hands over at whatever step is showing. The
    state carries on, and the instruction bar works out the next step from the state
    (`engine/instruction.ts`).
- `engine/runtime.ts` holds the state, the clock, the player and the effects. The page reads it
  with `useSyncExternalStore`, and the tests drive the same engine with a clock moved by hand.

**The keys** (onboarding's `KeyMap`)

- fn ⌃ asks. A browser never sees fn, so a bare ⌃ tap stands in, and the keycaps are buttons.
- ⌘ then a drag takes a region; ⌘ twice takes the whole screen.
- Return sends; esc steps out.
- "Take it for me" captures a target without dragging, for a keyboard or a finger.

**What happens on screen**

- **Binding** (`engine/binding.ts`): each "this", "that one" or "these" gets the number of the
  referent it means, shown beside the words and on the referent's card.
- **The island** (`components/landing/island/`) is Native light:
  - a black notch on light glass, with Badges rows;
  - its outline moves on the app's critically damped springs: CSS transitions of registered
    custom properties, using a `linear()` easing sampled from the spring.
- **Captures:** a referent's picture is the screen drawn again, cropped (`Thumb.tsx`), so it stays
  sharp.
- **When it plays:**
  - The server draws the demo's first picture, the layout bug at Choose chat (`DemoPoster`).
  - The live demo loads with the page and fast-forwards to the same frame, then plays on.
  - It plays only while on screen.
  - Under Reduce Motion it waits on that frame for the visitor.
- **Phones:** Watch only. The picture moves in on the island while it is open, and "Try it on
  your Mac" shares the link.

**To add a scenario**

1. Add `lib/landing/scenarios/<id>.ts` (targets, line, beats, answer, board rows).
2. Add its Watch script to `scripts.ts`.
3. Draw its screen in `components/landing/demo/` and add it to `ScreenPicture.tsx`. Mark anything
   a capture can take with `data-target`.
4. Add it to `ORDER`, and give it a phrase in the words (`lib/landing/copy.ts`, a
   `{ scenario, phrase }` part).

`tests/landing/engine.test.mjs` plays every scenario through, headless.

## Run it

```bash
npm run dev        # http://localhost:3000
npm test           # every node:test, the landing's included
npm run build
```

## Before launch

- [ ] Confirm "What leaves your Mac" against the 1.0 build, and update `/privacy` to match.
- [ ] Point `DMG_URL` at the 1.0 build once it is hosted.
- [ ] If "Hear about it first" comes back: apply `supabase/migrations/20261010000000_lead_interests.sql`.
- [ ] Confirm the Claude Code and Codex icons against each brand's guidelines.
- [ ] The film's Blender scene is drawn, not recorded: before launch, record it for real (Blender MCP) or keep the
  "In preview" and "sped up" tags.
- [ ] The film's agent row (Oct 17: Muse, Claude Code, Codex, Grok Bot, Instinct, Manus, each its real icon,
  sources in `public/landing/SOURCES.md`): clear every mark with its owner before launch (Anthropic and OpenAI ask
  for permission, Meta approves each use, Manus forbids altering its mark; nothing may suggest a partnership).
- [ ] Redraw the share image (`opengraph-image.png`) in the page's look.

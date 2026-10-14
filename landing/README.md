# Fovea: the landing page

## Now (Oct 13): "the book"

`/` and `/download` are the design Yulun chose from `landing/research/drafts/`: Draft 2, the book, and its
download page. The research behind every decision is in `landing/research/drafts/research/`.

- **`/`** is in `components/book/Landing.tsx`. It opens on a title page facing the hall. The hall's own warm light
  comes on while the pointer is over it and wanes like a lamp when it leaves (`components/book/Room.tsx`). Then
  three numbered sections in one reading column, then the last line and "Download for Mac", which leads to `/download`.
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
  - The legal text is word for word, in `lib/landing/legal.ts`.
  - Pricing reuses the plans, the checkout and the welcome.
  - Feedback posts to `/api/feedback` exactly as before.
  - The old versions are in `landing/backups/2026-10-13-site-pages-before-book.tgz`.
  - Still in the old green look: `/login`, `/account`, `/checkout`, `/checkout/success`, `/auth/callback`, `/download/beta`.

- **The Paper panel.** A swatch at the bottom right of every page lets you try paper colours on the whole site.
  - It offers 13 options and any colour, kept in this browser.
  - It shows in development, and on the live site only with `?paper`.
  - The options are in `lib/landing/paper.ts`. To settle on one, set `--paper` in `app/(landing)/book.css`.

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
- [ ] Redraw the share image (`opengraph-image.png`) in the page's look.

> This is the landing page that `public/index.html` serves at hellofovea.com/ (see `next.config.ts`). The served files are `public/index.html`, `public/style.css`, `public/script.js`, `public/demos.css`, `public/demos.js` and `public/assets/`. This folder keeps the page's own README and its asset tools for reference; the photograph sources they regenerate from (`historical/`, `assets/plates/src`, `assets/product/fovea-bar-src.png`) live outside the repo, in the original `fovea website` folder, so run the tools there and copy the outputs into `public/assets/`.

# Fovea — landing page

One screen: the photograph of the hardware is the ground, the copy sits on the empty wall above it, and the cursor is the light. Below the fold, page two (the showcase: four code-rendered demos of the notch), page three (the history: seven spotlit columns on a black wall — the map photograph, the Teletype, the NLS console, the first iPhone as cutouts, two voice pills and one line in code — scrolled sideways, then its tail on the same black: the closing line, the bench and the product specimen), the proof, the early-access form and the footer. Static HTML/CSS/JS, no framework, no build step.

```
index.html          markup, copy, meta tags, the side-strip geometry
style.css           tokens (:root), hero, light rig layers, origin button, showcase, the history, its tail (bench, specimen), proof, access, footer
script.js           initOriginButtons, initLighting, initShowcase, initGallery, initForm
demos.css           page two's demos: the Island (notch UI), gaze ring, cursor, key cap
demos.js            the demo engine and the four scripts (initDemos)
assets/             the photograph and the layers generated from it
assets/plates/      the desktop plates the demos play over (src/ holds the PNG sources)
assets/island/      provider marks for the Island's rows and pill
assets/brand/       the wordmark (wordmark.svg), inlined once in index.html's footer; the tab icon (icon.svg, apple-touch-icon.png; favicon.ico at the site root) from the logo package
assets/product/     the Fovea Bar render (fovea-bar-src.png), its cutout (fovea-bar.png) and matte (fovea-bar-mask.png)
assets/history/     the history's pictures: three Vision cutouts with their mattes, and the map photograph (tools/make-history.sh)
historical/         the history's source photographs, as supplied (not used by the page directly)
tools/make-assets.sh, tools/cutout.swift   regenerate the hero layers (macOS 14+, Swift)
tools/make-plates.sh, tools/plates.swift   regenerate the plates' JPEGs and blurred twins
tools/probe.swift   measure a photo: background column, hardware box
tools/make-specimen.sh, tools/specimen.swift   regenerate the product cutout (macOS 14+, Swift); specimen.swift also cuts the history's photographs (--crop crops before Vision, rows from the top)
tools/make-history.sh   regenerate assets/history/ from historical/
tools/specimen-check.html   the cutout at 400% on the black, for the edge check
.claude/launch.json preview server config for the desktop app
```

## Run it

```bash
python3 -m http.server 8080
```

then open http://localhost:8080.

## The photograph and its layers

`assets/hero-source.png` (1672×941) is the untouched photograph and the base layer. Everything else in `assets/` is generated from it by `tools/make-assets.sh`, on the same canvas, so the CSS layers line up with `inset: 0`:

| File | What it is |
|---|---|
| `hardware-cutout.png` | the three objects and cables on transparent (Vision subject lifting, matte dilated 1.5px) |
| `hardware-mask.png` | the matte itself, for inspection |
| `hardware-shadow-6.png`, `hardware-shadow-16.png` | black silhouettes, gaussian radius 6 and 16, the tight and soft cast shadows |

To swap the photograph: replace `hero-source.png`, run `sh tools/make-assets.sh`, then update `--photo-w`/`--photo-h` in `style.css` and the hardware box numbers in `style.css` (`--hw-cx`, `--hw-by`) and `script.js` (`HW`). `swift tools/probe.swift assets/hero-source.png` prints the box. Re-measure `--table` too: it is the colour of the photo's bottom row, where the seam into page two starts.

A higher-resolution original would help: on a Retina 1440-wide screen the photo is upscaled about 1.9×.

## The light rig

At rest the screen is the photograph, untouched: every dynamic layer is a delta from the rest light (upper left, where the photograph's own light comes from) and has opacity 0 there. Moving the mouse moves the light:

- two pre-blurred shadow sprites pivot on the contact line, lean away from the light, lengthen as the light drops toward the table, and fade at table level;
- the objects' two ends respond to the light's horizontal position: the end facing it brightens, the far end falls into shade (one strip per object and side, masked to the cutout; geometry inline in `index.html` as image-space percentages);
- a soft pool of light follows the cursor on the table.

Only `transform` and `opacity` change per frame. The loop runs on `requestAnimationFrame` with a time-based lerp and stops when settled. The rig does not start on touch/coarse-pointer devices or under `prefers-reduced-motion`.

Tunables live on `.stage` in `style.css` and are read once at load:

| Variable | Meaning |
|---|---|
| `--k-shift` | sideways shadow travel (px) per unit of light offset |
| `--k-skew` | shadow lean (deg) per unit of light offset |
| `--k-len` | shadow length ÷ light height above the table |
| `--shadow-a`, `--light-a`, `--shade-a`, `--glow-a` | maximum opacity of each layer |
| `--lerp` | follow speed per 60fps frame |

## The origin button

`.btn--origin` follows 21st.dev's Origin Button: white pill with a hairline at rest; on hover a black circle grows from where the cursor entered (500ms, `cubic-bezier(.16,1,.3,1)`), sized to cover the button from any origin, and collapses toward where the cursor left; the label turns white. Keyboard focus fills from the centre; touch fills while pressed. `--btn-fill` sets the fill colour.

## Page two: the showcase

`section.showcase` is a feature walkthrough after diabrowser.com's "Dia reads between the tabs": a sticky index of four numbered items on the left, one display screen per item on the right, and a closing line under the grid. Each screen plays one of the four demos (below). Above the grid, one status line: "Fovea for Mac is currently in Alpha. Request Access.", the link going to the form. The copy is `copy.md`'s, verbatim, except the first item's opening ("With gaze tracking and dictation: …") and the status line, added on review.

How it behaves (`initShowcase` in `script.js`; the numbers are Dia's):

- Index item *k* pairs with panel *k* by document order, and the numbers are CSS counters. To add an item, copy one `.index__item` and one `.panel`, and give the new slot a script in `demos.js`.
- On desktop (800px and up) the index sticks at 20vh. The active item is the one whose screen's centre is nearest 40% of the viewport height (`--show-anchor`), recomputed on scroll and resize, one frame at a time.
- Clicking an index item makes it active, scrolls its screen to 160px from the top (`--show-land`) and holds the tracker for 700ms (`--show-hold`) so the glide cannot flip the state. Under `prefers-reduced-motion` it jumps instead of gliding.
- The screens are 90% of the stage column (`--show-screen-scale`), on its left edge next to the index, and the stage's row gap is half a viewport (`--show-stage-gap`): a pause between demos in which at most thin slivers of two screens share the screen; the active item switches at the midpoint of the gap. Below 800px the screens are full width, 60px apart.
- Each screen fades in from 97% size once it is 100px from view; the closing line fades up once it is 50px from view. Below 800px the index is hidden, each panel shows its own number, title and line (`.panel__meta`), and whole items slide up as they arrive. Without JavaScript everything is simply visible (`html.js` gates the hidden states), and each screen is its desktop plate.
- A screen holding a `<video>` would get a play/pause overlay (kept from the backbone; the demos are not videos).

The screens have the plates' shape (`--show-screen-ratio` is `--plate-w / --plate-h`, 1672 × 941), so nothing is cropped and image-space percentages are screen percentages. Below 800px the screen is 4:3 and the plate is sized from its height and cropped symmetrically, so the notch stays centred.

The seam from the hero: the photograph's last rows settle into `--table` (`.hero::after`, `--seam-fade` tall), and the showcase's background runs from `--table` to `--ground-2` over `--seam-h`, then stays `--ground-2` under the form. `--table` was measured from the photo's bottom row.

Tunables (`:root` in `style.css` unless noted):

| Variable | Meaning |
|---|---|
| `--ground-2` | page-two ground (`--warm`, #ECECE8) |
| `--table`, `--seam-fade`, `--seam-h` | the photo's bottom-row tone; the in-hero fade height; the length of the fade into `--ground-2` |
| `--show-max`, `--show-pad`, `--show-gap` | container width, side padding, index/stage gap |
| `--show-index-w` | index column width; the screen takes the rest (about 1040px at 1440 wide, against Dia's 913) |
| `--show-nav-top` | where the index sticks |
| `--plate-w`, `--plate-h`, `--show-screen-ratio`, `--show-radius` | the plates' size, the screen's shape (4:3 below 800px, set on `.showcase`) and corner radius |
| `--index-active-bg`, `--index-bar-idle` | tint of the active item and the bar colour of an idle item; Dia's live site ships both transparent |
| `--screen-shadow` | optional drop shadow on the screens |
| `--ink-1` … `--ink-4` | the four text greys (85/60/45/20% black) |
| `--show-anchor`, `--show-land`, `--show-hold` (on `.showcase`) | the 0.4 / 160px / 700ms behaviour numbers, read once by `script.js` |

## The demos

Four demos, one per screen, from the hand-off spec (`fovea-site.zip` › `agent.md`) and the notes on the first pass: "Nothing to attach", "Nothing to choose", "Nothing to open", "Nothing to chase". Each is code drawn over a static desktop plate: the hardware notch, the Island (Fovea's notch UI), the gaze ring, the cursor and the key cap. All form follows the Island in `../app-ui-v1` (`Sources/Fovea/Tokens.swift`, `Sources/FoveaCore/Island/NotchGeometry.swift`, `Sources/Fovea/Island/Views`, `screenshots/island-*.png`); every number in `demos.css` is that app's points, and one point is one plate pixel (`--px`, from the container's width), so the Island keeps its proportion to the desktop at any width and any zoom.

Layers, in `demos.css`: `.demo` (the root, filling the slot) › `.demo__scene` › `.demo__zoom` (the camera: 2.2× about the notch when the notch's content is the subject; the top edge stays pinned, so nothing empty is ever revealed) › the sharp plate, a second plate for demo 01's crossfade, the plate's pre-blurred twin (fades in with the zoom: depth of field, the Island stays sharp), `.demo__notch`, `.island`, `.demo__ring`, `.demo__cursor`; then `.demo__key` and `.demo__dip`, the black scrim every demo fades in from at its start and out to at its end (a screen that has not started is black).

The Island (`.island`): one black surface whose body width, height and radii transition on the app's springs (critically damped, so one curve and a duration reproduce them: open 340ms, close 300ms, convert 280ms, list in/out 180ms). The concave ears are pseudo-elements; the content of each phase is a `.island__content` node laid out at that phase's width and swapped with the app's crossfade (opacity, 4pt blur, scale .97 from the top, 140ms, 50ms after the geometry). Phases: `voice` (listening: nine waveform bars), `review` (transcript, referent thumbs, the Chat pill, Send, and under it the recent-chats panel when the pill is open), `list` (five task rows), `slab` (demo 04's question, and the artefact with "Take me there" and a follow-up field). At rest the Island draws nothing; the notch is the notch.

Three things the app renders that the demos reproduce on purpose: the Chat pill's routing state (a spinner with "Choosing Chat", the same width as the answer, which crossfades in place), the recent-chats panel (`ChatSelectorPanel.swift`: header chip, New Chat, Search Chats, two columns of rows, the chosen one filled), and a working agent's status, which is never static: a light sweeps left to right across the activity line and the state word about every two seconds (`.island__shimmer`, the way ChatGPT's "Thinking" label and Claude Code's status line render it); Working and Needs you shimmer, Complete and Failed stay still.

The gaze ring is a soft glowing band (`--ring-size` 112 plate px) in its own light sky blue (`--ring-color`, #52B4F5; the wordmark's O keeps `--accent`). It rests on what the eye is on with a little fixation jitter and travels when the eye moves (`--ring-move-ms`); it appears and disappears with the key cap. In demo 04 both answers are spoken: hold the key, the field shows the listening bars, the words arrive at speech pace.

`demos.js`: `Scene` builds one demo's layers and exposes setters (`setPhase`, `type`, `chip`, `pill`, `selector`, `send`, `key`, `look`, `zoom`, `crossfade`, `cursorTo`, `fieldListen`, `fieldType`, …) that only toggle classes, set text or write a transform; `Demo` is a pausable `requestAnimationFrame` clock that fires a script's beats and runs its drivers (typing, cursor paths, ring jitter, the waveforms). Every demo fades in at 0, fades out at its `duration`, and under the black snaps back to its opening state before looping. Demo 02 opens in 01's end state, 03 in 02's, 04 on 03's final frame.

Gating (`initDemos`): a demo plays only while at least 35% of its screen is in view, at most two at a time (one below 800px), the most visible first; the rest hold their frame and resume where they were. A hidden tab pauses them all. `prefers-reduced-motion` shows each demo's final frame with no clock and no observers.

The four scripts are the `SCRIPTS` table in `demos.js`: times in ms, every beat a state change. What each has to prove, and the rules they follow (the ring appears and disappears with the key cap; the only cursor click on the site is 02's click on the pill; no captions or labels; the ring's blue is `--ring-color` and nothing else in the demos is blue), are in `agent.md` inside the zip and the notes on the first pass.

Assets: the plates come from the zip. `sh tools/make-plates.sh` regenerates `assets/plates/*.jpg` from `assets/plates/src/*.png` (a JPEG of each plate, and a blurred half-size twin for the two plates the demos zoom on; `tools/plates.swift` takes `--quality` and `--blur`). The plates are 1672 × 941 with a 25px menu bar whose centre is empty for the notch. The ring targets and the referent crops are the `T` table in `demos.js`, in plate pixels, measured on the plates; re-measure them if the plates change. The provider marks in `assets/island/` are copies of the app's (`Sources/FoveaCore/Resources/Destinations`; nominative use, to be replaced by official icon packages).

Tunables, on `.demo` in `demos.css`, read once by `demos.js`:

| Variable | Meaning |
|---|---|
| `--demo-zoom-max`, `--demo-zoom-ms` | the camera's scale (2.2; 3 below 800px) and its duration; `demos.js` lowers `--demo-zoom` so the widest Island still fits the screen |
| `--word-ms` | transcript pace, ms per word (the app's speaking pace, 210) |
| `--ring-size`, `--ring-color`, `--ring-move-ms`, `--ring-jitter-px`, `--ring-jitter-hz` | the ring's diameter (plate px) and its blue; how long the eye takes to move to the next thing; the fixation jitter's amplitude (screen px) and rate |
| `--fade-in-ms`, `--fade-out-ms`, `--fade-hold-ms` | the fade at each demo's start and end, and the black in between where the opening state is restored |
| `--is-*` | the Island's colours (`Tokens.Island.Colors`) and curve |

To look at any moment: `foveaDemos[n].seek(ms)` in the console renders demo *n* at that time, then `foveaDemos[n].play()`.

## Page three: the history

`section.gallery` is the history in en.ruien.be's horizontal room: seven spotlit columns on a museum black under the heading "The History of Pointing and Telling". The page keeps scrolling down and the columns slide sideways. Each column is one `<li class="gallery__col">`: a lamp (a pseudo-element: a bright ellipse on the top edge and a warm cone under it, `--gal-lamp`, `--gal-light`), the year in Georgia caps (before, 1963, 1968, 2007, now, next, later; `--gal-marker`), and one composition centred in what is left:

| column | composition | width (of the column) |
|---|---|---|
| before | the map photograph: a man at a desk with microphones, pointing at a wall map; a rectangle whose bottom and sides dissolve through a CSS mask | .62 |
| 1963 | the Teletype Model 33 on its stand, a cutout | .40 |
| 1968 | the NLS console: keyboard, chord keyset, three-button mouse, two hands; a cutout | .70 |
| 2007 | a hand holding the first iPhone (a cutout from the keynote photograph, its cut wrist faded) | .55 |
| now | the voice pill, drawn in code (cancel, thirteen bars, confirm) with the site's cursor about to click confirm | .54 |
| next | the same pill, no cursor, a ring around the confirm button in `--gal-ring` (#2AC5FC) that fixates like the demos' gaze ring (`--gal-gaze-px`, `--gal-gaze-hz`): the eye is on Send | .54 |
| later | no picture: the line `Work leaves the desk.` | |

Every width is a fraction of the column (`--fig` on the `<li>`), so the phone's 260px column scales the whole composition, the pill included (it is drawn on a 240 × 62 unit grid, `--u`). The rail is positioned against `.gallery__body`, the strip's box, so the heading's line count never enters its maths.

`sh tools/make-history.sh` regenerates `assets/history/` from the photographs in `historical/` with `tools/specimen.swift`: Vision lifts each subject, the matte is eroded and softened, the cutout is trimmed and Lanczos-downscaled to about 2× its display width (`--width`), the iPhone is first cropped out of the keynote photograph (`--crop x,y,w,h`, rows from the top) and its cut wrist faded (`--fade-bottom`), and the map is copied as is. The script prints every output's size: those are the `width`/`height` attributes in `index.html`.

How it behaves (`initGallery` in `script.js`):

- At 800px and up, when motion is allowed, the script adds `is-pinned`: the camera (`.gallery__camera`, one viewport tall) sticks to the viewport for the length of the run (`.gallery__run`), whose height the script sets to one viewport + the strip's travel × `--gal-ratio` + `--gal-hold` viewports. The travel is measured (strip width − viewport width), so a Windows scrollbar or an eighth column changes nothing in the CSS.
- The strip eases toward the position the scroll dictates (`--gal-lerp` per 60fps frame, time-based, one frame at a time, stopping when settled: the light rig's loop). While the whole run is off screen it jumps instead, so a leap past it never leaves a stale glide to catch up on re-entry. The last `--gal-hold` of the run holds the end frame, as the reference's last 10% does.
- Each column gets `is-in` once when 30% of it is in view (`IntersectionObserver`): its picture fades up, and columns that arrive in the same frame go left to right `--gal-stagger` ms apart. The lamp and the year do not animate. Under `prefers-reduced-motion`, or without JavaScript, nothing is hidden.
- The rail on the right is a scrollbar for the strip: the thumb is as long as the viewport's share of the strip and sits at the strip's progress. It is decorative (`aria-hidden`).
- Without `is-pinned` (below 800px, under `prefers-reduced-motion`, without JavaScript) the section is as tall as its content and the strip is a native sideways scroller, the columns snapping to the centre. Below 800px the first and last columns centre at rest, the native scrollbar is hidden and the rail lies under the strip, driven by the strip's own scroll; at 800px and up without pinning the native scrollbar stays and the rail is hidden.
- The seams: the section's top and bottom padding (`--gal-seam`) carries a gradient from `--ground-2` into `--ground-3` and back, eased through three `color-mix()` stops (a plain two-stop fallback for browsers without it). The padding is outside the sticky run, so the camera pins on solid black and the top band has scrolled away before the strip starts to move.

Tunables (`:root` in `style.css` unless noted):

| Variable | Meaning |
|---|---|
| `--ground-3` | page-three ground, a warm near-black (#1A1512) |
| `--ink-l1` … `--ink-l4` | the four light inks (92/64/46/22% warm white), the dark-ground twins of `--ink-1` … `--ink-4` |
| `--gal-slot-h`, `--gal-slot-w` | a column's height (30vw × 1.25, capped at 64vh) and width (4:5); every picture is a fraction of the width |
| `--gal-gap`, `--gal-pad` | the gap between columns; the black before the first and after the last (below 800px: centres the end columns) |
| `--gal-head`, `--gal-head-w`, `--gal-head-gap` | the heading's size, its measure (one line at 1440) and its distance from the columns |
| `--gal-light`, `--gal-lamp`, `--gal-marker`, `--gal-ring` | the cone, the lamp, the year, and the ring in the `next` column |
| `--gal-seam` | the length of each fade between `--ground-2` and `--ground-3` (`--seam-h`) |
| `--gal-rail-w` | the rail's thickness |
| `--gal-ratio`, `--gal-hold`, `--gal-lerp`, `--gal-stagger`, `--gal-gaze-px`, `--gal-gaze-hz` (on `.gallery`) | page px per strip px (1.2; the reference is about .9), the end dwell in viewports (.2), the follow speed per frame (.12), the reveal's left-to-right stagger in ms (110), the ring's fixation jitter reach in px (3) and rate (8 a second), read once by `script.js` |

## The chart's tail and the bench

Still inside `section.gallery`, after the run: the black does not change between the history and this block, there is no divider, and the seam out of the black is still the section's bottom padding. `.tail__close` is the closing line, two sentences on two lines (the second is a block at 62%; its `max-width` is 20em, not the layout's 20ch, because Georgia's ch is about .6em and 20ch folds each sentence). `.bench` follows: the small-caps eyebrow with its rule, the heading, three lines in one voice (`Fovea Bar` semibold, then the microphone, then `And more.`), then the specimen: `assets/product/fovea-bar.png` at `min(680px, 100%)`, no frame, no shadow, no plinth, no gradient, no caption. The bench's bottom padding is shorter than the layout's because the seam's dark half adds about 80px of near-black. Spacing and type follow `after-chart-layout.html` from the hand-off; `agent-tail.md` wins where they disagree.

## The product specimen

`sh tools/make-specimen.sh` regenerates `assets/product/fovea-bar.png` (and `fovea-bar-mask.png`, the matte, for inspection) from `assets/product/fovea-bar-src.png` with `tools/specimen.swift`: macOS Vision lifts the subject; when Vision finds nothing (as it does for this render, a screen-filling object on white) the ground is keyed instead, near-white pixels connected to the frame's edge; the matte is eroded by 1px (the object lands on near-black, so no pixel of the render's ground may survive), softened by half a pixel and faded along the bottom edge (`--fade-bottom 240`: the render is cropped there, and the fade sinks the screen into the black instead of ending on a cut); then the source is masked and trimmed to its silhouette with 2px of air. The output must be at least 1360px wide (2× the 680px display); the tool warns otherwise (`--erode 2` if a rim survives; `--width 1360` if the PNG is heavy). Check the edge at 400% on the black with `tools/specimen-check.html` (`?mask` shows the matte, `?zoom=8` magnifies). Copy the printed size into the `<img>`'s `width`/`height`.

## The proof, early access and the footer

Three light blocks on `--ground-2` after the seam, with no rules between them. `.proof` is one paragraph in the 760px column, no heading, 62% ink with the last sentence at full ink: the chart's footnote, not an About section. `.access` is centred: the heading (`Get Early Access`), one line, then the 440px form, left-aligned inside: two underline-only fields (1px `--rule`; focus takes the underline to full ink and changes nothing else; the second is a textarea because it wants a long answer) and the black pill (`Request Access`) at full width, the only solid black shape below the fold. `initForm` is unchanged. `.footer` is light too — the page has one dark region and it is the history. Its body is a grid: the privacy note and, under it, the contact (a mailto, underlined on hover only) on the left; on the right the ghost, `assets/brand/wordmark.svg` inlined once (the only place the wordmark appears on the site), its fill forced to `currentColor` and tinted `--ghost`, `aria-hidden`, not a link, not selectable, top-aligned with the note; the file's viewBox carries about .12 of its height as air, which negative margins take back out so the A's right edge sits on the column's edge. Below 640px it stacks: note, contact, ghost last. Then the legal strip under its hairline: the copyright and Privacy Policy, the only legal link.

Tunables (`:root` in `style.css`):

| Variable | Meaning |
|---|---|
| `--tail-max`, `--tail-narrow` | the reading column (1080px) and the proof's column (760px); the gutter is `--pad-x` |
| `--rule`, `--rule-l` | the legal strip's hairline and the fields' underline on the light ground (14% black); the eyebrow's rule on the black (12% warm white) |
| `--ink-legal` | the legal strip (26% black) |
| `--ghost`, `--ghost-h` | the wordmark's tint (.04: the layout's .055 read as a logo at a glance on the warm ground; it should be legible only if you look for it) and box height (434px wide at 1440; the glyphs are 78% of it) |

The spec's 62% and 38% inks map onto `--ink-l2`/`--ink-l3` on the black and `--ink-2`/`--ink-3` on the light ground. The small tracked-caps labels (the index numbers, ON THE BENCH) are San Francisco at 11–12px with .16–.18em of tracking.

## Typefaces and colours

No web fonts, and no monospace anywhere on the site. `--font-display` is Georgia (regular weight, as in the mockup; also the history's year markers) and `--font-sans` is San Francisco through `-apple-system`, falling back to Helvetica/Arial elsewhere; the Island uses the same stack (the app is SF Pro), and every small label (the index numbers, ON THE BENCH) is the sans in tracked caps. Colours are the tokens at the top of `style.css`; `--white` is the photograph's wall white and the page ground, `--ground-2` is page two's, `--ground-3` is page three's (with `--ink-l1` … `--ink-l4` as its inks), and `--accent` (#2B6BFF) is reserved (nothing on the page draws it now); the gaze ring in the demos has its own lighter blue, `--ring-color` in `demos.css`, and the history's ring is `--gal-ring` (#2AC5FC). The tail's hairlines and the ghost are `--rule`, `--rule-l`, `--ink-legal` and `--ghost`.

## Meta, form and before publishing

- The page ships inside `FoveaNo1/foveafrontend` (the Next.js app behind hellofovea.com) as static files in its `public/` folder, served at `/` by a rewrite in `next.config.ts`; the app's other pages (download, pricing, privacy, the API) are untouched. `landing/` in that repo holds this README and `tools/`; the photograph sources (`historical/`, `assets/plates/src`, `assets/product/fovea-bar-src.png`) stay here, outside the repo. The head's canonical and Open Graph URLs point at hellofovea.com; `og:image` is the app's logo until a 1200×630 card exists; the tab icon is the Fovea app icon (`favicon.ico` with 16/32/48, `assets/brand/icon.svg`, `assets/brand/apple-touch-icon.png`), the same `.ico` being `app/favicon.ico` in the app.
- The form posts `{ email, agents }` to `/api/subscribe`, the app's waitlist endpoint, which writes to the Supabase table `leads` (the `agents` column is the landing page's addition; the endpoint keeps the signup even if the column is missing).
- Verify the footer's privacy line word by word: transcription, referent resolution and routing, local or cloud (copy.md §7). Do not widen it.
- Replace `Fovea` in the copyright with the registered entity once it exists.
- `/privacy/` does not exist yet; Privacy Policy is the only legal link by design (no Terms of Use, no Acceptable Use Policy until there is a product to govern; do not invent placeholder pages).
- The history's `later` line is `Work leaves the desk.`; copy.md's alternative is `The computer's job — without the computer.`

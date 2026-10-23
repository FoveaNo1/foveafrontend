# The landing page's references (Oct 10)

## The model: the reference Yulun picked

A 13-second recording of a wellness product's landing page (a Framer-style template), sent Oct 10.
What the page takes from it, and how each piece is made here:

| In the reference | On our page |
|---|---|
| A white card with rounded corners on a light grey, inset from the window. | `Landing.tsx`: `.frame` (12 px of `#EFEEEB`) round `.card` (white, radius 20). |
| A grey pill nav at the top centre: the name, five links in grey, "Contact us" in a black pill. | `Nav.tsx`: the mark, three pages, Download in a black pill; sticky, its glass blurred over the page. |
| A two-line sans headline at the left, large and tight; at the right a small grey paragraph and two pills, black and light grey. | `Hero.tsx`: "Talk to your agents from the notch." with "Just for now." in grey; the requirements, Download, What leaves your Mac. |
| A picture nearly the card's width, rounded, of moving light: beige above, a blue haze, orange and pink below, pulled in the middle into stretched, wavering columns. | `GradientCanvas.tsx`, a fragment shader: a field of the same light, and a band of columns each sampling it from elsewhere, pulled up or down and repeated along it in long soft ovals; neighbouring columns run into each other; a little grain. The yellow is the app icon's. |
| A statement in large sans, black where you've read to and grey after. | `ScrollWords.tsx`: one number per paragraph from its place on screen; each word's shade from it in CSS. |
| Three small columns under it: two short grey paragraphs, a row of faces with "Over 1 Million satisfied users", a small card of the same light with a white mark. | `Today.tsx`: no tab switching; Claude Code and Codex, in preview, with their icons in a row; a small picture with the loop mark in white. |

Ours adds the notch at the top of the hero's picture (the picture is a screen, and Fovea lives at
its top): it listens and says "Sent" now and then, growing sideways as the app's notch does.

## Earlier research, kept for what still applies

**born.com** (measured live, Oct 10; Framer, Suisse Works and Inter). Its text reveal: each
character an `inline-block` span from `opacity: 0.001; filter: blur(5px)` (10 px on some lines) to
opacity 1 and no blur, staggered, once, when the line comes into view. Ours does the same per word
(`motion/Reveal.tsx`, the rule in `app/(landing)/landing.css`). Its centred nav, its dark rounded news
pill at the foot of the screen and its dark footer are not used now.

**The onboarding** (`FoveaV1/Sources/FoveaOnboarding`, `Rises`): parts rise in with opacity, blur 6
and 18 pt, 0.7 s on `timingCurve(0.2, 0.9, 0.3, 1)`, 0.1 s apart. The page's reveal uses its curve
and duration (`tokens.ts` `Reveal`).

**Other sites looked at:** sesame.com (one inset photograph, a small block of words, Download),
instinct.com (serif paragraphs, doodles round phrases), friend.com (one photograph, one button),
diabrowser.com and granola.ai (very large display type), rauno.me (alternating indents).

**cosmos.so moodboards** (for imagery and type; nothing from them is on the page):
[editorial serif](https://www.cosmos.so/search/elements/serif%20typography%20whitespace),
[minimal editorial](https://www.cosmos.so/search/elements/minimal%20editorial%20typography),
[murmuration](https://www.cosmos.so/search/elements/murmuration%20birds%20black%20and%20white),
[tiny figures](https://www.cosmos.so/search/elements/tiny%20figure%20vast%20landscape),
[light in dark rooms](https://www.cosmos.so/search/elements/light%20beam%20dark%20room%20minimal),
[hands in light](https://www.cosmos.so/search/elements/hand%20in%20light%20black%20and%20white%20film),
[surreal minimal](https://www.cosmos.so/search/elements/surreal%20minimal%20conceptual%20photography).

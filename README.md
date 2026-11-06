# WeaveMeAlone

**WeaveMeAlone** reverse-engineers a tablet weaving pattern: draw the pattern you want the finished band to look like, and it works out the warp threading setup and the turning sequence needed to actually weave it.

## What it does

Given a pattern drawn on a grid (rows = tablets, columns = picks), the app computes:

1. **Warp Threading Setup** — which color goes in which hole (A/B/C/D) for every tablet.
2. **Turning Sequence** — the Forward/Backward turn to give each tablet on every pick.

Tablets can use up to 4 independent colors (one per hole), and the solver searches for a valid turn sequence automatically — you just draw the picture, it works out how to weave it.

## Features

- Canvas-based pattern grid — click/drag to paint, right-click to erase, scroll to zoom
- Customizable color palette (2–8+ colors, click to select, double-click to recolor)
- Resizable grid (tablet count × pick count)
- "Repeating pattern" option — forces each tablet back to its starting position, so the pattern can loop seamlessly
- Warnings for tablets with no valid solution, or more colors than a 4-hole tablet can hold
- "Load Example Pattern" button to see it working on a ready-made design

## Running the app

No build step — it's plain HTML/CSS/JS. From the project root:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Running tests

Tests use [Playwright](https://playwright.dev/) with TypeScript. First-time setup:

```sh
npm install
npx playwright install chromium
```

Then run the suite:

```sh
npm test
```

## Resources

A list of online resources:

WEBSITES, COMMUNITY HUBS
- https://handweaving.net/
- https://www2.cs.arizona.edu/patterns/weaving/CAP/index.html
- https://www.handweaving.net/weaving-software
- http://www.tabletweavingintheoryandpractice.co.uk/
- https://www.tabletweavers.org/
- https://stringcrafter.com/2021/05/15/fleur-de-lis-and-swords/

PATTERNS
- https://twistedthreads.org/
- https://mimbles.com/tablet-weaving/pattern-library/
- https://veleslava.cz/gallery-tablet-woven-patterns/ (just images)

TUTORIALS, GUIDES, PDFs
- https://www2.cs.arizona.edu/patterns/weaving/webdocs/gre_fa.pdf
- https://www2.cs.arizona.edu/patterns/weaving/webdocs/mo/D/FabricAnalysis.pdf
- http://ladyelewys.carpevinumpdx.com/2020/08/27/tablet-weaving-for-the-absolute-beginner-birka-6/ - best place to start, birka pattern with zero twist
- https://www.stringpage.com/tw/twtheory.html - actually this might be the best place to start, very brief yet informative and owell organized

PAID WEBSITES
- https://e-weave-online.thinkific.com/
    - links to http://www.fiberworks-pcw.com/download.htm, which is free

DRAFT DESIGNER
- https://jamespbarrett.github.io/tabletweave/

## Future ideas

Combine the existing app with computer vision (pattern recognition) to get the threading and turning sequence straight from a photo of a woven band, rather than a hand-drawn pattern.

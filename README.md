# Jenifer J — React portfolio

A React application built with **React 19, Motion for React, Lenis, Three.js, and Vite**. The UI is implemented as React components, with React state for navigation, gallery selection, project dialogs, certificate browsing, and notifications. There is no static-page wrapper and no GSAP.

## Run

Requires Node.js 20.19+ or 22.12+ (validated with Node 24).

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview -- --port 4173
```

Deploy `dist/` to a static host. No API keys, database, or backend service are needed. All photographs, documents, covers, and fonts are local.

## React architecture

- `src/main.jsx`: React root and hydration, wrapped in StrictMode.
- `src/App.jsx`: application state and component composition.
- `src/components/Header.jsx`: responsive navigation and active chapter.
- `src/components/Hero.jsx`: pinned, reversible scroll sequence: separating name, opening shutters, complete original portrait, and staggered identity copy.
- `src/components/WorkGallery.jsx`: React gallery selection and Three.js host.
- `src/components/ProjectRail.jsx`: Motion-driven horizontal project sequence.
- `src/components/About.jsx`, `Learning.jsx`, `Contact.jsx`: original personal content.
- `src/components/Choreography.jsx`: scroll-driven text masks, folds, image hinges, number reels, ink wipes, and line drawing.
- `src/components/Dialogs.jsx`: React-controlled native dialogs and document navigation.
- `src/components/Primitives.jsx`: reusable Motion reveals, icons, and word reveal.
- `src/hooks/CinematicProvider.jsx`: motion preferences and one Lenis instance, driven by Motion's frame scheduler.
- `src/hooks/useWebGLScene.js`: abortable React scene lifecycle, readiness state, and GPU cleanup.
- `src/gallery.js`: the custom Three.js gallery renderer and shaders; it owns its canvas, not the React UI.
- `src/data/`: project and certificate content; `src/documents.json` and `works.js`: asset/project inventories.
- `vite.config.js`, `src/entry-server.jsx`: build-time React rendering for SEO and no-JavaScript content. The client hydrates that same React tree.

The interface is predominantly **black and white**. Cobalt (`#0047ff`) is limited to small marks, arrows, status dots, and thin progress indicators. The six chapters alternate dark and light backgrounds.

The landing page is a held, scroll-controlled title sequence. Scrolling separates the oversized name and slides two shutters away from the original portrait. The complete, full-colour photo settles within a bounded frame. Scrolling back reverses the sequence; waiting does not play it. The reveal button advances to the completed portrait, and navigation can skip to any chapter.

Each content type has a different motion treatment: a curved Three.js work ribbon, folded headings, an image hinge, word-by-word reading, number reels, horizontal project scenes with local depth and text motion, a growing education timeline, folding certificate rows, and a letter-by-letter contact close. The previous generic chapter fade wrapper has been removed.

Original photos and certificates use `object-fit: contain` without final-state cropping or filters. The portrait frame is at most 340 pixels wide on desktop and 230 on phones. Motion off and system reduced motion show the completed portrait immediately, remove held layouts and WebGL, and present readable static content. Phones use vertical technical projects with their own scroll entrances.

## Validate

With Playwright and Chromium available, start the production preview and run:

```sh
npm run export:standalone
npm run test:browser
```

Set `TARGET_URL` and `CHROMIUM_PATH` if needed. Playwright is optional for normal development/builds. The checks cover the pinned reveal at 11 screen sizes, timer independence, reverse scrolling, complete image display, non-overlapping final copy, monochrome chapter backgrounds, distinct content animations, drag interaction, project navigation, keyboard focus, all 19 document images, both original PDFs, motion preferences, WebGL context loss, pre-rendered content, and the optional standalone export.

## Content notes

See `CONTENT-SOURCES.md`. The original photos and certificates came from the user's existing portfolio and uploads. The page uses the newer resume screenshot's seven websites and CGPA 8.39. The original downloadable resume PDF still says four websites and 8.34; replace it when the latest PDF is supplied.

Project covers are authored title cards, clearly labelled as covers. They are not screenshots of the external client websites, which this environment could not load. Photos retain their original aspect ratios and use `object-fit: contain`; the temporary portrait shutters slide away completely, without a portrait shader, background key, or grayscale filter.

## Optional portable preview

```sh
npm run export:standalone
```

This bundles the **React application** and its assets into `artifacts/Jenifer-Portfolio.html` for offline preview. The source project remains React; the export is only a convenience. The cloud browser blocks file URLs, so this document is tested by running its complete HTML in a blank browser page and checking that its scenes work without external requests.

To regenerate the authored cover images, run `node scripts/generate-covers.mjs` with Playwright and Chromium available. Checked-in covers are sufficient for ordinary development.

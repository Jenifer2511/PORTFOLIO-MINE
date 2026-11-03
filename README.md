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
- `src/components/Hero.jsx`: portrait scene and Motion scroll transforms.
- `src/components/WorkGallery.jsx`: React gallery selection and Three.js host.
- `src/components/ProjectRail.jsx`: Motion-driven horizontal project sequence.
- `src/components/About.jsx`, `Learning.jsx`, `Contact.jsx`: original personal content.
- `src/components/Dialogs.jsx`: React-controlled native dialogs and document navigation.
- `src/components/Primitives.jsx`: reusable Motion reveals, icons, and word reveal.
- `src/hooks/CinematicProvider.jsx`: motion preferences and one Lenis instance, driven by Motion's frame scheduler.
- `src/hooks/useWebGLScene.js`: abortable React scene lifecycle, readiness state, and GPU cleanup.
- `src/portrait.js`, `src/gallery.js`: custom Three.js renderers and shaders; these own their canvas, not the React UI.
- `src/data/`: project and certificate content; `src/documents.json` and `works.js`: asset/project inventories.
- `vite.config.js`, `src/entry-server.jsx`: build-time React rendering for SEO and no-JavaScript content. The client hydrates that same React tree.

The page keeps the full-screen cinematic portrait, panoramic draggable project ribbon, horizontal technical projects, original certificates, resume download, and contact links. Motion off and system reduced motion dispose the WebGL scenes and use static layouts. Short screens and phones use a vertical project flow.

## Validate

With Playwright and Chromium available, start the production preview and run:

```sh
npm run export:standalone
npm run test:browser
```

Set `TARGET_URL` and `CHROMIUM_PATH` if needed. Playwright is optional for normal development/builds. The checks cover responsive layouts, drag interaction, project navigation, keyboard focus, all 19 document images, both original PDFs, motion preferences, WebGL context loss, pre-rendered content, and the optional standalone export.

## Content notes

See `CONTENT-SOURCES.md`. The original photos and certificates came from the user's existing portfolio and uploads. The page uses the newer resume screenshot's seven websites and CGPA 8.39. The original downloadable resume PDF still says four websites and 8.34; replace it when the latest PDF is supplied.

Project covers are authored title cards, clearly labelled as covers. They are not screenshots of the external client websites, which this environment could not load. The portrait treatment is tuned to the supplied image; review it when changing the crop.

## Optional portable preview

```sh
npm run export:standalone
```

This bundles the **React application** and its assets into `artifacts/Jenifer-Portfolio.html` for offline preview. The source project remains React; the export is only a convenience. The cloud browser blocks file URLs, so this document is tested by running its complete HTML in a blank browser page and checking that its scenes work without external requests.

To regenerate the authored cover images, run `node scripts/generate-covers.mjs` with Playwright and Chromium available. Checked-in covers are sufficient for ordinary development.

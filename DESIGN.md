# Direction: Curiosity, made tangible

The source is Jenifer's combination of web development, AI & Data Science, and creative media. Her name and actual work carry the page: an oversized name opens it, a three-dimensional collection makes the projects tangible, an original award photograph shows creative work beyond the browser, and the contact section closes with an invitation.

Visual system: warm white #eeeee7, charcoal #181818, and lime #c2f564. Manrope throughout. Equal outer margins, large tight display type, square imagery, space instead of dividers, and simple arrow controls. Distinct section layouts avoid repeated feature-card grids.

Sequence: name and portrait → curved freelance gallery → about, photo, facts and toolkit → technical projects → education and original certificates → creative recognition → contact.

Motion: Lenis is the sole smooth-scroll engine. Scroll position drives a physically curved Three.js ring and the word reveal. Motion for React handles entrances without hiding semantic content if scripts fail. CSS handles control feedback. No GSAP or second scroll engine is installed.

The gallery is the signature interaction: scroll, drag, or use previous/next controls, then follow the selected project's actual URL. It has a DOM image-link fallback for reduced motion, no JavaScript, and WebGL failure. Rendering is visibility and change driven, with bounded pixel ratio and disposal of Three.js resources.

## Visual review

Custom Playwright checks and screenshot reviews replace the design skill's bundled draw/inspect/scenes scripts: those script resources were not accessible through the installed cloud skill reader. No claim is made that those bundled inspectors ran, or that a seeded direction was drawn.

Round one found: Unicode arrows absent in the local font; some gallery rear faces distracting through the front ring; a missing space in the mobile role copy. Replaced important glyphs with SVGs, culled the rear half of the ring, and corrected the mobile copy. The gallery fallback now stays visible until the first rendered frame.

Final review criteria: legible name and role on the first screen; one direct work CTA; equal margins; no horizontal document overflow at 1440, 768, and 390 pixels; real documents; clear project-cover provenance; native dialogs; reduced motion and no-JavaScript access. Browser validation evidence is recorded in the completion report. This is an implementation review, not an external design award score.

## Cinematic refinement

Visual thesis: Jenifer's combination of logic and creative media becomes a sequence of spatial portfolio chapters. The source portrait owns the opening; the real client project covers become a full-width cylindrical ribbon; the technical projects become a held horizontal sequence. Quiet about and learning chapters separate the two project scenes.

Stack: one Lenis instance, Motion for React for bounded entrances and scroll values, and two dynamically loaded Three.js modules sharing one core bundle. No GSAP. Pointer effects are restricted to fine pointers. Renderers pause outside the viewport and on hidden documents, and stop drawing when the scene is at rest. Motion off aborts pending initialization and disposes both scenes.

ROUND 1
Seen in one second: a personal portrait and the oversized name.
Idea (one sentence): Jenifer's real identity and portfolio become a sequence of three spatial chapters.
Live thing: a draggable WebGL project ribbon with real destination links.
Layout words by section: hero=portrait-stage / work=curved-ribbon / about=editorial-photo / projects=horizontal-sequence / learning=document-index / contact=typographic-close.
Scores: design 7.5 · usability 7.5 · creativity 7.0 · content 8.0 → overall 7.5
Caps applied: no external inspector score claimed; the bundled inspector resources remain unavailable.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Bright portions of the face became transparent in `/tmp/cinema-hero.png`; restrict the luminance key to the silhouette and keep the face/torso opaque.
2. The initial protection ellipse revealed original background beside the head in `/tmp/cinema-hero-fixed.png`; tighten the protected region and darken partially transparent fringe pixels.
3. Phone metadata was unnecessarily small in `/tmp/cinema-mobile-hero.png`; increase the motion control and bottom metadata, and preserve the supporting sentence's spacing.

ROUND 2
Seen in one second: the original portrait framed by a dark field and the name.
Idea (one sentence): a developer's logic, creative practice, and real work are explored through spatial chapters.
Live thing: scroll, drag, or use the gallery buttons, then open a real project; visitors can switch off cinematic motion at any point.
Layout words by section: hero=portrait-stage / work=curved-ribbon / about=editorial-photo / projects=horizontal-sequence / learning=document-index / contact=typographic-close.
Scores: design 8.0 · usability 8.0 · creativity 7.5 · content 8.0 → overall 7.9
Caps applied: no award or third-party score claimed. These are internal visual review scores, not bundled inspector results.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. A narrow bright hair fringe remained around the keyed image in `/tmp/cinema-hero-fixed.png`; reduce the brightness of partially transparent silhouette pixels while preserving the face.
2. A pinned technical project could receive keyboard focus offscreen; focus now moves that project into the held viewport immediately.
3. Short landscape viewports cannot fit the pinned layouts; they now receive normal vertical sections rather than clipped controls.

Remaining limitation: client-site previews remain original typographic project covers, not live screenshots. The source resume PDF is still the older original. Actual GPU performance should also be checked on a physical phone before public launch; the current browser uses software WebGL.

## React implementation correction

The frontend is now React 19 with Motion for React, Lenis, and Three.js. The earlier vanilla DOM controller was removed. Header state, gallery selection, project and certificate dialogs, mobile navigation, and notifications are React-owned. Motion `useScroll`, `useTransform`, `useMotionValueEvent`, `useAnimate`, `AnimatePresence`, and the shared frame scheduler replace the page-level imperative animation controller. Three.js is isolated behind `useWebGLScene`, with React readiness state and effect cleanup. Production markup is generated from the React tree and hydrated by React; it is not a static HTML UI injected into a React wrapper.

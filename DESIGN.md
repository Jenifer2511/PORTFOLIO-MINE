# Direction: Logic, imagination, cobalt

Jenifer’s web development, AI & Data Science, and creative media practice become six distinct scroll chapters. The opening pairs her name with her complete original portrait in a modest white frame. Large cobalt fields alternate with white project and learning chapters and a black editorial about chapter.

## Visual system

- Palette: cobalt `#0047ff`, black `#101010`, and white `#ffffff`, as requested by the user. Neutral greys support secondary text and image frames. Original photographs and certificates keep their own colours.
- Typography: locally hosted Manrope, tight display type, readable body copy, and explicit project-cover labels.
- Photographs: original aspect ratios, `object-fit: contain`, full colour, no cutouts, masks, zoom, or filters. The desktop portrait frame is at most 360 pixels wide; the phone frame is at most 230 pixels wide. The award photo is at most 480 pixels wide.
- Composition: equal outer margins, squared image frames, strong type, and space between content groups. Distinct layouts carry the sections rather than repeated card grids.

## Scroll sequence

1. Cobalt opening: staggered name and copy entrance, a scroll-linked brand rotation, and a complete framed portrait.
2. White freelance work: a held viewport with a curved Three.js project ribbon. Scroll, drag, or previous/next controls select a real project destination. The gallery camera fits the selected cover within its canvas.
3. Black about chapter: an independent scroll-linked arrival, the complete award photograph, a word-by-word statement, experience, facts, and toolkit.
4. Cobalt technical projects: a held horizontal sequence on larger screens. Scroll position drives the project track and progress controls. Phones and short screens use vertical project sections.
5. White learning chapter: a scroll-linked scale entrance, education, contained certificate thumbnails, original document dialogs, and creative recognition.
6. Cobalt contact: a separate vertical arrival and large typographic close, followed by a black footer.

Native scrolling remains free; wheel events do not force visitors into a page. The fixed navigation follows each chapter and exposes all five destination links on desktop and in the phone/tablet menu.

## Motion and implementation

React 19 owns the interface and state. Motion for React owns entrances, scroll values, chapter transitions, and the shared frame scheduler. Exactly one Lenis instance smooths scrolling. Three.js owns only the project gallery canvas. No GSAP is installed.

The gallery loads dynamically near the viewport. Rendering is visibility and change driven, pixel ratio is bounded, and effects dispose their GPU resources. The original DOM project links remain available until the first rendered frame and after WebGL failure.

The motion toggle and system reduced-motion preference remove pinned layouts and the WebGL scene. Complete photos, document access, and readable project descriptions remain available. Build-time React rendering provides the same semantic content before hydration and without JavaScript.

## Visual review and validation

Custom Playwright checks and screenshot reviews are used because the design skill’s bundled inspector scripts are unavailable through the installed cloud reader. No external design award or inspector score is claimed.

The cobalt review checks the complete portrait at 1440, 768, 390, and 320 pixel widths; the gallery framing; the original award photograph; certificate thumbnails and document dialogs; chapter entrances; and the horizontal technical-project sequence. Automated browser validation also covers responsive overflow, keyboard access, motion preferences, WebGL loss, all 19 documents, original PDF downloads, pre-rendered content, and the optional portable React export.

Project covers are authored title cards, not live website screenshots. Content provenance and the older downloadable resume’s differences are recorded in CONTENT-SOURCES.md.

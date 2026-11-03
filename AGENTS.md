# Portfolio implementation

The user's required frontend stack is React + Lenis + animation libraries. Keep the UI in real React components with React state and scoped hooks. Do not replace it with a static HTML page or an imperative DOM controller.

- React entry: `src/main.jsx`; component tree: `src/App.jsx` and `src/components/`.
- Motion (`motion/react`) owns React animation, scroll MotionValues, and the shared frame scheduler.
- Keep exactly one Lenis instance in `CinematicProvider`. No GSAP, per the user's preference.
- Three.js owns only the canvas inside a React ref. `useWebGLScene` owns scene initialization, abort, readiness, and disposal.
- Personal content and original assets come from the user and their earlier portfolio. Preserve their provenance in `CONTENT-SOURCES.md`.
- `npm run build` pre-renders the React tree, which the client hydrates. `index.html` is only the Vite entry shell.
- Validate with the production build and `npm run test:browser` when Playwright is available. Check mobile, reduced motion, native dialog focus, and WebGL failure fallbacks.
- Each cloud task is isolated. Use the existing checkout; do not create a worktree unless the user asks.

- Visual palette: black, white, and cobalt blue (#0047ff), per the user. Keep the interface predominantly black and white. Cobalt is a minimal accent for arrows, small labels, status dots, and thin progress indicators; no cobalt chapter backgrounds.
- Keep all original photos in full colour and fully visible. Use contained, bounded images; no final-state cropping, portrait cutouts, background keying, or filters. The user explicitly requests a scroll-triggered portrait reveal: temporary shutters may occlude the image during that sequence; the completed photo must be fully visible.
- Give each content type a distinct, reversible scroll animation with Motion and Lenis. The opening must pin and reveal the portrait as scroll progress advances, not on a timer. Keep native scrolling and a reduced-motion alternative.

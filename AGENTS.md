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

- Visual palette: black, white, and cobalt blue (#0047ff), per the user. Use substantial cobalt chapter backgrounds, not lime, mint, or coral accents.
- Keep all original photos in full colour and fully visible. Use contained, bounded images; no cropping, portrait cutouts, zoom, background keying, or filters.
- Give the page distinct scroll-triggered chapters with Motion and Lenis. Keep native scrolling and a reduced-motion alternative.

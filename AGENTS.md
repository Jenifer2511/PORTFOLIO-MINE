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

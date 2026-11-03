import { useEffect, useRef, useState } from "react";
import { useAnimationFrame, useMotionValueEvent } from "motion/react";

/** React owns the host, readiness, and lifetime; Three.js owns its canvas only. */
export function useWebGLScene(
  kind,
  { host, progress, enabled, onSelect, getInitialIndex },
) {
  const api = useRef(null);
  const callbacks = useRef({ onSelect, getInitialIndex });
  callbacks.current = { onSelect, getInitialIndex };
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    if (!enabled || !host.current) return;
    const controller = new AbortController();
    const signal = controller.signal;
    let instance;
    (async () => {
      const module =
        kind === "portrait"
          ? await import("../portrait.js")
          : await import("../gallery.js");
      if (signal.aborted) return;
      const create =
        kind === "portrait" ? module.createPortrait : module.createGallery;
      instance = await create({
        host: host.current,
        signal,
        reducedMotion: false,
        onReady: (value) => {
          if (!signal.aborted) setReady(value);
        },
        onSelect: (work, index) => callbacks.current.onSelect?.(work, index),
        initialIndex: callbacks.current.getInitialIndex?.(),
        initialProgress: progress.get(),
      });
      if (signal.aborted) {
        instance?.dispose();
        return;
      }
      api.current = instance;
      instance?.setScroll(progress.get());
    })().catch((error) => {
      if (!signal.aborted)
        console.info("Static media fallback enabled:", error.message);
    });
    return () => {
      controller.abort();
      instance?.dispose();
      if (api.current === instance) api.current = null;
    };
  }, [kind, host, enabled, progress]);
  useMotionValueEvent(progress, "change", (value) =>
    api.current?.setScroll(value),
  );
  useAnimationFrame((_time, delta) => api.current?.update(delta / 1000));
  return { ready: enabled && ready, api };
}

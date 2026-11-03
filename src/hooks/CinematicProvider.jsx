import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { MotionConfig, useAnimationFrame } from "motion/react";
import Lenis from "lenis";

const CinematicContext = createContext(null);
const serverFalse = () => false;
const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
const preferenceEvent = "jenifer:motion-preference";
let sessionMotionOff = false;

export function useMediaQuery(query) {
  const subscribe = useCallback(
    (listener) => {
      const media = matchMedia(query);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    },
    [query],
  );
  const snapshot = useCallback(() => matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, snapshot, serverFalse);
}
function preferenceSnapshot() {
  let off = sessionMotionOff;
  try {
    off = localStorage.getItem("jenifer-motion") === "off";
  } catch {
    /* Use the session preference. */
  }
  return matchMedia("(prefers-reduced-motion: reduce)").matches || off;
}
function subscribePreference(listener) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  window.addEventListener("storage", listener);
  window.addEventListener(preferenceEvent, listener);
  return () => {
    media.removeEventListener("change", listener);
    window.removeEventListener("storage", listener);
    window.removeEventListener(preferenceEvent, listener);
  };
}

export function CinematicProvider({ children }) {
  const reduced = useSyncExternalStore(
    subscribePreference,
    preferenceSnapshot,
    serverFalse,
  );
  const systemReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const lenis = useRef(null);
  const bookmark = useRef(null);
  const toggleMotion = useCallback(() => {
    const sections = [...document.querySelectorAll("main > section")];
    const section =
      sections
        .filter((node) => node.getBoundingClientRect().top <= 100)
        .at(-1) || sections[0];
    bookmark.current = section
      ? { section, offset: -section.getBoundingClientRect().top }
      : null;
    sessionMotionOff = !preferenceSnapshot();
    try {
      localStorage.setItem("jenifer-motion", sessionMotionOff ? "off" : "on");
    } catch {
      /* Optional persistence. */
    }
    window.dispatchEvent(new Event(preferenceEvent));
  }, []);
  useBrowserLayoutEffect(() => {
    document.documentElement.dataset.motion = reduced ? "off" : "on";
    if (bookmark.current) {
      const { section, offset } = bookmark.current;
      const top = section.getBoundingClientRect().top + scrollY;
      window.scrollTo({
        top:
          top +
          Math.max(0, Math.min(offset, section.offsetHeight - innerHeight)),
        behavior: "instant",
      });
      bookmark.current = null;
    }
  }, [reduced]);
  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    lenis.current = instance;
    if (document.documentElement.classList.contains("menu-is-open"))
      instance.stop();
    return () => {
      instance.destroy();
      if (lenis.current === instance) lenis.current = null;
    };
  }, [reduced]);
  // Motion's shared frame scheduler drives the one Lenis instance.
  useAnimationFrame((time) => lenis.current?.raf(time));
  const value = useMemo(
    () => ({ reduced, systemReduced, toggleMotion, lenis }),
    [reduced, systemReduced, toggleMotion],
  );
  return (
    <CinematicContext.Provider value={value}>
      <MotionConfig reducedMotion={reduced ? "always" : "user"}>
        {children}
      </MotionConfig>
    </CinematicContext.Provider>
  );
}
export function useCinematic() {
  const value = useContext(CinematicContext);
  if (!value) throw new Error("Cinematic components require CinematicProvider");
  return value;
}

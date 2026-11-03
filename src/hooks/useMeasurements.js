import { useEffect } from "react";
export function useMeasurements(ref, measure) {
  useEffect(() => {
    let active = true;
    const update = () => {
      if (active) measure();
    };
    const observer = new ResizeObserver(update);
    if (ref.current) observer.observe(ref.current);
    window.addEventListener("resize", update, { passive: true });
    document.fonts.ready.then(update);
    update();
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref, measure]);
}

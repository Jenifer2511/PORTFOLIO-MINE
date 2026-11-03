import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useCinematic } from "../hooks/CinematicProvider";

/** Each chapter has its own scroll-driven arrival; native scrolling stays free. */
export default function ScrollPage({ children, ...props }) {
  const ref = useRef(null);
  const { reduced } = useCinematic();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 15%"],
  });
  const transform = useTransform(scrollYProgress, (value) => {
    const p = Math.max(0, Math.min(1, value));
    if (props.id === "learning") return `scale(${0.96 + p * 0.04})`;
    if (props.id === "contact") return `translate3d(0,${(1 - p) * 96}px,0)`;
    return `translate3d(0,${(1 - p) * 48}px,0) scale(${0.985 + p * 0.015})`;
  });
  const opacity = useTransform(
    scrollYProgress,
    (value) => 0.72 + Math.max(0, Math.min(1, value)) * 0.28,
  );
  return (
    <section ref={ref} data-scroll-chapter {...props}>
      <motion.div
        className="chapter-content"
        style={{
          transform: reduced ? "none" : transform,
          opacity: reduced ? 1 : opacity,
        }}
      >
        {children}
      </motion.div>
    </section>
  );
}

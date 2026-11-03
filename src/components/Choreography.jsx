import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useCinematic } from "../hooks/CinematicProvider";

export const clamp = (value) => Math.max(0, Math.min(1, value));
export const phase = (value, start, end) =>
  clamp((value - start) / (end - start));

/** Reversible scroll movements. Different content uses different spatial recipes. */
export function ScrollPiece({
  as = "div",
  type = "lift",
  index = 0,
  children,
  className = "",
  start = "start 96%",
  end = "start 58%",
  ...props
}) {
  const ref = useRef(null);
  const { reduced } = useCinematic();
  const { scrollYProgress } = useScroll({ target: ref, offset: [start, end] });
  const transform = useTransform(scrollYProgress, (value) => {
    const p = phase(value, Math.min(index * 0.055, 0.28), 1);
    const n = 1 - p;
    if (type === "hinge")
      return `perspective(1200px) translate3d(0,${n * 48}px,0) rotateY(${-n * 18}deg) rotateZ(${n * 2}deg)`;
    if (type === "fold")
      return `perspective(900px) translate3d(0,${n * 28}px,0) rotateX(${n * 60}deg)`;
    if (type === "reel") return `translate3d(0,${n * 110}%,0)`;
    if (type === "line") return `scaleX(${p})`;
    if (type === "wipe") return `translate3d(0,${n * 18}px,0)`;
    return `translate3d(0,${n * 52}px,0)`;
  });
  const opacity = useTransform(scrollYProgress, (value) =>
    type === "line"
      ? 1
      : 0.15 + phase(value, Math.min(index * 0.055, 0.28), 1) * 0.85,
  );
  const clipPath = useTransform(
    scrollYProgress,
    (value) =>
      `inset(0 ${100 - phase(value, Math.min(index * 0.055, 0.28), 1) * 100}% 0 0)`,
  );
  const Tag = motion[as];
  return (
    <Tag
      ref={ref}
      className={className}
      data-animated={type}
      {...props}
      style={{
        transform: reduced ? "none" : transform,
        opacity: reduced ? 1 : opacity,
        ...(type === "wipe" ? { clipPath: reduced ? "none" : clipPath } : {}),
      }}
    >
      {children}
    </Tag>
  );
}

function AnimatedWord({ children, progress, index, count, mode, reduced }) {
  const transform = useTransform(progress, (value) => {
    const p = phase(
      value,
      (index / (count + 2)) * 0.45,
      0.55 + (index / (count + 2)) * 0.45,
    );
    if (mode === "fold")
      return `perspective(700px) translate3d(0,${(1 - p) * 55}%,0) rotateX(${75 * (1 - p)}deg)`;
    if (mode === "turn")
      return `translate3d(0,${(1 - p) * 105}%,0) rotateZ(${(1 - p) * (index % 2 ? 7 : -7)}deg)`;
    return `translate3d(0,${(1 - p) * 110}%,0)`;
  });
  return (
    <span className="word-window" aria-hidden="true">
      <motion.span
        data-animated="word"
        style={{ transform: reduced ? "none" : transform }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function ScrollHeading({
  as = "h2",
  lines,
  text,
  mode = "lift",
  className = "",
  ...props
}) {
  const ref = useRef(null);
  const { reduced } = useCinematic();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 94%", "start 48%"],
  });
  const rows = lines || [text];
  const count = rows.join(" ").split(" ").length;
  let index = 0;
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`scroll-heading ${className}`}
      aria-label={rows.join(" ")}
      {...props}
    >
      {rows.map((line, i) => (
        <span className="heading-line" key={i}>
          {line.split(" ").map((word) => (
            <AnimatedWord
              key={index}
              progress={scrollYProgress}
              index={index++}
              count={count}
              mode={mode}
              reduced={reduced}
            >
              {word}
            </AnimatedWord>
          ))}
        </span>
      ))}
    </Tag>
  );
}

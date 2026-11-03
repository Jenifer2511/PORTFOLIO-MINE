import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useCinematic } from "../hooks/CinematicProvider";
export const EASE = [0.23, 1, 0.32, 1];
export function Arrow({ direction = "up-right", ...props }) {
  const paths = {
    "up-right": "M5 19 19 5M5 5h14v14",
    right: "M4 12h16m-6-6 6 6-6 6",
    left: "M20 12H4m6-6-6 6 6 6",
    down: "M12 4v16m-6-6 6 6 6-6",
    both: "M3 12h18M7 8l-4 4 4 4m10-8 4 4-4 4",
    copy: "M8 8h12v12H8zM16 4H4v12",
  };
  return (
    <svg
      className="inline-icon"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={paths[direction]} />
    </svg>
  );
}
export function Star() {
  return (
    <svg
      className="brand-star"
      aria-hidden="true"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="9"
      strokeLinecap="round"
    >
      <path d="M50 9v82M9 50h82M21 21l58 58M21 79l58-58" />
    </svg>
  );
}
const statement =
  "I build thoughtful websites that feel intuitive and make everyday tasks easier.";
function Word({ progress, index, count, children }) {
  const { reduced } = useCinematic();
  const opacity = useTransform(progress, (value) =>
    Math.max(0.16, Math.min(1, (value - index / count) * count * 2 + 0.16)),
  );
  return (
    <motion.span aria-hidden="true" style={{ opacity: reduced ? 1 : opacity }}>
      {children}{" "}
    </motion.span>
  );
}
export function WordStatement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 82%", "start 34%"],
  });
  const words = statement.split(" ");
  return (
    <p className="statement" id="word-reveal" ref={ref}>
      <span className="sr-only">{statement}</span>
      {words.map((word, index) => (
        <Word
          key={`${word}-${index}`}
          progress={scrollYProgress}
          index={index}
          count={words.length}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

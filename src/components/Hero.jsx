import { memo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import { useCinematic } from "../hooks/CinematicProvider";
import { Arrow, Star } from "./Primitives";
import { phase } from "./Choreography";

const Hero = memo(function Hero() {
  const section = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const { reduced, lenis } = useCinematic();
  const { scrollYProgress: progress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(progress, "change", (value) => setRevealed(value > 0.68));
  const mainName = useTransform(
    progress,
    (p) =>
      `translate3d(${-phase(p, 0.08, 0.52) * 48}vw,${-phase(p, 0.08, 0.52) * 7}vh,0)`,
  );
  const lastName = useTransform(
    progress,
    (p) =>
      `translate3d(${phase(p, 0.08, 0.52) * 48}vw,${phase(p, 0.08, 0.52) * 7}vh,0)`,
  );
  const titleOpacity = useTransform(progress, (p) => 1 - phase(p, 0.31, 0.58));
  const shutterLeft = useTransform(
    progress,
    (p) => `translate3d(${-101 * (0.16 + 0.84 * phase(p, 0.1, 0.6))}%,0,0)`,
  );
  const shutterRight = useTransform(
    progress,
    (p) => `translate3d(${101 * (0.16 + 0.84 * phase(p, 0.1, 0.6))}%,0,0)`,
  );
  const portrait = useTransform(
    progress,
    (p) =>
      `translate3d(0,${(1 - phase(p, 0.1, 0.6)) * 42}px,0) rotateZ(${(1 - phase(p, 0.1, 0.6)) * -3}deg)`,
  );
  const captionOpacity = useTransform(progress, (p) => phase(p, 0.5, 0.68));
  const leftCopy = useTransform(
    progress,
    (p) => `translate3d(0,${(1 - phase(p, 0.44, 0.72)) * 56}px,0)`,
  );
  const rightCopy = useTransform(
    progress,
    (p) => `translate3d(0,${(1 - phase(p, 0.5, 0.78)) * 64}px,0)`,
  );
  const leftOpacity = useTransform(progress, (p) => phase(p, 0.44, 0.72));
  const rightOpacity = useTransform(progress, (p) => phase(p, 0.5, 0.78));
  const openingOpacity = useTransform(progress, (p) => 1 - phase(p, 0.1, 0.28));
  const progressTransform = useTransform(progress, (p) => `scaleX(${p})`);
  const revealPortrait = (event) => {
    event.preventDefault();
    if (reduced) return;
    const node = section.current;
    const top = revealed
      ? document.querySelector("#work").offsetTop
      : node.offsetTop + (node.offsetHeight - innerHeight) * 0.78;
    if (lenis.current) lenis.current.scrollTo(top, { duration: 1.4 });
    else window.scrollTo({ top, behavior: "smooth" });
  };
  return (
    <section
      ref={section}
      id="home"
      className="hero cinema-hero"
      aria-labelledby="hero-title"
      data-theme="dark"
      data-scroll-chapter
      data-scene="portrait-reveal"
    >
      <div className="hero-stage frame">
        <motion.div
          className="hero-topline"
          style={{ opacity: reduced ? 0 : openingOpacity }}
        >
          <span>
            Independent developer
            <br />
            Creative by instinct.
          </span>
          <span>
            Based in Tamil Nadu, India
            <br />
            Available for what’s next <i className="status-dot" />
          </span>
        </motion.div>
        <motion.h1
          className="hero-title"
          id="hero-title"
          aria-label="JENIFER J."
          style={{ opacity: reduced ? 0 : titleOpacity }}
        >
          <motion.span
            aria-hidden="true"
            className="name-first"
            style={{ transform: reduced ? "none" : mainName }}
          >
            JENIFER
          </motion.span>{" "}
          <motion.span
            aria-hidden="true"
            className="name-last"
            style={{ transform: reduced ? "none" : lastName }}
          >
            J.
          </motion.span>
        </motion.h1>
        <motion.figure
          className="hero-visual"
          style={{ transform: reduced ? "none" : portrait }}
        >
          <div className="portrait-reveal">
            <img
              className="hero-poster"
              src="/images/portrait.jpg"
              alt="Jenifer J, web developer and AI & Data Science student"
              width="1412"
              height="1753"
              fetchPriority="high"
            />
            <motion.span
              className="portrait-shutter shutter-left"
              aria-hidden="true"
              style={{ transform: reduced ? "translateX(-101%)" : shutterLeft }}
            />
            <motion.span
              className="portrait-shutter shutter-right"
              aria-hidden="true"
              style={{ transform: reduced ? "translateX(101%)" : shutterRight }}
            />
          </div>
          <motion.figcaption style={{ opacity: reduced ? 1 : captionOpacity }}>
            <span>Jenifer J.</span>
            <span>Developer. Thinker. Maker.</span>
          </motion.figcaption>
        </motion.figure>
        <motion.div
          className="hero-final-copy hero-left"
          data-animated="hero-copy"
          style={{
            transform: reduced ? "none" : leftCopy,
            opacity: reduced ? 1 : leftOpacity,
          }}
        >
          <span className="eyebrow">
            <Star /> The person behind the pixels
          </span>
          <h2>
            Thoughtful
            <br />
            by nature.
            <br />
            Digital
            <br />
            by design.
          </h2>
        </motion.div>
        <motion.div
          className="hero-final-copy hero-right"
          data-animated="hero-copy"
          style={{
            transform: reduced ? "none" : rightCopy,
            opacity: reduced ? 1 : rightOpacity,
          }}
        >
          <span className="eyebrow">Web development / AI &amp; DS</span>
          <p>I turn complex ideas into thoughtful digital experiences.</p>
          <span className="hero-degree">
            B.Tech AI &amp; Data Science
            <br />
            Class of 2027
          </span>
        </motion.div>
        <motion.p
          className="hero-opening-note"
          style={{ opacity: reduced ? 0 : openingOpacity }}
        >
          A little logic.
          <br />A lot of imagination.
        </motion.p>
        <div className="hero-bottom">
          <span className="hero-chapter">01 / Introduction</span>
          <button
            type="button"
            className="hero-scroll"
            onClick={revealPortrait}
          >
            {revealed ? "Continue to work" : "Scroll to reveal"}{" "}
            <Arrow direction="down" />
          </button>
          <a className="hero-work-link" href="#work">
            Selected work <Arrow />
          </a>
        </div>
        <div className="hero-progress" aria-hidden="true">
          <motion.span
            id="hero-progress"
            style={{ transform: reduced ? "scaleX(1)" : progressTransform }}
          />
        </div>
      </div>
    </section>
  );
});
export default Hero;

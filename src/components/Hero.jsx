import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  stagger,
  useAnimate,
  useScroll,
  useTransform,
} from "motion/react";
import { useCinematic } from "../hooks/CinematicProvider";
import { useMeasurements } from "../hooks/useMeasurements";
import { useWebGLScene } from "../hooks/useWebGLScene";
import { Arrow, EASE, Star } from "./Primitives";

const Hero = memo(function Hero() {
  const { reduced } = useCinematic();
  const [scope, animate] = useAnimate();
  const sticky = useRef(null);
  const host = useRef(null);
  const [height, setHeight] = useState(1);
  const measure = useCallback(
    () => setHeight(sticky.current?.offsetHeight || 1),
    [],
  );
  useMeasurements(sticky, measure);
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (y) =>
    Math.max(0, Math.min(1, y / height)),
  );
  const titleTransform = useTransform(
    progress,
    (p) => `translate3d(0,${-p * 54}px,0) scale(${1 - p * 0.035})`,
  );
  const copyTransform = useTransform(
    progress,
    (p) => `translate3d(0,${-p * 32}px,0)`,
  );
  const copyOpacity = useTransform(progress, (p) => 1 - p * 0.5);
  const brandTransform = useTransform(progress, (p) => `rotate(${p * 65}deg)`);
  const portraitOpacity = useTransform(progress, (p) => {
    const t = Math.max(0, Math.min(1, (p - 0.04) / 0.26));
    return 1 - t * t * (3 - 2 * t);
  });
  const { ready } = useWebGLScene("portrait", {
    host,
    progress,
    enabled: !reduced,
  });
  useEffect(() => {
    if (reduced) {
      animate(
        ".title-letter",
        { opacity: 1, transform: "translateY(0)" },
        { duration: 0 },
      );
      animate(
        ".hero-line",
        { opacity: 1, transform: "translateY(0)" },
        { duration: 0 },
      );
      return;
    }
    const letters = animate(
      ".title-letter",
      { opacity: [0.55, 1], transform: ["translateY(24%)", "translateY(0)"] },
      { duration: 0.9, delay: stagger(0.014), ease: EASE },
    );
    const intro = animate(
      ".hero-line",
      { opacity: [0.5, 1], transform: ["translateY(20px)", "translateY(0)"] },
      { duration: 0.9, ease: EASE },
    );
    return () => {
      letters.stop();
      intro.stop();
    };
  }, [reduced, animate]);
  return (
    <section
      id="home"
      className="hero cinema-hero"
      aria-labelledby="hero-title"
      data-theme="dark"
      ref={scope}
    >
      <div className="hero-sticky frame" ref={sticky}>
        <motion.figure
          className={`hero-visual${ready ? " is-rendered" : ""}`}
          style={{ opacity: reduced ? 1 : portraitOpacity }}
        >
          <img
            className="hero-poster"
            src="/images/portrait.jpg"
            alt="Jenifer J, web developer and AI & Data Science student"
            width="1412"
            height="1753"
            fetchPriority="high"
          />
          <div id="webgl-portrait" aria-hidden="true" ref={host} />
        </motion.figure>
        <motion.div
          className="hero-copy"
          style={{
            transform: reduced ? "none" : copyTransform,
            opacity: reduced ? 1 : copyOpacity,
          }}
        >
          <p className="hero-line">
            A little logic.
            <br /> A lot of imagination.
          </p>
          <p className="hero-description">
            I’m Jenifer. A web developer exploring the space between human ideas
            and digital possibilities.
          </p>
          <a className="primary-link" href="#work">
            Explore my work{" "}
            <span className="round-arrow" aria-hidden="true">
              <Arrow />
            </span>
          </a>
        </motion.div>
        <div className="hero-identity">
          <motion.h1
            id="hero-title"
            className="hero-title"
            aria-label="JENIFER J."
            style={{ transform: reduced ? "none" : titleTransform }}
          >
            {[..."JENIFER J."].map((letter, index) =>
              letter === " " ? (
                " "
              ) : (
                <span key={index} className="title-letter" aria-hidden="true">
                  {letter}
                </span>
              ),
            )}
          </motion.h1>
          <motion.span
            className="hero-brand"
            aria-hidden="true"
            style={{ transform: reduced ? "none" : brandTransform }}
          >
            <Star />
          </motion.span>
        </div>
        <div className="hero-meta">
          <p className="hero-availability">
            <span className="status-dot" aria-hidden="true" /> Open to
            opportunities
          </p>
          <span>B.Tech AI &amp; DS · Class of 2027</span>
          <a href="#work" className="hero-scroll">
            Scroll to discover{" "}
            <span aria-hidden="true">
              <Arrow direction="down" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
});
export default Hero;

import { memo, useEffect } from "react";
import {
  motion,
  stagger,
  useAnimate,
  useScroll,
  useTransform,
} from "motion/react";
import { useCinematic } from "../hooks/CinematicProvider";
import { Arrow, EASE, Star } from "./Primitives";

const Hero = memo(function Hero() {
  const { reduced } = useCinematic();
  const [scope, animate] = useAnimate();
  const { scrollYProgress } = useScroll({
    target: scope,
    offset: ["start start", "end start"],
  });
  const brandTransform = useTransform(
    scrollYProgress,
    (p) => `rotate(${p * 65}deg)`,
  );
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
    const title = animate(
      ".title-letter",
      { opacity: [0.55, 1], transform: ["translateY(24%)", "translateY(0)"] },
      { duration: 0.9, delay: stagger(0.014), ease: EASE },
    );
    const copy = animate(
      ".hero-line",
      { opacity: [0.5, 1], transform: ["translateY(20px)", "translateY(0)"] },
      { duration: 0.9, ease: EASE },
    );
    return () => {
      title.stop();
      copy.stop();
    };
  }, [reduced, animate]);
  return (
    <section
      id="home"
      className="hero cinema-hero"
      aria-labelledby="hero-title"
      data-theme="blue"
      data-scroll-chapter
      ref={scope}
    >
      <div className="hero-sticky frame">
        <div className="hero-identity">
          <h1 id="hero-title" className="hero-title" aria-label="JENIFER J.">
            {[..."JENIFER J."].map((letter, index) =>
              letter === " " ? (
                " "
              ) : (
                <span key={index} className="title-letter" aria-hidden="true">
                  {letter}
                </span>
              ),
            )}
          </h1>
          <motion.span
            className="hero-brand"
            aria-hidden="true"
            style={{ transform: reduced ? "none" : brandTransform }}
          >
            <Star />
          </motion.span>
        </div>
        <div className="hero-copy">
          <p className="hero-line">
            A little logic.
            <br />A lot of imagination.
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
        </div>
        <figure className="hero-visual">
          <div className="portrait-frame">
            <img
              className="hero-poster"
              src="/images/portrait.jpg"
              alt="Jenifer J, web developer and AI & Data Science student"
              width="1412"
              height="1753"
              fetchPriority="high"
            />
            <figcaption>Developer, thinker, maker.</figcaption>
          </div>
        </figure>
        <div className="hero-meta">
          <p className="hero-availability">
            <span className="status-dot" aria-hidden="true" />
            Open to opportunities
          </p>
          <span>B.Tech AI &amp; DS · Class of 2027</span>
          <a href="#work" className="hero-scroll">
            Scroll to discover <Arrow direction="down" />
          </a>
        </div>
      </div>
    </section>
  );
});
export default Hero;

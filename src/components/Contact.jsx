import { memo, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useCinematic } from "../hooks/CinematicProvider";
import { phase, ScrollPiece } from "./Choreography";
import { Arrow } from "./Primitives";

function ContactLetter({ letter, index, progress, reduced }) {
  const transform = useTransform(progress, (value) => {
    const p = phase(value, index * 0.025, 0.66 + index * 0.025);
    return `translate3d(0,${(1 - p) * 112}%,0) rotateZ(${(1 - p) * (index % 2 ? 12 : -12)}deg)`;
  });
  return (
    <span className="contact-letter-window" aria-hidden="true">
      <motion.span
        data-animated="contact-letter"
        style={{ transform: reduced ? "none" : transform }}
      >
        {letter === " " ? "\u00a0" : letter}
      </motion.span>
    </span>
  );
}
const Contact = memo(function Contact({ onCopyEmail }) {
  const section = useRef(null);
  const { reduced } = useCinematic();
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 92%", "start 18%"],
  });
  const arrow = useTransform(
    scrollYProgress,
    (p) => `rotate(${(1 - phase(p, 0.2, 0.9)) * 90}deg)`,
  );
  return (
    <section
      ref={section}
      id="contact"
      className="contact-section frame"
      data-theme="light"
      data-scroll-chapter
      aria-labelledby="contact-title"
    >
      <div className="chapter-label">
        <span>06 / The next chapter</span>
        <span>Yours, perhaps?</span>
      </div>
      <div className="contact-top">
        <ScrollPiece as="p" type="fold">
          <span className="status-dot" aria-hidden="true" /> Open to work,
          collaboration,
          <br />
          and interesting conversations.
        </ScrollPiece>
        <span>
          Your next idea.
          <br />
          Our next chapter.
        </span>
      </div>
      <a
        className="contact-title"
        href="mailto:jenijenifer483@gmail.com?subject=Let%E2%80%99s%20build%20something"
      >
        <h2 id="contact-title" aria-label="LET’S TALK.">
          {[..."LET’S TALK."].map((letter, index) => (
            <ContactLetter
              key={index}
              letter={letter}
              index={index}
              progress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </h2>
        <motion.span
          className="contact-arrow"
          aria-hidden="true"
          style={{ transform: reduced ? "none" : arrow }}
        >
          <Arrow />
        </motion.span>
      </a>
      <ScrollPiece
        type="line"
        end="start 78%"
        className="contact-rule"
        aria-hidden="true"
      />
      <div className="contact-bottom">
        <a href="mailto:jenijenifer483@gmail.com" className="contact-email">
          jenijenifer483@gmail.com
        </a>
        <button
          id="copy-email"
          className="text-link"
          aria-label="Copy email address"
          onClick={onCopyEmail}
        >
          Copy email <Arrow direction="copy" />
        </button>
        <div className="contact-socials">
          <a
            href="https://github.com/Jenifer2511"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <Arrow />
          </a>
          <a
            href="https://www.linkedin.com/in/jeni-jenifer-b75a54299"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn <Arrow />
          </a>
          <a href="/Jenifer-J-Resume.pdf" download>
            Resume <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
});
export default Contact;

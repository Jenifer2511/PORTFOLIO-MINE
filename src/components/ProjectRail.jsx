import { memo, useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import notes from "../data/projects";
import { useCinematic, useMediaQuery } from "../hooks/CinematicProvider";
import { useMeasurements } from "../hooks/useMeasurements";
import { Arrow, Reveal } from "./Primitives";

const covers = {
  resume: {
    title: ["Find your", "next fit."],
    caption: "Resume intelligence",
    category: "AI & natural language processing",
    heading: ["AI Resume Analyzer", "& Job Matcher"],
  },
  nurse: {
    title: ["Care,", "connected."],
    caption: "Smart Nurse",
    category: "AI, IoT & healthcare",
    heading: ["Smart Nurse"],
    symbol: "+",
  },
  complaint: {
    title: ["Every voice", "matters."],
    caption: "Complaint management",
    category: "Full stack application",
    heading: ["Online Complaint", "Management System"],
  },
  chain: {
    title: ["Value.", "In motion."],
    caption: "Blockchain transfers",
    category: "Blockchain development",
    heading: ["Blockchain Money", "Transfer System"],
    symbol: "both",
  },
};
const entries = Object.entries(notes);
const ProjectRail = memo(function ProjectRail({ onOpenProject }) {
  const { reduced, lenis } = useCinematic();
  const compact = useMediaQuery("(max-width: 767px), (max-height: 650px)");
  const section = useRef(null),
    track = useRef(null),
    rows = useRef([]);
  const [travel, setTravel] = useState(0),
    [current, setCurrent] = useState(0);
  const measure = useCallback(() => {
    if (!rows.current[0] || !track.current) return;
    const width = rows.current[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track.current).gap) || 0;
    setTravel((width + gap) * (entries.length - 1));
  }, []);
  useMeasurements(section, measure);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const transform = useTransform(
    scrollYProgress,
    (p) => `translate3d(${-Math.max(0, Math.min(1, p)) * travel}px,0,0)`,
  );
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!compact && !reduced)
      setCurrent(Math.round(Math.max(0, Math.min(1, value)) * 3));
  });
  const goTo = useCallback(
    (index, immediate = false) => {
      const node = section.current;
      if (!node) return;
      const top =
        node.getBoundingClientRect().top +
        scrollY +
        (Math.max(1, node.offsetHeight - innerHeight) * index) /
          (entries.length - 1) +
        1;
      if (lenis.current)
        lenis.current.scrollTo(top, { immediate, duration: 0.8 });
      else
        window.scrollTo({
          top,
          behavior: immediate || reduced ? "instant" : "smooth",
        });
    },
    [lenis, reduced],
  );
  const focusCard = (index, event) => {
    if (compact || reduced) return;
    const row = event.currentTarget;
    requestAnimationFrame(() => {
      if (row.contains(document.activeElement)) goTo(index, true);
    });
  };
  return (
    <section
      id="projects"
      className="projects-section"
      aria-labelledby="projects-title"
      data-theme="light"
      ref={section}
    >
      <div className="projects-sticky frame">
        <div className="section-opening">
          <Reveal as="h2" id="projects-title">
            Beyond the interface.
          </Reveal>
          <Reveal as="p">
            Personal and academic projects.
            <br /> Exploring what code can do.
          </Reveal>
        </div>
        <div className="projects-viewport">
          <motion.div
            className="project-list"
            ref={track}
            style={{ transform: compact || reduced ? "none" : transform }}
          >
            {entries.map(([id, project], index) => {
              const cover = covers[id];
              return (
                <article
                  className="project-row"
                  key={id}
                  ref={(node) => {
                    rows.current[index] = node;
                  }}
                  onFocusCapture={(event) => focusCard(index, event)}
                >
                  <div
                    className={`project-art ${id === "chain" ? "chain" : id}-art`}
                    aria-hidden="true"
                  >
                    <span>
                      {cover.title[0]}
                      <br />
                      {cover.title[1]}
                    </span>
                    <div className="art-caption">{cover.caption}</div>
                    <span className="art-symbol">
                      {cover.symbol === "+" ? (
                        "+"
                      ) : (
                        <Arrow direction={cover.symbol || "up-right"} />
                      )}
                    </span>
                  </div>
                  <div className="project-details">
                    <span className="project-category">{cover.category}</span>
                    <h3>
                      {cover.heading.map((line, i) => (
                        <span key={line}>
                          {i > 0 && <br />}
                          {line}
                        </span>
                      ))}
                    </h3>
                    <p>{project.description}</p>
                    <p className="project-stack">{project.stack}</p>
                    <button
                      className="text-link project-open"
                      data-project={id}
                      onClick={() => onOpenProject(id)}
                    >
                      Explore the project{" "}
                      <span aria-hidden="true">
                        <Arrow />
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>
        <div className="projects-controls">
          <p>Practical problems. New possibilities.</p>
          <div>
            <button
              id="projects-prev"
              className="circle-button"
              aria-label="Previous technical project"
              disabled={current === 0}
              onClick={() => goTo(current - 1)}
            >
              <Arrow direction="left" />
            </button>
            <span id="projects-position" aria-live="polite">
              {current + 1} / {entries.length}
            </span>
            <button
              id="projects-next"
              className="circle-button"
              aria-label="Next technical project"
              disabled={current === entries.length - 1}
              onClick={() => goTo(current + 1)}
            >
              <Arrow direction="right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});
export default ProjectRail;

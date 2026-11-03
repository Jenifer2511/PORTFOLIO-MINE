import { memo, useCallback, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import works from "../works";
import { useCinematic, useMediaQuery } from "../hooks/CinematicProvider";
import { useWebGLScene } from "../hooks/useWebGLScene";
import { Arrow, EASE, Reveal } from "./Primitives";

const WorkGallery = memo(function WorkGallery() {
  const { reduced, lenis } = useCinematic();
  const short = useMediaQuery("(max-height: 650px)");
  const section = useRef(null),
    host = useRef(null),
    fallback = useRef(null);
  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(0),
    initialized = useRef(false);
  const near = useInView(section, { once: true, margin: "500px" });
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, (p) =>
    short || reduced ? 0 : Math.max(0, Math.min(1, p)),
  );
  const onSelect = useCallback((_work, index) => {
    selectedRef.current = index;
    initialized.current = true;
    setSelected(index);
  }, []);
  const getInitialIndex = useCallback(
    () => (initialized.current ? selectedRef.current : undefined),
    [],
  );
  const { ready, api } = useWebGLScene("gallery", {
    host,
    progress,
    enabled: !reduced && near,
    onSelect,
    getInitialIndex,
  });
  const select = (delta) => {
    if (ready && api.current) {
      // An explicit project choice takes over from any unfinished scroll easing.
      lenis.current?.scrollTo(window.scrollY, { immediate: true, force: true });
      window.scrollTo({ top: window.scrollY, behavior: "instant" });
      const node = section.current;
      const actualProgress = short
        ? 0
        : Math.max(
            0,
            Math.min(
              1,
              -node.getBoundingClientRect().top /
                Math.max(1, node.offsetHeight - innerHeight),
            ),
          );
      api.current.setScroll(actualProgress);
      api.current.select(delta);
      return;
    }
    const next = (selected + delta + works.length) % works.length;
    onSelect(works[next], next);
    fallback.current?.children[next].scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "instant",
    });
  };
  const work = works[selected];
  return (
    <section
      id="work"
      className="work-section"
      data-theme="light"
      data-scroll-chapter
      aria-labelledby="work-title"
      ref={section}
    >
      <div className="work-sticky">
        <div className="work-heading frame">
          <Reveal as="h2" id="work-title">
            Made to be used.
          </Reveal>
          <p>
            Selected freelance websites.
            <br /> From first idea to the real world.
          </p>
        </div>
        <div
          className={`gallery-stage${ready ? " has-webgl" : ""}`}
          aria-label="Interactive gallery of freelance projects"
        >
          <div
            className="gallery-fallback"
            id="gallery-fallback"
            ref={fallback}
          >
            {works.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={item.image}
                  alt={`${item.name} project cover`}
                  width="1200"
                  height="800"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
          <div id="webgl-gallery" ref={host} aria-hidden="true" />
          <span className="gallery-hint" aria-hidden="true">
            <Arrow direction="left" /> Drag to explore{" "}
            <Arrow direction="right" />
          </span>
        </div>
        <div className="gallery-bottom frame">
          <div
            className="selected-project"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="project-type" id="gallery-type">
              {work.type}
            </span>
            <a
              id="gallery-link"
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.span
                id="gallery-name"
                key={work.name}
                initial={
                  reduced
                    ? false
                    : { opacity: 0.45, transform: "translateY(6px)" }
                }
                animate={{ opacity: 1, transform: "translateY(0)" }}
                transition={{ duration: 0.24, ease: EASE }}
              >
                {work.name}
              </motion.span>
              <span aria-hidden="true">
                <Arrow />
              </span>
            </a>
          </div>
          <div className="gallery-controls">
            <button
              id="gallery-prev"
              className="circle-button"
              aria-label="Previous project"
              onClick={() => select(-1)}
            >
              <Arrow direction="left" />
            </button>
            <span id="gallery-position" aria-live="off">
              {selected + 1} / {works.length}
            </span>
            <button
              id="gallery-next"
              className="circle-button"
              aria-label="Next project"
              onClick={() => select(1)}
            >
              <Arrow direction="right" />
            </button>
          </div>
        </div>
        <div className="work-footnote frame">
          <span>
            Art directed project covers · Visit each site to explore the work
          </span>
          <a
            href="https://github.com/Jenifer2511"
            target="_blank"
            rel="noopener noreferrer"
          >
            More on GitHub <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
});
export default WorkGallery;

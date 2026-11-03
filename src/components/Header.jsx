import { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useCinematic, useMediaQuery } from "../hooks/CinematicProvider";
import { Arrow, EASE, Star } from "./Primitives";

const links = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "learning", label: "Learning" },
  { id: "contact", label: "Let’s talk" },
];
const Header = memo(function Header({ menuOpen, setMenuOpen }) {
  const { reduced, systemReduced, toggleMotion, lenis } = useCinematic();
  const mobile = useMediaQuery("(max-width: 480px)");
  const [chapter, setChapter] = useState({
    theme: "dark",
    id: "home",
    scrolled: false,
  });
  const chapterRef = useRef(chapter),
    positions = useRef([]),
    menuButton = useRef(null);
  const { scrollY } = useScroll();
  const update = useCallback((y) => {
    let current = positions.current[0];
    for (const section of positions.current)
      if (y + 64 >= section.top) current = section;
    const next = {
      theme: current?.theme || "dark",
      id: current?.id === "projects" ? "work" : current?.id || "home",
      scrolled: y > 80,
    };
    if (
      Object.keys(next).some((key) => next[key] !== chapterRef.current[key])
    ) {
      chapterRef.current = next;
      setChapter(next);
    }
  }, []);
  useEffect(() => {
    let active = true;
    const measure = () => {
      if (!active) return;
      positions.current = [...document.querySelectorAll("main > section")].map(
        (section) => ({
          id: section.id,
          theme: section.dataset.theme,
          top: section.getBoundingClientRect().top + window.scrollY,
        }),
      );
      update(window.scrollY);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure, { passive: true });
    document.fonts.ready.then(measure);
    measure();
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced, update]);
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-is-open", menuOpen);
    if (menuOpen) {
      lenis.current?.stop();
      document.querySelector("#main-nav a")?.focus();
    } else lenis.current?.start();
    const onKey = (event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const onResize = () => {
      if (innerWidth > 480) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      document.documentElement.classList.remove("menu-is-open");
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen, setMenuOpen, lenis]);
  return (
    <header
      className="site-header frame"
      data-theme={chapter.theme}
      data-scrolled={String(chapter.scrolled)}
    >
      <a className="wordmark" href="#home" aria-label="Jenifer J home">
        jenifer
        <span aria-hidden="true">
          <Star />
        </span>
      </a>
      <span className="header-note">Web developer · AI &amp; Data Science</span>
      <button
        id="motion-toggle"
        className="motion-toggle"
        aria-pressed={!reduced}
        aria-label="Motion effects"
        disabled={systemReduced}
        onClick={toggleMotion}
        title={
          systemReduced
            ? "Reduced motion follows your device preference"
            : "Switch cinematic motion on or off"
        }
      >
        <span className="motion-symbol" aria-hidden="true">
          Ⅱ
        </span>
        <span id="motion-state">Motion {reduced ? "off" : "on"}</span>
      </button>
      <button
        className="menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        ref={menuButton}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "Close" : "Menu"} <span aria-hidden="true">+</span>
      </button>
      <motion.nav
        id="main-nav"
        aria-label="Main navigation"
        className={menuOpen ? "open" : ""}
        initial={false}
        animate={
          !mobile || menuOpen
            ? { opacity: 1, transform: "translateY(0)" }
            : { opacity: 0, transform: "translateY(-12px)" }
        }
        transition={{ duration: reduced ? 0 : 0.24, ease: EASE }}
      >
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            aria-current={chapter.id === link.id ? "location" : undefined}
            onClick={() => {
              lenis.current?.start();
              setMenuOpen(false);
            }}
          >
            {link.label}
            {link.id === "contact" && (
              <span aria-hidden="true">
                {" "}
                <Arrow />
              </span>
            )}
          </a>
        ))}
      </motion.nav>
    </header>
  );
});
export default Header;

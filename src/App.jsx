import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CinematicProvider, useCinematic } from "./hooks/CinematicProvider";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WorkGallery from "./components/WorkGallery";
import About from "./components/About";
import ProjectRail from "./components/ProjectRail";
import Learning from "./components/Learning";
import Contact from "./components/Contact";
import { CertificateDialog, ProjectDialog } from "./components/Dialogs";
import { Arrow, EASE, Star } from "./components/Primitives";

const Footer = memo(function Footer({ inert }) {
  return (
    <footer className="site-footer frame" inert={inert}>
      <a className="wordmark" href="#home">
        jenifer
        <span aria-hidden="true">
          <Star />
        </span>
      </a>
      <span>
        Made with curiosity. ©{" "}
        <span id="year">{new Date().getFullYear()}</span> Jenifer J.
      </span>
      <a href="#home" className="text-link">
        Back to the top <Arrow direction="up-right" />
      </a>
    </footer>
  );
});
function Portfolio() {
  const { reduced } = useCinematic();
  const [menuOpen, setMenuOpen] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [project, setProject] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimeout = useRef(null);
  const openCertificate = useCallback((index) => setCertificate(index), []);
  const closeCertificate = useCallback(() => setCertificate(null), []);
  const openProject = useCallback((id) => setProject(id), []);
  const closeProject = useCallback(() => setProject(null), []);
  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("jenijenifer483@gmail.com");
      setToast("Email address copied.");
    } catch {
      setToast("Email me at jenijenifer483@gmail.com");
    }
    clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(""), 3000);
  }, []);
  useEffect(() => () => clearTimeout(toastTimeout.current), []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="main" inert={menuOpen}>
        <Hero />
        <WorkGallery />
        <About />
        <ProjectRail onOpenProject={openProject} />
        <Learning onOpenCertificate={openCertificate} />
        <Contact onCopyEmail={copyEmail} />
      </main>
      <Footer inert={menuOpen} />
      <CertificateDialog
        index={certificate}
        onChange={setCertificate}
        onClose={closeCertificate}
      />
      <ProjectDialog projectId={project} onClose={closeProject} />
      <AnimatePresence>
        {toast && (
          <motion.div
            id="toast"
            className="visible"
            role="status"
            aria-live="polite"
            key={toast}
            initial={{
              opacity: 0,
              transform: reduced ? "translate(-50%,0)" : "translate(-50%,24px)",
            }}
            animate={{ opacity: 1, transform: "translate(-50%,0)" }}
            exit={{
              opacity: 0,
              transform: reduced ? "translate(-50%,0)" : "translate(-50%,24px)",
            }}
            transition={{ duration: 0.24, ease: EASE }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default function App() {
  return (
    <CinematicProvider>
      <Portfolio />
    </CinematicProvider>
  );
}

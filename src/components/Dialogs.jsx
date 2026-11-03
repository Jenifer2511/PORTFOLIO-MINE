import { memo, useEffect, useRef } from "react";
import { motion } from "motion/react";
import documents from "../documents.json";
import labels from "../data/certificates";
import notes from "../data/projects";
import { useCinematic } from "../hooks/CinematicProvider";
import { Arrow, EASE } from "./Primitives";

function NativeDialog({
  id,
  className,
  labelledBy,
  open,
  onClose,
  onKeyDown,
  children,
}) {
  const ref = useRef(null);
  const { lenis } = useCinematic();
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (open) lenis.current?.stop();
    else lenis.current?.start();
    return () => {
      if (open) lenis.current?.start();
    };
  }, [open, lenis]);
  const backdrop = (event) => {
    if (event.target !== event.currentTarget) return;
    const r = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      onClose();
  };
  return (
    <dialog
      ref={ref}
      id={id}
      className={className}
      aria-labelledby={labelledBy}
      data-lenis-prevent
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={backdrop}
      onKeyDown={onKeyDown}
    >
      {children}
    </dialog>
  );
}
export const CertificateDialog = memo(function CertificateDialog({
  index,
  onChange,
  onClose,
}) {
  const { reduced } = useCinematic();
  const current = index ?? 1,
    item = documents[current];
  const move = (delta) =>
    onChange(
      ((current - 1 + delta + documents.length - 1) % (documents.length - 1)) +
        1,
    );
  const extension = item.src.startsWith("data:image/png")
    ? "png"
    : item.src.startsWith("data:")
      ? "jpg"
      : item.src.split(".").pop();
  return (
    <NativeDialog
      id="certificate-dialog"
      className="document-dialog"
      labelledBy="document-title"
      open={index !== null}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
    >
      <div className="dialog-toolbar">
        <h2 id="document-title">{labels[current]}</h2>
        <button
          className="close-dialog circle-button"
          aria-label="Close certificate"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <motion.img
        id="document-image"
        key={current}
        loading="lazy"
        src={item.src}
        alt={item.alt}
        initial={reduced ? false : { opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: EASE }}
      />
      <div className="document-controls">
        <button
          id="document-prev"
          className="text-link"
          onClick={() => move(-1)}
        >
          <Arrow direction="left" /> Previous
        </button>
        <span id="document-position" aria-live="polite">
          {current} of {documents.length - 1}
        </span>
        <button
          id="document-next"
          className="text-link"
          onClick={() => move(1)}
        >
          Next <Arrow direction="right" />
        </button>
      </div>
      <a
        id="document-download"
        download={
          current === 3
            ? "Jenifer-Python-Full-Stack-Certificate.pdf"
            : `Jenifer-${current}.${extension}`
        }
        href={current === 3 ? "/Python-Full-Stack-Certificate.pdf" : item.src}
        className="text-link"
      >
        Download original <Arrow />
      </a>
    </NativeDialog>
  );
});
export const ProjectDialog = memo(function ProjectDialog({
  projectId,
  onClose,
}) {
  const project = notes[projectId || "resume"];
  const { reduced } = useCinematic();
  return (
    <NativeDialog
      id="project-dialog"
      className="project-dialog"
      labelledBy="project-dialog-title"
      open={projectId !== null}
      onClose={onClose}
    >
      <div className="dialog-toolbar">
        <span>Project notes</span>
        <button
          className="close-dialog circle-button"
          aria-label="Close project details"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <motion.div
        id="project-dialog-content"
        key={projectId || "closed"}
        initial={
          reduced || !projectId
            ? false
            : { opacity: 0.5, transform: "translateY(12px)" }
        }
        animate={{ opacity: 1, transform: "translateY(0)" }}
        transition={{ duration: 0.24, ease: EASE }}
      >
        <h2 id="project-dialog-title">{project.title}</h2>
        <p>{project.overview}</p>
        <p>{project.description}</p>
        <h3>What I built</h3>
        <ul>
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <p className="project-stack">{project.stack}</p>
        <a
          className="text-link"
          href="https://github.com/Jenifer2511"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore my GitHub <Arrow />
        </a>
      </motion.div>
    </NativeDialog>
  );
});

import { memo, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useCinematic } from "../hooks/CinematicProvider";
import { ScrollHeading, ScrollPiece, clamp } from "./Choreography";
import { Arrow } from "./Primitives";

const certificates = [
  [
    3,
    "Python Full Stack Development",
    "Networkz Systems · 120 hours · May 2026",
    "jpg",
  ],
  [4, "UI/UX Design", "EDU TANTR Ventures · 2026", "jpg"],
  [5, "AI & Machine Learning", "Entudio · March 2025", "jpg"],
  [
    7,
    "Image Recognition with ML",
    "Simplilearn SkillUp · September 2026",
    "png",
  ],
  [8, "Ignite Bootcamp", "Wadhwani Foundation · March 2026", "jpg"],
];
const education = [
  {
    date: "2023 — 2027 / Pursuing",
    title: "B.Tech, AI & Data Science",
    description: "Rohini College of Engineering and Technology, Kanyakumari",
    extra: "Honors in Creative Media · In progress",
  },
  {
    date: "June 2025 / Internship",
    title: "Web development",
    description: "NSIC Technical Services Centre, Chennai",
    document: 1,
  },
  {
    date: "Internship training",
    title: "UI/UX design",
    description: "EDU TANTR",
    document: 2,
  },
];
const Learning = memo(function Learning({ onOpenCertificate }) {
  const timeline = useRef(null);
  const { reduced } = useCinematic();
  const { scrollYProgress } = useScroll({
    target: timeline,
    offset: ["start 75%", "end 65%"],
  });
  const line = useTransform(scrollYProgress, (p) => `scaleY(${clamp(p)})`);
  return (
    <section
      id="learning"
      className="learning-section"
      data-theme="dark"
      data-scroll-chapter
      aria-labelledby="learning-title"
    >
      <div className="frame">
        <div className="chapter-label">
          <span>05 / Always becoming</span>
          <span>Stay curious. Keep building.</span>
        </div>
        <div className="section-opening">
          <ScrollHeading
            id="learning-title"
            lines={["Never done", "learning."]}
            mode="turn"
          />
          <ScrollPiece as="p" type="lift">
            Degrees, training, and little milestones.
            <br />
            There’s always something next.
          </ScrollPiece>
        </div>
        <div className="learning-layout">
          <div className="education" ref={timeline}>
            <h3>Where I’m growing</h3>
            <div className="education-track" aria-hidden="true">
              <motion.span
                style={{ transform: reduced ? "scaleY(1)" : line }}
              />
            </div>
            {education.map((item, index) => (
              <ScrollPiece
                className="education-item"
                type="lift"
                index={index}
                key={item.title}
              >
                <i className="timeline-point" aria-hidden="true" />
                <span>{item.date}</span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                {item.extra && <p>{item.extra}</p>}
                {item.document && (
                  <button
                    className="text-link certificate-open"
                    data-document={item.document}
                    onClick={() => onOpenCertificate(item.document)}
                  >
                    View certificate <Arrow />
                  </button>
                )}
              </ScrollPiece>
            ))}
          </div>
          <div className="certification-list">
            <div className="list-heading">
              <h3>Learning, documented.</h3>
              <span>Original certificates</span>
            </div>
            {certificates.map(([id, title, description, extension], index) => (
              <ScrollPiece
                as="button"
                type="fold"
                index={index}
                className="cert-row certificate-open"
                data-document={id}
                onClick={() => onOpenCertificate(id)}
                key={id}
              >
                <img
                  src={`/images/document-${id}.${extension}`}
                  alt=""
                  width="160"
                  height="110"
                  loading="lazy"
                />
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <span aria-hidden="true">
                  <Arrow />
                </span>
              </ScrollPiece>
            ))}
            <button
              className="all-certificates text-link"
              id="all-certificates"
              onClick={() => onOpenCertificate(1)}
            >
              Browse all certificates &amp; awards <Arrow />
            </button>
          </div>
        </div>
        <div className="recognition">
          <ScrollHeading
            as="p"
            text="Creative outside the code, too."
            mode="fold"
          />
          <div>
            {[
              [19, "Data Visualization", "First prize · Spectra 2026"],
              [17, "AI Short Film", "Second prize · Spectra 2025"],
              [10, "T-Shirt Painting", "First prize · Sizzle 2026"],
            ].map(([id, title, result], index) => (
              <ScrollPiece
                as="button"
                type="wipe"
                index={index}
                key={id}
                className="certificate-open"
                data-document={id}
                onClick={() => onOpenCertificate(id)}
              >
                <span>{title}</span>
                <strong>{result}</strong>
              </ScrollPiece>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
export default Learning;

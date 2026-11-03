import ScrollPage from "./ScrollPage";
import { memo } from "react";
import { Reveal } from "./Primitives";

const Learning = memo(function Learning({ onOpenCertificate }) {
  return (
    <ScrollPage
      id="learning"
      className="learning-section"
      data-theme="light"
      aria-labelledby="learning-title"
    >
      <div className="frame">
        <div className="section-opening">
          <Reveal as="h2" id="learning-title">
            Always a student.
          </Reveal>
          <Reveal as="p">
            Degrees, training, and little milestones.
            <br /> There’s always something next.
          </Reveal>
        </div>
        <div className="learning-layout">
          <div className="education">
            <h3>Where I’m growing</h3>
            <Reveal as="div" className="education-item">
              <span>2023 — 2027 · Pursuing</span>
              <h4>B.Tech, AI & Data Science</h4>
              <p>Rohini College of Engineering and Technology, Kanyakumari</p>
              <p>Honors in Creative Media · In progress</p>
            </Reveal>
            <Reveal as="div" className="education-item">
              <span>June 2025 · Internship</span>
              <h4>Web development</h4>
              <p>NSIC Technical Services Centre, Chennai</p>
              <button
                className="text-link certificate-open"
                data-document="1"
                onClick={() => onOpenCertificate(1)}
              >
                View certificate{" "}
                <svg
                  className="inline-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </button>
            </Reveal>
            <Reveal as="div" className="education-item">
              <span>Internship training</span>
              <h4>UI/UX design</h4>
              <p>EDU TANTR</p>
              <button
                className="text-link certificate-open"
                data-document="2"
                onClick={() => onOpenCertificate(2)}
              >
                View certificate{" "}
                <svg
                  className="inline-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </button>
            </Reveal>
          </div>
          <div className="certification-list">
            <div className="list-heading">
              <h3>Learning, documented.</h3>
              <span>Original certificates</span>
            </div>
            <Reveal
              as="button"
              className="cert-row certificate-open"
              data-document="3"
              onClick={() => onOpenCertificate(3)}
            >
              <img
                src="/images/document-3.jpg"
                alt=""
                width="160"
                height="110"
                loading="lazy"
              />
              <span>
                <strong>Python Full Stack Development</strong>
                <small>Networkz Systems · 120 hours · May 2026</small>
              </span>
              <span aria-hidden="true">
                <svg
                  className="inline-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </span>
            </Reveal>
            <Reveal
              as="button"
              className="cert-row certificate-open"
              data-document="4"
              onClick={() => onOpenCertificate(4)}
            >
              <img
                src="/images/document-4.jpg"
                alt=""
                width="160"
                height="110"
                loading="lazy"
              />
              <span>
                <strong>UI/UX Design</strong>
                <small>EDU TANTR Ventures · 2026</small>
              </span>
              <span aria-hidden="true">
                <svg
                  className="inline-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </span>
            </Reveal>
            <Reveal
              as="button"
              className="cert-row certificate-open"
              data-document="5"
              onClick={() => onOpenCertificate(5)}
            >
              <img
                src="/images/document-5.jpg"
                alt=""
                width="160"
                height="110"
                loading="lazy"
              />
              <span>
                <strong>AI & Machine Learning</strong>
                <small>Entudio · March 2025</small>
              </span>
              <span aria-hidden="true">
                <svg
                  className="inline-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </span>
            </Reveal>
            <Reveal
              as="button"
              className="cert-row certificate-open"
              data-document="7"
              onClick={() => onOpenCertificate(7)}
            >
              <img
                src="/images/document-7.png"
                alt=""
                width="160"
                height="110"
                loading="lazy"
              />
              <span>
                <strong>Image Recognition with ML</strong>
                <small>Simplilearn SkillUp · September 2026</small>
              </span>
              <span aria-hidden="true">
                <svg
                  className="inline-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </span>
            </Reveal>
            <Reveal
              as="button"
              className="cert-row certificate-open"
              data-document="8"
              onClick={() => onOpenCertificate(8)}
            >
              <img
                src="/images/document-8.jpg"
                alt=""
                width="160"
                height="110"
                loading="lazy"
              />
              <span>
                <strong>Ignite Bootcamp</strong>
                <small>Wadhwani Foundation · March 2026</small>
              </span>
              <span aria-hidden="true">
                <svg
                  className="inline-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </span>
            </Reveal>
            <button
              className="all-certificates text-link"
              id="all-certificates"
              onClick={() => onOpenCertificate(1)}
            >
              Browse all certificates & awards{" "}
              <span aria-hidden="true">
                <svg
                  className="inline-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
      <Reveal as="div" className="recognition frame">
        <p>Creative outside the code, too.</p>
        <div>
          <button
            className="certificate-open"
            data-document="19"
            onClick={() => onOpenCertificate(19)}
          >
            <span>Data Visualization</span>
            <strong>First prize · Spectra 2026</strong>
          </button>
          <button
            className="certificate-open"
            data-document="17"
            onClick={() => onOpenCertificate(17)}
          >
            <span>AI Short Film</span>
            <strong>Second prize · Spectra 2025</strong>
          </button>
          <button
            className="certificate-open"
            data-document="10"
            onClick={() => onOpenCertificate(10)}
          >
            <span>T-Shirt Painting</span>
            <strong>First prize · Sizzle 2026</strong>
          </button>
        </div>
      </Reveal>
    </ScrollPage>
  );
});
export default Learning;

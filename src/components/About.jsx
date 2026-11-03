import ScrollPage from "./ScrollPage";
import { memo } from "react";
import { Reveal, WordStatement } from "./Primitives";

const About = memo(function About() {
  return (
    <ScrollPage
      id="about"
      className="about-section frame"
      data-theme="dark"
      aria-labelledby="about-title"
    >
      <div className="section-opening">
        <Reveal as="h2" id="about-title">
          A mind that
          <br /> keeps exploring.
        </Reveal>
        <Reveal as="div" className="about-opening-copy">
          <p>
            I’m Jenifer, a web developer who likes understanding how things
            work, then making them work a little better.
          </p>
          <a href="/Jenifer-J-Resume.pdf" download className="text-link">
            Get to know my experience{" "}
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
          </a>
        </Reveal>
      </div>
      <div className="about-grid">
        <Reveal as="figure" className="about-photo">
          <img
            src="/images/document-18.jpg"
            alt="Jenifer receiving a prize at the Spectra Data Visualization event"
            width="1000"
            height="750"
            loading="lazy"
          />
          <figcaption>
            Beyond the browser. First prize in Data Visualization, Spectra 2026.
          </figcaption>
        </Reveal>
        <div className="about-story">
          <WordStatement></WordStatement>
          <Reveal as="p">
            That’s what I’m working towards. I’ve spent six months building and
            deploying websites for business and retail clients, taking care of
            everything from responsive interfaces to testing and post launch
            fixes.
          </Reveal>
          <Reveal as="p">
            Alongside freelance work, I’m pursuing a B.Tech in Artificial
            Intelligence and Data Science at Rohini College of Engineering and
            Technology, and an honors course in Creative Media.
          </Reveal>
          <Reveal as="div" className="about-facts">
            <div>
              <strong>7</strong>
              <span>Websites delivered</span>
            </div>
            <div>
              <strong>8.39</strong>
              <span>Current CGPA / 10</span>
            </div>
            <div>
              <strong>2027</strong>
              <span>Expected graduation</span>
            </div>
          </Reveal>
          <p className="more-work">
            Also shipped:{" "}
            <a
              href="https://fida-vert.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fida
            </a>
            ,{" "}
            <a
              href="https://lyca-one.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lyca
            </a>
            , and{" "}
            <a
              href="https://cefabex-innovations.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cefabex Innovations
            </a>
            .
          </p>
        </div>
      </div>
      <Reveal as="div" className="toolkit">
        <h3>A toolkit that keeps growing.</h3>
        <div className="toolkit-groups">
          <div>
            <h4>Interfaces</h4>
            <p>
              React · JavaScript · HTML · CSS
              <br /> Responsive design · Figma
            </p>
          </div>
          <div>
            <h4>Behind the scenes</h4>
            <p>
              Python · Django · Flask · Node.js
              <br /> REST APIs · SQL · Git
            </p>
          </div>
          <div>
            <h4>Intelligence & data</h4>
            <p>
              NLP · scikit-learn · spaCy
              <br /> IoT · Chart.js · Random Forest
            </p>
          </div>
        </div>
      </Reveal>
    </ScrollPage>
  );
});
export default About;

import { memo } from "react";
import { ScrollHeading, ScrollPiece } from "./Choreography";
import { Arrow, WordStatement } from "./Primitives";

const toolkit = [
  [
    "Interfaces",
    "React · JavaScript · HTML · CSS",
    "Responsive design · Figma",
  ],
  [
    "Behind the scenes",
    "Python · Django · Flask · Node.js",
    "REST APIs · SQL · Git",
  ],
  [
    "Intelligence & data",
    "NLP · scikit-learn · spaCy",
    "IoT · Chart.js · Random Forest",
  ],
];
const About = memo(function About() {
  return (
    <section
      id="about"
      className="about-section frame"
      data-theme="dark"
      data-scroll-chapter
      aria-labelledby="about-title"
    >
      <div className="chapter-label">
        <span>03 / A little about me</span>
        <span>Logic meets imagination.</span>
      </div>
      <div className="section-opening">
        <ScrollHeading
          id="about-title"
          lines={["Curiosity is", "my constant."]}
          mode="fold"
        />
        <ScrollPiece className="about-opening-copy" type="lift">
          <p>
            I like understanding how things work, then making them work a little
            better.
          </p>
          <a href="/Jenifer-J-Resume.pdf" download className="text-link">
            Get to know my experience <Arrow />
          </a>
        </ScrollPiece>
      </div>
      <div className="about-grid">
        <ScrollPiece as="figure" className="about-photo" type="hinge">
          <img
            src="/images/document-18.jpg"
            alt="Jenifer receiving a prize at the Spectra Data Visualization event"
            width="1000"
            height="750"
            loading="lazy"
          />
          <figcaption>
            Beyond the browser.
            <br />
            First prize in Data Visualization, Spectra 2026.
          </figcaption>
        </ScrollPiece>
        <div className="about-story">
          <WordStatement />
          <ScrollPiece as="p" type="wipe">
            That’s what I’m working towards. I’ve spent six months building and
            deploying websites for business and retail clients, taking care of
            everything from responsive interfaces to testing and post launch
            fixes.
          </ScrollPiece>
          <ScrollPiece as="p" type="lift">
            Alongside freelance work, I’m pursuing a B.Tech in Artificial
            Intelligence and Data Science at Rohini College of Engineering and
            Technology, and an honors course in Creative Media.
          </ScrollPiece>
          <div className="about-facts">
            {[
              ["7", "Websites delivered"],
              ["8.39", "Current CGPA / 10"],
              ["2027", "Expected graduation"],
            ].map(([number, label], index) => (
              <div key={label}>
                <span className="number-window">
                  <ScrollPiece as="strong" type="reel" index={index}>
                    {number}
                  </ScrollPiece>
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
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
      <div className="toolkit">
        <ScrollHeading
          as="h3"
          text="A toolkit that keeps growing."
          mode="turn"
        />
        <div className="toolkit-groups">
          {toolkit.map(([name, first, second], index) => (
            <ScrollPiece type="wipe" index={index} key={name}>
              <h4>{name}</h4>
              <p>
                {first}
                <br />
                {second}
              </p>
            </ScrollPiece>
          ))}
        </div>
      </div>
    </section>
  );
});
export default About;

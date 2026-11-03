import ScrollPage from "./ScrollPage";
import { memo } from "react";
import { Reveal } from "./Primitives";

const Contact = memo(function Contact({ onCopyEmail }) {
  return (
    <ScrollPage
      id="contact"
      className="contact-section frame"
      data-theme="blue"
      aria-labelledby="contact-title"
    >
      <div className="contact-top">
        <p>
          <span className="status-dot" aria-hidden="true"></span> Open to work,
          collaboration,
          <br /> and interesting conversations.
        </p>
        <span>
          Your next idea.
          <br /> Our next chapter.
        </span>
      </div>
      <a
        className="contact-title"
        href="mailto:jenijenifer483@gmail.com?subject=Let%E2%80%99s%20build%20something"
      >
        <h2 id="contact-title">LET’S TALK.</h2>
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
      </a>
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
          Copy email{" "}
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
              <path d="M8 8h12v12H8zM16 4H4v12" />
            </svg>
          </span>
        </button>
        <div className="contact-socials">
          <a
            href="https://github.com/Jenifer2511"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub{" "}
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
          <a
            href="https://www.linkedin.com/in/jeni-jenifer-b75a54299"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn{" "}
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
          <a href="/Jenifer-J-Resume.pdf" download>
            Resume{" "}
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
        </div>
      </div>
    </ScrollPage>
  );
});
export default Contact;

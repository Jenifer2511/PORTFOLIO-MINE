const projectNotes = {
  resume: {
    title: "AI Resume Analyzer & Job Matcher",
    overview:
      "Making a job search more informed by connecting a candidate’s experience with the skills a role needs.",
    description:
      "A full stack Django application that analyzes PDF and DOCX resumes. It extracts technical skills with natural language processing, identifies skill gaps, and recommends suitable jobs.",
    features: [
      "Resume parsing for PDF and DOCX files",
      "Skill extraction with NLP and spaCy",
      "Job compatibility using TF-IDF and cosine similarity",
      "Results visualized with Chart.js",
    ],
    stack:
      "Python · Django · scikit-learn · spaCy · Chart.js · SQLite · PostgreSQL",
  },
  nurse: {
    title: "Smart Nurse",
    overview:
      "Bringing patient information, sensor readings, and machine learning into one connected application.",
    description:
      "An AI powered IoT patient monitoring project with a React frontend and a Python Flask backend. REST API endpoints connect the interface with sensor data and a Random Forest model.",
    features: [
      "React based patient monitoring interface",
      "Flask REST API endpoints",
      "Integration of IoT sensor data",
      "Random Forest model integration",
    ],
    stack: "React · Python · Flask · REST APIs · IoT · Random Forest",
  },
  complaint: {
    title: "Online Complaint Management System",
    overview:
      "A practical full stack workflow for organizing and managing complaints through a browser.",
    description:
      "Built with a Python Flask backend and SQLite database. HTML, CSS, and JavaScript interfaces connect to backend processes and persistent storage.",
    features: [
      "Browser based complaint workflow",
      "Flask backend application",
      "SQLite data storage",
      "Responsive HTML, CSS, and JavaScript interfaces",
    ],
    stack: "Python · Flask · SQLite · HTML · CSS · JavaScript",
  },
  chain: {
    title: "Blockchain Money Transfer System",
    overview:
      "Exploring how a familiar browser interface can interact with a blockchain development environment.",
    description:
      "A cryptocurrency transfer project with a web frontend connected to a local Ganache blockchain. This is a local development project, rather than a public financial service.",
    features: [
      "Browser based transfer interface",
      "JavaScript frontend integration",
      "Connection to a local Ganache blockchain",
      "Exploration of cryptocurrency transfer workflows",
    ],
    stack: "HTML · CSS · JavaScript · Ganache",
  },
};
export default projectNotes;

import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
import "./cinematic.css";

const root = document.getElementById("root");
const application = (
  <StrictMode>
    <App />
  </StrictMode>
);
if (root.querySelector("main")) hydrateRoot(root, application);
else createRoot(root).render(application);

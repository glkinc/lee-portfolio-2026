import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { parseRoute } from "./lib/router";
import "./styles/index.css";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App initialRoute={parseRoute(window.location.pathname)} />
  </StrictMode>
);

// Production pages are prerendered, so hydrate; in dev the root is empty.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);

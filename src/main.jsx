import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/themeContext.jsx";

gsap.registerPlugin(ScrollTrigger);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);

import { useState, useEffect, useCallback } from "react";

const SECTION_IDS = ["hero", "about", "technologies", "experience", "projects", "contact"];

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [sectionProgress, setSectionProgress] = useState({});

  const update = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const overall = docHeight > 0 ? scrollY / docHeight : 0;
    setProgress(Math.min(1, Math.max(0, overall)));

    const newSectionProgress = {};
    let currentSection = "hero";

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) {
        newSectionProgress[id] = 0;
        continue;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = vh - rect.top;
      const totalTravel = rect.height + vh;
      const sectionProg = Math.min(1, Math.max(0, scrolled / totalTravel));
      newSectionProgress[id] = sectionProg;

      if (rect.top < vh * 0.5 && rect.bottom > vh * 0.5) {
        currentSection = id;
      }
    }

    setSectionProgress(newSectionProgress);
    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    let rafId;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [update]);

  return { progress, activeSection, sectionProgress };
}

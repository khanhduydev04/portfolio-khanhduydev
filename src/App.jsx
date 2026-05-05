import { useState, useEffect } from "react";
import { useTheme } from "./contexts/themeContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PageLoader from "./components/layout/PageLoader";
import CustomCursor from "./components/layout/CustomCursor";
import ScrollProgress from "./components/layout/ScrollProgress";
import World from "./components/three/World";
import HeroOverlay from "./components/sections/HeroOverlay";
import AboutOverlay from "./components/sections/AboutOverlay";
import TechOverlay from "./components/sections/TechOverlay";
import ExperienceOverlay from "./components/sections/ExperienceOverlay";
import ProjectsOverlay from "./components/sections/ProjectsOverlay";
import ContactOverlay from "./components/sections/ContactOverlay";

function MobileFallback() {
  return (
    <div className="font-inter text-neutral-200 antialiased bg-neutral-950 min-h-screen flex items-center justify-center">
      <p className="text-center text-neutral-400 px-4">Best viewed on desktop for the full 3D experience.</p>
    </div>
  );
}

export default function App() {
  const { darkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return <MobileFallback />;
  }

  return (
    <>
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />
      <World />

      <div className="relative z-10 font-inter text-white antialiased">
        <Header />
        <main>
          <HeroOverlay />
          <AboutOverlay />
          <TechOverlay />
          <ExperienceOverlay />
          <ProjectsOverlay />
          <ContactOverlay />
        </main>
        <Footer />
      </div>
    </>
  );
}

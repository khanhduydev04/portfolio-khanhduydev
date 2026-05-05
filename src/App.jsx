import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "./contexts/themeContext";
import { useScrollProgress } from "./hooks/useScrollProgress";
import SceneManager from "./components/three/SceneManager";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PageLoader from "./components/layout/PageLoader";
import CustomCursor from "./components/layout/CustomCursor";
import ScrollProgress from "./components/layout/ScrollProgress";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Technologies from "./components/sections/Technologies";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";

export default function App() {
  const { darkMode } = useTheme();
  const scrollData = useScrollProgress();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />

      {/* Fixed 3D Canvas Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: darkMode ? "#0a0a0a" : "#e8edf5" }}
        >
          <SceneManager scrollData={scrollData} mouse={mouse} darkMode={darkMode} />
        </Canvas>
      </div>

      {/* Scrollable DOM Content */}
      <div className="relative z-10 font-inter text-neutral-900 dark:text-neutral-200 antialiased">
        <Header />
        <main>
          <Hero />
          <About />
          <Technologies />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

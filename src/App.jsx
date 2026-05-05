import { useTheme } from "./contexts/themeContext";
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

  return (
    <>
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />

      <div className="font-inter text-neutral-900 dark:text-neutral-200 antialiased">
        <div className="fixed inset-0 -z-10">
          {darkMode ? (
            <div className="h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />
          ) : (
            <div className="h-full w-full bg-white bg-[radial-gradient(circle_800px_at_50%_200px,#dbeafe,transparent)]" />
          )}
        </div>

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

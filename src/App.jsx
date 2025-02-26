import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Technologies from "./components/Technologies";
import Project from "./components/Project";
import Experience from "./components/Experience";
import Contact from "./components/Contact";

import { useTheme } from "./contexts/themeContext";

import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";

const App = () => {
  const { language, darkMode, toggleLanguage, toggleDarkMode } = useTheme();

  return (
    <div className="font-inter overflow-x-hidden text-gray-900 dark:text-neutral-200 antialiased">
      <div className="fixed top-0 -z-10 size-full">
        {darkMode ? (
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        ) : (
          <div className="absolute inset-0 -z-10 h-full w-full bg-white">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
          </div>
        )}
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative">
        <Header />
        <Hero />
        <About />
        <Technologies />
        <Experience />
        <Project />
        <Contact />
        <div className="fixed bottom-10 right-5 bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200 flex flex-col gap-2 items-center rounded-full py-1 shadow-lg">
          <button className="p-2 cursor-pointer" onClick={toggleLanguage}>
            {language === "vietnamese" ? "EN" : "VI"}
          </button>
          <button className="p-2 cursor-pointer" onClick={toggleDarkMode}>
            {darkMode ? (
              <CiLight className="text-2xl" />
            ) : (
              <CiDark className="text-2xl" />
            )}
          </button>
        </div>
      </div>
      <div className="text-center py-4">
        Copyright 2025 Vo Khanh Duy. All Rights Reserved
      </div>
    </div>
  );
};

export default App;

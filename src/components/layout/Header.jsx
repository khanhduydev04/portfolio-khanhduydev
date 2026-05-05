import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/themeContext";
import { NAV_LINKS } from "../../constants";
import { CiLight, CiDark } from "react-icons/ci";
import { HiMenu, HiX } from "react-icons/hi";
import { gsap } from "gsap";

export default function Header() {
  const { language, darkMode, toggleLanguage, toggleDarkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      gsap.fromTo(
        ".mobile-nav-item",
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [mobileOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xl font-bold text-neutral-900 dark:text-white cursor-none"
        >
          KhanhDuy
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`relative text-sm font-medium transition-colors cursor-none ${
                activeSection === link.id
                  ? "text-cyan-500 dark:text-cyan-400"
                  : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {link.label[language]}
              <span
                className={`absolute -bottom-1 left-1/2 h-[2px] bg-cyan-500 transition-all duration-300 ${
                  activeSection === link.id
                    ? "w-full -translate-x-1/2"
                    : "w-0 -translate-x-1/2"
                }`}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="text-sm font-medium px-2 py-1 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-none"
          >
            {language === "vietnamese" ? "EN" : "VI"}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-none"
          >
            {darkMode ? <CiLight className="text-xl" /> : <CiDark className="text-xl" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 cursor-none"
          >
            {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg z-40">
          <nav className="flex flex-col items-center justify-center h-full gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="mobile-nav-item text-2xl font-medium text-neutral-800 dark:text-neutral-200 cursor-none"
              >
                {link.label[language]}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

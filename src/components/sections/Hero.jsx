import { useEffect } from "react";
import { gsap } from "gsap";
import { useTheme } from "../../contexts/themeContext";
import { HERO_CONTENT } from "../../constants";
import ParticleField from "../three/ParticleField";
import MagneticButton from "../ui/MagneticButton";
import { HiArrowDown } from "react-icons/hi";

export default function Hero() {
  const { language } = useTheme();

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.5 });

    tl.fromTo(
      ".hero-greeting",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    )
      .fromTo(
        ".hero-name span",
        { opacity: 0, y: 50, rotateX: -90 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.04, duration: 0.5, ease: "power3.out" }
      )
      .fromTo(
        ".hero-role",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        ".hero-tagline",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        ".hero-scroll",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );
  }, []);

  const nameChars = HERO_CONTENT.name.split("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleField />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <p className="hero-greeting text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mb-4 opacity-0">
          {HERO_CONTENT.greeting[language]}
        </p>

        <h1 className="hero-name text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-neutral-900 dark:text-white" style={{ perspective: "600px" }}>
          {nameChars.map((char, i) => (
            <span key={i} className="inline-block opacity-0" style={{ transformStyle: "preserve-3d" }}>
              {char === " " ? " " : char}
            </span>
          ))}
        </h1>

        <p className="hero-role text-2xl md:text-3xl font-medium text-cyan-500 dark:text-cyan-400 mb-6 opacity-0">
          {HERO_CONTENT.role[language]}
        </p>

        <p className="hero-tagline text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-10 opacity-0 leading-relaxed">
          {HERO_CONTENT.tagline[language]}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <MagneticButton
            href="/Vo Khanh Duy - Frontend Developer.pdf"
            className="hero-cta inline-block px-6 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors opacity-0"
          >
            Download CV
          </MagneticButton>
          <MagneticButton
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="hero-cta inline-block px-6 py-3 border border-cyan-500 text-cyan-500 rounded-full font-medium hover:bg-cyan-500/10 transition-colors opacity-0"
          >
            {language === "vietnamese" ? "Liên hệ" : "Get in touch"}
          </MagneticButton>
        </div>

        <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0">
          <HiArrowDown className="text-2xl text-neutral-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

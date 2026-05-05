import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTheme } from "../../contexts/themeContext";
import { TECHNOLOGIES } from "../../constants";
import SplitText from "../ui/SplitText";

function MobileFallback() {
  const allTech = [
    ...TECHNOLOGIES.frontend,
    ...TECHNOLOGIES.backend,
    ...TECHNOLOGIES.tools,
  ];
  const containerRef = useRef(null);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll(".tech-item");
    if (!items) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-3 sm:grid-cols-4 gap-4">
      {allTech.map((tech) => (
        <div
          key={tech.name}
          className="tech-item flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 opacity-0 hover:border-cyan-500/50 transition-colors"
        >
          <span className="text-sm text-neutral-300 text-center font-medium">
            {tech.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Technologies() {
  const { language } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="technologies" className="py-20 lg:py-32 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          {language === "vietnamese" ? "Công nghệ" : "Technologies"}
        </SplitText>

        {isMobile ? (
          <MobileFallback />
        ) : (
          <div className="h-[500px] lg:h-[600px]" />
        )}
      </div>
    </section>
  );
}

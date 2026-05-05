import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { TECHNOLOGIES } from "../../constants";

gsap.registerPlugin(ScrollTrigger);

export default function TechOverlay() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 20%", scrub: true },
      });
      gsap.fromTo(contentRef.current, { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "bottom 60%", end: "bottom 30%", scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const allTech = [...TECHNOLOGIES.frontend, ...TECHNOLOGIES.backend, ...TECHNOLOGIES.tools];

  return (
    <section ref={sectionRef} id="technologies" className="h-[100vh] flex items-center justify-center relative">
      <div ref={contentRef} className="max-w-3xl mx-auto px-4 text-center opacity-0">
        <h2 className="text-3xl font-bold text-white mb-10">{language === "vietnamese" ? "Cong nghe" : "Technologies"}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {allTech.map((tech) => (
            <span key={tech.name} className="px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-300 text-sm backdrop-blur-sm bg-cyan-500/5 hover:bg-cyan-500/20 transition-colors">
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

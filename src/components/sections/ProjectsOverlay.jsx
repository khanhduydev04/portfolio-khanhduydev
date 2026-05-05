import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { PROJECTS } from "../../constants";
import { FiExternalLink, FiGithub } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsOverlay() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0 }, {
        opacity: 1, duration: 1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 30%", scrub: true },
      });
      gsap.fromTo(contentRef.current, { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "bottom 60%", end: "bottom 30%", scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="h-[100vh] flex items-center justify-center relative">
      <div ref={contentRef} className="max-w-5xl mx-auto px-4 opacity-0">
        <h2 className="text-3xl font-bold text-white text-center mb-8">{language === "vietnamese" ? "Du an" : "Projects"}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {PROJECTS.map((project, i) => {
            const title = typeof project.title === "string" ? project.title : project.title[language];
            return (
              <div key={i} className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white text-sm leading-tight">{title}</h3>
                  <div className="flex gap-2 shrink-0">
                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-400"><FiExternalLink size={14} /></a>}
                    {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-400"><FiGithub size={14} /></a>}
                  </div>
                </div>
                <p className="text-xs text-neutral-400 mb-3 line-clamp-2">{project.description[language]}</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{tech}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

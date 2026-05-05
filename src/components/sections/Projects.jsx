import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { PROJECTS } from "../../constants";
import SplitText from "../ui/SplitText";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";

function ProjectCard({ project, language, index, onSelect }) {
  const title =
    typeof project.title === "string"
      ? project.title
      : project.title[language];
  const description = project.description[language];

  return (
    <div
      className="project-card opacity-0 cursor-pointer group"
      onClick={() => onSelect(index)}
    >
      <div className="rounded-xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-md border border-neutral-200 dark:border-white/10 hover:border-cyan-500/50 dark:hover:border-cyan-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10">
        {/* Image */}
        <div className="h-40 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
          {project.image ? (
            <img
              src={project.image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-neutral-300 dark:text-neutral-700">
                {title[0]}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-cyan-500 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink size={15} />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-cyan-500 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiGithub size={15} />
                </a>
              )}
            </div>
          </div>

          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight">
            {title}
          </h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ project, language, onClose }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const title =
    typeof project.title === "string"
      ? project.title
      : project.title[language];
  const description = project.description[language];

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  const handleClose = () => {
    gsap.to(contentRef.current, { opacity: 0, y: 20, scale: 0.95, duration: 0.2 });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, delay: 0.1, onComplete: onClose });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {project.image && (
          <div className="h-48 overflow-hidden">
            <img src={project.image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white pr-4">{title}</h3>
            <button onClick={handleClose} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1">
              <FiX size={20} />
            </button>
          </div>

          <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">{description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech) => (
              <span key={tech} className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors">
                <FiExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors">
                <FiGithub size={14} /> Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { language } = useTheme();
  const gridRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const projects = PROJECTS.filter((p) => !p.technologies.includes("TBD"));

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".project-card");
    if (!cards) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, rotateY: -10, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section id="projects" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
          {language === "vietnamese" ? "Dự án" : "Projects"}
        </SplitText>

        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} language={language} index={i} onSelect={setSelectedIndex} />
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <ProjectDetail project={projects[selectedIndex]} language={language} onClose={() => setSelectedIndex(null)} />
      )}
    </section>
  );
}

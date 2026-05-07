import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTheme } from "../../contexts/themeContext";
import SplitText from "../ui/SplitText";
import { FiExternalLink, FiGithub, FiX, FiPlay } from "react-icons/fi";

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
      <div className="rounded-xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10">
        <div className="h-40 overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 relative">
          {project.image ? (
            <img
              src={project.image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-neutral-700">
                {title[0]}
              </span>
            </div>
          )}
          {project.video && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <FiPlay className="text-white text-3xl" />
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-cyan-400 font-mono">
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

          <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors leading-tight">
            {title}
          </h3>

          <p className="text-xs text-neutral-400 mb-3 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-400">
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
    document.body.style.overflow = "hidden";
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 60, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", delay: 0.1 }
    );
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    gsap.to(contentRef.current, { opacity: 0, y: 30, scale: 0.95, duration: 0.25 });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, delay: 0.1, onComplete: onClose });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-neutral-900/95 border border-white/10 shadow-2xl shadow-cyan-500/5 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media area */}
        {(project.video || project.image) && (
          <div className="relative bg-black shrink-0">
            {project.video ? (
              <div className="aspect-video">
                <iframe
                  src={project.video}
                  title={title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : project.image ? (
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1 pr-4">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h3>
              <div className="flex gap-3 mt-2">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <FiExternalLink size={12} /> Live
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <FiGithub size={12} /> Source
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-neutral-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <FiX size={20} />
            </button>
          </div>

          <p className="text-neutral-300 mb-6 leading-relaxed text-sm md:text-base">{description}</p>

          <div className="border-t border-white/10 pt-5">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3 font-medium">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-cyan-400 border border-cyan-500/20 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
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
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/data/projects.json")
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".project-card");
    if (!cards?.length) return;

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
  }, [language, projects]);

  if (!projects.length) return null;

  return (
    <section id="projects" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
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

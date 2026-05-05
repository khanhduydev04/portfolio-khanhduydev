import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { PROJECTS } from "../../constants";
import SplitText from "../ui/SplitText";
import Card3D from "../ui/Card3D";
import { FiExternalLink, FiGithub } from "react-icons/fi";

function ProjectCard({ project, language }) {
  const title =
    typeof project.title === "string"
      ? project.title
      : project.title[language];
  const description = project.description[language];

  return (
    <Card3D className="group h-full rounded-xl overflow-hidden bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-xl hover:shadow-cyan-500/5 transition-shadow duration-300">
      <div className="h-48 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800">
        {project.image ? (
          <img
            src={project.image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-bold text-neutral-300 dark:text-neutral-600 opacity-50">
              {typeof title === "string" ? title[0] : "P"}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">
            {title}
          </h3>
          <div className="flex gap-2 shrink-0">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-cyan-500 transition-colors"
              >
                <FiExternalLink size={18} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-cyan-500 transition-colors"
              >
                <FiGithub size={18} />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Card3D>
  );
}

export default function Projects() {
  const { language } = useTheme();
  const gridRef = useRef(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".project-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.9, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
      }
    );
  }, []);

  return (
    <section id="projects" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
          {language === "vietnamese" ? "Dự án" : "Projects"}
        </SplitText>

        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {PROJECTS.map((project, i) => (
            <div key={i} className="project-card opacity-0">
              <ProjectCard project={project} language={language} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

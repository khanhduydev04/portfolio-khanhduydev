import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { PROJECTS } from "../../constants";
import SplitText from "../ui/SplitText";
import { FiExternalLink, FiGithub } from "react-icons/fi";

function ProjectCard({ project, language, index, total }) {
  const title =
    typeof project.title === "string"
      ? project.title
      : project.title[language];
  const description = project.description[language];

  return (
    <div
      className="project-stack-card absolute inset-0 flex items-center justify-center"
      style={{ zIndex: total - index }}
    >
      <div className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-cyan-400 font-mono">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="flex gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-cyan-400 transition-colors"
              >
                <FiExternalLink size={18} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-cyan-400 transition-colors"
              >
                <FiGithub size={18} />
              </a>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-neutral-300 mb-6 leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const stackRef = useRef(null);
  const projects = PROJECTS.filter((p) => !p.technologies.includes("TBD"));

  useEffect(() => {
    const cards = gsap.utils.toArray(".project-stack-card");
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i === 0) return;

        gsap.set(card, { yPercent: 0, rotateX: 0, opacity: 1, scale: 1 });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: () => `top+=${i * 30}% top`,
          end: () => `top+=${i * 30 + 25}% top`,
          scrub: 0.5,
          onUpdate: (self) => {
            const prev = cards[i - 1];
            gsap.set(prev, {
              yPercent: -self.progress * 100,
              rotateX: self.progress * 15,
              opacity: 1 - self.progress,
              scale: 1 - self.progress * 0.1,
            });
          },
        });
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${cards.length * 30}%`,
        pin: true,
        pinSpacing: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section ref={sectionRef} id="projects" className="min-h-screen py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          {language === "vietnamese" ? "Dự án" : "Projects"}
        </SplitText>

        <div ref={stackRef} className="relative h-[400px]" style={{ perspective: "1000px" }}>
          {projects.map((project, i) => (
            <ProjectCard
              key={i}
              project={project}
              language={language}
              index={i}
              total={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { TITLES, PROJECTS } from "../constants";
import { IoLinkOutline } from "react-icons/io5";
import { motion } from "motion/react";
import { useTheme } from "../contexts/themeContext";

const Project = () => {
  const { language } = useTheme();

  return (
    <section className="border-b border-sky-200 dark:border-neutral-800 pb-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.6 }}
        className="my-20 text-center text-4xl"
      >
        {TITLES.projects[language]}
      </motion.h2>
      <div>
        {PROJECTS.map((project, index) => (
          <div
            className="mb-8 flex flex-wrap lg:justify-center gap-10"
            key={index}
          >
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 1 }}
              className="w-full lg:w-1/4"
            >
              <img
                src={project.image}
                alt={project.title.english}
                className="h-auto lg:h-[220px] mb-6 rounded object-cover mx-auto"
              />
            </motion.div>
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              transition={{ duration: 1 }}
              className="w-full max-w-xl lg:w-3/4"
            >
              <h4 className="mb-2 font-semibold lg:text-lg">
                {project.title[language]}
              </h4>
              {project.role && (
                <p className="my-3 font-medium">{project.role}</p>
              )}
              {project.github && (
                <div className="text-sky-600 relative mb-3 inline-flex items-center gap-1">
                  <IoLinkOutline className="text-xl" />
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium break-words after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
                  >
                    {project.github}
                  </a>
                </div>
              )}
              <p className="mb-4 text-gray-700 dark:text-gray-400">
                {project.description[language]}
              </p>
              {project.technologies.map((technology, index) => (
                <span
                  className="inline-block mr-2 mb-2 rounded px-2 py-1 text-sm font-medium bg-sky-50 text-cyan-950 dark:bg-white/5 dark:text-sky-600"
                  key={index}
                >
                  {technology}
                </span>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Project;

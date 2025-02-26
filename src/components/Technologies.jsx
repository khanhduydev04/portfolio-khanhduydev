import { SKILLS, TITLES } from "../constants";
import { motion } from "motion/react";
import { useTheme } from "../contexts/themeContext";
import { Link } from "react-router-dom";

const getRandomDuration = () => {
  const min = 2;
  const max = 6;
  const step = 0.5;
  const randomValue = Math.random() * (max - min) + min;
  return Math.round(randomValue / step) * step;
};

const iconVariants = (duration) => ({
  initial: { y: -20 },
  animate: {
    y: [20, -20],
    transition: {
      duration: duration,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
});

const Technologies = () => {
  const { language, darkMode } = useTheme();

  return (
    <section className="border-b border-sky-200 dark:border-neutral-800 pb-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 1.2 }}
        className="my-20 text-center text-4xl"
      >
        {TITLES.technologies[language]}
      </motion.h2>
      <motion.div
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 1.2 }}
        className="flex flex-wrap items-center justify-center gap-4 max-w-5xl mx-auto"
      >
        {SKILLS.map((skill, index) => (
          <Link key={index} className="block" to={skill.link} target="_blank">
            <motion.div
              variants={iconVariants(getRandomDuration())}
              initial="initial"
              animate="animate"
              className="flex flex-col items-center justify-center rounded-2xl p-3 transition-all max-w-[84px] max-h-[84px] relative"
            >
              {skill.light && skill.dark ? (
                <img
                  src={darkMode ? skill.dark : skill.light}
                  alt={skill.name}
                  className="max-h-full"
                  loading="lazy"
                />
              ) : (
                <img
                  key={skill.name}
                  src={skill.src}
                  alt={skill.name}
                  className="max-h-full"
                  loading="lazy"
                />
              )}
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
};

export default Technologies;

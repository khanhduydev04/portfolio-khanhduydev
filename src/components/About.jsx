import aboutImg from "../assets/profile/avatar_4.jpg";
import { ABOUT_CONTENT, TITLES } from "../constants";
import { motion } from "motion/react";
import { useTheme } from "../contexts/themeContext";

const About = () => {
  const { language } = useTheme();

  return (
    <section className="border-b border-sky-200 dark:border-neutral-800 pb-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.6 }}
        className="my-20 text-center text-4xl"
      >
        {TITLES.about[language][0]}
        <span className="text-neutral-500">{TITLES.about[language][1]}</span>
      </motion.h2>
      <div className="flex flex-wrap">
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 lg:pl-4"
        >
          <div className="flex items-center justify-center h-auto lg:h-[450px]">
            <img
              src={aboutImg}
              alt="about"
              className="w-[450px] h-full rounded-lg object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 pl-8 lg:pl-4"
        >
          <div className="flex justify-center lg:justify-start">
            <p className="text-sm my-2 max-w-xl py-6 tracking-tighter md:text-lg">
              {ABOUT_CONTENT[language]}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

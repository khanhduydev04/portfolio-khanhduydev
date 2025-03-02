import { TfiDownload } from "react-icons/tfi";
import { HERO_CONTENT, TITLES } from "../constants";
import avatar from "../assets/profile/avatar_1.jpg";
import { motion } from "motion/react";
import { useTheme } from "../contexts/themeContext";

const container = (delay) => ({
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: delay,
    },
  },
});

const Hero = () => {
  const { language } = useTheme();

  return (
    <section className="border-b border-sky-200 dark:border-neutral-800 pb-16 lg:mb-36">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 lg:pl-4">
          <div className="flex flex-col items-center lg:items-start">
            <motion.h1
              variants={container(0)}
              initial="hidden"
              animate="visible"
              className="pb-14 text-5xl tracking-tight lg:mt-16 lg:text-8xl"
            >
              {TITLES.hero[language]}
            </motion.h1>
            <motion.span
              variants={container(0.5)}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-4xl tracking-tight text-transparent"
            >
              Frontend Developer
            </motion.span>
            <motion.p
              variants={container(1)}
              initial="hidden"
              animate="visible"
              className="text-sm my-2 max-w-xl py-6 tracking-tighter md:text-lg"
            >
              {HERO_CONTENT[language]}
            </motion.p>
            <motion.a
              variants={container(1.5)}
              initial="hidden"
              animate="visible"
              href="/Vo Khanh Duy - Frontend Developer.pdf"
              download
              className="flex gap-2 items-center bg-slate-900 text-white mb-8 px-6 py-2 rounded-full font-medium hover:bg-slate-800 dark:text-black dark:bg-neutral-100 dark:hover:bg-neutral-300 transition-colors"
            >
              Download CV <TfiDownload className="text-lg" />
            </motion.a>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:p-8 lg:pr-4">
          <div className="flex justify-center h-auto lg:h-[600px]">
            <motion.img
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              src={avatar}
              alt="Vo Khanh Duy"
              className="w-full h-full rounded-lg object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { CONTACT, TITLES } from "../constants";
import { GoHeartFill } from "react-icons/go";
import { motion } from "motion/react";
import { useTheme } from "../contexts/themeContext";

const Contact = () => {
  const { language } = useTheme();

  return (
    <section className="border-b border-sky-200 dark:border-neutral-800 pb-16">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.6 }}
        className="my-10 text-center text-4xl"
      >
        {TITLES.contact[language]}
      </motion.h2>
      <div className="text-center tracking-tighter">
        <motion.a
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="my-3 underline inline-block"
          href={`mailto:${CONTACT.email}`}
        >
          {CONTACT.email}
        </motion.a>
        <motion.p
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.6 }}
          className="my-3"
        >
          {language === "vietnamese"
            ? "Cám ơn bạn đã lăn chuột tới cuối nha "
            : "Thank you for scrolling to the end "}
          <GoHeartFill className="animate-bounce text-xl inline-block ml-1 text-red-500" />
        </motion.p>
      </div>
    </section>
  );
};

export default Contact;

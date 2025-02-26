import { CONTACT, TITLES } from "../constants";
import { GoHeartFill } from "react-icons/go";
import { motion } from "motion/react";
import { useTheme } from "../contexts/themeContext";
import { useForm, ValidationError } from "@formspree/react";
import { LuSend } from "react-icons/lu";
import { FaRegHandPointRight } from "react-icons/fa6";

// eslint-disable-next-line react/prop-types
function ContactForm({ language }) {
  const [state, handleSubmit] = useForm("mnnjkrwd");
  if (state.succeeded) {
    return (
      <p className="text-center">
        {language == "vietnamese"
          ? "Cảm ơn vì lời nhắn của bạn!"
          : "Thanks for sending!"}
      </p>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-lg mx-auto"
    >
      <input
        id="name"
        type="name"
        name="name"
        placeholder={
          language == "vietnamese" ? "Nhập tên của bạn" : "Enter your name"
        }
        className="bg-transparent rounded-lg w-full py-2 lg:py-3 px-4 lg:px-6 transition border-2 outline-0 border-sky-300 dark:border-neutral-600 focus:border-sky-500"
      />
      <ValidationError prefix="Name" field="name" errors={state.errors} />
      <input
        id="email"
        type="email"
        name="email"
        placeholder={
          language == "vietnamese" ? "Nhập email của bạn" : "Enter your email"
        }
        className="bg-transparent rounded-lg w-full py-2 lg:py-3 px-4 lg:px-6 transition border-2 outline-0 border-sky-300 dark:border-neutral-600 focus:border-sky-500"
      />
      <ValidationError prefix="Email" field="email" errors={state.errors} />
      <textarea
        id="message"
        name="message"
        rows={5}
        placeholder={
          language == "vietnamese" ? "Nhập lời nhắn" : "Enter your message"
        }
        className="bg-transparent rounded-lg w-full py-2 lg:py-3 px-4 lg:px-6 transition border-2 outline-0 border-sky-300 dark:border-neutral-600 focus:border-sky-500"
      />
      <ValidationError prefix="Message" field="message" errors={state.errors} />
      <button
        type="submit"
        disabled={state.submitting}
        className="px-5 py-3 flex gap-2 items-center justify-center font-semibold rounded-full cursor-pointer transition bg-sky-400 hover:bg-sky-500 text-neutral-200 dark:bg-transparent dark:hover:bg-white/10 dark:outline-2 dark:outline-neutral-600 dark:hover:outline-0"
      >
        <LuSend className="text-xl" />
        {language == "vietnamese" ? "Gửi lời nhắn" : "Send Message"}
      </button>
    </form>
  );
}

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
      <ContactForm language={language} />
      <div className="text-center tracking-tighter mt-8">
        <motion.a
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="my-3 inline-flex font-medium gap-3 items-center"
          href={`mailto:${CONTACT.email}`}
        >
          <motion.span
            variants={{
              initial: { x: -6 },
              animate: {
                x: [6, -6],
                transition: {
                  duration: 0.6,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              },
            }}
            initial="initial"
            animate="animate"
          >
            <FaRegHandPointRight className="text-xl text-amber-400" />
          </motion.span>
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

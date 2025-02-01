import React from "react";
import { TITLES, TIMELINE } from "../constants";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from "motion/react";
import { useTheme } from "../contexts/themeContext";

const Experience = () => {
  const { language, darkMode } = useTheme();

  return (
    <section className="border-b border-sky-200 dark:border-neutral-800 pb-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.6 }}
        className="my-20 text-center text-4xl"
      >
        {TITLES.experiences[language]}
      </motion.h2>
      <VerticalTimeline lineColor={darkMode ? "#374151" : "#fff"}>
        {TIMELINE.map((event, index) => (
          <React.Fragment key={index}>
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{
                background: darkMode ? "#222831" : "#FBFBFB",
                boxShadow: "none",
                border: darkMode
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.08)",
                textAlign: "left",
                padding: "1.3rem 2rem",
                borderRadius: "0.5rem",
                color: darkMode ? "#d1d5dc" : "#000",
              }}
              contentArrowStyle={{
                borderRight: `0.4rem solid ${darkMode ? "#6b7280" : "#9ca3af"}`,
              }}
              date={event.time}
              iconStyle={{
                background: darkMode ? "#222831" : "#fff",
                fontSize: "1.4rem",
                color: darkMode ? "#e5e5e5" : "#000",
                boxShadow: darkMode
                  ? "0 0 0 2px #222831, inset 0 2px 0 rgba(255, 255, 255, .2), 0 2px 0 4px rgba(255, 255, 255, .05)"
                  : undefined,
              }}
              icon={event.icon}
            >
              <h3 className="vertical-timeline-element-title font-semibold dark:text-neutral-200">
                {event.title[language]} - {event.company[language]}
              </h3>
              <p className="!font-normal">{event.description[language]}</p>
            </VerticalTimelineElement>
          </React.Fragment>
        ))}
      </VerticalTimeline>
    </section>
  );
};

export default Experience;

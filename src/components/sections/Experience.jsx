import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { EXPERIENCE, EDUCATION } from "../../constants";
import SplitText from "../ui/SplitText";

function TimelineCard({ item, index, language }) {
  const cardRef = useRef(null);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: isLeft ? -60 : 60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 80%" },
      }
    );
  }, [isLeft]);

  return (
    <div className={`flex items-center gap-4 mb-12 ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"} flex-col lg:flex-row`}>
      <div
        ref={cardRef}
        className={`lg:w-[45%] w-full opacity-0 ${isLeft ? "lg:text-right" : "lg:text-left"}`}
      >
        <div className="p-6 rounded-xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <span className="text-sm text-cyan-500 font-medium">{item.time}</span>
          <h3 className="text-lg font-bold mt-1 text-neutral-900 dark:text-white">
            {item.title[language]}
          </h3>
          <p className="text-sm text-purple-500 dark:text-purple-400 font-medium">
            {item.company}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
            {item.description[language]}
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-[10%] justify-center">
        <div className="timeline-dot w-4 h-4 rounded-full bg-cyan-500 border-4 border-white dark:border-neutral-900 shadow-lg shadow-cyan-500/30" />
      </div>

      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}

export default function Experience() {
  const { language } = useTheme();
  const lineRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: true,
        },
      }
    );

    gsap.utils.toArray(".timeline-dot").forEach((dot) => {
      gsap.fromTo(
        dot,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.4,
          ease: "back.out(2)",
          scrollTrigger: { trigger: dot, start: "top 80%" },
        }
      );
    });
  }, []);

  return (
    <section id="experience" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
          {language === "vietnamese" ? "Kinh nghiệm" : "Experience"}
        </SplitText>

        <div className="relative max-w-5xl mx-auto">
          <div
            ref={lineRef}
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500 via-purple-500 to-amber-500 origin-top scale-y-0 -translate-x-1/2"
          />

          {EXPERIENCE.map((item, i) => (
            <TimelineCard key={i} item={item} index={i} language={language} />
          ))}

          <div className="flex items-center gap-4 flex-col lg:flex-row">
            <div className="lg:w-[45%] w-full lg:text-right">
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 dark:border-cyan-500/20">
                <span className="text-sm text-cyan-500 font-medium">{EDUCATION.time}</span>
                <h3 className="text-lg font-bold mt-1 text-neutral-900 dark:text-white">
                  {EDUCATION.degree[language]}
                </h3>
                <p className="text-sm text-purple-500 dark:text-purple-400 font-medium">
                  {EDUCATION.school}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {EDUCATION.major[language]} • GPA: {EDUCATION.gpa}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex w-[10%] justify-center">
              <div className="timeline-dot w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-neutral-900 shadow-lg shadow-amber-500/30" />
            </div>
            <div className="hidden lg:block lg:w-[45%]" />
          </div>
        </div>
      </div>
    </section>
  );
}

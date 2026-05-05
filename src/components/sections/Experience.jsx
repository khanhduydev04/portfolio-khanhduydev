import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { EXPERIENCE, EDUCATION } from "../../constants";
import SplitText from "../ui/SplitText";
import { HiAcademicCap } from "react-icons/hi";

function TimelineNode({ item, index, isEducation = false }) {
  const { language } = useTheme();
  const isTop = index % 2 === 0;

  return (
    <div className="timeline-stop flex-shrink-0 w-[70vw] md:w-[45vw] lg:w-[35vw] relative">
      {/* Card above or below */}
      <div className={`timeline-card ${isTop ? "mb-6" : "mt-6"} ${isTop ? "" : "order-last"}`}>
        <div
          className={`p-5 rounded-xl backdrop-blur-md border transition-all duration-300 ${
            isEducation
              ? "bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30 dark:border-cyan-500/30"
              : "bg-white/70 dark:bg-white/5 border-neutral-200 dark:border-white/10 hover:border-cyan-500/50 dark:hover:border-cyan-500/30"
          }`}
        >
          <span className="text-sm text-cyan-600 dark:text-cyan-400 font-medium font-mono">
            {isEducation ? EDUCATION.time : item.time}
          </span>
          <h3 className="text-base font-bold mt-1 text-neutral-900 dark:text-white">
            {isEducation ? EDUCATION.degree[language] : item.title[language]}
          </h3>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
            {isEducation ? EDUCATION.school : item.company}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
            {isEducation
              ? `${EDUCATION.major[language]} • GPA: ${EDUCATION.gpa}`
              : item.description[language]}
          </p>
        </div>
      </div>

      {/* Node dot - centered */}
      <div className="flex justify-center">
        <div
          className={`timeline-node w-4 h-4 rounded-full border-[3px] border-white dark:border-neutral-900 shadow-lg relative ${
            isEducation
              ? "bg-amber-500 shadow-amber-500/30"
              : "bg-cyan-500 shadow-cyan-500/30"
          }`}
        >
          {isEducation && (
            <HiAcademicCap className="absolute -top-5 left-1/2 -translate-x-1/2 text-amber-500 dark:text-amber-400 text-base" />
          )}
        </div>
      </div>

      {/* Empty space on opposite side */}
      {isTop ? <div className="h-6" /> : null}
    </div>
  );
}

export default function Experience() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      gsap.fromTo(
        ".timeline-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".timeline-node",
        { scale: 0 },
        {
          scale: 1,
          stagger: 0.1,
          duration: 0.3,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const allItems = [
    ...EXPERIENCE.map((item, i) => ({ item, index: i, isEducation: false })),
    { item: null, index: EXPERIENCE.length, isEducation: true },
  ];

  return (
    <section ref={sectionRef} id="experience" className="overflow-hidden">
      <div className="pt-20 lg:pt-32 pb-8 container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-8 text-neutral-900 dark:text-white">
          {language === "vietnamese" ? "Kinh nghiệm" : "Experience"}
        </SplitText>
      </div>

      <div className="relative h-[50vh] flex items-end pb-[25vh]">
        {/* Track line */}
        <div className="absolute left-0 right-0 bottom-[25vh] h-[2px] bg-neutral-300/50 dark:bg-white/10">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Scrollable track */}
        <div ref={trackRef} className="flex items-end gap-12 px-[10vw]">
          {allItems.map(({ item, index, isEducation }) => (
            <TimelineNode
              key={index}
              item={item}
              index={index}
              isEducation={isEducation}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { EXPERIENCE, EDUCATION } from "../../constants";
import SplitText from "../ui/SplitText";
import { HiAcademicCap } from "react-icons/hi";

function TimelineCard({ item, index, isEducation = false, language }) {
  return (
    <div className="timeline-stop flex-shrink-0 w-[80vw] md:w-[400px] lg:w-[420px]">
      <div
        className={`timeline-card p-4 md:p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 h-full ${
          isEducation
            ? "bg-gradient-to-br from-amber-500/10 to-purple-500/10 border-amber-500/30"
            : "bg-white/5 border-white/10 hover:border-cyan-500/30"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              isEducation ? "bg-amber-500" : "bg-cyan-500"
            }`}
          />
          <span className="text-xs text-cyan-400 font-mono font-medium">
            {isEducation ? EDUCATION.time : item.time}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {isEducation ? EDUCATION.degree[language] : item.title[language]}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          {isEducation && <HiAcademicCap className="text-amber-400" />}
          <p className="text-sm text-purple-400 font-medium">
            {isEducation ? EDUCATION.school : item.company}
          </p>
        </div>

        <p className="text-sm text-neutral-400 leading-relaxed">
          {isEducation
            ? `${EDUCATION.major[language]} • GPA: ${EDUCATION.gpa}`
            : item.description[language]}
        </p>
      </div>
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

      if (totalWidth <= 0) return;

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
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.12,
          duration: 0.6,
          ease: "power3.out",
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
      <div className="pt-20 lg:pt-32 pb-12 container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center text-white">
          {language === "vietnamese" ? "Kinh nghiệm" : "Experience"}
        </SplitText>
      </div>

      <div className="relative min-h-[60vh] flex flex-col justify-center">
        <div className="absolute left-0 right-0 top-4 md:top-8 h-[2px] md:h-[3px] bg-white/10">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <div ref={trackRef} className="flex items-start gap-4 md:gap-6 pt-10 md:pt-16 px-[5vw] md:px-[10vw] pb-8">
          {allItems.map(({ item, index, isEducation }) => (
            <TimelineCard
              key={index}
              item={item}
              index={index}
              isEducation={isEducation}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

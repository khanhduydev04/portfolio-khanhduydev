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
    <div className="timeline-stop flex-shrink-0 w-[80vw] md:w-[50vw] lg:w-[40vw] relative flex flex-col items-center">
      {/* Card */}
      <div
        className={`timeline-card w-full max-w-md ${isTop ? "order-1 mb-8" : "order-3 mt-8"}`}
      >
        <div
          className={`p-6 rounded-xl backdrop-blur-md border transition-all duration-300 ${
            isEducation
              ? "bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30"
              : "bg-white/5 border-white/10 hover:border-cyan-500/30"
          }`}
        >
          <span className="text-sm text-cyan-400 font-medium font-mono">
            {isEducation ? EDUCATION.time : item.time}
          </span>
          <h3 className="text-lg font-bold mt-1 text-white">
            {isEducation ? EDUCATION.degree[language] : item.title[language]}
          </h3>
          <p className="text-sm text-purple-400 font-medium">
            {isEducation ? EDUCATION.school : item.company}
          </p>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
            {isEducation
              ? `${EDUCATION.major[language]} • GPA: ${EDUCATION.gpa}`
              : item.description[language]}
          </p>
        </div>
      </div>

      {/* Node on track */}
      <div className="order-2 relative z-10">
        <div
          className={`timeline-node w-5 h-5 rounded-full border-4 border-neutral-900 shadow-lg ${
            isEducation
              ? "bg-amber-500 shadow-amber-500/30"
              : "bg-cyan-500 shadow-cyan-500/30"
          }`}
        >
          {isEducation && (
            <HiAcademicCap className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 text-lg" />
          )}
        </div>
      </div>

      {/* Spacer for opposite side */}
      <div className={`${isTop ? "order-3" : "order-1"} h-24`} />
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
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.6,
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
          stagger: 0.15,
          duration: 0.4,
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
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          {language === "vietnamese" ? "Kinh nghiệm" : "Experience"}
        </SplitText>
      </div>

      <div className="relative h-[60vh] flex items-center">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/10">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <div ref={trackRef} className="flex items-center gap-8 px-[10vw]">
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

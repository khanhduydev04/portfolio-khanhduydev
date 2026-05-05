import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { EXPERIENCE, EDUCATION } from "../../constants";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceOverlay() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 20%", scrub: true },
      });
      gsap.fromTo(contentRef.current, { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "bottom 60%", end: "bottom 30%", scrub: true },
      });

      const cards = contentRef.current?.querySelectorAll(".exp-card");
      cards?.forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, x: i % 2 === 0 ? -30 : 30 }, {
          opacity: 1, x: 0, duration: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: `${20 + i * 15}% center` },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="h-[100vh] flex items-center justify-center relative">
      <div ref={contentRef} className="max-w-3xl mx-auto px-4 opacity-0">
        <h2 className="text-3xl font-bold text-white text-center mb-10">{language === "vietnamese" ? "Kinh nghiem" : "Experience"}</h2>
        <div className="space-y-4">
          {EXPERIENCE.map((item, i) => (
            <div key={i} className="exp-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 opacity-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-white">{item.title[language]}</h3>
                <span className="text-xs text-cyan-400">{item.time}</span>
              </div>
              <p className="text-sm text-purple-400 mb-1">{item.company}</p>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.description[language]}</p>
            </div>
          ))}
          <div className="exp-card p-4 rounded-xl backdrop-blur-md bg-cyan-500/5 border border-cyan-500/20 opacity-0">
            <h3 className="font-bold text-white">{EDUCATION.degree[language]}</h3>
            <p className="text-sm text-purple-400">{EDUCATION.school} &bull; {EDUCATION.time}</p>
            <p className="text-xs text-neutral-400">{EDUCATION.major[language]} &bull; GPA: {EDUCATION.gpa}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

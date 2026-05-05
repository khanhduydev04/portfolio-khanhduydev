import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { ABOUT_CONTENT, STATS } from "../../constants";
import profileImg from "../../assets/profile/avatar_1.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function AboutOverlay() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 20%", scrub: true },
      });
      gsap.fromTo(contentRef.current, { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "bottom 60%", end: "bottom 30%", scrub: true },
      });

      const statEls = contentRef.current?.querySelectorAll(".stat-value");
      statEls?.forEach((el, i) => {
        const target = parseFloat(el.dataset.value);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2, delay: i * 0.2, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 50%" },
          onUpdate: () => { el.textContent = target % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(2); },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="h-[100vh] flex items-center justify-center relative">
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center opacity-0">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-75 blur-sm" />
            <img src={profileImg} alt="Vo Khanh Duy" className="relative w-64 h-64 lg:w-72 lg:h-72 object-cover rounded-2xl" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">{language === "vietnamese" ? "Ve toi" : "About Me"}</h2>
          <p className="text-neutral-300 leading-relaxed mb-8">{ABOUT_CONTENT[language]}</p>
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label.english} className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  <span className="stat-value" data-value={stat.value}>0</span>{stat.suffix}
                </div>
                <p className="text-xs text-neutral-400 mt-1">{stat.label[language]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

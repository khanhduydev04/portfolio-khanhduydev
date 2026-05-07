import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { ABOUT_CONTENT, STATS } from "../../constants";
import SplitText from "../ui/SplitText";
import avatarImg from "../../assets/profile/avatar_1.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.8, x: -50 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );

      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );

      const statValues = statsRef.current?.querySelectorAll(".stat-value");
      statValues?.forEach((el, i) => {
        const target = parseFloat(el.dataset.value);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          delay: 0.5 + i * 0.2,
          ease: "power2.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
          onUpdate: () => {
            el.textContent =
              target % 1 === 0
                ? Math.floor(obj.val)
                : obj.val.toFixed(2);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          {language === "vietnamese" ? "Về tôi" : "About Me"}
        </SplitText>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div ref={imageRef} className="flex justify-center opacity-0">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={avatarImg}
                alt="Vo Khanh Duy"
                className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-2xl object-cover"
              />
            </div>
          </div>

          <div ref={textRef} className="opacity-0">
            <p className="text-base lg:text-lg text-neutral-300 leading-relaxed">
              {ABOUT_CONTENT[language]}
            </p>

            <div ref={statsRef} className="grid grid-cols-3 gap-6 mt-10">
              {STATS.map((stat) => (
                <div key={stat.label.english} className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">
                    <span className="stat-value" data-value={stat.value}>
                      0
                    </span>
                    <span>{stat.suffix}</span>
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">
                    {stat.label[language]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

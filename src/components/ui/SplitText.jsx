import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SplitText({ children, className = "", delay = 0 }) {
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimated.current) return;
    hasAnimated.current = true;

    const text = el.textContent;
    el.innerHTML = "";

    const chars = text.split("").map((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? " " : char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(40px)";
      el.appendChild(span);
      return span;
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.03,
          delay,
          ease: "power3.out",
        });
      },
      once: true,
    });

    return () => trigger.kill();
  }, [children, delay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

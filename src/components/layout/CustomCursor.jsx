import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const dot = dotRef.current;
    const circle = circleRef.current;

    const moveCursor = (e) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(circle, { x: e.clientX, y: e.clientY, duration: 0.3 });
    };

    const grow = () => gsap.to(circle, { scale: 1.5, opacity: 0.5, duration: 0.3 });
    const shrink = () => gsap.to(circle, { scale: 1, opacity: 1, duration: 0.3 });

    window.addEventListener("mousemove", moveCursor);

    const addListeners = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };

    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="hidden md:block fixed top-0 left-0 w-2 h-2 bg-cyan-500 rounded-full pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div
        ref={circleRef}
        className="hidden md:block fixed top-0 left-0 w-8 h-8 border border-cyan-500 rounded-full pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
    </>
  );
}

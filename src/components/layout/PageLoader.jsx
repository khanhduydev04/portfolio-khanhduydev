import { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setLoading(false),
    });

    tl.to(".loader-text", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    })
      .to(".loader-text", {
        opacity: 0,
        scale: 1.2,
        duration: 0.4,
        delay: 0.5,
      })
      .to(".loader-overlay", {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      });
  }, []);

  if (!loading) return null;

  return (
    <div className="loader-overlay fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center">
      <h1 className="loader-text text-4xl font-bold text-white opacity-0 translate-y-4">
        KhanhDuy
      </h1>
    </div>
  );
}

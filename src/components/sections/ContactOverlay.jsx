import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { CONTACT } from "../../constants";
import MagneticButton from "../ui/MagneticButton";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker, HiCheck } from "react-icons/hi";

gsap.registerPlugin(ScrollTrigger);

export default function ContactOverlay() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 30%", scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const socialLinks = [
    { icon: FaGithub, url: CONTACT.social.github, label: "GitHub" },
    { icon: FaLinkedin, url: CONTACT.social.linkedin, label: "LinkedIn" },
    { icon: FaFacebook, url: CONTACT.social.facebook, label: "Facebook" },
  ];

  return (
    <section ref={sectionRef} id="contact" className="h-[100vh] flex items-center justify-center relative">
      <div ref={contentRef} className="max-w-2xl mx-auto px-4 text-center opacity-0">
        <h2 className="text-3xl font-bold text-white mb-4">{language === "vietnamese" ? "Ket noi" : "Let's Connect"}</h2>
        <p className="text-neutral-300 mb-8">{language === "vietnamese" ? "Ban muon hop tac? Hay lien he voi toi." : "Interested in working together? Let's talk."}</p>

        <div className="space-y-3 mb-8">
          <button onClick={copyEmail} className="flex items-center gap-3 mx-auto text-neutral-300 hover:text-cyan-400 transition-colors">
            <HiMail className="text-xl" />
            <span>{CONTACT.email}</span>
            {copied && <HiCheck className="text-green-400" />}
          </button>
          <div className="flex items-center gap-3 justify-center text-neutral-300">
            <HiPhone className="text-xl" /><span>{CONTACT.phone}</span>
          </div>
          <div className="flex items-center gap-3 justify-center text-neutral-300">
            <HiLocationMarker className="text-xl" /><span>{CONTACT.location[language]}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {socialLinks.map(({ icon: Icon, url, label }) => (
            <MagneticButton key={label} href={url} className="p-4 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
              <Icon className="text-2xl" />
            </MagneticButton>
          ))}
        </div>
      </div>
    </section>
  );
}

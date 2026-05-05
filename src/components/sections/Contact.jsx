import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { CONTACT } from "../../constants";
import SplitText from "../ui/SplitText";
import MagneticButton from "../ui/MagneticButton";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker, HiClipboardCopy, HiCheck } from "react-icons/hi";

export default function Contact() {
  const { language } = useTheme();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current?.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: leftRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        rightRef.current?.children,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: rightRef.current, start: "top 80%" },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const socialLinks = [
    { icon: FaGithub, url: CONTACT.social.github, label: "GitHub", hoverColor: "hover:bg-neutral-700" },
    { icon: FaLinkedin, url: CONTACT.social.linkedin, label: "LinkedIn", hoverColor: "hover:bg-blue-600" },
    { icon: FaFacebook, url: CONTACT.social.facebook, label: "Facebook", hoverColor: "hover:bg-blue-500" },
  ];

  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
          {language === "vietnamese" ? "Kết nối" : "Let's Connect"}
        </SplitText>

        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div ref={leftRef}>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 opacity-0">
              {language === "vietnamese"
                ? "Bạn muốn hợp tác? Hãy liên hệ với tôi."
                : "Interested in working together? Let's talk."}
            </p>

            <div className="space-y-4">
              <button
                onClick={copyEmail}
                className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors group opacity-0 cursor-none"
              >
                <HiMail className="text-xl" />
                <span>{CONTACT.email}</span>
                {copied ? (
                  <HiCheck className="text-green-500 ml-2" />
                ) : (
                  <HiClipboardCopy className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity" />
                )}
              </button>

              <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300 opacity-0">
                <HiPhone className="text-xl" />
                <span>{CONTACT.phone}</span>
              </div>

              <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300 opacity-0">
                <HiLocationMarker className="text-xl" />
                <span>{CONTACT.location[language]}</span>
              </div>
            </div>
          </div>

          <div ref={rightRef} className="flex flex-col items-center lg:items-start justify-center gap-6">
            {socialLinks.map(({ icon: Icon, url, label, hoverColor }) => (
              <MagneticButton
                key={label}
                href={url}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 ${hoverColor} hover:text-white transition-all duration-300 w-full max-w-xs opacity-0`}
              >
                <Icon className="text-2xl" />
                <span className="font-medium">{label}</span>
              </MagneticButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

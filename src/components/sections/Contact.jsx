import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { CONTACT } from "../../constants";
import SplitText from "../ui/SplitText";
import MagneticButton from "../ui/MagneticButton";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiClipboardCopy,
  HiCheck,
  HiGlobeAlt,
} from "react-icons/hi";

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
        leftRef.current?.querySelectorAll(".contact-item"),
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: leftRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        rightRef.current?.querySelectorAll(".social-item"),
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

  const contactItems = [
    {
      icon: HiMail,
      label: CONTACT.email,
      onClick: copyEmail,
      extra: copied ? (
        <HiCheck className="text-green-400 ml-2" />
      ) : (
        <HiClipboardCopy className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity text-neutral-500" />
      ),
    },
    {
      icon: HiPhone,
      label: CONTACT.phone,
      href: `tel:${CONTACT.phone}`,
    },
    {
      icon: SiZalo,
      label: "Zalo",
      href: CONTACT.social.zalo,
    },
    {
      icon: HiLocationMarker,
      label: CONTACT.location[language],
    },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      url: CONTACT.social.github,
      label: "GitHub",
      hoverClass: "hover:border-white/40 hover:shadow-white/10",
    },
    {
      icon: FaLinkedin,
      url: CONTACT.social.linkedin,
      label: "LinkedIn",
      hoverClass: "hover:border-blue-500/40 hover:shadow-blue-500/10",
    },
    {
      icon: FaFacebook,
      url: CONTACT.social.facebook,
      label: "Facebook",
      hoverClass: "hover:border-blue-400/40 hover:shadow-blue-400/10",
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          {language === "vietnamese" ? "Kết nối" : "Let's Connect"}
        </SplitText>

        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div ref={leftRef}>
            <p className="contact-item text-lg text-neutral-300 mb-8 opacity-0">
              {language === "vietnamese"
                ? "Sẵn sàng hợp tác? Hãy liên hệ với tôi."
                : "Ready to collaborate? Get in touch."}
            </p>

            <div className="space-y-4 mb-8">
              {contactItems.map(({ icon: Icon, label, href, onClick, extra }, i) => {
                const Tag = href ? "a" : onClick ? "button" : "div";
                const linkProps = href
                  ? { href, target: "_blank", rel: "noopener noreferrer" }
                  : {};
                return (
                  <Tag
                    key={i}
                    onClick={onClick}
                    {...linkProps}
                    className="contact-item flex items-center gap-3 text-neutral-300 hover:text-cyan-400 transition-colors group opacity-0"
                  >
                    <Icon className="text-xl text-cyan-400" />
                    <span>{label}</span>
                    {extra}
                  </Tag>
                );
              })}
            </div>

            <a
              href={CONTACT.website}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item block p-5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 opacity-0 group"
            >
              <div className="flex items-center gap-3">
                <HiGlobeAlt className="text-2xl text-cyan-400 group-hover:rotate-12 transition-transform" />
                <div>
                  <p className="font-bold text-white">KhanhDuyDev</p>
                  <p className="text-sm text-neutral-400">
                    {language === "vietnamese"
                      ? "Nhận thiết kế website freelance"
                      : "Hire me for web development"}
                  </p>
                </div>
              </div>
            </a>
          </div>

          <div ref={rightRef} className="flex flex-col justify-center gap-4">
            {socialLinks.map(({ icon: Icon, url, label, hoverClass }) => (
              <MagneticButton
                key={label}
                href={url}
                className={`social-item flex items-center gap-4 px-6 py-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-neutral-300 hover:text-white transition-all duration-300 shadow-lg ${hoverClass} opacity-0`}
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

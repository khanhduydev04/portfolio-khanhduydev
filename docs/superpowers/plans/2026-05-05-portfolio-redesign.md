# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely redesign Vo Khanh Duy's portfolio with React 19, Three.js 3D scenes, GSAP scroll-driven animations, and a professional modern UI.

**Architecture:** Single-page scrolling app with GSAP ScrollTrigger/ScrollSmoother for smooth scrolling, Two Three.js canvases (Hero particle field + Technologies orbit), all sections animated on scroll. Dark/light mode + Vi/En bilingual preserved.

**Tech Stack:** React 19, Vite 6, Tailwind CSS 4, GSAP (ScrollTrigger, ScrollSmoother), Three.js, @react-three/fiber, @react-three/drei, React Icons

---

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx          # Fixed glassmorphism nav with scroll spy
│   │   ├── Footer.jsx          # Simple footer with credits
│   │   ├── PageLoader.jsx      # Intro animation on first load
│   │   ├── CustomCursor.jsx    # Custom cursor (desktop only)
│   │   └── ScrollProgress.jsx  # Scroll progress bar
│   ├── sections/
│   │   ├── Hero.jsx            # Hero with 3D bg + text animations
│   │   ├── About.jsx           # About with parallax + stats
│   │   ├── Technologies.jsx    # Tech orbit (Three.js)
│   │   ├── Experience.jsx      # Timeline with GSAP draw
│   │   ├── Projects.jsx        # Card grid with 3D tilt
│   │   └── Contact.jsx         # Contact info + social links
│   ├── three/
│   │   ├── ParticleField.jsx   # Hero 3D particle constellation
│   │   └── TechOrbit.jsx       # Technologies 3D orbit system
│   └── ui/
│       ├── SplitText.jsx       # GSAP SplitText reveal component
│       ├── MagneticButton.jsx  # Magnetic hover effect button
│       └── Card3D.jsx          # 3D tilt card component
├── hooks/
│   ├── useMousePosition.js     # Track mouse position
│   └── useSectionInView.js     # Track which section is visible
├── contexts/
│   └── themeContext.jsx        # Dark/light + language (keep existing logic)
├── constants/
│   └── index.js                # Updated CV data + translations
├── assets/
│   ├── profile/
│   ├── projects/
│   └── technologies/           # Tech logos (keep existing)
├── App.jsx                     # Main app with ScrollSmoother wrapper
├── main.jsx                    # Entry point (React 19 upgrade)
└── index.css                   # Tailwind + global styles + custom cursor
```

---

## Task 1: Upgrade Dependencies & Project Setup

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Modify: `src/main.jsx`

- [ ] **Step 1: Update package.json**

Replace entire `package.json`:

```json
{
  "name": "portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "@react-three/drei": "^9.117.0",
    "@react-three/fiber": "^8.17.0",
    "gh-pages": "^6.3.0",
    "gsap": "^3.12.7",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-icons": "^5.4.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "three": "^0.170.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "vite": "^6.0.5"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`

- [ ] **Step 3: Register GSAP plugins in main.jsx**

Replace `src/main.jsx`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/themeContext.jsx";

gsap.registerPlugin(ScrollTrigger);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

Note: Removed `BrowserRouter` and `react-router-dom` since this is a single-page scroll app with no routes.

- [ ] **Step 4: Verify project builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/main.jsx
git commit -m "chore: upgrade to React 19, add GSAP + Three.js, remove unused deps"
```

---

## Task 2: Restructure Project & Create Directory Layout

**Files:**
- Create: `src/components/layout/` directory
- Create: `src/components/sections/` directory
- Create: `src/components/three/` directory
- Create: `src/components/ui/` directory
- Create: `src/hooks/` directory

- [ ] **Step 1: Create new directory structure**

Run:
```bash
mkdir -p src/components/layout src/components/sections src/components/three src/components/ui src/hooks
```

- [ ] **Step 2: Remove old component files**

Delete old components that will be completely rewritten:
```bash
rm src/components/Header.jsx src/components/Hero.jsx src/components/About.jsx src/components/Technologies.jsx src/components/Experience.jsx src/components/Project.jsx src/components/Contact.jsx src/components/VideoPlayer.jsx
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: restructure project directories for redesign"
```

---

## Task 3: Update Global Styles & Constants Data

**Files:**
- Modify: `src/index.css`
- Modify: `src/constants/index.js`
- Modify: `src/contexts/themeContext.jsx`

- [ ] **Step 1: Replace index.css with new global styles**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-inter: 'Inter', sans-serif;
  --color-accent: #06b6d4;
  --color-accent-light: #4f46e5;
}

* {
  cursor: none;
}

@media (max-width: 768px) {
  * {
    cursor: auto;
  }
}

html {
  scroll-behavior: auto;
}

body {
  overflow-x: hidden;
}

::selection {
  background-color: rgba(6, 182, 212, 0.3);
}

.dark ::selection {
  background-color: rgba(6, 182, 212, 0.3);
}
```

- [ ] **Step 2: Replace constants/index.js with updated CV data**

```js
import project1 from "../assets/projects/pharmartist.png";
import project2 from "../assets/projects/vietanhschool.png";
import project3 from "../assets/projects/portfolio.png";
import project4 from "../assets/projects/trello.png";

export const HERO_CONTENT = {
  greeting: {
    vietnamese: "Xin chào, tôi là",
    english: "Hi, I'm",
  },
  name: "Vo Khanh Duy",
  role: {
    vietnamese: "Fullstack Developer",
    english: "Fullstack Developer",
  },
  tagline: {
    vietnamese:
      "Fullstack Developer với hơn 2 năm kinh nghiệm xây dựng ứng dụng web và mobile chất lượng cao với ReactJS, Next.js, React Native và Node.js.",
    english:
      "Fullstack Developer with 2+ years building production-grade web and mobile apps with ReactJS, Next.js, React Native, and Node.js.",
  },
};

export const ABOUT_CONTENT = {
  vietnamese:
    "Là một Fullstack Developer tận tâm với nền tảng vững chắc về clean architecture, RESTful API, và thiết kế hệ thống scalable. Tôi có kinh nghiệm làm việc với React, Next.js, React Native cho frontend và Node.js, Express cho backend. Tôi tin vào việc tận dụng AI tools như Claude Code, Codex để tối ưu quy trình phát triển. Mục tiêu của tôi là gia nhập các đội ngũ sản phẩm có tầm ảnh hưởng, nơi coi trọng chiều sâu kỹ thuật và smart tooling.",
  english:
    "A dedicated Fullstack Developer with a strong foundation in clean architecture, RESTful API integration, and scalable system design. Experienced with React, Next.js, React Native for frontend and Node.js, Express for backend. I believe in leveraging AI tools like Claude Code, Codex to optimize development workflows. My goal is to join high-impact product teams that value technical depth and smart tooling.",
};

export const STATS = [
  {
    value: 2,
    suffix: "+",
    label: { vietnamese: "Năm kinh nghiệm", english: "Years Experience" },
  },
  {
    value: 30,
    suffix: "+",
    label: { vietnamese: "Dự án", english: "Projects" },
  },
  {
    value: 3.85,
    suffix: "/4.0",
    label: { vietnamese: "GPA", english: "GPA" },
  },
];

export const TECHNOLOGIES = {
  frontend: [
    { name: "React", icon: "react" },
    { name: "Next.js", icon: "nextjs" },
    { name: "React Native", icon: "react" },
    { name: "TypeScript", icon: "typescript" },
    { name: "Tailwind CSS", icon: "tailwind" },
    { name: "Redux", icon: "redux" },
  ],
  backend: [
    { name: "Node.js", icon: "nodejs" },
    { name: "Express.js", icon: "express" },
    { name: "MongoDB", icon: "mongodb" },
    { name: "PostgreSQL", icon: "postgresql" },
    { name: "MySQL", icon: "mysql" },
    { name: "Socket.IO", icon: "socketio" },
  ],
  tools: [
    { name: "Docker", icon: "docker" },
    { name: "Git", icon: "git" },
    { name: "Firebase", icon: "firebase" },
    { name: "Supabase", icon: "supabase" },
    { name: "Figma", icon: "figma" },
    { name: "Jest", icon: "jest" },
  ],
};

export const EXPERIENCE = [
  {
    title: {
      vietnamese: "Fullstack Developer",
      english: "Fullstack Developer",
    },
    company: "Pati Group",
    time: "03/2026 – 05/2026",
    description: {
      vietnamese:
        "Xây dựng AI-powered internal tools: công cụ tạo ảnh quảng cáo tĩnh, công cụ tạo video quảng cáo. Phát triển Playwright crawlers cho nghiên cứu thị trường. Làm việc với Shopify storefronts và GemPages landing pages.",
      english:
        "Built AI-powered internal tools: static image ads generator, video ads generator. Developed Playwright-based crawlers for competitive research. Worked on Shopify storefronts and GemPages landing pages.",
    },
  },
  {
    title: {
      vietnamese: "Frontend Developer",
      english: "Frontend Developer",
    },
    company: "Golden Bee IT Solutions",
    time: "01/2025 – 01/2026",
    description: {
      vietnamese:
        "Xây dựng ứng dụng web và mobile với React, Next.js, React Native. Quản lý state và API integrations. Làm việc trong Agile/Scrum. Phát triển WordPress custom themes.",
      english:
        "Built web and mobile applications with React, Next.js, React Native. Managed state and API integrations. Worked in Agile/Scrum. Developed WordPress custom themes.",
    },
  },
  {
    title: {
      vietnamese: "AI Engineer Intern",
      english: "AI Engineer Intern",
    },
    company: "FPT Software Quy Nhon (QAI)",
    time: "09/2024 – 12/2024",
    description: {
      vietnamese:
        "Nghiên cứu AI/Computer Vision với YOLO, OpenCV. Làm việc với Docker, Redis, Microservices. Giải quyết bài toán xử lý camera thời gian thực.",
      english:
        "Researched AI/Computer Vision with YOLO, OpenCV. Worked with Docker, Redis, Microservices. Solved real-time camera processing challenges.",
    },
  },
  {
    title: {
      vietnamese: "Frontend Collaborator",
      english: "Frontend Collaborator",
    },
    company: "FPT Polytechnic Software Workshop",
    time: "06/2024 – 10/2024",
    description: {
      vietnamese:
        "Chuyển đổi thiết kế Figma sang React/Bootstrap. Xây dựng Zalo Mini Apps. Làm việc với Git Flow.",
      english:
        "Converted Figma designs to React/Bootstrap. Built Zalo Mini Apps. Worked with Git Flow.",
    },
  },
];

export const EDUCATION = {
  school: "FPT Can Tho",
  degree: {
    vietnamese: "Cử nhân Công nghệ Thông tin",
    english: "Bachelor of Information Technology",
  },
  time: "2022 – 2025",
  major: { vietnamese: "Chuyên ngành: Phát triển Web", english: "Major: Web Development" },
  gpa: "3.85 / 4.0",
};

export const PROJECTS = [
  {
    title: "Adlance — Static Ads Generator",
    image: null,
    link: "https://adlance-ads-generator.vercel.app",
    github: null,
    description: {
      vietnamese:
        "Pipeline tạo quảng cáo end-to-end với Content Adaptation, Brand Intelligence. Quản lý API key mã hóa AES-256-GCM.",
      english:
        "End-to-end ad generation pipeline with Content Adaptation, Brand Intelligence. BYOK encrypted API key management with AES-256-GCM.",
    },
    technologies: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Supabase", "Anthropic API", "Gemini API"],
  },
  {
    title: "Golden Bee Driving Lessons",
    image: null,
    link: "https://play.google.com/store/apps/details?id=com.botuclaixe.app",
    github: null,
    description: {
      vietnamese:
        "Ứng dụng mobile luyện thi bằng lái xe. 600 câu lý thuyết, mô phỏng thi sát hạch, tối ưu flow đăng ký và đặt lịch.",
      english:
        "Cross-platform driving app with 600 theory questions, mock exam simulation. Optimized booking and registration flows.",
    },
    technologies: ["React Native", "Expo", "React Navigation", "React Query", "Zod"],
  },
  {
    title: "Thuc Duong Thien Minh",
    image: null,
    link: "https://thucduongthienminh.com",
    github: null,
    description: {
      vietnamese: "Website e-commerce responsive với admin dashboard tùy chỉnh.",
      english: "Responsive e-commerce UI with admin dashboard customization.",
    },
    technologies: ["WordPress", "PHP", "Tailwind CSS", "ACF", "AJAX"],
  },
  {
    title: {
      vietnamese: "Ứng dụng quản lý công việc - Trello Clone",
      english: "Task Management App - Trello Clone",
    },
    image: project4,
    link: "https://trello-lac-two.vercel.app",
    github: "https://github.com/khanhduydev04/trello-clone-public",
    description: {
      vietnamese:
        "Ứng dụng quản lý công việc với kéo thả, realtime notifications, xác thực JWT.",
      english:
        "Task management app with drag-and-drop, realtime notifications, JWT authentication.",
    },
    technologies: ["React", "Node.js", "Express", "MongoDB", "Socket.IO", "Material UI"],
  },
  {
    title: {
      vietnamese: "Hệ thống sàng lọc bệnh AI - Pharmartist",
      english: "AI Disease Screening - Pharmartist",
    },
    image: project1,
    link: null,
    github: null,
    description: {
      vietnamese:
        "Hệ thống hỗ trợ y bác sĩ khám sàng lọc bệnh bằng AI, nhận diện triệu chứng qua giọng nói.",
      english:
        "AI-powered disease screening system supporting doctors with voice-based symptom recognition.",
    },
    technologies: ["React", "Node.js", "MongoDB", "Gemini API", "Langchain", "Firebase"],
  },
  {
    title: {
      vietnamese: "Zalo Mini App - Việt Anh School",
      english: "Zalo Mini App - Viet Anh School",
    },
    image: project2,
    link: null,
    github: null,
    description: {
      vietnamese:
        "Ứng dụng Zalo Mini quản lý thông tin học sinh, thời khóa biểu, điểm số, liên lạc phụ huynh-giáo viên.",
      english:
        "Zalo Mini App for student info management, timetables, grades, parent-teacher communication.",
    },
    technologies: ["React", "Tailwind CSS", "Zalo Mini App", "React Hook Form"],
  },
  {
    title: "Portfolio Website",
    image: project3,
    link: "https://cv.vokhanhduy.site",
    github: "https://github.com/khanhduydev04/portfolio-khanhduydev",
    description: {
      vietnamese: "Website portfolio cá nhân với Three.js 3D animations và GSAP scroll effects.",
      english: "Personal portfolio with Three.js 3D animations and GSAP scroll effects.",
    },
    technologies: ["React 19", "Three.js", "GSAP", "Tailwind CSS"],
  },
  {
    title: "Placeholder Project 8",
    image: null,
    link: null,
    github: null,
    description: {
      vietnamese: "Mô tả dự án sẽ được cập nhật sau.",
      english: "Project description to be updated.",
    },
    technologies: ["TBD"],
  },
];

export const CONTACT = {
  email: "vokhanhduy2004@gmail.com",
  phone: "+84 901 226 907",
  location: {
    vietnamese: "Cần Thơ, Việt Nam",
    english: "Can Tho, Vietnam",
  },
  social: {
    github: "https://github.com/khanhduydev04",
    linkedin: "https://www.linkedin.com/in/vo-khanh-duy-649744349",
    facebook: "https://www.facebook.com/KhanhDuy.Goalkeeper",
  },
};

export const ACHIEVEMENTS = [
  {
    title: {
      vietnamese: "Quán quân — FPT Edu Hackathon 2024 (Generative AI)",
      english: "Champion — FPT Edu Hackathon 2024 (Generative AI)",
    },
  },
  {
    title: {
      vietnamese: "Giải Khuyến khích — Landing Page Hackathon 2023",
      english: "Encouragement Prize — Landing Page Hackathon 2023",
    },
  },
  {
    title: {
      vietnamese: "Top 70 Sinh viên Xuất sắc (3 kỳ)",
      english: "Top 70 Outstanding Students (3 semesters)",
    },
  },
  {
    title: {
      vietnamese: "Chứng chỉ VSTEP B1 tiếng Anh",
      english: "English VSTEP B1 Certificate",
    },
  },
];

export const TITLES = {
  about: {
    vietnamese: "Về tôi",
    english: "About Me",
  },
  technologies: {
    vietnamese: "Công nghệ",
    english: "Technologies",
  },
  experience: {
    vietnamese: "Kinh nghiệm",
    english: "Experience",
  },
  projects: {
    vietnamese: "Dự án",
    english: "Projects",
  },
  contact: {
    vietnamese: "Kết nối",
    english: "Let's Connect",
  },
};

export const NAV_LINKS = [
  { id: "about", label: { vietnamese: "Về tôi", english: "About" } },
  { id: "technologies", label: { vietnamese: "Công nghệ", english: "Technologies" } },
  { id: "experience", label: { vietnamese: "Kinh nghiệm", english: "Experience" } },
  { id: "projects", label: { vietnamese: "Dự án", english: "Projects" } },
  { id: "contact", label: { vietnamese: "Liên hệ", english: "Contact" } },
];
```

- [ ] **Step 3: Update themeContext.jsx (keep logic, remove react-router dependency)**

```jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "english"
  );
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "vietnamese" ? "english" : "vietnamese"));
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{ language, darkMode, toggleLanguage, toggleDarkMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Builds successfully (may warn about missing components — that's fine).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: update constants with new CV data, update styles and theme context"
```

---

## Task 4: Hooks & UI Utility Components

**Files:**
- Create: `src/hooks/useMousePosition.js`
- Create: `src/hooks/useSectionInView.js`
- Create: `src/components/ui/SplitText.jsx`
- Create: `src/components/ui/MagneticButton.jsx`
- Create: `src/components/ui/Card3D.jsx`

- [ ] **Step 1: Create useMousePosition hook**

```js
// src/hooks/useMousePosition.js
import { useState, useEffect } from "react";

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return position;
}
```

- [ ] **Step 2: Create useSectionInView hook**

```js
// src/hooks/useSectionInView.js
import { useState, useEffect, useRef } from "react";

export function useSectionInView(threshold = 0.3) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView];
}
```

- [ ] **Step 3: Create SplitText component**

```jsx
// src/components/ui/SplitText.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SplitText({ children, className = "", delay = 0 }) {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const text = el.textContent;
    el.innerHTML = "";

    const chars = text.split("").map((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? " " : char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(40px)";
      el.appendChild(span);
      return span;
    });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.03,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [children, delay]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create MagneticButton component**

```jsx
// src/components/ui/MagneticButton.jsx
import { useRef } from "react";
import { gsap } from "gsap";

export default function MagneticButton({ children, className = "", onClick, href }) {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  };

  const Tag = href ? "a" : "button";
  const props = href ? { href, target: "_blank", rel: "noopener noreferrer" } : { onClick };

  return (
    <Tag
      ref={btnRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 5: Create Card3D component**

```jsx
// src/components/ui/Card3D.jsx
import { useRef } from "react";
import { gsap } from "gsap";

export default function Card3D({ children, className = "" }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 20,
      rotateX: -y * 20,
      duration: 0.3,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/ src/components/ui/
git commit -m "feat: add hooks and reusable UI components (SplitText, MagneticButton, Card3D)"
```

---

## Task 5: Layout Components (Header, Footer, PageLoader, CustomCursor, ScrollProgress)

**Files:**
- Create: `src/components/layout/Header.jsx`
- Create: `src/components/layout/Footer.jsx`
- Create: `src/components/layout/PageLoader.jsx`
- Create: `src/components/layout/CustomCursor.jsx`
- Create: `src/components/layout/ScrollProgress.jsx`

- [ ] **Step 1: Create Header component**

```jsx
// src/components/layout/Header.jsx
import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/themeContext";
import { NAV_LINKS } from "../../constants";
import { CiLight, CiDark } from "react-icons/ci";
import { HiMenu, HiX } from "react-icons/hi";
import { gsap } from "gsap";

export default function Header() {
  const { language, darkMode, toggleLanguage, toggleDarkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      gsap.fromTo(
        ".mobile-nav-item",
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [mobileOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
        <a
          href="#"
          className="text-xl font-bold text-neutral-900 dark:text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          KhanhDuy
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`relative text-sm font-medium transition-colors cursor-none ${
                activeSection === link.id
                  ? "text-cyan-500 dark:text-cyan-400"
                  : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {link.label[language]}
              <span
                className={`absolute -bottom-1 left-1/2 h-[2px] bg-cyan-500 transition-all duration-300 ${
                  activeSection === link.id
                    ? "w-full -translate-x-1/2"
                    : "w-0 -translate-x-1/2"
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="text-sm font-medium px-2 py-1 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-none"
          >
            {language === "vietnamese" ? "EN" : "VI"}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-none"
          >
            {darkMode ? <CiLight className="text-xl" /> : <CiDark className="text-xl" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 cursor-none"
          >
            {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg z-40">
          <nav className="flex flex-col items-center justify-center h-full gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="mobile-nav-item text-2xl font-medium text-neutral-800 dark:text-neutral-200 cursor-none"
              >
                {link.label[language]}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Create Footer component**

```jsx
// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="text-center py-6 text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
      <p>
        &copy; 2026 Vo Khanh Duy. Built website and SEO by{" "}
        <a
          href="https://vokhanhduy.site"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-500 hover:text-cyan-400 transition-colors"
        >
          KhanhDuyDev
        </a>
      </p>
    </footer>
  );
}
```

- [ ] **Step 3: Create PageLoader component**

```jsx
// src/components/layout/PageLoader.jsx
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
```

- [ ] **Step 4: Create CustomCursor component**

```jsx
// src/components/layout/CustomCursor.jsx
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

    const interactives = document.querySelectorAll("a, button, [data-cursor-hover]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
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
```

- [ ] **Step 5: Create ScrollProgress component**

```jsx
// src/components/layout/ScrollProgress.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-purple-500 z-[60] origin-left scale-x-0"
    />
  );
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add layout components (Header, Footer, PageLoader, CustomCursor, ScrollProgress)"
```

---

## Task 6: Three.js — ParticleField (Hero Background)

**Files:**
- Create: `src/components/three/ParticleField.jsx`

- [ ] **Step 1: Create ParticleField component**

```jsx
// src/components/three/ParticleField.jsx
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../contexts/themeContext";

function Particles({ mouse }) {
  const meshRef = useRef();
  const { darkMode } = useTheme();
  const count = 200;
  const connectionDistance = 2.5;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.005,
      });
    }
    return { positions, velocities };
  }, []);

  const linesRef = useRef();

  useFrame(() => {
    const positions = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += particles.velocities[i].x;
      positions[i * 3 + 1] += particles.velocities[i].y;
      positions[i * 3 + 2] += particles.velocities[i].z;

      // Mouse repulsion
      const dx = positions[i * 3] - mouse.current.x * 10;
      const dy = positions[i * 3 + 1] - mouse.current.y * 10;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        positions[i * 3] += dx * 0.01;
        positions[i * 3 + 1] += dy * 0.01;
      }

      // Boundary wrapping
      if (Math.abs(positions[i * 3]) > 10) particles.velocities[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 10) particles.velocities[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 5) particles.velocities[i].z *= -1;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // Update connections
    const linePositions = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < connectionDistance) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }
    if (linesRef.current) {
      linesRef.current.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
    }
  });

  const particleColor = darkMode ? "#06b6d4" : "#4f46e5";
  const lineColor = darkMode ? "#06b6d4" : "#4f46e5";

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particles.positions}
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.08} color={particleColor} transparent opacity={0.8} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={lineColor} transparent opacity={0.15} />
      </lineSegments>
    </>
  );
}

export default function ParticleField() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  return (
    <div className="absolute inset-0 -z-10" onMouseMove={handleMouseMove}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Particles mouse={mouse} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/three/ParticleField.jsx
git commit -m "feat: add Three.js ParticleField constellation for Hero background"
```

---

## Task 7: Three.js — TechOrbit (Technologies 3D Scene)

**Files:**
- Create: `src/components/three/TechOrbit.jsx`

- [ ] **Step 1: Create TechOrbit component**

```jsx
// src/components/three/TechOrbit.jsx
import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../contexts/themeContext";
import { TECHNOLOGIES } from "../../constants";

function OrbitRing({ items, radius, speed, color }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(null);

  useFrame((_, delta) => {
    if (hovered === null && groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit ring line */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Tech items */}
      {items.map((item, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={item.name} position={[x, 0, z]}>
            <Billboard>
              <mesh
                onPointerOver={() => setHovered(i)}
                onPointerOut={() => setHovered(null)}
                scale={hovered === i ? 1.4 : 1}
              >
                <planeGeometry args={[0.8, 0.8]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>
              <Text
                fontSize={0.3}
                color={hovered === i ? "#06b6d4" : "#94a3b8"}
                anchorX="center"
                anchorY="middle"
              >
                {item.name}
              </Text>
            </Billboard>
            {hovered === i && (
              <Html center>
                <div className="bg-neutral-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

function Core() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      <pointLight color="#06b6d4" intensity={2} distance={10} />
    </mesh>
  );
}

function Scene() {
  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      <Core />
      <OrbitRing items={TECHNOLOGIES.frontend} radius={3} speed={0.3} color="#06b6d4" />
      <OrbitRing items={TECHNOLOGIES.backend} radius={5} speed={0.2} color="#8b5cf6" />
      <OrbitRing items={TECHNOLOGIES.tools} radius={7} speed={0.1} color="#f59e0b" />
    </group>
  );
}

export default function TechOrbit() {
  return (
    <div className="w-full h-[500px] lg:h-[600px]">
      <Canvas camera={{ position: [0, 6, 12], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <Scene />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/three/TechOrbit.jsx
git commit -m "feat: add Three.js TechOrbit 3D constellation for Technologies section"
```

---

## Task 8: Hero Section

**Files:**
- Create: `src/components/sections/Hero.jsx`

- [ ] **Step 1: Create Hero section**

```jsx
// src/components/sections/Hero.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTheme } from "../../contexts/themeContext";
import { HERO_CONTENT } from "../../constants";
import ParticleField from "../three/ParticleField";
import MagneticButton from "../ui/MagneticButton";
import { HiArrowDown } from "react-icons/hi";

export default function Hero() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.5 });

    tl.fromTo(
      ".hero-greeting",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    )
      .fromTo(
        ".hero-name span",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.5, ease: "power3.out" }
      )
      .fromTo(
        ".hero-role",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        ".hero-tagline",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        ".hero-scroll",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );
  }, []);

  const nameChars = HERO_CONTENT.name.split("");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <ParticleField />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <p className="hero-greeting text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mb-4 opacity-0">
          {HERO_CONTENT.greeting[language]}
        </p>

        <h1 ref={nameRef} className="hero-name text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-neutral-900 dark:text-white">
          {nameChars.map((char, i) => (
            <span key={i} className="inline-block opacity-0">
              {char === " " ? " " : char}
            </span>
          ))}
        </h1>

        <p className="hero-role text-2xl md:text-3xl font-medium text-cyan-500 dark:text-cyan-400 mb-6 opacity-0">
          {HERO_CONTENT.role[language]}
        </p>

        <p className="hero-tagline text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-10 opacity-0">
          {HERO_CONTENT.tagline[language]}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <MagneticButton
            href="/Vo Khanh Duy - Frontend Developer.pdf"
            className="hero-cta inline-block px-6 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors opacity-0"
          >
            Download CV
          </MagneticButton>
          <MagneticButton
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="hero-cta inline-block px-6 py-3 border border-cyan-500 text-cyan-500 rounded-full font-medium hover:bg-cyan-500/10 transition-colors opacity-0"
          >
            {language === "vietnamese" ? "Liên hệ" : "Get in touch"}
          </MagneticButton>
        </div>

        <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0">
          <HiArrowDown className="text-2xl text-neutral-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Hero.jsx
git commit -m "feat: add Hero section with 3D particle background and text animations"
```

---

## Task 9: About Section

**Files:**
- Create: `src/components/sections/About.jsx`

- [ ] **Step 1: Create About section**

```jsx
// src/components/sections/About.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { ABOUT_CONTENT, STATS } from "../../constants";
import SplitText from "../ui/SplitText";
import profileImg from "../../assets/profile/khanhduydev.jpg";

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
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
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
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      // Count up animation for stats
      const statValues = statsRef.current?.querySelectorAll(".stat-value");
      statValues?.forEach((el, i) => {
        const target = parseFloat(el.dataset.value);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          delay: 0.5 + i * 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
          onUpdate: () => {
            el.textContent = target % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(2);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
          {language === "vietnamese" ? "Về tôi" : "About Me"}
        </SplitText>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div ref={imageRef} className="flex justify-center opacity-0">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-75 blur-sm animate-[spin_6s_linear_infinite]" />
              <img
                src={profileImg}
                alt="Vo Khanh Duy"
                className="relative w-72 h-72 lg:w-80 lg:h-80 object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="opacity-0">
            <p className="text-base lg:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {ABOUT_CONTENT[language]}
            </p>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-6 mt-10">
              {STATS.map((stat) => (
                <div key={stat.label.english} className="text-center">
                  <div className="text-3xl font-bold text-cyan-500 dark:text-cyan-400">
                    <span className="stat-value" data-value={stat.value}>
                      0
                    </span>
                    <span>{stat.suffix}</span>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
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
```

Note: The profile image path assumes `src/assets/profile/khanhduydev.jpg` exists. If the file has a different name, adjust accordingly.

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/About.jsx
git commit -m "feat: add About section with parallax image, count-up stats, GSAP animations"
```

---

## Task 10: Technologies Section

**Files:**
- Create: `src/components/sections/Technologies.jsx`

- [ ] **Step 1: Create Technologies section**

```jsx
// src/components/sections/Technologies.jsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { TECHNOLOGIES } from "../../constants";
import SplitText from "../ui/SplitText";
import TechOrbit from "../three/TechOrbit";

function MobileFallback() {
  const allTech = [
    ...TECHNOLOGIES.frontend,
    ...TECHNOLOGIES.backend,
    ...TECHNOLOGIES.tools,
  ];
  const containerRef = useRef(null);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll(".tech-item");
    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-3 sm:grid-cols-4 gap-4">
      {allTech.map((tech) => (
        <div
          key={tech.name}
          className="tech-item flex flex-col items-center gap-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 opacity-0"
        >
          <span className="text-xs text-neutral-600 dark:text-neutral-300 text-center">
            {tech.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Technologies() {
  const { language } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="technologies" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
          {language === "vietnamese" ? "Công nghệ" : "Technologies"}
        </SplitText>

        {isMobile ? <MobileFallback /> : <TechOrbit />}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Technologies.jsx
git commit -m "feat: add Technologies section with 3D orbit and mobile fallback"
```

---

## Task 11: Experience Section

**Files:**
- Create: `src/components/sections/Experience.jsx`

- [ ] **Step 1: Create Experience section**

```jsx
// src/components/sections/Experience.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { EXPERIENCE, EDUCATION } from "../../constants";
import SplitText from "../ui/SplitText";

function TimelineCard({ item, index, language }) {
  const cardRef = useRef(null);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: isLeft ? -60 : 60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        },
      }
    );
  }, [isLeft]);

  return (
    <div
      className={`flex items-center gap-4 mb-12 ${
        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      } flex-col lg:flex-row`}
    >
      <div
        ref={cardRef}
        className={`lg:w-[45%] w-full opacity-0 ${isLeft ? "lg:text-right" : "lg:text-left"}`}
      >
        <div className="p-6 rounded-xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <span className="text-sm text-cyan-500 font-medium">{item.time}</span>
          <h3 className="text-lg font-bold mt-1 text-neutral-900 dark:text-white">
            {item.title[language]}
          </h3>
          <p className="text-sm text-purple-500 dark:text-purple-400 font-medium">
            {item.company}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
            {item.description[language]}
          </p>
        </div>
      </div>

      {/* Timeline dot */}
      <div className="hidden lg:flex w-[10%] justify-center">
        <div className="timeline-dot w-4 h-4 rounded-full bg-cyan-500 border-4 border-white dark:border-neutral-900 shadow-lg shadow-cyan-500/30" />
      </div>

      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}

export default function Experience() {
  const { language } = useTheme();
  const lineRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: true,
        },
      }
    );

    // Animate dots
    gsap.utils.toArray(".timeline-dot").forEach((dot) => {
      gsap.fromTo(
        dot,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.4,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: dot,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  return (
    <section id="experience" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
          {language === "vietnamese" ? "Kinh nghiệm" : "Experience"}
        </SplitText>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline line */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500 via-purple-500 to-amber-500 origin-top scale-y-0 -translate-x-1/2"
          />

          {/* Experience cards */}
          {EXPERIENCE.map((item, i) => (
            <TimelineCard key={i} item={item} index={i} language={language} />
          ))}

          {/* Education card */}
          <div className="flex items-center gap-4 flex-col lg:flex-row">
            <div className="lg:w-[45%] w-full lg:text-right">
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 dark:border-cyan-500/20">
                <span className="text-sm text-cyan-500 font-medium">{EDUCATION.time}</span>
                <h3 className="text-lg font-bold mt-1 text-neutral-900 dark:text-white">
                  {EDUCATION.degree[language]}
                </h3>
                <p className="text-sm text-purple-500 dark:text-purple-400 font-medium">
                  {EDUCATION.school}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {EDUCATION.major[language]} • GPA: {EDUCATION.gpa}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex w-[10%] justify-center">
              <div className="timeline-dot w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-neutral-900 shadow-lg shadow-amber-500/30" />
            </div>
            <div className="hidden lg:block lg:w-[45%]" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Experience.jsx
git commit -m "feat: add Experience section with GSAP draw-on-scroll timeline"
```

---

## Task 12: Projects Section

**Files:**
- Create: `src/components/sections/Projects.jsx`

- [ ] **Step 1: Create Projects section**

```jsx
// src/components/sections/Projects.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { PROJECTS } from "../../constants";
import SplitText from "../ui/SplitText";
import Card3D from "../ui/Card3D";
import { FiExternalLink, FiGithub } from "react-icons/fi";

function ProjectCard({ project, language }) {
  const title =
    typeof project.title === "string"
      ? project.title
      : project.title[language];
  const description = project.description[language];

  return (
    <Card3D className="group h-full rounded-xl overflow-hidden bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-xl hover:shadow-cyan-500/5 transition-shadow duration-300">
      {/* Thumbnail */}
      <div className="h-48 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800">
        {project.image ? (
          <img
            src={project.image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <span className="text-4xl font-bold opacity-20">{title[0]}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">
            {title}
          </h3>
          <div className="flex gap-2 shrink-0">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-cyan-500 transition-colors"
              >
                <FiExternalLink size={18} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-cyan-500 transition-colors"
              >
                <FiGithub size={18} />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Card3D>
  );
}

export default function Projects() {
  const { language } = useTheme();
  const gridRef = useRef(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".project-card");
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.9, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <section id="projects" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
          {language === "vietnamese" ? "Dự án" : "Projects"}
        </SplitText>

        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {PROJECTS.map((project, i) => (
            <div key={i} className="project-card opacity-0">
              <ProjectCard project={project} language={language} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Projects.jsx
git commit -m "feat: add Projects section with 3D tilt cards and stagger reveal"
```

---

## Task 13: Contact Section

**Files:**
- Create: `src/components/sections/Contact.jsx`

- [ ] **Step 1: Create Contact section**

```jsx
// src/components/sections/Contact.jsx
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
          {/* Left - Info */}
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

          {/* Right - Social */}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Contact.jsx
git commit -m "feat: add Contact section with magnetic social buttons and copy-to-clipboard"
```

---

## Task 14: App.jsx — Assemble All Sections

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace App.jsx with new assembly**

```jsx
// src/App.jsx
import { useTheme } from "./contexts/themeContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PageLoader from "./components/layout/PageLoader";
import CustomCursor from "./components/layout/CustomCursor";
import ScrollProgress from "./components/layout/ScrollProgress";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Technologies from "./components/sections/Technologies";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";

export default function App() {
  const { darkMode } = useTheme();

  return (
    <>
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />

      <div className="font-inter text-neutral-900 dark:text-neutral-200 antialiased">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          {darkMode ? (
            <div className="h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />
          ) : (
            <div className="h-full w-full bg-white bg-[radial-gradient(circle_800px_at_50%_200px,#dbeafe,transparent)]" />
          )}
        </div>

        <Header />

        <main>
          <Hero />
          <About />
          <Technologies />
          <Experience />
          <Projects />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify dev server runs**

Run: `npm run dev`
Expected: App loads in browser with all sections visible, no console errors.

- [ ] **Step 3: Verify production build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: assemble all sections in App.jsx with new layout"
```

---

## Task 15: Visual Polish & Bug Fixes

**Files:**
- Possibly modify: any component files based on visual testing

- [ ] **Step 1: Run dev server and test**

Run: `npm run dev`

Check in browser:
1. Page loader animation plays on first load
2. Custom cursor visible and reactive on desktop
3. Scroll progress bar grows as you scroll
4. Header becomes glassmorphism on scroll
5. Hero particles animate and react to mouse
6. About section count-up works on scroll
7. Technologies orbit rotates (desktop), grid shows (mobile)
8. Experience timeline draws on scroll
9. Project cards tilt on hover
10. Contact magnetic buttons work
11. Dark/light mode toggle works
12. Vietnamese/English toggle works
13. Mobile responsive layout is correct

- [ ] **Step 2: Fix any issues found during visual testing**

Address any rendering issues, z-index conflicts, animation timing, or responsive breakpoint problems.

- [ ] **Step 3: Final production build**

Run: `npm run build && npm run preview`
Expected: Production build works correctly.

- [ ] **Step 4: Commit all fixes**

```bash
git add -A
git commit -m "fix: polish animations and fix visual issues from testing"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Upgrade deps (React 19, GSAP, Three.js) | package.json, main.jsx |
| 2 | Restructure project directories | src/components/* |
| 3 | Update styles, data, context | index.css, constants, themeContext |
| 4 | Hooks & UI utility components | hooks/, ui/ |
| 5 | Layout components | layout/ |
| 6 | Three.js ParticleField | three/ParticleField.jsx |
| 7 | Three.js TechOrbit | three/TechOrbit.jsx |
| 8 | Hero section | sections/Hero.jsx |
| 9 | About section | sections/About.jsx |
| 10 | Technologies section | sections/Technologies.jsx |
| 11 | Experience section | sections/Experience.jsx |
| 12 | Projects section | sections/Projects.jsx |
| 13 | Contact section | sections/Contact.jsx |
| 14 | App.jsx assembly | App.jsx |
| 15 | Visual polish & bug fixes | Various |

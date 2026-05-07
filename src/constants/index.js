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
    { name: "React", icon: "/technologies/react.png" },
    { name: "Next.js", icon: "/technologies/nextjs-white.png" },
    { name: "TypeScript", icon: "/technologies/typescript.png" },
    { name: "Tailwind CSS", icon: "/technologies/tailwind.png" },
    { name: "Redux", icon: "/technologies/redux.png" },
    { name: "Material UI", icon: "/technologies/materialui.png" },
  ],
  backend: [
    { name: "Node.js", icon: "/technologies/nodejs.png" },
    { name: "Express.js", icon: "/technologies/expressjs.png", dark: true },
    { name: "JavaScript", icon: "/technologies/javascript.png" },
    { name: "MongoDB", icon: "/technologies/mongodb.png" },
    { name: "PostgreSQL", icon: "/technologies/postgresql.png" },
    { name: "MySQL", icon: "/technologies/mysql.png" },
    { name: "Socket.IO", icon: "/technologies/socketio.png", dark: true },
  ],
  tools: [
    { name: "Docker", icon: "/technologies/docker.png" },
    { name: "Git", icon: "/technologies/github-white.png" },
    { name: "Firebase", icon: "/technologies/firebase.png" },
    { name: "Supabase", icon: "/technologies/supabase.png" },
    { name: "Figma", icon: "/technologies/figma.png" },
    { name: "Jest", icon: "/technologies/jest.png" },
    { name: "Zustand", icon: "/technologies/zustand.png" },
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


export const CONTACT = {
  email: "vokhanhduy2004@gmail.com",
  phone: "+84 901 226 907",
  location: {
    vietnamese: "Cần Thơ, Việt Nam",
    english: "Can Tho, Vietnam",
  },
  website: "https://vokhanhduy.site",
  social: {
    github: "https://github.com/khanhduydev04",
    linkedin: "https://www.linkedin.com/in/vo-khanh-duy-649744349",
    facebook: "https://www.facebook.com/KhanhDuy.Goalkeeper",
    zalo: "https://zalo.me/0901226907",
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

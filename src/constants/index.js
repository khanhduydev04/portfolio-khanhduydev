import React from "react";

import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

import project1 from "../assets/projects/pharmartist.png";
import project2 from "../assets/projects/vietanhschool.png";
import project3 from "../assets/projects/portfolio.png";
import project4 from "../assets/projects/trello.png";

import javascript from "../assets/technologies/javascript.png";
import typescript from "../assets/technologies/typescript.png";
import react from "../assets/technologies/react.png";
import nextjsLight from "../assets/technologies/nextjs-white.png";
import nextjsDark from "../assets/technologies/nextjs-black.png";
import nodejs from "../assets/technologies/nodejs.png";
import redux from "../assets/technologies/redux.png";
import zustand from "../assets/technologies/zustand.png";
import tailwind from "../assets/technologies/tailwind.png";
import mongodb from "../assets/technologies/mongodb.svg";
import mysql from "../assets/technologies/mysql.png";
import sass from "../assets/technologies/sass.png";
import githubLight from "../assets/technologies/github-white.png";
import githubDark from "../assets/technologies/github-black.png";
import firebase from "../assets/technologies/firebase.png";
import figma from "../assets/technologies/figma.png";
import materialui from "../assets/technologies/materialui.png";
import sequelize from "../assets/technologies/sequelize.png";

import { IoBookmarkOutline } from "react-icons/io5";
import { IoMedalOutline } from "react-icons/io5";
import { GoTrophy } from "react-icons/go";
import { PiGraduationCap } from "react-icons/pi";
import { CgWorkAlt } from "react-icons/cg";

export const HERO_CONTENT = {
  vietnamese:
    "Xin chào, tôi là Võ Khánh Duy – một lập trình viên Frontend đam mê tạo ra các ứng dụng web trực quan và hiệu suất cao. Với nền tảng vững chắc về các công nghệ hiện đại như React, Next.js và TailwindCSS, tôi luôn nỗ lực biến ý tưởng thành những trải nghiệm người dùng mượt mà. Không ngừng học hỏi và phát triển, tôi luôn cố gắng mỗi ngày để trở thành phiên bản tốt hơn của chính mình.",
  english:
    "Hi, I'm Vo Khanh Duy – a Frontend Developer passionate about crafting intuitive and high-performance web applications. With a strong foundation in modern technologies like React, Next.js, and TailwindCSS, I thrive on turning ideas into seamless user experiences. Always eager to learn and grow, I strive to improve every day to become a better version of myself.",
};

export const ABOUT_CONTENT = {
  vietnamese:
    "Là một lập trình viên Frontend tận tâm, tôi yêu thích việc xây dựng các giao diện tinh gọn, thân thiện với người dùng nhằm nâng cao trải nghiệm số. Trong hơn hai năm qua, tôi đã trau dồi kỹ năng JavaScript và làm việc với các framework như React, Nextjs, cùng các công nghệ Backend như Nodejs, Express, MySQL và MongoDB. Hành trình phát triển web của tôi được thúc đẩy bởi sự tò mò và cam kết học hỏi không ngừng. Tôi tin vào việc viết code sạch, tối ưu, đồng thời luôn chú trọng đến thiết kế và tính khả dụng. Ngoài lập trình, tôi thích đối mặt với thử thách, làm việc nhóm hiệu quả và không ngừng khám phá các công cụ mới để bắt kịp xu hướng công nghệ. Mục tiêu của tôi? Trở thành một lập trình viên full-stack toàn diện, có khả năng xây dựng các ứng dụng quy mô lớn và hiệu suất cao.",
  english:
    "As a dedicated frontend developer, I enjoy building sleek, user-friendly interfaces that enhance digital experiences. Over the past two years, I have honed my skills in JavaScript, working with frameworks like React, Next.js, and backend technologies such as Node.js, Express, MySQL, and MongoDB. My journey in web development is driven by curiosity and a commitment to continuous learning. I believe in writing clean, efficient code while maintaining an eye for design and usability. Beyond coding, I embrace challenges, collaborate effectively, and constantly explore new tools to stay ahead in the field. My ultimate goal? To become a well-rounded full-stack developer capable of building scalable, high-performance applications.",
};

export const TIMELINE = [
  {
    title: {
      vietnamese: "Thực tập AI Engineer",
      english: "AI Engineer Intern",
    },
    company: {
      vietnamese: "FPT Software Quy Nhơn",
      english: "FPT Software Quy Nhon",
    },
    time: "09/2024 - 12/2024",
    description: {
      vietnamese:
        "Thực tập tại Trung tâm Nghiên cứu và Ứng dụng Trí tuệ nhân tạo Quy Nhơn (QAI) - FPT Software Quy Nhơn với vị trí AI Engineer. Tham gia vào các dự án về AI, Computer Vison. Được tiếp cận và làm việc với mô hình micro-service, Docker, Redis, Yolo và giải quyết các bài toán xử lý với camera thời gian thực. Học hỏi nhiều từ các chuyên gia và đồng nghiệp trong công ty từ kiến thức, kỹ năng chuyên môn, kinh nghiệm làm việc đến tinh thần làm việc chuyên nghiệp và trách nhiệm.",
      english:
        "Internship at the Quy Nhon Artificial Intelligence Research and Application Center (QAI) - FPT Software Quy Nhon as an AI Engineer. Participated in projects related to AI, Computer Vision. Gained experience working with micro-service architecture, Docker, Redis, Yolo, and solving real-time camera processing challenges. Learned a lot from experts and colleagues in the company from knowledge, professional skills, work experience to professional work spirit and responsibility.",
    },
    icon: React.createElement(CgWorkAlt),
  },
  {
    title: {
      vietnamese: "Tốt nghiệp ngành Lập trình Web",
      english: "Graduated in Web Development",
    },
    company: {
      vietnamese: "Cao đẳng FPT Polytechnic Cần Thơ",
      english: "FPT Polytechnic College Can Tho",
    },
    time: "12/2024",
    description: {
      vietnamese:
        "Chính thức tốt nghiệp ngành Lập trình Web tại FPT Polytechnic Cần Thơ với GPA 9.1. Kết thúc hành trình học tập và chuẩn bị cho công việc mới.",
      english:
        "Officially graduated in Web Development at FPT Polytechnic Can Tho with a GPA of 9.1. Ended the learning journey and prepared for a new job.",
    },
    icon: React.createElement(PiGraduationCap),
  },
  {
    title: {
      vietnamese: "Quán quân",
      english: "Champion",
    },
    company: {
      vietnamese: "FPT Edu Hackathon 2024: Generative AI",
      english: "FPT Edu Hackathon 2024: Generative AI",
    },
    time: "06/2024 - 07/2024",
    description: {
      vietnamese:
        "Đây là cuộc thi công nghệ dành cho học sinh, sinh viên, học viên của Tổ chức Giáo dục FPT trên toàn quốc với chủ đề Generative AI - GenAI cho phát triển bền vững, đời sống. Cuộc thi là cơ hội để tôi tìm hiểu và tiếp cận nhiều hơn với AI. Với sự cố gắng không ngừng, tôi cùng với đồng đội đã đạt giải Quán quân bảng B. Đây là một bước tiến lớn trong sự nghiệp của tôi và mở ra cho tôi nhiều cơ hội.",
      english:
        "This is a technology competition for students, students, and learners of FPT Education nationwide with the theme Generative AI - GenAI for sustainable development, life. The competition is an opportunity for me to learn and access more AI. With relentless effort, I and my teammates won the first prize in group B. This is a big step in my career and opens up many opportunities for me.",
    },
    icon: React.createElement(GoTrophy),
  },
  {
    title: {
      vietnamese: "Giải Khuyến khích",
      english: "Encouragement Award",
    },
    company: {
      vietnamese: "Landing Page Hackathon 2023 - FPT Polytechnic",
      english: "Landing Page Hackathon 2023 - FPT Polytechnic",
    },
    time: "04/2023",
    description: {
      vietnamese:
        "Đây là cuộc thi xây dựng Website Landing Page dành cho tất cả sinh viên FPT Polytechnic trên toàn quốc. Đây là cuộc thi đầu tiên của tôi và đã đạt giải khuyến khích cùng với những người bạn. Đây là động lực lớn để tôi tiếp tục học hỏi và phát triển bản thân.",
      english:
        "This is a competition to build a Landing Page Website for all FPT Polytechnic students nationwide. This is my first competition and I won the Encouragement Award with my friends. This is a great motivation for me to continue learning and developing myself.",
    },
    icon: React.createElement(IoMedalOutline),
  },
  {
    title: {
      vietnamese: "Bắt đầu học Lập trình Web",
      english: "Started Learning Web Development",
    },
    company: {
      vietnamese: "Cao đẳng FPT Polytechnic Cần Thơ",
      english: "FPT Polytechnic College Can Tho",
    },
    time: "08/2022",
    description: {
      vietnamese:
        "Bắt đầu niềm đam mê lập trình và chọn học Lập trình Web vì thích thú với việc xây dựng giao diện và dành rất nhiều thời gian tìm hiểu, thực hành với các công nghệ và ngôn ngữ mới như C, Java, Javascript, PHP để thực hiện được mong muốn trở thành lập trình viên.",
      english:
        "Started my passion for programming and chose to study Web Development because I enjoyed building interfaces. Spent a lot of time learning and practicing with new technologies and languages such as C, Java, Javascript, PHP to fulfill my desire to become a developer.",
    },
    icon: React.createElement(IoBookmarkOutline),
  },
];

export const PROJECTS = [
  {
    title: {
      vietnamese: "Ứng dụng quản lý công việc - Trello Clone",
      english: "Task Management App - Trello Clone",
    },
    image: project4,
    role: "Fullstack Developer",
    members: 1,
    video: "https://www.youtube.com/embed/JU-lxY-xmas?si=M4-C5RrYM5Dt5YTf",
    github: "https://github.com/khanhduydev04/trello-clone-public",
    link: "https://trello-lac-two.vercel.app",
    description: {
      vietnamese:
        "Ứng dụng quản lý công việc giúp cá nhân và đội nhóm tổ chức, theo dõi và quản lý công việc một cách trực quan và hiệu quả. Cung cấp công cụ mạnh mẽ để lập kế hoạch, phân công nhiệm vụ và giám sát tiến độ dự án. Hỗ trợ đăng nhập/đăng ký với xác thực email, đảm bảo bảo mật với JWT và Axios Interceptor. Người dùng có thể tạo board, thêm column và card để hệ thống hóa ý tưởng và công việc. Hỗ trợ kéo thả card và column giúp sắp xếp linh hoạt. Tích hợp thông báo realtime với Socket.io để cập nhật thay đổi ngay lập tức.",
      english:
        "A task management application inspired by Trello, designed to help individuals and teams organize, manage, and track their tasks and projects visually and efficiently. Provides powerful tools for planning, task assignment, and project monitoring. Supports login/register with email verification, ensuring security with JWT and Axios Interceptor. Users can create boards, add columns and cards to structure their ideas and workflow. Drag-and-drop functionality allows for flexible task organization. Real-time notifications with Socket.io ensure instant updates on changes.",
    },
    technologies: [
      "ReactJs",
      "NodeJs",
      "Express",
      "Material UI",
      "Redux",
      "MongoDB",
      "Dnd-kit",
      "JWT",
      "Socket.IO",
      "Cloudinary",
      "Brevo",
    ],
  },
  {
    title: {
      vietnamese:
        "Hệ thống hỗ trợ khám sàng lọc bệnh tích hợp trí tuệ nhân tạo - Pharmartist",
      english: "AI-integrated Disease Screening Support System - Pharmartist",
    },
    image: project1,
    role: "Fullstack Developer",
    members: 4,
    video: "https://www.youtube.com/embed/dGMIdTgodU0?si=10YTNBabF3ZUL1C5",
    description: {
      vietnamese:
        "Pharmartist là hệ thống được xây dựng nhằm hỗ trợ đội ngũ y bác sĩ tại bệnh viện, phòng khám trong việc khám sàng lọc bệnh và số hóa quy trình khám chữa bệnh. Hệ thống cho phép người bệnh khai báo các thông, triệu chứng bằng giọng nói, sau đó hệ thống sẽ phân tích và đưa ra chẩn đoán sơ bộ. Hệ thống cũng hỗ trợ cho bác sĩ đưa ra chẩn đoán cuối cùng từ danh sách chẩn đoán sơ bộ và gợi ý đơn thuốc từ bệnh đã được xác nhận.",
      english:
        "Pharmartist is a system built to support doctors and medical staff in hospitals and clinics in disease screening and digitizing the medical examination process. The system allows patients to declare information and symptoms by voice, then the system will analyze and provide a preliminary diagnosis. The system also supports doctors in making the final diagnosis from the preliminary diagnosis list and suggesting prescriptions for confirmed diseases.",
    },
    technologies: [
      "ReactJs",
      "NodeJs",
      "Express",
      "MongoDB",
      "Gemini API",
      "Langchain",
      "AssemblyAI API",
      "Firebase",
    ],
  },
  {
    title: {
      vietnamese: "Zalo Mini App - Trường Trung Tiểu học Việt Anh School",
      english: "Zalo Mini App - Viet Anh Primary and Secondary School",
    },
    image: project2,
    role: "Frontend Developer",
    certificate:
      "https://xuongthuchanh.poly.edu.vn/certificate/PC06216/67775caff317cf49cd29108d",
    members: 6,
    description: {
      vietnamese:
        "Dự án kết hợp cùng với đối tác, Trường Trung Tiểu học Việt Anh School là một ứng dụng mini trên nền tảng Zalo. App bao gồm các chức năng quản lý thông tin học sinh, xem thời khóa biểu, điểm số, xin nghỉ phép, đăng ký các khóa học, dịch vụ xe bus, ăn uống, thông báo, và gửi tin nhắn trực tiếp giữa phụ huynh và giáo viên.",
      english:
        "The project in collaboration with the partner, Viet Anh Primary and Secondary School, is a mini app on the Zalo platform. The app includes functions for managing student information, viewing timetables, grades, requesting leave, registering for courses, bus services, meals, notifications, and sending direct messages between parents and teachers.",
    },
    technologies: [
      "ReactJs",
      "Tailwind",
      "Zalo Mini App UI",
      "React Hook Form",
    ],
  },
  {
    title: {
      vietnamese: "Personal Portfolio Website",
      english: "Personal Portfolio Website",
    },
    image: project3,
    github: "https://github.com/khanhduydev04/portfolio-khanhduydev",
    link: "https://khanhduydev04.github.io/portfolio-khanhduydev/",
    description: {
      vietnamese:
        "Một website cá nhân giới thiệu bản thân, dự án, kỹ năng và thông tin liên hệ.",
      english:
        "A personal website introducing myself, projects, skills, and contact information.",
    },
    technologies: ["ReactJs", "Tailwind", "Framer Motion"],
  },
];

export const CONTACT = {
  address: {
    vietnamese: "Huyện Bình Tân, Tỉnh Vĩnh Long",
    english: "Binh Tan District, Vinh Long Province",
    icon: React.createElement(FaMapMarkerAlt),
  },
  email: "vokhanhduy2004@gmail.com",
  linkedin: {
    url: "https://www.linkedin.com/in/vo-khanh-duy-649744349",
    icon: React.createElement(FaLinkedin),
  },
  github: {
    url: "https://github.com/khanhduydev04",
    icon: React.createElement(FaGithub),
  },
  facebook: {
    url: "https://www.facebook.com/KhanhDuy.Goalkeeper",
    icon: React.createElement(FaFacebook),
  },
};

export const SKILLS = [
  {
    name: "javascript",
    src: javascript,
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    name: "typescript",
    src: typescript,
    link: "https://www.typescriptlang.org",
  },
  {
    name: "react",
    src: react,
    link: "https://react.dev",
  },
  {
    name: "nextjs",
    light: nextjsDark,
    dark: nextjsLight,
    link: "https://nextjs.org",
  },
  {
    name: "nodejs",
    src: nodejs,
    link: "https://nodejs.org/en",
  },
  {
    name: "redux",
    src: redux,
    link: "https://redux.js.org",
  },
  {
    name: "zustand",
    src: zustand,
    link: "https://zustand.docs.pmnd.rs",
  },
  {
    name: "tailwind",
    src: tailwind,
    link: "https://tailwindcss.com",
  },
  {
    name: "material-ui",
    src: materialui,
    link: "https://mui.com",
  },
  {
    name: "sass",
    src: sass,
    link: "https://sass-lang.com",
  },
  {
    name: "mongodb",
    src: mongodb,
    link: "https://www.mongodb.com",
  },
  {
    name: "mysql",
    src: mysql,
    link: "https://www.mysql.com",
  },
  {
    name: "sequelize",
    src: sequelize,
    link: "https://sequelize.org",
  },
  {
    name: "firebase",
    src: firebase,
    link: "https://firebase.google.com",
  },
  {
    name: "github",
    light: githubDark,
    dark: githubLight,
    link: "https://github.com",
  },
  {
    name: "figma",
    src: figma,
    link: "https://www.figma.com",
  },
];

export const TITLES = {
  hero: {
    vietnamese: "Võ Khánh Duy",
    english: "Vo Khanh Duy",
  },
  about: {
    vietnamese: ["Đôi nét về", " bản thân"],
    english: ["About", " Me"],
  },
  experiences: {
    vietnamese: "Hành trình",
    english: "Timeline",
  },
  projects: {
    vietnamese: "Dự án",
    english: "Projects",
  },
  technologies: {
    vietnamese: "Chút ít skill của mình",
    english: "Skills",
  },
  contact: {
    vietnamese: "Liên hệ",
    english: "Contact",
  },
};

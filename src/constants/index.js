import React from "react";

import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

import project1 from "../assets/projects/pharmartist.png";
import project2 from "../assets/projects/vietanhschool.png";
import project3 from "../assets/projects/portfolio.png";
import project4 from "../assets/projects/ntdstore.png";

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

import timeline1 from "../assets/timeline/fptpolytectnic.jpg";
import timeline2 from "../assets/timeline/landingpage.jpg";
import timeline3 from "../assets/timeline/generativeai.jpg";
import timeline4 from "../assets/timeline/totnghiep.jpg";
import timeline5 from "../assets/timeline/intern.jpg";

import { IoBookmarkOutline } from "react-icons/io5";
import { IoMedalOutline } from "react-icons/io5";
import { GoTrophy } from "react-icons/go";
import { PiGraduationCap } from "react-icons/pi";
import { CgWorkAlt } from "react-icons/cg";

export const HERO_CONTENT = {
  vietnamese:
    "Tôi là một lập trình viên Frontend vừa tốt nghiệp với nền tảng vững chắc về phát triển web. Với hơn 2 năm học tập trên trường, tôi đã tích lũy được kiến thức và kỹ năng thực tiễn với các công nghệ frontend như React và Next.js, cùng các công nghệ backend như Node.js, MySQL và MongoDB. Mục tiêu của tôi là tận dụng chuyên môn của mình để xây dựng những website có hiệu năng cao, giao diện thân thiện với người dùng, đồng thời không ngừng cải thiện bản thân để hướng tới trở thành lập trình viên Fullstack trong tương lai.",
  english:
    "I am a dedicated frontend developer who recently graduated with a solid foundation in web development. With over 2 years of academic experience, I have gained knowledge and practical skills in frontend technologies like React and Next.js, as well as backend technologies like Node.js, MySQL, and MongoDB. My goal is to utilize my expertise to build high-performance websites with user-friendly interfaces while continuously improving myself to achieve my aspiration of becoming a full-stack developer in the future.",
};

export const ABOUT_CONTENT = {
  vietnamese:
    "Tôi là một lập trình viên frontend đầy đam mê và nhiệt huyết, luôn cam kết xây dựng những website có hiệu năng cao và giao diện thân thiện với người dùng. Vừa mới tốt nghiệp, tôi đã tích lũy được hơn 2 năm kinh nghiệm học tập và làm việc với các công nghệ như React, Next.js, Node.js, MySQL, và MongoDB. Hành trình của tôi trong lĩnh vực phát triển web bắt đầu từ niềm đam mê tạo ra những trải nghiệm người dùng mượt mà, điều này đã thúc đẩy tôi không ngừng cải thiện kỹ năng và khám phá các xu hướng mới. Tôi yêu thích việc học hỏi công nghệ mới, giải quyết các thách thức, và hợp tác với đồng đội để mang lại kết quả vượt mong đợi. Ngoài lập trình, tôi luôn tìm cách mở rộng kiến thức, thử nghiệm những ý tưởng mới, và chuẩn bị cho mục tiêu trở thành lập trình viên fullstack trong tương lai.",
  english:
    "I am a passionate and aspiring frontend developer with a strong commitment to building high-performance and user-friendly websites. Having recently graduated, I bring over 2 years of academic experience working with technologies like React, Next.js, Node.js, MySQL, and MongoDB. My journey in web development started with a fascination for creating seamless user experiences, which has driven me to continuously improve my skills and explore the latest trends in the field. I thrive on learning new technologies, solving challenges, and collaborating with others to deliver exceptional results. Beyond coding, I enjoy expanding my knowledge, experimenting with new ideas, and preparing myself for my future goal of becoming a full-stack developer.",
};

export const TIMELINE = [
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
    image: timeline1,
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
    image: timeline2,
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
    image: timeline3,
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
    image: timeline4,
  },
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
        "Thực tập tại Trung tâm Nghiên cứu và Ứng dụng Trí tuệ nhân tạo Quy Nhơn (QAI) - FPT Software Quy Nhơn với vị trí AI Engineer. Tham gia vào các dự án về AI, Computer Vison. Học hỏi nhiều từ các chuyên gia và đồng nghiệp trong công ty từ kiến thức, kỹ năng chuyên môn, kinh nghiệm làm việc đến tinh thần làm việc chuyên nghiệp và trách nhiệm.",
      english:
        "Internship at the Quy Nhon Artificial Intelligence Research and Application Center (QAI) - FPT Software Quy Nhon as an AI Engineer. Participated in projects related to AI, Computer Vision. Learned a lot from experts and colleagues in the company from knowledge, professional skills, work experience to professional work spirit and responsibility.",
    },
    icon: React.createElement(CgWorkAlt),
    image: timeline5,
  },
];

export const PROJECTS = [
  {
    title: {
      vietnamese:
        "Hệ thống hỗ trợ khám sàng lọc bệnh tích hợp trí tuệ nhân tạo - Pharmartist",
      english: "AI-integrated Disease Screening Support System - Pharmartist",
    },
    image: project1,
    role: "Fullstack Developer",
    members: 4,
    github: "https://github.com/ThanhNha3/Pharmartist_DATN/tree/dev",
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
    github: "https://github.com/khanhduydev04/NTDShop/tree/dev",
    description: {
      vietnamese:
        "Một website cá nhân giới thiệu bản thân, dự án, kỹ năng và thông tin liên hệ.",
      english:
        "A personal website introducing myself, projects, skills, and contact information.",
    },
    technologies: ["ReactJs", "Tailwind", "Framer Motion"],
  },
  {
    title: {
      vietnamese: "Trang thương mại điện tử Laptop - NTDStore",
      english: "E-commerce Website - NTDStore",
    },
    image: project4,
    role: "Fullstack Developer",
    members: 3,
    github: "https://github.com/khanhduydev04/NTDShop/tree/dev",
    description: {
      vietnamese:
        "Trang web thương mại điện tử bán laptop với các chức năng xem danh sách, xem chi tiết, tìm kiếm, lọc sản phẩm, giỏ hàng, đặt hàng, thanh toán online VNPAY và xem lịch sử đơn hàng.",
      english:
        "An e-commerce website selling laptops with features such as viewing lists, viewing details, searching, filtering products, shopping carts, ordering, online payment VNPAY, and viewing order history.",
    },
    technologies: [
      "ReactJs",
      "APS .Net Core Web API",
      "Tailwind",
      "Shadcn/ui",
      "SQL Server",
      "Entity Framework",
      "JavaScript",
      "C#",
    ],
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
    url: "https://www.linkedin.com/in/duy-v%C3%B5-kh%C3%A1nh-649744349/",
    icon: React.createElement(FaLinkedin),
  },
  github: {
    url: "https://github.com/khanhduydev04",
    icon: React.createElement(FaGithub),
  },
  facebook: {
    url: "https://www.facebook.com/KhanhDuy.Goalkeeper/",
    icon: React.createElement(FaFacebook),
  },
};

export const SKILLS = [
  {
    name: "javascript",
    src: javascript,
  },
  {
    name: "typescript",
    src: typescript,
  },
  {
    name: "react",
    src: react,
  },
  {
    name: "nextjs",
    light: nextjsDark,
    dark: nextjsLight,
  },
  {
    name: "nodejs",
    src: nodejs,
  },
  {
    name: "redux",
    src: redux,
  },
  {
    name: "zustand",
    src: zustand,
  },
  {
    name: "tailwind",
    src: tailwind,
  },
  {
    name: "sass",
    src: sass,
  },
  {
    name: "mongodb",
    src: mongodb,
  },
  {
    name: "mysql",
    src: mysql,
  },
  {
    name: "firebase",
    src: firebase,
  },
  {
    name: "github",
    light: githubDark,
    dark: githubLight,
  },
  {
    name: "figma",
    src: figma,
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

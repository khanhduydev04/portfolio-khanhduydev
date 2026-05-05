# Portfolio 3D Space Theme Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio with an immersive space theme — single shared Three.js canvas with starfield, 3D astronaut model, solar system tech visualization, card stack projects, horizontal scroll experience timeline, and redesigned contact section.

**Architecture:** Single fixed `<Canvas>` renders all 3D elements (starfield, astronaut, solar system). DOM content scrolls above it. A `useScrollProgress` hook drives 3D element visibility/animation based on which section is in viewport. GSAP ScrollTrigger pins Projects (card stack) and Experience (horizontal scroll) sections.

**Tech Stack:** React 19, Three.js 0.170, @react-three/fiber v9, @react-three/drei v10, GSAP 3.12 + ScrollTrigger, Tailwind CSS v4

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/components/three/Starfield.jsx` | Persistent starfield background (~2000 particles, mouse parallax) |
| `src/components/three/Astronaut.jsx` | GLB model with floating, rotation, mouse parallax, scroll fade |
| `src/components/three/SolarSystem.jsx` | Sun + 3 orbit rings + 18 planet spheres with tech icon textures |
| `src/components/three/SceneManager.jsx` | Orchestrates all 3D elements — visibility and animation based on scroll |
| `src/hooks/useScrollProgress.js` | Tracks scroll position, returns normalized progress per section |

### Modified Files
| File | Changes |
|------|---------|
| `src/constants/index.js` | Add Zalo, website to CONTACT; remove placeholder project; add icon paths to TECHNOLOGIES |
| `src/App.jsx` | Replace background div with fixed Canvas + SceneManager; restructure layout |
| `src/components/sections/Hero.jsx` | Remove ParticleField import; DOM-only overlay for text/buttons |
| `src/components/sections/Technologies.jsx` | Remove TechOrbit import; simplified DOM with just title + mobile fallback |
| `src/components/sections/Projects.jsx` | Card stack with ScrollTrigger pinning, remove Card3D usage |
| `src/components/sections/Experience.jsx` | Horizontal scroll timeline with ScrollTrigger pinning |
| `src/components/sections/Contact.jsx` | 2-column redesign with Zalo, freelance CTA card |

### Files to Delete
| File | Reason |
|------|--------|
| `src/components/three/ParticleField.jsx` | Replaced by Starfield in shared canvas |
| `src/components/three/TechOrbit.jsx` | Replaced by SolarSystem in shared canvas |
| `src/components/ui/Card3D.jsx` | No longer used (Projects no longer uses tilt cards) |

---

## Task 1: Update Data Constants

**Files:**
- Modify: `src/constants/index.js`

- [ ] **Step 1: Add icon paths to TECHNOLOGIES, add Zalo/website to CONTACT, remove placeholder project**

Replace the entire `TECHNOLOGIES` export with this version that includes icon paths:

```js
export const TECHNOLOGIES = {
  frontend: [
    { name: "React", icon: "/technologies/react.png" },
    { name: "Next.js", icon: "/technologies/nextjs-white.png" },
    { name: "React Native", icon: "/technologies/react.png" },
    { name: "TypeScript", icon: "/technologies/typescript.png" },
    { name: "Tailwind CSS", icon: "/technologies/tailwind.png" },
    { name: "Redux", icon: "/technologies/redux.png" },
  ],
  backend: [
    { name: "Node.js", icon: "/technologies/nodejs.png" },
    { name: "Express.js", icon: "/technologies/nodejs.png" },
    { name: "MongoDB", icon: "/technologies/mongodb.svg" },
    { name: "PostgreSQL", icon: "/technologies/mysql.png" },
    { name: "MySQL", icon: "/technologies/mysql.png" },
    { name: "Socket.IO", icon: "/technologies/nodejs.png" },
  ],
  tools: [
    { name: "Docker", icon: "/technologies/nodejs.png" },
    { name: "Git", icon: "/technologies/github-white.png" },
    { name: "Firebase", icon: "/technologies/firebase.png" },
    { name: "Supabase", icon: "/technologies/firebase.png" },
    { name: "Figma", icon: "/technologies/figma.png" },
    { name: "Jest", icon: "/technologies/javascript.png" },
  ],
};
```

Add `zalo` and `website` to `CONTACT`:

```js
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
```

Remove the last item from `PROJECTS` array (the placeholder "Placeholder Project 8" entry at index 7).

- [ ] **Step 2: Copy tech icons to public directory**

Copy the tech icon files from `src/assets/technologies/` to `public/technologies/` so they can be loaded as textures by Three.js at runtime:

```bash
cp -r src/assets/technologies public/technologies
```

- [ ] **Step 3: Verify and commit**

```bash
npm run build
git add src/constants/index.js public/technologies/
git commit -m "feat: update constants — add tech icon paths, Zalo/website contact, remove placeholder project"
```

---

## Task 2: Create useScrollProgress Hook

**Files:**
- Create: `src/hooks/useScrollProgress.js`

- [ ] **Step 1: Create the hook**

Create `src/hooks/useScrollProgress.js`:

```js
import { useState, useEffect, useCallback } from "react";

const SECTION_IDS = ["hero", "about", "technologies", "experience", "projects", "contact"];

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [sectionProgress, setSectionProgress] = useState({});

  const update = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const overall = docHeight > 0 ? scrollY / docHeight : 0;
    setProgress(Math.min(1, Math.max(0, overall)));

    const newSectionProgress = {};
    let currentSection = "hero";

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) {
        newSectionProgress[id] = 0;
        continue;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const entered = 1 - rect.top / vh;
      const sectionProg = Math.min(1, Math.max(0, entered));
      newSectionProgress[id] = sectionProg;

      if (rect.top < vh * 0.5 && rect.bottom > vh * 0.5) {
        currentSection = id;
      }
    }

    setSectionProgress(newSectionProgress);
    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    let rafId;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [update]);

  return { progress, activeSection, sectionProgress };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useScrollProgress.js
git commit -m "feat: add useScrollProgress hook for scroll-driven 3D scene control"
```

---

## Task 3: Create Starfield Component

**Files:**
- Create: `src/components/three/Starfield.jsx`

- [ ] **Step 1: Create the starfield**

Create `src/components/three/Starfield.jsx`:

```jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Starfield({ mouse }) {
  const pointsRef = useRef();
  const count = window.innerWidth < 768 ? 800 : 2000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 0.08 + 0.02;
    }
    return s;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.005;
    pointsRef.current.rotation.x = t * 0.002;

    if (mouse?.current) {
      pointsRef.current.position.x = THREE.MathUtils.lerp(
        pointsRef.current.position.x,
        mouse.current.x * 0.5,
        0.02
      );
      pointsRef.current.position.y = THREE.MathUtils.lerp(
        pointsRef.current.position.y,
        mouse.current.y * 0.5,
        0.02
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-size" array={sizes} count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/Starfield.jsx
git commit -m "feat: add Starfield component for persistent space background"
```

---

## Task 4: Create Astronaut Component

**Files:**
- Create: `src/components/three/Astronaut.jsx`

- [ ] **Step 1: Create the astronaut component**

Create `src/components/three/Astronaut.jsx`:

```jsx
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/astronaut.glb");

export default function Astronaut({ mouse, scrollProgress = 0 }) {
  const groupRef = useRef();
  const { scene } = useGLTF("/astronaut.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.transparent = true;
        }
      }
    });
  }, [clonedScene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Floating bobbing
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.2 + 0.5;

    // Slow Y rotation
    groupRef.current.rotation.y = t * 0.1;

    // Mouse parallax tilt
    if (mouse?.current) {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        mouse.current.x * 0.1,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y * 0.1,
        0.05
      );
    }

    // Scroll fade: scale down and fade out as user scrolls past hero
    const heroFade = Math.max(0, 1 - scrollProgress * 3);
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, heroFade * 2, 0.1));

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = heroFade;
      }
    });
  });

  return (
    <group ref={groupRef} position={[2.5, 0.5, -1]}>
      <primitive object={clonedScene} />
    </group>
  );
}
```

Note: The `useMemo` import is missing. Add it to the import line:

```jsx
import { useRef, useEffect, useMemo } from "react";
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/Astronaut.jsx
git commit -m "feat: add Astronaut component with GLB model, floating animation, scroll fade"
```

---

## Task 5: Create SolarSystem Component

**Files:**
- Create: `src/components/three/SolarSystem.jsx`

- [ ] **Step 1: Create the solar system**

Create `src/components/three/SolarSystem.jsx`:

```jsx
import { useRef, useState, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { TECHNOLOGIES } from "../../constants";

function Sun() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial emissive="#f59e0b" emissiveIntensity={2} color="#f59e0b" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.1} />
      </mesh>
      <pointLight color="#f59e0b" intensity={3} distance={20} />
    </group>
  );
}

function Planet({ tech, angle, radius, speed, groupRotationRef }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(angle);

  const texture = useLoader(THREE.TextureLoader, tech.icon);

  useFrame((_, delta) => {
    if (!hovered) {
      angleRef.current += delta * speed;
    }
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angleRef.current) * radius;
      meshRef.current.position.z = Math.sin(angleRef.current) * radius;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial map={texture} emissive="#ffffff" emissiveIntensity={0.1} />
      </mesh>
      {hovered && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="px-2 py-1 bg-neutral-900/80 text-white text-xs rounded whitespace-nowrap backdrop-blur-sm">
            {tech.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function OrbitRing({ radius, color }) {
  return (
    <mesh rotation-x={Math.PI / 2}>
      <torusGeometry args={[radius, 0.01, 8, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  );
}

export default function SolarSystem({ visible, scrollProgress = 0 }) {
  const groupRef = useRef();

  const allPlanets = useMemo(() => {
    const planets = [];
    const addGroup = (items, radius, speed, color) => {
      items.forEach((tech, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        planets.push({ tech, angle, radius, speed, color });
      });
    };
    addGroup(TECHNOLOGIES.frontend, 3.5, 0.3, "#06b6d4");
    addGroup(TECHNOLOGIES.backend, 5.5, 0.2, "#8b5cf6");
    addGroup(TECHNOLOGIES.tools, 7.5, 0.12, "#f59e0b");
    return planets;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = visible;
    const targetScale = visible ? 1 : 0.5;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.3, 0.02);
  });

  return (
    <group ref={groupRef} position={[0, -15, -5]}>
      <Sun />
      <OrbitRing radius={3.5} color="#06b6d4" />
      <OrbitRing radius={5.5} color="#8b5cf6" />
      <OrbitRing radius={7.5} color="#f59e0b" />
      {allPlanets.map((p, i) => (
        <Planet key={i} tech={p.tech} angle={p.angle} radius={p.radius} speed={p.speed} />
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/SolarSystem.jsx
git commit -m "feat: add SolarSystem component with tech logo planets orbiting a sun"
```

---

## Task 6: Create SceneManager Component

**Files:**
- Create: `src/components/three/SceneManager.jsx`

- [ ] **Step 1: Create the scene manager**

This component lives inside the Canvas and orchestrates all 3D elements based on scroll position.

Create `src/components/three/SceneManager.jsx`:

```jsx
import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import Starfield from "./Starfield";
import Astronaut from "./Astronaut";
import SolarSystem from "./SolarSystem";

export default function SceneManager({ scrollData, mouse }) {
  const { activeSection, sectionProgress } = scrollData;

  const heroProgress = sectionProgress.hero || 0;
  const techVisible = activeSection === "technologies";
  const techProgress = sectionProgress.technologies || 0;

  return (
    <>
      <ambientLight intensity={0.3} color="#4477aa" />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />

      <Starfield mouse={mouse} />
      <Astronaut mouse={mouse} scrollProgress={heroProgress} />
      <SolarSystem visible={techVisible} scrollProgress={techProgress} />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/SceneManager.jsx
git commit -m "feat: add SceneManager to orchestrate all 3D elements by scroll position"
```

---

## Task 7: Restructure App.jsx with Shared Canvas

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Rewrite App.jsx**

Replace the entire content of `src/App.jsx`:

```jsx
import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "./contexts/themeContext";
import { useScrollProgress } from "./hooks/useScrollProgress";
import SceneManager from "./components/three/SceneManager";
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
  const scrollData = useScrollProgress();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />

      {/* Fixed 3D Canvas Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: darkMode ? "#0a0a0a" : "#050510" }}
        >
          <SceneManager scrollData={scrollData} mouse={mouse} />
        </Canvas>
      </div>

      {/* Scrollable DOM Content */}
      <div className="relative z-10 font-inter text-neutral-200 antialiased">
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

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: restructure App with single shared Canvas background + scrollable DOM"
```

---

## Task 8: Update Hero Section (DOM-only)

**Files:**
- Modify: `src/components/sections/Hero.jsx`

- [ ] **Step 1: Rewrite Hero to remove ParticleField, keep DOM content**

Replace the entire content of `src/components/sections/Hero.jsx`:

```jsx
import { useEffect } from "react";
import { gsap } from "gsap";
import { useTheme } from "../../contexts/themeContext";
import { HERO_CONTENT } from "../../constants";
import MagneticButton from "../ui/MagneticButton";
import { HiArrowDown } from "react-icons/hi";

export default function Hero() {
  const { language } = useTheme();

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.5 });

    tl.fromTo(
      ".hero-greeting",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    )
      .fromTo(
        ".hero-name span",
        { opacity: 0, y: 50, rotateX: -90 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.04, duration: 0.5, ease: "power3.out" }
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
    <section id="hero" className="relative min-h-screen flex items-center">
      <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 w-full">
        <div className="max-w-2xl">
          <p className="hero-greeting text-lg md:text-xl text-neutral-400 mb-4 opacity-0">
            {HERO_CONTENT.greeting[language]}
          </p>

          <h1
            className="hero-name text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-white"
            style={{ perspective: "600px" }}
          >
            {nameChars.map((char, i) => (
              <span key={i} className="inline-block opacity-0" style={{ transformStyle: "preserve-3d" }}>
                {char === " " ? " " : char}
              </span>
            ))}
          </h1>

          <p className="hero-role text-2xl md:text-3xl font-medium text-cyan-400 mb-6 opacity-0">
            {HERO_CONTENT.role[language]}
          </p>

          <p className="hero-tagline text-base md:text-lg text-neutral-300 max-w-xl mb-10 opacity-0 leading-relaxed">
            {HERO_CONTENT.tagline[language]}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <MagneticButton
              href="/Vo Khanh Duy - Frontend Developer.pdf"
              className="hero-cta inline-block px-6 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors opacity-0"
            >
              Download CV
            </MagneticButton>
            <MagneticButton
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="hero-cta inline-block px-6 py-3 border border-cyan-500 text-cyan-400 rounded-full font-medium hover:bg-cyan-500/10 transition-colors opacity-0"
            >
              {language === "vietnamese" ? "Liên hệ" : "Get in touch"}
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0">
        <HiArrowDown className="text-2xl text-neutral-400 animate-bounce" />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Hero.jsx
git commit -m "feat: update Hero section — DOM-only overlay, left-aligned, transparent background"
```

---

## Task 9: Update Technologies Section

**Files:**
- Modify: `src/components/sections/Technologies.jsx`

- [ ] **Step 1: Rewrite Technologies section**

The 3D solar system now renders in the shared canvas (SceneManager), so this section only needs the title and a spacer for the 3D content, plus mobile fallback.

Replace the entire content of `src/components/sections/Technologies.jsx`:

```jsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTheme } from "../../contexts/themeContext";
import { TECHNOLOGIES } from "../../constants";
import SplitText from "../ui/SplitText";

function MobileFallback() {
  const allTech = [
    ...TECHNOLOGIES.frontend,
    ...TECHNOLOGIES.backend,
    ...TECHNOLOGIES.tools,
  ];
  const containerRef = useRef(null);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll(".tech-item");
    if (!items) return;
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
          className="tech-item flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 opacity-0 hover:border-cyan-500/50 transition-colors"
        >
          <span className="text-sm text-neutral-300 text-center font-medium">
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
    <section id="technologies" className="py-20 lg:py-32 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          {language === "vietnamese" ? "Công nghệ" : "Technologies"}
        </SplitText>

        {isMobile ? (
          <MobileFallback />
        ) : (
          <div className="h-[500px] lg:h-[600px]" />
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Technologies.jsx
git commit -m "feat: simplify Technologies section — 3D renders in shared canvas, DOM has title + spacer"
```

---

## Task 10: Rewrite Projects Section — Card Stack

**Files:**
- Modify: `src/components/sections/Projects.jsx`

- [ ] **Step 1: Rewrite Projects with card stack + ScrollTrigger pinning**

Replace the entire content of `src/components/sections/Projects.jsx`:

```jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { PROJECTS } from "../../constants";
import SplitText from "../ui/SplitText";
import { FiExternalLink, FiGithub } from "react-icons/fi";

function ProjectCard({ project, language, index, total }) {
  const title =
    typeof project.title === "string"
      ? project.title
      : project.title[language];
  const description = project.description[language];

  return (
    <div
      className="project-stack-card absolute inset-0 flex items-center justify-center"
      style={{ zIndex: total - index }}
    >
      <div className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-cyan-400 font-mono">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="flex gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-cyan-400 transition-colors"
              >
                <FiExternalLink size={18} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-cyan-400 transition-colors"
              >
                <FiGithub size={18} />
              </a>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-neutral-300 mb-6 leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const stackRef = useRef(null);
  const projects = PROJECTS.filter((p) => !p.technologies.includes("TBD"));

  useEffect(() => {
    const cards = gsap.utils.toArray(".project-stack-card");
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i === 0) return;

        gsap.set(card, { yPercent: 0, rotateX: 0, opacity: 1, scale: 1 });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: () => `top+=${i * 30}% top`,
          end: () => `top+=${i * 30 + 25}% top`,
          scrub: 0.5,
          onUpdate: (self) => {
            // Current card stays, previous card flies away
            const prev = cards[i - 1];
            gsap.set(prev, {
              yPercent: -self.progress * 100,
              rotateX: self.progress * 15,
              opacity: 1 - self.progress,
              scale: 1 - self.progress * 0.1,
            });
          },
        });
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${cards.length * 30}%`,
        pin: true,
        pinSpacing: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section ref={sectionRef} id="projects" className="min-h-screen py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          {language === "vietnamese" ? "Dự án" : "Projects"}
        </SplitText>

        <div ref={stackRef} className="relative h-[400px]" style={{ perspective: "1000px" }}>
          {projects.map((project, i) => (
            <ProjectCard
              key={i}
              project={project}
              language={language}
              index={i}
              total={projects.length}
            />
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
git commit -m "feat: rewrite Projects section — card stack with ScrollTrigger pinning and flip animation"
```

---

## Task 11: Rewrite Experience Section — Horizontal Scroll Timeline

**Files:**
- Modify: `src/components/sections/Experience.jsx`

- [ ] **Step 1: Rewrite Experience with horizontal scroll**

Replace the entire content of `src/components/sections/Experience.jsx`:

```jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { EXPERIENCE, EDUCATION } from "../../constants";
import SplitText from "../ui/SplitText";
import { HiAcademicCap } from "react-icons/hi";

function TimelineNode({ item, index, isEducation = false }) {
  const { language } = useTheme();
  const cardRef = useRef(null);
  const isTop = index % 2 === 0;

  return (
    <div className="timeline-stop flex-shrink-0 w-[80vw] md:w-[50vw] lg:w-[40vw] relative flex flex-col items-center">
      {/* Card */}
      <div
        ref={cardRef}
        className={`timeline-card w-full max-w-md ${isTop ? "order-1 mb-8" : "order-3 mt-8"}`}
      >
        <div
          className={`p-6 rounded-xl backdrop-blur-md border transition-all duration-300 ${
            isEducation
              ? "bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30"
              : "bg-white/5 border-white/10 hover:border-cyan-500/30"
          }`}
        >
          <span className="text-sm text-cyan-400 font-medium font-mono">
            {isEducation ? EDUCATION.time : item.time}
          </span>
          <h3 className="text-lg font-bold mt-1 text-white">
            {isEducation ? EDUCATION.degree[language] : item.title[language]}
          </h3>
          <p className="text-sm text-purple-400 font-medium">
            {isEducation ? EDUCATION.school : item.company}
          </p>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
            {isEducation
              ? `${EDUCATION.major[language]} • GPA: ${EDUCATION.gpa}`
              : item.description[language]}
          </p>
        </div>
      </div>

      {/* Node on track */}
      <div className="order-2 relative z-10">
        <div
          className={`timeline-node w-5 h-5 rounded-full border-4 border-neutral-900 shadow-lg ${
            isEducation
              ? "bg-amber-500 shadow-amber-500/30"
              : "bg-cyan-500 shadow-cyan-500/30"
          }`}
        >
          {isEducation && (
            <HiAcademicCap className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 text-lg" />
          )}
        </div>
      </div>

      {/* Spacer for opposite side */}
      <div className={`${isTop ? "order-3" : "order-1"} h-24`} />
    </div>
  );
}

export default function Experience() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const totalWidth = track.scrollWidth - window.innerWidth;

      // Horizontal scroll via pin
      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Stagger card reveals
      gsap.fromTo(
        ".timeline-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Node scale animation
      gsap.fromTo(
        ".timeline-node",
        { scale: 0 },
        {
          scale: 1,
          stagger: 0.15,
          duration: 0.4,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const allItems = [
    ...EXPERIENCE.map((item, i) => ({ item, index: i, isEducation: false })),
    { item: null, index: EXPERIENCE.length, isEducation: true },
  ];

  return (
    <section ref={sectionRef} id="experience" className="overflow-hidden">
      <div className="pt-20 lg:pt-32 pb-8 container mx-auto px-4 lg:px-8">
        <SplitText className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          {language === "vietnamese" ? "Kinh nghiệm" : "Experience"}
        </SplitText>
      </div>

      {/* Timeline track area */}
      <div className="relative h-[60vh] flex items-center">
        {/* Track line */}
        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/10">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Scrollable content */}
        <div ref={trackRef} className="flex items-center gap-8 px-[10vw]">
          {allItems.map(({ item, index, isEducation }) => (
            <TimelineNode
              key={index}
              item={item}
              index={index}
              isEducation={isEducation}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Experience.jsx
git commit -m "feat: rewrite Experience section — horizontal scroll timeline with pinning"
```

---

## Task 12: Rewrite Contact Section

**Files:**
- Modify: `src/components/sections/Contact.jsx`

- [ ] **Step 1: Rewrite Contact with 2-column layout, Zalo, and freelance CTA**

Replace the entire content of `src/components/sections/Contact.jsx`:

```jsx
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
          {/* Left Column — Contact Info */}
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

            {/* Freelance CTA */}
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

          {/* Right Column — Social Links */}
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
```

- [ ] **Step 2: Verify SiZalo icon exists in react-icons**

Run: `npm list react-icons`

If `SiZalo` is not available in the installed version, replace with a generic message icon:

```jsx
// Replace: import { SiZalo } from "react-icons/si";
// With:    import { SiZalo } from "react-icons/si"; — if not found, use HiChat from "react-icons/hi"
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contact.jsx
git commit -m "feat: redesign Contact section — 2-column layout, Zalo, freelance CTA card"
```

---

## Task 13: Delete Old Files and Clean Up

**Files:**
- Delete: `src/components/three/ParticleField.jsx`
- Delete: `src/components/three/TechOrbit.jsx`
- Delete: `src/components/ui/Card3D.jsx`

- [ ] **Step 1: Delete files no longer in use**

```bash
rm src/components/three/ParticleField.jsx
rm src/components/three/TechOrbit.jsx
rm src/components/ui/Card3D.jsx
```

- [ ] **Step 2: Verify no remaining imports reference deleted files**

Search for any imports of the deleted files:
- `ParticleField` — was only imported in Hero.jsx (already updated)
- `TechOrbit` — was only imported in Technologies.jsx (already updated)
- `Card3D` — was only imported in Projects.jsx (already updated)

- [ ] **Step 3: Commit**

```bash
git add -u
git commit -m "chore: remove ParticleField, TechOrbit, Card3D — replaced by shared canvas components"
```

---

## Task 14: Build Verification and Visual Testing

- [ ] **Step 1: Install any missing dependencies if needed**

The project should already have all needed deps. Verify:

```bash
npm ls three @react-three/fiber @react-three/drei gsap react-icons
```

- [ ] **Step 2: Run build to check for compile errors**

```bash
npm run build
```

Fix any TypeScript/import errors that appear.

- [ ] **Step 3: Start dev server and visual test**

```bash
npm run dev
```

Open browser and verify:
1. Starfield background visible and moving on all sections
2. Astronaut model loads in Hero, floats, fades on scroll
3. Solar system appears in Technologies section with orbiting planets
4. Projects card stack pins and flips cards on scroll
5. Experience horizontal timeline scrolls correctly with pinning
6. Contact section shows all info, Zalo link, and freelance CTA
7. Mobile responsiveness works

- [ ] **Step 4: Fix any issues found during testing**

Address any visual bugs, layout issues, or console errors found during Step 3.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: resolve build and visual issues from 3D redesign integration"
```

---

## Task Summary

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | Update data constants (icons, contacts, projects) | None |
| 2 | Create useScrollProgress hook | None |
| 3 | Create Starfield component | None |
| 4 | Create Astronaut component | None |
| 5 | Create SolarSystem component | Task 1 (icon paths) |
| 6 | Create SceneManager | Tasks 2, 3, 4, 5 |
| 7 | Restructure App.jsx with shared Canvas | Tasks 2, 6 |
| 8 | Update Hero section (DOM-only) | Task 7 |
| 9 | Update Technologies section | Task 7 |
| 10 | Rewrite Projects — card stack | Task 7 |
| 11 | Rewrite Experience — horizontal scroll | Task 7 |
| 12 | Rewrite Contact section | Task 1 |
| 13 | Delete old files | Tasks 8, 9, 10 |
| 14 | Build verification and visual testing | All tasks |

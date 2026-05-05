# Portfolio Redesign — Space Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio from a camera-fly-through scroll to a normal top-to-bottom scroll layout with space/cosmos theme and a persistent astronaut character.

**Architecture:** Single fixed Three.js canvas with starfield background + astronaut + per-section 3D objects. Camera is stationary (only mouse parallax). Content scrolls normally on top. GSAP ScrollTrigger controls astronaut position and 3D object entrance animations.

**Tech Stack:** React 19, Vite 6, Three.js (React Three Fiber), GSAP (ScrollTrigger), Tailwind CSS 4, @react-three/drei, @react-three/postprocessing

---

## File Map

### New Files to Create
| File | Responsibility |
|------|---------------|
| `src/components/canvas/Scene.jsx` | Canvas wrapper, camera, lighting, orchestrates all 3D |
| `src/components/canvas/Background.jsx` | Starfield particles + nebula planes |
| `src/components/canvas/Astronaut.jsx` | GLTF astronaut with scroll-driven position |
| `src/components/canvas/PostProcessing.jsx` | Theme-aware bloom, vignette, chromatic aberration |
| `src/components/canvas/sections/HeroScene.jsx` | Planet + asteroids |
| `src/components/canvas/sections/AboutScene.jsx` | Space station ring + orbs |
| `src/components/canvas/sections/TechScene.jsx` | Star + orbit rings + tech icons |
| `src/components/canvas/sections/ExperienceScene.jsx` | Asteroid belt + connector lines |
| `src/components/canvas/sections/ProjectsScene.jsx` | Floating glowing planes |
| `src/components/canvas/sections/ContactScene.jsx` | Portal vortex |
| `src/components/sections/Hero.jsx` | Hero content (replaces HeroOverlay) |
| `src/components/sections/About.jsx` | About content (replaces AboutOverlay) |
| `src/components/sections/Tech.jsx` | Tech content (replaces TechOverlay) |
| `src/components/sections/Experience.jsx` | Experience content (replaces ExperienceOverlay) |
| `src/components/sections/Projects.jsx` | Projects content (replaces ProjectsOverlay) |
| `src/components/sections/Contact.jsx` | Contact content (replaces ContactOverlay) |
| `src/hooks/useScrollProgress.js` | Normalized scroll position (0-1) |
| `src/hooks/useMouseParallax.js` | Mouse offset for camera, disabled on touch |

### Files to Modify
| File | Change |
|------|--------|
| `src/App.jsx` | New layout structure (fixed canvas + scrollable main) |
| `src/index.css` | Space theme CSS variables, backgrounds, transitions |
| `src/contexts/themeContext.jsx` | Add `isMobile`/`isTablet` responsive state |

### Files to Delete (after migration complete)
| File | Reason |
|------|--------|
| `src/components/three/` (entire directory) | Replaced by `canvas/` |
| `src/components/sections/*Overlay.jsx` (6 files) | Replaced by new section components |
| `src/components/layout/PageLoader.jsx` | Simplify — remove loading screen |
| `src/hooks/useMousePosition.js` | Replaced by `useMouseParallax.js` |

### Files to Keep Unchanged
- `src/main.jsx`
- `src/constants/index.js`
- `src/components/layout/Header.jsx`
- `src/components/layout/Footer.jsx`
- `src/components/layout/CustomCursor.jsx`
- `src/components/layout/ScrollProgress.jsx`
- `src/components/ui/MagneticButton.jsx`
- `src/components/ui/SplitText.jsx`
- `src/components/ui/Card3D.jsx`

---

## Task 1: Project Setup & Astronaut Model

**Files:**
- Create: `src/assets/models/` directory
- Create: `src/hooks/useScrollProgress.js`
- Create: `src/hooks/useMouseParallax.js`

- [ ] **Step 1: Download astronaut model**

Find a free astronaut GLB model. Good source: Sketchfab (CC license) or readyplayer.me. Download and place at `src/assets/models/astronaut.glb`. If no suitable free model is found, use a placeholder (a simple capsule shape) and note it for later replacement.

Alternative: use this free model from the drei library temporarily:
```bash
# If no GLB is available, we'll create a placeholder in Task 5
```

- [ ] **Step 2: Create useScrollProgress hook**

```javascript
// src/hooks/useScrollProgress.js
import { useState, useEffect } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress(window.scrollY / scrollHeight);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}
```

- [ ] **Step 3: Create useMouseParallax hook**

```javascript
// src/hooks/useMouseParallax.js
import { useRef, useEffect } from "react";

export function useMouseParallax(strength = 0.3) {
  const mouse = useRef({ x: 0, y: 0 });
  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = "ontouchstart" in window;
    if (isTouch.current) return;

    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2 * strength;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2 * strength;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [strength]);

  return mouse;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useScrollProgress.js src/hooks/useMouseParallax.js
git commit -m "feat: add useScrollProgress and useMouseParallax hooks"
```

---

## Task 2: Theme Context Update & CSS Variables

**Files:**
- Modify: `src/contexts/themeContext.jsx`
- Modify: `src/index.css`

- [ ] **Step 1: Update themeContext with responsive breakpoints**

```javascript
// src/contexts/themeContext.jsx
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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkBreakpoints = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkBreakpoints();
    window.addEventListener("resize", checkBreakpoints);
    return () => window.removeEventListener("resize", checkBreakpoints);
  }, []);

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
      value={{ language, darkMode, isMobile, isTablet, toggleLanguage, toggleDarkMode }}
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

- [ ] **Step 2: Update index.css with space theme**

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-space-900: #0a0a0f;
  --color-space-800: #0d1117;
  --color-space-700: #161b22;
  --color-space-light: #f0f4ff;
  --color-space-light-alt: #e8eeff;
  --color-accent-cyan: #06b6d4;
  --color-accent-purple: #8b5cf6;
  --color-accent-neon: #22d3ee;
  --color-accent-indigo: #4f46e5;
  --color-accent-violet: #7c3aed;
  --color-accent-sky: #0ea5e9;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--color-space-900);
  color: #ffffff;
  transition: background-color 0.5s ease, color 0.3s ease;
}

body:not(.dark) {
  background: var(--color-space-light);
  color: #1f2937;
}

.dark body,
:root.dark body {
  background: var(--color-space-900);
  color: #ffffff;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.3);
  border-radius: 3px;
}

::selection {
  background: rgba(6, 182, 212, 0.3);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/contexts/themeContext.jsx src/index.css
git commit -m "feat: update theme context with responsive breakpoints and space CSS"
```

---

## Task 3: Canvas Scene Shell & Background

**Files:**
- Create: `src/components/canvas/Scene.jsx`
- Create: `src/components/canvas/Background.jsx`
- Create: `src/components/canvas/PostProcessing.jsx`

- [ ] **Step 1: Create Background component (starfield + nebula)**

```jsx
// src/components/canvas/Background.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../contexts/themeContext";

function Starfield() {
  const ref = useRef();
  const { darkMode, isMobile } = useTheme();
  const count = isMobile ? 200 : 800;

  const [positions, opacities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const op = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      op[i] = Math.random();
    }
    return [pos, op];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    const attr = ref.current.geometry.attributes.opacity;
    for (let i = 0; i < count; i++) {
      attr.array[i] = opacities[i] * (0.5 + 0.5 * Math.sin(time * 0.5 + i));
    }
    attr.needsUpdate = true;
  });

  const maxOpacity = darkMode ? 1.0 : 0.4;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-opacity" array={new Float32Array(count).fill(1)} count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={darkMode ? "#ffffff" : "#6366f1"}
        transparent
        opacity={maxOpacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Nebula() {
  const ref = useRef();
  const { darkMode, isMobile } = useTheme();
  const planeCount = isMobile ? 1 : 3;

  const planes = useMemo(() => {
    return Array.from({ length: planeCount }, (_, i) => ({
      position: [(i - 1) * 15, (Math.random() - 0.5) * 10, -20 - i * 5],
      rotation: [0, 0, Math.random() * Math.PI],
      scale: 30 + i * 10,
      color: darkMode
        ? ["#4f46e5", "#06b6d4", "#8b5cf6"][i] || "#4f46e5"
        : ["#c7d2fe", "#a5f3fc", "#e9d5ff"][i] || "#c7d2fe",
    }));
  }, [planeCount, darkMode]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <group ref={ref}>
      {planes.map((plane, i) => (
        <mesh key={i} position={plane.position} rotation={plane.rotation}>
          <planeGeometry args={[plane.scale, plane.scale]} />
          <meshBasicMaterial
            color={plane.color}
            transparent
            opacity={darkMode ? 0.06 : 0.03}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Background() {
  return (
    <group>
      <Starfield />
      <Nebula />
    </group>
  );
}
```

- [ ] **Step 2: Create PostProcessing component**

```jsx
// src/components/canvas/PostProcessing.jsx
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { useTheme } from "../../contexts/themeContext";

export default function PostProcessing() {
  const { darkMode, isMobile } = useTheme();

  if (isMobile) return null;

  return (
    <EffectComposer>
      <Bloom
        intensity={darkMode ? 0.8 : 0.3}
        luminanceThreshold={darkMode ? 0.6 : 0.8}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      {darkMode && (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.0003, 0.0003)}
        />
      )}
      <Vignette
        darkness={darkMode ? 0.4 : 0.2}
        offset={0.3}
      />
    </EffectComposer>
  );
}
```

- [ ] **Step 3: Create Scene wrapper**

```jsx
// src/components/canvas/Scene.jsx
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "../../contexts/themeContext";
import { useMouseParallax } from "../../hooks/useMouseParallax";
import Background from "./Background";
import PostProcessing from "./PostProcessing";
import CameraRig from "./CameraRig";

function CameraRig() {
  const mouse = useMouseParallax(0.3);
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mouse.current.x - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current.y - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Scene() {
  const { darkMode, isMobile } = useTheme();

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 200 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: darkMode ? "#0a0a0f" : "#f0f4ff" }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <ambientLight intensity={darkMode ? 0.1 : 0.3} />
          <Background />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

Note: `CameraRig` will be moved inline into Scene.jsx. The import of `useThree` and `useFrame` from `@react-three/fiber` is needed inside the Canvas.

- [ ] **Step 4: Commit**

```bash
git add src/components/canvas/Scene.jsx src/components/canvas/Background.jsx src/components/canvas/PostProcessing.jsx
git commit -m "feat: add 3D canvas shell with starfield background and post-processing"
```

---

## Task 4: Astronaut Component with Scroll-Driven Animation

**Files:**
- Create: `src/components/canvas/Astronaut.jsx`

- [ ] **Step 1: Create Astronaut component**

If a real GLTF model is available at `src/assets/models/astronaut.glb`, use `useGLTF`. Otherwise, create a placeholder capsule astronaut.

```jsx
// src/components/canvas/Astronaut.jsx
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useTheme } from "../../contexts/themeContext";

gsap.registerPlugin(ScrollTrigger);

const KEYFRAMES = [
  { progress: 0, position: [0, 0, 5], rotation: [0, 0, 0.1], scale: 1 },
  { progress: 0.2, position: [4, 1, 3], rotation: [0, -0.3, 0.26], scale: 0.9 },
  { progress: 0.4, position: [-4, 0, 4], rotation: [0, 0.4, -0.1], scale: 0.9 },
  { progress: 0.6, position: [0, 3, 6], rotation: [0.2, 0, 0], scale: 0.6 },
  { progress: 0.8, position: [3, -2, 4], rotation: [-0.1, -0.2, 0.15], scale: 0.85 },
  { progress: 1.0, position: [0, 0, 3], rotation: [0, 0, 0], scale: 0.9 },
];

const MOBILE_KEYFRAMES = [
  { progress: 0, position: [0, 1, 5], rotation: [0, 0, 0.1], scale: 0.8 },
  { progress: 0.2, position: [2, 1, 3], rotation: [0, -0.3, 0.26], scale: 0.7 },
  { progress: 0.4, position: [-2, 0, 4], rotation: [0, 0.4, -0.1], scale: 0.7 },
  { progress: 0.6, position: [0, 2, 6], rotation: [0.2, 0, 0], scale: 0.5 },
  { progress: 0.8, position: [1.5, -1, 4], rotation: [-0.1, -0.2, 0.15], scale: 0.7 },
  { progress: 1.0, position: [0, 0, 3], rotation: [0, 0, 0], scale: 0.7 },
];

function PlaceholderAstronaut() {
  const { darkMode } = useTheme();
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.8}
          roughness={0.2}
          emissive={darkMode ? "#06b6d4" : "#4f46e5"}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Backpack */}
      <mesh position={[0, -0.1, -0.35]}>
        <boxGeometry args={[0.5, 0.6, 0.3]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Astronaut() {
  const groupRef = useRef();
  const scrollProgress = useRef(0);
  const { isMobile } = useTheme();
  const keyframes = isMobile ? MOBILE_KEYFRAMES : KEYFRAMES;

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const p = scrollProgress.current;
    const time = state.clock.elapsedTime;

    let fromIdx = 0;
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (p >= keyframes[i].progress && p <= keyframes[i + 1].progress) {
        fromIdx = i;
        break;
      }
    }
    if (p >= keyframes[keyframes.length - 1].progress) {
      fromIdx = keyframes.length - 2;
    }

    const from = keyframes[fromIdx];
    const to = keyframes[fromIdx + 1];
    const localProgress = (p - from.progress) / (to.progress - from.progress);
    const t = Math.max(0, Math.min(1, localProgress));
    const eased = t * t * (3 - 2 * t);

    groupRef.current.position.x = THREE.MathUtils.lerp(from.position[0], to.position[0], eased);
    groupRef.current.position.y = THREE.MathUtils.lerp(from.position[1], to.position[1], eased) + Math.sin(time * 2) * 0.1;
    groupRef.current.position.z = THREE.MathUtils.lerp(from.position[2], to.position[2], eased);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(from.rotation[0], to.rotation[0], eased);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(from.rotation[1], to.rotation[1], eased);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(from.rotation[2], to.rotation[2], eased) + Math.sin(time * 1.5) * 0.03;

    const scale = THREE.MathUtils.lerp(from.scale, to.scale, eased);
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <PlaceholderAstronaut />
    </group>
  );
}
```

- [ ] **Step 2: Add Astronaut to Scene**

Update `src/components/canvas/Scene.jsx` to import and render `<Astronaut />` after `<Background />`:

```jsx
import Astronaut from "./Astronaut";

// Inside Canvas > Suspense, after <Background />:
<Astronaut />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/canvas/Astronaut.jsx src/components/canvas/Scene.jsx
git commit -m "feat: add scroll-driven astronaut with placeholder model"
```

---

## Task 5: Section 3D Scenes — Hero & About

**Files:**
- Create: `src/components/canvas/sections/HeroScene.jsx`
- Create: `src/components/canvas/sections/AboutScene.jsx`

- [ ] **Step 1: Create HeroScene (planet + asteroids)**

```jsx
// src/components/canvas/sections/HeroScene.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function Planet() {
  const ref = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref} position={[-6, -2, -10]}>
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color={darkMode ? "#1e1b4b" : "#c7d2fe"}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      {/* Atmosphere glow */}
      <mesh scale={1.15}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color={darkMode ? "#06b6d4" : "#818cf8"}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function Asteroids() {
  const ref = useRef();

  const asteroids = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10 - 5,
      ],
      scale: 0.1 + Math.random() * 0.3,
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      const ast = asteroids[i];
      child.position.x = ast.position[0] + Math.sin(time * ast.speed + ast.offset) * 0.5;
      child.position.y = ast.position[1] + Math.cos(time * ast.speed * 0.7 + ast.offset) * 0.3;
      child.rotation.x = time * ast.speed * 0.5;
      child.rotation.z = time * ast.speed * 0.3;
    });
  });

  return (
    <group ref={ref}>
      {asteroids.map((ast, i) => (
        <mesh key={i} position={ast.position} scale={ast.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene({ visible }) {
  return (
    <group visible={visible}>
      <Planet />
      <Asteroids />
    </group>
  );
}
```

- [ ] **Step 2: Create AboutScene (space station ring + orbs)**

```jsx
// src/components/canvas/sections/AboutScene.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function StationRing() {
  const ref = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref} position={[0, 0, -5]}>
      <mesh>
        <torusGeometry args={[3, 0.15, 16, 64]} />
        <meshStandardMaterial
          color={darkMode ? "#94a3b8" : "#6366f1"}
          metalness={0.7}
          roughness={0.3}
          emissive={darkMode ? "#06b6d4" : "#4f46e5"}
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.08, 12, 48]} />
        <meshBasicMaterial
          color={darkMode ? "#06b6d4" : "#818cf8"}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

function Orbs() {
  const ref = useRef();
  const { darkMode } = useTheme();

  const orbs = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      radius: 2 + Math.random(),
      speed: 0.3 + Math.random() * 0.4,
      yOffset: (Math.random() - 0.5) * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      const orb = orbs[i];
      child.position.x = Math.cos(time * orb.speed + orb.angle) * orb.radius;
      child.position.y = orb.yOffset + Math.sin(time * orb.speed * 1.5) * 0.5;
      child.position.z = Math.sin(time * orb.speed + orb.angle) * orb.radius - 5;
    });
  });

  return (
    <group ref={ref}>
      {orbs.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial
            color={darkMode ? "#22d3ee" : "#818cf8"}
            transparent
            opacity={0.8}
          />
          <pointLight
            color={darkMode ? "#22d3ee" : "#818cf8"}
            intensity={0.5}
            distance={3}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function AboutScene({ visible }) {
  return (
    <group visible={visible}>
      <StationRing />
      <Orbs />
    </group>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/canvas/sections/HeroScene.jsx src/components/canvas/sections/AboutScene.jsx
git commit -m "feat: add HeroScene (planet + asteroids) and AboutScene (station ring + orbs)"
```

---

## Task 6: Section 3D Scenes — Tech & Experience

**Files:**
- Create: `src/components/canvas/sections/TechScene.jsx`
- Create: `src/components/canvas/sections/ExperienceScene.jsx`

- [ ] **Step 1: Create TechScene (star + orbit rings + tech icons)**

```jsx
// src/components/canvas/sections/TechScene.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";
import { TECHNOLOGIES } from "../../../constants";

function Star() {
  const ref = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      ref.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color={darkMode ? "#fbbf24" : "#f59e0b"} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color={darkMode ? "#fbbf24" : "#f59e0b"}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight color="#fbbf24" intensity={3} distance={15} />
    </group>
  );
}

function OrbitRing({ items, radius, speed, color, yOffset = 0 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  const positions = useMemo(() => {
    return items.map((_, i) => {
      const angle = (i / items.length) * Math.PI * 2;
      return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
    });
  }, [items, radius]);

  return (
    <group ref={ref}>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[radius, 0.015, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {positions.map((pos, i) => (
        <Billboard key={i} position={[pos.x, yOffset, pos.z]}>
          <mesh>
            <planeGeometry args={[0.6, 0.6]} />
            <meshBasicMaterial color={color} transparent opacity={0.15} />
          </mesh>
          <Text
            fontSize={0.15}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            {items[i].name}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}

export default function TechScene({ visible }) {
  const { isMobile } = useTheme();
  const orbits = isMobile ? 2 : 3;

  return (
    <group visible={visible}>
      <Star />
      <OrbitRing items={TECHNOLOGIES.frontend} radius={3} speed={0.3} color="#06b6d4" />
      <OrbitRing items={TECHNOLOGIES.backend} radius={4.5} speed={-0.2} color="#8b5cf6" yOffset={0.3} />
      {orbits >= 3 && (
        <OrbitRing items={TECHNOLOGIES.tools} radius={6} speed={0.12} color="#f59e0b" yOffset={-0.3} />
      )}
    </group>
  );
}
```

- [ ] **Step 2: Create ExperienceScene (asteroid belt + lines)**

```jsx
// src/components/canvas/sections/ExperienceScene.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function TimelineAsteroids() {
  const ref = useRef();
  const { darkMode } = useTheme();

  const asteroids = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      position: [(i % 2 === 0 ? -1 : 1) * (1 + Math.random()), (2 - i) * 2, -3],
      scale: 0.3 + Math.random() * 0.2,
    }));
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      child.rotation.y = time * 0.2 + i;
      child.position.y = asteroids[i].position[1] + Math.sin(time * 0.5 + i) * 0.15;
    });
  });

  return (
    <group ref={ref}>
      {asteroids.map((ast, i) => (
        <mesh key={i} position={ast.position} scale={ast.scale}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={darkMode ? "#475569" : "#94a3b8"}
            roughness={0.8}
            metalness={0.3}
            emissive={darkMode ? "#06b6d4" : "#4f46e5"}
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

function ConnectorLines() {
  const { darkMode } = useTheme();

  const positions = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const x = (i % 2 === 0 ? -1 : 1) * (1 + Math.random() * 0.5);
      const y = (2 - i) * 2;
      pts.push(x, y, -3);
      if (i < 4) {
        const nx = ((i + 1) % 2 === 0 ? -1 : 1) * (1 + Math.random() * 0.5);
        const ny = (2 - (i + 1)) * 2;
        pts.push(x, y, -3, nx, ny, -3);
      }
    }
    return new Float32Array(pts);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial
        color={darkMode ? "#06b6d4" : "#6366f1"}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function DustParticles() {
  const ref = useRef();
  const { darkMode, isMobile } = useTheme();
  const count = isMobile ? 0 : 50;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  if (count === 0) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={darkMode ? "#94a3b8" : "#6366f1"}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ExperienceScene({ visible }) {
  return (
    <group visible={visible}>
      <TimelineAsteroids />
      <ConnectorLines />
      <DustParticles />
    </group>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/canvas/sections/TechScene.jsx src/components/canvas/sections/ExperienceScene.jsx
git commit -m "feat: add TechScene (solar system) and ExperienceScene (asteroid belt)"
```

---

## Task 7: Section 3D Scenes — Projects & Contact

**Files:**
- Create: `src/components/canvas/sections/ProjectsScene.jsx`
- Create: `src/components/canvas/sections/ContactScene.jsx`

- [ ] **Step 1: Create ProjectsScene (floating planes)**

```jsx
// src/components/canvas/sections/ProjectsScene.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function FloatingPlane({ position, delay }) {
  const ref = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime + delay;
    ref.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
    ref.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    ref.current.rotation.x = Math.cos(time * 0.2) * 0.05;
  });

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[1.2, 0.8]} />
      <meshBasicMaterial
        color={darkMode ? "#1e293b" : "#e2e8f0"}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
      {/* Glow border via slightly larger back plane */}
      <mesh scale={[1.05, 1.08, 1]} position={[0, 0, -0.01]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshBasicMaterial
          color={darkMode ? "#06b6d4" : "#6366f1"}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </mesh>
  );
}

function ParticleStreams() {
  const ref = useRef();
  const { darkMode, isMobile } = useTheme();
  const count = isMobile ? 0 : 30;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 3;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current || count === 0) return;
    const attr = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      attr.array[i * 3 + 1] -= 0.005;
      if (attr.array[i * 3 + 1] < -3) attr.array[i * 3 + 1] = 3;
    }
    attr.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={darkMode ? "#06b6d4" : "#818cf8"}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ProjectsScene({ visible }) {
  const planes = useMemo(() => [
    [-3, 1, -4],
    [3, 0.5, -5],
    [-1.5, -1, -3],
    [2, -1.5, -4.5],
    [0, 2, -6],
    [-2.5, -0.5, -5.5],
  ], []);

  return (
    <group visible={visible}>
      {planes.map((pos, i) => (
        <FloatingPlane key={i} position={pos} delay={i * 0.8} />
      ))}
      <ParticleStreams />
    </group>
  );
}
```

- [ ] **Step 2: Create ContactScene (portal vortex)**

```jsx
// src/components/canvas/sections/ContactScene.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function Portal() {
  const torusRef = useRef();
  const innerRef = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.5;
      torusRef.current.rotation.z = time * 0.3;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = time * -0.7;
    }
  });

  return (
    <group position={[0, 0, -5]}>
      <mesh ref={torusRef}>
        <torusGeometry args={[2, 0.1, 16, 64]} />
        <meshBasicMaterial
          color={darkMode ? "#8b5cf6" : "#7c3aed"}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={innerRef}>
        <torusGeometry args={[1.5, 0.06, 12, 48]} />
        <meshBasicMaterial
          color={darkMode ? "#06b6d4" : "#0ea5e9"}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color={darkMode ? "#22d3ee" : "#818cf8"}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight color={darkMode ? "#8b5cf6" : "#7c3aed"} intensity={3} distance={10} />
    </group>
  );
}

function VortexParticles() {
  const ref = useRef();
  const { darkMode, isMobile } = useTheme();
  const count = isMobile ? 40 : 100;

  const initialPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 4;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = Math.sin(angle) * radius - 5;
    }
    return pos;
  }, [count]);

  const angles = useMemo(() => {
    return Array.from({ length: count }, () => Math.random() * Math.PI * 2);
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    const attr = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const angle = angles[i] + time * 0.5;
      const radius = 1 + (Math.sin(time * 0.3 + i) + 1) * 2;
      attr.array[i * 3] = Math.cos(angle) * radius;
      attr.array[i * 3 + 1] = initialPositions[i * 3 + 1] + Math.sin(time + i * 0.1) * 0.5;
      attr.array[i * 3 + 2] = Math.sin(angle) * radius - 5;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={initialPositions.slice()} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={darkMode ? "#a78bfa" : "#818cf8"}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ContactScene({ visible }) {
  return (
    <group visible={visible}>
      <Portal />
      <VortexParticles />
    </group>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/canvas/sections/ProjectsScene.jsx src/components/canvas/sections/ContactScene.jsx
git commit -m "feat: add ProjectsScene (floating planes) and ContactScene (portal vortex)"
```

---

## Task 8: Wire Section Scenes into Canvas with Visibility Control

**Files:**
- Modify: `src/components/canvas/Scene.jsx`
- Modify: `src/hooks/useSectionInView.js`

- [ ] **Step 1: Update useSectionInView to export a store-style approach**

```javascript
// src/hooks/useSectionInView.js
import { useState, useEffect, useRef, useCallback } from "react";

export function useSectionInView(threshold = 0.2) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold, rootMargin: "100px 0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView];
}

// Shared visibility state for 3D scenes (read from outside Canvas)
let sectionVisibility = {
  hero: true,
  about: false,
  technologies: false,
  experience: false,
  projects: false,
  contact: false,
};
let listeners = new Set();

export function setSectionVisible(id, visible) {
  sectionVisibility = { ...sectionVisibility, [id]: visible };
  listeners.forEach((fn) => fn(sectionVisibility));
}

export function useSectionVisibility() {
  const [state, setState] = useState(sectionVisibility);

  useEffect(() => {
    listeners.add(setState);
    return () => listeners.delete(setState);
  }, []);

  return state;
}
```

- [ ] **Step 2: Update Scene.jsx to include all section scenes**

```jsx
// src/components/canvas/Scene.jsx
import { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "../../contexts/themeContext";
import { useMouseParallax } from "../../hooks/useMouseParallax";
import { useSectionVisibility } from "../../hooks/useSectionInView";
import Background from "./Background";
import Astronaut from "./Astronaut";
import PostProcessing from "./PostProcessing";
import HeroScene from "./sections/HeroScene";
import AboutScene from "./sections/AboutScene";
import TechScene from "./sections/TechScene";
import ExperienceScene from "./sections/ExperienceScene";
import ProjectsScene from "./sections/ProjectsScene";
import ContactScene from "./sections/ContactScene";

function CameraRig() {
  const mouse = useMouseParallax(0.3);
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mouse.current.x - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current.y - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scenes() {
  const visibility = useSectionVisibility();

  return (
    <>
      <HeroScene visible={visibility.hero} />
      <AboutScene visible={visibility.about} />
      <TechScene visible={visibility.technologies} />
      <ExperienceScene visible={visibility.experience} />
      <ProjectsScene visible={visibility.projects} />
      <ContactScene visible={visibility.contact} />
    </>
  );
}

export default function Scene() {
  const { darkMode, isMobile } = useTheme();

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 200 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: darkMode ? "#0a0a0f" : "#f0f4ff" }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <ambientLight intensity={darkMode ? 0.1 : 0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.3} />
          <Background />
          <Astronaut />
          <Scenes />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/canvas/Scene.jsx src/hooks/useSectionInView.js
git commit -m "feat: wire all 3D section scenes with visibility control"
```

---

## Task 9: Content Sections — Hero & About

**Files:**
- Create: `src/components/sections/Hero.jsx`
- Create: `src/components/sections/About.jsx`

- [ ] **Step 1: Create Hero section**

```jsx
// src/components/sections/Hero.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTheme } from "../../contexts/themeContext";
import { HERO_CONTENT } from "../../constants";
import { setSectionVisible } from "../../hooks/useSectionInView";
import { useSectionInView } from "../../hooks/useSectionInView";
import MagneticButton from "../ui/MagneticButton";
import { HiArrowDown } from "react-icons/hi";

export default function Hero() {
  const { language, darkMode } = useTheme();
  const [sectionRef, inView] = useSectionInView(0.3);
  const hasAnimated = useRef(false);

  useEffect(() => {
    setSectionVisible("hero", inView);
  }, [inView]);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(".hero-greeting", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(".hero-name span", { opacity: 0, y: 50, rotateX: -90 }, { opacity: 1, y: 0, rotateX: 0, stagger: 0.04, duration: 0.5, ease: "power3.out" })
      .fromTo(".hero-role", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
      .fromTo(".hero-tagline", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3")
      .fromTo(".hero-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: "power3.out" }, "-=0.2")
      .fromTo(".hero-scroll", { opacity: 0 }, { opacity: 1, duration: 0.5 });
  }, []);

  const nameChars = HERO_CONTENT.name.split("");

  return (
    <section ref={sectionRef} id="hero" className="min-h-screen flex items-center justify-center relative">
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <p className="hero-greeting text-lg md:text-xl text-neutral-400 dark:text-neutral-400 mb-4 opacity-0">
          {HERO_CONTENT.greeting[language]}
        </p>
        <h1 className="hero-name text-5xl md:text-7xl lg:text-8xl font-bold mb-4" style={{ perspective: "600px" }}>
          {nameChars.map((char, i) => (
            <span key={i} className="inline-block opacity-0 text-neutral-900 dark:text-white" style={{ transformStyle: "preserve-3d" }}>
              {char === " " ? " " : char}
            </span>
          ))}
        </h1>
        <p className="hero-role text-2xl md:text-3xl font-medium text-accent-cyan dark:text-accent-cyan mb-6 opacity-0">
          {HERO_CONTENT.role[language]}
        </p>
        <p className="hero-tagline text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-10 opacity-0 leading-relaxed">
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
            className="hero-cta inline-block px-6 py-3 border border-cyan-500 text-cyan-600 dark:text-cyan-400 rounded-full font-medium hover:bg-cyan-500/10 transition-colors opacity-0"
          >
            {language === "vietnamese" ? "Liên hệ" : "Get in touch"}
          </MagneticButton>
        </div>
        <div className="hero-scroll mt-16 opacity-0">
          <HiArrowDown className="text-2xl text-neutral-400 animate-bounce mx-auto" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create About section**

```jsx
// src/components/sections/About.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { ABOUT_CONTENT, STATS, ACHIEVEMENTS } from "../../constants";
import { useSectionInView, setSectionVisible } from "../../hooks/useSectionInView";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { language, darkMode } = useTheme();
  const [sectionRef, inView] = useSectionInView(0.2);
  const contentRef = useRef(null);

  useEffect(() => {
    setSectionVisible("about", inView);
  }, [inView]);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-title", { opacity: 0, y: 30, rotateX: -45 }, {
        opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
      });
      gsap.fromTo(".about-text", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
      });
      gsap.fromTo(".about-stat", { opacity: 0, scale: 0.8, y: 20 }, {
        opacity: 1, scale: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "back.out(1.5)",
        scrollTrigger: { trigger: contentRef.current, start: "top 70%" },
      });
      gsap.fromTo(".about-achievement", { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 60%" },
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="min-h-screen flex items-center justify-center py-20">
      <div ref={contentRef} className="max-w-4xl mx-auto px-4">
        <h2 className="about-title text-4xl md:text-5xl font-bold text-center mb-8 text-neutral-900 dark:text-white opacity-0" style={{ perspective: "600px" }}>
          {language === "vietnamese" ? "Về tôi" : "About Me"}
        </h2>
        <p className="about-text text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed text-center mb-12 opacity-0">
          {ABOUT_CONTENT[language]}
        </p>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {STATS.map((stat, i) => (
            <div key={i} className="about-stat text-center p-4 rounded-xl backdrop-blur-md bg-white/5 dark:bg-white/5 bg-white/60 border border-white/10 dark:border-white/10 border-gray-200 opacity-0">
              <div className="text-3xl font-bold text-cyan-500 dark:text-cyan-400">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {stat.label[language]}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {ACHIEVEMENTS.map((item, i) => (
            <div key={i} className="about-achievement flex items-center gap-3 opacity-0">
              <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {item.title[language]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.jsx src/components/sections/About.jsx
git commit -m "feat: add Hero and About content sections with scroll animations"
```

---

## Task 10: Content Sections — Tech & Experience

**Files:**
- Create: `src/components/sections/Tech.jsx`
- Create: `src/components/sections/Experience.jsx`

- [ ] **Step 1: Create Tech section**

```jsx
// src/components/sections/Tech.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { TECHNOLOGIES, TITLES } from "../../constants";
import { useSectionInView, setSectionVisible } from "../../hooks/useSectionInView";

gsap.registerPlugin(ScrollTrigger);

export default function Tech() {
  const { language } = useTheme();
  const [sectionRef, inView] = useSectionInView(0.2);
  const contentRef = useRef(null);

  useEffect(() => {
    setSectionVisible("technologies", inView);
  }, [inView]);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tech-title", { opacity: 0, y: 30, rotateX: -45 }, {
        opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
      });
      gsap.fromTo(".tech-badge", { opacity: 0, scale: 0, y: 20 }, {
        opacity: 1, scale: 1, y: 0, stagger: 0.03, duration: 0.4, ease: "back.out(2)",
        scrollTrigger: { trigger: contentRef.current, start: "top 70%" },
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  const categories = [
    { key: "frontend", label: "Frontend", items: TECHNOLOGIES.frontend, color: "cyan" },
    { key: "backend", label: "Backend", items: TECHNOLOGIES.backend, color: "purple" },
    { key: "tools", label: "Tools", items: TECHNOLOGIES.tools, color: "amber" },
  ];

  return (
    <section ref={sectionRef} id="technologies" className="min-h-screen flex items-center justify-center py-20">
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="tech-title text-4xl md:text-5xl font-bold mb-12 text-neutral-900 dark:text-white opacity-0" style={{ perspective: "600px" }}>
          {TITLES.technologies[language]}
        </h2>
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat.key}>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
                {cat.label}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {cat.items.map((tech) => (
                  <span
                    key={tech.name}
                    className={`tech-badge px-4 py-2 rounded-full border text-sm backdrop-blur-sm transition-colors opacity-0
                      ${cat.color === "cyan" ? "border-cyan-500/30 text-cyan-700 dark:text-cyan-300 bg-cyan-500/5 hover:bg-cyan-500/20" : ""}
                      ${cat.color === "purple" ? "border-purple-500/30 text-purple-700 dark:text-purple-300 bg-purple-500/5 hover:bg-purple-500/20" : ""}
                      ${cat.color === "amber" ? "border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/5 hover:bg-amber-500/20" : ""}
                    `}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Experience section (timeline)**

```jsx
// src/components/sections/Experience.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { EXPERIENCE, EDUCATION, TITLES } from "../../constants";
import { useSectionInView, setSectionVisible } from "../../hooks/useSectionInView";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const { language } = useTheme();
  const [sectionRef, inView] = useSectionInView(0.2);
  const contentRef = useRef(null);

  useEffect(() => {
    setSectionVisible("experience", inView);
  }, [inView]);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".exp-title", { opacity: 0, y: 30, rotateX: -45 }, {
        opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
      });
      gsap.fromTo(".exp-item", { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, stagger: 0.15, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 70%" },
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="min-h-screen flex items-center justify-center py-20">
      <div ref={contentRef} className="max-w-3xl mx-auto px-4">
        <h2 className="exp-title text-4xl md:text-5xl font-bold text-center mb-12 text-neutral-900 dark:text-white opacity-0" style={{ perspective: "600px" }}>
          {TITLES.experience[language]}
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-cyan-500 opacity-30" />

          <div className="space-y-6 pl-12">
            {EXPERIENCE.map((item, i) => (
              <div key={i} className="exp-item relative opacity-0">
                {/* Dot */}
                <div className="absolute -left-[2.45rem] top-4 w-3 h-3 rounded-full bg-cyan-500 border-2 border-space-900 dark:border-space-900" />
                <div className="p-5 rounded-xl backdrop-blur-md bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-neutral-900 dark:text-white">{item.title[language]}</h3>
                    <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">{item.time}</span>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">{item.company}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.description[language]}</p>
                </div>
              </div>
            ))}

            {/* Education */}
            <div className="exp-item relative opacity-0">
              <div className="absolute -left-[2.45rem] top-4 w-3 h-3 rounded-full bg-purple-500 border-2 border-space-900 dark:border-space-900" />
              <div className="p-5 rounded-xl backdrop-blur-md bg-cyan-500/5 dark:bg-cyan-500/5 border border-cyan-500/20">
                <h3 className="font-bold text-neutral-900 dark:text-white">{EDUCATION.degree[language]}</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">{EDUCATION.school} &bull; {EDUCATION.time}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{EDUCATION.major[language]} &bull; GPA: {EDUCATION.gpa}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Tech.jsx src/components/sections/Experience.jsx
git commit -m "feat: add Tech and Experience content sections with animations"
```

---

## Task 11: Content Sections — Projects & Contact

**Files:**
- Create: `src/components/sections/Projects.jsx`
- Create: `src/components/sections/Contact.jsx`

- [ ] **Step 1: Create Projects section**

```jsx
// src/components/sections/Projects.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { PROJECTS, TITLES } from "../../constants";
import { useSectionInView, setSectionVisible } from "../../hooks/useSectionInView";
import { FiExternalLink, FiGithub } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const { language } = useTheme();
  const [sectionRef, inView] = useSectionInView(0.1);
  const contentRef = useRef(null);

  useEffect(() => {
    setSectionVisible("projects", inView);
  }, [inView]);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".projects-title", { opacity: 0, y: 30, rotateX: -45 }, {
        opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
      });
      gsap.fromTo(".project-card", { opacity: 0, y: 40, scale: 0.9 }, {
        opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 70%" },
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="min-h-screen flex items-center justify-center py-20">
      <div ref={contentRef} className="max-w-6xl mx-auto px-4">
        <h2 className="projects-title text-4xl md:text-5xl font-bold text-center mb-12 text-neutral-900 dark:text-white opacity-0" style={{ perspective: "600px" }}>
          {TITLES.projects[language]}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.filter(p => p.technologies[0] !== "TBD").map((project, i) => {
            const title = typeof project.title === "string" ? project.title : project.title[language];
            return (
              <div key={i} className="project-card p-5 rounded-xl backdrop-blur-md bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-cyan-500/40 dark:hover:border-cyan-500/30 transition-all hover:scale-[1.02] opacity-0">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-neutral-900 dark:text-white text-sm leading-tight">{title}</h3>
                  <div className="flex gap-2 shrink-0">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 transition-colors">
                        <FiExternalLink size={14} />
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 transition-colors">
                        <FiGithub size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">{project.description[language]}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Contact section**

```jsx
// src/components/sections/Contact.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { CONTACT, TITLES } from "../../constants";
import { useSectionInView, setSectionVisible } from "../../hooks/useSectionInView";
import { FiGithub, FiLinkedin, FiFacebook, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import MagneticButton from "../ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const { language } = useTheme();
  const [sectionRef, inView] = useSectionInView(0.2);
  const contentRef = useRef(null);

  useEffect(() => {
    setSectionVisible("contact", inView);
  }, [inView]);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-title", { opacity: 0, y: 30, rotateX: -45 }, {
        opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
      });
      gsap.fromTo(".contact-item", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 70%" },
      });
      gsap.fromTo(".contact-social", { opacity: 0, scale: 0 }, {
        opacity: 1, scale: 1, stagger: 0.1, duration: 0.4, ease: "back.out(2)",
        scrollTrigger: { trigger: contentRef.current, start: "top 60%" },
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT.email);
  };

  return (
    <section ref={sectionRef} id="contact" className="min-h-screen flex items-center justify-center py-20">
      <div ref={contentRef} className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="contact-title text-4xl md:text-5xl font-bold mb-8 text-neutral-900 dark:text-white opacity-0" style={{ perspective: "600px" }}>
          {TITLES.contact[language]}
        </h2>

        <div className="space-y-4 mb-10">
          <div className="contact-item flex items-center justify-center gap-3 opacity-0">
            <FiMail className="text-cyan-500" />
            <button onClick={copyEmail} className="text-neutral-700 dark:text-neutral-300 hover:text-cyan-500 transition-colors">
              {CONTACT.email}
            </button>
          </div>
          <div className="contact-item flex items-center justify-center gap-3 opacity-0">
            <FiPhone className="text-cyan-500" />
            <span className="text-neutral-700 dark:text-neutral-300">{CONTACT.phone}</span>
          </div>
          <div className="contact-item flex items-center justify-center gap-3 opacity-0">
            <FiMapPin className="text-cyan-500" />
            <span className="text-neutral-700 dark:text-neutral-300">{CONTACT.location[language]}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <MagneticButton>
            <a href={CONTACT.social.github} target="_blank" rel="noopener noreferrer" className="contact-social flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all opacity-0">
              <FiGithub className="text-xl text-neutral-700 dark:text-neutral-300" />
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href={CONTACT.social.linkedin} target="_blank" rel="noopener noreferrer" className="contact-social flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all opacity-0">
              <FiLinkedin className="text-xl text-neutral-700 dark:text-neutral-300" />
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href={CONTACT.social.facebook} target="_blank" rel="noopener noreferrer" className="contact-social flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all opacity-0">
              <FiFacebook className="text-xl text-neutral-700 dark:text-neutral-300" />
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Projects.jsx src/components/sections/Contact.jsx
git commit -m "feat: add Projects and Contact content sections with animations"
```

---

## Task 12: Update App.jsx — New Layout Structure

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Rewrite App.jsx with new layout**

```jsx
// src/App.jsx
import { useTheme } from "./contexts/themeContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CustomCursor from "./components/layout/CustomCursor";
import ScrollProgress from "./components/layout/ScrollProgress";
import Scene from "./components/canvas/Scene";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Tech from "./components/sections/Tech";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";

export default function App() {
  const { isMobile } = useTheme();

  return (
    <>
      {!isMobile && <CustomCursor />}
      <ScrollProgress />
      <Scene />

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <About />
          <Tech />
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

- [ ] **Step 2: Verify the app compiles**

Run: `npm run dev`

Open in browser, verify:
- Canvas renders with starfield background
- Content scrolls normally on top
- Astronaut moves positions on scroll
- 3D scenes appear/disappear as sections scroll into view

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire new App layout — fixed canvas + scrollable content"
```

---

## Task 13: Delete Old Files

**Files:**
- Delete: `src/components/three/` (entire directory)
- Delete: `src/components/sections/HeroOverlay.jsx`
- Delete: `src/components/sections/AboutOverlay.jsx`
- Delete: `src/components/sections/TechOverlay.jsx`
- Delete: `src/components/sections/ExperienceOverlay.jsx`
- Delete: `src/components/sections/ProjectsOverlay.jsx`
- Delete: `src/components/sections/ContactOverlay.jsx`
- Delete: `src/components/layout/PageLoader.jsx`
- Delete: `src/hooks/useMousePosition.js` (if exists)

- [ ] **Step 1: Remove old files**

```bash
rm -rf src/components/three/
rm src/components/sections/HeroOverlay.jsx
rm src/components/sections/AboutOverlay.jsx
rm src/components/sections/TechOverlay.jsx
rm src/components/sections/ExperienceOverlay.jsx
rm src/components/sections/ProjectsOverlay.jsx
rm src/components/sections/ContactOverlay.jsx
rm src/components/layout/PageLoader.jsx
rm -f src/hooks/useMousePosition.js
```

- [ ] **Step 2: Verify build still compiles**

Run: `npm run build`

Expected: Build succeeds with no import errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old three/ directory, overlay components, and page loader"
```

---

## Task 14: Polish & Final Adjustments

**Files:**
- Modify: various files for polish

- [ ] **Step 1: Verify dark/light theme toggle works**

Open browser → toggle theme → verify:
- Canvas background color transitions
- Star visibility changes
- Content text colors update
- Cards adapt styling

- [ ] **Step 2: Verify mobile responsiveness**

Open DevTools → phone viewport:
- Content stacks properly
- 3D renders (reduced quality)
- No horizontal overflow
- Touch scrolling is smooth

- [ ] **Step 3: Test scroll performance**

Open DevTools → Performance tab → Record scroll:
- Target: 60fps on desktop
- No jank on scroll
- Astronaut movement is smooth

- [ ] **Step 4: Fix any issues found in steps 1-3**

Address any visual bugs, layout breaks, or performance issues.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: polish theme transitions, responsive layout, and scroll performance"
```

---

## Task 15: Astronaut Model Upgrade (Optional/Deferred)

This task can be done later when a suitable model is found.

**Files:**
- Add: `src/assets/models/astronaut.glb`
- Modify: `src/components/canvas/Astronaut.jsx`

- [ ] **Step 1: Find and download astronaut model**

Sources to check:
- Sketchfab: search "astronaut" with CC license, low-poly preferred (<5MB)
- Ready Player Me: customizable avatar
- Mixamo: rigged character with animations

Requirements:
- GLB format
- < 5MB file size
- Decent looking at small scale
- Ideally with idle floating animation baked in

- [ ] **Step 2: Replace PlaceholderAstronaut with GLTF model**

```jsx
// In Astronaut.jsx, replace PlaceholderAstronaut usage:
import { useGLTF } from "@react-three/drei";

function AstronautModel() {
  const { scene } = useGLTF("/models/astronaut.glb");
  return <primitive object={scene} scale={0.5} />;
}

// Update the return in Astronaut component:
<group ref={groupRef}>
  <AstronautModel />
</group>
```

- [ ] **Step 3: Move model to public folder for production**

```bash
mkdir -p public/models
cp src/assets/models/astronaut.glb public/models/astronaut.glb
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add real astronaut GLTF model"
```

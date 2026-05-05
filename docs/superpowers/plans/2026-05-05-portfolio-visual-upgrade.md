# Portfolio Visual Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current section-based animations with a persistent 3D world where the camera flies through geometric rooms as the user scrolls, creating an immersive journey experience.

**Architecture:** Single Three.js Canvas (fixed full-screen) with a camera moving along the Z-axis controlled by GSAP ScrollTrigger. Six "rooms" each contain distinct geometry that morphs into the next. HTML content overlays on top, pinned during each room's scroll range. Post-processing adds bloom, vignette, and chromatic aberration for cinematic feel.

**Tech Stack:** React 19, Three.js, @react-three/fiber v9, @react-three/drei v10, @react-three/postprocessing, GSAP (ScrollTrigger), Tailwind CSS 4

---

## File Structure

```
src/components/three/          # DELETE old: ParticleField.jsx, TechOrbit.jsx
src/components/three/
├── World.jsx                  # Main canvas + scene + post-processing
├── CameraController.jsx       # GSAP ScrollTrigger → camera.position.z
├── rooms/
│   ├── HeroRoom.jsx           # Particles + wireframe icosahedron
│   ├── AboutRoom.jsx          # Double helix spiral
│   ├── TechRoom.jsx           # Orbit rings + core + energy lines
│   ├── ExperienceRoom.jsx     # Corridor with pillars
│   ├── ProjectsRoom.jsx       # Floating planes
│   └── ContactRoom.jsx        # Convergence portal
├── effects/
│   └── PostProcessing.jsx     # Bloom + ChromaticAberration + Vignette
└── shaders/
    ├── dissolve.js            # Noise-based dissolve material
    └── holographic.js         # Color-shifting noise material

src/components/sections/       # REWRITE as scroll-pinned overlays
├── HeroOverlay.jsx
├── AboutOverlay.jsx
├── TechOverlay.jsx
├── ExperienceOverlay.jsx
├── ProjectsOverlay.jsx
└── ContactOverlay.jsx

src/App.jsx                    # Rewrite: World canvas + overlay sections
```

---

## Task 1: Add Dependency & Remove Old 3D Components

**Files:**
- Modify: `package.json`
- Delete: `src/components/three/ParticleField.jsx`
- Delete: `src/components/three/TechOrbit.jsx`
- Create: `src/components/three/rooms/` directory

- [ ] **Step 1: Add @react-three/postprocessing**

Run:
```bash
cd "G:\IT\Projects\portfolio"
npm install @react-three/postprocessing
```

- [ ] **Step 2: Delete old Three.js components**

```bash
rm src/components/three/ParticleField.jsx src/components/three/TechOrbit.jsx
mkdir -p src/components/three/rooms src/components/three/effects src/components/three/shaders
```

- [ ] **Step 3: Delete old section components (will be rewritten)**

```bash
rm src/components/sections/Hero.jsx src/components/sections/About.jsx src/components/sections/Technologies.jsx src/components/sections/Experience.jsx src/components/sections/Projects.jsx src/components/sections/Contact.jsx
```

- [ ] **Step 4: Verify build still works (with placeholder App)**

Replace `src/App.jsx` temporarily:
```jsx
export default function App() {
  return <div className="font-inter min-h-screen bg-black text-white flex items-center justify-center"><h1>Upgrading...</h1></div>;
}
```

Run: `npm run build`
Expected: Passes (unused component files removed, no import errors).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove old 3D components, add postprocessing dep, prep for visual upgrade"
```

---

## Task 2: Custom Shaders

**Files:**
- Create: `src/components/three/shaders/dissolve.js`
- Create: `src/components/three/shaders/holographic.js`

- [ ] **Step 1: Create dissolve shader material**

```js
// src/components/three/shaders/dissolve.js
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const DissolveMaterial = shaderMaterial(
  {
    uProgress: 0,
    uColor: new THREE.Color("#06b6d4"),
    uEdgeColor: new THREE.Color("#8b5cf6"),
    uEdgeWidth: 0.1,
    uTime: 0,
  },
  // Vertex
  `
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment
  `
  uniform float uProgress;
  uniform vec3 uColor;
  uniform vec3 uEdgeColor;
  uniform float uEdgeWidth;
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float noise = snoise(vPosition * 2.0 + uTime * 0.5) * 0.5 + 0.5;
    float edge = smoothstep(uProgress - uEdgeWidth, uProgress, noise);
    float dissolve = step(uProgress, noise);
    if (dissolve < 0.5) discard;
    vec3 color = mix(uEdgeColor, uColor, edge);
    float glow = 1.0 - edge;
    gl_FragColor = vec4(color + glow * uEdgeColor * 0.5, 1.0);
  }
  `
);

export default DissolveMaterial;
```

- [ ] **Step 2: Create holographic shader material**

```js
// src/components/three/shaders/holographic.js
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const HolographicMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#06b6d4"),
    uColor2: new THREE.Color("#8b5cf6"),
    uColor3: new THREE.Color("#f59e0b"),
    uAlpha: 0.8,
  },
  // Vertex
  `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment
  `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uAlpha;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    float n = noise(vPosition.xy * 3.0 + uTime * 0.5);
    float n2 = noise(vPosition.yz * 2.0 - uTime * 0.3);
    float blend = n * 0.5 + n2 * 0.5;

    vec3 color = mix(uColor1, uColor2, blend);
    color = mix(color, uColor3, pow(n2, 2.0));

    // Fresnel rim
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    color += fresnel * uColor1 * 0.5;

    // Scan line effect
    float scanline = sin(vPosition.y * 40.0 + uTime * 2.0) * 0.05 + 0.95;
    color *= scanline;

    gl_FragColor = vec4(color, uAlpha);
  }
  `
);

export default HolographicMaterial;
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Passes.

- [ ] **Step 4: Commit**

```bash
git add src/components/three/shaders/
git commit -m "feat: add dissolve and holographic custom shader materials"
```

---

## Task 3: Camera Controller

**Files:**
- Create: `src/components/three/CameraController.jsx`

- [ ] **Step 1: Create CameraController**

```jsx
// src/components/three/CameraController.jsx
import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CameraController() {
  const { camera } = useThree();
  const progress = useRef({ value: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const targetZ = -100;

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        progress.current.value = self.progress;
      },
    });

    const handleMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse);

    return () => {
      trigger.kill();
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  useFrame(() => {
    const z = progress.current.value * targetZ;
    camera.position.z = z + 8;
    // Mouse parallax offset
    camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, z - 5);
  });

  return null;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/three/CameraController.jsx
git commit -m "feat: add scroll-driven CameraController with mouse parallax"
```

---

## Task 4: Post-Processing Effects

**Files:**
- Create: `src/components/three/effects/PostProcessing.jsx`

- [ ] **Step 1: Create PostProcessing component**

```jsx
// src/components/three/effects/PostProcessing.jsx
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useTheme } from "../../../contexts/themeContext";

export default function PostProcessing() {
  const { darkMode } = useTheme();

  return (
    <EffectComposer>
      <Bloom
        intensity={darkMode ? 1.5 : 0.3}
        luminanceThreshold={darkMode ? 0.2 : 0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0005, 0.0005]}
      />
      <Vignette
        offset={0.3}
        darkness={darkMode ? 0.7 : 0.3}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/three/effects/PostProcessing.jsx
git commit -m "feat: add post-processing pipeline (Bloom, ChromaticAberration, Vignette)"
```

---

## Task 5: Room 1 — HeroRoom

**Files:**
- Create: `src/components/three/rooms/HeroRoom.jsx`

- [ ] **Step 1: Create HeroRoom**

```jsx
// src/components/three/rooms/HeroRoom.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function Particles({ count = 400 }) {
  const ref = useRef();
  const { darkMode } = useTheme();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      // Drift toward center
      arr[i * 3] += (0 - arr[i * 3]) * 0.0003;
      arr[i * 3 + 1] += (0 - arr[i * 3 + 1]) * 0.0003;
      // Slight wobble
      arr[i * 3] += Math.sin(time + i) * 0.002;
      arr[i * 3 + 1] += Math.cos(time + i * 0.5) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={darkMode ? "#06b6d4" : "#4f46e5"}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Icosahedron() {
  const ref = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <group position={[0, 0, -5]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[3, 1]} />
        <meshBasicMaterial
          color={darkMode ? "#06b6d4" : "#4f46e5"}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color={darkMode ? "#06b6d4" : "#4f46e5"}
          transparent
          opacity={0.1}
        />
      </mesh>
      <pointLight color={darkMode ? "#06b6d4" : "#4f46e5"} intensity={3} distance={15} />
    </group>
  );
}

function FloatingFragments() {
  const ref = useRef();
  const { darkMode } = useTheme();

  const fragments = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push({
        position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10 - 5],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      child.rotation.x += fragments[i].speed * 0.005;
      child.rotation.z += fragments[i].speed * 0.003;
      child.position.y += Math.sin(state.clock.elapsedTime * fragments[i].speed + i) * 0.003;
    });
  });

  return (
    <group ref={ref}>
      {fragments.map((frag, i) => (
        <mesh key={i} position={frag.position} rotation={frag.rotation} scale={frag.scale}>
          {i % 3 === 0 ? (
            <tetrahedronGeometry args={[1, 0]} />
          ) : i % 3 === 1 ? (
            <octahedronGeometry args={[0.8, 0]} />
          ) : (
            <boxGeometry args={[0.6, 0.6, 0.6]} />
          )}
          <meshBasicMaterial
            color={darkMode ? "#8b5cf6" : "#7c3aed"}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroRoom() {
  return (
    <group position={[0, 0, 0]}>
      <Particles />
      <Icosahedron />
      <FloatingFragments />
    </group>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/three/rooms/HeroRoom.jsx
git commit -m "feat: add HeroRoom — particles, wireframe icosahedron, floating fragments"
```

---

## Task 6: Room 2 — AboutRoom

**Files:**
- Create: `src/components/three/rooms/AboutRoom.jsx`

- [ ] **Step 1: Create AboutRoom**

```jsx
// src/components/three/rooms/AboutRoom.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function Helix() {
  const ref = useRef();
  const { darkMode } = useTheme();

  const { positions, linePositions } = useMemo(() => {
    const pts = [];
    const lines = [];
    const turns = 4;
    const pointsPerTurn = 20;
    const total = turns * pointsPerTurn;
    const radius = 2;
    const height = 12;

    for (let i = 0; i < total; i++) {
      const t = i / total;
      const angle = t * turns * Math.PI * 2;
      const y = (t - 0.5) * height;
      // Strand 1
      pts.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      // Strand 2
      pts.push(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
      // Connection lines every few points
      if (i % 4 === 0) {
        lines.push(
          Math.cos(angle) * radius, y, Math.sin(angle) * radius,
          Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius
        );
      }
    }
    return {
      positions: new Float32Array(pts),
      linePositions: new Float32Array(lines),
    };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const color = darkMode ? "#06b6d4" : "#4f46e5";

  return (
    <group ref={ref} position={[0, 0, -27]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.12} color={color} transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={linePositions} count={linePositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function DataNodes() {
  const ref = useRef();
  const { darkMode } = useTheme();

  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, -27 + (Math.random() - 0.5) * 8],
        speed: Math.random() * 0.3 + 0.1,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      child.position.y += Math.sin(state.clock.elapsedTime * nodes[i].speed + i) * 0.005;
      child.position.x += Math.cos(state.clock.elapsedTime * nodes[i].speed * 0.5 + i) * 0.003;
    });
  });

  return (
    <group ref={ref}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={darkMode ? "#8b5cf6" : "#7c3aed"} />
        </mesh>
      ))}
    </group>
  );
}

export default function AboutRoom() {
  return (
    <group>
      <Helix />
      <DataNodes />
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/rooms/AboutRoom.jsx
git commit -m "feat: add AboutRoom — double helix spiral with data nodes"
```

---

## Task 7: Room 3 — TechRoom

**Files:**
- Create: `src/components/three/rooms/TechRoom.jsx`

- [ ] **Step 1: Create TechRoom**

```jsx
// src/components/three/rooms/TechRoom.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";
import { TECHNOLOGIES } from "../../../constants";

function OrbitRing({ items, radius, speed, color, yOffset = 0 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    return items.map((_, i) => {
      const angle = (i / items.length) * Math.PI * 2;
      return [Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius];
    });
  }, [items, radius, yOffset]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <group ref={ref}>
      {/* Ring */}
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[radius, 0.02, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      {/* Nodes */}
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Core() {
  const ref = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color={darkMode ? "#06b6d4" : "#4f46e5"} transparent opacity={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color={darkMode ? "#06b6d4" : "#4f46e5"} transparent opacity={0.8} />
      </mesh>
      <pointLight color={darkMode ? "#06b6d4" : "#4f46e5"} intensity={5} distance={20} />
    </group>
  );
}

function EnergyLines() {
  const ref = useRef();
  const { darkMode } = useTheme();
  const lineCount = 12;

  const positions = useMemo(() => {
    const lines = [];
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const r = 4 + Math.random() * 3;
      lines.push(0, 0, 0, Math.cos(angle) * r, (Math.random() - 0.5) * 2, Math.sin(angle) * r);
    }
    return new Float32Array(lines);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={darkMode ? "#06b6d4" : "#4f46e5"} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

function GridFloor() {
  const { darkMode } = useTheme();
  return (
    <gridHelper
      args={[30, 30, darkMode ? "#06b6d4" : "#4f46e5", darkMode ? "#1e293b" : "#e2e8f0"]}
      position={[0, -5, 0]}
      material-transparent
      material-opacity={0.15}
    />
  );
}

export default function TechRoom() {
  return (
    <group position={[0, 0, -47]}>
      <Core />
      <OrbitRing items={TECHNOLOGIES.frontend} radius={3.5} speed={0.3} color="#06b6d4" />
      <OrbitRing items={TECHNOLOGIES.backend} radius={5.5} speed={-0.2} color="#8b5cf6" yOffset={0.5} />
      <OrbitRing items={TECHNOLOGIES.tools} radius={7.5} speed={0.12} color="#f59e0b" yOffset={-0.5} />
      <EnergyLines />
      <GridFloor />
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/rooms/TechRoom.jsx
git commit -m "feat: add TechRoom — orbit rings, core, energy lines, grid floor"
```

---

## Task 8: Room 4 — ExperienceRoom

**Files:**
- Create: `src/components/three/rooms/ExperienceRoom.jsx`

- [ ] **Step 1: Create ExperienceRoom**

```jsx
// src/components/three/rooms/ExperienceRoom.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function Pillar({ position, index }) {
  const ref = useRef();
  const { darkMode } = useTheme();
  const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#06b6d4"];
  const color = colors[index % colors.length];

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * 0.1 + index;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[0.8, 6, 0.8]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
      {/* Top glow */}
      <pointLight position={[0, 3.5, 0]} color={color} intensity={2} distance={5} />
    </group>
  );
}

function TimelineLine() {
  const { darkMode } = useTheme();
  const positions = useMemo(() => {
    return new Float32Array([0, -2.5, -55, 0, -2.5, -75]);
  }, []);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={2} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={darkMode ? "#06b6d4" : "#4f46e5"} transparent opacity={0.5} />
    </line>
  );
}

function CeilingFragments() {
  const ref = useRef();
  const { darkMode } = useTheme();

  const fragments = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 12, 4 + Math.random() * 3, -60 + (Math.random() - 0.5) * 20],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      child.rotation.x += fragments[i].speed * 0.003;
      child.rotation.z += fragments[i].speed * 0.002;
    });
  });

  return (
    <group ref={ref}>
      {fragments.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot} scale={f.scale}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={darkMode ? "#1e293b" : "#cbd5e1"} wireframe transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function ExperienceRoom() {
  const pillars = useMemo(() => {
    return [
      { position: [-4, 0, -62], index: 0 },
      { position: [4, 0, -65], index: 1 },
      { position: [-4, 0, -68], index: 2 },
      { position: [4, 0, -71], index: 3 },
    ];
  }, []);

  return (
    <group>
      {pillars.map((p, i) => (
        <Pillar key={i} position={p.position} index={p.index} />
      ))}
      <TimelineLine />
      <CeilingFragments />
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/rooms/ExperienceRoom.jsx
git commit -m "feat: add ExperienceRoom — corridor with pillars and timeline"
```

---

## Task 9: Room 5 — ProjectsRoom

**Files:**
- Create: `src/components/three/rooms/ProjectsRoom.jsx`

- [ ] **Step 1: Create ProjectsRoom**

```jsx
// src/components/three/rooms/ProjectsRoom.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function ProjectPlane({ position, index }) {
  const ref = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + index * 0.7) * 0.003;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2 + index) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Card plane */}
      <mesh>
        <planeGeometry args={[2.5, 1.5]} />
        <meshBasicMaterial
          color={darkMode ? "#1e293b" : "#f1f5f9"}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Edge glow */}
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([-1.25, -0.75, 0, 1.25, -0.75, 0, 1.25, 0.75, 0, -1.25, 0.75, 0])}
            count={4}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={darkMode ? "#06b6d4" : "#4f46e5"} transparent opacity={0.6} />
      </lineLoop>
    </group>
  );
}

function ParticleStreams() {
  const ref = useRef();
  const { darkMode } = useTheme();
  const count = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = -85 + (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.005;
      arr[i * 3] += Math.cos(state.clock.elapsedTime * 0.5 + i * 0.2) * 0.003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={darkMode ? "#06b6d4" : "#4f46e5"}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function ProjectsRoom() {
  const planes = useMemo(() => [
    { position: [-3, 1, -82] },
    { position: [3, -0.5, -83] },
    { position: [-2, -1.5, -85] },
    { position: [2.5, 1.5, -86] },
    { position: [-3.5, 0, -87] },
    { position: [1, -1, -88] },
    { position: [-1, 2, -89] },
    { position: [3, 0.5, -90] },
  ], []);

  return (
    <group>
      {planes.map((p, i) => (
        <ProjectPlane key={i} position={p.position} index={i} />
      ))}
      <ParticleStreams />
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/rooms/ProjectsRoom.jsx
git commit -m "feat: add ProjectsRoom — floating planes with edge glow and particle streams"
```

---

## Task 10: Room 6 — ContactRoom

**Files:**
- Create: `src/components/three/rooms/ContactRoom.jsx`

- [ ] **Step 1: Create ContactRoom**

```jsx
// src/components/three/rooms/ContactRoom.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function Portal() {
  const ref = useRef();
  const ringRef = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      ref.current.scale.setScalar(scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  const color = darkMode ? "#06b6d4" : "#4f46e5";

  return (
    <group position={[0, 0, -98]}>
      {/* Core glow */}
      <mesh ref={ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      {/* Rotating ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.05, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      {/* Second ring */}
      <mesh rotation-x={Math.PI / 3} ref={(el) => {
        if (el) el.userData.ring2 = true;
      }}>
        <torusGeometry args={[2.5, 0.03, 8, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} />
      </mesh>
      <pointLight color={color} intensity={8} distance={20} />
      <pointLight color="#8b5cf6" intensity={3} distance={15} position={[0, 2, 0]} />
    </group>
  );
}

function ConvergingParticles() {
  const ref = useRef();
  const { darkMode } = useTheme();
  const count = 200;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 8 + Math.random() * 5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = -98 + r * Math.cos(phi);
      vel.push({ speed: Math.random() * 0.01 + 0.005 });
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const dx = 0 - arr[i * 3];
      const dy = 0 - arr[i * 3 + 1];
      const dz = -98 - arr[i * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > 0.5) {
        arr[i * 3] += (dx / dist) * velocities[i].speed;
        arr[i * 3 + 1] += (dy / dist) * velocities[i].speed;
        arr[i * 3 + 2] += (dz / dist) * velocities[i].speed;
      } else {
        // Reset to outer position
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 8 + Math.random() * 5;
        arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i * 3 + 2] = -98 + r * Math.cos(phi);
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={darkMode ? "#06b6d4" : "#4f46e5"}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function ContactRoom() {
  return (
    <group>
      <Portal />
      <ConvergingParticles />
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/rooms/ContactRoom.jsx
git commit -m "feat: add ContactRoom — convergence portal with gravitating particles"
```

---

## Task 11: World Canvas (Main Scene Assembly)

**Files:**
- Create: `src/components/three/World.jsx`

- [ ] **Step 1: Create World component**

```jsx
// src/components/three/World.jsx
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "../../contexts/themeContext";
import CameraController from "./CameraController";
import PostProcessing from "./effects/PostProcessing";
import HeroRoom from "./rooms/HeroRoom";
import AboutRoom from "./rooms/AboutRoom";
import TechRoom from "./rooms/TechRoom";
import ExperienceRoom from "./rooms/ExperienceRoom";
import ProjectsRoom from "./rooms/ProjectsRoom";
import ContactRoom from "./rooms/ContactRoom";

export default function World() {
  const { darkMode } = useTheme();

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: darkMode ? "#000000" : "#f8fafc" }}
      >
        <Suspense fallback={null}>
          <CameraController />
          <ambientLight intensity={0.1} />
          <HeroRoom />
          <AboutRoom />
          <TechRoom />
          <ExperienceRoom />
          <ProjectsRoom />
          <ContactRoom />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/three/World.jsx
git commit -m "feat: add World canvas assembling all rooms with camera and post-processing"
```

---

## Task 12: Overlay Sections (HTML Content)

**Files:**
- Create: `src/components/sections/HeroOverlay.jsx`
- Create: `src/components/sections/AboutOverlay.jsx`
- Create: `src/components/sections/TechOverlay.jsx`
- Create: `src/components/sections/ExperienceOverlay.jsx`
- Create: `src/components/sections/ProjectsOverlay.jsx`
- Create: `src/components/sections/ContactOverlay.jsx`

- [ ] **Step 1: Create HeroOverlay**

```jsx
// src/components/sections/HeroOverlay.jsx
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { HERO_CONTENT } from "../../constants";
import MagneticButton from "../ui/MagneticButton";
import { HiArrowDown } from "react-icons/hi";

export default function HeroOverlay() {
  const { language } = useTheme();

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.8 });
    tl.fromTo(".hero-greeting", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(".hero-name span", { opacity: 0, y: 50, rotateX: -90 }, { opacity: 1, y: 0, rotateX: 0, stagger: 0.04, duration: 0.5, ease: "power3.out" })
      .fromTo(".hero-role", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
      .fromTo(".hero-tagline", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3")
      .fromTo(".hero-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: "power3.out" }, "-=0.2")
      .fromTo(".hero-scroll", { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // Fade out on scroll
    ScrollTrigger.create({
      trigger: ".hero-section",
      start: "top top",
      end: "+=50%",
      scrub: true,
      onUpdate: (self) => {
        gsap.set(".hero-content", { opacity: 1 - self.progress * 2 });
      },
    });
  }, []);

  const nameChars = HERO_CONTENT.name.split("");

  return (
    <section className="hero-section h-[100vh] flex items-center justify-center relative">
      <div className="hero-content relative z-10 text-center max-w-4xl mx-auto px-4">
        <p className="hero-greeting text-lg md:text-xl text-neutral-400 mb-4 opacity-0">
          {HERO_CONTENT.greeting[language]}
        </p>
        <h1 className="hero-name text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-white dark:text-white" style={{ perspective: "600px" }}>
          {nameChars.map((char, i) => (
            <span key={i} className="inline-block opacity-0" style={{ transformStyle: "preserve-3d" }}>
              {char === " " ? " " : char}
            </span>
          ))}
        </h1>
        <p className="hero-role text-2xl md:text-3xl font-medium text-cyan-400 mb-6 opacity-0">
          {HERO_CONTENT.role[language]}
        </p>
        <p className="hero-tagline text-base md:text-lg text-neutral-300 max-w-2xl mx-auto mb-10 opacity-0 leading-relaxed">
          {HERO_CONTENT.tagline[language]}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <MagneticButton href="/Vo Khanh Duy - Frontend Developer.pdf" className="hero-cta inline-block px-6 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors opacity-0">
            Download CV
          </MagneticButton>
          <MagneticButton onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="hero-cta inline-block px-6 py-3 border border-cyan-500 text-cyan-400 rounded-full font-medium hover:bg-cyan-500/10 transition-colors opacity-0">
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

- [ ] **Step 2: Create AboutOverlay**

```jsx
// src/components/sections/AboutOverlay.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { ABOUT_CONTENT, STATS } from "../../constants";
import profileImg from "../../assets/profile/avatar_1.jpg";

export default function AboutOverlay() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 20%", scrub: true },
      });
      gsap.fromTo(contentRef.current, { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "bottom 60%", end: "bottom 30%", scrub: true },
      });

      const statEls = contentRef.current?.querySelectorAll(".stat-value");
      statEls?.forEach((el, i) => {
        const target = parseFloat(el.dataset.value);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2, delay: i * 0.2, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 50%" },
          onUpdate: () => { el.textContent = target % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(2); },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="h-[100vh] flex items-center justify-center relative">
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center opacity-0">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-75 blur-sm" />
            <img src={profileImg} alt="Vo Khanh Duy" className="relative w-64 h-64 lg:w-72 lg:h-72 object-cover rounded-2xl" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">{language === "vietnamese" ? "Về tôi" : "About Me"}</h2>
          <p className="text-neutral-300 leading-relaxed mb-8">{ABOUT_CONTENT[language]}</p>
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label.english} className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  <span className="stat-value" data-value={stat.value}>0</span>{stat.suffix}
                </div>
                <p className="text-xs text-neutral-400 mt-1">{stat.label[language]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create TechOverlay**

```jsx
// src/components/sections/TechOverlay.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { TECHNOLOGIES } from "../../constants";

export default function TechOverlay() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 20%", scrub: true },
      });
      gsap.fromTo(contentRef.current, { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "bottom 60%", end: "bottom 30%", scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const allTech = [...TECHNOLOGIES.frontend, ...TECHNOLOGIES.backend, ...TECHNOLOGIES.tools];

  return (
    <section ref={sectionRef} id="technologies" className="h-[100vh] flex items-center justify-center relative">
      <div ref={contentRef} className="max-w-3xl mx-auto px-4 text-center opacity-0">
        <h2 className="text-3xl font-bold text-white mb-10">{language === "vietnamese" ? "Công nghệ" : "Technologies"}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {allTech.map((tech) => (
            <span key={tech.name} className="px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-300 text-sm backdrop-blur-sm bg-cyan-500/5 hover:bg-cyan-500/20 transition-colors">
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create ExperienceOverlay**

```jsx
// src/components/sections/ExperienceOverlay.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { EXPERIENCE, EDUCATION } from "../../constants";

export default function ExperienceOverlay() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 20%", scrub: true },
      });
      gsap.fromTo(contentRef.current, { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "bottom 60%", end: "bottom 30%", scrub: true },
      });

      const cards = contentRef.current?.querySelectorAll(".exp-card");
      cards?.forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, x: i % 2 === 0 ? -30 : 30 }, {
          opacity: 1, x: 0, duration: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: `${20 + i * 15}% center` },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="h-[100vh] flex items-center justify-center relative">
      <div ref={contentRef} className="max-w-3xl mx-auto px-4 opacity-0">
        <h2 className="text-3xl font-bold text-white text-center mb-10">{language === "vietnamese" ? "Kinh nghiệm" : "Experience"}</h2>
        <div className="space-y-4">
          {EXPERIENCE.map((item, i) => (
            <div key={i} className="exp-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 opacity-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-white">{item.title[language]}</h3>
                <span className="text-xs text-cyan-400">{item.time}</span>
              </div>
              <p className="text-sm text-purple-400 mb-1">{item.company}</p>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.description[language]}</p>
            </div>
          ))}
          <div className="exp-card p-4 rounded-xl backdrop-blur-md bg-cyan-500/5 border border-cyan-500/20 opacity-0">
            <h3 className="font-bold text-white">{EDUCATION.degree[language]}</h3>
            <p className="text-sm text-purple-400">{EDUCATION.school} • {EDUCATION.time}</p>
            <p className="text-xs text-neutral-400">{EDUCATION.major[language]} • GPA: {EDUCATION.gpa}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create ProjectsOverlay**

```jsx
// src/components/sections/ProjectsOverlay.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { PROJECTS } from "../../constants";
import { FiExternalLink, FiGithub } from "react-icons/fi";

export default function ProjectsOverlay() {
  const { language } = useTheme();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0 }, {
        opacity: 1, duration: 1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 30%", scrub: true },
      });
      gsap.fromTo(contentRef.current, { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "bottom 60%", end: "bottom 30%", scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="h-[100vh] flex items-center justify-center relative">
      <div ref={contentRef} className="max-w-5xl mx-auto px-4 opacity-0">
        <h2 className="text-3xl font-bold text-white text-center mb-8">{language === "vietnamese" ? "Dự án" : "Projects"}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {PROJECTS.map((project, i) => {
            const title = typeof project.title === "string" ? project.title : project.title[language];
            return (
              <div key={i} className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white text-sm leading-tight">{title}</h3>
                  <div className="flex gap-2 shrink-0">
                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-400"><FiExternalLink size={14} /></a>}
                    {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-400"><FiGithub size={14} /></a>}
                  </div>
                </div>
                <p className="text-xs text-neutral-400 mb-3 line-clamp-2">{project.description[language]}</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{tech}</span>
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

- [ ] **Step 6: Create ContactOverlay**

```jsx
// src/components/sections/ContactOverlay.jsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../contexts/themeContext";
import { CONTACT } from "../../constants";
import MagneticButton from "../ui/MagneticButton";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker, HiCheck } from "react-icons/hi";

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
        <h2 className="text-3xl font-bold text-white mb-4">{language === "vietnamese" ? "Kết nối" : "Let's Connect"}</h2>
        <p className="text-neutral-300 mb-8">{language === "vietnamese" ? "Bạn muốn hợp tác? Hãy liên hệ với tôi." : "Interested in working together? Let's talk."}</p>

        <div className="space-y-3 mb-8">
          <button onClick={copyEmail} className="flex items-center gap-3 mx-auto text-neutral-300 hover:text-cyan-400 transition-colors cursor-none">
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
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: Passes.

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/
git commit -m "feat: add scroll-pinned overlay sections (Hero, About, Tech, Experience, Projects, Contact)"
```

---

## Task 13: App.jsx Assembly + Page Height

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/index.css`

- [ ] **Step 1: Replace App.jsx with final assembly**

```jsx
// src/App.jsx
import { useState, useEffect } from "react";
import { useTheme } from "./contexts/themeContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PageLoader from "./components/layout/PageLoader";
import CustomCursor from "./components/layout/CustomCursor";
import ScrollProgress from "./components/layout/ScrollProgress";
import World from "./components/three/World";
import HeroOverlay from "./components/sections/HeroOverlay";
import AboutOverlay from "./components/sections/AboutOverlay";
import TechOverlay from "./components/sections/TechOverlay";
import ExperienceOverlay from "./components/sections/ExperienceOverlay";
import ProjectsOverlay from "./components/sections/ProjectsOverlay";
import ContactOverlay from "./components/sections/ContactOverlay";

function MobileFallback() {
  return (
    <div className="font-inter text-neutral-200 antialiased bg-neutral-950 min-h-screen">
      <p className="text-center pt-20 text-neutral-400">Loading mobile experience...</p>
    </div>
  );
}

export default function App() {
  const { darkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return <MobileFallback />;
  }

  return (
    <>
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />
      <World />

      <div className="relative z-10 font-inter text-white antialiased">
        <Header />
        <main>
          <HeroOverlay />
          <AboutOverlay />
          <TechOverlay />
          <ExperienceOverlay />
          <ProjectsOverlay />
          <ContactOverlay />
        </main>
        <Footer />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Update index.css — add scroll-related styles**

Add at the end of `src/index.css`:

```css
/* Page height for scroll-driven camera */
main {
  min-height: 600vh;
}

main > section {
  position: sticky;
  top: 0;
}
```

- [ ] **Step 3: Verify build + dev server**

Run: `npm run build`
Expected: Passes.

Run: `npm run dev`
Check browser: 3D world renders, scrolling moves camera, overlay content appears/disappears.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: assemble persistent 3D world with scroll-pinned overlays"
```

---

## Task 14: Final Polish

**Files:**
- Possibly modify: any file with runtime issues

- [ ] **Step 1: Test and fix runtime issues**

Run: `npm run dev`

Verify:
1. Page loads → PageLoader animation → 3D world visible
2. Scroll down → camera moves forward through rooms
3. Hero text appears and fades out on scroll
4. Each section content fades in/out at correct scroll position
5. Dark/light mode toggle works (background color + glow intensity changes)
6. Language toggle works
7. Post-processing effects visible (bloom on glowing objects)
8. Mouse parallax on camera subtle but noticeable
9. Custom cursor works
10. Header glassmorphism on scroll

- [ ] **Step 2: Fix any issues found**

Common fixes needed:
- Adjust camera Z range if rooms appear too close/far
- Adjust ScrollTrigger start/end values for proper section timing
- Fix any z-index issues between canvas and overlays
- Ensure overlay text is readable against 3D background (may need backdrop-blur)

- [ ] **Step 3: Final build**

Run: `npm run build`
Expected: Passes.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: polish 3D world and overlay timing"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Remove old 3D, add postprocessing dep | package.json, delete old |
| 2 | Custom shaders (dissolve, holographic) | shaders/ |
| 3 | Camera controller (scroll-driven) | CameraController.jsx |
| 4 | Post-processing pipeline | effects/PostProcessing.jsx |
| 5 | HeroRoom (particles, icosahedron) | rooms/HeroRoom.jsx |
| 6 | AboutRoom (helix, data nodes) | rooms/AboutRoom.jsx |
| 7 | TechRoom (orbits, core, energy) | rooms/TechRoom.jsx |
| 8 | ExperienceRoom (corridor, pillars) | rooms/ExperienceRoom.jsx |
| 9 | ProjectsRoom (floating planes) | rooms/ProjectsRoom.jsx |
| 10 | ContactRoom (portal, converging) | rooms/ContactRoom.jsx |
| 11 | World canvas assembly | World.jsx |
| 12 | All overlay sections | sections/*Overlay.jsx |
| 13 | App.jsx + CSS assembly | App.jsx, index.css |
| 14 | Final polish and bug fixes | Various |

# Portfolio Redesign — Space Theme with Normal Scroll

## Overview

Redesign the portfolio from a camera-fly-through scroll experience to a normal top-to-bottom scroll layout. Keep Three.js + GSAP animations throughout (hero to contact) with a space/cosmos aesthetic. A single astronaut character accompanies the user's journey across all sections.

## Architecture: Single Persistent Canvas + ScrollTrigger

- 1 fixed full-screen Three.js Canvas (z-index: 0)
- Camera fixed at `[0, 0, 20]`, FOV 60, no scroll-driven movement
- Mouse parallax only (±0.3 on x/y), disabled on touch
- Content rendered as normal document flow (z-index: 10) on top
- ScrollTrigger drives 3D object visibility and astronaut position
- Objects outside viewport skip useFrame computation

## Background Layer (Always Visible)

- **Starfield**: 500-800 particles (200 on phone), random positions, subtle twinkle
- **Nebula**: 2-3 transparent planes with procedural noise shader, slight parallax on scroll
- Single continuous canvas from hero to contact

## Astronaut

- 1 GLTF/GLB model loaded once
- Scroll-driven GSAP timeline (`scrub: 1`):
  - 0% Hero: center `[0, 0, 5]`, idle floating
  - 20% About: right `[4, 1, 3]`, tilt 15°
  - 40% Tech: left `[-4, 0, 4]`, pointing pose
  - 60% Experience: top `[0, 3, 6]`, scale 0.6
  - 80% Projects: right-bottom `[3, -2, 4]`, relaxed lean
  - 100% Contact: center `[0, 0, 3]`, moving toward portal
- Idle animation: subtle Y bob (sin wave, amplitude 0.1, period 3s)

## 3D Scenes Per Section

### Hero — "Astronaut in Deep Space"
- Astronaut center, large scale, floating
- Small drifting asteroids/rocks around
- 1 large planet behind (sphere + atmosphere glow shader)
- Entrance: astronaut dissolve-in from particles, planet fade from distance

### About — "Space Station Window"
- Astronaut right side, tilted head pose
- Slowly rotating ring structure (space station segment)
- Floating light orbs around ring
- Entrance: ring assembles from fragments, orbs fly in staggered

### Tech — "Solar System"
- Center: star (sphere + emissive pulse shader)
- 3-4 orbit rings at different speeds
- Tech icons as billboard sprites on orbits (React, Node, Three.js, etc.)
- Astronaut left side, pointing pose
- Entrance: star ignite (scale 0→1 + glow burst), orbits spin in, icons materialize staggered

### Experience — "Asteroid Belt Timeline"
- Vertical asteroid markers for timeline milestones
- Glowing connector lines between asteroids
- Astronaut above, smaller, surveying
- Floating dust particles
- Entrance: asteroids fly in staggered, lines draw on

### Projects — "Floating Screens in Space"
- Floating planes with project thumbnails, slight tilt/rotation
- Subtle glow border per plane
- Light particle streams between planes
- Astronaut right-bottom, relaxed
- Entrance: planes materialize from glitch/static effect, staggered

### Contact — "Black Hole / Portal"
- Center: portal (spinning torus + particle vortex converging inward)
- Astronaut flying toward portal (journey ending)
- Background stars subtly distorted near portal
- Entrance: portal opens (scale 0→1 + spin), particles begin converging

## Content Animation (GSAP ScrollTrigger)

- Trigger: section enters viewport (`start: "top 80%"`)
- Headings: splitText, stagger from below, rotateX 3D flip
- Paragraphs: fade + translateY(30px), stagger 0.1s per line
- Cards/items: stagger from below, scale 0.8→1 + opacity 0→1
- Tech badges: scatter → fly into grid position, stagger 0.03s
- Timeline items: slide in from left/right alternating
- 3D objects enter slightly earlier (`start: "top 90%"`), play once on enter, reverse on leave

## Idle Animations (Always Running When Visible)

- Astronaut: Y bob
- Star (Tech): emissive pulse
- Orbit icons: continuous rotation
- Portal particles: continuous vortex
- Starfield: random twinkle
- All use `useFrame` with delta, paused when `.visible = false`

## Theme System

### Dark Mode — Deep Space
- Background: `#0a0a0f` → `#0d1117`
- Stars: white/cyan, opacity 0.6-1.0
- Nebula: deep purple/cyan/blue, opacity 0.3
- Accents: cyan `#06b6d4`, purple `#8b5cf6`, neon `#22d3ee`
- Astronaut: cyan rim lighting
- Strong bloom, glow effects
- Cards: `bg-white/5` backdrop-blur, border `white/10`

### Light Mode — Space Lite
- Background: `#f0f4ff` → `#e8eeff`
- Stars: reduced opacity 0.2-0.4, count 300
- Nebula: pastel blue/lavender, opacity 0.15
- Accents: indigo `#4f46e5`, violet `#7c3aed`, sky `#0ea5e9`
- Astronaut: warm ambient, no rim light
- Reduced bloom, soft glow
- Cards: `bg-white/80` backdrop-blur, border `gray-200`

### Post-processing
- Dark: Bloom (0.8, threshold 0.6) + ChromaticAberration (0.0003) + Vignette (0.4)
- Light: Bloom (0.3, threshold 0.8) + Vignette (0.2)

### Theme Transition
- CSS: background/color 0.5s transition
- 3D: GSAP tween material colors over 0.8s
- Stars: opacity tween 0.5s

## Mobile & Responsive

### Breakpoints
- Desktop ≥1024px: full experience
- Tablet 768-1023px: full 3D, 50% particle reduction
- Phone <768px: simplified 3D

### Phone Optimizations
- Starfield: 200 particles
- Nebula: 1 plane, simplified shader
- Tech: 2 orbits, 8-10 icons max
- Experience: no dust particles
- Projects: no particle streams
- Contact: reduced vortex, no distortion
- Post-processing: disabled entirely
- `dpr={[1, 1]}` fixed
- Mouse parallax disabled

### Layout Responsive
- Hero: text centered, astronaut above text (lower z, smaller)
- About/Experience/Projects: full-width stacked
- Tech: star 40% viewport height
- Cards: 1 column phone, 2 columns tablet
- Astronaut positions adjusted for narrower viewport

### Touch
- No mouse parallax
- Tap instead of hover for card reveals

## File Structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── canvas/
│   │   ├── Scene.jsx
│   │   ├── Background.jsx
│   │   ├── Astronaut.jsx
│   │   ├── PostProcessing.jsx
│   │   └── sections/
│   │       ├── HeroScene.jsx
│   │       ├── AboutScene.jsx
│   │       ├── TechScene.jsx
│   │       ├── ExperienceScene.jsx
│   │       ├── ProjectsScene.jsx
│   │       └── ContactScene.jsx
│   ├── sections/
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Tech.jsx
│   │   ├── Experience.jsx
│   │   ├── Projects.jsx
│   │   └── Contact.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── CustomCursor.jsx
│   │   └── ScrollProgress.jsx
│   └── ui/
│       ├── MagneticButton.jsx
│       ├── SplitText.jsx
│       └── Card3D.jsx
├── hooks/
│   ├── useScrollProgress.js
│   ├── useSectionInView.js
│   └── useMouseParallax.js
├── contexts/
│   └── themeContext.jsx
├── constants/
│   └── index.js
└── assets/
    └── models/
        └── astronaut.glb
```

## Dependencies
- Keep: three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, gsap, tailwindcss
- Add: astronaut GLB model (source TBD)
- Remove: nothing

## Performance Strategy
- `scrub: 1` for smooth scroll interpolation without per-pixel recalc
- 3D entrances trigger once, not continuously
- `useFrame` skipped for non-visible objects via IntersectionObserver
- Single WebGL context (1 canvas)
- Adaptive DPR
- Mobile: no post-processing, reduced geometry

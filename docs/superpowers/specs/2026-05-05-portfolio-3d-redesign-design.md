# Portfolio 3D Space Theme Redesign — Design Spec

## Overview

Redesign the portfolio website with an immersive space theme using a single shared Three.js canvas, GSAP ScrollTrigger animations, and a 3D astronaut model. The site uses vertical scroll with a fixed starfield background and parallax depth effects throughout.

**Stack**: React 19, Three.js (v0.170), @react-three/fiber v9, @react-three/drei v10, GSAP 3.12, Tailwind CSS v4
**Branch**: `feat/space-theme-redesign` starting from commit `cbe6906`

---

## Architecture: Single Shared Canvas

- One `<Canvas>` fixed fullscreen (`position: fixed; inset: 0; z-index: 0`)
- Starfield background: ~2000 small particles, very slow drift, subtle mouse parallax
- DOM content scrolls normally above canvas (`position: relative; z-index: 1`)
- `useScrollProgress` hook tracks overall scroll position, passes to canvas to control 3D elements per active section
- Sections use `pointer-events: none` on transparent areas so users can interact with 3D beneath when needed
- Mobile fallback: reduced particle count, simplified 3D effects

### Scene Management

Each section's 3D elements live inside the shared canvas. Visibility and animation are driven by scroll position:
- `useFrame` checks current scroll progress range
- Elements outside their section's range are hidden (`visible: false`) or scaled to 0
- Smooth transitions between section ranges using lerped values

### Lighting Setup (Global)

- 1 ambient light (low intensity, blue tint)
- 1 directional light (sun, warm white)
- Per-section point lights as needed

---

## Section 1: Hero

### 3D Elements (in Canvas)
- **Astronaut model** (`public/astronaut.glb`, ~2.25MB): loaded via `useGLTF`
  - Position: center-right of viewport
  - Floating animation: `useFrame` sin wave bobbing (amplitude ~0.2, frequency ~0.5)
  - Slow Y-axis rotation (~0.1 rad/s)
  - Mouse parallax: astronaut tilts slightly toward cursor direction
  - Lighting: directional (sun) + rim point light for edge glow
  - On scroll down: scale reduces and opacity fades via material transparency

### DOM Overlay (left side)
- Greeting, name, role, tagline — existing GSAP stagger animations preserved
- CTA buttons (CV download, contact scroll)
- Layout: left-aligned, vertically centered

---

## Section 2: About

No changes to current design. Keeps existing GSAP scroll animations (image scale/fade, text fade, stat counters).

---

## Section 3: Technologies — Solar System 3D

### 3D Elements (in Canvas)
- **Sun (center)**: Glowing sphere with emissive material, pulse animation, halo sprite
- **3 orbit rings** (wireframe torus or line):
  - Frontend: smallest radius (~3.5), fastest rotation
  - Backend: medium radius (~5.5), medium speed
  - Tools: largest radius (~7.5), slowest rotation
- **Planets = Tech logos**: Each technology is a small sphere textured with its icon from `src/assets/technologies/`
  - Self-rotation (slow spin on own axis)
  - Orbit rotation (revolves around sun with its ring)
  - 6 planets per ring (18 total matching current data)

### Interactions
- Hover planet: scale to 1.3x, show tooltip (tech name) via drei `Html` component
- Scroll trigger: solar system zooms from 0.5 to 1.0 scale when section enters viewport, orbits begin spinning

### Mobile
- Camera zooms closer, reduced orbit radii
- Touch = hover for tooltips

---

## Section 4: Projects — Card Stack

### Mechanism
- Cards stacked on top of each other, bottom cards slightly offset (4-8px each) to show depth
- Section is **pinned** via GSAP ScrollTrigger
- Each ~30vh of scroll flips the top card away (rotateX + translateY up + opacity fade), revealing the next card
- Total pin duration: ~210vh (7 cards x 30vh)

### Card Design
- Max-width ~600px, centered horizontally
- Glassmorphism: `bg-white/10 backdrop-blur-md` dark, `bg-white/50 backdrop-blur-sm` light
- Gradient border (subtle cyan-to-purple)
- Content: project title + tech tags (top), description (middle), demo/github links with icons (bottom)
- Active card has subtle floating animation (GSAP translateY bobbing)

### Progress Indicator
- Small dots or "3/7" counter beside the stack

### Data Changes
- Remove placeholder project 8 ("TBD") — keep 7 real projects only

### Mobile
- Same stack + scroll-flip mechanism, cards full-width with padding

---

## Section 5: Experience — Horizontal Scroll Timeline

### Mechanism
- Section is **pinned** via GSAP ScrollTrigger
- Vertical scroll is translated into horizontal movement inside the container
- Total pin duration: ~300vh (5 stops x 60vh per stop)

### Visual Design
- **Timeline track**: Thin horizontal line running through vertical center, cyan glow effect
- **Progress fill**: Gradient glow portion fills left-to-right as user scrolls, showing current position
- **Milestone nodes** (5 total: 4 experiences + 1 education):
  - Glowing sphere on the track line, scales up when active
  - Content card above or below track (alternating)
  - Cards contain: job title, company name, time period, description
  - Cards slide-in from below + fade when scrolling to their position
- **Education entry**: Final milestone with distinct icon (graduation cap via react-icons)
- **Ambient particles**: Small stars drifting horizontally in scroll direction for "traveling through space" feel

### Mobile
- Horizontal scroll with touch swipe support
- One card visible at a time
- Smaller cards, simplified particles

---

## Section 6: Contact — Redesign

### Layout
- 2 columns on desktop, 1 column on mobile

### Left Column — Contact Info
- Heading: "Let's Connect" with gradient text (cyan to purple)
- Tagline (bilingual): "Ready to collaborate? Get in touch"
- Contact items (icon + text each):
  - Email: vokhanhduy2004@gmail.com (mailto link)
  - Phone: +84 901 226 907 (tel link)
  - Zalo: +84 901 226 907 (https://zalo.me/0901226907)
  - Location: Can Tho, Vietnam
- **Freelance CTA card**: Prominent card — "Hire me for web development" linking to vokhanhduy.site
  - Globe icon, gradient border, glow effect on hover
  - Distinct from regular contact items

### Right Column — Social Links
- GitHub, LinkedIn, Facebook — large icons in glassmorphism cards
- MagneticButton effect preserved (icon follows cursor on hover)
- Hover: icon scale + brand color glow (GitHub white, LinkedIn blue, Facebook blue)

### Animation
- GSAP stagger: left column slides from left, right column slides from right, items stagger 0.1s

### Data Changes
- Add Zalo to CONTACT.social: `zalo: "https://zalo.me/0901226907"`
- Add website to CONTACT: `website: "https://vokhanhduy.site"`

---

## Performance Considerations

- **GLB loading**: Use `useGLTF.preload` for astronaut model, show loading state
- **Texture loading**: Lazy-load tech icon textures when Technologies section is near viewport
- **Particle count**: Desktop 2000, mobile 800
- **DPR scaling**: `dpr={[1, 2]}` on Canvas
- **Scroll calculations**: Use `requestAnimationFrame`-aligned scroll listeners, avoid layout thrashing
- **Section visibility**: 3D elements outside viewport set to `visible: false` to skip GPU rendering
- **Mobile detection**: Reduce orbit complexity, particle counts, disable mouse parallax on touch devices

---

## Files to Create/Modify

### New Files
- `src/components/three/Starfield.jsx` — persistent starfield background
- `src/components/three/Astronaut.jsx` — GLB model with animations
- `src/components/three/SolarSystem.jsx` — tech solar system (sun + orbits + planets)
- `src/components/three/SceneManager.jsx` — manages visibility/animation of all 3D elements based on scroll
- `src/hooks/useScrollProgress.js` — enhanced scroll tracking hook

### Modified Files
- `src/App.jsx` — new layout with single fixed Canvas + scrollable DOM content
- `src/components/sections/Hero.jsx` — remove ParticleField Canvas, use DOM overlay only
- `src/components/sections/Technologies.jsx` — remove TechOrbit Canvas, simplify to title + mobile fallback
- `src/components/sections/Projects.jsx` — card stack with ScrollTrigger pinning
- `src/components/sections/Experience.jsx` — horizontal scroll timeline with pinning
- `src/components/sections/Contact.jsx` — 2-column redesign with new data
- `src/constants/index.js` — add Zalo, website; remove placeholder project

### Files to Remove
- `src/components/three/ParticleField.jsx` — replaced by Starfield in shared canvas
- `src/components/three/TechOrbit.jsx` — replaced by SolarSystem in shared canvas

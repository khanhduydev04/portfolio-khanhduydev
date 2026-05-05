# Portfolio Visual Upgrade — Persistent 3D World

## Overview

Upgrade the portfolio from basic section-based animations to a persistent 3D world experience. One continuous Three.js canvas covers the entire page. Camera flies forward through geometric/abstract "rooms" as the user scrolls, creating a journey from Hero to Contact. HTML content overlays on top, synced to camera position via GSAP ScrollTrigger.

## Architecture

### Single Canvas System
- One `<Canvas>` element: `position: fixed; inset: 0; z-index: 0`
- Camera moves along Z axis: Z=0 (Hero) → Z=-100 (Contact)
- GSAP ScrollTrigger scrubs camera.position.z based on scroll progress (0%→100%)
- Page total height: ~600vh (each room ~100vh scroll distance)

### HTML Overlay System
- Content div: `position: relative; z-index: 10`
- Each section uses `position: sticky` or GSAP pin to stay visible during its room
- Text/elements animate in/out via GSAP ScrollTrigger tied to same scroll progress
- Sections fade in when camera arrives at their room, fade out when leaving

### Post-Processing Pipeline
- UnrealBloomPass: glow for all emissive geometry
- Chromatic Aberration: subtle, intensifies during camera movement
- Vignette: soft dark edges for focus
- Film Grain: very subtle texture (noise)

## Rooms

### Room 1: Hero — "Digital Void" (Z = 0 to -15)

**3D Scene:**
- Hundreds of particles drifting in space with inward flow toward center
- Large wireframe icosahedron at center, slowly rotating, emitting soft glow
- Scattered geometric fragments (triangles, line segments, small cubes) floating
- Mouse interaction: particles and fragments repel from cursor position

**Camera behavior:** Starts stationary, then flies toward and through the icosahedron.

**Transition out:** Icosahedron explodes into particles that re-form into Room 2 geometry.

**HTML Content:**
- "Hi, I'm" greeting (fade + slide up)
- "Vo Khanh Duy" name (SplitText char reveal)
- "Fullstack Developer" role (text scramble effect)
- Tagline paragraph (fade in)
- CTA buttons: Download CV + Get in touch (magnetic effect)
- All content fades out as camera starts moving

### Room 2: About — "Digital DNA" (Z = -20 to -35)

**3D Scene:**
- Particles re-form into a double-helix/spiral structure, rotating slowly
- Floating data nodes connected by glowing lines around the helix
- As camera approaches: helix "unfolds" — nodes spread outward
- Ambient geometric dust particles

**Transition out:** Helix collapses into ring shapes, morphs into orbit rings of Room 3.

**HTML Content:**
- "About Me" title (SplitText)
- Bio paragraph
- Stats: 2+ Years | 30+ Projects | 3.85 GPA (count-up)
- Profile image (CSS positioned)

### Room 3: Technologies — "Tech Galaxy" (Z = -40 to -55)

**3D Scene:**
- Three concentric orbit rings rotating at different speeds
- Each ring has glowing nodes at tech positions with emissive trail effects
- Center: pulsating core sphere with energy lines radiating to each node
- Background: subtle holographic grid floor
- Mouse interaction: hover near node → node enlarges + light pulse travels to core

**Transition out:** Rings flatten into horizontal lines, stretch into pillar shapes.

**HTML Content:**
- Section title
- Floating labels near 3D nodes (CSS positioned via 3D→2D projection)

### Room 4: Experience — "Timeline Corridor" (Z = -60 to -75)

**3D Scene:**
- Geometric corridor with pillars/monoliths on both sides
- Each pillar = one experience milestone, lights up as camera passes
- Glowing line on floor running down the center (timeline)
- Ceiling: scattered triangle fragments for depth
- Pillars have holographic noise-based color shift texture
- Pillars ahead of camera "rise up" from floor as camera approaches

**Transition out:** Corridor widens, pillars dissolve into floating planes.

**HTML Content:**
- Timeline cards appear one-by-one as camera passes corresponding pillar
- Each card: time, title, company, description
- Cards are scroll-pinned (appear then disappear)

### Room 5: Projects — "Floating Gallery" (Z = -80 to -90)

**3D Scene:**
- Open space with project planes arranged in staggered 3D positions
- Planes have edge glow and subtle float/bob animation
- Connecting particle streams between cards (data flow aesthetic)
- Background: fading grid + distant geometric shapes

**Transition out:** Cards fly away in all directions, space closes in to focal point.

**HTML Content:**
- Project info appears alongside corresponding 3D planes
- Tech tags, links, descriptions

### Room 6: Contact — "Convergence Point" (Z = -95 to -100)

**3D Scene:**
- All geometry from previous rooms converges into a bright portal/point
- Portal pulsates, emits radiating rings of light
- Particles drawn inward (gravity well effect)
- Warm glow atmosphere, calm movement — contrast with previous energy

**HTML Content:**
- "Let's Connect" title
- Email (click-to-copy), phone, location
- Social links (magnetic buttons)
- Footer

## Shader Effects

- **Dissolve shader:** Noise-based disappear/appear for geometry transitions between rooms
- **Holographic shader:** Color-shifting noise for pillar textures in Room 4
- **Glow/Emission shader:** For energy lines, nodes, and core elements
- **Trail shader:** For orbit ring trail effects in Room 3

## Scroll Mechanics

- Total page height: 600vh
- GSAP ScrollTrigger with `scrub: 1` (smooth 1s lag for cinematic feel)
- Camera Z position = lerp(0, -100, scrollProgress)
- Between rooms: ~20vh "transition zone" where geometry morphs
- HTML sections pinned during their room's scroll range

## Interactions

- **Mouse parallax on camera:** Camera offsets slightly toward cursor direction (X/Y), creating depth perception
- **Hover on 3D objects:** Highlight + pulse animation
- **Custom cursor:** Kept from current implementation (dot + circle, blend mode)
- **Scroll indicator:** Animated in Hero, disappears after first scroll

## Performance Strategy

### Desktop (>1024px)
- Full effects: post-processing, high particle count (500+), all shaders
- 60fps target

### Tablet (768-1024px)
- Reduced particles (200)
- No chromatic aberration
- Simplified shaders

### Mobile (<768px)
- **No 3D canvas at all** — complete HTML/CSS fallback
- Keep current GSAP scroll animations (fade, slide, stagger)
- Replace 3D background with animated CSS gradients + noise texture
- All content visible in standard scroll layout

## Color Scheme

### Dark Mode (default)
- Background: #000000 (pure black for max glow contrast)
- Primary glow: cyan #06b6d4
- Secondary: purple #8b5cf6
- Tertiary: amber #f59e0b
- Geometry base: dark gray wireframes with emissive edges
- Bloom intensity: high

### Light Mode
- Background: #f8fafc (very light blue-gray)
- Primary: indigo #4f46e5
- Secondary: violet #7c3aed
- Tertiary: blue #2563eb
- Geometry: soft colored with subtle shadows (no glow)
- Bloom intensity: low, replaced with soft ambient occlusion feel

## File Structure Changes

Replace current Three.js components with:
```
src/components/three/
├── World.jsx           # Main persistent canvas + camera controller
├── rooms/
│   ├── HeroRoom.jsx    # Room 1 geometry
│   ├── AboutRoom.jsx   # Room 2 geometry
│   ├── TechRoom.jsx    # Room 3 geometry
│   ├── ExperienceRoom.jsx  # Room 4 geometry
│   ├── ProjectsRoom.jsx    # Room 5 geometry
│   └── ContactRoom.jsx     # Room 6 geometry
├── effects/
│   ├── PostProcessing.jsx  # Bloom, chromatic, vignette
│   └── Transitions.jsx     # Dissolve/morph between rooms
├── shaders/
│   ├── dissolve.glsl       # Dissolve vertex/fragment
│   ├── holographic.glsl    # Noise color shift
│   └── glow.glsl           # Emission/glow
└── CameraController.jsx    # ScrollTrigger → camera position

src/components/sections/  # Keep but refactor for scroll-pinned overlay
├── HeroOverlay.jsx
├── AboutOverlay.jsx
├── TechOverlay.jsx
├── ExperienceOverlay.jsx
├── ProjectsOverlay.jsx
└── ContactOverlay.jsx
```

## Dependencies

Keep all current deps. Add:
- `postprocessing` or `@react-three/postprocessing` — for bloom, effects
- Possibly `three/examples/jsm/shaders` for built-in shader chunks

## What Stays The Same
- All content/data (constants/index.js)
- Theme context (dark/light + Vi/En)
- Header, Footer, CustomCursor, ScrollProgress, PageLoader
- Mobile fallback keeps current section-based layout

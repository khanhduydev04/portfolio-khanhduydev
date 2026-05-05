# Portfolio Redesign — Design Spec

## Overview

Complete redesign of Vo Khanh Duy's portfolio website. Upgrade from React 18 to React 19, replace Motion (Framer Motion) with GSAP + Three.js, redesign all sections with professional animations.

## Tech Stack

### Keep
- Vite 6 (build tool)
- Tailwind CSS 4 (styling)
- React Router DOM 7
- React Icons
- Dark/Light mode toggle
- Vietnamese/English bilingual support

### Add
- **React 19** (upgrade from 18.3)
- **GSAP** (ScrollTrigger, ScrollSmoother, SplitText) — scroll-driven animations throughout
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — 3D scenes (Hero + Technologies)

### Remove
- `motion` (Framer Motion replacement)
- `react-vertical-timeline-component`

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, ScrollProgress, PageLoader, CustomCursor
│   ├── sections/        # Hero, About, Technologies, Experience, Projects, Contact
│   ├── three/           # ParticleField, TechOrbit (Three.js canvas components)
│   └── ui/              # AnimatedText, MagneticButton, Card3D, SplitTextReveal
├── hooks/               # useGSAP, useScrollTrigger, useMousePosition
├── contexts/            # themeContext (dark/light + language)
├── constants/           # All data (CV content, projects, translations)
├── assets/
│   ├── profile/
│   ├── projects/
│   └── technologies/
└── styles/
    └── index.css
```

## Sections Design

### Header
- Fixed top, transparent → glassmorphism on scroll (backdrop blur + semi-transparent bg)
- Left: Logo/name "KhanhDuy"
- Right: nav links (About, Technologies, Experience, Projects, Contact) + Dark/Light toggle + Language toggle (Vi/En)
- Nav links: hover underline animation (draw from center outward)
- Scroll spy: highlight active section link
- Load animation: fade in + slide down
- Mobile: hamburger → full-screen overlay or slide-in panel from right, menu items stagger in

### Hero Section
- **3D Background (Three.js):** Full-screen canvas behind text
  - Hundreds of particles connected by lines when nearby (constellation effect)
  - Particles react to mouse position — push away or attract toward cursor
  - Particle colors change with theme: cyan/purple for dark, blue/indigo for light
  - Subtle continuous movement when no interaction
- **Content overlay:**
  - Greeting: "Hi, I'm" — fade in + slide up
  - Name "Vo Khanh Duy" — GSAP SplitText, characters stagger reveal from bottom
  - Role "Fullstack Developer" — text scramble effect (random chars settle into correct text)
  - Tagline from CV summary — fade in last
  - Scroll indicator at bottom — animated chevron bounce
- **CTA buttons:** "Download CV" + "Get in touch"
  - Magnetic button effect (slightly pulls toward cursor on hover)
  - Subtle glow/border animation on hover
- **Responsive:** Fewer particles on mobile, center-aligned layout

### About Section
- 2 columns: left = profile image, right = text (stack vertically on mobile)
- **Image:** Animated gradient border (gradient rotates around border), scale 0.8→1 + fade in on scroll, subtle parallax
- **Text:** Heading "About Me" SplitText reveal, paragraph fade in + slide up, highlight keywords with accent color + glow
- **Stats bar:** 3 items horizontal: "2+ Years Experience" | "30+ Projects" | "GPA 3.85/4.0"
  - Count up animation on scroll into view
  - Stagger delay between items
- **Background:** Soft gradient blob, slowly moving

### Technologies Section
- Heading: SplitText reveal on scroll
- **3D Orbit (Three.js + React Three Fiber):**
  - Center: glowing sphere/core representing "skillset"
  - Tech icons orbit on multiple rings:
    - Inner orbit (Frontend): React, Next.js, React Native, Tailwind CSS, TypeScript
    - Middle orbit (Backend): Node.js, Express, MongoDB, PostgreSQL, MySQL
    - Outer orbit (Tools): Docker, Git, Firebase, Supabase, Figma
  - Each icon is a sprite/plane with technology logo texture
  - Different rotation speeds per orbit for depth
  - **Interactive:** Hover icon → orbit pauses, icon enlarges + tooltip + glow
  - Mouse drag → rotate entire orbit system to new viewing angle
- **Scroll animation:** Icons fly in from outside to orbit positions (stagger), core scales up
- **Responsive:** Mobile falls back to 2D animated grid with float/bounce effect

### Experience Section
- Heading: SplitText reveal on scroll
- **Timeline line:** Drawn with GSAP ScrollTrigger — extends as user scrolls (draw effect), gradient color
- **Timeline nodes:** Dots on line, each glows (scale + glow) when scrolled to
- **Cards:** Alternate left/right along timeline
  - Content: date, company, role, short description
  - Animation: slide in from left/right + fade in (stagger)
  - Hover: slight translateY up + shadow increase
- **Content (4 entries):**
  1. 03/2026 – 05/2026: Fullstack Developer @ Pati Group
  2. 01/2025 – 01/2026: Frontend Developer @ Golden Bee IT Solutions
  3. 09/2024 – 12/2024: AI Engineer Intern @ FPT Software Quy Nhon (QAI)
  4. 06/2024 – 10/2024: Frontend Collaborator @ FPT Polytechnic Software Workshop
- **Education card (end of timeline):** Special style — FPT Can Tho, Bachelor of IT, 2022–2025, GPA 3.85/4.0

### Projects Section
- Heading: SplitText reveal on scroll
- **Grid:** 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **6+ cards**, some with real data, rest placeholder for future additions
- **Card design:**
  - Thumbnail/screenshot at top
  - Below: project name, 1-2 line description, tech tag chips
  - Small icons for links: Live demo + GitHub repo
- **Card animations:**
  - Scroll reveal: cards stagger — scale 0.9→1 + fade in, delay between each
  - **3D Tilt on hover:** card tilts toward mouse direction (perspective transform)
  - Hover: thumbnail zoom, shadow increase, subtle border glow
  - Tech tags: slide in stagger when card appears
- **Project data:**
  1. Adlance — Static Ads Generator (Next.js, Supabase, Anthropic API, Gemini API)
  2. Golden Bee Driving Lessons — Mobile App (React Native, Expo, React Query)
  3. Thuc Duong Thien Minh — E-commerce (WordPress, PHP, Tailwind CSS)
  4. Video Ads Generator — AI-powered tool (from Pati Group)
  5. Playwright Crawlers — Competitive research tool (from Pati Group)
  6. Portfolio — This website (React 19, Three.js, GSAP, Tailwind CSS)
  - Additional placeholder projects for future

### Contact Section
- Heading "Let's Connect" — SplitText reveal
- **2-part layout:** Left = text/info, Right = social links
- **Left side:**
  - Tagline: "Interested in working together? Let's talk."
  - Email: vokhanhduy2004@gmail.com — click to copy with micro animation (copy icon → checkmark)
  - Phone: +84 901 226 907
  - Location: Can Tho, Vietnam
- **Right side — Social links:**
  - Large icons: GitHub, LinkedIn, Facebook
  - Magnetic button effect per icon
  - Hover: scale up + background glow in brand color
- **Animation:** Text slide up stagger, social icons fly in from right stagger
- **Background:** Subtle gradient shift animation

### Footer
- Small footer: "© 2026 Vo Khanh Duy. Built website and SEO by [KhanhDuyDev](https://vokhanhduy.site)"
- Fade in last

## Global Effects

### GSAP ScrollSmoother
- Entire page has smooth scrolling (lerp effect)

### Section Transitions
- Subtle parallax between sections — background elements move slower than content
- No hard dividers — gradient fades or subtle shape dividers (wave/curve)

### Scroll Progress
- Thin progress bar on right edge or top — shows scroll percentage

### Page Loader
- Intro animation on first load: logo appear → expand → reveal content
- Ensures Three.js canvases are ready before showing content

### Custom Cursor (desktop only)
- Small dot + larger circle following with delay
- Cursor changes on interactive elements (enlarges, blend mode change)

## Performance Considerations

- Three.js canvases only render when visible (IntersectionObserver)
- Suspend Three.js when scrolled out of viewport
- Fewer particles on mobile for Hero
- Technologies section falls back to 2D on mobile
- Lazy load project thumbnails
- GSAP animations use will-change and GPU-accelerated properties (transform, opacity)

## Data Source

All personal information, experience, projects, and skills sourced from:
- `data/vokhanhduy_cv.md`
- `data/Fullstack_Developer_VoKhanhDuy.pdf`

Bilingual content maintained in constants file with Vietnamese and English versions.

## Color Scheme

### Dark Mode (default)
- Background: neutral-900 to neutral-950 gradients
- Text: white/neutral-100
- Accents: cyan, purple, blue (neon feel)
- Particle colors: cyan/purple

### Light Mode
- Background: white/neutral-50
- Text: neutral-800/900
- Accents: blue, indigo, violet
- Particle colors: blue/indigo

Both modes: smooth transition animation when toggling.

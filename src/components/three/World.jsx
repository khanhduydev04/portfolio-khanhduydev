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

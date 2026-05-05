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

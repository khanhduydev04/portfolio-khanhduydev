import Starfield from "./Starfield";
import Astronaut from "./Astronaut";
import SolarSystem from "./SolarSystem";

export default function SceneManager({ scrollData, mouse }) {
  const { activeSection, sectionProgress } = scrollData;

  const heroVisible = activeSection === "hero";
  const techProgress = sectionProgress?.technologies || 0;

  return (
    <>
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />

      <Starfield mouse={mouse} />
      <Astronaut mouse={mouse} visible={heroVisible} />
      <SolarSystem sectionProgress={techProgress} />
    </>
  );
}

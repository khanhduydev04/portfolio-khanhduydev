import Starfield from "./Starfield";
import Astronaut from "./Astronaut";
import SolarSystem from "./SolarSystem";

export default function SceneManager({ scrollData, mouse, darkMode }) {
  const { activeSection } = scrollData;

  const heroVisible = activeSection === "hero";
  const techVisible = activeSection === "technologies";

  return (
    <>
      <ambientLight intensity={darkMode ? 0.5 : 0.8} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={darkMode ? 1.5 : 2} color="#ffffff" />

      <Starfield mouse={mouse} darkMode={darkMode} />
      <Astronaut mouse={mouse} visible={heroVisible} />
      <SolarSystem visible={techVisible} />
    </>
  );
}

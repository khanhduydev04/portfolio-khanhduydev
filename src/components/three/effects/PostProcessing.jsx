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

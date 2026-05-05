import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/astronaut.glb");

export default function Astronaut({ mouse, scrollProgress = 0 }) {
  const groupRef = useRef();
  const { scene } = useGLTF("/astronaut.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.transparent = true;
        }
      }
    });
  }, [clonedScene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Floating bobbing
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.2 + 0.5;

    // Slow Y rotation
    groupRef.current.rotation.y = t * 0.1;

    // Mouse parallax tilt
    if (mouse?.current) {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        mouse.current.x * 0.1,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y * 0.1,
        0.05
      );
    }

    // Scroll fade: scale down and fade out as user scrolls past hero
    const heroFade = Math.max(0, 1 - scrollProgress * 3);
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, heroFade * 2, 0.1));

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = heroFade;
      }
    });
  });

  return (
    <group ref={groupRef} position={[2.5, 0.5, -1]}>
      <primitive object={clonedScene} />
    </group>
  );
}

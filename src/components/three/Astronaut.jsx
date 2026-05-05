import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/astronaut.glb");

export default function Astronaut({ mouse, visible = true }) {
  const groupRef = useRef();
  const { scene } = useGLTF("/astronaut.glb");
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.transparent = true;
      }
    });
    return clone;
  }, [scene]);

  const targetOpacity = useRef(1);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    const targetScale = visible ? 1.8 : 0;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05)
    );

    targetOpacity.current = visible ? 1 : 0;
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = THREE.MathUtils.lerp(
          child.material.opacity,
          targetOpacity.current,
          0.05
        );
      }
    });

    groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    groupRef.current.rotation.y = t * 0.15;

    if (mouse?.current) {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        mouse.current.x * 0.15,
        0.03
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y * 0.1,
        0.03
      );
    }
  });

  return (
    <group ref={groupRef} position={[3, 0, 0]}>
      <primitive object={clonedScene} />
      <pointLight position={[2, 2, 2]} intensity={2} color="#06b6d4" distance={10} />
      <pointLight position={[-2, -1, 3]} intensity={1.5} color="#8b5cf6" distance={8} />
    </group>
  );
}

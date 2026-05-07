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

    const targetScale = visible ? 2.2 : 0;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.04)
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

    groupRef.current.position.y = Math.sin(t * 0.4) * 0.4;
    groupRef.current.rotation.y = t * 0.1;

    if (mouse?.current) {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        mouse.current.x * 0.1,
        0.02
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y * 0.08,
        0.02
      );
    }
  });

  return (
    <group ref={groupRef} position={[3.5, 0.3, 0]}>
      <primitive object={clonedScene} />
      <pointLight position={[2, 3, 2]} intensity={3} color="#06b6d4" distance={12} />
      <pointLight position={[-2, -1, 3]} intensity={2} color="#8b5cf6" distance={10} />
      <pointLight position={[0, -2, -2]} intensity={1.5} color="#f59e0b" distance={8} />
      <spotLight
        position={[-3, 2, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={2}
        color="#06b6d4"
        distance={15}
      />
    </group>
  );
}

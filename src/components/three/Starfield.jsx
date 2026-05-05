import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Starfield({ mouse, darkMode = true }) {
  const pointsRef = useRef();
  const count = window.innerWidth < 768 ? 800 : 2000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.005;
    pointsRef.current.rotation.x = t * 0.002;

    if (mouse?.current) {
      pointsRef.current.position.x = THREE.MathUtils.lerp(
        pointsRef.current.position.x,
        mouse.current.x * 0.5,
        0.02
      );
      pointsRef.current.position.y = THREE.MathUtils.lerp(
        pointsRef.current.position.y,
        mouse.current.y * 0.5,
        0.02
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={darkMode ? "#ffffff" : "#94a3b8"}
        transparent
        opacity={darkMode ? 0.8 : 0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function Portal() {
  const ref = useRef();
  const ringRef = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      ref.current.scale.setScalar(scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  const color = darkMode ? "#06b6d4" : "#4f46e5";

  return (
    <group position={[0, 0, -98]}>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.05, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <mesh rotation-x={Math.PI / 3}>
        <torusGeometry args={[2.5, 0.03, 8, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} />
      </mesh>
      <pointLight color={color} intensity={8} distance={20} />
      <pointLight color="#8b5cf6" intensity={3} distance={15} position={[0, 2, 0]} />
    </group>
  );
}

function ConvergingParticles() {
  const ref = useRef();
  const { darkMode } = useTheme();
  const count = 200;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 8 + Math.random() * 5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = -98 + r * Math.cos(phi);
      vel.push({ speed: Math.random() * 0.01 + 0.005 });
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const dx = 0 - arr[i * 3];
      const dy = 0 - arr[i * 3 + 1];
      const dz = -98 - arr[i * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > 0.5) {
        arr[i * 3] += (dx / dist) * velocities[i].speed;
        arr[i * 3 + 1] += (dy / dist) * velocities[i].speed;
        arr[i * 3 + 2] += (dz / dist) * velocities[i].speed;
      } else {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 8 + Math.random() * 5;
        arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i * 3 + 2] = -98 + r * Math.cos(phi);
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={darkMode ? "#06b6d4" : "#4f46e5"}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function ContactRoom() {
  return (
    <group>
      <Portal />
      <ConvergingParticles />
    </group>
  );
}

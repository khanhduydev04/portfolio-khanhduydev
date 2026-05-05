import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";
import { TECHNOLOGIES } from "../../../constants";

function OrbitRing({ items, radius, speed, color, yOffset = 0 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    return items.map((_, i) => {
      const angle = (i / items.length) * Math.PI * 2;
      return [Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius];
    });
  }, [items, radius, yOffset]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <group ref={ref}>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[radius, 0.02, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Core() {
  const ref = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color={darkMode ? "#06b6d4" : "#4f46e5"} transparent opacity={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color={darkMode ? "#06b6d4" : "#4f46e5"} transparent opacity={0.8} />
      </mesh>
      <pointLight color={darkMode ? "#06b6d4" : "#4f46e5"} intensity={5} distance={20} />
    </group>
  );
}

function EnergyLines() {
  const ref = useRef();
  const { darkMode } = useTheme();
  const lineCount = 12;

  const positions = useMemo(() => {
    const lines = [];
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const r = 4 + Math.random() * 3;
      lines.push(0, 0, 0, Math.cos(angle) * r, (Math.random() - 0.5) * 2, Math.sin(angle) * r);
    }
    return new Float32Array(lines);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={darkMode ? "#06b6d4" : "#4f46e5"} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

function GridFloor() {
  const { darkMode } = useTheme();
  return (
    <gridHelper
      args={[30, 30, darkMode ? "#06b6d4" : "#4f46e5", darkMode ? "#1e293b" : "#e2e8f0"]}
      position={[0, -5, 0]}
      material-transparent
      material-opacity={0.15}
    />
  );
}

export default function TechRoom() {
  return (
    <group position={[0, 0, -47]}>
      <Core />
      <OrbitRing items={TECHNOLOGIES.frontend} radius={3.5} speed={0.3} color="#06b6d4" />
      <OrbitRing items={TECHNOLOGIES.backend} radius={5.5} speed={-0.2} color="#8b5cf6" yOffset={0.5} />
      <OrbitRing items={TECHNOLOGIES.tools} radius={7.5} speed={0.12} color="#f59e0b" yOffset={-0.5} />
      <EnergyLines />
      <GridFloor />
    </group>
  );
}

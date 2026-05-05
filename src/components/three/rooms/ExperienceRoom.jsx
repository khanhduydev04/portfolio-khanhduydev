import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function Pillar({ position, index }) {
  const ref = useRef();
  const { darkMode } = useTheme();
  const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#06b6d4"];
  const color = colors[index % colors.length];

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * 0.1 + index;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[0.8, 6, 0.8]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
      <pointLight position={[0, 3.5, 0]} color={color} intensity={2} distance={5} />
    </group>
  );
}

function TimelineLine() {
  const { darkMode } = useTheme();
  const positions = useMemo(() => {
    return new Float32Array([0, -2.5, -55, 0, -2.5, -75]);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={2} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={darkMode ? "#06b6d4" : "#4f46e5"} transparent opacity={0.5} />
    </lineSegments>
  );
}

function CeilingFragments() {
  const ref = useRef();
  const { darkMode } = useTheme();

  const fragments = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 12, 4 + Math.random() * 3, -60 + (Math.random() - 0.5) * 20],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      child.rotation.x += fragments[i].speed * 0.003;
      child.rotation.z += fragments[i].speed * 0.002;
    });
  });

  return (
    <group ref={ref}>
      {fragments.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot} scale={f.scale}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={darkMode ? "#1e293b" : "#cbd5e1"} wireframe transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function ExperienceRoom() {
  const pillars = useMemo(() => {
    return [
      { position: [-4, 0, -62], index: 0 },
      { position: [4, 0, -65], index: 1 },
      { position: [-4, 0, -68], index: 2 },
      { position: [4, 0, -71], index: 3 },
    ];
  }, []);

  return (
    <group>
      {pillars.map((p, i) => (
        <Pillar key={i} position={p.position} index={p.index} />
      ))}
      <TimelineLine />
      <CeilingFragments />
    </group>
  );
}

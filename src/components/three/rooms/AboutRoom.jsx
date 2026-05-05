import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function Helix() {
  const ref = useRef();
  const { darkMode } = useTheme();

  const { positions, linePositions } = useMemo(() => {
    const pts = [];
    const lines = [];
    const turns = 4;
    const pointsPerTurn = 20;
    const total = turns * pointsPerTurn;
    const radius = 2;
    const height = 12;

    for (let i = 0; i < total; i++) {
      const t = i / total;
      const angle = t * turns * Math.PI * 2;
      const y = (t - 0.5) * height;
      pts.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      pts.push(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
      if (i % 4 === 0) {
        lines.push(
          Math.cos(angle) * radius, y, Math.sin(angle) * radius,
          Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius
        );
      }
    }
    return {
      positions: new Float32Array(pts),
      linePositions: new Float32Array(lines),
    };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const color = darkMode ? "#06b6d4" : "#4f46e5";

  return (
    <group ref={ref} position={[0, 0, -27]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.12} color={color} transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={linePositions} count={linePositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function DataNodes() {
  const ref = useRef();
  const { darkMode } = useTheme();

  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, -27 + (Math.random() - 0.5) * 8],
        speed: Math.random() * 0.3 + 0.1,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      child.position.y += Math.sin(state.clock.elapsedTime * nodes[i].speed + i) * 0.005;
      child.position.x += Math.cos(state.clock.elapsedTime * nodes[i].speed * 0.5 + i) * 0.003;
    });
  });

  return (
    <group ref={ref}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={darkMode ? "#8b5cf6" : "#7c3aed"} />
        </mesh>
      ))}
    </group>
  );
}

export default function AboutRoom() {
  return (
    <group>
      <Helix />
      <DataNodes />
    </group>
  );
}

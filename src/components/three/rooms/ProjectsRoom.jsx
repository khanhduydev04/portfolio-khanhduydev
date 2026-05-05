import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function ProjectPlane({ position, index }) {
  const ref = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + index * 0.7) * 0.003;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2 + index) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <planeGeometry args={[2.5, 1.5]} />
        <meshBasicMaterial
          color={darkMode ? "#1e293b" : "#f1f5f9"}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([-1.25, -0.75, 0, 1.25, -0.75, 0, 1.25, 0.75, 0, -1.25, 0.75, 0])}
            count={4}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={darkMode ? "#06b6d4" : "#4f46e5"} transparent opacity={0.6} />
      </lineLoop>
    </group>
  );
}

function ParticleStreams() {
  const ref = useRef();
  const { darkMode } = useTheme();
  const count = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = -85 + (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.005;
      arr[i * 3] += Math.cos(state.clock.elapsedTime * 0.5 + i * 0.2) * 0.003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={darkMode ? "#06b6d4" : "#4f46e5"}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function ProjectsRoom() {
  const planes = useMemo(() => [
    { position: [-3, 1, -82] },
    { position: [3, -0.5, -83] },
    { position: [-2, -1.5, -85] },
    { position: [2.5, 1.5, -86] },
    { position: [-3.5, 0, -87] },
    { position: [1, -1, -88] },
    { position: [-1, 2, -89] },
    { position: [3, 0.5, -90] },
  ], []);

  return (
    <group>
      {planes.map((p, i) => (
        <ProjectPlane key={i} position={p.position} index={i} />
      ))}
      <ParticleStreams />
    </group>
  );
}

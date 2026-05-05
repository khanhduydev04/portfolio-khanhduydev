import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../../contexts/themeContext";

function Particles({ count = 400 }) {
  const ref = useRef();
  const { darkMode } = useTheme();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += (0 - arr[i * 3]) * 0.0003;
      arr[i * 3 + 1] += (0 - arr[i * 3 + 1]) * 0.0003;
      arr[i * 3] += Math.sin(time + i) * 0.002;
      arr[i * 3 + 1] += Math.cos(time + i * 0.5) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={darkMode ? "#06b6d4" : "#4f46e5"}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Icosahedron() {
  const ref = useRef();
  const { darkMode } = useTheme();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <group position={[0, 0, -5]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[3, 1]} />
        <meshBasicMaterial
          color={darkMode ? "#06b6d4" : "#4f46e5"}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color={darkMode ? "#06b6d4" : "#4f46e5"}
          transparent
          opacity={0.1}
        />
      </mesh>
      <pointLight color={darkMode ? "#06b6d4" : "#4f46e5"} intensity={3} distance={15} />
    </group>
  );
}

function FloatingFragments() {
  const ref = useRef();
  const { darkMode } = useTheme();

  const fragments = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push({
        position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10 - 5],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      child.rotation.x += fragments[i].speed * 0.005;
      child.rotation.z += fragments[i].speed * 0.003;
      child.position.y += Math.sin(state.clock.elapsedTime * fragments[i].speed + i) * 0.003;
    });
  });

  return (
    <group ref={ref}>
      {fragments.map((frag, i) => (
        <mesh key={i} position={frag.position} rotation={frag.rotation} scale={frag.scale}>
          {i % 3 === 0 ? (
            <tetrahedronGeometry args={[1, 0]} />
          ) : i % 3 === 1 ? (
            <octahedronGeometry args={[0.8, 0]} />
          ) : (
            <boxGeometry args={[0.6, 0.6, 0.6]} />
          )}
          <meshBasicMaterial
            color={darkMode ? "#8b5cf6" : "#7c3aed"}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroRoom() {
  return (
    <group position={[0, 0, 0]}>
      <Particles />
      <Icosahedron />
      <FloatingFragments />
    </group>
  );
}

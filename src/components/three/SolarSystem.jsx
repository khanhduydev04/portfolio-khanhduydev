import { useRef, useState, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { TECHNOLOGIES } from "../../constants";

function Sun() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial emissive="#f59e0b" emissiveIntensity={2} color="#f59e0b" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.1} />
      </mesh>
      <pointLight color="#f59e0b" intensity={3} distance={20} />
    </group>
  );
}

function Planet({ tech, angle, radius, speed }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(angle);

  const texture = useLoader(THREE.TextureLoader, tech.icon);

  useFrame((_, delta) => {
    if (!hovered) {
      angleRef.current += delta * speed;
    }
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angleRef.current) * radius;
      meshRef.current.position.z = Math.sin(angleRef.current) * radius;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial map={texture} emissive="#ffffff" emissiveIntensity={0.1} />
      </mesh>
      {hovered && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="px-2 py-1 bg-neutral-900/80 text-white text-xs rounded whitespace-nowrap backdrop-blur-sm">
            {tech.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function OrbitRing({ radius, color }) {
  return (
    <mesh rotation-x={Math.PI / 2}>
      <torusGeometry args={[radius, 0.01, 8, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  );
}

export default function SolarSystem({ visible, scrollProgress = 0 }) {
  const groupRef = useRef();

  const allPlanets = useMemo(() => {
    const planets = [];
    const addGroup = (items, radius, speed, color) => {
      items.forEach((tech, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        planets.push({ tech, angle, radius, speed, color });
      });
    };
    addGroup(TECHNOLOGIES.frontend, 3.5, 0.3, "#06b6d4");
    addGroup(TECHNOLOGIES.backend, 5.5, 0.2, "#8b5cf6");
    addGroup(TECHNOLOGIES.tools, 7.5, 0.12, "#f59e0b");
    return planets;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = visible;
    const targetScale = visible ? 1 : 0.5;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.3, 0.02);
  });

  return (
    <group ref={groupRef} position={[0, -15, -5]}>
      <Sun />
      <OrbitRing radius={3.5} color="#06b6d4" />
      <OrbitRing radius={5.5} color="#8b5cf6" />
      <OrbitRing radius={7.5} color="#f59e0b" />
      {allPlanets.map((p, i) => (
        <Planet key={i} tech={p.tech} angle={p.angle} radius={p.radius} speed={p.speed} />
      ))}
    </group>
  );
}

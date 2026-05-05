import { useRef, useState, useMemo, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Html, Billboard } from "@react-three/drei";
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
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial emissive="#f59e0b" emissiveIntensity={3} color="#f59e0b" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.08} />
      </mesh>
      <pointLight color="#f59e0b" intensity={4} distance={25} />
    </group>
  );
}

function Planet({ tech, angle, radius, speed }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(angle);

  let texture = null;
  try {
    texture = useLoader(THREE.TextureLoader, tech.icon);
  } catch {
    texture = null;
  }

  useFrame((_, delta) => {
    if (!hovered) {
      angleRef.current += delta * speed;
    }
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * radius;
      groupRef.current.position.z = Math.sin(angleRef.current) * radius;
    }
  });

  return (
    <group ref={groupRef}>
      <Billboard>
        <mesh
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.4 : 1}
        >
          <planeGeometry args={[0.6, 0.6]} />
          {texture ? (
            <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
          ) : (
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} />
          )}
        </mesh>
        <mesh position={[0, 0, -0.01]} scale={hovered ? 1.6 : 1.2}>
          <circleGeometry args={[0.35, 32]} />
          <meshBasicMaterial color={hovered ? "#06b6d4" : "#ffffff"} transparent opacity={hovered ? 0.15 : 0.05} />
        </mesh>
      </Billboard>
      {hovered && (
        <Html center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="px-3 py-1.5 bg-neutral-900/90 text-white text-xs rounded-lg whitespace-nowrap backdrop-blur-sm border border-white/10 font-medium">
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
      <torusGeometry args={[radius, 0.015, 8, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
}

function SolarSystemContent({ visible }) {
  const groupRef = useRef();

  const allPlanets = useMemo(() => {
    const planets = [];
    const addGroup = (items, radius, speed) => {
      items.forEach((tech, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        planets.push({ tech, angle, radius, speed });
      });
    };
    addGroup(TECHNOLOGIES.frontend, 3, 0.3);
    addGroup(TECHNOLOGIES.backend, 5, 0.2);
    addGroup(TECHNOLOGIES.tools, 7, 0.12);
    return planets;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = visible;
    const targetScale = visible ? 1 : 0.3;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      0.4,
      0.02
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <Sun />
      <OrbitRing radius={3} color="#06b6d4" />
      <OrbitRing radius={5} color="#8b5cf6" />
      <OrbitRing radius={7} color="#f59e0b" />
      {allPlanets.map((p, i) => (
        <Planet key={i} tech={p.tech} angle={p.angle} radius={p.radius} speed={p.speed} />
      ))}
    </group>
  );
}

export default function SolarSystem({ visible }) {
  return (
    <Suspense fallback={null}>
      <SolarSystemContent visible={visible} />
    </Suspense>
  );
}

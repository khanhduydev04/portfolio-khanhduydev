import { useRef, useState, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Billboard, useTexture } from "@react-three/drei";
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
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial emissive="#f59e0b" emissiveIntensity={3} color="#f59e0b" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.08} />
      </mesh>
      <pointLight color="#f59e0b" intensity={5} distance={40} />
    </group>
  );
}

function Planet({ tech, angle, radius, speed }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(angle);
  const texture = useTexture(tech.icon);

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
        {tech.dark && (
          <mesh position={[0, 0, -0.02]} scale={hovered ? 1.8 : 1}>
            <circleGeometry args={[0.5, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
          </mesh>
        )}
        <mesh
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.8 : 1}
        >
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial map={texture} transparent alphaTest={0.1} side={THREE.DoubleSide} />
        </mesh>
        {hovered && (
          <mesh position={[0, 0, -0.01]} scale={1.3}>
            <circleGeometry args={[0.7, 32]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
          </mesh>
        )}
      </Billboard>
      {hovered && (
        <Html center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="px-3 py-1.5 bg-neutral-900/90 text-white text-xs rounded-lg whitespace-nowrap backdrop-blur-sm border border-white/10 font-medium shadow-lg">
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
      <torusGeometry args={[radius, 0.02, 8, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  );
}

function SolarSystemContent({ sectionProgress }) {
  const groupRef = useRef();
  const scaleRef = useRef(0);

  const allPlanets = useMemo(() => {
    const planets = [];
    const addGroup = (items, radius, speed) => {
      items.forEach((tech, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        planets.push({ tech, angle, radius, speed });
      });
    };
    addGroup(TECHNOLOGIES.frontend, 4, 0.3);
    addGroup(TECHNOLOGIES.backend, 7, 0.2);
    addGroup(TECHNOLOGIES.tools, 10, 0.12);
    return planets;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    const zoomCurve = Math.sin(sectionProgress * Math.PI);
    const targetScale = zoomCurve * 1.1;

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.06);
    groupRef.current.scale.setScalar(scaleRef.current);
    groupRef.current.visible = scaleRef.current > 0.01;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      0.4,
      0.02
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <Sun />
      <OrbitRing radius={4} color="#06b6d4" />
      <OrbitRing radius={7} color="#8b5cf6" />
      <OrbitRing radius={10} color="#f59e0b" />
      {allPlanets.map((p, i) => (
        <Suspense key={i} fallback={null}>
          <Planet tech={p.tech} angle={p.angle} radius={p.radius} speed={p.speed} />
        </Suspense>
      ))}
    </group>
  );
}

export default function SolarSystem({ sectionProgress = 0 }) {
  return (
    <Suspense fallback={null}>
      <SolarSystemContent sectionProgress={sectionProgress} />
    </Suspense>
  );
}

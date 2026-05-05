import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { TECHNOLOGIES } from "../../constants";

function OrbitRing({ items, radius, speed, color }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(null);

  useFrame((_, delta) => {
    if (hovered === null && groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {items.map((item, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const isHovered = hovered === i;

        return (
          <group key={item.name} position={[x, 0, z]}>
            <Billboard>
              <mesh
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHovered(i);
                }}
                onPointerOut={() => setHovered(null)}
              >
                <planeGeometry args={[1.2, 0.6]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>
              <Text
                fontSize={isHovered ? 0.35 : 0.25}
                color={isHovered ? "#06b6d4" : "#94a3b8"}
                anchorX="center"
                anchorY="middle"
                font={undefined}
              >
                {item.name}
              </Text>
              {isHovered && (
                <mesh position={[0, 0, -0.1]}>
                  <planeGeometry args={[1.4, 0.5]} />
                  <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
                </mesh>
              )}
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

function Core() {
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
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
      </mesh>
      <pointLight color="#06b6d4" intensity={2} distance={10} />
    </group>
  );
}

function Scene() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.3,
        delta * 0.5
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Core />
      <OrbitRing items={TECHNOLOGIES.frontend} radius={3.5} speed={0.3} color="#06b6d4" />
      <OrbitRing items={TECHNOLOGIES.backend} radius={5.5} speed={0.2} color="#8b5cf6" />
      <OrbitRing items={TECHNOLOGIES.tools} radius={7.5} speed={0.12} color="#f59e0b" />
    </group>
  );
}

export default function TechOrbit() {
  return (
    <div className="w-full h-[450px] lg:h-[550px]">
      <Canvas
        camera={{ position: [0, 5, 14], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <Scene />
      </Canvas>
    </div>
  );
}

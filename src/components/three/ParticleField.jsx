import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../contexts/themeContext";

function Particles({ mouse }) {
  const meshRef = useRef();
  const linesRef = useRef();
  const { darkMode } = useTheme();
  const count = 150;
  const connectionDistance = 2.5;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.004,
      });
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      const dx = pos[i * 3] - mouse.current.x * 10;
      const dy = pos[i * 3 + 1] - mouse.current.y * 10;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        pos[i * 3] += dx * 0.008;
        pos[i * 3 + 1] += dy * 0.008;
      }

      if (Math.abs(pos[i * 3]) > 10) velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 10) velocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 5) velocities[i].z *= -1;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;

    const linePositions = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < connectionDistance) {
          linePositions.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }

    if (linesRef.current) {
      linesRef.current.geometry.dispose();
      const geom = new THREE.BufferGeometry();
      geom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      linesRef.current.geometry = geom;
    }
  });

  const particleColor = darkMode ? "#06b6d4" : "#4f46e5";
  const lineColor = darkMode ? "#06b6d4" : "#4f46e5";

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.08} color={particleColor} transparent opacity={0.8} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={lineColor} transparent opacity={0.12} />
      </lineSegments>
    </>
  );
}

export default function ParticleField() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <Particles mouse={mouse} />
      </Canvas>
    </div>
  );
}

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CameraController() {
  const { camera } = useThree();
  const progress = useRef({ value: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const targetZ = -100;

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        progress.current.value = self.progress;
      },
    });

    const handleMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse);

    return () => {
      trigger.kill();
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  useFrame(() => {
    const z = progress.current.value * targetZ;
    camera.position.z = z + 8;
    camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, z - 5);
  });

  return null;
}

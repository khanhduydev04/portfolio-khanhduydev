import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const HolographicMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#06b6d4"),
    uColor2: new THREE.Color("#8b5cf6"),
    uColor3: new THREE.Color("#f59e0b"),
    uAlpha: 0.8,
  },
  `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uAlpha;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    float n = noise(vPosition.xy * 3.0 + uTime * 0.5);
    float n2 = noise(vPosition.yz * 2.0 - uTime * 0.3);
    float blend = n * 0.5 + n2 * 0.5;

    vec3 color = mix(uColor1, uColor2, blend);
    color = mix(color, uColor3, pow(n2, 2.0));

    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    color += fresnel * uColor1 * 0.5;

    float scanline = sin(vPosition.y * 40.0 + uTime * 2.0) * 0.05 + 0.95;
    color *= scanline;

    gl_FragColor = vec4(color, uAlpha);
  }
  `
);

export default HolographicMaterial;

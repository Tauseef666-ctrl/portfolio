import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { heroOrbLabels } from "../../data/profile";

const SATELLITES = [
  { radius: 2.3, speed: 0.3, size: 0.12, color: "#22d3ee", incline: 0.4, offset: 0 },
  { radius: 2.6, speed: -0.22, size: 0.1, color: "#8b5cf6", incline: -0.5, offset: 1.1 },
  { radius: 2.9, speed: 0.18, size: 0.14, color: "#e879f9", incline: 0.8, offset: 2.2 },
  { radius: 2.15, speed: -0.34, size: 0.09, color: "#38bdf8", incline: -0.2, offset: 3.3 },
  { radius: 3.0, speed: 0.25, size: 0.11, color: "#a78bfa", incline: 1.2, offset: 4.4 },
  { radius: 2.45, speed: -0.16, size: 0.08, color: "#f0abfc", incline: 0.1, offset: 5.5 },
  { radius: 2.75, speed: 0.29, size: 0.13, color: "#22d3ee", incline: -0.9, offset: 6.6 },
];

const VERT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(uColor, intensity * uIntensity);
  }
`;

function FresnelShell({ color, radius, intensity }: { color: string; radius: number; intensity: number }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [color, intensity]
  );

  return (
    <mesh material={material} scale={radius}>
      <sphereGeometry args={[1, 40, 40]} />
    </mesh>
  );
}

function Halo() {
  const positions = useMemo(() => {
    const count = 220;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.9 + Math.random() * 1.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        size={0.03}
        color="#67e8f9"
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function OrbScene({ showLabels }: { showLabels: boolean }) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const satelliteRefs = useRef<(THREE.Mesh | null)[]>([]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const t = (performance.now() / 1000) * 0.6;
    const g = group.current;
    if (g) {
      g.rotation.y = pointer.current.x * 0.45 + Math.sin(t * 0.3) * 0.12;
      g.rotation.x = -pointer.current.y * 0.32 + Math.cos(t * 0.2) * 0.06;
      g.rotation.z = Math.sin(t * 0.16) * 0.03;
    }

    SATELLITES.forEach((s, i) => {
      const mesh = satelliteRefs.current[i];
      if (!mesh) return;
      const angle = t * s.speed * 0.7 + s.offset;
      mesh.position.set(
        Math.cos(angle) * s.radius * Math.cos(s.incline),
        Math.sin(angle) * s.radius,
        Math.cos(angle) * s.radius * Math.sin(s.incline)
      );
    });

    if (light.current) {
      light.current.position.set(pointer.current.x * 3.5, 2 - pointer.current.y * 2.5, 4);
      light.current.intensity = 55 + pointer.current.x * 18;
    }
  });

  return (
    <group>
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={1.1}>
        <group ref={group}>
          <FresnelShell color="#22d3ee" radius={1.55} intensity={1.15} />
          <FresnelShell color="#8b5cf6" radius={1.85} intensity={0.55} />

          <mesh>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color="#0a0f26" wireframe transparent opacity={0.55} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.92, 48, 48]} />
            <meshBasicMaterial color="#0d1330" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.62, 48, 48]} />
            <meshBasicMaterial color="#123c4f" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>

          <Halo />

          <mesh rotation={[Math.PI / 2.4, 0, 0.4]}>
            <torusGeometry args={[1.85, 0.012, 12, 100]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
          </mesh>
          <mesh rotation={[Math.PI / 1.7, 0.6, -0.3]}>
            <torusGeometry args={[2.1, 0.008, 12, 100]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
          </mesh>

          {SATELLITES.map((s, i) => (
            <mesh
              key={s.offset}
              ref={(el) => {
                satelliteRefs.current[i] = el;
              }}
            >
              <sphereGeometry args={[s.size, 20, 20]} />
              <meshBasicMaterial color={s.color} />
              {showLabels && (
                <Html center style={{ pointerEvents: "none" }}>
                  <div
                    style={{
                      transform: "translateY(-46px)",
                      fontFamily: "var(--font-display)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      color: "rgba(226, 238, 255, 0.75)",
                      background: "rgba(10, 13, 31, 0.55)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 999,
                      padding: "5px 12px",
                      backdropFilter: "blur(6px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {heroOrbLabels[i]}
                  </div>
                </Html>
              )}
            </mesh>
          ))}
        </group>
      </Float>

      <ambientLight intensity={0.5} />
      <pointLight ref={light} color="#22d3ee" position={[2, 2, 4]} intensity={55} distance={20} />
      <pointLight color="#8b5cf6" position={[-3, -2, 3]} intensity={38} distance={20} />
      <directionalLight color="#ffffff" position={[0, 4, 6]} intensity={0.6} />
    </group>
  );
}

export default function HeroOrb({ showLabels }: { showLabels: boolean }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <OrbScene showLabels={showLabels} />
      </Suspense>
    </Canvas>
  );
}

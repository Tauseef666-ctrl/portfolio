import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useIsTouch } from "../../hooks/useIsTouch";

function ParticleCloud({ count = 120 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 2;
    }
    return arr;
  }, [count]);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        size={0.035}
        color="#fbbf24"
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.45}
      />
    </Points>
  );
}

function SubtleOrb() {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const t = (performance.now() / 1000) * 0.4;
    const g = group.current;
    if (g) {
      g.rotation.y = pointer.current.x * 0.3 + Math.sin(t * 0.25) * 0.08;
      g.rotation.x = -pointer.current.y * 0.2 + Math.cos(t * 0.2) * 0.05;
      g.position.x = pointer.current.x * 0.4;
      g.position.y = -pointer.current.y * 0.3;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={group} position={[3.2, 0.8, -3.5]}>
        {/* Core sphere */}
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial color="#090d20" />
        </mesh>

        {/* Wireframe shell */}
        <mesh>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial color="#d97706" wireframe transparent opacity={0.25} />
        </mesh>

        {/* Outer glowing halo ring */}
        <mesh rotation={[Math.PI / 2.6, 0.3, 0]}>
          <torusGeometry args={[2.0, 0.015, 12, 80]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.35} />
        </mesh>

        <mesh rotation={[Math.PI / 1.6, -0.4, 0.5]}>
          <torusGeometry args={[2.3, 0.01, 12, 80]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

export function SpatialBackdrop() {
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();

  if (reduced) return null;

  return (
    <div
      className="spatial-canvas-container"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.85,
      }}
      aria-hidden="true"
    >
      <Canvas
        dpr={isTouch ? 1 : 1.25}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 5, 2]} intensity={0.8} color="#f59e0b" />
          <directionalLight position={[-4, -3, 2]} intensity={0.4} color="#22d3ee" />
          <ParticleCloud count={isTouch ? 60 : 140} />
          <SubtleOrb />
        </Suspense>
      </Canvas>
    </div>
  );
}
export default SpatialBackdrop;

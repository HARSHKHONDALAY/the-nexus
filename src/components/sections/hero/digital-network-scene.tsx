"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import {
  type MotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import * as THREE from "three";

interface DigitalNetworkSceneProps {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

interface NetworkFieldProps extends DigitalNetworkSceneProps {
  reducedMotion: boolean;
  isCoarsePointer: boolean;
}

function createGrid(size: number, spacing: number) {
  const positions = new Float32Array(size * size * 3);
  const base = new Float32Array(size * size * 3);
  const linePositions = new Float32Array((size * (size - 1) * 2 + size * (size - 1) * 2) * 3);
  const linePairs: Array<[number, number]> = [];
  const half = (size - 1) / 2;

  for (let z = 0; z < size; z += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = z * size + x;
      const i3 = index * 3;
      const px = (x - half) * spacing;
      const pz = (z - half) * spacing;
      base[i3] = px;
      base[i3 + 1] = 0;
      base[i3 + 2] = pz;
      positions[i3] = px;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = pz;

      if (x < size - 1) linePairs.push([index, index + 1]);
      if (z < size - 1) linePairs.push([index, index + size]);
    }
  }

  return { positions, base, linePositions, linePairs };
}

function NetworkField({
  pointerX,
  pointerY,
  reducedMotion,
  isCoarsePointer,
}: NetworkFieldProps) {
  const pointsGeometryRef = useRef<THREE.BufferGeometry>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const gridSize = isCoarsePointer ? 34 : 42;
  const spacing = isCoarsePointer ? 0.26 : 0.22;
  const springX = useSpring(useTransform(pointerX, (value) => value), { stiffness: 68, damping: 24 });
  const springY = useSpring(useTransform(pointerY, (value) => value), { stiffness: 68, damping: 24 });

  const network = useMemo(() => createGrid(gridSize, spacing), [gridSize, spacing]);
  const networkRef = useRef(network);

  useEffect(() => {
    networkRef.current = network;
  }, [network]);

  useFrame(({ clock }) => {
    const pointsGeometry = pointsGeometryRef.current;
    const linesGeometry = linesGeometryRef.current;
    const group = groupRef.current;
    if (!pointsGeometry || !linesGeometry || !group) return;

    const time = clock.elapsedTime;
    const px = springX.get();
    const py = springY.get();
    const liveNetwork = networkRef.current;
    const positions = liveNetwork.positions;
    const base = liveNetwork.base;

    for (let index = 0; index < gridSize * gridSize; index += 1) {
      const i3 = index * 3;
      const x = base[i3];
      const z = base[i3 + 2];
      const dist = Math.sqrt(x * x + z * z);
      const waveA = Math.sin(dist * 2.25 - time * 0.9);
      const waveB = Math.cos((x + px * 1.4) * 1.45 + time * 0.42) * Math.sin((z - py * 1.1) * 1.3);
      const pointerLift = Math.max(0, 1.2 - Math.hypot(x - px * 2.5, z + py * 1.8)) * 0.08;

      positions[i3] = x + Math.sin(time * 0.18 + z) * 0.025;
      positions[i3 + 1] = (reducedMotion ? 0 : waveA * 0.11 + waveB * 0.07) + pointerLift;
      positions[i3 + 2] = z + Math.cos(time * 0.16 + x) * 0.025;
    }

    let cursor = 0;
    for (const [a, b] of liveNetwork.linePairs) {
      const a3 = a * 3;
      const b3 = b * 3;
      liveNetwork.linePositions[cursor] = positions[a3];
      liveNetwork.linePositions[cursor + 1] = positions[a3 + 1];
      liveNetwork.linePositions[cursor + 2] = positions[a3 + 2];
      liveNetwork.linePositions[cursor + 3] = positions[b3];
      liveNetwork.linePositions[cursor + 4] = positions[b3 + 1];
      liveNetwork.linePositions[cursor + 5] = positions[b3 + 2];
      cursor += 6;
    }

    pointsGeometry.getAttribute("position").needsUpdate = true;
    linesGeometry.getAttribute("position").needsUpdate = true;

    const mobile = viewport.width < 5.2;
    const wide = viewport.aspect > 1.7;
    group.position.set(mobile ? 0 : wide ? 0.3 : 0.55, mobile ? 0.02 : -0.08, mobile ? -0.2 : 0);
    group.rotation.x = -1 + py * 0.08;
    group.rotation.z = px * -0.08;
    group.rotation.y = reducedMotion ? -0.08 : Math.sin(time * 0.12) * 0.06 - 0.08;
    group.scale.set(mobile ? 1.42 : wide ? 1.8 : 1.62, 1, mobile ? 1.42 : wide ? 1.8 : 1.62);
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry ref={linesGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[network.linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.24} blending={THREE.AdditiveBlending} />
      </lineSegments>

      <points>
        <bufferGeometry ref={pointsGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[network.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={isCoarsePointer ? 0.028 : 0.022}
          sizeAttenuation
          color="#e0f7ff"
          transparent
          opacity={0.88}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.6, 96]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.045} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function DigitalNetworkScene({ pointerX, pointerY }: DigitalNetworkSceneProps) {
  const isClient = typeof window !== "undefined";
  const prefersReducedMotion = useReducedMotion();
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  if (!isClient) {
    return (
      <div className="pointer-events-none absolute inset-[-8%] z-0 bg-gradient-to-br from-slate-900 to-slate-800" />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-[-8%] z-0">
      <Canvas
        dpr={[1, isCoarsePointer ? 1.2 : 1.65]}
        camera={{ position: [0, 1.1, 6.8], fov: 42 }}
        gl={{
          antialias: !isCoarsePointer,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <fog attach="fog" args={["#020817", 5.6, 11.8]} />
        <ambientLight intensity={0.48} />
        <pointLight position={[2.8, 2.2, 3.2]} intensity={1.16} color="#7dd3fc" />
        <pointLight position={[-2.8, -1, 2.8]} intensity={0.62} color="#818cf8" />
        <NetworkField
          pointerX={pointerX}
          pointerY={pointerY}
          reducedMotion={Boolean(prefersReducedMotion)}
          isCoarsePointer={isCoarsePointer}
        />
        <Preload all />
      </Canvas>
    </div>
  );
}

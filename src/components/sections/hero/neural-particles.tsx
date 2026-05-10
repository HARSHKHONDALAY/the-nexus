"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NeuralParticlesProps {
  count: number;
  reducedMotion: boolean;
}

function seeded(index: number) {
  const value = Math.sin(index * 928.371) * 43758.5453;
  return value - Math.floor(value);
}

export default function NeuralParticles({ count, reducedMotion }: NeuralParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const buffer = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const i3 = index * 3;
      const angle = seeded(index) * Math.PI * 2;
      const radius = 1.15 + seeded(index + 13) * 2.95;
      const height = (seeded(index + 27) - 0.5) * 2.25;
      const depth = (seeded(index + 41) - 0.5) * 1.7;

      buffer[i3] = Math.cos(angle) * radius * 0.72;
      buffer[i3 + 1] = height + Math.sin(angle * 2.0) * 0.18;
      buffer[i3 + 2] = Math.sin(angle) * radius * 0.42 + depth;
    }

    return buffer;
  }, [count]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points || reducedMotion) return;

    points.rotation.y = clock.elapsedTime * 0.035;
    points.rotation.z = Math.sin(clock.elapsedTime * 0.18) * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.021}
        sizeAttenuation
        color="#dff5ff"
        transparent
        opacity={0.44}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

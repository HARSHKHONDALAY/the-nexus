/* eslint-disable react-hooks/immutability */

"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { createBrainFieldBuffers } from "@/components/sections/hero/brain-shape";

interface NexusParticleFieldProps {
  count: number;
  interactive: boolean;
  reducedMotion: boolean;
}

export default function NexusParticleField({
  count,
  interactive,
  reducedMotion,
}: NexusParticleFieldProps) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const { pointer, viewport } = useThree();

  const buffers = useMemo(() => createBrainFieldBuffers(count), [count]);

  useFrame(({ clock }, delta) => {
    const geometry = geometryRef.current;
    if (!geometry) return;

    const dt = Math.min(delta, 0.03);
    const time = clock.elapsedTime;
    const pointerX = pointer.x * (viewport.width * 0.43);
    const pointerY = pointer.y * (viewport.height * 0.32);
    const repulsionRadius = interactive ? 1.25 : 0.0;
    const repulsionStrength = interactive ? 6.0 : 0.0;
    const settleStrength = reducedMotion ? 3.4 : 2.15;
    const damping = reducedMotion ? 0.86 : 0.9;
    const morphMix = reducedMotion ? 0 : (Math.sin(time * 0.16) + 1) * 0.5;

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const px = buffers.current[i3];
      const py = buffers.current[i3 + 1];
      const pz = buffers.current[i3 + 2];

      const txA = buffers.targetA[i3];
      const tyA = buffers.targetA[i3 + 1];
      const tzA = buffers.targetA[i3 + 2];
      const txB = buffers.targetB[i3];
      const tyB = buffers.targetB[i3 + 1];
      const tzB = buffers.targetB[i3 + 2];

      const bx = txA + (txB - txA) * morphMix;
      const by = tyA + (tyB - tyA) * morphMix;
      const bz = tzA + (tzB - tzA) * morphMix;

      const returnX = (bx - px) * settleStrength * dt;
      const returnY = (by - py) * settleStrength * dt;
      const returnZ = (bz - pz) * settleStrength * dt;

      buffers.velocity[i3] += returnX;
      buffers.velocity[i3 + 1] += returnY;
      buffers.velocity[i3 + 2] += returnZ;

      if (!reducedMotion) {
        const phase = buffers.noiseSeed[i];
        buffers.velocity[i3] += Math.sin(time * 0.37 + phase) * 0.0016;
        buffers.velocity[i3 + 1] += Math.cos(time * 0.33 + phase) * 0.0014;
        buffers.velocity[i3 + 2] += Math.sin(time * 0.28 + phase) * 0.001;
      }

      if (interactive) {
        const dx = px - pointerX;
        const dy = py - pointerY;
        const distSq = dx * dx + dy * dy;
        const radiusSq = repulsionRadius * repulsionRadius;

        if (distSq < radiusSq) {
          const dist = Math.max(0.001, Math.sqrt(distSq));
          const influence = ((repulsionRadius - dist) / repulsionRadius) * repulsionStrength * dt;
          buffers.velocity[i3] += (dx / dist) * influence;
          buffers.velocity[i3 + 1] += (dy / dist) * influence;
        }
      }

      buffers.velocity[i3] *= damping;
      buffers.velocity[i3 + 1] *= damping;
      buffers.velocity[i3 + 2] *= damping;

      buffers.current[i3] += buffers.velocity[i3];
      buffers.current[i3 + 1] += buffers.velocity[i3 + 1];
      buffers.current[i3 + 2] += buffers.velocity[i3 + 2];
    }

    const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    positionAttribute.needsUpdate = true;
  });

  return (
    <group position={[-0.38, 0.02, 0]}>
      <points>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[buffers.current, 3]}
            count={count}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.046}
          sizeAttenuation
          color="#e8f2ff"
          opacity={0.9}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[buffers.current, 3]}
            count={count}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.074}
          sizeAttenuation
          color="#b9cbff"
          opacity={0.12}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh position={[0, 0, -1.2]} scale={[1.55, 1.05, 0.95]}>
        <sphereGeometry args={[2.15, 32, 32]} />
        <meshBasicMaterial color="#8ea8ff" transparent opacity={0.055} />
      </mesh>
    </group>
  );
}

interface BrainFieldBuffers {
  targetA: Float32Array;
  targetB: Float32Array;
  current: Float32Array;
  velocity: Float32Array;
  noiseSeed: Float32Array;
}

function sampleBrainPoint() {
  let x = 0;
  let y = 0;
  let z = 0;

  for (let attempt = 0; attempt < 300; attempt += 1) {
    x = (Math.random() * 2 - 1) * 1.28;
    y = (Math.random() * 2 - 1) * 1.02;
    z = (Math.random() * 2 - 1) * 0.86;

    const lobeOffset = 0.44;
    const left =
      ((x + lobeOffset) ** 2) / (0.92 * 0.92) +
      (y * y) / (0.72 * 0.72) +
      (z * z) / (0.62 * 0.62);
    const right =
      ((x - lobeOffset) ** 2) / (0.92 * 0.92) +
      (y * y) / (0.72 * 0.72) +
      (z * z) / (0.62 * 0.62);

    const wrinkle = Math.sin((y + 0.75) * 10.2) * 0.055 + Math.cos(z * 11.5) * 0.03;
    const brainSurface = Math.min(left, right);
    const centralGap = Math.abs(x) < 0.12 && y > -0.32;
    const lowerTaper = y < -0.84;

    if (brainSurface < 1 + wrinkle && !centralGap && !lowerTaper) {
      break;
    }
  }

  return { x, y, z };
}

export function createBrainFieldBuffers(count: number): BrainFieldBuffers {
  const targetA = new Float32Array(count * 3);
  const targetB = new Float32Array(count * 3);
  const current = new Float32Array(count * 3);
  const velocity = new Float32Array(count * 3);
  const noiseSeed = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const point = sampleBrainPoint();
    const lateralCurve = Math.sin(point.y * 4.7) * 0.085;

    const ax = point.x * 1.72 + lateralCurve;
    const ay = point.y * 1.18;
    const az = point.z * 1.68;

    targetA[i3] = ax;
    targetA[i3 + 1] = ay;
    targetA[i3 + 2] = az;

    // Variant B softly shifts into a wider, breathing neural posture.
    targetB[i3] = ax * 1.08 + Math.sin(point.z * 5.4) * 0.05;
    targetB[i3 + 1] = ay * 0.9 + Math.cos(point.x * 3.3) * 0.055;
    targetB[i3 + 2] = az * 1.04;

    current[i3] = ax + (Math.random() - 0.5) * 0.12;
    current[i3 + 1] = ay + (Math.random() - 0.5) * 0.12;
    current[i3 + 2] = az + (Math.random() - 0.5) * 0.12;

    noiseSeed[i] = Math.random() * Math.PI * 2;
  }

  return { targetA, targetB, current, velocity, noiseSeed };
}

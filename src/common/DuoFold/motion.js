export const MAX_TILT = 45;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function remapOrientation(betaDelta, gammaDelta, screenAngle = 0) {
  const normalized = ((screenAngle % 360) + 360) % 360;
  if (normalized === 90) return { x: betaDelta, y: -gammaDelta };
  if (normalized === 180) return { x: -gammaDelta, y: -betaDelta };
  if (normalized === 270) return { x: -betaDelta, y: gammaDelta };
  return { x: gammaDelta, y: betaDelta };
}

export function clampTilt(value) {
  return clamp(value, -MAX_TILT, MAX_TILT);
}

export function pointerTilt(clientX, clientY, width, height) {
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);
  return {
    x: clampTilt(((clientX / safeWidth) * 2 - 1) * 24),
    y: clampTilt(((clientY / safeHeight) * 2 - 1) * -18)
  };
}

export function foldPresentation(x, y) {
  const amount = clamp(Math.hypot(x, y) / MAX_TILT, 0, 1);
  const direction = Math.atan2(-y, -x) * 180 / Math.PI + 90;
  return { amount, direction };
}

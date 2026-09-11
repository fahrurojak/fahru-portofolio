export const MAX_TILT = 45;
export const SENSOR_PREDICTION_SECONDS = 0.035;

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

export function shortestAngleDelta(current, reference) {
  return ((current - reference + 540) % 360) - 180;
}

export function predictTilt(measured, rotationRate, horizon = SENSOR_PREDICTION_SECONDS) {
  const safeRate = clamp(rotationRate, -360, 360);
  return clampTilt(measured + safeRate * horizon);
}

export function stabilizeTilt(value, deadZone = 1.2) {
  const clamped = clampTilt(value);
  const magnitude = Math.abs(clamped);
  if (magnitude <= deadZone) return 0;
  return Math.sign(clamped) * (magnitude - deadZone) * MAX_TILT / (MAX_TILT - deadZone);
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
  const soft = amount;
  const medium = clamp((amount - 0.08) / 0.92, 0, 1);
  const strong = clamp((amount - 0.22) / 0.78, 0, 1);
  return { amount, direction, soft, medium, strong };
}


export function renderingQuality({
  deviceMemory = 8,
  hardwareConcurrency = 8,
  saveData = false,
  coarsePointer = false
} = {}) {
  if (saveData || deviceMemory < 4 || hardwareConcurrency < 4) return 'lite';
  return coarsePointer ? 'balanced' : 'high';
}

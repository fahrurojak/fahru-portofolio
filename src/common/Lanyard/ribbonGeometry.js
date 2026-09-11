import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';

export function createRibbonGeometry(segments = 32) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array((segments + 1) * 6), 3));
  const uv = [];
  const indices = [];
  for (let i = 0; i <= segments; i++) {
    uv.push(i / segments, 0, i / segments, 1);
    if (i < segments) {
      const n = i * 2;
      indices.push(n, n + 1, n + 2, n + 2, n + 1, n + 3);
    }
  }
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  return geometry;
}

const right = new Vector3();
const up = new Vector3();
const view = new Vector3();
const tangent = new Vector3();
const side = new Vector3();
const vertex = new Vector3();

export function updateRibbonGeometry(geometry, points, cameraQuaternion, width) {
  const positions = geometry.getAttribute('position');
  right.set(1, 0, 0).applyQuaternion(cameraQuaternion);
  up.set(0, 1, 0).applyQuaternion(cameraQuaternion);
  view.set(0, 0, 1).applyQuaternion(cameraQuaternion);
  const last = points.length - 1;
  const top = points[last].dot(up);
  for (let i = 0; i <= last; i++) {
    // Real rectangular cross-sections at both ends, with no shader expansion.
    if (i < 2 || i > last - 2) side.copy(right);
    else {
      tangent.subVectors(points[i + 1], points[i - 1]);
      side.crossVectors(tangent, view).normalize();
      if (side.lengthSq() < 0.5) side.copy(right);
      if (side.dot(right) < 0) side.negate();
    }
    for (let edge = 0; edge < 2; edge++) {
      vertex.copy(points[i]).addScaledVector(side, (edge === 0 ? 1 : -1) * width / 2);
      if (i > last - 2) vertex.addScaledVector(up, -Math.max(0, vertex.dot(up) - top));
      positions.setXYZ(i * 2 + edge, vertex.x, vertex.y, vertex.z);
    }
  }
  positions.needsUpdate = true;
}

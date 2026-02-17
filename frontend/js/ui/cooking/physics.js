export function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function pointInCircle(px, py, cx, cy, radius) {
  const dx = px - cx;
  const dy = py - cy;
  return (dx * dx) + (dy * dy) <= radius * radius;
}

export function pointInEllipse(px, py, cx, cy, rx, ry) {
  if (rx <= 0 || ry <= 0) return false;
  const nx = (px - cx) / rx;
  const ny = (py - cy) / ry;
  return (nx * nx) + (ny * ny) <= 1;
}

export function isNullUndefined (val) {
  return val === null || val === undefined
}

export function clamp (n, min, max) {
  return Math.min(Math.max(n, min), max)
}

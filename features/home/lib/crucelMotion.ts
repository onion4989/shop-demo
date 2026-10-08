export function clampTilt(angle: number, max: number) {
  return Math.min(max, Math.max(-max, angle))
}

export function wrapScroll(pos: number, loop: number) {
  if (loop <= 0) return pos
  if (pos < loop * 0.5) return pos + loop
  if (pos > loop * 1.5) return pos - loop
  return pos
}

export function dragTilt(step: number, speed: number, gain: number) {
  return step * 0.7 * gain + speed * 0.006 * gain
}

export function glideTilt(vel: number, gain: number) {
  return -vel * 0.8 * gain
}

export function approachTilt(now: number, goal: number, rate: number) {
  const next = now + (goal - now) * rate
  if (Math.abs(goal - next) < 0.02) return goal
  return next
}

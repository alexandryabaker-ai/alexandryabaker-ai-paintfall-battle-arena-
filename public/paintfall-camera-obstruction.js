// Keep the whole near plane inside the convex arena, including its chamfered corners.
export function constrainThirdPersonCamera(pose, outline, colliders) {
  const radius = Math.max(.25, pose.near * Math.sqrt(1 +
    Math.tan(pose.fov / 2) ** 2 * (1 + pose.aspect ** 2)) + .12);
  const start = [pose.cx, pose.cy, pose.cz];
  const delta = [pose.ex - pose.cx, pose.ey - pose.cy, pose.ez - pose.cz];
  let fraction = 1;
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i], b = outline[(i + 1) % outline.length];
    const dx = b[0] - a[0], dz = b[1] - a[1], length = Math.hypot(dx, dz);
    const distance = (dx * (start[2] - a[1]) - dz * (start[0] - a[0])) / length;
    const change = (dx * delta[2] - dz * delta[0]) / length;
    if (change < 0) fraction = Math.min(fraction, Math.max(0, (distance - radius) / -change));
  }
  for (const collider of colliders) {
    if (collider.type !== 'box' && collider.type !== 'ramp') continue;
    const center = [collider.x, collider.y ?? collider.height / 2, collider.z];
    const half = [collider.width / 2 + radius, collider.height / 2 + radius, collider.depth / 2 + radius];
    let enter = 0, leave = fraction, intersects = true;
    for (let axis = 0; axis < 3; axis++) {
      const offset = start[axis] - center[axis];
      if (Math.abs(delta[axis]) < 1e-9) {
        if (Math.abs(offset) > half[axis]) intersects = false;
      } else {
        const a = (-half[axis] - offset) / delta[axis], b = (half[axis] - offset) / delta[axis];
        enter = Math.max(enter, Math.min(a, b));
        leave = Math.min(leave, Math.max(a, b));
      }
    }
    // Movement currently allows players inside cover. Let the camera leave that
    // volume rather than collapsing it onto an already obstructed target.
    const targetInside = start.every((value, axis) => Math.abs(value - center[axis]) <= half[axis]);
    if (!targetInside && intersects && enter <= leave) fraction = Math.min(fraction, Math.max(0, enter - .001));
  }
  return { ...pose, ex: start[0] + delta[0] * fraction,
    ey: start[1] + delta[1] * fraction, ez: start[2] + delta[2] * fraction };
}

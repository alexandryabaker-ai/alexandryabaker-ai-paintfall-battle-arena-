export function createOutdoorPlayers(THREE, scene, makeCharacter) {
  const actors = new Map(), projectiles = [];
  function remove(actor) {
    scene.remove(actor);
    const geometries = new Set(), materials = new Set();
    actor.traverse(part => {
      if (part.geometry) geometries.add(part.geometry);
      if (part.material) materials.add(part.material);
    });
    geometries.forEach(geometry => geometry.dispose());
    // Materials may be shared by the factory (legs and boots).
    materials.forEach(material => { if (!material.userData.shared) material.dispose(); });
  }
  function position(player) {
    return { x: (Math.max(0, Math.min(1200, Number(player.x) || 0)) - 600) / 40,
      z: (350 - Math.max(0, Math.min(700, Number(player.y) || 0))) / 25,
      y: .012 + Math.max(0, Number(player.z) || 0) / 40 };
  }
  function update(players, localId, mode, now) {
    const seen = new Set();
    for (const player of players) {
      if (!player.id || seen.has(player.id)) continue;
      seen.add(player.id);
      const character = player.character || 'Maya';
      let actor = actors.get(player.id);
      if (actor && actor.userData.character !== character) { remove(actor); actors.delete(player.id); actor = null; }
      if (!actor) {
        actor = makeCharacter(character); actor.name = character;
        actor.userData.playerId = player.id;
        scene.add(actor); actors.set(player.id, actor);
        actor.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(actor);
        actor.userData.height = actor.userData.standingHeight;
        actor.userData.renderHeight = bounds.max.y - bounds.min.y;
      }
      const next = position(player), previous = actor.userData.lastPosition;
      const dx = previous ? next.x - previous.x : 0, dz = previous ? next.z - previous.z : 0;
      if (Math.hypot(dx, dz) > .001) {
        actor.rotation.y = Math.atan2(-dx, -dz);
        actor.userData.movingUntil = now + 120;
      }
      actor.position.set(next.x, next.y, next.z);
      actor.userData.lastPosition = next;
      if (actor.userData.jumpStarted !== undefined && !player.z) {
        const progress = Math.min(1, (now - actor.userData.jumpStarted) / 650);
        actor.position.y += Math.sin(progress * Math.PI) * 2.2;
        if (progress >= 1) delete actor.userData.jumpStarted;
      }
      actor.visible = player.alive !== false && !(mode === 'first' && player.id === localId);
      const parts = actor.userData.parts, moving = now < (actor.userData.movingUntil || 0), t = now * .010;
      parts.body.position.y = actor.userData.baseBodyY + (moving ? Math.abs(Math.sin(t)) * .008 : (Math.sin(t * .5) + 1) * .002);
      parts.armL.rotation.x = moving ? Math.sin(t) * .24 : 0;
      parts.armR.rotation.x = -parts.armL.rotation.x;
      parts.armL.rotation.z = .06;
      parts.armR.rotation.z = -.06;
      parts.legL.rotation.x = moving ? -Math.sin(t) * .28 : 0;
      parts.legR.rotation.x = -parts.legL.rotation.x;
      parts.legL.userData.shin.rotation.x = moving ? Math.max(0, Math.sin(t)) * .35 : 0;
      parts.legR.userData.shin.rotation.x = moving ? Math.max(0, -Math.sin(t)) * .35 : 0;
      parts.blaster.rotation.y = moving ? Math.sin(t) * .06 : 0;
    }
    for (const [id, actor] of actors) if (!seen.has(id)) { remove(actor); actors.delete(id); }
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const projectile = projectiles[i], progress = (now - projectile.start) / 1000;
      if (progress >= 1) { remove(projectile.mesh); projectiles.splice(i, 1); }
      else projectile.mesh.position.copy(projectile.origin).addScaledVector(projectile.direction, progress * 18);
    }
  }
  function jump(id) { const actor = actors.get(id); if (actor) actor.userData.jumpStarted = performance.now(); }
  function fire(detail) {
    if (!detail?.shooter) return;
    const actor = actors.get(detail.shooter.id);
    if (!actor) return;
    actor.updateMatrixWorld(true);
    const origin = actor.userData.parts.blaster.getWorldPosition(new THREE.Vector3());
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(actor.quaternion);
    if (detail.target) { const target = position(detail.target); direction.set(target.x - origin.x, 0, target.z - origin.z).normalize(); }
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(.14, 10, 8), new THREE.MeshStandardMaterial({ color: 0x55e6ff, emissive: 0x1688ff }));
    mesh.position.copy(origin); scene.add(mesh);
    projectiles.push({ mesh, origin, direction, start: performance.now() });
  }
  return { actors, position, update, jump, fire };
}

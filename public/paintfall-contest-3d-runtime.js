(()=> {
  if (window.__pfContest3DRuntime) return;
  window.__pfContest3DRuntime = true;

  function boot() {
    const arena = document.getElementById('arena');
    if (arena) arena.style.display = 'none';
    const game = document.getElementById('game');
    if (!game) { setTimeout(boot, 100); return; }

    document.getElementById('paintfallContest3D')?.remove();
    const host = document.createElement('div');
    host.id = 'paintfallContest3D';
    host.style.cssText = 'position:relative;width:100%;height:clamp(420px,70vw,700px);min-height:420px;overflow:hidden;border-radius:18px;background:#91a88b;border:2px solid #29364b;box-shadow:0 18px 50px rgba(0,0,0,.45);touch-action:none';
    game.insertBefore(host, game.firstChild);

    const badge = document.createElement('div');
    badge.textContent = '🌲 PAINTFALL • OUTDOOR WORLD';
    badge.style.cssText = 'position:absolute;z-index:3;top:10px;left:12px;color:#fff;font:900 12px system-ui;text-shadow:0 2px 5px #000;pointer-events:none';
    host.appendChild(badge);
    const status = document.createElement('div');
    status.textContent = 'WORLD LOADING';
    status.style.cssText = 'position:absolute;z-index:3;top:10px;right:12px;color:#fff;background:rgba(15,70,55,.85);padding:6px 9px;border-radius:10px;font:900 11px system-ui;pointer-events:none';
    host.appendChild(status);
    const cameraButton = document.createElement('button');
    cameraButton.type = 'button';
    cameraButton.textContent = '🎥 THIRD PERSON';
    cameraButton.style.cssText = 'position:absolute;z-index:4;top:48px;right:12px;padding:9px 11px;border:2px solid #fff;border-radius:11px;background:rgba(18,24,39,.92);color:#fff;font:900 11px system-ui;cursor:pointer;box-shadow:0 4px 12px #000;touch-action:manipulation';
    host.appendChild(cameraButton);
    const cameraHint = document.createElement('div');
    cameraHint.textContent = 'Drag to orbit • C to change view';
    cameraHint.style.cssText = 'position:absolute;z-index:3;top:91px;right:12px;color:#fff;background:rgba(18,24,39,.72);padding:5px 8px;border-radius:9px;font:800 9px system-ui;pointer-events:none';
    host.appendChild(cameraHint);

    let cameraMode = 'third', camYaw = 0, camPitch = 0, dragging = false, lastX = 0, lastY = 0;
    function pointerDown(event) {
      if (event.target === cameraButton) return;
      dragging = true; lastX = event.clientX; lastY = event.clientY;
      host.setPointerCapture?.(event.pointerId);
    }
    function pointerMove(event) {
      if (!dragging) return;
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      lastX = event.clientX; lastY = event.clientY;
      camYaw -= dx * .008;
      const lowerPitch = cameraMode === 'third' ? -.08 : -.85;
      camPitch = Math.max(lowerPitch, Math.min(1.15, camPitch - dy * .006));
    }
    function pointerUp() { dragging = false; }
    host.addEventListener('pointerdown', pointerDown);
    host.addEventListener('pointermove', pointerMove);
    host.addEventListener('pointerup', pointerUp);
    host.addEventListener('pointercancel', pointerUp);
    function toggleCamera() {
      cameraMode = cameraMode === 'third' ? 'first' : 'third';
      camPitch = Math.max(cameraMode === 'third' ? -.08 : -.85, Math.min(1.15, camPitch));
      cameraButton.textContent = cameraMode === 'third' ? '🎥 THIRD PERSON' : '👁️ FIRST PERSON';
    }
    cameraButton.addEventListener('click', toggleCamera);
    host.tabIndex = 0;
    host.addEventListener('keydown', event => { if (event.key.toLowerCase() === 'c') toggleCamera(); });

    let world = null;
    let latest = { players: [], id: null };
    window.addEventListener('paintfall-3d-state', event => {
      const state = event.detail;
      if (!state) return;
      if (Array.isArray(state.players)) latest.players = state.players;
      if (state.id) latest.id = state.id;
    });
    function playerWorld() {
      const player = latest.players.find(item => item.id === latest.id) || latest.players.find(item => item.id);
      if (!player) return { x: 0, z: 5 };
      return {
        x: (Math.max(0, Math.min(1200, player.x)) - 600) / 40,
        z: (350 - Math.max(0, Math.min(700, player.y))) / 25
      };
    }
    const projectionFov = Math.PI * .38;
    function render() {
      if (!world) return;
      const rect = host.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) { requestAnimationFrame(render); return; }
      const player = playerWorld(), targetY = 1.1;
      let ex, ey, ez, cx, cy, cz;
      const cp = Math.cos(camPitch), sp = Math.sin(camPitch), sy = Math.sin(camYaw), cyaw = Math.cos(camYaw);
      if (cameraMode === 'first') {
        ex = player.x; ey = targetY + 1.15; ez = player.z;
        cx = ex + sy * cp * 10; cy = ey + sp * 10; cz = ez - cyaw * cp * 10;
      } else {
        const orbitDistance = 18;
        ex = player.x - sy * cp * orbitDistance; ey = 1.5 + sp * 7.5; ez = player.z + cyaw * cp * orbitDistance;
        cx = player.x; cy = targetY; cz = player.z;
      }
      world.setCameraPose({ ex, ey, ez, cx, cy, cz, fov: projectionFov, aspect: rect.width / rect.height, near: .1, far: 180 });
      world.render();
      status.textContent = '🌲 OUTDOOR WORLD • ' + (cameraMode === 'third' ? 'THIRD-PERSON' : 'FIRST-PERSON');
      requestAnimationFrame(render);
    }

    import('./paintfall-contest-3d-world.js').then(module => {
      world = module.createWorld(host);
      window.PAINTFALL_CONTEST_3D_ACTIVE = true;
      window.dispatchEvent(new Event('paintfall-3d-ready'));
      render();
    }).catch(error => {
      console.error('PAINTFALL Three.js world failed to load', error);
      status.textContent = 'WORLD LOAD ERROR';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

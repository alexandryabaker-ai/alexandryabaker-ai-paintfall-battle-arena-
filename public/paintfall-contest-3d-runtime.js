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
    badge.textContent = 'PAINTFALL • REGIONAL ARENA';
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

    let cameraMode = 'third', camYaw = 0, camPitch = 0, dragging = false, lastX = 0, lastY = 0, cameraPointer = null;
    window.paintfallMovementInput = (x,y) => window.PaintfallInput.cameraMovement(x,y,camYaw);
    function pointerDown(event) {
      if (event.target.closest?.('button') || cameraPointer !== null) return; cameraPointer = event.pointerId;
      dragging = true; lastX = event.clientX; lastY = event.clientY;
      host.setPointerCapture?.(event.pointerId);
    }
    function pointerMove(event) {
      if (!dragging || event.pointerId !== cameraPointer) return;
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      lastX = event.clientX; lastY = event.clientY;
      camYaw -= dx * .008;
      const lowerPitch = cameraMode === 'third' ? -.08 : -.85;
      camPitch = Math.max(lowerPitch, Math.min(1.15, camPitch - dy * .006));
    }
    function pointerUp(event) { if(event && event.pointerId !== cameraPointer)return; dragging = false; cameraPointer = null; }
    host.addEventListener('pointerdown', pointerDown);
    host.addEventListener('pointermove', pointerMove);
    host.addEventListener('pointerup', pointerUp);
    host.addEventListener('pointercancel', pointerUp);
    host.addEventListener('lostpointercapture', pointerUp);
    window.addEventListener('blur', () => pointerUp());
    function toggleCamera() {
      cameraMode = cameraMode === 'third' ? 'first' : 'third';
      camPitch = Math.max(cameraMode === 'third' ? -.08 : -.85, Math.min(1.15, camPitch));
      cameraButton.textContent = cameraMode === 'third' ? '🎥 THIRD PERSON' : '👁️ FIRST PERSON';
    }
    cameraButton.addEventListener('click', toggleCamera);
    host.tabIndex = 0;
    host.addEventListener('keydown', event => { if (event.key.toLowerCase() === 'c') toggleCamera(); });

    let world = null, animalMemories = null, discoveryBook = null, arenaAccessibility = null;
    let latest = window.__paintfallLatest3DState || { players: [], id: null };
    let arenaRegion = latest.rules?.arenaRegion || 'country:Mexico';
    window.addEventListener('paintfall-3d-state', event => {
      const state = event.detail;
      if (!state) return;
      if (Array.isArray(state.players)) latest.players = state.players;
      if (state.id) latest.id = state.id;
      const own=latest.players.find(p=>p.id===(latest.id||window.paintfallLocalPlayerId||window.PAINTFALL_ROOM_PLAYER_ID));
      arenaRegion = own?.arenaRegion || state.rules?.arenaRegion || arenaRegion;
    });
    const regionalPlayers=()=>latest.players.filter(p=>!p.arenaRegion||p.arenaRegion===arenaRegion);
    function playerWorld() {
      const localId = latest.id || window.paintfallLocalPlayerId || window.PAINTFALL_ROOM_PLAYER_ID;
      const player = latest.players.find(item => item.id === localId) || latest.players.find(item => item.id);
      if (!player) return { x: 0, z: 5 };
      return window.PaintfallMovement.toWorld(player);
    }
    const projectionFov = Math.PI * .38;
    function render() {
      if (!world) return;
      if (window.PAINTFALL_WORLD_EXPLORING) { requestAnimationFrame(render); return; }
      const rect = host.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) { requestAnimationFrame(render); return; }
      const localId = latest.id || window.paintfallLocalPlayerId || window.PAINTFALL_ROOM_PLAYER_ID;
      world.setRegion(arenaRegion);
      world.players.update(regionalPlayers(), localId, cameraMode, performance.now());
      const actor = world.players.actors.get(localId);
      const rideLift=actor?.userData.bullRide?actor.userData.bullRideLift||0:0;
      const player = playerWorld(), targetY = actor ? actor.position.y + actor.userData.height * .55 + rideLift : 1.1;
      animalMemories?.update(player);
      discoveryBook?.update();
      let ex, ey, ez, cx, cy, cz;
      const cp = Math.cos(camPitch), sp = Math.sin(camPitch), sy = Math.sin(camYaw), cyaw = Math.cos(camYaw);
      if (cameraMode === 'first') {
        ex = player.x; ey = actor ? actor.position.y + actor.userData.eyeHeight + rideLift : targetY + 1.15; ez = player.z;
        cx = ex + sy * cp * 10; cy = ey + sp * 10; cz = ez - cyaw * cp * 10;
      } else {
        const orbitDistance = actor ? Math.max(4.5, actor.userData.renderHeight * 2.6) : 4.8;
        ex = player.x - sy * cp * orbitDistance; ey = targetY + .4 + sp * orbitDistance; ez = player.z + cyaw * cp * orbitDistance;
        cx = player.x; cy = targetY; cz = player.z;
      }
      world.setCameraPose({ ex, ey, ez, cx, cy, cz, mode: cameraMode, fov: projectionFov, aspect: rect.width / rect.height, near: .1, far: 180 });
      world.render();
      const destination=window.PaintfallArenaCatalog?.[arenaRegion];
      badge.textContent='PAINTFALL • '+(destination?.name||'Regional')+' ARENA';
      const room=window.PAINTFALL_ROOM_CODE;
      status.textContent = (cameraMode === 'third' ? 'THIRD-PERSON' : 'FIRST-PERSON')+(room?' • ROOM '+room:'');
      requestAnimationFrame(render);
    }

    Promise.all([import('./paintfall-contest-3d-world.js'),import('./paintfall-world-discovery.js'),import('./paintfall-arena-accessibility.js')]).then(([module,book,accessibility]) => {
      world = module.createWorld(host);
      const active=()=>game.classList.contains('started')&&!window.PAINTFALL_CONNECTION_LOST&&!window.PAINTFALL_ACCOUNT_LOCKED&&!window.PAINTFALL_WORLD_EXPLORING;
      arenaAccessibility=accessibility.createArenaAccessibility({host,isActive:active});
      animalMemories = module.createArenaAnimalMemories(module.THREE,{world,host,isActive:()=>active()&&!window.PAINTFALL_DISCOVERY_OPEN});
      discoveryBook=book.createWorldDiscoveryBook({host,isActive:active,getRegion:()=>arenaRegion});
      window.paintfallTryAnimalShot = () => animalMemories.tryPaintShot();
      window.PAINTFALL_3D_SCENE_HOST = host;
      host.__paintfallScene = world.scene;
      host.__paintfallCamera = world.camera;
      host.__pf3dPlayers = world.players.actors;
      window.paintfall3DPlayerInit = () => world.players.update(regionalPlayers(), latest.id || window.paintfallLocalPlayerId || window.PAINTFALL_ROOM_PLAYER_ID, cameraMode, performance.now());
      window.paintfall3DPlayerJump = () => {world.players.jump(latest.id || window.paintfallLocalPlayerId || window.PAINTFALL_ROOM_PLAYER_ID);arenaAccessibility?.effect('jump');};
      window.paintfall3DPlayerFire = detail => {world.players.fire(detail);arenaAccessibility?.effect('fire');};
      window.addEventListener('paintfall-maya-gymnast-jump', window.paintfall3DPlayerJump);
      window.addEventListener('paintfall-fire', event => window.paintfall3DPlayerFire(event.detail));
      window.paintfall3DPlayerInit();
      for (const action of window.__paintfallPending3DActions || []) {
        if (action.type === 'jump') window.paintfall3DPlayerJump();
        if (action.type === 'fire') window.paintfall3DPlayerFire(action.detail);
      }
      window.__paintfallPending3DActions = [];
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

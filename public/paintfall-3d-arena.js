import * as THREE from 'three';

(() => {
  const canvas = document.getElementById('arena');
  if (!canvas) return;

  const host = canvas.parentElement;
  host.style.position = 'relative';
  host.style.overflow = 'hidden';

  const overlay = document.createElement('div');
  overlay.id = 'paintfall3DScene';
  Object.assign(overlay.style, {
    position: 'absolute',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '5',
    borderRadius: '18px',
    overflow: 'hidden'
  });
  host.insertBefore(overlay, canvas.nextSibling);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-600, 600, 350, -350, 0.1, 100);
  camera.position.set(0, 5, 30);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  overlay.appendChild(renderer.domElement);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  scene.add(new THREE.HemisphereLight(0xffffff, 0x26334a, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-5, 10, 12);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8b5cff, 1.6);
  rim.position.set(8, 4, 5);
  scene.add(rim);

  const roster = {
    Maya:  { skin: 0xb97852, hair: 0x2a1712, shirt: 0x6c63ff, accent: 0x55e6ff, style: 'ponytail' },
    Zara:  { skin: 0x8d5a3b, hair: 0x17110e, shirt: 0xe64b62, accent: 0xffd34e, style: 'braids' },
    Nova:  { skin: 0xf0c5a4, hair: 0x17151a, shirt: 0x20b978, accent: 0xff6b9f, style: 'bob' },
    Skye:  { skin: 0xe5b18e, hair: 0x704522, shirt: 0x20aeb8, accent: 0xff4d8d, style: 'messy' },
    Jax:   { skin: 0x75452d, hair: 0x17110e, shirt: 0x3d7cff, accent: 0x31e8ff, style: 'fade' },
    Rico:  { skin: 0xa96645, hair: 0x25140f, shirt: 0xe34b31, accent: 0xffd34e, style: 'curl' },
    Kai:   { skin: 0xb9784f, hair: 0x21140f, shirt: 0x8b5cff, accent: 0x35e6ff, style: 'short' },
    Dante: { skin: 0xc98b68, hair: 0x4a2415, shirt: 0x704522, accent: 0xff8a32, style: 'short' }
  };

  const actors = new Map();
  const material = (color, roughness = 0.72) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.04 });

  function makeCharacter(character) {
    const c = roster[character] || roster.Maya;
    const group = new THREE.Group();
    const body = new THREE.Group();
    group.add(body);

    const skin = material(c.skin);
    const hair = material(c.hair, 0.9);
    const shirt = material(c.shirt, 0.6);
    const accent = material(c.accent, 0.45);
    const dark = material(0x151923, 0.85);

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.72, 6, 12), shirt);
    torso.position.y = 1.15;
    body.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 14), skin);
    head.position.y = 2.05;
    body.add(head);

    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.365, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.58), hair);
    hairCap.position.y = 2.15;
    body.add(hairCap);

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), dark);
    const eyeR = eyeL.clone();
    eyeL.position.set(-0.12, 2.04, -0.315);
    eyeR.position.set(0.12, 2.04, -0.315);
    body.add(eyeL, eyeR);

    const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.55, 6, 10), skin);
    const armR = armL.clone();
    armL.position.set(-0.52, 1.18, 0);
    armR.position.set(0.52, 1.18, 0);
    body.add(armL, armR);

    const legL = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.65, 6, 10), dark);
    const legR = legL.clone();
    legL.position.set(-0.19, 0.42, 0);
    legR.position.set(0.19, 0.42, 0);
    body.add(legL, legR);

    const badge = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 8, 24), accent);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(0, 1.17, -0.43);
    body.add(badge);

    if (c.style === 'ponytail') {
      const pony = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), hair);
      pony.position.set(0, 1.98, 0.3);
      body.add(pony);
    } else if (c.style === 'braids') {
      [-0.29, 0.29].forEach(x => {
        const braid = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.48, 5, 8), hair);
        braid.position.set(x, 1.98, 0.08);
        body.add(braid);
      });
    } else if (c.style === 'bob') {
      const bob = new THREE.Mesh(new THREE.SphereGeometry(0.39, 14, 10), hair);
      bob.scale.set(1, 0.8, 0.82);
      bob.position.y = 2.02;
      bob.position.z = 0.08;
      bob.renderOrder = -1;
      body.add(bob);
    } else if (c.style === 'fade') {
      const fade = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.11, 0.42), hair);
      fade.position.set(0, 2.32, 0.04);
      body.add(fade);
    } else {
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 10), hair);
      top.scale.set(1.05, 0.62, 0.9);
      top.position.set(0, 2.27, 0.02);
      body.add(top);
    }

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 24),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.02;
    group.add(shadow);

    group.userData.parts = { body, armL, armR, legL, legR, torso, badge };
    group.userData.character = character;
    group.scale.setScalar(24);
    scene.add(group);
    return group;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
  }
  window.addEventListener('resize', resize);
  resize();

  function sync() {
    const list = Array.isArray(window.players) ? window.players : [];
    const seen = new Set();
    const rect = canvas.getBoundingClientRect();
    const sx = rect.width / 1200;
    const sy = rect.height / 700;

    list.forEach(p => {
      seen.add(p.id);
      let actor = actors.get(p.id);
      if (!actor || actor.userData.character !== p.character) {
        if (actor) scene.remove(actor);
        actor = makeCharacter(p.character);
        actors.set(p.id, actor);
      }
      actor.position.x = (p.x - 600) * sx;
      actor.position.y = (350 - p.y) * sy;
      actor.position.z = p.id === window.me ? 2 : 0;
      actor.visible = !!p.alive;

      const parts = actor.userData.parts;
      const moving = Math.abs((p.x || 0) - (actor.userData.lastX || p.x || 0)) > 0.2 || Math.abs((p.y || 0) - (actor.userData.lastY || p.y || 0)) > 0.2;
      const t = performance.now() * 0.012;
      const bob = moving ? Math.abs(Math.sin(t)) * 0.045 : Math.sin(t * 0.5) * 0.012;
      parts.body.position.y = bob;
      parts.armL.rotation.z = moving ? Math.sin(t) * 0.16 : Math.sin(t * 0.5) * 0.025;
      parts.armR.rotation.z = moving ? -Math.sin(t) * 0.16 : -Math.sin(t * 0.5) * 0.025;
      parts.legL.rotation.z = moving ? -Math.sin(t) * 0.12 : 0;
      parts.legR.rotation.z = moving ? Math.sin(t) * 0.12 : 0;
      actor.userData.lastX = p.x;
      actor.userData.lastY = p.y;
    });

    actors.forEach((actor, id) => {
      if (!seen.has(id)) {
        scene.remove(actor);
        actors.delete(id);
      }
    });
  }

  function animate() {
    sync();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.PAINTFALL_3D_ACTIVE = true;
  window.PAINTFALL_3D_SCENE = scene;
})();

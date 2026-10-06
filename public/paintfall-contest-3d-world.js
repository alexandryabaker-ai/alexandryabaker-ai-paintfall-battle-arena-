import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
function seeded(seed) {
  let value = seed >>> 0;
  return () => { value = (value * 1664525 + 1013904223) >>> 0; return value / 4294967296; };
}

function makeSurfaceTexture(base, colors, seed, repeat = 1) {
  const size = 256, canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d'), rand = seeded(seed);
  ctx.fillStyle = base; ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 6200; i++) {
    ctx.globalAlpha = .12 + rand() * .2;
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
    const r = 1 + rand() * 4;
    ctx.fillRect(rand() * size, rand() * size, r, r * (.35 + rand()));
  }
  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.anisotropy = 4;
  return texture;
}

export function createWorld(host) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb5cbd2);
  scene.fog = new THREE.Fog(0xb5cbd2, 92, 230);
  const camera = new THREE.PerspectiveCamera(55, 1, .1, 180);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.domElement.setAttribute('aria-label', 'PAINTFALL outdoor battle arena world');
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none';
  host.insertBefore(renderer.domElement, host.firstChild);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.add(new THREE.HemisphereLight(0xe2f1ff, 0x5b6148, 1.35));
  const sun = new THREE.DirectionalLight(0xffe4ba, 2.15);
  sun.position.set(-42, 66, 24); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -82; sun.shadow.camera.right = 82;
  sun.shadow.camera.top = 82; sun.shadow.camera.bottom = -82;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 190;
  sun.shadow.bias = -.00025; sun.shadow.normalBias = .025;
  scene.add(sun);
  const skyFill = new THREE.DirectionalLight(0xb5d6e8, .65);
  skyFill.position.set(28, 20, -48); scene.add(skyFill);

  const grassMap = makeSurfaceTexture('#62734b', ['#718354', '#526b46', '#82905b', '#596d43'], 41, 12);
  const dirtMap = makeSurfaceTexture('#80674c', ['#947b5c', '#6e563f', '#a28a68', '#715a43'], 73, 7);
  const concreteMap = makeSurfaceTexture('#777d79', ['#89908b', '#666d69', '#9b9f98', '#5f6663'], 119, 4);
  const barkMap = makeSurfaceTexture('#514033', ['#69503c', '#342f28', '#796043', '#413a31'], 131, 3);
  const materials = {
    grass: new THREE.MeshStandardMaterial({ map: grassMap, color: 0xc4d0a4, roughness: 1 }),
    dirt: new THREE.MeshStandardMaterial({ map: dirtMap, roughness: .98 }),
    soil: new THREE.MeshStandardMaterial({ map: dirtMap, color: 0x9a7856, roughness: 1, side: THREE.DoubleSide }),
    subsoil: new THREE.MeshStandardMaterial({ map: dirtMap, color: 0x78664f, roughness: 1, side: THREE.DoubleSide }),
    earth: new THREE.MeshStandardMaterial({ map: dirtMap, color: 0x5e5144, roughness: 1, side: THREE.DoubleSide }),
    deepEarth: new THREE.MeshStandardMaterial({ map: dirtMap, color: 0x49453e, roughness: 1, side: THREE.DoubleSide }),
    concrete: new THREE.MeshStandardMaterial({ map: concreteMap, color: 0xe0dfd6, roughness: .91 }),
    bark: new THREE.MeshStandardMaterial({ map: barkMap, roughness: .96 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x586365, roughness: .65, metalness: .72 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: 0x283437, roughness: .72, metalness: .63 }),
    timber: new THREE.MeshStandardMaterial({ map: makeSurfaceTexture('#795d40', ['#997551', '#614a36', '#a27e59', '#4e4234'], 149, 5), roughness: .91 }),
    paintBlue: new THREE.MeshStandardMaterial({ color: 0x2c83b6, roughness: .73 }),
    paintOrange: new THREE.MeshStandardMaterial({ color: 0xdd7442, roughness: .76 }),
    roof: new THREE.MeshStandardMaterial({ color: 0x41484a, roughness: .82 }),
    siding: new THREE.MeshStandardMaterial({ color: 0xc0b69e, roughness: .91 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x8db4bb, roughness: .23, metalness: .12, transparent: true, opacity: .7 }),
    yellow: new THREE.MeshStandardMaterial({ color: 0xe4b83f, roughness: .72 }),
    white: new THREE.MeshStandardMaterial({ color: 0xe8e6d7, roughness: .8 }),
    cedar: new THREE.MeshStandardMaterial({ color: 0x8a6948, roughness: .9 }),
    paleSiding: new THREE.MeshStandardMaterial({ color: 0xd0c9b5, roughness: .9 }),
    brick: new THREE.MeshStandardMaterial({ color: 0x885f4c, roughness: .92 }),
    clearing: new THREE.MeshStandardMaterial({ map: grassMap, color: 0xb9c29a, roughness: 1 })
  };
  const colliders = [];
  const add = (mesh, cast = true, receive = true) => {
    mesh.castShadow = cast; mesh.receiveShadow = receive; scene.add(mesh); return mesh;
  };
  function box(x, y, z, w, h, d, material, collision = false) {
    const mesh = add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material));
    mesh.position.set(x, y, z);
    if (collision) colliders.push({ type: 'box', x, y, z, width: w, height: h, depth: d });
    return mesh;
  }
  function cylinderBetween(a, b, r1, r2, material, radial = 7) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const dir = new THREE.Vector3().subVectors(end, start), length = dir.length();
    const mesh = add(new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, length, radial, 1), material));
    mesh.position.copy(start).add(end).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return mesh;
  }

  // One deterministic height field is shared by terrain and all ground-hugging details.
  // The clearing eases into the surrounding rolling woodland rather than ending at a slab edge.
  function latticeNoise(ix, iz) {
    let n = Math.imul(ix, 374761393) + Math.imul(iz, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 2147483647.5 - 1;
  }
  function terrainNoise(x, z, scale) {
    const gx = x * scale, gz = z * scale, ix = Math.floor(gx), iz = Math.floor(gz);
    const fx = gx - ix, fz = gz - iz;
    const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
    const a = THREE.MathUtils.lerp(latticeNoise(ix, iz), latticeNoise(ix + 1, iz), sx);
    const b = THREE.MathUtils.lerp(latticeNoise(ix, iz + 1), latticeNoise(ix + 1, iz + 1), sx);
    return THREE.MathUtils.lerp(a, b, sz);
  }
  function terrainHeight(x, z) {
    const clearing = Math.exp(-((x / 48) ** 4 + ((z + 1) / 42) ** 4));
    const broad = terrainNoise(x, z, .032) * 2.15;
    const middle = terrainNoise(x + 31, z - 17, .085) * .72;
    const detail = terrainNoise(x - 9, z + 23, .21) * .16;
    const ax = Math.abs(x), az = Math.abs(z);
    const insideArenaFootprint = ax <= 26 && az <= 21 && (ax <= 20 || az <= 15 || ax + az <= 41);
    if (insideArenaFootprint) return -2.2;
    return (broad + middle + detail) * (1 - clearing * .96);
  }
  const terrainSize = 390, terrainHalf = terrainSize / 2, terrainSegments = 180, terrainDepth = 12;
  function terrainGrid(depth = 0, underside = false) {
    const geometry = new THREE.BufferGeometry(), positions = [], uvs = [], indices = [];
    const row = terrainSegments + 1;
    for (let iz = 0; iz <= terrainSegments; iz++) for (let ix = 0; ix <= terrainSegments; ix++) {
      const x = -terrainHalf + ix / terrainSegments * terrainSize;
      const z = -terrainHalf + iz / terrainSegments * terrainSize;
      positions.push(x, terrainHeight(x, z) - depth, z);
      uvs.push(ix / terrainSegments, iz / terrainSegments);
    }
    for (let iz = 0; iz < terrainSegments; iz++) for (let ix = 0; ix < terrainSegments; ix++) {
      const a = iz * row + ix, b = a + 1, c = a + row, d = c + 1;
      if (underside) indices.push(a, b, c, b, d, c);
      else indices.push(a, c, b, b, c, d);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    return geometry;
  }
  add(new THREE.Mesh(terrainGrid(), materials.grass), false, true);
  // Close the terrain as a real 12 m-deep mass, with exposed soil/subsoil/earth strata at its edge.
  add(new THREE.Mesh(terrainGrid(terrainDepth, true), materials.deepEarth), false, false);
  const boundary = [];
  for (let ix = 0; ix <= terrainSegments; ix++) boundary.push([-terrainHalf + ix / terrainSegments * terrainSize, -terrainHalf]);
  for (let iz = 1; iz <= terrainSegments; iz++) boundary.push([terrainHalf, -terrainHalf + iz / terrainSegments * terrainSize]);
  for (let ix = terrainSegments - 1; ix >= 0; ix--) boundary.push([-terrainHalf + ix / terrainSegments * terrainSize, terrainHalf]);
  for (let iz = terrainSegments - 1; iz > 0; iz--) boundary.push([-terrainHalf, -terrainHalf + iz / terrainSegments * terrainSize]);
  const wallGeo = new THREE.BufferGeometry(), wallPositions = [], wallUvs = [], wallIndices = [];
  const strataDepths = [0, .28, 2.8, terrainDepth];
  let boundaryDistance = 0;
  for (let layer = 0; layer < strataDepths.length; layer++) {
    const depth = strataDepths[layer];
    for (let i = 0; i < boundary.length; i++) {
      if (i) boundaryDistance += Math.hypot(boundary[i][0] - boundary[i - 1][0], boundary[i][1] - boundary[i - 1][1]);
      const [x, z] = boundary[i];
      wallPositions.push(x, terrainHeight(x, z) - depth, z);
      wallUvs.push(boundaryDistance / 18, depth / 3);
    }
  }
  const ringSize = boundary.length;
  for (let layer = 0; layer < strataDepths.length - 1; layer++) {
    const start = wallIndices.length;
    for (let i = 0; i < ringSize; i++) {
      const next = (i + 1) % ringSize, upper = layer * ringSize, lower = (layer + 1) * ringSize;
      wallIndices.push(upper + i, lower + i, upper + next, upper + next, lower + i, lower + next);
    }
    wallGeo.addGroup(start, wallIndices.length - start, layer);
  }
  wallGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallPositions, 3));
  wallGeo.setAttribute('uv', new THREE.Float32BufferAttribute(wallUvs, 2));
  wallGeo.setIndex(wallIndices); wallGeo.computeVertexNormals();
  add(new THREE.Mesh(wallGeo, [materials.soil, materials.subsoil, materials.earth]), false, true);
  // A curved, terrain-conforming path creates a gradual transition from gate to community.
  function groundRibbon(points, widths, material, segments = 100) {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0, z)));
    const positions = [], uvs = [], indices = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments, center = curve.getPoint(t), tangent = curve.getTangent(t);
      const half = THREE.MathUtils.lerp(widths[0], widths[1], t) * .5;
      const nx = -tangent.z, nz = tangent.x;
      for (const side of [-1, 1]) {
        const x = center.x + nx * half * side, z = center.z + nz * half * side;
        positions.push(x, terrainHeight(x, z) + .035, z);
        uvs.push(side, t * 12);
      }
      if (i < segments) { const a = i * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    const mesh = add(new THREE.Mesh(geometry, material), false, true); mesh.material.side = THREE.DoubleSide;
    return mesh;
  }
  groundRibbon([[0, 22], [0, 32], [2, 45], [-1, 58], [2, 70], [0, 83], [0, 101]], [13, 7.5], materials.grass, 120);
  groundRibbon([[0, 22], [0, 32], [2, 45], [-1, 58], [2, 70], [0, 83], [0, 101]], [8.2, 4.8], materials.dirt, 120);
  groundRibbon([[0, 33], [-7, 45], [-18, 54], [-31, 62]], [4.6, 3.2], materials.dirt, 48);
  groundRibbon([[1, 52], [10, 61], [23, 68], [39, 72]], [4.4, 3.2], materials.dirt, 48);

  // Chamfered, irregular perimeter and matching slab make the facility feel built,
  // while the south gate remains open on the existing third-person camera sightline.
  const outline = [[-20, -21], [20, -21], [26, -15], [26, 15], [20, 21], [-20, 21], [-26, 15], [-26, -15]];
  const footprint = new THREE.Shape();
  footprint.moveTo(outline[0][0], -outline[0][1]);
  for (let i = 1; i < outline.length; i++) footprint.lineTo(outline[i][0], -outline[i][1]);
  footprint.closePath();
  const earthBaseGeo = new THREE.ExtrudeGeometry(footprint, { depth: .95, bevelEnabled: false, steps: 1, curveSegments: 1 });
  earthBaseGeo.rotateX(-Math.PI / 2);
  add(new THREE.Mesh(earthBaseGeo, materials.subsoil), false, true).position.y = -2.05;
  const slabGeo = new THREE.ExtrudeGeometry(footprint, { depth: 1.1, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .06, bevelThickness: .04, curveSegments: 1 });
  slabGeo.rotateX(-Math.PI / 2);
  add(new THREE.Mesh(slabGeo, materials.concrete)).position.y = -1.1;
  colliders.push({ type: 'arena-surface', outline, top: 0, thickness: 2.05 });
  const arenaGeo = new THREE.ShapeGeometry(footprint);
  arenaGeo.rotateX(-Math.PI / 2);
  const arenaFloor = add(new THREE.Mesh(arenaGeo, materials.concrete), false, true);
  arenaFloor.position.y = .012;
  const lineMat = materials.yellow;
  for (const x of [-23.5, 23.5]) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(.13, 35), lineMat);
    line.rotation.x = -Math.PI / 2; line.position.set(x, .024, 0); add(line, false, true);
  }
  for (const z of [-17.4, 17.4]) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(47, .13), lineMat);
    line.rotation.x = -Math.PI / 2; line.position.set(0, .024, z); add(line, false, true);
  }
  const whiteStripe = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 28), materials.white);
  whiteStripe.rotation.x = -Math.PI / 2; whiteStripe.position.set(0, .026, -1); add(whiteStripe, false, true);
  // Fine chain-link pattern is shared and repeated across each fence panel.
  const fenceCanvas = document.createElement('canvas'); fenceCanvas.width = 128; fenceCanvas.height = 128;
  const fctx = fenceCanvas.getContext('2d');
  fctx.clearRect(0, 0, 128, 128); fctx.strokeStyle = 'rgba(75,91,90,.82)'; fctx.lineWidth = 2;
  for (let x = -128; x < 256; x += 16) { fctx.beginPath(); fctx.moveTo(x, 0); fctx.lineTo(x + 128, 128); fctx.stroke(); fctx.beginPath(); fctx.moveTo(x, 128); fctx.lineTo(x + 128, 0); fctx.stroke(); }
  const fenceTexture = new THREE.CanvasTexture(fenceCanvas); fenceTexture.wrapS = fenceTexture.wrapT = THREE.RepeatWrapping; fenceTexture.repeat.set(4, 2);
  const meshMat = new THREE.MeshStandardMaterial({ map: fenceTexture, color: 0xd4d8cc, transparent: true, alphaTest: .38, roughness: .82, metalness: .38, side: THREE.DoubleSide });
  const fencePanel = (x1, z1, x2, z2, h = 3.8) => {
    const dx = x2 - x1, dz = z2 - z1, w = Math.hypot(dx, dz);
    const panel = add(new THREE.Mesh(new THREE.PlaneGeometry(w, h), meshMat));
    panel.position.set((x1 + x2) / 2, h / 2 + .18, (z1 + z2) / 2);
    panel.rotation.y = -Math.atan2(dz, dx);
    return panel;
  };
  const perimeterSegments = [
    [[-20, -21], [20, -21]], [[20, -21], [26, -15]], [[26, -15], [26, 15]],
    [[26, 15], [20, 21]], [[20, 21], [4, 21]], [[-4, 21], [-20, 21]],
    [[-20, 21], [-26, 15]], [[-26, 15], [-26, -15]], [[-26, -15], [-20, -21]]
  ];
  for (const [[x1, z1], [x2, z2]] of perimeterSegments) {
    fencePanel(x1, z1, x2, z2);
    for (const [x, z] of [[x1, z1], [x2, z2]]) box(x, 2.12, z, .12, 4.2, .12, materials.darkMetal, true);
  }
  // Two mesh gate leaves sit folded against the side fences so the entrance is visible
  // from the preserved camera pose and remains a future traversable opening.
  const gateLeaf = (hingeX, fold) => {
    const group = new THREE.Group(); group.position.set(hingeX, .18, 21);
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(8, 3.5), meshMat);
    panel.position.x = fold * 4; panel.position.y = 1.75; panel.rotation.y = -Math.PI / 2;
    group.add(panel);
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, 3.7, 10), materials.metal);
    hinge.position.y = 1.85; group.add(hinge);
    group.traverse(object => { if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; } });
    scene.add(group);
  };
  gateLeaf(-4, -1); gateLeaf(4, 1);
  for (const x of [-25, -15, -5, 5, 15, 25]) {
    box(x, 4.25, -20.9, .08, .08, .08, materials.yellow);
  }

  // Modular paintball cover, ramp and raised service deck; shared rough industrial finishes.
  function palletBarricade(x, z, width, depth, height) {
    const levels = 5, gap = .07, boardH = (height - gap * (levels - 1)) / levels;
    for (let i = 0; i < levels; i++) {
      const y = boardH / 2 + i * (boardH + gap);
      box(x, y, z - depth * .36, width, boardH, .12, materials.timber);
      box(x, y, z + depth * .36, width, boardH, .12, materials.timber);
    }
    for (const side of [-1, 1]) for (const face of [-1, 1]) {
      box(x + side * (width / 2 - .1), height / 2, z + face * depth * .36, .18, height, .16, materials.darkMetal);
    }
    box(x, height + .035, z, width + .16, .07, depth + .12, materials.metal);
    colliders.push({ type: 'box', x, y: height / 2, z, width, height, depth });
  }
  palletBarricade(-12, -7, 6.8, 2.4, 1.64);
  const blueBunker = add(new THREE.Mesh(new THREE.CapsuleGeometry(.82, 2.5, 5, 14), materials.paintBlue));
  blueBunker.position.set(11, .88, -8); blueBunker.rotation.z = Math.PI / 2; blueBunker.scale.set(1, .82, 1.05);
  colliders.push({ type: 'box', x: 11, y: .88, z: -8, width: 4.1, height: 1.8, depth: 1.75 });
  const orangeBunker = add(new THREE.Mesh(new THREE.CapsuleGeometry(.76, 2.2, 5, 14), materials.paintOrange));
  orangeBunker.position.set(-10, .82, 8); orangeBunker.rotation.z = Math.PI / 2; orangeBunker.rotation.y = .28; orangeBunker.scale.set(1, .84, 1.15);
  colliders.push({ type: 'box', x: -10, y: .82, z: 8, width: 3.7, height: 1.7, depth: 1.75 });
  box(9, .47, 6, 3.2, .94, 4.4, materials.timber, true);
  for (const z of [-4.8, -2.5, -.2, 2.1]) {
    const tire = add(new THREE.Mesh(new THREE.TorusGeometry(.65, .23, 8, 16), materials.darkMetal));
    tire.position.set(-19, .62, z); tire.rotation.y = Math.PI / 2;
  }
  const rampShape = new THREE.Shape();
  rampShape.moveTo(-2.2, 0); rampShape.lineTo(2.2, 0); rampShape.lineTo(2.2, .12); rampShape.lineTo(-2.2, 1.18); rampShape.closePath();
  const rampGeo = new THREE.ExtrudeGeometry(rampShape, { depth: 2.8, bevelEnabled: false }); rampGeo.rotateY(Math.PI / 2);
  const rampMesh = add(new THREE.Mesh(rampGeo, materials.metal)); rampMesh.position.set(-1.4, 0, -.6);
  colliders.push({ type: 'ramp', x: 0, z: -.6, width: 4.4, depth: 2.8, height: 1.18 });
  box(17, .38, 1, 3.5, .76, 3.5, materials.concrete, true);
  box(-19, .35, -1, 3.1, .7, 3.4, materials.concrete, true);
  box(18, .20, -13, 10, .4, 4.8, materials.darkMetal, true);
  box(18, .42, -13, 9.7, .08, 4.5, materials.concrete);
  for (const x of [14, 22]) box(x, 1.2, -13, .16, 1.6, .16, materials.metal, true);
  // Platform access ramp and visible edge stripe.
  const ramp = box(18, .27, -8.9, 3.8, .12, 4.3, materials.concrete, true); ramp.rotation.x = -.16;
  const deckRail = box(18, 1.10, -15.1, 9.6, .12, .14, materials.yellow); deckRail.rotation.z = -.06;
  // Paint splashes are flattened irregular decal shapes, batched by paint color.
  const paintGeo = new THREE.IcosahedronGeometry(1, 1);
  for (const [material, marks] of [[materials.paintBlue, [[-20, 0, 3.5, 1.8], [3, 0, -14, 2.4], [20, 0, 8, 2.2]]], [materials.paintOrange, [[-3, 0, 13, 2.7], [14, 0, -3, 1.8], [-17, 0, -13, 2.1]]]]) {
    const instances = new THREE.InstancedMesh(paintGeo, material, marks.length);
    const matrix = new THREE.Matrix4();
    marks.forEach(([x, y, z, s], i) => {
      matrix.compose(new THREE.Vector3(x, y + .04, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, i * .7, 0)), new THREE.Vector3(s, .05, s * .68));
      instances.setMatrixAt(i, matrix);
    });
    instances.instanceMatrix.needsUpdate = true; instances.receiveShadow = true; scene.add(instances);
  }

  // Floodlight poles with shielded luminaires; no overhead roof or arena enclosure.
  for (const [x, z] of [[-25, -19], [25, -19], [-25, 19], [25, 19]]) {
    cylinderBetween([x, .1, z], [x, 9.4, z], .11, .065, materials.metal, 9);
    const arm = box(x + (x < 0 ? .55 : -.55), 9.1, z, 1.25, .08, .12, materials.metal);
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(.72, .22, .32), new THREE.MeshStandardMaterial({ color: 0xffedc1, emissive: 0xffd78b, emissiveIntensity: .8, roughness: .35 }));
    lamp.position.set(x + (x < 0 ? .95 : -.95), 8.98, z); add(lamp, false, true);
  }

  // Vegetation is instance-batched by shared geometry/material, with a low-detail far canopy.
  const rand = seeded(83021);
  const foliageMats = [0x536e43, 0x667b49, 0x778454, 0x496744].map(color => new THREE.MeshStandardMaterial({ color, roughness: .94, side: THREE.DoubleSide }));
  const trunkGeo = new THREE.CylinderGeometry(.22, .43, 1, 7, 3);
  const branchGeo = new THREE.CylinderGeometry(.045, .15, 1, 6, 1);
  const leafGeo = new THREE.BufferGeometry();
  leafGeo.setAttribute('position', new THREE.Float32BufferAttribute([
    0,0,0, -.44,.18,0, -.31,.47,.035, 0,0,0, -.31,.47,.035, 0,.76,.08,
    0,0,0, 0,.76,.08, .31,.47,.035, 0,0,0, .31,.47,.035, .44,.18,0,
    -.31,.47,.035, -.15,.53,.045, 0,.76,.08, .31,.47,.035, 0,.76,.08, .15,.53,.045
  ], 3));
  leafGeo.computeVertexNormals();
  // Faceted, tiered crown silhouette for the distant LOD, replacing spherical foliage.
  const crownGeo = new THREE.BufferGeometry();
  const crownRings = [[-1.05, .12], [-.82, .64], [-.35, 1], [.12, .91], [.55, .66], [.88, .34], [1.08, .025]];
  const crownPositions = [], crownIndices = [], crownSides = 9;
  for (let ring = 0; ring < crownRings.length; ring++) {
    const [y, radius] = crownRings[ring];
    for (let side = 0; side < crownSides; side++) {
      const angle = side / crownSides * Math.PI * 2;
      const variation = 1 + .11 * Math.sin(angle * 3 + ring * .85) + .055 * Math.cos(angle * 5 - ring);
      crownPositions.push(Math.cos(angle) * radius * variation, y, Math.sin(angle) * radius * variation);
    }
  }
  for (let ring = 0; ring < crownRings.length - 1; ring++) for (let side = 0; side < crownSides; side++) {
    const a = ring * crownSides + side, b = ring * crownSides + (side + 1) % crownSides;
    const c = (ring + 1) * crownSides + side, d = (ring + 1) * crownSides + (side + 1) % crownSides;
    crownIndices.push(a, c, b, b, c, d);
  }
  crownGeo.setAttribute('position', new THREE.Float32BufferAttribute(crownPositions, 3));
  crownGeo.setIndex(crownIndices); crownGeo.computeVertexNormals();
  const treeCapacity = 280;
  const trunkInstances = new THREE.InstancedMesh(trunkGeo, materials.bark, treeCapacity);
  const branchInstances = foliageMats.map(() => new THREE.InstancedMesh(branchGeo, materials.bark, treeCapacity * 2));
  const leafInstances = foliageMats.map(mat => new THREE.InstancedMesh(leafGeo, mat, treeCapacity * 50));
  const farCanopy = foliageMats.map(mat => new THREE.InstancedMesh(crownGeo, mat, treeCapacity));
  const branchCounts = branchInstances.map(() => 0), leafCounts = leafInstances.map(() => 0), farCounts = farCanopy.map(() => 0);
  const trunkDummy = new THREE.Object3D(), branchDummy = new THREE.Object3D(), leafDummy = new THREE.Object3D();
  let treeCount = 0;
  for (let i = 0, placed = 0; placed < treeCapacity && i < 7000; i++) {
    const angle = rand() * Math.PI * 2, radius = 43 + Math.sqrt(rand()) * 86;
    const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
    if (Math.abs(x) > 130 || Math.abs(z) > 130 || (Math.abs(x) < 31 && Math.abs(z) < 26)) continue;
    if (Math.abs(x) < 8 && z > 19 && z < 111) continue;
    const scale = .78 + rand() * .72, height = 8.8 * scale, leanX = (rand() - .5) * .7, leanZ = (rand() - .5) * .7;
    const y = terrainHeight(x, z);
    trunkDummy.position.set(x, y + height / 2, z); trunkDummy.rotation.set(leanZ * .04, rand() * 6.28, leanX * .04); trunkDummy.scale.set(scale, height, scale); trunkDummy.updateMatrix(); trunkInstances.setMatrixAt(placed, trunkDummy.matrix);
    trunkInstances.setColorAt(placed, new THREE.Color().setHSL(.085 + rand() * .025, .19 + rand() * .12, .34 + rand() * .13));
    const conifer = rand() < .28;
    const branchTotal = conifer ? 7 : 6;
    for (let b = 0; b < branchTotal; b++) {
      const t = conifer ? .30 + b * .075 : .40 + b * .075;
      const theta = b * 2.399 + rand() * .3;
      const taper = 1 - b / (branchTotal + 1);
      const length = (conifer ? 2.0 : 2.35) * taper * scale;
      const start = new THREE.Vector3(x + Math.cos(theta) * .22 * t, y + height * t, z + Math.sin(theta) * .22 * t);
      const end = new THREE.Vector3(x + Math.cos(theta) * length, y + height * (t + (conifer ? .05 : .16) + rand() * .07), z + Math.sin(theta) * length);
      const direction = end.clone().sub(start), middle = start.clone().add(end).multiplyScalar(.5);
      branchDummy.position.copy(middle); branchDummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
      branchDummy.scale.set(scale, direction.length(), scale); branchDummy.updateMatrix();
      const branchMaterial = b % branchInstances.length, branchIndex = branchCounts[branchMaterial]++;
      branchInstances[branchMaterial].setMatrixAt(branchIndex, branchDummy.matrix);
    }
    const crownY = y + height * .82, spread = (conifer ? 1.3 : 1.92) * scale;
    const leafTotal = conifer ? 150 : 115;
    for (let l = 0; l < leafTotal; l++) {
      const theta = rand() * Math.PI * 2;
      const vertical = (rand() * 2 - 1) * (conifer ? 1.55 : 1.38) * scale;
      const crownRadius = spread * Math.sqrt(Math.max(.02, 1 - (vertical / ((conifer ? 1.85 : 1.65) * scale)) ** 2));
      const radius = crownRadius * (.35 + rand() * .68);
      const center = new THREE.Vector3(x + Math.cos(theta) * radius, crownY + vertical, z + Math.sin(theta) * radius);
      leafDummy.position.copy(center);
      leafDummy.rotation.set((rand() - .5) * .8, theta + (rand() - .5) * .7, (rand() - .5) * .6);
      const leafScale = conifer ? .24 + rand() * .17 : .38 + rand() * .25;
      leafDummy.scale.set(leafScale * (conifer ? .42 : .62), leafScale, leafScale * .2);
      leafDummy.updateMatrix();
      const leafMaterial = Math.floor(rand() * leafInstances.length), leafIndex = leafCounts[leafMaterial]++;
      leafInstances[leafMaterial].setMatrixAt(leafIndex, leafDummy.matrix);
      leafInstances[leafMaterial].setColorAt(leafIndex, new THREE.Color().setHSL(.24 + rand() * .055, .28 + rand() * .22, .32 + rand() * .22));
    }
    const farIndex = placed % farCanopy.length, far = farCanopy[farIndex];
    leafDummy.position.set(x, crownY, z); leafDummy.rotation.set(0, rand() * 6.28, 0);
    leafDummy.scale.set((conifer ? 1.3 : 2.45) * scale, (conifer ? 2.6 : 3.2) * scale, (conifer ? 1.3 : 2.35) * scale); leafDummy.updateMatrix();
    far.setMatrixAt(farCounts[farIndex]++, leafDummy.matrix); placed++;
    treeCount = placed;
  }
  trunkInstances.count = treeCount;
  for (let i = 0; i < branchInstances.length; i++) { branchInstances[i].count = branchCounts[i]; branchInstances[i].instanceMatrix.needsUpdate = true; }
  for (let i = 0; i < leafInstances.length; i++) { leafInstances[i].count = leafCounts[i]; leafInstances[i].instanceMatrix.needsUpdate = true; }
  for (let i = 0; i < farCanopy.length; i++) { farCanopy[i].count = farCounts[i]; farCanopy[i].instanceMatrix.needsUpdate = true; }
  for (const mesh of [trunkInstances, ...branchInstances, ...leafInstances, ...farCanopy]) {
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); scene.add(mesh);
  }
  // A merged clump of tapered blades is instanced for near ground cover; far vegetation is culled.
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x748653, roughness: 1, side: THREE.DoubleSide });
  const bladeGeo = new THREE.BufferGeometry();
  bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute([
    -.18, 0, 0, -.06, .55, 0, -.025, 0, .025, -.025, 0, .025, -.06, .55, 0, .09, 0, .02,
    .02, 0, -.02, .07, .46, -.015, .14, 0, 0, .14, 0, 0, .07, .46, -.015, -.02, 0, -.02
  ], 3));
  bladeGeo.computeVertexNormals();
  const grassInstances = new THREE.InstancedMesh(bladeGeo, bladeMat, 900);
  const grassDummy = new THREE.Object3D();
  let grassCount = 0;
  for (let i = 0; i < 900; i++) {
    const a = rand() * Math.PI * 2, r = 38 + Math.sqrt(rand()) * 89, x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (Math.abs(x) < 30 && Math.abs(z) < 23) continue;
    grassDummy.position.set(x, terrainHeight(x, z) - .02, z); grassDummy.rotation.y = rand() * 6.28; const s = .55 + rand() * .95; grassDummy.scale.setScalar(s); grassDummy.updateMatrix(); grassInstances.setMatrixAt(grassCount++, grassDummy.matrix);
  }
  grassInstances.count = grassCount; grassInstances.instanceMatrix.needsUpdate = true; grassInstances.computeBoundingSphere();
  grassInstances.castShadow = false; grassInstances.receiveShadow = true; scene.add(grassInstances);

  // Low shrubs soften the forest edge and garden beds without a draw call per bush.
  const shrubGeo = new THREE.IcosahedronGeometry(1, 1);
  const shrubMats = [0x536d3e, 0x71814b, 0x405b38].map(color => new THREE.MeshStandardMaterial({ color, roughness: .97 }));
  const shrubs = shrubMats.map(mat => new THREE.InstancedMesh(shrubGeo, mat, 90));
  const shrubCounts = shrubs.map(() => 0), shrubDummy = new THREE.Object3D();
  for (let i = 0; i < 90; i++) {
    let x, z;
    if (i < 35) {
      const angle = rand() * Math.PI * 2, radius = 48 + rand() * 27;
      x = Math.cos(angle) * radius; z = Math.sin(angle) * radius;
    } else {
      const garden = (i - 35) % 4;
      x = [-34, -14, 14, 34][garden] + (rand() - .5) * 5;
      z = 77 + rand() * 10;
    }
    const scale = .45 + rand() * .68, material = i % shrubs.length, index = shrubCounts[material]++;
    shrubDummy.position.set(x, terrainHeight(x, z) + scale * .52, z); shrubDummy.rotation.set((rand() - .5) * .18, rand() * 6.28, (rand() - .5) * .18);
    shrubDummy.scale.set(scale * 1.35, scale * .9, scale); shrubDummy.updateMatrix(); shrubs[material].setMatrixAt(index, shrubDummy.matrix);
  }
  for (let i = 0; i < shrubs.length; i++) {
    const mesh = shrubs[i]; mesh.count = shrubCounts[i]; mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere(); mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh);
  }

  // Landscape rocks use a shared deformed stone mesh and are instanced, with soil beds around roots.
  const rockGeo = new THREE.IcosahedronGeometry(1, 1);
  const rp = rockGeo.attributes.position;
  for (let i = 0; i < rp.count; i++) { const factor = .84 + rand() * .32; rp.setXYZ(i, rp.getX(i) * factor, rp.getY(i) * factor, rp.getZ(i) * factor); }
  rockGeo.computeVertexNormals();
  const rockMats = [0x77766a, 0x8b8678, 0x625f56].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .98 }));
  const rocks = rockMats.map(mat => new THREE.InstancedMesh(rockGeo, mat, 72));
  const rockCounts = rocks.map(() => 0);
  for (let i = 0; i < 72; i++) {
    const a = rand() * Math.PI * 2, r = 40 + rand() * 76, x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (Math.abs(x) < 31 && Math.abs(z) < 25) continue;
    const dummy = new THREE.Object3D(), size = .35 + rand() * 1.1;
    dummy.position.set(x, terrainHeight(x, z) - .08 + size * .35, z); dummy.rotation.set(rand(), rand() * 6.28, rand()); dummy.scale.set(size * 1.4, size * .72, size); dummy.updateMatrix();
    const rockMaterial = i % rocks.length; rocks[rockMaterial].setMatrixAt(rockCounts[rockMaterial]++, dummy.matrix);
  }
  for (let i = 0; i < rocks.length; i++) { const mesh = rocks[i]; mesh.count = rockCounts[i]; mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh); }

  // A small roadside community: homes, service shop, readable openings, porches and planted edges.
  function building(x, z, w, d, sidingMat, shop = false) {
    const firstObject = scene.children.length, firstCollider = colliders.length, baseY = terrainHeight(x, z);
    const floor = .18, wallHeight = shop ? 4.0 : 3.4;
    const wall = .22, doorWidth = 1.16, doorHeight = 2.12;
    // Assemble a shell around an actual front doorway so future interiors can connect through it.
    box(x - (w + doorWidth) / 4, floor + wallHeight / 2, z + d / 2 - wall / 2, (w - doorWidth) / 2, wallHeight, wall, sidingMat, true);
    box(x + (w + doorWidth) / 4, floor + wallHeight / 2, z + d / 2 - wall / 2, (w - doorWidth) / 2, wallHeight, wall, sidingMat, true);
    box(x, floor + doorHeight + (wallHeight - doorHeight) / 2, z + d / 2 - wall / 2, doorWidth, wallHeight - doorHeight, wall, sidingMat, true);
    box(x, floor + wallHeight / 2, z - d / 2 + wall / 2, w, wallHeight, wall, sidingMat, true);
    box(x - w / 2 + wall / 2, floor + wallHeight / 2, z, wall, wallHeight, d, sidingMat, true);
    box(x + w / 2 - wall / 2, floor + wallHeight / 2, z, wall, wallHeight, d, sidingMat, true);
    box(x, -.11, z, w - wall, .58, d - wall, materials.concrete, true);
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-w / 2 - .35, 0); roofShape.lineTo(0, 1.35); roofShape.lineTo(w / 2 + .35, 0); roofShape.closePath();
    const roofDepth = d + .7, roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: roofDepth, bevelEnabled: false, steps: 1 });
    roofGeo.translate(0, 0, -roofDepth / 2);
    const roofMesh = add(new THREE.Mesh(roofGeo, materials.roof));
    roofMesh.position.set(x, floor + wallHeight - .12, z);
    colliders.push({ type: 'roof', x, z, width: w + .7, depth: d + .7, height: wallHeight + 1.35 });
    const front = z + d / 2 + .02;
    // Recessed jambs and threshold articulate the door without adding story behavior.
    box(x - doorWidth / 2 - .07, floor + doorHeight / 2, front - .08, .12, doorHeight, .12, materials.darkMetal);
    box(x + doorWidth / 2 + .07, floor + doorHeight / 2, front - .08, .12, doorHeight, .12, materials.darkMetal);
    box(x, floor + doorHeight + .05, front - .08, doorWidth + .26, .12, .12, materials.darkMetal);
    box(x, .16, front + .23, 1.55, .16, .72, materials.concrete, true);
    box(x - w * .25, floor + 1.9, front, 1.45, .8, .08, materials.glass);
    box(x + w * .25, floor + 1.9, front, 1.45, .8, .08, materials.glass);
    if (shop) {
      box(x, floor + wallHeight + .03, front + .10, w * .73, .32, .12, materials.darkMetal);
      box(x, floor + wallHeight + .04, front + .18, w * .62, .15, .04, materials.yellow);
    }
    colliders.push({ type: 'building', x, z, width: w, depth: d, height: wallHeight, doorways: [{ side: 'front', width: doorWidth, height: doorHeight }] });
    for (const object of scene.children.slice(firstObject)) object.position.y += baseY;
    for (const collider of colliders.slice(firstCollider)) {
      if (collider.type === 'box') collider.y += baseY;
      else if (collider.type === 'roof') collider.y = baseY + wallHeight / 2;
    }
  }
  building(-24, 79, 9, 7, materials.cedar);
  building(24, 79, 10, 8, materials.paleSiding);
  building(-43, 89, 8, 7, materials.siding);
  building(43, 90, 11, 8, materials.brick);
  building(0, 103, 17, 10, materials.siding, true);
  // Sidewalks, garden strips and benches establish a transition out of the forest clearing.
  groundRibbon([[-29, 72], [0, 72], [29, 72]], [3.4, 3.4], materials.concrete, 42);
  for (const x of [-34, -14, 14, 34]) {
    groundRibbon([[x, 76], [x, 82], [x, 89]], [6, 5], materials.dirt, 20);
  }
  for (const x of [-13, 13]) {
    const ground = terrainHeight(x, 64);
    box(x, ground + .34, 64, 2.4, .16, .6, materials.timber);
    for (const leg of [-.8, .8]) box(x + leg, ground + .16, 64, .12, .36, .12, materials.darkMetal);
  }

  // Export simple collider metadata for future physics integration without owning player movement.
  window.PAINTFALL_ARENA_COLLIDERS = colliders.slice();
  window.PAINTFALL_ARENA_SURFACE = { width: 54, depth: 42, floorTop: .012, units: 'world', outdoor: true };
  window.PAINTFALL_WORLD_SCENE = scene;

  let width = 1, height = 1;
  const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(() => resize()) : null;
  function resize() {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  resizeObserver?.observe(host); window.addEventListener('resize', resize);

  const pose = { ex: 0, ey: 8, ez: 28, cx: 0, cy: 1.1, cz: 5, fov: Math.PI * .38, aspect: 1, near: .1, far: 180 };
  let distantLod = false, shadowCellX = NaN, shadowCellZ = NaN;
  function updateLod() {
    const cameraX = camera.position.x, cameraZ = camera.position.z;
    const centerDistance = Math.hypot(cameraX, cameraZ);
    if (!distantLod && centerDistance > 72) distantLod = true;
    else if (distantLod && centerDistance < 54) distantLod = false;
    for (const mesh of [...branchInstances, ...leafInstances]) mesh.visible = !distantLod;
    grassInstances.visible = centerDistance < 85;
    for (const mesh of farCanopy) mesh.visible = distantLod;
    for (const mesh of rocks) mesh.visible = centerDistance < 155;
    const nextX = Math.round(cameraX / 12) * 12, nextZ = Math.round(cameraZ / 12) * 12;
    if (nextX !== shadowCellX || nextZ !== shadowCellZ) {
      shadowCellX = nextX; shadowCellZ = nextZ;
      sun.position.set(nextX - 42, 66, nextZ + 24);
      sun.target.position.set(nextX, 0, nextZ); sun.target.updateMatrixWorld();
    }
  }
  function setCameraPose(next) {
    Object.assign(pose, next);
    pose.ey = Math.max(pose.ey, terrainHeight(pose.ex, pose.ez) + .7);
    pose.cy = Math.max(pose.cy, terrainHeight(pose.cx, pose.cz) + .1);
  }
  function render() {
    camera.fov = THREE.MathUtils.radToDeg(pose.fov);
    camera.aspect = pose.aspect; camera.near = pose.near; camera.far = pose.far;
    camera.position.set(pose.ex, pose.ey, pose.ez);
    camera.lookAt(pose.cx, pose.cy, pose.cz); camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    updateLod(); renderer.render(scene, camera);
  }
  return { scene, camera, renderer, setCameraPose, render, dispose() { resizeObserver?.disconnect(); window.removeEventListener('resize', resize); renderer.dispose(); } };
}

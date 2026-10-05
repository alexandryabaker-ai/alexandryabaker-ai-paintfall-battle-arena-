import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js";

(() => {
  const sourceCanvas = document.getElementById("arena");
  const game = document.getElementById("game");
  if (!sourceCanvas || !game) return;

  const viewport = document.createElement("div");
  viewport.id = "paintfallContest3D";
  viewport.style.cssText = "position:relative;width:100%;height:auto;aspect-ratio:1200/700;border-radius:18px;overflow:hidden;background:#101827;border:1px solid #3b4968;touch-action:none;";
  sourceCanvas.parentNode.insertBefore(viewport, sourceCanvas);
  sourceCanvas.style.display = "none";
  sourceCanvas.setAttribute("aria-hidden", "true");

  const renderCanvas = document.createElement("canvas");
  renderCanvas.style.cssText = "display:block;width:100%;height:100%;touch-action:none;";
  viewport.appendChild(renderCanvas);

  const hud = document.createElement("div");
  hud.textContent = "🎮 3D PAINTFALL ARENA";
  hud.style.cssText = "position:absolute;top:10px;left:12px;z-index:3;font:900 12px system-ui;color:#fff;text-shadow:0 2px 5px #000;pointer-events:none;";
  viewport.appendChild(hud);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9fc9df);
  scene.fog = new THREE.Fog(0x9fc9df, 18, 48);
  const camera = new THREE.PerspectiveCamera(42, 1200 / 700, 0.1, 1000);
  camera.position.set(0, 9.5, 15.5);
  camera.lookAt(0, 1.2, 0);

  const renderer = new THREE.WebGLRenderer({canvas: renderCanvas, antialias:true, powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.add(new THREE.HemisphereLight(0xf8fbff, 0x26351f, 2.2));
  const sun = new THREE.DirectionalLight(0xffffff, 3.2);
  sun.position.set(-7, 14, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048,2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 45;
  sun.shadow.camera.left = -22;
  sun.shadow.camera.right = 22;
  sun.shadow.camera.top = 22;
  sun.shadow.camera.bottom = -22;
  scene.add(sun);
  const rim = new THREE.PointLight(0x7d62ff, 4, 28);
  rim.position.set(5, 6, 8);
  scene.add(rim);

  const mat = (color, roughness=.72, metalness=.03) => new THREE.MeshStandardMaterial({color, roughness, metalness});
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(18,18,.5,96), mat(0x4b7650,.96));
  floor.position.y = -.35;
  floor.receiveShadow = true;
  scene.add(floor);

  const floorAccent = new THREE.Mesh(new THREE.RingGeometry(8.5,8.62,96), new THREE.MeshStandardMaterial({color:0x78b6c8,roughness:.55,metalness:.08}));
  floorAccent.rotation.x=-Math.PI/2;
  floorAccent.position.y=-.08;
  floorAccent.receiveShadow=true;
  scene.add(floorAccent);

  const grid = new THREE.GridHelper(32,32,0x86a99a,0x5b8067);
  grid.position.y=-.08;
  grid.material.transparent=true;
  grid.material.opacity=.16;
  scene.add(grid);

  function box(x,y,z,sx,sy,sz,color){
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz), mat(color,.68,.05));
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
  }
  box(0,1,-9,18,2,.8,0x35415c);
  box(-9,1,0,.8,2,18,0x35415c);
  box(9,1,0,.8,2,18,0x35415c);
  [[-5,.7,-3],[5,.7,-2],[-2,.7,5],[4,.7,6]].forEach(p=>box(p[0],p[1],p[2],3,1.4,1.6,0xe76f51));
  [-7,7].forEach(x=>box(x,1.5,3,2,3,2,0x59677d));

  [[-6,1.8,-6],[6,1.8,-6],[-6,1.8,6],[6,1.8,6]].forEach(p=>{
    const pillar=new THREE.Mesh(new THREE.CylinderGeometry(.28,.42,3.6,18),mat(0x74889a,.42,.16));
    pillar.position.set(...p); pillar.castShadow=true; pillar.receiveShadow=true; scene.add(pillar);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.12,18),mat(0x35d4d8,.35,.28));
    cap.position.set(p[0],3.62,p[2]); cap.castShadow=true; scene.add(cap);
  });

  const paintPuddles=[[-4,-5,0xff5aa5],[3,-4,0x45d7ff],[-5,3,0xffd43b],[5,4,0x9b7cff]];
  paintPuddles.forEach(([x,z,color])=>{
    const puddle=new THREE.Mesh(new THREE.CircleGeometry(.9,32),new THREE.MeshStandardMaterial({color,roughness:.35,metalness:.02,transparent:true,opacity:.72}));
    puddle.rotation.x=-Math.PI/2; puddle.scale.set(1.45,.72,1); puddle.position.set(x,.015,z); puddle.receiveShadow=true; scene.add(puddle);
  });

  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    const g=new THREE.Group();
    const base=new THREE.Mesh(new THREE.CylinderGeometry(.55,.7,1.2,16),mat(0xff4f9a,.55,.05));
    base.position.set(Math.cos(a)*5,.6,Math.sin(a)*5);
    g.add(base);
    scene.add(g);
  }

  const colors=[0x64e5ff,0xff6b8a,0xffd43b,0xb28cff,0x63e6be,0xff922b,0x74c0fc,0xf783ac];
  const actors=new Map();
  const state={players:[],started:false,me:null};

  function makeCharacter(p,index){
    const group=new THREE.Group();
    const suit=mat(colors[index%colors.length],.58);
    const skin=mat(0xc88763,.68);
    const dark=mat(0x171b25,.82);
    const accent=mat(0x32e6ff,.35,.18);

    const body=new THREE.Mesh(new THREE.CapsuleGeometry(.43,.72,8,14),suit);
    body.position.y=1.18; group.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.35,20,16),skin);
    head.position.y=2.08; group.add(head);
    const hair=new THREE.Mesh(new THREE.SphereGeometry(.38,18,12,0,Math.PI*2,0,Math.PI*.62),dark);
    hair.position.y=2.2; group.add(hair);

    [-.12,.12].forEach(x=>{
      const eye=new THREE.Mesh(new THREE.SphereGeometry(.038,8,8),dark);
      eye.position.set(x,2.08,-.34); group.add(eye);
    });

    const armGeo=new THREE.CapsuleGeometry(.11,.58,7,10);
    const left=new THREE.Mesh(armGeo,skin), right=left.clone();
    left.position.set(-.54,1.18,0); right.position.set(.54,1.18,0);
    group.add(left,right);

    const legGeo=new THREE.CapsuleGeometry(.14,.68,7,10);
    const ll=new THREE.Mesh(legGeo,dark), lr=ll.clone();
    ll.position.set(-.19,.4,0); lr.position.set(.19,.4,0);
    group.add(ll,lr);

    const bootGeo=new THREE.BoxGeometry(.28,.16,.55);
    const bl=new THREE.Mesh(bootGeo,dark), br=bl.clone();
    bl.position.set(-.2,.02,-.08); br.position.set(.2,.02,-.08);
    group.add(bl,br);

    const blaster=new THREE.Mesh(new THREE.CylinderGeometry(.055,.075,.6,10),accent);
    blaster.rotation.z=-Math.PI/2;
    blaster.position.set(.56,1.02,-.16);
    group.add(blaster);

    const ring=new THREE.Mesh(new THREE.TorusGeometry(.48,.025,8,24),accent);
    ring.rotation.x=Math.PI/2; ring.position.y=.03; group.add(ring);

    const shadow=new THREE.Mesh(new THREE.CircleGeometry(.58,24),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.28}));
    shadow.rotation.x=-Math.PI/2; shadow.position.y=-.02; group.add(shadow);

    group.userData={id:p.id,character:p.character||"Maya",body,left,right,ll,lr,ring};
    group.scale.setScalar(1.35);
    group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
    scene.add(group);
    return group;
  }

  function sync(m){
    state.players=Array.isArray(m.players)?m.players:[];
    state.started=!!m.started;
    if(m.id) state.me=m.id;
    const live=new Set();
    state.players.forEach((p,i)=>{
      live.add(p.id);
      let actor=actors.get(p.id);
      if(!actor){ actor=makeCharacter(p,i); actors.set(p.id,actor); }
      const x=((Number(p.x)||600)-600)/34;
      const z=((Number(p.y)||350)-350)/34;
      actor.position.set(x,0,z);
      actor.visible=p.alive!==false;
      const moving=Math.abs((p.x||0)-(actor.userData.lastX??p.x||0))>.2 || Math.abs((p.y||0)-(actor.userData.lastY??p.y||0))>.2;
      const t=performance.now()*.009;
      actor.userData.body.position.y=1.18+(moving?Math.abs(Math.sin(t))*.06:0);
      actor.userData.left.rotation.z=moving?Math.sin(t)*.14:0;
      actor.userData.right.rotation.z=moving?-Math.sin(t)*.14:0;
      actor.userData.ll.rotation.z=moving?-Math.sin(t)*.10:0;
      actor.userData.lr.rotation.z=moving?Math.sin(t)*.10:0;
      actor.userData.ring.material.emissive?.setHex?.(0x101020);
      actor.userData.lastX=p.x; actor.userData.lastY=p.y;
    });
    actors.forEach((actor,id)=>{if(!live.has(id)){scene.remove(actor);actors.delete(id);}});
  }

  window.addEventListener("paintfall-3d-state",e=>sync(e.detail||{}));

  function resize(){
    const r=viewport.getBoundingClientRect();
    const w=Math.max(1,r.width),h=Math.max(1,r.height);
    camera.aspect=w/h; camera.updateProjectionMatrix();
    renderer.setSize(w,h,false);
  }
  addEventListener("resize",resize);
  resize();

  function animate(){
    actors.forEach(actor=>{
      actor.rotation.y += .0015;
      const pulse=1+Math.sin(performance.now()*.003+actor.position.x)*.012;
      actor.userData.ring.scale.setScalar(pulse);
    });
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.PAINTFALL_CONTEST_3D_ACTIVE=true;
  window.dispatchEvent(new CustomEvent("paintfall-contest-3d-ready"));
})();
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js";

(() => {
  const sourceCanvas = document.getElementById("arena");
  const game = document.getElementById("game");
  if (!sourceCanvas || !game) return;

  const viewport = document.createElement("div");
  viewport.id = "paintfallContest3D";
  viewport.style.cssText = "position:relative;width:100%;height:auto;aspect-ratio:1020/720;border-radius:18px;overflow:hidden;background:#101827;border:1px solid #3b4968;touch-action:none;";
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
  scene.background = new THREE.Color(0x8ea9b5);
  scene.fog = new THREE.Fog(0x8ea9b5, 24, 68);
  const camera = new THREE.PerspectiveCamera(48, 1020 / 720, 0.1, 1000);
  camera.position.set(0, 7.2, 15.8);
  camera.lookAt(0, 1.25, 0);

  const renderer = new THREE.WebGLRenderer({canvas: renderCanvas, antialias:true, powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.add(new THREE.HemisphereLight(0xeaf7ff, 0x101512, 1.15));
  const sun = new THREE.DirectionalLight(0xfff0d2, 4.6);
  sun.position.set(-12, 18, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096,4096);
  sun.shadow.bias = -0.00012;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 65;
  sun.shadow.camera.left = -27;
  sun.shadow.camera.right = 27;
  sun.shadow.camera.top = 27;
  sun.shadow.camera.bottom = -27;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x789dca, 0.6);
  fill.position.set(10, 9, -12);
  scene.add(fill);

  function noiseTexture(base, variance=18, scale=512){
    const c=document.createElement("canvas"); c.width=c.height=scale;
    const ctx=c.getContext("2d"); const img=ctx.createImageData(scale,scale);
    const [r,g,b]=base;
    for(let i=0;i<img.data.length;i+=4){
      const n=(Math.random()-.5)*variance;
      img.data[i]=Math.max(0,Math.min(255,r+n));
      img.data[i+1]=Math.max(0,Math.min(255,g+n));
      img.data[i+2]=Math.max(0,Math.min(255,b+n));
      img.data[i+3]=255;
    }
    ctx.putImageData(img,0,0);
    const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=renderer.capabilities.getMaxAnisotropy(); return t;
  }

  const floorTex=noiseTexture([76,84,76],34,512); floorTex.repeat.set(9,9);
  const wallTex=noiseTexture([66,72,78],26,512); wallTex.repeat.set(4,4);
  const metalTex=noiseTexture([82,86,88],20,512); metalTex.repeat.set(2,2);
  const mat = (color, roughness=.72, metalness=.03, map=null, bumpScale=.055) => new THREE.MeshStandardMaterial({color,roughness,metalness,map,bumpMap:map,bumpScale});

  const floor = new THREE.Mesh(new THREE.CylinderGeometry(18,18,.5,192), mat(0x5b645b,.9,.02,floorTex,.12));
  floor.position.y = -.35; floor.receiveShadow = true; scene.add(floor);

  const floorInner = new THREE.Mesh(new THREE.CylinderGeometry(13.8,13.8,.08,192), mat(0x727970,.94,.01,floorTex,.07));
  floorInner.position.y=-.08; floorInner.receiveShadow=true; scene.add(floorInner);

  const floorAccent = new THREE.Mesh(new THREE.RingGeometry(8.5,8.62,160), new THREE.MeshStandardMaterial({color:0x9fb3b8,roughness:.6,metalness:.08}));
  floorAccent.rotation.x=-Math.PI/2; floorAccent.position.y=.01; floorAccent.receiveShadow=true; scene.add(floorAccent);

  function box(x,y,z,sx,sy,sz,color,rough=.68,metal=.05,map=wallTex){
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz), mat(color,rough,metal,map,.075));
    m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; scene.add(m); return m;
  }
  box(0,1,-9,18,2,.8,0x4a5258,.82,.2,wallTex);
  box(-9,1,0,.8,2,18,0x4a5258,.82,.2,wallTex);
  box(9,1,0,.8,2,18,0x4a5258,.82,.2,wallTex);

  [-6,6].forEach(x=>[-7,7].forEach(z=>{
    box(x,3.1,z,.42,6.2,.42,0x343a40,.34,.65,metalTex);
    box(x,6.25,z,1.0,.18,1.0,0x59636b,.28,.7,metalTex);
  }));
  box(0,6.05,-8.65,12.5,.32,.32,0x30373d,.32,.72,metalTex);
  box(0,6.05,8.65,12.5,.32,.32,0x30373d,.32,.72,metalTex);

  // Modular industrial cover pieces create real sightlines and visual scale.
  [[-5,.7,-3],[5,.7,-2],[-2,.7,5],[4,.7,6]].forEach(p=>{
    box(p[0],p[1],p[2],3,1.4,1.6,0x777a72,.58,.12,wallTex);
    box(p[0],1.43,p[2],3.05,.08,1.65,0x4e5557,.42,.3,metalTex);
  });
  [-7,7].forEach(x=>box(x,1.5,3,2,3,2,0x59636b,.46,.3,metalTex));

  [[-6,1.8,-6],[6,1.8,-6],[-6,1.8,6],[6,1.8,6]].forEach(p=>{
    const pillar=new THREE.Mesh(new THREE.CylinderGeometry(.28,.42,3.6,32),mat(0x778087,.38,.25,metalTex,.08));
    pillar.position.set(...p); pillar.castShadow=true; pillar.receiveShadow=true; scene.add(pillar);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.12,32),mat(0x35bfc4,.35,.35));
    cap.position.set(p[0],3.62,p[2]); cap.castShadow=true; scene.add(cap);
  });

  const paintPuddles=[[-4,-5,0xff3f91],[3,-4,0x27c7ed],[-5,3,0xffc928],[5,4,0x8b65ed]];
  paintPuddles.forEach(([x,z,color])=>{
    const puddle=new THREE.Mesh(new THREE.CircleGeometry(.9,64),new THREE.MeshStandardMaterial({color,roughness:.2,metalness:.03,transparent:true,opacity:.84}));
    puddle.rotation.x=-Math.PI/2; puddle.scale.set(1.45,.72,1); puddle.position.set(x,.045,z); puddle.receiveShadow=true; scene.add(puddle);
    for(let i=0;i<7;i++){
      const dot=new THREE.Mesh(new THREE.SphereGeometry(.035+Math.random()*.07,12,10),new THREE.MeshStandardMaterial({color,roughness:.2,metalness:.02}));
      dot.position.set(x+(Math.random()-.5)*1.9,.05,z+(Math.random()-.5)*1.25); dot.scale.y=.18; dot.castShadow=true; scene.add(dot);
    }
  });

  [-4,4].forEach(x=>{
    const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.16,.22,2.8,20),mat(0x252a2e,.36,.6,metalTex,.04));
    lamp.position.set(x,2.2,-7.9); lamp.castShadow=true; scene.add(lamp);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(.22,24,16),new THREE.MeshStandardMaterial({color:0xcffcff,emissive:0x66dbe8,emissiveIntensity:3.5,roughness:.2}));
    glow.position.set(x,3.65,-7.9); scene.add(glow);
    const point=new THREE.PointLight(0x63dce8,2.4,9); point.position.set(x,3.6,-7.6); scene.add(point);
  });

  // PAINTFALL signature chaos: airborne droplets catch the arena lighting.
  const droplets=[];
  const dropColors=[0xff3f91,0x27c7ed,0xffc928,0x8b65ed,0x63e6be];
  for(let i=0;i<90;i++){
    const d=new THREE.Mesh(new THREE.SphereGeometry(.018+Math.random()*.035,8,6),new THREE.MeshStandardMaterial({color:dropColors[i%dropColors.length],roughness:.22,metalness:.03}));
    d.position.set((Math.random()-.5)*15,.12+Math.random()*2.8,(Math.random()-.5)*14); d.castShadow=true; scene.add(d); droplets.push({m:d,phase:Math.random()*Math.PI*2});
  }

  const colors=[0x64e5ff,0xff6b8a,0xffd43b,0xb28cff,0x63e6be,0xff922b,0x74c0fc,0xf783ac];
  const actors=new Map();
  const state={players:[],started:false,me:null};

  function makeCharacter(p,index){
    const group=new THREE.Group();
    const suit=mat(colors[index%colors.length],.55);
    const skin=mat(0xc88763,.62);
    const dark=mat(0x171b25,.78,.08,metalTex,.035);
    const accent=mat(0x32e6ff,.3,.2);
    const body=new THREE.Mesh(new THREE.CapsuleGeometry(.43,.72,10,18),suit); body.position.y=1.18; group.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.35,28,20),skin); head.position.y=2.08; group.add(head);
    const hair=new THREE.Mesh(new THREE.SphereGeometry(.38,24,16,0,Math.PI*2,0,Math.PI*.62),dark); hair.position.y=2.2; group.add(hair);
    [-.12,.12].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.038,10,8),dark); eye.position.set(x,2.08,-.34); group.add(eye);});
    const armGeo=new THREE.CapsuleGeometry(.11,.58,8,12); const left=new THREE.Mesh(armGeo,skin), right=left.clone(); left.position.set(-.54,1.18,0); right.position.set(.54,1.18,0); group.add(left,right);
    const legGeo=new THREE.CapsuleGeometry(.14,.68,8,12); const ll=new THREE.Mesh(legGeo,dark), lr=ll.clone(); ll.position.set(-.19,.4,0); lr.position.set(.19,.4,0); group.add(ll,lr);
    const bootGeo=new THREE.BoxGeometry(.28,.16,.55); const bl=new THREE.Mesh(bootGeo,dark), br=bl.clone(); bl.position.set(-.2,.02,-.08); br.position.set(.2,.02,-.08); group.add(bl,br);
    const blaster=new THREE.Mesh(new THREE.CylinderGeometry(.055,.075,.6,12),accent); blaster.rotation.z=-Math.PI/2; blaster.position.set(.56,1.02,-.16); group.add(blaster);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.48,.025,10,32),accent); ring.rotation.x=Math.PI/2; ring.position.y=.03; group.add(ring);
    group.userData={id:p.id,character:p.character||"Maya",body,left,right,ll,lr,ring}; group.scale.setScalar(1.35);
    group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}}); scene.add(group); return group;
  }

  function sync(m){
    state.players=Array.isArray(m.players)?m.players:[]; state.started=!!m.started; if(m.id) state.me=m.id;
    const live=new Set();
    state.players.forEach((p,i)=>{
      live.add(p.id); let actor=actors.get(p.id); if(!actor){actor=makeCharacter(p,i);actors.set(p.id,actor);}
      const x=((Number(p.x)||600)-600)/34, z=((Number(p.y)||350)-350)/34; actor.position.set(x,0,z); actor.visible=p.alive!==false;
      const moving=Math.abs((p.x||0)-(actor.userData.lastX??p.x||0))>.2||Math.abs((p.y||0)-(actor.userData.lastY??p.y||0))>.2; const t=performance.now()*.009;
      actor.userData.body.position.y=1.18+(moving?Math.abs(Math.sin(t))*.06:0); actor.userData.left.rotation.z=moving?Math.sin(t)*.14:0; actor.userData.right.rotation.z=moving?-Math.sin(t)*.14:0; actor.userData.ll.rotation.z=moving?-Math.sin(t)*.10:0; actor.userData.lr.rotation.z=moving?Math.sin(t)*.10:0; actor.userData.lastX=p.x; actor.userData.lastY=p.y;
    });
    actors.forEach((actor,id)=>{if(!live.has(id)){scene.remove(actor);actors.delete(id);}});
  }
  window.addEventListener("paintfall-3d-state",e=>sync(e.detail||{}));

  function resize(){const r=viewport.getBoundingClientRect();const w=Math.max(1,r.width),h=Math.max(1,r.height);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
  addEventListener("resize",resize); resize();
  function animate(){
    const now=performance.now()*.001;
    actors.forEach(actor=>{actor.rotation.y+=.0012;const pulse=1+Math.sin(now*3+actor.position.x)*.012;actor.userData.ring.scale.setScalar(pulse);});
    droplets.forEach((d,i)=>{d.m.position.y=.12+((now*.18+d.phase)%2.8);d.m.position.x+=Math.sin(now*.35+d.phase)*.0007;});
    renderer.render(scene,camera); requestAnimationFrame(animate);
  }
  animate();
  window.PAINTFALL_CONTEST_3D_ACTIVE=true; window.dispatchEvent(new CustomEvent("paintfall-contest-3d-ready"));
})();
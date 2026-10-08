import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';

(() => {
  const canvas = document.getElementById('arena');
  if (!canvas) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'paintfall3DViewport';
  Object.assign(wrapper.style, { position:'relative', width:'100%', lineHeight:'0' });
  canvas.parentNode.insertBefore(wrapper, canvas);
  wrapper.appendChild(canvas);

  const overlay = document.createElement('div');
  overlay.id = 'paintfall3DScene';
  Object.assign(overlay.style, { position:'absolute', inset:'0', pointerEvents:'none', zIndex:'5', borderRadius:'18px', overflow:'hidden' });
  wrapper.appendChild(overlay);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1200/700, 0.1, 1000);
  camera.position.set(0, 7, 34);
  camera.lookAt(0, 3.2, 0);

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.width='100%';
  renderer.domElement.style.height='100%';
  overlay.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xf5f7ff, 0x20263a, 2.6));
  const key = new THREE.DirectionalLight(0xffffff, 3.1);
  key.position.set(-8, 12, 18);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8b5cff, 2.0);
  rim.position.set(10, 6, 7);
  scene.add(rim);
  const fill = new THREE.PointLight(0x31e8ff, 18, 55, 2);
  fill.position.set(0, 7, 10);
  scene.add(fill);

  const roster = {
    Maya:{skin:0xb97852,hair:0x2a1712,shirt:0x6c63ff,accent:0x55e6ff,style:'ponytail'},
    Zara:{skin:0x8d5a3b,hair:0x17110e,shirt:0xe64b62,accent:0xffd34e,style:'braids'},
    Nova:{skin:0xf0c5a4,hair:0x17151a,shirt:0x20b978,accent:0xff6b9f,style:'rocker'},
    Skye:{skin:0xe5b18e,hair:0x704522,shirt:0x20aeb8,accent:0xff4d8d,style:'waves'},
    Jax:{skin:0x75452d,hair:0x17110e,shirt:0x3d7cff,accent:0x31e8ff,style:'dreads'},
    Rico:{skin:0xa96645,hair:0x25140f,shirt:0xe34b31,accent:0xffd34e,style:'warrior'},
    Kai:{skin:0xb9784f,hair:0x21140f,shirt:0x8b5cff,accent:0x35e6ff,style:'messy'},
    Dante:{skin:0xc98b68,hair:0x4a2415,shirt:0x704522,accent:0xff8a32,style:'bowl'}
  };

  const actors = new Map();
  const state = { me:null, players:[] };
  const mat = (color, roughness=.72, metalness=.04) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const darkMat = mat(0x151923,.82);

  function addBadge(group, color) {
    const badge = new THREE.Mesh(new THREE.TorusGeometry(.24,.045,8,24), mat(color,.48,.12));
    badge.rotation.x=Math.PI/2;
    badge.position.set(0,1.17,-.48);
    group.add(badge);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.08,10,8), mat(color,.35,.18));
    dot.position.set(0,1.17,-.55);
    group.add(dot);
  }

  function addHair(group, style, material) {
    if (style==='ponytail') {
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.39,18,12,0,Math.PI*2,0,Math.PI*.58),material); cap.position.y=2.18; group.add(cap);
      const pony=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.55,6,10),material); pony.position.set(0,2.02,.33); pony.rotation.x=-.35; group.add(pony);
    } else if (style==='braids') {
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.38,18,12,0,Math.PI*2,0,Math.PI*.6),material); cap.position.y=2.17; group.add(cap);
      [-.28,.28].forEach(x=>{const braid=new THREE.Mesh(new THREE.CapsuleGeometry(.075,.62,6,10),material);braid.position.set(x,1.95,.08);group.add(braid);});
    } else if (style==='rocker') {
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.39,18,12,0,Math.PI*2,0,Math.PI*.62),material); cap.position.y=2.19; cap.scale.set(1.08,1,1.02); group.add(cap);
      const bang=new THREE.Mesh(new THREE.CapsuleGeometry(.08,.44,5,8),material); bang.position.set(-.22,2.19,-.26); bang.rotation.z=-.55; group.add(bang);
      const streak=new THREE.Mesh(new THREE.BoxGeometry(.05,.34,.03),mat(0xff4d9d,.45)); streak.position.set(-.23,2.25,-.32); streak.rotation.z=-.55; group.add(streak);
    } else if (style==='waves') {
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.40,18,12),material); cap.scale.set(1,.92,1.02); cap.position.y=2.08; group.add(cap);
      [-.33,.33].forEach(x=>{const wave=new THREE.Mesh(new THREE.CapsuleGeometry(.09,.5,5,8),material);wave.position.set(x,1.98,.06);wave.rotation.z=x<0?-.22:.22;group.add(wave);});
    } else if (style==='dreads') {
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.38,18,12,0,Math.PI*2,0,Math.PI*.62),material); cap.position.y=2.2; group.add(cap);
      [-.28,-.14,0,.14,.28].forEach((x,i)=>{const d=new THREE.Mesh(new THREE.CapsuleGeometry(.065,.55+(i%2)*.12,5,8),material);d.position.set(x,1.92,.08);d.rotation.z=x*.45;group.add(d);});
    } else if (style==='warrior') {
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.37,18,12,0,Math.PI*2,0,Math.PI*.62),material); cap.position.y=2.18; group.add(cap);
      const tail=new THREE.Mesh(new THREE.CapsuleGeometry(.10,.58,6,9),material); tail.position.set(0,1.93,.3); tail.rotation.x=-.3; group.add(tail);
    } else if (style==='messy') {
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.39,16,11),material); cap.scale.set(1.03,.72,1); cap.position.y=2.22; group.add(cap);
      [-.24,0,.24].forEach((x,i)=>{const spike=new THREE.Mesh(new THREE.ConeGeometry(.10,.32,7),material);spike.position.set(x,2.43,.02);spike.rotation.z=(i-1)*.18;group.add(spike);});
    } else {
      const bowl=new THREE.Mesh(new THREE.SphereGeometry(.40,18,12,0,Math.PI*2,0,Math.PI*.58),material); bowl.position.y=2.17; bowl.scale.set(1.08,.9,1.02); group.add(bowl);
      const fringe=new THREE.Mesh(new THREE.BoxGeometry(.56,.12,.08),material); fringe.position.set(0,2.28,-.32); group.add(fringe);
    }
  }

  function makeCharacter(character){
    const c=roster[character]||roster.Maya;
    const group=new THREE.Group();
    const body=new THREE.Group();
    group.add(body);
    const skin=mat(c.skin), hair=mat(c.hair,.9), shirt=mat(c.shirt,.58), accent=mat(c.accent,.42,.12);

    const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.43,.72,8,14),shirt); torso.position.y=1.16; body.add(torso);
    const collar=new THREE.Mesh(new THREE.TorusGeometry(.25,.035,7,18),accent); collar.rotation.x=Math.PI/2; collar.position.y=1.52; body.add(collar);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.35,20,16),skin); head.position.y=2.08; body.add(head);
    addHair(body,c.style,hair);

    const eyeMat=mat(0x10131b,.55);
    [-.12,.12].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.038,8,8),eyeMat);eye.position.set(x,2.07,-.33);body.add(eye);});

    const armL=new THREE.Mesh(new THREE.CapsuleGeometry(.11,.58,7,10),skin),armR=armL.clone();
    armL.position.set(-.54,1.18,0);armR.position.set(.54,1.18,0);body.add(armL,armR);
    const gloveL=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8),accent),gloveR=gloveL.clone();
    gloveL.position.set(-.56,.83,0);gloveR.position.set(.56,.83,0);body.add(gloveL,gloveR);

    const legL=new THREE.Mesh(new THREE.CapsuleGeometry(.14,.68,7,10),darkMat),legR=legL.clone();
    legL.position.set(-.19,.40,0);legR.position.set(.19,.40,0);body.add(legL,legR);
    const bootL=new THREE.Mesh(new THREE.CapsuleGeometry(.15,.28,7,10),darkMat),bootR=bootL.clone();
    bootL.position.set(-.21,.02,-.06);bootR.position.set(.21,.02,-.06);body.add(bootL,bootR);

    const pack=new THREE.Mesh(new THREE.BoxGeometry(.46,.5,.18),mat(0x20283b,.7));pack.position.set(0,1.18,.40);body.add(pack);
    addBadge(body,c.accent);

    const blaster=new THREE.Group();
    const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.055,.07,.55,10),accent);barrel.rotation.z=-Math.PI/2;barrel.position.x=.30;blaster.add(barrel);
    const grip=new THREE.Mesh(new THREE.BoxGeometry(.10,.25,.10),darkMat);grip.position.set(.05,-.10,0);blaster.add(grip);
    blaster.position.set(.58,1.02,-.05);body.add(blaster);

    const shadow=new THREE.Mesh(new THREE.CircleGeometry(.58,28),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.34}));
    shadow.rotation.x=-Math.PI/2;shadow.position.y=-.04;group.add(shadow);

    group.userData.parts={body,armL,armR,legL,legR,blaster,shirt,accent};
    group.userData.character=character;
    group.scale.setScalar(2.15);
    scene.add(group);
    return group;
  }

  function resize(){
    const rect=canvas.getBoundingClientRect();
    const aspect=Math.max(.6,rect.width/Math.max(1,rect.height));
    camera.aspect=aspect;camera.updateProjectionMatrix();renderer.setSize(rect.width,rect.height,false);
  }
  addEventListener('resize',resize);resize();

  function wrapSocket(){
    const Original=window.WebSocket;
    if(!Original||Original.__paintfall3DWrapped)return;
    const Wrapped=function(url,protocols){
      const socket=new Original(url,protocols);
      socket.addEventListener('message',event=>{try{const msg=JSON.parse(event.data);if(msg.type==='joined')state.me=msg.id;if(msg.type==='state')state.players=msg.players||[]}catch{}});
      return socket;
    };
    Wrapped.prototype=Original.prototype;Wrapped.OPEN=Original.OPEN;Wrapped.CLOSED=Original.CLOSED;Wrapped.CLOSING=Original.CLOSING;Wrapped.CONNECTING=Original.CONNECTING;Wrapped.__paintfall3DWrapped=true;window.WebSocket=Wrapped;
  }
  wrapSocket();

  window.addEventListener('paintfall-3d-state',e=>{
    const data=e.detail||{};
    state.me=data.id||null;
    state.players=data.players||[];
  });

  function sync(){
    const list=state.players,seen=new Set(),rect=canvas.getBoundingClientRect();
    const sx=rect.width/1200,sy=rect.height/700;
    list.forEach(p=>{
      seen.add(p.id);
      let actor=actors.get(p.id);
      if(!actor||actor.userData.character!==p.character){
        if(actor)scene.remove(actor);
        actor=makeCharacter(p.character);
        actors.set(p.id,actor);
      }
      actor.position.x=(p.x-600)*sx;
      actor.position.y=(350-p.y)*sy;
      actor.position.z=p.id===state.me?4:0;
      actor.visible=!!p.alive;

      const parts=actor.userData.parts;
      const dx=Math.abs((p.x||0)-((actor.userData.lastX??p.x)||0));
      const dy=Math.abs((p.y||0)-((actor.userData.lastY??p.y)||0));
      const moving=dx>.2||dy>.2;
      const t=performance.now()*.010;
      parts.body.position.y=moving?Math.abs(Math.sin(t))*.06:Math.sin(t*.5)*.015;
      parts.armL.rotation.z=moving?Math.sin(t)*.16:Math.sin(t*.5)*.025;
      parts.armR.rotation.z=moving?-Math.sin(t)*.16:-Math.sin(t*.5)*.025;
      parts.legL.rotation.z=moving?-Math.sin(t)*.12:0;
      parts.legR.rotation.z=moving?Math.sin(t)*.12:0;
      parts.blaster.rotation.y=moving?Math.sin(t)*.06:0;
      actor.userData.lastX=p.x;actor.userData.lastY=p.y;
    });
    actors.forEach((actor,id)=>{if(!seen.has(id)){scene.remove(actor);actors.delete(id);}});
  }

  function animate(){sync();renderer.render(scene,camera);requestAnimationFrame(animate);}
  animate();
  window.PAINTFALL_3D_ACTIVE=true;
})();

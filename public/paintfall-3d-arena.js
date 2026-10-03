import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';

(() => {
  const canvas = document.getElementById('arena');
  if (!canvas) return;
  const wrapper = document.createElement('div');
  wrapper.id = 'paintfall3DViewport';
  Object.assign(wrapper.style, { position: 'relative', width: '100%', lineHeight: '0' });
  canvas.parentNode.insertBefore(wrapper, canvas);
  wrapper.appendChild(canvas);
  const overlay = document.createElement('div');
  overlay.id = 'paintfall3DScene';
  Object.assign(overlay.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '5', borderRadius: '18px', overflow: 'hidden' });
  wrapper.appendChild(overlay);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-600, 600, 350, -350, 0.1, 100);
  camera.position.set(0, 5, 30); camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
  overlay.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x26334a, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-5, 10, 12); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8b5cff, 1.6); rim.position.set(8, 4, 5); scene.add(rim);
  const roster = {
    Maya:{skin:0xb97852,hair:0x2a1712,shirt:0x6c63ff,accent:0x55e6ff,style:'ponytail'},
    Zara:{skin:0x8d5a3b,hair:0x17110e,shirt:0xe64b62,accent:0xffd34e,style:'braids'},
    Nova:{skin:0xf0c5a4,hair:0x17151a,shirt:0x20b978,accent:0xff6b9f,style:'bob'},
    Skye:{skin:0xe5b18e,hair:0x704522,shirt:0x20aeb8,accent:0xff4d8d,style:'messy'},
    Jax:{skin:0x75452d,hair:0x17110e,shirt:0x3d7cff,accent:0x31e8ff,style:'fade'},
    Rico:{skin:0xa96645,hair:0x25140f,shirt:0xe34b31,accent:0xffd34e,style:'curl'},
    Kai:{skin:0xb9784f,hair:0x21140f,shirt:0x8b5cff,accent:0x35e6ff,style:'short'},
    Dante:{skin:0xc98b68,hair:0x4a2415,shirt:0x704522,accent:0xff8a32,style:'short'}
  };
  const actors = new Map(); const state = { me:null, players:[] };
  const mat = (color, roughness=.72) => new THREE.MeshStandardMaterial({color,roughness,metalness:.04});
  function makeCharacter(character){
    const c=roster[character]||roster.Maya, group=new THREE.Group(), body=new THREE.Group(); group.add(body);
    const skin=mat(c.skin),hair=mat(c.hair,.9),shirt=mat(c.shirt,.6),accent=mat(c.accent,.45),dark=mat(0x151923,.85);
    const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.72,6,12),shirt);torso.position.y=1.15;body.add(torso);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.34,18,14),skin);head.position.y=2.05;body.add(head);
    const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.365,18,12,0,Math.PI*2,0,Math.PI*.58),hair);hairCap.position.y=2.15;body.add(hairCap);
    const eyeL=new THREE.Mesh(new THREE.SphereGeometry(.035,8,8),dark),eyeR=eyeL.clone();eyeL.position.set(-.12,2.04,-.315);eyeR.position.set(.12,2.04,-.315);body.add(eyeL,eyeR);
    const armL=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.55,6,10),skin),armR=armL.clone();armL.position.set(-.52,1.18,0);armR.position.set(.52,1.18,0);body.add(armL,armR);
    const legL=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.65,6,10),dark),legR=legL.clone();legL.position.set(-.19,.42,0);legR.position.set(.19,.42,0);body.add(legL,legR);
    const badge=new THREE.Mesh(new THREE.TorusGeometry(.24,.035,8,24),accent);badge.rotation.x=Math.PI/2;badge.position.set(0,1.17,-.43);body.add(badge);
    if(c.style==='ponytail'){const pony=new THREE.Mesh(new THREE.SphereGeometry(.2,12,10),hair);pony.position.set(0,1.98,.3);body.add(pony)}
    else if(c.style==='braids'){[-.29,.29].forEach(x=>{const braid=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.48,5,8),hair);braid.position.set(x,1.98,.08);body.add(braid)})}
    else if(c.style==='bob'){const bob=new THREE.Mesh(new THREE.SphereGeometry(.39,14,10),hair);bob.scale.set(1,.8,.82);bob.position.set(0,2.02,.08);body.add(bob)}
    else if(c.style==='fade'){const fade=new THREE.Mesh(new THREE.BoxGeometry(.56,.11,.42),hair);fade.position.set(0,2.32,.04);body.add(fade)}
    else {const top=new THREE.Mesh(new THREE.SphereGeometry(.27,12,10),hair);top.scale.set(1.05,.62,.9);top.position.set(0,2.27,.02);body.add(top)}
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(.55,24),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.32}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.02;group.add(shadow);
    group.userData.parts={body,armL,armR,legL,legR};group.userData.character=character;group.scale.setScalar(24);scene.add(group);return group;
  }
  function resize(){const rect=canvas.getBoundingClientRect();renderer.setSize(rect.width,rect.height,false)}
  addEventListener('resize',resize);resize();
  function wrapSocket(){
    const Original=window.WebSocket;if(!Original||Original.__paintfall3DWrapped)return;
    const Wrapped=function(url,protocols){const socket=new Original(url,protocols);socket.addEventListener('message',event=>{try{const msg=JSON.parse(event.data);if(msg.type==='joined')state.me=msg.id;if(msg.type==='state')state.players=msg.players||[]}catch{}});return socket};
    Wrapped.prototype=Original.prototype;Wrapped.OPEN=Original.OPEN;Wrapped.CLOSED=Original.CLOSED;Wrapped.CLOSING=Original.CLOSING;Wrapped.CONNECTING=Original.CONNECTING;Wrapped.__paintfall3DWrapped=true;window.WebSocket=Wrapped;
  }
  wrapSocket();
  function sync(){
    const list=state.players,seen=new Set(),rect=canvas.getBoundingClientRect(),sx=rect.width/1200,sy=rect.height/700;
    list.forEach(p=>{
      seen.add(p.id);let actor=actors.get(p.id);
      if(!actor||actor.userData.character!==p.character){if(actor)scene.remove(actor);actor=makeCharacter(p.character);actors.set(p.id,actor)}
      actor.position.x=(p.x-600)*sx;actor.position.y=(350-p.y)*sy;actor.position.z=p.id===state.me?2:0;actor.visible=!!p.alive;
      const parts=actor.userData.parts,moving=Math.abs((p.x||0)-(actor.userData.lastX||p.x||0))>.2||Math.abs((p.y||0)-(actor.userData.lastY||p.y||0))>.2,t=performance.now()*.012,bob=moving?Math.abs(Math.sin(t))*.045:Math.sin(t*.5)*.012;
      parts.body.position.y=bob;parts.armL.rotation.z=moving?Math.sin(t)*.16:Math.sin(t*.5)*.025;parts.armR.rotation.z=moving?-Math.sin(t)*.16:-Math.sin(t*.5)*.025;parts.legL.rotation.z=moving?-Math.sin(t)*.12:0;parts.legR.rotation.z=moving?Math.sin(t)*.12:0;actor.userData.lastX=p.x;actor.userData.lastY=p.y;
    });
    actors.forEach((actor,id)=>{if(!seen.has(id)){scene.remove(actor);actors.delete(id)}});
  }
  function animate(){sync();renderer.render(scene,camera);requestAnimationFrame(animate)}
  animate();window.PAINTFALL_3D_ACTIVE=true;
})();

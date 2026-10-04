import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js";

const state={players:[],started:false};
const OriginalWebSocket=window.WebSocket;
function WrappedWebSocket(...args){
  const ws=new OriginalWebSocket(...args);
  ws.addEventListener("message",event=>{try{const m=JSON.parse(event.data);if(m.type==="state"){state.players=m.players||[];state.started=!!m.started;}}catch{}});
  return ws;
}
WrappedWebSocket.prototype=OriginalWebSocket.prototype;
window.WebSocket=WrappedWebSocket;

const threeCanvas=document.createElement("canvas");
threeCanvas.id="paintfall3d";
threeCanvas.style.cssText="position:fixed;left:0;top:0;z-index:30;pointer-events:none;display:none;";
document.body.appendChild(threeCanvas);

const renderer=new THREE.WebGLRenderer({canvas:threeCanvas,alpha:true,antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff,2.2));
const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(4,8,6);key.castShadow=true;scene.add(key);
const rim=new THREE.PointLight(0x7c4dff,3,20);rim.position.set(-4,4,5);scene.add(rim);
const camera=new THREE.OrthographicCamera(0,1200,700,0,-100,100);camera.position.set(0,0,20);camera.lookAt(0,0,0);

const mayaMat={skin:new THREE.MeshStandardMaterial({color:0xb97852,roughness:.62,metalness:.02}),hair:new THREE.MeshStandardMaterial({color:0x2a1712,roughness:.75}),suit:new THREE.MeshStandardMaterial({color:0x26233f,roughness:.4,metalness:.12}),accent:new THREE.MeshStandardMaterial({color:0x31e8ff,roughness:.28,metalness:.25}),nigeria:new THREE.MeshStandardMaterial({color:0xd5a52a,roughness:.55,metalness:.08}),shoe:new THREE.MeshStandardMaterial({color:0x111522,roughness:.5,metalness:.2})};
const otherMats={skin:new THREE.MeshStandardMaterial({color:0x9a6b50}),suit:new THREE.MeshStandardMaterial({color:0x4b61c8}),accent:new THREE.MeshStandardMaterial({color:0x35e6ff}),hair:new THREE.MeshStandardMaterial({color:0x21140f})};
function mesh(g,m){const o=new THREE.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;return o;}
function limb(material,r=.09,len=.55){return mesh(new THREE.CapsuleGeometry(r,r*2,len,6,10),material);}
function makeCharacter(p){
 const isMaya=p.character==="Maya",mat=isMaya?mayaMat:otherMats,root=new THREE.Group();root.userData.id=p.id;
 const body=mesh(new THREE.CapsuleGeometry(isMaya?.27:.24,.55,8,16),mat.suit);body.position.y=.7;root.add(body);
 const head=mesh(new THREE.SphereGeometry(isMaya?.25:.23,20,16),mat.skin);head.position.y=1.55;root.add(head);
 const hair=mesh(new THREE.SphereGeometry(isMaya?.28:.25,18,14),mat.hair);hair.scale.set(1,1.05,.9);hair.position.set(0,1.68,0);root.add(hair);
 if(isMaya){
  const bun=mesh(new THREE.SphereGeometry(.23,18,14),mat.hair);bun.scale.set(1.1,.82,1);bun.position.set(0,1.98,-.02);root.add(bun);
  const edge=mesh(new THREE.TorusGeometry(.2,.025,6,18),mat.hair);edge.rotation.x=Math.PI/2;edge.position.set(0,1.63,.22);root.add(edge);
  const eyeL=mesh(new THREE.SphereGeometry(.026,8,8),new THREE.MeshStandardMaterial({color:0x8a6a28}));eyeL.position.set(-.085,1.57,.235);root.add(eyeL);const eyeR=eyeL.clone();eyeR.position.x=.085;root.add(eyeR);
  const mark=mesh(new THREE.SphereGeometry(.018,8,8),new THREE.MeshStandardMaterial({color:0x3a1710}));mark.position.set(.16,1.48,.245);root.add(mark);
  const panel=mesh(new THREE.BoxGeometry(.38,.09,.04),mat.nigeria);panel.position.set(0,.83,.27);root.add(panel);
  const tech=mesh(new THREE.BoxGeometry(.44,.045,.035),mat.accent);tech.position.set(0,.62,.27);root.add(tech);
 }
 const armL=limb(mat.suit,isMaya?.075:.08,.55);armL.position.set(-.34,.83,0);armL.rotation.z=-.15;root.add(armL);
 const armR=limb(mat.suit,isMaya?.075:.08,.55);armR.position.set(.34,.83,0);armR.rotation.z=.15;root.add(armR);
 const legL=limb(mat.suit,isMaya?.09:.1,.68);legL.position.set(-.13,.05,0);root.add(legL);
 const legR=limb(mat.suit,isMaya?.09:.1,.68);legR.position.set(.13,.05,0);root.add(legR);
 const shoeL=mesh(new THREE.SphereGeometry(.13,12,8),mat.shoe);shoeL.scale.set(1.25,.55,1.8);shoeL.position.set(-.14,-.36,.08);root.add(shoeL);const shoeR=shoeL.clone();shoeR.position.x=.14;root.add(shoeR);
 root.scale.setScalar(isMaya?1.35:.95);return root;
}
const models=new Map();
function hairStage(p){const hits=p.paintHits||0;if(hits>=9)return 4;if(hits>=7)return 3;if(hits>=5)return 2;if(hits>=3)return 1;return 0;}
function updateHair(root,p){
 if(p.character!=="Maya")return;const stage=hairStage(p),existing=root.userData.hairExtras||[];existing.forEach(o=>root.remove(o));const color=mayaMat.hair;
 if(stage>=1){const curl=mesh(new THREE.TorusGeometry(.13,.055,8,16),color);curl.position.set(-.18,1.86,.02);curl.rotation.x=Math.PI/2;root.add(curl);existing.push(curl);}
 if(stage>=2){const pony=mesh(new THREE.SphereGeometry(.34,16,12),color);pony.scale.set(.75,1.7,.75);pony.position.set(0,1.65,-.2);root.add(pony);existing.push(pony);}
 if(stage>=3){for(let i=0;i<6;i++){const c=mesh(new THREE.SphereGeometry(.18,12,10),color);c.position.set((i-2.5)*.13,1.55+(i%2)*.12,-.2-Math.abs(i-2.5)*.02);root.add(c);existing.push(c);}}
 if(stage>=4){for(let i=0;i<14;i++){const a=i/14*Math.PI*2,c=mesh(new THREE.SphereGeometry(.17,10,8),color);c.position.set(Math.cos(a)*.32,1.65+Math.sin(a)*.28,-.08);root.add(c);existing.push(c);}}
 root.userData.hairExtras=existing;
}
function sync(){
 const arena=document.getElementById("arena");if(!arena)return;const r=arena.getBoundingClientRect();const visible=state.started&&r.width>0&&r.height>0;threeCanvas.style.display=visible?"block":"none";if(!visible)return;
 threeCanvas.style.left=r.left+"px";threeCanvas.style.top=r.top+"px";threeCanvas.style.width=r.width+"px";threeCanvas.style.height=r.height+"px";renderer.setSize(Math.max(1,Math.round(r.width)),Math.max(1,Math.round(r.height)),false);camera.left=0;camera.right=1200;camera.top=700;camera.bottom=0;camera.updateProjectionMatrix();
 const live=new Set();state.players.forEach(p=>{live.add(p.id);let root=models.get(p.id);if(!root){root=makeCharacter(p);scene.add(root);models.set(p.id,root);}root.position.set(p.x,700-p.y,0);root.visible=!!p.alive;root.rotation.y=Math.sin(performance.now()/900)*.06;updateHair(root,p);});
 for(const [id,root] of models){if(!live.has(id)){scene.remove(root);models.delete(id);}}renderer.render(scene,camera);
}
window.addEventListener("resize",sync);setInterval(sync,50);

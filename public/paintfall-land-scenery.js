import {treeProfile,nativeTreeProfiles} from './paintfall-native-trees.js';
import {buildArizonaPaloVerde} from './paintfall-arizona-trees.js';
export function buildLandScenery(T,{land,state,style,ground,spawn}){
 const group=new T.Group();group.name='natural-scenery';land.add(group);let seed=[...state].reduce((n,c)=>n*31+c.charCodeAt(0),7)>>>0;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const mats={leaf:new T.MeshStandardMaterial({color:0x83baa0,roughness:.95}),violet:new T.MeshStandardMaterial({color:0xab94ce,roughness:.9}),trunk:new T.MeshStandardMaterial({color:0x9c8473}),stone:new T.MeshStandardMaterial({color:0xb8a3ca,roughness:1}),sand:new T.MeshStandardMaterial({color:0xd9b191}),ice:new T.MeshStandardMaterial({color:0xb3e2ef,roughness:.35}),berry:new T.MeshStandardMaterial({color:0xde7295})};
 function mesh(parent,geometry,material,x,y,z){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);parent.add(m);return m;}
 function tree(p,i){
  const profile=treeProfile(state,i),form=profile.form,g=new T.Group();g.userData.species=profile.species;g.position.copy(p);g.rotation.y=rand()*Math.PI*2;group.add(g);const h=form==='redwood'?8+rand()*4:form==='desert'?3+rand()*2:4+rand()*3,thickness=form==='redwood'?.55:.27;
  if(state==='Arizona'&&form==='desert'){
   // Consume the old lean + 9*6 canopy samples so every later placement stays
   // identical to the shared server collision/spawn catalog.
   const phase=rand();for(let sample=0;sample<54;sample++)rand();
   buildArizonaPaloVerde(T,{group:g,height:h,variant:i,phase});return;
  }
  function branch(a,b,r){const delta=b.clone().sub(a),wood=mesh(g,new T.CylinderGeometry(r*.45,r,delta.length(),9),mats.trunk,...a.clone().add(b).multiplyScalar(.5).toArray());wood.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());wood.name='tapered branch';}
  const lean=(rand()-.5)*.45;branch(new T.Vector3(),new T.Vector3(lean,h,0),thickness);
  for(let j=0;j<5;j++){const a=j/5*Math.PI*2;branch(new T.Vector3(0,.35,0),new T.Vector3(Math.cos(a)*thickness*2.8,.05,Math.sin(a)*thickness*2.8),thickness*.55);}
  const conifer=['pine','conifer','redwood','cypress'].includes(form);
  if(form==='palm'){for(let j=0;j<9;j++){const a=j/9*Math.PI*2;const frond=mesh(g,new T.ConeGeometry(.6,h*.55,3),mats.leaf,Math.cos(a)*h*.22,h,Math.sin(a)*h*.22);frond.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(Math.cos(a),-.25,Math.sin(a)).normalize());}}
  else if(conifer){for(let tier=0;tier<6;tier++){const y=h*.35+tier*h*.11,r=h*(form==='pine'?.34:.24)*(1-tier/7);for(let j=0;j<4;j++){const a=j/4*Math.PI*2+tier*.55,end=new T.Vector3(Math.cos(a)*r,y+.2,Math.sin(a)*r);branch(new T.Vector3(lean*y/h,y,0),end,thickness*.23);const spray=mesh(g,new T.ConeGeometry(r*.68,h*.27,9),tier===3&&i%5===0?mats.violet:mats.leaf,end.x*.65,y+h*.12,end.z*.65);spray.scale.z=.75;spray.rotation.z=(rand()-.5)*.18;}}}
  else{for(let j=0;j<9;j++){const a=j*2.4,r=h*(.2+rand()*.15),y=h*(.58+rand()*.25),end=new T.Vector3(Math.cos(a)*r,y+.7,Math.sin(a)*r);branch(new T.Vector3(lean*y/h,y,0),end,thickness*.4);const leaves=mesh(g,new T.IcosahedronGeometry(h*(.18+rand()*.07),1),i%5===0&&j%3===0?mats.violet:mats.leaf,end.x,end.y,end.z);leaves.scale.set(1.15,.8+rand()*.2,.8+rand()*.35);leaves.rotation.y=rand()*6.28;}mesh(g,new T.IcosahedronGeometry(h*.24,1),mats.leaf,lean,h,0);}
  if(form==='birch'){const pale=new T.MeshStandardMaterial({color:0xe3d9c8,roughness:.95});g.traverse(o=>{if(o.name==='tapered branch')o.material=pale;});}
  if(form==='desert'){g.traverse(o=>{if(o.name==='tapered branch')o.material=mats.leaf;});g.scale.set(1.2,.8,1.2);}
  if(form==='oak')g.scale.set(1.3,.9,1.3);
  if(form==='ohia'){for(let j=0;j<5;j++)mesh(g,new T.SphereGeometry(.18,6,5),mats.berry,Math.cos(j)*h*.2,h+.15,Math.sin(j)*h*.2);}
  g.name=profile.species+' — PAINTFALL tree study';
 }
 function rock(p,i){const r=mesh(group,new T.DodecahedronGeometry(.7+rand()*1.1,0),style==='ice'?mats.ice:style==='desert'?mats.sand:mats.stone,p.x,p.y+.6,p.z);r.scale.set(1,style==='ice'?2.8:1+rand(),.8);r.rotation.y=rand()*6.28;r.name='natural rock study';}
 function cactus(p){const g=new T.Group();g.position.copy(p);group.add(g);mesh(g,new T.CylinderGeometry(.3,.4,4,8),mats.leaf,0,2,0);for(const side of [-1,1]){const arm=mesh(g,new T.CylinderGeometry(.22,.22,1.2,7),mats.leaf,side*.6,2.4,0);arm.rotation.z=Math.PI/2;mesh(g,new T.CylinderGeometry(.22,.22,1.5,7),mats.leaf,side*1.1,3,0);}g.name='saguaro-inspired study';}
 let placed=0;for(let i=0;i<110&&placed<30;i++){const a=rand()*Math.PI*2,r=7+rand()*27,x=spawn.x+Math.cos(a)*r,z=spawn.z+Math.sin(a)*r;if(Math.abs(x)>55||Math.abs(z)>55||(state==='Wisconsin'&&(Math.hypot(x-18,z+3)<6.5||Math.hypot(x-18,(z+16)*1.35)<4.8)))continue;const p=ground(x,z);if(!p)continue;
  if(state==='Arizona'&&placed%3===0)cactus(p);else if(placed%4===0||(['ice','prairie','desert'].includes(style)&&placed%3!==1))rock(p,placed);else tree(p,placed);
  if(state==='Wisconsin'&&placed%5===0){for(let j=0;j<6;j++){mesh(group,new T.SphereGeometry(.16,6,5),mats.berry,p.x+(j%3)*.35,p.y+.25,p.z+Math.floor(j/3)*.4);}group.children.at(-1).name='cranberry-color planting study';}placed++;
 }
 if(state==='Utah'){const p=ground(spawn.x+8,spawn.z+5);if(p){const arch=new T.Mesh(new T.TorusGeometry(2.7,.6,8,18,Math.PI),mats.sand);arch.position.copy(p).add(new T.Vector3(0,.6,0));arch.name='sandstone-arch study';group.add(arch);}}
 const features=[];
 if(state==='Wisconsin'){
  const waterMaterial=new T.MeshStandardMaterial({color:0x78ccdc,transparent:true,opacity:.82,roughness:.25,metalness:.12});
  const lake=mesh(group,new T.CircleGeometry(6,48),waterMaterial,18,1.7,-3);lake.rotation.x=-Math.PI/2;lake.name='Wisconsin lakefront study';features.push(lake.name);
  const secondLake=mesh(group,new T.CircleGeometry(4.5,40),waterMaterial,18,1.7,-16);secondLake.rotation.x=-Math.PI/2;secondLake.scale.y=1/1.35;secondLake.name='Madison-inspired paired lakes';features.push(secondLake.name);
  const violet=new T.MeshStandardMaterial({color:0x9972d5,roughness:.8}),flowerCenter=new T.MeshStandardMaterial({color:0xf5df99});
  for(let patch=0;patch<5;patch++)for(let j=0;j<4;j++){const x=-5+patch*2+j*.25,z=4+Math.sin(patch*1.4)*2+j*.4,p=ground(x,z);if(!p)continue;const flower=new T.Group();flower.name='wood violet study';flower.position.copy(p);group.add(flower);for(let k=0;k<5;k++){const a=k/5*Math.PI*2,petal=mesh(flower,new T.SphereGeometry(.13,7,5),violet,Math.cos(a)*.15,.23,Math.sin(a)*.15);petal.scale.set(1,.28,k===3?1.4:1);}mesh(flower,new T.SphereGeometry(.04,6,4),flowerCenter,0,.25,0);for(const side of [-1,1]){const leaf=mesh(flower,new T.SphereGeometry(.15,6,4),mats.leaf,side*.17,.08,.08);leaf.scale.y=.2;}}
  features.push('wood violet patches');
  for(let i=0;i<6;i++){const x=-11+i*2.3,z=15+Math.sin(i)*1.4,p=ground(x,z);if(!p)continue;const layers=3+(i%3);for(let layer=0;layer<layers;layer++){const stone=mesh(group,new T.CylinderGeometry(1.1-layer*.12,1.25-layer*.1,.65,10),layer%2?mats.sand:mats.stone,x,p.y+.325+layer*.65,z);stone.scale.z=.7;stone.name='Dells-inspired sandstone layer';}}
  features.push('Dells-inspired sandstone formations');
  const streamPoints=[];for(let i=0;i<=28;i++){const t=i/28,x=-13+t*26,z=14-t*16+Math.sin(t*Math.PI*2)*2,p=ground(x,z);if(p)streamPoints.push(new T.Vector3(x,p.y+.08,z));}if(streamPoints.length>3){const river=mesh(group,new T.TubeGeometry(new T.CatmullRomCurve3(streamPoints),60,.28,5,false),waterMaterial,0,0,0);river.name='quiet wetland stream';features.push(river.name);}
  const seedHeads=new T.MeshStandardMaterial({color:0x8c7264});for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r=6.8+rand()*.6,x=18+Math.cos(a)*r,z=-3+Math.sin(a)*r,p=ground(x,z);if(!p)continue;const h=1.3+rand()*.6;mesh(group,new T.CylinderGeometry(.035,.055,h,5),mats.leaf,x,p.y+h/2,z);mesh(group,new T.CapsuleGeometry(.09,.3,3,5),seedHeads,x,p.y+h,z);}
  features.push('wetland cattail study');
  for(let i=0;i<7;i++){const x=-15+i*1.4,z=-6+Math.sin(i*1.7)*3,p=ground(x,z);if(!p)continue;const boulder=mesh(group,new T.IcosahedronGeometry(1,2),i%3===0?mats.violet:mats.stone,x,p.y+.55,z);boulder.scale.set(1+rand(),.7+rand(),1.2+rand());boulder.name='glacial boulder study';}features.push('glacial boulder study');
 }
 return{group,placed,nativeTree:nativeTreeProfiles[state]?.species||'Original canopy study',features};
}


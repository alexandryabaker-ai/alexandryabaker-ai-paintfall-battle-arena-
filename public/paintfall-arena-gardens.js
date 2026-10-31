// Garden Park foundations: scenery and a reserved entrance, not an open ride.
import {buildGardenPaintFlowers} from './paintfall-garden-paint-flowers.js';
import {buildVietnamGarden} from './paintfall-vietnam-garden.js';
import {buildLaosGarden} from './paintfall-laos-garden.js';
import {buildCambodiaGarden} from './paintfall-cambodia-garden.js';
import {buildThailandGarden,buildMyanmarGarden,buildMalaysiaGarden,buildIndonesiaGarden,buildPhilippinesGarden} from './paintfall-southeast-asia-gardens.js';
const localBuilders={Vietnam:buildVietnamGarden,Laos:buildLaosGarden,Cambodia:buildCambodiaGarden,Thailand:buildThailandGarden,Myanmar:buildMyanmarGarden,Malaysia:buildMalaysiaGarden,Indonesia:buildIndonesiaGarden,Philippines:buildPhilippinesGarden};
function parkSign(T,garden,destination){
 const x=-3.8,z=-10.8;
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=256;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#132d36';ctx.fillRect(0,0,768,256);ctx.strokeStyle='#8fe9bf';ctx.lineWidth=9;ctx.strokeRect(6,6,756,244);ctx.textAlign='center';ctx.fillStyle='#efffea';ctx.font='bold 62px sans-serif';ctx.fillText('GARDEN PARK',384,87);ctx.fillStyle='#ffd870';ctx.font='bold 40px sans-serif';ctx.fillText('COMING SOON',384,150);ctx.fillStyle='#d6e5ee';ctx.font='30px sans-serif';ctx.fillText(destination.name.length>36?destination.name.slice(0,33)+'…':destination.name,384,207);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const sign=new T.Sprite(new T.SpriteMaterial({map:texture,depthWrite:false,toneMapped:false}));sign.name='Garden Park — Coming Soon';sign.position.set(x,2.05,z);sign.scale.set(4.5,1.5,1);garden.add(sign);
 const postMaterial=new T.MeshStandardMaterial({color:0x74563e,roughness:.9}),obstacles=[];
 for(const side of [-1,1]){const px=x+side*1.9,post=new T.Mesh(new T.BoxGeometry(.14,1.6,.14),postMaterial);post.name='Freestanding Garden Park signpost';post.position.set(px,.8,z);garden.add(post);obstacles.push({x:garden.position.x+px,z:garden.position.z+z,halfX:.12,halfZ:.12});}
 garden.userData.parkSign={x,z,frontOfEntrance:true};return obstacles;
}
const themes={
 desert:{name:'Desert Bloom',stone:0xcaa67b,leaf:0x65885b,petals:[0xff7856,0xffcb48,0xe968aa,0xac6cff]},
 coast:{name:'Coastal Color',stone:0xd3cab0,leaf:0x3e8e66,petals:[0xff66a7,0xffd85d,0x6cdce3,0xb68aff]},
 ice:{name:'Winter Glass',stone:0xb6ccd7,leaf:0x638d82,petals:[0xb395ff,0xf1c4f5,0x6cdaed,0xffd570]},
 mountain:{name:'Terrace Bloom',stone:0xa2a7a0,leaf:0x50876b,petals:[0x9d82e9,0xff8aa9,0xffd262,0x84d9df]},
 forest:{name:'Woodland Weave',stone:0xb6b09a,leaf:0x3f8052,petals:[0xff85ba,0x9b88ef,0xffcf56,0x79d9c4]}
};
function seedOf(id){let s=2166136261;for(const c of id)s=Math.imul(s^c.charCodeAt(0),16777619);return s>>>0;}
function random(seed){let s=seed;return()=>((s=Math.imul(s,1664525)+1013904223)>>>0)/4294967296;}
function chooseSite(destination,obstacles,water){
 const blocks=[...obstacles,...(water||[]).filter(b=>b.min&&b.max).map(b=>({x:(b.min.x+b.max.x)/2,z:(b.min.z+b.max.z)/2,halfX:(b.max.x-b.min.x)/2,halfZ:(b.max.z-b.min.z)/2}))];
 const rand=random(seedOf(destination.id)),candidates=[];
 for(let i=0;i<320;i++){const a=rand()*Math.PI*2,r=34+rand()*20;candidates.push({x:Math.sin(a)*r,z:Math.cos(a)*r});}
 for(let x=-56;x<=56;x+=8)for(let z=-56;z<=56;z+=8)if(Math.hypot(x,z)>30)candidates.push({x,z});
 const site=candidates.find(p=>Math.abs(p.x)<58&&Math.abs(p.z)<58&&!blocks.some(o=>Math.abs(o.x-p.x)<o.halfX+11&&Math.abs(o.z-p.z)<o.halfZ+12));
 if(!site)throw Error('No clear Garden Park site in '+destination.id);
 return site;
}
export function buildArenaGarden(T,{group,destination,obstacles=[],waterBounds=[],style='forest'}){
 if(destination.type!=='country')return null;
 const themeKey=themes[style]?style:['lake','river','wetland'].includes(style)?'coast':style==='volcano'?'desert':'forest',theme=themes[themeKey],seed=seedOf(destination.id),rand=random(seed);
 const site=chooseSite(destination,obstacles,waterBounds),garden=new T.Group();garden.name='Garden Park foundation — '+destination.name;garden.position.set(site.x,.025,site.z);group.add(garden);
 if(localBuilders[destination.name]){
  const local=localBuilders[destination.name](T,garden),paint=buildGardenPaintFlowers(T,garden,local.paintCorner);
  const solid=[...local.obstacles,...paint.obstacles].map(o=>({...o,x:site.x+o.x,z:site.z+o.z}));solid.push(...parkSign(T,garden,destination));
  garden.userData={...garden.userData,gardenPark:true,theme:local.themeKey,layout:local.layout,status:'coming-soon',flowers:local.flowerCount,identityStatus:'owner-review'};
  return {group:garden,obstacles:solid,center:site,theme:local.theme,themeKey:local.themeKey,layout:local.layout,flowerCount:local.flowerCount,status:'coming-soon',identityStatus:'owner-review',paintFlowers:paint,seats:local.seats,update:paint.update};
 }
 const solid=[],stemPoints=[],flowers=[],variant=seed%3;
 const material=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.86,...extra});
 const stone=material(theme.stone),leaf=material(theme.leaf),soil=material(0x574c3c),path=material(0xe0d2b6),timber=material(0x735c4b),gold=material(0xf2c451,{metalness:.2,roughness:.55});
 function add(mesh,name){mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;garden.add(mesh);return mesh;}
 function box(x,y,z,w,h,d,m,name){const mesh=add(new T.Mesh(new T.BoxGeometry(w,h,d),m),name);mesh.position.set(x,y,z);return mesh;}
 function block(x,z,halfX,halfZ){solid.push({x:site.x+x,z:site.z+z,halfX,halfZ});}
 function disc(x,z,r,m,name,y=.015){const mesh=add(new T.Mesh(new T.CircleGeometry(r,48),m),name);mesh.rotation.x=-Math.PI/2;mesh.position.set(x,y,z);return mesh;}
 function flower(x,z,index){const h=.42+rand()*.4;stemPoints.push({x,z,h});flowers.push({x,z,y:h,color:index%4,angle:rand()*Math.PI*2});}
 function bed(x,z,w,d,index){
  box(x,.1,z,w,.2,d,stone,'Raised flower bed rim');box(x,.205,z,w-.25,.025,d-.25,soil,'Flower bed soil');block(x,z,w/2,d/2);
  for(let px=-w/2+.4;px<w/2-.25;px+=.55)for(let pz=-d/2+.4;pz<d/2-.2;pz+=.55)flower(x+px+(rand()-.5)*.1,z+pz+(rand()-.5)*.1,index+Math.floor(rand()*3));
 }
 // All gardens have a clear central walkway; three layouts vary the beds.
 disc(0,0,9.7,leaf,'Garden lawn');disc(0,0,6.6,path,'Circular garden promenade',.027);disc(0,0,4.8,leaf,'Central flower island',.035);
 box(0,.04,-7.2,3.5,.025,5,path,'Garden entry walkway');
 if(variant===0){bed(-5,0,2.2,6.2,0);bed(5,0,2.2,6.2,2);bed(0,5.6,6,1.8,1);}
 else if(variant===1){for(const [x,z,i]of [[-4,-2,0],[4,-2,1],[-4,3,2],[4,3,3]])bed(x,z,2.8,2.6,i);}
 else {bed(-5,0,2.4,5,1);bed(5,0,2.4,5,3);bed(0,4.8,4.2,2,0);bed(0,-3.5,2.4,1.6,2);}
 // Benches sit beside the loop, leaving the path and entrance open.
 for(const sign of [-1,1]){
  const x=sign*7.3;box(x,.52,2.4,1.1,.16,2.6,timber,'Garden bench seat');box(x+sign*.43,.97,2.4,.14,.8,2.6,timber,'Garden bench back');
  for(const z of [1.5,3.3])box(x,.26,z,.8,.45,.12,stone,'Garden bench support');block(x,2.4,.6,1.35);
 }
 // A larger paint-colored blossom makes the future park recognizable at a distance.
 const bloom=new T.Group();bloom.name='PAINTFALL color bloom';bloom.position.set(0,0,1);garden.add(bloom);
 const stalk=new T.Mesh(new T.CylinderGeometry(.16,.24,2.7,9),leaf);stalk.position.y=1.35;bloom.add(stalk);
 const petalGeometry=new T.SphereGeometry(1,12,8);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,p=new T.Mesh(petalGeometry,material(theme.petals[i%4]));p.scale.set(.48,.16,1.2);p.position.set(Math.sin(a)*.85,2.75,Math.cos(a)*.85);p.rotation.y=a;bloom.add(p);
 }
 const heart=new T.Mesh(new T.SphereGeometry(.48,14,10),gold);heart.position.y=2.82;heart.scale.y=.6;bloom.add(heart);bloom.visible=false;
 const paint=buildGardenPaintFlowers(T,garden);for(const o of paint.obstacles)block(o.x,o.z,o.halfX,o.halfZ);
 // Flower instances keep the extra scenery inexpensive on phones.
 const stems=new T.InstancedMesh(new T.CylinderGeometry(.02,.028,1,5),leaf,stemPoints.length),dummy=new T.Object3D();stems.name='Garden flower stems';
 stemPoints.forEach((p,i)=>{dummy.position.set(p.x,p.h/2+.22,p.z);dummy.scale.set(1,p.h,1);dummy.rotation.set(0,0,0);dummy.updateMatrix();stems.setMatrixAt(i,dummy.matrix);});garden.add(stems);
 for(let c=0;c<4;c++){
  const selected=flowers.filter(p=>p.color===c),petals=new T.InstancedMesh(petalGeometry,material(theme.petals[c]),selected.length*5);petals.name='Garden flower petals '+c;
  selected.forEach((p,i)=>{for(let j=0;j<5;j++){const a=p.angle+j*Math.PI*2/5;dummy.position.set(p.x+Math.sin(a)*.12,p.y+.22,p.z+Math.cos(a)*.12);dummy.scale.set(.11,.045,.18);dummy.rotation.set(0,a,0);dummy.updateMatrix();petals.setMatrixAt(i*5+j,dummy.matrix);}});garden.add(petals);
 }
 // Open trellis with colorful vine clusters frames the future entrance.
 for(const x of [-2.1,2.1]){box(x,1.5,-7,.18,3,.18,timber,'Garden entrance trellis post');block(x,-7,.16,.16);}
 box(0,3,-7,4.5,.18,.45,timber,'Garden entrance trellis lintel');
 for(let i=0;i<9;i++){const vine=new T.Mesh(petalGeometry,i%3?leaf:material(theme.petals[i%4]));vine.scale.set(.42,.19,.35);vine.position.set(-2+i*.5,3.15,-7);garden.add(vine);}
 solid.push(...parkSign(T,garden,destination));
 if(themeKey==='ice'){
  const positions=[],indices=[];for(let i=0;i<=20;i++){const a=i*Math.PI/20;for(const z of [-4,4])positions.push(Math.cos(a)*8,1+Math.sin(a)*5.2,z);if(i<20){const j=i*2;indices.push(j,j+1,j+2,j+1,j+3,j+2);}}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  add(new T.Mesh(geometry,material(0xc5eafa,{transparent:true,opacity:.14,side:T.DoubleSide,depthWrite:false,roughness:.2})),'Winter garden glass canopy');
  for(const x of [-8,8])for(const z of [-4,4]){box(x,1.2,z,.17,2.4,.17,stone,'Conservatory support');block(x,z,.15,.15);}
 }
 const seats=[{x:-7.3,y:.62,z:2.4,facing:Math.PI/2},{x:7.3,y:.62,z:2.4,facing:-Math.PI/2}];
 garden.userData={gardenPark:true,theme:themeKey,layout:variant,status:'coming-soon',flowers:flowers.length,storySeats:seats,identityStatus:'regional-design-pending'};
 return {group:garden,obstacles:solid,center:site,theme:theme.name,themeKey,layout:variant,flowerCount:flowers.length,status:'coming-soon',identityStatus:'regional-design-pending',paintFlowers:paint,seats,update:paint.update};
}

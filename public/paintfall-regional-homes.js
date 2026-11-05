// Regional construction studies. These are original layouts, not building replicas.
export function buildRegionalHomes(T,{land,ground,spawn,occupied=[],profile}){
 const brunei=profile.theme==='river-homes',timor=profile.theme==='dry-ridge',group=new T.Group();group.name=profile.homeName;land.add(group);
 const homes=[],obstacles=[],benches=[],mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95,side:T.DoubleSide}),wood=mat(0x96715a),lightWood=mat(0xc9b28b),dark=mat(0x4c6264),cream=mat(0xe0d3b8),stone=mat(0xa69f8f),water=mat(0x86bbc2),tile=mat(0xa9634f),metal=mat(0x729395),thatch=mat(0xb59e76);
 function box(g,name,x,y,z,w,h,d,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.name=name;o.position.set(x,y,z);g.add(o);return o;}
 function surface(g,name,vertices,indices,m){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(indices.flatMap(i=>vertices[i]),3));geo.computeVertexNormals();const o=new T.Mesh(geo,m);o.name=name;g.add(o);return o;}
 function gable(g,name,cx,cz,w,d,y,rise,m,alongX=false){const vertices=[[-w/2,0,-d/2],[w/2,0,-d/2],[w/2,0,d/2],[-w/2,0,d/2],alongX?[-w/2,rise,0]:[0,rise,-d/2],alongX?[w/2,rise,0]:[0,rise,d/2]],indices=alongX?[0,1,5,0,5,4,2,3,4,2,4,5]:[0,3,5,0,5,4,1,2,5,1,5,4];const roof=surface(g,name,vertices,indices,m);roof.position.set(cx,y,cz);return roof;}
 function hip(g,cx,cz,w,d,y,rise,m){const roof=surface(g,'Low hipped tile roof',[[-w/2,0,-d/2],[w/2,0,-d/2],[w/2,0,d/2],[-w/2,0,d/2],[0,rise,-d*.23],[0,rise,d*.23]],[0,1,4,1,2,5,1,5,4,2,3,5,3,0,4,3,4,5],m);roof.position.set(cx,y,cz);}
 for(let i=0;i<3;i++){
  const width=brunei?8+i*.3:timor?6.4:5.8,depth=brunei?5.6:timor?6:8.2,floor=brunei?2.8:timor?.4:1.8,halfX=brunei?width/2+.5:timor?5.7:3.4,halfZ=brunei?5.9:timor?4.9:6.4;
  const supports=brunei?[-width/2+.3,0,width/2-.3].flatMap(x=>[-2.5,2.5,4.5].map(z=>[x,z])):timor?[]:[-2.6,0,2.6].flatMap(x=>[-3.8,0,3.8,5.5].map(z=>[x,z]));
  let p;for(let j=0;j<3000;j++){const a=j*2.4+i,r=10+Math.sqrt(j)*1.1,q=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(!q||Math.hypot(q.x,q.z)>57||[...occupied,...obstacles].some(o=>Math.abs(q.x-o.x)<o.halfX+halfX+1&&Math.abs(q.z-o.z)<o.halfZ+halfZ+1))continue;const sample=[[-halfX,-halfZ],[halfX,-halfZ],[-halfX,halfZ],[halfX,halfZ],[0,0],...supports];for(let sx=-halfX;sx<=halfX;sx+=2.8)for(let sz=-halfZ;sz<=halfZ;sz+=2.8)sample.push([sx,sz]);const points=sample.map(([x,z])=>ground(q.x+x,q.z+z));if(points.some(p=>!p)||Math.max(...points.map(p=>p.y))-Math.min(...points.map(p=>p.y))>2.8||[...occupied,...obstacles].some(o=>Math.abs(q.x-o.x)<o.halfX+halfX+1&&Math.abs(q.z-o.z)<o.halfZ+halfZ+1))continue;p=q.clone();p.y=Math.max(...points.map(p=>p.y))+.08;break;}if(!p)continue;
  const home=new T.Group(),shell=new T.Group();home.name=profile.homeName+' '+(i+1);home.position.copy(p);shell.name='House wall/roof shell';home.add(shell);group.add(home);homes.push(home);Object.assign(home.userData,{style:profile.homeStyle,floorLevel:floor,wallHeight:timor?2.7:2.2,cutawayShell:shell,regionalLayout:brunei?'wide-pile-home':timor?'low-courtyard-wing':'long-palm-veranda',footprint:{halfX,halfZ}});
  for(const [x,z]of supports){const bottom=ground(p.x+x,p.z+z).y-p.y;box(home,'Grounded support post',x,(floor+bottom)/2,z,.19,floor-bottom,.19,wood);}
  box(home,'Main room floor',0,floor,0,width,.2,depth,timor?stone:wood);
  if(brunei){
   const wall=mat([0xcbb590,0xb0c2b3,0xc7b5a3][i]),h=2.2;
   box(shell,'Long horizontal timber rear wall',0,floor+h/2,-2.65,width,h,.13,wall);for(const side of [-1,1])box(shell,'Timber end wall',side*(width/2-.1),floor+h/2,0,.14,h,depth,wall);
   for(const x of [-width*.3,width*.3])box(shell,'Front timber wall',x,floor+h/2,2.65,width*.38,h,.13,wall);box(shell,'Wide doorway',0,floor+.95,2.74,1.1,1.9,.08,dark);
   for(let j=0;j<11;j++)box(shell,'Horizontal timber course',0,floor+.1+j*.2,-2.74,width,.035,.04,wood);
   for(const x of [-2.9,-1.6,1.6,2.9]){box(shell,'Louver window opening',x,floor+1.25,2.74,.8,1,.07,dark);for(let j=0;j<6;j++)box(shell,'Horizontal louver',x,floor+.85+j*.15,2.8,.75,.04,.04,cream);}
   gable(shell,'Long low corrugated roof',0,0,width+1,depth+1,floor+h,1,metal,true);for(const side of [-1,1])surface(shell,'Timber end gable',[[side*(width/2-.1),floor+h,-2.65],[side*(width/2-.1),floor+h,2.65],[side*(width/2-.1),floor+h+.85,0]],[0,1,2],wall);for(let j=0;j<24;j++)box(shell,'Corrugated ridge rib',-width/2+j*width/23,floor+h+1.02,0,.035,.035,.15,cream);
   box(home,'Broad front veranda',0,floor,3.55,width,.18,1.8,wood);box(home,'Local boardwalk landing',0,floor,5,2.2,.18,1.3,wood);
   for(const side of [-1,1]){box(home,'Veranda top rail',side*(width/2-.18),floor+.85,3.5,.09,.1,1.7,cream);for(let j=0;j<4;j++)box(home,'Veranda baluster',side*(width/2-.18),floor+.4,2.85+j*.43,.07,.8,.07,wood);}
   // A supported water-colour pad makes the pile-house study readable, without replacing terrain.
   const positions=[];for(let x=-width/2;x<width/2;x+=.5)for(let z=-2.8;z<4.4;z+=.5){const corners=[[x,z],[x+.5,z],[x+.5,z+.5],[x,z+.5]].map(([x,z])=>ground(p.x+x,p.z+z));if(corners.every(Boolean))for(const k of [0,1,2,0,2,3])positions.push(corners[k].x-p.x,corners[k].y-p.y+.025,corners[k].z-p.z);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.computeVertexNormals();const pad=new T.Mesh(geo,water);pad.name='Schematic pile-house water pad';home.add(pad);
  }else if(timor){
   const plaster=mat(i===1?0xd5c3a5:0xe1d6bb),h=2.7;
   // Low stone/plaster house with an offset wing and a shaded front porch.
   for(const [cx,cz,w,d]of [[0,0,width,depth],[4.25,-.8,2.6,4.5]])for(let x=cx-w/2;x<cx+w/2;x+=.8)for(let z=cz-d/2;z<cz+d/2;z+=.8){const cellW=Math.min(.8,cx+w/2-x),cellD=Math.min(.8,cz+d/2-z),samples=[[x,z],[x+cellW,z],[x,z+cellD],[x+cellW,z+cellD]].map(([x,z])=>ground(p.x+x,p.z+z));if(samples.some(p=>!p))continue;const bottom=Math.min(...samples.map(q=>q.y))-p.y-.025,top=floor-.1;box(home,'Ground-following stone foundation',x+cellW/2,(top+bottom)/2,z+cellD/2,cellW,top-bottom,cellD,stone);}
   box(home,'Side-wing stone floor',4.25,floor,-.8,2.6,.2,4.5,stone);
   for(const side of [-1,1])box(shell,'Thick plaster side wall',side*3.1,floor+h/2,0,.25,h,depth,plaster);box(shell,'Plaster rear wall',0,floor+h/2,-2.9,width,h,.25,plaster);box(shell,'Plaster front wall',0,floor+h/2,2.9,width,h,.25,plaster);
   box(shell,'Offset side wing',4.25,floor+1.1,-.8,2.5,2.2,4.4,plaster);hip(shell,0,0,width+1,depth+1,floor+h,1.3,tile);hip(shell,4.25,-.8,3.2,5,floor+2.2,.9,tile);
   box(shell,'Door frame',-.65,floor+1,3.05,1.2,2.1,.1,cream);box(shell,'Tall timber door',-.65,floor+.95,3.13,.95,1.9,.07,wood);
   for(const x of [-2,1.85]){box(shell,'Deep window reveal',x,floor+1.5,3.07,.9,1.3,.1,dark);for(const side of [-1,1]){const shutter=box(shell,'Open timber shutter',x+side*.58,floor+1.5,3.25,.42,1.3,.08,wood);shutter.rotation.y=side*.6;}}
   box(home,'Shaded stone porch',0,floor,3.85,6.6,.15,1.8,stone);const awning=box(shell,'Separate veranda tile awning',0,floor+2.5,3.65,6.8,.13,2.5,tile);awning.rotation.x=.13;for(const x of [-2.8,0,2.8])box(shell,'Square porch column',x,floor+1.15,4.5,.2,2.3,.2,cream);
   for(let j=0;j<7;j++)box(home,'Stone plinth course',-2.7+j*.9,.14,3.02,.78,.16,.08,lightWood);
  }else{
   const h=2.1;
   box(shell,'Long palm-panel rear wall',0,floor+h/2,-4,5.6,h,.13,lightWood);for(const side of [-1,1])box(shell,'Long woven side wall',side*2.75,floor+h/2,0,.13,h,8,lightWood);
   for(const x of [-1.85,1.85])box(shell,'Open-front side panel',x,floor+h/2,3.6,1.8,h,.13,lightWood);box(shell,'Front doorway shade',0,floor+1.05,3.65,1.1,2,.04,dark);
   // Broad steep thatch canopy with softened lower eaves and woven gable infill.
   const vertices=[],indices=[];for(let z=0;z<=20;z++)for(let x=0;x<=16;x++){const px=-3.5+x*7/16,pz=-4.8+z*10.6/20,py=floor+1.8+3.2*(1-Math.abs(px/3.5)**1.35);vertices.push([px,py,pz]);}for(let z=0;z<20;z++)for(let x=0;x<16;x++){const a=z*17+x;indices.push(a,a+1,a+18,a,a+18,a+17);}surface(shell,'Deep overhanging palm-thatch canopy',vertices,indices,thatch);
   for(const z of [-4.05,3.65])surface(shell,'Woven gable infill',[[-2.75,floor+h,z],[2.75,floor+h,z],[0,floor+4.8,z]],[0,1,2],lightWood);
   for(let j=0;j<24;j++){const z=-4.7+j*.44;for(const side of [-1,1]){const rafter=box(shell,'Thatch bundle edge',side*3.42,floor+1.95,z,.2,.2,.3,thatch);rafter.rotation.z=side*.3;}}
   for(const side of [-1,1])for(let j=0;j<25;j++)box(shell,'Woven wall vertical strip',side*2.83,floor+1.05,-3.9+j*.31,.035,2,.055,wood);
   for(const side of [-1,1])for(let j=0;j<5;j++)box(shell,'Woven wall horizontal band',side*2.86,floor+.3+j*.38,0,.04,.055,7.9,cream);
   box(home,'Deep open veranda floor',0,floor,4.9,5.8,.18,2.2,wood);for(const x of [-2.6,2.6]){box(shell,'Veranda roof pole',x,floor+(1.8+3.2*(1-Math.abs(x/3.5)**1.35))/2,5.5,.16,1.8+3.2*(1-Math.abs(x/3.5)**1.35),.16,wood);box(home,'Low veranda side rail',x,floor+.65,4.9,.08,.08,2.1,wood);}for(let j=0;j<20;j++)box(home,'Split-timber veranda board',-2.7+j*.28,floor+.11,4.9,.04,.035,2.1,lightWood);
  }
  const front=brunei?5.7:timor?4.65:6.15,steps=Math.max(2,Math.ceil(floor/.28));for(let j=0;j<steps;j++)box(home,'Front stairs',0,.12+j*.28,front-j*.16,1.5,.22,.3,wood);
  obstacles.push({x:p.x,z:p.z,halfX,halfZ});
 }
 return {group,homes,obstacles,benches};
}

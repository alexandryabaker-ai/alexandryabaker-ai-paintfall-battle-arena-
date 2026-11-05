export function buildIslandHomes(T,{land,ground,spawn,occupied=[],profile}){
 const group=new T.Group();group.name=profile.homeName;land.add(group);const homes=[],obstacles=[],benches=[],mat=c=>new T.MeshStandardMaterial({color:c,roughness:.9,side:T.DoubleSide}),wood=mat(0x967057),bamboo=mat(0xc8b487),roofMat=mat(profile.theme==='river-homes'?0x709699:['planted-terraces','fern-rainforest'].includes(profile.theme)?0xb4a17d:0x865a50),trim=mat(0xe6d7b1),dark=mat(0x526766),city=profile.theme==='city-garden',toraja=profile.theme==='volcanic-fields';
 function box(g,name,x,y,z,w,h,d,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.name=name;g.add(o);return o;}
 for(let i=0;i<3;i++){let p;
  for(let j=0;j<2200;j++){const a=j*2.4+i,r=10+Math.sqrt(j)*1.15,q=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(!q||Math.hypot(q.x,q.z)>60)continue;const sample=[[-3,-4],[3,-4],[-3,4.8],[3,4.8],...[-2.6,0,2.6].flatMap(x=>[-2.9,2.9].map(z=>[x,z]))].map(([x,z])=>ground(q.x+x,q.z+z));if(sample.some(p=>!p)||Math.max(...sample.map(p=>p.y))-Math.min(...sample.map(p=>p.y))>2.8||[...occupied,...obstacles].some(o=>Math.abs(q.x-o.x)<o.halfX+4&&Math.abs(q.z-o.z)<o.halfZ+5))continue;p=q.clone();p.y=Math.max(...sample.map(p=>p.y))+.1;break;}
  if(!p)continue;const home=new T.Group(),shell=new T.Group(),floor=city?.25:toraja?1.7:profile.theme==='river-homes'?2.4:profile.theme==='dry-ridge'?.65:1.4;home.position.copy(p);home.name=profile.homeName+' '+(i+1);shell.name='House wall/roof shell';home.add(shell);group.add(home);homes.push(home);Object.assign(home.userData,{style:profile.homeStyle,floorLevel:floor,wallHeight:city?5.3:2.5,cutawayShell:shell});
  for(const x of [-2.6,0,2.6])for(const z of [-2.9,2.9]){const bottom=ground(p.x+x,p.z+z).y-p.y;box(home,'Grounded support post',x,(floor+bottom)/2,z,city?.3:.2,floor-bottom,city?.3:.2,wood);}
  box(home,'House inspection floor',0,floor,0,5.6,.2,6.6,city?trim:wood);
  const wall=city?mat([0xa9c8bd,0xd3ada0,0xaebcd2][i]):bamboo,height=city?5.3:2.5;
  for(const x of [-2.2,2.2])box(shell,'Side wall',x,floor+height/2,-.2,.16,height,5.4,wall);box(shell,'Rear wall',0,floor+height/2,-2.8,4.4,height,.16,wall);
  for(const x of [-1.3,1.3])box(shell,'Front wall',x,floor+height/2,2.4,1.8,height,.16,wall);
  box(shell,'Door',0,floor+.95,2.52,.75,1.9,.12,dark);
  for(const x of [-1.4,1.4])for(const y of city?[1.5,4]:[1.5]){box(shell,'Window frame',x,floor+y,2.53,1,1.25,.14,trim);box(shell,'Wooden shutter',x,floor+y,2.62,.8,1.08,.05,dark);for(let k=0;k<5;k++)box(shell,'Shutter slat',x-.32+k*.16,floor+y,2.67,.04,1,.03,trim);}
  if(city){
   box(shell,'Upper storey floor',0,floor+2.7,-.2,4.4,.16,5.4,wood);box(shell,'Shophouse facade band',0,floor+2.7,2.57,4.6,.18,.2,trim);box(home,'Covered five-foot-way study',0,floor,3.5,5.7,.15,1.5,trim);box(shell,'Covered walkway ceiling',0,floor+2.65,3.1,5.7,.18,2.6,wall);
   for(const x of [-2.65,2.65])box(shell,'Arcade column',x,floor+1.3,3.75,.22,2.6,.22,trim);
   for(let k=0;k<12;k++)box(home,'Walkway tile',-2.5+k*.45,floor+.09,3.5,.35,.03,1.25,k%2?dark:wall);
   box(shell,'Decorative upper cornice',0,floor+5.3,2.6,4.7,.24,.35,trim);
  }
  if(toraja){
   // Swept roof along the long axis: raised front/rear tips and a lower middle.
   const positions=[];const point=(x,z)=>[x,floor+2.7+1.15*(1-Math.abs(x)/3)+1.7*(z/4)**2,z];
   for(let j=0;j<28;j++){const z=-4+j*8/28,z2=z+8/28;for(const side of [-1,1]){const a=point(0,z),b=point(side*3,z),c=point(side*3,z2),d=point(0,z2);for(const q of [a,b,c,a,c,d])positions.push(...q);}}
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.computeVertexNormals();const roof=new T.Mesh(geo,roofMat);roof.name='Toraja-inspired swept roof study';shell.add(roof);
   for(const x of [-3,0,3]){const points=Array.from({length:29},(_,j)=>new T.Vector3(...point(x,-4+j*8/28))),rib=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),32,.065,7,false),wood);rib.name='Curved roof rib';shell.add(rib);}
   for(let k=0;k<9;k++)box(shell,'Geometric facade color band',-1.9+k*.47,floor+2.1,2.58,.25,.17,.05,k%2?trim:roofMat);
  }else if(profile.theme==='dry-ridge'){
   const vertices=[[-3,0,-3.5],[3,0,-3.5],[3,0,3.5],[-3,0,3.5],[0,1.6,-1.7],[0,1.6,1.7]],indices=[0,1,4,1,2,5,1,5,4,2,3,5,3,0,4,3,4,5],geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(indices.flatMap(i=>vertices[i]),3));geo.computeVertexNormals();const roof=new T.Mesh(geo,roofMat);roof.position.y=floor+height;roof.name='Original broad shade roof';shell.add(roof);box(home,'Shaded veranda floor',0,floor,3.3,5.7,.18,1.8,wood);
  }else{
   const shape=new T.Shape();shape.moveTo(-3,0);shape.lineTo(0,city?1.2:profile.theme==='fern-rainforest'?3:2.3);shape.lineTo(3,0);shape.closePath();const roof=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:7,bevelEnabled:false}),roofMat);roof.position.set(0,floor+height,-3.5);roof.name=city?'Shophouse tiled-roof study':profile.theme==='river-homes'?'River-home roof study':profile.theme==='fern-rainforest'?'Palm-roof home study':'Bahay kubo-inspired thatch-color roof';shell.add(roof);
   if(!city)for(let k=0;k<21;k++)box(shell,'Bamboo wall strip',-2.05+k*.2,floor+1.2,-2.91,.05,2.3,.04,wood);
  }
  if(profile.theme==='river-homes'){box(home,'Raised veranda landing',0,floor,3.5,5.7,.18,1.5,wood);for(const x of [-2.6,2.6])box(home,'Veranda handrail',x,floor+.9,3.5,.1,.1,1.6,trim);for(let k=0;k<12;k++)box(shell,'Roof-edge rib',-2.7+k*.48,floor+height-.05,0,.045,.09,7,trim);}
  if(profile.theme==='fern-rainforest')for(let k=0;k<16;k++)box(shell,'Palm-panel facade strip',-2+k*.27,floor+1.3,2.51,.06,2.3,.08,wood);
  const steps=Math.ceil(floor/.25);for(let k=0;k<steps;k++)box(home,'Front stairs',.8,.12+k*.25,4.5-k*.1,1.2,.2,.2,wood);
  obstacles.push({x:p.x,z:p.z+.5,halfX:3.2,halfZ:4.6});
 }
 return {group,homes,obstacles,benches};
}

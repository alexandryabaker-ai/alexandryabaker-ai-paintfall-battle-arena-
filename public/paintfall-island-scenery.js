import {buildRegionalScenery} from './paintfall-regional-scenery.js';
// Original game flowers: no claim of a particular local species.
export function addSparseFieldFlowers(T,{land,ground,profile,neighborhood,landmarks}){
 if(!['volcanic-fields','planted-terraces'].includes(profile.theme))return null;
 const group=new T.Group();group.name='Open-ground flower patches';land.add(group);
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.9}),leaf=mat(0x75a47c),gold=mat(0xf3ce79),colors=(profile.theme==='volcanic-fields'?[0xe9a18b,0xecc577,0xc8a2d6]:[0xa6cbdc,0xd6a4ca,0xf0d397]).map(mat),petalGeometry=new T.SphereGeometry(1,7,5),stemGeometry=new T.CylinderGeometry(.018,.025,.42,5),patches=[];
 const obstacles=[...neighborhood.obstacles,...landmarks.obstacles];
 function open(x,z){return Math.hypot(x,z)<58&&!!ground(x,z)&&!obstacles.some(o=>Math.abs(x-o.x)<o.halfX+1.3&&Math.abs(z-o.z)<o.halfZ+1.3)&&!landmarks.waterBounds.some(b=>x>b.min.x-.8&&x<b.max.x+.8&&z>b.min.z-.8&&z<b.max.z+.8)&&!landmarks.visits.some(v=>v.point&&Math.hypot(x-v.point.x,z-v.point.z)<2);}
 for(const [index,home]of neighborhood.homes.entries())for(const side of [-1,1]){
  let center;for(let i=0;i<90;i++){const a=side*Math.PI/2+i*.28,r=6.5+i*.055,x=home.position.x+Math.sin(a)*r,z=home.position.z+Math.cos(a)*r;if(Array.from({length:8},(_,j)=>open(x+Math.cos(j*Math.PI/4)*1.5,z+Math.sin(j*Math.PI/4)*1.5)).every(Boolean)&&patches.every(p=>Math.hypot(x-p.x,z-p.z)>3)){center={x,z};break;}}
  if(!center)continue;patches.push(center);
  for(let j=0;j<7;j++){const a=j*2.4,r=j?1:0,p=ground(center.x+Math.cos(a)*r,center.z+Math.sin(a)*r);if(!p)continue;const stem=new T.Mesh(stemGeometry,leaf);stem.position.copy(p).add(new T.Vector3(0,.21,0));group.add(stem);
   for(const side of [-1,1]){const blade=new T.Mesh(petalGeometry,leaf);blade.position.copy(p).add(new T.Vector3(side*.07,.19,0));blade.scale.set(.11,.035,.05);blade.rotation.z=side*.5;group.add(blade);}
   for(let k=0;k<5;k++){const angle=k*Math.PI*2/5,bloom=new T.Mesh(petalGeometry,colors[(index+j)%colors.length]);bloom.position.copy(p).add(new T.Vector3(Math.cos(angle)*.12,.45,Math.sin(angle)*.12));bloom.scale.set(.14,.045,.085);bloom.rotation.y=-angle;bloom.name='Meadow flower petal';group.add(bloom);}
   const middle=new T.Mesh(petalGeometry,gold);middle.position.copy(p).add(new T.Vector3(0,.48,0));middle.scale.set(.07,.035,.07);group.add(middle);
  }
 }
 group.userData.patchCount=patches.length;return group;
}
export function buildIslandScenery(T,{land,ground,spawn,profile}){
 const result=buildRegionalScenery(T,{land,ground,spawn,style:profile.style,cues:profile.cues}),mat=c=>new T.MeshStandardMaterial({color:c,roughness:.9,side:T.DoubleSide}),soil=mat(0xc4ab80),green=mat(0x81ae83),stone=mat(0x948e9a),flower=mat(0xd6a8cb);result.group.name=profile.name+' scenery';let center;
 const radius=profile.theme==='city-garden'?6:8;
 for(let i=0;i<1800;i++){const a=i*2.4,r=8+Math.sqrt(i)*1.1,p=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(p&&Math.hypot(p.x,p.z)<57&&Array.from({length:24},(_,j)=>ground(p.x+Math.cos(j*Math.PI/12)*radius,p.z+Math.sin(j*Math.PI/12)*radius)).every(Boolean)&&result.visits.every(v=>p.distanceTo(v.target)>17)){center=p;break;}}
 function mesh(g,m,p,y,name){const o=new T.Mesh(g,m);o.position.copy(p);o.position.y+=y;o.name=name;result.group.add(o);return o;}
 if(center){
  if(profile.theme==='city-garden'){
   for(let row=0;row<3;row++)for(let col=0;col<8;col++){const p=ground(center.x-3.5+col,center.z-3+row*3);if(!p)continue;mesh(new T.BoxGeometry(.85,.12,1),soil,p,.07,'Garden planting bed');mesh(new T.SphereGeometry(.3,8,6),green,p,.3,'Planted shrub');const bloom=mesh(new T.SphereGeometry(.13,8,6),flower,p,.58,'Garden flower');bloom.scale.y=.55;}
   for(const side of [-1,1]){const p=ground(center.x+side*5,center.z);if(!p)continue;mesh(new T.CylinderGeometry(.18,.25,4,8),soil,p,2,'Garden shade trunk');mesh(new T.IcosahedronGeometry(1.8,1),green,p,4.2,'Garden shade canopy').scale.y=.65;result.obstacles.push({x:p.x,z:p.z,halfX:.35,halfZ:.35});}
  }else if(profile.theme==='volcanic-fields'){
   const geo=new T.BufferGeometry(),positions=[];for(let i=0;i<40;i++){const a=i/40*Math.PI*2,b=(i+1)/40*Math.PI*2;for(const [r,y]of [[6,0],[2.1,7.5]]){const r2=r===6?2.1:1.4,y2=r===6?7.5:6.6;for(const [ang,rad,h]of [[a,r,y],[b,r,y],[b,r2,y2],[a,r,y],[b,r2,y2],[a,r2,y2]]){const x=Math.cos(ang)*rad,z=Math.sin(ang)*rad;positions.push(x,h===0?ground(center.x+x,center.z+z).y-center.y:h,z);}}}geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.computeVertexNormals();mesh(geo,stone,center,0,'Open volcanic crater study');result.obstacles.push({x:center.x,z:center.z,halfX:6.3,halfZ:6.3});
   for(let j=0;j<4;j++){const p=ground(center.x-5+j*3,center.z+7);if(p)mesh(new T.BoxGeometry(2.6,.12,1.3),green,p,.12,'Rice-field contour patch');}
  }else{
   for(let row=0;row<5;row++){const width=12-row*1.6,z=center.z-4+row*2,p=ground(center.x,z);if(!p)continue;const supports=[ground(center.x-width/2,z-1),ground(center.x+width/2,z+1)];if(supports.some(p=>!p))continue;const top=Math.max(p.y,...supports.map(p=>p.y))+.25+row*.4,base=Math.min(p.y,...supports.map(p=>p.y));mesh(new T.BoxGeometry(width,top-base,1.8),soil,new T.Vector3(center.x,base,z),(top-base)/2,'Schematic terrace retaining band');mesh(new T.BoxGeometry(width-.25,.05,1.45),green,new T.Vector3(center.x,top,z),.04,'Planted terrace surface');for(let i=0;i<Math.floor(width*2);i++)mesh(new T.ConeGeometry(.09,.28,5),green,new T.Vector3(center.x-width/2+.35+i*.45,top,z),.2,'Rice-color leaf tuft');result.obstacles.push({x:center.x,z,halfX:width/2+.2,halfZ:1.05});}
  }
  result.clearings.push({x:center.x,z:center.z,radius:11});
  for(let j=0;j<180;j++){const a=j*2.4,p=ground(center.x+Math.cos(a)*11,center.z+Math.sin(a)*11);if(p&&!result.obstacles.some(o=>Math.abs(p.x-o.x)<o.halfX+1&&Math.abs(p.z-o.z)<o.halfZ+1)){result.visits.push({name:profile.features[0],point:p,target:center.clone().add(new T.Vector3(0,profile.theme==='volcanic-fields'?3:1,0)),viewOffset:new T.Vector3(12,15,18)});break;}}
 }
 result.waterBounds=[];result.group.traverse(o=>{if(o.isMesh&&o.material?.color?.getHex()===0x79c7d7)result.waterBounds.push(new T.Box3().setFromObject(o));});return result;
}

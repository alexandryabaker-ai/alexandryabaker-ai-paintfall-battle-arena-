// Separate Vietnamese landscape references combined in original PAINTFALL placements.
import {buildRegionalScenery} from './paintfall-regional-scenery.js';
export function buildVietnamScenery(T,{land,ground,spawn}){
 const result=buildRegionalScenery(T,{land,ground,spawn,style:'forest',cues:['Quiet valley waterway']});
 result.group.name='vietnam-landscape-studies';
 const rock=new T.MeshStandardMaterial({color:0xa7b2ac,roughness:1}),accent=new T.MeshStandardMaterial({color:0xb5a0ca,roughness:1}),grass=new T.MeshStandardMaterial({color:0x91b881,roughness:1}),soil=new T.MeshStandardMaterial({color:0xa99976,roughness:1}),water=new T.MeshStandardMaterial({color:0x9ad2ca,roughness:.35,side:T.DoubleSide});
 function mesh(geometry,material,p,y=0){const m=new T.Mesh(geometry,material);m.position.copy(p);m.position.y+=y;result.group.add(m);return m;}
 function site(radius,separation){for(let i=0;i<450;i++){const a=i*2.4,r=10+Math.sqrt(i)*1.9,p=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(!p||Math.hypot(p.x,p.z)>58)continue;if(!Array.from({length:12},(_,j)=>ground(p.x+Math.cos(j*Math.PI/6)*radius,p.z+Math.sin(j*Math.PI/6)*radius)).every(Boolean))continue;if(result.visits.some(v=>Math.hypot(p.x-v.target.x,p.z-v.target.z)<separation))continue;return p;}return null;}
 function visit(name,p,height,radius){for(let i=0;i<180;i++){const a=i*2.4,r=radius+Math.floor(i/30),point=ground(p.x+Math.cos(a)*r,p.z+Math.sin(a)*r);if(point&&!result.obstacles.some(o=>Math.abs(point.x-o.x)<o.halfX+1&&Math.abs(point.z-o.z)<o.halfZ+1)){result.visits.push({name,target:p.clone().add(new T.Vector3(0,height,0)),point,viewOffset:new T.Vector3(15,15,19)});break;}}}
 const karst=site(8,18);
 if(karst){
  for(const side of [-1,1]){const p=ground(karst.x,karst.z+side*4);if(!p)continue;
   const ridge=mesh(new T.SphereGeometry(1,20,14),rock,p,.2);ridge.scale.set(4.2,side<0?4.7:3.5,1.9);ridge.name='Rounded mist-valley ridge';
   for(let i=0;i<5;i++){const x=p.x-3+i*1.5,q=ground(x,p.z);if(!q)continue;const shrub=mesh(new T.IcosahedronGeometry(.55,1),grass,q,2.1+Math.sin(i*.7)*1.3);shrub.name='Valley ridge greenery';}
   result.obstacles.push({x:p.x,z:p.z,halfX:4.4,halfZ:2.1});
  }
  const ribbon=[];for(let j=0;j<24;j++){const x=karst.x-7+j*.6,z=karst.z+Math.sin(j*.2)*.65,q=[[x,z-.6],[x+.6,z-.6],[x+.6,z+.6],[x,z+.6]].map(([x,z])=>ground(x,z));if(q.every(Boolean))for(const k of [0,1,2,0,2,3])ribbon.push(q[k].x,q[k].y+.09,q[k].z);}
  const ribbonGeometry=new T.BufferGeometry();ribbonGeometry.setAttribute('position',new T.Float32BufferAttribute(ribbon,3));ribbonGeometry.computeVertexNormals();mesh(ribbonGeometry,water,new T.Vector3()).name='Mist-valley reflective water ribbon';
  result.clearings.push({x:karst.x,z:karst.z,radius:9});visit('Lanternmist Water Valley',karst,2,12);
 }
 const terraces=site(8,16);
 if(terraces){
  const rows=[];
  // Ground-supported paddy strips follow the existing fictional relief.
  for(let row=0;row<5;row++){
   const vertices=[],waterVertices=[],bundPoints=[];
   for(let j=0;j<24;j++){const x=terraces.x-6+j*.5,z=terraces.z-5+row*2.2+Math.sin(j*.13)*.8,q=[[x,z],[x+.5,z],[x+.5,z+1.4],[x,z+1.4]].map(([x,z])=>ground(x,z));if(!q.every(Boolean))continue;for(const k of [0,1,2,0,2,3]){vertices.push(q[k].x,q[k].y+.06,q[k].z);waterVertices.push(q[k].x,q[k].y+.08,q[k].z);}bundPoints.push(q[0].clone().add(new T.Vector3(0,.12,0)));}
   if(!vertices.length)continue;const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();const field=mesh(geometry,grass,new T.Vector3());field.name='Ground-following paddy terrace '+(row+1);rows.push(field);
   const wetGeometry=new T.BufferGeometry();wetGeometry.setAttribute('position',new T.Float32BufferAttribute(waterVertices,3));wetGeometry.computeVertexNormals();const wet=mesh(wetGeometry,water,new T.Vector3());wet.name='Shallow paddy color study';wet.visible=row%2===0;
   if(bundPoints.length>2){const bund=mesh(new T.TubeGeometry(new T.CatmullRomCurve3(bundPoints),30,.1,5,false),soil,new T.Vector3());bund.name='Raised paddy bank';}
   for(let j=0;j<10;j++){const x=terraces.x-5+j,z=terraces.z-4.3+row*2.2+Math.sin((j+1)*.26)*.8,p=ground(x,z);if(p){const rice=mesh(new T.ConeGeometry(.14,.65,4),grass,p,.38);rice.name='Stylized rice planting';}}
  }
  if(rows.length){result.clearings.push({x:terraces.x,z:terraces.z,radius:9});visit('Paintstep Paddy Terraces',terraces,2,11);}
 }
 result.features=['Ninh Binh-inspired karst forms','Mu Cang Chai-inspired paddy strips','Quiet valley waterway'];
 return result;
}


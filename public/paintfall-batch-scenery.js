import {buildFinalScenery} from './paintfall-final-scenery.js';
import {buildNextSixtyScenery} from './paintfall-next-sixty-scenery.js';
import {buildAfricaScenery} from './paintfall-africa-scenery.js';
import {buildNextThirtyScenery} from './paintfall-next-thirty-scenery.js';
import {buildCentralAsiaScenery} from './paintfall-central-asia-scenery.js';
import {buildSouthAsiaScenery} from './paintfall-south-asia-scenery.js';
import {buildHimalayaDeltaScenery} from './paintfall-himalaya-delta-scenery.js';
import {buildEastAsiaScenery} from './paintfall-east-asia-scenery.js';
import {buildGroupTenScenery} from './paintfall-island-group-ten-scenery.js';
import {buildGroupNineScenery} from './paintfall-island-group-nine-scenery.js';
import {buildMicronesianScenery} from './paintfall-micronesian-scenery.js';
import {buildAtollScenery} from './paintfall-atoll-scenery.js';
import {buildArchipelagoScenery} from './paintfall-archipelago-scenery.js';
import {buildOceanicScenery} from './paintfall-oceanic-scenery.js';
import {buildPacificScenery} from './paintfall-pacific-scenery.js';
import {buildRegionalScenery} from './paintfall-regional-scenery.js';
import {buildEquatorialScenery} from './paintfall-equatorial-scenery.js';
import {buildIslandScenery} from './paintfall-island-scenery.js';
export function buildBatchScenery(T,{land,ground,spawn,profile}){
 if(profile.finalFoundation)return buildFinalScenery(T,{land,ground,spawn,profile});
 if(profile.batch>=29&&profile.batch<=40)return buildNextSixtyScenery(T,{land,ground,spawn,profile});
 if(profile.batch>=23&&profile.batch<=28)return buildAfricaScenery(T,{land,ground,spawn,profile});
 if(profile.batch>=17&&profile.batch<=22)return buildNextThirtyScenery(T,{land,ground,spawn,profile});
 if(profile.batch===16)return buildCentralAsiaScenery(T,{land,ground,spawn,profile});
 if(profile.batch===15)return buildCentralAsiaScenery(T,{land,ground,spawn,profile});
 if(profile.batch===14)return buildCentralAsiaScenery(T,{land,ground,spawn,profile});
 if(profile.batch===13)return buildSouthAsiaScenery(T,{land,ground,spawn,profile});
 if(profile.batch===12)return buildHimalayaDeltaScenery(T,{land,ground,spawn,profile});
 if(profile.batch===11)return buildEastAsiaScenery(T,{land,ground,spawn,profile});
 if(profile.batch===10)return buildGroupTenScenery(T,{land,ground,spawn,profile});
 if(profile.batch===9)return buildGroupNineScenery(T,{land,ground,spawn,profile});
 if(profile.batch===8)return buildMicronesianScenery(T,{land,ground,spawn,profile});
 if(profile.batch===7)return buildAtollScenery(T,{land,ground,spawn,profile});
 if(profile.batch===6)return buildArchipelagoScenery(T,{land,ground,spawn,profile});
 if(profile.batch===5)return buildOceanicScenery(T,{land,ground,spawn,profile});
 if(profile.batch===4)return buildPacificScenery(T,{land,ground,spawn,profile});
 if(profile.batch===3)return buildEquatorialScenery(T,{land,ground,spawn,profile});
 if(profile.batch===2)return buildIslandScenery(T,{land,ground,spawn,profile});
 const cues=profile.theme==='mangrove'?['Canopylight forest clearing','Quiet mangrove creek']:profile.theme==='lake-gardens'?['Reedlight wooded shore','Quiet lake inlet']:['Floodwood forest clearing','Quiet floodplain channel'];
 const result=buildRegionalScenery(T,{land,ground,spawn,style:profile.style,cues});result.group.name=profile.name+' scenery';const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.85,side:T.DoubleSide}),water=mat(profile.theme==='lake-gardens'?0x8caecb:profile.theme==='mangrove'?0x7eadab:0x8ccac2),green=mat(0x8fb58d),wood=mat(0x9f8061),pink=mat(0xd9accd),soil=mat(0xd3bc8c);let center;
 for(let i=0;i<900;i++){const a=i*2.4,r=9+Math.sqrt(i)*1.6,p=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(p&&Math.hypot(p.x,p.z)<54&&Array.from({length:16},(_,j)=>ground(p.x+Math.cos(j*Math.PI/8)*7,p.z+Math.sin(j*Math.PI/8)*7)).every(Boolean)&&result.visits.every(v=>p.distanceTo(v.target)>16)){center=p;break;}}
 function mesh(geometry,material,p,y=0,name=''){const m=new T.Mesh(geometry,material);m.position.copy(p);m.position.y+=y;m.name=name;result.group.add(m);return m;}
 function wetPatch(cx,cz,rx,rz){const positions=[];for(let x=cx-rx;x<cx+rx;x+=.7)for(let z=cz-rz;z<cz+rz;z+=.7){const q=[[x,z],[x+.7,z],[x+.7,z+.7],[x,z+.7]];if(q.some(([x,z])=>((x-cx)/rx)**2+((z-cz)/rz)**2>1))continue;const points=q.map(([x,z])=>ground(x,z));if(points.every(Boolean))for(const i of [0,1,2,0,2,3])positions.push(points[i].x,points[i].y+.09,points[i].z);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.computeVertexNormals();return mesh(geo,water,new T.Vector3(),0,'Ground-following water study');}
 if(center){wetPatch(center.x,center.z,6.5,5.5);
  if(profile.theme==='floodplain'){
   for(let i=0;i<10;i++){const a=i*2.4,r=1.5+i%3,p=ground(center.x+Math.cos(a)*r,center.z+Math.sin(a)*r);if(!p)continue;const pad=mesh(new T.CircleGeometry(.55,16),green,p,.12,'Lotus-color leaf');pad.rotation.x=-Math.PI/2;for(let j=0;j<5;j++){const petal=mesh(new T.SphereGeometry(.2,8,6),pink,p,.26,'Lotus-color petal');petal.position.x+=Math.cos(j*Math.PI*2/5)*.18;petal.position.z+=Math.sin(j*Math.PI*2/5)*.18;petal.scale.set(.6,.6,1);}}
   for(let i=0;i<7;i++){const a=i*Math.PI*2/7,p=ground(center.x+Math.cos(a)*7,center.z+Math.sin(a)*6.5);if(!p)continue;const trunk=mesh(new T.CylinderGeometry(.14,.25,3.5,8),wood,p,1.75,'Floodwood trunk');const crown=mesh(new T.IcosahedronGeometry(1.2,1),green,p,3.7,'Floodwood crown');crown.scale.y=.65;result.obstacles.push({x:p.x,z:p.z,halfX:.3,halfZ:.3});}
  }else if(profile.theme==='lake-gardens'){
   for(let row=0;row<5;row++)for(let i=0;i<9;i++){const p=ground(center.x-4+i,center.z-3+row*1.5);if(!p)continue;mesh(new T.BoxGeometry(.9,.14,.75),wood,p,.2,'Floating garden support study');mesh(new T.BoxGeometry(.8,.1,.65),soil,p,.32,'Garden planting strip');for(let k=0;k<3;k++)mesh(new T.ConeGeometry(.1,.35,5),green,p,.5,'Garden leaves').position.x+=(k-1)*.22;}
  }else{
   for(let i=0;i<7;i++){const a=i*Math.PI*2/7,p=ground(center.x+Math.cos(a)*4.5,center.z+Math.sin(a)*3.5);if(!p)continue;mesh(new T.CylinderGeometry(.14,.25,3.7,9),wood,p,2.05,'Mangrove-inspired trunk');for(let j=0;j<4;j++){const angle=j*Math.PI/2,foot=ground(p.x+Math.cos(angle)*.9,p.z+Math.sin(angle)*.9);if(!foot)continue;const top=p.clone().add(new T.Vector3(0,1.2,0)),delta=top.clone().sub(foot),root=mesh(new T.CylinderGeometry(.06,.12,delta.length(),7),wood,top.clone().add(foot).multiplyScalar(.5),0,'Mangrove prop-root study');root.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());}mesh(new T.IcosahedronGeometry(1.5,1),green,p,4.1,'Mangrove-inspired canopy').scale.y=.65;result.obstacles.push({x:p.x,z:p.z,halfX:.35,halfZ:.35});}
  }
  result.clearings.push({x:center.x,z:center.z,radius:9});
  for(let i=0;i<150;i++){const a=i*2.4,p=ground(center.x+Math.cos(a)*10,center.z+Math.sin(a)*10);if(p&&!result.obstacles.some(o=>Math.abs(p.x-o.x)<o.halfX+1&&Math.abs(p.z-o.z)<o.halfZ+1)){result.visits.push({name:profile.features[0],point:p,target:center.clone().add(new T.Vector3(0,profile.theme==='mangrove'?2:1,0)),viewOffset:new T.Vector3(8,18,16)});break;}}
 }
 result.waterBounds=[];result.group.traverse(o=>{if(o.isMesh&&(o.material===water||o.material?.color?.getHex()===0x79c7d7))result.waterBounds.push(new T.Box3().setFromObject(o));});return result;
}







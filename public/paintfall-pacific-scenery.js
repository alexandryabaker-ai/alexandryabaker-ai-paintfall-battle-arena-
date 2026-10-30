import {buildRegionalScenery} from './paintfall-regional-scenery.js';
export function buildPacificScenery(T,{land,ground,spawn,profile}){
 const result=buildRegionalScenery(T,{land,ground,spawn,style:profile.style,cues:profile.cues}),mat=c=>new T.MeshStandardMaterial({color:c,roughness:.9,side:T.DoubleSide}),stone=mat(0xc39579),green=mat(0x83a78f),snow=mat(0xe6eee5),wood=mat(0x9f8065),water=mat(0x83bdc6);let center;
 for(let i=0;i<1200;i++){const a=i*2.4,r=9+Math.sqrt(i)*1.2,p=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(p&&Math.hypot(p.x,p.z)<54&&Array.from({length:16},(_,j)=>ground(p.x+Math.cos(j*Math.PI/8)*8,p.z+Math.sin(j*Math.PI/8)*8)).every(Boolean)&&result.visits.every(v=>p.distanceTo(v.target)>18)){center=p;break;}}
 const add=(g,m,p,y,name)=>{const o=new T.Mesh(g,m);o.position.copy(p);o.position.y+=y;o.name=name;result.group.add(o);return o;};
 if(center){if(profile.theme==='sunwood'){
  for(let i=0;i<4;i++){const x=center.x+(i-1.5)*2.8,z=center.z+Math.sin(i)*2,p=ground(x,z);if(!p)continue;const rock=add(new T.SphereGeometry(1,12,8),stone,p,1.6,'Sandstone-color outcrop');rock.scale.set(1.7,1.8+i*.2,1.5);result.obstacles.push({x,z,halfX:1.9,halfZ:1.7});}
 }else if(profile.theme==='fern-snow'){
  add(new T.ConeGeometry(5.8,10,7),mat(0x9ba9aa),center,5,'Snowpeak rock study');add(new T.ConeGeometry(2,3.5,7),snow,center,8.4,'Snow-color summit');result.obstacles.push({x:center.x,z:center.z,halfX:6,halfZ:6});
 }else{
  const positions=[];for(let x=-5;x<5;x+=.5)for(let z=-4;z<4;z+=.5){if(x*x/25+z*z/16>1)continue;const q=[[x,z],[x+.5,z],[x+.5,z+.5],[x,z+.5]].map(([x,z])=>ground(center.x+x,center.z+z));if(q.every(Boolean))for(const j of [0,1,2,0,2,3])positions.push(q[j].x,q[j].y+.08,q[j].z);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.computeVertexNormals();add(geo,water,new T.Vector3(),0,'Palm-bay water study');
  for(let i=0;i<5;i++){const a=i*2.4,p=ground(center.x+Math.cos(a)*6.3,center.z+Math.sin(a)*5.2);if(!p)continue;add(new T.CylinderGeometry(.14,.25,5,8),wood,p,2.5,'Palm-canopy trunk study');for(let j=0;j<7;j++){const b=j*Math.PI*2/7,frond=add(new T.SphereGeometry(1,9,6),green,p,5,'Palm-color frond');frond.position.x+=Math.cos(b)*.95;frond.position.z+=Math.sin(b)*.95;frond.scale.set(1.4,.08,.25);frond.rotation.y=-b;frond.rotation.z=.1;}result.obstacles.push({x:p.x,z:p.z,halfX:.4,halfZ:.4});}
 }
 result.clearings.push({x:center.x,z:center.z,radius:11});for(let i=0;i<150;i++){const a=i*2.4,p=ground(center.x+Math.cos(a)*11,center.z+Math.sin(a)*11);if(p&&!result.obstacles.some(o=>Math.abs(p.x-o.x)<o.halfX+1&&Math.abs(p.z-o.z)<o.halfZ+1)){result.visits.push({name:profile.features[0],point:p,target:center.clone().add(new T.Vector3(0,profile.theme==='fern-snow'?4:2,0)),viewOffset:new T.Vector3(14,16,19)});break;}}
 }
 result.waterBounds=[];result.group.traverse(o=>{if(o.isMesh&&(o.material===water||o.material?.color?.getHex()===0x79c7d7))result.waterBounds.push(new T.Box3().setFromObject(o));});return result;
}

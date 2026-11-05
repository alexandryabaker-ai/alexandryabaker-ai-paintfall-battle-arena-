import {buildRegionalScenery} from './paintfall-regional-scenery.js';
// Kuang Si and Mekong references combined in original, non-geographic placements.
export function buildLaosScenery(T,{land,ground,spawn}){
 const result=buildRegionalScenery(T,{land,ground,spawn,style:'forest',cues:['Quiet river bend','Wooded canopy clearing']});result.group.name='laos-landscape';
 const limestone=new T.MeshStandardMaterial({color:0xded3b4,roughness:.95}),water=new T.MeshStandardMaterial({color:0x79c9cf,roughness:.3}),flow=new T.MeshStandardMaterial({color:0xa4e1e0,transparent:true,opacity:.7,roughness:.25}),leaf=new T.MeshStandardMaterial({color:0x88ba9f,roughness:.95});let center;
 for(let i=0;i<700;i++){const a=i*2.4,r=10+Math.sqrt(i)*1.6,p=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(p&&Math.hypot(p.x,p.z)<56&&Array.from({length:16},(_,j)=>ground(p.x+Math.cos(j*Math.PI/8)*6,p.z+Math.sin(j*Math.PI/8)*6)).every(Boolean)&&result.visits.every(v=>p.distanceTo(v.target)>17)){center=p;break;}}
 const droplets=[];
 if(center){const samples=Array.from({length:16},(_,i)=>ground(center.x+Math.cos(i*Math.PI/8)*5,center.z+Math.sin(i*Math.PI/8)*5)),base=Math.max(...samples.map(p=>p.y));
  function mesh(geometry,material,x,y,z,name){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.name=name;result.group.add(m);return m;}
  const low=Math.min(...samples.map(p=>p.y));mesh(new T.CylinderGeometry(4.8,5,base-low+1,32),limestone,center.x,low+(base-low+1)/2-.2,center.z,'Limestone pool foundation');
  for(let tier=0;tier<3;tier++){const radius=4.6-tier*.85,y=base+.6+tier*.8,z=center.z-tier*.5;
   mesh(new T.CylinderGeometry(radius,radius+.2,.7,40),limestone,center.x,y,z,'Cascade limestone shelf');const surface=mesh(new T.CircleGeometry(radius-.25,40),water,center.x,y+.36,z,'Cascade turquoise pool');surface.rotation.x=-Math.PI/2;
   if(tier>0){mesh(new T.BoxGeometry(2.5,.85,.06),flow,center.x,y-.03,z+radius-.35,'Waterfall curtain');for(let i=0;i<10;i++){const drop=mesh(new T.SphereGeometry(.065,6,5),flow,center.x-1.1+i*.24,y, z+radius-.3,'Cascade droplet');droplets.push({mesh:drop,top:y+.3,bottom:y-.5,phase:i/10});}}
  }
  for(const side of [-1,1]){const p=ground(center.x+side*5.3,center.z);if(p){const shrub=mesh(new T.IcosahedronGeometry(.9,1),leaf,p.x,p.y+.7,p.z,'Cascade bank planting');shrub.scale.y=.7;}}
  result.obstacles.push({x:center.x,z:center.z-.5,halfX:5,halfZ:5.5});result.clearings.push({x:center.x,z:center.z,radius:7});
  for(let i=0;i<150;i++){const a=i*2.4,p=ground(center.x+Math.cos(a)*10,center.z+Math.sin(a)*10);if(p&&!result.obstacles.some(o=>Math.abs(p.x-o.x)<o.halfX+1&&Math.abs(p.z-o.z)<o.halfZ+1)){result.visits.push({name:'Jade Ribbon Cascades',point:p,target:new T.Vector3(center.x,base+2,center.z),viewOffset:new T.Vector3(12,12,18)});break;}}
 }
 let seconds=0;result.update=dt=>{seconds+=dt;for(const d of droplets)d.mesh.position.y=d.top-(d.top-d.bottom)*((seconds*.7+d.phase)%1);};result.waterBounds=[];result.group.traverse(o=>{if(o.isMesh&&(/river|water|pool|cascade/i.test(o.name)||o.material?.color?.getHex()===0x79c7d7))result.waterBounds.push(new T.Box3().setFromObject(o));});return result;
}


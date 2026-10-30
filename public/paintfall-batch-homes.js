import {buildFinalHomes} from './paintfall-final-homes.js';
import {buildNextSixtyHomes} from './paintfall-next-sixty-homes.js';
import {refineRegionalHomes} from './paintfall-refined-homes.js';
import {buildAfricaHomes} from './paintfall-africa-homes.js';
import {buildNextThirtyHomes} from './paintfall-next-thirty-homes.js';
import {buildLevantHomes} from './paintfall-levant-homes.js';
import {buildCaucasusHomes} from './paintfall-caucasus-homes.js';
import {buildCentralAsiaHomes} from './paintfall-central-asia-homes.js';
import {buildSouthAsiaHomes} from './paintfall-south-asia-homes.js';
import {buildHimalayaDeltaHomes} from './paintfall-himalaya-delta-homes.js';
import {buildEastAsiaHomes} from './paintfall-east-asia-homes.js';
import {buildGroupTenHomes} from './paintfall-island-group-ten-homes.js';
import {buildGroupNineHomes} from './paintfall-island-group-nine-homes.js';
import {buildMicronesianHomes} from './paintfall-micronesian-homes.js';
import {buildAtollHomes} from './paintfall-atoll-homes.js';
import {buildArchipelagoHomes} from './paintfall-archipelago-homes.js';
import {buildOceanicHomes} from './paintfall-oceanic-homes.js';
import {buildPacificHomes} from './paintfall-pacific-homes.js';
import {buildIslandHomes} from './paintfall-island-homes.js';
import {buildRegionalHomes} from './paintfall-regional-homes.js';
export function buildBatchHomes(T,{land,ground,spawn,occupied=[],profile}){
 if(profile.finalFoundation)return buildFinalHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch>=29&&profile.batch<=40)return buildNextSixtyHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch>=23&&profile.batch<=28)return refineRegionalHomes(T,buildAfricaHomes(T,{land,ground,spawn,occupied,profile}),profile);
 if(profile.batch>=17&&profile.batch<=22)return refineRegionalHomes(T,buildNextThirtyHomes(T,{land,ground,spawn,occupied,profile}),profile);
 if(profile.batch===16)return buildLevantHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===15)return buildCaucasusHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===14)return buildCentralAsiaHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===13)return buildSouthAsiaHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===12)return buildHimalayaDeltaHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===11)return buildEastAsiaHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===10)return buildGroupTenHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===9)return buildGroupNineHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===8)return buildMicronesianHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===7)return buildAtollHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===6)return buildArchipelagoHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===5)return buildOceanicHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===4)return buildPacificHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch===3)return buildRegionalHomes(T,{land,ground,spawn,occupied,profile});
 if(profile.batch>=2)return buildIslandHomes(T,{land,ground,spawn,occupied,profile});
 const group=new T.Group();group.name=profile.homeName;land.add(group);const homes=[],obstacles=[],benches=[],mat=c=>new T.MeshStandardMaterial({color:c,roughness:.9}),wood=mat(profile.theme==='mangrove'?0x9a6850:profile.theme==='lake-gardens'?0xa68d70:0x997854),wall=mat(profile.theme==='mangrove'?0xc99778:profile.theme==='lake-gardens'?0xc5b793:0xd0af7d),roofMat=mat(profile.theme==='mangrove'?0x8b7a90:profile.theme==='lake-gardens'?0x869aa6:0xa77968),accent=mat(profile.theme==='mangrove'?0xe2d3ac:0xa2c7bf);
 function box(g,name,x,y,z,w,h,d,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.name=name;g.add(o);return o;}
 for(let i=0;i<3;i++){let p;for(let j=0;j<1500;j++){const a=j*2.4+i,r=10+Math.sqrt(j)*1.3,q=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(!q||Math.hypot(q.x,q.z)>59)continue;const corners=[[-3,-3.3],[3,-3.3],[-3,4.7],[3,4.7]].map(([x,z])=>ground(q.x+x,q.z+z));const supports=[-2.6,0,2.6].flatMap(x=>[-2.9,2.9].map(z=>ground(q.x+x,q.z+z)));if(supports.some(p=>!p)||corners.some(p=>!p)||Math.max(...corners.map(p=>p.y))-Math.min(...corners.map(p=>p.y))>2.8||[...occupied,...obstacles].some(o=>Math.abs(q.x-o.x)<o.halfX+4&&Math.abs(q.z-o.z)<o.halfZ+5))continue;p=q.clone();p.y=Math.max(...corners.map(p=>p.y))+.1;break;}if(!p)continue;
  const home=new T.Group();home.name=profile.homeName+' '+(i+1);home.position.copy(p);const floating=profile.theme==='floodplain'&&i===1;home.userData.style=floating?'tonle-sap-floating-study':profile.homeStyle;const floor=floating?.4:profile.theme==='lake-gardens'?2:profile.theme==='floodplain'?2.5:1.2;home.userData.floorLevel=floor;home.userData.wallHeight=2.5;group.add(home);homes.push(home);const shell=new T.Group();shell.name='House wall/roof shell';home.add(shell);home.userData.cutawayShell=shell;
  if(floating){const water=new T.MeshStandardMaterial({color:0x8ccac2,roughness:.35});box(home,'Schematic floating-house water pad',0,floor-.2,.4,7.2,.04,8,water);for(const x of [-2.4,2.4]){const pontoon=new T.Mesh(new T.CylinderGeometry(.18,.18,6.9,12),wood);pontoon.rotation.x=Math.PI/2;pontoon.position.set(x,floor-.15,0);pontoon.name='Raft flotation study';home.add(pontoon);}}
  else for(const x of [-2.6,0,2.6])for(const z of [-2.9,2.9]){const bottom=ground(p.x+x,p.z+z).y-p.y;box(home,'Grounded support post',x,(floor+bottom)/2,z,.2,floor-bottom,.2,wood);}
  box(home,'Raised house floor',0,floor,0,5.6,.2,6.6,wood);for(const x of [-2.2,2.2])box(shell,'Side wall',x,floor+1.25,-.2,.16,2.5,5.4,wall);box(shell,'Rear wall',0,floor+1.25,-2.8,4.4,2.5,.16,wall);for(const x of [-1.3,1.3])box(shell,'Front wall',x,floor+1.25,2.4,1.8,2.5,.16,wall);
  for(const x of [-1.4,1.4]){box(shell,'Shutter',x,floor+1.5,2.52,.8,1,.1,wood);for(let k=0;k<4;k++)box(shell,'Shutter slat',x-.3+k*.2,floor+1.5,2.59,.04,.85,.04,accent);}box(shell,'Door',0,floor+.95,2.52,.7,1.9,.1,wood);
  const profileShape=new T.Shape();profileShape.moveTo(-2.9,0);profileShape.lineTo(0,profile.theme==='mangrove'?2.2:1.5);profileShape.lineTo(2.9,0);profileShape.closePath();const roof=new T.Mesh(new T.ExtrudeGeometry(profileShape,{depth:6.7,bevelEnabled:false}),roofMat);roof.position.set(0,floor+2.5,-3.4);roof.name=profile.theme==='mangrove'?'Malay-inspired broad gable':'Simple timber-house gable';shell.add(roof);
  if(profile.theme==='mangrove'){const awning=box(shell,'Extended veranda awning',0,floor+2.15,3.35,5.7,.15,1.7,roofMat);awning.rotation.x=.12;for(let k=0;k<14;k++)box(home,'Decorative veranda lattice',-2.4+k*.36,floor+.6,3.2,.08,1.1,.08,wood);box(home,'Lattice handrail',0,floor+1.2,3.2,5.2,.1,.1,accent);}
  if(profile.theme==='lake-gardens'){for(let k=0;k<18;k++)box(shell,'Bamboo-color wall strip',-2.1+k*.24,floor+1.25,-2.9,.04,2.4,.03,wood);}
  if(profile.theme==='floodplain'){for(let k=0;k<4;k++)box(home,'Flood-level color band',-2.6,.4+k*.4,2.9,.22,.07,.22,accent);}
  const steps=Math.ceil(floor/.25);for(let k=0;k<steps;k++)box(home,'Front stairs',.8,.12+k*.25,4.5-k*.1,1.2,.2,.2,wood);
  obstacles.push({x:p.x,z:p.z+.5,halfX:3,halfZ:4.6});
 }
 return{group,homes,obstacles,benches};
}







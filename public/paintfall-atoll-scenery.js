import {buildRegionalScenery} from './paintfall-regional-scenery.js';
export function buildAtollScenery(T,{land,ground,spawn,profile}){
 if(profile.theme==='roof-loft')return buildNarrowAtollScenery(T,{land,ground,spawn,profile});
 const result=buildRegionalScenery(T,{land,ground,spawn,style:profile.style,cues:profile.cues}),mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95}),pale=mat(0xd3c7ac),green=mat(0x83a180),wood=mat(0xa18b6d);const compact=profile.theme==='roof-loft',siteRadius=compact?3.5:7;let center;
 for(let i=0;i<1800;i++){const a=i*2.4,r=9+Math.sqrt(i)*1.1,p=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(p&&Math.hypot(p.x,p.z)<54&&Array.from({length:16},(_,j)=>ground(p.x+Math.cos(j*Math.PI/8)*siteRadius,p.z+Math.sin(j*Math.PI/8)*7)).every(Boolean)&&result.visits.every(v=>p.distanceTo(v.target)>(compact?10:18))){center=p;break;}}
 const add=(geo,m,p,y,name)=>{const o=new T.Mesh(geo,m);o.position.copy(p);o.position.y+=y;o.name=name;result.group.add(o);return o;};
 if(center){for(let i=0;i<6;i++){const a=i*2.4,p=ground(center.x+Math.cos(a)*(compact?2:4),center.z+Math.sin(a)*(compact?1.5:3));if(!p)continue;
  if(profile.theme==='raised-open'){add(new T.CylinderGeometry(.16,.26,3.8,8),wood,p,1.9,'Pandanus silhouette trunk');for(let j=0;j<8;j++){const leaf=add(new T.BoxGeometry(.24,.06,2.3),green,p,3.7,'Long pandanus leaf study');leaf.rotation.y=j*Math.PI/4;leaf.rotation.x=.28;leaf.position.x+=Math.sin(j*Math.PI/4)*.8;leaf.position.z+=Math.cos(j*Math.PI/4)*.8;}for(const side of [-1,1]){const root=add(new T.CylinderGeometry(.05,.09,1.7,6),wood,p,.7,'Pandanus prop-root study');root.rotation.z=side*.55;root.position.x+=side*.4;}result.obstacles.push({x:p.x,z:p.z,halfX:.85,halfZ:.85});}
  else if(profile.theme==='veranda-home'){const h=2+i%3;add(new T.CylinderGeometry(.25,.95,h,5),pale,p,h/2,'Limestone pinnacle study');result.obstacles.push({x:p.x,z:p.z,halfX:1,halfZ:1});}
  else{const rock=add(new T.IcosahedronGeometry(.9,0),pale,p,.45,'Coral-shore rock study');rock.scale.set(1.5,.6,1.1);result.obstacles.push({x:p.x,z:p.z,halfX:1.5,halfZ:1.1});}}
 result.clearings.push({x:center.x,z:center.z,radius:compact?5:10});for(let i=0;i<150;i++){const a=i*2.4,p=ground(center.x+Math.cos(a)*(compact?5:10),center.z+Math.sin(a)*(compact?5:10));if(p&&!result.obstacles.some(o=>Math.abs(p.x-o.x)<o.halfX+1&&Math.abs(p.z-o.z)<o.halfZ+1)){result.visits.push({name:profile.features[0],point:p,target:center.clone().add(new T.Vector3(0,2,0)),viewOffset:new T.Vector3(13,15,18)});break;}}}
 result.waterBounds=[];result.group.traverse(o=>{if(o.isMesh&&o.material?.color?.getHex()===0x79c7d7)result.waterBounds.push(new T.Box3().setFromObject(o));});return result;
}
function buildNarrowAtollScenery(T,{land,ground,spawn,profile}){
 const group=new T.Group();group.name='Narrow source-atoll scenery';land.add(group);const visits=[],obstacles=[],clearings=[],mat=c=>new T.MeshStandardMaterial({color:c,roughness:1}),pale=mat(0xd3c7ac),green=mat(0x83a180),wood=mat(0xa18b6d);
 for(let i=0;i<3;i++){let p;for(let j=0;j<3000;j++){const a=j*2.4+i,r=3+Math.sqrt(j)*1.1,q=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(q&&Math.hypot(q.x,q.z)<60&&visits.every(v=>q.distanceTo(v.target)>7)&&Array.from({length:8},(_,k)=>ground(q.x+Math.cos(k*Math.PI/4)*.65,q.z+Math.sin(k*Math.PI/4)*.65)).every(Boolean)){p=q;break;}}if(!p)continue;
  const add=(geo,m,y)=>{const o=new T.Mesh(geo,m);o.position.copy(p);o.position.y+=y;group.add(o);return o;};
  if(i===1){add(new T.CylinderGeometry(.04,.08,1.8,7),wood,.9).name='Small coastal palm silhouette';for(let j=0;j<6;j++){const leaf=add(new T.BoxGeometry(.07,.02,.8),green,1.7);leaf.rotation.y=j*Math.PI/3;leaf.rotation.x=.3;leaf.position.x+=Math.sin(j*Math.PI/3)*.25;leaf.position.z+=Math.cos(j*Math.PI/3)*.25;}obstacles.push({x:p.x,z:p.z,halfX:.1,halfZ:.1});}
  else{const rock=add(new T.IcosahedronGeometry(.3,0),pale,.15);rock.scale.set(1,.5,1);rock.name=i===0?'Pale shore-rock study':'Coral-gravel clearing study';obstacles.push({x:p.x,z:p.z,halfX:.35,halfZ:.35});}
  clearings.push({x:p.x,z:p.z,radius:1.2});let point=p;for(let j=0;j<40;j++){const q=ground(p.x+Math.cos(j*2.4)*1.2,p.z+Math.sin(j*2.4)*1.2);if(q){point=q;break;}}visits.push({name:[profile.features[0],'Coastal palm study','Coral-gravel clearing study'][i],target:p.clone().add(new T.Vector3(0,.4,0)),point,viewOffset:new T.Vector3(4,5,6)});
 }
 return{group,visits,obstacles,clearings,waterBounds:[]};
}

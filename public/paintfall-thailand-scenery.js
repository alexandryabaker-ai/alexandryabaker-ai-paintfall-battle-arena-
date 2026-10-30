import {buildRegionalScenery} from './paintfall-regional-scenery.js';
export function buildThailandScenery(T,{land,ground,spawn}){
 const result=buildRegionalScenery(T,{land,ground,spawn,style:'mountain',cues:['Quiet canal']});const stone=new T.MeshStandardMaterial({color:0xd2c8b5,roughness:1}),cap=new T.MeshStandardMaterial({color:0x87b49d,roughness:1}),accent=new T.MeshStandardMaterial({color:0xb6a0d0});let center;
 for(let i=0;i<200;i++){const a=i*2.4,r=18+Math.sqrt(i),p=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(p&&Array.from({length:8},(_,k)=>ground(p.x+Math.cos(k*Math.PI/4)*7,p.z+Math.sin(k*Math.PI/4)*7)).every(Boolean)&&result.visits.every(v=>Math.hypot(p.x-v.target.x,p.z-v.target.z)>15)){center=p;break;}}
 if(center){
  for(let i=0;i<3;i++){
   const x=center.x+(i-1)*4.2,z=center.z+Math.sin(i*1.8)*1.2,p=ground(x,z),corners=[[-2.8,-1.5],[2.8,-1.5],[-2.8,1.5],[2.8,1.5]].map(([a,b])=>ground(x+a,z+b));if(!p||corners.some(q=>!q))continue;
   const height=[6.5,10,8][i],profile=new T.Shape();profile.moveTo(-2.8,0);profile.lineTo(-2.8,height*.55);profile.lineTo(-2.2,height*.62);profile.lineTo(-2.5,height*.85);profile.lineTo(-1.4,height);profile.lineTo(-.4,height*.9);profile.lineTo(.5,height*.97);profile.lineTo(1.9,height*.8);profile.lineTo(2.8,height*.73);profile.lineTo(2.8,0);profile.closePath();
   const cliff=new T.Mesh(new T.ExtrudeGeometry(profile,{depth:2.6,bevelEnabled:true,bevelSize:.12,bevelThickness:.12,bevelSegments:1,steps:1}),stone);cliff.name='Sculpted limestone curtain';cliff.position.set(x,Math.min(...corners.map(q=>q.y)),z-1.3);result.group.add(cliff);
   for(let j=0;j<4;j++){const vine=new T.Mesh(new T.SphereGeometry(.5,8,6),cap);vine.name='Cliff-hanging greenery';vine.scale.set(.5,1.7+j*.25,.5);vine.position.set(x-1.8+j*1.1,cliff.position.y+height*(.65+Math.sin(j)*.08),z+1.4);result.group.add(vine);}
   result.obstacles.push({x,z,halfX:3,halfZ:1.6});
  }
  const v={name:'Teakglow Limestone Curtains',target:center.clone().add(new T.Vector3(0,4,0)),viewOffset:new T.Vector3(4,12,22)};
  for(let i=0;i<100;i++){const a=i*2.4,p=ground(center.x+Math.cos(a)*12,center.z+Math.sin(a)*12);if(p&&!result.obstacles.some(o=>Math.abs(p.x-o.x)<o.halfX+1&&Math.abs(p.z-o.z)<o.halfZ+1)){v.point=p;break;}}if(v.point)result.visits.push(v);
 }
 return result;
}


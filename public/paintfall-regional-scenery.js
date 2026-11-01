import {createMountainPeakGeometry} from './paintfall-winter-mountains.js';
// Original landscape forms. Locations are procedural, not geographical replicas.
export function buildRegionalScenery(T,{land,ground,style,cues,spawn}) {
 const group=new T.Group();group.name='regional-landscape';land.add(group);
 const visits=[],obstacles=[],clearings=[];
 const stone=new T.MeshStandardMaterial({color:style==='desert'?0xd5a882:0xa6a3c8,roughness:1});
 const green=new T.MeshStandardMaterial({color:0x83b99b,roughness:1});
 const pale=new T.MeshStandardMaterial({color:['ice','mountain'].includes(style)?0xe9f1f4:0xe8d8ad,roughness:.8});
 const water=new T.MeshStandardMaterial({color:0x79c7d7,roughness:.3,side:T.DoubleSide});
 function add(geometry,material,p,y=0){const m=new T.Mesh(geometry,material);m.position.copy(p);m.position.y+=y;group.add(m);return m;}
 function site(i){for(let j=0;j<200;j++){const a=j*2.4+i*2,r=12+Math.sqrt(j)*2,p=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(p&&!obstacles.some(o=>Math.abs(p.x-o.x)<o.halfX+8&&Math.abs(p.z-o.z)<o.halfZ+8))return p;}return null;}
 for(const [i,cue] of cues.entries()){
  const p=site(i);if(!p)continue;const text=cue.toLowerCase();let solid=false;
  if(/water|canal|river|lake|shore|coast|sound|marsh|wetland|creek|spring|inlet|bay/.test(text)){
   const vertices=[];
   for(let j=0;j<30;j++){const z=p.z-8+j*.55,x=p.x+Math.sin(j*.2)*2,w=1.2;const q=[[x-w,z],[x+w,z],[x+w,z+.55],[x-w,z+.55]].map(([x,z])=>ground(x,z));if(q.every(Boolean))for(const k of [0,1,2,0,2,3])vertices.push(q[k].x,q[k].y+.1,q[k].z);}
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.computeVertexNormals();add(g,water,new T.Vector3());
  } else if(/forest|wood|tree|canop|grove/.test(text)){
   for(let j=0;j<5;j++){const q=ground(p.x+Math.cos(j*2.4)*3,p.z+Math.sin(j*2.4)*3);if(!q)continue;add(new T.CylinderGeometry(.3,.6,6,8),stone,q,3);add(new T.IcosahedronGeometry(2.3,1),green,q,6);obstacles.push({x:q.x,z:q.z,halfX:.6,halfZ:.6});}
  } else {
   solid=true;
   if(/dune|sand|plain|prairie|grass|salt/.test(text)){const m=add(new T.SphereGeometry(4,16,10),pale,p,1);m.scale.y=.45;}
   else if(/canyon|valley|rock|cliff|terrace|cave|hoodoo/.test(text)){for(let j=0;j<4;j++)add(new T.CylinderGeometry(3-j*.35,3.3-j*.35,1.4,10),j%2?stone:pale,p,.7+j*1.4);}
   else if(/mountain|peak|ridge|alpine|teton|glacier|volcanic/.test(text)){
    const seed=i+1;
    const mountain=add(createMountainPeakGeometry(T,4.3,9,seed),stone,p,.4);mountain.name='faceted regional mountain';
    const cap=add(createMountainPeakGeometry(T,4.3,9,seed,true),pale,p,.4);cap.name='regional snow cap';
   } else {add(new T.ConeGeometry(4,9,12),stone,p,4.5);if(style==='ice'||style==='mountain')add(new T.ConeGeometry(1.5,3.4,12),pale,p,7.5);}
   obstacles.push({x:p.x,z:p.z,halfX:4,halfZ:4});
  }
  clearings.push({x:p.x,z:p.z,radius:solid?6:9});
  for(let j=0;j<100;j++){const a=j*2.4,q=ground(p.x+Math.cos(a)*9,p.z+Math.sin(a)*9);if(q&&!obstacles.some(o=>Math.abs(q.x-o.x)<o.halfX+1&&Math.abs(q.z-o.z)<o.halfZ+1)){visits.push({name:cue+' study',target:p.clone().add(new T.Vector3(0,solid?3:1,0)),point:q});break;}}
 }
 return {group,visits,obstacles,clearings};
}


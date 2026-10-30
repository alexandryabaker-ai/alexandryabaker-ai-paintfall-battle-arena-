import { rideMaterial } from './paintfall-california-colors.js';
// Owner-approved names/concepts. Layouts and building silhouettes are original
// construction proposals; no boarding, physics or inter-region travel yet.
export function buildCaliforniaBuilding(T,{scene,sites,label=()=>{}}){
 const group=new T.Group();group.name='california-building';group.position.set(650,0,180);scene.add(group);
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.8,...extra});
 const m={ground:mat(0xa8b397),path:mat(0xe5d5b5),wall:mat(0xdfc9a7),wood:mat(0x715b64),roof:mat(0x56526e),purple:mat(0x9f79cf),pink:mat(0xe598b4),blue:mat(0x69c8cf),gold:mat(0xecc274),metal:mat(0xb9cbd2,{metalness:.6,roughness:.32}),dark:mat(0x354753),water:mat(0x86dce3,{transparent:true,opacity:.45})};
 const add=(parent,geo,material,x=0,y=0,z=0,name='')=>{const o=new T.Mesh(geo,material);o.position.set(x,y,z);o.name=name;o.castShadow=o.receiveShadow=true;parent.add(o);return o;};
 const box=(p,x,y,z,w,h,d,material,name='')=>add(p,new T.BoxGeometry(w,h,d),material,x,y,z,name);
 const cylinder=(p,x,y,z,r,h,material)=>add(p,new T.CylinderGeometry(r,r,h,20),material,x,y,z);
 const ground=box(group,0,-.25,0,230,.5,225,m.ground,'California architectural park foundation');
 const plaza=add(group,new T.CylinderGeometry(15,15,.2,40),m.path,0,.1,0,'Central gathering plaza');
 for(const [x,z]of [[-44,-40],[44,-40],[-44,42],[44,42]]){
  const walk=add(group,new T.BoxGeometry(5,.12,Math.hypot(x,z)),m.path,x/2,.12,z/2,'District walking path');walk.rotation.y=Math.atan2(x,z);
 }
 const rides=[];
 function district(key,name,x,z,description){const root=new T.Group();root.position.set(x,0,z);group.add(root);label(root,name,0,36,0);return{key,name,parent:root,description,cars:[],progress:0,phase:'Station'};}
 function track(ride,points,color){ color=rideMaterial(T,ride.key,color);
  const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),true,'centripetal');ride.path=curve;
  for(const side of [-1,1]){
   const pts=[];for(let i=0;i<=260;i++){const u=i/260,p=curve.getPointAt(u),t=curve.getTangentAt(u),v=new T.Vector3().crossVectors(t,new T.Vector3(0,1,0)).normalize().multiplyScalar(.65*side);pts.push(p.add(v));}
   add(ride.parent,new T.TubeGeometry(new T.CatmullRomCurve3(pts,true),320,.16,6,true),color,0,0,0,'Twin coaster running rail');
  }
  const sleepers=new T.InstancedMesh(new T.BoxGeometry(1.65,.15,.2),m.dark,140),dummy=new T.Object3D();
  for(let i=0;i<140;i++){const u=i/140;dummy.position.copy(curve.getPointAt(u));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),curve.getTangentAt(u));dummy.updateMatrix();sleepers.setMatrixAt(i,dummy.matrix);}ride.parent.add(sleepers);
  for(let i=0;i<28;i++){const p=curve.getPointAt(i/28);if(p.y>3)cylinder(ride.parent,p.x,p.y/2,p.z,.22,p.y,m.dark);}
  for(let i=0;i<3;i++){
   const car=new T.Group();box(car,0,.55,0,1.9,.7,2.8,color,'Paint train body');
   for(const z of [-.65,.65]){box(car,0,1,z,1.6,.8,.2,m.dark,'Seat back');const bar=add(car,new T.TorusGeometry(.6,.07,6,16,Math.PI),m.gold,0,.9,z+.35,'Restraint shape study');bar.rotation.x=Math.PI/2;}
   for(const x of [-.9,.9])for(const z of [-.85,.85]){const w=cylinder(car,x,.15,z,.25,.18,m.dark);w.rotation.z=Math.PI/2;}
   ride.parent.add(car);ride.cars.push(car);
  }
  box(ride.parent,0,1,24,13,1.5,7,m.path,'Station platform');box(ride.parent,0,5,26,14,.5,6,m.roof,'Station shelter');
  rides.push(ride);return ride;
 }
 const mystery=district('mystery','Paint Mystery Train-house Falls',-48,-43,'A mansion train-coaster study with branching-looking passages, opening doors and a timed reversal. The route is a first layout proposal.');
 for(const [x,z,w,d,h]of [[-10,-3,12,13,12],[5,-8,12,12,17],[13,7,9,12,10],[-5,12,12,7,9]]){
  // Open passage at track level; upper rooms create a readable architectural maze.
  box(mystery.parent,x,h*.55+4,z,w,h*.65,d,m.wall,'Raised mansion wing');
  const roof=add(mystery.parent,new T.ConeGeometry(w*.8,5,4),m.roof,x,h*.88+7,z,'Mansion gable study');roof.rotation.y=Math.PI/4;
  for(const dx of [-w*.35,w*.35])box(mystery.parent,x+dx,3,z,.65,6,.65,m.wood,'Passage column');
  for(let j=0;j<3;j++)box(mystery.parent,x-w*.3+j*w*.3,h*.6+4,z+d/2+.03,1,1.7,.12,m.blue,'Mansion window');
  box(mystery.parent,x+w*.25,h*.88+8,z-d*.2,1.4,5,1.4,m.wood,'Asymmetric mansion chimney');
 }
 for(const [a,b]of [[[-10,-3],[5,-8]],[[5,-8],[13,7]],[[13,7],[-5,12]],[[-5,12],[-10,-3]]]){
  const dx=b[0]-a[0],dz=b[1]-a[1],gallery=box(mystery.parent,(a[0]+b[0])/2,10,(a[1]+b[1])/2,3.8,3.5,Math.hypot(dx,dz),m.wall,'Connecting mansion gallery');gallery.rotation.y=Math.atan2(dx,dz);
 }
 for(const x of [-7,7])box(mystery.parent,x,3,16,4,6,4,m.wall,'Mansion entry pier');
 box(mystery.parent,0,6.5,16,18,2,4,m.purple,'Open train passage lintel');
 const doorPivot=new T.Group();doorPivot.position.set(-5,3,4);mystery.parent.add(doorPivot);box(doorPivot,1.5,1.8,0,3,3.6,.25,m.purple,'Surprise passage door');
 track(mystery,[[0,3,24],[-19,3,23],[-24,7,7],[-17,17,-18],[-3,19,-24],[14,5,-18],[22,4,-1],[8,6,9],[-6,4,3],[-13,5,15]],m.purple);
 const castle=district('castle','CastleWay Paint',48,-43,'Courtyard and tower coaster, with an elevated climb and a low pass beside transparent-paint pools. Original architecture, not a landmark replica.');
 for(const x of [-14,14])for(const z of [-12,12]){cylinder(castle.parent,x,10,z,4,20,m.wall);add(castle.parent,new T.ConeGeometry(4.8,6,8),m.pink,x,23,z,'Tower roof');}
 for(const x of [-14,14])box(castle.parent,x,8,0,3,12,24,m.wall,'Courtyard side arcade');
 box(castle.parent,0,15,-12,27,5,3,m.wall,'Overhead castle gallery');
 for(let i=0;i<7;i++)box(castle.parent,-12+i*4,18,-12,2,2,3,m.gold,'Parapet');
 add(castle.parent,new T.CylinderGeometry(7,7,.3,32),m.water,0,.4,1,'Transparent-paint courtyard pool');
 track(castle,[[0,3,24],[-23,5,18],[-27,17,-8],[-19,30,-22],[2,32,-26],[24,9,-18],[26,4,4],[10,3,13],[0,5,6],[-8,4,16]],m.gold);
 const art=district('art','Artistic Coaster Views',-48,45,'A coaster threading original curved metallic architecture. Colored light and paint pulses are visual placeholders; no music is playing yet.');
 for(let i=0;i<6;i++){
  const shape=new T.Shape();shape.moveTo(-5,0);shape.quadraticCurveTo(-11,14,-3,22+i%3*3);shape.quadraticCurveTo(8,18,8,0);shape.closePath();
  const shell=add(art.parent,new T.ExtrudeGeometry(shape,{depth:2,bevelEnabled:true,bevelSize:.3,bevelThickness:.2,bevelSegments:2,steps:1}),m.metal,(i%3-1)*12,0,i<3?-10:8,'Curved architectural sail');shell.rotation.y=(i%3-1)*.35;
 }
 const pulses=[];for(let i=0;i<8;i++){const light=add(art.parent,new T.SphereGeometry(.5,8,6),i%2?m.pink:m.blue,-21+i*6,1,20,'Paint pulse study');pulses.push(light);}
 track(art,[[0,3,24],[-21,8,19],[-25,19,-1],[-16,27,-20],[4,24,-23],[22,8,-15],[24,5,9],[11,14,15],[0,6,5],[-10,3,17]],m.blue);
 const sky=district('spring','Spring Spinning PaintFalls',48,45,'Rotating station cars, a building climb, then a launch toward a reserved portal. The return is a preview loop; world travel is not connected.');
 box(sky.parent,0,23,-8,16,46,14,m.wall,'Sky-coaster climbing building');
 for(let i=0;i<9;i++)box(sky.parent,0,5+i*4.5,.1,12,.5,.2,i%2?m.purple:m.blue,'Building floor accent');
 const turntable=cylinder(sky.parent,0,1,24,8,2,m.purple);
 track(sky,[[0,3,24],[-8,4,18],[-10,9,3],[-10,25,-8],[-7,45,-13],[0,49,-16],[14,57,-19],[27,68,-12],[34,55,10],[27,25,28],[10,5,31]],m.pink);
 const portalPoint=sky.path.getPointAt(.61),portal=add(sky.parent,new T.TorusGeometry(5,.5,10,40),m.purple,...portalPoint.toArray(),'Reserved travel portal');label(sky.parent,'Portal reserved • travel later',portalPoint.x,portalPoint.y+8,portalPoint.z);
 const site={x:650,z:180,group,title:'California • Building Park',description:'First architectural park construction proposal, using the four approved ride concepts. San Jose / southern Bay-area placement remains a draft. Select an attraction below to inspect it.',rides:rides.map(r=>r.name+' — '+(r===sky?'sky-coaster sequence study':'track and building study'))};sites['california-building']=site;
 label(group,'California • Building Park',0,83,0);
 function pose(ride){ride.cars.forEach((car,i)=>{const u=(ride.progress-i*.018+1)%1;car.position.copy(ride.path.getPointAt(u));car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),ride.path.getTangentAt(u));if(ride===sky&&ride.phase==='Rotating station')car.rotateY(ride.stationSpin||0);});}
 function update(time){
  const cycle=time%36;
  // Continuous forward/reverse motion at the door, with a held suspense beat.
  const t=time%34;
  mystery.progress=t<15?.04+t/15*.48:t<17?.52:t<21?.52-(t-17)/4*.07:.45+(t-21)/13*.59;
  mystery.phase=t<15?'Mansion passages':t<17?'Door hold':t<21?'Reversal study':'Return to station';
  doorPivot.rotation.y=t>=14&&t<=22?Math.sin(Math.min(1,(t-14)/2)*Math.PI/2)*1.45:0;
  castle.progress=(time/42)%1;castle.phase='Courtyard circuit';art.progress=(time/38)%1;art.phase='Architecture circuit';
  sky.progress=cycle<5?.015:cycle<18?.015+(cycle-5)/13*.365:cycle<24?.38+(cycle-18)/6*.27:.65+(cycle-24)/12*.365;
  sky.phase=cycle<5?'Rotating station':cycle<18?'Building climb':cycle<24?'Launch toward portal':'Preview return';sky.stationSpin=cycle<5?cycle*Math.PI*.8:0;
  turntable.rotation.y=cycle<5?cycle*Math.PI*.8:0;portal.rotation.z=time*.25;
  pulses.forEach((o,i)=>o.scale.setScalar(1+.2*Math.sin(time*3-i*.8)));
  rides.forEach(pose);
 }
 update(0);
 return{site,rides,sky,update,ground,plaza};
}


// First arena installation of the saved Nevada park studies. No renderer,
// physics dispatcher or inter-park travel is created here. Visitors can explore
// the plazas; the unoccupied test tracks remain behind visible barriers.
import {buildTiltingTowersTrack} from './paintfall-towers-coaster-track.js';
import {createNevadaRacingVehicles} from './paintfall-nevada-racing-vehicles.js';
export function buildNevadaArenaParks(T,{group,destination}){
 if(destination.id!=='state:Nevada')return null;
 const root=new T.Group();root.name='Nevada World Hub and Racin’ Park';group.add(root);
 const obstacles=[],trains=[],sites=[];
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.78,...extra});
 const m={sand:mat(0xc9aa7f),path:mat(0xe2cfa7),dark:mat(0x243447),blue:mat(0x34aeda),purple:mat(0x9e69db),pink:mat(0xef78ad),gold:mat(0xffce61),wood:mat(0x816043),white:mat(0xf5ead7),water:mat(0x5fcfd7,{roughness:.26,metalness:.18})};
 function mesh(parent,geometry,material,name,x=0,y=0,z=0){const o=new T.Mesh(geometry,material);o.name=name;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 const box=(p,x,y,z,w,h,d,material,name)=>mesh(p,new T.BoxGeometry(w,h,d),material,name,x,y,z);
 const cylinder=(p,x,y,z,r,h,material,name)=>mesh(p,new T.CylinderGeometry(r,r,h,16),material,name,x,y,z);
 function block(site,x,z,hx,hz){obstacles.push({x:site.x+x,z:site.z+z,halfX:hx,halfZ:hz});}
 function sign(parent,title,subtitle,x,y,z,width=12){
  const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#152e3c';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#ffd16c';ctx.lineWidth=8;ctx.strokeRect(4,4,1016,248);ctx.textAlign='center';ctx.fillStyle='#f7f5e9';ctx.font='bold 62px sans-serif';ctx.fillText(title,512,100);ctx.fillStyle='#bee9de';ctx.font='36px sans-serif';ctx.fillText(subtitle,512,183);
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const s=new T.Sprite(new T.SpriteMaterial({map:texture,depthWrite:false,toneMapped:false}));s.name=title+' sign';s.position.set(x,y,z);s.scale.set(width,width/4,1);parent.add(s);return s;
 }
 function bench(site,x,z){
  box(site.group,x,.55,z,4.2,.18,1,m.wood,'Park spectator bench');box(site.group,x,1,z+.48,4.2,.8,.13,m.wood,'Park bench back');
  for(const dx of [-1.5,1.5])box(site.group,x+dx,.28,z,.18,.5,.8,m.dark,'Park bench leg');block(site,x,z,2.2,.65);
 }
 function fencedTestArea(site,hx,hz){
  // A simple continuous barrier reserves clearance around the complete track.
  block(site,0,0,hx,hz);const p=site.group;
  for(const z of [-hz,hz]){box(p,0,.72,z,hx*2,.08,.12,m.gold,'Closed track-test barrier');for(let x=-hx;x<=hx;x+=4)cylinder(p,x,.52,z,.06,1.04,m.dark,'Track barrier post');}
  for(const x of [-hx,hx]){box(p,x,.72,0,.12,.08,hz*2,m.gold,'Closed track-test barrier');for(let z=-hz;z<=hz;z+=4)cylinder(p,x,.52,z,.06,1.04,m.dark,'Track barrier post');}
  sign(p,'TRACK TESTING','Boarding coming soon',0,2.3,hz+.15,10);
 }
 function rail(parent,points,color,name){
  const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),true,'centripetal'),left=[],right=[],up=new T.Vector3(0,1,0),railMat=mat(color,{metalness:.25,roughness:.45}),frames=curve.computeFrenetFrames(160,true);
  // Frenet's initial normal is arbitrary. Anchor it to upright at the station,
  // then carry that same roll around the loop for both the rails and coaches.
  const initialUp=up.clone().addScaledVector(frames.tangents[0],-up.dot(frames.tangents[0])).normalize(),roll=Math.atan2(frames.tangents[0].dot(frames.normals[0].clone().cross(initialUp)),frames.normals[0].dot(initialUp));
  for(let i=0;i<=160;i++){frames.normals[i].applyAxisAngle(frames.tangents[i],roll);frames.binormals[i].crossVectors(frames.tangents[i],frames.normals[i]).normalize();}
  const basis=new T.Matrix4(),n=new T.Vector3(),b=new T.Vector3(),tangent=new T.Vector3();curve.orientation=(u,q)=>{const f=u*160,a=Math.floor(f),next=Math.min(160,a+1);curve.getTangentAt(u,tangent);n.copy(frames.normals[a]).lerp(frames.normals[next],f-a);b.copy(n).cross(tangent).normalize();n.copy(tangent).cross(b).normalize();basis.makeBasis(b,n,tangent);return q.setFromRotationMatrix(basis);};
  for(let i=0;i<=160;i++){const t=i/160,p=curve.getPointAt(t),side=frames.binormals[i].clone().multiplyScalar(.58);left.push(p.clone().add(side));right.push(p.clone().sub(side));}
  for(const pts of [left,right])mesh(parent,new T.TubeGeometry(new T.CatmullRomCurve3(pts,true),160,.1,5,true),railMat,name+' rail');
  const ties=new T.InstancedMesh(new T.BoxGeometry(1.4,.12,.15),m.dark,100),dummy=new T.Object3D();ties.name=name+' track ties';
  for(let i=0;i<100;i++){dummy.position.copy(curve.getPointAt(i/100));curve.orientation(i/100,dummy.quaternion);dummy.updateMatrix();ties.setMatrixAt(i,dummy.matrix);}parent.add(ties);
  for(let i=0;i<18;i++){const p=curve.getPointAt(i/18),normal=new T.Vector3(0,1,0).applyQuaternion(curve.orientation(i/18,new T.Quaternion()));if(p.y>2&&normal.y>.97)cylinder(parent,p.x,p.y/2,p.z,.14,p.y,m.dark,name+' track support');}
  return curve;
 }
 function testTrain(parent,curve,color,name,speed,createCoach=null){
  const cars=[];for(let i=0;i<3;i++){const car=createCoach?createCoach():new T.Group();car.name=name+' unoccupied test car '+(i+1);if(!createCoach){box(car,0,.45,0,1.65,.65,2.6,color,'Paint car-train body');
   for(const z of [-.55,.6]){box(car,0,.9,z,1.35,.9,.24,m.dark,'Padded seat back');const belt=box(car,0,.7,z-.15,1.2,.13,.13,m.gold,'Visible test-car lap belt');belt.rotation.z=.1;}
   for(const x of [-.86,.86])for(const z of [-.82,.82]){const w=cylinder(car,x,.05,z,.25,.15,m.dark,'Car-train wheel');w.rotation.z=Math.PI/2;}}parent.add(car);cars.push(car);}
  const ride={name,curve,cars,speed,orientation:curve.orientation,spacing:createCoach?3.6:3.2,distance:0,length:curve.getLength()};trains.push(ride);return ride;
 }
 function site(id,title,x,z,hx,hz){
  const p=new T.Group();p.name=title+' arena site';p.position.set(x,.025,z);root.add(p);
  const s={id,title,x,z,group:p,entrance:{x,z:z+55,label:title+' visitor plaza'},status:'plaza-open-track-testing'};sites.push(s);
  box(p,0,.02,8,hx*2+10,.03,hz*2+48,m.path,'Walkable park plaza surface');fencedTestArea(s,hx,hz);
  for(const side of [-1,1]){box(p,side*7,2,43,.35,4,.35,m.purple,'Park entrance arch post');block(s,side*7,43,.23,.23);}
  box(p,0,4,43,14.4,.35,.5,m.purple,'Park entrance arch');sign(p,title,'Visitor plaza open • Rides testing',0,6.3,43,18);
  bench(s,-17,37);bench(s,17,37);sign(p,'PAINTFALL','Explore • Watch • Create together',-12,2.3,39,9);
  s.group.userData={parkSite:id,title,status:s.status,entrance:s.entrance,boardingEnabled:false,storySeats:[{x:-17,y:.64,z:37,facing:Math.PI},{x:17,y:.64,z:37,facing:Math.PI}]};return s;
 }
 const hub=site('hub','World Hub',0,-125,43,28),h=hub.group;
 const towerTrack=buildTiltingTowersTrack(T,h);
 const towerTrain=testTrain(h,towerTrack.curve,m.purple,'PAINTFALL Towers Coaster',8);towerTrain.orientation=towerTrack.orientation;
 sign(h,'PAINTFALL Towers Coaster','Unoccupied track tests',-18,31,2,12);
 // Saved sky stations remain visibly under construction until a complete ride is ready.
 box(h,31,18,-5,7,36,7,m.dark,'SKYFALL departure tower');box(h,31,37,-5,11,1,10,m.blue,'SKYFALL rooftop station');sign(h,'SKYFALL PaintCoaster','Station under construction',31,41,-5,14);
 cylinder(h,-29,1,13,5,2,m.purple,'Second sky station foundation');sign(h,'SKY STATION','Design in development',-29,5,13,10);
 cylinder(h,0,.35,33,3,.7,m.blue,'PAINTFALL Fountain of Art basin');block(hub,0,33,3.2,3.2);
 const jets=new T.Group();jets.name='Harmless Fountain of Art water arcs';h.add(jets);
 for(let i=0;i<8;i++){const a=i*Math.PI/4,pts=[[Math.cos(a)*2.5,.6,33+Math.sin(a)*2.5],[Math.cos(a),4,33+Math.sin(a)],[0,.6,33]].map(p=>new T.Vector3(...p));mesh(jets,new T.TubeGeometry(new T.CatmullRomCurve3(pts),18,.055,5,false),m.water,'Fountain water arc');}
 sign(h,'WORLD MAP / TRAVEL','Use the map button to choose a place',-21,3.2,32,12);
 const racing=site('racing','Racin’ Park',-105,-140,40,25),r=racing.group,vehicles=createNevadaRacingVehicles(T);
 for(let lane=0;lane<3;lane++){
  // Keep each Nevada lift/drop/loop study in its own non-overlapping bay.
  const offset=(lane-1)*23,pts=[[-7,3,14],[-7,3,8],[-7,4,2],[-7,10,-6],[-7,20,-13],[-3,22,-18],[4,18,-18],[7,5,-12],[2,3,-8],[2,3,-3]];
  for(let i=0;i<=24;i++){const a=-Math.PI/2+i/24*Math.PI*2;pts.push([2+3*i/24,9+Math.sin(a)*6,Math.cos(a)*6]);}
  pts.push([5,3,8],[5,3,15],[0,3,21],[-7,3,22],[-7,3,20]);const points=pts.map(([x,y,z])=>[offset+x,y,z]);
  const ride=testTrain(r,rail(r,points,[0xef78ad,0xffce61,0x34aeda][lane],'Nevada racing track '+(lane+1)),[m.pink,m.gold,m.blue][lane],vehicles.specs[lane].label,11,()=>vehicles.createCoach(lane));ride.raceLane=lane;
 }
 sign(r,'THREE CAR-TRAIN TRACKS','Separated test lanes',0,24,0,18);
 sign(r,'The Paint Ride....Against Time','Sky station coming soon',0,4,-24,16);
 // Named reserved spaces retain the distinct kart and monster-truck directions.
 sign(r,'Ready-Set-Paint-Race','Go-karts • Coming soon',-23,2.8,32,12);
 sign(r,'Paint Splatter Cars','Monster trucks • Coming soon',23,2.8,32,12);
 box(root,-52.5,.035,-82,105,.025,6,m.sand,'Open pedestrian connection between Nevada park plazas');
 let elapsed=0,inspection=false;function update(dt){if(inspection)return;dt=Math.min(.05,Math.max(0,Number(dt)||0));elapsed+=dt;towerTrack.update(dt);for(const ride of trains){if(ride.raceLane!==undefined)ride.speed=11+4*Math.min(1,elapsed/20)+.9*Math.sin(elapsed*.55+ride.raceLane*Math.PI*2/3);ride.length=ride.curve.getLength();ride.distance=(ride.distance+dt*ride.speed)%ride.length;for(let i=0;i<ride.cars.length;i++){const t=((ride.distance-i*ride.spacing)%ride.length+ride.length)%ride.length/ride.length,car=ride.cars[i];car.position.copy(ride.curve.getPointAt(t));if(ride.orientation)ride.orientation(t,car.quaternion);else car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),ride.curve.getTangentAt(t));}}jets.scale.y=.94+Math.sin(elapsed*1.3)*.06;}
 function setInspectionMode(enabled){if(inspection===!!enabled)return;if(enabled){for(const ride of trains)if(ride.raceLane!==undefined)ride.distance=0;update(0);}inspection=!!enabled;}
 update(0);root.userData={arenaParks:true,phase:'Nevada visitor plazas and ground-track testing',boardingEnabled:false};
 return {group:root,sites,obstacles,bound:180,trains,towerTrack,update,setInspectionMode};
}

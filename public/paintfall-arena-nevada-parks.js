// First arena installation of the saved Nevada park studies. No renderer,
// physics dispatcher or inter-park travel is created here. Visitors can explore
// the plazas; the unoccupied test tracks remain behind visible barriers.
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
  const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),true,'centripetal'),left=[],right=[],up=new T.Vector3(0,1,0),railMat=mat(color,{metalness:.25,roughness:.45});
  for(let i=0;i<=160;i++){const t=i/160,p=curve.getPointAt(t),side=new T.Vector3().crossVectors(curve.getTangentAt(t),up);if(side.lengthSq()<.001)side.set(1,0,0);side.normalize().multiplyScalar(.58);left.push(p.clone().add(side));right.push(p.clone().sub(side));}
  for(const pts of [left,right])mesh(parent,new T.TubeGeometry(new T.CatmullRomCurve3(pts,true),160,.1,5,true),railMat,name+' rail');
  const ties=new T.InstancedMesh(new T.BoxGeometry(1.4,.12,.15),m.dark,100),dummy=new T.Object3D();ties.name=name+' track ties';
  for(let i=0;i<100;i++){dummy.position.copy(curve.getPointAt(i/100));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),curve.getTangentAt(i/100));dummy.updateMatrix();ties.setMatrixAt(i,dummy.matrix);}parent.add(ties);
  for(let i=0;i<18;i++){const p=curve.getPointAt(i/18);if(p.y>2)cylinder(parent,p.x,p.y/2,p.z,.14,p.y,m.dark,name+' track support');}
  return curve;
 }
 function testTrain(parent,curve,color,name,speed){
  const cars=[];for(let i=0;i<3;i++){const car=new T.Group();car.name=name+' unoccupied test car '+(i+1);box(car,0,.45,0,1.65,.65,2.6,color,'Paint car-train body');
   for(const z of [-.55,.6]){box(car,0,.9,z,1.35,.9,.24,m.dark,'Padded seat back');const belt=box(car,0,.7,z-.15,1.2,.13,.13,m.gold,'Visible test-car lap belt');belt.rotation.z=.1;}
   for(const x of [-.86,.86])for(const z of [-.82,.82]){const w=cylinder(car,x,.05,z,.25,.15,m.dark,'Car-train wheel');w.rotation.z=Math.PI/2;}parent.add(car);cars.push(car);}
  const ride={name,curve,cars,speed,distance:0,length:curve.getLength()};trains.push(ride);return ride;
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
 for(const x of [-6,6]){box(h,x,14,-2,5,28,5,m.dark,'PAINTFALL Towers');for(let j=0;j<6;j++)for(const z of [-4.56,.56])box(h,x,4+j*4,z,4,.45,.12,j%2?m.purple:m.blue,'Tower paint-light panel');}
 const towerPoints=[[-14,3,16],[-14,12,3],[-13,37,-12],[-9,39,-17],[-8,3,-22],[0,3,-25],[12,21,-23],[15,35,-13],[15,4,2],[22,4,14],[6,3,21]];
 testTrain(h,rail(h,towerPoints,0xffce61,'PAINTFALL Towers Coaster'),m.purple,'PAINTFALL Towers Coaster',8);
 sign(h,'PAINTFALL Towers Coaster','Unoccupied track tests',0,32,2,16);
 // Saved sky stations remain visibly under construction until a complete ride is ready.
 box(h,31,18,-5,7,36,7,m.dark,'SKYFALL departure tower');box(h,31,37,-5,11,1,10,m.blue,'SKYFALL rooftop station');sign(h,'SKYFALL PaintCoaster','Station under construction',31,41,-5,14);
 cylinder(h,-29,1,13,5,2,m.purple,'Second sky station foundation');sign(h,'SKY STATION','Design in development',-29,5,13,10);
 cylinder(h,0,.35,33,3,.7,m.blue,'PAINTFALL Fountain of Art basin');block(hub,0,33,3.2,3.2);
 const jets=new T.Group();jets.name='Harmless Fountain of Art water arcs';h.add(jets);
 for(let i=0;i<8;i++){const a=i*Math.PI/4,pts=[[Math.cos(a)*2.5,.6,33+Math.sin(a)*2.5],[Math.cos(a),4,33+Math.sin(a)],[0,.6,33]].map(p=>new T.Vector3(...p));mesh(jets,new T.TubeGeometry(new T.CatmullRomCurve3(pts),18,.055,5,false),m.water,'Fountain water arc');}
 sign(h,'WORLD MAP / TRAVEL','Use the map button to choose a place',-21,3.2,32,12);
 const racing=site('racing','Racin’ Park',-105,-140,40,25),r=racing.group;
 for(let lane=0;lane<3;lane++){
  // Keep each Nevada lift/drop/loop study in its own non-overlapping bay.
  const offset=(lane-1)*23,pts=[[-22,3,16],[-24,9,5],[-21,30,-12],[-16,31,-18],[-12,3,-24]];
  for(let i=0;i<=18;i++){const a=-Math.PI/2+i/18*Math.PI*2;pts.push([Math.cos(a)*8,12+Math.sin(a)*9,-24+i*.65]);}
  pts.push([15,5,-6],[23,12,5],[17,8,17],[5,3,23]);const points=pts.map(([x,y,z])=>[offset+x*.3,y*.65,z*.65]);
  testTrain(r,rail(r,points,[0xef78ad,0xffce61,0x34aeda][lane],'Nevada racing track '+(lane+1)),[m.pink,m.gold,m.blue][lane],'Car-train track test '+(lane+1),11+lane*.25);
 }
 sign(r,'THREE CAR-TRAIN TRACKS','Separated test lanes',0,24,0,18);
 sign(r,'The Paint Ride....Against Time','Sky station coming soon',0,4,-24,16);
 // Named reserved spaces retain the distinct kart and monster-truck directions.
 sign(r,'Ready-Set-Paint-Race','Go-karts • Coming soon',-23,2.8,32,12);
 sign(r,'Paint Splatter Cars','Monster trucks • Coming soon',23,2.8,32,12);
 box(root,-52.5,.035,-82,105,.025,6,m.sand,'Open pedestrian connection between Nevada park plazas');
 let elapsed=0;function update(dt){dt=Math.min(.05,Math.max(0,Number(dt)||0));elapsed+=dt;for(const ride of trains){ride.distance=(ride.distance+dt*ride.speed)%ride.length;for(let i=0;i<ride.cars.length;i++){const t=((ride.distance-i*3.2)%ride.length+ride.length)%ride.length/ride.length,car=ride.cars[i];car.position.copy(ride.curve.getPointAt(t));car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),ride.curve.getTangentAt(t));}}jets.scale.y=.94+Math.sin(elapsed*1.3)*.06;}
 update(0);root.userData={arenaParks:true,phase:'Nevada visitor plazas and ground-track testing',boardingEnabled:false};
 return {group:root,sites,obstacles,bound:180,trains,update};
}

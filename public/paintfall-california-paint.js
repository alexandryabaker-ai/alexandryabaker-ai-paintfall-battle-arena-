import { rideMaterial, addPaintTrackSplatters } from './paintfall-california-colors.js';
// First construction studies of the approved relaxed California Paint Park.
// Track switching is a visual sequence, not a ride-physics/boarding controller.
export function buildCaliforniaPaint(T,{scene,sites,label=()=>{},rail,train}){
 const group=new T.Group();group.name='california-paint';group.position.set(960,0,170);scene.add(group);
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.85,...extra});
 const m={ground:mat(0x91a681),path:mat(0xe4d4b4),rock:mat(0x9b9d91),wood:mat(0x866957),leaf:mat(0x557c60),blue:mat(0x65c9db),pink:mat(0xe8a3c8),purple:mat(0xa28bcf),gold:mat(0xecd080),water:mat(0x81d5df,{transparent:true,opacity:.55,side:T.DoubleSide}),dark:mat(0x3b5158)};
 const groundColor=rideMaterial(T,'paint-cliff-ground',m.blue),skyColor=rideMaterial(T,'paint-cliff-sky',m.pink),centerColor=rideMaterial(T,'paint-center-sky',m.purple);
 const mesh=(p,geo,material,x=0,y=0,z=0,name='')=>{const o=new T.Mesh(geo,material);o.position.set(x,y,z);o.name=name;o.castShadow=o.receiveShadow=true;p.add(o);return o;};
 const box=(p,x,y,z,w,h,d,material,name)=>mesh(p,new T.BoxGeometry(w,h,d),material,x,y,z,name);
 const cylinder=(p,x,y,z,r,h,material)=>mesh(p,new T.CylinderGeometry(r,r,h,20),material,x,y,z);
 const curve=points=>new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal');
 const tube=(p,path,r,material,name)=>mesh(p,new T.TubeGeometry(path,100,r,7,false),material,0,0,0,name);
 function ribbon(p,path,width,name){const verts=[],pairs=[];for(let i=0;i<=100;i++){const point=path.getPointAt(i/100),side=new T.Vector3().crossVectors(path.getTangentAt(i/100),new T.Vector3(0,1,0)).normalize().multiplyScalar(width/2);pairs.push([point.clone().add(side),point.clone().sub(side)]);}for(let i=0;i<100;i++){const q=[...pairs[i],...pairs[i+1]];for(const j of [0,2,1,1,2,3])verts.push(...q[j].toArray());}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.computeVertexNormals();return mesh(p,g,m.water,0,0,0,name);}
 box(group,0,-.3,0,280,.6,245,m.ground,'Paint Park foundation');
 box(group,0,.15,15,7,.3,180,m.path,'Shared park walking spine');
 const cliff=new T.Group();cliff.position.set(40,0,-62);group.add(cliff);
 label(cliff,'Cliff...Splash...Falls',0,54,0);
 for(let i=0;i<7;i++){const x=-24+i*8,h=15+(i%3)*6;const o=mesh(cliff,new T.IcosahedronGeometry(1,1),m.rock,x,h/2,-12,'Forested cliff study');o.scale.set(6,h/2,8);cylinder(cliff,x,h+3,-12,.6,6,m.wood);const tree=mesh(cliff,new T.IcosahedronGeometry(3.6,1),m.leaf,x,h+6,-12,'Cliff treetop');tree.scale.y=.8;}
 for(const x of [-9,-3,3,9])box(cliff,x,13,-3,4,24,.25,m.water,'Transparent-paint waterfall curtain');
 cylinder(cliff,0,.3,5,14,.4,m.water).name='Rainbow splash basin';
 const points=[[0,3,28],[-24,6,21],[-30,19,0],[-20,34,-20],[0,35,-27],[24,7,-14],[30,4,8],[13,5,19],[0,5,9],[-13,4,18]];
 const groundPath=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),true,'centripetal');
 const segmentStart=.08,segmentEnd=.17;
 function section(a,b,parent,material,name,offset=new T.Vector3()){
  const pts=Array.from({length:61},(_,i)=>groundPath.getPointAt(a+(b-a)*i/60).sub(offset));
  const line=new T.CatmullRomCurve3(pts);const root=new T.Group();root.name=name;parent.add(root);
  for(const side of [-1,1]){const railPoints=pts.map((p,i)=>p.clone().add(new T.Vector3().crossVectors(line.getTangentAt(i/60),new T.Vector3(0,1,0)).normalize().multiplyScalar(side*.65)));tube(root,new T.CatmullRomCurve3(railPoints),.15,material,'Running rail');}
  for(let i=0;i<=30;i++){const u=i/30,tie=box(root,0,0,0,1.7,.16,.22,m.dark,'Track cross-tie');tie.position.copy(line.getPointAt(u));tie.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),line.getTangentAt(u));}
  addPaintTrackSplatters(T,root,line,Math.max(3,Math.round((b-a)*45)));return root;
 }
 section(0,segmentStart,cliff,groundColor,'Fixed ground approach');section(segmentEnd,1,cliff,groundColor,'Fixed ground return');
 const departure=groundPath.getPointAt(segmentStart),detached=section(segmentStart,segmentEnd,cliff,skyColor,'Detachable sky section',departure);detached.position.copy(departure);
 const ramp=section(segmentStart,segmentEnd,cliff,m.gold,'Connected replacement ramp');
 const ground=train(cliff,{curve:groundPath},groundColor,3);Object.assign(ground,{key:'paint-cliff-ground',name:'Cliff...Splash...Falls',parent:cliff,progress:.38,phase:'Ground circuit'});
 const skyPoints=[departure.toArray(),[-30,24,1],[-16,49,-20],[11,70,-27],[42,64,-3],[44,37,24],[12,16,36],[-15,5,25]];
 const skyPath=new T.CatmullRomCurve3(skyPoints.map(p=>new T.Vector3(...p)),true,'centripetal');
 const sky=train(cliff,{curve:skyPath},skyColor,3);Object.assign(sky,{key:'paint-cliff-sky',name:'Cliff...Splash...Falls',menuName:'Cliff...Splash...Falls — sky component',parent:cliff,progress:0,phase:'Docked'});
 box(cliff,0,1,28,13,2,7,m.path,'Hybrid station proposal');
 label(cliff,'Connected replacement route • switch study',-22,10,17);
 const center=new T.Group();center.position.set(42,0,28);group.add(center);label(center,'Paint Splash Center',0,48,0);
 cylinder(center,0,20,0,5,40,m.purple);cylinder(center,0,40,0,10,1,m.gold);
 const buckets=[];for(let i=0;i<4;i++){const a=i*Math.PI/2,x=Math.cos(a)*12,z=Math.sin(a)*12;box(center,x,15,z,.5,30,.5,m.wood,'Splash structure support');const pivot=new T.Group();pivot.position.set(x,28,z);center.add(pivot);mesh(pivot,new T.CylinderGeometry(3.5,2.3,4,12,1,true),m.pink,0,0,0,'Tipping bucket study');buckets.push(pivot);tube(center,curve([[x,26,z],[x*1.2,22,z*1.2],[x*1.4,2,z*1.4]]),.18,m.water,'Bucket water curtain study');}
 const spiral=[];for(let i=0;i<=60;i++){const t=i/60,a=t*Math.PI*5;spiral.push([Math.cos(a)*11,3+t*35,Math.sin(a)*11]);}tube(center,curve(spiral),.24,m.blue,'Tower spiral route study');
 for(let i=0;i<5;i++){const arch=mesh(center,new T.TorusGeometry(4,.18,7,20,Math.PI),m.blue,-17+i*8,2,22,'Spray tunnel arch');arch.rotation.y=Math.PI/2;}
 const calmTrack=rail(center,[[0,3,27],[-20,9,15],[-14,25,-10],[1,39,-13],[18,43,0],[25,26,20],[11,9,31]],centerColor,true,true);
 addPaintTrackSplatters(T,center,calmTrack.curve,42);
 const calmSky=train(center,calmTrack,centerColor,3);Object.assign(calmSky,{key:'paint-center-sky',name:'Paint Splash Center',menuName:'Paint Splash Center — relaxing sky study',parent:center,progress:0});
 const quiet=new T.Group();quiet.position.set(-65,0,-10);group.add(quiet);label(quiet,'Rainbow Current • quiet tubing',0,19,0);
 const quietPath=new T.CatmullRomCurve3([[-27,.6,0],[-24,.6,-29],[0,.6,-40],[28,.6,-22],[28,.6,12],[8,.6,30],[-17,.6,26]].map(p=>new T.Vector3(...p)),true,'centripetal');ribbon(quiet,quietPath,8,'Quiet forest tubing channel');
 const floats=[];for(let i=0;i<6;i++){const ring=mesh(quiet,new T.TorusGeometry(1.3,.36,9,24),i%2?m.pink:m.gold,0,1,0,'Relaxing tube');ring.rotation.x=Math.PI/2;floats.push(ring);}
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2,x=Math.cos(a)*39,z=Math.sin(a)*45;cylinder(quiet,x,4,z,.6,8,m.wood);const o=mesh(quiet,new T.IcosahedronGeometry(5.5,1),m.leaf,x,10,z,'Tubing forest canopy');o.scale.y=.8;}
 for(let i=0;i<12;i++)mesh(group,new T.IcosahedronGeometry(4,1),m.leaf,-18,3,-63+i*10,'Quiet and active area planted separation');
 for(const z of [-28,16]){box(quiet,-35,1,z,2,.4,7,m.wood,'Quiet-channel bench');box(quiet,-36,2,z,.3,2,7,m.wood,'Bench back');}
 const board=new T.Group();board.position.set(-7,0,74);group.add(board);label(board,'BubbleSplash Station Board',0,18,0);
 cylinder(board,0,.3,0,25,.4,m.water).name='Optional activity basin';
 for(const x of [-18,18])box(board,x,.7,0,4,1,28,m.path,'Dock and refill access');box(board,0,.7,13,38,1,4,m.path,'Boardwalk connection');
 const boats=[];for(let i=0;i<4;i++){const boat=new T.Group();board.add(boat);const hull=mesh(boat,new T.SphereGeometry(1,16,9),i%2?m.blue:m.purple,0,.4,0,'Bubble-shaped boat hull');hull.scale.set(2.5,.8,3.2);box(boat,0,1,0,1.7,.6,1.7,m.gold,'Boat seating study');boats.push(boat);}
 for(const x of [-18,18]){cylinder(board,x,2.2,-8,1.2,3,m.blue).name='Gear-refill point study';box(board,x,4,-8,4,.3,3,m.gold,'Refill shelter');}
 const connection=curve([[-64,.6,19],[-53,.6,40],[-39,.6,57],[-27,.6,71]]);ribbon(group,connection,6,'Gentle optional tubing connection');
 label(group,'Quiet tubing can stay quiet • activities optional',-53,10,47);
 const inspections=[{key:'paint-hybrid',name:'Cliff...Splash...Falls',parent:cliff,description:'One hybrid attraction with ground and sky components. The replacement route stays connected in this timed visual switch study; physical transfers and dispatch are not implemented.'},{key:'paint-center',name:'Paint Splash Center',parent:center,description:'Interactive centerpiece proposal: tower, tipping buckets, spray arches and an additional relaxing sky experience. Effects are visual; player controls and travel are not connected.'},{key:'paint-current',name:'Rainbow Current',parent:quiet,description:'Peaceful forest tubing on its own loop. A gentle optional link leads toward the activities; quiet riders are not forced through splash challenges.'},{key:'paint-board',name:'BubbleSplash Station Board',parent:board,description:'One combined attraction with bubble boats, docks, refill points and optional activity space. Co-op games and player boarding remain to be designed.'}];
 const site={x:960,z:170,group,title:'California • Paint Park',description:'Relaxation-first construction proposal: quiet forest tubing, an optional hybrid coaster, a splash centerpiece and bubble-boat activity area. Exact placement and interactions remain for review.',rides:inspections.map(o=>o.name+' — construction study')};sites['california-paint']=site;label(group,'California • Paint Park',0,91,0);
 let last=0,groundProgress=.38;
 function pose(r){r.cars.forEach((car,i)=>{const u=(r.progress-i*.018+1)%1;car.position.copy(r.path.getPointAt(u));car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),r.path.getTangentAt(u));});}
 function update(time){
  const dt=Math.max(0,Math.min(.1,time-last));last=time;const rideTime=time*5,cycle=rideTime%48;
  const switching=(cycle>=7&&cycle<9)||(cycle>=40&&cycle<42),away=cycle>=9&&cycle<42;
  ramp.visible=away;detached.visible=true;
  sky.progress=cycle<9||cycle>=42?0:(cycle-9)/33;sky.phase=cycle<7?'Docked':cycle<9?'Ground train held for switch':cycle<32?'Sky departure; ramp connected':cycle<40?'Sky return; ramp connected':cycle<42?'Ground train held for return':'Docked';
  detached.position.copy(sky.path.getPointAt(sky.progress));
  if(!switching)groundProgress=(groundProgress+dt*5*.018)%1;ground.progress=groundProgress;ground.phase=switching?'Held for switch':'Connected ground circuit';
  calmSky.progress=(rideTime/65)%1;calmSky.phase='Relaxing tower circuit';[ground,sky,calmSky].forEach(pose);
  buckets.forEach((b,i)=>b.rotation.z=Math.max(0,Math.sin(time*.35+i))*1.1);
  floats.forEach((f,i)=>{f.position.copy(quietPath.getPointAt((time/100+i/6)%1));f.position.y+=.35;});
  boats.forEach((b,i)=>b.position.set(Math.cos(time*.08+i*Math.PI/2)*12,.2+Math.sin(time+i)*.12,Math.sin(time*.08+i*Math.PI/2)*8));
 }
 update(0);return{site,rides:[ground,sky,calmSky],sky,additionalSky:[calmSky],inspections,ground,detached,ramp,segmentStart,segmentEnd,update,floats,boats,quiet};
}



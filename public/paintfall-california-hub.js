import { rideMaterial } from './paintfall-california-colors.js';
// Owner-approved concepts; first visual layouts, not a dispatch or physics simulation.
export function buildCaliforniaHub(T,{scene,sites,label=()=>{},rail,train}){
 const group=new T.Group();group.name='california-hub';group.position.set(960,0,-170);scene.add(group);
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.8});
 const m={grass:mat(0x8da777),stone:mat(0xad886e),dark:mat(0x594e56),wood:mat(0x8c664c),leaf:mat(0x48775c),gold:mat(0xf2ca71),blue:mat(0x65cbd4),pink:mat(0xd888b1),purple:mat(0x9b83cb),path:mat(0xe1d3b1)};
 function mesh(p,g,c,x=0,y=0,z=0,name=''){const o=new T.Mesh(g,c);o.position.set(x,y,z);o.name=name;p.add(o);return o;}
 const box=(p,x,y,z,w,h,d,c,name)=>mesh(p,new T.BoxGeometry(w,h,d),c,x,y,z,name);
 const cyl=(p,x,y,z,r,h,c,name)=>mesh(p,new T.CylinderGeometry(r,r, h,18),c,x,y,z,name);
 const rod=(p,pts,r,c,name)=>mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(v=>new T.Vector3(...v))),48,r,8,false),c,0,0,0,name);
 box(group,0,-.5,0,290,1,280,m.grass,'World Hub foundation');
 box(group,0,.12,0,20,.25,254,m.path,'Central promenade');box(group,0,.13,0,266,.25,12,m.path,'Cross-park promenade');
 cyl(group,0,.5,0,19,1,m.path,'Hub meeting plaza');
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2;rod(group,[[Math.cos(a)*8,1,Math.sin(a)*8],[Math.cos(a)*5,12,Math.sin(a)*5],[0,16,0]],.2,i%2?m.blue:m.pink,'Paint fountain sculpture');}
 label(group,'California • World Hub',0,108,0);
 const rides=[];
 function ride(key,name,x,z,points,color,description){ color=rideMaterial(T,key,color);const parent=new T.Group();parent.position.set(x,0,z);group.add(parent);const r=train(parent,rail(parent,points,color,true,true),color,3);Object.assign(r,{key,name,parent,description,progress:0,phase:'Local circuit'});rides.push(r);label(parent,name,0,59,0);box(parent,0,1,29,13,2,6,m.path,'Boarding platform study');return r;}
 const wild=ride('hub-wild','The Wild & Mysterious Coaster',-77,61,[[0,3,29],[-28,3,12],[-29,4,-15],[-14,5,-27],[9,4,-21],[26,3,-5],[22,10,17],[5,4,20]],m.purple,'Sunken garden courtyards and covered mystery passages. Underground depth and surprise-door interaction remain for later design.');
 // Raised earth roofs represent the underground passages without excavating the shared viewer ground.
 for(const [x,z] of [[-24,1],[-14,-22],[17,-10]]){box(wild.parent,x,8,z,15,2,15,m.stone,'Earth-covered chamber roof');for(const dx of [-7,7])box(wild.parent,x+dx,4,z,1,8,15,m.stone,'Tunnel side wall');}
 for(const [x,z] of [[-9,9],[9,4]]){cyl(wild.parent,x,1,z,5,1,m.path,'Open sunken garden courtyard');cyl(wild.parent,x,3,z,.5,5,m.wood,'Courtyard tree');mesh(wild.parent,new T.SphereGeometry(3,12,8),m.leaf,x,6,z,'Courtyard canopy');}
 const burst=ride('hub-burst-ground','Paint Bursting LightSky',-74,-64,[[0,3,28],[-26,5,14],[-24,9,-12],[-6,7,-25],[12,6,-14],[27,5,3],[20,4,23]],m.gold,'One combined ground-and-sky concept. The ground circuit bends east at daylight while the sky route rises in a separate corridor. Separation mechanics are not simulated.');
 for(let i=0;i<6;i++){const x=-27+i*10,z=-15+(i%2)*9;const spire=mesh(burst.parent,new T.ConeGeometry(6,22+i%3*5,6),i%2?m.pink:m.stone,x,11+i%3*2.5,z,'Painted rock spire');spire.rotation.z=(i%2?1:-1)*.12;}
 box(burst.parent,-22,11,0,16,3,17,m.stone,'Boulder tunnel roof');for(const x of [-30,-14])box(burst.parent,x,5,0,2,10,17,m.stone,'Boulder tunnel wall');
 const burstSky=ride('hub-burst-sky','Paint Bursting LightSky',-74,-64,[[0,12,28],[-39,12,14],[-42,18,0],[-42,46,0],[-39,76,-9],[-11,89,-22],[22,73,-8],[30,41,21],[10,15,34]],m.blue,'Sky-component route study in its own elevated corridor. Train splitting, switches and destination travel remain open.');burstSky.menuName='Paint Bursting LightSky — sky component';
 label(burst.parent,'Ground bends east • sky rises west',0,15,37);
 const tree=ride('hub-tree','SkyTree Canopy',69,-66,[[0,4,29],[-26,10,12],[-23,27,-15],[3,44,-26],[25,62,-6],[12,80,19],[-17,87,15],[-30,67,-12],[0,18,34]],m.pink,'A climbing spiral around a fictional giant tree, lifting above its canopy before a preview return. Geographic travel is deferred.');
 const trunk=cyl(tree.parent,0,27,0,7,54,m.wood,'Fictional giant tree trunk');
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2;rod(tree.parent,[[0,33,0],[Math.cos(a)*12,45,Math.sin(a)*12],[Math.cos(a)*21,54,Math.sin(a)*21]],1.5,m.wood,'Giant tree branch');const crown=mesh(tree.parent,new T.IcosahedronGeometry(13,1),m.leaf,Math.cos(a)*13,58+i%2*5,Math.sin(a)*13,'Giant forest canopy');crown.scale.y=.7;}
 const dome=ride('hub-demonym','the Demonym SkyWorld',78,61,[[0,3,29],[-25,12,14],[-22,31,-5],[-4,49,-19],[12,59,-7],[24,69,12],[8,87,28],[-24,80,24],[-32,27,34]],m.purple,'Painted dome ascent, a summit pause and a sweep into the sky. This is a timed camera-and-train study, not a finished travel route.');
 const rock=mesh(dome.parent,new T.SphereGeometry(24,24,16,0,Math.PI*2,0,Math.PI/2),m.stone,0,0,0,'Painted dome landform');rock.scale.set(.8,2,.8);box(dome.parent,0,24,2,1,48,39,m.pink,'Dome paint stripe');
 const round=ride('hub-roundabout','PaintRail Roundabout',0,89,[[0,3,0],[0,3,-16],[-25,6,-25],[-33,10,-7],[-21,4,15],[0,3,17],[25,8,21],[34,6,-3],[18,4,-22],[0,3,-16]],m.gold,'Stationary park coaster: stops for a rotating turntable study, then follows one workshop-and-hillside loop. Surprise route selection and physical track switching are not implemented.');
 const turntable=new T.Group();round.parent.add(turntable);cyl(turntable,0,1,0,8,1.5,m.dark,'Turntable base');box(turntable,0,2,0,2,.3,15,m.blue,'Rotating turntable track study');
 for(let i=0;i<5;i++){const a=Math.PI+i*Math.PI/4,x=Math.sin(a)*22,z=Math.cos(a)*22;box(round.parent,x,5,z,9,10,10,m.stone,'Roundhouse workshop bay');box(round.parent,x,10.5,z,10,1,11,m.dark,'Roundhouse roof');}
 const inspections=[wild,burst,tree,dome,round];
 const site={x:960,z:-170,group,title:'California • World Hub',description:'First layout of five approved concepts: underground gardens, a painted-spire hybrid, giant-tree and dome sky rides, and a separate roundhouse coaster. Geographic placement, switching and travel remain for review.',rides:inspections.map(r=>r.name+' — construction study')};sites['california-hub']=site;
 const summit=.43;let last=0,roundProgress=0;
 function pose(r){r.cars.forEach((car,i)=>{const u=(r.progress-i*.018+1)%1;car.position.copy(r.path.getPointAt(u));car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),r.path.getTangentAt(u));});}
 function update(time){const dt=Math.max(0,Math.min(.1,time-last));last=time;const rideTime=time*5;wild.progress=rideTime/49%1;burst.progress=rideTime/55%1;burstSky.progress=rideTime/62%1;tree.progress=rideTime/71%1;const t=rideTime%70;dome.progress=t<28?t/28*summit:t<34?summit:summit+(t-34)/36*(1-summit);dome.phase=t<28?'Dome ascent':t<34?'Summit pause':'Sky sweep and preview return';const rt=rideTime%45,held=rt<6;round.phase=held?'Turntable stop study':'Local workshop circuit';if(!held)roundProgress=(roundProgress+dt*5/39)%1;round.progress=roundProgress;turntable.rotation.y=held?Math.sin(rt/6*Math.PI)*Math.PI/2:0;rides.forEach(pose);}
 update(0);return{site,rides,inspections,sky:burstSky,additionalSky:[tree,dome],update,turntable,round,dome};
}



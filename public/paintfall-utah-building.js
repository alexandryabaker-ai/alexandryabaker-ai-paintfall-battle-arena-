// Owner-approved concepts, original first layouts. Visual motion, not ride physics.
export function buildUtahBuilding(T,{scene,sites,label=()=>{},rail,train}){
 const group=new T.Group();group.name='utah-building';group.position.set(1640,0,0);scene.add(group);
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.7,...extra});
 const m={ground:mat(0xb7a68b),path:mat(0xe8d7b8),stone:mat(0xb18b68),copper:mat(0xb66a43,{metalness:.6,roughness:.35}),nickle:mat(0xbac9c8,{metalness:.65,roughness:.3}),dark:mat(0x3b4656),cream:mat(0xf0debe),blue:mat(0x1d9ac5),wine:mat(0xa92d65),green:mat(0x2c9569),orange:mat(0xf08b30),pink:mat(0xee89c5),mist:mat(0x99d4ef,{transparent:true,opacity:.22,depthWrite:false})};
 function mesh(p,g,c,x=0,y=0,z=0,name=''){const o=new T.Mesh(g,c);o.position.set(x,y,z);o.name=name;p.add(o);return o;}
 const box=(p,x,y,z,w,h,d,c,name)=>mesh(p,new T.BoxGeometry(w,h,d),c,x,y,z,name);
 const cyl=(p,x,y,z,r,h,c,name)=>mesh(p,new T.CylinderGeometry(r,r,h,24),c,x,y,z,name);
 box(group,0,-.4,0,290,.8,280,m.ground,'Utah Building Park foundation');
 box(group,0,.1,0,12,.2,260,m.path,'Central walking spine');box(group,0,.11,0,270,.2,10,m.path,'Cross-park walking path');
 label(group,'Utah • Building Park',0,108,0);
 const rides=[];
 function ride(key,name,x,z,points,color,description){const parent=new T.Group();parent.position.set(x,0,z);group.add(parent);const r=train(parent,rail(parent,points,color,true,true),color,3);Object.assign(r,{key,name,parent,progress:0,description,phase:'Park circuit'});rides.push(r);label(parent,name,0,key==='utah-climb'?96:58,0);box(parent,0,1,35,15,2,7,m.path,'Boarding platform study');return r;}
 const copper=ride('utah-copper','CopperNickle Canyon Coaster',-70,-64,[[0,3,35],[-34,8,18],[-29,24,-8],[-12,32,-31],[13,24,-29],[31,9,-10],[25,5,16],[6,12,21],[-9,4,20]],m.copper,'Winds through layered copper-colored architecture with silver-toned accents. Original fictional building shapes; no real nickel-content claim.');
 for(let i=0;i<4;i++){const x=-23+i*14,z=-17+(i%2)*13,h=14+i*4;for(let j=0;j<4;j++)box(copper.parent,x,h+j*1.7,z,13,1.4,20,j===1?m.nickle:m.copper,'Layered architectural band');for(const dx of [-5,5])box(copper.parent,x+dx,h/2,z,1,h,2,m.dark,'Open building passage column');}
 const dome=ride('utah-dome','Paint The Dome Around',70,-64,[[0,3,36],[-32,8,21],[-35,23,-7],[-18,35,-29],[14,32,-31],[34,19,-9],[33,9,18],[16,5,32],[-7,8,26]],m.blue,'Exterior coaster sweep around a giant dome. The first route remains outside the dome rather than becoming an interior rotunda spiral.');
 cyl(dome.parent,0,7,0,18,14,m.cream,'Dome drum');mesh(dome.parent,new T.SphereGeometry(20,32,20,0,Math.PI*2,0,Math.PI/2),m.nickle,0,14,0,'Giant dome');cyl(dome.parent,0,36,0,2,7,m.blue,'Dome lantern');
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;cyl(dome.parent,Math.cos(a)*19,6,Math.sin(a)*19,.6,12,m.cream,'Exterior colonnade');}
 const tower=ride('utah-tower','Tower-Twist Paintways',-70,66,[[0,3,35],[-31,9,21],[-30,27,-3],[-12,39,-25],[16,35,-26],[32,27,-3],[13,9,10],[-5,5,1],[-22,8,13],[-11,16,28],[19,5,30]],m.wine,'Banked turns between original stone towers, a covered passage and a sweeping drop into a colorful paint-mist courtyard. A visual study; clearances and forces are not certified.');
 for(const [x,z,h] of [[-17,-12,25],[9,-8,31],[23,16,20],[-28,27,17]]){cyl(tower.parent,x,h/2,z,5,h,m.stone,'Original stone tower');for(let j=0;j<3;j++)box(tower.parent,x,h-4-j*5,z+5,.9,2,.3,m.dark,'Tower window study');}
 box(tower.parent,-7,13,0,20,2,13,m.stone,'Surprise passage roof');for(const z of [-6,6])box(tower.parent,-7,6,z,20,12,1,m.stone,'Passage wall');
 const mist=[];for(let i=0;i<18;i++){const c=m.mist.clone();c.color.set([0xf09bca,0x81d8d3,0xc3a2eb][i%3]);const puff=mesh(tower.parent,new T.SphereGeometry(1.6,10,7),c,-6+(i%6)*2.5,2+(i%3),8+Math.floor(i/6)*3,'Colorful courtyard mist');mist.push(puff);}
 const skyPoints=[[0,3,35],[-23,5,16],[-21,12,2],[-9,19,2],[-18,28,2],[2,36,2],[15,44,2],[9,53,-2],[14,59,-16],[31,77,-25],[45,88,2],[35,63,28],[12,19,40]];
 const sky=ride('utah-climb','Skyline ClimbFall',70,66,skyPoints,m.green,'Rock-climbing-like ascent with sideways traverses past oversized holds on a colorful building facade, then a rooftop crest and sky departure. Players remain in cars; travel and physical climbing mechanics are not connected.');
 box(sky.parent,0,25,-7,44,50,10,m.dark,'Climbing building');
 for(let row=0;row<10;row++)for(let col=0;col<5;col++){const c=[m.green,m.orange,m.blue,m.pink][(row+col)%4];box(sky.parent,-18+col*9,2.5+row*5,-1.8,8.5,4.6,.35,c,'Colorful facade panel');const hold=mesh(sky.parent,new T.IcosahedronGeometry(1,0),m.cream,-19+col*9+(row%2)*2,3+row*5,-.9,'Oversized climbing hold');hold.scale.set(1.7,.8,.6);}
 box(sky.parent,0,51,-7,47,2,13,m.orange,'Roof crest');
 // A minimal arc-length lookup lets timing follow the actual traverse sections.
 const lengths=sky.path.getLengths(1000),total=lengths[lengths.length-1];
 function nearestU(target){let best=0,d=Infinity;for(let i=0;i<=1000;i++){const q=sky.path.getPoint(i/1000).distanceToSquared(target);if(q<d){d=q;best=i;}}return lengths[best]/total;}
 const climbStart=nearestU(new T.Vector3(-21,12,2)),roof=nearestU(new T.Vector3(9,53,-2));
 function update(time){copper.progress=time/26%1;dome.progress=time/30%1;tower.progress=time/24%1;const t=time%40;sky.progress=t<5?t/5*climbStart:t<23?climbStart+(t-5)/18*(roof-climbStart):t<26?roof:roof+(t-26)/14*(1-roof);sky.phase=t<5?'Station approach':t<23?'Climb and sideways traverses':t<26?'Roof crest pause':'Sky departure and preview return';for(const r of rides)r.cars.forEach((car,i)=>{const u=(r.progress-i*.018+1)%1;car.position.copy(r.path.getPointAt(u));car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),r.path.getTangentAt(u));if(r===tower)car.rotateZ(Math.sin(u*Math.PI*6)*.22);});mist.forEach((p,i)=>{p.position.y=2+i%3+Math.sin(time*.8+i)*.65;p.scale.setScalar(1+Math.sin(time*.6+i)*.16);});}
 const site={x:1640,z:0,group,title:'Utah • Building Park',description:'First construction layouts of four approved concepts: copper layers, an exterior dome sweep, adventurous tower passages and a climbing-facade sky coaster. Boarding, physics and travel remain open.',rides:rides.map(r=>r.name+' — construction study')};sites['utah-building']=site;update(0);return{site,rides,inspections:rides,sky,update,mist,climbStart,roof};
}

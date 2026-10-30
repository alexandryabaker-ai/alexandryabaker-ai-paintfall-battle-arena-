import { rideMaterial } from './paintfall-california-colors.js';
// Existing owner-approved concepts; original first layouts, not finished rides.
export function buildCaliforniaGarden(T,{scene,sites,label=()=>{},rail,train}){
 const group=new T.Group();group.name='california-garden';group.position.set(650,0,-150);scene.add(group);
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.85,...extra});
 const m={grass:mat(0x91aa75),wood:mat(0x80644d),leaf:mat(0x568c63),path:mat(0xe2d0a4),orange:mat(0xf4a13b),gold:mat(0xf1d17b),purple:mat(0xaf8ccf),pink:mat(0xe7a9c9),blue:mat(0x72d0dd),water:mat(0x83d8dd,{transparent:true,opacity:.6}),glass:mat(0xa7d9d6,{transparent:true,opacity:.22,side:T.DoubleSide}),dark:mat(0x374e52)};
 const mesh=(p,geo,material,x=0,y=0,z=0,name='')=>{const o=new T.Mesh(geo,material);o.position.set(x,y,z);o.name=name;o.castShadow=o.receiveShadow=true;p.add(o);return o;};
 const box=(p,x,y,z,w,h,d,material,name)=>mesh(p,new T.BoxGeometry(w,h,d),material,x,y,z,name);
 const rod=(p,points,r,material,name)=>mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),48,r,7,false),material,0,0,0,name);
 function ribbon(points,width,material,name){
  const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),vertices=[],edges=[];
  for(let i=0;i<=100;i++){const p=curve.getPointAt(i/100),side=new T.Vector3().crossVectors(curve.getTangentAt(i/100),new T.Vector3(0,1,0)).normalize().multiplyScalar(width/2);edges.push([p.clone().add(side),p.clone().sub(side)]);}
  for(let i=0;i<100;i++){const q=[...edges[i],...edges[i+1]];for(const j of [0,2,1,1,2,3])vertices.push(...q[j].toArray());}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();material.side=T.DoubleSide;return mesh(group,geometry,material,0,0,0,name);
 }
 box(group,0,-.3,0,250,.6,240,m.grass,'Garden foundation');
 const stream=Array.from({length:26},(_,i)=>[-78+Math.sin(i*.27)*12,.28,-109+i*8]);ribbon(stream,4,m.water,'Garden connecting stream');
 const approach=Array.from({length:15},(_,i)=>[-48+Math.sin(i*.3)*9,.8+i*.12,108-i*5]);ribbon(approach,4,m.path,'Rising streamside approach');
 ribbon([[-50,2,40],[-15,2,10],[20,2,9],[58,2,18],[75,1,0],[98,.4,-4]],3.6,m.path,'Shared garden paths and quiet-area connection');
 const gates=new T.Group();gates.position.set(-48,0,104);group.add(gates);
 for(const x of [-7,7]){box(gates,x,5,0,1,10,1,m.wood,'Garden entrance post');box(gates,x*.55,4.5,0,5.5,8,.35,m.leaf,'Flower-decorated entrance door');}
 box(gates,0,10,0,17,1.3,1,m.purple,'Garden welcome lintel');label(gates,'your garden adventure awaits',0,13,0);
 function flower(p,x,z,scale=1){const f=new T.Group();f.position.set(x,.2,z);f.scale.setScalar(scale);p.add(f);box(f,0,.6,0,.07,1.2,.07,m.leaf,'Flower stem');for(let j=0;j<4;j++){const a=j*Math.PI/2,petal=mesh(f,new T.SphereGeometry(1,10,7),m.orange,Math.cos(a)*.26,1.25,Math.sin(a)*.26,'California poppy-inspired petal');petal.scale.set(.35,.18,.45);petal.rotation.y=a;}mesh(f,new T.SphereGeometry(.13,8,6),m.gold,0,1.27,0,'Flower center');return f;}
 for(let i=0;i<18;i++)for(const side of [-1,1]){const z=109-i*2.7,x=-48+Math.sin(i*.18)*5+side*5;flower(group,x,z,1.3);}
 const rides=[],sprinklers=[],blooms=[];
 function ride(key,name,x,z,description,points,color){ color=rideMaterial(T,key,color);
  const parent=new T.Group();parent.position.set(x,0,z);group.add(parent);label(parent,name,0,43,0);
  const r=train(parent,rail(parent,points,color,true,true),color,3);Object.assign(r,{key,name,parent,description,progress:0,phase:'Garden circuit'});
  box(parent,0,1,25,13,2,7,m.path,'Boarding platform study');box(parent,0,5,27,14,.5,6,m.leaf,'Station canopy');
  for(const car of r.cars){box(car,.9,1.2,.6,.16,.3,1,m.blue,'Ride-attached SplashBlaster model');rod(car,[[1,1.3,1],[2,2.2,2],[4,1.8,3],[5,.4,4]],.06,m.water,'Continuous water stream study');}
  rides.push(r);return r;
 }
 const trees=ride('garden-trees','Tree Splashes Coaster',-40,-46,'Woven-trunk coaster with hidden-sprinkler motion studies. Splash gear is represented visually; player controls are not connected.',[[0,3,25],[-24,7,16],[-25,18,-7],[-13,28,-24],[4,26,-25],[24,7,-14],[25,5,9],[10,15,18],[-8,4,15]],m.purple);
 for(let i=0;i<5;i++){
  const x=(i%3-1)*12,z=i<3?-9:10;
  for(const side of [-1,1])rod(trees.parent,[[x+side*3,0,z],[x-side*4,10,z+2],[x+side*3,22,z],[x,32,z]],.85,m.wood,'Woven tree trunk');
  const crown=mesh(trees.parent,new T.IcosahedronGeometry(7,2),m.leaf,x,31,z,'Woven-tree canopy');crown.scale.y=.65;
  const spray=rod(trees.parent,[[x,18,z],[x+4,21,z+3],[x+8,18,z+5],[x+10,6,z+7]],.09,m.water,'Hidden tree sprinkler study');sprinklers.push(spray);
 }
 const greenhouse=ride('garden-greenhouse','the Greenhouse Effect',45,-46,'Glass conservatory, oversized blooms and leaf tunnels, with gentle visual water effects. Music, handheld gear and ride interactions remain later work.',[[0,3,25],[-26,6,15],[-23,18,-6],[-10,25,-24],[13,23,-20],[25,5,-6],[22,5,13],[7,12,16],[-9,4,15]],m.blue);
 const shell=mesh(greenhouse.parent,new T.SphereGeometry(1,32,18,0,Math.PI*2,0,Math.PI/2),m.glass,0,.3,0,'Conservatory glass shell');shell.scale.set(24,29,20);
 for(let i=0;i<7;i++){const a=i/7*Math.PI,arc=[];for(let j=0;j<=25;j++){const t=j/25*Math.PI;arc.push([Math.cos(t)*24*Math.cos(a),Math.sin(t)*29,Math.cos(t)*20*Math.sin(a)]);}rod(greenhouse.parent,arc,.12,m.wood,'Conservatory rib');}
 for(let i=0;i<9;i++)flower(greenhouse.parent,Math.sin(i*2.4)*15,Math.cos(i*2.4)*12,3+(i%3));
 const desert=ride('garden-desert','Desert Splash Garden',-40,43,'Desert-bloom coaster with original towering plants. Blooms animate as a watering-effect proposal, without plant damage.',[[0,3,25],[-24,5,17],[-25,16,-4],[-13,25,-22],[7,24,-24],[25,5,-10],[25,6,12],[9,15,18],[-8,4,15]],m.gold);
 box(desert.parent,0,.15,0,63,.3,63,mat(0xcfba8a),'Desert garden bed');
 for(let i=0;i<12;i++){
  const x=Math.sin(i*2.4)*20,z=Math.cos(i*2.4)*18,h=5+i%4*2;
  mesh(desert.parent,new T.CylinderGeometry(.7,1.1,h,9),m.leaf,x,h/2,z,'Fictional tall desert plant');
  const bloom=new T.Group();bloom.position.set(x,h,z);desert.parent.add(bloom);
  for(let j=0;j<6;j++){const a=j*Math.PI/3,o=mesh(bloom,new T.SphereGeometry(1,9,6),i%2?m.pink:m.orange,Math.cos(a)*1.2,.1,Math.sin(a)*1.2,'Water-responsive blossom study');o.scale.set(1.3,.35,.7);o.rotation.y=a;}
  blooms.push(bloom);
 }
 const sky=ride('garden-canopy','Musical WaterSky Canopy',45,43,'A giant-treehouse climb, musical-channel shapes and a canopy departure. This is a camera/motion study; sound and travel are not connected.',[[0,3,25],[-15,9,12],[-18,25,-4],[-6,43,-18],[10,50,-15],[26,66,0],[30,54,21],[16,25,30],[0,5,29]],m.pink);
 mesh(sky.parent,new T.CylinderGeometry(3,5,38,14),m.wood,0,19,-7,'Giant treehouse trunk');
 for(const y of [13,25,37]){box(sky.parent,0,y,-7,19,.7,16,m.path,'Treehouse platform');for(const x of [-8,8])box(sky.parent,x,y+1,-7,.25,2,16,m.wood,'Treehouse railing');}
 box(sky.parent,0,40,-7,14,7,11,m.wood,'Treehouse room');const roof=mesh(sky.parent,new T.ConeGeometry(12,8,4),m.leaf,0,47,-7,'Treehouse roof');roof.rotation.y=Math.PI/4;
 for(let i=0;i<6;i++){const a=i*Math.PI/3;const o=mesh(sky.parent,new T.IcosahedronGeometry(9,2),m.leaf,Math.cos(a)*13,33,Math.sin(a)*12-7,'Treehouse canopy');o.scale.y=.65;}
 for(let i=0;i<7;i++)rod(sky.parent,[[12,8+i*2,-12],[18,10+i*2,-9],[21,8+i*2,-2]],.22,i%2?m.water:m.blue,'Musical water-channel shape');
 const quiet=new T.Group();quiet.name='Mist Garden • quiet walking area';quiet.position.set(98,0,-4);group.add(quiet);label(quiet,'Mist Garden • quiet escape',0,13,0);
 box(quiet,0,.15,0,24,.3,33,m.path,'Quiet garden path');
 for(const x of [-8,8]){box(quiet,x,1,5,1.5,.4,6,m.wood,'Nature-watching bench');box(quiet,x*1.1,2,5,.3,2,6,m.wood,'Bench back');for(let i=0;i<4;i++)flower(quiet,x,-12+i*4,1.2);}
 const mist=new T.InstancedMesh(new T.SphereGeometry(.1,5,4),m.water,60),dummy=new T.Object3D();quiet.add(mist);
 for(let i=0;i<10;i++)mesh(group,new T.IcosahedronGeometry(3.8,1),m.leaf,86,.9,-35+i*7,'Quiet-zone planted screen');
 const site={x:650,z:-150,group,title:'California • Garden Park',description:'First construction proposal: a poppy-inspired entrance, garden stream, four approved ride concepts and a separate quiet Mist Garden. Tracks, interaction timing and placement remain for review.',rides:[...rides.map(r=>r.name+' — '+(r===sky?'sky-coaster motion study':'garden coaster study')),'Mist Garden — quiet path and seating','California poppy-inspired welcome doors']};sites['california-garden']=site;
 label(group,'California • Garden Park',0,83,0);
 function update(time){
  for(const [index,r]of rides.entries()){
   r.progress=(time/(r===sky?48:40+index*3))%1;r.phase=r===sky?(r.progress<.2?'Treehouse approach':r.progress<.5?'Treehouse climb':r.progress<.75?'Canopy departure':'Preview return'):'Garden circuit';
   r.cars.forEach((car,i)=>{const u=(r.progress-i*.018+1)%1;car.position.copy(r.path.getPointAt(u));car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),r.path.getTangentAt(u));});
  }
  sprinklers.forEach((s,i)=>s.visible=(time+i*2)%12<4);blooms.forEach((b,i)=>b.scale.setScalar(.55+.45*(.5+.5*Math.sin(time*.8-i))));
  for(let i=0;i<60;i++){const t=(time*.1+i/60)%1;dummy.position.set(Math.sin(i*2.4)*6,.5+t*2,-7+Math.cos(i*2.4)*6);dummy.scale.setScalar(.5+Math.sin(t*Math.PI));dummy.updateMatrix();mist.setMatrixAt(i,dummy.matrix);}mist.instanceMatrix.needsUpdate=true;
 }
 const inspections=[...rides,{key:'garden-mist',name:'Mist Garden',parent:quiet,description:'A separate quiet walking area with seating, low mist and a planted screen. It is not a coaster and has no soundtrack.'}];
 update(0);return{site,rides,inspections,sky,quiet,update,sprinklers,blooms};
}


// Place-specific garden proposals. Shared construction tools, distinct layouts/plants.
import {createArenaSurfaceMaterial} from './paintfall-arena-surface.js';
function kit(T,g,country){
 const obstacles=[],seats=[],sphere=new T.SphereGeometry(1,8,6),dummy=new T.Object3D();let flowerCount=0;
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.84,...extra});
 const m={leaf:mat(0x39754b),light:mat(0x699b52),wood:mat(0x725239),soil:mat(0x5a4638),cream:mat(0xe6d7b8),yellow:mat(0xf4c94c),white:mat(0xfff5e5),pink:mat(0xec7baa),red:mat(0xd63d57),violet:mat(0x9c69c4),jade:mat(0x48c9ae)};
 function mesh(name,geometry,material,pos,scale){const o=new T.Mesh(geometry,material);o.name=name;o.position.set(...pos);if(scale)o.scale.set(...scale);o.castShadow=o.receiveShadow=true;g.add(o);return o;}
 const box=(name,x,y,z,w,h,d,material=m.wood)=>mesh(name,new T.BoxGeometry(w,h,d),material,[x,y,z]);
 const ell=(name,x,y,z,sx,sy,sz,material=m.leaf)=>mesh(name,sphere,material,[x,y,z],[sx,sy,sz]);
 const block=(x,z,halfX,halfZ)=>obstacles.push({x,z,halfX,halfZ});
 function rod(name,points,r,material=m.wood){return mesh(name,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),10,r,5,false),material,[0,0,0]);}
 function surface(name,color,kind='stone'){return createArenaSurfaceMaterial(T,color,kind,4);}
 function floor(color=0x8caa70){box(country+' garden lawn',0,.012,0,20,.025,17,surface('grass',color,'grass'));}
 function path(x,z,w,d,color=0xd8c7a5,name='Level garden path'){box(country+' '+name,x,.05,z,w,.04,d,surface(name,color));}
 function ring(x,z,inner,outer,material=m.cream,name='Garden loop'){const o=mesh(name,new T.RingGeometry(inner,outer,64),material,[x,.055,z]);o.rotation.x=-Math.PI/2;return o;}
 function bench(x,z,material=m.wood,facing=Math.PI){
  const b=new T.Group();b.name=country+' garden bench';b.position.set(x,0,z);b.rotation.y=facing-Math.PI;g.add(b);
  const piece=(name,px,y,pz,w,h,d)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),material);o.name=country+' bench '+name;o.position.set(px,y,pz);o.castShadow=o.receiveShadow=true;b.add(o);};
  piece('seat',0,.53,0,2.5,.16,.72);piece('back',0,.95,.3,2.5,.7,.12);for(const side of [-1,1])piece('support',side*.91,.27,0,.15,.5,.6);
  block(x,z,1.3,.52);seats.push({x,y:.63,z:z-.07,facing});
 }
 function leaves(name,cx,cy,cz,spread=1.2,count=100){
  const o=new T.InstancedMesh(sphere,m.leaf,count);o.name=name;
  for(let i=0;i<count;i++){const a=i*2.399,r=Math.sqrt((i%29)/29)*spread;dummy.position.set(cx+Math.sin(a)*r,cy+(i%7)*.1,cz+Math.cos(a)*r);dummy.rotation.set(.2,a,.13);dummy.scale.set(.2,.035,.09);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix);}g.add(o);return o;
 }
 function tree(x,z,h=3.3,name='Branching shade tree'){
  rod(name+' trunk',[[x,0,z],[x+.1,h*.5,z],[x,h,z]],.12);block(x,z,.22,.22);
  for(let k=0;k<4;k++){const a=k*Math.PI/2;rod(name+' branch',[[x,h*.5,z],[x+Math.sin(a)*.7,h*.8,z+Math.cos(a)*.7],[x+Math.sin(a)*1.1,h,z+Math.cos(a)*1.1]],.04);}
  leaves(name+' individual leaves',x,h-.3,z,1.5);return h;
 }
 function flower(kind,x,y,z,color=m.pink,size=1){
  const head=new T.Group();head.name=kind+' blossom';head.position.set(x,y,z);head.scale.setScalar(size);g.add(head);flowerCount++;
  const petal=(px,py,pz,sx,sy,sz,angle,material=color)=>{const p=new T.Mesh(sphere,material);p.name=kind+' petal';p.position.set(px,py,pz);p.scale.set(sx,sy,sz);p.rotation.y=angle;head.add(p);};
  if(kind==='Hibiscus'){
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5;petal(Math.sin(a)*.13,.03,Math.cos(a)*.13,.14,.035,.2,a);}
   const tube=new T.Mesh(new T.CylinderGeometry(.014,.018,.22,6),m.red);tube.name='Hibiscus projecting staminal column';tube.position.y=.15;head.add(tube);
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5;petal(Math.sin(a)*.036,.27,Math.cos(a)*.036,.022,.022,.022,a,m.yellow);}
  }else if(kind==='Orchid'){
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5;petal(Math.sin(a)*.12,Math.cos(a)*.12,0,j<2?.14:.095,.075,.025,a);}
   petal(0,-.07,.06,.075,.085,.04,0,m.yellow);
  }else if(kind==='Rose'){
   for(let row=0;row<3;row++)for(let j=0;j<7;j++){const a=j*Math.PI*2/7+row*.4,r=.12-row*.035;petal(Math.sin(a)*r,row*.045,Math.cos(a)*r,.07,.065,.11,a);}
  }else if(kind==='Lotus'){
   for(let row=0;row<3;row++)for(let j=0;j<8;j++){const a=j*Math.PI/4+row*.3,r=.16-row*.045;petal(Math.sin(a)*r,row*.075,Math.cos(a)*r,.07,.12,.15,a);}
   petal(0,.19,0,.07,.035,.07,0,m.yellow);
  }else for(let j=0;j<5;j++){const a=j*Math.PI*2/5;petal(Math.sin(a)*.085,0,Math.cos(a)*.085,.055,.023,.1,a);}
  return head;
 }
 function flowerBed(x,z,w,d,kind,color=m.pink){
  box(country+' '+kind+' bed rim',x,.12,z,w,.23,d,m.cream);box('Dark planted soil',x,.245,z,w-.22,.03,d-.22,m.soil);block(x,z,w/2,d/2);
  for(let i=0;i<6;i++){const a=i*2.4,px=x+Math.sin(a)*w*.28,pz=z+Math.cos(a)*d*.28;ell(kind+' shrub leaves',px,.45,pz,.3,.17,.32);flower(kind,px,.65+(i%2)*.11,pz,color);}
 }
 function orchidStand(x,z,color=m.violet,name='Orchid'){
  box('Orchid raised planter',x,.35,z,.75,.7,.7,m.wood);block(x,z,.43,.43);
  rod('Orchid arching stem',[[x,.65,z],[x+.08,1.1,z],[x+.4,1.5,z]],.016,m.leaf);
  for(let k=0;k<4;k++)flower('Orchid',x+.1+k*.09,.95+k*.16,z-.03,color,.9);
  ell(name+' broad basal leaf',x-.13,.74,z,.34,.035,.12);
 }
 function entry(name,material=m.wood){for(const x of [-2.1,2.1]){box(name+' post',x,1.35,-7.8,.18,2.7,.18,material);block(x,-7.8,.13,.13);}box(name+' crossbeam',0,2.7,-7.8,4.6,.18,.4,material);}
 function finish(themeKey,theme,layout,paintCorner){g.userData.localIdentity=theme;g.userData.storySeats=seats;return{obstacles,seats,flowerCount,themeKey,theme,layout,paintCorner};}
 return{T,g,m,box,ell,block,rod,surface,floor,path,ring,bench,leaves,tree,flower,flowerBed,orchidStand,entry,finish};
}

export function buildThailandGarden(T,g){
 const k=kit(T,g,'Thailand');k.floor(0x88a96b);k.path(0,-.6,3.1,15,0xcdb78b,'central lotus causeway');k.path(0,5.4,15.5,2,0xcdb78b,'rear crosswalk');k.entry('Open timber garden entrance');
 for(const x of [-4.8,4.8]){
  k.box('Thai lotus reflecting pool',x,.1,-1.6,4.4,.14,4.7,k.m.leaf);k.block(x,-1.6,2.3,2.45);
  k.box('Thai lotus water surface',x,.19,-1.6,4,.04,4.3,new T.MeshStandardMaterial({color:0x54a7a1,roughness:.25,transparent:true,opacity:.8}));
  for(let i=0;i<7;i++){const a=i*2.4,r=.4+(i%3)*.45,px=x+Math.sin(a)*r,pz=-1.6+Math.cos(a)*r,pad=new T.Mesh(new T.CircleGeometry(.28,16),k.m.leaf);pad.name='Thailand round lotus pad';pad.rotation.x=-Math.PI/2;pad.position.set(px,.22,pz);g.add(pad);if(i%2===0)k.flower('Lotus',px,.4,pz,i%4?k.m.pink:k.m.white);}
 }
 for(const x of [-8,8]){
  k.tree(x,4.3,3.5,'Golden shower');
  for(let i=0;i<13;i++){const a=i*2.4,px=x+Math.sin(a)*1.1,pz=4.3+Math.cos(a)*1.1;for(let j=0;j<5;j++)k.flower('Golden shower',px,3.5-j*.16,pz,k.m.yellow,.58);}
 }
 for(const x of [-3.8,3.8])k.orchidStand(x,-5.7,k.m.violet);
 for(const x of [-3.4,3.4]){k.box('Timber shade pavilion column',x,1.25,7,.16,2.5,.16);k.block(x,7,.12,.12);}
 const roof=k.box('Thai garden pitched timber shade roof',0,2.8,7,7.5,.16,2.6,k.m.wood);roof.rotation.z=.05;
 k.bench(-1.55,7);k.bench(1.55,7);
 return k.finish('thailand-lotus-ratchaphruek','Lotus pools and golden-shower courtyard','twin-lotus-causeway',{x:5.4,z:2.8});
}

export function buildMyanmarGarden(T,g){
 const k=kit(T,g,'Myanmar');k.floor(0x91ad78);k.path(0,-5.7,3,5.5,0xe0cab0,'flower-walk entry');k.ring(0,.4,4.5,6.2,k.surface('path',0xdac7ab),'Pyin Oo Lwin inspired garden loop');k.path(0,6.4,11,2,0xdac7ab);k.entry('Open rose-garden arbor');
 for(const [x,z]of [[-5,-2.7],[5,-2.7],[-5,3.5]])k.flowerBed(x,z,2.8,2.5,'Rose',x>0?k.m.red:k.m.pink);
 for(const [x,z]of [[-8.5,5.5],[8,6.5],[-8,-5.5]]){
  k.rod('Upland conifer trunk',[[x,0,z],[x,3.6,z]],.12);k.block(x,z,.22,.22);
  for(let row=0;row<5;row++){const y=1.2+row*.52,r=1.2-row*.18;for(let j=0;j<7;j++){const a=j*Math.PI*2/7;k.rod('Layered upland conifer branch',[[x,y,z],[x+Math.sin(a)*r,y-.1,z+Math.cos(a)*r]],.035,k.m.wood);k.ell('Upland conifer needle spray',x+Math.sin(a)*r*.7,y-.08,z+Math.cos(a)*r*.7,.45,.12,.22,k.m.leaf);}}
 }
 for(const x of [-2.3,2.3])k.orchidStand(x,2.5,k.m.violet);
 k.bench(-1.6,7.2);k.bench(1.6,7.2);
 return k.finish('myanmar-upland-rose-orchid','Upland rose walk and orchid collection','ring-rose-walk',{x:4.4,z:.9});
}

export function buildMalaysiaGarden(T,g){
 const k=kit(T,g,'Malaysia');k.floor(0x7c9e66);k.path(0,-.6,3.2,15.8,0xe0cda8,'hibiscus promenade');k.path(0,5.8,16,2,0xe0cda8);k.entry('Malaysian garden timber lattice');
 for(const [x,z]of [[-5,-4.6],[5,-4.6],[-5,1.2]])k.flowerBed(x,z,3.5,2.6,'Hibiscus',k.m.red);
 for(const [x,z]of [[7.5,5],[-7.8,5]])k.tree(x,z,4,'Malaysian collection shade tree');
 for(const [x,z]of [[-7.6,-.5],[7.6,-.5]]){
  k.block(x,z,.7,.7);
  for(let j=0;j<7;j++){const a=j*2.4,l=k.ell('Torch-ginger long leaf',x+Math.sin(a)*.4,.5+(j%3)*.18,z+Math.cos(a)*.4,.1,.04,.65,k.m.light);l.rotation.y=a;}
  k.rod('Torch-ginger flower stalk',[[x,.1,z],[x,1.55,z]],.024,k.m.leaf);
  for(let row=0;row<5;row++)for(let j=0;j<7;j++){const a=j*Math.PI*2/7,r=.24-row*.035,p=k.ell('Torch-ginger pink waxy bract',x+Math.sin(a)*r,1.35+row*.08,z+Math.cos(a)*r,.085,.05,.13,k.m.pink);p.rotation.y=a;}
 }
 for(const x of [-3.1,3.1]){k.box('Timber lattice shade post',x,1.35,7.1,.16,2.7,.16);k.block(x,7.1,.12,.12);}
 for(let i=0;i<13;i++)k.box('Malaysian open shade roof slat',-3.2+i*.53,2.75,7.1,.13,.12,2.7);
 k.bench(-1.55,7.1);k.bench(1.55,7.1);
 return k.finish('malaysia-hibiscus-torchginger','Hibiscus and torch-ginger promenade','linear-flower-collections',{x:4.5,z:1.6});
}

export function buildIndonesiaGarden(T,g){
 const k=kit(T,g,'Indonesia');k.floor(0x7f9e68);const dark=k.surface('volcanic stone',0x7b8276),brick=k.surface('brick',0xb4805e);
 k.path(0,-5,3.2,7,0xb4805e,'brick entry');k.ring(-2,1.5,3.6,5.4,dark,'Bogor-inspired curving collection path');k.path(1.5,6.8,12,1.8,0xb4805e);k.entry('Open Indonesian timber shade entrance');
 k.tree(-3,1.2,4.2,'Indonesian botanical shade tree');
 for(const [x,z]of [[-7,-4.8],[-7,6.6],[1.5,-3.8]]){
  k.block(x,z,.65,.65);for(let j=0;j<11;j++){const a=j*Math.PI*2/11;k.rod('Botanical fern arching frond',[[x,.1,z],[x+Math.sin(a)*.45,.7,z+Math.cos(a)*.45],[x+Math.sin(a)*.85,.55,z+Math.cos(a)*.85]],.025,k.m.light);}
 }
 for(const x of [3.2,8.1])for(const z of [-5.2,1.8]){k.box('Indonesian orchid-house timber column',x,1.5,z,.15,3,.15);k.block(x,z,.12,.12);}
 for(let i=0;i<15;i++)k.box('Indonesian orchid-house open slatted roof',3.1+i*.36,3,-1.7,.13,.12,7.5);
 for(const [x,z]of [[4,-4.2],[6.6,-4.2],[4,-1.8],[7,.7]])k.orchidStand(x,z,k.m.white,'Moon-orchid study');
 k.box('Low volcanic-stone collection wall',-7.8,.35,1.2,.35,.7,5,dark);k.block(-7.8,1.2,.22,2.55);
 k.bench(-1,7.1,brick);k.bench(2.1,7.1,brick);
 return k.finish('indonesia-bogor-orchid-fern','Orchid shade-house and fern collection','offset-botanical-loop',{x:5.6,z:4.5});
}

export function buildPhilippinesGarden(T,g){
 const k=kit(T,g,'Philippines');k.floor(0x85a674);k.path(0,-.6,3.2,15.5,0xded0a9,'jade-vine walk');k.path(0,6.8,16,1.8,0xded0a9);k.entry('Philippine flowering-vine entrance');
 for(const [x,z]of [[-4.8,-4.4],[-5,1.4],[5.2,-4.4]])k.flowerBed(x,z,2.8,2.5,'Sampaguita',k.m.white);
 for(const x of [-2.25,2.25])for(const z of [-2.5,1.5,5.4]){k.box('Jade-vine pergola support',x,1.65,z,.18,3.3,.18);k.block(x,z,.14,.14);}
 for(let i=0;i<12;i++)k.box('Jade-vine overhead crossbar',0,3.3,-2.8+i*.75,5,.16,.17);
 for(let j=0;j<15;j++){
  const x=j%2?-1.45:1.45,z=-2+(j%8)*.85,y=3.15;
  k.rod('Jade-vine hanging raceme stem',[[x,y,z],[x+.03,y-.9,z]],.012,k.m.leaf);
  for(let row=0;row<6;row++)for(const side of [-1,1]){const a=side*.075,py=y-row*.14;
   k.rod('Turquoise jade-vine curved claw flower',[[x,py,z],[x+a,py-.025,z+.04],[x+side*.13,py-.12,z+.1],[x+side*.08,py-.19,z+.14]],.037,k.m.jade);
  }
 }
 k.leaves('Jade-vine trellis leaves',0,3.2,1.5,2.2,160);
 k.tree(-8,5.3,3.4,'Philippine flowering shade tree');
 k.bench(-4.7,7.1);k.bench(-1.55,7.1);
 return k.finish('philippines-jade-sampaguita','Jade-vine gallery and sampaguita beds','hanging-vine-gallery',{x:5.2,z:2.9});
}

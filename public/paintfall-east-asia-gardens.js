// Original garden layouts informed by the linked botanical references.
// All paths stay at arena ground height; ponds and planted beds are solid scenery.
import {createGardenKit} from './paintfall-southeast-asia-gardens.js';

function plants(k){
 const {T,g,m}=k,petalGeometry=new T.SphereGeometry(1,10,7);
 function part(parent,name,x,y,z,sx,sy,sz,material,rotation=0){
  const o=new T.Mesh(petalGeometry,material);o.name=name;o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.y=rotation;parent.add(o);return o;
 }
 function head(kind,x,y,z,size=1){const o=new T.Group();o.name=kind+' botanical flower';o.position.set(x,y,z);o.scale.setScalar(size);g.add(o);return o;}
 let count=0;
 function bloom(kind,x,y,z,size=1){
  const h=head(kind,x,y,z,size);count++;
  if(kind==='Iris lactea'||kind==='Japanese iris'){
   // Irises have three spreading falls and three upright standards, not five daisylike petals.
   const color=kind==='Iris lactea'?m.white:m.violet;
   for(let j=0;j<3;j++){
    const a=j*Math.PI*2/3,p=part(h,kind+' drooping fall',Math.sin(a)*.19,-.05,Math.cos(a)*.19,.105,.035,.23,color,a);p.rotation.x=.25;
    part(h,kind+' yellow signal',Math.sin(a)*.1,-.005,Math.cos(a)*.1,.025,.012,.1,m.yellow,a);
    part(h,kind+' upright standard',Math.sin(a+.8)*.07,.18,Math.cos(a+.8)*.07,.055,.19,.065,color,a);
   }
  }else if(kind==='Siebold magnolia'){
   for(let row=0;row<2;row++)for(let j=0;j<5;j++){const a=j*Math.PI*2/5+row*.5,r=.13-row*.04,p=part(h,'Magnolia white cupped tepal',Math.sin(a)*r,.035+row*.055,Math.cos(a)*r,.11,.065,.19,m.white,a);p.rotation.x=-.3;}
   for(let j=0;j<14;j++){const a=j*Math.PI*2/14;part(h,'Magnolia burgundy stamen',Math.sin(a)*.065,.115,Math.cos(a)*.065,.017,.045,.017,m.red);}
   part(h,'Magnolia central green cone',0,.14,0,.035,.075,.035,m.light);
   h.rotation.x=.4; // Slight nod, while keeping the open cup readable.
  }else if(kind==='Simpor'){
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5;part(h,'Simpor broad yellow petal',Math.sin(a)*.12,0,Math.cos(a)*.12,.14,.035,.18,m.yellow,a);}
   for(let j=0;j<16;j++){const a=j*2.4;part(h,'Simpor golden stamens',Math.sin(a)*.05,.065,Math.cos(a)*.05,.012,.045,.012,m.cream);}
  }else if(kind==='Mugunghwa'){
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5;part(h,'Mugunghwa pale pink petal',Math.sin(a)*.12,0,Math.cos(a)*.12,.12,.035,.18,m.pink,a);part(h,'Mugunghwa red basal eye',Math.sin(a)*.045,.025,Math.cos(a)*.045,.045,.015,.07,m.red,a);}
   part(h,'Mugunghwa short staminal column',0,.11,0,.025,.1,.025,m.cream);
  }else if(kind==='Bauhinia'){
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5;part(h,'Bauhinia magenta petal',Math.sin(a)*.12,0,Math.cos(a)*.12,j===0?.09:.13,.035,.2,m.violet,a);}
   for(let j=0;j<5;j++)part(h,'Bauhinia arching stamens',(j-2)*.025,.12,.08,.009,.13,.009,m.white);
  }else if(kind==='Sandalwood'){
   for(let j=0;j<4;j++){const a=j*Math.PI/2;part(h,'Sandalwood four small reddish tepals',Math.sin(a)*.055,0,Math.cos(a)*.055,.04,.018,.065,m.red,a);}
   part(h,'Sandalwood yellow flower center',0,.02,0,.028,.02,.028,m.yellow);
  }
  return h;
 }
 function blades(name,x,z,h=.9,n=9){
  for(let i=0;i<n;i++){const a=i*2.4,p=k.ell(name+' sword leaf',x+Math.sin(a)*.1,h*.46,z+Math.cos(a)*.1,.028,h*.5,.075,m.light);p.rotation.z=Math.sin(a)*.2;}
 }
 function irisBed(x,z,w,d,kind){
  k.box(kind+' gravel-edged bed',x,.11,z,w,.18,d,k.surface('gravel',0x9c9d85));k.block(x,z,w/2,d/2);
  for(let i=0;i<7;i++){const a=i*2.4,px=x+Math.sin(a)*w*.28,pz=z+Math.cos(a)*d*.26;blades(kind,px,pz,.7);k.rod(kind+' stem',[[px,.1,pz],[px,.85,pz]],.012,m.leaf);bloom(kind,px,.9,pz,.85);}
 }
 function shrub(x,z,kind){
  k.rod(kind+' branching shrub',[[x,.05,z],[x,1,z],[x+.3,1.45,z]],.04);k.block(x,z,.55,.55);
  for(let i=0;i<10;i++){const a=i*2.4,px=x+Math.sin(a)*.55,pz=z+Math.cos(a)*.5,y=.7+(i%3)*.27;
   const leaf=k.ell(kind+' leaf',px,y,pz,kind==='Simpor'?.3:.19,.035,kind==='Simpor'?.42:.28,m.leaf);leaf.rotation.y=a;
   if(i%2===0)bloom(kind,px,y+.13,pz,kind==='Simpor'?1:.85);
  }
 }
 function bamboo(x,z,h=3){
  k.block(x,z,.5,.5);
  for(let j=0;j<5;j++){const a=j*2.4,px=x+Math.sin(a)*.3,pz=z+Math.cos(a)*.3;k.rod('Jointed bamboo garden culm',[[px,0,pz],[px+.1,h,pz]],.045,m.light);
   for(let row=1;row<6;row++){const y=row*h/6;k.ell('Bamboo node',px+.1*y/h,y,pz,.06,.025,.06,m.cream);}
  }k.leaves('Bamboo narrow leaf sprays',x,h-.7,z,.85,60);
 }
 function pond(x,z,w,d,name='Reflecting pond'){
  k.box(name+' stone edge',x,.12,z,w,.23,d,k.surface('pond edging',0x999e8e));
  k.box(name+' water',x,.245,z,w-.22,.025,d-.22,new T.MeshStandardMaterial({color:0x438f91,roughness:.26,metalness:.12}));k.block(x,z,w/2,d/2);
 }
 function lotus(x,z,white=false){
  const leaf=new T.Mesh(new T.CircleGeometry(.3,18),m.leaf);leaf.name='Lotus round floating leaf';leaf.rotation.x=-Math.PI/2;leaf.position.set(x,.27,z);g.add(leaf);
  k.flower('Lotus',x+.12,.42,z,white?m.white:m.pink,.9);
 }
 function rock(x,z,s=1){
  const o=new T.Mesh(new T.DodecahedronGeometry(1,0),k.surface('weathered limestone',0xa1a397));o.name='Weathered garden stone';o.position.set(x,s*.6,z);o.scale.set(s*.65,s,s*.5);o.rotation.set(.15,x,.1);g.add(o);k.block(x,z,s*.65,s*.5);return o;
 }
 function pavilion(x,z,w=4){
  for(const side of [-1,1]){k.box('Garden shade pavilion column',x+side*(w/2-.2),1.25,z,.15,2.5,.15);k.block(x+side*(w/2-.2),z,.13,.13);}
  for(const side of [-1,1]){const roof=k.box('Pavilion sloping tiled roof',x,2.65,z+side*.53,w+.5,.16,1.3,k.surface('roof tiles',0x626d70));roof.rotation.x=side*.22;}
 }
 return{bloom,blades,irisBed,shrub,bamboo,pond,lotus,rock,pavilion,count:()=>count};
}

function complete(k,p,key,title,layout,corner){const r=k.finish(key,title,layout,corner);r.flowerCount+=p.count();return r;}

export function buildSingaporeGarden(T,g){
 const k=createGardenKit(T,g,'Singapore'),p=plants(k);k.floor(0x83a56d);k.path(0,-.4,3.2,15.8,0xcfc7ac,'orchid collection spine');k.entry('Orchid garden open frame');
 // Three offset display islands make a collection garden rather than another long pergola.
 for(const [x,z]of [[-5,-4.5],[4.6,-.5],[-5,3.8]]){
  k.ring(x,z,.6,1.75,k.surface('orchid-island paving',0xccb494),'Orchid display island');
  for(let j=0;j<3;j++){const a=j*Math.PI*2/3;k.orchidStand(x+Math.sin(a)*1.1,z+Math.cos(a)*1.1,j%2?k.m.white:k.m.violet);}
 }
 for(const x of [-8.4,8.4]){k.tree(x,5.6,3.8,'Singapore botanical shade tree');}
 for(const x of [-6.2,6.2]){k.box('Ginger collection soil rim',x,.16,-6.4,2.6,.3,1.5,k.m.cream);k.block(x,-6.4,1.3,.75);for(let j=0;j<4;j++){const px=x-.8+j*.5;k.rod('Ginger leafy stem',[[px,.2,-6.4],[px,1.15,-6.4]],.02,k.m.leaf);for(let row=0;row<4;row++){const l=k.ell('Ginger lance-shaped leaf',px+(row%2?.2:-.2),.5+row*.15,-6.4,.3,.025,.1);l.rotation.y=row;}for(let row=0;row<5;row++)for(let j=0;j<4;j++){const a=j*Math.PI/2,r=.13-row*.016,bract=k.ell('Red ginger overlapping bract',px+Math.sin(a)*r,1.1+row*.065,-6.4+Math.cos(a)*r,.065,.04,.11,k.m.red);bract.rotation.y=a;}k.ell('Red ginger small white tubular flower',px+.1,1.35,-6.4,.018,.06,.018,k.m.white);}}
 p.pavilion(0,7.1,6.4);k.path(0,6.1,13,1.6);k.bench(-1.55,7.1);k.bench(1.55,7.1);
 return complete(k,p,'singapore-orchid-islands','Orchid collection islands and ginger court','staggered-orchid-islands',{x:5.5,z:3.8});
}

export function buildBruneiGarden(T,g){
 const k=createGardenKit(T,g,'Brunei'),p=plants(k);k.floor(0x719967);k.path(0,-.6,3.2,15.4,0xb39b75,'level wetland boardwalk');k.entry('Wetland garden timber frame');
 p.pond(-5,.4,5.8,8.8,'Blackwater garden pool');const water=g.getObjectByName('Blackwater garden pool water');water.material.color.setHex(0x354a3d);
 for(let i=0;i<34;i++)k.box('Timber boardwalk transverse plank',0,.076,-7+i*.41,3,.04,.32);
 for(const [x,z]of [[-8,-5.5],[-8,6.5],[4,-4.5],[7.7,-3.7],[4.2,.2]])p.shrub(x,z,'Simpor');
 k.tree(7.7,6.3,4,'Brunei rainforest collection tree');k.path(1,6.4,14,1.5,0xb39b75);p.pavilion(-.2,7.1,6.3);k.bench(-1.8,7.1);k.bench(1.4,7.1);
 return complete(k,p,'brunei-simpor-wetland','Simpor wetland boardwalk garden','blackwater-boardwalk-and-shrub-bank',{x:5.8,z:3.5});
}

export function buildTimorGarden(T,g){
 const k=createGardenKit(T,g,'Timor-Leste'),p=plants(k);k.floor(0xb4ad79);k.path(0,-.6,3.3,15.6,0xd4c299,'dry garden promenade');k.entry('Sandalwood garden timber entrance');
 for(const [x,z]of [[-5,-3.8],[-6.7,3.6],[4.8,-4.3]]){
  k.box('Low dry-stone sandalwood bed',x,.16,z,3.1,.3,2.4,k.surface('dry stone',0xad9f83));k.block(x,z,1.55,1.2);
  k.tree(x,z,2.6,'Sandalwood branching tree');for(let j=0;j<12;j++){const a=j*2.4;p.bloom('Sandalwood',x+Math.sin(a)*.85,2.35+(j%3)*.15,z+Math.cos(a)*.8,.65);}
 }
 for(const [x,z]of [[-8,-6.3],[7.7,5.9]]){p.rock(x,z,.85);p.blades('Dry garden grass',x+.7,z,.65);}
 k.path(0,6.3,13,1.7,0xd4c299);for(let i=0;i<8;i++)k.box('Dry-stone low garden border',-6+i*.7,.2,7.9,.6,.35,.35,k.m.cream);
 k.bench(-1.55,7);k.bench(1.55,7);
 return complete(k,p,'timor-sandalwood-dry-court','Sandalwood dry-stone courtyard','offset-dry-stone-groves',{x:5.4,z:2.4});
}

export function buildJapanGarden(T,g){
 const k=createGardenKit(T,g,'Japan'),p=plants(k);k.floor(0x8da77b);k.path(0,-.5,3.2,15.6,0xc7c6b3,'iris garden approach');k.entry('Simple open garden arbor');
 p.pond(-5.3,1.5,5,5,'Wisteria reflecting pool');p.irisBed(4.9,-4.4,4.2,2.5,'Japanese iris');p.irisBed(-5.3,-4.8,4.2,1.8,'Japanese iris');
 for(const x of [-8,-2.6])for(const z of [-.9,4]){k.box('Wisteria trellis timber post',x,1.5,z,.15,3,.15);k.block(x,z,.12,.12);}
 for(let i=0;i<9;i++)k.box('Wisteria trellis crossbar',-5.3,3,-1+i*.63,6,.14,.14);
 for(let i=0;i<15;i++){const x=-7.4+(i%5)*1.04,z=-.6+Math.floor(i/5)*1.7;k.rod('Wisteria pendant raceme',[[x,3,z],[x,2.25,z]],.012,k.m.leaf);for(let row=0;row<5;row++)k.flower('Wisteria',x,2.95-row*.14,z,k.m.violet,.5-row*.04);}
 k.path(0,6.1,14,1.8);k.bench(-1.6,7.1);k.bench(1.6,7.1);p.rock(8,6.2,.9);
 return complete(k,p,'japan-iris-wisteria','Iris beds and wisteria reflection garden','western-wisteria-court',{x:5.2,z:2.5});
}

export function buildChinaGarden(T,g){
 const k=createGardenKit(T,g,'China'),p=plants(k);k.floor(0x8caa79);k.path(0,-.4,3.2,15.7,0xcec9b4,'moon-window approach');
 // A true circular opening: ring frame with side walls, no hidden collider across its hole.
 const frame=new T.Mesh(new T.TorusGeometry(1.3,.16,8,40),k.m.cream);frame.name='Open circular moon gate';frame.position.set(0,1.35,-6.8);g.add(frame);
 for(const side of [-1,1]){k.box('Moon gate white side wall',side*3,1.1,-6.8,3,2.2,.25,k.m.cream);k.block(side*3,-6.8,1.5,.18);}
 p.pond(-4.8,.1,5.8,5.2,'Suzhou-inspired lotus pool');for(let j=0;j<9;j++){const a=j*2.4;p.lotus(-4.8+Math.sin(a)*1.8,.1+Math.cos(a)*1.5,j%3===0);}
 for(const [x,z,s]of [[-8.2,4.2,1.3],[-6.8,4.8,.85],[-8.4,5.7,.7]])p.rock(x,z,s);
 p.bamboo(7.7,-4.6,3.3);p.bamboo(8.2,6.3,3.1);k.path(0,5.9,14,1.6);p.pavilion(-.5,7,6.5);k.bench(-2.1,7);k.bench(1.1,7);
 return complete(k,p,'china-moon-gate-lotus','Moon-gate lotus and weathered-stone garden','moon-gate-and-asymmetric-lotus-court',{x:5,z:1.5});
}

export function buildSouthKoreaGarden(T,g){
 const k=createGardenKit(T,g,'South Korea'),p=plants(k);k.floor(0x8ba675);k.path(0,-.6,3.3,15.5,0xcac7af,'bamboo valley walk');k.entry('Open bamboo garden entrance');
 // Short offset pools suggest a stream without placing water across the walking route.
 for(const [x,z]of [[-5.7,-4.5],[-6.4,-.7],[-5.3,3.1]])p.pond(x,z,2.4,3.3,'Bamboo valley water garden');
 for(const [x,z]of [[-8.3,-5.9],[-8.3,.5],[-8,5.7]])p.bamboo(x,z,3.4);
 for(const [x,z]of [[4.5,-4.3],[7.7,-3.5],[4.5,.1]])p.shrub(x,z,'Mugunghwa');
 k.path(0,6,14,1.8);p.pavilion(0,7,6.5);k.bench(-1.6,7);k.bench(1.6,7);
 return complete(k,p,'south-korea-bamboo-mugunghwa','Bamboo valley and mugunghwa garden','offset-stream-and-flowering-shrub-walk',{x:5.5,z:3.3});
}

export function buildNorthKoreaGarden(T,g){
 const k=createGardenKit(T,g,'North Korea'),p=plants(k);k.floor(0x91a77b);k.path(0,-5.1,3.2,6.6,0xcec9b5,'magnolia grove entry');k.ring(-1,.8,3.8,5.5,k.surface('grove path',0xc9c7b6),'Magnolia grove crescent loop');k.entry('Magnolia grove open arbor');
 for(const [x,z]of [[-5,-3.2],[-6.1,3.6],[1.5,-2.9]]){
  k.tree(x,z,2.9,'Siebold magnolia broad-leaved tree');
  for(let j=0;j<9;j++){const a=j*2.4;p.bloom('Siebold magnolia',x+Math.sin(a)*1.1,2.65+(j%3)*.2,z+Math.cos(a)*1.05,1);}
 }
 p.rock(-8,6,.9);k.path(0,6.5,14,1.6);k.bench(-1.6,7.2);k.bench(1.6,7.2);
 return complete(k,p,'north-korea-siebold-magnolia','White magnolia woodland crescent','magnolia-crescent-grove',{x:5.6,z:1.6});
}

export function buildMongoliaGarden(T,g){
 const k=createGardenKit(T,g,'Mongolia'),p=plants(k);k.floor(0xb1b180);k.path(0,-.6,3.4,15.5,0xd4c7a3,'steppe meadow trail');k.entry('Open meadow garden frame');
 for(const [x,z,w,d]of [[-5.5,-4.3,4.8,1.9],[4.8,-3,3.8,1.9],[-5.3,1.3,4.4,2.1]])p.irisBed(x,z,w,d,'Iris lactea');
 for(const [x,z]of [[-8,4.5],[-6.2,6.3],[7.8,6.1]]){p.rock(x,z,.75);for(let j=0;j<5;j++)p.blades('Steppe fine grass',x+.45*Math.sin(j*2.4),z+.45*Math.cos(j*2.4),.5,4);}
 k.path(0,6.2,13,1.7,0xd4c7a3);for(let i=0;i<7;i++)k.box('Low meadow windbreak stone',-5.7+i*.58,.18,7.8,.5,.34,.45,k.m.cream);
 k.bench(-1.55,7.1);k.bench(1.55,7.1);
 return complete(k,p,'mongolia-iris-steppe','Pale iris and open steppe meadow garden','low-iris-ribbons-and-stone-rest',{x:5.6,z:2.2});
}

export function buildTaiwanGarden(T,g){
 const k=createGardenKit(T,g,'Taiwan'),p=plants(k);k.floor(0x82a16d);k.path(-.8,-.6,3,15.6,0xc9b997,'botanical collection walkway');k.entry('Lotus collection open entrance');
 p.pond(-5.7,-.8,4.5,8,'Botanical lotus collection pool');for(let j=0;j<14;j++){const a=j*2.4;p.lotus(-5.7+Math.sin(a)*1.4,-.8+Math.cos(a)*3,j%4===0);}
 // Plant-collection display racks on the opposite bank, not a copy of the real garden plan.
 for(const z of [-4.8,-1.5]){k.box('Botanical fern display table',4.7,.65,z,4,.16,.8);k.block(4.7,z,2,.4);for(let j=0;j<5;j++){const x=3.1+j*.75;for(let f=0;f<5;f++){const a=f*2.4;k.rod('Collection fern arched frond',[[x,.74,z],[x+Math.sin(a)*.2,1.1,z+Math.cos(a)*.2],[x+Math.sin(a)*.4,.95,z+Math.cos(a)*.4]],.018,k.m.light);}}}
 k.tree(-7.5,6.2,3.3,'Taiwan botanical collection shade tree');k.path(0,6.3,14,1.6);p.pavilion(0,7.1,6.4);k.bench(-1.6,7.1);k.bench(1.6,7.1);
 return complete(k,p,'taiwan-lotus-collection','Lotus-bank botanical collection garden','long-lotus-bank-and-collection-tables',{x:5.2,z:3});
}

export function buildHongKongGarden(T,g){
 const k=createGardenKit(T,g,'Hong Kong'),p=plants(k);k.m.violet.color.setHex(0xc33e92);k.floor(0x82a16c);k.path(0,-5.8,3.2,5.2,0xc4c5b5,'urban garden entry');k.ring(-1,1,3.4,5.2,k.surface('urban paving',0xbac1b7),'Bauhinia pocket-park loop');k.entry('Orchid-tree garden entrance');
 for(const [x,z]of [[-6,-3.4],[-6.7,4.3],[1.5,-3.1]]){
  k.tree(x,z,3.1,'Hong Kong orchid tree');
  for(let j=0;j<12;j++){const a=j*2.4,px=x+Math.sin(a)*1.05,pz=z+Math.cos(a)*1.05,y=2.8+(j%3)*.17;
   for(const side of [-1,1]){const leaf=k.ell('Bauhinia paired leaf lobe',px+side*.065,y-.13,pz,.13,.025,.21);leaf.rotation.y=a;}
   if(j%2===0)p.bloom('Bauhinia',px,y+.1,pz,1.05);
  }
 }
 for(let i=0;i<5;i++)k.box('Pocket-garden patterned stone inset',-7+i*.6,.075,7.9,.28,.025,.28,k.m.cream);
 k.path(0,6.4,13,1.8,0xbac1b7);k.bench(-1.55,7.1);k.bench(1.55,7.1);
 return complete(k,p,'hong-kong-bauhinia-pocket-garden','Bauhinia blossom pocket garden','orchid-tree-pocket-loop',{x:5.5,z:1.5});
}

export function buildMacaoGarden(T,g){
 const k=createGardenKit(T,g,'Macao'),p=plants(k);k.floor(0x87a373);k.path(0,-5.8,3.2,5.3,0xcac6ae,'lotus garden approach');k.entry('Macao garden open arbor');
 // Offset pools frame a ground-level zigzag promenade. No inaccessible raised bridge physics.
 p.pond(-5.6,-1.8,4.8,5.8,'Macao west lotus pool');p.pond(-2.3,3.8,4.2,3.1,'Macao rear lotus pool');
 for(const [x,z]of [[-6,-3],[-4.7,-1],[-6.3,.2],[-2.8,3.8],[-1,4]])p.lotus(x,z);
 k.path(0,-1.5,3,4.4,0xcac6ae,'first zigzag segment');k.path(1.25,.2,4.8,1.6,0xcac6ae,'crosswise zigzag segment');k.path(2.5,3.3,2.3,6.1,0xcac6ae,'last zigzag segment');
 for(const [x,z]of [[-8.4,5.7],[7.8,-5.4],[7.8,6]])p.bamboo(x,z,3.2);p.rock(-7.8,-6.3,.8);
 k.path(0,6.8,13,1.6,0xcac6ae);k.bench(-1.6,7.3);k.bench(1.6,7.3);
 return complete(k,p,'macao-lotus-zigzag','Lotus pools and bamboo zigzag garden','offset-pools-zigzag-promenade',{x:6,z:1.7});
}

export const eastAsiaGardenBuilders={Singapore:buildSingaporeGarden,Brunei:buildBruneiGarden,'Timor-Leste':buildTimorGarden,Japan:buildJapanGarden,China:buildChinaGarden,'South Korea':buildSouthKoreaGarden,'North Korea':buildNorthKoreaGarden,Mongolia:buildMongoliaGarden,Taiwan:buildTaiwanGarden,'Hong Kong':buildHongKongGarden,Macao:buildMacaoGarden};

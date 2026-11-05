// A Huế-inspired garden within Vietnam, using tourism references documented in docs.
export function buildVietnamGarden(T,garden){
 const group=garden,obstacles=[],mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.88,...extra});
 const brick=mat(0xb97655),tile=mat(0x975947),wood=mat(0x6e4f3c),cream=mat(0xd8d0b4),green=mat(0x438460),white=mat(0xf9efd9),pink=mat(0xed93ba),purple=mat(0xa663c2),yellow=mat(0xf0cf70),water=mat(0x5dafa6,{transparent:true,opacity:.8}),blue=mat(0x719cb7),sphere=new T.SphereGeometry(1,12,8);
 function box(name,x,y,z,w,h,d,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.name=name;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;group.add(o);return o;}
 function ell(parent,name,x,y,z,sx,sy,sz,m){const o=new T.Mesh(sphere,m);o.name=name;o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;parent.add(o);return o;}
 function block(x,z,halfX,halfZ){obstacles.push({x,z,halfX,halfZ});}
 box('Huế garden courtyard',0,.015,0,20,.025,17,mat(0x97ad79));
 for(let i=0;i<21;i++)for(let j=0;j<3;j++)box('Terracotta walking tile',(j-1)*.88,.045,-8+i*.7,.84,.035,.65,i%4?brick:cream);
 for(const x of [-2.1,2.1]){box('Brick garden entrance pillar',x,1.25,-7.5,.44,2.5,.52,brick);block(x,-7.5,.25,.3);}
 function roof(x,z,w,d,y){
  for(const side of [-1,1]){const panel=box('Warm tiled garden roof',x+side*w*.23,y,z,w*.56,.14,d,tile);panel.rotation.z=-side*.3;
   for(let k=0;k<Math.floor(d/.22);k++){const ridge=box('Individual roof tile ridge',x+side*w*.23,y+.09,z-d/2+.13+k*.22,w*.56,.045,.04,brick);ridge.rotation.z=-side*.3;}
  }box('Roof ridge cap',x,y+w*.075,z,.17,.16,d+.2,cream);
 }
 roof(0,-7.5,5.5,1.25,2.85);
 // Lotus pond with solid low rims and round lotus leaves, separate from the walkway.
 box('Lotus pond water',-4.8,.11,-.7,5.4,.08,5.4,water);
 for(const z of [-3.5,2.1])box('Lotus pond brick rim',-4.8,.18,z,6,.3,.25,brick);
 for(const x of [-7.65,-1.95])box('Lotus pond brick rim',x,.18,-.7,.25,.3,5.8,brick);
 block(-4.8,-.7,3,2.95);
 for(let i=0;i<16;i++){
  const a=i*2.4,r=.4+Math.sqrt(i/16)*1.8,x=-4.8+Math.cos(a)*r,z=-.7+Math.sin(a)*r;
  const pad=new T.Mesh(new T.CircleGeometry(.28+i%3*.045,20),green);pad.name='Round lotus leaf';pad.rotation.x=-Math.PI/2;pad.position.set(x,.18,z);group.add(pad);
  if(i%2)continue;
  for(let row=0;row<3;row++)for(let k=0;k<10-row*2;k++){const angle=k*Math.PI*2/(10-row*2)+row*.3,p=ell(group,i%4?'Pink lotus petal':'White lotus petal',x+Math.cos(angle)*(.19-row*.045),.32+row*.08,z+Math.sin(angle)*(.19-row*.045),.07,.13,.17,i%4?pink:white);p.rotation.y=-angle;p.rotation.z=.3;}
  ell(group,'Lotus seed head',x,.48,z,.075,.045,.075,yellow);
 }
 // Rose-myrtle flowering shrubs: violet five-petaled blooms and yellow stamens.
 for(const [sx,sz]of [[-7,-5.6],[-4,-5.8],[3.5,-5.8],[7,1.5]]){
  block(sx,sz,.75,.75);
  for(let i=0;i<32;i++){const a=i*2.4,r=Math.sqrt(i/32)*.6;ell(group,'Rose-myrtle leaf',sx+Math.cos(a)*r,.55+i%4*.1,sz+Math.sin(a)*r,.18,.055,.09,green);}
  for(let i=0;i<8;i++){const a=i*2.4,x=sx+Math.cos(a)*.48,z=sz+Math.sin(a)*.48,y=.92+(i%3)*.08;
   for(let k=0;k<5;k++){const p=k*Math.PI*2/5,o=ell(group,'Purple rose-myrtle petal',x+Math.cos(p)*.07,y,z+Math.sin(p)*.07,.07,.025,.055,purple);o.rotation.y=-p;}
   ell(group,'Rose-myrtle yellow stamens',x,y+.025,z,.045,.035,.045,yellow);
  }
 }
 // Open wooden pavilion and two usable-size benches for future Story Mode staging.
 for(const x of [-2.5,2.5])for(const z of [5.4,8]){box('Wooden garden pavilion post',x,1.4,z,.2,2.8,.2,wood);block(x,z,.15,.15);}
 roof(0,6.7,6.4,4,3.1);
 const seats=[];
 for(const x of [-1.5,1.5]){box('Vietnam garden bench seat',x,.53,7.1,2.4,.15,.7,wood);box('Vietnam garden bench back',x,.95,7.4,2.4,.75,.12,wood);for(const side of [-1,1])box('Vietnam garden bench leg',x+side*.9,.27,7.1,.12,.5,.5,wood);block(x,7.2,1.25,.5);seats.push({x,y:.62,z:7.05,facing:Math.PI});}
 // Fruit-tree and ornamental-tree silhouettes, with leaves rather than canopy balls.
 const dummy=new T.Object3D(),leafGeo=new T.SphereGeometry(1,6,4);
 for(const [tx,tz] of [[7,5],[-7,5],[8,-5]]){
  const trunk=new T.Mesh(new T.CylinderGeometry(.13,.23,2.7,8),wood);trunk.position.set(tx,1.35,tz);trunk.name='Garden fruit-tree trunk';group.add(trunk);block(tx,tz,.28,.28);
  const leaves=new T.InstancedMesh(leafGeo,green,200);leaves.name='Layered fruit-tree leaves';
  for(let i=0;i<200;i++){const a=i*2.4,r=Math.sqrt((i%43)/43)*1.8;dummy.position.set(tx+Math.cos(a)*r,2.4+(i%11)*.11,tz+Math.sin(a)*r);dummy.scale.set(.3,.07,.16);dummy.rotation.set(Math.sin(a)*.3,a,Math.cos(a)*.25);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix);}group.add(leaves);
  for(let i=0;i<9;i++)ell(group,'Garden orchard fruit',tx+Math.sin(i*2.4)*1.1,2.3+i%3*.23,tz+Math.cos(i*2.4),.11,.13,.11,yellow);
 }
 // Ornamental pots reference the planted, ceramic details of Huế gardens.
 for(const [x,z]of [[-8,-5],[6,-5],[-4,4.7]]){
  const pot=new T.Mesh(new T.CylinderGeometry(.5,.35,.65,12),blue);pot.name='Glazed ornamental planter';pot.position.set(x,.34,z);group.add(pot);block(x,z,.55,.55);
  for(const y of [.2,.43]){const band=new T.Mesh(new T.TorusGeometry(.46,.025,5,20),white);band.rotation.x=Math.PI/2;band.position.set(x,y,z);group.add(band);}
  const trunk=new T.Mesh(new T.CylinderGeometry(.045,.1,.65,6),wood);trunk.position.set(x,.93,z);trunk.rotation.z=.3;group.add(trunk);
  for(let i=0;i<28;i++){const a=i*2.4;ell(group,'Ornamental tree foliage',x+Math.sin(a)*.5,1.22+(i%4)*.08,z+Math.cos(a)*.4,.23,.09,.16,green);}
 }
 group.userData.localIdentity='Huế-inspired lotus courtyard';group.userData.storySeats=seats;
 return {obstacles,seats,flowerCount:40,paintCorner:{x:4.6,z:-.6},theme:'Huế lotus and rose-myrtle courtyard',themeKey:'vietnam-hue',layout:'lotus-courtyard'};
}

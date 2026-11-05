export function buildArizonaGarden(T,{scene,sites,mats,mesh,box,cylinder,label,rail,train,skyRide,motions}){
  const site={x:455,z:430,title:'Arizona Garden Park',description:'First garden construction pass: glass habitats, desert drops, an oversized flower railway, and connected orchid-to-rainforest sky flight. Placement is provisional; travel connections come later.',rides:['BubbleSphere Mover — glass habitat coaster','DesertFalls — desert terraces and big drops','Tiny Flowerway Water Extravaganza — oversized flower railway','Flowerfly Fall WonderGardens — orchid garden, rainforest, then sky launch','Quiet stream walk — benches and garden entrance']};
  const g=new T.Group();g.name='arizona-garden';g.position.set(site.x,0,site.z);scene.add(g);sites[g.name]=site;site.group=g;
  mesh(g,new T.PlaneGeometry(200,200),mats.sand,0,-.2,0).rotation.x=-Math.PI/2;cylinder(g,0,0,0,83,.25,mats.green);label(g,'Arizona • Garden Park',0,83,0);
  const blossoms=[];
  function flower(x,z,height=9,color=mats.pink){cylinder(g,x,height/2,z,.28,height,mats.green);const head=new T.Group();head.position.set(x,height,z);g.add(head);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const petal=mesh(head,new T.SphereGeometry(1.5,8,6),color,Math.cos(a)*1.6,0,Math.sin(a)*1.6);petal.scale.y=.35;}mesh(head,new T.SphereGeometry(.8,8,6),mats.gold,0,.3,0);blossoms.push(head);}
  function ride(name,points,mat,speed=.047){const r=train(g,rail(g,points,mat,true,true),mat,3);r.name=name;r.speed=speed;r.currentSpeed=speed;motions.push(r);return r;}
  for(const [x,z,r] of [[-42,-33,19],[-20,-41,12],[-45,-9,13]]){mesh(g,new T.SphereGeometry(r,24,12,0,Math.PI*2,0,Math.PI/2),mats.glass,x,1,z);cylinder(g,x,.4,z,r,1,mats.cream);for(let i=0;i<4;i++)flower(x-7+i*4,z,5,mats.purple);}
  ride('BubbleSphere Mover',[[-60,4,-12],[-58,12,-38],[-43,20,-47],[-23,8,-44],[-10,24,-26],[-22,5,-14],[-40,13,3],[-58,5,5]],mats.purple);label(g,'BubbleSphere Mover',-39,32,-29);
  for(let i=0;i<5;i++){box(g,35+i*5,3+i*4,-36,16,5,18,mats.rock);box(g,35+i*5,6+i*4,-36,18,1,20,mats.cream);}
  ride('DesertFalls',[[12,4,-15],[17,24,-35],[36,61,-50],[48,64,-48],[58,5,-34],[69,8,-13],[58,40,2],[43,42,1],[31,5,-10]],mats.gold,.06);label(g,'DesertFalls',46,70,-36);
  for(let i=0;i<10;i++)flower(-60+i*8,33+(i%2)*16,13+(i%3)*3,i%2?mats.pink:mats.purple);
  for(const x of [-52,-18]){cylinder(g,x,12,43,3,5,mats.blue);box(g,x+4,12,43,6,1,1,mats.blue);mesh(g,new T.TorusGeometry(2,.3,6,16),mats.gold,x-3,13,43);rail(g,[[x+7,12,43],[x+8,7,44],[x+9,1,45]],mats.glass);}
  ride('Tiny Flowerway Water Extravaganza',[[-67,3,30],[-48,6,23],[-26,9,33],[-7,4,44],[-20,12,54],[-43,5,60],[-65,4,48]],mats.blue,.04);label(g,'Tiny Flowerway Water Extravaganza',-34,27,49);
  const orchid=new T.Group();orchid.position.set(9,0,24);g.add(orchid);box(orchid,0,1,0,20,2,25,mats.cream);for(let i=0;i<6;i++)flower(i%2?17:1,16+i*3,6,mats.purple);label(g,'Flowerfly Gardens',8,13,21);
  for(let i=0;i<9;i++){const x=28+(i%3)*12,z=28+Math.floor(i/3)*13;cylinder(g,x,9,z,.8,18,mats.rock);mesh(g,new T.SphereGeometry(6,9,6),mats.green,x,20,z);}
  label(g,'Flowerfly Home Away From Home',43,30,47);
  const sky=skyRide(g,'Flowerfly Fall WonderGardens',[[0,4,15],[9,7,27],[22,12,38],[44,16,49],[59,28,43],[65,57,27],[40,89,5],[4,60,-8],[-18,14,12],[-9,59,55],[32,78,71],[69,20,64],[64,5,69],[7,8,63]],mats.pink);sky.speed=.026;sky.currentSpeed=.026;
  const wings=[];for(const car of sky.cars){for(const side of [-1,1]){const wing=mesh(car,new T.SphereGeometry(1,12,8),side<0?mats.purple:mats.pink,side*2.1,1,0);wing.scale.set(2.4,.12,1.6);wings.push({wing,side});}}
  rail(g,[[-76,.7,78],[-47,.7,72],[-15,.7,77],[16,.7,82],[52,.7,77]],mats.blue);
  for(const x of [-52,-27,0,26]){box(g,x,1.1,86,6,.5,2,mats.cream);for(const dx of [-2,2])box(g,x+dx,.5,86,.4,1,1.5,mats.rock);}
  for(const x of [-10,10]){box(g,x,6,91,2,12,3,mats.cream);flower(x,87,8,mats.gold);}box(g,0,13,91,24,2,3,mats.cream);label(g,'Your garden adventure awaits',0,17,91);
  return{site,sky,update(time){wings.forEach(({wing,side})=>{wing.rotation.z=side*(.16+Math.sin(time*2)*.12);});blossoms.forEach((head,i)=>{head.rotation.z=Math.sin(time*.6+i)*.025;});}};
}

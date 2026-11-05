// Arizona starts as one Hub site beside Nevada; no operational inter-park links.
export function buildArizonaHub(T,{scene,sites,mats,mesh,box,cylinder,label,rail,train,skyRide,motions}){
  const site={x:245,z:110,title:'Arizona World Hub',description:'First Arizona construction pass: colorful vaults and terraces inspired by Arcosanti, local sky flights, a canyon railway, and quiet exploration. Placement and geometry are draft studies.',rides:["SkyFall's Train Connection — local sky-flight study",'Sparkling Sky Coaster — rock-and-water launch study','Railway Coaster Surprise — canyon track study','Exploration PAINTFALL — peaceful paths; world tour later']};
  const g=new T.Group();g.name='arizona-hub';g.position.set(site.x,0,site.z);scene.add(g);site.group=g;sites['arizona-hub']=site;
  mesh(g,new T.PlaneGeometry(170,170),mats.sand,0,-.18,0).rotation.x=-Math.PI/2;
  cylinder(g,0,0,0,53,.25,mats.path);label(g,'Arizona • World Hub',0,66,0);
  for(let i=0;i<3;i++)box(g,0,.7+i*.7,-4,65-i*8,1.4,40-i*7,i%2?mats.cream:mats.path);
  function arch(x,z,r,color){const shape=new T.Shape();shape.moveTo(-r,0);shape.absarc(0,0,r,Math.PI,0,true);shape.lineTo(r-1.3,0);shape.absarc(0,0,r-1.3,0,Math.PI,false);shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:11,bevelEnabled:true,bevelSize:.15,bevelThickness:.15,bevelSegments:2});mesh(g,geo,color,x,3,z);}
  arch(-20,-10,10,mats.pink);arch(0,-13,14,mats.purple);arch(22,-8,9,mats.blue);
  for(const x of [-27,-10,10,29])box(g,x,4.5,7,9,5,8,mats.cream);
  label(g,"SkyFall's Train Connection",-17,25,-2);
  const departure=[[-25,6,21],[-27,12,2],[-28,45,-19],[-22,47,-27],[-18,8,-31],[-5,5,-30],[16,24,-16],[27,51,5]];
  rail(g,departure,mats.pink,false,true);
  const connection=skyRide(g,"SkyFall's Train Connection",[...departure,[18,89,35],[-5,96,40],[-30,93,30],[-43,18,12],[-53,10,-12],[-47,58,-37],[-25,98,-49],[-7,108,-44],[4,61,-50],[27,17,-45],[51,14,-20],[54,56,8],[30,77,21],[15,20,16],[-13,10,11],[-31,5,32],[-39,20,10]],mats.purple);connection.profile='hub';connection.speed=.022;
  for(const [x,z,r,h] of [[-45,-27,7,12],[-30,-39,8,17],[-15,-44,7,11],[40,-30,7,19],[48,-12,5,12]]){const rock=mesh(g,new T.DodecahedronGeometry(r,0),mats.cream,x,h*.5,z);rock.scale.y=h/(r*2);}
  mesh(g,new T.CircleGeometry(9,32),mats.blue,37,.35,22).rotation.x=-Math.PI/2;
  const sparkling=mats.glass.clone();sparkling.opacity=.85;sparkling.metalness=.8;sparkling.roughness=.16;
  const crystal=mesh(g,new T.OctahedronGeometry(7),sparkling,37,10,22);
  const rockLaunch=[[37,4,23],[47,22,14],[48,54,1],[40,59,-10],[31,10,-17],[24,24,-21],[32,68,-26]];rail(g,rockLaunch,mats.blue,false,true);
  const corkscrew=[];for(let i=0;i<20;i++){const a=i/19*Math.PI*4;corkscrew.push([12+Math.cos(a)*11,73+i*1.5,Math.sin(a)*11-10]);}
  const sparklingRide=skyRide(g,'Sparkling Sky Coaster',[...rockLaunch,...corkscrew,[-31,88,6],[-37,18,22],[-37,9,35],[-24,16,42],[-8,71,53],[4,75,51],[22,108,52],[51,87,39],[67,18,21],[61,8,8],[48,24,1],[39,4,35],[32,12,31]],mats.gold);sparklingRide.profile='hub';sparklingRide.speed=.024;sparklingRide.extraSpark=true;sparklingRide.remaining=3;
  label(g,'Sparkling Sky Coaster',38,25,25);
  const loopPoints=[];for(let i=0;i<=20;i++){const a=-Math.PI/2+i/20*Math.PI*2;loopPoints.push([-8+Math.cos(a)*12,21+Math.sin(a)*17,-53+i*.45]);}
  const canyon=rail(g,[[-47,4,28],[-55,20,2],[-51,55,-24],[-43,59,-35],[-30,6,-46],...loopPoints,[25,8,-47],[48,34,-30],[62,9,-3],[54,29,26],[49,4,38],[12,5,49],[-22,4,43]],mats.gold,true,true);const ground=train(g,canyon,mats.blue,3);ground.name='Railway Coaster Surprise';ground.profile='hub';motions.push(ground);
  label(g,'Railway Coaster Surprise',-42,15,34);
  rail(g,[[-12,.5,24],[-6,.6,34],[3,.5,40],[15,.5,35]],mats.blue);
  for(const x of [-7,7]){box(g,x,1.2,31,4,.45,1.7,mats.cream);for(const side of [-1,1])cylinder(g,x+side*1.3,.55,31,.14,1,mats.dark);}
  label(g,'Exploration PAINTFALL',0,8,37);
  return {site,crystal};
}

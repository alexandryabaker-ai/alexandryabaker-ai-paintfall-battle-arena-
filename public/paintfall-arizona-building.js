export function buildArizonaBuilding(T,{scene,sites,mats,mesh,box,cylinder,label,rail,train,skyRide,motions}){
  const site={x:375,z:220,title:'Arizona Building Park',description:'Draft southern-Arizona construction site: Paint Twister, PAINT Castle, and Paintfull Symphony. Ride concepts are approved; park assignment and footprints are provisional.',rides:['Paint Twister — rotating building and ascending spiral sky ride','PAINT Castle — courtyard train-coaster study','Paintfull Symphony — musical building and track study','Third ground coaster — design open']};
  const g=new T.Group();g.name='arizona-building';g.position.set(site.x,0,site.z);scene.add(g);site.group=g;sites['arizona-building']=site;
  mesh(g,new T.PlaneGeometry(190,180),mats.sand,0,-.16,0).rotation.x=-Math.PI/2;cylinder(g,0,0,0,65,.25,mats.path);label(g,'Arizona • Building Park',0,77,0);
  const twister=new T.Group();twister.position.set(-35,0,-18);g.add(twister);
  const profile=[new T.Vector2(3,0),new T.Vector2(4,6),new T.Vector2(7,15),new T.Vector2(10,25),new T.Vector2(14,39)];
  const shell=mats.purple.clone();shell.transparent=true;shell.opacity=.67;mesh(twister,new T.LatheGeometry(profile,36),shell,0,0,0);
  for(let i=0;i<8;i++){const r=3+i*1.5;const ring=mesh(twister,new T.TorusGeometry(r,.3,6,36),i%2?mats.blue:mats.pink,0,3+i*5,0);ring.rotation.x=Math.PI/2;}
  cylinder(g,-35,1,-18,8,2,mats.dark);label(twister,'Paint Twister',0,45,0);
  // The entire tornado assembly ascends: shell, rings, ride track, cars and attached arrival pad.
  const spiral=[];for(let i=0;i<=32;i++){const t=i/32,a=t*Math.PI*6,r=5+t*10;spiral.push([Math.cos(a)*r,4+t*43,Math.sin(a)*r]);}
  const returnSpiral=[];for(let i=0;i<=24;i++){const t=i/24,a=t*Math.PI*6,r=16-t*10;returnSpiral.push([Math.cos(a)*r,46-t*40,Math.sin(a)*r]);}
  const tornadoTrack=[...spiral,...returnSpiral];rail(twister,tornadoTrack,mats.pink,true,true);
  const flight=skyRide(twister,'Paint Twister',tornadoTrack,mats.purple);flight.profile='hub';flight.speed=.019;
  const castle=new T.Group();castle.position.set(31,0,-15);g.add(castle);box(castle,0,8,0,27,16,14,mats.cream);box(castle,0,6,8,8,12,1,mats.dark);
  for(const x of [-16,16]){cylinder(castle,x,11,0,5,22,mats.pink);mesh(castle,new T.ConeGeometry(6,8,8),mats.purple,x,26,0);}
  for(let x=-12;x<=12;x+=4)box(castle,x,17,0,2,3,14,mats.cream);
  label(g,'PAINT Castle',31,35,-15);
  const castleTrack=rail(g,[[12,3,8],[6,13,-9],[15,30,-30],[32,32,-34],[52,7,-30],[56,5,-5],[35,6,14],[16,17,20],[0,5,26]],mats.gold,true,true);const castleTrain=train(g,castleTrack,mats.blue,3);castleTrain.name='PAINT Castle';motions.push(castleTrain);
  const music=new T.Group();music.position.set(20,0,43);g.add(music);box(music,0,5,0,24,10,16,mats.blue);
  for(let i=0;i<9;i++){const pipe=cylinder(music,-10+i*2.5,8+i%3*2,-8,.75,16+i%3*4,i%2?mats.pink:mats.gold);pipe.name='Musical building pipe';}
  mesh(music,new T.TorusGeometry(7,.65,8,24),mats.purple,-14,9,0);label(g,'Paintfull Symphony',20,23,43);
  const symphonyTrack=rail(g,[[-2,3,43],[-1,15,25],[17,24,23],[42,8,28],[45,5,48],[20,12,62],[0,4,58]],mats.blue,true,true);const musicTrain=train(g,symphonyTrack,mats.pink,3);musicTrain.name='Paintfull Symphony';motions.push(musicTrain);
  // No soundtrack is shared or played yet; privacy/mixing mechanics require their own implementation.
  return {site,twister,update(time){
    const cycle=time%32;let elevation;
    if(cycle<11)elevation=T.MathUtils.smoothstep(cycle,1,11)*88;
    else if(cycle<21)elevation=88+Math.sin((cycle-11)*.8)*4;
    else elevation=88*(1-T.MathUtils.smoothstep(cycle,21,32));
    twister.position.y=elevation;twister.rotation.y=time*(.55+elevation*.008);
    twister.position.x=-35+Math.sin(time*.25)*Math.min(10,elevation*.14);
    twister.position.z=-18+Math.cos(time*.25)*Math.min(8,elevation*.12);
  }};
}

export function buildArizonaWater(T,{scene,sites,mats,mesh,box,cylinder,label,rail,train,skyRide,motions}){
  const site={x:245,z:390,title:'Arizona Paint Park',description:'Desert water-park construction pass: bridge arches, a painted canyon, fountain coaster, a separate quiet tubing river, and local SprayFall flight. Site placement is provisional.',rides:['PaintBridge Coaster — arches and water curtains','Canyon Paint Blasting — canyon dives and tunnels','PaintFountain Rush — fountain climb and splash basin','SprayFall Coaster — local sky-flight study','Calming Paint River — gentle tubing, separate from thrills']};
  const g=new T.Group();g.name='arizona-water';g.position.set(site.x,0,site.z);scene.add(g);sites['arizona-water']=site;site.group=g;
  mesh(g,new T.PlaneGeometry(220,210),mats.sand,0,-.18,15).rotation.x=-Math.PI/2;cylinder(g,0,0,0,76,.25,mats.path);label(g,'Arizona • Paint Park',0,75,0);
  const water=mats.glass.clone();water.color.set(0x64cfd7);water.opacity=.6;water.roughness=.16;
  function pool(x,z,r){mesh(g,new T.CircleGeometry(r,40),water,x,.35,z).rotation.x=-Math.PI/2;}
  // A full vertical loop with a small forward offset separates entry and exit.
  function invertedRoute(points,index,cx,cy,cz,r){
    const loop=Array.from({length:25},(_,i)=>{const a=-Math.PI/2+i/24*Math.PI*2;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r,cz+i*.18];});
    const route=[...points.slice(0,index),...loop,...points.slice(index)];
    return {points:route,range:[index/route.length,(index+24)/route.length]};
  }
  function thrill(ride,route,speed){
    ride.speed=speed;ride.currentSpeed=speed;ride.inversionRanges=[route.range];
    ride.upAt=u=>{const t=ride.path.getUtoTmapping(u),tangent=ride.path.getTangentAt(u);
      return t>=route.range[0]&&t<=route.range[1]?new T.Vector3(-tangent.y,tangent.x,0).normalize():new T.Vector3(0,1,0);
    };
  }
  pool(-38,-12,21);pool(34,-18,19);pool(1,21,13);
  // Arch-shaped openings and deck reserve a bridge-based coaster silhouette.
  for(const x of [-55,-39,-23]){const arch=new T.Shape();arch.moveTo(-7,0);arch.absarc(0,0,7,Math.PI,0,true);arch.lineTo(5.6,0);arch.absarc(0,0,5.6,0,Math.PI,false);arch.closePath();mesh(g,new T.ExtrudeGeometry(arch,{depth:5,bevelEnabled:false}),mats.cream,x,3,-14);}
  box(g,-39,11,-11,52,2,6,mats.cream);label(g,'PaintBridge Coaster',-39,27,-12);
  const bridgeRoute=invertedRoute([[-62,3,7],[-61,15,-8],[-49,29,-24],[-31,30,-24],[-16,5,-26],[-14,5,-9],[-28,14,-7],[-45,14,-7],[-59,5,-2],[-48,4,12],[-28,5,13]],5,-15,17,-34,12);
  const bridge=rail(g,bridgeRoute.points,mats.blue,true,true);const b=train(g,bridge,mats.purple,3);b.name='PaintBridge Coaster';thrill(b,bridgeRoute,.061);motions.push(b);
  for(let i=0;i<9;i++){const x=18+i*6,z=-42+(i%2?6:-6);const rock=mesh(g,new T.DodecahedronGeometry(7,0),i%2?mats.pink:mats.rock,x,11+(i%3)*4,z);rock.scale.set(.65,2,1.1);}
  const canyonRoute=invertedRoute([[18,4,-18],[11,14,-34],[23,43,-53],[39,47,-55],[49,5,-54],[64,5,-43],[71,26,-22],[65,6,-3],[43,4,0],[28,9,-7]],6,68,22,-43,17);
  const canyon=rail(g,canyonRoute.points,mats.pink,true,true);const c=train(g,canyon,mats.gold,3);c.name='Canyon Paint Blasting';thrill(c,canyonRoute,.066);motions.push(c);label(g,'Canyon Paint Blasting',42,53,-35);
  const fountain=new T.Group();fountain.position.set(0,0,21);g.add(fountain);cylinder(fountain,0,.8,0,12,1.6,mats.blue);
  const jets=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const jet=rail(fountain,[[Math.cos(a)*8,1,Math.sin(a)*8],[Math.cos(a)*4,20,Math.sin(a)*4],[0,30,0]],mats.blue);jets.push(jet.mesh);}
  const fountainRoute=invertedRoute([[-14,3,30],[-16,16,13],[-5,33,8],[7,35,10],[16,5,20],[14,4,34],[0,6,38]],5,17,18,29,13);
  const fountainTrack=rail(g,fountainRoute.points,mats.gold,true,true);const f=train(g,fountainTrack,mats.blue,3);f.name='PaintFountain Rush';thrill(f,fountainRoute,.058);motions.push(f);label(g,'PaintFountain Rush',0,42,21);
  const launch=[[62,4,12],[74,16,0],[72,40,-15],[59,53,-25]];rail(g,launch,mats.purple,false,true);
  const skyRoute=invertedRoute([...launch,[35,75,-66],[-7,66,-55],[-8,14,-28],[10,58,-5],[48,83,20],[79,40,32],[76,9,21],[58,4,31],[52,12,25]],6,-22,47,-61,24);
  const sky=skyRide(g,'SprayFall Coaster',skyRoute.points,mats.blue);thrill(sky,skyRoute,.036);sky.key='arizona-sprayfall';sky.menuName='Arizona • SprayFall Coaster';
  label(g,'SprayFall Coaster',64,49,5);
  const spray=new T.InstancedMesh(new T.SphereGeometry(.15,5,4),water,48);g.add(spray);const dummy=new T.Object3D();
  const riverPoints=Array.from({length:32},(_,i)=>{const a=i/32*Math.PI*2;return new T.Vector3(-28+Math.cos(a)*39,.35,69+Math.sin(a)*15);});const river=new T.CatmullRomCurve3(riverPoints,true,'centripetal');mesh(g,new T.TubeGeometry(river,100,2.5,8,true),water,0,0,0);
  const tubes=[];for(let i=0;i<7;i++){const tube=mesh(g,new T.TorusGeometry(.9,.26,8,20),i%2?mats.pink:mats.gold,0,0,0);tube.rotation.x=Math.PI/2;tubes.push(tube);}
  label(g,'Calming Paint River',-28,7,72);
  for(const x of [-45,-25,-5]){box(g,x,1,91,5,.5,1.8,mats.cream);cylinder(g,x,4,95,.3,8,mats.green);mesh(g,new T.ConeGeometry(5,4,10),mats.green,x,8,95);}
  const curtains=new T.Group();g.add(curtains);for(const x of [-49,-31]){const curtain=box(curtains,x,5,-24,8,9,.3,water);curtain.name='Transparent paint-water curtain';}
  return{site,tubes,river,update(time){
    tubes.forEach((tube,i)=>{tube.position.copy(river.getPointAt((time*.005+i/7)%1));tube.position.y=1.1;});
    jets.forEach((jet,i)=>{jet.scale.y=.94+Math.sin(time*.8+i*.4)*.06;});
    for(let i=0;i<48;i++){const a=i/48*Math.PI*2,p=(time*1.6+i*.1)%1,center=sky.cars[Math.floor(i/16)].position;dummy.position.set(center.x+Math.cos(a)*(1+p*2),center.y+1.8-p*3,center.z+Math.sin(a)*(1+p*2));dummy.scale.setScalar(1-p*.6);dummy.updateMatrix();spray.setMatrixAt(i,dummy.matrix);}spray.instanceMatrix.needsUpdate=true;
  }};
}

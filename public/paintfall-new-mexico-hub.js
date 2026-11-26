// Source: docs/PAINTFALL-NEW-MEXICO-DESIGN.md, World Hub owner revisions
// and approved CalderaColor buildup (October 25, 2026).
// Geometry, colors and 28-second preview pacing are construction proposals.
// No boarding, destination travel, physical vehicle specifications or sound triggers.
export function buildNewMexicoHub(T,{scene,sites,mats,mesh,box,cylinder,label,rail,train}) {
 const group=new T.Group();group.name='new-mexico-hub';scene.add(group);
 box(group,0,-.5,0,310,1,280,mats.sand);
 box(group,0,.04,0,18,.08,260,mats.path);
 const rides=[],animations=[];
 const paint=color=>new T.MeshStandardMaterial({color,roughness:.7});
 const glow=color=>new T.MeshBasicMaterial({color});
 const names=['White Glow Paint Drift','CavernCanvas EchoRun','CalderaColor Coil','BalloonBloom SkyParade','SandiaSunset SkySweep','Starport PaintLaunch'];
 const colors=[0x78d4d4,0xa591de,0xc88764,0xea91b6,0xefae77,0x7cb2ed];
 // First review proposal for the approved sweeping turns and dune crests.
 // This is only the outbound themed section, not a designed connection or return.
 const whiteGlowPoints=[[-28,3,25],[-25,3,19],[-17,4,12],[-24,6,3],[-22,8,-8],
  [-11,5,-17],[2,3,-12],[11,6,-2],[5,10,9],[15,6,18],[26,3,9],[28,3,-2]];
 const calderaPoints=[[-25,4,20],[-28,8,5],[-22,13,-12],[-10,16,-23],[5,13,-24],
  [17,16,-16],[22,20,-5],[18,24,5],[9,28,8],[1,31,1],[5,34,-9],[16,36,-12],
  [27,32,-1],[27,15,16],[17,4,24],[0,3,26],[-15,4,24]];
 function pointsFor(index){
  if(index===0)return whiteGlowPoints;
  if(index===2)return calderaPoints;
  return Array.from({length:32},(_,i)=>{
   const a=i/32*Math.PI*2;
   const height=index===0?4+Math.pow(Math.sin(a*2),2)*5:
    index===1?6+Math.pow(Math.sin(a),2)*5:5+(1-Math.cos(a))*20;
   return [Math.sin(a)*28,height,Math.cos(a)*25];
  });
 }
 for(let index=0;index<6;index++){
  const parent=new T.Group();parent.position.set((index%3-1)*99,0,index<3?-65:65);group.add(parent);
  const path=rail(parent,pointsFor(index),paint(colors[index]),index!==0,true);
  const ride=train(parent,path,paint(colors[index]),1);
  Object.assign(ride,{name:names[index],key:'new-mexico-'+index,previewOnly:true,
   travelScope:index<3?'neighboring-state':'country',period:28});
  rides.push(ride);label(parent,ride.name,0,60,0);
  const car=ride.cars[0];
  if(index===0){
   Object.assign(ride,{travelScope:'central-world-hub-network',sectionOnly:true,returnRoute:null,connectionTarget:null,
    previewNote:'Outbound themed-section study. Shared-track connection and individual return route still to design.',
    replayPreview(){this.restartRequested=true;}});
   const dunes=[[-34,20,7,.4],[-32,-18,8,.4],[-8,-28,9,.35],[-2,6,7,.35],[18,28,6,.4],[35,8,6,.4],[-22,-8,6,.8],[5,9,6,1.1]];
   for(const [n,[x,z,r,height]]of dunes.entries()){
    const dune=mesh(parent,new T.SphereGeometry(r,20,12),paint(0xf4eedb),x,0,z);
    dune.name='White Glow dune '+n;dune.scale.set(1,height,.75);
    const band=mesh(parent,new T.TorusGeometry(r*.85,.18,6,40,Math.PI),glow([0x82e8de,0xf3a6d0,0xf1d582][n%3]),x,1+r*height,z);
    band.rotation.x=-Math.PI/2;band.material.transparent=true;
    animations.push({kind:'band',object:band,phase:n,ride});
   }
   for(const [name,[x,y,z]]of [['White Glow departure',whiteGlowPoints[0]],['Themed section ends — connection pending',whiteGlowPoints.at(-1)]]){
    const marker=box(parent,x,y-1,z,6,.3,5,mats.cream);marker.name=name;
   }
  }
  if(index===1){
   // Bright, open-sided chamber: formations stay inside the rail's perimeter.
   for(let n=0;n<9;n++){
    const a=n/9*Math.PI*2;
    const formation=mesh(parent,new T.ConeGeometry(2,11+n%3*3,7),paint(0x9f92bd),Math.sin(a)*17,6,Math.cos(a)*15);
    formation.name='Illuminated cavern formation';
   }
   const water=mesh(parent,new T.CircleGeometry(13,40),paint(0x5596b4),0,.1,0);water.rotation.x=-Math.PI/2;
   for(let n=0;n<4;n++){
    const ripple=mesh(parent,new T.TorusGeometry(3+n*2,.14,6,40),glow([0x8ce0de,0xe0b0ed,0xf2dc93,0x9db9ef][n]),0,.2+n*.02,0);
    ripple.rotation.x=-Math.PI/2;animations.push({kind:'ripple',object:ripple,phase:n});
   }
  }
  if(index===2){
   ride.sequence=['forested volcanic hills','glowing rock tunnel','brightening color veins during upward spiral','tunnel exit revealing drop','colorful meadow finale'];
   for(let n=0;n<4;n++){
    const hill=mesh(parent,new T.SphereGeometry(7,12,8),paint(0x7c8971),-21+n*8,4,-15-n%2*6);hill.scale.y=.7;
    for(let j=0;j<3;j++)mesh(parent,new T.ConeGeometry(1.2,5,7),mats.green,hill.position.x+j*2-2,9,hill.position.z);
   }
   // Open segmented tunnel follows the rising spiral; frames remain outside car clearance.
   for(let n=5;n<=11;n++){
    const point=new T.Vector3(...calderaPoints[n]);
    const tangent=new T.Vector3(...calderaPoints[n+1]).sub(new T.Vector3(...calderaPoints[n-1])).normalize();
    const frame=new T.Group();frame.position.copy(point);frame.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),tangent);parent.add(frame);
    mesh(frame,new T.TorusGeometry(4,.9,7,18),mats.rock,0,0,0);
    const vein=mesh(frame,new T.TorusGeometry(3.75,.14,6,24),glow(colors[(n-5)%6]),0,0,.95);
    animations.push({kind:'vein',object:vein,phase:n-5});
   }
   box(parent,0,.1,22,38,.15,12,mats.green);
   for(let n=0;n<18;n++)mesh(parent,new T.SphereGeometry(.6,6,5),glow(colors[n%6]),n%6*6-15,.7,19+Math.floor(n/6)*3);
  }
  if(index===3){
   mesh(car,new T.SphereGeometry(2.6,16,12),paint(0xea91b6),0,5,0).scale.y=1.3;
   for(const x of [-.8,.8])cylinder(car,x,2.3,0,.06,2.6,mats.gold);
   for(let n=0;n<5;n++){
    const balloon=new T.Group();balloon.position.set(Math.sin(n*2)*16,13+n*5,Math.cos(n*2)*14);parent.add(balloon);
    mesh(balloon,new T.SphereGeometry(3,14,10),paint(colors[n]),0,4,0).scale.y=1.3;
    box(balloon,0,0,0,2,1.4,2,mats.cream);animations.push({kind:'balloon',object:balloon,base:balloon.position.y,phase:n});
   }
  }
  if(index===4){
   for(let n=0;n<5;n++)mesh(parent,new T.ConeGeometry(8,12+n*3,5),paint(n%2?0xb58276:0x8d7798),-16+n*8,6+n*1.5,-8);
   for(const x of [-1,1])box(car,x,1.8,0,.1,2,2.5,mats.cream);
   box(car,0,2.8,0,2.4,.12,2.8,mats.gold);
   const sunset=mesh(parent,new T.SphereGeometry(8,18,12),glow(0xf0ac7c),0,28,-18);sunset.scale.z=.2;
   box(parent,0,12,-23,16,.5,5,mats.cream);
  }
  if(index===5){
   // Back-side sky enclosure affects this ride only, never global scene lighting.
   const sky=mesh(parent,new T.SphereGeometry(43,28,20),new T.MeshBasicMaterial({color:0x101c38,side:T.BackSide,fog:false}),0,23,0);
   sky.name='Starport ride-local night sky';ride.localNight=true;
   box(parent,0,2,25,14,3,7,paint(0x334d77));
   for(const x of [-8,8])box(parent,x,5,22,.5,9,.5,glow(0x7ad8f0));
   for(let n=0;n<20;n++){
    const a=n/20*Math.PI*2;
    mesh(parent,new T.SphereGeometry(.18,5,4),glow(0xd8e9ff),Math.sin(a)*36,24+Math.sin(n*2)*15,Math.cos(a)*32);
   }
   box(car,0,1.1,0,5,.12,1.5,mats.blue);
   mesh(car,new T.ConeGeometry(.8,2,10),mats.cream,0,.8,2.2).rotation.x=Math.PI/2;
   for(let n=0;n<8;n++){
    const u=n/32,point=ride.path.getPointAt(u),ring=mesh(parent,new T.TorusGeometry(4,.15,6,28),glow(colors[n%6]),point.x,point.y,point.z);
    ring.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),ride.path.getTangentAt(u));
   }
  }
 }
 function update(time){
  for(const ride of rides){
   if(ride.restartRequested){ride.previewStartedAt=time;ride.restartRequested=false;}
   const u=ride.sectionOnly?Math.max(0,Math.min(1,(time-(ride.previewStartedAt??0))/ride.period)):((time/ride.period)%1+1)%1;
   if(ride.sectionOnly)ride.previewProgress=u;
   ride.cars[0].position.copy(ride.path.getPointAt(u));
   ride.cars[0].quaternion.setFromUnitVectors(new T.Vector3(0,0,1),ride.path.getTangentAt(u));
  }
  for(const animation of animations){
   const {object,phase,kind}=animation;
   if(kind==='balloon')object.position.y=animation.base+Math.sin(time*.6+phase)*.6;
   else if(kind==='ripple')object.scale.setScalar(1+Math.sin(time+phase)*.08);
   else if(kind==='band'){
    object.material.color.setHSL((phase/7+time*.025)%1,.65,.72);
    const car=animation.ride.cars[0];
    object.material.opacity=.12+.88*Math.max(0,1-Math.hypot(car.position.x-object.position.x,car.position.z-object.position.z)/16);
   }
   else object.material.color.setHSL(phase/7,.7,.45+.25*(.5+.5*Math.sin(time*1.5-phase*.7)));
  }
 }
 update(0);
 const site={group,title:'New Mexico • World Hub'};sites['new-mexico-hub']=site;
 return {hub:{site,rides,update},racing:null};
}

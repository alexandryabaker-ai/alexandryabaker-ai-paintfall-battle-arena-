// First visual layouts from the saved Utah and Colorado creator directions.
// Track shapes, colors and preview pacing are review proposals.
const hubs={
 Utah:[
  ['Glowden Paint Junction','junction',0xf4c453,'stationary'],
  ['Archway Color Rush','arches',0xf18459,'neighboring-state'],
  ['Bubbly Hidden-and-Splash','bubbles',0x38bcc1,'neighboring-state'],
  ['Canyon SkyFall','plane',0xa6c8eb,'country'],
  ['Starlight PaintFall','twilight',0x8469ce,'neighboring-state'],
  ['Starlight PaintSky','eclipse',0xf4d765,'country'],
 ],
 Colorado:[
  ['Loop de Paint Junction','bridge',0xe975a3,'neighboring-state'],
  ['DuneWave Color Rush','dunes',0xf2b353,'neighboring-state'],
  ["Rockin' RhythmRunthem",'rhythm',0xd56959,'neighboring-state'],
  ['CloudCog Falls','simulator',0x57b3da,'country'],
  ['GorgeSky PaintGlide','gondola',0x62baa0,'country'],
  ['Shadow-to-Shimmer Dusk-to SunFall','diamonds',0x9684dc,'country'],
 ],
};
const utahPairs=[
 ['Honda Civic','Standard Bugatti Chiron'],
 ['Toyota Camry','Original Bugatti Veyron 16.4'],
 ['Honda Accord','Lamborghini Aventador SVJ'],
 ['Ford F-150','2017 Ford GT'],
 ['Toyota Corolla','Porsche 918 Spyder'],
];

export function buildExpansionParks(T,state,{scene,sites,mats,mesh,box,cylinder,label,rail,train}){
 if(!hubs[state])return null;
 const rides=[],decorations=[],group=new T.Group();
 group.name=state.toLowerCase()+'-hub';scene.add(group);
 box(group,0,-.5,0,310,1,280,mats.sand);
 box(group,0,.04,0,18,.08,260,mats.path);
 const material=color=>new T.MeshStandardMaterial({color,roughness:.65});
 function pathFor(kind){
  return Array.from({length:24},(_,i)=>{
   const a=i/24*Math.PI*2,sky=['plane','eclipse','simulator','gondola','diamonds'].includes(kind);
   const height=kind==='arches'?4+Math.abs(Math.sin(a*2))*20:
    sky?5+Math.pow((1-Math.cos(a))/2,1.2)*48:4+(1-Math.cos(a*2))*6;
   return [Math.sin(a)*28,height,Math.cos(a)*25];
  });
 }
 function buildRide(parent,name,kind,color,points=pathFor(kind)){
  const paint=material(color),path=rail(parent,points,paint,true,true);
  const ride=train(parent,path,paint,1);
  Object.assign(ride,{name,key:kind,parent,previewOnly:true,period:kind==='racing'?16:28});
  rides.push(ride);
  label(parent,name,0,60,0);
  return ride;
 }
 for(const [i,[name,kind,color,travelScope]]of hubs[state].entries()){
  const parent=new T.Group();
  parent.position.set((i%3-1)*99,0,i<3?-65:65);group.add(parent);
  const ride=buildRide(parent,name,kind,color);
  ride.travelScope=travelScope;
  const car=ride.cars[0],paint=material(color);
  if(kind==='junction'){
   const secondPoints=pathFor(kind).map(([x,y,z])=>[x*.65,y+3,z*.65]);
   const second=train(parent,rail(parent,secondPoints,mats.gold,true,true),mats.gold,1);
   Object.assign(second,{name:name+' — second route',period:28,parent});rides.push(second);
   mesh(parent,new T.ConeGeometry(2.3,14,8),material(0xffd866),0,8,0);
  }
  if(kind==='arches'){
   for(let arc=0;arc<4;arc++){
    const a=arc*Math.PI/2;
    const arch=mesh(parent,new T.TorusGeometry(12,2,6,24,Math.PI),paint,Math.sin(a)*17,12,Math.cos(a)*17);
    arch.rotation.y=a;
   }
  }
  if(kind==='bubbles'){
   for(let n=0;n<7;n++){
    mesh(parent,new T.ConeGeometry(3,10+n,5),mats.rock,Math.sin(n)*18,5,Math.cos(n)*18);
    const bubble=mesh(parent,new T.SphereGeometry(1.1,8,6),new T.MeshStandardMaterial({color:[0xeba4cf,0x72d9df,0xf3db77][n%3],transparent:true,opacity:.45}),Math.sin(n)*14,9+n,Math.cos(n)*14);
    decorations.push({object:bubble,base:bubble.position.y,phase:n});
   }
  }
  if(kind==='plane'){
   box(car,0,1,0,6,.12,1.2,mats.cream);
   box(car,0,1.5,-1,2.8,.1,.7,mats.blue);
   mesh(car,new T.ConeGeometry(.7,1.6,10),paint,0,.8,2).rotation.x=Math.PI/2;
   for(const child of parent.children)if(child.isMesh&&child.geometry.type==='TubeGeometry'){
    child.material=new T.MeshStandardMaterial({color:0xdceaf2,metalness:1,roughness:.07,transparent:true,opacity:.13});
   }
   for(const child of parent.children)if(child.isInstancedMesh||child.geometry?.type==='CylinderGeometry')child.visible=false;
  }
  if(kind==='twilight'||kind==='eclipse'){
   const disc=mesh(parent,new T.SphereGeometry(9,20,12),material(kind==='eclipse'?0x28314b:0x565aab),0,27,0);
   disc.scale.z=.15;
   mesh(parent,new T.TorusGeometry(11,kind==='eclipse'?1.5:.55,8,40),new T.MeshBasicMaterial({color:kind==='eclipse'?0xffe7a1:0xbca6ef}),0,27,0);
  }
  if(kind==='bridge'){
   box(parent,0,13,0,60,1,5,mats.cream);
   for(const x of [-22,-11,0,11,22])cylinder(parent,x,6,0,.7,12,mats.rock);
   mesh(parent,new T.CircleGeometry(7,24),material(0xf071b2),0,.13,23).rotation.x=-Math.PI/2;
  }
  if(kind==='dunes'||kind==='rhythm'){
   for(let n=0;n<4;n++){
    const rock=mesh(parent,new T.SphereGeometry(8,10,8),material([color,0xd68ac5,0x64b9d1,0xc3cf74][n]),Math.sin(n*1.8)*16,4,Math.cos(n*1.8)*16);
    rock.scale.set(1,kind==='dunes'?.6:1.6,.8);
    if(kind==='dunes')box(parent,rock.position.x,6,rock.position.z,6,.15,4,material([0x8f64b8,0x62b9cf,0xee7796,0xf0cf72][n]));
   }
  }
  if(kind==='simulator'){
   box(car,0,1.7,0,2.3,1.4,3,mats.blue);
   box(car,0,1.8,1.52,1.8,.8,.05,mats.dark);
  }
  if(kind==='gondola'){
   for(const x of [-1,1])box(car,x,1.8,0,.12,2,2.5,mats.cream);
   box(car,0,2.8,0,2.4,.12,2.8,mats.green);
   for(let n=0;n<3;n++){
    const bird=new T.Group();bird.name='Fictional paint glider';bird.position.set(n*8-8,35+n*3,0);parent.add(bird);
    box(bird,0,0,0,5,.12,.7,material([0xeca2c4,0x8bbfd8,0xd5c77a][n]));
    decorations.push({object:bird,base:bird.position.y,phase:n});
   }
  }
  if(kind==='diamonds'){
   for(let n=0;n<7;n++)mesh(parent,new T.OctahedronGeometry(2),new T.MeshBasicMaterial({color:[0xaadceb,0xc3b6f3,0xf5db97][n%3]}),Math.sin(n)*15,5+n*3,Math.cos(n)*15);
  }
 }
 const hubRides=rides.filter(ride=>!ride.name.includes(' — second route'));
 const hubSite={group,title:state+' • World Hub'};
 sites[state.toLowerCase()+'-hub']=hubSite;
 const hub={site:hubSite,rides:hubRides};
 let racing=null;
 if(state==='Utah'){
  const raceGroup=new T.Group();scene.add(raceGroup);
  raceGroup.name='utah-racing';
  box(raceGroup,0,-.5,0,310,1,280,mats.sand);
  const racers=[];
  for(const [lane,[appearance,performance]]of utahPairs.entries()){
   const parent=new T.Group();parent.position.x=(lane-2)*57;raceGroup.add(parent);
   const points=Array.from({length:24},(_,i)=>{
    const a=i/24*Math.PI*2;
    return [Math.sin(a)*19,4+(1-Math.cos(a))*13,Math.cos(a)*100];
   });
   const ride=buildRide(parent,appearance+' car-train','racing',[0x6fb8cf,0xe595b6,0xdab259,0x7d9dcd,0xb8cc86][lane],points);
   Object.assign(ride,{appearanceInspiration:appearance,performanceInspiration:performance,travelScope:'country-and-state',period:16});
   if(appearance==='Ford F-150'){
    box(ride.cars[0],0,1.3,.6,1.8,.6,1.2,mats.glass);
    box(ride.cars[0],0,.9,-.9,1.8,.4,.8,mats.cream);
   }else box(ride.cars[0],0,1.3,0,1.6,.5,1.8,mats.glass);
   racers.push(ride);
  }
  racing={site:{group:raceGroup,title:"Utah • Racin’ Park"},rides:racers};
  sites['utah-racing']=racing.site;
 }
 function update(time){
  for(const ride of rides){
   const u=(time/ride.period)%1;
   for(const car of ride.cars){
    car.position.copy(ride.path.getPointAt(u));
    car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),ride.path.getTangentAt(u));
   }
  }
  for(const {object,base,phase}of decorations)object.position.y=base+Math.sin(time*.8+phase)*.7;
 }
 update(0);
 hub.update=update;
 if(racing)racing.update=()=>{};
 return {hub,racing};
}

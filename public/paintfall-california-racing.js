import { rideMaterial } from './paintfall-california-colors.js';
// First construction proposal. Pacing is fictional; real vehicle specs and travel are deferred.
export function buildCaliforniaRacing(T,{scene,sites,label=()=>{},rail,train}){
 const group=new T.Group();group.name='california-racing';group.position.set(1300,0,0);scene.add(group);
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.65});
 const m={ground:mat(0xab9979),path:mat(0xe4d4b2),dark:mat(0x354654),glass:mat(0x90cfd7),pink:mat(0xe881ac),blue:mat(0x67cbd7),gold:mat(0xf1ca65),leaf:mat(0x5a8061)};
 function mesh(p,g,c,x=0,y=0,z=0,name=''){const o=new T.Mesh(g,c);o.position.set(x,y,z);o.name=name;p.add(o);return o;}
 const box=(p,x,y,z,w,h,d,c,name)=>mesh(p,new T.BoxGeometry(w,h,d),c,x,y,z,name);
 box(group,0,-.5,0,310,1,300,m.ground,'Racing park foundation');box(group,0,.1,104,260,.2,16,m.path,'Pit-lane promenade');label(group,"California • Racin’ Park",0,110,0);
 const colors=['racing-blue','racing-pink','racing-gold'].map(key=>rideMaterial(T,key,m.blue)),skyColor=rideMaterial(T,'racing-sky',m.gold),rides=[];
 const specs=[{key:'racing-blue',name:'Blue Streak — working name',appearance:'Camry-inspired sedan',performance:'GR86',seconds:8.5},{key:'racing-pink',name:'Paint Pulse — working name',appearance:'Civic-inspired compact',performance:'MX-5 Miata',seconds:9},{key:'racing-gold',name:'Golden Flash — working name',appearance:'Model 3-inspired fastback',performance:'Mustang',seconds:8}];
 function body(car,lane,color=colors[lane]){
  // Original simplified silhouettes, no logos or claimed production dimensions.
  box(car,0,1,.1,1.8,.5,3,color,'Original car-train body');
  const cabin=box(car,0,1.6,lane===0?-.1:lane===1?.2:-.25,1.45,.65,lane===1?1.25:1.8,m.glass,'Sedan / compact / fastback cabin study');if(lane===2)cabin.rotation.x=.12;
  box(car,0,1.1,1.7,1.65,.18,.1,m.path,'Front light bar');
  for(const x of [-.4,.4]){const belt=box(car,x,1.6,.4,.08,.8,.09,m.gold,'Visible seatbelt study');belt.rotation.z=x>0?-.45:.45;}
 }
 for(let i=0;i<3;i++){
  const p=new T.Group();p.position.x=(i-1)*70;group.add(p);const spec=specs[i];
  const points=[[-20,4,73],[-24,12,30],[-22,48,-18],[-10,56,-68],[10,48,-78],[23,8,-38],[24,30,10],[20,7,68],[0,4,83]];
  const r=train(p,rail(p,points,colors[i],true,true),colors[i],3);Object.assign(r,{...spec,parent:p,progress:0,description:spec.appearance+' appearance with '+spec.performance+' performance inspiration. Original PAINTFALL design; fictional preview pacing only. Actual mph, force display and destination travel are not connected.'});r.cars.forEach(c=>body(c,i));rides.push(r);
  label(p,spec.name,0,67,0);box(p,-20,1,72,13,2,16,m.path,'Racing station platform');box(p,-20,7,72,14,1,17,colors[i],'Pit station canopy');
  for(let j=0;j<6;j++)box(p,-29+j*10,.2,94,5,.3,5,j%2?m.dark:m.path,'Starting-grid tiles');
 }
 const sky=train(group,rail(group,[[-132,5,100],[-139,30,25],[-132,72,-100],[-70,95,-130],[70,98,-130],[138,74,-80],[142,35,45],[109,14,123],[0,10,132],[-100,5,120]],skyColor,true,true),skyColor,3);
 Object.assign(sky,{key:'racing-sky',name:'California racing sky coaster — design study',parent:group,progress:0,description:'Additional sky-coaster proposal around the racing districts. Final name, destination and travel mechanics remain open.'});sky.cars.forEach(c=>body(c,2,skyColor));rides.push(sky);
 const bumper=new T.Group();bumper.position.set(-64,0,119);group.add(bumper);box(bumper,0,.5,0,52,1,25,m.pink,'Paint Splatter Cars arena footprint');label(bumper,'Paint Splatter Cars',0,12,0);
 const kart=new T.Group();kart.position.set(62,0,119);group.add(kart);box(kart,0,.3,0,54,.6,26,m.dark,'Ready-Set-Paint-Race course footprint');label(kart,'Ready-Set-Paint-Race',0,12,0);
 const vehicles=[];for(let i=0;i<3;i++)for(const [p,kind] of [[bumper,'bumper'],[kart,'kart']]){const car=new T.Group();p.add(car);body(car,i);car.scale.setScalar(kind==='kart'?.7:.85);if(kind==='bumper'){const rim=mesh(car,new T.TorusGeometry(1.8,.25,8,18),m.dark,0,.6,0,'Soft bumper ring');rim.rotation.x=Math.PI/2;}vehicles.push({car,kind,lane:i});}
 const inspections=[...rides,{key:'racing-bumper',name:'Paint Splatter Cars',parent:bumper,description:'Distinct bumper-car silhouettes with soft rings. Visual movement only; player driving and paint games are not connected.'},{key:'racing-karts',name:'Ready-Set-Paint-Race',parent:kart,description:'Smaller original go-kart models, with their own relaxed preview pace. Freely driven vehicles do not inherit coaster speeds.'}];
 const site={x:1300,z:0,group,title:"California • Racin’ Park",description:'Three fast car-train previews in separate racing lanes, an additional sky-coaster study, bumper cars and karts. Names are proposals; exact vehicle specifications and world-travel routes remain open.',rides:inspections.map(r=>r.name+' — construction study')};sites['california-racing']=site;
 function update(time){rides.forEach((r,i)=>{r.progress=time/(i<3?specs[i].seconds:10)%1;r.phase='Fictional racing preview';r.cars.forEach((car,j)=>{const u=(r.progress-j*.018+1)%1;car.position.copy(r.path.getPointAt(u));car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),r.path.getTangentAt(u));});});vehicles.forEach(({car,kind,lane})=>{const a=time/(kind==='kart'?4:7)+lane*Math.PI*2/3;car.position.set(Math.cos(a)*17,.6,Math.sin(a)*7);car.rotation.y=-a;});}
 update(0);return{site,rides,inspections,sky,update,vehicles,specs};
}


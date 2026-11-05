import { buildUtahBuilding } from './paintfall-utah-building.js';
import * as T from 'three';
import { OrbitControls } from '/vendor/OrbitControls.js';
import { buildArizonaHub } from './paintfall-arizona-hub.js';
import { buildArizonaBuilding } from './paintfall-arizona-building.js';
import { buildArizonaWater } from './paintfall-arizona-water.js';
import { buildArizonaGarden } from './paintfall-arizona-garden.js';
import { buildArizonaRacing } from './paintfall-arizona-racing.js';
import { buildCaliforniaBuilding } from './paintfall-california-building.js';
import { buildCaliforniaGarden } from './paintfall-california-garden.js';
import { buildCaliforniaPaint } from './paintfall-california-paint.js';
import { buildCaliforniaHub } from './paintfall-california-hub.js';
import { buildCaliforniaRacing } from './paintfall-california-racing.js';

const host=document.getElementById('view'),status=document.getElementById('status');
const scene=new T.Scene();scene.background=new T.Color('#bbd3df');scene.fog=new T.Fog('#bbd3df',550,1100);
const camera=new T.PerspectiveCamera(48,1,.1,1500);camera.position.set(430,360,455);
const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.shadowMap.enabled=true;host.prepend(renderer.domElement);
renderer.domElement.setAttribute('aria-label','PAINTFALL park construction: Nevada, Arizona, California and Utah parks');
host.setAttribute('aria-label','Interactive 3D amusement park construction preview');
document.title='PAINTFALL — Park construction';
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(95,0,45);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.48;controls.minDistance=20;controls.maxDistance=2300;
scene.add(new T.HemisphereLight(0xe9f5ff,0xb77c47,2.2));const sun=new T.DirectionalLight(0xffebcd,3);sun.position.set(-90,160,80);scene.add(sun);
const mats={sand:new T.MeshStandardMaterial({color:0xbc976d,roughness:1}),rock:new T.MeshStandardMaterial({color:0xa86f55,roughness:1}),cream:new T.MeshStandardMaterial({color:0xd8bb94,roughness:1}),path:new T.MeshStandardMaterial({color:0xe3ceb0}),green:new T.MeshStandardMaterial({color:0x60965c}),purple:new T.MeshStandardMaterial({color:0x9062d3}),pink:new T.MeshStandardMaterial({color:0xe575ad}),blue:new T.MeshStandardMaterial({color:0x3eaec2}),gold:new T.MeshStandardMaterial({color:0xf8c969}),dark:new T.MeshStandardMaterial({color:0x263744}),glass:new T.MeshStandardMaterial({color:0x99d9e8,transparent:true,opacity:.48,roughness:.2})};
function mesh(parent,geo,mat,x,y,z){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
function box(p,x,y,z,w,h,d,mat){return mesh(p,new T.BoxGeometry(w,h,d),mat,x,y,z);}
function cylinder(p,x,y,z,r,h,mat){return mesh(p,new T.CylinderGeometry(r,r,h,24),mat,x,y,z);}
function label(parent,text,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#172d36e8';ctx.fillRect(0,0,512,96);ctx.fillStyle='#fff8df';ctx.font='600 28px system-ui';ctx.textAlign='center';ctx.fillText(text,256,59);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const s=new T.Sprite(new T.SpriteMaterial({map:tex,depthTest:false}));s.position.set(x,y,z);s.scale.set(31,5.8,1);parent.add(s);}
function rail(parent,points,mat=mats.gold,closed=false,coaster=false){
  const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),closed,'centripetal');
  const m=mesh(parent,new T.TubeGeometry(curve,160,coaster?.19:.22,6,closed),mat,0,0,0);
  if(coaster){
    const left=[],right=[],up=new T.Vector3(0,1,0),ties=new T.InstancedMesh(new T.BoxGeometry(1.5,.15,.16),mats.dark,120),dummy=new T.Object3D();
    for(let i=0;i<=160;i++){const u=i/160,p=curve.getPointAt(u),t=curve.getTangentAt(u),side=new T.Vector3().crossVectors(t,up);if(side.lengthSq()<.001)side.set(1,0,0);side.normalize().multiplyScalar(.62);left.push(p.clone().add(side));right.push(p.clone().sub(side));}
    for(const pts of [left,right])mesh(parent,new T.TubeGeometry(new T.CatmullRomCurve3(pts,closed),180,.14,5,closed),mat,0,0,0);
    for(let i=0;i<120;i++){const u=i/120;dummy.position.copy(curve.getPointAt(u));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),curve.getTangentAt(u));dummy.updateMatrix();ties.setMatrixAt(i,dummy.matrix);}parent.add(ties);
    for(let i=0;i<14;i++){const p=curve.getPointAt(i/14);if(p.y>4)cylinder(parent,p.x,p.y/2,p.z,.22,p.y,mats.dark);}
  }
  return {curve,mesh:m,coaster};
}
function loop(parent,cx,cz,rx,rz,height,mat){const points=Array.from({length:20},(_,i)=>{const a=i/20*Math.PI*2;return[cx+Math.cos(a)*rx,height+Math.max(0,Math.sin(a*2))*3,cz+Math.sin(a)*rz];});return rail(parent,points,mat,true);}
function train(parent,path,mat,count=3){const cars=[];for(let i=0;i<count;i++){const car=new T.Group();box(car,0,.45,0,1.7,.65,2.8,mat);for(const z of [-.6,.65]){box(car,0,1,z,1.4,.85,.32,mats.dark);box(car,0,.9,z-.2,.13,.8,.25,mats.gold);}for(const x of [-.88,.88])for(const z of [-.8,.8]){const w=mesh(car,new T.CylinderGeometry(.28,.28,.15,10),mats.dark,x,0,z);w.rotation.z=Math.PI/2;}parent.add(car);cars.push(car);}return {path:path.curve,cars,parent,speed:path.coaster?.038:.025,progress:rand(),mode:'cruise',remaining:4+rand()*3,currentSpeed:.025,eventCount:0,spin:0};}

function racingPath(lane){
  // Separate parallel trains: steep lift/drop, a vertical loop, then sweeping returns.
  const shift=lane*3.5,pts=[[-22+shift,3,16],[-24+shift,9,5],[-21+shift,30,-12],[-16+shift,31,-18],[-12+shift,3,-24]];
  for(let i=0;i<=18;i++){const a=-Math.PI/2+i/18*Math.PI*2;pts.push([shift+Math.cos(a)*8,12+Math.sin(a)*9,-24+i*.65]);}
  pts.push([15+shift,5,-6],[23+shift,12,5],[17+shift,8,17],[5+shift,3,23]);return pts;
}
mesh(scene,new T.PlaneGeometry(360,370),mats.sand,0,-.2,20).rotation.x=-Math.PI/2;
let seed=41;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<38;i++){const side=i%2?1:-1,x=side*(128+rand()*40),z=-145+rand()*315;const mountain=mesh(scene,new T.ConeGeometry(12+rand()*20,18+rand()*32,5),i%3?mats.rock:mats.cream,x,9,z);mountain.rotation.y=rand()*6.28;}
const sites={hub:{x:0,z:0,title:'World Hub',description:'Central Nevada basin: the large hub and its two sky-coaster station placeholders, plus the approved twin-tower train coaster.',rides:['PAINTFALL Towers Coaster — shape and track study','SKYFALL PaintCoaster — rooftop departure study','Second sky-coaster station — design still open',"PAINTFALL's Fountain of Art — placement draft"]},racing:{x:-78,z:-100,title:"Racin' Park",description:'Northwestern Nevada-inspired desert racing site. The three separate track shapes reserve space for the chosen car-train designs.',rides:['Three car-train track placeholders','The Paint Ride....Against Time — sky station placeholder','Paint Splatter Cars — arena footprint','Ready-Set-Paint-Race — kart course footprint',"PaintRacin' SkyPods — overhead course study"]},building:{x:55,z:95,title:'Building Park',description:'Southern desert skyline: original paint architecture against dry mountain landforms.',rides:['PaintaRound — sphere-shaped ride study','SplashMart — explorable building footprint','Other building coasters — designs open']},garden:{x:16,z:130,title:'Garden Park',description:'A planted oasis in the Henderson-inspired desert, with garden paths and nature seating.',rides:['PAINTFALL Garden of Beauty and Art','Garden workshop — footprint','Local garden coasters and sky ride — designs open']},water:{x:92,z:157,title:'Paint Park',description:'A river-and-desert setting inspired by Laughlin, with quieter water paths and the continuously spraying sky-coaster concept.',rides:['SprayFall Coaster — track and station study','Paint Rapids','PaintChute','PaintBubbler','Paintwave Bay — water footprint']}};
const motions=[],skyRides=[];
function skyRide(parent,name,points,mat){
  const path={curve:new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),true,'centripetal'),coaster:true};
  const ride=train(parent,path,mat,3);ride.name=name;ride.sky=true;ride.progress=0;ride.speed=.014;ride.currentSpeed=.014;
  motions.push(ride);skyRides.push(ride);
  const departure=points[0],arrival=points[points.length-2];
  box(parent,arrival[0],arrival[1]-.8,arrival[2],9,.6,7,mats.purple);
  label(parent,'Sky arrival',arrival[0],arrival[1]+5,arrival[2]);
  return ride;
}
for(const [id,s] of Object.entries(sites)){const g=new T.Group();g.position.set(s.x,0,s.z);g.name=id;scene.add(g);s.group=g;cylinder(g,0,0,0,id==='hub'?31:24,.25,id==='garden'?mats.green:mats.path);label(g,s.title,0,id==='hub'?46:31,0);box(g,0,1,22,8,2,4,mats.purple);}
const hub=sites.hub.group;
for(const side of [-1,1]){const tower=new T.Group();tower.position.set(side*6,0,-2);hub.add(tower);box(tower,0,14,0,5,28,5,mats.dark);for(let j=0;j<6;j++)box(tower,0,4+j*4,-2.56,4,.45,.15,j%2?mats.purple:mats.blue);motions.push({tower,side});}
const towerTrack=rail(hub,[[-14,3,16],[-14,12,3],[-13,37,-12],[-9,39,-17],[-8,3,-22],[0,3,-25],[12,21,-23],[15,35,-13],[15,4,2],[22,4,14],[6,3,21]],mats.gold,true,true);motions.push(train(hub,towerTrack,mats.purple));
box(hub,25,18,-5,7,36,7,mats.dark);box(hub,25,37,-5,11,1,10,mats.blue);
rail(hub,[[25,38,-5],[31,36,-11],[35,4,-18],[38,3,-2],[34,18,9],[24,44,14]],mats.blue,false,true);
skyRide(hub,'SKYFALL PaintCoaster',[[25,38,-5],[31,36,-11],[35,4,-18],[38,3,-2],[34,18,9],[24,44,14],[-12,70,38],[-48,54,19],[-49,8,-30],[-24,40,-44],[4,76,-36],[37,55,-26],[44,12,7],[24,7,26],[-19,4,17],[-26,24,-5]],mats.pink);
label(hub,'Sky station • design open',-19,7,16);cylinder(hub,-17,1,15,6,2,mats.purple);
const fountain=cylinder(hub,0,.4,8,5,.8,mats.blue);for(let i=0;i<10;i++){const a=i*6.28/10;rail(hub,[[Math.cos(a)*4,.6,8+Math.sin(a)*4],[Math.cos(a)*2,7,8+Math.sin(a)*2],[0,.6,8]],mats.blue);}
const rg=sites.racing.group;for(let i=0;i<3;i++){const p=rail(rg,racingPath(i-1),[mats.pink,mats.gold,mats.blue][i],true,true);motions.push(train(rg,p,[mats.pink,mats.gold,mats.blue][i],3));}box(rg,-12,.5,14,12,1,8,mats.purple);loop(rg,12,14,7,4,.8,mats.dark);loop(rg,0,0,21,19,16,mats.blue);
for(const racer of motions.filter(m=>m.parent===rg)){racer.speed=.085;racer.currentSpeed=.060;}
const bg=sites.building.group;mesh(bg,new T.SphereGeometry(9,32,20),mats.pink,-7,9,0);
const sphereTrack=rail(bg,[[-20,3,10],[-21,12,-2],[-14,24,-9],[-5,25,-13],[0,3,-16],[-7,3,-7],[-13,13,-4],[-7,20,1],[1,8,6],[0,3,16]],mats.gold,true,true);motions.push(train(bg,sphereTrack,mats.blue));box(bg,13,4,0,10,8,14,mats.purple);label(bg,'SplashMart',13,10,0);
const gg=sites.garden.group;for(let i=0;i<30;i++){const a=rand()*6.28,r=6+rand()*15;const x=Math.cos(a)*r,z=Math.sin(a)*r;cylinder(gg,x,1.2,z,.2,2.4,mats.green);mesh(gg,new T.SphereGeometry(.9,8,6),i%2?mats.pink:mats.gold,x,2.6,z);}loop(gg,0,0,16,11,.5,mats.blue);box(gg,-9,3,-9,8,6,7,mats.glass);for(const x of [-8,8])box(gg,x,.6,14,4,.5,1.5,mats.cream);
const nevadaGardenTrack=rail(gg,[[-21,3,8],[-22,12,-5],[-14,24,-17],[0,26,-19],[14,4,-12],[21,8,0],[15,18,12],[0,5,19],[-15,4,17]],mats.purple,true,true);
const nevadaGardenRide=train(gg,nevadaGardenTrack,mats.pink,3);nevadaGardenRide.name='Nevada garden coaster — motion study';motions.push(nevadaGardenRide);
sites.garden.rides=['PAINTFALL Garden of Beauty and Art','Garden coaster — moving track study; final design open','Garden workshop — footprint','Sky ride — design still open'];
const wg=sites.water.group;mesh(wg,new T.CircleGeometry(15,40),mats.blue,0,.15,0).rotation.x=-Math.PI/2;const waterTrack=rail(wg,[[-20,3,13],[-23,11,0],[-17,30,-16],[-8,32,-21],[-2,3,-21],[8,3,-13],[20,17,-5],[22,5,12],[10,3,21]],mats.blue,true,true);motions.push(train(wg,waterTrack,mats.purple));rail(wg,[[0,6,-14],[0,18,-16],[0,41,-18]],mats.pink);box(wg,-10,2,13,6,4,5,mats.blue);
skyRide(wg,'SprayFall Coaster',[[0,6,-14],[0,18,-16],[0,41,-18],[17,64,-28],[35,47,-15],[34,9,12],[12,37,33],[-19,66,20],[-32,42,-3],[-23,17,-20],[-13,4,13],[-10,8,-5]],mats.blue);
// A continuous spray halo travels with this coaster's cars, not with the park fountains.
const sprayGeometry=new T.SphereGeometry(.13,5,4),spray=new T.InstancedMesh(sprayGeometry,mats.glass,48);wg.add(spray);const sprayDummy=new T.Object3D();
// Geographical connections are visual placeholders; travel behavior is deliberately deferred.
for(const [id,s] of Object.entries(sites))if(id!=='hub')rail(scene,[[0,.7,0],[s.x*.5,1,s.z*.5],[s.x,.7,s.z]],mats.cream);
rail(scene,[[125,.3,90],[118,.3,125],[124,.3,160],[111,.3,200]],mats.blue);
const exploration=new T.Group();exploration.position.set(55,0,49);scene.add(exploration);box(exploration,0,.15,0,24,.3,15,mats.cream);box(exploration,0,.2,0,3,.2,13,mats.dark);box(exploration,9,2,0,6,4,8,mats.dark);label(exploration,'Desert exploration • name open',0,8,0);
const arizona=buildArizonaHub(T,{scene,sites,mats,mesh,box,cylinder,label,rail,train,skyRide,motions});
const arizonaOption=document.createElement('option');arizonaOption.value='arizona-hub';arizonaOption.textContent='Arizona • World Hub';document.getElementById('park').append(arizonaOption);
const arizonaBuilding=buildArizonaBuilding(T,{scene,sites,mats,mesh,box,cylinder,label,rail,train,skyRide,motions});
const buildingOption=document.createElement('option');buildingOption.value='arizona-building';buildingOption.textContent='Arizona • Building Park';document.getElementById('park').append(buildingOption);
const arizonaWater=buildArizonaWater(T,{scene,sites,mats,mesh,box,cylinder,label,rail,train,skyRide,motions});
const waterOption=document.createElement('option');waterOption.value='arizona-water';waterOption.textContent='Arizona • Paint Park';document.getElementById('park').append(waterOption);
const arizonaGarden=buildArizonaGarden(T,{scene,sites,mats,mesh,box,cylinder,label,rail,train,skyRide,motions});
const gardenOption=document.createElement('option');gardenOption.value='arizona-garden';gardenOption.textContent='Arizona • Garden Park';document.getElementById('park').append(gardenOption);
const arizonaRacing=buildArizonaRacing(T,{scene,sites,mats,mesh,box,cylinder,label,rail,train,skyRide,motions});
const racingOption=document.createElement('option');racingOption.value='arizona-racing';racingOption.textContent="Arizona • Racin' Park";document.getElementById('park').append(racingOption);
const californiaBuilding=buildCaliforniaBuilding(T,{scene,sites,label});
const californiaGarden=buildCaliforniaGarden(T,{scene,sites,label,rail,train});
const californiaPaint=buildCaliforniaPaint(T,{scene,sites,label,rail,train});
const paintOption=document.createElement('option');paintOption.value='california-paint';paintOption.textContent='California • Paint Park';document.getElementById('park').append(paintOption);skyRides.push(californiaPaint.sky,...californiaPaint.additionalSky);
const californiaHub=buildCaliforniaHub(T,{scene,sites,label,rail,train});
const hubOption=document.createElement('option');hubOption.value='california-hub';hubOption.textContent='California • World Hub';document.getElementById('park').append(hubOption);skyRides.push(californiaHub.sky,...californiaHub.additionalSky);
const californiaRacing=buildCaliforniaRacing(T,{scene,sites,label,rail,train});
const californiaRacingOption=document.createElement('option');californiaRacingOption.value='california-racing';californiaRacingOption.textContent='California • Racing Park';document.getElementById('park').append(californiaRacingOption);skyRides.push(californiaRacing.sky);
const utahBuilding=buildUtahBuilding(T,{scene,sites,label,rail,train});
const utahOption=document.createElement('option');utahOption.value='utah-building';utahOption.textContent='Utah • Building Park';document.getElementById('park').append(utahOption);skyRides.push(utahBuilding.sky);
const californiaParks={'california-building':californiaBuilding,'california-garden':californiaGarden,'california-paint':californiaPaint,'california-hub':californiaHub,'california-racing':californiaRacing,'utah-building':utahBuilding};
const californiaOption=document.createElement('option');californiaOption.value='california-building';californiaOption.textContent='California • Building Park';document.getElementById('park').append(californiaOption);
skyRides.push(californiaBuilding.sky);
const californiaGardenOption=document.createElement('option');californiaGardenOption.value='california-garden';californiaGardenOption.textContent='California • Garden Park';document.getElementById('park').append(californiaGardenOption);skyRides.push(californiaGarden.sky);
const californiaControls=document.createElement('div');californiaControls.hidden=true;
const attractionLabel=document.createElement('label');attractionLabel.textContent='Inspect a California attraction';attractionLabel.htmlFor='california-attraction';
const attractionSelect=document.createElement('select');attractionSelect.id='california-attraction';attractionSelect.setAttribute('aria-label','Inspect a California attraction');
for(const r of [{key:'all',name:'Whole Building Park'},...californiaBuilding.rides]){const o=document.createElement('option');o.value=r.key;o.textContent=r.name;attractionSelect.append(o);}
const attractionNote=document.createElement('p');attractionNote.className='note';californiaControls.append(attractionLabel,attractionSelect,attractionNote);document.querySelector('aside').insertBefore(californiaControls,document.getElementById('motion'));
function inspectCalifornia(){
 const park=californiaParks[document.getElementById('park').value];
 const ride=(park?.inspections||park?.rides)?.find(r=>r.key===attractionSelect.value);
 attractionNote.textContent=ride?.description||'Original first layouts of the saved concepts. Boarding, track clearances, soundtrack and travel remain open for design and testing.';
 if(ride){const p=ride.parent.getWorldPosition(new T.Vector3());controls.target.copy(p).add(new T.Vector3(0,15,0));camera.position.copy(p).add(new T.Vector3(55,55,65));controls.update();}
}
attractionSelect.onchange=()=>{leaveRide();if(attractionSelect.value==='all')select(document.getElementById('park').value);else inspectCalifornia();host.scrollIntoView({block:'start'});};
document.querySelector('h1').textContent='PAINTFALL • Park construction';document.getElementById('park').options[0].textContent='All built park previews • Overview';
document.querySelector('aside > p.note:last-child').textContent='Nevada and Arizona previews are preserved. California Building, Garden, Paint, World Hub and Racing parks are new layout proposals using their approved concepts. Utah Building Park adds four approved concept studies. Sites are compressed for review; geographic placement and travel remain open.';
function select(id){
 const s=sites[id],california=californiaParks[id];document.getElementById('park').value=s?id:'all';californiaControls.hidden=!california;const inspectorText=id.startsWith('utah-')?'Inspect a Utah attraction':'Inspect a California attraction';attractionLabel.textContent=inspectorText;attractionSelect.setAttribute('aria-label',inspectorText);
 if(california){attractionSelect.replaceChildren();for(const r of [{key:'all',name:'Whole '+({'california-garden':'Garden','california-building':'Building','california-paint':'Paint','california-hub':'World Hub','california-racing':'Racing','utah-building':'Building'}[id])+(id==='california-hub'?'':' Park')},...(california.inspections||california.rides)]){const option=document.createElement('option');option.value=r.key;option.textContent=r.name;attractionSelect.append(option);}}
 document.getElementById('title').textContent=s?s.title:'Sixteen park previews taking shape';
 document.getElementById('description').textContent=s?s.description:'Five Nevada previews, five Arizona previews, plus California Building, Garden, Paint, World Hub and Racing Park studies and Utah Building Park. Sites are arranged for review, not geographic travel.';
 document.getElementById('rides').replaceChildren();
 for(const text of s?s.rides:['Nevada • Five park previews','Arizona • Five park previews','California • Five park proposals','Utah • Building Park proposal','Park connections deferred']){const li=document.createElement('li');li.textContent=text;document.getElementById('rides').append(li);}
 if(s){const cal=!!california;controls.target.set(s.x,cal?20:id==='arizona-building'?40:9,s.z);camera.position.set(s.x+((id==='california-hub'||id==='california-racing'||id==='utah-building')?200:cal?150:id.startsWith('arizona-')?95:48),(id==='california-hub'||id==='california-racing'||id==='utah-building')?160:cal?130:id==='arizona-building'?145:id.startsWith('arizona-')?90:48,s.z+((id==='california-hub'||id==='california-racing'||id==='utah-building')?220:cal?170:id.startsWith('arizona-')?120:60));if(cal){attractionSelect.value='all';rideSelect.value=california.sky.key??california.sky.name;inspectCalifornia();}}
 else{controls.target.set(750,0,40);camera.position.set(1750,1050,1400);}controls.update();
}
let riding=null;
const rideSelect=document.createElement('select');rideSelect.id='sky-ride-choice';rideSelect.setAttribute('aria-label','Choose a sky-coaster ride view');
for(const ride of skyRides){const option=document.createElement('option');option.value=ride.key??ride.name;option.textContent=ride.menuName??ride.name;rideSelect.append(option);}
const rideButton=document.createElement('button');rideButton.id='ride-view';rideButton.textContent='Start sky ride view';rideButton.setAttribute('aria-pressed','false');
const aside=document.querySelector('aside');aside.insertBefore(rideSelect,document.getElementById('motion'));aside.insertBefore(rideButton,document.getElementById('motion'));
function leaveRide(){riding=null;camera.up.set(0,1,0);controls.enabled=true;rideButton.textContent='Start sky ride view';rideButton.setAttribute('aria-pressed','false');}
rideButton.onclick=()=>{if(riding){leaveRide();select(document.getElementById('park').value);}else{const selected=skyRides.find(r=>(r.key??r.name)===rideSelect.value);if(!selected)return;riding=selected;controls.enabled=false;rideButton.textContent='Leave sky ride view';rideButton.setAttribute('aria-pressed','true');}host.scrollIntoView({block:'start'});};
rideSelect.onchange=()=>{if(riding)riding=skyRides.find(r=>(r.key??r.name)===rideSelect.value);};
document.getElementById('park').onchange=e=>{leaveRide();select(e.target.value);};document.getElementById('reset').onclick=()=>{leaveRide();select(document.getElementById('park').value);};
let moving=true;document.getElementById('motion').onclick=e=>{moving=!moving;e.target.textContent=moving?'Pause preview motion':'Resume preview motion';e.target.setAttribute('aria-pressed',String(moving));};
const observer=new ResizeObserver(()=>{camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight,false);});observer.observe(host);
const paintBursts=[],paintGeometry=new T.SphereGeometry(.24,6,4);
const gardenWaterMaterial=mats.glass.clone();gardenWaterMaterial.color.set(0x8bdeef);gardenWaterMaterial.opacity=.7;
function burst(m){
  const garden=m.parent===sites.garden.group||m.parent===arizonaGarden.site.group;
  for(let i=0;i<(m.profile==='hub'?44:22);i++){const bead=mesh(m.parent,paintGeometry,garden?gardenWaterMaterial:[mats.pink,mats.blue,mats.gold,mats.purple][i%4],0,0,0);bead.name=garden?'Garden water droplet':'Paint droplet';bead.position.copy(m.cars[0].position);bead.position.y+=1;paintBursts.push({bead,life:1.5,v:new T.Vector3((rand()-.5)*12,3+rand()*7,(rand()-.5)*12)});}
}
function updateRide(m,dt){
  if(dt>0){
    m.remaining-=dt;
    if(m.remaining<=0){
      m.mode=m.mode==='hold'?'launch':m.profile==='hub'&&m.sky?['hold','launch','plunge','barrel-roll','splash'][Math.floor(rand()*5)]:m.sky?['cruise','launch','splash'][Math.floor(rand()*3)]:['hold','reverse','spin','splash','launch'][Math.floor(rand()*5)];
      m.remaining=m.mode==='hold'?1.2+rand():2+rand()*2;m.eventCount++;
      if(['splash','launch','plunge','barrel-roll'].includes(m.mode))burst(m);
      if(m.extraSpark){
        // Small exclusive flourish: occasional suspense beat, then a painted acceleration.
        if(m.eventCount%3===1){m.mode='hold';m.remaining=.85;}
        else if(m.eventCount%3===2){m.mode='launch';m.remaining=1.4;burst(m);m.extraBurstIn=.65;}
      }
    }
    if(m.extraBurstIn!==undefined){m.extraBurstIn-=dt;if(m.extraBurstIn<=0){burst(m);delete m.extraBurstIn;}}
    const target=m.mode==='hold'?0:m.mode==='reverse'?-m.speed*.8:m.mode==='launch'?m.speed*(m.profile==='hub'?3.6:2.2):m.mode==='plunge'?m.speed*2.8:m.speed*(.8+Math.sin(time*.9+m.progress)*.25);
    m.currentSpeed=T.MathUtils.lerp(m.currentSpeed,target,1-Math.exp(-dt*3));
    m.progress=(m.progress+m.currentSpeed*dt+1)%1;
    if(m.mode==='spin'||m.mode==='barrel-roll')m.spin+=dt*(m.profile==='hub'?5:3.5);
    else m.spin=T.MathUtils.lerp(m.spin,Math.round(m.spin/(Math.PI*2))*Math.PI*2,1-Math.exp(-dt*2));
  }
  m.cars.forEach((car,i)=>{const u=(m.progress-i*.018+1)%1;car.position.copy(m.path.getPointAt(u));const tangent=m.path.getTangentAt(u);car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),tangent);
    if(m.upAt){const right=new T.Vector3().crossVectors(m.upAt(u),tangent).normalize(),up=new T.Vector3().crossVectors(tangent,right).normalize();car.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(right,up,tangent));}
    const ahead=m.path.getTangentAt((u+.012)%1),bend=tangent.x*ahead.z-tangent.z*ahead.x;car.rotateZ(T.MathUtils.clamp(bend*3,m.profile==='hub'?-.95:-.65,m.profile==='hub'?.95:.65));if(m.sky&&m.profile==='hub')car.rotateZ(m.spin*(i%2?-1:1));else car.rotateY(m.spin*(i%2?-1:1));});
}
let last=performance.now(),time=0;
function animate(now){
  const dt=moving?Math.max(0,Math.min((now-last)/1000,.05)):0;last=now;time+=dt;
  arizonaBuilding.update(time);
  californiaBuilding.update(time);
  californiaGarden.update(time);
  californiaPaint.update(time);
  californiaHub.update(time);
  californiaRacing.update(time);
  utahBuilding.update(time);
  arizonaWater.update(time);
  arizonaGarden.update(time);
  for(const m of motions){if(m.tower){m.tower.rotation.z=Math.sin(time*.3)*.06*m.side;continue;}updateRide(m,dt);}
  for(let i=paintBursts.length-1;i>=0;i--){const p=paintBursts[i];p.life-=dt;p.v.y-=dt*9;p.bead.position.addScaledVector(p.v,dt);p.bead.scale.setScalar(Math.max(.1,p.life/1.5));if(p.life<=0){p.bead.parent.remove(p.bead);paintBursts.splice(i,1);}}
  const waterSky=skyRides[1];for(let i=0;i<48;i++){const a=i/48*Math.PI*2,phase=(time*1.7+i*.13)%1;const center=waterSky.cars[Math.floor(i/16)].position;sprayDummy.position.set(center.x+Math.cos(a)*(1+phase*2.4),center.y+1.8-phase*3,center.z+Math.sin(a)*(1+phase*2.4));sprayDummy.scale.setScalar(1-phase*.6);sprayDummy.updateMatrix();spray.setMatrixAt(i,sprayDummy.matrix);}spray.instanceMatrix.needsUpdate=true;
  if(riding){const u=riding.progress,pos=riding.parent.localToWorld(riding.path.getPointAt(u)),ahead=riding.parent.localToWorld(riding.path.getPointAt((u+.014)%1));camera.up.copy(riding.upAt?riding.upAt(u).transformDirection(riding.parent.matrixWorld):new T.Vector3(0,1,0));camera.position.copy(pos).addScaledVector(camera.up,1.8);camera.lookAt(ahead.clone().addScaledVector(camera.up,1.5));}
  else controls.update();renderer.render(scene,camera);requestAnimationFrame(animate);
}
const initialPark=new URLSearchParams(location.search).get('park');
select(initialPark&&sites[initialPark]?initialPark:new URLSearchParams(location.search).get('state')==='arizona'?'arizona-hub':new URLSearchParams(location.search).get('state')==='nevada'?'hub':'all');status.textContent='Construction motion study • Boarding, physics, soundtrack and travel are not connected';
window.PAINTFALL_PARK_BUILD={scene,renderer,camera,sites,motions,skyRides,paintBursts,arizona,arizonaBuilding,arizonaWater,arizonaGarden,ready:true};requestAnimationFrame(animate);

















import {createWorld,THREE} from './paintfall-contest-3d-world.js';
import {gardenReferences} from './paintfall-garden-references.js';
import {composedGardenReferences} from './paintfall-garden-compositions.js';
import {createTowerMagnetPreview} from './paintfall-tower-magnet-preview.js';
const $=id=>document.getElementById(id),host=$('view');
const catalog=window.PaintfallArenaCatalog,all=Object.values(catalog).sort((a,b)=>a.name.localeCompare(b.name)||a.type.localeCompare(b.type));
const viewIds=['overview','ground','overhead','garden','flowers','hub','racing','racers'];
let world,current=null,filtered=all,view=viewIds.includes(new URL(location.href).searchParams.get('view'))?new URL(location.href).searchParams.get('view'):'overview',angle=.7,distance=68,center=new THREE.Vector3(0,1,0),turn=false,previousTime=0,drag=null;
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
let colorRequested=new URL(location.href).searchParams.get('look')!=='original';
$('tower-magnets').checked=new URL(location.href).searchParams.get('magnets')==='1';
let ridingTower=false,magnetPreview=null;
const rideEye=new THREE.Vector3(),rideTarget=new THREE.Vector3();
function stopTowerRide(){
 ridingTower=false;
 $('tower-ride').textContent='Ride Towers Coaster';
 world?.camera.up.set(0,1,0);
}
function removeMagnetPreview(){
 magnetPreview?.dispose();
 magnetPreview=null;
}
function syncTowerPreview(){
 const hub=view==='hub'&&world?.region.parks?.sites.find(site=>site.id==='hub');
 $('tower-preview').hidden=!hub;
 if(!hub)stopTowerRide();
 const show=Boolean(hub&&$('tower-magnets').checked);
 $('tower-magnet-legend').hidden=$('tower-magnet-reading').hidden=!show;
 if(show&&!magnetPreview)magnetPreview=createTowerMagnetPreview(THREE,hub.group,$('tower-magnet-reading'));
 if(!show)removeMagnetPreview();
}
$('tower-magnets').onchange=syncTowerPreview;
$('tower-ride').onclick=()=>{
 if(ridingTower){stopTowerRide();return;}
 const parks=world?.region.parks;
 if(!parks||view!=='hub')return;
 parks.syncClock(globalThis.PaintfallTowerRide.DWELL_MS);
 parks.update(0);
 ridingTower=true;
 $('tower-ride').textContent='Exit rider view';
};
function syncColors(){
 $('color-comparison').hidden=current?.id!=='country:Cambodia';const enabled=world?.setColorLook(colorRequested)||false;
 host.dataset.colorLook=enabled?'pop':'original';$('look-original').setAttribute('aria-pressed',String(!enabled));$('look-pop').setAttribute('aria-pressed',String(enabled));
 $('look-note').textContent=enabled?'Approved richer flowers with the outdoor surface textures — also used in the local game.':'Original flower colors for comparison, with the same outdoor surface textures.';
}
for(const [id,enabled]of [['look-original',false],['look-pop',true]])$(id).onclick=()=>{colorRequested=enabled;syncColors();const url=new URL(location.href);url.searchParams.set('look',enabled?'pop':'original');history.replaceState(null,'',url);};
function kind(p){return p.type==='state'?'U.S. state':'Country / territory';}
function fit(){
 world.region.parks?.setInspectionMode(view==='racers');
 if(view==='racers'&&world.region.parks){distance=6;angle=.7;return;}
 const bounds=new THREE.Box3(),park=world.region.parks?.sites.find(p=>p.id===view);if(park){park.group.updateWorldMatrix(true,true);bounds.expandByObject(park.group);}else if(['garden','flowers'].includes(view)&&world.region.garden){const focus=view==='flowers'?world.region.garden.paintFlowers.group:world.region.garden.group;focus.updateWorldMatrix(true,true);bounds.expandByObject(focus);}else for(const child of world.region.group.children)if(!['Level regional arena terrain','Arena movement boundary'].includes(child.name))bounds.expandByObject(child);
 if(bounds.isEmpty())center.set(0,1,0);else bounds.getCenter(center);
 center.y=1;const size=bounds.isEmpty()?new THREE.Vector3(40,10,40):bounds.getSize(new THREE.Vector3());
 distance=clamp(Math.max(size.x,size.z)*.95,view==='flowers'?7:view==='garden'?22:36,world.region.parks?180:105);angle=['garden','flowers'].includes(view)?Math.PI+.2:.7;
}
function choose(id){
 if(!world||!catalog[id])return;
 try{
  if(id!==current?.id){stopTowerRide();removeMagnetPreview();}
  world.setRegion(id);current=catalog[id];if((['garden','flowers'].includes(view)&&!world.region.garden)||(['hub','racing','racers'].includes(view)&&!world.region.parks))view='overview';fit();syncColors();syncTowerPreview();
  $('garden').disabled=$('flowers').disabled=!world.region.garden;$('hub').disabled=$('racing').disabled=!world.region.parks;$('racers').hidden=$('race-car').hidden=!world.region.parks;for(const v of viewIds)$(v).setAttribute('aria-pressed',String(v===view));
  $('place').value=id;$('place-title').textContent=current.name+' · '+kind(current);
  $('stats').textContent=(current.homes||0)+' homes · '+(current.animals||0)+' animals in the current arena catalog';
  $('garden-note').replaceChildren();if(world.region.garden){const note=$('garden-note');note.append(document.createTextNode(world.region.garden.theme+' · PAINTFALL paint flowers · 2 benches · Garden Park coming soon. '+(world.region.garden.identityStatus==='regional-design-pending'?'Local garden identity is still to be designed together.':'')));const inspiration={Vietnam:['https://vietnamtourism.vn/en/index.php/news/items/2334','Huế garden inspiration'],Laos:['https://www.pha-tad-ke.com/visit/the-gardens-2/','Lao botanical-garden inspiration'],Cambodia:['https://tourismcambodia.org/public/attractions/royal-garden-1551335490','Cambodian garden inspiration'],Thailand:['https://en.wikipedia.org/wiki/Cassia_fistula','Golden-shower plant reference'],Myanmar:['https://en.wikipedia.org/wiki/National_Kandawgyi_Botanical_Gardens','Upland botanical-garden reference'],Malaysia:['https://www.frim.gov.my/attractions/nature-activities/kepong-botanic-gardens/','Malaysian botanical-garden reference'],Indonesia:['https://kebunraya.id/r/bogor','Bogor botanical-garden reference'],Philippines:['https://en.wikipedia.org/wiki/Strongylodon_macrobotrys','Jade-vine plant reference']}[current.name]||((gardenReferences[current.name]||composedGardenReferences[current.name])?[(gardenReferences[current.name]||composedGardenReferences[current.name]).url,(gardenReferences[current.name]||composedGardenReferences[current.name]).title]:null);if(inspiration){const link=document.createElement('a');link.href=inspiration[0];link.textContent=' '+inspiration[1];link.target='_blank';link.rel='noopener';note.append(link);}}
  $('status').textContent=current.name+' — '+(filtered.findIndex(p=>p.id===id)+1)+' of '+filtered.length+' matching places';
  const url=new URL(location.href);url.searchParams.set('place',id);url.searchParams.set('view',view);history.replaceState(null,'',url);
  for(const button of $('destinations').children)button.setAttribute('aria-pressed',String(button.dataset.place===id));
  host.dataset.destination=id;host.dataset.ready='true';
 }catch(error){$('status').textContent='This destination could not be loaded. Please choose another place.';console.error(error);}
}
function filter(){
 const query=$('search').value.trim().toLocaleLowerCase(),type=$('type').value;
 filtered=all.filter(p=>(type==='all'||p.type===type)&&p.name.toLocaleLowerCase().includes(query));
 $('place').replaceChildren();$('destinations').replaceChildren();$('count').textContent=filtered.length+' of '+all.length+' destinations';$('empty').hidden=!!filtered.length;
 for(const p of filtered){
  const option=document.createElement('option');option.value=p.id;option.textContent=p.name+(p.type==='state'?' — U.S. state':'');$('place').append(option);
  const button=document.createElement('button');button.type='button';button.dataset.place=p.id;button.textContent=option.textContent;button.setAttribute('aria-pressed',String(p.id===current?.id));button.onclick=()=>choose(p.id);$('destinations').append(button);
 }
 for(const id of ['previous','next','place'])$(id).disabled=!filtered.length;
 if(filtered.length)choose(filtered.some(p=>p.id===current?.id)?current.id:filtered[0].id);else $('status').textContent='No matching places. Clear the search to see all destinations.';
}
$('search').oninput=filter;$('type').onchange=filter;$('place').onchange=()=>choose($('place').value);
for(const [id,step] of [['previous',-1],['next',1]])$(id).onclick=()=>{const index=Math.max(0,filtered.findIndex(p=>p.id===current?.id));choose(filtered[(index+step+filtered.length)%filtered.length].id);};
for(const id of viewIds)$(id).onclick=()=>{view=id;fit();syncTowerPreview();for(const v of viewIds)$(v).setAttribute('aria-pressed',String(v===view));const url=new URL(location.href);url.searchParams.set('view',view);history.replaceState(null,'',url);};
$('race-car').onchange=()=>{view='racers';choose(current.id);};
$('rotate').onclick=()=>{turn=!turn;$('rotate').setAttribute('aria-pressed',String(turn));};
for(const id of ['country:Mexico','state:Arizona','country:Vietnam','country:Senegal','country:Japan','state:Wisconsin']){
 const button=document.createElement('button');button.type='button';button.textContent=catalog[id].name;button.onclick=()=>{$('search').value='';$('type').value='all';filter();choose(id);};document.querySelector('.quick').append(button);
}
const fingers=new Map();let pinch=0;
host.addEventListener('pointerdown',e=>{fingers.set(e.pointerId,{x:e.clientX,y:e.clientY});host.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY};if(fingers.size===2){const a=[...fingers.values()];pinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);}});
host.addEventListener('pointermove',e=>{if(!fingers.has(e.pointerId))return;fingers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(fingers.size===2){const a=[...fingers.values()],next=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinch>0&&next>0)distance=clamp(distance*pinch/next,8,125);pinch=next;}else if(drag){angle-=(e.clientX-drag.x)*.008;drag={x:e.clientX,y:e.clientY};}});
for(const event of ['pointerup','pointercancel','lostpointercapture'])host.addEventListener(event,e=>{fingers.delete(e.pointerId);drag=null;pinch=0;});
host.addEventListener('wheel',e=>{e.preventDefault();distance=clamp(distance*Math.exp(e.deltaY*.001),8,125);},{passive:false});
function render(now){
 if(turn&&!document.hidden)angle+=Math.min(.05,(now-previousTime)/1000)*.12;previousTime=now;
 if(world&&current&&!document.hidden){
  const spawn=current.spawns[0];let cx=center.x,cy=1,cz=center.z,ex=cx+Math.sin(angle)*distance,ez=cz+Math.cos(angle)*distance,ey=distance*.48;
  if(view==='overhead'){ey=distance*1.05;ex=cx+Math.sin(angle)*distance*.08;ez=cz+Math.cos(angle)*distance*.08;}
  if(view==='ground'){ex=spawn.x;ez=spawn.z;ey=1.6;cx=ex-Math.sin(angle)*18;cz=ez-Math.cos(angle)*18;cy=1.6;}
  if(view==='racers'&&world.region.parks){const car=world.region.parks.trains[1+Number($('race-car').value||0)].cars[0],p=car.getWorldPosition(new THREE.Vector3()),q=car.getWorldQuaternion(new THREE.Quaternion()),target=new THREE.Vector3(0,.6,0).applyQuaternion(q).add(p),offset=new THREE.Vector3(Math.sin(angle)*distance,distance*.40,Math.cos(angle)*distance).applyQuaternion(q).add(target);cx=target.x;cy=target.y;cz=target.z;ex=offset.x;ey=offset.y;ez=offset.z;}
  const parks=world.region.parks;
  if(ridingTower&&parks.towerTrack.elapsed*1000>=globalThis.PaintfallTowerRide.CYCLE_MS)stopTowerRide();
  if(ridingTower){
   const seat=parks.riderPose(0);
   rideEye.set(0,1.25,0).applyQuaternion(seat.quaternion).add(seat.position);
   rideTarget.set(0,1.25,10).applyQuaternion(seat.quaternion).add(seat.position);
   world.camera.up.set(0,1,0).applyQuaternion(seat.quaternion);
   ({x:ex,y:ey,z:ez}=rideEye);
   ({x:cx,y:cy,z:cz}=rideTarget);
  }
  if(magnetPreview)magnetPreview.update(parks.towerTrack.elapsed);
  world.setCameraPose({ex,ey,ez,cx,cy,cz,aspect:host.clientWidth/host.clientHeight,fov:Math.PI*.32,near:.1,far:320,mode:'review'});world.render();
 }requestAnimationFrame(render);
}
try{world=createWorld(host);const initial=new URL(location.href).searchParams.get('place');current=catalog[initial]||catalog['country:Mexico'];filter();requestAnimationFrame(render);}catch(error){$('status').textContent='The 3D tour could not start. Try a browser with WebGL enabled.';console.error(error);}
window.addEventListener('pagehide',()=>{removeMagnetPreview();world?.dispose();},{once:true});

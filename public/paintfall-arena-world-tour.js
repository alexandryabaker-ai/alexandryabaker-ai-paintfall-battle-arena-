import {createWorld,THREE} from './paintfall-contest-3d-world.js';
const $=id=>document.getElementById(id),host=$('view');
const catalog=window.PaintfallArenaCatalog,all=Object.values(catalog).sort((a,b)=>a.name.localeCompare(b.name)||a.type.localeCompare(b.type));
let world,current=null,filtered=all,view=['garden','flowers'].includes(new URL(location.href).searchParams.get('view'))?new URL(location.href).searchParams.get('view'):'overview',angle=.7,distance=68,center=new THREE.Vector3(0,1,0),turn=false,previousTime=0,drag=null;
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
let colorRequested=new URL(location.href).searchParams.get('look')!=='original';
function syncColors(){
 $('color-comparison').hidden=current?.id!=='country:Cambodia';const enabled=world?.setColorLook(colorRequested)||false;
 host.dataset.colorLook=enabled?'pop':'original';$('look-original').setAttribute('aria-pressed',String(!enabled));$('look-pop').setAttribute('aria-pressed',String(enabled));
 $('look-note').textContent=enabled?'Approved richer flowers with the outdoor surface textures — also used in the local game.':'Original flower colors for comparison, with the same outdoor surface textures.';
}
for(const [id,enabled]of [['look-original',false],['look-pop',true]])$(id).onclick=()=>{colorRequested=enabled;syncColors();const url=new URL(location.href);url.searchParams.set('look',enabled?'pop':'original');history.replaceState(null,'',url);};
function kind(p){return p.type==='state'?'U.S. state':'Country / territory';}
function fit(){
 const bounds=new THREE.Box3();if(['garden','flowers'].includes(view)&&world.region.garden){const focus=view==='flowers'?world.region.garden.paintFlowers.group:world.region.garden.group;focus.updateWorldMatrix(true,true);bounds.expandByObject(focus);}else for(const child of world.region.group.children)if(!['Level regional arena terrain','Arena movement boundary'].includes(child.name))bounds.expandByObject(child);
 if(bounds.isEmpty())center.set(0,1,0);else bounds.getCenter(center);
 center.y=1;const size=bounds.isEmpty()?new THREE.Vector3(40,10,40):bounds.getSize(new THREE.Vector3());
 distance=clamp(Math.max(size.x,size.z)*.95,view==='flowers'?7:view==='garden'?22:36,105);angle=['garden','flowers'].includes(view)?Math.PI+.2:.7;
}
function choose(id){
 if(!world||!catalog[id])return;
 try{
  world.setRegion(id);current=catalog[id];if(['garden','flowers'].includes(view)&&!world.region.garden)view='overview';fit();syncColors();
  $('garden').disabled=$('flowers').disabled=!world.region.garden;for(const v of ['overview','ground','overhead','garden','flowers'])$(v).setAttribute('aria-pressed',String(v===view));
  $('place').value=id;$('place-title').textContent=current.name+' · '+kind(current);
  $('stats').textContent=(current.homes||0)+' homes · '+(current.animals||0)+' animals in the current arena catalog';
  $('garden-note').replaceChildren();if(world.region.garden){const note=$('garden-note');note.append(document.createTextNode(world.region.garden.theme+' · PAINTFALL paint flowers · 2 benches · Garden Park coming soon. '+(world.region.garden.identityStatus==='regional-design-pending'?'Local garden identity is still to be designed together.':'')));const inspiration={Vietnam:['https://vietnamtourism.vn/en/index.php/news/items/2334','Huế garden inspiration'],Laos:['https://www.pha-tad-ke.com/visit/the-gardens-2/','Lao botanical-garden inspiration'],Cambodia:['https://tourismcambodia.org/public/attractions/royal-garden-1551335490','Cambodian garden inspiration'],Thailand:['https://en.wikipedia.org/wiki/Cassia_fistula','Golden-shower plant reference'],Myanmar:['https://en.wikipedia.org/wiki/National_Kandawgyi_Botanical_Gardens','Upland botanical-garden reference'],Malaysia:['https://www.frim.gov.my/attractions/nature-activities/kepong-botanic-gardens/','Malaysian botanical-garden reference'],Indonesia:['https://kebunraya.id/r/bogor','Bogor botanical-garden reference'],Philippines:['https://en.wikipedia.org/wiki/Strongylodon_macrobotrys','Jade-vine plant reference']}[current.name];if(inspiration){const link=document.createElement('a');link.href=inspiration[0];link.textContent=' '+inspiration[1];link.target='_blank';link.rel='noopener';note.append(link);}}
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
for(const id of ['overview','ground','overhead','garden','flowers'])$(id).onclick=()=>{view=id;fit();for(const v of ['overview','ground','overhead','garden','flowers'])$(v).setAttribute('aria-pressed',String(v===view));const url=new URL(location.href);url.searchParams.set('view',view);history.replaceState(null,'',url);};
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
  world.setCameraPose({ex,ey,ez,cx,cy,cz,aspect:host.clientWidth/host.clientHeight,fov:Math.PI*.32,near:.1,far:320,mode:'review'});world.render();
 }requestAnimationFrame(render);
}
try{world=createWorld(host);const initial=new URL(location.href).searchParams.get('place');current=catalog[initial]||catalog['country:Mexico'];filter();requestAnimationFrame(render);}catch(error){$('status').textContent='The 3D tour could not start. Try a browser with WebGL enabled.';console.error(error);}
window.addEventListener('pagehide',()=>world?.dispose(),{once:true});

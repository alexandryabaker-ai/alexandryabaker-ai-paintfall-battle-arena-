import './paintfall-animal-memory.js';

// Narrative encounters are private to the player; NPC movement remains scenery.
export function createArenaAnimalMemories(T,{world,host,isActive}){
 const rules=globalThis.PaintfallAnimalMemory;
 const panel=document.createElement('section');panel.className='card';panel.id='pf-animal-memories';panel.hidden=true;
 const title=document.createElement('h3');title.textContent='Animal friends';
 const nearby=document.createElement('p'),response=document.createElement('p'),saved=document.createElement('small');
 response.setAttribute('role','status');saved.setAttribute('role','status');
 response.textContent='Come closer and say hello. Animals can remember your encounters.';
 const row=document.createElement('div');row.className='row';
 const reticle=document.createElement('span');reticle.textContent='+';reticle.setAttribute('aria-hidden','true');
 reticle.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:white;text-shadow:0 1px 3px black;font-size:24px;pointer-events:none;z-index:3';host.append(reticle);
 const offer=document.createElement('div'),invite=document.createElement('p'),yes=document.createElement('button'),no=document.createElement('button'),dismount=document.createElement('button');
 offer.hidden=true;invite.textContent='Fancy some bull riding? A short, gentle bounce—only if you want to.';yes.type=no.type=dismount.type='button';yes.textContent='Yes, let’s ride';no.textContent='No thanks';dismount.textContent='Hop off';dismount.hidden=true;offer.append(invite,yes,no);row.append(dismount);
 panel.append(title,nearby,row,response,saved,offer);host.after(panel);
 const buttons=[];let current=null,region=null,busy=false,lastAction=0,point=null,disposed=false,lastMemory=null,memoryId=null;
 const declined=new Set();
 const guests=new Map(),ray=new T.Raycaster(),center=new T.Vector2();
 function available(a){let node=a.root;while(node){if(!node.visible)return false;node=node.parent;}return true;}
 function entries(){const counts=new Map();return (region?.wildlife?.animals||[]).map(a=>{
  const n=counts.get(a.kind)||0;counts.set(a.kind,n+1);
  return {a,id:rules.key(region.destination.id,a.kind,n)};
 });}
 function distance(entry){return point?Math.hypot(entry.a.root.position.x-point.x,entry.a.root.position.z-point.z):Infinity;}
 function refresh(){for(const b of buttons)b.disabled=busy||!current||!isActive()||distance(current)>8;offer.hidden=busy||!current||!isActive()||distance(current)>8||memoryId!==current.id||!rules.isBull(current.a.kind)||!(lastMemory?.paintHits||lastMemory?.jokes)||lastMemory.prefersWalking||declined.has(current.id)||!!window.PAINTFALL_LAST_PLAYER_STATE?.bullRide;}
 const rideSend=accept=>{const socket=window.paintfallSocket;if(socket?.readyState!==1)return;socket.send(JSON.stringify({type:'bull-ride',animalId:current?.id,accept}));yes.disabled=true;};
 yes.onclick=()=>{if(offer.hidden||yes.disabled)return;rideSend(true);};no.onclick=()=>{if(current)declined.add(current.id);offer.hidden=true;response.textContent='No ride? No problem. We can trade jokes with both feet on the ground.';};dismount.onclick=()=>rideSend(false);
 function rideResult(e){yes.disabled=false;response.textContent=e.detail.message;refresh();}
 window.addEventListener('paintfall-animal-ride-result',rideResult);
 async function request(action,entry=current){
  if(disposed||busy||!entry||!isActive()||!available(entry.a)||distance(entry)>(action==='paint-hit'?40:8))return false;
  if(performance.now()-lastAction<700)return false;
  busy=true;lastAction=performance.now();refresh();const selectedRegion=region;
  response.textContent='Listening…';saved.textContent='';
  try{
   const profileResponse=await fetch('/api/account',{credentials:'same-origin',cache:'no-store'});
   if(!profileResponse.ok)throw Error('Could not check your saved profile. Please try again.');
   const profile=await profileResponse.json();let result;
   if(profile.account){
    const res=await fetch('/api/account/animal',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({accountId:profile.account.id,animalId:entry.id,action})});
    result=await res.json();if(!res.ok)throw Error(result.error||'Animal memory could not be saved.');
    result.saveMessage='Animal memory saved to your account.';
   }else{
    if(!profile.serverGroup)throw Error('Sign in or choose Play as guest to meet the animals.');
    const memory=rules.remember(guests.get(entry.id),action,Date.now());guests.set(entry.id,memory);
    result={memory,dialogue:rules.dialogue(entry.a.kind,action,memory),saveMessage:'Guest memory lasts for this page only. Sign in to keep future encounters.'};
   }
   if(!disposed&&typeof window.dispatchEvent==='function')window.dispatchEvent(new CustomEvent('paintfall-animal-encounter',{detail:{guest:!profile.account,animalId:entry.id,memory:result.memory}}));
   if(region===selectedRegion&&!disposed){response.textContent=entry.a.kind+': “'+result.dialogue+'”';saved.textContent=result.saveMessage;lastMemory=result.memory;memoryId=entry.id;window.dispatchEvent(new CustomEvent('paintfall-arena-dialogue',{detail:{speaker:entry.a.kind,text:result.dialogue}}));}
   return true;
  }catch(e){if(region===selectedRegion&&!disposed){response.textContent=e.message;saved.textContent='This encounter was not saved. Try the action again.';}return false;}
  finally{busy=false;refresh();}
 }
 for(const [action,label]of [['talk','Say hello'],['joke','Tell me a joke'],['apologize','Say sorry'],['space','Give space'],['prefer-walking','I prefer walking']]){
  const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.animalAction=action;
  b.onclick=()=>{const entry=current;if(action==='space'&&entry)entry.a.spaceUntil=(region?.interactionTime||entry.a.phase||0)+10;request(action,entry);};
  row.append(b);buttons.push(b);
 }
 function update(player){
  point=player;const next=world.region;
  if(next!==region){region=next;current=null;response.textContent='Come closer and say hello. Animals can remember your encounters.';saved.textContent='';}
  const animals=entries().filter(e=>available(e.a));
  const riding=!!window.PAINTFALL_LAST_PLAYER_STATE?.bullRide;panel.hidden=!isActive()||(!animals.length&&!riding);dismount.hidden=!riding;
  reticle.hidden=!isActive();
  const closest=animals.sort((a,b)=>distance(a)-distance(b))[0];current=closest&&distance(closest)<=8?closest:null;
  nearby.textContent=current?'Nearby: '+current.a.kind+' • '+distance(current).toFixed(1)+' steps away':'Approach an animal within eight steps to talk. Aim at an animal and use Fire for harmless paint play.';
  refresh();
 }
 function tryPaintShot(){
  if(!isActive()||disposed||!region)return false;
  ray.setFromCamera(center,world.camera);ray.far=40;
  const localId=window.paintfallLocalPlayerId||window.PAINTFALL_ROOM_PLAYER_ID;
  const self=world.players.actors.get(localId),animals=entries();
  for(const hit of ray.intersectObjects(world.scene.children,true)){
   let node=hit.object,visible=true,isSelf=false;
   while(node){if(!node.visible)visible=false;if(node===self)isSelf=true;node=node.parent;}
   if(!visible||isSelf||!hit.object.isMesh)continue;
   const animal=animals.find(e=>{let o=hit.object;while(o){if(o===e.a.root)return true;o=o.parent;}return false;});
   if(animal){request('paint-hit',animal);return true;}
   // Solid scenery and other players block the shot; never shoot through a wall.
   return false;
  }
  return false;
 }
 return {update,request,tryPaintShot,dispose(){disposed=true;window.removeEventListener('paintfall-animal-ride-result',rideResult);panel.remove();reticle.remove();guests.clear();}};
}

// The atlas chooses an actual server-authoritative arena destination for the
// local player. Other room members choose independently; selecting the same
// destination puts friends in the same regional scene.
(()=>{
 function init(){
  if(document.getElementById('pf-arena-drop'))return;
  const catalog=window.PaintfallArenaCatalog||{},dialog=document.createElement('dialog');dialog.id='pf-arena-drop';dialog.setAttribute('aria-labelledby','pf-drop-title');
  dialog.innerHTML='<header><div><small>PAINTFALL / ARENA WORLD MAP</small><h2 id="pf-drop-title">Where would you like to drop?</h2></div><button id="pf-drop-close" type="button">Back to arena</button></header><p>Choose your own destination. To meet friends, choose the same country, territory or U.S. state.</p><div class="pf-drop-layout"><iframe id="pf-drop-atlas" title="Arena world map" referrerpolicy="same-origin"></iframe><section><label for="pf-drop-region">Country, territory or U.S. state</label><select id="pf-drop-region"></select><label for="pf-drop-point">Safe drop point</label><select id="pf-drop-point"></select><div id="pf-drop-preview" aria-label="Overhead preview of safe drop points"></div><p id="pf-drop-friends"></p><button id="pf-drop-confirm" type="button">Drop here</button><p id="pf-drop-status" role="status" aria-live="polite"></p></section></div>';
  document.body.append(dialog);
  const $=id=>document.getElementById(id),select=$('pf-drop-region'),points=$('pf-drop-point'),frame=$('pf-drop-atlas'),confirm=$('pf-drop-confirm'),status=$('pf-drop-status');
  for(const r of Object.values(catalog).sort((a,b)=>a.name.localeCompare(b.name))){const o=document.createElement('option');o.value=r.id;o.textContent=r.name+(r.type==='state'?' — U.S. state':'');select.append(o);}
  let state={},socket=null,room=null,promptedRoom=null,pending=false,returnFocus=null;
  const own=()=>state.players?.find(p=>p.id===(state.id||window.paintfallLocalPlayerId||window.PAINTFALL_ROOM_PLAYER_ID));
  function draw(){
   const r=catalog[select.value];if(!r)return;
   const chosen=Number(points.value)||0;points.replaceChildren();r.spawns.forEach((p,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent='Drop point '+(i+1);points.append(o);});points.value=String(Math.min(chosen,r.spawns.length-1));
   const range=Math.max(8,...r.spawns.flatMap(p=>[Math.abs(p.x),Math.abs(p.z)]))+2,svg=['<svg viewBox="0 0 240 240" role="img" aria-label="Safe entry points, local overhead view"><rect x="1" y="1" width="238" height="238" rx="14" fill="#183b3f" stroke="#659d91"/>'];
   r.spawns.forEach((p,i)=>{const x=120+p.x/range*100,y=120+p.z/range*100;svg.push(`<circle cx="${x}" cy="${y}" r="${i===Number(points.value)?8:5}" fill="${i===Number(points.value)?'#ffd65b':'#9adaca'}"/><text x="${x+7}" y="${y-6}" fill="white" font-size="9">${i+1}</text>`);});svg.push('</svg>');$('pf-drop-preview').innerHTML=svg.join('');
   const friends=(state.players||[]).filter(p=>p.id!==own()?.id&&p.arenaRegion===r.id);$('pf-drop-friends').textContent=friends.length?friends.map(p=>p.name||'Player').join(', ')+' '+(friends.length===1?'is':'are')+' here.':'Choose the same destination as friends to meet here.';
   confirm.disabled=pending||!own()||own().canChooseDrop===false;
   confirm.textContent=state.started?'Travel here':'Drop here';
   $('pf-drop-title').textContent=state.started?'Where would you like to travel?':'Where would you like to drop?';
   if(!pending)status.textContent=own()?.canChooseDrop===false?'Travel is unavailable right now.':'You can choose another destination during this match. You will stay in this room, keeping your paint and progress. Any current ride ends when you travel.';
  }
  function mapUrl(){const r=catalog[select.value],u=new URL('/world-build.html',location.origin);u.searchParams.set('play','drop');if(r){u.searchParams.set(r.type==='state'?'state':'country',r.name);if(r.type==='state')u.searchParams.set('focus','us');}return u.href;}
  function open(){
   if(window.PAINTFALL_ACCOUNT_LOCKED||!room||dialog.open)return;
   returnFocus=document.activeElement;select.value=own()?.arenaRegion||(catalog[window.PAINTFALL_PREFERRED_SPAWN]?window.PAINTFALL_PREFERRED_SPAWN:state.rules?.arenaRegion||'country:Mexico');points.value=String(own()?.dropPoint||0);draw();frame.src=mapUrl();window.PAINTFALL_DROP_CHOOSING=true;window.dispatchEvent(new Event('blur'));dialog.showModal();select.focus();
  }
  function close(){if(dialog.open)dialog.close();}
  dialog.addEventListener('close',()=>{window.PAINTFALL_DROP_CHOOSING=false;frame.removeAttribute('src');pending=false;window.dispatchEvent(new Event('blur'));returnFocus?.focus();});
  $('pf-drop-close').onclick=close;
  select.onchange=()=>{points.value='0';draw();frame.src=mapUrl();};points.onchange=draw;
  confirm.onclick=()=>{if(confirm.disabled||socket?.readyState!==1){status.textContent='Connect to your room before choosing a drop.';return;}pending=true;confirm.disabled=true;status.textContent='Preparing your drop…';socket.send(JSON.stringify({type:'chooseDrop',region:select.value,spawn:Number(points.value)}));};
  window.addEventListener('message',e=>{if(!dialog.open||e.origin!==location.origin||e.source!==frame.contentWindow||e.data?.type!=='paintfall-world-place')return;const {name,mode}=e.data;if(typeof name!=='string'||!['country','state'].includes(mode))return;const r=Object.values(catalog).find(r=>r.name===name&&r.type===mode);if(!r)return;select.value=r.id;points.value='0';draw();});
  window.addEventListener('paintfall-party-state',e=>{state=e.detail||{};socket=state.socket||window.paintfallSocket;room=state.code||window.PAINTFALL_ROOM_CODE;draw();});
  window.addEventListener('paintfall-party-joined',e=>{room=e.detail?.code;socket=e.detail?.socket||window.paintfallSocket;const entry=room+':'+e.detail?.id;if(entry!==promptedRoom){promptedRoom=entry;open();}});
  window.addEventListener('paintfall-drop-result',e=>{pending=false;if(e.detail?.type==='drop-confirmed'){window.PAINTFALL_PREFERRED_SPAWN=e.detail.region;close();}else{draw();status.textContent=e.detail?.message||'Your drop could not be prepared. Please try again.';}});
  const button=document.createElement('button');button.type='button';button.id='pf-arena-map-button';button.textContent='🌍 WORLD MAP / TRAVEL';button.onclick=open;
  function attach(){const host=$('paintfallContest3D');if(host&&!button.isConnected)host.append(button);}
  new MutationObserver(attach).observe(document.body,{childList:true,subtree:true});attach();
  const style=document.createElement('style');style.textContent=`#pf-arena-map-button{position:absolute;z-index:5;left:12px;top:42px;padding:9px 11px;border:1px solid #b6e3dc;border-radius:11px;background:#143841ed;color:#fff;font:800 11px system-ui;cursor:pointer}#pf-arena-drop{box-sizing:border-box;width:min(1200px,96vw);max-width:96vw;max-height:94dvh;padding:20px;border:1px solid #75baad;border-radius:20px;background:#101f2d;color:#effaf6}#pf-arena-drop::backdrop{background:#081019e8}#pf-arena-drop header{display:flex;justify-content:space-between;gap:16px;align-items:center}#pf-arena-drop h2{margin:4px 0;font-size:26px}#pf-arena-drop small,#pf-arena-drop p{color:#b9d3cd}#pf-arena-drop button,#pf-arena-drop select{min-height:44px;padding:10px;border:1px solid #86bcb2;border-radius:10px;color:#fff;background:#244950}#pf-arena-drop select{display:block;width:100%;margin:6px 0 18px}#pf-arena-drop label{display:block;font-weight:700}.pf-drop-layout{display:grid;grid-template-columns:2fr 1fr;gap:18px}#pf-drop-atlas{width:100%;height:58dvh;min-height:350px;border:1px solid #506e76;border-radius:12px;background:#112736}#pf-drop-preview svg{display:block;width:180px;max-width:100%;margin:auto}#pf-drop-confirm{width:100%;background:#547944!important;font-weight:800}#pf-arena-drop button:disabled{opacity:.5;cursor:default}#pf-arena-drop :focus-visible{outline:3px solid #ffd65b;outline-offset:3px}@media(max-width:700px){.pf-drop-layout{grid-template-columns:1fr}#pf-drop-atlas{height:35dvh;min-height:240px}#pf-arena-drop{padding:14px}#pf-drop-preview svg{width:130px}}`;document.head.append(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

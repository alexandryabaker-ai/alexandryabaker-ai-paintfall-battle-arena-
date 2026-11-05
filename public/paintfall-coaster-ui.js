import './paintfall-tower-ride.js';
export function createCoasterUI({host,getState,isActive}){
 const route=globalThis.PaintfallTowerRide,panel=document.createElement('div'),text=document.createElement('div'),button=document.createElement('button');panel.id='pf-coaster-boarding';panel.style.cssText='position:absolute;left:10px;bottom:10px;z-index:6;max-width:calc(100% - 20px);padding:10px;background:#152338ee;color:white;border:2px solid #ffd16c;border-radius:12px;font:700 13px system-ui';text.setAttribute('role','status');button.type='button';button.id='pf-coaster-board';button.style.cssText='margin-top:6px;min-height:44px;background:#7047ff;color:white;border:0;border-radius:8px;padding:8px 14px;touch-action:manipulation';panel.append(text,button);host.append(panel);let message='',until=0,lastRide=false;
 button.onclick=()=>{const s=getState(),p=s.players?.find(p=>p.id===s.id),socket=window.paintfallSocket;if(socket?.readyState===1){socket.send(JSON.stringify({type:'coaster-ride',action:p?.coasterRide?'leave':'board'}));window.dispatchEvent(new Event('blur'));message='Waiting for the room…';until=performance.now()+2500;}};
 function result(e){if(e.detail?.type==='coaster-ride-result'){message=e.detail.message;until=performance.now()+4500;}}
 window.addEventListener('paintfall-family-message',result);
 function update(now){
  const s=getState(),p=s.players?.find(p=>p.id===s.id),riding=!!p?.coasterRide;
  if(riding!==lastRide){lastRide=riding;window.dispatchEvent(new Event('blur'));}
  const world=p?window.PaintfallMovement.toWorld(p):null,distance=world?Math.hypot(world.x-route.PLATFORM.x,world.z-route.PLATFORM.z):Infinity,near=p?.arenaRegion==='state:Nevada'&&distance<7;
  panel.hidden=!isActive()||(!near&&!riding);if(panel.hidden)return;
  const phase=route.phase(s.parkElapsedMs||0),label=riding?'Return to platform':'Board Towers Coaster';
  if(button.textContent!==label)button.textContent=label;
  button.disabled=!riding&&(!phase.boarding||distance>4||!!p.ability||!!p.splashLanding);
  const next=now<until?message:riding?(phase.waiting?'Seated • departing in '+Math.ceil(phase.remaining/1000)+'s':'PAINTFALL Towers Coaster • enjoy the ride!'):distance>4?'Walk closer to the marked boarding platform.':p.ability?'Finish Overload before boarding.':phase.boarding?'Towers Coaster • boarding closes in '+Math.ceil((phase.remaining-1000)/1000)+'s':'Next train boarding in '+Math.ceil((route.CYCLE_MS-((s.parkElapsedMs||0)%route.CYCLE_MS))/1000)+'s';
  if(text.textContent!==next)text.textContent=next;
 }
 return {update,dispose(){window.removeEventListener('paintfall-family-message',result);panel.remove();}};
}

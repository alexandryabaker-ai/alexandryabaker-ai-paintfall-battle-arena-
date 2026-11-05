(()=>{
 function init(){
  const actions=document.querySelector('#game .matchActions');if(!actions||document.getElementById('splashLandingButton'))return;
  const button=document.createElement('button');button.id='splashLandingButton';button.type='button';button.textContent='Splash Landing (L)';button.onclick=()=>window.splashLanding?.();actions.append(button);
  const note=document.createElement('p');note.className='stat';note.id='splashLandingStatus';note.textContent='Safe descent: L, or press Jump again while airborne.';actions.after(note);
  let player=null;
  function refresh(){const active=document.getElementById('game')?.classList.contains('started'),airborne=player?.alive&&player.grounded===false&&player.z>0;
   button.hidden=window.isMobileDevice?.()||false;button.disabled=!active||!airborne||player?.splashLanding?.phase==='descending';note.hidden=!active||!player;
   const jump=document.getElementById('mobileJump');if(jump)jump.textContent=airborne?'LAND':'JUMP';
   note.textContent=player?.splashLanding?.phase==='descending'?'Splash Landing • descending safely':player?.splashLanding?.phase==='splash'?'Splash Landing • touchdown!':'Safe descent: L, or press Jump again while airborne.';
  }
  window.addEventListener('paintfall-3d-state',event=>{const id=window.paintfallLocalPlayerId||window.PAINTFALL_ROOM_PLAYER_ID;if(Array.isArray(event.detail?.players)){player=event.detail.players.find(p=>p.id===id)||null;refresh();}});setInterval(refresh,250);refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

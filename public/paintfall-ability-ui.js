(()=>{
 function init(){
  const actions=document.querySelector('#game .matchActions');if(!actions||document.getElementById('desktopAbility'))return;
  const button=document.createElement('button');button.id='desktopAbility';button.type='button';button.textContent='Ability (K)';button.onclick=()=>window.ability?.();actions.append(button);
  const status=document.createElement('p');status.id='abilityStatus';status.className='stat';status.setAttribute('role','status');actions.after(status);
  const readout=document.createElement('p');readout.id='zaraEmotionReadout';readout.className='stat';status.after(readout);
  const paintStatus=document.createElement('p');paintStatus.id='playerPaintStatus';paintStatus.className='stat';paintStatus.setAttribute('role','status');readout.after(paintStatus);
  let player=null,players=[];const clock={},paintClock={};
  function refresh(){
   const active=document.getElementById('game')?.classList.contains('started');
   const mobile=document.getElementById('mobileAbility');
   button.hidden=window.isMobileDevice?.()||false;status.hidden=!active||!player;
   const paint=window.PaintfallPlayerPaint?.sample(player?.paint,performance.now(),paintClock)||[];
   paintStatus.hidden=!active||!player;paintStatus.textContent=paint.length?'🎨 Paint on you: '+paint.length+' splashes • each starts fading after 15 seconds':'🎨 Paintball hits add color • keep playing';
   const maya=player?.character==='Maya',zara=player?.character==='Zara',jax=player?.character==='Jax',nova=player?.character==='Nova',core=window.PaintfallCoreAbilities?.forCharacter(player?.character),supported=maya||zara||jax||nova||!!core,ready=supported&&player.abilityReady===true;
   readout.hidden=true;readout.textContent='';
   button.disabled=!active||!ready;
   if(mobile){mobile.disabled=!active||!ready;mobile.classList.toggle('hidden',!player);mobile.textContent=supported?(ready?'ABILITY':player.ability?'ACTIVE':(player.abilityCooldown||0)+'s'):'SOON';}
   button.textContent=supported?(ready?'Ability (K)':player.ability?'Ability active':'Ability (K) • '+(player.abilityCooldown||0)+'s'):'Ability coming soon';
   if(!supported){status.textContent='This hero’s ability is coming soon.';return;}
   const api=core||(zara?window.PaintfallZaraAbility:jax?window.PaintfallJaxAbility:nova?window.PaintfallNovaAbility:window.PaintfallMayaAbility);
   if(!api){status.textContent='Ability loading…';return;}
   const phase=api.sample(player.ability,performance.now(),clock);
   status.textContent=phase.active?player.character+' • '+phase.label+(nova?' • Energy '+Math.round(phase.energy*100)+'%':''):ready?(core?player.character+' — '+core.name:zara?'Zara’s emotion vision':jax?'Jax’s dragon presence':nova?'Nova’s energy transformation':'Maya’s confidence transformation')+' • K or Ability': 'Ability recharging • '+(player.abilityCooldown||0)+' seconds';
   if(player?.character==='Rico'&&active&&phase.active){readout.hidden=false;readout.textContent='Ultra Hearing • '+(window.PaintfallHearingReadout||'Listening for nearby game activity');}
   if(zara&&active&&phase.active){
    const arena=document.getElementById('paintfallContest3D');if(arena&&readout.parentElement!==arena){arena.append(readout);readout.style.cssText='position:absolute;z-index:5;left:12px;bottom:12px;max-width:calc(100% - 44px);margin:0;background:rgba(27,14,48,.92);border:1px solid #ba9ce5;font-size:13px;pointer-events:none';}
    readout.hidden=false;
    const readings=players.flatMap(target=>{const emotion=api.readEmotion(player,target,phase);return emotion?[(target.name||target.character)+': '+emotion.label]:[];});
    readout.textContent='Emotion vision • '+(readings.join(' · ')||'No readable characters')+(phase.overloaded?' • Dante unreadable':'');
   }
  }
  window.addEventListener('paintfall-3d-state',event=>{
   const id=window.paintfallLocalPlayerId||window.PAINTFALL_ROOM_PLAYER_ID;
   if(Array.isArray(event.detail?.players)){players=event.detail.players;player=players.find(p=>p.id===id)||null;refresh();}
  });
  setInterval(refresh,250);refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallZaraAbility=api;})(globalThis,()=>{
 const BUILD_MS=18000,PEAK_MS=3000,RECOVERY_MS=8000,TOTAL_MS=BUILD_MS+PEAK_MS+RECOVERY_MS;
 const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
 // Fictional character states from the saved hero designs, not human emotion inference.
 const EMOTIONS={Maya:['Confidence',0xf29ac7],Zara:['Curiosity',0xc3a3ef],Nova:['Optimism',0xffda78],Skye:['Calm observation',0x7cded8],Jax:['Protectiveness',0x81baff],Rico:['Focused coordination',0xffb380],Kai:['Creative excitement',0xc8a0ff],Dante:['Patience',0xa0d6c0]};
 function phase(elapsed){
  const t=Math.max(0,elapsed),active=t<TOTAL_MS;
  const overload=t<BUILD_MS?smooth(t/BUILD_MS):t<BUILD_MS+PEAK_MS?1:active?1-smooth((t-BUILD_MS-PEAK_MS)/RECOVERY_MS):0;
  return {elapsed:t,active,overload,overloaded:active&&t>=BUILD_MS&&t<BUILD_MS+PEAK_MS,label:!active?'Normal':t<BUILD_MS?'Emotion vision building':t<BUILD_MS+PEAK_MS?'Overloaded — Dante unreadable':'Recovering'};
 }
 function activate(player,room,time){
  if(!room.started||!player.alive||!player.abilityReady||player.character!=='Zara')return false;
  player.ability={type:'zara-emotion',id:room.round+':'+time,startedAt:time};
  player.abilityReadyAt=time+Math.max(TOTAL_MS,room.rules.cooldown*1000);player.abilityReady=false;player.abilityCooldown=Math.ceil((player.abilityReadyAt-time)/1000);return true;
 }
 function tick(player,time){
  let changed=false;
  if(player.ability&&(!player.alive||time-player.ability.startedAt>=TOTAL_MS)){player.ability=null;changed=true;}
  if(player.abilityReadyAt){const seconds=Math.max(0,Math.ceil((player.abilityReadyAt-time)/1000));if(seconds!==player.abilityCooldown){player.abilityCooldown=seconds;changed=true;}if(!seconds){player.abilityReadyAt=0;player.abilityReady=true;changed=true;}}
  return changed;
 }
 function snapshot(player,time){return player.alive&&player.ability?.type==='zara-emotion'?{type:'zara-emotion',id:player.ability.id,elapsedMs:Math.max(0,time-player.ability.startedAt),sampleAt:time}:null;}
 function sample(wire,now,clock){
  if(!wire||wire.type!=='zara-emotion'){clock.id=null;return {...phase(TOTAL_MS),elapsed:0};}
  if(clock.id!==wire.id||clock.sampleAt!==wire.sampleAt){clock.id=wire.id;clock.sampleAt=wire.sampleAt;clock.anchor=now-wire.elapsedMs;}
  return phase(now-clock.anchor);
 }
 function readEmotion(viewer,target,state){
  if(viewer?.character!=='Zara'||viewer.alive===false||!state?.active||!target?.alive||viewer.id===target.id||viewer.arenaRegion!==target.arenaRegion||target.character==='Dante'&&state.overloaded)return null;
  const saved=EMOTIONS[target.character];if(!saved)return null;
  let label=saved[0];
  if(target.character==='Maya'&&target.ability?.type==='maya-confidence')label='Confidence rising';
  if(target.character==='Zara'&&target.ability?.type==='zara-emotion'&&phase(target.ability.elapsedMs).overloaded)label='Overwhelmed';
  if(typeof target.emotion?.label==='string'&&target.emotion.label.length<=40&&Number.isInteger(target.emotion.color))return {label:target.emotion.label,color:target.emotion.color};
  return {label,color:saved[1]};
 }
 function apply(actor,wire,now){
  const eyes=actor.userData.parts.zaraEyes;if(!eyes)return;
  const state=sample(wire,now,actor.userData.zaraAbilityClock??={});
  for(const eye of eyes){
   const normal=eye.userData.normalColor??=eye.material.color.clone();
   const purple=eye.userData.overloadColor??=normal.clone().setHex(0x8516cf);
   eye.material.color.copy(normal).lerp(purple,state.overload);
   eye.material.emissive.copy(purple);eye.material.emissiveIntensity=state.overload*.28;
  }
  actor.userData.zaraOverload=state.overload;
 }
 return {BUILD_MS,PEAK_MS,RECOVERY_MS,TOTAL_MS,EMOTIONS,phase,activate,tick,snapshot,sample,readEmotion,apply};
});

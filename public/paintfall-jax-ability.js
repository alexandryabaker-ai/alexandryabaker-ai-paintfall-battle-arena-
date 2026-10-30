(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallJaxAbility=api;})(globalThis,()=>{
 const BUILD_MS=12000,PEAK_MS=8000,RECOVERY_MS=8000,TOTAL_MS=BUILD_MS+PEAK_MS+RECOVERY_MS;
 const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
 function phase(elapsed){
  const t=Math.max(0,elapsed),active=t<TOTAL_MS;
  const strength=t<BUILD_MS?smooth(t/BUILD_MS):t<BUILD_MS+PEAK_MS?1:active?1-smooth((t-BUILD_MS-PEAK_MS)/RECOVERY_MS):0;
  const dragon=t<BUILD_MS?0:t<BUILD_MS+PEAK_MS?smooth((t-BUILD_MS)/1600):active?1-smooth((t-BUILD_MS-PEAK_MS)/RECOVERY_MS):0;
  return {elapsed:t,active,strength,dragon,fire:dragon*smooth((t-BUILD_MS-1200)/1600),label:!active?'Normal':t<BUILD_MS?'Leadership presence building':t<BUILD_MS+PEAK_MS?'Ryujin — attention beacon':'Returning to normal'};
 }
 function activate(player,room,time){
  if(!room.started||!player.alive||!player.abilityReady||player.character!=='Jax')return false;
  player.ability={type:'jax-dragon',id:room.round+':'+time,startedAt:time};
  player.abilityReadyAt=time+Math.max(TOTAL_MS,room.rules.cooldown*1000);player.abilityReady=false;player.abilityCooldown=Math.ceil((player.abilityReadyAt-time)/1000);return true;
 }
 function tick(player,time){
  let changed=false;
  if(player.ability&&(!player.alive||time-player.ability.startedAt>=TOTAL_MS)){player.ability=null;changed=true;}
  if(player.abilityReadyAt){const seconds=Math.max(0,Math.ceil((player.abilityReadyAt-time)/1000));if(seconds!==player.abilityCooldown){player.abilityCooldown=seconds;changed=true;}if(!seconds){player.abilityReadyAt=0;player.abilityReady=true;changed=true;}}
  return changed;
 }
 function snapshot(player,time){return player.alive&&player.ability?.type==='jax-dragon'?{type:'jax-dragon',id:player.ability.id,elapsedMs:Math.max(0,time-player.ability.startedAt),sampleAt:time}:null;}
 function sample(wire,now,clock){
  if(!wire||wire.type!=='jax-dragon'){clock.id=null;return {...phase(TOTAL_MS),elapsed:0};}
  if(clock.id!==wire.id||clock.sampleAt!==wire.sampleAt){clock.id=wire.id;clock.sampleAt=wire.sampleAt;clock.anchor=now-wire.elapsedMs;}
  return phase(now-clock.anchor);
 }
 function apply(actor,wire,moving,now){
  const parts=actor.userData.parts,effects=parts.jaxEffects;if(!effects)return;
  const s=sample(wire,now,actor.userData.jaxAbilityClock??={}),time=s.elapsed/1000;
  for(const mesh of effects.muscles){
   const normal=mesh.userData.jaxNormalScale??=mesh.scale.clone(),chest=mesh.name==='pectoral-panel';
   mesh.scale.copy(normal);mesh.scale.x*=1+s.strength*(chest?.12:.38);mesh.scale.z*=1+s.strength*(chest?.09:.28);
  }
  effects.dragon.visible=s.dragon>.001;effects.dragon.scale.setScalar(Math.max(.001,s.dragon));
  const orbit=(time-BUILD_MS/1000)*.85+.8,radius=.94;
  effects.dragon.position.set(Math.cos(orbit)*radius,.70+s.dragon*(.39+Math.sin(time*2)*.025),Math.sin(orbit)*radius);
  effects.dragon.rotation.y=Math.atan2(effects.dragon.position.x,effects.dragon.position.z);
  effects.wings[0].rotation.z=Math.sin(time*4)*.26;effects.wings[1].rotation.z=-Math.sin(time*4)*.26;
  effects.tail.rotation.y=Math.sin(time*2)*.18;
  effects.fire.visible=s.fire>.001;
  if(effects.fire.visible){
   // Aim the decorative plume from Ryujin's mouth toward Jax's upper body.
   // All positions are transformed through the actor so turning/moving Jax stays aligned.
   actor.updateWorldMatrix(true,true);
   const target=actor.localToWorld(effects.fire.position.clone().set(0,.74,0));
   const direction=effects.dragon.worldToLocal(target).sub(effects.fire.position),distance=direction.length();
   effects.fire.quaternion.setFromUnitVectors(direction.clone().set(0,0,-1),direction.normalize());
   effects.fire.scale.set(.8*s.fire,.8*s.fire,distance/.33*s.fire);
  }
  for(let i=0;i<effects.rings.length;i++){
   const ring=effects.rings[i],u=((time*.45+i*.5)%1);ring.visible=s.dragon>.001;
   ring.scale.setScalar(.6+u*1.6);ring.material.opacity=(1-u)*s.dragon*.38;
  }
  if(s.active){parts.armL.rotation.z+=s.strength*.13;parts.armR.rotation.z-=s.strength*.13;if(moving)parts.body.position.y+=Math.abs(Math.sin(time*7))*.009*s.strength;}
  actor.userData.jaxStrength=s.strength;
 }
 return {BUILD_MS,PEAK_MS,RECOVERY_MS,TOTAL_MS,phase,activate,tick,snapshot,sample,apply};
});

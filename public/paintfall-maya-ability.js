(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallMayaAbility=api;})(globalThis,()=>{
 const BUILD_MS=18000,PEAK_MS=3000,RECOVERY_MS=8000,TOTAL_MS=BUILD_MS+PEAK_MS+RECOVERY_MS;
 const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
 function phase(elapsed){
  const t=Math.max(0,elapsed);let confidence=0,label='Normal';
  if(t<BUILD_MS){confidence=smooth(t/BUILD_MS);label=t<5000?'Gymnastics':'Confidence rising';}
  else if(t<BUILD_MS+PEAK_MS){confidence=1;label='Peak confidence';}
  else if(t<TOTAL_MS){confidence=1-smooth((t-BUILD_MS-PEAK_MS)/RECOVERY_MS);label='Returning to normal';}
  return {elapsed:t,confidence,strut:smooth((confidence-.15)/.7),label,active:t<TOTAL_MS};
 }
 function activate(player,room,time){
  if(!room.started||!player.alive||!player.abilityReady||player.character!=='Maya')return false;
  player.ability={type:'maya-confidence',id:room.round+':'+time,startedAt:time};
  player.abilityReadyAt=time+Math.max(TOTAL_MS,room.rules.cooldown*1000);
  player.abilityReady=false;player.abilityCooldown=Math.ceil((player.abilityReadyAt-time)/1000);return true;
 }
 function tick(player,time){
  let changed=false;
  if(player.ability&&(!player.alive||time-player.ability.startedAt>=TOTAL_MS)){player.ability=null;changed=true;}
  if(player.abilityReadyAt){
   const seconds=Math.max(0,Math.ceil((player.abilityReadyAt-time)/1000));
   if(seconds!==player.abilityCooldown){player.abilityCooldown=seconds;changed=true;}
   if(!seconds){player.abilityReadyAt=0;player.abilityReady=true;changed=true;}
  }
  return changed;
 }
 function snapshot(player,time){return player.alive&&player.ability?{type:'maya-confidence',id:player.ability.id,elapsedMs:Math.max(0,time-player.ability.startedAt),sampleAt:time}:null;}
 function sample(wire,now,clock){
  if(!wire||wire.type!=='maya-confidence'){clock.id=null;return {...phase(TOTAL_MS),elapsed:0};}
  if(clock.id!==wire.id||clock.sampleAt!==wire.sampleAt){clock.id=wire.id;clock.sampleAt=wire.sampleAt;clock.anchor=now-wire.elapsedMs;}
  return phase(now-clock.anchor);
 }
 function apply(actor,wire,moving,now){
  const parts=actor.userData.parts,model=parts.mayaTransformation;if(!model)return;
  const s=sample(wire,now,actor.userData.mayaAbilityClock??={});
  const amount=s.confidence;
  model.ponytail.scale.setScalar(Math.max(.001,1-smooth(amount)));
  model.ponytail.visible=amount<.999;
  model.afro.visible=amount>.001;model.afro.scale.setScalar(.015+amount*.285);
  if(model.aura){model.aura.visible=amount>.001;for(const band of model.aura.children)band.material.opacity=amount*.2;}
  actor.userData.renderHeight=actor.userData.normalRenderHeight+amount*.5;
  actor.userData.mayaConfidence=amount;actor.userData.mayaAbilityPhase=s.label;
  parts.body.rotation.x=0;parts.body.rotation.y=0;parts.body.rotation.z=0;parts.body.position.z=0;
  if(!s.active)return;
  const strut=s.strut,gait=now*(.007-.0022*strut),step=Math.sin(gait);
  if(moving){
   // Narrow forward cross-steps and a quiet torso, instead of lateral rocking.
   parts.body.rotation.y=step*.018*strut;
   parts.armL.rotation.x=-step*(.24-.11*strut);
   parts.armR.rotation.x=-parts.armL.rotation.x;
   parts.armL.rotation.z=.06-.14*strut;parts.armR.rotation.z=-parts.armL.rotation.z;
   parts.legL.rotation.x=step*(.28+.045*strut);parts.legR.rotation.x=-parts.legL.rotation.x;
   parts.legL.rotation.z=Math.max(0,step)*.10*strut;parts.legR.rotation.z=-Math.max(0,-step)*.10*strut;
   parts.legL.userData.shin.rotation.x=Math.max(0,-step)*(.35-.19*strut);
   parts.legR.userData.shin.rotation.x=Math.max(0,step)*(.35-.19*strut);
  }
  // One stylized cartwheel in the ponytail opening. Root/collision stays server-owned.
  const u=(s.elapsed-700)/2600;
  if(u>0&&u<1){
   const angle=smooth(u)*Math.PI*2;
   parts.body.rotation.z=angle;
   // Conservative normalized-body clearance prevents the pose dipping below ground.
   parts.body.position.y+=(1.25*(1-Math.cos(angle))/2+.65*Math.abs(Math.sin(angle)));
   parts.armL.rotation.z=-Math.PI*.87;parts.armR.rotation.z=Math.PI*.87;
   parts.legL.rotation.z=-.28;parts.legR.rotation.z=.28;
  }
 }
 return {BUILD_MS,PEAK_MS,RECOVERY_MS,TOTAL_MS,phase,activate,tick,snapshot,sample,apply};
});

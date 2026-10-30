// Confirmed default powers only. Bond/mastery unlocks are deliberately separate.
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallCoreAbilities=api;})(globalThis,()=>{
 const definitions=Object.freeze({
  Skye:{type:'skye-reggaeton',name:'Reggaetón Rhythm',build:10000,peak:8000,recover:6000,labels:['Wind rhythm building','Dembow — wind and dance','Returning to reggae']},
  Rico:{type:'rico-ultra-hearing',name:'Ultra Hearing',build:8000,peak:8000,recover:6000,labels:['Listening to nearby activity','Ultra Hearing — sensory overload','Settling the sound waves']},
  Kai:{type:'kai-deterministic-chaos',name:'Deterministic Chaos',build:10000,peak:8000,recover:6000,labels:['Companion finding a pattern','Companion — chaotic parkour','Companion returning to calm']},
  Dante:{type:'dante-physiological',name:'Physiological Adaptation',build:12000,peak:8000,recover:6000,labels:['Learning the surroundings','Adapting — silhouette remains visible','Returning to normal']}
 });
 const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
 const apis={};
 for(const [character,d] of Object.entries(definitions)){
  const TOTAL_MS=d.build+d.peak+d.recover;
  function phase(elapsed){const t=Math.max(0,elapsed),active=t<TOTAL_MS,stage=t<d.build?0:t<d.build+d.peak?1:2;
   return {active,elapsed:t,intensity:!active?0:stage===0?smooth(t/d.build):stage===1?1:1-smooth((t-d.build-d.peak)/d.recover),label:active?d.labels[stage]:'Normal',overloaded:active&&stage===1};}
  function activate(p,r,time){if(!r.started||!p.alive||!p.abilityReady||p.character!==character)return false;
   p.ability={type:d.type,id:r.round+':'+time,startedAt:time};p.abilityReadyAt=time+Math.max(TOTAL_MS,(Number(r.rules.cooldown)||0)*1000);p.abilityReady=false;p.abilityCooldown=Math.ceil((p.abilityReadyAt-time)/1000);return true;}
  function tick(p,time){let changed=false;if(p.ability&&(!p.alive||time-p.ability.startedAt>=TOTAL_MS)){p.ability=null;changed=true;}
   if(p.abilityReadyAt){const seconds=Math.max(0,Math.ceil((p.abilityReadyAt-time)/1000));if(seconds!==p.abilityCooldown){p.abilityCooldown=seconds;changed=true;}if(!seconds){p.abilityReadyAt=0;p.abilityReady=true;changed=true;}}return changed;}
  function snapshot(p,time){return p.alive&&p.ability?.type===d.type?{type:d.type,id:p.ability.id,elapsedMs:Math.max(0,time-p.ability.startedAt),sampleAt:time}:null;}
  function sample(wire,now,clock){if(!wire||wire.type!==d.type){clock.id=null;return phase(TOTAL_MS);}if(clock.id!==wire.id||clock.sampleAt!==wire.sampleAt){clock.id=wire.id;clock.sampleAt=wire.sampleAt;clock.anchor=now-wire.elapsedMs;}return phase(now-clock.anchor);}
  apis[character]={character,name:d.name,type:d.type,TOTAL_MS,phase,activate,tick,snapshot,sample};
 }
 // These are visual game activity cues, never microphone data or real emotions.
 function activity(previous,current){if(!current.alive||!previous||previous.arenaRegion!==current.arenaRegion||previous.dropRevision!==current.dropRevision||previous.alive!==current.alive)return null;if(Number(current.z)>Number(previous.z||0)+.1)return 'jump';if(Math.hypot(current.x-previous.x,current.y-previous.y)>1)return 'footsteps';return null;}
 function audible(viewer,target){return !!viewer&&viewer.character==='Rico'&&viewer.alive!==false&&target.alive!==false&&viewer.id!==target.id&&viewer.arenaRegion===target.arenaRegion&&Math.hypot((viewer.x-target.x)/40,(viewer.y-target.y)/25)<=30;}
 return {definitions,forCharacter:name=>apis[name]||null,activity,audible};
});

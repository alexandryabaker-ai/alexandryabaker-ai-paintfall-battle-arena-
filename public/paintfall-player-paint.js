(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallPlayerPaint=api;})(globalThis,()=>{
 const HOLD_MS=15000,FADE_MS=10000,LIFETIME_MS=HOLD_MS+FADE_MS,MAX_MARKS=32;
 const colors={Maya:0x9639e5,Zara:0xffbf24,Nova:0x7def21,Skye:0xff168b,Jax:0x0786fa,Rico:0x12c5cd,Kai:0x732be7,Dante:0xf87a20};
 function opacity(age){return age<=HOLD_MS?1:Math.max(0,1-(age-HOLD_MS)/FADE_MS);}
 function hit(target,shooter,time){
  target.paintSequence=(target.paintSequence||0)+1;target.paintTaken=(target.paintTaken||0)+1;
  const mark={id:target.paintSequence,slot:(target.paintSequence-1)%MAX_MARKS,color:colors[shooter.character]||0x9639e5,createdAt:time};
  // New paint can cover an old layer in the same location. This never clears paint.
  target.paintMarks=(target.paintMarks||[]).filter(old=>old.slot!==mark.slot&&time-old.createdAt<LIFETIME_MS);target.paintMarks.push(mark);return mark;
 }
 function tick(player,time){const marks=player.paintMarks||[],next=marks.filter(mark=>time-mark.createdAt<LIFETIME_MS);if(next.length===marks.length)return false;player.paintMarks=next;return true;}
 function snapshot(player,time){return {sampleAt:time,holdMs:HOLD_MS,fadeMs:FADE_MS,marks:(player.paintMarks||[]).filter(mark=>time-mark.createdAt<LIFETIME_MS).map(mark=>({id:mark.id,slot:mark.slot,color:mark.color,ageMs:Math.max(0,time-mark.createdAt)}))};}
 function sample(wire,now,clock){if(!wire){clock.sampleAt=null;return [];}if(clock.sampleAt!==wire.sampleAt){clock.sampleAt=wire.sampleAt;clock.anchor=now;}const extra=Math.max(0,now-clock.anchor);return (wire.marks||[]).map(mark=>({...mark,opacity:opacity(mark.ageMs+extra)})).filter(mark=>mark.opacity>0);}
 return {HOLD_MS,FADE_MS,LIFETIME_MS,MAX_MARKS,colors,opacity,hit,tick,snapshot,sample};
});

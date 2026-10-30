// Short, stationary, no-harm PAINTFALL bucking ride. The server owns consent,
// timing and exclusivity; it grants no health, score, travel or combat advantage.
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallBullRide=api;})(globalThis,()=>{
 const DURATION_MS=8000,isBull=kind=>/^(?:bull|banteng|gaur|water buffalo)(?:\b|$)/i.test(kind);
 function start(player,room,animalId,catalog,time){
  const animal=catalog[animalId];
  if(!room.started||!player.alive||player.mounted||player.grounded===false||player.z>0||room.rules.rides===false||!animal||!isBull(animal.kind)||animal.region!==player.arenaRegion)return false;
  if([...room.players.values()].some(p=>p.bullRide?.animalId===animalId))return false;
  player.bullRide={id:player.id+':'+time,animalId,startedAt:time};player.mounted=true;player.dropSelectionOpen=false;return true;
 }
 function stop(player){if(!player.bullRide)return false;player.bullRide=null;player.mounted=false;player.z=0;player.vz=0;player.grounded=true;return true;}
 function tick(player,time){return player.bullRide&&(!player.alive||time-player.bullRide.startedAt>=DURATION_MS)?stop(player):false;}
 function snapshot(player,time){const s=player.bullRide;return s?{id:s.id,animalId:s.animalId,elapsedMs:Math.max(0,time-s.startedAt),durationMs:DURATION_MS,sampleAt:time}:null;}
 return {DURATION_MS,isBull,start,stop,tick,snapshot};
});

const T=require('./public/vendor/three.module.js'),route=require('./public/paintfall-tower-ride.js'),movement=require('./public/paintfall-movement-sync.js');
const tracks=new WeakMap();
function elapsed(room,time){return Math.max(0,time-(room.parkEpoch??time));}
function track(room,time){let entry=tracks.get(room);if(!entry)tracks.set(room,entry={model:route.createTrack(T),time:-1});if(entry.time!==time){entry.model.update(elapsed(room,time)/1000);entry.time=time;}return entry.model;}
function stop(p){if(!p.coasterRide)return false;p.coasterRide=null;p.mounted=false;p.grounded=true;p.z=0;p.vz=0;p.dropRevision=(p.dropRevision||0)+1;Object.assign(p,movement.toGameplay(route.EXIT));return true;}
function start(p,r,time){
 if(!r.started||r.rules.rides===false||!p.alive||p.arenaRegion!=='state:Nevada'||p.mounted||p.coasterRide||p.ability||p.splashLanding||p.grounded===false||p.z>0)return {ok:false,message:'Finish your current activity and stand at the Towers boarding platform.'};
 const world=movement.toWorld(p);if(Math.hypot(world.x-route.PLATFORM.x,world.z-route.PLATFORM.z)>4)return {ok:false,message:'Walk to the marked Towers boarding platform.'};
 const phase=route.phase(elapsed(r,time));if(!phase.boarding)return {ok:false,message:'The train is on its loop. Please wait for the next boarding stop.'};
 const occupied=new Set([...r.players.values()].filter(x=>x.coasterRide?.cycle===phase.cycle).map(x=>x.coasterRide.seat));let seat=0;while(occupied.has(seat))seat++;if(seat>=route.SEATS)return {ok:false,message:'This train is full. Please wait for the next loop.'};
 p.coasterRide={seat,cycle:phase.cycle};p.mounted=true;p.grounded=false;p.dropSelectionOpen=false;p.vz=0;tick(p,r,time);return {ok:true,message:'You are seated. The train leaves after the boarding countdown.'};
}
function tick(p,r,time){if(!p.coasterRide)return false;const ms=elapsed(r,time),phase=route.phase(ms);if(!p.alive||!r.started||p.arenaRegion!=='state:Nevada'||phase.cycle!==p.coasterRide.cycle)return stop(p);const pose=track(r,time).seat(ms,p.coasterRide.seat);Object.assign(p,movement.toGameplay({x:pose.position.x,z:pose.position.z}));p.z=pose.position.y*40;p.vz=0;p.grounded=false;p.mounted=true;return true;}
module.exports={start,stop,tick,elapsed,route};

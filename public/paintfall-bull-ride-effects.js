// Uses the existing wildlife and character meshes in the existing scene.
export function createBullRideEffects(T,players,getRegion){
 const active=new Map();
 function restore(id){const old=active.get(id);if(!old)return;old.root.position.copy(old.position);old.root.quaternion.copy(old.quaternion);old.root.userData.paintfallRider=null;old.actor.rotation.y=old.yaw;old.actor.userData.bullRideLift=0;old.actor.userData.parts.body.rotation.x=0;old.actor.userData.parts.body.rotation.z=0;active.delete(id);}
 function update(now){
  const region=getRegion(),seen=new Set();
  for(const [id,actor]of players.actors){
   const wire=actor.userData.bullRide;if(!wire)continue;
   const counts=new Map(),animal=(region?.wildlife?.animals||[]).find(a=>{const n=counts.get(a.kind)||0;counts.set(a.kind,n+1);return region.destination.id+'|'+a.kind+'|'+n===wire.animalId;});
   if(!animal||!animal.root.visible)continue;seen.add(id);let effect=active.get(id);
   if(!effect||effect.wire!==wire.id){restore(id);const root=animal.root;root.updateWorldMatrix(true,true);const torso=root.children.find(n=>n.isMesh)||root,bounds=new T.Box3().setFromObject(torso),origin=root.getWorldPosition(new T.Vector3());effect={root,actor,position:root.position.clone(),quaternion:root.quaternion.clone(),yaw:actor.rotation.y,seat:bounds.max.y-origin.y+.06,anchor:now-wire.elapsedMs,wire:wire.id};active.set(id,effect);}
   const t=Math.max(0,now-effect.anchor)/1000,envelope=Math.max(0,Math.min(1,t*2,(wire.durationMs/1000-t)*2)),bounce=Math.abs(Math.sin(t*5))*.085*envelope;
   const target=new T.Vector3(actor.position.x,.012+bounce,actor.position.z);effect.root.parent.updateWorldMatrix(true,false);effect.root.position.copy(effect.root.parent.worldToLocal(target));
   effect.root.quaternion.copy(effect.quaternion);effect.root.rotation.x+=Math.sin(t*5)*.075*envelope;effect.root.rotation.z+=Math.sin(t*3)*.045*envelope;effect.root.userData.paintfallRider=id;
   const parts=actor.userData.parts,hip=parts.legL.position.y*actor.scale.y;
   actor.userData.bullRideLift=effect.seat-hip+bounce;actor.position.y=.012+actor.userData.bullRideLift;actor.rotation.y=effect.root.rotation.y+Math.PI;
   parts.body.rotation.x=Math.sin(t*5)*.055*envelope;parts.body.rotation.z=Math.sin(t*3)*.035*envelope;
   parts.legL.rotation.x=parts.legR.rotation.x=-1.05;parts.legL.rotation.z=.28;parts.legR.rotation.z=-.28;
   parts.legL.userData.shin.rotation.x=parts.legR.userData.shin.rotation.x=1.15;parts.armL.rotation.z=-.65;parts.armR.rotation.z=.65;
  }
  for(const id of [...active.keys()])if(!seen.has(id))restore(id);
 }
 return {update,dispose(){for(const id of [...active.keys()])restore(id);}};
}

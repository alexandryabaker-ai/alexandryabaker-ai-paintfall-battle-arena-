// Nova-only distance-driven movement with world-space stance contacts.
// Reuses the existing rig and renderer; does not move the authoritative actor.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=v=>{v=clamp(v,0,1);return v*v*(3-2*v);};
const mix=(a,b,t)=>a+(b-a)*t;

export function createNovaLocomotion(T,actor,game){
 const p=actor.userData.parts,legs=[],skeletonBones=Object.values(game.bones);
 // Capture anatomical rest directions once. Pose every frame starts from these,
 // never from last frame's rotated knees or an accumulated Euler angle.
 for(const b of skeletonBones)b.node.quaternion.copy(b.rest);
 actor.updateMatrixWorld(true);
 const bodyQ=p.body.getWorldQuaternion(new T.Quaternion()),bodyInverse=bodyQ.clone().invert();
 for(const side of ['L','R']){
  const hip=game.bones['leg'+side].node,knee=game.bones['shin'+side].node,foot=game.bones['foot'+side].node;
  const h=hip.getWorldPosition(new T.Vector3()),k=knee.getWorldPosition(new T.Vector3()),f=foot.getWorldPosition(new T.Vector3());
  const local=p.body.worldToLocal(f.clone());
  legs.push({side,hip,knee,foot,upper:h.distanceTo(k),lower:k.distanceTo(f),restX:local.x*actor.userData.standingHeight,restZ:local.z*actor.userData.standingHeight,
   ankleHeight:f.y-actor.position.y,restFootQ:bodyInverse.clone().multiply(foot.getWorldQuaternion(new T.Quaternion())),anchor:null,start:null,stance:false,sole0:Infinity,sole1:Infinity});
 }
 // The outfit morph slightly changes the boot sole thickness. Compensate that
 // measured delta too, otherwise the ankle is planted while the visible sole
 // still hovers a few millimetres above the surface at full Overload.
 game.model.traverse(mesh=>{if(!mesh.isSkinnedMesh)return;const pos=mesh.geometry.attributes.position,delta=mesh.geometry.morphAttributes.position?.[mesh.morphTargetDictionary?.TrackUniform];
  for(let i=0;i<pos.count;i++)if(pos.getY(i)<.015){const leg=legs[pos.getX(i)<0?0:1];leg.sole0=Math.min(leg.sole0,pos.getY(i));leg.sole1=Math.min(leg.sole1,pos.getY(i)+(delta?.getY(i)||0));}
 });
 for(const leg of legs)leg.soleMorph=Number.isFinite(leg.sole1-leg.sole0)?leg.sole1-leg.sole0:0;
 const state={cycle:0,speed:0,moving:false,grounded:true,landing:0,lastYaw:actor.rotation.y,lastOverload:null,noTravel:0,bodyYaw:0,settle:null,samples:[],poseVersion:'distance-contact-v1'};
 const worldUp=new T.Vector3(0,1,0);
 function aim(bone,child,target){
  bone.updateWorldMatrix(true,true);
  const origin=bone.getWorldPosition(new T.Vector3()),current=child.getWorldPosition(new T.Vector3()).sub(origin).normalize(),wanted=target.clone().sub(origin).normalize();
  const q=new T.Quaternion().setFromUnitVectors(current,wanted).multiply(bone.getWorldQuaternion(new T.Quaternion()));
  bone.quaternion.copy(bone.parent.getWorldQuaternion(new T.Quaternion()).invert().multiply(q));
  bone.updateWorldMatrix(false,true);
 }
 function solve(leg,target,bend,orientation){
  const hip=leg.hip.getWorldPosition(new T.Vector3()),direction=target.clone().sub(hip),originalDistance=direction.length();
  const distance=clamp(originalDistance,.025,leg.upper+leg.lower-.00002);direction.normalize();
  const along=(leg.upper**2-leg.lower**2+distance**2)/(2*distance),height=Math.sqrt(Math.max(0,leg.upper**2-along**2));
  const pole=bend.clone().addScaledVector(direction,-bend.dot(direction));
  if(pole.lengthSq()<1e-6)pole.set(0,0,-1).addScaledVector(direction,direction.z);
  pole.normalize();
  const knee=hip.clone().addScaledVector(direction,along).addScaledVector(pole,height);
  const reachable=hip.clone().addScaledVector(direction,distance);
  aim(leg.hip,leg.knee,knee);aim(leg.knee,leg.foot,reachable);
  leg.foot.quaternion.copy(leg.foot.parent.getWorldQuaternion(new T.Quaternion()).invert().multiply(orientation));
  leg.foot.updateWorldMatrix(false,true);
  return {target:target.toArray(),ankle:leg.foot.getWorldPosition(new T.Vector3()).toArray(),reachError:Math.max(0,originalDistance-distance)};
 }
 function rotate(name,x=0,y=0,z=0){
  const bone=game.bones[name];if(!bone)return;
  const reference=p.body.getWorldQuaternion(new T.Quaternion()),parent=bone.node.parent.getWorldQuaternion(new T.Quaternion()).invert();
  const q=new T.Quaternion().setFromEuler(new T.Euler(x,y,z));
  q.premultiply(reference).multiply(reference.clone().invert());
  const world=bone.node.getWorldQuaternion(new T.Quaternion());
  bone.node.quaternion.copy(parent.multiply(q.multiply(world)));bone.node.updateWorldMatrix(false,true);
 }
 function resetFeet(){for(const leg of legs){leg.anchor=null;leg.start=null;leg.stance=false;}}
 function update(context){
  const {dt=0,dx=0,dz=0,now=0,reset=false,grounded=true,splash=false}=context;
  const distance=reset?0:Math.hypot(dx,dz),h=clamp(dt,0,.1);
  if(reset)state.samples.length=0;
  if(h>0)state.samples.push({dt:h,distance});
  let sampleTime=state.samples.reduce((sum,s)=>sum+s.dt,0);
  while(state.samples.length>1&&sampleTime-state.samples[0].dt>=.20)sampleTime-=state.samples.shift().dt;
  // Snapshot updates can arrive between render frames. Average distance over a
  // short window so packet-sized position increments do not report a false
  // sprint followed by two idle frames, or lose speed to an instantaneous cap.
  const measured=sampleTime>0?state.samples.reduce((sum,s)=>sum+s.distance,0)/sampleTime:0;
  state.speed=reset?0:mix(state.speed,clamp(measured,0,12),1-Math.exp(-h*14));
  state.noTravel=distance>1e-6?0:state.noTravel+h;
  const moving=distance>1e-6||(state.speed>.08&&state.noTravel<.075);
  const overload=actor.userData.novaAbilitySample,active=!!overload?.spending;
  const run=active?overload.run:smooth((state.speed-1.4)/2.4);
  const gallop=active?1-run:0;
  const stride=clamp(.68+state.speed*.22,.7,2.7),duty=mix(.62,.24,run);
  // Fast lateral gallops need an airborne interval, not a long planted stride
  // that asks a 0.70 m leg to reach over a metre behind the moving body.
  const gallopDuty=mix(.48,.24,smooth((state.speed-2)/5.5));
  const sideDuty=mix(duty,gallopDuty,gallop);
  const yawChange=Math.abs(Math.atan2(Math.sin(actor.rotation.y-state.lastYaw),Math.cos(actor.rotation.y-state.lastYaw)));
  if(reset||yawChange>.55||state.grounded!==grounded||state.lastOverload!==active){resetFeet();if(reset)state.cycle=0;}
  if(grounded&&moving)state.cycle=(state.cycle+distance/stride)%1;
  if(!moving&&state.moving&&grounded){state.settle={time:0,starts:legs.map(l=>l.foot.getWorldPosition(new T.Vector3())),stance:legs.map(l=>l.stance),order:legs[0].stance?[1,0]:[0,1]};}
  if(moving&&!state.moving)state.settle=null;
  if(!grounded||reset)state.settle=null;
  if(state.settle)state.settle.time=Math.min(.30,state.settle.time+h);
  if(moving!==state.moving)resetFeet();
  if(grounded&&!state.grounded){state.landing=.18;state.cycle=0;}
  state.landing=Math.max(0,state.landing-h);state.lastYaw=actor.rotation.y;state.lastOverload=active;
  // Body weight shift is small; the legs solve back to their floor contacts.
  const wave=Math.sin(state.cycle*Math.PI*2),other=(state.cycle+mix(.5,.28,gallop))%1;
  let flight=0;
  if(moving&&state.cycle>=sideDuty&&other>=sideDuty){const since=Math.min(state.cycle-sideDuty,other-sideDuty),until=Math.min(1-state.cycle,1-other);flight=Math.sin(Math.PI*since/(since+until));}
  const drop=moving?.060+.020*run:0,land=state.landing>0?.035*Math.sin(state.landing/.18*Math.PI):0;
  p.body.position.set((moving?wave*.008:0)/actor.userData.standingHeight,actor.userData.baseBodyY+(-drop+flight*.035-land)/actor.userData.standingHeight,0);
  state.bodyYaw=mix(state.bodyYaw,moving?Math.PI*.5*gallop:0,1-Math.exp(-h*14));
  p.body.rotation.set(0,state.bodyYaw,0);
  for(const b of skeletonBones)b.node.quaternion.copy(b.rest);
  actor.updateMatrixWorld(true);
  // Lean/twist the upper torso, not the entire rig about the soles.
  rotate('spine',grounded&&moving?-.025-.075*run:0,moving?wave*.035:0,moving?wave*.008:0);
  rotate('head',0,moving?-wave*.018:0,0);
  const arms=moving?(.10+.30*run):0;
  const swing=wave*arms;
  // The source is modeled with its upper arms splayed. Relax that rest pose
  // toward the hips at idle, leaving clearance for cargo pockets and the gun.
  // Fade this correction away with travel speed so it does not restrict gait.
  const relaxed=1-smooth(state.speed/.8),adduction=game.procedural?-.06:mix(.03,.30,relaxed);
  rotate('armL',swing-.025*relaxed,0,-adduction);rotate('armR',-swing-.025*relaxed,0,adduction);
  rotate('forearmL',moving?.30+.65*run+(1-run)*gallop*.2:.12);
  rotate('forearmR',moving?.30+.65*run+(1-run)*gallop*.2:.12);
  const visualQ=p.body.getWorldQuaternion(new T.Quaternion());
  const bend=new T.Vector3(0,0,-1).applyQuaternion(visualQ);
  const travel=new T.Vector3(0,0,-1).applyQuaternion(actor.quaternion);
  const reports=[],pending=[];
  for(let i=0;i<legs.length;i++){
   const leg=legs[i],offset=i===0?0:mix(.5,.28,gallop),u=(state.cycle+offset)%1;
   const base=new T.Vector3(leg.restX,0,leg.restZ).applyQuaternion(visualQ).add(actor.position);
   const reach=stride*sideDuty*.5;
   const soleShift=leg.soleMorph*(actor.userData.novaOutfitProgress||0);
   const neutral=base.clone();neutral.y=actor.position.y+leg.ankleHeight-soleShift;
   let stance=grounded&&(!moving||u<sideDuty),target,footQ=visualQ.clone().multiply(leg.restFootQ);
   if(state.settle&&grounded){
    const rank=state.settle.order.indexOf(i),t=clamp((state.settle.time-rank*.15)/.15,0,1);
    target=state.settle.starts[i].clone().lerp(neutral,smooth(t));target.y+=Math.sin(Math.PI*t)*.035;
    stance=t>=1||(t===0&&state.settle.stance[i]);
   }else if(!grounded){
    resetFeet();target=neutral.clone().addScaledVector(travel,i===0?.10:-.08);target.y+=splash?.035:.12;
   }else if(stance){
    if(!leg.stance||!leg.anchor){leg.anchor=neutral.clone().addScaledVector(travel,moving?reach:0);leg.start=null;}
    target=leg.anchor.clone();
   }else{
    if(leg.stance||!leg.start)leg.start=(leg.anchor||neutral).clone();
    const t=(u-sideDuty)/(1-sideDuty),end=neutral.clone().addScaledVector(travel,reach);
    target=leg.start.clone().lerp(end,smooth(t));target.y=neutral.y+Math.sin(Math.PI*t)*(.055+.11*run+.025*gallop);
    const pitch=Math.sin(Math.PI*t)*.18;
    footQ.premultiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0).applyQuaternion(visualQ),pitch));
   }
   leg.stance=stance;
   pending.push({leg,target,footQ,stance,soleShift});
  }
  // Acceleration can lengthen the first stance before the smoothed speed catches
  // up. Lower the hips enough to keep that contact reachable, instead of lifting
  // the planted boot by clamping an over-extended leg.
  let supportDrop=0;
  for(const {leg,target,stance}of pending)if(stance){
   const hip=leg.hip.getWorldPosition(new T.Vector3()),horizontal=(hip.x-target.x)**2+(hip.z-target.z)**2,length=leg.upper+leg.lower-.001;
   supportDrop=Math.max(supportDrop,hip.y-target.y-Math.sqrt(Math.max(0,length*length-horizontal)));
  }
  supportDrop=clamp(supportDrop,0,.10);
  if(supportDrop){p.body.position.y-=supportDrop/actor.userData.standingHeight;actor.updateMatrixWorld(true);}
  for(const {leg,target,footQ,stance,soleShift}of pending){
   const report=solve(leg,target,bend,footQ);report.stance=stance;report.side=leg.side;report.soleY=target.y-leg.ankleHeight+soleShift;reports.push(report);
  }
  if(state.settle?.time>=.30)state.settle=null;
  if(splash){
   rotate('armL',0,0,.45);rotate('armR',0,0,-.45);
  }
  // Existing hair springs remain the only hair-motion authority.
  for(const side of ['L','R']){const bone=game.bones['hair'+side];if(bone){const angle=p.hairDynamics?.[0]?.pivot.rotation.x||0;bone.node.quaternion.copy(bone.rest).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),angle));}}
  state.moving=moving;state.grounded=grounded;
  actor.userData.novaGait=!grounded?'Airborne':!moving?'Idle':gallop>.5?'Sideways lead-and-gather gallop':run>.5?'Forward run':'Walk';
  actor.userData.novaLocomotion={version:state.poseVersion,speed:state.speed,cycle:state.cycle,stride,duty:sideDuty,grounded,run,gallop,contacts:reports};
  return actor.userData.novaLocomotion;
 }
 return {update,legs,state};
}

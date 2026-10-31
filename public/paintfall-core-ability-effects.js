import * as coreModule from './paintfall-core-abilities.js';

// Uses the arena's THREE and actor hierarchy; owns no renderer or movement authority.
export function createCoreAbilityEffects(T,scene){
 const core=globalThis.PaintfallCoreAbilities||coreModule.default,history=new Map(),sounds=new Map(),clock={};
 function material(color){return new T.MeshBasicMaterial({color,transparent:true,opacity:.6,depthWrite:false});}
 function ring(parent,color,r=.12){const mesh=new T.Mesh(new T.TorusGeometry(r,.005,5,32),material(color));parent.add(mesh);return mesh;}
 function setup(actor,name){
  const root=new T.Group();root.name=name+' default ability';actor.add(root);
  const fx={root,rings:[],garments:[],clock:{},groundColor:new T.Color(0x71815c),groundTarget:new T.Color(0x71815c)};
  if(name==='Skye'){
   for(let i=0;i<8;i++){
    const note=new T.Group(),m=material(i%2?0xff5ca8:0xa9eaff);
    const bead=new T.Mesh(new T.SphereGeometry(.012,8,6),m);bead.scale.set(1,.7,.45);note.add(bead);
    const stem=new T.Mesh(new T.CylinderGeometry(.002,.002,.045,5),m);stem.position.set(.010,.022,0);note.add(stem);root.add(note);fx.rings.push(note);
   }
   for(let i=0;i<3;i++){const wind=ring(root,0xb4efff,.20+i*.07);wind.rotation.x=Math.PI/2;wind.position.y=.28+i*.22;fx.rings.push(wind);}
  }else if(name==='Rico'){
   for(const side of [-1,1])for(let i=0;i<3;i++){const wave=ring(root,0x48e5de,.035+i*.012);wave.position.set(side*.09,.925,.005);wave.rotation.y=Math.PI/2;wave.userData.side=side;wave.userData.order=i;fx.rings.push(wave);}
  }else if(name==='Kai'){
   // Clone just transform nodes and geometry; no copied actor userData/companions.
   const nodes=new Map(),materials=new Map(),opposites=new Map([[0x7624dd,0xd8273f],[0xd8273f,0x7624dd],[0x48227c,0x9b2037],[0x9b2037,0x48227c],[0xb081ed,0xe34a68]]);
   function opposite(source){if(!materials.has(source)){const clone=source.clone(),color=opposites.get(source.color?.getHex());if(color!==undefined)clone.color.setHex(color);clone.transparent=true;clone.opacity=.34;clone.depthWrite=false;materials.set(source,clone);}return materials.get(source);}
   function copy(source){const node=source.isMesh?new T.Mesh(source.geometry,Array.isArray(source.material)?source.material.map(opposite):opposite(source.material)):new T.Group();node.name='Kai companion / '+source.name;node.position.copy(source.position);node.quaternion.copy(source.quaternion);node.scale.copy(source.scale);node.visible=source.visible;nodes.set(source,node);for(const child of source.children)if(!child.userData.decorative&&child.name!=='paint-blaster')node.add(copy(child));return node;}
   fx.companion=copy(actor.userData.parts.body);fx.companion.name='Kai’s companion — name being recovered';root.add(fx.companion);fx.nodes=nodes;fx.bounds=new T.Box3();
   fx.companionMaterials=[...materials.values()].map(m=>({material:m,color:m.color?.clone()}));
   fx.joints=['armL','armR','legL','legR'].map(key=>nodes.get(actor.userData.parts[key]));
   fx.shins=['legL','legR'].map(key=>nodes.get(actor.userData.parts[key].userData.shin));
   fx.shadowColor=new T.Color(0x201c35);fx.forearmOffsets=new Map();
   // Articulate only the double's existing lower-arm meshes; Kai's rig is untouched.
   fx.elbows=['armL','armR'].map(key=>{const source=actor.userData.parts[key],arm=nodes.get(source),elbow=source.getObjectByName('elbow'),pivot=new T.Group();pivot.name='Kai companion / elbow pivot';pivot.position.copy(elbow.position);arm.add(pivot);
    for(const child of source.children)if(child.position.y<elbow.position.y-.01){const node=nodes.get(child);if(node){pivot.add(node);node.position.sub(pivot.position);fx.forearmOffsets.set(node,pivot.position.clone());}}
    return pivot;});
  }else if(name==='Dante'){
   const p=actor.userData.parts;
   actor.traverse(mesh=>{if(!mesh.isMesh||mesh.userData.decorative)return;
    if(['tailored-torso','hips','thigh','cargo-hip-joint','shin','cargo-pocket','cargo-secondary-pocket','cargo-pocket-flap','sheet-panel','sheet-strap','vest-detail','hood-down'].includes(mesh.name)){
     const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material];const replacements=mats.map(m=>m.clone());mesh.material=Array.isArray(mesh.material)?replacements:replacements[0];for(const m of replacements)if(m.color)fx.garments.push({material:m,color:m.color.clone()});
    }});
   for(let i=0;i<2;i++){const awareness=ring(root,0xffb54e,.11+i*.07);awareness.rotation.x=Math.PI/2;awareness.position.y=.025;fx.rings.push(awareness);}
   fx.ray=new T.Raycaster();fx.groundOrigin=new T.Vector3();
  }
  actor.userData.coreAbilityEffects=fx;return fx;
 }
 function sampleGround(actor,fx,now){
  if(now<(fx.nextGroundSample||0))return;fx.nextGroundSample=now+250;
  actor.getWorldPosition(fx.groundOrigin);fx.groundOrigin.y+=2;
  fx.ray.set(fx.groundOrigin,new T.Vector3(0,-1,0));fx.ray.far=6;
  // Character/companion/projectile roots are not environmental samples.
  const environment=scene.children.filter(root=>!root.userData.playerId&&!root.userData.energy&&root.name!=='paint-projectile');
  const hit=fx.ray.intersectObjects(environment,true).find(hit=>hit.object.visible&&hit.object.material?.color&&hit.object.material.opacity!==0);
  if(hit){fx.groundTarget.copy(hit.object.material.color);fx.surface=hit.object.name||'ground surface';}
 }
 function apply(actor,player,moving,now,grounded=true){
  const api=core.forCharacter(player.character);if(!api)return;
  const fx=actor.userData.coreAbilityEffects||setup(actor,player.character),s=api.sample(player.ability,now,fx.clock),parts=actor.userData.parts,t=s.elapsed/1000;
  fx.root.visible=s.active||player.character==='Kai';actor.userData.defaultAbility={name:api.name,...s};
  if(player.character==='Skye'){
   parts.body.rotation.y=s.active?Math.sin(t*Math.PI*2)*.10*s.intensity:0;
   // 3-3-2 accents within an eight-pulse visual phrase, without adding audio.
   const pulse=t*3.2%8,accent=Math.min(...[0,3,6,8].map(n=>Math.abs(pulse-n))),beat=Math.exp(-accent*7)*s.intensity;
   if(s.active&&grounded){parts.body.position.y-=beat*.009;parts.armL.rotation.x-=s.intensity*(.25+Math.sin(t*4)*.18);parts.armR.rotation.x+=s.intensity*(.25+Math.sin(t*4+.7)*.18);if(!moving){parts.legL.rotation.x=beat*.12;parts.legR.rotation.x=-beat*.12;}}
   fx.rings.forEach((node,i)=>{if(i<8){const angle=t*.8+i*Math.PI/4;node.position.set(Math.cos(angle)*(.20+s.intensity*.06),.52+(i%4)*.08+Math.sin(t*2+i)*.025,Math.sin(angle)*.25);node.rotation.y=-angle;}else{node.rotation.z=t*.4;node.scale.setScalar(1+beat*.12);}node.traverse(p=>{if(p.material)p.material.opacity=.65*s.intensity;});});
  }else if(player.character==='Rico'){
   fx.rings.forEach(node=>{const u=(t*.9+node.userData.order/3)%1;node.scale.setScalar(.7+u*1.6);node.position.x=node.userData.side*(.09+u*.07);node.material.opacity=(1-u)*s.intensity*.8;});
  }else if(player.character==='Kai'){
   // At rest he follows Kai's exact pose, close behind like an attached shadow.
   // Buildup releases him into an independently moving, translucent double.
   const freedom=s.intensity;
   for(const [source,node] of fx.nodes){node.position.copy(source.position);node.quaternion.copy(source.quaternion);node.scale.copy(source.scale);node.visible=source.visible;}
   for(const [node,offset] of fx.forearmOffsets)node.position.sub(offset);
   for(const entry of fx.companionMaterials){const m=entry.material;m.opacity=.14+.20*freedom;if(entry.color)m.color.copy(entry.color).lerp(fx.shadowColor,(1-freedom)*.78);}
   // A continuous phase avoids acceleration/snap when buildup reaches Overload.
   // Opposing arms/legs, flexed elbows and delayed knees replace rigid marching.
   const q=now*.0052,sway=Math.sin(q+.35);
   fx.companion.position.x+=(-.04-.64*freedom)+sway*.026*freedom;
   fx.companion.position.z+=.14*(1-freedom)+Math.sin(q*.65)*.18*freedom;
   fx.companion.rotation.x+=freedom*(-.055+Math.cos(q*2)*.018);fx.companion.rotation.y+=Math.sin(q+.45)*.13*freedom;fx.companion.rotation.z+=sway*.035*freedom;
   fx.joints.forEach((joint,i)=>{const side=i%2,phase=q+side*Math.PI;const target=i<2?-Math.sin(phase+.22)*.40:Math.sin(phase)*.50;
    joint.rotation.x=T.MathUtils.lerp(joint.rotation.x,target,freedom);joint.rotation.z+=Math.sin(phase+.4)*.025*freedom;});
   fx.elbows.forEach((elbow,i)=>{elbow.rotation.x=(.30+(.5+.5*Math.sin(q+i*Math.PI-.45))*.35)*freedom;});
   fx.shins.forEach((joint,i)=>{joint.rotation.x=T.MathUtils.lerp(joint.rotation.x,.10+(.5+.5*Math.sin(q+i*Math.PI-.7))*.65,freedom);});
   if(freedom>0){actor.updateWorldMatrix(true,true);fx.bounds.setFromObject(fx.companion);
    fx.companion.position.y+=(actor.position.y-fx.bounds.min.y)/actor.userData.standingHeight+(1-Math.cos(q*2))*.008*freedom;}
  }else if(player.character==='Dante'){
   if(s.active)sampleGround(actor,fx,now);
   const dt=Math.min(.1,Math.max(0,(now-(fx.lastSurfaceUpdate??now))/1000));fx.lastSurfaceUpdate=now;
   fx.groundColor.lerp(fx.groundTarget,1-Math.exp(-dt/1.8));
   // Opaque gradual color adaptation preserves a readable silhouette and skin.
   for(const entry of fx.garments)entry.material.color.copy(entry.color).lerp(fx.groundColor,s.intensity*.68);
   fx.rings.forEach((node,i)=>{node.scale.setScalar(1+(t*.35+i*.5)%1);node.material.opacity=(1-s.intensity*.65)*s.intensity*.35;});
   actor.userData.defaultAbility.surface=fx.surface||'surroundings';
  }
 }
 function registerSound(shooter,now){if(shooter?.id)sounds.set(shooter.id,{type:'paint shot',until:now+1200});}
 function sensory(players,localId,actors,now){
  const viewer=players.find(p=>p.id===localId),api=core.forCharacter('Rico'),state=api.sample(viewer?.ability,now,clock),readings=[];
  for(const p of players){const previous=history.get(p.id),activity=core.activity(previous,p);if(previous&&(previous.arenaRegion!==p.arenaRegion||previous.dropRevision!==p.dropRevision||previous.alive!==p.alive))sounds.delete(p.id);if(activity)sounds.set(p.id,{type:activity,until:now+800});history.set(p.id,{x:p.x,y:p.y,z:p.z,arenaRegion:p.arenaRegion,dropRevision:p.dropRevision,alive:p.alive});
   const source=sounds.get(p.id),heard=viewer?.character==='Rico'&&state.active&&core.audible(viewer,p)&&source?.until>now;
   const actor=actors.get(p.id);let marker=actor?.userData.hearingCue;
   if(heard&&actor&&!marker){marker=ring(actor,0x6fffe8,.10);marker.name='Rico local activity cue';marker.position.y=1.10;actor.userData.hearingCue=marker;}
   if(marker){marker.visible=!!heard;if(heard){marker.scale.setScalar(1+(now*.001)%1*.4);marker.material.opacity=.75;}}
   if(heard)readings.push((p.name||p.character)+': '+source.type);
  }
  const live=new Set(players.map(p=>p.id));for(const id of history.keys())if(!live.has(id)){history.delete(id);sounds.delete(id);}
  if(typeof window==='object')window.PaintfallHearingReadout=viewer?.character==='Rico'&&state.active?(readings.join(' · ')||'Listening — no nearby activity'):'';
 }
 return {apply,sensory,registerSound};
}

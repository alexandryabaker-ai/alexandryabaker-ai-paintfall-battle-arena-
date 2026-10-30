(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallSplashLanding=api;})(globalThis,()=>{
 const HEIGHT_UNITS=40,DESCENT_MPS=3,SPLASH_MS=1200;
 const STYLES={
  Maya:{label:'Gymnast balance',color:0xd17cff,lean:.06,left:-.72,right:.72},
  Zara:{label:'Focused glide',color:0xae8aff,lean:.025,left:-.32,right:.42},
  Nova:{label:'Energetic surf',color:0x70e9a4,lean:.08,left:-.55,right:.40},
  Skye:{label:'Dance balance',color:0x79def5,lean:.10,left:-.70,right:.30},
  Jax:{label:'Protective stance',color:0x69bfff,lean:.025,left:-.40,right:.40},
  Rico:{label:'Steady tactical glide',color:0xffaf6f,lean:.025,left:-.30,right:.30},
  Kai:{label:'Parkour balance',color:0xb48aff,lean:.11,left:-.68,right:.48},
  Dante:{label:'Quiet wave glide',color:0xef8193,lean:.035,left:-.28,right:.35}
 };
 function start(player,room,time){
  if(!room.started||!player.alive||player.grounded!==false||!(player.z>0)||player.splashLanding?.phase==='descending')return false;
  player.mounted=false;player.vz=0;player.splashLanding={id:room.round+':'+time,phase:'descending',startedAt:time};return true;
 }
 function tick(player,time,dt=.05){
  const s=player.splashLanding;if(!s)return false;
  if(!player.alive){player.splashLanding=null;return true;}
  if(s.phase==='descending'){
   player.z=Math.max(0,player.z-DESCENT_MPS*HEIGHT_UNITS*Math.max(0,Math.min(.1,dt)));player.vz=0;
   if(player.z===0){player.grounded=true;s.phase='splash';s.landedAt=time;}return true;
  }
  if(time-s.landedAt>=SPLASH_MS){player.splashLanding=null;return true;}return false;
 }
 function snapshot(player,time){const s=player.splashLanding;return player.alive&&s?{id:s.id,phase:s.phase,elapsedMs:Math.max(0,time-(s.phase==='splash'?s.landedAt:s.startedAt)),sampleAt:time}:null;}
 function render(T,actor,player,now,scene){
  const wire=player.splashLanding;let effect=actor.userData.splashEffect;
  if(!wire){if(effect)effect.node.visible=false;if(actor.userData.wasSplashPose){actor.userData.parts.body.rotation.x=0;actor.userData.parts.body.rotation.z=0;delete actor.userData.wasSplashPose;}return;}
  if(actor.userData.jumpStarted!==undefined){delete actor.userData.jumpStarted;actor.position.y=.012+Math.max(0,Number(player.z)||0)/HEIGHT_UNITS;}
  if(!effect){
   const node=new T.Group();node.name='Splash Landing paint';scene.add(node);
   const style=STYLES[player.character]||STYLES.Maya;
   const mat=color=>new T.MeshBasicMaterial({color,transparent:true,opacity:.65,depthWrite:false});
   const ring=new T.Mesh(new T.RingGeometry(.32,.38,48),mat(0x81d8ff));ring.rotation.x=-Math.PI/2;node.add(ring);
   const drops=[],colors=[0x9c83ff,0x63d9ef,0xff93bc,0xffda78,0x75e3af,0x83a8ff];const geometry=new T.SphereGeometry(1,10,8);
   for(let i=0;i<18;i++){const drop=new T.Mesh(geometry,mat(colors[i%colors.length]));node.add(drop);drops.push(drop);}
   const board=new T.Group();board.name='paint-splattered cushion surfboard';node.add(board);
   const foamGeometry=new T.CapsuleGeometry(.46,1.22,6,20);foamGeometry.rotateX(Math.PI/2);
   const foamMat=new T.MeshStandardMaterial({color:style.color,roughness:.82,transparent:true,opacity:1});
   const foam=new T.Mesh(foamGeometry,foamMat);foam.scale.set(1,.17,1);foam.position.y=-.085;foam.name='soft mattress cushion';board.add(foam);
   const dry=new T.Mesh(new T.CapsuleGeometry(.27,.75,6,20).rotateX(Math.PI/2),new T.MeshStandardMaterial({color:0xf1e6cf,roughness:.95,transparent:true,opacity:1}));dry.scale.set(1,.025,1);dry.position.y=-.012;dry.name='dry standing area';board.add(dry);
   const patches=[];
   for(let i=0;i<16;i++){
    const a=i*Math.PI*2/16,patch=new T.Mesh(geometry,new T.MeshPhysicalMaterial({color:colors[i%colors.length],roughness:.06,clearcoat:1,transparent:true,opacity:.94}));
    patch.position.set(Math.cos(a)*.365,-.009,Math.sin(a)*.91);patch.scale.set(.055,.009,.075);patch.name='wet paint on cushion edge';board.add(patch);patches.push(patch);
   }
   effect={node,ring,drops,board,patches,style,clock:{}};actor.userData.splashEffect=effect;
  }
  const clock=effect.clock;
  if(clock.id!==wire.id||clock.phase!==wire.phase||clock.sampleAt!==wire.sampleAt){clock.id=wire.id;clock.phase=wire.phase;clock.sampleAt=wire.sampleAt;clock.anchor=now-wire.elapsedMs;}
  const age=Math.max(0,now-clock.anchor),landing=wire.phase==='splash',u=Math.min(1,age/SPLASH_MS);
  effect.node.visible=player.alive!==false&&(!landing||u<1);
  effect.node.position.set(actor.position.x,landing?.022:actor.position.y,actor.position.z);
  effect.node.rotation.y=actor.rotation.y;
  effect.board.rotation.z=landing?0:Math.sin(now*.0025)*effect.style.lean*.40;
  effect.board.scale.y=landing?1-Math.sin(u*Math.PI)*.65:1;
  effect.board.visible=!landing||u<.95;
  effect.board.traverse(part=>{if(part.material)part.material.opacity=(part.name==='wet paint on cushion edge'?.94:1)*(landing?1-u:1);});
  effect.ring.scale.setScalar(landing?.6+u*2.2:.9);effect.ring.material.opacity=landing?.55*(1-u):.45;
  for(let i=0;i<effect.drops.length;i++){
   const drop=effect.drops[i],angle=i*Math.PI*2/effect.drops.length,r=landing?.18+u*(.55+(i%3)*.12):.31;
   drop.position.set(Math.cos(angle)*r,landing?Math.sin(u*Math.PI)*(.20+(i%3)*.12):.025,Math.sin(angle)*r);
   drop.scale.set(landing?.07*(1-u*.6):.045,landing?.025+.04*Math.sin(u*Math.PI):.013,landing?.07*(1-u*.6):.045);drop.material.opacity=landing?.72*(1-u):.55;
  }
  const parts=actor.userData.parts;actor.userData.wasSplashPose=true;
  parts.body.rotation.x=landing?0:-.035;
  parts.body.rotation.z=landing?0:Math.sin(now*.003)*effect.style.lean*.35;
  if(!landing){
   parts.armL.rotation.z=effect.style.left;parts.armR.rotation.z=effect.style.right;
   parts.legL.rotation.z=-.08;parts.legR.rotation.z=.08;
   parts.legL.userData.shin.rotation.x=.12;parts.legR.userData.shin.rotation.x=.12;
  }
 }
 return {HEIGHT_UNITS,DESCENT_MPS,SPLASH_MS,STYLES,start,tick,snapshot,render};
});

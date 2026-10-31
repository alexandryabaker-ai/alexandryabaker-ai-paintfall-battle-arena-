import { createNovaGameAdapter } from './paintfall-nova-game-model.js';
import { createNovaOutfit } from './paintfall-nova-outfit.js';
import './paintfall-nova-ability.js';
import { createCoreAbilityEffects } from './paintfall-core-ability-effects.js';
import { updatePlayerPaint } from './paintfall-player-paint-effects.js';
export function updateHairMotion(actor,dx,dz,dt,now,reset=false){
  const rigs=actor.userData.parts.hairDynamics;if(!rigs?.length)return;
  const previousYaw=actor.userData.hairYaw??actor.rotation.y;
  actor.userData.hairYaw=actor.rotation.y;
  const turn=Math.atan2(Math.sin(actor.rotation.y-previousYaw),Math.cos(actor.rotation.y-previousYaw));
  const speed=dt>0?Math.min(1,Math.hypot(dx,dz)/dt/6):0;
  const turnRate=dt>0?Math.max(-2,Math.min(2,turn/dt)):0;
  for(const rig of rigs){
    if(reset){rig.state={x:0,z:0,vx:0,vz:0};rig.pivot.rotation.set(0,0,0);continue;}
    const state=rig.state??={x:0,z:0,vx:0,vz:0};
    const targetX=-rig.strength*speed;
    const steps=Math.max(1,Math.ceil(dt*120)),h=Math.min(.05,dt)/steps;
    for(let i=0;i<steps;i++){
      const sampleTime=now-(steps-1-i)*h*1000;
      const targetZ=rig.strength*(Math.sin(sampleTime*.008+rig.phase)*.3*speed-turnRate*.16);
      state.vx+=((targetX-state.x)*90-state.vx*16)*h;state.vz+=((targetZ-state.z)*90-state.vz*16)*h;
      state.x+=state.vx*h;state.z+=state.vz*h;
    }
    rig.pivot.rotation.x=state.x;rig.pivot.rotation.z=state.z;
  }
}
export function createOutdoorPlayers(THREE, scene, makeCharacter, companions={}) {
  const actors = new Map(), projectiles = [], visionClock = {};
  // Owner chose the consistent procedural character while Blender likeness is parked.
  const novaModel=createNovaGameAdapter(THREE,{enabled:false});
  const coreEffects=createCoreAbilityEffects(THREE,scene);
  function remove(actor) {
    actor.userData.disposed=true;
    if(actor.userData.novaCompanion){const companion=actor.userData.novaCompanion;delete actor.userData.novaCompanion;remove(companion);}
    if(actor.userData.splashEffect){const effect=actor.userData.splashEffect.node;delete actor.userData.splashEffect;remove(effect);}
    scene.remove(actor);
    const geometries = new Set(), materials = new Set();
    actor.traverse(part => {
      if (part.geometry) geometries.add(part.geometry);
      for(const material of Array.isArray(part.material)?part.material:part.material?[part.material]:[])materials.add(material);
      if(part.isSkinnedMesh)part.skeleton.dispose();
    });
    geometries.forEach(geometry => geometry.dispose());
    // Materials may be shared by the factory (legs and boots).
    materials.forEach(material => { if (!material.userData.shared){if(material.userData.emotionLabel||material.userData.companionLabel||material.userData.sheetTexture||material.userData.playerPaintTexture)material.map?.dispose();material.dispose();} });
  }
  function position(player) {
    return { ...window.PaintfallMovement.toWorld(player),
      y: .012 + Math.max(0, Number(player.z) || 0) / 40 };
  }
  function update(players, localId, mode, now) {
    const seen = new Set();
    for (const player of players) {
      if (!player.id || seen.has(player.id)) continue;
      seen.add(player.id);
      const character = player.character || 'Maya';
      let actor = actors.get(player.id);
      if (actor && actor.userData.character !== character) { remove(actor); actors.delete(player.id); actor = null; }
      if (!actor) {
        actor = makeCharacter(character); actor.name = character;
        actor.userData.playerId = player.id;
        scene.add(actor); actors.set(player.id, actor);
        actor.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(actor);
        actor.userData.height = actor.userData.standingHeight;
        actor.userData.renderHeight = bounds.max.y - bounds.min.y;
        actor.userData.normalRenderHeight = actor.userData.renderHeight;
        if(character==='Nova'){
          actor.userData.novaFallbackOutfit=createNovaOutfit(THREE,actor);
          novaModel.attach(actor);
        }
      }
      const target = position(player), previous = actor.userData.lastPosition;
      const reset = !previous || actor.userData.round !== player.movementRound || actor.userData.region !== player.arenaRegion || actor.userData.dropRevision !== player.dropRevision || actor.userData.alive !== player.alive;
      actor.userData.dropRevision=player.dropRevision;
      const dt = Math.min(.1, Math.max(0, (now - (actor.userData.updatedAt ?? now)) / 1000));
      const next = player.id === localId || reset ? target : window.PaintfallMovement.interpolate(previous, target, dt);
      actor.userData.updatedAt = now; actor.userData.round = player.movementRound; actor.userData.alive = player.alive;
      actor.userData.region = player.arenaRegion;
      actor.userData.bullRide = player.bullRide||null;
      const dx = previous ? next.x - previous.x : 0, dz = previous ? next.z - previous.z : 0;
      if (Math.hypot(dx, dz) > .001) {
        actor.rotation.y = Math.atan2(-dx, -dz);
        actor.userData.movingUntil = now + 120;
      }
      actor.position.set(next.x, next.y, next.z);
      actor.userData.lastPosition = next;
      if (actor.userData.jumpStarted !== undefined && !player.z) {
        const progress = Math.min(1, (now - actor.userData.jumpStarted) / 650);
        actor.position.y += Math.sin(progress * Math.PI) * 2.2;
        if (progress >= 1) delete actor.userData.jumpStarted;
      }
      actor.visible = player.alive !== false && !(mode === 'first' && player.id === localId);
      const parts = actor.userData.parts, moving = now < (actor.userData.movingUntil || 0), t = now * .010;
      parts.body.position.y = actor.userData.baseBodyY + (moving ? Math.abs(Math.sin(t)) * .008 : (Math.sin(t * .5) + 1) * .002);
      parts.armL.rotation.x = moving ? Math.sin(t) * .24 : 0;
      parts.armR.rotation.x = -parts.armL.rotation.x;
      parts.armL.rotation.z = .06;
      parts.armR.rotation.z = -.06;
      parts.legL.rotation.x = moving ? -Math.sin(t) * .28 : 0;
      parts.legR.rotation.x = -parts.legL.rotation.x;
      parts.legL.userData.shin.rotation.x = moving ? Math.max(0, Math.sin(t)) * .35 : 0;
      parts.legR.userData.shin.rotation.x = moving ? Math.max(0, -Math.sin(t)) * .35 : 0;
      parts.blaster.rotation.y = moving ? Math.sin(t) * .06 : 0;
      parts.legL.rotation.z=0;parts.legR.rotation.z=0;
      if(character==='Maya')window.PaintfallMayaAbility?.apply(actor,player.ability,moving,now);
      if(character==='Zara')window.PaintfallZaraAbility?.apply(actor,player.ability,now);
      if(character==='Jax')window.PaintfallJaxAbility?.apply(actor,player.ability,moving,now);
      coreEffects.apply(actor,player,moving,now,player.grounded!==false&&!(Number(player.z)>0));
      updateHairMotion(actor,dx,dz,dt,now,reset);
      if(character==='Nova'){
        window.PaintfallNovaAbility?.apply(THREE,actor,player.ability,moving,now);
      }
      window.PaintfallSplashLanding?.render(THREE,actor,player,now,scene);
      if(character==='Nova')novaModel.update(actor,{dx:reset?0:dx,dz:reset?0:dz,dt,now,reset,grounded:player.grounded!==false&&!(Number(player.z)>0)&&actor.userData.jumpStarted===undefined,splash:!!player.splashLanding});
      updatePlayerPaint(THREE,actor,player.paint,now);
      if(character==='Nova'&&companions.create){
        let companion=actor.userData.novaCompanion;
        if(!companion){companion=companions.create();companion.name='Kirin — following Nova';scene.add(companion);actor.userData.novaCompanion=companion;}
        const ride=player.kirinRide,mounted=ride?.phase==='flying';
        companions.animate?.(companion,now,{riderMounted:mounted});
        companion.scale.setScalar(.58);
        const sample=actor.userData.novaAbilitySample,approach=ride?Math.max(0,Math.min(1,((sample?.elapsed||0)-window.PaintfallNovaAbility.SPEND_MS)/4000)):0;
        const blend=approach*approach*(3-2*approach);
        companion.position.set(next.x+Math.cos(now*.00016)*2.5*(1-blend),mounted?actor.position.y-.08:next.y+(3.2+Math.sin(now*.001)*.12)*(1-blend),next.z+Math.sin(now*.00016)*2.5*(1-blend));
        companion.rotation.y=ride?actor.rotation.y:-now*.00016-.5;companion.visible=player.alive!==false;
        actor.userData.kirinMounted=mounted;
        if(mounted){
          // Sitting on the energy body; the normal locomotion remains intact off ride.
          parts.body.position.y=actor.userData.baseBodyY;
          parts.legL.rotation.x=parts.legR.rotation.x=-1.05;
          parts.legL.rotation.z=-.24;parts.legR.rotation.z=.24;
          parts.legL.userData.shin.rotation.x=parts.legR.userData.shin.rotation.x=1.15;
          parts.armL.rotation.x=parts.armR.rotation.x=-.25;
        }
      }
    }
    const viewer=players.find(p=>p.id===localId),zara=window.PaintfallZaraAbility;
    const vision=zara?.sample(viewer?.ability,now,visionClock);
    for(const player of players){
      const actor=actors.get(player.id);if(!actor)continue;
      const emotion=zara?.readEmotion(viewer,player,vision);
      let marker=actor.userData.emotionMarker;
      if(emotion&&!marker){
        marker=new THREE.Group();
        const ring=new THREE.Mesh(new THREE.TorusGeometry(.11,.012,6,32),new THREE.MeshBasicMaterial({color:emotion.color,depthTest:true}));marker.add(ring);marker.userData.ring=ring;
        marker.name='Zara emotion vision';actor.add(marker);actor.userData.emotionMarker=marker;
      }
      if(marker){
        marker.visible=!!emotion;marker.position.y=(actor.userData.renderHeight+.18)/actor.userData.standingHeight;
        if(emotion){
          marker.userData.ring.material.color.setHex(emotion.color);
          const text=emotion.label.replace('Creative excitement','Creative').replace('Calm observation','Calm').replace('Focused coordination','Focused');
          if(marker.userData.text!==text&&typeof document!=='undefined'){
            const previous=marker.userData.label;if(previous){previous.material.map.dispose();previous.material.dispose();marker.remove(previous);}
            const canvas=document.createElement('canvas');canvas.width=384;canvas.height=112;const ctx=canvas.getContext('2d');
            ctx.fillStyle='rgba(19,12,40,.90)';ctx.fillRect(0,0,384,112);ctx.fillStyle='#'+emotion.color.toString(16).padStart(6,'0');ctx.fillRect(0,0,384,6);
            ctx.fillStyle='#fff';ctx.font='bold 64px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,192,61,360);
            const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
            const material=new THREE.SpriteMaterial({map:texture,depthTest:true,depthWrite:false});material.userData.emotionLabel=true;
            const label=new THREE.Sprite(material);label.scale.set(.95,.277,1);label.position.y=.16;marker.add(label);marker.userData.label=label;marker.userData.text=text;
          }
          marker.userData.reading=emotion.label;
        }
      }
    }
    coreEffects.sensory(players,localId,actors,now);
    for (const [id, actor] of actors) if (!seen.has(id)) { remove(actor); actors.delete(id); }
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const projectile = projectiles[i], progress = (now - projectile.start) / 1000;
      if (progress >= 1) { remove(projectile.mesh); projectiles.splice(i, 1); }
      else projectile.mesh.position.copy(projectile.origin).addScaledVector(projectile.direction, progress * 18);
    }
  }
  function jump(id) { const actor = actors.get(id); if (actor) actor.userData.jumpStarted = performance.now(); }
  function fire(detail) {
    if (!detail?.shooter) return;
    coreEffects.registerSound(detail.shooter,performance.now());
    const actor = actors.get(detail.shooter.id);
    if (!actor) return;
    actor.updateMatrixWorld(true);
    const origin = actor.userData.parts.blaster.getWorldPosition(new THREE.Vector3());
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(actor.quaternion);
    if (detail.target) { const target = position(detail.target); direction.set(target.x - origin.x, 0, target.z - origin.z).normalize(); }
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(.14, 10, 8), new THREE.MeshStandardMaterial({ color: 0x55e6ff, emissive: 0x1688ff }));
    mesh.name='paint-projectile';
    mesh.position.copy(origin); scene.add(mesh);
    projectiles.push({ mesh, origin, direction, start: performance.now() });
  }
  return { actors, position, update, jump, fire };
}

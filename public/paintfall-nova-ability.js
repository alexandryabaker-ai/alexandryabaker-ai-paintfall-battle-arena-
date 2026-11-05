(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallNovaAbility=api;})(globalThis,()=>{
 const BUILD_MS=18000,PEAK_MS=4000,SPEND_MS=BUILD_MS+PEAK_MS,ENERGY_SPENT=.85;
 // Initial tunable timing. Recovery remains depletion-dependent (1–3 minutes).
 const RECOVERY_MS=(60+120*ENERGY_SPENT)*1000,TOTAL_MS=SPEND_MS+RECOVERY_MS;
 const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
 function phase(elapsed){
  const t=Math.max(0,elapsed),spending=t<SPEND_MS,recovering=t>=SPEND_MS&&t<TOTAL_MS;
  const spent=ENERGY_SPENT*clamp(t/SPEND_MS),recovered=clamp((t-SPEND_MS)/RECOVERY_MS);
  return {active:t<TOTAL_MS,elapsed:t,spending,recovering,
   outfit:spending?smooth(t/BUILD_MS):recovering?1-smooth((t-SPEND_MS)/8000):0,
   energy:spending?1-spent:recovering?1-ENERGY_SPENT+ENERGY_SPENT*recovered:1,
   exertion:spending?smooth(t/SPEND_MS):recovering?1-smooth((t-SPEND_MS)/20000):0,
   run:spending?smooth((t-4000)/14000):0,
   label:spending?(t<6000?'Energy gallop':t<BUILD_MS?'Building momentum':'Confident run'):recovering?'Recovering energy':'Normal'};
 }
 function activate(p,r,time){
  if(!r.started||!p.alive||!p.abilityReady||p.character!=='Nova')return false;
  p.ability={type:'nova-energy',id:r.round+':'+time,startedAt:time};p.abilityReadyAt=time+Math.max(TOTAL_MS,(r.rules.cooldown||180)*1000);
  p.abilityReady=false;p.abilityCooldown=Math.ceil((p.abilityReadyAt-time)/1000);return true;
 }
 function stopRide(p){if(p.ability?.type==='nova-energy')p.ability.kirinDeclined=true;if(!p.kirinRide)return false;p.kirinRide=null;p.mounted=false;return true;}
 function tick(p,time,room){
  let changed=false;
  const age=p.ability?.type==='nova-energy'?time-p.ability.startedAt:-1;
  if(age>=SPEND_MS&&age<TOTAL_MS&&p.alive&&!p.ability.kirinDeclined&&!p.splashLanding){
   if(!p.kirinRide){p.kirinRide={phase:'approaching',startedAt:p.ability.startedAt+SPEND_MS};changed=true;}
   const rideAge=time-p.kirinRide.startedAt;
   if(rideAge>=4000){
    p.kirinRide.phase='flying';p.mounted=true;p.grounded=false;p.vz=0;
    const lift=smooth((rideAge-4000)/4000);p.z=(.08+lift*3)*40;changed=true;
   }
  }else if(p.kirinRide){
   stopRide(p);
   if(p.alive&&p.z>0&&room)rootSplash(p,room,time);
   changed=true;
  }
  if(p.ability&&(!p.alive||time-p.ability.startedAt>=TOTAL_MS)){p.ability=null;changed=true;}
  if(p.abilityReadyAt){const n=Math.max(0,Math.ceil((p.abilityReadyAt-time)/1000));if(n!==p.abilityCooldown){p.abilityCooldown=n;changed=true;}if(!n){p.abilityReadyAt=0;p.abilityReady=true;changed=true;}}
  return changed;
 }
 // Reuse the existing safe descent instead of dropping a recovering rider.
 function rootSplash(p,room,time){
  const api=typeof module==='object'&&module.exports?require('./paintfall-splash-landing.js'):globalThis.PaintfallSplashLanding;
  api?.start(p,room,time);
 }
 function snapshot(p,time){return p.alive&&p.ability?.type==='nova-energy'?{type:'nova-energy',id:p.ability.id,elapsedMs:Math.max(0,time-p.ability.startedAt),sampleAt:time}:null;}
 function sample(wire,now,clock){
  if(wire?.type!=='nova-energy'){clock.id=null;return phase(TOTAL_MS);}
  if(clock.id!==wire.id||clock.sampleAt!==wire.sampleAt){clock.id=wire.id;clock.sampleAt=wire.sampleAt;clock.anchor=now-wire.elapsedMs;}
  return phase(now-clock.anchor);
 }
 // Contact poses, not arms and legs driven by the same pendulum. The gallop
 // steps right, then gathers the trailing foot; the run has recovery and flight.
 // hip L/R X, knee L/R, hip L/R Z, lift, sway, arm L/R, elbow L/R, ankle L/R.
 const GALLOP=[
  [0,  .04,.02,-.20,-.12,-.08,.22,.002,-.012,-.10,.16,.72,.88,.03,-.18],
  [.20,.02,.05,-.48,-.30,.06,.35,.016,.008,-.17,.22,.90,.72,-.08,.12],
  [.42,.04,.00,-.62,-.16,.26,.10,.022,.018,-.04,.08,.78,.95,.10,.02],
  [.65,.02,.04,-.12,-.42,.14,-.08,.004,.006,.15,-.08,.65,.80,.02,-.24],
  [.84,.00,.02,-.26,-.62,-.10,.08,.015,-.008,.05,.12,.84,.72,-.18,.08],
  [1,  .04,.02,-.20,-.12,-.08,.22,.002,-.012,-.10,.16,.72,.88,.03,-.18]
 ];
 const RUN=[
  [0,   .78,-.55,-.32,-.48,.015,-.015,.014,0,-.48,.38,1.12,.95,.15,-.30],
  [.18, .22,-.12,-.30,-1.48,.008,-.008,.004,.003,-.10,.12,.95,1.23,.04,-.10],
  [.36,-.48,.62,-.52,-.95,-.005,.005,.026,.001,.34,-.32,1.05,1.12,-.30,.20],
  [.5, -.55,.78,-.48,-.32,-.015,.015,.014,0,.38,-.48,.95,1.12,-.30,.15],
  [.68,-.12,.22,-1.48,-.30,-.008,.008,.004,-.003,.12,-.10,1.23,.95,-.10,.04],
  [.86, .62,-.48,-.95,-.52,.005,-.005,.026,-.001,-.32,.34,1.12,1.05,.20,-.30],
  [1,   .78,-.55,-.32,-.48,.015,-.015,.014,0,-.48,.38,1.12,.95,.15,-.30]
 ];
 function poseAt(keys,cycle){
  const u=((cycle%1)+1)%1;let i=0;while(keys[i+1][0]<u)i++;
  const a=keys[i],b=keys[i+1],t=smooth((u-a[0])/(b[0]-a[0]));return a.slice(1).map((v,j)=>v+(b[j+1]-v)*t);
 }
 function gait(cycle,run){const a=poseAt(GALLOP,cycle),b=poseAt(RUN,cycle),t=clamp(run);return a.map((v,i)=>v+(b[i]-v)*t);}
 function apply(T,actor,wire,moving,now){
  const p=actor.userData.parts,s=sample(wire,now,actor.userData.novaAbilityClock??={});
  actor.userData.novaEnergy=s.energy;actor.userData.novaAbilityPhase=s.label;
  actor.userData.novaOutfitProgress=s.outfit;
  actor.userData.novaAbilitySample=s;
  if(!actor.userData.novaGame)actor.userData.novaFallbackOutfit?.update(s.outfit);
  // Locomotion owns all bones/contacts. Ability sampling controls outfit, energy
  // and the gallop-to-run blend, not a second clock-driven pose pass.
  let sweat=actor.userData.novaSweat;
  if(!sweat){
   const group=new T.Group();group.name='Nova exertion sweat';p.body.add(group);
   const material=new T.MeshPhysicalMaterial({color:0xc4f5ff,roughness:.12,metalness:0,clearcoat:1,transparent:true,opacity:.8,depthWrite:false});
   const geometry=new T.SphereGeometry(1,6,5),drops=[];
   const height=actor.userData.standingHeight;
   for(let i=0;i<40;i++){const drop=new T.Mesh(geometry,material);drop.name='Sweat droplet';drop.userData.seed=i*.618;group.add(drop);drops.push(drop);}
   const energyRing=new T.Mesh(new T.TorusGeometry(.12,.009,5,32),new T.MeshBasicMaterial({color:0x78e631,transparent:true,opacity:.8}));energyRing.name='Nova energy gauge';energyRing.rotation.x=Math.PI/2;energyRing.position.y=1.10;group.add(energyRing);
   sweat={group,drops,height,energyRing};actor.userData.novaSweat=sweat;
  }
  sweat.group.visible=s.active;sweat.energyRing.scale.setScalar(.35+s.energy*.65);sweat.energyRing.material.color.setHex(s.energy<.3?0xffb844:0x78e631);
  const strength=s.exertion,count=Math.floor(strength*40);
  sweat.drops.forEach((drop,i)=>{
   drop.visible=i<count;
   const seed=drop.userData.seed,cycle=(now*.0006+seed)%1,angle=i*2.399;
   const neck=i%4===0;
   const r=neck?.066:.072;
   drop.position.set(Math.cos(angle)*r,(neck?.855:.969)-cycle*(neck?.065:.055),Math.sin(angle)*r*.82-.008);
   drop.scale.set(.0018+strength*.0015,.003+cycle*.004,.0018+strength*.0015);
  });
  return s;
 }
 return {BUILD_MS,PEAK_MS,SPEND_MS,RECOVERY_MS,TOTAL_MS,phase,activate,tick,stopRide,snapshot,sample,gait,apply};
});

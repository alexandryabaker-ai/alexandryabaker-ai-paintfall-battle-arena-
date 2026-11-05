(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports){module.exports=api;return;}
 if(root.__paintfallBotBrain)return;root.__paintfallBotBrain=true;
 root.PAINTFALL_BOT_PROFILES=api.profiles;root.PAINTFALL_BOT_BRAIN=api;root.PAINTFALL_BOTS=[];
 // Observe the actual server bots rather than running a competing local roster.
 root.addEventListener('paintfall-party-state',e=>{
  root.PAINTFALL_BOTS=(e.detail?.players||[]).filter(p=>p.bot);
  for(const bot of root.PAINTFALL_BOTS)root.dispatchEvent(new CustomEvent('paintfall-bot-decision',{detail:{bot,decision:bot.decision}}));
 });
})(globalThis,()=>{
 const profiles={
  Milo:{role:'Scout',emoji:'🧭',attack:.45,team:.25,risk:.2,curiosity:.9,planning:.8,focus:.55,weapon:'sniper'},
  Tessa:{role:'Guardian',emoji:'🛡️',attack:.5,team:1,risk:.2,curiosity:.45,planning:.75,focus:.85,weapon:'paint'},
  Ando:{role:'Tactician',emoji:'🧠',attack:.5,team:.8,risk:.1,curiosity:.2,planning:1,focus:.95,weapon:'paint'},
  Blaze:{role:'Rusher',emoji:'⚡',attack:1,team:.4,risk:1,curiosity:.55,planning:.25,focus:.65,weapon:'paint'},
  Ziggy:{role:'Trickster',emoji:'🕵️',attack:.55,team:.45,risk:.8,curiosity:1,planning:.7,focus:.5,weapon:'paint'}
 };
 const names=Object.keys(profiles),distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 const teammates=(a,b)=>a.team!==undefined&&a.team!==null&&a.team===b.team;
 function chooseAction(bot,world,random=Math.random){
  const p=profiles[bot.profile]||profiles.Milo;
  const nearby=(world.players||[]).filter(x=>x.id!==bot.id&&x.alive!==false&&x.arenaRegion===bot.arenaRegion);
  const enemies=nearby.filter(x=>!teammates(bot,x)),mates=nearby.filter(x=>teammates(bot,x));
  const nearest=enemies.sort((a,b)=>distance(bot,a)-distance(bot,b))[0];
  const danger=nearest&&distance(bot,nearest)<180;
  const teammateDanger=mates.find(m=>enemies.some(e=>distance(m,e)<120));
  if(p.team>.7&&teammateDanger)return{type:'support',target:teammateDanger.id,reason:'protect teammate'};
  if(p.risk<.25&&danger)return{type:'retreat',target:nearest.id,reason:'reassess danger'};
  if(p.curiosity>.85&&random()<.12)return{type:'investigate',reason:'interesting map event'};
  if(nearest&&random()<Math.min(1,.25+p.attack*.55))return{type:'attack',target:nearest.id,reason:'best tactical target'};
  if(p.planning>.8)return{type:'reposition',reason:'plan better route'};
  if(p.curiosity>.7)return{type:'flank',target:nearest?.id,reason:'creative route'};
  return{type:'patrol',reason:'check surroundings'};
 }
 function makeBot(profileName,index=0){const p=profiles[profileName]||profiles.Milo;return{id:'bot-'+profileName.toLowerCase(),bot:true,name:profileName,profile:profileName,role:p.role,emoji:p.emoji,alive:true,hp:100,kills:0,x:120+(index%4)*180,y:120+Math.floor(index/4)*170,weapon:'paint',decision:null,nextThink:0};}
 const buildRoster=count=>Array.from({length:Math.max(0,Math.min(8,count))},(_,i)=>makeBot(names[i%names.length],i));
 function think(bot,world,now,random=Math.random){
  if(now<(bot.nextThink||0)||!bot.alive)return;
  bot.decision=chooseAction(bot,world,random);bot.nextThink=now+(650+random()*650)*(1.15-(profiles[bot.profile]||profiles.Milo).focus*.25);
 }
 function tick(bot,room,now,movement,random=Math.random){
  if(!room.started||!bot.bot||!bot.alive||bot.mounted||bot.bullRide||bot.splashLanding)return null;
  const profile=profiles[bot.profile]||profiles.Milo;
  bot.botBrain??={profile:bot.profile||names[0],nextThink:0,lastAt:now,waypoint:null,nextShot:now+1000};
  const b=bot.botBrain,dt=Math.min(.1,Math.max(0,(now-b.lastAt)/1000));b.lastAt=now;
  if(!dt)return null;
  const own={...bot,profile:b.profile,nextThink:b.nextThink},world={players:[...room.players.values()]};
  think(own,world,now,random);b.nextThink=own.nextThink;bot.decision=own.decision||bot.decision;
  const decision=bot.decision||{type:'patrol'},target=room.players.get(decision.target);
  const valid=target&&target.alive!==false&&target.arenaRegion===bot.arenaRegion;
  let dx=0,dy=0;
  if(valid&&['attack','retreat','support','flank'].includes(decision.type)){
   dx=target.x-bot.x;dy=target.y-bot.y;const d=Math.hypot(dx,dy);
   // Drop points can be shared. An overlapping target has no retreat direction.
   if(d<1){const angle=random()*Math.PI*2;dx=Math.cos(angle);dy=Math.sin(angle);}else{dx/=d;dy/=d;}
   if(decision.type==='retreat'){dx=-dx;dy=-dy;}
   else if(decision.type==='flank'){const side=Math.sin(now*.0006)>0?1:-1;[dx,dy]=[-dy*side+dx*.3,dx*side+dy*.3];}
   else if(d<(decision.type==='support'?160:220)){const side=Math.sin(now*.001+bot.x*.01)>0?1:-1;[dx,dy]=[-dy*side,dx*side];}
  }else{
   const at=movement.toWorld(bot),region=movement.regions[bot.arenaRegion];
   if(!b.waypoint||now>b.waypoint.until||Math.hypot(b.waypoint.x-at.x,b.waypoint.z-at.z)<1){
    const angle=random()*Math.PI*2,r=4+random()*8,bound=(region?.bound||20)-1;
    b.waypoint={x:Math.max(-bound,Math.min(bound,at.x+Math.cos(angle)*r)),z:Math.max(-bound,Math.min(bound,at.z+Math.sin(angle)*r)),until:now+5000};
   }
   const goal=movement.toGameplay(b.waypoint);dx=goal.x-bot.x;dy=goal.y-bot.y;
  }
  if(now<(b.detourUntil||0)){dx=b.detourX;dy=b.detourY;}
  const length=Math.hypot(dx,dy)||1;dx/=length;dy/=length;
  const pace=.42+profile.risk*.35,trial=movement.apply(bot,{x:dx*pace,y:dy*pace,dt});
  if(distance(bot,trial)<.1){
   const alternatives=[{x:-dy,y:dx},{x:dy,y:-dx},{x:-dx,y:-dy}].map(v=>({direction:v,position:movement.apply(bot,{x:v.x*pace,y:v.y*pace,dt})}));
   alternatives.sort((a,b)=>distance(bot,b.position)-distance(bot,a.position));Object.assign(bot,alternatives[0].position);b.waypoint=null;
   b.detourX=alternatives[0].direction.x;b.detourY=alternatives[0].direction.y;b.detourUntil=now+700;
  }else Object.assign(bot,trial);
  if(valid&&decision.type==='attack'&&!teammates(bot,target)&&now>=b.nextShot&&distance(bot,target)<480){
   const clear=movement.constrain(bot,target);b.nextShot=now+1200+(1-profile.attack)*1800;
   if(distance(clear,target)<1)return{shoot:target};
  }
  return null;
 }
 return{profiles,names,buildRoster,makeBot,chooseAction,think,tick};
});

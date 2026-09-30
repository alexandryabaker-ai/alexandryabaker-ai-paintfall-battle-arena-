(()=>{
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const HEROES={
    Maya:{core:'confidence',peak:'copy',overdrive:'visibility',tell:'fiercer-strut'},
    Zara:{core:'curiosity',peak:'discover',overdrive:'distraction',tell:'secret-agent-focus'},
    Nova:{core:'optimism',peak:'boost',overdrive:'overcommit',tell:'skip-to-run'},
    Skye:{core:'calm-observation',peak:'mark',overdrive:'slow-reaction',tell:'dance-focus'},
    Jax:{core:'leadership-presence',peak:'draw-attention',overdrive:'overprotect',tell:'commanding-presence'},
    Rico:{core:'coordination',peak:'coordinate',overdrive:'overthink',tell:'deliberate-movement'},
    Kai:{core:'creativity',peak:'distract',overdrive:'backfire',tell:'chaotic-improv'},
    Dante:{core:'patience',peak:'counter',overdrive:'grip-trap',tell:'vanishing-act'}
  };
  const defaults={confidence:.35,curiosity:.35,energy:.35,awareness:.35,leadership:.35,coordination:.35,creativity:.35,patience:.35,grip:.25};
  function make(name){return {name,values:{...defaults},state:'balanced',tell:null,updatedAt:Date.now()};}
  function score(b,key,delta){b.values[key]=clamp((b.values[key]||0)+delta);}
  function evaluate(b,signals={}){
    const n=b.name,v=b.values;
    if(n==='Maya'){if(signals.success)score(b,'confidence',.08);if(signals.helpedTeam)score(b,'confidence',.1);b.state=v.confidence>.8?'overdrive':v.confidence>.58?'peak':v.confidence>.4?'rising':'balanced';b.tell=v.confidence>.58?'fiercer-strut':null;}
    if(n==='Zara'){if(signals.discovery)score(b,'curiosity',.12);if(signals.pickup)score(b,'curiosity',.06);b.state=v.curiosity>.82?'overdrive':v.curiosity>.58?'peak':v.curiosity>.4?'rising':'balanced';b.tell=v.curiosity>.58?'secret-agent-focus':null;}
    if(n==='Nova'){if(signals.helpedTeam)score(b,'energy',.1);if(signals.success)score(b,'energy',.05);b.state=v.energy>.82?'overdrive':v.energy>.58?'peak':v.energy>.4?'rising':'balanced';b.tell=v.energy>.58?'skip-to-run':null;}
    if(n==='Skye'){if(signals.marked)score(b,'awareness',.1);b.state=v.awareness>.82?'overdrive':v.awareness>.58?'peak':v.awareness>.4?'rising':'balanced';b.tell=v.awareness>.58?'dance-focus':null;}
    if(n==='Jax'){if(signals.protected)score(b,'leadership',.1);if(signals.success)score(b,'leadership',.04);b.state=v.leadership>.82?'overdrive':v.leadership>.58?'peak':v.leadership>.4?'rising':'balanced';b.tell=v.leadership>.58?'commanding-presence':null;}
    if(n==='Rico'){if(signals.coordinated)score(b,'coordination',.1);b.state=v.coordination>.82?'overdrive':v.coordination>.58?'peak':v.coordination>.4?'rising':'balanced';b.tell=v.coordination>.58?'deliberate-movement':null;}
    if(n==='Kai'){if(signals.creative)score(b,'creativity',.12);if(signals.distraction)score(b,'creativity',.08);b.state=v.creativity>.82?'overdrive':v.creativity>.58?'peak':v.creativity>.4?'rising':'balanced';b.tell=v.creativity>.58?'chaotic-improv':null;}
    if(n==='Dante'){if(signals.waited)score(b,'patience',.1);if(signals.grip)score(b,'grip',.12);b.state=Math.max(v.patience,v.grip)>.82?'overdrive':Math.max(v.patience,v.grip)>.58?'peak':Math.max(v.patience,v.grip)>.4?'rising':'balanced';b.tell=v.grip>.58?'surface-grip':v.patience>.58?'vanishing-act':null;}
    b.updatedAt=Date.now();
    window.dispatchEvent(new CustomEvent('paintfall-hero-brain-update',{detail:{name:b.name,state:b.state,tell:b.tell,values:{...b.values}}}));
    return b;
  }
  function recover(b,amount=.08){Object.keys(b.values).forEach(k=>b.values[k]=clamp(b.values[k]-amount));return evaluate(b);}
  window.PAINTFALL_HERO_BRAIN={HEROES,make,evaluate,recover,clamp};
  const localName=window.PAINTFALL_SELECTED_CHARACTER||localStorage.getItem('paintfallCharacter')||'Maya';
  window.PAINTFALL_LOCAL_HERO_BRAIN=make(localName);
  window.paintfallHeroSignal=(signals)=>evaluate(window.PAINTFALL_LOCAL_HERO_BRAIN,signals||{});
  window.paintfallHeroRecover=()=>recover(window.PAINTFALL_LOCAL_HERO_BRAIN);
  window.addEventListener('paintfall-character-selected',e=>{if(e.detail?.name){window.PAINTFALL_LOCAL_HERO_BRAIN=make(e.detail.name);}});
})();
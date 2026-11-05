// Presentation adapter shared by the in-game atlas and regional scene pages.
// Construction pages retain their authoring/inspection presentation without ?play=world.
(() => {
 const play=new URLSearchParams(location.search).get('play'),drop=play==='drop';if(play!=='world'&&!drop)return;
 document.body.classList.add('world-play');
 const atlas=!!document.getElementById('atlas'),css=document.createElement('style');
 css.textContent=atlas?`
 .world-play #region-layout,.world-play #layout-title,.world-play #identity-panel,.world-play #state-foundation,.world-play #hometown,.world-play #secret-park,.world-play #preview-link,.world-play header>a,.world-play #summary{display:none!important}
 .world-play .grid~section{display:none!important}.world-play aside>:not(label[for=place]):not(#place):not(#region-title):not(#state-land-link):not(#totals):not(#world-play-hint){display:none!important}
 .world-play #state-land-link{display:block;padding:14px;border-radius:10px;text-align:center;background:#47786a;color:white;text-decoration:none;font-weight:700}.world-play #world-play-hint{font-size:14px;color:#bfd6d8}
 `:`
 .world-play header .heading{font-size:12px}.world-play #land-description,.world-play #land-name,.world-play #land-cues,.world-play #country-components,.world-play #land-state,.world-play label[for=land-state],.world-play #state-count,.world-play #state-plan,.world-play .open,.world-play aside>.note,.world-play #batch-interiors>.note{display:none!important}
 .world-play #land-view{min-height:360px}.world-play #walk-help{display:block!important}.world-play #land-status{font-size:12px}
 `;document.head.append(css);
 let dropTouched=false;
 if(drop){document.addEventListener('pointerdown',()=>dropTouched=true,{capture:true});document.addEventListener('change',()=>dropTouched=true,{capture:true});document.addEventListener('keydown',()=>dropTouched=true,{capture:true});}
 const post=(name,mode)=>{if(parent!==window&&(!drop||dropTouched))parent.postMessage({type:'paintfall-world-place',name,mode},location.origin);};
 if(atlas){
  document.querySelector('header h1').textContent=drop?'Choose your arena destination':'Explore the World';document.querySelector('header p').textContent=drop?'Choose a country, territory or U.S. state, then confirm your safe drop point.':'Choose a place to discover its landscapes, homes and wildlife.';
  const eyebrow=document.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='PAINTFALL / WORLD MAP';
  const hint=document.createElement('p');hint.id='world-play-hint';hint.textContent=drop?'Your selection sets your actual arena destination. Friends can pick the same place or choose their own.':'Regional exploration is open for testing. Amusement-park travel comes after the parks are designed.';document.querySelector('aside').append(hint);
  function update(){const name=document.getElementById('region-title').textContent.trim(),link=document.getElementById('state-land-link');if(!name||!link)return;
   const states=document.getElementById('states-mode').getAttribute('aria-pressed')==='true',u=new URL(states?'/us-land-build.html':'/country-land-build.html',location.origin);u.searchParams.set('play','world');u.searchParams.set(states?'state':'country',name);if(!states)u.searchParams.set('region','country');link.href=u.href;link.textContent=drop?'Selected: '+name:'Explore '+name;if(drop){link.removeAttribute('href');link.style.pointerEvents='none';}const totals=document.getElementById('totals');if(totals)totals.textContent=totals.textContent.split(' • ').slice(0,2).join(' • ');post(name,states?'state':'country');
  }
  new MutationObserver(update).observe(document.getElementById('region-title'),{childList:true,characterData:true,subtree:true});update();
 }else{
  let activePlace='';const selector=document.getElementById('land-state'),walk=()=>document.getElementById('walk-land');
  function update(){const name=document.getElementById('land-title').textContent.trim();if(!name||name===activePlace)return;activePlace=name;
   const isCountry=new URLSearchParams(location.search).get('region')==='country',mode=isCountry?'country':'state';
   document.querySelector('header h1').textContent='Explore '+name;const heading=document.querySelector('.heading');if(heading)heading.textContent='PAINTFALL / WORLD EXPLORATION';
   const hint=document.querySelector('header small');if(hint)hint.textContent='Use WASD or arrow keys to explore. Drag to turn the view.';
   const landmarkNote=document.querySelector('#landmark-tools > p');if(landmarkNote)landmarkNote.textContent='Discover local landscapes, landmarks and homes.';
   const wildlifeNote=document.querySelector('#wildlife-tools > p');if(wildlifeNote)wildlifeNote.textContent=wildlifeNote.textContent.startsWith('Landscape-only')?'Explore this landscape and its surroundings.':'Watch the wildlife or approach gently. Animals can choose company or space.';
   const link=document.querySelector('header a'),u=new URL('/world-build.html',location.origin);u.searchParams.set('play','world');u.searchParams.set(isCountry?'country':'state',name);if(!isCountry)u.searchParams.set('focus','us');link.href=u.href;link.textContent='Back to World Map';
   const b=walk();if(b?.getAttribute('aria-pressed')==='false')b.click();if(b)new MutationObserver(renameWalk).observe(b,{childList:true,attributes:true,attributeFilter:['aria-pressed']});renameWalk();post(name,mode);
   const state=document.getElementById('land-status');if(state)state.textContent=name+' • World exploration';
  }
  new MutationObserver(update).observe(document.getElementById('land-title'),{childList:true,characterData:true,subtree:true});
  const renameWalk=()=>{const b=walk(),label=b?.getAttribute('aria-pressed')==='true'?'Aerial view':'Explore on foot';if(b&&b.textContent!==label)b.textContent=label;};
  document.addEventListener('click',e=>{if(e.target===walk())requestAnimationFrame(renameWalk);});
  new MutationObserver(renameWalk).observe(document.getElementById('land-view'),{childList:true});
  update();
 }
})();

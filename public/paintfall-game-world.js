// World exploration reuses the regional scene runtime inside the game shell.
// Regional exploration is local; live arena rounds keep their existing server/world.
(() => {
 if(document.getElementById('paintfall-world-entry'))return;
 const entry=document.createElement('section');entry.id='paintfall-world-entry';
 const heading=document.createElement('h2');heading.textContent='Explore the World';
 const note=document.createElement('p');note.textContent='Discover countries, territories and U.S. states, with regional landscapes, homes and wildlife.';
 const open=document.createElement('button');open.id='open-world-map';open.type='button';open.textContent='Open World Map';
 const parks=document.createElement('button');parks.id='open-coming-soon-parks';parks.type='button';parks.textContent='Amusement parks • Coming soon';parks.style.marginLeft='8px';
 entry.append(heading,note,open,parks);
 const anchor=document.getElementById('paintfallCreateChaos')||document.querySelector('main')||document.getElementById('game');
 if(anchor)anchor.before(entry);else document.body.append(entry);
 const dialog=document.createElement('dialog');dialog.id='paintfall-game-world';dialog.setAttribute('aria-labelledby','game-world-title');
 const bar=document.createElement('div');bar.className='game-world-bar';
 const title=document.createElement('h2');title.id='game-world-title';title.textContent='PAINTFALL World';
 const back=document.createElement('button');back.type='button';back.textContent='World Map';
 const close=document.createElement('button');close.type='button';close.textContent='Return to Game';
 const status=document.createElement('p');status.id='game-world-status';status.setAttribute('role','status');status.textContent='Choose a place to explore. Amusement-park travel is coming later.';
 const frame=document.createElement('iframe');frame.id='game-world-frame';frame.title='PAINTFALL world exploration';frame.referrerPolicy='same-origin';
 bar.append(title,back,close);dialog.append(bar,status,frame);document.body.append(dialog);
 const css=document.createElement('style');css.textContent=`
 #paintfall-world-entry{margin:14px auto;padding:18px;max-width:1100px;border:1px solid #536b74;border-radius:18px;background:#172e39;color:#edf6ec}#paintfall-world-entry h2{margin:0 0 8px}#paintfall-world-entry p{color:#bfd6d8}#paintfall-world-entry button,#paintfall-game-world button{font:700 15px system-ui;padding:10px 15px;border:1px solid #8cbdc1;border-radius:9px;color:#edf6ec;background:#2c525d;cursor:pointer}
 #paintfall-game-world{box-sizing:border-box;width:min(1500px,98vw);height:96dvh;max-width:98vw;max-height:96dvh;padding:0;border:1px solid #7a9c9e;border-radius:16px;background:#101d29;color:#edf6ec;overflow:hidden}#paintfall-game-world[open]{display:flex;flex-direction:column}#paintfall-game-world::backdrop{background:#08121bea}.game-world-bar{display:flex;align-items:center;gap:12px;padding:10px 14px;flex-wrap:wrap}.game-world-bar h2{font:700 19px system-ui;margin:0 auto 0 0}#game-world-status{font:13px/1.4 system-ui;margin:0;padding:0 14px 10px;color:#bfd6d8}#game-world-frame{flex:1;width:100%;min-height:0;border:0;background:#10232c}@media(max-width:600px){#paintfall-game-world{width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;border-radius:0}.game-world-bar{gap:6px}.game-world-bar h2{width:100%}#paintfall-game-world button{padding:9px;font-size:13px}}
 `;document.head.append(css);
 let lastCountry='',lastState='',previousOverflow='',returnFocus=null;
 function mapUrl(){const u=new URL('/world-build.html',location.origin);u.searchParams.set('play','world');if(lastState){u.searchParams.set('focus','us');u.searchParams.set('state',lastState);}else if(lastCountry)u.searchParams.set('country',lastCountry);return u.href;}
 function release(){if(!window.PAINTFALL_WORLD_EXPLORING)return;window.PAINTFALL_WORLD_EXPLORING=false;frame.removeAttribute('src');document.body.style.overflow=previousOverflow;window.dispatchEvent(new Event('blur'));window.dispatchEvent(new CustomEvent('paintfall-world-closed'));returnFocus?.focus();}
 function show(parkView=false){
  if(dialog.open)return;
  const game=document.getElementById('game');if(game&&!game.classList.contains('hidden')&&(game.classList.contains('started')||window.__paintfallLatest3DState?.started)){note.textContent='Finish or leave your current match to explore the world.';return;}
  returnFocus=document.activeElement;previousOverflow=document.body.style.overflow;
  window.PAINTFALL_WORLD_EXPLORING=true;window.dispatchEvent(new Event('blur'));document.body.style.overflow='hidden';
  const place=document.querySelector('#paintfallCreateChaos select[aria-label="Arena"]')?.value||'state:New Mexico';
  status.textContent=parkView?'Amusement parks • Coming soon • Construction sneak peeks available for selected parks.':'Choose a place to explore. Amusement-park travel is coming later.';frame.src=parkView?'/park-progress.html?place='+encodeURIComponent(place):mapUrl();dialog.showModal();close.focus();window.dispatchEvent(new CustomEvent('paintfall-world-opened'));
 }
 open.addEventListener('click',()=>show());parks.addEventListener('click',()=>show(true));close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',release);
 window.addEventListener('paintfall-3d-state',e=>{if(dialog.open&&e.detail?.started){dialog.close();note.textContent='Your match has started. The world map is available after the match.';}});
 back.addEventListener('click',()=>{frame.src=mapUrl();status.textContent='Choose a place to explore. Amusement-park travel is coming later.';});
 window.addEventListener('message',e=>{
  if(!dialog.open||e.origin!==location.origin||e.source!==frame.contentWindow||e.data?.type!=='paintfall-world-place')return;
  const {name,mode}=e.data;if(typeof name!=='string'||name.length>100||!['country','state'].includes(mode))return;
  if(mode==='state'){lastState=name;lastCountry='';}else{lastCountry=name;lastState='';}
  status.textContent=name+' • Local world exploration • Park travel will be added after design review.';
 });
})();

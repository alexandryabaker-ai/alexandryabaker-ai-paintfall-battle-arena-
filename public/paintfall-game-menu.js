// Game choices come first. Existing room controls keep their bindings and
// saved preferences, and are revealed only after choosing Paintball Battle.
(()=>{
 function init(){
  const root=document.getElementById('paintfallCreateChaos');if(!root||document.getElementById('pf-game-options'))return;
  const modes=window.PaintfallGameModes,head=root.querySelector('.ccHead'),home=document.createElement('div'),setup=document.createElement('div');
  home.id='pf-game-options';setup.id='pf-room-setup';setup.hidden=true;
  const intro=head?.querySelector('small');if(intro)intro.textContent='Choose how you want to play. More adventures are on the way.';
  const heading=document.createElement('h2');heading.textContent='Choose your game';home.append(heading);
  const choices=document.createElement('nav');choices.className='pf-mode-choices';choices.setAttribute('aria-label','Game options');home.append(choices);
  for(const mode of modes.modes){
   const button=document.createElement('button');button.type='button';button.id='pf-play-'+mode.id;button.disabled=!mode.available;button.setAttribute('aria-label',modes.label(mode.id));
   const name=document.createElement('strong'),detail=document.createElement('span');name.textContent=mode.name;detail.textContent=mode.available?'Play • Choose your hero, create a room or join friends':'Coming soon';button.append(name,detail);choices.append(button);
   if(mode.available)button.onclick=()=>{if(!window.PAINTFALL_ACCOUNT_LOCKED)showSetup();};
  }
  for(const child of [...root.children])if(child!==head)setup.append(child);
  const back=document.createElement('button');back.type='button';back.id='pf-back-to-games';back.textContent='← Game options';
  const setupHeading=document.createElement('h2');setupHeading.textContent='Paintball Battle • Room setup';setup.prepend(back,setupHeading);root.append(home,setup);
  let inSetup=false;
  function sync(){
   const party=document.getElementById('paintfallPartyLobby');if(party)party.hidden=!inSetup;
   const world=document.getElementById('paintfall-world-entry');if(world&&world.parentElement!==home)home.append(world);
   return !!party&&!!world;
  }
  function showSetup(){inSetup=true;home.hidden=true;setup.hidden=false;sync();root.querySelector('#ccHeroSelect')?.focus();}
  back.onclick=()=>{inSetup=false;setup.hidden=true;home.hidden=false;sync();document.getElementById('pf-play-paintball').focus();};
  const observer=new MutationObserver(()=>{if(sync())observer.disconnect();});observer.observe(document.body,{childList:true,subtree:true});if(sync())observer.disconnect();
  const style=document.createElement('style');style.textContent=`#pf-game-options[hidden],#pf-room-setup[hidden],#paintfallPartyLobby[hidden]{display:none!important}#pf-game-options h2,#pf-room-setup h2{font:800 19px system-ui;margin:20px 0 12px}.pf-mode-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.pf-mode-choices button{display:flex;flex-direction:column;gap:8px;align-items:flex-start;justify-content:center;min-height:106px;padding:18px;text-align:left;border:1px solid #697da6;border-radius:16px;background:#1d2e48;color:#f7f8ff;cursor:pointer}.pf-mode-choices strong{font:850 21px system-ui}.pf-mode-choices span{font:14px/1.4 system-ui;color:#b9c9df}.pf-mode-choices button:not(:disabled){border:2px solid #9fe2cf;background:linear-gradient(135deg,#285052,#24364d)}.pf-mode-choices button:disabled{background:#1b2234;border-color:#49546d;cursor:default}.pf-mode-choices button:disabled strong{color:#aeb9ce}.pf-mode-choices button:focus-visible,#pf-back-to-games:focus-visible{outline:3px solid #ffd65b;outline-offset:3px}#pf-back-to-games{margin:12px 0 0;padding:10px 14px;border:1px solid #8aa1bc;border-radius:10px;background:#25364f;color:#fff}#pf-game-options #paintfall-world-entry{margin:18px 0 0;padding:14px}#pf-game-options #paintfall-world-entry h2{margin-top:0}@media(max-width:550px){.pf-mode-choices{grid-template-columns:1fr}.pf-mode-choices button{min-height:90px;padding:15px}.pf-mode-choices strong{font-size:19px}}`;document.head.append(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

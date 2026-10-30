// Keep a disconnected arena from appearing playable, including after a phone
// sleeps or loses Wi-Fi. Retry rejoins the existing room; it never creates one.
(()=>{function init(){
 const panel=document.createElement('section');panel.id='pf-room-connection';panel.hidden=true;
 panel.setAttribute('role','alert');panel.innerHTML='<h2>Room connection interrupted</h2><p id="pf-room-connection-message"></p><button id="pf-room-reconnect" type="button">Rejoin this room</button><button id="pf-room-connection-menu" type="button">Return to menu</button>';
 document.getElementById('game').prepend(panel);
 const button=document.getElementById('pf-room-reconnect'),message=document.getElementById('pf-room-connection-message');
 let familyHost=false;
 function show(text){if(!window.PAINTFALL_ROOM_CODE)return;window.PAINTFALL_CONNECTION_LOST=true;window.dispatchEvent(new Event('blur'));for(const id of ['pf-arena-drop','pf-family-approval']){const dialog=document.getElementById(id);if(dialog?.open)dialog.close();}panel.hidden=false;message.textContent=text;button.hidden=familyHost;button.disabled=false;}
 window.addEventListener('paintfall-network-status',e=>{const text=e.detail?.message||'';if(!panel.hidden)message.textContent=text;if(/connection (?:closed|failed|lost)|session expired|timed out|did not acknowledge/i.test(text))show(familyHost?'Your private Family Room closed when its host disconnected. Return to the menu to host a new one.':text);});
 window.addEventListener('paintfall-party-joined',e=>{familyHost=!!e.detail?.family&&e.detail.hostId===e.detail.id;panel.hidden=true;button.disabled=false;window.PAINTFALL_CONNECTION_LOST=false;});
 window.addEventListener('paintfall-family-message',e=>{if(e.detail?.type==='family-closed'){show(e.detail.message);button.hidden=true;}});
 window.addEventListener('paintfall-party-pending',e=>{if(!panel.hidden)button.disabled=!!e.detail;});
 button.onclick=()=>{button.disabled=true;window.dispatchEvent(new Event('paintfall-party-rejoin'));};
 document.getElementById('pf-room-connection-menu').onclick=()=>location.reload();
 const style=document.createElement('style');style.textContent='#pf-room-connection[hidden]{display:none!important}#pf-room-connection{position:fixed;z-index:2147483647;top:calc(14px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);width:min(520px,94vw);max-height:75dvh;overflow:auto;border:2px solid #ffcf73;border-radius:16px;padding:16px;background:#19293af5;box-shadow:0 10px 40px #000b;color:#fff}#pf-room-connection h2{font:800 19px system-ui;margin:0 0 10px}#pf-room-connection p{line-height:1.5}#pf-room-connection button{min-height:44px;margin:5px}#pf-room-connection button[hidden]{display:none}#pf-room-connection button:disabled{opacity:.5}';document.head.append(style);
 }if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();

(()=>{
const LABELS={Maya:['✨ Confident stride','🔥 Fiercer movement'],Zara:['💡 Curious focus','🕵️ Tactical focus'],Nova:['⚡ Energetic movement','🏃 Momentum'],Skye:['🎧 Calm scouting','💃 Street-dance focus'],Jax:['💪 Strong presence','🛡️ Protective stance'],Rico:['🧠 Deliberate movement','📡 Team coordination'],Kai:['😎 Playful movement','🌀 Chaotic flourish'],Dante:['🥷 Quiet movement','🧗 Surface grip']};
let badge,brainName=localStorage.getItem('paintfallCharacter')||'Maya';
function installLandscapeFix(){
 if(document.getElementById('paintfallLandscapeFix'))return;
 const style=document.createElement('style');style.id='paintfallLandscapeFix';style.textContent=`
@media (max-width:1100px) and (orientation:landscape){
 html,body{overflow:hidden!important;width:100%;height:100%;}
 main{max-width:none!important;width:100%;height:100vh;padding:4px!important;margin:0!important;overflow:hidden;}
 #game{height:100vh;min-height:0;display:flex;flex-direction:column;overflow:hidden;}
 #rotateHint{display:none!important;}
 #hud{flex:0 0 auto;padding:2px 0!important;gap:4px!important;}
 #hud .hint{display:none!important;}
 #paintHitsTop{flex:0 0 auto;margin:2px 0!important;padding:4px 8px!important;font-size:14px!important;}
 #arena{flex:1 1 auto!important;width:auto!important;height:auto!important;max-width:100%!important;max-height:calc(100vh - 108px)!important;aspect-ratio:1200/700;object-fit:contain;margin:0 auto!important;min-height:0;}
 #controls{display:flex!important;left:0;right:0;bottom:6px!important;padding:0 10px!important;z-index:40!important;}
 #controls .stick{width:92px;height:92px;}
 #controls .knob{width:42px;height:42px;left:23px;top:23px;}
 #controls .mobileActions{gap:8px;}
 #controls .mobileAction{width:68px;height:68px;font-size:11px;}
 .weaponbar{position:fixed;left:4px;right:4px;top:4px;z-index:35;justify-content:center;margin:0!important;padding:2px!important;gap:3px!important;background:#090b12cc;border:1px solid #ffffff20;border-radius:10px;backdrop-filter:blur(5px);}
 .weaponbar button{padding:5px 6px!important;font-size:9px!important;}
 .stats{position:fixed;left:4px;top:34px;z-index:36;margin:0!important;}
 #game>.row{position:fixed;left:50%;bottom:4px;transform:translateX(-50%);z-index:39;margin:0!important;gap:4px!important;}
 #game>.row button{padding:6px 8px!important;font-size:10px!important;}
 .legend{display:none!important;}
}
@media (max-width:700px) and (orientation:portrait){#controls{display:flex!important;}}
`;
 document.head.appendChild(style);
}
function ensure(){if(badge||!document.getElementById('arena'))return;badge=document.createElement('div');badge.id='paintfallBehaviorCue';badge.style.cssText='position:fixed;left:50%;bottom:152px;transform:translateX(-50%);padding:8px 14px;border-radius:999px;background:#121827dd;border:1px solid #ffffff2e;color:#fff;font:700 13px system-ui;z-index:30;opacity:.88;pointer-events:none;backdrop-filter:blur(8px);transition:transform .2s,opacity .2s,box-shadow .2s';document.body.appendChild(badge);update('balanced');}
function update(state,tell){ensure();if(!badge)return;const l=LABELS[brainName]||LABELS.Maya;badge.textContent=state==='peak'||state==='overdrive'?l[1]:l[0];badge.style.transform='translateX(-50%) scale('+(state==='overdrive'?1.08:state==='peak'?1.04:1)+')';badge.style.opacity=state==='balanced'?'.68':'.95';badge.style.boxShadow=state==='overdrive'?'0 0 22px #ff4fd866':'0 0 14px #7047ff33';}
window.addEventListener('paintfall-character-selected',e=>{brainName=e.detail?.name||brainName;update('balanced');});
window.addEventListener('paintfall-hero-brain-update',e=>{update(e.detail?.state,e.detail?.tell);});
function install(){const O=window.WebSocket;if(!O||O.__pfVisibleBrain)return;const W=function(...a){const s=new O(...a),old=s.onmessage;s.addEventListener('message',ev=>{try{const m=JSON.parse(ev.data);if(m.type==='state'){const me=m.players?.find(p=>p.id===window.__paintfallLocalId);if(me){const near=(m.players||[]).some(p=>p.id!==me.id&&p.alive&&Math.hypot(p.x-me.x,p.y-me.y)<170);if(brainName==='Maya'&&me.kills+me.paintHits/3>.0)window.paintfallHeroSignal?.({success:me.kills>0,helpedTeam:near});if(brainName==='Nova'&&near)window.paintfallHeroSignal?.({helpedTeam:true});if(brainName==='Dante'&&near)window.paintfallHeroSignal?.({waited:true});}}if(m.type==='joined')window.__paintfallLocalId=m.id;}catch{}});if(old)s.onmessage=old;return s};W.prototype=O.prototype;W.__pfVisibleBrain=true;window.WebSocket=W;}
function boot(){installLandscapeFix();ensure();install();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();setInterval(()=>{installLandscapeFix();ensure()},500);
})();
// Lightweight arena-only captions and original synthesized sound effects.
// No music, downloads, or extra audio libraries. Settings are per browser.
export function createArenaAccessibility({host,isActive=()=>true}){
 const read=(key,fallback)=>{try{const v=localStorage.getItem(key);return v===null?fallback:v==='true';}catch{return fallback;}};
 const save=(key,v)=>{try{localStorage.setItem(key,String(v));}catch{}};
 let captionsOn=read('paintfall-arena-captions',false),soundOn=read('paintfall-arena-sound',true);
 let audio=null,clearTimer=null,disposed=false,lastEffect=new Map();
 const controls=document.createElement('div');
 controls.id='pf-arena-accessibility';
 controls.style.cssText='position:absolute;z-index:6;top:37px;left:12px;display:flex;gap:6px;flex-wrap:wrap;max-width:55%;';
 function makeToggle(label,description,enabled,change){
  const button=document.createElement('button');button.type='button';button.style.cssText='font:700 11px system-ui;padding:6px 9px;border-radius:9px;background:rgba(15,25,40,.85);border:1px solid #c5d7e2;color:white;touch-action:manipulation;cursor:pointer;';
  button.setAttribute('aria-label',description);
  const refresh=()=>{const on=enabled();button.setAttribute('aria-pressed',String(on));button.textContent=label+' '+(on?'ON':'OFF');};
  button.addEventListener('click',()=>{change();refresh();});
  refresh();controls.append(button);return refresh;
 }
 const caption=document.createElement('div');caption.id='pf-arena-caption';caption.hidden=true;
 caption.setAttribute('role','status');caption.setAttribute('aria-live','polite');caption.setAttribute('aria-atomic','true');
 caption.style.cssText='position:absolute;z-index:5;left:50%;bottom:12px;transform:translateX(-50%);width:max-content;max-width:min(92%,650px);box-sizing:border-box;padding:9px 13px;background:rgba(8,13,24,.88);color:#fff;border-radius:9px;font:600 clamp(13px,2vw,18px)/1.4 system-ui;text-align:center;pointer-events:none;white-space:normal;overflow-wrap:anywhere;text-shadow:0 1px 2px #000;';
 host.append(controls,caption);
 function clear(){if(clearTimer!==null){clearTimeout(clearTimer);clearTimer=null;}caption.hidden=true;caption.textContent='';}
 function show(speaker,text,duration=2600){
  if(disposed||!captionsOn||!isActive())return;
  if(clearTimer!==null)clearTimeout(clearTimer);
  caption.textContent=(speaker?speaker+': ':'')+String(text||'').slice(0,260);
  caption.hidden=false;clearTimer=setTimeout(()=>{clearTimer=null;clear();},duration);
 }
 function getAudio(){
  if(!soundOn||disposed)return null;
  const Ctx=globalThis.AudioContext||globalThis.webkitAudioContext;
  if(!Ctx)return null;
  try{audio=audio||new Ctx();if(audio.state==='suspended')audio.resume().catch(()=>{});return audio;}catch{return null;}
 }
 // Unlock on first real user interaction, as required by mobile browsers.
 function unlock(){if(soundOn)getAudio();}
 document.addEventListener('pointerdown',unlock,{once:true,capture:true});
 document.addEventListener('keydown',unlock,{once:true,capture:true});
 function tone(ctx,start,freq,endFreq,duration,volume,shape='sine'){
  const osc=ctx.createOscillator(),gain=ctx.createGain();
  osc.type=shape;osc.frequency.setValueAtTime(freq,start);osc.frequency.exponentialRampToValueAtTime(Math.max(25,endFreq),start+duration);
  gain.gain.setValueAtTime(Math.max(.0001,volume),start);
  gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+duration+.012);
 }
 function play(type){
  if(!soundOn||disposed||!isActive())return;
  const now=performance.now(),last=lastEffect.get(type)||0;
  if(now-last<(type==='fire'?110:180))return;
  lastEffect.set(type,now);
  const ctx=getAudio();if(!ctx||ctx.state!=='running')return;
  const t=ctx.currentTime+.006;
  if(type==='fire'){
   tone(ctx,t,330,110,.11,.07,'triangle');tone(ctx,t+.028,150,75,.13,.026,'sine');
  }else if(type==='jump'){
   tone(ctx,t,260,540,.16,.05,'sine');
  }else if(type==='animal'){
   tone(ctx,t,440,560,.12,.025,'sine');tone(ctx,t+.11,540,620,.13,.018,'sine');
  }else if(type==='land'){
   tone(ctx,t,140,65,.1,.035,'triangle');
  }
 }
 function effect(type){
  if(disposed||!isActive())return;
  const labels={fire:'[Paintball blaster fires]',jump:'[Jump]',animal:'[Animal responds]',land:'[Landing]'};
  if(labels[type])show('',labels[type],type==='animal'?2200:1200);
  play(type);
 }
 function onEffect(e){if(typeof e.detail?.type==='string')effect(e.detail.type);}
 function onDialogue(e){if(!e.detail||!isActive())return;show(e.detail.speaker||'Animal',e.detail.text||'',4500);play('animal');}
 window.addEventListener('paintfall-arena-sfx',onEffect);
 window.addEventListener('paintfall-arena-dialogue',onDialogue);
 makeToggle('CC','Toggle arena subtitles',()=>captionsOn,()=>{captionsOn=!captionsOn;save('paintfall-arena-captions',captionsOn);if(!captionsOn)clear();});
 makeToggle('SFX','Toggle arena sound effects',()=>soundOn,()=>{soundOn=!soundOn;save('paintfall-arena-sound',soundOn);if(soundOn)getAudio();});
 return {show,effect,dispose(){disposed=true;clear();controls.remove();caption.remove();window.removeEventListener('paintfall-arena-sfx',onEffect);window.removeEventListener('paintfall-arena-dialogue',onDialogue);document.removeEventListener('pointerdown',unlock,true);document.removeEventListener('keydown',unlock,true);audio?.close?.().catch?.(()=>{});}};
}

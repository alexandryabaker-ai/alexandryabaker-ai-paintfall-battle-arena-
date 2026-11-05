(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallInput=api;})(typeof window==='object'?window:globalThis,function(){
 function cameraMovement(strafe,forward,yaw=0){
  const length=Math.max(1,Math.hypot(strafe,forward));strafe/=length;forward/=length;
  const s=Math.sin(yaw),c=Math.cos(yaw);
  // Gameplay x uses 40 units/metre and y uses 25. Camera forward is world -Z.
  return{x:c*strafe+s*forward,y:(c*forward-s*strafe)*25/40};
 }
 function bindStick(stick,knob,joy,events=window){
  let pointer=null,pointerType=null,touch=null;
  function stop(e){e?.preventDefault();e?.stopPropagation();}
  function reset(){const previous=pointer;pointer=pointerType=touch=null;joy.x=joy.y=0;knob.style.transform='translate(0,0)';try{if(previous!==null&&stick.hasPointerCapture?.(previous))stick.releasePointerCapture(previous);}catch{}}
  function move(e){if(e.pointerId!==pointer)return;stop(e);const r=stick.getBoundingClientRect(),radius=Math.max(1,Math.min(r.width,r.height)/2-knob.offsetWidth/2-4),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,length=Math.hypot(dx,dy),scale=Math.min(1,length/radius);joy.x=dx/Math.max(1,length)*scale;joy.y=dy/Math.max(1,length)*scale;knob.style.transform=`translate(${joy.x*radius}px,${joy.y*radius}px)`;}
  stick.addEventListener('pointerdown',e=>{if(pointer!==null||e.button>0)return;pointer=e.pointerId;pointerType=e.pointerType||'mouse';try{stick.setPointerCapture?.(pointer);}catch{}move(e);},{passive:false});
  stick.addEventListener('pointermove',move,{passive:false});
  function release(e){if(pointer===null||e.pointerId!==pointer)return;stop(e);reset();}
  for(const type of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(type,release,{passive:false});
  // Capture can be lost during browser gestures or when a finger leaves the
  // control. Observe release at the window too, without stealing other fingers.
  for(const type of ['pointerup','pointercancel'])events.addEventListener(type,release,{capture:true,passive:false});
  events.addEventListener('pointermove',move,{capture:true,passive:false});
  stick.addEventListener('touchstart',e=>{if(pointerType==='touch'&&touch===null)touch=e.changedTouches?.[0]?.identifier??null;},{passive:true});
  function touchRelease(e){
   if(pointerType!=='touch')return;
   const remaining=Array.from(e.touches||[]),changed=Array.from(e.changedTouches||[]);
   if(touch!==null?(changed.some(t=>t.identifier===touch)||!remaining.some(t=>t.identifier===touch)):remaining.length===0)reset();
  }
  for(const type of ['touchend','touchcancel'])events.addEventListener(type,touchRelease,{capture:true,passive:true});
  events.addEventListener('blur',reset);
  events.addEventListener('pagehide',reset);
  const doc=stick.ownerDocument||events.document;
  doc?.addEventListener('visibilitychange',()=>{if(doc.hidden)reset();});
  reset();
  return{reset};
 }
 return{cameraMovement,bindStick};
});

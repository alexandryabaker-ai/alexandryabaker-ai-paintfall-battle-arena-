(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallGameModes=api;})(typeof window==='object'?window:globalThis,()=>{
 const modes=Object.freeze([
  {id:'paintball',name:'Paintball Battle',available:true},
  {id:'combat',name:'Blaster Combat',available:false},
  {id:'zombies',name:'Dragon Zombie',available:false},
  {id:'story',name:'Story Mode',available:false}
 ].map(Object.freeze));
 const find=id=>modes.find(m=>m.id===id),isPlayable=id=>!!find(id||'paintball')?.available;
 const label=id=>{const m=find(id);return m?m.name+(m.available?'':' — Coming soon'):'Coming soon';};
 function populate(select){select.replaceChildren();for(const m of modes){const o=select.ownerDocument.createElement('option');o.value=m.id;o.textContent=label(m.id);o.disabled=!m.available;select.append(o);}select.value='paintball';}
 return {modes,find,isPlayable,label,populate};
});

(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallCharacterEmotions=api;})(globalThis,()=>{
 const STATES={confident:{label:'Confident',color:0xf29ac7},curious:{label:'Curious',color:0xc3a3ef},optimistic:{label:'Optimistic',color:0xffda78},calm:{label:'Calm',color:0x7cded8},protective:{label:'Protective',color:0x81baff},focused:{label:'Focused',color:0x80d9ef},creative:{label:'Creative excitement',color:0xc8a0ff},patient:{label:'Patient',color:0xa0d6c0},excited:{label:'Excited',color:0xffd978},startled:{label:'Startled',color:0xffa983},overwhelmed:{label:'Overwhelmed',color:0xbb83ef},recovering:{label:'Recovering',color:0x9bddbd}};
 const BASE={Maya:'confident',Zara:'curious',Nova:'optimistic',Skye:'calm',Jax:'protective',Rico:'focused',Kai:'creative',Dante:'patient'};
 function cue(player,key,time,duration){if(!STATES[key])return;player.emotionCue={key,until:time+Math.max(500,Math.min(5000,duration))};}
 function tick(player,time){if(player.emotionCue&&time>=player.emotionCue.until){player.emotionCue=null;return true;}return false;}
 function current(player,time){
  let key=BASE[player.character]||'calm';
  if(player.emotionCue&&time<player.emotionCue.until)key=player.emotionCue.key;
  if(player.character==='Zara'&&player.ability?.type==='zara-emotion'){const elapsed=time-player.ability.startedAt;if(elapsed>=18000&&elapsed<21000)key='overwhelmed';}
  return {key,...STATES[key]};
 }
 return {STATES,BASE,cue,tick,current};
});

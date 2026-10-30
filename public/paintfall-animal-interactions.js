export function createAnimalInteractions({walking,getWildlife}){
 const panel=document.createElement('section');panel.id='animal-interactions';const title=document.createElement('h3');title.textContent='Meet the wildlife';const nearby=document.createElement('p'),message=document.createElement('p');nearby.id='nearby-animal';message.id='animal-response';message.setAttribute('role','status');message.className='note';message.textContent='Approach calmly. Animals can choose company or space.';panel.append(title,nearby);
 const buttons={};for(const [action,label] of [['talk','Talk softly'],['offer','Offer a pet'],['pet','Pet gently'],['space','Give space']]){const b=document.createElement('button');b.textContent=label;b.id='animal-'+action;b.onclick=()=>{request(action);document.querySelector('#land-view canvas').focus({preventScroll:true});};panel.append(b);buttons[action]=b;}panel.append(message);document.getElementById('land-description').after(panel);
 let current=null,consent=null,now=0,lastWildlife=null;
 function closest(){if(!walking.active)return null;return getWildlife()?.animals.filter(a=>Math.hypot(a.root.position.x-walking.avatar.position.x,a.root.position.z-walking.avatar.position.z)<5).sort((a,b)=>a.root.position.distanceTo(walking.avatar.position)-b.root.position.distanceTo(walking.avatar.position))[0]||null;}
 function ready(a){return a&&(a.mode==='wander'||(a.shore&&a.mode==='rest'))&&!a.swimming&&!(a.lift>.1);}
 function request(action){const a=closest();if(!a){consent=null;message.textContent='Walk closer to an animal first.';return false;}
  if(action==='space'){consent=null;a.interactionUntil=0;a.spaceUntil=now+10;a.angle+=Math.PI/2;message.textContent='You give '+a.kind+' room to choose its own path.';return true;}
  if(action==='pet'){if(consent?.animal!==a||consent.until<now||a.spaceUntil>now||!ready(a)){consent=null;message.textContent=a.kind+' has not accepted a pet right now.';return false;}if(Math.hypot(a.root.position.x-walking.avatar.position.x,a.root.position.z-walking.avatar.position.z)>2.8){message.textContent=a.kind+' accepted your offer. Move a little closer gently.';return false;}a.interactionUntil=now+3;consent=null;message.textContent=a.kind+' accepts a gentle pet, then continues at its own pace.';return true;}
  if(a.requestAfter>now){message.textContent=a.kind+' needs a little time. Let it choose.';return false;}
  a.requestAfter=now+6;consent=null;
  if(!ready(a)||a.spaceUntil>now){message.textContent=a.kind+' prefers space right now.';return false;}
  // Species inclination, individual mood and familiarity all affect a voluntary response.
  const cautious=a.cautious||/wolf|deer|crane|robin/i.test(a.kind),mood=(Math.floor(a.phase/3)+a.kind.length)%5;
  const accepts=action==='talk'?mood!==0:(a.familiarity||0)>0&&mood>(cautious?2:1);
  if(!accepts){a.spaceUntil=now+6;a.angle+=.7;message.textContent=a.kind+' chooses to keep exploring. You can give it room.';return false;}
  if(action==='talk'){a.familiarity=(a.familiarity||0)+1;a.interactionUntil=now+2;message.textContent=a.kind+' pauses to listen to your soft voice.';}
  else{a.interactionUntil=now+6;consent={animal:a,until:now+6};message.textContent=a.kind+' stays nearby and accepts your offer. You may pet gently.';}
  return true;
 }
 function update(dt){now+=dt;const wildlife=getWildlife();panel.hidden=!wildlife;if(wildlife!==lastWildlife){lastWildlife=wildlife;consent=null;message.textContent='Approach calmly. Animals can choose company or space.';}current=closest();if(consent&&(!current||current!==consent.animal||consent.until<now||!ready(current)))consent=null;const distance=current?Math.hypot(current.root.position.x-walking.avatar.position.x,current.root.position.z-walking.avatar.position.z):Infinity;nearby.textContent=!walking.active?'Close-up view is for watching. Choose Walk this state to approach an animal.':current?'Nearby: '+current.kind+' • '+distance.toFixed(1)+' steps away':'Walk closer to an animal; talking is available within five steps.';buttons.talk.disabled=buttons.offer.disabled=buttons.space.disabled=!current;buttons.pet.disabled=!current||consent?.animal!==current||distance>2.8;}
 return{update,request,get consent(){return consent;},get time(){return now;}};
}




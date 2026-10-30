// Read the existing private account records; this book awards no gameplay rewards.
export function discoveryEntries(profile,catalog){
 const places=[...new Set(profile?.progress?.visitedRegions||[])].filter(id=>Object.hasOwn(catalog,id)).map(id=>({id,name:catalog[id].name})).sort((a,b)=>a.name.localeCompare(b.name));
 const animals=Object.entries(profile?.animalMemories||{}).flatMap(([id,memory])=>{
  const [region,kind,individual]=id.split('|');
  return Object.hasOwn(catalog,region)&&kind&&/^\d+$/.test(individual||'')?[{id,region,place:catalog[region].name,kind,memory}]:[];
 }).sort((a,b)=>a.place.localeCompare(b.place)||a.kind.localeCompare(b.kind));
 return {places,animals};
}

export function createWorldDiscoveryBook({host,isActive,getRegion}){
 const catalog=window.PaintfallArenaCatalog||{},guestPlaces=new Set(),guestAnimals={};
 const button=document.createElement('button');button.id='pf-discovery-open';button.type='button';button.textContent='📖 DISCOVERY BOOK';button.hidden=true;
 button.style.cssText='position:absolute;z-index:4;top:87px;left:12px;padding:9px 11px;border:1px solid #ffd166;border-radius:11px;background:#30224b;color:#fff;font:900 11px system-ui;touch-action:manipulation';host.append(button);
 const style=document.createElement('style');style.textContent='#pf-discovery-book{width:min(720px,94vw);max-height:85dvh;overflow:auto;touch-action:pan-y;color:#f5f0ff;background:#161d30;border:2px solid #a78bfa;border-radius:20px;padding:24px}#pf-discovery-book::backdrop{background:#080c18b8}#pf-discovery-book header{display:flex;align-items:center;justify-content:space-between;gap:12px}#pf-discovery-book h2{margin:0;color:#ffd166}#pf-discovery-book h3{margin-bottom:8px}#pf-discovery-book ul{padding-left:22px}#pf-discovery-book li{margin:10px 0}#pf-discovery-book small{color:#b9c7dc}#pf-discovery-book .pf-book-animal{list-style:none;border-left:3px solid #54d6c6;padding:8px 12px;margin-left:-20px;background:#202940;border-radius:8px}#pf-discovery-book .pf-book-animal strong,#pf-discovery-book .pf-book-animal small{display:block}';document.head.append(style);
 const dialog=document.createElement('dialog');dialog.id='pf-discovery-book';dialog.setAttribute('aria-labelledby','pf-book-title');
 const header=document.createElement('header'),title=document.createElement('h2');title.id='pf-book-title';title.textContent='World Discovery Book';
 const close=document.createElement('button');close.type='button';close.textContent='Back to arena';header.append(title,close);
 const intro=document.createElement('p');intro.textContent='Places you’ve been. Personalities you’ve met. Your PAINTFALL journey.';
 const status=document.createElement('p');status.id='pf-book-status';status.setAttribute('role','status');
 const content=document.createElement('div');content.id='pf-book-content';dialog.append(header,intro,status,content);document.body.append(dialog);
 let serial=0,disposed=false;
 function list(title,items,empty,draw){const section=document.createElement('section'),h=document.createElement('h3');h.textContent=title+' · '+items.length;section.append(h);
  if(items.length){const ul=document.createElement('ul');for(const item of items){const li=document.createElement('li');draw(li,item);ul.append(li);}section.append(ul);}else{const p=document.createElement('p');p.textContent=empty;section.append(p);}content.append(section);}
 async function refresh(){const request=++serial;content.replaceChildren();status.textContent='Opening your discoveries…';
  try{const response=await fetch('/api/account',{credentials:'same-origin',cache:'no-store'});if(!response.ok)throw Error('Your book could not be loaded. Close it and try again.');const data=await response.json();if(disposed||request!==serial||!dialog.open)return;
   if(!data.account&&!data.serverGroup)throw Error('Sign in or choose Play as guest to open your book.');
   const guest=!data.account,profile=data.account?.profile||{progress:{visitedRegions:[...guestPlaces]},animalMemories:guestAnimals},entries=discoveryEntries(profile,catalog);
   status.textContent=guest?'Guest book — these discoveries last for this page only. Sign in to save future adventures.':'Your saved discoveries on this game server. Animal encounters update after a successful memory save.';
   list('Places visited',entries.places,'Choose a destination and enter the arena to begin your journey.',(li,p)=>{li.textContent=p.name;});
   list('Animal encounters',entries.animals,'Approach an animal and say hello. Your encounters will appear here.',(li,a)=>{li.className='pf-book-animal';const name=document.createElement('strong'),place=document.createElement('small'),memory=document.createElement('span');name.textContent=a.kind;place.textContent=a.place;
    const m=a.memory,notes=[];if(m.meetings)notes.push('Greetings: '+m.meetings);if(m.paintHits)notes.push('Paint encounters: '+m.paintHits);if(m.apologies)notes.push('Apologies: '+m.apologies);if(m.spaceGiven)notes.push('Given space: '+m.spaceGiven);if(m.prefersWalking)notes.push('Remembers you prefer walking');memory.textContent=notes.join(' · ')||'Encounter remembered';li.append(name,place,memory);});
  }catch(error){if(!disposed&&request===serial){content.replaceChildren();status.textContent=error.message;}}
 }
 function open(){if(!isActive()||window.PAINTFALL_DROP_CHOOSING||dialog.open)return;window.PAINTFALL_DISCOVERY_OPEN=true;window.dispatchEvent(new Event('blur'));dialog.showModal();close.focus();refresh();}
 button.onclick=open;close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{serial++;window.PAINTFALL_DISCOVERY_OPEN=false;window.dispatchEvent(new Event('blur'));button.focus();});
 function encounter(event){const d=event.detail;if(d?.guest&&d.animalId&&d.memory)guestAnimals[d.animalId]={...d.memory};if(dialog.open)refresh();}
 function expired(){guestPlaces.clear();for(const key of Object.keys(guestAnimals))delete guestAnimals[key];content.replaceChildren();if(dialog.open)dialog.close();}
 window.addEventListener('paintfall-animal-encounter',encounter);window.addEventListener('paintfall-account-expired',expired);
 return {update(){const active=isActive();button.hidden=!active;if(active&&Object.hasOwn(catalog,getRegion()))guestPlaces.add(getRegion());if(!active&&dialog.open)dialog.close();},dispose(){disposed=true;serial++;if(dialog.open)dialog.close();window.removeEventListener('paintfall-animal-encounter',encounter);window.removeEventListener('paintfall-account-expired',expired);button.remove();dialog.remove();style.remove();}};
}

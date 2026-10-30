(()=>{
 const catalog=window.PaintfallArenaCatalog||{},select=document.getElementById('park-place'),cards=document.getElementById('park-cards');
 const parks=[['hub','World Hub','#e4b8ff','A meeting place for adventures and sky-coaster journeys.'],['building','Building Park','#ffa876','Architecture-inspired rides with a PAINTFALL twist.'],['garden','Garden Park','#89ddab','Gardens, colorful discoveries and imaginative rides.'],['paint','Paint Park','#85d9f0','Water adventures, playful color and space to relax.'],['racing',"Racin’ Park",'#f9d76b','Speed, surprising turns and vehicles with personality.']];
 const previews={};
 for(const state of ['Nevada','Arizona','California'])for(const [key]of parks){const rideKey=key==='paint'?'water':key;previews['state:'+state+'|'+key]=state==='Nevada'?rideKey:state.toLowerCase()+'-'+(state==='Arizona'?rideKey:key);}
 previews['state:Utah|building']='utah-building';
 const concepts={'state:Utah':['hub','building','garden','paint','racing'],'state:Colorado':['hub','building','garden','paint','racing'],'state:New Mexico':['hub','building','paint']};
 for(const place of Object.values(catalog).sort((a,b)=>a.name.localeCompare(b.name)||a.type.localeCompare(b.type))){const o=document.createElement('option');o.value=place.id;o.textContent=place.name+(place.type==='state'?' — U.S. state':' — country/territory');select.append(o);}
 const requested=new URLSearchParams(location.search).get('place');select.value=catalog[requested]?requested:'state:New Mexico';
 function render(){const place=catalog[select.value];if(!place)return;document.getElementById('place-title').textContent=place.name+' • Amusement parks';cards.replaceChildren();
  for(const [key,name,color,description]of parks){
   const card=document.createElement('article');card.className='park';card.style.setProperty('--accent',color);
   const badge=document.createElement('span');badge.className='badge';badge.textContent='Coming soon';
   const title=document.createElement('h2');title.textContent=name;const text=document.createElement('p');text.textContent=description;card.append(badge,title,text);
   const preview=previews[place.id+'|'+key];
   if(preview){const link=document.createElement('a');link.className='preview';link.textContent='Sneak peek • Construction preview';link.href='/park-build.html?park='+encodeURIComponent(preview);card.append(link);}
   else{const note=document.createElement('span');note.className='pending';note.textContent=concepts[place.id]?.includes(key)?'Ride ideas in development • Preview coming later':'Future park • Preview coming later';card.append(note);}
   cards.append(card);
  }
 }
 select.addEventListener('change',render);render();
})();

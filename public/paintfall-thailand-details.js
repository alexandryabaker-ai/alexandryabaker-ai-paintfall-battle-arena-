// Local preview routines. The clock is accelerated and independent of real-world time.
export function finishThailandPreview(T,{land,wildlife,landmarks,neighborhood,ground,canOccupy,scene,sunlight,camera,controls,walking}){
 const tools=document.createElement('section');tools.id='thailand-details';document.getElementById('wildlife-tools').after(tools);
 const title=document.createElement('h3');title.textContent='Thailand living-world preview';tools.append(title);const label=document.createElement('label');label.textContent='Preview time ';const clock=document.createElement('select');clock.id='thailand-time';for(const [value,text] of [['dusk','Dusk'],['day','Day'],['night','Night'],['cycle','Automatic cycle']]){const o=document.createElement('option');o.value=value;o.textContent=text;clock.append(o);}label.append(clock);tools.append(label);
 const info=document.createElement('p');info.className='note';info.textContent='Time changes animal activity. Swimming and climbing use local habitat routes. Interior buttons show furnished cutaways; they are inspection views.';tools.append(info);
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.9}),bark=mat(0x87725d),leaf=mat(0x82ad92);function box(parent,x,y,z,w,h,d,m){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 const cutaways=[];
 for(const [i,home] of neighborhood.homes.entries()){
  const shell=[...home.children].filter(o=>o.isMesh&&(o.position.y>4.5||(Math.abs(o.position.z)>2.5&&o.position.y>2)||(o.geometry.type==='BoxGeometry'&&o.geometry.parameters.height>2)));
  const furnishing=new T.Group();furnishing.name='PAINTFALL interior furnishings';home.add(furnishing);const cream=mat(0xe4d6bb),violet=mat(0xb6a0cc),wood=mat(0x8f7053);box(furnishing,-.65,2.14,-.4,2.8,.06,3.2,cream);for(let k=0;k<8;k++)box(furnishing,-.65,2.18,-1.8+k*.4,2.6,.015,.04,violet);box(furnishing,-.65,2.5,-.4,1.4,.15,.9,wood);for(const x of [-1.2,-.1])box(furnishing,x,2.3,-.4,.08,.35,.08,wood);box(furnishing,1.3,2.6,-1.4,.7,.9,1.5,wood);box(furnishing,-1.45,2.22,1.15,.65,.15,.55,violet);box(furnishing,.15,2.22,1.15,.65,.15,.55,violet);box(furnishing,1.3,3.1,-1.4,.3,.1,.3,cream);
  const view=document.createElement('button');view.textContent='Look inside Teakglow home '+(i+1);view.onclick=()=>{walking.setActive(false);cutaways.forEach(({shell})=>shell.forEach(o=>o.visible=true));shell.forEach(o=>o.visible=false);controls.minDistance=3;controls.target.copy(home.position).add(new T.Vector3(0,2.7,0));camera.position.copy(home.position).add(new T.Vector3(7,8,10));controls.update();};tools.append(view);cutaways.push({shell,furnishing});
 }
 const close=document.createElement('button');close.textContent='Restore house exteriors';close.onclick=()=>cutaways.forEach(({shell})=>shell.forEach(o=>o.visible=true));tools.append(close);
 const binturong=wildlife.animals.find(a=>a.kind==='Binturong'),otter=wildlife.animals.find(a=>a.kind.includes('otter'));
 let tree;
 if(binturong){const p=binturong.root.position.clone(),g=new T.Group();g.name='wildlife climbing tree';g.position.copy(p);land.add(g);box(g,0,2.2,-.8,.35,4.4,.35,bark);box(g,.65,3.2,-.8,1.6,.15,.18,bark);for(let i=0;i<5;i++){const m=new T.Mesh(new T.IcosahedronGeometry(1.1,1),leaf);m.position.set(Math.cos(i*2.4),4.5+Math.sin(i)*.3,-.8+Math.sin(i*2.4));g.add(m);}tree=g;binturong.perchTree=g;binturong.climbBase=p;binturong.perch=p.clone().add(new T.Vector3(.8,3.28,-.8));}
 let swimPath=[];
 if(otter){const v=landmarks.visits.find(v=>/canal/i.test(v.name));if(v){let run=[];for(let i=0;i<29;i++){const z=v.target.z-8+i*.55,x=v.target.x+Math.sin(i*.2)*2,p=ground(x,z);if(p&&canOccupy(x,z)){run.push(p);if(run.length>swimPath.length)swimPath=[...run];}else run=[];}if(swimPath.length>=3){otter.shore=swimPath[0].clone();otter.root.position.copy(otter.shore);otter.ripple=new T.Mesh(new T.TorusGeometry(.35,.02,4,20),mat(0xcdebea));otter.ripple.rotation.x=-Math.PI/2;otter.ripple.visible=false;land.add(otter.ripple);}}}
 const originalUpdate=wildlife.update;let seconds=0,habitatTime=0;clock.onchange=()=>{seconds=0;habitatTime=0;};const initialBackground=scene.background.clone(),initialFog=scene.fog.color.clone(),initialSun=sunlight.intensity;
 function habitat(a,phase){const base=a.climbBase,before=a.root.position.clone();let p;
  if(phase<6){p=base.clone().lerp(a.perch,T.MathUtils.smoothstep(phase,0,6));a.mode='climb';}
  else if(phase<15){p=a.perch.clone();a.mode='perch';}
  else{p=a.perch.clone().lerp(base,T.MathUtils.smoothstep(phase,15,21));a.mode='climb down';}
  a.root.position.copy(p);a.lift=Math.max(0,p.y-base.y);a.distance+=Math.hypot(p.x-before.x,p.z-before.z);a.root.rotation.y=0;a.head.rotation.x=.05;a.legs.forEach((l,i)=>l.rotation.x=a.mode==='perch'?0:Math.sin(habitatTime*5+i)*.2);
 }
 wildlife.update=dt=>{seconds+=dt;habitatTime+=dt;const time=window.PAINTFALL_US_LAND?.interactions?.time||0,phase=clock.value==='cycle'?(seconds%120<45?'day':seconds%120<65?'dusk':'night'):clock.value;
  const day=phase==='day';scene.background.set(day?0xaecbd8:phase==='night'?0x35435f:0xa28ea8);scene.fog.color.copy(scene.background);sunlight.intensity=day?2.4:phase==='night'?.65:1.3;
  const special=new Set();for(const a of wildlife.animals){if(a.interactionUntil>time)continue;if(day&&['Binturong','Malayan porcupine'].includes(a.kind)){special.add(a);a.mode='rest';a.head.rotation.x=.1;a.legs.forEach(l=>l.rotation.x=0);continue;}
   if(a===binturong&&a.climbBase){const p=habitatTime%45;if(p<21){special.add(a);habitat(a,p);}else if(a.lift){a.root.position.copy(a.climbBase);a.lift=0;a.mode='wander';}}
   if(a===otter&&swimPath.length>=3){const p=habitatTime%36;if(p>=6&&p<28){special.add(a);const blend=(p-6)/22,index=(1-Math.abs(2*blend-1))*(swimPath.length-1),i=Math.floor(index),target=swimPath[i].clone().lerp(swimPath[Math.min(i+1,swimPath.length-1)],index-i);target.y-=.13;a.distance+=a.root.position.distanceTo(target);a.root.position.copy(target);a.swimming=true;a.mode='swim';a.root.rotation.y=blend<.5?0:Math.PI;a.legs.forEach((l,i)=>l.rotation.x=Math.sin(habitatTime*8+i)*.3);a.ripple.visible=true;a.ripple.position.copy(target).add(new T.Vector3(0,.24,0));}else {if(a.swimming){a.root.position.copy(a.shore);a.mode='wander';}a.swimming=false;a.ripple.visible=false;}}
  }
  const all=wildlife.animals;wildlife.animals=all.filter(a=>!special.has(a)); // Original closure retains its array, so pause excluded animals through the interaction guard.
  const paused=[...special].map(a=>[a,a.interactionUntil]);for(const [a]of paused)a.interactionUntil=time+1;originalUpdate(dt);for(const [a,until]of paused)a.interactionUntil=until;wildlife.animals=all;
 };
 return{tools,tree,swimPath,cutaways,clock,dispose(){wildlife.update=originalUpdate;tools.remove();scene.background.copy(initialBackground);scene.fog.color.copy(initialFog);sunlight.intensity=initialSun;}};
}


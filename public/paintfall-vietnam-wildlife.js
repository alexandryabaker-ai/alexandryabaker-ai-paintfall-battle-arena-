// Five individual wildlife studies; no populations, attacks or exact ecosystem simulation.
export const vietnamWildlifeRoster=[
 {kind:'Sunda pangolin',scientificName:'Manis javanica',routine:'investigate',nocturnal:true,speed:.35},
 {kind:"Owston's civet",scientificName:'Chrotogale owstoni',routine:'sniff',nocturnal:true,speed:.65},
 {kind:'Red-shanked douc',scientificName:'Pygathrix nemaeus',routine:'browse',arboreal:true,speed:0},
 {kind:'Red-bellied squirrel',scientificName:'Callosciurus erythraeus',routine:'forage',arboreal:true,speed:1},
 {kind:'Asian black bear',scientificName:'Ursus thibetanus',routine:'forage',speed:.55}
];

export function buildVietnamWildlife(T,{land,ground,canOccupy,explorer,getInteractionTime=()=>0}){
 const group=new T.Group();group.name='vietnam-wildlife';land.add(group);const animals=[],habitatObstacles=[];
 const materials={dark:new T.MeshStandardMaterial({color:0x393a42,roughness:.95}),brown:new T.MeshStandardMaterial({color:0x998064,roughness:.95}),cream:new T.MeshStandardMaterial({color:0xe4d7bb,roughness:.95}),rust:new T.MeshStandardMaterial({color:0xb96848,roughness:.95}),gray:new T.MeshStandardMaterial({color:0x8b9099,roughness:.95}),violet:new T.MeshStandardMaterial({color:0xa99ac2,roughness:.95}),leaf:new T.MeshStandardMaterial({color:0x88b69b,roughness:.95})};
 let period='day',seconds=0;
 const waterBounds=[];land.traverse(o=>{if(!o.isMesh)return;const material=Array.isArray(o.material)?o.material[0]:o.material;if(/water|stream|river|ribbon|paddy/i.test(o.name)||material?.color?.getHex()===0x79c7d7)waterBounds.push(new T.Box3().setFromObject(o));});
 function valid(x,z){return Math.hypot(x,z)<68&&canOccupy(x,z)&&!!ground(x,z)&&!waterBounds.some(b=>x>b.min.x-.6&&x<b.max.x+.6&&z>b.min.z-.6&&z<b.max.z+.6)&&!habitatObstacles.some(o=>Math.abs(x-o.x)<o.halfX+.4&&Math.abs(z-o.z)<o.halfZ+.4);}
 function ellipsoid(parent,x,y,z,sx,sy,sz,material){const m=new T.Mesh(new T.SphereGeometry(1,14,10),material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
 function rod(parent,a,b,r,material){const d=b.clone().sub(a),m=new T.Mesh(new T.CylinderGeometry(r*.7,r,d.length(),8),material);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());parent.add(m);return m;}
 function curvedTail(parent,points,r,material){const tail=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),24,r,8,false),material);parent.add(tail);return tail;}
 function habitat(p,index){const tree=new T.Group();tree.name='PAINTFALL canopy habitat '+index;tree.position.copy(p);group.add(tree);rod(tree,new T.Vector3(),new T.Vector3(0,5,0),.22,materials.brown);rod(tree,new T.Vector3(0,2.6,0),new T.Vector3(3.2,2.8,0),.14,materials.brown);const support=rod(tree,new T.Vector3(2.2,2.8,0),new T.Vector3(3.2,2.8,0),.2,materials.brown);support.name='Animal supporting branch';rod(tree,new T.Vector3(0,4,0),new T.Vector3(-1.4,4.4,.6),.09,materials.brown);for(const [x,y,z]of [[0,5.4,0],[-1.2,4.9,.6],[1.1,5.1,-.5]])ellipsoid(tree,x,y,z,1.3,.8,1.2,materials.leaf);habitatObstacles.push({x:p.x,z:p.z,halfX:.3,halfZ:.3});return tree;}
 for(const [index,spec] of vietnamWildlifeRoster.entries()){
  let p;for(let i=0;i<1600;i++){const a=i*2.4+index,r=6+Math.sqrt(i)*1.2,x=explorer.position.x+Math.cos(a)*r,z=explorer.position.z+Math.sin(a)*r;if(valid(x,z)&&animals.every(a=>Math.hypot(x-a.base.x,z-a.base.z)>5)&&(!spec.arboreal||[[-1,0],[1,0],[2,0],[3,0],[3,1]].every(([dx,dz])=>valid(x+dx,z+dz)))){p=ground(x,z);break;}}
  if(!p)continue;
  const root=new T.Group(),head=new T.Group(),legs=[];root.name=spec.kind;group.add(root);
  const bear=spec.kind==='Asian black bear',douc=spec.kind==='Red-shanked douc',squirrel=spec.kind==='Red-bellied squirrel',pangolin=spec.kind==='Sunda pangolin';
  const w=bear?.55:douc?.23:squirrel?.14:.22,h=bear?.48:douc?.4:squirrel?.17:.2,length=bear?.85:douc?.26:squirrel?.28:.5,y=bear?.8:douc?.9:squirrel?.3:.32,coat=bear?materials.dark:douc?materials.gray:materials.brown;
  ellipsoid(root,0,y,0,w,h,length,coat);head.position.set(0,douc?1.5:y+.08,douc?.12:length*.85);root.add(head);ellipsoid(head,0,0,0,w*.72,h*.7,.22,douc?materials.cream:coat);
  ellipsoid(head,0,-.035,.2,pangolin?.08:w*.5,.08,pangolin?.25:.12,douc?materials.rust:materials.brown);
  for(const side of [-1,1]){ellipsoid(head,side*w*.55,.025,.15,.024,.025,.025,materials.dark);if(!pangolin)ellipsoid(head,side*w*.7,.15,-.07,bear?.12:.05,bear?.13:.065,.04,coat);}
  for(let i=0;i<4;i++){const leg=new T.Group();leg.position.set(i%2?w*.7:-w*.7,douc?(i<2?1.1:.7):y-.1,i<2?length*.55:-length*.55);root.add(leg);const size=douc?(i<2?.6:.65):y-.1;rod(leg,new T.Vector3(),new T.Vector3(0,-size,0),bear?.09:.035,douc?(i<2?materials.cream:materials.rust):coat);if(douc||squirrel){const paw=ellipsoid(leg,0,-size,0,douc?.07:.045,.035,douc?.1:.065,douc&&i<2?materials.cream:materials.dark);paw.name=douc?(i<2?'Douc hand':'Douc foot'):'Squirrel paw';}legs.push(leg);}
  if(pangolin){for(let row=0;row<7;row++)for(let col=0;col<5;col++){const angle=-1.1+col*.55,z=-.43+row*.13,scale=new T.Mesh(new T.ConeGeometry(.095,.13,4),row%3===0?materials.violet:materials.brown);scale.rotation.x=Math.PI*.62;scale.position.set(Math.sin(angle)*w*.96,y+Math.cos(angle)*h*.92,z);scale.name='Overlapping pangolin scale';root.add(scale);}curvedTail(root,[new T.Vector3(0,.27,-.4),new T.Vector3(0,.19,-.75),new T.Vector3(.18,.12,-1)],.09,materials.brown);}
  else if(douc){curvedTail(root,[new T.Vector3(0,.75,-.2),new T.Vector3(-.12,.45,-.7),new T.Vector3(.18,.2,-1.1)],.045,materials.cream);ellipsoid(root,0,1.25,.03,.22,.12,.25,materials.dark);}
  else if(squirrel){ellipsoid(root,0,y,.07,w*.9,h*.95,length*.7,materials.rust);curvedTail(root,[new T.Vector3(0,.25,-.2),new T.Vector3(0,.6,-.6),new T.Vector3(.15,1,-.45)],.14,materials.brown);}
  else if(bear){for(const side of [-1,1])rod(root,new T.Vector3(side*.37,y+.18,.73),new T.Vector3(0,y-.15,.83),.055,materials.cream);}
  else{for(let i=0;i<4;i++){const band=ellipsoid(root,0,y+.07,-.35+i*.19,w*1.025,h*.9,.045,materials.dark);band.name='Civet dorsal stripe';}curvedTail(root,[new T.Vector3(0,.24,-.45),new T.Vector3(.1,.15,-.8),new T.Vector3(.24,.1,-1.05)],.065,materials.dark);}
  const a={...spec,root,head,legs,base:p.clone(),angle:index*1.3,phase:squirrel?0:index*3,timer:4,mode:'wander',distance:0,turns:0,lift:0,cautious:true,focusHeight:douc?1.2:y,interactionUntil:0};
  if(spec.arboreal){a.perchTree=habitat(p,index);a.perchTree.userData.species='Unspecified PAINTFALL canopy tree';a.perch=p.clone().add(new T.Vector3(2.7,2.98,0));a.shore=ground(p.x+3,p.z);a.base=a.shore.clone();root.position.copy(douc?a.perch:a.base);a.lift=douc?Math.max(0,a.perch.y-a.base.y):0;a.mode=douc?'browse':'wander';}
  else root.position.copy(p);
  animals.push(a);
 }
 function update(dt){dt=Math.max(0,Math.min(dt,.1));seconds+=dt;const activity=period==='cycle'?(seconds%120<55?'day':seconds%120<75?'dusk':'night'):period,time=getInteractionTime();
  for(const a of animals){if(a.interactionUntil>time){a.head.rotation.z=Math.sin(time*2)*.04;continue;}
   const resting=a.nocturnal?activity==='day':a.arboreal&&activity==='night';
   if(resting){a.mode='rest';a.head.rotation.x=.1;a.legs.forEach(l=>l.rotation.x=0);continue;}
   a.phase+=dt;a.head.rotation.z=0;
   if(a.kind==='Red-shanked douc'){a.mode='browse';a.root.position.copy(a.perch);a.root.rotation.set(0,0,0);a.lift=Math.max(0,a.perch.y-a.base.y);a.head.rotation.x=.12+Math.sin(a.phase)*.05;a.legs.forEach(l=>l.rotation.x=0);continue;}
   if(a.kind==='Red-bellied squirrel'&&a.phase%30<20){const t=a.phase%30,blend=t<6?T.MathUtils.smoothstep(t,0,6):t>14?1-T.MathUtils.smoothstep(t,14,20):1,old=a.root.position.clone();a.root.position.copy(a.base).lerp(a.perch,blend);a.lift=Math.max(0,a.root.position.y-a.base.y);a.root.rotation.set(-.55*Math.sin(blend*Math.PI),-Math.PI/2,0);a.head.rotation.set(0,0,0);a.mode=blend===1?'forage':t<6?'climb':'climb down';a.distance+=a.root.position.distanceTo(old);a.legs.forEach((l,i)=>l.rotation.x=blend===1?0:Math.sin(a.phase*8+i)*.2);continue;}
   if(a.kind==='Red-bellied squirrel'){
    const t=a.phase%30-20,x=a.base.x+Math.sin(t*Math.PI/5)*.5,z=a.base.z,p=valid(x,z)?ground(x,z):ground(a.base.x,a.base.z),old=a.root.position.clone();if(p)a.root.position.copy(p);a.distance+=a.root.position.distanceTo(old);a.lift=0;a.root.rotation.set(0,-Math.PI/2,0);a.mode=t<5?'wander':'forage';a.head.rotation.x=t<5?0:.25;a.legs.forEach((l,i)=>l.rotation.x=t<5?Math.sin(a.phase*6+i)*.12:0);continue;
   }
   a.timer-=dt;if(a.timer<=0||a.mode==='rest'||a.mode==='climb down'){a.turns++;a.mode=a.mode==='wander'?a.routine:'wander';a.timer=a.mode==='wander'?5:3;a.angle+=1.1;}
   if(a.mode==='wander'){if(a.root.position.distanceTo(explorer.position)<3||a.spaceUntil>time)a.angle=Math.atan2(a.root.position.x-explorer.position.x,a.root.position.z-explorer.position.z);const x=a.root.position.x+Math.sin(a.angle)*a.speed*dt,z=a.root.position.z+Math.cos(a.angle)*a.speed*dt,p=valid(x,z)?ground(x,z):null;if(p&&Math.abs(p.y-a.root.position.y)<.45){a.distance+=a.root.position.distanceTo(p);a.root.position.copy(p);}else a.angle+=dt*3;a.root.rotation.y=a.angle;a.head.rotation.x=0;a.legs.forEach((l,i)=>l.rotation.x=Math.sin(a.phase*6+i%2*Math.PI)*.2);}
   else{a.head.rotation.x=.2+Math.sin(a.phase*1.5)*.06;a.legs.forEach(l=>l.rotation.x=0);}
  }
 }
 return{group,animals,habitatObstacles,update,valid,setPeriod(value){if(['day','dusk','night','cycle'].includes(value))period=value;},get period(){return period;}};
}

export function createVietnamWildlifeControls({wildlife}){
 const tools=document.createElement('section');tools.id='vietnam-wildlife-controls';const heading=document.createElement('h3');heading.textContent='Vietnam forest activity';tools.append(heading);
 const label=document.createElement('label');label.htmlFor='vietnam-wildlife-time';label.textContent='Preview activity time';const select=document.createElement('select');select.id='vietnam-wildlife-time';for(const value of ['day','dusk','night','cycle']){const option=document.createElement('option');option.value=value;option.textContent=value==='cycle'?'Automatic activity cycle':value[0].toUpperCase()+value.slice(1);select.append(option);}select.onchange=()=>wildlife.setPeriod(select.value);tools.append(label,select);
 const note=document.createElement('p');note.className='note';note.textContent='One individual per species. Pangolin and civet rest during the day. Douc browses on a branch; squirrel climbs and forages. Animals can choose space. These are accelerated local activity studies.';tools.append(note);document.getElementById('wildlife-tools').after(tools);
 return{tools,dispose(){tools.remove();}};
}




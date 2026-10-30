export function buildPacificHomes(T,{land,ground,spawn,occupied=[],profile}){
 const au=profile.theme==='sunwood',nz=profile.theme==='fern-snow',group=new T.Group();group.name=profile.homeName;land.add(group);const homes=[],obstacles=[],benches=[],mat=c=>new T.MeshStandardMaterial({color:c,roughness:.9,side:T.DoubleSide}),wood=mat(0x99735b),cream=mat(0xe3dcc8),dark=mat(0x60757a),metal=mat(0x8a9699),thatch=mat(0xb9a47b),stone=mat(0xa49b87);
 const box=(g,name,x,y,z,w,h,d,m)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.name=name;o.position.set(x,y,z);g.add(o);return o;};
 function roof(g,name,w,d,y,rise,m,hip){const v=[[-w/2,0,-d/2],[w/2,0,-d/2],[w/2,0,d/2],[-w/2,0,d/2],[0,rise,-d*(hip?.2:.5)],[0,rise,d*(hip?.2:.5)]],idx=hip?[0,1,4,1,2,5,1,5,4,2,3,5,3,0,4,3,4,5]:[0,3,5,0,5,4,1,2,5,1,5,4,0,1,4,2,3,5],geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(idx.flatMap(i=>v[i]),3));geo.computeVertexNormals();const o=new T.Mesh(geo,m);o.name=name;o.position.y=y;g.add(o);return o;}
 for(let i=0;i<3;i++){
  const w=au?6.4:nz?5.8:6,d=au?6.6:nz?6.8:5.6,floor=au?1.9:nz?.55:.35,h=au?2.5:nz?2.6:1.9,hx=au?4.6:nz?3.4:3.6,hz=au?5.2:nz?4.7:3.4,supports=au?[-4,0,4].flatMap(x=>[-3.8,0,4.3].map(z=>[x,z])):nz?[-2.6,0,2.6].flatMap(x=>[-3,3].map(z=>[x,z])):[];let p;
  for(let j=0;j<2200;j++){const a=j*2.4+i,r=10+Math.sqrt(j)*1.15,q=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(!q||Math.hypot(q.x,q.z)>57||[...occupied,...obstacles].some(o=>Math.abs(q.x-o.x)<o.halfX+hx+1&&Math.abs(q.z-o.z)<o.halfZ+hz+1))continue;const samples=[[-hx,-hz],[hx,-hz],[-hx,hz],[hx,hz],[0,0],...supports].map(([x,z])=>ground(q.x+x,q.z+z));if(samples.some(p=>!p)||Math.max(...samples.map(p=>p.y))-Math.min(...samples.map(p=>p.y))>2.6)continue;p=q.clone();p.y=Math.max(...samples.map(p=>p.y))+.08;break;}if(!p)continue;
  const home=new T.Group(),shell=new T.Group();home.position.copy(p);home.name=profile.homeName+' '+(i+1);shell.name='House wall/roof shell';home.add(shell);group.add(home);homes.push(home);Object.assign(home.userData,{style:profile.homeStyle,floorLevel:floor,wallHeight:h,cutawayShell:shell,regionalLayout:au?'raised-wrap-veranda':nz?'low-front-gable-cottage':'low-hipped-bure'});
  for(const [x,z]of supports){const bottom=ground(p.x+x,p.z+z).y-p.y;box(home,'Grounded support post',x,(floor+bottom)/2,z,.2,floor-bottom,.2,wood);}
  box(home,'Main room floor',0,floor,0,w,.2,d,au||nz?wood:stone);const wall=au?mat([0xc9d0bd,0xe0c8ad,0xb6c5cd][i]):nz?mat([0xdfd9c5,0xc6d1cf,0xd3c2ad][i]):mat(0xc8b78c);
  for(const side of [-1,1])box(shell,'Side wall',side*(w/2-.1),floor+h/2,0,.15,h,d,wall);box(shell,'Rear wall',0,floor+h/2,-d/2+.1,w,h,.15,wall);for(const side of [-1,1])box(shell,'Front wall panel',side*w*.3,floor+h/2,d/2-.1,w*.38,h,.15,wall);box(shell,'Doorway',0,floor+.95,d/2+.03,1.05,1.9,.05,dark);
  if(au){
   box(home,'Wraparound veranda floor',0,floor,0,8.5,.16,9,wood);roof(shell,'Queenslander broad hipped roof',9,9.5,floor+h,1.9,metal,true);
   for(const side of [-1,1]){box(home,'Veranda side rail',side*4.05,floor+.8,0,.1,.1,8.5,cream);for(let j=0;j<18;j++)box(home,'Veranda side baluster',side*4.05,floor+.4,-4+j*.47,.05,.8,.05,cream);}
   for(const x of [-4,0,4])box(shell,'Veranda roof column',x,floor+1.25,4.3,.15,2.5,.15,cream);for(const side of [-1,1]){box(home,'Front veranda rail',side*2.5,floor+.8,4.3,3,.1,.1,cream);for(let j=0;j<7;j++)box(home,'Front veranda baluster',side*(1.05+j*.46),floor+.4,4.3,.05,.8,.05,cream);}
   for(let j=0;j<12;j++)box(shell,'Weatherboard course',0,floor+.1+j*.2,-d/2-.01,w,.035,.03,wood);for(const x of [-1.9,1.9]){box(shell,'Tall veranda window',x,floor+1.25,d/2+.04,.9,1.5,.07,dark);box(shell,'Window central mullion',x,floor+1.25,d/2+.09,.06,1.5,.03,cream);}
  }else if(nz){
   roof(shell,'Weatherboard cottage front gable',6.8,7.6,floor+h,2.1,metal,false);for(let j=0;j<13;j++)for(const side of [-1,1])box(shell,'Horizontal weatherboard',side*(w/2+.01),floor+.08+j*.2,0,.04,.04,d,cream);
   for(const x of [-1.8,1.8]){box(shell,'Sash window frame',x,floor+1.45,d/2+.06,1.05,1.4,.12,cream);box(shell,'Sash window glass',x,floor+1.45,d/2+.13,.87,1.22,.03,dark);box(shell,'Sash middle rail',x,floor+1.45,d/2+.16,.9,.06,.03,cream);box(shell,'Sash vertical muntin',x,floor+1.45,d/2+.16,.05,1.25,.03,cream);}
   box(home,'Small cottage porch',0,floor,3.95,3.3,.16,1.5,wood);const porch=roof(shell,'Separate porch gable',3.6,1.9,floor+2.1,.7,metal,false);porch.position.z=3.9;for(const x of [-1.5,1.5])box(shell,'Porch post',x,floor+1.05,4.45,.13,2.1,.13,cream);box(shell,'Plain brick chimney',-1.7,floor+4.4,-1.6,.6,1.5,.7,stone);
  }else{
   for(let x=-w/2;x<w/2;x+=.7)for(let z=-d/2;z<d/2;z+=.7){const q=ground(p.x+x+.3,p.z+z+.3);if(!q)continue;const bottom=q.y-p.y-.05,top=floor-.1;box(home,'Grounded stone platform',x+.3,(bottom+top)/2,z+.3,.7,top-bottom,.7,stone);}
   roof(shell,'Bure steep hipped thatch roof',7.2,6.8,floor+h,3.1,thatch,true);for(const side of [-1,1])for(let j=0;j<18;j++)box(shell,'Woven timber wall strip',side*(w/2+.01),floor+.95,-2.6+j*.3,.04,1.85,.045,wood);for(let j=0;j<11;j++)box(shell,'Horizontal woven band',0,floor+.12+j*.16,-d/2-.01,w,.03,.035,wood);
   for(const side of [-1,1])for(let j=0;j<18;j++)box(shell,'Thatched eave bundle',side*3.55,floor+h-.03,-3.3+j*.37,.18,.2,.3,thatch);for(const x of [-2.2,2.2])box(shell,'Small open wall vent',x,floor+1.2,d/2+.01,.5,.6,.04,dark);box(home,'Stone entry step',0,.18,3.1,1.7,.25,.6,stone);
  }
  if(au||nz)for(let j=0;j<Math.ceil(floor/.25);j++)box(home,'Front stairs',0,.12+j*.25,(au?5:4.6)-j*.13,1.6,.2,.25,wood);
  obstacles.push({x:p.x,z:p.z,halfX:hx,halfZ:hz});
 }
 return {group,homes,obstacles,benches};
}

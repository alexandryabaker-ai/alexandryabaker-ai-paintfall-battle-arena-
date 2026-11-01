// PAINTFALL fantasy wildlife preview. Separate from Jax's Ryujin and Nova's Kirin.
// No rides or player movement are granted by this visual wildlife module.
export function buildFantasyCreatures(T,{land,style,explorer}){
 const group=new T.Group();group.name='PAINTFALL roaming dragons and unicorns';land.add(group);
 const animals=[],mat=(color,metalness=0)=>new T.MeshStandardMaterial({color,roughness:.67,metalness,side:T.DoubleSide});
 const sphere=new T.SphereGeometry(1,12,9);
 function orb(parent,m,x,y,z,sx,sy,sz){const o=new T.Mesh(sphere,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
 function cone(parent,m,x,y,z,r,h,tilt=0){const o=new T.Mesh(new T.ConeGeometry(r,h,8),m);o.position.set(x,y,z);o.rotation.z=tilt;parent.add(o);return o;}
 function limb(parent,m,x,y,z,h,r){const o=new T.Mesh(new T.CylinderGeometry(r*.8,r,h,8),m);o.position.set(x,y,z);parent.add(o);return o;}
 function wing(parent,m,side){const pivot=new T.Group();pivot.position.set(side*.40,1.66,-.12);parent.add(pivot);
  const shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(side*.65,.48);shape.lineTo(side*1.55,.75);shape.lineTo(side*1.25,.10);shape.lineTo(side*.82,-.18);shape.lineTo(side*.48,-.08);shape.closePath();
  const mesh=new T.Mesh(new T.ShapeGeometry(shape),m);mesh.rotation.x=-.28;pivot.add(mesh);return {pivot,side};
 }
 function dragon(){
  const root=new T.Group();root.name='Ryujin family dragon';group.add(root);
  const blue=mat(0x2674b7),light=mat(0x66cde4),dark=mat(0x17447e),gold=mat(0xffd47d,.22),eye=mat(0x15294d);
  orb(root,blue,0,1.26,0,.52,.43,.85);orb(root,light,0,1.16,.38,.40,.28,.48);
  orb(root,blue,0,1.66,.69,.34,.33,.38);orb(root,blue,0,1.55,1.02,.30,.17,.42);
  for(const side of [-1,1]){orb(root,eye,side*.26,1.77,.83,.043,.06,.05);cone(root,gold,side*.23,2.04,.53,.105,.35,side*.20);
   limb(root,blue,side*.36,.70,side*.40,.78,.13);orb(root,dark,side*.36,.32,side*.45,.18,.12,.24);}
  for(let i=0;i<5;i++){const z=-.50-i*.27;orb(root,blue,0,1.28-i*.10,z,.27-i*.034,.23-i*.022,.23);}
  for(let i=0;i<4;i++)cone(root,light,0,1.68-i*.09,.17-i*.29,.14,.28);
  const wings=[wing(root,light,-1),wing(root,light,1)];
  return {kind:'Ryujin family dragon',root,wings,phase:0,mode:'rest',lift:0,spaceUntil:0,requestAfter:0,cautious:true};
 }
 function unicorn(){
  const root=new T.Group();root.name='Wild unicorn';group.add(root);
  const pearl=mat(0xe5dfef),mane=mat(0xb994f0),aqua=mat(0x8ee6d6),hoof=mat(0x6d668b),eye=mat(0x2d435e),horn=mat(0xf8df8e,.25);
  orb(root,pearl,0,1.13,0,.36,.35,.73);orb(root,pearl,0,1.42,.47,.24,.47,.27);
  orb(root,pearl,0,1.78,.68,.24,.26,.31);orb(root,pearl,0,1.64,.94,.20,.15,.26);
  for(const side of [-1,1]){orb(root,eye,side*.22,1.83,.79,.032,.046,.035);
   cone(root,pearl,side*.15,2.10,.54,.08,.27,side*.14);}
  cone(root,horn,0,2.27,.83,.075,.55,-.15);
  for(const side of [-1,1])for(const z of [-.48,.48]){limb(root,pearl,side*.24,.60,z,1.05,.095);orb(root,hoof,side*.24,.10,z+.06,.13,.10,.17);}
  for(let i=0;i<6;i++)orb(root,i%2?mane:aqua,(i-2.5)*.075,1.85-i*.09,.39-i*.14,.095,.16,.19);
  for(let i=0;i<5;i++){const o=orb(root,i%2?mane:aqua,(i-2)*.065,1.19-i*.07,-.78-i*.08,.085,.18,.19);o.rotation.x=-.45;}
  return {kind:'Wild unicorn',root,phase:0,mode:'wander',lift:0,spaceUntil:0,requestAfter:0,cautious:false};
 }
 const dragonAnimal=dragon();animals.push(dragonAnimal);
 // Wild unicorns prefer open land; Nova's personal Kirin is not part of this population.
 const hasUnicorn=!['ice','cave','volcano','desert'].includes(style);
 const unicornAnimal=hasUnicorn?unicorn():null;if(unicornAnimal)animals.push(unicornAnimal);
 const base=0.012;dragonAnimal.root.position.set(12,base,10);
 if(unicornAnimal)unicornAnimal.root.position.set(-9,base,-10);
 let time=0;
 function update(dt){
  time+=Math.min(.1,Math.max(0,dt));
  const d=dragonAnimal,t=time,near=explorer?.position&&Math.hypot(explorer.position.x-12,explorer.position.z-10)<13;
  // Land regularly and whenever approached, so players can interact safely.
  const flying=!near&&(t%22)>10;
  d.mode=flying?'fly':'rest';d.lift=flying?3.2+Math.sin(t*1.3)*.25:0;
  d.root.position.set(12+(flying?Math.sin(t*.28)*7:0),base+d.lift,10+(flying?Math.cos(t*.28)*6:0));
  d.root.rotation.y=flying?Math.sin(t*.28):Math.sin(t*.25)*.15;
  for(const w of d.wings)w.pivot.rotation.z=w.side*(flying?Math.sin(t*6)*.28:.06);
  d.phase=t;
  if(unicornAnimal){
   const u=unicornAnimal;u.phase=t;u.mode=(t%16)<12?'wander':'rest';
   const step=u.mode==='wander'?1:0;
   u.root.position.set(-9+Math.sin(t*.22)*5,base+Math.abs(Math.sin(t*2.3))*.045*step,-10+Math.cos(t*.22)*4);
   u.root.rotation.y=-t*.22;u.lift=0;
  }
 }
 return {group,animals,update};
}

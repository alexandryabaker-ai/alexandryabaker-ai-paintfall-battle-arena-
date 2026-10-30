// Original procedural companion asset. No match, energy or mounting rules here.
export function createKirin(T){
 const root=new T.Group();root.name='Kirin — Nova’s energy unicorn';
 const material=(color,opacity,roughness=.38)=>new T.MeshPhysicalMaterial({color,transparent:true,opacity,depthWrite:false,roughness,metalness:0,clearcoat:.5,clearcoatRoughness:.35,emissive:color,emissiveIntensity:.045});
 const body=material(0xc5f7eb,.30),pearl=material(0xe9fff8,.47),mint=material(0x8ce8d9,.52),lavender=material(0xb8b5f1,.43),eyes=material(0x427b87,.83);
 const sphereGeometry=new T.SphereGeometry(1,24,16);
 function ellipsoid(parent,mat,position,scale,name){const mesh=new T.Mesh(sphereGeometry,mat);mesh.position.set(...position);mesh.scale.set(...scale);mesh.name=name;parent.add(mesh);return mesh;}
 function tube(parent,mat,points,r,name){const geometry=new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),28,r,7,false),mesh=new T.Mesh(geometry,mat);mesh.name=name;parent.add(mesh);return mesh;}
 function bone(parent,mat,a,b,r1,r2,name){const start=new T.Vector3(...a),end=new T.Vector3(...b),direction=end.clone().sub(start);const mesh=new T.Mesh(new T.CylinderGeometry(r2,r1,direction.length(),16),mat);mesh.position.copy(start).add(end).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());mesh.name=name;parent.add(mesh);return mesh;}
 const torso=ellipsoid(root,body,[0,1.29,.12],[.31,.35,.77],'translucent horse torso');
 ellipsoid(root,body,[0,1.34,-.43],[.285,.37,.32],'horse chest');ellipsoid(root,body,[0,1.32,.64],[.32,.34,.34],'horse haunches');
 bone(root,body,[0,1.40,-.45],[0,1.99,-.83],.23,.115,'rising horse neck');
 const head=new T.Group();head.position.set(0,2.02,-.94);root.add(head);
 ellipsoid(head,body,[0,0,0],[.145,.185,.24],'unicorn head');
 ellipsoid(head,body,[0,-.095,-.22],[.105,.14,.25],'long horse face');
 ellipsoid(head,pearl,[0,-.17,-.40],[.11,.085,.12],'soft muzzle');
 for(const side of [-1,1]){
  ellipsoid(head,eyes,[side*.134,.035,-.055],[.018,.030,.042],'gentle eye');
  ellipsoid(head,pearl,[side*.148,.046,-.071],[.007,.009,.011],'eye glint');
  ellipsoid(head,eyes,[side*.073,-.145,-.487],[.016,.012,.007],'nostril');
  tube(head,mint,[[side*.12,.083,-.12],[side*.15,.093,-.065],[side*.14,.078,-.022]],.006,'soft brow');
  tube(head,mint,[[side*.085,-.212,-.46],[side*.10,-.218,-.39],[side*.087,-.212,-.33]],.003,'muzzle line');
  const ear=new T.Mesh(new T.ConeGeometry(.044,.24,14),pearl);ear.position.set(side*.102,.255,.02);ear.rotation.z=-side*.17;ear.rotation.x=.14;ear.name='pointed horse ear';head.add(ear);
 }
 const horn=new T.Group();horn.position.set(0,.145,-.125);horn.rotation.x=-.32;head.add(horn);
 const hornCore=new T.Mesh(new T.ConeGeometry(.047,.46,20),pearl);hornCore.position.y=.23;hornCore.name='crystal unicorn horn';horn.add(hornCore);
 const spiral=[];for(let i=0;i<=100;i++){const t=i/100,r=.049*(1-t);spiral.push([Math.cos(t*Math.PI*12)*r,t*.46,Math.sin(t*Math.PI*12)*r]);}tube(horn,mint,spiral,.003,'horn spiral');
 const legs=[];
 for(const z of [-.43,.63])for(const side of [-1,1]){
  const leg=new T.Group();leg.position.set(side*.215,1.23,z);root.add(leg);
  const rear=z>0,kneeZ=rear?-.12:.015;
  bone(leg,body,[0,0,0],[side*.012,-.51,kneeZ],rear?.105:.075,.047,'upper leg');
  ellipsoid(leg,pearl,[side*.012,-.51,kneeZ],[.052,.060,.058],'knee joint');
  const lower=new T.Group();lower.position.set(side*.012,-.51,kneeZ);leg.add(lower);
  bone(lower,body,[0,0,0],[0,-.58,rear?.06:-.02],.045,.028,'lower leg');
  ellipsoid(lower,pearl,[0,-.647,rear?.035:-.045],[.060,.071,.084],'luminous hoof');
  legs.push({upper:leg,lower,rear,side});
 }
 const mane=new T.Group();root.add(mane);
 for(let i=0;i<11;i++){
  const offset=(i-5)*.012;
  tube(mane,i%3===0?lavender:mint,[[offset,2.15,-.78],[offset+.04,2.08,-.59],[offset+.08,1.84,-.46],[offset+.10,1.56,-.18]],.017,'flowing energy mane');
 }
 for(let i=0;i<4;i++)tube(head,i%2?pearl:mint,[[(i-1.5)*.023,.17,-.02],[(i-1.5)*.026,.13,-.15],[(i-1.5)*.018,.06,-.23]],.009,'forelock');
 const tail=new T.Group();tail.position.set(0,1.48,.81);root.add(tail);
 for(let i=0;i<9;i++)tube(tail,i%3===0?lavender:mint,[[(i-4)*.009,0,0],[(i-4)*.016,.04,.20],[(i-4)*.022,-.17,.43],[(i-4)*.020,-.50,.47]],.016,'flowing energy tail');
 const core=ellipsoid(root,material(0xc3fff1,.22),[0,1.40,-.24],[.10,.11,.10],'soft energy glow');
 // Sparse luminous contours preserve a readable silhouette without an opaque shell.
 const outline=new T.Mesh(torso.geometry,new T.MeshBasicMaterial({color:0xb5ffea,transparent:true,opacity:.12,side:T.BackSide,depthWrite:false}));outline.scale.setScalar(1.012);outline.name='energy silhouette';torso.add(outline);
 root.userData.parts={head,horn,mane,tail,legs,core};root.userData.mounts={Nova:{x:0,y:1.64,z:-.02},Kai:{x:0,y:1.59,z:.40}};
 root.userData.supportsFlight=true;root.userData.visualOnly=true;return root;
}

export function animateKirin(kirin,time,{flying=true}={}){
 const p=kirin.userData.parts,t=time/1000;
 const dt=Math.min(.1,Math.max(0,(time-(kirin.userData.poseTime??time))/1000));kirin.userData.poseTime=time;
 let amount=kirin.userData.flightAmount??(flying?1:0);amount+=((flying?1:0)-amount)*(1-Math.exp(-dt*4));kirin.userData.flightAmount=amount;
 kirin.position.y=amount*(.38+Math.sin(t*1.4)*.055);
 p.head.rotation.x=Math.sin(t*.8)*.025;p.mane.rotation.x=Math.sin(t*1.3)*.025;p.tail.rotation.y=Math.sin(t*1.6)*.15;
 p.core.scale.setScalar(.10);p.core.scale.y=.11*(1+Math.sin(t*1.2)*.04);
 for(const leg of p.legs){const gait=Math.sin(t*1.8+(leg.side<0?Math.PI:0)+(leg.rear?Math.PI:0));leg.upper.rotation.x=amount*((leg.rear?.18:-.26)+gait*.12);leg.lower.rotation.x=amount*(.36+gait*.07);}
}

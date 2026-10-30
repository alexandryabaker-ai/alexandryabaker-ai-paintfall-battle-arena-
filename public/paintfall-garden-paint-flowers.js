// Owner-established fantasy varieties: jet, popping-pod and catapult paint blooms.
export function buildGardenPaintFlowers(T,parent,{x=0,z=0}={}){
 const root=new T.Group();root.name='PAINTFALL spitting-flower painting corner';root.position.set(x,0,z);parent.add(root);
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.7,...extra}),leaf=mat(0x438b5b),gold=mat(0xffd36e),wood=mat(0x755542),water=mat(0x8de7ed,{transparent:true,opacity:.6}),colors=[0xf064a9,0xfbc64f,0x67cdd9],materials=colors.map(c=>mat(c));
 const sphere=new T.SphereGeometry(1,10,7),bloomHeads=[],pods=[],stamens=[],fruit=new T.Group();
 function mesh(g,geometry,m,px,py,pz,sx=1,sy=1,sz=1){const o=new T.Mesh(geometry,m);o.position.set(px,py,pz);o.scale.set(sx,sy,sz);o.castShadow=true;g.add(o);return o;}
 const cream=mat(0xfff6d5,{side:T.DoubleSide}),yellow=mat(0xf2d86b),pink=mat(0xf2b2d1,{side:T.DoubleSide}),purple=mat(0xb45a92),paleLeaf=mat(0x78a78b);
 function curve(g,points,r,m,name){const o=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),10,r,5,false),m);o.name=name;g.add(o);return o;}
 for(let i=0;i<3;i++){
  const plant=new T.Group();plant.name=['Squirting cucumber — Ecballium elaterium','Impatiens — explosive seedpods','Mountain laurel — Kalmia latifolia'][i];plant.position.set((i-1)*1.5,0,-1.8);root.add(plant);
  if(i===0){
   curve(plant,[[-.5,.08,0],[0,.12,.15],[.4,.18,-.1],[.1,.4,0]],.035,leaf,'Trailing cucumber vine');
   const heart=new T.Shape();heart.moveTo(0,-.2);heart.bezierCurveTo(-.5,.1,-.28,.45,0,.25);heart.bezierCurveTo(.28,.45,.5,.1,0,-.2);
   for(let k=0;k<4;k++){const l=new T.Mesh(new T.ShapeGeometry(heart),new T.MeshStandardMaterial({color:0x628d6d,side:T.DoubleSide,roughness:1}));l.name='Heart-shaped cucumber leaf';l.rotation.set(-Math.PI/2,0,k*1.7);l.position.set(Math.sin(k*2.4)*.42,.18,Math.cos(k*2.4)*.3);plant.add(l);}
   for(let k=0;k<5;k++){const a=k*Math.PI*2/5,p=mesh(plant,sphere,yellow,-.3+Math.cos(a)*.1,.35+Math.sin(a)*.1,.08,.1,.07,.035);p.rotation.z=a;p.name='Pale yellow cucumber flower petal';}
   fruit.position.set(.1,.53,.05);plant.add(fruit);mesh(fruit,sphere,paleLeaf,0,0,0,.17,.24,.15).name='Blue-green bristly cucumber fruit';
   const hairs=[];for(let k=0;k<60;k++){const a=k*2.4,y=(k%13)/13*.4-.2,r=.15*Math.sqrt(1-(y/.25)**2);hairs.push(Math.sin(a)*r,y,Math.cos(a)*r,Math.sin(a)*(r+.018),y+.008,Math.cos(a)*(r+.018));}
   const hairGeo=new T.BufferGeometry();hairGeo.setAttribute('position',new T.Float32BufferAttribute(hairs,3));fruit.add(new T.LineSegments(hairGeo,new T.LineBasicMaterial({color:0xc0cbbb})));
   const neck=mesh(fruit,new T.TorusGeometry(.035,.01,5,12),leaf,0,.14,.13);neck.name='Fruit stem release opening';
  }else{
   mesh(plant,new T.CylinderGeometry(.045,.07,1,7),leaf,0,.55,0);for(let k=0;k<6;k++){const a=k*2.4,l=mesh(plant,sphere,leaf,Math.cos(a)*.2,.35+(k%3)*.18,Math.sin(a)*.2,.24,.055,.1);l.rotation.y=-a;}
   const head=new T.Group();head.position.y=1.2;plant.add(head);bloomHeads.push(head);
   if(i===1){
    for(let k=0;k<5;k++){const a=k*Math.PI*2/5,p=mesh(head,sphere,pink,Math.cos(a)*.2,Math.sin(a)*.18,0,.19,k===0?.16:.12,.045);p.rotation.z=a;p.name='Five unequal Impatiens petals';}
    curve(head,[[0,-.04,-.02],[.04,-.08,-.2],[.17,-.2,-.3],[.24,-.24,-.24]],.035,pink,'Curved Impatiens nectar spur');
    const pod=new T.Group();pod.position.set(.27,.18,.12);head.add(pod);
    for(let k=0;k<5;k++){const a=k*Math.PI*2/5,flap=new T.Group();flap.rotation.y=a;const l=mesh(flap,sphere,paleLeaf,0,.15,.035,.065,.19,.05);l.name='Coiling seedpod valve';pod.add(flap);pods.push(flap);}
   }else{
    for(const [cx,cy]of [[0,-.05],[-.25,.2],[.25,.2]]){
     const cup=new T.Group();cup.position.set(cx,cy,0);head.add(cup);const bowl=mesh(cup,new T.CylinderGeometry(.23,.065,.18,5,1,true),cream,0,0,.05);bowl.rotation.x=Math.PI/2;bowl.name='Five-sided mountain-laurel cup';
     for(let k=0;k<10;k++){const a=k*Math.PI/5,stem=new T.Group();stem.name='Tensioned laurel stamen';cup.add(stem);curve(stem,[[0,0,0],[Math.cos(a)*.04,Math.sin(a)*.04,.13],[Math.cos(a)*.2,Math.sin(a)*.2,.13]],.008,pink,'Spring-loaded filament');mesh(cup,sphere,purple,Math.cos(a)*.2,Math.sin(a)*.2,.14,.018,.018,.015).name='Laurel stamen pocket';stamens.push(stem);}
    }
   }
  }
 }
 // Tiny sprinklers carry water; the fictional blossoms produce the paint.
 for(const side of [-1,1]){mesh(root,new T.CylinderGeometry(.035,.05,.26,6),wood,side*2.4,.13,-2);mesh(root,sphere,water,side*2.4,.3,-2,.11,.07,.11);}
 const canvas=document.createElement('canvas');canvas.width=384;canvas.height=224;const ctx=canvas.getContext('2d'),texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 const painting=mesh(root,new T.PlaneGeometry(4.1,2.4),new T.MeshStandardMaterial({map:texture,roughness:.8,side:T.DoubleSide}),0,1.75,2.1);painting.name='Painting made by the paint flowers';painting.rotation.y=Math.PI;
 for(const px of [-2.15,2.15])mesh(root,new T.BoxGeometry(.12,2.7,.15),wood,px,1.4,2.15);
 for(const py of [.5,3])mesh(root,new T.BoxGeometry(4.4,.12,.15),wood,0,py,2.15);
 const count=72,dummy=new T.Object3D(),drops=new T.InstancedMesh(new T.SphereGeometry(.045,5,4),mat(0xffffff,{vertexColors:false}),count);drops.name='Harmless animated paint-flower droplets';root.add(drops);
 for(let i=0;i<count;i++)drops.setColorAt(i,new T.Color(colors[Math.floor(i/24)]));
 const spray=new T.InstancedMesh(new T.SphereGeometry(.025,4,3),water,24);spray.name='Garden water sprinkler droplets';root.add(spray);
 let time=0,lastFrame=-1;
 function draw(progress){ctx.fillStyle='#fff4d6';ctx.fillRect(0,0,384,224);ctx.lineCap='round';
  if(progress>1){ctx.strokeStyle='#f064a9';ctx.lineWidth=30;ctx.beginPath();ctx.moveTo(22,160);ctx.bezierCurveTo(100,30,220,210,360,55);ctx.stroke();}
  if(progress>4)for(let i=0;i<25;i++){ctx.fillStyle=i%2?'#fbc64f':'#ff985f';ctx.beginPath();ctx.arc(25+(i*71)%334,25+(i*43)%170,4+i%5,0,Math.PI*2);ctx.fill();}
  if(progress>7)for(let i=0;i<22;i++){ctx.strokeStyle='#45b8c7';ctx.lineWidth=2+i%3;ctx.beginPath();ctx.moveTo(20+(i*41)%340,25+(i*61)%170);ctx.lineTo(30+(i*41)%340,12+(i*61)%170);ctx.stroke();}
  texture.needsUpdate=true;
 }
 function update(dt){time+=dt;const phase=time%12,frame=Math.floor(phase*4);if(frame!==lastFrame){draw(phase);lastFrame=frame;}
  for(let i=0;i<count;i++){const variety=Math.floor(i/24),within=i%24,t=(phase*.8+within/24)%1,active=phase>=9||(phase>=variety*3&&phase<variety*3+3);
   const start=(variety-1)*1.5+(variety===0?.1:variety===1?.27:0),height=variety===0?.67:variety===1?1.38:1.4;dummy.position.set(start*(1-t)+Math.sin(i*9.1)*.7*t,height+t*(1.75-height)+Math.sin(t*Math.PI)*(variety===1?1.2:.45),-1.65+3.6*t);dummy.scale.setScalar(active?variety===0?1.4:variety===1?1:.65:0);dummy.updateMatrix();drops.setMatrixAt(i,dummy.matrix);
  }drops.instanceMatrix.needsUpdate=true;
  for(let i=0;i<24;i++){const t=(time*.75+i/12)%1,side=i<12?-1:1;dummy.position.set(side*(2.4-1.5*t),.32+Math.sin(t*Math.PI)*1.6,-2+t*.3);dummy.scale.setScalar(1);dummy.updateMatrix();spray.setMatrixAt(i,dummy.matrix);}spray.instanceMatrix.needsUpdate=true;
  bloomHeads.forEach((head,i)=>head.rotation.x=.25+Math.sin(time*2+i)*.06);
  fruit.position.z=.05-(phase<3||phase>=9?Math.sin(phase*Math.PI)*.07:0);pods.forEach((flap,i)=>flap.rotation.x=(phase>=3&&phase<6)||phase>=9?.8+Math.sin(time*8+i)*.25:0);stamens.forEach((stem,i)=>stem.rotation.x=phase>=6?Math.sin(time*14+i)*.38:0);
 }
 update(0);root.userData={paintfallFlowers:true,varieties:3,waterSprinklers:true,harmless:true,botanicalModels:['Ecballium elaterium','Impatiens','Kalmia latifolia'],releaseParts:['fruit','seedpod','flower stamens'],paintIsFictional:true};
 return {group:root,update,obstacles:[{x,z:z+2.1,halfX:2.2,halfZ:.16}]};
}

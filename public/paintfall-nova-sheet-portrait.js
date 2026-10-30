// Opt-in likeness study: preserves the approved body, clothes and measured height.
export function applyNovaSheetPortrait(T,actor){
  if(actor.userData.character!=='Nova')throw new Error('Nova portrait only');
  if(actor.userData.novaSheetPortrait)return actor.userData.novaSheetPortrait;
  const p=actor.userData.parts,body=p.body;
  const faceNames=new Set(['ear','eye-white','iris','pupil','eye-highlight','eyebrow','upper-lid','lower-lid','cheek-paint','nose','nose-wing','mouth','lower-lip','chin','hair-cap','hoop-earring']);
  body.traverse(m=>{if(faceNames.has(m.name))m.visible=false;});p.hairstyle.visible=false;
  const skin=new T.MeshPhysicalMaterial({color:p.head.material.color.clone(),roughness:.65,metalness:0,clearcoat:.05});
  const dark=new T.MeshStandardMaterial({color:0x151513,roughness:.61});
  const hair=new T.MeshPhysicalMaterial({color:0x101a18,roughness:.39,clearcoat:.22,clearcoatRoughness:.5});
  const strandMat=new T.MeshStandardMaterial({color:0x25332c,roughness:.55});
  const green=new T.MeshStandardMaterial({color:0x73df2b,roughness:.5});
  const gold=new T.MeshStandardMaterial({color:0xdab852,roughness:.32,metalness:.72});
  const lips=new T.MeshPhysicalMaterial({color:0xa85f48,roughness:.53,clearcoat:.08});
  const root=new T.Group();root.name='nova-refined-portrait';body.add(root);
  function add(parent,g,m,pos,name){const mesh=new T.Mesh(g,m);mesh.position.set(...pos);mesh.name=name;parent.add(mesh);return mesh;}
  function ellipsoid(parent,m,pos,scale,name){const mesh=add(parent,new T.SphereGeometry(1,40,28),m,pos,name);mesh.scale.set(...scale);return mesh;}
  function stroke(parent,m,points,r,name,end=.4){
    const path=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),geo=new T.TubeGeometry(path,36,1,8,false);
    const a=geo.attributes.position,frames=path.computeFrenetFrames(36,false);
    for(let i=0;i<=36;i++){const t=i/36,center=path.getPointAt(t),radius=r*(1-(1-end)*t);for(let j=0;j<=8;j++){const theta=j/8*Math.PI*2,offset=frames.normals[i].clone().multiplyScalar(-Math.cos(theta)*radius).addScaledVector(frames.binormals[i],Math.sin(theta)*radius);a.setXYZ(i*9+j,center.x+offset.x,center.y+offset.y,center.z+offset.z);}}
    geo.computeVertexNormals();return add(parent,geo,m,[0,0,0],name);
  }
  // Softer cheek/jaw transitions. The crown remains at normalized y=1.
  const profile=[[.006,0],[.026,.005],[.043,.016],[.058,.035],[.067,.055],[.070,.076],[.069,.097],[.062,.119],[.045,.140],[0,.150]];
  p.head.geometry=new T.LatheGeometry(profile.map(v=>new T.Vector2(...v)),64);p.head.material=skin;p.head.scale.set(1,1,.92);
  p.head.children.filter(c=>c.name==='donghua-contour').forEach(c=>c.visible=false);
  // Head surface at feature height, used to keep marks and eyelids on the face.
  function faceZ(x,y){const h=Math.max(0,Math.min(.149,y-.85));let rad=.07;for(let i=1;i<profile.length;i++)if(h<=profile[i][1]){const [ra,ya]=profile[i-1],[rb,yb]=profile[i];rad=ra+(rb-ra)*(h-ya)/(yb-ya);break;}return -Math.sqrt(Math.max(.00002,rad*rad-x*x))*.92;}
  for(const side of [-1,1]){
    ellipsoid(root,skin,[side*.070,.924,.002],[.011,.020,.009],'nova-ear');
    const inset=new T.MeshStandardMaterial({color:skin.color.clone().multiplyScalar(.81),roughness:.8});ellipsoid(root,inset,[side*.077,.925,-.001],[.003,.011,.004],'nova-ear-inner');
    const hoop=add(root,new T.TorusGeometry(.015,.0017,10,36),gold,[side*.077,.899,-.004],'nova-gold-hoop');hoop.rotation.y=side*.3;
    const cx=side*.028,cy=.928;
    const eyeShape=new T.Shape();eyeShape.moveTo(-.020,0);eyeShape.bezierCurveTo(-.010,.011,.008,.012,.021,.004);eyeShape.bezierCurveTo(.010,-.009,-.010,-.009,-.020,0);
    const geo=new T.ShapeGeometry(eyeShape,24),pos=geo.attributes.position;
    for(let k=0;k<pos.count;k++){const x=cx+side*pos.getX(k),y=cy+pos.getY(k);pos.setXYZ(k,x,y,faceZ(x,y)-.0018);}geo.computeVertexNormals();
    add(root,geo,new T.MeshStandardMaterial({color:0xf2ede2,roughness:.5,side:T.DoubleSide}),[0,0,0],'nova-almond-eye');
    const irisZ=faceZ(cx,cy)-.003;
    const iris=ellipsoid(root,new T.MeshPhysicalMaterial({color:0x219c97,roughness:.28,clearcoat:.5}),[cx,cy,irisZ],[.0082,.0087,.0025],'nova-turquoise-iris');
    ellipsoid(root,new T.MeshStandardMaterial({color:0x092b2a,roughness:.4}),[cx,cy,irisZ-.0023],[.0041,.0059,.0011],'nova-pupil');
    ellipsoid(root,new T.MeshBasicMaterial({color:0xfff9df}),[cx-.002,cy+.003,irisZ-.0033],[.0019,.0022,.0008],'nova-eye-catchlight');
    const upper=[[-.020,0],[-.009,.009],[.008,.010],[.021,.004]].map(([x,y])=>{const px=cx+side*x,py=cy+y;return [px,py,faceZ(px,py)-.003];});
    stroke(root,dark,upper,.0016,'nova-upper-lash',.45);
    const lower=[[-.019,0],[-.008,-.006],[.010,-.006],[.020,.003]].map(([x,y])=>{const px=cx+side*x,py=cy+y;return [px,py,faceZ(px,py)-.002];});
    stroke(root,new T.MeshStandardMaterial({color:0x9a6a50,roughness:.8}),lower,.00065,'nova-lower-lid');
    for(let lash=0;lash<3;lash++){const x=cx+side*(.013+lash*.003),y=cy+.008-lash*.001;stroke(root,dark,[[x,y,faceZ(x,y)-.003],[x+side*(.003+lash*.0005),y+.003,faceZ(x,y)-.004]],.00065,'nova-eyelash',.05);}
    const brow=[[-.019,.021],[-.005,.026],[.011,.025],[.024,.020]].map(([x,y])=>{const px=cx+side*x,py=cy+y;return [px,py,faceZ(px,py)-.002];});
    stroke(root,hair,brow,.0029,'nova-shaped-brow',.22);
    // One diagonal paint streak per cheek, following its surface.
    const paintVertices=[],paintIndices=[];
    for(let j=0;j<=16;j++){const t=j/16,x=side*(.032+.025*t),y=.900+.015*t,width=.0043*Math.sin(.15+Math.PI*t*.85);for(const edge of [-1,1]){const px=x+side*edge*width*.5,py=y-edge*width;paintVertices.push(px,py,faceZ(px,py)-.0018);}if(j<16){const a=j*2;paintIndices.push(a,a+1,a+2,a+1,a+3,a+2);}}
    const paintGeo=new T.BufferGeometry();paintGeo.setAttribute('position',new T.Float32BufferAttribute(paintVertices,3));paintGeo.setIndex(paintIndices);paintGeo.computeVertexNormals();add(root,paintGeo,new T.MeshBasicMaterial({color:0x70cc35,side:T.DoubleSide}),[0,0,0],'nova-diagonal-cheek-paint');
  }
  ellipsoid(root,skin,[0,.914,-.063],[.006,.016,.007],'nova-nose-bridge');
  ellipsoid(root,skin,[0,.904,-.068],[.008,.006,.009],'nova-soft-nose-tip');
  for(const side of [-1,1]){ellipsoid(root,skin,[side*.006,.901,-.066],[.0045,.0035,.005],'nova-nose-wing');ellipsoid(root,new T.MeshStandardMaterial({color:0x85513d,roughness:.9}),[side*.0048,.899,-.070],[.0022,.001,.001],'nova-nostril');}
  const mouthZ=faceZ(0,.886)-.002;
  stroke(root,lips,[[-.017,.886,mouthZ+.003],[-.008,.888,mouthZ-.001],[0,.886,mouthZ-.002],[.007,.888,mouthZ],[.018,.889,mouthZ+.004]],.0024,'nova-cupid-upper-lip',.12);
  stroke(root,lips,[[-.016,.885,mouthZ+.003],[-.006,.882,mouthZ-.001],[.006,.883,mouthZ-.001],[.018,.889,mouthZ+.004]],.0032,'nova-soft-lower-lip',.1);
  stroke(root,new T.MeshStandardMaterial({color:0x633a32,roughness:.9}),[[-.016,.886,mouthZ+.001],[0,.885,mouthZ-.003],[.018,.889,mouthZ+.002]],.0006,'nova-smile-line',.15);
  // Parted scalp and swept layered masses; no separate top-mounted ball.
  const scalp=add(root,new T.SphereGeometry(1,56,32,0,Math.PI*2,0,Math.PI*.56),hair,[0,.953,.007],'nova-parted-scalp');scalp.scale.set(.073,.060,.066);
  ellipsoid(root,hair,[0,.934,.033],[.064,.038,.043],'nova-nape-hair');
  for(const side of [-1,1]){
    ellipsoid(root,hair,[side*.031,.982,.006],[.039,.032,.061],'nova-swept-scalp-volume');
    for(let layer=0;layer<9;layer++){
      const offset=layer*.0032;
      stroke(root,hair,[[side*.007,.999,-.025+offset],[side*.039,1.010,-.035+offset],[side*.064,.987,-.027+offset],[side*.068,.955,.014+offset],[side*.039,.990,.063]],.0054,'nova-swept-hair-mass',.45);
      stroke(root,strandMat,[[side*.009,1.002,-.025+offset],[side*.040,1.013,-.033+offset],[side*.065,.988,-.026+offset],[side*.069,.957,.014+offset]],.00055,'nova-directional-strand',.1);
    }
  }
  stroke(root,skin,[[0,1.012,-.024],[0,1.014,.002],[0,1.010,.026]],.0009,'nova-center-part',.2);
  const tails=[];
  for(const side of [-1,1]){
    const pivot=new T.Group();pivot.position.set(side*.042,.995,.065);root.add(pivot);tails.push(pivot);
    for(let i=0;i<7;i++){
      const x=side*(.010+.004*Math.sin(i*.8)),y=-.018-i*.055,z=.035+.024*Math.sin(i*.43),r=.027-i*.0012;
      const bubble=ellipsoid(pivot,hair,[x,y,z],[r,.032,r*.85],'nova-textured-bubble');
      const a=bubble.geometry.attributes.position;for(let k=0;k<a.count;k++){const vx=a.getX(k),vy=a.getY(k),vz=a.getZ(k),theta=Math.atan2(vz,vx),factor=1+.045*Math.cos(theta*12+vy*2);a.setXYZ(k,vx*factor,vy,vz*factor);}bubble.geometry.computeVertexNormals();
      const tie=add(pivot,new T.TorusGeometry(r*.76,.0028,10,36),green,[x,y-.027,z],'nova-green-braid-band');tie.rotation.x=Math.PI/2;
      for(let ridge=0;ridge<7;ridge++){const a=ridge/7*Math.PI*2;stroke(pivot,strandMat,[[x+Math.cos(a)*r*.45,y+.028,z+Math.sin(a)*r*.42],[x+Math.cos(a)*r,y,z+Math.sin(a)*r*.85],[x+Math.cos(a)*r*.42,y-.027,z+Math.sin(a)*r*.40]],.0006,'nova-bubble-strand',.3);}
    }
    stroke(pivot,hair,[[side*.009,-.363,.042],[side*.006,-.392,.037],[side*.003,-.407,.030]],.010,'nova-braid-tail',.05);
    stroke(root,hair,[[side*.040,.994,-.044],[side*.058,.964,-.060],[side*.057,.930,-.064],[side*.065,.902,-.040],[side*.061,.885,-.026]],.0039,'nova-face-framing-lock',.08);
    stroke(root,strandMat,[[side*.041,.994,-.047],[side*.059,.963,-.063],[side*.058,.931,-.067]],.0006,'nova-front-lock-highlight',.05);
  }
  const data={root,tails,animate(time,moving=false){tails.forEach((tail,i)=>{tail.rotation.x=moving?-.10+Math.sin(time*.006+i)*.035:Math.sin(time*.0015+i)*.012;tail.rotation.z=Math.sin(time*(moving?.005:.001)+i*1.5)*(moving?.025:.008);});}};
  actor.userData.novaSheetPortrait=data;return data;
}

// Reference-based garment details on the existing articulated models.
// No new face, renderer, movement skeleton, height or character replacement.
export function applyCharacterSheetDetails(T,actor,{box,curve,ring,sphere,mat,skin}){
 const name=actor.userData.character,p=actor.userData.parts,d=actor.userData.design;
 if(name==='Nova')return; // The separately approved Blender outfit remains active.
 const black=mat(0x17181e,.80),palette={Maya:0x9f39de,Zara:0xffbd24,Skye:0xff168b,Jax:0x0786fa,Rico:0x13bfc5,Kai:0x7624dd,Dante:0xf27617},color=palette[name],accent=mat(color,.48),gold=mat(0xe9bd54,.35,.5),red=mat(0xd8273f,.68);
 const meshes=[];actor.traverse(mesh=>{if(mesh.isMesh&&!mesh.userData.decorative)meshes.push(mesh);});
 const recolor=(mesh,color)=>{mesh.material=mesh.material.clone();mesh.material.color.setHex(color);};
 for(const mesh of meshes){
  if(['tailored-torso','hips','fitted-chest-panel','pectoral-panel','thigh','shin','cargo-pocket','cargo-secondary-pocket','cargo-pocket-flap','cargo-zip-flap','shoulder-armor'].includes(mesh.name))mesh.material=black;
  if(['cargo-pocket-tab','outfit-piping','wrist-cuff','boot-sole','shoe-lace','belt-buckle'].includes(mesh.name))mesh.material=accent;
  if(['vest-detail','chest-emblem','scarf-tail','armor-emblem'].includes(mesh.name))mesh.visible=false;
 }
 // Crop silhouettes reuse the existing torso surface with material groups.
 if(['Maya','Skye','Zara'].includes(name)){
  const mesh=p.torso,cut=.70-mesh.position.y,points=mesh.geometry.parameters.points.map(point=>point.clone());
  for(let i=0;i<points.length-1;i++)if(points[i].y<cut&&points[i+1].y>cut){const t=(cut-points[i].y)/(points[i+1].y-points[i].y);points.splice(i+1,0,new T.Vector2(points[i].x+(points[i+1].x-points[i].x)*t,cut));break;}
  const indexed=new T.LatheGeometry(points,24),geometry=indexed.toNonIndexed(),vertices=geometry.attributes.position;indexed.dispose();mesh.geometry.dispose();geometry.clearGroups();
  // Classify a whole strip on either side of an explicit horizontal seam.
  for(let i=0;i<vertices.count;i+=3){const y=Math.min(vertices.getY(i),vertices.getY(i+1),vertices.getY(i+2));geometry.addGroup(i,3,y<cut-.00001?1:0);}
  mesh.geometry=geometry;mesh.material=[name==='Zara'?accent:black,skin];
  for(const part of meshes)if(['fitted-chest-panel','pectoral-panel'].includes(part.name)&&name==='Zara')part.material=accent;
 }
 const panel=(parent,material,position,size)=>box(parent,material,position,size,'sheet-panel');
 const strap=(parent,material,position,size)=>box(parent,material,position,size,'sheet-strap');
 if(name==='Kai'){
  p.body.getObjectByName('hips').visible=false;
  // Continuous cargo seat overlaps the tops of both articulated thighs.
  const points=[[d.hip*.44,d.legRatio-.036],[d.hip*.74,d.legRatio-.020],[d.hip*.96,d.legRatio+.012],[d.hip,d.legRatio+.055],[d.hip*.94,d.legRatio+.090]].map(([r,y])=>new T.Vector2(r,y));
  const seat=new T.Mesh(new T.LatheGeometry(points,24),black);seat.scale.z=.66;seat.name='kai-connected-cargo-seat';p.body.add(seat);
 }
 for(const [i,leg] of [p.legL,p.legR].entries()){
  const side=i===0?-1:1,thigh=(d.legRatio-.04)*.51,shin=leg.userData.shin;
  const pocket=leg.getObjectByName('cargo-pocket');if(pocket&&['Jax','Rico','Kai'].includes(name))recolor(pocket,name==='Kai'?(i===0?0x7624dd:0xd8273f):color);
  strap(leg,name==='Kai'&&i?red:accent,[side*.026,-thigh*.48,-.035],[.010,thigh*.62,.006]);
  for(let j=0;j<2;j++)panel(leg,black,[side*.035,-thigh*(.32+j*.25),-.036],[.025,.009,.008]);
  if(name==='Kai'){recolor(leg.getObjectByName('thigh'),i===0?0x48227c:0x9b2037);recolor(shin.getObjectByName('shin'),i===0?0x48227c:0x9b2037);}
  if(name==='Rico'){
   const lower=shin.getObjectByName('shin');lower.material=skin;lower.scale.set(1,1,1);leg.getObjectByName('knee-pad').visible=false;shin.getObjectByName('cargo-ankle-cuff').visible=false;
   ring(leg,black,[0,-thigh+.015,.004],d.muscle*.93,.006,'cargo-shorts-hem').rotation.x=Math.PI/2;
   const points=[];for(let j=0;j<21;j++)points.push([-.032+j*.0032,-thigh*.72+Math.sin(j*2)*(.002+(j%5)*.0015),-.047]);curve(leg,gold,points,.0014,'embroidered-sound-wave');
  }
  if(name==='Skye'||name==='Rico')recolor(shin.getObjectByName('boot'),i===0?0x202028:name==='Skye'?0xec2694:0xb72833);
  if(name==='Zara')recolor(shin.getObjectByName('boot'),0xeaa820);
 }
 if(['Kai','Dante','Zara'].includes(name)){
  for(const mesh of meshes)if(['upper-arm','deltoid'].includes(mesh.name)&&name!=='Zara')mesh.material=skin;
  const old=p.hairstyle.getObjectByName('white-hood');if(old)old.visible=false;const edge=p.hairstyle.getObjectByName('hood-edge');if(edge)edge.visible=false;
  const scarf=p.body.getObjectByName('scarf');if(scarf)scarf.visible=false;
  curve(p.body,name==='Zara'?accent:black,[[-.060,.825,.045],[-.050,.788,.090],[0,.775,.105],[.050,.788,.090],[.060,.825,.045]],.013,'hood-down');
  for(const side of [-1,1])curve(p.body,accent,[[side*.023,.825,-.042],[side*.028,.745,-.077]],.0018,'hood-cord');
 }
 if(name==='Zara'){
  for(const side of [-1,1]){const arm=side<0?p.armL:p.armR;arm.getObjectByName('upper-arm').material=accent;arm.getObjectByName('deltoid').material=accent;panel(p.body,mat(0xf57920,.75),[side*.070,.752,-.058],[.037,.070,.008]);}
  for(const mesh of meshes)if(mesh.name==='shoulder-armor')mesh.material=accent;
 }
 if(name==='Kai'||name==='Dante'||name==='Rico'){
  // Put colored panels on the garment surface, not floating armor plates.
  for(const mesh of meshes)if(mesh.name==='pectoral-panel')mesh.visible=false;
  const mesh=p.torso,geometry=mesh.geometry.toNonIndexed(),v=geometry.attributes.position;mesh.geometry.dispose();geometry.clearGroups();
  for(let i=0;i<v.count;i+=3){const x=(v.getX(i)+v.getX(i+1)+v.getX(i+2))/3,y=(v.getY(i)+v.getY(i+1)+v.getY(i+2))/3+mesh.position.y,z=(v.getZ(i)+v.getZ(i+1)+v.getZ(i+2))/3;
   const colored=y>.69&&z<-.012&&(name==='Kai'||Math.abs(x)>.045);geometry.addGroup(i,3,colored?(name==='Kai'&&x>0?2:1):0);}
  mesh.geometry=geometry;mesh.material=[black,accent,red];
 }
 if(name==='Rico'){
  for(const arm of [p.armL,p.armR]){arm.getObjectByName('deltoid').material=black;arm.getObjectByName('upper-arm').material=black;}
  const cap=p.hairstyle.getObjectByName('backward-cap'),brim=p.hairstyle.getObjectByName('rear-cap-brim');cap.material=black;brim.material=black;
  curve(p.hairstyle,accent,[[-.016,1.026,-.031],[-.016,1.030,.022],[-.016,1.010,.065]],.002,'cap-teal-stitch');
  sphere(p.hairstyle,mat(d.hair,.48),[0,.948,.086],[.025,.022,.023],'rico-low-bun');
  for(const side of [-1,1])for(let i=0;i<3;i++){const x=side*(.030+i*.012);curve(p.hairstyle,red,[[x,.973,-.038],[x+side*.005,.946,-.056],[x,.925,-.053]],.002,'red-braid-tip');}
 }
 if(name==='Skye'){
  const pink=accent;
  ring(p.body,pink,[0,d.legRatio+.085,0],d.hip*1.03,.015,'waist-tied-hoodie').rotation.x=Math.PI/2;
  for(const side of [-1,1]){const sleeve=panel(p.body,pink,[side*.045,d.legRatio+.035,-.079],[.035,.10,.018]);sleeve.rotation.z=side*-.22;
   const pts=[];for(let i=0;i<=24;i++){const t=i/24;pts.push([side*.072+Math.sin(t*Math.PI*5)*.009,.96-t*.22,-.024+Math.cos(t*Math.PI*5)*.008]);}curve(p.hairstyle,pink,pts,.002,'pink-front-spiral');}
  for(const mesh of meshes)if(['headphone-earcup','headphone-inset','headphone-band'].includes(mesh.name))recolor(mesh,color);
  for(const hair of meshes.filter(mesh=>['skye-loose-hair','skye-upper-ponytail'].includes(mesh.name))){if(meshes.indexOf(hair)%3===0)recolor(hair,0xd87a9b);}
  // Original typography on clothing, rather than a new external logo asset.
  if(typeof document!=='undefined'){
   const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#17181e';ctx.fillRect(0,0,256,256);ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 34px sans-serif';ctx.fillText('PAINTFALL',128,77);ctx.fillStyle='#ff168b';ctx.font='bold 102px sans-serif';ctx.fillText('07',128,195);
   const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const material=new T.MeshBasicMaterial({map:texture});const badge=new T.Mesh(new T.PlaneGeometry(.090,.090),material);badge.position.set(0,.745,-.090);badge.rotation.y=Math.PI;badge.name='jersey-07';p.body.add(badge);material.userData.sheetTexture=true;
  }
 }
 if(name==='Kai')for(const side of [-1,1])for(let i=0;i<3;i++)curve(p.hairstyle,accent,[[side*(.025+i*.012),.980,-.042],[side*(.030+i*.012),.968,-.055],[side*(.033+i*.012),.956,-.055]],.0014,'violet-bedhead-tip');
 for(const mesh of meshes){
  if(['blaster-receiver','paint-hopper','paint-muzzle'].includes(mesh.name))mesh.material=accent;
  if(mesh.name==='hair-bead'&&name==='Jax')mesh.material=accent;
 }
 if(name==='Jax'){
  curve(p.body,gold,[[-.040,.842,-.037],[-.026,.806,-.079],[0,.792,-.086],[.026,.806,-.079],[.040,.842,-.037]],.0016,'crown-chain');
  curve(p.body,gold,[[-.016,.787,-.087],[-.018,.802,-.087],[-.006,.794,-.088],[0,.808,-.089],[.008,.794,-.088],[.018,.802,-.087],[.016,.787,-.087],[-.016,.787,-.087]],.002,'crown-pendant');
  for(const side of [-1,1]){panel(p.body,accent,[side*.060,.742,-.091],[.035,.055,.007]);panel(side<0?p.armL:p.armR,accent,[0,-.026,-.030],[.050,.040,.007]);}
 }
 if(name==='Maya'){
  for(const side of [-1,1])curve(p.body,mat(0xd41f8a,.7),[[side*.083,.800,-.038],[side*.093,.760,-.064],[side*.050,.700,-.057]],.0012,'pink-stitching');
  for(const curl of meshes.filter(mesh=>mesh.name==='maya-curl').filter((_,i)=>i%4===0))recolor(curl,0x4d216b);
 }
 actor.userData.sheetDetails={reference:name+'.png',pass:'garments-and-hair-01',faceChanged:false};
}

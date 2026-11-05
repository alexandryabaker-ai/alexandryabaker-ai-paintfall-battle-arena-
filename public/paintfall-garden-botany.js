// Lightweight botanical studies for the country gardens. Forms describe real flower
// structures; PAINTFALL paint behavior is supplied separately by the existing kit.
export function createBotanicalPlantTools(k){
 const {T,g,m}=k,unit=new T.SphereGeometry(1,9,6),materials=new Map();let flowers=0;
 const material=color=>{if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:.78}));return materials.get(color);};
 function oval(parent,name,pos,scale,mat,angle=0){const o=new T.Mesh(unit,mat);o.name=name;o.position.set(...pos);o.scale.set(...scale);o.rotation.y=angle;parent.add(o);return o;}
 function bloom(spec,x,y,z,size=1){
  flowers++;const root=new T.Group();root.name=spec.species+' — '+spec.form+' flower study';root.position.set(x,y,z);root.scale.setScalar(size);g.add(root);
  const color=material(spec.color),center=material(spec.center||0xe5be48),form=spec.form;
  const petal=(a,r,w=.1,h=.035,l=.19,py=0,mat=color)=>oval(root,spec.species+' petal',[Math.sin(a)*r,py,Math.cos(a)*r],[w,h,l],mat,a);
  const round=(n,r,w=.1,h=.035,l=.19,py=0)=>{for(let j=0;j<n;j++)petal(j*Math.PI*2/n,r,w,h,l,py);};
  if(form==='rose'||form==='marigold'||form==='dahlia'){
   const n=form==='rose'?7:10;for(let layer=0;layer<3;layer++)for(let j=0;j<n;j++)petal(j*Math.PI*2/n+layer*.35,.14-layer*.04,.07,.065,.1,.04*layer);
  }else if(form==='waterlily'||form==='lotus'){
   for(let layer=0;layer<3;layer++)for(let j=0;j<10;j++)petal(j*Math.PI/5+layer*.2,.19-layer*.05,.055,form==='lotus'?.13:.045,.2-layer*.025,layer*.065);
   oval(root,'Yellow aquatic-flower center',[0,.17,0],[.08,.04,.08],center);
  }else if(form==='iris'){
   for(let j=0;j<3;j++){const a=j*Math.PI*2/3;petal(a,.19,.11,.04,.23,-.04);petal(a+.8,.055,.05,.19,.06,.16);petal(a,.09,.025,.015,.1,.01,center);}
  }else if(form==='tulip'||form==='lily'){
   for(let j=0;j<6;j++){const a=j*Math.PI/3,p=petal(a,form==='tulip'?.09:.2,.09,form==='tulip'?.19:.045,form==='tulip'?.12:.23,.08);p.rotation.x=form==='lily'?-.3:0;}
   for(let j=0;j<6;j++)oval(root,'Lily-family anther',[(j-2.5)*.025,.16,0],[.018,.045,.025],center);
  }else if(form==='poppy'){
   round(4,.1,.16,.055,.19);oval(root,'Poppy central seed capsule',[0,.04,0],[.06,.04,.06],m.light);for(let j=0;j<14;j++)petal(j*Math.PI/7,.075,.014,.035,.014,.065,center);
  }else if(form==='hibiscus'){
   round(5,.12,.14,.035,.2);const column=new T.Mesh(new T.CylinderGeometry(.018,.025,.24,6),center);column.name='Hibiscus staminal column';column.position.y=.13;root.add(column);
  }else if(form==='orchid'){
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5;oval(root,'Orchid differentiated tepal',[Math.sin(a)*.12,Math.cos(a)*.12,0],[j<2?.13:.085,.075,.025],color,a);}oval(root,'Orchid projecting lip',[0,-.08,.07],[.08,.065,.04],center);
  }else if(form==='coneflower'){
   round(14,.15,.035,.025,.18,-.02);oval(root,'Raised orange coneflower disk',[0,.07,0],[.105,.12,.105],material(0xaf672f));
  }else if(form==='trillium'){
   round(3,.1,.13,.035,.18);for(let j=0;j<3;j++)petal(j*Math.PI*2/3+.9,.13,.045,.02,.17,-.03,m.leaf);oval(root,'Trillium stamen cluster',[0,.04,0],[.035,.035,.035],center);
  }else if(form==='cattleya'||form==='fringed-orchid'||form==='antler-orchid'||form==='cockleshell-orchid'||form==='dove-orchid'){
   if(form==='cockleshell-orchid'){
    oval(root,'Cockleshell dark upper hood',[0,.12,0],[.11,.1,.05],color);for(let j=0;j<5;j++){const a=(j-2)*.4;oval(root,'Cockleshell pale dangling tepal',[Math.sin(a)*.18,-.13,0],[.025,.2,.02],m.cream,a);}
   }else if(form==='dove-orchid'){
    for(let j=0;j<3;j++){const a=j*Math.PI*2/3;oval(root,'Dove orchid rounded enclosing sepal',[Math.sin(a)*.07,Math.cos(a)*.07,0],[.09,.1,.04],color);}oval(root,'Dove orchid inner column',[0,0,.07],[.035,.055,.035],center);
   }else{
    for(let j=0;j<3;j++){const a=j*Math.PI*2/3;oval(root,'Orchid narrow sepal',[Math.sin(a)*.14,Math.cos(a)*.14,0],[.045,.14,.02],color,a);}
    for(const side of [-1,1]){const p=oval(root,'Orchid paired lateral petal',[side*.13,.05,0],[form==='antler-orchid'?.035:.15,form==='antler-orchid'?.24:.09,.025],color,side*.5);if(form==='antler-orchid')p.rotation.z=side*.3;}
    oval(root,'Orchid broad lip',[0,-.1,.07],[.1,.09,.04],form==='fringed-orchid'?m.white:center);
    if(form==='fringed-orchid')for(let j=0;j<14;j++)oval(root,'Fringed orchid lip filament',[Math.sin(j*Math.PI*2/14)*.1,-.1+Math.cos(j*Math.PI*2/14)*.085,.08],[.009,.045,.008],m.white,j*Math.PI*2/14);
   }
  }else if(form==='yucca'){
   for(let j=0;j<5;j++){const a=j*2.4;oval(root,'Pendant yucca cream blossom',[Math.sin(a)*.09,j*.08,Math.cos(a)*.09],[.06,.1,.06],color);}
  }else if(form==='plumeria'||form==='gardenia'){
   for(let j=0;j<(form==='gardenia'?7:5);j++){const a=j*Math.PI*2/(form==='gardenia'?7:5),p=petal(a,.1,.065,.035,.18);p.rotation.y+=.32;}oval(root,'Fragrant flower yellow throat',[0,.03,0],[.045,.025,.045],center);
  }else if(form==='cantua'||form==='copihue'||form==='kowhai'||form==='guettarda'){
   const n=form==='copihue'?6:5,tube=new T.Mesh(new T.CylinderGeometry(.09,.035,.3,10,1,true),color);tube.name=spec.species+' pendant floral tube';tube.rotation.x=Math.PI;tube.position.y=-.07;root.add(tube);
   for(let j=0;j<n;j++)petal(j*Math.PI*2/n,.075,.045,.025,.075,-.22);if(form==='kowhai')oval(root,'Kowhai projecting keel',[0,-.18,.09],[.04,.08,.11],color);
  }else if(form==='ceibo'){
   for(let j=0;j<3;j++){const a=j*2.4;oval(root,'Ceibo curved scarlet standard',[Math.sin(a)*.07,j*.09,Math.cos(a)*.07],[.05,.14,.06],color,a);oval(root,'Ceibo keel',[Math.sin(a)*.07+.04,j*.09-.05,Math.cos(a)*.07],[.035,.07,.08],color,a);}
  }else if(form==='victoria'){
   for(let row=0;row<3;row++)for(let j=0;j<12;j++)petal(j*Math.PI/6+row*.15,.18-row*.045,.035,.055,.21-row*.025,row*.055);oval(root,'Victoria central flower chamber',[0,.1,0],[.055,.04,.055],center);
  }else if(form==='morning-glory'){
   const corolla=new T.Mesh(new T.CylinderGeometry(.19,.025,.17,20,1,true),color);corolla.name='Morning-glory funnel corolla';root.add(corolla);round(5,.14,.075,.025,.1,.09);oval(root,'Dark morning-glory throat',[0,-.06,0],[.03,.012,.03],material(0x98537f));
  }else if(form==='melocactus'){
   oval(root,'Ribbed Turks-cap cactus',[0,-.15,0],[.22,.23,.22],m.leaf);for(let j=0;j<10;j++)petal(j*Math.PI/5,.19,.018,.18,.018,-.15,m.light);oval(root,'Cactus reddish cephalium',[0,.09,0],[.12,.12,.12],material(0xa45d52));round(5,.035,.02,.02,.04,.2);
  }else if(form==='cactus-rose'){
   round(9,.12,.055,.035,.19);oval(root,'Leafy-cactus yellow stamen cluster',[0,.045,0],[.075,.045,.075],center);
  }else if(form==='poinciana'){
   round(5,.12,.1,.025,.17);for(let j=0;j<8;j++)oval(root,'Long poinciana stamen',[(j-3.5)*.018,.13,.08],[.008,.16,.008],material(0xb94345));
  }else if(form==='chaconia'){
   for(let row=0;row<4;row++){oval(root,'Chaconia enlarged red calyx lobe',[row%2?.09:-.09,row*.08,0],[.09,.055,.04],color);oval(root,'Chaconia small yellow true flower',[0,row*.08,.03],[.025,.025,.025],center);}
  }else if(form==='bunchberry'){
   round(4,.1,.1,.025,.14);for(let j=0;j<5;j++)oval(root,'Bunchberry central true flower',[(j%3-1)*.023,.04,Math.floor(j/3)*.02],[.02,.025,.02],m.light);
  }else if(form==='wattle'){
   for(let j=0;j<7;j++){const a=j*2.4;oval(root,'Wattle spherical flower head',[Math.sin(a)*.1,j*.03,Math.cos(a)*.1],[.065,.065,.065],color);}
  }else if(form==='medinilla'){
   for(let row=0;row<3;row++){for(let j=0;j<5;j++){const a=j*Math.PI*2/5;oval(root,'Tagimoucia red calyx',[Math.sin(a)*.07,-row*.12,Math.cos(a)*.07],[.04,.065,.04],color);oval(root,'Tagimoucia pale petal',[Math.sin(a)*.05,-row*.12-.06,Math.cos(a)*.05],[.03,.035,.03],m.white);}}
  }else if(form==='heilala'){
   round(4,.07,.07,.035,.1);for(let j=0;j<4;j++)petal(j*Math.PI/2+.6,.06,.04,.025,.07,.04,m.cream);oval(root,'Heilala stamen cluster',[0,.055,0],[.045,.03,.045],center);
  }else if(form==='half-flower'){
   for(let j=0;j<5;j++){const a=-Math.PI/2+j*Math.PI/4;petal(a,.12,.04,.025,.14);}oval(root,'Scaevola split floral tube',[0,-.035,0],[.04,.05,.06],color);
  }else if(form==='pearlwort'||form==='azorella'){
   oval(root,'Low cushion-plant study',[0,-.18,0],[.28,.12,.28],m.leaf);for(let j=0;j<8;j++){const a=j*2.4;oval(root,'Tiny greenish cushion-flora flower',[Math.sin(a)*.16,-.07,Math.cos(a)*.16],[.019,.018,.019],material(0xbfc46c));}
  }else if(form==='slipper'){
   oval(root,'Inflated Calceolaria lower slipper',[0,0,.03],[.13,.11,.1],color);oval(root,'Small Calceolaria upper lip',[0,.11,0],[.045,.025,.04],color);for(let j=0;j<4;j++)oval(root,'Calceolaria red speckle',[(j-1.5)*.033,.06,.11],[.01,.012,.008],material(0xa54f3d));
  }else if(form==='gloriosa'){
   for(let j=0;j<6;j++){const a=j*Math.PI/3;petal(a,.17,.045,.15,.13,.1);petal(a,.1,.055,.025,.11,-.03,center);}for(let j=0;j<6;j++)petal(j*Math.PI/3,.25,.012,.03,.08,-.07,center);
  }else if(form==='african-violet'){
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5;petal(a,.1,j<2?.08:.12,.025,.14);}for(const side of [-1,1])oval(root,'African violet yellow anther',[side*.025,.04,0],[.025,.035,.02],center);
  }else if(form==='parrot-impatiens'){
   oval(root,'Impatiens red lower sepal',[0,0,0],[.09,.11,.17],color);oval(root,'Impatiens yellow beak',[.06,-.02,.15],[.07,.055,.1],center);for(const side of [-1,1])oval(root,'Small green-white true petal',[side*.035,.09,-.07],[.04,.02,.05],m.cream);oval(root,'Curved nectar spur',[-.03,-.07,-.15],[.02,.05,.1],color);
  }else if(form==='crown-flower'){
   round(5,.12,.07,.04,.14);for(let j=0;j<5;j++)petal(j*Math.PI*2/5,.045,.026,.065,.04,.065,material(0x9a6b9f));
  }else if(form==='coffee'){
   round(5,.1,.035,.025,.16);oval(root,'Coffee flower throat',[0,.025,0],[.025,.02,.025],center);
  }else if(form==='roselle'){
   round(5,.12,.13,.035,.17);oval(root,'Roselle dark red flower eye',[0,.035,0],[.065,.025,.065],material(0x883144));for(let j=0;j<5;j++)petal(j*Math.PI*2/5,.06,.025,.08,.045,-.07,material(0xae3548));
  }else if(form==='ylang'){
   for(let j=0;j<6;j++){const a=j*Math.PI/3;petal(a,.18,.035,.035,.25,-.06);}
  }else if(form==='begonia'){
   for(let j=0;j<4;j++)petal(j*Math.PI/2,.08,j%2?.055:.12,.025,j%2?.08:.16);oval(root,'Begonia yellow stamen cluster',[0,.04,0],[.04,.035,.04],center);
  }else if(form==='baobab'){
   round(5,.12,.13,.035,.18);for(let j=0;j<18;j++){const a=j*Math.PI/9;petal(a,.07,.009,.16,.012,-.12,center);}root.rotation.x=Math.PI;
  }else if(form==='comet-orchid'){
   round(5,.16,.04,.025,.24);oval(root,'Comet orchid pointed lip',[0,.04,.16],[.08,.035,.2],color);oval(root,'Long orchid nectar spur',[0,-.26,0],[.015,.28,.015],m.cream);
  }else if(form==='echium'){
   for(let j=0;j<5;j++){const a=j*2.4;for(let l=0;l<5;l++)oval(root,'Echium tubular flower lobe',[Math.sin(a)*.07+Math.sin(l*Math.PI*2/5)*.025,j*.06,Math.cos(a)*.07+Math.cos(l*Math.PI*2/5)*.025],[.025,.025,.04],color);}
  }else if(form==='fuchsia'){
   for(let j=0;j<4;j++)petal(j*Math.PI/2,.07,.05,.1,.12,.02);oval(root,'Fuchsia pendant corolla',[0,-.12,0],[.09,.14,.09],center);root.rotation.x=.35;
  }else if(form==='cyclamen'){
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5,p=petal(a,.07,.06,.16,.075,.12);p.rotation.z=.3;}oval(root,'Cyclamen reflexed base',[0,-.04,0],[.07,.04,.07],center);
  }else if(form==='bell'||form==='gentian'||form==='trumpet'){
   const corolla=new T.Mesh(new T.CylinderGeometry(.16,.035,.3,10,1,true),color);corolla.name=spec.species+' open tubular corolla';corolla.position.y=.04;root.add(corolla);round(5,.14,.07,.025,.08,.19);oval(root,'Tubular-flower throat',[0,-.095,0],[.035,.01,.035],center);
  }else if(form==='daffodil'){
   round(6,.14,.07,.025,.2);const cup=new T.Mesh(new T.CylinderGeometry(.095,.045,.17,10,1,true),center);cup.name='Daffodil central trumpet';cup.position.y=.1;root.add(cup);
  }else if(form==='lily-valley'||form==='twinflower'){
   const n=form==='twinflower'?2:6;
   for(let j=0;j<n;j++){const px=form==='twinflower'?(j?-.13:.13):.1+(j%2)*.06,py=form==='twinflower'?.08:.25-j*.07,body=new T.Mesh(new T.CylinderGeometry(.045,.075,.1,8,1,true),color);body.name='Pendant '+form+' bell';body.position.set(px,py,0);root.add(body);for(let l=0;l<5;l++)oval(root,'Pendant bell rim',[px+Math.sin(l*Math.PI*2/5)*.06,py-.05,Math.cos(l*Math.PI*2/5)*.06],[.025,.013,.025],color);}
  }else if(form==='dryas'){
   round(8,.12,.065,.025,.17);oval(root,'Mountain avens yellow center',[0,.03,0],[.065,.035,.065],center);
  }else if(form==='carnation'){
   for(let row=0;row<2;row++)for(let j=0;j<10;j++)petal(j*Math.PI/5+row*.3,.12-row*.04,.055,.045,.12,row*.035);
  }else if(form==='pea'){
   oval(root,'Pea-family upper standard',[0,.1,-.025],[.16,.16,.035],color);for(const side of [-1,1])oval(root,'Pea-family wing',[side*.09,0,.04],[.085,.045,.12],color);oval(root,'Pea-family keel',[0,-.05,.1],[.06,.055,.12],center);
  }else if(form==='candytuft'){
   for(let j=0;j<4;j++)petal(j*Math.PI/2,.09,j<2?.09:.05,.025,j<2?.15:.085);
  }else if(form==='protea'||form==='thistle'){
   for(let j=0;j<14;j++)petal(j*Math.PI/7,.13,.045,.17,.08,.04);
   oval(root,'Dense flower head',[0,.12,0],[.1,.13,.1],center);
  }else if(form==='passionflower'){
   round(10,.13,.05,.025,.2);for(let j=0;j<28;j++)petal(j*Math.PI/14,.1,.01,.015,.14,.04,center);for(let j=0;j<5;j++)petal(j*Math.PI*2/5,.04,.015,.08,.015,.1,m.light);
  }else if(form==='bougainvillea'){
   for(let j=0;j<3;j++){const a=j*Math.PI*2/3;petal(a,.09,.1,.025,.13);oval(root,'Bougainvillea tiny true flower',[Math.sin(a)*.04,.065,Math.cos(a)*.04],[.018,.035,.018],m.white);}
  }else if(form==='edelweiss'){
   round(7,.14,.045,.025,.2);for(let j=0;j<5;j++){const a=j*Math.PI*2/5;oval(root,'Edelweiss yellow capitulum',[Math.sin(a)*.05,.04,Math.cos(a)*.05],[.035,.025,.035],center);}
  }else if(form==='ginger'||form==='heliconia'){
   for(let row=0;row<5;row++){const a=row*2.4;petal(a,.08,.07,.04,form==='heliconia'?.22:.13,row*.075);}
   oval(root,'Small true flower among bracts',[.05,.3,.02],[.02,.06,.02],m.white);
  }else if(form==='bottlebrush'){
   for(let row=0;row<5;row++)for(let j=0;j<8;j++){const a=j*Math.PI/4;petal(a,.1,.009,.012,.16,row*.055);}
  }else if(form==='lavender'||form==='heather'||form==='aloe'){
   for(let row=0;row<5;row++)for(let j=0;j<4;j++)petal(j*Math.PI/2+row*.2,.06,.035,.045,.06,row*.065);
  }else if(form==='clover'){
   for(let j=0;j<22;j++){const a=j*2.4;oval(root,'Clover floret',[Math.sin(a)*.09,Math.cos(j*1.1)*.065,Math.cos(a)*.09],[.025,.055,.025],color);}
  }else if(form==='daisy'||form==='cornflower'||form==='sunflower'){
   round(form==='cornflower'?12:16,.15,.035,.025,.18);oval(root,'Composite disk florets',[0,.03,0],[.105,.045,.105],center);
  }else if(form==='bird-of-paradise'){
   oval(root,'Bird-of-paradise boat bract',[0,0,0],[.25,.055,.08],m.leaf);for(let j=0;j<3;j++)oval(root,'Bird-of-paradise upright sepal',[(j-1)*.06,.15,0],[.035,.2,.04],color);oval(root,'Bird-of-paradise blue petal',[.12,.12,.04],[.04,.15,.025],center);
  }else{
   // Five-part stars are used only for the five-part forms named in the data.
   round(form==='four-star'?4:form==='six-star'?6:5,.1,.07,.025,.14);oval(root,'Flower center',[0,.025,0],[.04,.025,.04],center);
  }
  return root;
 }
 function plant(spec,x,z,index=0){
  const aquatic=['lotus','waterlily','victoria'].includes(spec.form),low=['pearlwort','azorella','melocactus'].includes(spec.form),y=aquatic?.35:low?.4:.6+(index%3)*.085;
  if(aquatic){const pad=new T.Mesh(new T.CircleGeometry(spec.form==='victoria'?.43:.28,20,spec.form==='waterlily'?.15:0,spec.form==='waterlily'?Math.PI*1.86:Math.PI*2),m.leaf);pad.name=spec.form==='waterlily'?'Notched water-lily leaf':spec.form==='victoria'?'Victoria round floating leaf':'Round lotus leaf';pad.rotation.x=-Math.PI/2;pad.position.set(x,.27,z);g.add(pad);if(spec.form==='victoria'){const rim=new T.Mesh(new T.TorusGeometry(.42,.025,4,24),m.light);rim.name='Victoria raised leaf rim';rim.rotation.x=Math.PI/2;rim.position.set(x,.29,z);g.add(rim);}}
  else if(low){} // Cushion plants and globose cacti have no invented tall herb stem.
  else if(['aloe','african-violet','echium'].includes(spec.form)){
   k.rod(spec.species+' flower stalk',[[x,.15,z],[x,y,z]],.014,m.leaf);for(let j=0;j<8;j++){const a=j*Math.PI/4,leaf=k.ell(spec.species+' basal rosette',x+Math.sin(a)*.14,.3,z+Math.cos(a)*.14,spec.form==='aloe'?.055:.12,.03,.23,m.leaf);leaf.rotation.y=a;}
  }else if(['coffee','baobab','ylang','trumpet'].includes(spec.form)){
   k.rod(spec.species+' branched collection plant',[[x,.15,z],[x,y+.2,z]],.035,m.wood);for(const side of [-1,1]){k.rod('Collection twig',[[x,.35,z],[x+side*.23,y-.1,z]],.015,m.wood);const leaf=k.ell(spec.species+' woody-plant leaf',x+side*.18,y-.13,z,.2,.025,.09,m.leaf);leaf.rotation.y=side*.4;}
  }else{k.rod(spec.species+' stem',[[x,.15,z],[x,y,z]],.014,m.leaf);for(const side of [-1,1]){const leaf=k.ell(spec.species+' leaf',x+side*.12,.35,z,.17,.025,.07,m.leaf);leaf.rotation.y=side*.4;}}
  return bloom(spec,x,y,z,spec.size||.9);
 }
 function finalize(){
  // Flower studies are static. Draw repeated petal geometry in material batches
  // while leaving the independently animated PAINTFALL paint plants untouched.
  g.updateWorldMatrix(true,true);const inverse=new T.Matrix4().copy(g.matrixWorld).invert(),batches=new Map();
  g.traverse(o=>{if(o.isMesh&&o.geometry===unit){const key=o.material.uuid;if(!batches.has(key))batches.set(key,{material:o.material,parts:[]});batches.get(key).parts.push(o);}});
  for(const {material,parts}of batches.values()){
   const instances=new T.InstancedMesh(unit,material,parts.length);instances.name='Static botanical petal and flower-detail instances';instances.userData.botanicalParts=[...new Set(parts.map(o=>o.name))];
   parts.forEach((o,i)=>{instances.setMatrixAt(i,new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld));o.removeFromParent();});instances.castShadow=instances.receiveShadow=true;instances.computeBoundingSphere();g.add(instances);
  }
 }
 return{bloom,plant,finalize,flowerCount:()=>flowers};
}

// Original low-detail silhouettes. Country ranges live in the country data and audit.
export function addEuropeAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail}){
 const m=c=>new T.MeshStandardMaterial({color:c,roughness:.95}),cream=m(0xe4ddc7),dark=m(0x414744),rust=m(0xb47750),gold=m(0xcdb65f),white=m(0xe1e0d5),v=spec.variant;
 if(spec.model==='monkey'&&v==='barbary-macaque'){for(const o of [...root.children])if(o.geometry?.type==='TubeGeometry'){root.remove(o);o.geometry.dispose();}sphere(root,0,.8,-.28,.04,.04,.045,coat).name='Barbary macaque vestigial tail';return;}
 if(spec.model==='europe-mammal'){
  root.traverse(o=>o.geometry?.dispose());root.clear();head.clear();root.add(head);legs.length=0;wings.length=0;
  const deer=/deer|ibex|chamois|moose|bison|muskox|duiker/.test(v),bear=v==='bear',hare=/hare|rabbit/.test(v),hedge=v==='hedgehog',small=!deer&&!bear&&!['wolf','lynx'].includes(v),y=deer?1:bear?.7:small?.35:.6,w=deer?.38:bear?.52:small?.24:.32,len=deer?.78:bear?.8:small?.48:.65;
  sphere(root,0,y,0,w,deer?.4:bear?.4:.23,len,coat);head.position.set(0,y+(deer?.35:.12),len*.85);sphere(head,0,0,.04,deer?.18:.15,deer?.23:.15,deer?.22:.2,coat);sphere(head,0,-.055,.2,.12,.075,.12,cream);sphere(head,0,-.04,.3,.06,.04,.04,dark);
  if(/stoat|weasel|mink|polecat/.test(v)){root.children[1].scale.set(.16,.14,.65);head.position.set(0,.37,.58);sphere(root,0,.24,.12,.15,.09,.48,cream);tail(root,[new T.Vector3(0,.3,-.5),new T.Vector3(.1,.18,-.95)],.045,coat).name='Mustelid long tapering tail';if(v==='stoat')sphere(root,.1,.18,-.95,.055,.045,.1,dark);if(v==='polecat')for(const s of [-1,1])sphere(head,s*.1,.04,.13,.04,.065,.075,dark);}
  if(/dormouse|vole|hamster|mole|ground-squirrel/.test(v)){head.position.set(0,.37,.35);root.children[1].scale.set(.24,.22,.35);for(const s of [-1,1])sphere(head,s*.13,.04,.16,.035,.04,.035,dark);if(v.includes('dormouse')){tail(root,[new T.Vector3(0,.28,-.35),new T.Vector3(.22,.3,-.8),new T.Vector3(.32,.5,-.95)],.085,coat);if(v==='garden-dormouse')for(const s of [-1,1])sphere(head,s*.13,.04,.12,.035,.07,.13,dark);}if(v==='mole'){sphere(head,0,-.02,.25,.05,.035,.1,rust);for(const s of [-1,1])sphere(root,s*.28,.065,.25,.17,.035,.12,rust).name='Broad mole digging forefoot';}if(v==='hamster'){sphere(root,0,.25,.3,.18,.13,.1,dark);for(const s of [-1,1])sphere(head,s*.13,-.04,.09,.05,.08,.08,cream);}}
  for(const s of [-1,1]){sphere(head,s*.13,.04,.17,.025,.025,.025,dark);sphere(head,s*.14,hare?.32:.2,-.04,hare?.05:.065,hare?.3:.1,.045,coat);}
  for(const s of [-1,1])for(const z of [-len*.65,len*.6]){const leg=new T.Group();leg.position.set(s*w*.7,y-.1,z);root.add(leg);rod(leg,new T.Vector3(),new T.Vector3(0,-(y-.13),.04),deer?.045:.045,coat);sphere(leg,0,-(y-.13),.1,.075,.035,hare?.15:.1,dark);legs.push(leg);}
  if(/deer|moose/.test(v))for(const s of [-1,1]){rod(head,new T.Vector3(s*.12,.18,-.05),new T.Vector3(s*.3,.9,-.15),.03,cream);for(let j=0;j<(v==='roe-deer'?2:4);j++)rod(head,new T.Vector3(s*(.15+j*.04),.4+j*.12,-.1),new T.Vector3(s*(.3+j*.08),.56+j*.12,.1),.02,cream);if(v==='moose')sphere(head,s*.4,.7,-.13,.23,.2,.05,cream);}
  if(['ibex','chamois','bison','muskox'].includes(v))for(const s of [-1,1])tail(head,[new T.Vector3(s*.12,.2,-.05),new T.Vector3(s*.28,v==='ibex'?1:.55,-.25),new T.Vector3(s*.32,v==='chamois'?.46:.75,-.55)],.035,dark).name='Species horn study';
  if(v==='maxwell-duiker')for(const s of [-1,1])rod(head,new T.Vector3(s*.09,.2,-.02),new T.Vector3(s*.1,.4,-.12),.025,dark).name='Duiker short horn';
  if(v==='red-squirrel'){tail(root,[new T.Vector3(0,.3,-.4),new T.Vector3(.15,.55,-.85),new T.Vector3(.12,1.1,-.75)],.15,coat).name='Raised squirrel tail';for(const s of [-1,1])rod(head,new T.Vector3(s*.14,.2,-.04),new T.Vector3(s*.15,.37,-.05),.025,coat);}
  else if(v==='beaver'){const o=sphere(root,0,.12,-.9,.24,.035,.4,dark);o.name='Broad flat beaver tail';for(let j=0;j<7;j++)rod(root,new T.Vector3(-.2,.158,-.65-j*.07),new T.Vector3(.2,.158,-.65-j*.07),.008,coat);}
  else if(v==='hedgehog'||v==='porcupine')for(let j=0;j<75;j++){const a=j*2.4,z=-.35+(j%12)*.055,p=new T.Vector3(Math.cos(a)*.2,.4,z);rod(root,p,p.clone().add(new T.Vector3(Math.cos(a)*.08,v==='porcupine'?.25:.12,0)),.009,j%2?cream:dark).name='Short dorsal spine';}
  else if(v==='pine-marten'){sphere(root,0,.28,.32,.18,.13,.13,gold);tail(root,[new T.Vector3(0,.3,-.4),new T.Vector3(.1,.22,-.9),new T.Vector3(.2,.12,-1.1)],.085,coat);}
  else if(v==='wolf'||v==='arctic-fox')tail(root,[new T.Vector3(0,y,-len*.8),new T.Vector3(.12,.25,-len- .5)],.14,coat);
  else if(v==='lynx'){for(const s of [-1,1])rod(head,new T.Vector3(s*.14,.25,-.04),new T.Vector3(s*.16,.4,-.04),.018,dark);sphere(root,0,.6,-.72,.08,.08,.15,coat).name='Lynx short tail';}
  else sphere(root,0,y-.08,-len,.1,.09,.12,cream);
  if(v==='bison'||v==='muskox'){sphere(root,0,y+.15,.3,.48,.55,.5,coat);for(let j=0;j<18;j++)sphere(root,Math.sin(j*2.4)*.35,.5,-.5+(j%6)*.2,.1,.35,.12,coat);}
  if(v==='beech-marten'){sphere(root,0,.35,.3,.18,.19,.1,white);tail(root,[new T.Vector3(0,.3,-.45),new T.Vector3(.15,.18,-1)],.08,coat);}
  if(v==='wildcat'||v==='iberian-lynx'){for(const s of [-1,1])for(let j=0;j<12;j++)sphere(root,s*.23,.4+(j%3)*.06,-.4+Math.floor(j/3)*.2,.025,.025,.035,dark);if(v==='wildcat'){tail(root,[new T.Vector3(0,.35,-.45),new T.Vector3(.1,.15,-.9)],.07,coat);for(let j=0;j<5;j++)sphere(root,.03+j*.018,.3-j*.03,-.5-j*.08,.075,.06,.025,dark);}else for(const s of [-1,1])rod(head,new T.Vector3(s*.13,.23,-.04),new T.Vector3(s*.15,.4,-.05),.018,dark);}
  if(v==='wolverine'){sphere(root,0,.5,0,.34,.27,.55,coat);for(const s of [-1,1])tail(root,[new T.Vector3(s*.28,.55,.3),new T.Vector3(s*.32,.5,-.2),new T.Vector3(s*.2,.4,-.5)],.035,gold);}
  if(v==='reindeer')for(const s of [-1,1]){rod(head,new T.Vector3(s*.1,.2,-.05),new T.Vector3(s*.3,.85,-.2),.025,cream);for(let j=0;j<4;j++)rod(head,new T.Vector3(s*.22,.45+j*.1,-.14),new T.Vector3(s*(.4+j*.04),.55+j*.1,.05),.017,cream);}
  return;
 }
 if(spec.model!=='bird')return;
 // Replace generic colored cheek spots with species-selected face and breast cues.
 for(const o of [...head.children])if(o.geometry?.type==='SphereGeometry'&&o.scale.x===.025&&o.scale.y===.07){head.remove(o);o.geometry.dispose();}
 const breast=(material,sx=.16,sy=.18)=>sphere(root,0,.48,.31,sx,sy,.055,material);
 if(v==='robin')breast(rust);if(v==='great-tit'){breast(gold);sphere(root,0,.47,.365,.04,.2,.025,dark);for(const s of [-1,1])sphere(head,s*.1,.01,.1,.025,.07,.08,cream);}
 if(['magpie','wagtail','oystercatcher','wirebird','puffin','eider'].includes(v)){breast(white);for(const w of wings)sphere(w,0,.03,-.12,.13,.12,.17,dark);}
 if(v==='goldfinch'){sphere(head,0,0,.17,.09,.1,.05,rust);for(const w of wings)sphere(w,0,-.04,-.1,.13,.06,.22,gold);}
 if(v==='chaffinch')breast(m(0xb88d7a));if(v==='bluebird'){for(const w of wings)for(const o of w.children)if(o.isMesh)o.material=m(0x5c86ac);breast(rust);}
 if(v==='blackbird')sphere(head,0,-.02,.27,.05,.04,.12,gold);
 if(v==='vireo')for(const s of [-1,1]){sphere(head,s*.105,.035,.11,.028,.05,.04,white);sphere(head,s*.13,.035,.13,.012,.014,.018,dark);}
 if(v==='catbird'){sphere(head,0,.1,-.02,.11,.07,.12,dark);breast(m(0x878d8a));}
 if(v==='puffin'){sphere(head,0,-.02,.28,.055,.14,.18,rust);for(const s of [-1,1])sphere(head,s*.105,0,.07,.03,.1,.12,white);}
 if(v==='oystercatcher')rod(head,new T.Vector3(0,0,.2),new T.Vector3(0,0,.55),.025,rust);
 if(['arctic-tern','white-tern','white-tropicbird','red-tropicbird','petrel','booby','noddy'].includes(v)){for(const w of wings)w.scale.x=1.8;for(const s of [-1,1]){const long=v.includes('tropicbird');rod(root,new T.Vector3(s*.04,.44,-.65),new T.Vector3(s*.16,.4,long?-2:-1.1),.016,v==='red-tropicbird'?rust:cream).name='Seabird tail streamer';}}
 if(v==='white-stork'){head.position.y+=.5;sphere(root,0,.9,.3,.07,.45,.07,white);rod(head,new T.Vector3(0,-.02,.18),new T.Vector3(0,-.03,.6),.025,rust);for(const l of legs){l.position.y+=.2;l.children.forEach(o=>{o.scale.y*=1.8;o.position.y*=1.8;});}}
 if(['buzzard','kestrel','raven','swift'].includes(v))for(const w of wings)w.scale.x=v==='swift'?2:1.5;
 if(v==='sunbird')rod(head,new T.Vector3(0,0,.18),new T.Vector3(0,-.06,.43),.015,dark);
 if(v==='kingfisher'){for(const w of wings)for(const o of w.children)if(o.isMesh)o.material=m(0x558b9f);sphere(head,0,-.01,.3,.05,.045,.2,dark);breast(rust);}
 if(v==='grosbeak')sphere(head,0,-.02,.25,.09,.09,.13,dark);
 if(v==='flycatcher')for(const s of [-1,1])rod(root,new T.Vector3(s*.03,.44,-.65),new T.Vector3(s*.08,.35,-1.45),.022,rust).name='Paradise flycatcher long tail';
 if(v==='booby'||v==='petrel')for(const w of wings)sphere(w,0,-.07,-.15,.12,.1,.2,dark);
 if(/owl/.test(v)){sphere(head,0,0,.1,.17,.17,.08,v==='barn-owl'?white:cream);for(const s of [-1,1]){sphere(head,s*.075,.025,.18,.04,.045,.02,gold);sphere(head,s*.075,.025,.2,.022,.03,.018,dark);}root.scale.multiplyScalar(v==='little-owl'?.85:1.25);}
 if(/woodpecker/.test(v)){sphere(head,0,.16,-.03,.1,.06,.13,rust);rod(head,new T.Vector3(0,0,.16),new T.Vector3(0,0,.46),.025,dark);for(const w of wings)for(let j=0;j<4;j++)sphere(w,0,.03,-.2+j*.1,.06,.025,.025,cream);}
 if(['blue-tit','jay','iberian-magpie'].includes(v)){const blue=m(0x6f9cbb);for(const w of wings)sphere(w,0,0,-.05,.14,.1,.23,blue);if(v==='blue-tit'){sphere(head,0,.13,-.03,.1,.05,.1,blue);breast(gold);}if(v==='iberian-magpie')for(const s of [-1,1])rod(root,new T.Vector3(s*.035,.44,-.65),new T.Vector3(s*.08,.36,-1.4),.025,blue);}
 if(v==='nutcracker')for(const s of [-1,1])for(let j=0;j<18;j++)sphere(root,s*.15,.45+(j%3)*.1,-.35+Math.floor(j/3)*.1,.018,.02,.025,cream);
 if(v==='dipper')breast(white,.17,.2);if(v==='bullfinch')breast(rust);if(v==='oriole')breast(gold);
 if(v==='shrike'||v==='nuthatch')for(const s of [-1,1])sphere(head,s*.105,.025,.1,.025,.03,.14,dark);
 if(v==='redpoll')sphere(head,0,.14,.03,.065,.04,.07,rust);
 if(v==='goldcrest')sphere(head,0,.14,.01,.035,.025,.11,gold);
 if(v==='red-chough')tail(head,[new T.Vector3(0,0,.18),new T.Vector3(0,-.02,.36),new T.Vector3(0,-.08,.45)],.018,rust);
 if(v==='capercaillie'){root.scale.multiplyScalar(1.5);for(let j=0;j<9;j++){const o=sphere(root,(j-4)*.08,.6,-.85,.05,.25,.07,dark);o.rotation.z=(j-4)*.15;}breast(m(0x4e7666));}
 if(['whooper-swan','grebe','common-crane','spoonbill','avocet'].includes(v)){const h=v==='whooper-swan'?.7:v==='common-crane'?.65:.3;head.position.y+=h;sphere(root,0,.65+h*.4,.3,.075,h*.65,.08,coat);if(v==='spoonbill'){rod(head,new T.Vector3(0,-.02,.2),new T.Vector3(0,-.03,.6),.022,dark);sphere(head,0,-.03,.61,.09,.025,.11,dark).name='Spoonbill broad bill tip';}if(v==='avocet')tail(head,[new T.Vector3(0,0,.2),new T.Vector3(0,0,.4),new T.Vector3(0,.1,.6)],.018,dark);}
 if(v==='european-hoopoe'){for(let j=0;j<7;j++)rod(head,new T.Vector3(0,.1,-.04),new T.Vector3((j-3)*.035,.3+Math.sin(j/6*Math.PI)*.12,-.1),.012,rust);tail(head,[new T.Vector3(0,0,.18),new T.Vector3(0,-.02,.4),new T.Vector3(0,-.08,.5)],.015,dark);}
 if(v==='european-bee-eater'){breast(gold);for(const s of [-1,1])sphere(head,s*.105,.025,.08,.02,.03,.14,dark);rod(head,new T.Vector3(0,0,.2),new T.Vector3(0,-.04,.48),.015,dark);}
}


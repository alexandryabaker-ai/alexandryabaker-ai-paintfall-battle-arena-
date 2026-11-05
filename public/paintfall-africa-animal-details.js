import {addNextThirtyAnimalDetails} from './paintfall-next-thirty-animal-details.js';
export function addAfricaAnimalDetails(T,args){
 const {root,head,legs,wings,spec,coat,sphere,rod,tail}=args,v=spec.variant,mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95}),dark=mat(0x454b49),cream=mat(0xe4dbc3),red=mat(0xb87967),gold=mat(0xbda66e);
 if(spec.model==='african-mammal'){
  const small=['lemur','fossa','tenrec','mongoose','pangolin','aardvark','meerkat','bat-eared-fox','cape-hare','cape-ground-squirrel','dassie-rat','civet','potto','galago','red-river-hog'].includes(v),map=small?'mongoose':['bongo','nyala','kudu','eland','sable','lechwe','puku','suni','duiker','bushbuck'].includes(v)?'bushbuck':'impala';
  addNextThirtyAnimalDetails(T,{...args,spec:{...spec,model:'afro-arabian-mammal',variant:map}});
  // Keep the shared four-legged scaffold, replacing its generic tails and flank marks.
  for(const o of [...root.children])if(o.geometry?.type==='TubeGeometry'||o.geometry?.type==='CylinderGeometry')root.remove(o);
  if(['bongo','nyala','kudu','eland'].includes(v))for(const s of [-1,1])for(let j=0;j<7;j++)rod(root,new T.Vector3(s*.33,1.08,-.55+j*.18),new T.Vector3(s*.33,.68,-.53+j*.18),.012,cream).name='Forest antelope flank stripe';
  if(v==='duiker'){sphere(root,0,1.12,-.23,.24,.06,.28,gold).name='Duiker dorsal patch';root.scale.setScalar(.8);}
  if(v==='suni')root.scale.setScalar(.65);
  if(!small)tail(root,[new T.Vector3(0,.8,-.68),new T.Vector3(.05,.45,-.92)],.03,dark).name='Short ungulate tail';
  if(!['bongo','nyala','kudu','eland','sable','lechwe','puku','suni','duiker','bushbuck'].includes(v))for(const o of [...head.children])if(o.name==='Regional antelope horn')head.remove(o);
  if(['bongo','nyala','kudu','eland','sable'].includes(v)){for(const o of [...head.children])if(o.name==='Regional antelope horn')head.remove(o);for(const s of [-1,1]){const pts=Array.from({length:24},(_,j)=>new T.Vector3(s*(.13+j*.006)+Math.sin(j*.5)*.04,.2+j*(v==='kudu'?.055:.035),-.06-j*(v==='sable'?.035:.012)));tail(head,pts,.035,dark).name='Spiral or swept forest antelope horn';}if(v==='eland')sphere(root,0,.6,.4,.2,.3,.22,coat);}
  if(['springbok','steenbok','klipspringer','bontebok','oryx','hartebeest'].includes(v)){for(const s of [-1,1])tail(head,[new T.Vector3(s*.12,.18,0),new T.Vector3(s*.2,v==='oryx'?1.2:.65,-.15),new T.Vector3(s*.21,v==='oryx'?1.4:.7,-.35)],.03,dark).name='Savanna antelope horn';if(['springbok','bontebok','oryx'].includes(v)){sphere(head,0,0,.18,.07,.2,.07,cream);for(const s of [-1,1])rod(root,new T.Vector3(s*.33,.8,.5),new T.Vector3(s*.33,.8,-.55),.055,dark);}if(v==='klipspringer'||v==='steenbok')root.scale.setScalar(.7);}
  if(v==='giraffe'){head.position.y+=1.5;sphere(root,0,1.65,.4,.22,1.02,.24,coat);for(const s of [-1,1]){rod(head,new T.Vector3(s*.1,.15,0),new T.Vector3(s*.12,.45,0),.035,coat);sphere(head,s*.12,.45,0,.06,.06,.06,dark);}for(const s of [-1,1])for(let j=0;j<16;j++)sphere(root,s*.32,.7+(j%4)*.12,-.5+Math.floor(j/4)*.28,.065,.065,.08,mat(0x997457));for(let j=0;j<7;j++)sphere(root,.17,1+j*.22,.5,.07,.08,.1,mat(0x997457));}
  if(v==='rhino'){sphere(root,0,.9,-.05,.65,.55,.95,coat);sphere(head,0,-.03,.2,.32,.25,.35,coat);for(const [z,h]of [[.4,.45],[.17,.22]]){const o=new T.Mesh(new T.ConeGeometry(.075,h,8),cream);o.position.set(0,.13+h/2,z);o.name='Rhino nasal horn';head.add(o);}}
  if(v==='aardvark'){sphere(root,0,.4,0,.36,.31,.65,coat);sphere(head,0,-.06,.28,.1,.1,.28,coat);for(const s of [-1,1])sphere(head,s*.12,.25,-.04,.055,.2,.04,coat);tail(root,[new T.Vector3(0,.25,-.6),new T.Vector3(.1,.12,-1.15)],.055,coat);}
  if(v==='pangolin'){sphere(root,0,.4,-.04,.3,.28,.58,coat);for(let j=0;j<9;j++)for(let k=0;k<5;k++){const a=(k-2)*.45;const o=new T.Mesh(new T.ConeGeometry(.07,.16,4),gold);o.position.set(Math.sin(a)*.28,.45+Math.cos(a)*.23,-.5+j*.12);o.rotation.x=-.7;o.name='Pangolin overlapping scale study';root.add(o);}tail(root,[new T.Vector3(0,.25,-.5),new T.Vector3(0,.1,-1.3)],.09,coat);}
  if(v==='lemur'){sphere(head,0,.02,.05,.19,.18,.13,cream);for(const s of [-1,1])sphere(head,s*.09,.03,.15,.055,.055,.03,dark);tail(root,[new T.Vector3(0,.3,-.5),new T.Vector3(.1,.5,-.9),new T.Vector3(.2,.9,-1)],.075,cream);for(let j=0;j<9;j++)sphere(root,j*.024,.3+j*.067,-.5-j*.06,.08,.055,.07,j%2?dark:cream);}
  if(v==='tenrec')for(let j=0;j<50;j++){const a=j*2.4;rod(root,new T.Vector3(Math.cos(a)*.22,.45,-.4+(j%9)*.1),new T.Vector3(Math.cos(a)*.3,.63,-.4+(j%9)*.1),.012,j%3?dark:cream);}
  if(['fossa','civet','meerkat','bat-eared-fox','cape-hare','cape-ground-squirrel','dassie-rat','potto','galago'].includes(v)){const long=['fossa','civet','galago'].includes(v);tail(root,[new T.Vector3(0,.3,-.5),new T.Vector3(.1,.17,long?-1.3:-.85)],v==='cape-ground-squirrel'?.11:.05,coat);if(v==='bat-eared-fox'||v==='cape-hare')for(const s of [-1,1])sphere(head,s*.14,.3,-.04,.07,.23,.04,coat);if(v==='galago'||v==='potto')for(const s of [-1,1])sphere(head,s*.1,.03,.16,.05,.06,.035,gold);if(v==='civet')for(const s of [-1,1])for(let j=0;j<15;j++)sphere(root,s*.25,.4+(j%3-1)*.08,-.4+Math.floor(j/3)*.2,.02,.025,.035,dark);}
  if(v==='red-river-hog'){sphere(head,0,-.05,.25,.15,.1,.2,coat);for(const s of [-1,1]){sphere(head,s*.15,.18,-.03,.06,.15,.04,coat);rod(head,new T.Vector3(s*.16,.25,-.03),new T.Vector3(s*.21,.38,-.12),.02,cream);}tail(root,[new T.Vector3(0,.35,-.5),new T.Vector3(.12,.25,-.85)],.025,dark);}
 }else if(spec.model==='bird'){
  if(v.includes('turaco')||v==='crowned-crane'||v==='hornbill')addNextThirtyAnimalDetails(T,{...args,spec:{...spec,variant:v.includes('turaco')?'turaco':v}});
  if(v.includes('parrot')||v==='echo-parakeet'){sphere(head,0,-.03,.25,.07,.09,.075,red);sphere(head,0,-.11,.25,.045,.05,.045,dark);for(const w of wings)w.traverse(o=>{if(o.isMesh&&v==='grey-parrot')o.material=mat(0xa5aaa4);});}
  if(v==='pink-pigeon')sphere(root,0,.45,.26,.17,.2,.12,mat(0xc8a6a5));
  if(v==='fody')sphere(head,0,.02,.05,.12,.14,.14,red);
  if(v==='kestrel')for(const s of [-1,1])for(let j=0;j<10;j++)sphere(root,s*.19,.5+(j%3-1)*.05,-.25+Math.floor(j/3)*.13,.012,.02,.02,dark);
  if(v.includes('sunbird')){tail(head,[new T.Vector3(0,-.02,.17),new T.Vector3(0,-.03,.33),new T.Vector3(0,-.09,.4)],.015,dark);sphere(root,0,.5,.27,.14,.12,.06,gold);}
  if(v==='secretarybird'){addNextThirtyAnimalDetails(T,{...args,spec:{...spec,variant:'heron'}});for(let j=0;j<7;j++)rod(head,new T.Vector3(0,.12,-.06),new T.Vector3((j-3)*.035,.24,-.3),.012,dark);}
  if(v==='blue-crane')addNextThirtyAnimalDetails(T,{...args,spec:{...spec,variant:'heron'}});
  if(v==='grey-parrot')for(const o of root.children.filter(o=>o.name==='Bird tail feather'))o.material=red;
  if(spec.kind==='African fish eagle'){sphere(head,0,.02,.05,.12,.15,.16,cream);sphere(root,0,.55,.26,.15,.14,.08,cream);}
  if(v==='owl'){for(const s of [-1,1]){sphere(head,s*.055,.02,.16,.055,.065,.025,gold);sphere(head,s*.055,.02,.185,.025,.03,.015,dark);}}
  if(v==='flycatcher'||spec.kind==='Cape sugarbird')for(const s of [-1,1])rod(root,new T.Vector3(s*.03,.45,-.65),new T.Vector3(s*.04,.35,-1.65),.015,coat).name='Long streaming tail feather';
  if(v==='magpie-robin'){sphere(root,0,.39,.25,.15,.16,.06,cream);for(const w of wings)sphere(w,0,0,-.02,.13,.04,.14,cream);}
  if(v==='peafowl'){for(let j=0;j<4;j++)rod(head,new T.Vector3((j-1.5)*.035,.15,0),new T.Vector3((j-1.5)*.045,.36,-.06),.012,cream);}
  if(v==='jacana')for(const leg of legs)for(const s of [-1,0,1])rod(leg,new T.Vector3(0,-.14,0),new T.Vector3(s*.11,-.14,.3),.012,cream).name='Jacana spread toe';
  if(v==='roller'){sphere(root,0,.45,.26,.17,.17,.08,mat(0x8eb7bb));for(const w of wings)w.traverse(o=>{if(o.isMesh)o.material=mat(0x92acbf);});}
  if(spec.scientificName==='Coracias abyssinicus')for(const s of [-1,1])rod(root,new T.Vector3(s*.045,.45,-.65),new T.Vector3(s*.06,.34,-1.3),.014,coat).name='Abyssinian roller tail streamer';
  if(v==='violet-starling'){sphere(head,0,.02,.06,.12,.14,.13,mat(0x8796b0));sphere(root,0,.43,.22,.15,.16,.1,mat(0x8a81a9));}
  if(v==='guineafowl')addNextThirtyAnimalDetails(T,args);
 }
}

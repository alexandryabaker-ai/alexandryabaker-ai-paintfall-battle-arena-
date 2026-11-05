import {addFinalAnimalDetails} from './paintfall-final-animal-details.js';
import {addEuropeAnimalDetails} from './paintfall-europe-animal-details.js';
import {addAfricaAnimalDetails} from './paintfall-africa-animal-details.js';
import {addNextThirtyAnimalDetails} from './paintfall-next-thirty-animal-details.js';
import {addLevantAnimalDetails} from './paintfall-levant-animal-details.js';
import {addCaucasusAnimalDetails} from './paintfall-caucasus-animal-details.js';
import {addCentralAsiaAnimalDetails} from './paintfall-central-asia-animal-details.js';
import {addSouthAsiaAnimalDetails} from './paintfall-south-asia-animal-details.js';
import {addHimalayaDeltaAnimalDetails} from './paintfall-himalaya-delta-animal-details.js';
import {addEastAsiaAnimalDetails} from './paintfall-east-asia-animal-details.js';
import {addGroupTenAnimalDetails} from './paintfall-island-group-ten-animal-details.js';
import {addGroupNineAnimalDetails} from './paintfall-island-group-nine-animal-details.js';
import {addMicronesianAnimalDetails} from './paintfall-micronesian-animal-details.js';
import {addAtollAnimalDetails} from './paintfall-atoll-animal-details.js';
import {addArchipelagoAnimalDetails} from './paintfall-archipelago-animal-details.js';
import {addPacificAnimalDetails} from './paintfall-pacific-animal-details.js';
import {addRegionalBirdDetails} from './paintfall-regional-bird-details.js';
import {addWaterBuffaloFeatures} from './paintfall-water-buffalo.js';
export const laosWildlifeRoster=[
 {kind:'Asian elephant',scientificName:'Elephas maximus',speed:.4,routine:'browse'},
 {kind:'Northern white-cheeked gibbon',scientificName:'Nomascus leucogenys',speed:0,routine:'canopy browse'},
 {kind:'Sambar deer',scientificName:'Rusa unicolor',speed:.65,routine:'browse'},
 {kind:'Gaur',scientificName:'Bos gaurus',speed:.45,routine:'graze'},
 {kind:'Silver pheasant',scientificName:'Lophura nycthemera',speed:.55,routine:'peck'}
];
// One individual each. Prototype silhouettes and broad routines, not a complete ecosystem.
export function buildLaosWildlife(T,{land,ground,canOccupy,explorer,waterBounds=[],getInteractionTime=()=>0,roster=laosWildlifeRoster,regionName='Laos'}){
 const group=new T.Group();group.name=regionName.toLowerCase()+'-wildlife';land.add(group);const animals=[],habitatObstacles=[],mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95}),gray=mat(0x9aa3a7),brown=mat(0x947357),dark=mat(0x363c43),cream=mat(0xe9e1c9),red=mat(0xb96762),leaf=mat(0x81b59d),accent=mat(0x96bfc0);
 function sphere(g,x,y,z,sx,sy,sz,m){const mesh=new T.Mesh(new T.SphereGeometry(1,14,10),m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);g.add(mesh);return mesh;}
 function rod(g,a,b,r,m){const delta=b.clone().sub(a),mesh=new T.Mesh(new T.CylinderGeometry(r*.7,r,delta.length(),8),m);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());g.add(mesh);return mesh;}
 function tail(g,points,r,m){const mesh=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),20,r,8,false),m);g.add(mesh);return mesh;}
 function valid(x,z,clearance=0){return Math.hypot(x,z)<66&&[[0,0],...Array.from({length:8},(_,i)=>[Math.cos(i*Math.PI/4)*clearance,Math.sin(i*Math.PI/4)*clearance])].every(([dx,dz])=>canOccupy(x+dx,z+dz)&&!!ground(x+dx,z+dz)&&!waterBounds.some(b=>x+dx>b.min.x-.4&&x+dx<b.max.x+.4&&z+dz>b.min.z-.4&&z+dz<b.max.z+.4)&&!habitatObstacles.some(o=>Math.abs(x+dx-o.x)<o.halfX+.3&&Math.abs(z+dz-o.z)<o.halfZ+.3));}
 for(const [index,spec]of roster.entries()){
  const model=spec.model||(spec.kind==='Asian elephant'?'elephant':spec.kind.includes('gibbon')?'gibbon':spec.kind==='Sambar deer'?'deer':spec.kind==='Gaur'?'gaur':'bird'),elephant=model==='elephant',gibbon=['gibbon','ape','monkey','tarsier','tree-kangaroo','koala','bat'].includes(model),deer=model==='deer',gaur=model==='gaur',bird=model==='bird',clearance=(spec.clearance??(elephant?1.4:gaur||model==='buffalo'?1.35:model==='monitor'?2.2:model==='otter'?1.4:model==='pig'?1.2:model==='anoa'?.95:deer?.7:.3))*(spec.previewScale??1);
  let p;for(let i=0;i<1600;i++){const a=i*2.4+index,r=7+Math.sqrt(i)*1.2,x=explorer.position.x+Math.cos(a)*r,z=explorer.position.z+Math.sin(a)*r;if(valid(x,z,clearance)&&animals.every(a=>Math.hypot(x-a.base.x,z-a.base.z)>6)&&(!gibbon||valid(x+3,z,.4))){p=ground(x,z);break;}}if(!p)continue;
  const root=new T.Group(),head=new T.Group(),legs=[],wings=[];root.name=spec.kind;group.add(root);root.position.copy(p);
  const dimensions={cassowary:[.5,.6,.7,1.5],monitor:[.32,.23,.8,.34],otter:[.25,.22,.65,.3],pig:[.4,.35,.7,.7],anoa:[.4,.4,.75,.85],buffalo:[.55,.45,.9,1],crocodile:[.3,.14,.9,.24],tortoise:[.26,.17,.34,.2],bear:[.45,.4,.7,.65],tapir:[.5,.45,.8,.8]}[model];const w=dimensions?dimensions[0]:elephant?.85:gaur?.55:deer?.3:bird?.2:.25,h=dimensions?dimensions[1]:elephant?.8:gaur?.55:deer?.4:bird?.25:.4,length=dimensions?dimensions[2]:elephant?1.3:gaur?.9:deer?.75:bird?.45:.22,y=dimensions?dimensions[3]:elephant?1.65:gaur?1.2:deer?1:bird?.45:1,coat=spec.color?mat(spec.color):['bear','tapir','buffalo'].includes(model)?dark:elephant?gray:gaur||gibbon?dark:bird?cream:brown;
  sphere(root,0,y,0,w,h,length,coat);head.position.set(0,gibbon?1.6:y+.15,gibbon?.03:length*.8);root.add(head);sphere(head,0,0,0,w*.65,h*.7,elephant?.45:.24,coat);
  for(const side of [-1,1])sphere(head,side*w*.5,.06,.18,.025,.03,.025,dark);
  const count=bird||model==='cassowary'?2:4;for(let i=0;i<count;i++){const limb=new T.Group();limb.position.set(i%2?w*.6:-w*.6,gibbon?(i<2?1.3:.65):Math.max(.08,y-.2),bird||model==='cassowary'?0:i<2?length*.55:-length*.55);root.add(limb);const height=gibbon?(i<2?(model==='tarsier'?.4:model==='tree-kangaroo'?.55:1):.65):Math.max(.08,y-.2);rod(limb,new T.Vector3(),new T.Vector3(0,-height,0),elephant?.17:gaur?.09:bird?.025:.04,gibbon?dark:bird?red:coat);if(gibbon&&i<2){const hand=sphere(limb,0,-height,0,.065,.065,.065,dark);hand.name=model==='tarsier'?'Tarsier gripping hand':'Gibbon gripping hand';}if(gaur)rod(limb,new T.Vector3(0,-height*.6,0),new T.Vector3(0,-height,0),.085,cream);legs.push(limb);}
  if(elephant){for(const side of [-1,1])sphere(head,side*.55,-.07,-.06,.3,.52,.11,gray);tail(head,[new T.Vector3(0,-.15,.3),new T.Vector3(0,-.6,.55),new T.Vector3(0,-1,.6),new T.Vector3(.15,-1.1,.78)],.13,gray);tail(root,[new T.Vector3(0,1.5,-1.25),new T.Vector3(0,1,-1.5),new T.Vector3(.15,.5,-1.5)],.035,dark);}
  else if(gibbon){
   if(model==='gibbon'&&!spec.variant)for(const side of [-1,1])sphere(head,side*.15,-.02,.08,.065,.14,.15,cream);
   else if(spec.variant==='pileated')sphere(head,0,.2,-.03,.18,.045,.16,cream);
   else if(model==='ape')sphere(head,0,-.04,.12,.18,.16,.15,brown);
   else if(model==='tree-kangaroo'){sphere(root,0,1,0,.32,.45,.3,coat);sphere(root,0,1,.25,.22,.35,.08,cream);sphere(head,0,-.05,.16,.16,.12,.19,cream);for(const side of [-1,1])sphere(head,side*.17,.22,-.04,.07,.14,.06,cream);tail(root,[new T.Vector3(0,.85,-.2),new T.Vector3(.15,.45,-.7),new T.Vector3(.2,.15,-1.4)],.1,cream);for(const limb of legs.slice(2))sphere(limb,0,-.65,.1,.11,.06,.23,cream);}
   else if(model==='monkey'){sphere(head,0,-.1,.2,.13,spec.variant?.includes('macaque')||spec.variant==='crested'?.08:.19,.16,spec.variant==='crested'?dark:brown);if(spec.variant!=='crested')tail(root,[new T.Vector3(0,.8,-.2),new T.Vector3(.1,.5,-.7),new T.Vector3(.25,.25,-1.15)],.045,coat);else sphere(head,0,.3,-.06,.07,.2,.07,dark);}
   else if(model==='tarsier'){for(const side of [-1,1]){sphere(head,side*.12,.02,.15,.105,.12,.06,cream);sphere(head,side*.12,.02,.205,.08,.085,.025,dark);sphere(head,side*.21,.24,0,.12,.18,.06,coat);}tail(root,[new T.Vector3(0,.8,-.2),new T.Vector3(.05,.5,-.6),new T.Vector3(.15,.1,-1.3)],.025,coat);const twig=rod(root,new T.Vector3(0,0,.12),new T.Vector3(0,1.5,.12),.035,brown);twig.name='Tarsier supported upright twig';rod(root,new T.Vector3(-.22,.9,.12),new T.Vector3(.22,.9,.12),.025,brown).name='Tarsier handhold';root.scale.setScalar(.55);}
   if(!['tarsier','tree-kangaroo'].includes(model)&&!['macaque','crested'].includes(spec.variant))sphere(head,0,.24,-.03,.12,.15,.13,coat);else if(model==='monkey')for(const side of [-1,1])sphere(head,side*.18,.12,0,.065,.08,.045,coat);
  }
  else if(model==='cassowary'){head.position.set(0,2.3,.45);head.children.forEach(o=>o.visible=false);const blue=mat(0x65a7c2);sphere(root,0,1.9,.4,.13,.55,.13,blue);sphere(head,0,0,0,.14,.18,.17,blue);for(const side of [-1,1])sphere(head,side*.11,.03,.1,.025,.025,.025,dark);const casque=new T.Mesh(new T.ConeGeometry(.14,.4,5),brown);casque.position.set(0,.3,-.04);casque.name='Northern cassowary casque';head.add(casque);sphere(head,0,-.32,0,.04,.16,.05,red).name='Single cassowary wattle';rod(head,new T.Vector3(0,-.04,.13),new T.Vector3(0,-.09,.32),.04,gray);for(const leg of legs){sphere(leg,0,-1.3,.08,.1,.05,.22,dark);} }
  else if(model==='buffalo')addWaterBuffaloFeatures(T,{root,head,coat,cream,dark,y});
  else if(model==='anoa'){for(const side of [-1,1]){sphere(head,side*.24,.13,-.04,.13,.08,.07,coat);const horn=rod(head,new T.Vector3(side*.12,.17,-.08),new T.Vector3(side*.2,.5,-.25),.035,cream);horn.name='Anoa short horn';}sphere(head,0,-.1,.23,.17,.1,.18,coat);}
  else if(model==='pig'){sphere(head,0,-.1,.26,.2,.12,.25,coat);sphere(head,0,-.08,.49,.15,.1,.025,dark);for(const side of [-1,1]){sphere(head,side*.2,.21,-.06,.08,.14,.05,coat);if(spec.variant==='babirusa'){const tusk=tail(head,[new T.Vector3(side*.11,.03,.34),new T.Vector3(side*.16,.36,.32),new T.Vector3(side*.16,.5,.14),new T.Vector3(side*.13,.35,.03)],.027,cream);tusk.name='Babirusa curved tusk';}else rod(head,new T.Vector3(side*.18,-.13,.32),new T.Vector3(side*.24,-.02,.38),.024,cream);if(spec.variant==='bearded')for(let j=0;j<6;j++)rod(head,new T.Vector3(side*.18,-.09,.25),new T.Vector3(side*(.3+j*.015),-.2-j*.008,.35),.012,cream);if(spec.variant==='warty')sphere(head,side*.21,-.02,.18,.065,.05,.065,dark);}if(spec.variant!=='babirusa')for(let j=0;j<8;j++){const bristle=new T.Mesh(new T.ConeGeometry(.055,.24,5),dark);bristle.position.set(0,y+h,-.5+j*.14);root.add(bristle);}tail(root,[new T.Vector3(0,y,-.6),new T.Vector3(.1,y-.1,-.85),new T.Vector3(.2,y-.16,-.85)],.025,coat);}
  else if(model==='monitor'){sphere(head,0,-.08,.2,.16,.12,.34,coat);tail(root,[new T.Vector3(0,.3,-.7),new T.Vector3(0,.2,-1.3),new T.Vector3(.2,.12,-2)],.1,coat);for(const limb of legs){sphere(limb,0,-Math.max(.08,y-.2),.07,.1,.055,.16,coat);}if(spec.variant==='water')for(let j=0;j<14;j++){const a=j*2.4;sphere(root,Math.cos(a)*.25,.44,-.6+j*.085,.025,.025,.035,cream);}const tongue=rod(head,new T.Vector3(0,-.09,.45),new T.Vector3(0,-.09,.7),.012,spec.variant==='komodo'?cream:red);tongue.name='Monitor scent tongue';for(const side of [-1,1])rod(head,new T.Vector3(0,-.09,.7),new T.Vector3(side*.05,-.09,.78),.009,cream);}
  else if(model==='otter'){sphere(head,0,-.07,.18,.14,.08,.16,cream);tail(root,[new T.Vector3(0,.2,-.5),new T.Vector3(0,.13,-.9),new T.Vector3(.1,.07,-1.3)],.08,brown);for(const side of [-1,1]){sphere(head,side*.14,.15,-.06,.055,.055,.035,brown);rod(head,new T.Vector3(side*.1,-.04,.24),new T.Vector3(side*.32,-.01,.27),.007,cream);}}
  else if(deer||gaur){for(const side of [-1,1]){sphere(head,side*.24,.17,-.05,.14,.07,.1,coat);const horn=rod(head,new T.Vector3(side*.12,.18,-.1),new T.Vector3(side*(gaur?.28:.19),gaur?.6:.8,-.2),.03,cream);horn.name=gaur?'Gaur horn':'Sambar antler';if(deer)rod(head,new T.Vector3(side*.17,.48,-.16),new T.Vector3(side*.36,.7,.03),.02,cream);}sphere(head,0,-.08,.22,.14,.09,.23,brown);if(spec.variant==='spotted')for(const side of [-1,1])for(let j=0;j<12;j++)sphere(root,side*w*.91,y+(j%3-1)*.13,-.5+Math.floor(j/3)*.28,.018,.03,.035,cream);}
  else if(model==='bear'){for(const side of [-1,1]){sphere(head,side*.22,.23,-.06,.1,.1,.07,dark);rod(root,new T.Vector3(side*.28,y+.18,.58),new T.Vector3(0,y-.02,.65),.045,spec.variant==='sun'?brown:cream);}sphere(head,0,-.04,.2,.16,.1,.13,brown);}
  else if(model==='tapir'){sphere(root,0,y,-.15,w*1.03,h*1.03,length*.55,cream);sphere(head,0,-.13,.29,.12,.13,.23,dark);for(const side of [-1,1])sphere(head,side*.22,.2,-.08,.07,.1,.06,cream);}
  else if(model==='crocodile'){sphere(head,0,-.08,.35,.22,.07,.5,coat);sphere(head,0,-.13,.35,.21,.04,.48,cream);tail(root,[new T.Vector3(0,.2,-.7),new T.Vector3(0,.13,-1.3),new T.Vector3(.15,.07,-1.8)],.12,coat);for(let i=0;i<8;i++){const scute=new T.Mesh(new T.ConeGeometry(.07,.12,3),dark);scute.position.set(0,.39,-.6+i*.17);root.add(scute);}}
  else if(model==='tortoise'){sphere(root,0,.25,-.03,.29,.2,.36,dark);const skin=(x,z)=>new T.Vector3(x,.256+.2*Math.sqrt(Math.max(0,1-(x/.29)**2-((z+.03)/.36)**2)),z);for(let j=0;j<5;j++){const x=(j%3-1)*.13,z=(Math.floor(j/3)-.5)*.22;for(let k=0;k<6;k++){const a=k*Math.PI/3;rod(root,skin(x,z),skin(x+Math.cos(a)*.1,z+Math.sin(a)*.1),.008,cream);}}}
  else if(bird){sphere(head,0,0,.03,.11,.15,.17,spec.variant==='myna'?cream:dark);for(const side of [-1,1])sphere(head,side*.075,.025,.13,.025,.07,.065,spec.variant==='myna'?mat(0x66b0d3):spec.variant==='ibis'?gray:red);
   if(spec.variant==='ibis'){head.position.y+=.2;tail(head,[new T.Vector3(0,0,.1),new T.Vector3(0,-.05,.35),new T.Vector3(0,-.18,.6)],.035,brown);}
   else if(spec.variant?.includes('hornbill')){sphere(head,0,0,.32,.08,.12,.3,cream);sphere(head,0,.17,.26,.075,spec.variant==='rhinoceros-hornbill'?.16:.09,.19,spec.variant==='rhinoceros-hornbill'?red:cream);}
   else{const beak=new T.Mesh(new T.ConeGeometry(.06,.2,6),cream);beak.rotation.x=Math.PI/2;beak.position.z=.25;head.add(beak);if(spec.variant==='myna')sphere(head,0,.2,-.12,.065,.17,.06,cream);}
   for(let i=0;i<5;i++){const feather=sphere(root,(i-2)*.06,.45,-.7,.04,.05,spec.variant?.includes('hornbill')||['cockatoo','sparrow','imperial-pigeon','lorikeet','crowned-pigeon','bird-of-paradise','kookaburra','kea','parrotfinch','orange-dove','goshawk'].includes(spec.variant)||spec.pacificBird ? .28:.6,spec.variant==='ibis'?gray:spec.variant==='peacock-pheasant'?dark:['cockatoo','sparrow','imperial-pigeon','lorikeet','crowned-pigeon','bird-of-paradise','kookaburra','kea','parrotfinch','orange-dove','goshawk'].includes(spec.variant)||spec.pacificBird?coat:cream);if(spec.variant==='peacock-pheasant'){for(let j=0;j<3;j++)sphere(root,(i-2)*.06,.51,-.7-j*.2,.035,.018,.055,j%2?coat:cream);}feather.rotation.x=.15+i*.04;feather.name='Bird tail feather';}for(const side of [-1,1]){const wing=new T.Group();wing.position.set(side*.19,.5,-.08);root.add(wing);sphere(wing,side*.08,0,0,.14,.2,.3,spec.variant==='myna'?cream:['cockatoo','sparrow','imperial-pigeon','lorikeet','crowned-pigeon','bird-of-paradise','kookaburra','kea','parrotfinch','orange-dove','goshawk'].includes(spec.variant)||spec.pacificBird?coat:dark);if(spec.variant==='myna')sphere(wing,side*.12,-.11,-.12,.1,.08,.14,dark);wing.userData.side=side;wing.name='Bird wing';wings.push(wing);}}
  if(bird&&['cockatoo','sparrow','imperial-pigeon','lorikeet','crowned-pigeon','bird-of-paradise','kookaburra','kea','parrotfinch','orange-dove','goshawk'].includes(spec.variant))addRegionalBirdDetails(T,{root,head,spec,coat,sphere,rod});
  if(spec.pacificBird||['kangaroo','koala','wombat','emu','kiwi','takahe','seal','bat'].includes(model)||['tuatara','banded-iguana','crested-iguana','skink','kookaburra','kea','parrotfinch','orange-dove','goshawk'].includes(spec.variant))addPacificAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.archipelagoAnimal)addArchipelagoAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.atollAnimal)addAtollAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.previewScale)root.scale.multiplyScalar(spec.previewScale);
  if(spec.microBird)addMicronesianAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod});
  if(spec.groupNineAnimal)addGroupNineAnimalDetails(T,{root,head,spec,coat,sphere,rod});
  if(spec.groupTenAnimal)addGroupTenAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod});
  if(spec.eastAsiaAnimal)addEastAsiaAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.groupTwelveAnimal)addHimalayaDeltaAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.groupThirteenAnimal)addSouthAsiaAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.groupFourteenAnimal)addCentralAsiaAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.groupFifteenAnimal)addCaucasusAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.africaAnimal)addAfricaAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.nextThirtyAnimal)addNextThirtyAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.groupSixteenAnimal)addLevantAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.europeAnimal)addEuropeAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod,tail});
  if(spec.finalAnimal)addFinalAnimalDetails(T,{root,head,legs,wings,spec,sphere,rod,tail});
  const animal={...spec,model,root,head,legs,wings,base:p.clone(),clearance,phase:gibbon?0:index*2,angle:index*1.4,timer:4,turns:0,mode:'wander',distance:0,lift:0,cautious:true,focusHeight:spec.focusHeight??({kangaroo:1.15,koala:.9,wombat:.45,emu:1.3,kiwi:.4,takahe:.4,seal:.45}[model]??(gibbon?1.3:y))};
  if(spec.previewScale)animal.focusHeight*=spec.previewScale;
  if(gibbon){const tree=new T.Group();tree.position.copy(p);tree.name='Lao canopy habitat';group.add(tree);rod(tree,new T.Vector3(),new T.Vector3(0,5.5,0),.23,brown);const branch=rod(tree,new T.Vector3(0,2.7,0),new T.Vector3(3.2,2.8,0),.19,brown);branch.name='Gibbon supporting branch';const upperLimb=rod(tree,new T.Vector3(0,4.8,0),new T.Vector3(3.2,5.3,0),.12,brown);upperLimb.name='Connected upper canopy limb';const grip=rod(tree,new T.Vector3(2.2,5.3,0),new T.Vector3(3.2,5.3,0),.095,brown);grip.name='Gibbon overhead grip branch';sphere(tree,0,5.6,0,1.3,.8,1.3,leaf);animal.perchTree=tree;animal.perch=p.clone().add(new T.Vector3(2.7,3,0));root.position.copy(animal.perch);animal.lift=3;animal.mode='browse';habitatObstacles.push({x:p.x,z:p.z,halfX:.3,halfZ:.3});}
  else if(!spec.europeAnimal&&!spec.africaAnimal&&!spec.nextThirtyAnimal&&!spec.groupSixteenAnimal&&!spec.groupFifteenAnimal&&!spec.groupFourteenAnimal&&!spec.groupThirteenAnimal&&!spec.groupTwelveAnimal&&!spec.eastAsiaAnimal&&!spec.groupTenAnimal&&!spec.microBird&&!spec.atollAnimal&&!spec.archipelagoAnimal&&!['kangaroo','wombat','emu','kiwi','takahe','seal'].includes(model)&&!['tuatara','banded-iguana','crested-iguana','skink'].includes(spec.variant))sphere(root,0,y+h*.8,-.1,w*.4,.03,.12,accent);
  animals.push(animal);
 }
 function update(dt){dt=Math.max(0,Math.min(dt,.1));const time=getInteractionTime();for(const a of animals){if(a.interactionUntil>time){a.head.rotation.z=Math.sin(time*2)*.035;continue;}a.phase+=dt;a.head.rotation.z=0;
  if(a.perch&&a.model!=='gibbon'){a.root.position.copy(a.perch);a.root.rotation.set(0,0,0);a.mode=['tarsier','koala','bat'].includes(a.model)?'rest':Math.floor(a.phase/8)%3===2?'rest':'browse';a.head.rotation.x=.05;a.legs.forEach(l=>l.rotation.set(0,0,0));a.legs[0].rotation.x=Math.sin(a.phase*.6)*.12;continue;}if(a.perch){const t=a.phase%32;a.root.position.copy(a.perch);a.root.rotation.set(0,0,0);a.legs.forEach(l=>l.rotation.set(0,0,0));let grip=0;
   if(t>=6&&t<10){grip=T.MathUtils.smoothstep(t,6,10);a.mode='reach';}
   else if(t>=10&&t<22){grip=1;const theta=Math.sin((t-10)/12*Math.PI*2)*.18;a.root.position.x+=2.3*Math.sin(theta);a.root.position.y+=2.3*(1-Math.cos(theta));a.root.rotation.z=theta;a.mode='swing';}
   else if(t>=22&&t<26){grip=1-T.MathUtils.smoothstep(t,22,26);a.mode='release';}
   else a.mode=t>=26?'rest':'browse';
   a.legs[0].rotation.z=Math.PI*grip;a.legs[1].rotation.z=-Math.PI*grip;a.head.rotation.x=a.mode==='rest'?.08:.03;a.lift=3;continue;
  }
  if(a.wings.length){const cycle=a.phase%40;
   if(cycle>=20&&cycle<26){if(!a.flight){const start=a.root.position.clone();for(let i=0;i<32;i++){const angle=a.angle+i*.4,end=ground(start.x+Math.sin(angle)*2.6,start.z+Math.cos(angle)*2.6);if(end&&Array.from({length:12},(_,j)=>start.clone().lerp(end,j/11)).every(p=>valid(p.x,p.z,a.clearance))){a.flight={start,end,startTime:a.phase};break;}}}
    if(a.flight){const t=Math.min(1,(a.phase-a.flight.startTime)/6),p=a.flight.start.clone().lerp(a.flight.end,T.MathUtils.smoothstep(t,0,1)),floor=ground(p.x,p.z),old=a.root.position.clone();p.y=floor.y+Math.sin(t*Math.PI)*1.3;a.root.position.copy(p);a.distance+=p.distanceTo(old);a.lift=Math.max(0,p.y-floor.y);a.mode='fly';a.root.rotation.y=Math.atan2(a.flight.end.x-a.flight.start.x,a.flight.end.z-a.flight.start.z);a.wings.forEach(w=>w.rotation.z=w.userData.side*(.6+Math.sin(a.phase*16)*.5));a.legs.forEach(l=>l.rotation.x=.35);continue;}
   }
   if(a.flight){a.root.position.copy(a.flight.end);a.flight=null;a.lift=0;a.mode='wander';a.timer=4;}
   a.wings.forEach(w=>w.rotation.z=0);
  }
  a.timer-=dt;if(a.timer<=0){a.turns++;a.mode=a.mode==='wander'?(a.turns%4===0?'rest':a.routine):'wander';a.timer=a.mode==='wander'?5:3;a.angle+=1.2;}
  if(a.mode==='wander'){if(a.root.position.distanceTo(explorer.position)<3+a.clearance||a.spaceUntil>time)a.angle=Math.atan2(a.root.position.x-explorer.position.x,a.root.position.z-explorer.position.z);const x=a.root.position.x+Math.sin(a.angle)*a.speed*dt,z=a.root.position.z+Math.cos(a.angle)*a.speed*dt,p=valid(x,z,a.clearance)?ground(x,z):null;if(p&&Math.abs(p.y-a.root.position.y)<.4){a.distance+=a.root.position.distanceTo(p);a.root.position.copy(p);}else a.angle+=dt*3;a.root.rotation.y=a.angle;a.legs.forEach((l,i)=>l.rotation.x=Math.sin(a.phase*5+i%2*Math.PI)*.15);a.head.rotation.x=0;}
  else{a.legs.forEach(l=>l.rotation.x=0);a.head.rotation.x=a.mode==='rest'?.1:a.routine==='peck'?.25+Math.sin(a.phase*3)*.12:.2+Math.sin(a.phase)*.05;}
 }}
 return{group,animals,habitatObstacles,update,valid};
}











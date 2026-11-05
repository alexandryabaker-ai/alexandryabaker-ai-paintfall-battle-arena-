// Original prototype anatomy and field-mark studies; taxonomic names/ranges live in profiles.
export function addFinalAnimalDetails(T,{root,head,legs,wings,spec,sphere,rod,tail}){
 root.traverse(o=>o.geometry?.dispose());root.clear();head.clear();root.add(head);root.scale.setScalar(spec.previewScale||1);head.rotation.set(0,0,0);legs.length=0;wings.length=0;
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.96}),black=mat(0x303934),white=mat(0xe4e0d1),brown=mat(0x8b6b50),gray=mat(0x8c9289),red=mat(0xc55542),gold=mat(0xd1ae4d),green=mat(0x638b53),blue=mat(0x598ca7),pink=mat(0xc3948d),v=spec.variant||'',name=spec.kind.toLowerCase(),V=(x,y,z)=>new T.Vector3(x,y,z);
 const S=(g,n,x,y,z,a,b,c,m)=>{const o=sphere(g,x,y,z,a,b,c,m);o.name=n;return o;};
 const eyes=(sx=.13,z=.15)=>{for(const s of [-1,1])S(head,'Eye',s*sx,.04,z,.025,.028,.023,black);};
 const limb=(x,y,z,len,r,m,foot=.1)=>{const g=new T.Group();g.position.set(x,y,z);root.add(g);rod(g,V(0,0,0),V(0,-len,0),r,m);S(g,'Grounded foot',0,-len,.04,foot,.035,foot*1.4,m);legs.push(g);return g;};
 if(spec.model==='penguin'){
  const tall=/emperor|king/.test(v),y=tall?.95:.66;
  S(root,'Upright penguin body',0,y,0,.36,y*.85,.29,black);S(root,'White penguin belly',0,y,.24,.28,y*.7,.075,white);
  head.position.set(0,y*1.85,.02);S(head,'Penguin head',0,0,0,.23,.23,.23,black);S(head,'Penguin bill',0,-.055,.27,.055,.05,.15,/king|emperor/.test(v)?gold:black);if(v==='adelie')for(const s of [-1,1])S(head,'Adelie white eye ring',s*.19,.04,.13,.039,.043,.031,white);eyes(.19,.13);
  for(const s of [-1,1]){S(root,'Penguin flipper',s*.37,y,0,.075,.4,.14,black).rotation.z=s*.18;limb(s*.17,.15,.02,.1,.04,red,.13);if(/macaroni|rockhopper/.test(v))for(let j=0;j<5;j++)rod(head,V(s*.14,.14,.08),V(s*(.32+j*.025),.16-j*.035,-.14),.014,gold);if(tall)S(head,'Yellow neck patch',s*.19,-.16,.1,.06,.13,.06,gold);if(v==='gentoo')S(head,'Gentoo white eye patch',s*.18,.08,.02,.055,.1,.12,white);}
  if(/chinstrap|magellanic/.test(v))for(let j=0;j<11;j++){const a=j*Math.PI/10;S(root,'Penguin dark band',Math.cos(a)*.29,y*.8,.25+Math.sin(a)*.025,.035,.035,.035,black);}root.userData.flightless=true;return;
 }
 if(spec.model==='final-seal'){
  const elephant=v==='elephant-seal';S(root,'Streamlined seal body',0,.38,0,.48,.34,1.05,elephant?gray:brown);head.position.set(0,.62,.82);S(head,'Seal head',0,0,0,.26,.24,.3,gray);S(head,'Seal muzzle',0,-.04,.26,.2,.1,.13,brown);eyes(.2,.2);
  for(const s of [-1,1]){const flipper=new T.Group();flipper.position.set(s*.36,.1,.35);root.add(flipper);S(flipper,'Seal foreflipper',s*.18,0,-.1,.35,.055,.18,gray);legs.push(flipper);S(root,'Seal hind flipper',s*.22,.075,-1.1,.18,.055,.32,gray);for(let j=0;j<3;j++)rod(head,V(s*.12,-.03,.3),V(s*.4,-.02+j*.025,.4),.007,white);if(v==='fur-seal')S(head,'Small external seal ear',s*.23,.08,-.11,.04,.08,.05,brown);}
  if(elephant)S(head,'Male elephant seal nasal study',0,.01,.34,.12,.17,.18,gray);root.userData.flightless=true;return;
 }
 if(spec.model==='final-reptile'){
  const crab=v==='red-crab',frog=v==='frog',long=/iguana|galliwasp|whiptail/.test(v),coat=crab?red:name.includes('blue iguana')?blue:green;
  S(root,crab?'Crab carapace':frog?'Frog body':'Scaled reptile body',0,crab?.28:.19,0,crab?.4:.23,crab?.18:.14,long?.62:.32,coat);head.position.set(0,crab?.3:.23,crab?.2:long?.58:.3);S(head,'Head',0,0,0,crab?.15:.17,.12,.2,coat);eyes(.14,.12);
  if(crab){for(const s of [-1,1]){for(let j=0;j<4;j++){const leg=new T.Group();leg.position.set(s*.25,.17,-.3+j*.18);root.add(leg);rod(leg,V(0,0,0),V(s*.4,.03,.1),.025,red);rod(leg,V(s*.4,.03,.1),V(s*.55,-.12,.15),.02,red);legs.push(leg);}S(root,'Crab claw palm',s*.46,.25,.46,.17,.1,.16,red);for(const t of [-1,1])rod(root,V(s*.46,.25,.5),V(s*.46+t*.08,.24,.75),.04,red);}root.userData.crabWalkingLegs=8;}
  else{for(const s of [-1,1])for(const z of [-.2,.23]){const g=limb(s*.22,.16,z,.12,.035,coat,frog?.13:.08);g.rotation.z=s*.4;}if(!frog){tail(root,[V(0,.18,long?-.55:-.25),V(.15,.12,-.9),V(.28,.06,long?-1.6:-1)],.055,coat).name='Reptile tapering tail';if(v==='iguana')for(let j=0;j<13;j++){const o=new T.Mesh(new T.ConeGeometry(.035,.11,4),green);o.position.set(0,.34,-.5+j*.085);o.name='Iguana dorsal spine';root.add(o);}if(v==='anole')S(head,'Small folded anole dewlap',0,-.11,.12,.025,.1,.1,pink);}}
  root.userData.flightless=true;return;
 }
 if(spec.model==='final-mammal'){
  const ungulate=/guanaco|vicuna|pudu|brocket|deer|gazelle/.test(v),camel=/guanaco|vicuna/.test(v),canid=/fox|culpeo|wolf|bush-dog|raccoon-dog/.test(v),cat=/jaguar|puma|ocelot|margay|kodkod|geoffroy/.test(v),anteater=/anteater|tamandua/.test(v),armadillo=v.includes('armadillo'),rodent=/capybara|coypu|mara|viscacha|paca|agouti|hutia|gerbil|marmot|chipmunk/.test(v),tapir=v.includes('tapir');
  const coat=cat?(v==='jaguar'?gold:brown):v==='maned-wolf'?red:armadillo?gray:brown,y=camel?1.12:ungulate?.88:canid||cat?.57:tapir?.65:.34,w=tapir?.42:rodent?.29:.27,len=tapir?.78:anteater?.7:.57;
  S(root,'Species body study',0,y,0,w,ungulate?.34:tapir?.39:.24,len,coat);let hy=y+.15,hz=len*.8;if(camel){rod(root,V(0,y,.4),V(0,1.9,.55),.12,coat);hy=1.95;hz=.6;}head.position.set(0,hy,hz);S(head,'Mammal head',0,0,0,.19,.18,.25,coat);
  const snout=anteater?.65:canid?.3:v==='solenodon'?.35:rodent?.12:.18;S(head,'Species muzzle',0,-.04,.16+snout*.3,anteater?.055:.13,.09,snout,rodent?coat:white);S(head,'Nose',0,-.025,.16+snout*1.2,.05,.04,.04,black);eyes(.16,.15);
  for(const s of [-1,1])S(head,'External ear',s*.15,.2,-.06,.07,/mara|viscacha/.test(v)?.24:camel?.19:.1,.05,coat);
  for(const s of [-1,1])for(const z of [-len*.63,len*.57])limb(s*w*.72,y-.12,z,y-.16,ungulate?.045:.055,coat,ungulate?.075:.09);
  if(!/capybara|pudu|brocket/.test(v))tail(root,[V(0,y,-len*.8),V(.14,anteater?.28:canid?.25:.2,-len-.45),V(.2,.12,-len-(anteater?.9:.6))],anteater?.2:canid?.13:.065,coat).name='Species tail study';
  if(armadillo){S(root,'Armadillo armored carapace',0,y+.1,-.08,.33,.29,.55,gray);for(let j=0;j<8;j++){const o=new T.Mesh(new T.TorusGeometry(.29,.025,5,18,Math.PI),brown);o.position.set(0,y+.02,-.38+j*.095);o.name='Armadillo flexible armor band';root.add(o);}}
  if(anteater){for(const s of [-1,1])S(root,'Anteater shoulder marking',s*.25,y,.2,.025,.2,.29,v==='tamandua'?black:white);if(v==='anteater')S(root,'Giant anteater shaggy tail',0,.32,-1.15,.22,.31,.66,brown);}
  if(v==='tapir'||v==='mountain-tapir')S(head,'Tapir short proboscis',0,-.09,.42,.1,.12,.17,coat);
  if(/coati|raccoon/.test(v)){for(const s of [-1,1])S(head,'Dark facial marking',s*.15,.03,.14,.04,.08,.12,black);for(let j=0;j<6;j++)S(root,'Tail ring study',.15,.17,-.65-j*.09,.075,.065,.025,j%2?white:black);}
  if(cat&&v!=='puma'&&v!=='jaguarundi')for(const s of [-1,1])for(let j=0;j<23;j++){const a=j*2.4;S(root,'Feline coat marking',s*(w*.87),y+Math.sin(a)*.13,-.45+(j%8)*.12,.025,.034,.045,black);}
  if(/paca|chipmunk/.test(v))for(const s of [-1,1])for(let j=0;j<15;j++)S(root,'Light flank marking',s*w,y+.05+(j%3)*.07,-.4+Math.floor(j/3)*.15,.02,.025,.035,white);
  if(v==='maned-wolf'){for(const leg of legs)for(const o of leg.children)if(o.isMesh)o.material=black;S(root,'Maned wolf shoulder mane',0,.92,.15,.12,.2,.25,black);}
  if(v==='gazelle')for(const s of [-1,1])rod(head,V(s*.1,.15,0),V(s*.12,.52,-.1),.025,black);
  if(ungulate&&!camel&&!/pudu/.test(v))for(const s of [-1,1])rod(head,V(s*.1,.17,-.04),V(s*.2,.55,-.1),.024,brown);
  return;
 }
 // Birds are rebuilt to avoid retaining generic crests or inappropriate long tails.
 if(spec.model!=='bird')return;
 const water=/flamingo|ibis|crane|heron|egret|stilt|spoonbill/.test(v),longbill=/hummingbird|sylph|swordbill|spatuletail|streamertail/.test(v),parrot=/parrot|parakeet|lorikeet|macaw/.test(v),raptor=/eagle|condor|owl|caracara/.test(v),sea=/booby|gannet|tern|noddy|frigate|petrel|albatross|tropicbird|shag|puffin|murre|guillemot|skua|pelican/.test(v),flightless=/rhea|crake|steamer-duck/.test(v);
 let coat=sea?white:parrot?green:longbill||/quetzal|trogon|tody/.test(v)?green:gray;
 if(/scarlet|red-fronted|red-billed streamertail/.test(name))coat=red;if(/hyacinth|blue-throated macaw|blue-headed/.test(name))coat=blue;if(/cock-of|oriole|troupial|cardinal/.test(v))coat=/cardinal/.test(v)?red:gold;if(/flamingo/.test(v))coat=pink;if(v==='scarlet-ibis')coat=red;if(/warbler|yellowthroat|siskin|bananaquit/.test(v))coat=gold;if(/woodpecker|grackle|curassow|guan|koel|frigate|noddy|murre|guillemot|shag/.test(v))coat=black;if(/dove|wren|thrush|trembler|hornero|lark|pipit|bunting/.test(v))coat=brown;if(name==='snow petrel'||name==='white tern')coat=white;
 const y=water?1.16:v==='rhea'?1.25:.43,w=raptor?.29:.22,len=raptor?.48:.38;
 S(root,'Bird body',0,y,0,w,water?.32:.27,len,coat);head.position.set(0,water?1.8:v==='rhea'?2.1:.8,.26);if(water||v==='rhea')rod(root,V(0,y,.17),V(0,head.position.y,.26),.075,coat);S(head,'Bird head',0,0,0,.15,.16,.17,coat);eyes(.125,.1);
 const billLength=v==='swordbill'?.58:longbill?.35:/toucan/.test(v)?.5:water?.43:/pelican/.test(v)?.5:.17,billMat=parrot?white:/toucan/.test(v)?gold:/puffin|oystercatcher|tropicbird/.test(v)?red:black;
 if(parrot){S(head,'Hooked parrot bill',0,-.03,.19,.08,.11,.12,billMat);}else rod(head,V(0,-.02,.14),V(0,water?-.08:-.02,.14+billLength),longbill?.013:/toucan/.test(v)?.09:.025,billMat);
 if(v==='spoonbill')S(head,'Spoonbill broad bill tip',0,-.08,.14+billLength,.065,.025,.1,black);
 if(/owl/.test(v)){S(head,'Owl facial disc',0,.01,.13,.17,.17,.05,white);for(const s of [-1,1]){S(head,'Owl eye',s*.07,.03,.19,.045,.05,.02,gold);S(head,'Owl pupil',s*.07,.03,.21,.025,.03,.014,black);}}
 if(/tody|quetzal|trogon/.test(v))S(root,'Bright breast field',0,y,.31,.16,.18,.07,/tody/.test(v)?white:red);
 if(/woodpecker|cardinal|crested|cock-of/.test(v)){const o=S(head,'Selected bird crest',0,.16,-.01,.09,.13,.14,/woodpecker|cardinal/.test(v)?red:coat);o.rotation.x=-.3;}
 if(/bullfinch|finch|grassquit|spindalis/.test(v))S(head,'Seed-eating conical bill',0,-.01,.21,.065,.06,.1,gold);
 for(const s of [-1,1]){limb(s*.12,water?1:.27,0,water?.95:.22,.025,water?pink:brown,.07);if(!flightless){const wing=new T.Group();wing.position.set(s*w*.82,y,-.03);wing.userData.side=s;root.add(wing);S(wing,'Flight wing',s*.1,0,-.1,sea?.2:.14,.13,sea?.48:.33,coat);if(parrot||v==='roller')S(wing,'Colored flight feather field',s*.1,-.02,-.18,.14,.08,.22,blue);wings.push(wing);}else S(root,'Flightless bird wing',s*w,y,-.03,.07,.17,.28,coat);}
 for(let j=0;j<5;j++)S(root,'Bird tail feather',(j-2)*.045,y-.02,-.42,.033,.04,parrot?.31:.2,coat);
 if(/quetzal|sylph|spatuletail|streamertail|tropicbird|motmot/.test(v))for(const s of [-1,1]){const end=V(s*.12,y-.12,-1.45);rod(root,V(s*.035,y,-.45),end,.014,/tropicbird/.test(v)?white:green);if(/spatuletail|motmot/.test(v))S(root,'Racket-shaped tail feather',end.x,end.y,end.z,.08,.035,.13,blue);}
 if(v==='pelican')S(head,'Pelican throat pouch',0,-.13,.35,.1,.1,.28,gold);
 if(/booby|gannet|shag|puffin|murre|guillemot/.test(v)){S(root,'White seabird breast',0,y,.32,.17,.2,.05,white);for(const wing of wings)for(const o of wing.children)o.material=black;}
 if(flightless)root.userData.flightless=true;
 root.userData.anatomyStudy=v;
}

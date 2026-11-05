import {createGardenKit} from './paintfall-southeast-asia-gardens.js';
import {createBotanicalPlantTools} from './paintfall-garden-botany.js';
import {globalGardenProfiles} from './paintfall-garden-profiles.js';

// Beds leave a broad through route and a separate painting corner. These are
// original compositions, not reconstructions of historic or sacred properties.
const compositions={
 parterre:[[-5,-4.5,4.5,2.5],[5,-4.5,4.5,2.5],[-5,2.2,4.5,3.3]],
 ribbons:[[-5.3,-5.3,5.4,1.3],[4.8,-4,4.3,1.5],[-5.3,.2,5.4,1.3],[-5.3,3.9,5.4,1.3]],
 grove:[[-5,-3,3,3],[4.8,-4.7,3,2.4],[-5,3.3,3.5,3]],
 terrace:[[-6.8,-4.6,2.3,3.4],[-3.2,-3.2,2.2,2.7],[5,-4.4,4,2.2],[-5.3,3.2,5.5,2.2]],
 courtyard:[[-6,-3.4,2.4,5.4],[5,-4.6,4.5,2],[-4.9,3.8,4.4,1.8]],
 meadow:[[-5.7,-4.2,4.8,2.4],[4.7,-4,3.5,2.4],[-5.2,2.8,4.5,2.4]],
 crescent:[[-6,-4.5,2.9,2.4],[-7,-.8,2.7,2.4],[-5.3,3,3.7,2.4],[4.7,-4.6,4.2,2]],
 diagonal:[[-6.8,-5.1,2.2,2],[-4.4,-2.7,2.2,2],[-6.2,2.3,3.2,3],[4.8,-4.4,3.6,2.4]],
 orchard:[[-5.6,-4.4,3.6,2.6],[4.9,-4.4,3.6,2.6],[-5.6,2.5,3.6,3]],
 rockery:[[-6.3,-4.8,2.7,2],[4.8,-4.8,3.4,1.8],[-4.7,-.5,2.4,2.4],[-6.2,4.1,3.4,2]],
 canal:[[-5,-3.3,4.5,4.1],[5,-4.7,4,2.3],[-5,3.2,4.5,2.5]],
 gallery:[[-5.5,-4.8,3.8,2],[4.8,-4.8,3.8,2],[-6.2,1.8,2.3,5.4]],
 radial:[[-5.2,-4.5,3.5,2.3],[4.6,-4.3,3.5,2.3],[-6.2,.3,2.3,2.3],[-4.7,4.1,3.5,1.8]],
 mosaic:[[-6.3,-5.1,2.3,2],[-3.2,-3.1,2.2,2],[4.3,-5.2,2.4,2],[6.8,-2.9,2,2],[-5.5,2.8,4,2]],
 dune:[[-5.7,-3.9,4.7,2.2],[5.1,-4.5,3.7,2],[-6.5,2.2,2.6,4]],
 islands:[[-5.6,-4.7,2.7,2.7],[4.8,-4.4,3.1,2.5],[-5.7,2.4,3.7,3.7]],
 serpentine:[[-6.6,-4.8,2.4,2],[-4.3,-2,2.4,2],[-6.5,1.2,2.4,2],[-4.4,4.2,3.1,1.8],[4.9,-4.5,4,2]],
 hedged:[[-6.3,-3.8,2.5,4.4],[4.9,-4.5,4,2.4],[-4.9,3,4.3,2.2]],
 alpine:[[-6.4,-4.6,3.1,2],[4.7,-4.5,3.2,2],[-4.1,-1.1,2.2,2.3],[-6.6,3.2,2.5,2.7]],
 cloister:[[-6,-3.6,2.7,4.5],[5,-4.7,4.2,1.8],[-5.2,3.7,4.3,1.7]],
 conservatory:[[-5.2,-4.6,4.2,2],[4.7,-4.7,4.2,2],[-5.2,2.5,4.2,3]],
 steppe:[[-6,-4.8,4.6,1.7],[4.7,-4.5,3.8,1.7],[-5.1,.3,3.1,1.7],[-6,4.2,4.6,1.7]],
 scented:[[-6.3,-4.5,2.4,3.1],[-3.2,-4.5,2,3.1],[4.9,-4.2,3.6,2.7],[-5,3.2,4.4,2]],
 boardwalk:[[-5.4,-3,4.4,4.5],[4.9,-4.7,4,2],[-5.4,3.3,4.4,2.5]]
};
function seedOf(name){let s=2166136261;for(const c of name)s=Math.imul(s^c.charCodeAt(0),16777619);return s>>>0;}
function collectionLabel(k,profile){
 const {T,g,m}=k,canvas=document.createElement('canvas');canvas.width=768;canvas.height=320;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#19382c';ctx.fillRect(0,0,768,320);ctx.strokeStyle='#c6dcab';ctx.lineWidth=7;ctx.strokeRect(5,5,758,310);ctx.textAlign='center';ctx.fillStyle='#f5f2d6';ctx.font='bold 35px sans-serif';ctx.fillText('BOTANICAL COLLECTION',384,52);
 const words=profile.plant.species.split(' '),lines=[''];for(const word of words){if((lines.at(-1)+' '+word).trim().length>35)lines.push(word);else lines[lines.length-1]=(lines.at(-1)+' '+word).trim();}ctx.font='32px sans-serif';lines.slice(0,3).forEach((line,i)=>ctx.fillText(line,384,103+i*43));
 ctx.fillStyle='#d4e4b7';ctx.font='27px sans-serif';ctx.fillText({'protected-display':'Protected educational display',cultivated:'Cultivated garden collection','regional-flora':'Regional plant study','cultural-planting':'Cultural planting collection'}[profile.mode],384,282);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const sign=new T.Sprite(new T.SpriteMaterial({map:texture,depthWrite:false,toneMapped:false}));sign.name='Botanical collection identity and planting context';sign.position.set(-7.5,1.2,-7.2);sign.scale.set(3.6,1.5,1);g.add(sign);k.box('Botanical label support',-7.5,.4,-7.2,.1,.8,.1,m.wood);k.block(-7.5,-7.2,.1,.1);
}
function tree(k,x,z,form){
 const {T,g,m}=k;
 if(form==='palm'){
  k.rod('Garden palm trunk',[[x,0,z],[x+.1,1.6,z],[x,3.3,z]],.11);k.block(x,z,.2,.2);
  for(let j=0;j<8;j++){const a=j*Math.PI/4;k.rod('Palm arching frond',[[x,3.3,z],[x+Math.sin(a)*.8,3.6,z+Math.cos(a)*.8],[x+Math.sin(a)*1.6,3.1,z+Math.cos(a)*1.6]],.065,m.leaf);}
 }else if(form==='baobab'){
  k.rod('Bottle-shaped baobab collection trunk',[[x,0,z],[x,.7,z],[x,2.1,z]],.38);k.block(x,z,.42,.42);for(let j=0;j<5;j++){const a=j*Math.PI*2/5;k.rod('Baobab upward crown branch',[[x,1.9,z],[x+Math.sin(a)*.8,2.5,z+Math.cos(a)*.8]],.08);k.leaves('Baobab collection leaves',x+Math.sin(a)*.8,2.6,z+Math.cos(a)*.8,.35,8);}
 }else if(form==='conifer'||form==='cypress'){
  k.rod('Conifer branching trunk',[[x,0,z],[x,3.4,z]],.1);k.block(x,z,.2,.2);
  for(let layer=0;layer<5;layer++){const y=1.1+layer*.48,r=form==='cypress'?.32:1.1-layer*.17;for(let j=0;j<7;j++){const a=j*Math.PI*2/7;const p=k.ell('Layered conifer needle spray',x+Math.sin(a)*r*.6,y,z+Math.cos(a)*r*.6,r*.55,.14,r*.3,m.leaf);p.rotation.y=a;}}
 }else if(form==='olive'){
  k.tree(x,z,2.9,'Olive garden tree');k.leaves('Olive narrow silver-green foliage',x,2.6,z,1,60);
 }else if(form==='bamboo'){
  k.block(x,z,.45,.45);for(let i=0;i<4;i++){const px=x+Math.sin(i*2.4)*.3,pz=z+Math.cos(i*2.4)*.3;k.rod('Bamboo segmented culm',[[px,0,pz],[px+.08,3.2,pz]],.04,m.light);for(let j=1;j<6;j++)k.ell('Bamboo culm node',px,j*.5,pz,.055,.025,.055,m.cream);}k.leaves('Bamboo leaf sprays',x,2.7,z,.8,50);
 }else if(form==='grass'){
  for(let j=0;j<13;j++){const a=j*2.4,p=k.ell('Meadow blade',x+Math.sin(a)*.2,.45,z+Math.cos(a)*.2,.025,.5,.06,m.light);p.rotation.z=Math.sin(a)*.2;}
 }else if(form==='succulent'){
  k.block(x,z,.45,.45);for(let j=0;j<11;j++){const a=j*Math.PI*2/11,p=k.ell('Succulent rosette leaf',x+Math.sin(a)*.35,.35,z+Math.cos(a)*.35,.09,.09,.55,m.light);p.rotation.y=a;}
 }else k.tree(x,z,3.2,'Garden collection shade tree');
}
function build(T,g,profile){
 const seed=seedOf(profile.country),flip=seed%2?-1:1,decor=new T.Group();decor.name=profile.country+' botanical garden composition';decor.scale.x=flip;g.add(decor);
 const k=createGardenKit(T,decor,profile.country),botany=createBotanicalPlantTools(k),style=profile.layout,stone=profile.stone||0xd1c3a8,flower=profile.plant,secondary=profile.secondary||flower;
 const polar=['Antarctica','S. Geo. and the Is.','Fr. S. Antarctic Lands','Heard I. and McDonald Is.','Siachen Glacier'].includes(profile.country);
 k.floor(profile.lawn||(polar?0xa3aaa0:0x8da777));k.path(0,-.4,3.1,15.8,stone,profile.title+' approach');k.path(0,6.3,15.2,1.6,stone,'rear seating promenade');k.entry(profile.country+' open garden entrance');
 if(['crescent','radial','islands','orchard'].includes(style))k.ring(-2,.1,2.2,3.2,k.surface('garden loop',stone),'Flower collection loop');
 if(['diagonal','mosaic','serpentine'].includes(style))for(let j=0;j<5;j++)k.path(-2.4-j*.8,-4.5+j*2,2.6,1.1,stone,'offset collection spur');
 const beds=compositions[style];if(!beds)throw Error('Unknown garden composition '+style);
 for(let index=0;index<beds.length;index++){
  const [baseX,baseZ,w,d]=beds[index],x=baseX+(seed%5-2)*.06,z=baseZ+(seed%7-3)*.04,spec=index%2?secondary:flower,aquatic=['lotus','waterlily','victoria'].includes(spec.form);
  k.box(profile.country+' '+spec.species+' bed rim',x,.12,z,w,.22,d,k.surface('garden edging',stone));k.block(x,z,w/2,d/2);
  k.box(aquatic?'Contained aquatic planting water':'Planted garden soil',x,.24,z,w-.2,.025,d-.2,new T.MeshStandardMaterial({color:aquatic?0x469394:0x5e4c3b,roughness:aquatic?.3:.94}));
  for(let j=0;j<6;j++){const a=j*2.4+(seed%19)*.1,px=x+Math.sin(a)*w*.27,pz=z+Math.cos(a)*d*.25;botany.plant(spec,px,pz,j);}
 }
 tree(k,-8.1,5.8,profile.foliage||'broadleaf');tree(k,8,6.2,profile.foliage||'broadleaf');
 if(['rockery','alpine','dune','steppe'].includes(style)){
  for(let i=0;i<4;i++){const x=-8.4+(i%2)*.6,z=-5.8+Math.floor(i/2)*1.8,s=.4+i*.08,o=new T.Mesh(new T.DodecahedronGeometry(1),k.surface('weathered stone',0x92958b));o.name='Garden weathered stone';o.position.set(x,s*.5,z);o.scale.set(s,.7*s,s*.6);o.rotation.y=i;decor.add(o);k.block(x,z,s,s*.6);}
 }
 if(['gallery','scented','hedged','cloister'].includes(style)){
  for(const z of [-4.5,-.5,3.5]){k.box('Open garden trellis post',-8.6,1.25,z,.14,2.5,.14);k.block(-8.6,z,.12,.12);}k.box('Long open garden trellis beam',-8.6,2.5,-.5,.2,.15,8.4);
 }
 if(['courtyard','parterre','cloister','hedged'].includes(style)){
  k.box('Low garden boundary wall',-9.1,.36,.2,.25,.7,13.4,k.surface('garden wall',stone));k.block(-9.1,.2,.17,6.7);
 }
 if(['canal','boardwalk'].includes(style))for(let j=0;j<30;j++)k.box('Level water-garden walkway inset',0,.074,-6.6+j*.43,2.8,.035,.27,style==='boardwalk'?k.m.wood:k.m.cream);
 if(profile.mode==='protected-display'||style==='conservatory'){
  const glass=new T.MeshStandardMaterial({color:0xc5e3e0,transparent:true,opacity:.1,side:T.DoubleSide,depthWrite:false,roughness:.25});
  for(const x of [-9.4,9.4])for(const z of [-6.7,6.4]){k.box('Protected botanical display frame',x,2,z,.12,4,.12,k.m.cream);k.block(x,z,.1,.1);}
  for(const side of [-1,1]){const pane=k.box('Protected display roof glazing',side*4.7,4.25,0,9.5,.06,14.2,glass);pane.rotation.z=side*-.055;}
  decor.userData.protectedBotanicalDisplay=true;
 }
 k.bench(-1.6,7.3);k.bench(1.6,7.3);botany.finalize();collectionLabel(k,profile);
 // Mirror scenery and collision/seat metadata together; the shared paint garden is
 // added outside decor, at its correspondingly mirrored reserved position.
 const result=k.finish(profile.key,profile.title,profile.key+'-'+style,{x:5.3*flip,z:2.9});
 result.obstacles=result.obstacles.map(o=>({...o,x:o.x*flip}));result.seats=result.seats.map(s=>({...s,x:s.x*flip,facing:s.facing*flip}));
 result.flowerCount=botany.flowerCount();result.botanicalBasis=profile.mode;result.reference=profile.reference;g.userData.storySeats=result.seats;g.userData.botanicalBasis=profile.mode;
 return result;
}
export const composedGardenBuilders=Object.fromEntries(Object.values(globalGardenProfiles).map(p=>[p.country,(T,g)=>build(T,g,p)]));
export const composedGardenReferences=Object.fromEntries(Object.values(globalGardenProfiles).map(p=>[p.country,{title:p.referenceTitle||'Botanical garden reference',url:p.reference,basis:p.mode}]));

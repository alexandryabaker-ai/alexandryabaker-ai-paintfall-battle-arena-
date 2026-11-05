import {buildNextThirtyHomes} from './paintfall-next-thirty-homes.js';
// Original residential studies: regional references, not replicas or a country's only house type.
export function buildFinalHomes(T,args){
 const p=args.profile;if(p.exhibitOnly)return null;
 const scale=p.compactScale||.7;
 const ground=(x,z)=>args.ground(x*scale,z*scale)?.clone().multiplyScalar(1/scale)||null;
 const result=buildNextThirtyHomes(T,{...args,profile:{...p,placementRadius:65/scale},ground,spawn:args.spawn.clone().multiplyScalar(1/scale),occupied:args.occupied.map(o=>({x:o.x/scale,z:o.z/scale,halfX:o.halfX/scale,halfZ:o.halfZ/scale}))});
 const f=p.architecture.layout,mat=c=>new T.MeshStandardMaterial({color:c,roughness:.96,side:T.DoubleSide});
 const wood=mat(0x80634d),dark=mat(0x435a5d),white=mat(0xe2ded0),stone=mat(0xb3a38b),thatch=mat(0x9d8c57),metal=mat(0x899c9b);
 const box=(g,n,x,y,z,w,h,d,m)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.name=n;o.castShadow=o.receiveShadow=true;g.add(o);return o;};
 const beam=(g,n,a,b,r,m=wood)=>{const v=b.clone().sub(a),o=new T.Mesh(new T.CylinderGeometry(r,r,v.length(),6),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());o.name=n;g.add(o);};
 const roof=(g,x,z,w,d,y,r,m,hip=false)=>{const v=[[-w,y,-d],[w,y,-d],[-w,y,d],[w,y,d],[0,y+r,hip?-d*.4:-d],[0,y+r,hip?d*.4:d]],ix=[0,2,5,0,5,4,1,3,5,1,5,4,0,1,4,2,3,5],geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(ix.flatMap(i=>v[i]),3));geo.computeVertexNormals();const o=new T.Mesh(geo,m);o.position.set(x,0,z);o.name=hip?'Hipped residential roof':'Gabled residential roof';o.castShadow=true;g.add(o);return o;};
 for(const[i,h]of result.homes.entries()){
  const shell=h.userData.cutawayShell;shell.traverse(o=>o.geometry?.dispose());shell.clear();const g=new T.Group();shell.add(g);
  h.userData.housingStructure=f;h.userData.architectureReference=p.architecture.reference;h.userData.regionalLayout=p.theme;
  const wall=mat(p.homeColors[i%3]),tile=mat(/coro|sucre|arequipa|cuenca|antigua|granada|suchitoto|azuero|antioquia|cunucu|minas/.test(f)?0x99664c:0x6e7f80),trim=mat(p.homeColors[(i+2)%3]);
  const tall=/townhouse|loft|sobrado|gallery|criol|gingerbread|oriel|vincentian/.test(f),height=tall?4.9:2.6;
  const room=(x,z,w,d,y=0,hh=height)=>{box(g,'Selected residential room',x,y+.3+hh/2,z,w,hh,d,wall);box(g,'Room skirting',x,y+.42,z,w+.04,.17,d+.04,trim);};
  const window=(x,y,z,w=.85,hh=1.15)=>{box(g,'Window frame',x,y,z,w+.18,hh+.16,.11,trim);box(g,'Window opening study',x,y,z+.065,w,hh,.06,dark);for(const s of [-1,1])box(g,'Timber shutter',x+s*(w*.5+.18),y,z+.09,.23,hh,.1,wood);};
  const entrance=(x,z,y=0)=>{box(g,'Recessed entry study',x,y+1.25,z,1,1.9,.12,wood);box(g,'Entry lintel',x,y+2.24,z,1.3,.15,.16,trim);};
  const porch=(x,z,w,d,y=0,hh=2.6)=>{box(g,'Shaded gallery deck',x,y+.3,z,w,.16,d,wood);box(g,'Gallery canopy',x,y+hh,z,w+.3,.14,d+.3,tile);for(const dx of [-w/2+.2,w/2-.2])box(g,'Gallery column',x+dx,y+(hh+.3)/2,z+d/2-.1,.14,hh-.3,.14,wood);};
  const arch=(x,y,z,r=.85)=>{const o=new T.Mesh(new T.TorusGeometry(r,.15,7,20,Math.PI),wall);o.position.set(x,y,z);o.name='Shaded masonry gallery arch';g.add(o);for(const s of [-1,1])box(g,'Arcade pier',x+s*r,y/2+.15,z,.25,y-.3,.3,wall);};
  const court=/court|patio|coro-earth|casa-chorizo|arequipa-vault|sucre|culata/.test(f);
  if(f==='ger'||f==='maya-oval'){
   const oval=f==='maya-oval',cyl=new T.Mesh(new T.CylinderGeometry(2.8,2.8,2.45,48),oval?wall:white);cyl.position.y=1.52;cyl.scale.x=oval?1.16:1;cyl.scale.z=oval?.79:1;cyl.name=oval?'Oval bajareque wall study':'Felt-covered circular ger wall';g.add(cyl);
   if(oval){const vertices=[];for(let j=0;j<10;j++)for(let k=0;k<48;k++){const at=(r,a)=>[(.8+2.8*(1-r))*Math.cos(a),2.74+2.5*r,2.65*(1-r)*Math.sin(a)],a=k*Math.PI/24,b=(k+1)*Math.PI/24,pts=[at(j/10,a),at(j/10,b),at((j+1)/10,b),at((j+1)/10,a)];for(const n of [0,1,2,0,2,3])vertices.push(...pts[n]);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();const o=new T.Mesh(geo,thatch);o.name='Rounded oval hipped palm-thatch roof';g.add(o);}
   else{const cone=new T.Mesh(new T.CylinderGeometry(.4,3.35,1.6,48,1,true),white);cone.position.y=3.45;cone.name='Ger roof with open crown';g.add(cone);}entrance(0,oval?2.25:2.83);
   for(const o of [...h.children]){if(o.name==='Main room floor'||o.name==='Entry step'||(o.name==='Grounded masonry foundation'&&(o.position.x/(oval?3.3:2.9))**2+(o.position.z/(oval?2.3:2.9))**2>1)){h.remove(o);o.geometry?.dispose();}}
   const floor=new T.Mesh(new T.CylinderGeometry(oval?2.8:2.85,oval?2.8:2.85,.18,48),wood);floor.position.y=.3;floor.scale.set(oval?1.16:1,1,oval?.79:1);floor.name='Circular or oval residential floor';h.add(floor);box(h,'Entry step',0,.16,oval?2.45:3.04,1.1,.16,.45,stone);
   if(!oval){for(const y of [.65,1.65,2.5]){const o=new T.Mesh(new T.TorusGeometry(2.83,.035,4,48),wood);o.rotation.x=Math.PI/2;o.position.y=y;o.name='Ger circumferential binding';g.add(o);}for(let j=0;j<20;j++){const a=j*Math.PI/10;beam(g,'Ger radial roof pole',new T.Vector3(Math.cos(a)*2.8,2.74,Math.sin(a)*2.8),new T.Vector3(Math.cos(a)*.4,4.2,Math.sin(a)*.4),.025);}for(const x of [-.5,.5])box(g,'Ger crown support',x,2.2,0,.1,3.8,.1,wood);}
   else for(let j=0;j<35;j++){const a=j*Math.PI*2/35;box(g,'Bajareque vertical cane study',Math.cos(a)*3.24,1.5,Math.sin(a)*2.21,.045,2.4,.045,wood);}
  }else if(f==='culata-yovai'){
   for(const s of [-1,1]){room(s*2.25,0,2.1,5.7);roof(g,s*2.25,0,1.4,3.2,2.9,1.25,tile);}box(g,'Open central shared space',0,.35,0,2.4,.15,5.7,stone);roof(g,0,0,1.3,3.2,2.9,1.25,tile);for(const s of [-1,1])entrance(s*2.25,2.9);
  }else if(court){
   const linear=f==='casa-chorizo';
   room(-2.35,0,1.8,5.8,0,2.6);if(!linear)room(2.35,0,1.8,5.8,0,2.6);room(0,-2.25,6.5,1.35,0,2.6);
   box(g,'Open courtyard paving',linear?.6:0,.34,.6,linear?3.8:2.8,.08,3.6,stone);
   if(/rioplatense|casa-chorizo|arequipa/.test(f)){for(const x of linear?[-2.35]:[-2.35,2.35])box(g,'Flat roof and parapet study',x,3.03,0,2.05,.3,6.1,white);box(g,'Rear parapet roof',0,3.03,-2.25,6.7,.3,1.6,white);}
   else{for(const x of [-2.35,2.35])roof(g,x,0,1.2,3.2,2.9,1.2,tile);roof(g,0,-2.25,3.55,.95,2.9,.75,tile);}
   for(const x of linear?[-1.25]:[-1.25,1.25])for(const z of [-1.5,0,1.5,2.7])box(g,'Courtyard timber column',x,1.7,z,.12,2.7,.12,wood);
   if(f==='arequipa-vault'){for(const x of [-2.35,2.35]){const o=new T.Mesh(new T.CylinderGeometry(.94,.94,5.9,24,1,true,0,Math.PI),white);o.rotation.x=Math.PI/2;o.position.set(x,2.85,0);o.name='Sillar barrel-vault roof';g.add(o);}for(const x of [-2.3,2.3])arch(x,1.9,3.02,.65);}
   if(f==='korean-court'){for(const x of [-2.35,2.35])for(const s of [-1,1]){const o=box(g,'Raised curved-eave roof end',x+s,3.2,0,.45,.12,6.5,tile);o.rotation.z=s*.35;}for(const x of [-3.1,-1.6,1.6,3.1])box(g,'Exposed timber courtyard frame',x,1.7,2.96,.1,2.7,.12,wood);}
   for(const x of linear?[-2.35]:[-2.35,2.35]){entrance(x,2.97);window(x,1.6,3.05,.65,.9);}
   if(f==='antigua-court')for(const x of [-1.1,1.1])arch(x,2.1,-1.46,.72);
   if(f==='granada-court'){for(const x of [-1.3,1.3]){box(g,'Deep Granada gallery canopy',x,2.9,.4,1.15,.12,4.8,tile);for(const z of [-1.4,.4,2.3])box(g,'Patio column plinth',x,.65,z,.35,.55,.35,white);}}
   if(f==='cuenca-court'){room(0,-2.25,6.5,1.35,2.6,2.5);roof(g,0,-2.25,3.55,.95,5.4,1.2,tile);box(g,'Cuenca upper timber balcony',0,2.95,-.98,5.3,.16,1.1,wood);for(let j=0;j<17;j++)box(g,'Cuenca balcony spindle',-2.4+j*.3,3.43,-.45,.055,.9,.07,wood);box(g,'Cuenca balcony handrail',0,3.91,-.45,5.2,.1,.12,wood);for(const x of [-1.9,0,1.9])window(x,4.05,-1.51,.75,1.3);}
   if(f==='sucre-patio')for(const x of [-2.35,2.35])box(g,'Sucre white molded cornice',x,2.8,2.99,1.95,.19,.16,white);
   if(f==='coro-earth')for(const x of [-2.35,2.35]){box(g,'Thick earthen entrance surround',x,1.4,3.06,1.3,2.2,.2,wall);entrance(x,3.18);}
   if(f==='casa-chorizo')for(const z of [-1.3,.2,1.7]){box(g,'Linear sequence room division',-2.35,1.6,z,1.8,2.6,.12,wall);box(g,'Gallery-facing room entry',-1.39,1.3,z-.5,.08,1.8,.7,wood);}
  }else if(f==='residential-block'){
   room(0,0,6.5,4.6,0,7);box(g,'Residential block flat roof',0,7.4,0,6.7,.22,4.8,stone);for(const y of [1.5,3.5,5.5])for(const x of [-2.3,-.8,.8,2.3])window(x,y,2.36,.65,1);porch(0,3,2,1,0,2.5);h.userData.wallHeight=7;
  }else{
   const paired=f==='chattel-house',thatchRoof=/kas-di-maishi/.test(f),raised=f==='belize-raised',base=raised?.9:0;
   room(0,0,6.3,5.4,base,height);
   if(paired){for(const x of [-1.6,1.6])roof(g,x,0,1.75,3.05,base+height+.3,1.7,tile);}
   else if(/salt-cay/.test(f)){roof(g,0,0,3.5,3,2.9,1.4,white,true);for(let j=0;j<12;j++)for(const s of [-1,1])box(g,'Rain-catching roof course',s*j*.28,4.3-j*.112,0,.32,.07,5.95,white);}
   else if(/staff-duplex/.test(f)){roof(g,0,0,3.55,3.1,2.9,1,tile,true);box(g,'Duplex dividing wall cue',0,1.7,2.8,.13,2.7,.17,trim);}
   else roof(g,0,0,3.55,3.1,base+height+.3,thatchRoof?2.6:/gingerbread|maritime|chiloe/.test(f)?2.5:1.5,thatchRoof?thatch:/falkland|maritime|case|porch|norfolk|pitcairn|christmas/.test(f)?metal:tile,/cunucu|cottage|hip|garden|case/.test(f));
   for(const y of tall?[1.5,3.8]:[base+1.5])for(const x of [-2.05,2.05])window(x,y,2.77);
   entrance(/staff-duplex/.test(f)?-1.2:0,2.79,base);if(f==='staff-duplex')entrance(1.2,2.79);
   if(raised){box(h,'Raised timber residential floor',0,1.2,0,6.5,.18,5.6,wood);for(let j=0;j<5;j++)box(g,'Dry-ground entry stair',0,.4+j*.18,4.7-j*.33,1.3,.18,.4,wood);}
   if(/porch|veranda|gallery|loft|fretwork|creole|criol|ti-kai|bungalow|cottage|garden|board|maarten|gingerbread/.test(f))porch(0,3.45,6.4,1.3,base,tall?3:2.6);
   if(tall&&/gallery|criol|vincentian|antioquia/.test(f)){porch(0,3.4,6.2,1.25,2.6,2.7);for(let j=0;j<18;j++)box(g,'Upper gallery baluster',-2.9+j*.34,3.5,3.99,.07,.9,.08,wood);box(g,'Upper gallery rail',0,3.98,3.99,6.1,.1,.12,wood);}
   if(/bvi-stone|saint-barth|cypriot-stone/.test(f))for(let y=0;y<10;y++)for(let x=0;x<9;x++)box(g,'Rubble masonry facing',-2.85+x*.7+(y%2)*.08,.48+y*.24,2.78,.6,.19,.07,stone);
   if(f==='st-croix-arcade'){porch(0,3.5,6.5,1.4,0,2.8);for(const x of [-2.1,0,2.1])arch(x,1.9,4.15,.88);}
   if(f==='izba'){for(let j=0;j<12;j++){box(g,'Interlocking log course',0,.5+j*.2,2.79,6.6,.16,.18,wood);for(const s of [-1,1])box(g,'Projecting log corner',s*3.12,.5+j*.2,2.88,.24,.16,.5,wood);}for(const x of [-2.05,2.05])for(let j=0;j<5;j++)box(g,'Carved window crown',x-.5+j*.25,2.3,2.97,.15,.18+(j%2)*.12,.08,white);}
   if(/chiloe-shingle/.test(f))for(let y=0;y<12;y++)for(let x=0;x<17;x++)box(g,'Timber tejuela cladding',-2.95+x*.36+(y%2)*.06,.5+y*.19,2.79,.32,.24,.07,y%2?wood:trim);
   if(/loft|demerara/.test(f))for(const x of [-2.05,2.05]){box(g,'Demerara ventilated window box',x,3.85,3.03,1.2,1.4,.55,wood);for(let j=0;j<9;j++)box(g,'Ventilating louver',x,3.3+j*.14,3.34,1.05,.04,.08,white);}
   if(/gingerbread/.test(f)){roof(g,0,2.6,1.1,1.2,5.2,2.4,tile);for(const x of [-2.7,2.7]){roof(g,x,0,.9,3,5.2,2.3,tile);for(let j=0;j<8;j++)box(g,'Decorative gingerbread fretwork',x+(j-3.5)*.18,5.1,3.1,.07,.35+(j%3)*.1,.08,white);}}
   if(/fretwork|ti-kai|dominica|grenada/.test(f))for(let j=0;j<20;j++){const o=box(g,'Pierced gallery trim study',-3+j*.315,2.58,4.1,.12,.24,.07,white);o.rotation.z=Math.PI/4;}
   if(/sint-maarten/.test(f)){for(let j=0;j<5;j++)box(g,'Stepped town gable',0,5.4+j*.37,2.81,5.5-j*.95,.42,.25,wall);}
   if(/falkland|maritime/.test(f)){room(0,3.25,1.65,1.3,0,2.1);roof(g,0,3.25,1,1,2.4,.9,metal);entrance(0,3.94);box(g,'Domestic chimney',-2,4.1,-1,.45,2.8,.5,stone);}
   if(f==='cypriot-oriel'){box(g,'Timber projecting upper bay',0,4,2.96,3.4,1.9,1,wood);for(const x of [-1,0,1])window(x,4.1,3.5,.65,1.15);}
   if(f==='azuero-quincha'){porch(0,3.6,6.5,1.6);for(const x of [-3,-1.4,1.4,3]){box(g,'Quincha timber frame',x,1.6,2.85,.1,2.6,.12,wood);for(let j=0;j<7;j++)box(g,'Quincha horizontal cane study',x*.75,.7+j*.27,2.86,1.1,.025,.04,wood);}}
   if(f==='antioquia-gallery')for(const x of [-3,-1.2,1.2,3])box(g,'Antioquian exposed bahareque frame',x,2.8,2.84,.1,4.8,.1,wood);
   if(f==='minas-sobrado'){box(g,'Sobrado storey cornice',0,2.92,2.85,6.5,.15,.2,white);for(const x of [-2.05,2.05]){box(g,'Sobrado narrow balcony floor',x,3.2,3.05,1.25,.12,.6,stone);for(let j=0;j<6;j++)box(g,'Sobrado iron balcony bar',x-.5+j*.2,3.6,3.36,.035,.8,.04,dark);box(g,'Sobrado iron balcony rail',x,4.02,3.36,1.2,.05,.05,dark);}}
   if(/clapboard|board|ti-kai|paramaribo|creole|porch|veranda|fretwork/.test(f))for(let j=0;j<Math.floor(height/.2);j++)box(g,'Timber weatherboard course',0,base+.5+j*.2,2.72,6.3,.025,.06,wood);
  }
  // Foundations and all visible porch floors remain on sampled dry ground.
  h.scale.setScalar(scale);h.position.multiplyScalar(scale);
 }
 result.obstacles=result.obstacles.map(o=>({x:o.x*scale,z:o.z*scale,halfX:o.halfX*scale,halfZ:o.halfZ*scale}));
 return result;
}

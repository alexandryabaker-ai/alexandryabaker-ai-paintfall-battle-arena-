import {buildNextThirtyHomes} from './paintfall-next-thirty-homes.js';
// Original housing studies: regional references guide massing, without copying sacred ornament.
export function buildAfricaHomes(T,args){
 const result=buildNextThirtyHomes(T,args),p=args.profile,mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95,side:T.DoubleSide}),wood=mat(0x88715a),wall=mat(p.homeColors[0]),trim=mat(p.homeColors[2]),roof=mat(p.homeColors[1]),glass=mat(0x77959c);
 const box=(g,n,x,y,z,w,h,d,m)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.name=n;o.position.set(x,y,z);g.add(o);return o;};
 function gable(g,y,r=1.7,width=3.6){const pts=[[-width,y,-3.1],[width,y,-3.1],[-width,y,3.1],[width,y,3.1],[0,y+r,-3.1],[0,y+r,3.1]],idx=[0,2,5,0,5,4,1,3,5,1,5,4,0,1,4,2,3,5],geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(idx.flatMap(i=>pts[i]),3));geo.computeVertexNormals();const o=new T.Mesh(geo,roof);o.name='Regional upper gable';g.add(o);}
 for(const home of result.homes){const g=home.userData.cutawayShell,f=.3,s=p.structure;
  if(['loft','town-balcony','upper-gallery'].includes(s)){
   for(const o of [...g.children])if(/roof|parapet/i.test(o.name))g.remove(o);
   box(g,'Upper storey floor',0,2.95,0,6.6,.18,6,wood);for(const x of [-3.2,3.2])box(g,'Upper storey side',x,4.2,0,.2,2.5,6,wall);for(const z of [-2.9,2.9])box(g,'Upper storey facade',0,4.2,z,6.6,2.5,.2,wall);
   for(const x of [-2,0,2]){box(g,'Upper shutter frame',x,4.2,3.05,1.2,1.4,.12,trim);box(g,'Upper room window',x,4.2,3.13,.8,1.05,.05,glass);}
   gable(g,5.5,s==='loft'?2.6:1.5);box(g,'Dry upper balcony deck',0,2.98,3.65,6.4,.18,1.5,wood);for(const x of [-2.8,2.8])box(g,'Gallery support pier',x,1.5,4.25,.22,2.7,.22,trim);for(let j=0;j<14;j++)box(g,'Balcony upright',-2.9+j*.45,3.55,4.25,.08,1.1,.08,wood);box(g,'Balcony top rail',0,4.1,4.25,6.2,.1,.1,wood);
  }
  if(['plank-veranda','creole','cross-vent','deep-eave'].includes(s)){
   for(let j=0;j<11;j++)for(const x of [-2,2])box(g,'Horizontal facade boarding',x,f+.15+j*.22,3.02,2.4,.035,.04,trim);
   for(const x of [-2.8,0,2.8])box(g,'Shaded porch post',x,f+1.1,4.25,.13,2.2,.13,wood);
   if(s==='creole')for(let j=0;j<20;j++){const o=box(g,'Veranda fretwork study',-2.85+j*.3,f+2,4.3,.06,.35,.06,trim);o.rotation.z=.5;}
   if(s==='deep-eave')box(g,'Extended shade canopy',0,f+2.45,3.6,7.5,.15,2.2,roof);
  }
  if(s==='stone-round'){for(let j=0;j<9;j++)for(let k=0;k<28;k++){const a=k*Math.PI/14+(j%2)*.11,o=box(g,'Rounded stone masonry joint',Math.cos(a)*2.86,f+.15+j*.25,Math.sin(a)*2.86,.42,.035,.035,trim);o.rotation.y=-a+Math.PI/2;}}
  if(s==='woven-round')for(let j=0;j<28;j++){const a=j*Math.PI/14;box(g,'Round wall timber upright',Math.cos(a)*2.87,f+1.2,Math.sin(a)*2.87,.055,2.3,.055,wood);}
  if(s==='double-gable'){gable(g,2.9,1.2,3.55);for(const x of [-1.8,1.8])box(g,'Paired front gable window',x,3.2,3.12,.75,.6,.08,glass);}
  if(s==='cape-gable'){box(g,'Raised central gable',0,3.5,3.02,2.4,1.2,.2,wall);for(let j=0;j<3;j++)box(g,'Stepped gable shoulder',0,4.15+j*.25,3.02,2.3-j*.6,.25,.22,wall);box(g,'Gable attic window',0,3.6,3.16,.7,.75,.08,glass);}
  if(s==='tower-court')for(const x of [-2.4,2.4]){const o=new T.Mesh(new T.CylinderGeometry(.9,1.1,3.8,20),wall);o.position.set(x,2.2,1.5);o.name='Rounded residential corner tower';g.add(o);const cap=new T.Mesh(new T.ConeGeometry(1.1,1.2,20),roof);cap.position.set(x,4.7,1.5);cap.name='Small conical tower cap';g.add(cap);}
  if(s==='compound-gable'){for(const x of [-2.5,2.5]){box(g,'Courtyard side shade canopy',x,2.6,3.5,1.5,.15,2,roof);for(const z of [3,4.3])box(g,'Court shade post',x,1.4,z,.13,2.2,.13,wood);}}
  if(s==='vent-brick')for(let j=0;j<7;j++){box(g,'Brick facade course',-2.1,f+.3+j*.3,3.03,1.8,.025,.03,trim);box(g,'Brick facade course',2.1,f+.3+j*.3,3.03,1.8,.025,.03,trim);}
  home.userData.housingStructure=s;
 }return result;
}

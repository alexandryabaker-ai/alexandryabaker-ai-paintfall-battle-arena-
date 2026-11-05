// Separate visual proposal based on the owner's recovered design. No live-game replacement.
import {createKirin,animateKirin} from './paintfall-kirin.js';
export const KIRIN_NAMES=Object.freeze([
 ['Kirin','Core / balanced Energy Body'],['Rangsi','Expansive rays'],['Guāngshù','Focused beam'],['Kōsen','Guided beam'],
 ['Gwangseon','Responsive beam'],['Kukuna','Environmental / radial rays'],['Hulili','Vibrating, lightly chaotic light'],['Mālamalama','Illumination and mastery']
]);
export function createKirinEnergyProposal(T){
 const root=new T.Group();root.name='Kirin Energy Body — proposal';
 const mat=(color,opacity)=>new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,blending:T.AdditiveBlending});
 const veil=mat(0x91d9fa,.07),light=mat(0x9be9ff,.57),gold=mat(0xffe5a1,.70);
 const sphere=new T.SphereGeometry(1,20,14);
 // Owner-requested hybrid: use the preserved model's readable body as an energy base.
 const bodyBase=createKirin(T),bodyMaterials=[];root.add(bodyBase);
 const sourceParts=bodyBase.userData.parts;
 sourceParts.mane.visible=false;sourceParts.tail.visible=false;sourceParts.horn.visible=false;sourceParts.core.visible=false;
 const replacements=new Map();
 bodyBase.traverse(part=>{
  if(part.name==='forelock')part.visible=false;
  if(part.isMesh){
   const source=part.material;
   if(!replacements.has(source)){
    const eye=source.opacity>.8;
    const replacement=new T.MeshBasicMaterial({color:eye?0x5684a1:0xaddff4,transparent:true,opacity:eye?.72:.20,depthWrite:false});
    replacements.set(source,replacement);if(!eye)bodyMaterials.push(replacement);
   }
   part.material=replacements.get(source);
  }
 });
 const volume=(pos,scale)=>{const m=new T.Mesh(sphere,veil);m.position.set(...pos);m.scale.set(...scale);m.name='energy field, not anatomy';root.add(m);return m;};
 volume([0,1.32,.10],[.32,.37,.82]);const neck=volume([0,1.77,-.66],[.14,.43,.19]);neck.rotation.x=-.5;
 volume([0,2.08,-.96],[.15,.20,.26]);volume([0,1.96,-1.23],[.11,.11,.23]);
 const streams=[];
 function stream(points,material=light,r=.009,parent=root){
  const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
  const mesh=new T.Mesh(new T.TubeGeometry(path,40,r,5,false),material);mesh.name='flowing energy contour';parent.add(mesh);path.energyMesh=mesh;return path;
 }
 function rainbowStream(points,index,parent=root){
  const path=stream(points,mat(0xffffff,.88),.012,parent),mesh=path.energyMesh,uv=mesh.geometry.getAttribute('uv'),colors=[];
  // Colored translucent ribbons retain distinct hues; additive overlaps wash into white.
  mesh.material.blending=T.NormalBlending;
  const color=new T.Color();for(let v=0;v<uv.count;v++){color.setHSL((index/7*.2+uv.getX(v)*.9)%1,.95,.52);colors.push(color.r,color.g,color.b);}
  mesh.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));mesh.material.vertexColors=true;mesh.name='rainbow energy ribbon';return path;
 }
 stream([[0,1.63,.88],[0,1.69,.24],[0,1.64,-.42],[0,2.24,-.81],[0,2.25,-1.04],[0,2.08,-1.28],[0,1.96,-1.44]]);
 stream([[0,1.10,.80],[0,.96,.12],[0,1.02,-.56],[0,1.72,-.83],[0,1.86,-1.15],[0,1.91,-1.43]]);
 for(const side of [-1,1]){
  stream([[side*.11,2.19,-.83],[side*.13,2.40,-.77],[side*.07,2.24,-.91]],light,.007);
  stream([[side*.14,2.11,-1.02],[side*.16,2.13,-.98]],gold,.012);
 }
 const hornTip=new T.Vector3(0,2.76,-1.18);
 stream([[0,2.19,-1.04],[0,2.47,-1.10],hornTip.toArray()],gold,.014);
 const core=new T.Group();core.position.set(0,1.38,-.10);root.add(core);
 for(let i=0;i<3;i++){const glow=new T.Mesh(sphere,mat(i===0?0xfff4c1:0x8fe4ff,[.78,.17,.05][i]));glow.scale.setScalar([.09,.17,.28][i]);core.add(glow);}
 const positions=[],colors=[];
 for(let i=0;i<120;i++){
  const y=1-2*(i+.5)/120,a=i*2.399963,r=Math.sqrt(1-y*y),v=[Math.cos(a)*r,y,Math.sin(a)*r];
  positions.push(...v.map(n=>n*.13),...v.map(n=>n*(.40+(i%5)*.045)));colors.push(1,.92,.67,.25,.64,.9);
 }
 const rayGeometry=new T.BufferGeometry();rayGeometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));rayGeometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));
 const rays=new T.LineSegments(rayGeometry,new T.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.48,depthWrite:false,blending:T.AdditiveBlending}));rays.name='radial energy rays — no physical spikes';core.add(rays);
 const mane=new T.Group();root.add(mane);
 for(let i=0;i<7;i++){
  const x=(i-3)*.026;
  const spread=i-3;
  const points=[[x,2.20,-.80],[x+.03,2.13+spread*.006,-.52+spread*.012],[x+.10,1.88+spread*.010,-.20+spread*.017],[x+.04,1.64+spread*.015,.14+spread*.02]];
  const path=rainbowStream(points,i,mane);streams.push({path,points,offset:i*.11});
 }
 for(let i=0;i<7;i++){
  const x=(i-3)*.026;
  const spread=i-3;
  const points=[[x,1.57,.82],[x+.06,1.60+spread*.006,1.05],[x+.17,1.35+spread*.012,1.34+spread*.018],[x+.12,1.10+spread*.018,1.51+spread*.035]];
  const path=rainbowStream(points,i);streams.push({path,points,offset:i*.14});
 }
 const beams=[];
 for(const points of [
  [[0,1.38,-.1],[0,1.98,-.64],hornTip.toArray(),[0,2.60,-2.20]],
  [[0,1.38,-.1],[.50,1.64,.06],[.94,1.75,-.24]],
  [[0,1.38,-.1],[-.51,1.53,.12],[-.93,1.78,-.18]]
 ]){
  const path=stream(points,gold,.006),particles=[];
  for(let i=0;i<4;i++){const dot=new T.Mesh(sphere,mat(0xffefd0,.83));dot.scale.setScalar(.021);root.add(dot);particles.push(dot);}beams.push({path,particles});
 }
 const flow=[];
 for(const strand of streams){const dot=new T.Mesh(sphere,mat(0xcaf9ff,.8));dot.scale.setScalar(.015);root.add(dot);flow.push({...strand,dot});}
 const transfer=new T.Group();transfer.name='rainbow energy from mane into Nova';root.add(transfer);transfer.visible=false;
 const transferStreams=[];
 for(let i=0;i<3;i++){
  const x=.07+i*.045;
  const path=rainbowStream([[x,1.74,-.12],[x+.12,1.96,-.18],[x+.06,2.04,-.13],[.015,1.94,-.13]],i*2,transfer),particles=[];
  path.energyMesh.material.opacity=.48;
  for(let j=0;j<5;j++){const dot=new T.Mesh(sphere,mat(0xffffff,.86));dot.scale.setScalar(.018);transfer.add(dot);particles.push(dot);}transferStreams.push({path,particles});
 }
 root.userData.energy={core,rays,rayRest:new Float32Array(positions),veil,beams,flow,mane,hornTip,streams,bodyBase,bodyMaterials,transfer,transferStreams};root.userData.visualOnly=true;return root;
}

export function animateKirinEnergyProposal(root,time,{name='Kirin',mood='balanced',lightForm=false,gem=false,riderMounted=false}={}){
 const p=root.userData.energy,t=time/1000;
 const expansion=mood==='excited'?1.35:mood==='fearful'?.70:1;
 const namedSpread=name==='Rangsi'?1.28:name==='Kukuna'?1.45:name==='Guāngshù'?.66:1;
 p.rays.scale.setScalar(expansion*namedSpread*(1+Math.sin(t*1.1)*.035));
 p.rays.rotation.y=t*(name==='Hulili'?.16:.035);
 p.core.scale.setScalar(1+Math.sin(t*1.1)*.035);p.veil.opacity=lightForm?.14:.032+.010*Math.sin(t*.7);
 const rayPositions=p.rays.geometry.getAttribute('position'),scale=p.core.scale.x*p.rays.scale.x;
 for(let i=0;i<p.rayRest.length;i+=6){
  const upper=p.rayRest[i+4],factor=riderMounted&&upper>.03?Math.min(.35,.18/(scale*upper)):1;
  for(let j=0;j<6;j++)rayPositions.array[i+j]=p.rayRest[i+j]*factor;
 }
 rayPositions.needsUpdate=true;
 p.transfer.visible=riderMounted;
 for(const stream of p.transferStreams)for(let i=0;i<stream.particles.length;i++){
  const u=(t*.36+i/stream.particles.length)%1,dot=stream.particles[i];dot.position.copy(stream.path.getPoint(u));dot.material.color.setHSL((u+i*.1)%1,.9,.65);
 }
 animateKirin(p.bodyBase,time,{flying:true});p.bodyBase.position.y=0;
 for(const material of p.bodyMaterials)material.opacity=lightForm?.50:.19+.020*Math.sin(t*.7);
 root.position.y=.20+Math.sin(t*1.25)*.045;root.rotation.y=gem?-.10:Math.sin(t*.55)*.035;
 for(const beam of p.beams)for(let i=0;i<beam.particles.length;i++){const u=(t*.24+i*.25)%1;beam.particles[i].position.copy(beam.path.getPoint(u));}
 for(const flow of p.flow){const u=(t*.22+flow.offset)%1;flow.dot.position.copy(flow.path.getPoint(u));flow.dot.material.color.setHSL((u+flow.offset)%1,.85,.70);}
 // Pattern, not flashing: a gentle lateral weave and travelling light continuously imply flow.
 p.mane.rotation.z=Math.sin(t*1.3)*.025;
 p.beams[1].particles.forEach(dot=>dot.visible=name!=='Guāngshù');p.beams[2].particles.forEach(dot=>dot.visible=name!=='Guāngshù');
}

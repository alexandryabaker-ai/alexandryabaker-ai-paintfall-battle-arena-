// Local Nova mouth correction on each cloned model. Source asset and eye
// surfaces remain untouched; no new face renderer, teeth or facial rig.
const MOUTH_Y=1.3565846;
const gaussian=(x,c,w)=>Math.exp(-Math.pow((x-c)/w,2));
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function applyNovaSmile(T,model){
 let verticesChanged=0,meshesChanged=0,maxDisplacement=0;
 model.traverse(mesh=>{
  if(!mesh.isSkinnedMesh||mesh.material?.name!=='Game / Nova / warm golden-brown complexion vertex'||mesh.userData.novaSmallSmile)return;
  const g=mesh.geometry,p=g.attributes.position,changed=new Set(),deltas=new Map();
  for(let i=0;i<p.count;i++){
   const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
   if(Math.abs(x)>=.039||y<=1.333||y>=1.380||z<=.105)continue;
   const oldCenter=MOUTH_Y+.0085*gaussian(x,.024,.014)-.0006*gaussian(x,-.024,.014);
   const targetCenter=MOUTH_Y+.0014*Math.min(1,(x/.028)**2);
   const mask=gaussian(y,oldCenter,.012)*(1-smooth(.031,.039,Math.abs(x)))*smooth(1.333,1.340,y)*(1-smooth(1.373,1.380,y))*smooth(.105,.118,z);
   // A small residual lift is baked into the older base sculpt as well as its
   // lip-color curve; remove that excess so the two corners stay understated.
   const dy=(targetCenter-oldCenter-.0008*gaussian(x,.024,.014))*mask,dz=-.0012*gaussian(x,.024,.014)*mask;
   if(Math.hypot(dy,dz)<1e-7)continue;
   p.setXYZ(i,x,y+dy,z+dz);deltas.set(i,[dy,dz]);changed.add(i);maxDisplacement=Math.max(maxDisplacement,Math.hypot(dy,dz));
  }
  if(!changed.size)return;
  // Current GLB morphs are relative (mouth deltas are zero). Also preserve the
  // correction if a future otherwise-compatible export uses absolute targets.
  if(!g.morphTargetsRelative)for(const morph of g.morphAttributes.position||[])for(const [i,[dy,dz]]of deltas)morph.setXYZ(i,morph.getX(i),morph.getY(i)+dy,morph.getZ(i)+dz);
  const normals=new Set(changed),index=g.index?.array,count=index?index.length:p.count;
  for(let i=0;i<count;i+=3){const ids=index?[index[i],index[i+1],index[i+2]]:[i,i+1,i+2];if(ids.some(id=>changed.has(id)))ids.forEach(id=>normals.add(id));}
  const recalculated=g.clone();recalculated.computeVertexNormals();
  if(g.attributes.normal)for(const i of normals)g.attributes.normal.setXYZ(i,recalculated.attributes.normal.getX(i),recalculated.attributes.normal.getY(i),recalculated.attributes.normal.getZ(i));
  recalculated.dispose();p.needsUpdate=true;if(g.attributes.normal)g.attributes.normal.needsUpdate=true;
  g.computeBoundingBox();g.computeBoundingSphere();mesh.userData.novaSmallSmile=true;verticesChanged+=changed.size;meshesChanged++;
 });
 return {applied:verticesChanged>0,verticesChanged,meshesChanged,maxDisplacement,expression:'Small balanced closed-mouth smile',sourceAssetChanged:false,approval:'Awaiting owner visual review'};
}

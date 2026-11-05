// A restrained expression on Nova's existing cloned surfaces, after the
// balanced smile and lower-face corrections. No new geometry or gaze driver.
const g=(v,c,w)=>Math.exp(-Math.pow((v-c)/w,2));
const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
function offsets(x,y,z){
 const ax=Math.abs(x),front=smooth(.075,.112,z);
 if(ax>=.077||y<=1.338||y>=1.469||!front)return 0;
 const brow=(.0012*g(ax,.017,.012)+(x>0?.0017:.0002)*g(ax,.037,.022))*g(y,1.447,.009);
 const mouth=(.0021*g(x,.025,.013)+.0013*g(x,-.025,.013))*g(y,1.357,.009)*smooth(.105,.122,z);
 const cheek=.0009*g(ax,.043,.017)*g(y,1.399,.013);
 const lids=g(ax,.031,.017)*(.00065*g(y,1.420,.0035)-.00020*g(y,1.430,.0035))*(1-smooth(1.435,1.439,y));
 return (brow+mouth+cheek+lids)*front*smooth(1.338,1.344,y)*(1-smooth(1.460,1.469,y));
}
export function applyNovaKnowingExpression(T,model){
 const counts={skin:0,brows:0,paint:0};let maxDisplacement=0;
 model.traverse(mesh=>{
  if(!mesh.isSkinnedMesh||mesh.userData.novaKnowingExpression)return;
  const name=mesh.material?.name,kind=name==='Game / Nova / warm golden-brown complexion vertex'?'skin':name==='Game / Nova near-black eyebrows'?'brows':name==='Game / Nova diagonal green cheek paint'?'paint':null;
  if(!kind)return;
  const geo=mesh.geometry,p=geo.attributes.position,changed=new Set(),deltas=new Map();
  for(let i=0;i<p.count;i++){
   const x=p.getX(i),y=p.getY(i),z=p.getZ(i),dy=offsets(x,y,z);
   if(Math.abs(dy)<1e-7)continue;
   p.setY(i,y+dy);changed.add(i);deltas.set(i,dy);maxDisplacement=Math.max(maxDisplacement,Math.abs(dy));
  }
  if(!changed.size)return;
  if(!geo.morphTargetsRelative)for(const m of geo.morphAttributes.position||[])for(const [i,dy]of deltas)m.setY(i,m.getY(i)+dy);
  const touched=new Set(changed),index=geo.index?.array,count=index?index.length:p.count;
  for(let i=0;i<count;i+=3){const tri=index?[index[i],index[i+1],index[i+2]]:[i,i+1,i+2];if(tri.some(id=>changed.has(id)))tri.forEach(id=>touched.add(id));}
  const fresh=geo.clone();fresh.computeVertexNormals();if(geo.attributes.normal)for(const i of touched)geo.attributes.normal.setXYZ(i,fresh.attributes.normal.getX(i),fresh.attributes.normal.getY(i),fresh.attributes.normal.getZ(i));fresh.dispose();
  p.needsUpdate=true;if(geo.attributes.normal)geo.attributes.normal.needsUpdate=true;geo.computeBoundingBox();geo.computeBoundingSphere();mesh.userData.novaKnowingExpression=true;counts[kind]+=changed.size;
 });
 return {applied:counts.skin>0,verticesChanged:counts,maxDisplacement,expression:'Quiet knowing amusement: restrained asymmetric closed smile, soft cheek/lid lift and slightly raised brow',gazeChanged:false,skinColorChanged:false,newGeometry:false,sourceAssetChanged:false,approval:'Awaiting owner artistic approval'};
}

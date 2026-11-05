// Nova-only correction on existing cloned surfaces: local nose proportions,
// relaxed base, then an optional restrained expression. Earlier source assets
// and the preceding expression proposal remain available for comparison.
const g=(v,c,w)=>Math.exp(-Math.pow((v-c)/w,2));
const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
export function applyNovaRelaxedFace(T,model,{expression=true}={}){
 const counts={nose:0,neutral:0,expression:0};let maxDisplacement=0,meshesChanged=0;
 model.traverse(mesh=>{
  if(!mesh.isSkinnedMesh||mesh.userData.novaRelaxedFace)return;
  const skin=mesh.material?.name==='Game / Nova / warm golden-brown complexion vertex',brow=mesh.material?.name==='Game / Nova near-black eyebrows';
  if(!skin&&!brow)return;
  const geo=mesh.geometry,p=geo.attributes.position,changed=new Set(),deltas=new Map();
  for(let i=0;i<p.count;i++){
   const x=p.getX(i),y=p.getY(i),z=p.getZ(i),ax=Math.abs(x),front=smooth(.080,.112,z);
   if(ax>=.075||y<=1.333||y>=1.470||!front)continue;
   let dx=0,dy=0,dz=0;
   // Contract the cavity/rim around each local nostril center. Protect the
   // projecting tip and central columella instead of shrinking the whole nose.
   if(skin){
    const aperture=(1-smooth(.007,.014,Math.abs(ax-.0095)))*(1-smooth(.006,.012,Math.abs(y-1.390)))*smooth(.116,.126,z)*(1-smooth(.141,.145,z));
    dx+=-Math.sign(x)*(ax-.0095)*.30*aperture*smooth(.002,.004,ax);
    dy+=-(y-1.390)*.45*aperture;
    dz+=.0010*aperture*(1-smooth(.130,.134,z));
    if(aperture>1e-5)counts.nose++;
   }
   // Relax the inward/downward brow slope in the baked base. No cheek lift or
   // lower-lid squeeze: those coupled actions caused the earlier scrunched read.
   const browRelax=(.0016*g(ax,.016,.012)-.0006*g(ax,.045,.018))*g(y,1.447,.009)*front;
   const lipRelax=skin?(.00025*g(y,1.362,.004)-.00020*g(y,1.349,.005))*g(x,0,.020)*smooth(.110,.123,z):0;
   dy+=browRelax+lipRelax;
   if(Math.abs(browRelax+lipRelax)>1e-7)counts.neutral++;
   if(expression&&skin){
    const smile=(.00065*g(x,-.025,.014)+.00090*g(x,.025,.014))*g(y,1.357,.009)*smooth(.110,.123,z);
    dy+=smile;if(smile>1e-7)counts.expression++;
   }
   const amount=Math.hypot(dx,dy,dz);if(amount<1e-7)continue;
   p.setXYZ(i,x+dx,y+dy,z+dz);changed.add(i);deltas.set(i,[dx,dy,dz]);maxDisplacement=Math.max(maxDisplacement,amount);
  }
  if(!changed.size)return;
  if(!geo.morphTargetsRelative)for(const m of geo.morphAttributes.position||[])for(const [i,d]of deltas)m.setXYZ(i,m.getX(i)+d[0],m.getY(i)+d[1],m.getZ(i)+d[2]);
  const touched=new Set(changed),index=geo.index?.array,count=index?index.length:p.count;
  for(let j=0;j<count;j+=3){const tri=index?[index[j],index[j+1],index[j+2]]:[j,j+1,j+2];if(tri.some(i=>changed.has(i)))tri.forEach(i=>touched.add(i));}
  const fresh=geo.clone();fresh.computeVertexNormals();if(geo.attributes.normal)for(const i of touched)geo.attributes.normal.setXYZ(i,fresh.attributes.normal.getX(i),fresh.attributes.normal.getY(i),fresh.attributes.normal.getZ(i));fresh.dispose();p.needsUpdate=true;if(geo.attributes.normal)geo.attributes.normal.needsUpdate=true;
  geo.computeBoundingBox();geo.computeBoundingSphere();mesh.userData.novaRelaxedFace=true;meshesChanged++;
 });
 return {applied:meshesChanged>0,meshesChanged,affectedVerticesByAction:counts,maxDisplacement,stage:expression?'Relaxed base with restrained closed smile':'Relaxed neutral base',priorKnowingExpressionRemoved:true,cheekLiftAdded:false,eyeFocusChanged:false,newGeometry:false,approval:'Awaiting owner artistic approval'};
}

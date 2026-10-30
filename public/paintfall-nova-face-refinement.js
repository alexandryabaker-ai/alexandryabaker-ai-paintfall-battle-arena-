// Nova-only local review: reduce the lower-face bulge and preserve the source
// skin albedo while softening its response to the arena's green/cool ambient.
const gauss=(v,c,w)=>Math.exp(-Math.pow((v-c)/w,2));
const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
export function applyNovaFaceRefinement(T,model){
 let verticesChanged=0,paintVerticesFollowing=0,maxDisplacement=0,skinMaterials=0;
 model.traverse(mesh=>{
  if(!mesh.isSkinnedMesh)return;
  const skin=mesh.material?.name==='Game / Nova / warm golden-brown complexion vertex';
  const paint=mesh.material?.name==='Game / Nova diagonal green cheek paint';
  if(skin&&!mesh.material.userData.novaAmbientSkin){
   const material=mesh.material,previous=material.onBeforeCompile;
   material.onBeforeCompile=function(shader,renderer){
    previous?.call(this,shader,renderer);
    const indirect='reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );';
    const physical=T.ShaderChunk.lights_physical_pars_fragment.replace(indirect,`vec3 novaAmbient = mix(irradiance, vec3(dot(irradiance,vec3(0.2126,0.7152,0.0722))),0.35);
reflectedLight.indirectDiffuse += novaAmbient * 1.65 * BRDF_Lambert( material.diffuseColor );`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <lights_physical_pars_fragment>',physical);
   };
   material.customProgramCacheKey=()=> 'paintfall-nova-source-albedo-soft-ambient-v1';material.userData.novaAmbientSkin=true;material.needsUpdate=true;skinMaterials++;
  }
  if((!skin&&!paint)||mesh.userData.novaLowerFaceRefinement)return;
  const geometry=mesh.geometry,p=geometry.attributes.position,changed=new Set(),deltas=new Map();
  for(let i=0;i<p.count;i++){
   const x=p.getX(i),y=p.getY(i),z=p.getZ(i),ax=Math.abs(x);
   if(ax>=.077||y<=1.330||y>=1.411||z<=.065)continue;
   const front=smooth(.065,.110,z),height=smooth(1.330,1.341,y)*(1-smooth(1.397,1.411,y));
   const cheek=gauss(ax,.054,.018)*gauss(y,1.378,.023)*front*height;
   const mouth=gauss(x,0,.032)*gauss(y,1.355,.017)*smooth(.105,.122,z)*height;
   const dx=-Math.sign(x)*.0023*cheek,dz=-.0018*cheek-.0045*mouth;
   if(Math.hypot(dx,dz)<1e-7)continue;
   p.setXYZ(i,x+dx,y,z+dz);changed.add(i);deltas.set(i,[dx,dz]);maxDisplacement=Math.max(maxDisplacement,Math.hypot(dx,dz));
  }
  if(!changed.size)return;
  if(!geometry.morphTargetsRelative)for(const morph of geometry.morphAttributes.position||[])for(const [i,[dx,dz]]of deltas)morph.setXYZ(i,morph.getX(i)+dx,morph.getY(i),morph.getZ(i)+dz);
  const touched=new Set(changed),indices=geometry.index?.array,count=indices?indices.length:p.count;
  for(let i=0;i<count;i+=3){const tri=indices?[indices[i],indices[i+1],indices[i+2]]:[i,i+1,i+2];if(tri.some(id=>changed.has(id)))tri.forEach(id=>touched.add(id));}
  const fresh=geometry.clone();fresh.computeVertexNormals();if(geometry.attributes.normal)for(const i of touched)geometry.attributes.normal.setXYZ(i,fresh.attributes.normal.getX(i),fresh.attributes.normal.getY(i),fresh.attributes.normal.getZ(i));fresh.dispose();
  p.needsUpdate=true;if(geometry.attributes.normal)geometry.attributes.normal.needsUpdate=true;geometry.computeBoundingBox();geometry.computeBoundingSphere();mesh.userData.novaLowerFaceRefinement=true;
  if(paint)paintVerticesFollowing+=changed.size;else verticesChanged+=changed.size;
 });
 return {applied:skinMaterials>0,verticesChanged,paintVerticesFollowing,maxDisplacement,skinMaterials,sourceSkinColorUnchanged:true,ambientGain:1.65,ambientNeutralMix:.35,emissiveAdded:false,globalLightingChanged:false,approval:'Awaiting owner visual review'};
}

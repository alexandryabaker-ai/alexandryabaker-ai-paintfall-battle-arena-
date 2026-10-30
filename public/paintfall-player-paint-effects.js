import * as paintModule from './paintfall-player-paint.js';
const paint=globalThis.PaintfallPlayerPaint||paintModule.default;
// Draws a bounded, local UV paint layer on existing animated surfaces.
// The original meshes, materials, skeleton and outfit morphs remain intact.
export function updatePlayerPaint(T,actor,wire,now){
 const clock=actor.userData.paintClock??={},marks=paint.sample(wire,now,clock),model=actor.userData.novaGame?.model;
 let fx=actor.userData.playerPaint;
 if(!fx&&!marks.length)return;
 if(fx&&fx.model!==model){for(const overlay of fx.overlays){overlay.removeFromParent();if(overlay.userData.ownsPaintGeometry)overlay.geometry.dispose();}fx.material.dispose();fx.texture.dispose();fx=null;}
 if(!fx){
  const size=128,pixels=new Uint8Array(size*size*4),texture=new T.DataTexture(pixels,size,size);texture.colorSpace=T.SRGBColorSpace;texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearFilter;texture.needsUpdate=true;
  const material=new T.MeshStandardMaterial({map:texture,color:0xffffff,roughness:.36,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});material.userData.playerPaintTexture=true;
  const surfaces=[];const source=model||actor.userData.parts.body;source.traverse(mesh=>{if(mesh.isMesh&&!mesh.userData.paintOverlay&&!mesh.userData.decorative&&(model?!/hair|eye|complexion|skin|hoop|cheek/i.test(mesh.material?.name||''):['tailored-torso','hips','thigh','shin','upper-arm','forearm','cargo-pocket','cargo-secondary-pocket','fitted-chest-panel','pectoral-panel','sheet-panel'].includes(mesh.name)))surfaces.push(mesh);});
  const overlays=[];
  for(const source of surfaces){
   let geometry=source.geometry,ownsGeometry=false;
   if(!geometry.attributes.uv){
    // Nova's vertex-color GLB intentionally has no UVs. Generate coordinates
    // only on this disposable overlay; preserve the approved original asset.
    geometry=geometry.clone();ownsGeometry=true;const pos=geometry.attributes.position,uv=new Float32Array(pos.count*2),height=actor.userData.standingHeight;
    for(let i=0;i<pos.count;i++){uv[i*2]=.5+Math.atan2(pos.getZ(i),pos.getX(i))/(Math.PI*2);uv[i*2+1]=pos.getY(i)/height;}
    geometry.setAttribute('uv',new T.BufferAttribute(uv,2));
   }
   const overlay=source.isSkinnedMesh?new T.SkinnedMesh(geometry,material):new T.Mesh(geometry,material);
   overlay.name='Temporary paint splatters';overlay.userData.paintOverlay=true;overlay.userData.ownsPaintGeometry=ownsGeometry;overlay.raycast=()=>{};overlay.castShadow=false;overlay.receiveShadow=true;
   source.add(overlay);
   if(source.isSkinnedMesh){overlay.bindMode=source.bindMode;overlay.bind(source.skeleton,source.bindMatrix);overlay.bindMatrixInverse.copy(source.bindMatrixInverse);}
   if(source.morphTargetInfluences){overlay.morphTargetInfluences=source.morphTargetInfluences;overlay.morphTargetDictionary=source.morphTargetDictionary;}
   overlays.push(overlay);
  }
  fx={model,overlays,material,texture,pixels,size,nextDraw:0};actor.userData.playerPaint=fx;
 }
 for(const overlay of fx.overlays)overlay.visible=marks.length>0;
 if(now<fx.nextDraw&&marks.length&&fx.signature===marks.map(m=>m.id).join(','))return;
 fx.nextDraw=now+100;fx.signature=marks.map(m=>m.id).join(',');fx.pixels.fill(0);
 for(const mark of marks){
  const x=12+(mark.slot*37)%104,y=12+(mark.slot*59)%104,radius=5+(mark.slot%4);
  const rgb=[(mark.color>>16)&255,(mark.color>>8)&255,mark.color&255];
  for(let py=Math.max(0,y-radius-3);py<Math.min(fx.size,y+radius+4);py++)for(let px=Math.max(0,x-radius-3);px<Math.min(fx.size,x+radius+4);px++){
   const dx=px-x,dy=py-y,angle=Math.atan2(dy,dx),edge=radius*(1+.22*Math.sin(angle*5+mark.slot));
   const a=Math.max(0,Math.min(1,edge-Math.hypot(dx,dy)))*mark.opacity;if(!a)continue;
   const index=(py*fx.size+px)*4,old=fx.pixels[index+3]/255,total=a+old*(1-a);
   for(let c=0;c<3;c++)fx.pixels[index+c]=(rgb[c]*a+fx.pixels[index+c]*old*(1-a))/total;fx.pixels[index+3]=Math.round(total*255);
  }
 }
 fx.texture.needsUpdate=true;
}

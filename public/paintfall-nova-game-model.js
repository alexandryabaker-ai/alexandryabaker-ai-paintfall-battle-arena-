import { GLTFLoader } from './vendor/GLTFLoader.js';
import { createNovaLocomotion } from './paintfall-nova-locomotion.js';
import { applyNovaEyeAlignment } from './paintfall-nova-eye-alignment.js';
import { applyNovaSmile } from './paintfall-nova-smile.js';
import { applyNovaFaceRefinement } from './paintfall-nova-face-refinement.js';
import { applyNovaKnowingExpression } from './paintfall-nova-knowing-expression.js';
// Same local Three.js instance as the world. No second renderer or animation mixer.
export function createNovaGameAdapter(T,{url='/assets/characters/nova-game-01.glb',enabled=true}={}){
 let templatePromise;
 function template(){return templatePromise??=new GLTFLoader().loadAsync(url).then(g=>g.scene).catch(error=>{templatePromise=null;throw error;});}
 function clone(source){
  const result=source.clone(true),map=new Map();
  const pair=(a,b)=>{map.set(a,b);a.children.forEach((c,i)=>pair(c,b.children[i]));};pair(source,result);
  source.traverse(original=>{const copy=map.get(original);if(original.isSkinnedMesh){copy.skeleton=original.skeleton.clone();copy.skeleton.bones=original.skeleton.bones.map(b=>map.get(b));copy.bindMatrix.copy(original.bindMatrix);copy.bindMatrixInverse.copy(original.bindMatrixInverse);}
   if(original.isMesh){copy.geometry=original.geometry.clone();copy.material=Array.isArray(original.material)?original.material.map(m=>m.clone()):original.material.clone();copy.frustumCulled=false;copy.castShadow=true;copy.receiveShadow=true;}});
  return result;
 }
 function attach(actor){
  if(!enabled){
   actor.userData.modelSource='Procedural fallback — owner selected';
   if(!actor.userData.novaFallbackMotion){
    const p=actor.userData.parts,bones={};
    for(const side of ['L','R'])for(const [name,node]of [['leg'+side,p['leg'+side]],['shin'+side,p['leg'+side].userData.shin],['foot'+side,p['leg'+side].userData.shin.getObjectByName('boot')],['arm'+side,p['arm'+side]]])bones[name]={node,rest:node.quaternion.clone()};
    const game={model:p.body,bones,procedural:true};game.locomotion=createNovaLocomotion(T,actor,game);actor.userData.novaFallbackMotion=game;
   }
   return;
  }
  if(actor.userData.character!=='Nova'||actor.userData.novaGameLoading)return;
  actor.userData.novaGameLoading=true;
  template().then(source=>{
   if(actor.userData.disposed)return;
   const model=clone(source);model.name='Nova Blender candidate 06 / animated game derivative';
   actor.userData.novaEyeAlignment=applyNovaEyeAlignment(T,model);
   actor.userData.novaSmile=applyNovaSmile(T,model);
   actor.userData.novaFaceRefinement=applyNovaFaceRefinement(T,model);
   actor.userData.novaKnowingExpression=applyNovaKnowingExpression(T,model);
   model.scale.setScalar(1/actor.userData.standingHeight);model.rotation.y=Math.PI;
   const p=actor.userData.parts,weapon=new Set();p.blaster.traverse(o=>weapon.add(o));
   const old=[];actor.traverse(o=>{if(o.isMesh&&!weapon.has(o)){old.push([o,o.visible]);o.visible=false;}});
   p.body.add(model);
   const bones={};model.traverse(o=>{if(o.isBone)bones[o.name]={node:o,rest:o.quaternion.clone()};});
   actor.userData.novaGame={model,bones,old};actor.userData.modelSource='Blender Nova candidate 06';
   p.body.rotation.set(0,0,0);p.body.position.set(0,actor.userData.baseBodyY,0);
   actor.userData.novaGame.locomotion=createNovaLocomotion(T,actor,actor.userData.novaGame);
   actor.updateMatrixWorld(true);
   const bounds=new T.Box3().setFromObject(model);actor.userData.renderHeight=bounds.max.y-bounds.min.y;actor.userData.normalRenderHeight=actor.userData.renderHeight;
   // Keep the existing firing attachment; move its local anchor to the new hand.
   const hand=bones.handR?.node;
   if(hand){const scale=actor.userData.standingHeight;p.blaster.removeFromParent();hand.add(p.blaster);p.blaster.scale.setScalar(scale);p.blaster.position.set(0,.015,-.025);p.blaster.rotation.set(0,0,0);}
   actor.userData.novaGameError=null;
  }).catch(error=>{actor.userData.novaGameError=String(error.message||error);actor.userData.modelSource='Procedural fallback';console.warn('Nova model unavailable; procedural fallback retained:',error.message);});
 }
 function update(actor,context={}){
  const game=actor.userData.novaGame||actor.userData.novaFallbackMotion;if(!game)return;
  game.locomotion.update(context);
  const progress=actor.userData.novaOutfitProgress||0;
  game.model.traverse(o=>{if(o.morphTargetDictionary?.TrackUniform!==undefined)o.morphTargetInfluences[o.morphTargetDictionary.TrackUniform]=progress;});
 }
 return {attach,update,preload:template};
}

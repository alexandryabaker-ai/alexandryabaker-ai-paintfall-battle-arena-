// Nova-only eye surface correction. Calibration comes from candidate 06's
// original eye bounds, converted to the GLB's bind-space X/Y/Z axes.
// No eyeball translation, eye rotation, facial rig or camera-following gaze.
export const NOVA_EYE_CALIBRATION=Object.freeze({
 negative:Object.freeze({center:[-.030689647421240807,1.4235844612121582,.10659557580947876],radius:[.01431278046220541,.0143972635269165],depth:.013625942}),
 positive:Object.freeze({center:[.030714882537722588,1.4235846996307373,.10658672451972961],radius:[.01430895086377859,.01439738273620605],depth:.013613768}),
 gaze:Object.freeze([0,0,1])
});
// One head-local focus: gentle binocular convergence and iris height matched
// to the measured eyelid apertures, rather than the whole-sphere bounding box.
export const NOVA_EYE_FOCUS=Object.freeze([0,1.55,1.10]);
export function novaIrisCenter(side){
 const c=NOVA_EYE_CALIBRATION[side],d=NOVA_EYE_FOCUS.map((v,i)=>v-c.center[i]);
 const t=1/Math.sqrt(Math.pow(d[0]/c.radius[0],2)+Math.pow(d[1]/c.radius[1],2)+Math.pow(d[2]/c.depth,2));
 return c.center.map((v,i)=>v+d[i]*t);
}
export function applyNovaEyeAlignment(T,model){
 let count=0;
 const color=hex=>{const c=new T.Color(hex);return `vec3(${c.r.toFixed(8)},${c.g.toFixed(8)},${c.b.toFixed(8)})`;};
 const pupil=color('#081c23'),inner=color('#14444d'),teal=color('#228d8b'),outer=color('#277d82'),rim=color('#123d49'),white=color('#e7e2d4');
 model.traverse(mesh=>{
  if(!mesh.isMesh)return;
  for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
   if(!material||!/^Game \/ Nova eyes .*on eyeball vertex$/.test(material.name)||material.userData.novaEyeAlignment)continue;
   const previous=material.onBeforeCompile;
   material.onBeforeCompile=function(shader,renderer){
    previous?.call(this,shader,renderer);
    shader.uniforms.novaEyeNegative={value:new T.Vector3(...NOVA_EYE_CALIBRATION.negative.center)};
    shader.uniforms.novaEyePositive={value:new T.Vector3(...NOVA_EYE_CALIBRATION.positive.center)};
    shader.uniforms.novaRadiusNegative={value:new T.Vector2(...NOVA_EYE_CALIBRATION.negative.radius)};
    shader.uniforms.novaRadiusPositive={value:new T.Vector2(...NOVA_EYE_CALIBRATION.positive.radius)};
    shader.uniforms.novaEyeFocus={value:new T.Vector3(...NOVA_EYE_FOCUS)};
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vNovaEyeBind;').replace('#include <begin_vertex>','#include <begin_vertex>\nvNovaEyeBind = position;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 vNovaEyeBind;
uniform vec3 novaEyeNegative;
uniform vec3 novaEyePositive;
uniform vec2 novaRadiusNegative;
uniform vec2 novaRadiusPositive;`);
    shader.fragmentShader=shader.fragmentShader.replace('uniform vec2 novaRadiusPositive;','uniform vec2 novaRadiusPositive;\nuniform vec3 novaEyeFocus;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
vec3 novaCenter = vNovaEyeBind.x < 0.0 ? novaEyeNegative : novaEyePositive;
vec2 novaRadius = vNovaEyeBind.x < 0.0 ? novaRadiusNegative : novaRadiusPositive;
vec3 novaGaze = normalize(novaEyeFocus - novaCenter);
vec3 novaRight = normalize(cross(vec3(0.0,1.0,0.0),novaGaze));
vec3 novaUp = cross(novaGaze,novaRight);
vec3 novaDelta = vNovaEyeBind - novaCenter;
float novaR = length(vec2(dot(novaDelta,novaRight),dot(novaDelta,novaUp)) / novaRadius);
float novaAA = max(fwidth(novaR), 0.003);
vec3 novaSurface = mix(${rim}, ${white}, smoothstep(0.58-novaAA,0.64+novaAA,novaR));
novaSurface = mix(${outer},novaSurface,smoothstep(0.53,0.58,novaR));
novaSurface = mix(${teal},novaSurface,smoothstep(0.38,0.53,novaR));
novaSurface = mix(${inner},novaSurface,smoothstep(0.27,0.38,novaR));
novaSurface = mix(${pupil},novaSurface,smoothstep(0.24-novaAA,0.27+novaAA,novaR));
diffuseColor.rgb = dot(novaDelta,novaGaze) > 0.0 ? novaSurface : ${white};`);
   };
   material.customProgramCacheKey=()=> 'paintfall-nova-shared-focus-eye-surface-v2';
   material.userData.novaEyeAlignment=true;material.needsUpdate=true;count++;
  }
 });
 const a=new T.Vector3(...NOVA_EYE_FOCUS).sub(new T.Vector3(...NOVA_EYE_CALIBRATION.negative.center)).normalize(),b=new T.Vector3(...NOVA_EYE_FOCUS).sub(new T.Vector3(...NOVA_EYE_CALIBRATION.positive.center)).normalize();
 return {applied:count>0,materials:count,gazeDot:a.dot(b),commonFocus:true,focus:[...NOVA_EYE_FOCUS],irisCenters:[novaIrisCenter('negative'),novaIrisCenter('positive')],method:'Shared finite head-local focus aligned to visible eyelid apertures',eyeGeometryChanged:false};
}

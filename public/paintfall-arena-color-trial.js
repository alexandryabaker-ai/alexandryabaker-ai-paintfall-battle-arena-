// Owner-approved Cambodia flower treatment. Original colors remain reversible
// for comparison; other destinations retain their established palette/lighting.
export function createArenaColorTrial(T,world){
 const saved=new Map(),lights=[],exposure=world.renderer.toneMappingExposure;
 world.scene.traverse(o=>{if(o.isLight&&Number.isFinite(o.intensity))lights.push([o,o.intensity]);});
 let active=false;
 function restore(){for(const [m,base]of saved){m.color.copy(base.color);if(base.roughness!==undefined)m.roughness=base.roughness;}saved.clear();for(const [light,intensity]of lights)light.intensity=intensity;world.renderer.toneMappingExposure=exposure;active=false;}
 function apply(enabled){
  restore();if(!enabled||world.region?.destination?.id!=='country:Cambodia')return false;
  const root=world.region.garden?.group;if(!root)return false;
  root.traverse(o=>{for(const material of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){
   if(!material.color||material.isSpriteMaterial||saved.has(material))continue;
   saved.set(material,{color:material.color.clone(),roughness:material.roughness});
   const hsl=material.color.getHSL({});if(hsl.s>.05)material.color.setHSL(hsl.h,Math.min(1,hsl.s*1.16+.035),hsl.l);
  }});
  const colors={
   'Romduol pale six-petaled flowers':0xf4d481,'Romduol elliptical leaves':0x3d7647,
   'Sugar-palm segmented fan frond':0x487e54,'Pale yellow cucumber flower petal':0xf8ce50,
   'Five unequal Impatiens petals':0xe47aaf,'Five-sided mountain-laurel cup':0xfff5e7,
   'Laurel stamen pocket':0x974774,'Painting made by the paint flowers':0xffffff
  };
  root.traverse(o=>{if(colors[o.name]!==undefined&&o.material?.color)o.material.color.setHex(colors[o.name]);});
  for(const [light,intensity]of lights)light.intensity=intensity*(light.isHemisphereLight ? .77 : light.isDirectionalLight ? .95 : 1);
  world.renderer.toneMappingExposure=.98;active=true;return true;
 }
 return {apply,restore,get active(){return active;}};
}

import {buildRegionalAssets} from './paintfall-arena-region-assets.js';
import {applyArenaComfort} from './paintfall-arena-comfort.js';
import {buildArenaGarden} from './paintfall-arena-gardens.js';
import {createArenaSurfaceMaterial} from './paintfall-arena-surface.js';

export function disposeRegion(region){
 if(!region)return;
 region.group.removeFromParent();
 const geometries=new Set(),materials=new Set(),textures=new Set();
 region.group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])materials.add(m);});
 for(const m of materials)for(const v of Object.values(m))if(v?.isTexture)textures.add(v);
 textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
}

// Arena adaptation of each existing construction foundation. Match terrain is
// level for shared movement; regional models retain their original proportions.
export function buildArenaRegion(T,scene,destination){
 const group=new T.Group();group.name=destination.name+' arena';
 const explorer={position:new T.Vector3()},ground=(x,z)=>Math.abs(x)<=80&&Math.abs(z)<=80?new T.Vector3(x,.012,z):null;
 try{
  const assets=buildRegionalAssets(T,{land:group,...destination,ground,explorer});
  const garden=buildArenaGarden(T,{group,destination,obstacles:assets.obstacles,waterBounds:assets.landmarks?.waterBounds,style:assets.style});
  // Wildlife route checks retain this array; share the added garden obstacles.
  if(garden)assets.obstacles.push(...garden.obstacles);
  const palette={forest:0x82916a,desert:0xc6ac81,coast:0xc5c09b,ice:0xc9dde0,mountain:0x9ca18a,volcano:0x8c8a85,lake:0xa3af88,wetland:0x94a281,prairie:0xb9b982,river:0xa2af88,cave:0xaaa28b};
  const surfaceKind=['desert','coast'].includes(assets.style)?'sand':['ice','volcano','cave'].includes(assets.style)?'stone':'grass';
  const surface=new T.Mesh(new T.PlaneGeometry(160,160,32,32),createArenaSurfaceMaterial(T,palette[assets.style]||palette.forest,surfaceKind));
  surface.rotation.x=-Math.PI/2;surface.position.y=.012;surface.receiveShadow=true;surface.name='Level regional arena terrain';group.add(surface);
  const points=[[-70,-70],[70,-70],[70,70],[-70,70],[-70,-70]].map(([x,z])=>new T.Vector3(x,.04,z));
  const boundary=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0x265f67}));boundary.name='Arena movement boundary';group.add(boundary);
  scene.add(group);
  const result={...assets,garden,group,explorer,destination,get interactionTime(){return assets.interactionTime;},update(dt,p){if(p)explorer.position.copy(p);assets.update(dt);garden?.update(dt);applyArenaComfort(T,result,globalThis.window?.PAINTFALL_COMFORT_CHOICES||[]);}};
  return result;
 }catch(error){disposeRegion({group});throw error;}
}

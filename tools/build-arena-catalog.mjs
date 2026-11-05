import fs from 'node:fs';
import * as T from '../public/vendor/three.module.js';
import {buildArenaRegion,disposeRegion} from '../public/paintfall-arena-region.js';
const destinations=JSON.parse(fs.readFileSync('public/paintfall-arena-destinations.json'));
const regions={},scene=new T.Scene();
// Canvas patterns affect appearance only; collision generation needs no GPU.
globalThis.window={};
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>new Proxy({},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)})})};
let failures=0;
for(const destination of destinations){
 try{
  const region=buildArenaRegion(T,scene,destination);
  const obstacles=region.obstacles.map(o=>({x:o.x,z:o.z,halfX:o.halfX,halfZ:o.halfZ}));
  for(const o of obstacles)if(!Object.values(o).every(Number.isFinite)||o.halfX<=0||o.halfZ<=0)throw Error('Invalid obstacle '+JSON.stringify(o));
  const blocked=(x,z)=>obstacles.some(o=>Math.abs(x-o.x)<o.halfX+.6&&Math.abs(z-o.z)<o.halfZ+.6);
  const spawns=[];
  for(let i=0;i<16000&&spawns.length<16;i++){
   const a=i*2.4,r=Math.sqrt(i)*.45,x=Math.cos(a)*r,z=Math.sin(a)*r;
   if(Math.abs(x)>60||Math.abs(z)>60||blocked(x,z)||spawns.some(p=>Math.hypot(p.x-x,p.z-z)<3))continue;
   spawns.push({x,z});
  }
  if(spawns.length!==16)throw Error('Not enough unobstructed spawns');
  if(region.parks)region.parks.sites.forEach((site,i)=>{const p=site.entrance;if(blocked(p.x,p.z))throw Error('Blocked park entrance '+site.id);spawns[14+i]={...p};});
  regions[destination.id]={...destination,bound:region.bound,obstacles,spawns,homes:region.homes?.homes?.length||0,animals:region.wildlife?.animals?.length||0,...(region.parks?{parks:region.parks.sites.map(({id,title,entrance,status},i)=>({id,title,entrance,status,spawn:14+i,boardingEnabled:false}))}:{}),...(region.garden?{garden:{...region.garden.center,theme:region.garden.theme,status:region.garden.status,identityStatus:region.garden.identityStatus}}:{})};
  region.update(.016,new T.Vector3());
  disposeRegion(region);
  console.log('PASS '+destination.id+' • '+regions[destination.id].homes+' homes • '+regions[destination.id].animals+' animals');
 }catch(e){failures++;console.error('FAIL '+destination.id+' '+e.stack);}
}
if(failures)process.exitCode=1;
else{
 fs.writeFileSync('public/paintfall-arena-catalog.js','// Generated arena collision/spawn metadata. Shared by server and browser.\n(function(root){const catalog='+JSON.stringify(regions)+';if(typeof module==="object"&&module.exports)module.exports=catalog;else root.PaintfallArenaCatalog=catalog;})(typeof window==="object"?window:globalThis);\n');
 console.log('PASS all '+destinations.length+' destinations.');
}

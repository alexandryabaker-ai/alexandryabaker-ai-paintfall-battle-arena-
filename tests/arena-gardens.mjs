import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import * as T from '../public/vendor/three.module.js';
import {composedGardenBuilders} from '../public/paintfall-garden-compositions.js';
import {eastAsiaGardenBuilders} from '../public/paintfall-east-asia-gardens.js';
import {buildArenaRegion,disposeRegion} from '../public/paintfall-arena-region.js';
const destinations=JSON.parse(fs.readFileSync('public/paintfall-arena-destinations.json'));
const catalog=createRequire(import.meta.url)('../public/paintfall-arena-catalog.js');
globalThis.window={};globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>new Proxy({},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)})})};
const scene=new T.Scene();let count=0,benchCount=0;
for(const destination of destinations){
 const region=buildArenaRegion(T,scene,destination),garden=region.garden;
 assert.deepEqual(region.obstacles.map(({x,z,halfX,halfZ})=>({x,z,halfX,halfZ})),catalog[destination.id].obstacles,'live scene and server collision geometry match '+destination.id);
 if(destination.type==='country'){
  assert.ok(garden,destination.id+' garden exists');assert.equal(garden.seats.length,2);assert.equal(garden.status,'coming-soon');
  assert.deepEqual(garden.paintFlowers.group.userData.releaseParts,['fruit','seedpod','flower stamens']);assert.equal(garden.paintFlowers.group.userData.harmless,true);
  assert.ok(Math.hypot(garden.center.x,garden.center.z)>30,'garden leaves central spawn area clear');
  const droplets=garden.paintFlowers.group.getObjectByName('Harmless animated paint-flower droplets'),before=Array.from(droplets.instanceMatrix.array);
  for(let i=0;i<95;i++)garden.update(.1);assert.notDeepEqual(Array.from(droplets.instanceMatrix.array),before,'paint droplets animate');
  for(const value of droplets.instanceMatrix.array)assert.ok(Number.isFinite(value),'finite animated transforms');
  if(destination.name==='Vietnam'){
   assert.equal(garden.themeKey,'vietnam-hue');const names=[];garden.group.traverse(o=>names.push(o.name));
   for(const name of ['Round lotus leaf','Pink lotus petal','White lotus petal','Purple rose-myrtle petal','Vietnam garden bench seat','Five-sided mountain-laurel cup','Curved Impatiens nectar spur','Blue-green bristly cucumber fruit'])assert.ok(names.includes(name),'Vietnam includes '+name);
   assert.equal(garden.identityStatus,'owner-review');
  }else if(destination.name==='Laos'){
   assert.equal(garden.themeKey,'laos-bamboo-champa');assert.equal(garden.identityStatus,'owner-review');
   const names=[];garden.group.traverse(o=>names.push(o.name));for(const name of ['Jointed bamboo culm','White dok champa petal','Orchid petal study','Ornamental ginger bract','Laos garden bench seat'])assert.ok(names.includes(name),'Laos includes '+name);
  }else if(destination.name==='Cambodia'){
   assert.equal(garden.themeKey,'cambodia-romduol-palm');assert.equal(garden.identityStatus,'owner-review');
   const names=[];garden.group.traverse(o=>names.push(o.name));for(const name of ['Romduol pale six-petaled flowers','Sugar-palm segmented fan frond','Cambodia garden bench seat','Level sandstone entrance promenade'])assert.ok(names.includes(name),'Cambodia includes '+name);
  }else if(['Thailand','Myanmar','Malaysia','Indonesia','Philippines',...Object.keys(eastAsiaGardenBuilders),...Object.keys(composedGardenBuilders)].includes(destination.name)){
   assert.equal(garden.identityStatus,'owner-review');assert.ok(garden.flowerCount>0);
  }else assert.equal(garden.identityStatus,'regional-design-pending','do not claim local identities are finished');
  count++;benchCount+=garden.seats.length;
 }else assert.equal(garden,null,'U.S. state garden design is separate from this country pass');
 disposeRegion(region);assert.equal(scene.children.length,0,'region and garden removed together');
}
assert.equal(count,255);assert.equal(benchCount,510);console.log('PASS: 255 country/territory garden foundations, 510 benches, animated botanical paint mechanisms, researched distinctive garden proposals, clear center and clean disposal. State/city identities remain separate work.');

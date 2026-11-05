import assert from 'node:assert/strict';
import * as T from '../public/vendor/three.module.js';
import {composedGardenBuilders as eastAsiaGardenBuilders} from '../public/paintfall-garden-compositions.js';
import {buildArenaGarden} from '../public/paintfall-arena-gardens.js';
import {composedGardenReferences as gardenReferences} from '../public/paintfall-garden-compositions.js';
import {globalGardenProfiles} from '../public/paintfall-garden-profiles.js';
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>new Proxy({},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)})})};
const distinctLayouts=new Set(),signatures=new Set();
const botanicalCompositions=Object.values(globalGardenProfiles).map(p=>[p.layout,p.foliage,p.plant.form].join('|'));
assert.equal(new Set(botanicalCompositions).size,botanicalCompositions.length,'different gardens also vary their layout, foliage or botanical form, beyond color and label');
for(const [name,build] of Object.entries(eastAsiaGardenBuilders)){
 const local=new T.Group(),result=build(T,local),names=[];let meshCount=0;
 local.updateMatrixWorld(true);local.traverse(o=>{names.push(o.name);if(o.isMesh)meshCount++;assert.ok(o.matrixWorld.elements.every(Number.isFinite),name+' finite transform');});
 assert.equal(result.seats.length,2);assert.ok(result.flowerCount>0);assert.ok(meshCount<1600,name+' bounded mesh count');
 for(const o of result.obstacles){assert.ok(Object.values(o).every(Number.isFinite));assert.ok(o.halfX>0&&o.halfZ>0);assert.ok(Math.abs(o.x)+o.halfX<=10&&Math.abs(o.z)+o.halfZ<=9,name+' reserved footprint');}
 assert.ok(gardenReferences[name]?.url.startsWith('https://'));distinctLayouts.add(result.layout);signatures.add(names.sort().join('|'));
 if(name==='Mongolia')assert.equal(names.filter(n=>n==='Iris lactea drooping fall').length,names.filter(n=>n==='Iris lactea upright standard').length);
 if(name==='North Korea')assert.ok(names.includes('Magnolia burgundy stamen'));
 if(name==='Hong Kong')assert.ok(names.includes('Bauhinia paired leaf lobe'));
 if(name==='China')assert.ok(names.includes('Open circular moon gate'));
 // A 0.6m-radius player must reach both seats and the painting corner from the entrance.
 // Grid-search real collision shapes, including paint frame and freestanding front sign.
 const parent=new T.Group(),garden=buildArenaGarden(T,{group:parent,destination:{id:'country:'+name,name,type:'country'}}),{x:cx,z:cz}=garden.center;
 const solids=garden.obstacles.map(o=>({...o,x:o.x-cx,z:o.z-cz}));
 const step=.4,blocked=(x,z)=>solids.some(o=>Math.abs(x-o.x)<o.halfX+.6&&Math.abs(z-o.z)<o.halfZ+.6);
 const queue=[[0,-11.6]],visited=new Set(),reachable=[];
 for(let i=0;i<queue.length;i++){const [x,z]=queue[i],key=x.toFixed(2)+','+z.toFixed(2);if(visited.has(key)||x<-10.8||x>10.8||z<-12||z>9||blocked(x,z))continue;visited.add(key);reachable.push([x,z]);for(const [dx,dz]of [[step,0],[-step,0],[0,step],[0,-step]])queue.push([x+dx,z+dz]);}
 for(const seat of garden.seats)assert.ok(reachable.some(([x,z])=>Math.hypot(x-seat.x,z-(seat.z-1.1))<.85),name+' seat approach reachable');
 const paint=garden.paintFlowers.group.position;assert.ok(reachable.some(([x,z])=>Math.hypot(x-paint.x,z-paint.z)<.8),name+' painting-corner viewing position reachable');
 const materials=new Set(),geometries=new Set();for(const root of [local,parent])root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m)materials.add(m);});
 for(const material of materials){material.map?.dispose();material.dispose();}for(const geometry of geometries)geometry.dispose();
 console.log('PASS '+name+': '+meshCount+' meshes; distinctive planting, two accessible benches and reachable paint corner.');
}
assert.equal(distinctLayouts.size,Object.keys(eastAsiaGardenBuilders).length);assert.equal(signatures.size,Object.keys(eastAsiaGardenBuilders).length);
console.log('PASS: all composed researched layouts, botanical forms, finite geometry, accessible paths and bounded footprints.');

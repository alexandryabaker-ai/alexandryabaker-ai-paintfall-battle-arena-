import assert from 'node:assert/strict';
import * as T from '../public/vendor/three.module.js';
import catalog from '../public/paintfall-arena-catalog.js';
import {buildRegionalRideParks} from '../public/paintfall-regional-ride-parks.js';

globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){}})})};

for(const [state,counts] of [['Arizona',[3,4]],['California',[6,4]]]){
 const destination=catalog['state:'+state];
 const group=new T.Group();
 const parks=buildRegionalRideParks(T,{group,destination});
 assert.deepEqual(parks.sites.map(site=>site.rides.length),counts);
 assert.equal(parks.bound,destination.bound);
 for(const obstacle of parks.obstacles){
  assert.ok(destination.obstacles.some(candidate=>
   Object.keys(obstacle).every(key=>candidate[key]===obstacle[key])));
 }
 for(const site of parks.sites){
  assert.ok(destination.spawns.some(spawn=>spawn.x===site.entrance.x&&spawn.z===site.entrance.z));
  for(const ride of site.rides){
   const car=ride.cars[0],before=car.position.clone();
   for(let i=0;i<80;i++)parks.update(.05);
   assert.ok(car.position.distanceTo(before)>.01,ride.name);
   assert.ok(car.position.toArray().every(Number.isFinite),ride.name);
  }
 }
}
assert.equal(buildRegionalRideParks(T,{group:new T.Group(),destination:catalog['state:Utah']}),null);
const realPerformance=globalThis.performance;
let now=0;
Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>now}});
try{
 const create=()=>buildRegionalRideParks(T,{group:new T.Group(),destination:catalog['state:California']});
 const a=create(),b=create();
 a.syncClock(20000);b.syncClock(20000);
 a.update(0);
 for(let frame=0;frame<100;frame++){now+=20;a.update(.02);}
 b.update(0);
 for(let site=0;site<2;site++)for(let ride=0;ride<a.sites[site].rides.length;ride++){
  const first=a.sites[site].rides[ride].cars[0],second=b.sites[site].rides[ride].cars[0];
  assert.ok(first.position.distanceTo(second.position)<1e-8,'same room time must produce the same car position after different frame histories');
 }
 const round=a.sites[0].rides.find(ride=>ride.key==='hub-roundabout');
 const before=round.cars[0].position.clone();
 a.setInspectionMode(true);now+=5000;a.update(.1);
 assert.ok(round.cars[0].position.equals(before),'inspection freezes rides');
 a.setInspectionMode(false);a.update(0);
 b.update(0);
 assert.ok(round.cars[0].position.distanceTo(b.sites[0].rides.find(ride=>ride.key==='hub-roundabout').cars[0].position)<1e-8,'resume returns to room time');
}finally{Object.defineProperty(globalThis,'performance',{configurable:true,value:realPerformance});}
console.log('PASS: both parks in Arizona and California, saved trains animate, shared plaza spawns and fences.');

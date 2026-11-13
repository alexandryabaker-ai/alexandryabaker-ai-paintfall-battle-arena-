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
console.log('PASS: both parks in Arizona and California, saved trains animate, shared plaza spawns and fences.');

import assert from 'node:assert/strict';
import * as T from '../public/vendor/three.module.js';
import catalog from '../public/paintfall-arena-catalog.js';
import {buildRegionalRideParks} from '../public/paintfall-regional-ride-parks.js';
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){}})})};

for(const [state,counts] of [['Utah',[6,5]],['Colorado',[6]],['New Mexico',[6]]]){
 const scene=new T.Scene(),destination=catalog['state:'+state];
 const parks=buildRegionalRideParks(T,{group:scene,destination});
 assert.deepEqual(parks.sites.map(site=>site.rides.length),counts);
 assert.equal(destination.bound,parks.bound);
 const names=parks.sites[0].rides.map(ride=>ride.name);
 assert.equal(new Set(names).size,6);
 if(state==='New Mexico'){
  assert.deepEqual(names,['White Glow Paint Drift','CavernCanvas EchoRun','CalderaColor Coil','BalloonBloom SkyParade','SandiaSunset SkySweep','Starport PaintLaunch']);
  assert.deepEqual(parks.sites[0].rides.map(r=>r.travelScope),['neighboring-state','neighboring-state','neighboring-state','country','country','country']);
  assert.deepEqual(parks.sites[0].rides[2].sequence,['forested volcanic hills','glowing rock tunnel','brightening color veins during upward spiral','tunnel exit revealing drop','colorful meadow finale']);
  assert.equal(parks.sites[0].rides[5].localNight,true);
  assert.equal(scene.background,null,'night setting does not change the world background');
  const sky=scene.getObjectByName('Starport ride-local night sky');
  assert.equal(sky.material.side,T.BackSide);
  // Ride sky must fit its own plot; other ride centers are 99 units apart.
  assert.ok(sky.geometry.parameters.radius<49.5);
 }
 if(state==='Utah'){
  assert.ok(names.includes('Starlight PaintFall')&&names.includes('Starlight PaintSky'));
  assert.deepEqual(parks.sites[1].rides.map(ride=>[ride.appearanceInspiration,ride.performanceInspiration]),[
   ['Honda Civic','Standard Bugatti Chiron'],['Toyota Camry','Original Bugatti Veyron 16.4'],
   ['Honda Accord','Lamborghini Aventador SVJ'],['Ford F-150','2017 Ford GT'],['Toyota Corolla','Porsche 918 Spyder'],
  ]);
 }
 for(const site of parks.sites){
  assert.equal(site.group.position.x,site.id==='hub'?0:190,'center hub and east racing');
  assert.equal(site.group.position.z,0);
  const spawn=destination.spawns.find(p=>p.x===site.entrance.x&&p.z===site.entrance.z);
  assert.ok(spawn,'named map entry');
  assert.ok(!destination.obstacles.some(o=>Math.abs(spawn.x-o.x)<o.halfX+.6&&Math.abs(spawn.z-o.z)<o.halfZ+.6),'entry clears fences');
  for(const ride of site.rides){
   assert.equal(ride.previewOnly,true);
   const car=ride.cars[0],before=car.position.clone();
   for(let i=0;i<30;i++)parks.update(.05);
   assert.ok(car.position.distanceTo(before)>.01,ride.name+' moves');
  }
 }
 parks.syncClock(18000);parks.update(0);
 scene.updateMatrixWorld(true);
 scene.traverse(object=>assert.ok(object.matrixWorld.elements.every(Number.isFinite),object.name));
 assert.equal(parks.obstacles.length,parks.sites.length*4);
}
console.log('PASS: Utah, Colorado and New Mexico approved concepts, travel scopes, local night enclosure, clear entries and finite moving previews.');

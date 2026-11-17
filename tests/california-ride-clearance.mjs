import assert from 'node:assert/strict';
import * as T from '../public/vendor/three.module.js';
import {buildRegionalRideParks} from '../public/paintfall-regional-ride-parks.js';
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){}})})};
const parks=buildRegionalRideParks(T,{group:new T.Group(),destination:{id:'state:California'}});
assert.equal(parks.sites[0].rides.find(ride=>ride.key==='hub-roundabout').cars.length,1);
const unit=[new T.Vector3(1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,0,1)];
const half=[.85,.325,1.4];
function gap(a,b){
 const axesA=unit.map(v=>v.clone().applyQuaternion(a.quaternion));
 const axesB=unit.map(v=>v.clone().applyQuaternion(b.quaternion));
 const center=car=>new T.Vector3(0,.45,0).applyQuaternion(car.quaternion).add(car.position);
 const delta=center(b).sub(center(a));
 const axes=[...axesA,...axesB,...axesA.flatMap(x=>axesB.map(y=>x.clone().cross(y)))];
 return Math.max(...axes.filter(v=>v.lengthSq()>1e-12).map(v=>{
  v.normalize();
  const radius=basis=>basis.reduce((sum,axis,i)=>sum+half[i]*Math.abs(v.dot(axis)),0);
  return Math.abs(delta.dot(v))-radius(axesA)-radius(axesB);
 }));
}
const minimum=new Map();
for(let frame=0;frame<1200;frame++){
 parks.update(.05);
 for(const site of parks.sites)for(const ride of site.rides){
  for(let i=0;i<ride.cars.length;i++)for(let j=i+1;j<ride.cars.length;j++){
   minimum.set(ride.key,Math.min(minimum.get(ride.key)??Infinity,gap(ride.cars[i],ride.cars[j])));
  }
 }
}
console.log(Object.fromEntries(minimum));
for(const [key,value]of minimum)assert.ok(value>0,key+' car-body overlap');
console.log('PASS: California train body boxes remain separate on sampled local routes.');

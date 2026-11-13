import assert from 'node:assert/strict';
import * as T from '../public/vendor/three.module.js';
import '../public/paintfall-tower-ride.js';
import {createTowerCamera} from '../public/paintfall-tower-camera.js';

const route=globalThis.PaintfallTowerRide;
const track=route.createTrack(T);
const camera=createTowerCamera(T);
const half=[.825,.325,1.3];
const unit=[new T.Vector3(1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,0,1)];
function body(pose) {
 return {center:new T.Vector3(0,.45,0).applyQuaternion(pose.quaternion).add(pose.position),
  axes:unit.map(axis=>axis.clone().applyQuaternion(pose.quaternion))};
}
function separation(a,b) {
 const axes=[...a.axes,...b.axes,...a.axes.flatMap(x=>b.axes.map(y=>x.clone().cross(y)))];
 const delta=b.center.clone().sub(a.center);
 return Math.max(...axes.filter(axis=>axis.lengthSq()>1e-12).map(axis=>{
  axis.normalize();
  const radius=box=>box.axes.reduce((sum,basis,i)=>sum+Math.abs(axis.dot(basis))*half[i],0);
  return Math.abs(delta.dot(axis))-radius(a)-radius(b);
 }));
}
let minGap=Infinity;
for(let ms=0;ms<=3*route.CYCLE_MS;ms+=50){
 track.update(ms/1000);
 const bodies=[0,1,2].map(i=>body(track.carPose(ms,i)));
 for(let a=0;a<bodies.length;a++)for(let b=a+1;b<bodies.length;b++){
  minGap=Math.min(minGap,separation(bodies[a],bodies[b]));
 }
}
assert.ok(minGap>0,`car bodies intersect: minimum separating gap ${minGap}`);
const pivot=new T.Object3D();
pivot.position.set(5,0,-10);
pivot.rotation.y=.4;
pivot.updateMatrixWorld();
const quaternion=pivot.quaternion.clone();
const position=pivot.localToWorld(new T.Vector3(0,10,4));
const input={position,quaternion,height:1.8,eyeHeight:1.6,renderHeight:1.8,yaw:-1.15,pitch:0};
const free=camera({...input,mode:'third'});
const blocked=camera({...input,mode:'third',towers:[{pivot}]});
assert.ok(pivot.worldToLocal(free.eye.clone()).z<2.5);
assert.ok(pivot.worldToLocal(blocked.eye.clone()).z>2.95);
assert.ok(blocked.eye.distanceTo(blocked.target)<free.eye.distanceTo(free.target));
const first=camera({...input,yaw:0,mode:'first'});
assert.ok(first.target.clone().sub(first.eye).normalize().distanceTo(unit[2].clone().applyQuaternion(quaternion))<1e-9);
const low=camera({...input,position:new T.Vector3(0,1,0),pitch:-1,mode:'third'});
assert.ok(low.eye.y>=.72-1e-9);
console.log(`PASS: car-body clearance across three cycles (minimum sampled gap ${minGap.toFixed(3)}), tower occlusion, forward view and ground clearance.`);

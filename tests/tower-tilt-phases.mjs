import assert from 'node:assert/strict';
import * as T from '../public/vendor/three.module.js';
import '../public/paintfall-tower-ride.js';
import serverRide from '../paintfall-coaster-ride.cjs';
import movement from '../public/paintfall-movement-sync.js';

const api=globalThis.PaintfallTowerRide,model=api.createTrack(T),fresh=api.createTrack(T);
const atQ=(q,cycle=0)=>cycle*40+10+30*api.arcFraction(model.reference,q);
const sample=t=>{model.update(t);return [model.motion.side,model.motion.pitch];};
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} differs from ${b}`);
for(const cycle of [0,1,2]){
 for(const q of [1/19,3/19,7/19,7.5/19,8/19,10/19,11/19,16/19]){
  const angles=sample(atQ(q,cycle));near(angles[0],0);near(angles[1],0);
 }
 const climb=sample(atQ(5/19,cycle));assert.ok(Math.abs(climb[0])>.005);near(climb[1],0);
 near(sample(atQ(8.5/19,cycle))[1],.04);near(sample(atQ(9.5/19,cycle))[1],-.04);
 for(const q of [8.25/19,8.5/19,9/19,9.5/19,9.75/19])near(sample(atQ(q,cycle))[0],0);
}

// One-sided time derivatives test the joins, including the two pitch lobes.
let velocityMismatch=0,accelerationMismatch=0;
for(const cycle of [0,1,2])for(const j of [3,4,6,7,8,9,10]){
 const t=atQ(j/19,cycle),h=.0001,fm2=sample(t-2*h),fm=sample(t-h),f=sample(t),fp=sample(t+h),fp2=sample(t+2*h);
 for(let axis=0;axis<2;axis++){
  velocityMismatch=Math.max(velocityMismatch,Math.abs((f[axis]-fm[axis])/h-(fp[axis]-f[axis])/h));
  accelerationMismatch=Math.max(accelerationMismatch,Math.abs((f[axis]-2*fm[axis]+fm2[axis])/(h*h)-(fp2[axis]-2*fp[axis]+f[axis])/(h*h)));
 }
 for(let car=0;car<3;car++){
  model.update(t-h);const before=model.carPose((t-h)*1000,car);
  model.update(t+h);const after=model.carPose((t+h)*1000,car);
  assert.ok(before.position.distanceTo(after.position)<.02,'no car position snap at a phase boundary');
  assert.ok(before.quaternion.angleTo(after.quaternion)<.002,'no car orientation snap at a phase boundary');
 }
}
assert.ok(velocityMismatch<.0005,`angular velocity join error ${velocityMismatch}`);
assert.ok(accelerationMismatch<.02,`angular acceleration join error ${accelerationMismatch}`);

// Check the material-route anchor and server passenger pose, independently of
// previous frame order. Both towers use Rx(pitch) Rz(side), with Y rotation zero.
const room={started:true,parkEpoch:0},rider={alive:true,arenaRegion:'state:Nevada',coasterRide:{seat:0,cycle:0}};
for(const t of [25,18,24,22,23,19,25.25]){
 model.update(t);fresh.update(t);const pose=model.carPose(t*1000,0),q=model.motion.q;
 assert.ok(pose.position.distanceTo(model.curve.getPoint(q))<1e-8,'lead car reaches the landmark used for tilt');
 assert.ok(model.curve.getPoint(0).distanceTo(model.curve.getPoint(1))<1e-9,'the moving spline stays closed');
 model.curve.points.forEach((p,j)=>assert.ok(model.curve.getPoint(j/19).distanceTo(p)<1e-8,'the spline passes through each moving anchor'));
 for(let k=1;k<128;k++)assert.ok(model.orientation(k/128-1e-8,new T.Quaternion()).angleTo(model.orientation(k/128+1e-8,new T.Quaternion()))<1e-4,'frame interpolation must not snap');
 for(let i=0;i<2;i++){
  const rotation=model.towerRotations[i],expected=new T.Matrix4().makeRotationX(model.motion.pitch).multiply(new T.Matrix4().makeRotationZ(model.motion.side*(i?1:-1))).setPosition(i?6:-6,0,-2);
  const actual=new T.Matrix4().makeRotationFromEuler(rotation).setPosition(i?6:-6,0,-2);
  actual.elements.forEach((x,k)=>near(x,expected.elements[k]));
 }
 for(let seat=0;seat<6;seat++){
  rider.coasterRide={seat,cycle:0};serverRide.tick(rider,room,t*1000);
  const server=movement.toWorld(rider),client=model.seat(t*1000,seat),other=fresh.seat(t*1000,seat);
  near(server.x,client.position.x);near(server.z,client.position.z);near(rider.z/40,client.position.y);
  assert.ok(other.position.distanceTo(client.position)<1e-10,'sampling order cannot change multiplayer positions');
 }
}
console.log(`PASS: position-based tilt sequence, both pitch directions, Rx Rz order, six server/client seats, deterministic sampling and continuous joins (velocity error ${velocityMismatch.toExponential(2)}, acceleration error ${accelerationMismatch.toExponential(2)}).`);

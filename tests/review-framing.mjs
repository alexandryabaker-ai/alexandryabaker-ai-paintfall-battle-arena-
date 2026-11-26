import assert from 'node:assert/strict';
import * as T from '../public/vendor/three.module.js';
import {fitReviewBounds,rideReviewBounds} from '../public/paintfall-review-framing.js';

// Check actual projected corners: a tall coaster and a wide park must fit on
// portrait and landscape screens without cutting off the highest sections.
for(const aspect of [.45,1,2.2])for(const overhead of [false,true]){
 const bounds=new T.Box3(new T.Vector3(-60,0,-40),new T.Vector3(90,80,65));
 const {center,distance}=fitReviewBounds(T,bounds,aspect,overhead);
 const camera=new T.PerspectiveCamera(T.MathUtils.radToDeg(Math.PI*.32),aspect,.1,4000);
 camera.position.copy(center).add(overhead?new T.Vector3(0,distance*1.05,.01):new T.Vector3(Math.sin(.7)*distance,.48*distance,Math.cos(.7)*distance));
 camera.lookAt(center);camera.updateMatrixWorld();
 for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
  const p=new T.Vector3(x,y,z).project(camera);
  assert.ok(Math.abs(p.x)<1&&Math.abs(p.y)<1&&Math.abs(p.z)<1,'all geometry inside view');
 }
 assert.equal(center.y,40,'preserve height rather than aim at ground');
}
const parent=new T.Group();parent.position.set(40,2,-20);parent.scale.setScalar(.47);
const car=new T.Group();parent.add(car);
const path=new T.CatmullRomCurve3([new T.Vector3(-20,3,0),new T.Vector3(0,35,-15),new T.Vector3(25,5,20)]);
const bounds=rideReviewBounds(T,{path,cars:[car]});
for(let i=0;i<=500;i++)assert.ok(bounds.containsPoint(parent.localToWorld(path.getPointAt(i/500))),'scaled and translated route fits');
console.log('PASS: tall tracks framed on portrait/landscape screens; stationary world-space track bounds include parent scale and height.');

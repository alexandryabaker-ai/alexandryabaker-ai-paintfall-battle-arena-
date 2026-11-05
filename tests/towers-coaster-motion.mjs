import assert from 'node:assert/strict';import * as T from '../public/vendor/three.module.js';import {buildNevadaArenaParks} from '../public/paintfall-arena-nevada-parks.js';
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>new Proxy({},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)})})};
const scene=new T.Scene(),parks=buildNevadaArenaParks(T,{group:scene,destination:{id:'state:Nevada'}}),track=parks.towerTrack,geometry=track.rails.map(r=>r.mesh.geometry),vertex=new T.Vector3(),samples=[],initial=track.curve.points.map(p=>p.clone());
let maxTilt=0,nearFacade=0,downFacade=0;const collisions=[];
for(let frame=0;frame<1600;frame++){
 parks.update(.05);scene.updateMatrixWorld(true);maxTilt=Math.max(maxTilt,Math.abs(track.towers[0].pivot.rotation.z));
 assert.ok(Math.abs(track.towers[0].pivot.rotation.z+track.towers[1].pivot.rotation.z)<1e-9,'opposite tower tilts');
 for(let i=0;i<track.anchors.length;i++){const a=track.anchors[i];if(a.tower===undefined)continue;const expected=a.point.clone().applyMatrix4(track.towers[a.tower].pivot.matrix);assert.ok(expected.distanceTo(track.curve.points[i])<1e-8,'façade anchors follow the moving tower');}
 for(const r of track.rails){const p=r.mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){assert.ok(Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i)));assert.ok(Math.abs(p.getX(i))<42&&Math.abs(p.getZ(i))<27,'moving track stays behind visitor barriers');}}
 for(const car of parks.trains[0].cars){const center=car.getWorldPosition(new T.Vector3());for(const tower of track.towers){const local=tower.pivot.worldToLocal(center.clone());if(local.y>8&&local.y<24&&Math.abs(local.x)<1&&Math.abs(local.z)>3.7&&Math.abs(local.z)<4.7){nearFacade++;const forward=new T.Vector3(0,0,1).applyQuaternion(car.getWorldQuaternion(new T.Quaternion()));if(forward.y<-.7)downFacade++;}
  car.traverse(mesh=>{if(!mesh.isMesh)return;const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){vertex.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);tower.pivot.worldToLocal(vertex);if(Math.abs(vertex.x)<2.5&&vertex.y>.1&&vertex.y<28&&Math.abs(vertex.z)<2.5){if(collisions.length<5)collisions.push({frame,part:mesh.name,point:vertex.toArray()});}}});}}
 if(frame%200===0)samples.push({frame,tilt:track.towers[0].pivot.rotation.z});
}
assert.ok(maxTilt>.075,'clearly moving tower motion');assert.ok(track.curve.points.some((p,i)=>p.distanceTo(initial[i])>.2),'track deforms with the buildings');assert.ok(nearFacade>100&&downFacade>30,'train actually scales and descends the tower sides');assert.deepEqual(collisions,[],'empty test cars clear both tower bodies');track.rails.forEach((r,i)=>assert.equal(r.mesh.geometry,geometry[i],'no per-frame geometry replacement'));assert.equal(parks.group.userData.boardingEnabled,false);
console.log('PASS: opposite tower motion, tower-local climb/descent, aligned moving rails and cars, tower-body clearance, fixed test envelope and reused geometry.');

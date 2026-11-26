import assert from 'node:assert/strict';
import * as T from '../public/vendor/three.module.js';
import {createParkBuildHelpers} from '../public/paintfall-park-build-helpers.js';
import {buildNewMexicoHub} from '../public/paintfall-new-mexico-hub.js';
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){}})})};
const scene=new T.Scene(),helpers=createParkBuildHelpers(T,[]);
const {hub}=buildNewMexicoHub(T,{scene,sites:{},...helpers});
const ride=hub.rides[0],car=ride.cars[0];
assert.equal(ride.path.closed,true,'themed route is a complete circuit');
assert.equal(ride.returnRoute,null);assert.equal(ride.connectionTarget,null);
assert.ok(ride.path.getPointAt(0).distanceTo(ride.path.getPointAt(1))<1e-9);
assert.ok(ride.connectionPath.getPointAt(0).distanceTo(ride.path.getPointAt(1))<1e-9,'switch paths meet');
assert.ok(ride.connectionPath.getTangentAt(0).dot(ride.path.getTangentAt(1))>.999,'switch has matching departure direction');
const dunes=[];ride.parent.traverse(o=>{if(o.name.startsWith('White Glow dune '))dunes.push(o);});
let minY=Infinity,maxY=-Infinity,turnLeft=false,turnRight=false,last=null;
for(let i=0;i<=500;i++){
 const u=i/500,p=ride.path.getPointAt(u),t=ride.path.getTangentAt(u);
 minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
 if(last){const cross=last.x*t.z-last.z*t.x;turnLeft ||= cross<-.001;turnRight ||= cross>.001;}last=t;
 for(const dune of dunes){
  const r=dune.geometry.parameters.radius,dx=(p.x-dune.position.x)/(r*dune.scale.x),dz=(p.z-dune.position.z)/(r*dune.scale.z),radial=dx*dx+dz*dz;
  if(radial<1){const surface=dune.position.y+r*dune.scale.y*Math.sqrt(1-radial);assert.ok(p.y>surface+.5,'track clears white dunes');}
 }
}
assert.ok(maxY-minY>6,'rising dune crests');assert.ok(turnLeft&&turnRight,'sweeping turns in both directions');
hub.update(27.99);assert.equal(ride.completedCircuits,0);assert.equal(ride.boundaryOpen,false);assert.equal(ride.activePreviewPath,ride.path);
hub.update(28);const junction=car.position.clone();assert.equal(ride.completedCircuits,1);assert.equal(ride.boundaryOpen,false);
hub.update(29);assert.equal(ride.boundaryOpen,false);assert.ok(ride.switchPosition>0&&ride.switchPosition<1);assert.ok(car.position.equals(junction),'hold while switch opens');
hub.update(30);assert.equal(ride.boundaryOpen,true);assert.equal(ride.activePreviewPath,ride.connectionPath);assert.ok(car.position.distanceTo(junction)<1e-9,'no position jump onto connection');
hub.update(36);assert.equal(ride.completedCircuits,1);assert.ok(ride.previewProgress>0&&ride.previewProgress<1);
hub.update(42);const end=car.position.clone();assert.equal(ride.previewProgress,1);
hub.update(500);assert.ok(car.position.equals(end),'connection stops without inventing destination or return');
ride.replayPreview();hub.update(501);assert.ok(car.position.distanceTo(ride.path.getPointAt(0))<1e-9);
assert.equal(ride.boundaryOpen,false);assert.equal(ride.completedCircuits,0);
hub.update(515);assert.equal(ride.previewProgress,.5);assert.ok(car.position.distanceTo(end)>10);
hub.update(543);assert.equal(ride.previewProgress,1);assert.equal(ride.completedCircuits,1);
console.log('PASS: one winding circuit, dune clearance, boundary interlock, smooth switch junction, shared-track departure and replay; destination and return remain unassigned.');

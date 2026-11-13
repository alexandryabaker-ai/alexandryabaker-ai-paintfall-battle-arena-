import {buildArizonaHub} from './paintfall-arizona-hub.js';
import {buildArizonaRacing} from './paintfall-arizona-racing.js';
import {buildCaliforniaHub} from './paintfall-california-hub.js';
import {buildCaliforniaRacing} from './paintfall-california-racing.js';
import {createParkBuildHelpers} from './paintfall-park-build-helpers.js';

export function buildRegionalRideParks(T,{group,destination}) {
 const arizona=destination.id==='state:Arizona';
 if(!arizona&&destination.id!=='state:California')return null;
 const motions=[],sites={},helpers=createParkBuildHelpers(T,motions);
 const options={scene:group,sites,...helpers};
 const hub=arizona?buildArizonaHub(T,options):buildCaliforniaHub(T,options);
 const split=motions.length;
 const racing=arizona?buildArizonaRacing(T,options):buildCaliforniaRacing(T,options);
 const sitesList=[],obstacles=[];
 for(const [id,park,x,rides] of [
  ['hub',hub,-95,arizona?motions.slice(0,split):hub.rides],
  ['racing',racing,95,arizona?motions.slice(split):racing.rides],
 ]) {
  const model=park.site.group;
  model.position.set(x,.045,-145);
  model.scale.setScalar(arizona?.75:.47);
  const plaza=new T.Group();
  plaza.position.set(x,.02,-65);
  group.add(plaza);
  helpers.box(plaza,0,.02,0,44,.04,14,helpers.mats.path);
  helpers.label(plaza,park.site.title,0,5,0);
  const fenceZ=-70;
  for(const [ox,oz,hx,hz] of [[x,fenceZ,77,.25],[x,-220,77,.25],[x-77,-145,.25,75],[x+77,-145,.25,75]]) {
   obstacles.push({x:ox,z:oz,halfX:hx,halfZ:hz});
   helpers.box(group,ox,.6,oz,hx*2,1.2,hz*2,helpers.mats.purple);
  }
  sitesList.push({id,title:park.site.title,group:model,entrance:{x,z:-61},rides:rides.filter(r=>r.cars.length>1)});
 }
 let elapsed=0;
 function update(dt) {
  elapsed+=Math.max(0,Math.min(.05,Number(dt)||0));
  if(!arizona){hub.update(elapsed);racing.update(elapsed);return;}
  for(const ride of motions) {
   const spacing=Math.min(.18,4.4/ride.path.getLength());
   for(const [index,car] of ride.cars.entries()) {
    const u=((elapsed*ride.speed-index*spacing)%1+1)%1;
    car.position.copy(ride.path.getPointAt(u));
    car.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),ride.path.getTangentAt(u));
   }
  }
 }
 update(0);
 return {sites:sitesList,obstacles,bound:230,update,syncClock(){},setInspectionMode(){}};
}

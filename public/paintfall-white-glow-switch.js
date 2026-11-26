// Creator sequence: one themed circuit, then open the boundary and select
// the interconnected track. Timing and switch geometry are review proposals.
// This local preview supplies no destination, return route or gameplay solver.
export function addWhiteGlowSwitch(T,ride,{rail,box,cylinder,mats}){
 const parent=ride.parent;
 const points=[[-28,3,25],[-25,3,19],[-20,3,17],[-10,3,24],[1,3,34],[12,3,41],[28,3,43],[43,3,43]];
 const branch=rail(parent,points,mats.gold,false,true).curve;
 const gatePoint=branch.getPointAt(.25),direction=branch.getTangentAt(.25);
 const side=new T.Vector3(-direction.z,0,direction.x).normalize();
 const gate=new T.Group();gate.name='White Glow shared-track boundary';
 gate.position.copy(gatePoint).addScaledVector(side,-2.5);gate.position.y+=1.4;parent.add(gate);
 const closedAngle=-Math.atan2(side.z,side.x);gate.rotation.y=closedAngle;
 box(gate,2.5,0,0,5,.35,.35,mats.pink);
 cylinder(parent,gate.position.x,gatePoint.y+.7,gate.position.z,.2,1.4,mats.dark);
 // Visible movable switch blades at the junction, separate from the boundary arm.
 const blades=new T.Group();blades.name='White Glow track switch';
 blades.position.copy(ride.path.getPointAt(0));blades.rotation.y=Math.atan2(3,-6);parent.add(blades);
 for(const x of [-.55,.55])box(blades,x,.12,1.4,.12,.18,2.8,mats.gold);
 Object.assign(ride,{sectionOnly:false,reviewPaths:[ride.path,branch],connectionPath:branch,
  previewSequence:{circuitSeconds:28,openingSeconds:2,connectionSeconds:12},
  previewNote:'One themed circuit, then the boundary opens and the switch selects the shared-track connection. Destination and individual return route still to design.'});
 const ease=t=>t*t*(3-2*t);
 ride.updatePreview=age=>{
  const {circuitSeconds,openingSeconds,connectionSeconds}=ride.previewSequence;
  age=Math.max(0,age);let path=ride.path,u=0,opening=0;
  ride.completedCircuits=age>=circuitSeconds?1:0;
  if(age<circuitSeconds){
   u=ease(age/circuitSeconds);ride.previewStatus='Themed circuit — boundary closed';
  }else if(age<circuitSeconds+openingSeconds){
   opening=ease((age-circuitSeconds)/openingSeconds);ride.previewStatus='Opening boundary and setting switch';
  }else{
   opening=1;path=branch;u=ease(Math.min(1,(age-circuitSeconds-openingSeconds)/connectionSeconds));
   ride.previewStatus=u<1?'Following shared-track connection':'Connection endpoint — destination and return pending';
  }
  ride.boundaryOpen=opening===1;ride.switchPosition=opening;
  gate.rotation.y=closedAngle+opening*Math.PI/2;
  blades.rotation.y=Math.atan2(3,-6)+opening*.16;
  ride.previewProgress=u;ride.activePreviewPath=path;
  ride.cars[0].position.copy(path.getPointAt(u));
  ride.cars[0].quaternion.setFromUnitVectors(new T.Vector3(0,0,1),path.getTangentAt(u));
 };
 ride.boundary=gate;ride.switchBlades=blades;
}

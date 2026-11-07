// Shared route mathematics and timing. THREE is supplied by the existing world
// (or its same vendored math module on the server); this creates no renderer.
(function(root,factory){const api=factory();root.PaintfallTowerRide=api;if(typeof module==='object'&&module.exports)module.exports=api;})(globalThis,()=>{
 const DWELL_MS=10000,TRAVEL_MS=30000,CYCLE_MS=DWELL_MS+TRAVEL_MS,SEATS=6,ROWS=[.6,-.55],PLATFORM={x:-22,z:-94},EXIT={x:-25,z:-92};
 const anchors=[[-22,2.5,18],[-23,3,6],[-18,3,-10],...[[3,-7],[8,-4.2],[18,-4.2],[26,-4.2],[30,-3.5],[32,0]].map(([y,z])=>[0,y,z,0]),[0,33,-2],...[[32,0],[30,3.5],[26,4.2],[18,4.2],[8,4.2],[3,7]].map(([y,z])=>[0,y,z,1]),[13,3,15],[1,2.5,22],[-12,2.5,21]];
 function phase(ms){ms=Math.max(0,ms);const cycle=Math.floor(ms/CYCLE_MS),age=ms-cycle*CYCLE_MS;return {cycle,boarding:age<DWELL_MS-1000,waiting:age<DWELL_MS,remaining:Math.max(0,DWELL_MS-age),u:Math.max(0,(age-DWELL_MS)/TRAVEL_MS)};}
 const CAR_SPACING=3.2,ARC_DIVISIONS=240,FRAME_SEGMENTS=128;
 // Route landmarks are anchor indices / 19, not estimates of wall-clock time.
 // The lead car defines the sequence; trailing cars retain their own spacing.
 const TILT=Object.freeze({sideAmplitude:.08,pitchAmplitude:.04,sideFrequency:.3,
  ascentStart:3/19,ascentFull:4/19,ascentReturn:6/19,ascentEnd:7/19,
  summitStart:8/19,summitEnd:10/19});
 function smooth5(x){x=Math.max(0,Math.min(1,x));return x*x*x*(10+x*(-15+6*x));}
 function bump(x){if(x<=0||x>=1)return 0;return 64*x*x*x*(1-x)*(1-x)*(1-x);}
 function tiltAt(seconds,q){
  const a=TILT;let envelope=0,pitch=0;
  if(q>a.ascentStart&&q<a.ascentEnd)envelope=q<a.ascentFull?smooth5((q-a.ascentStart)/(a.ascentFull-a.ascentStart)):q<=a.ascentReturn?1:1-smooth5((q-a.ascentReturn)/(a.ascentEnd-a.ascentReturn));
  if(q>a.summitStart&&q<a.summitEnd){const r=(q-a.summitStart)/(a.summitEnd-a.summitStart);pitch=a.pitchAmplitude*(r<=.5?bump(2*r):-bump(2*r-1));}
  return {side:a.sideAmplitude*Math.sin(seconds*a.sideFrequency)*envelope,pitch};
 }
 function arcFraction(curve,q){const lengths=curve.getLengths(),n=lengths.length-1,f=Math.max(0,Math.min(1,q))*n,i=Math.min(n-1,Math.floor(f));return (lengths[i]+(lengths[i+1]-lengths[i])*(f-i))/lengths[n];}
 function createTrack(T){
  const descriptors=anchors.map(([x,y,z,tower])=>({point:new T.Vector3(x,y,z),tower}));
  const curve=new T.CatmullRomCurve3(descriptors.map(a=>a.point.clone()),true,'centripetal');curve.arcLengthDivisions=ARC_DIVISIONS;
  // Freeze an upright reference only for timing along the material route. This
  // prevents moving towers from shifting the landmarks that trigger their tilt.
  const reference=curve.clone();reference.arcLengthDivisions=ARC_DIVISIONS;
  // At rest, tower-local anchors still need their fixed base translations.
  descriptors.forEach((a,i)=>{if(a.tower!==undefined)reference.points[i].add(new T.Vector3(a.tower?6:-6,0,-2));});reference.updateArcLengths();
  const matrices=[new T.Matrix4(),new T.Matrix4()],towerRotations=[new T.Euler(),new T.Euler()],up=new T.Vector3(0,1,0),basis=new T.Matrix4(),right=new T.Vector3(),nextQuaternion=new T.Quaternion();let frames,motion;
  function routeParameter(ms){return reference.getUtoTmapping(phase(ms).u);}
  function update(seconds){
   const q=routeParameter(seconds*1000);motion={q,...tiltAt(seconds,q)};
   for(let i=0;i<2;i++){towerRotations[i].set(motion.pitch,0,motion.side*(i?1:-1),'XYZ');matrices[i].makeRotationFromEuler(towerRotations[i]).setPosition(i?6:-6,0,-2);}
   descriptors.forEach((a,i)=>{curve.points[i].copy(a.point);if(a.tower!==undefined)curve.points[i].applyMatrix4(matrices[a.tower]);});curve.updateArcLengths();frames=curve.computeFrenetFrames(FRAME_SEGMENTS,true);
   const n=frames.normals[0],t=frames.tangents[0],desired=up.clone().addScaledVector(t,-up.dot(t)).normalize(),roll=Math.atan2(t.dot(n.clone().cross(desired)),n.dot(desired));
   for(let i=0;i<=FRAME_SEGMENTS;i++){frames.normals[i].applyAxisAngle(frames.tangents[i],roll);frames.binormals[i].crossVectors(frames.tangents[i],frames.normals[i]).normalize();}
  }
  function frameQuaternion(k,target){basis.makeBasis(right.copy(frames.binormals[k]).negate(),frames.normals[k],frames.tangents[k]);return target.setFromRotationMatrix(basis);}
  function orientation(u,target){const f=Math.max(0,Math.min(1,u))*FRAME_SEGMENTS,k=Math.floor(f);frameQuaternion(k,target);return k===FRAME_SEGMENTS?target:target.slerp(frameQuaternion(k+1,nextQuaternion),f-k);}
  function carPose(elapsedMs,index){const length=curve.getLength(),p=phase(elapsedMs),leadU=arcFraction(curve,routeParameter(elapsedMs)),u=((leadU-index*CAR_SPACING/length)%1+1)%1;return {position:curve.getPointAt(u),quaternion:orientation(u,new T.Quaternion()),phase:p,u};}
  function seat(elapsedMs,index){const pose=carPose(elapsedMs,Math.floor(index/2)),position=pose.position.add(new T.Vector3(0,.12,ROWS[index%2]).applyQuaternion(pose.quaternion));position.z-=125;position.y+=.025;return {...pose,position};}
  update(0);return {curve,anchors:descriptors,reference,routeParameter,towerRotations,update,orientation,carPose,seat,get frames(){return frames;},get motion(){return motion;}};
 }
 return {DWELL_MS,TRAVEL_MS,CYCLE_MS,SEATS,ROWS,PLATFORM,EXIT,CAR_SPACING,ARC_DIVISIONS,FRAME_SEGMENTS,TILT,phase,smooth5,bump,tiltAt,arcFraction,createTrack};
});

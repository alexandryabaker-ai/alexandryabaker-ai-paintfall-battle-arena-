// Shared route mathematics and timing. THREE is supplied by the existing world
// (or its same vendored math module on the server); this creates no renderer.
(function(root,factory){const api=factory();root.PaintfallTowerRide=api;if(typeof module==='object'&&module.exports)module.exports=api;})(globalThis,()=>{
 const DWELL_MS=10000,TRAVEL_MS=30000,CYCLE_MS=DWELL_MS+TRAVEL_MS,SEATS=6,ROWS=[.6,-.55],PLATFORM={x:-22,z:-94},EXIT={x:-25,z:-92};
 const anchors=[[-22,2.5,18],[-23,3,6],[-18,3,-10],...[[3,-7],[8,-4.2],[18,-4.2],[26,-4.2],[30,-3.5],[32,0]].map(([y,z])=>[0,y,z,0]),[0,33,-2],...[[32,0],[30,3.5],[26,4.2],[18,4.2],[8,4.2],[3,7]].map(([y,z])=>[0,y,z,1]),[13,3,15],[1,2.5,22],[-12,2.5,21]];
 function phase(ms){ms=Math.max(0,ms);const cycle=Math.floor(ms/CYCLE_MS),age=ms-cycle*CYCLE_MS;return {cycle,boarding:age<DWELL_MS-1000,waiting:age<DWELL_MS,remaining:Math.max(0,DWELL_MS-age),u:Math.max(0,(age-DWELL_MS)/TRAVEL_MS)};}
 function createTrack(T){
  const descriptors=anchors.map(([x,y,z,tower])=>({point:new T.Vector3(x,y,z),tower})),curve=new T.CatmullRomCurve3(descriptors.map(a=>a.point.clone()),true,'centripetal');curve.arcLengthDivisions=240;
  const matrices=[new T.Matrix4(),new T.Matrix4()],up=new T.Vector3(0,1,0),basis=new T.Matrix4(),right=new T.Vector3();let frames;
  function update(seconds){for(let i=0;i<2;i++)matrices[i].makeRotationZ(Math.sin(seconds*.3)*.08*(i?1:-1)).setPosition(i?6:-6,0,-2);descriptors.forEach((a,i)=>{curve.points[i].copy(a.point);if(a.tower!==undefined)curve.points[i].applyMatrix4(matrices[a.tower]);});curve.updateArcLengths();frames=curve.computeFrenetFrames(128,true);const n=frames.normals[0],t=frames.tangents[0],desired=up.clone().addScaledVector(t,-up.dot(t)).normalize(),roll=Math.atan2(t.dot(n.clone().cross(desired)),n.dot(desired));for(let i=0;i<=128;i++){frames.normals[i].applyAxisAngle(frames.tangents[i],roll);frames.binormals[i].crossVectors(frames.tangents[i],frames.normals[i]).normalize();}}
  function orientation(u,q){const k=Math.min(128,Math.round(u*128));basis.makeBasis(right.copy(frames.binormals[k]).negate(),frames.normals[k],frames.tangents[k]);return q.setFromRotationMatrix(basis);}
  function seat(elapsedMs,index){const length=curve.getLength(),p=phase(elapsedMs),u=((p.u-Math.floor(index/2)*3.2/length)%1+1)%1,q=orientation(u,new T.Quaternion()),position=curve.getPointAt(u).add(new T.Vector3(0,.12,ROWS[index%2]).applyQuaternion(q));position.z-=125;position.y+=.025;return {position,quaternion:q,phase:p};}
  update(0);return {curve,anchors:descriptors,update,orientation,seat,get frames(){return frames;}};
 }
 return {DWELL_MS,TRAVEL_MS,CYCLE_MS,SEATS,ROWS,PLATFORM,EXIT,phase,createTrack};
});

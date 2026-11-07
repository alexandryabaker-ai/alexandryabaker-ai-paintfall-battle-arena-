// Moving geometry for PAINTFALL Towers and its shared passenger route.
// Tower-local anchors keep the climb and descent attached to the facades.
// Reuses the caller's THREE/scene; the room server owns passenger seating.
import './paintfall-tower-ride.js';
export function buildTiltingTowersTrack(T,parent){
 const root=new T.Group();root.name='PAINTFALL twin tilting towers';parent.add(root);
 const material=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.65,...extra});
 const dark=material(0x243447),gold=material(0xffce61,{metalness:.25,roughness:.4}),blue=material(0x34aeda),purple=material(0x9e69db);
 const towers=[];
 function box(p,x,y,z,w,h,d,m,name){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.name=name;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;}
 for(const side of [-1,1]){
  const pivot=new T.Group();pivot.name=(side<0?'Left':'Right')+' tilting tower';pivot.position.set(side*6,0,-2);root.add(pivot);
  box(pivot,0,14,0,5,28,5,dark,'PAINTFALL tower body');
  for(let i=0;i<6;i++)for(const z of [-2.56,2.56])box(pivot,0,4+i*4,z,4,.45,.12,i%2?purple:blue,'Tower paint-light panel');
  box(pivot,0,28.2,0,5.5,.35,5.5,purple,'Tower roof trim');
  towers.push({pivot,side});
 }
 const route=globalThis.PaintfallTowerRide.createTrack(T),anchors=route.anchors,curve=route.curve;
 const segments=128,radial=5,rails=[];
 for(const side of [-1,1]){
  const geometry=new T.TubeGeometry(curve,segments,.1,radial,true),mesh=new T.Mesh(geometry,gold);mesh.name='Tower-attached '+(side<0?'left':'right')+' rail';
  geometry.boundingSphere=new T.Sphere(new T.Vector3(0,16,0),55);geometry.boundingBox=new T.Box3(new T.Vector3(-28,0,-18),new T.Vector3(28,36,26));root.add(mesh);rails.push({mesh,side});
 }
 const ties=new T.InstancedMesh(new T.BoxGeometry(1.4,.12,.15),dark,96);ties.name='Moving tower-track ties';ties.frustumCulled=false;root.add(ties);
 const supportGeometry=new T.CylinderGeometry(.14,.14,1,8),supports=[];
 for(let i=0;i<18;i++){const mesh=new T.Mesh(supportGeometry,dark);mesh.name='Flexible tower-track support';mesh.castShadow=true;root.add(mesh);supports.push(mesh);}
 const up=new T.Vector3(0,1,0),dummy=new T.Object3D(),basis=new T.Matrix4(),p=new T.Vector3(),right=new T.Vector3(),radialNormal=new T.Vector3(),top=new T.Vector3();
 let frames,elapsed=0;
 function update(dt,absoluteSeconds){
  elapsed=Number.isFinite(absoluteSeconds)?absoluteSeconds:elapsed+Math.min(.05,Math.max(0,Number(dt)||0));
  route.update(elapsed);frames=route.frames;
  for(let i=0;i<towers.length;i++){const {pivot}=towers[i];pivot.rotation.copy(route.towerRotations[i]);pivot.updateMatrix();}
  for(let i=0;i<=segments;i++){
   curve.getPointAt(i/segments,p);const n=frames.normals[i],b=frames.binormals[i];
   for(const {mesh,side}of rails){const pos=mesh.geometry.attributes.position,norm=mesh.geometry.attributes.normal;
    for(let j=0;j<=radial;j++){const angle=j/radial*Math.PI*2,index=i*(radial+1)+j;radialNormal.copy(n).multiplyScalar(-Math.cos(angle)).addScaledVector(b,Math.sin(angle));top.copy(p).addScaledVector(b,side*.58).addScaledVector(radialNormal,.1);pos.setXYZ(index,top.x,top.y,top.z);norm.setXYZ(index,radialNormal.x,radialNormal.y,radialNormal.z);}
   }
  }
  for(const {mesh}of rails){mesh.geometry.attributes.position.needsUpdate=true;mesh.geometry.attributes.normal.needsUpdate=true;}
  for(let i=0;i<ties.count;i++){const u=i/ties.count,k=Math.round(u*segments);curve.getPointAt(u,dummy.position);basis.makeBasis(right.copy(frames.binormals[k]).negate(),frames.normals[k],frames.tangents[k]);dummy.quaternion.setFromRotationMatrix(basis);dummy.updateMatrix();ties.setMatrixAt(i,dummy.matrix);}ties.instanceMatrix.needsUpdate=true;
  for(let i=0;i<supports.length;i++){curve.getPointAt(i/supports.length,top);const support=supports[i];p.set(top.x,0,top.z);const length=p.distanceTo(top);support.position.copy(p).lerp(top,.5);support.scale.set(1,length,1);support.quaternion.setFromUnitVectors(up,top.clone().sub(p).normalize());}
 }
 function orientation(u,target){return route.orientation(u,target);}
 update(0);root.userData={movingTowers:true,trackFollowsTowers:true,route:'up-left-across-rooftops-down-right',boardingEnabled:true};
 return {group:root,towers,curve,anchors,rails,ties,update,orientation,carPose:(ms,index)=>route.carPose(ms,index),seat:(ms,index)=>route.seat(ms,index),get elapsed(){return elapsed;},get motion(){return route.motion;}};
}

// Shared by the arena and the rider preview. Tower bounds are in pivot space.
export function createTowerCamera(T) {
 const bounds=new T.Box3(new T.Vector3(-2.95,-.2,-2.95),new T.Vector3(2.95,28.575,2.95));
 const inverse=new T.Matrix4(),ray=new T.Ray(),localEye=new T.Vector3(),hit=new T.Vector3();
 const direction=new T.Vector3(),origin=new T.Vector3();

 function clearEye(eye,target,towers) {
  direction.subVectors(eye,target);
  const distance=direction.length();
  if(!distance)return eye;
  let allowed=distance;
  for(const {pivot} of towers) {
   pivot.updateWorldMatrix(true,false);
   inverse.copy(pivot.matrixWorld).invert();
   origin.copy(target).applyMatrix4(inverse);
   localEye.copy(eye).applyMatrix4(inverse);
   if(bounds.containsPoint(origin))continue;
   ray.origin.copy(origin);
   ray.direction.subVectors(localEye,origin).normalize();
   if(ray.intersectBox(bounds,hit)) {
    const fraction=origin.distanceTo(hit)/origin.distanceTo(localEye);
    if(fraction<=1)allowed=Math.min(allowed,Math.max(.05,fraction*distance-.1));
   }
  }
  if(direction.y<0&&target.y>.72)allowed=Math.min(allowed,(target.y-.72)*distance/-direction.y);
  return eye.copy(target).addScaledVector(direction,allowed/distance);
 }

 function pose({position,quaternion,height,eyeHeight,renderHeight,mode,yaw=0,pitch=0,towers=[]}) {
  const up=new T.Vector3(0,1,0).applyQuaternion(quaternion);
  const cp=Math.cos(pitch),sp=Math.sin(pitch);
  if(mode==='first') {
   const eye=position.clone().addScaledVector(up,eyeHeight);
   eye.y=Math.max(.72,eye.y);
   const forward=new T.Vector3(-Math.sin(yaw)*cp,sp,Math.cos(yaw)*cp).applyQuaternion(quaternion);
   return {eye,target:eye.clone().addScaledVector(forward,10),up};
  }
  const target=position.clone().addScaledVector(up,height*.55);
  const distance=Math.max(4.5,renderHeight*2.6);
  const angle=yaw+1.15;
  const eye=new T.Vector3(Math.sin(angle)*cp*distance,.4+sp*distance,-Math.cos(angle)*cp*distance)
   .applyQuaternion(quaternion).add(target);
  return {eye:clearEye(eye,target,towers),target,up};
 }
 return pose;
}

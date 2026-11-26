// Fit the full 3D bounds to both viewport dimensions, including narrow screens.
export function fitReviewBounds(T,bounds,aspect,overhead=false){
 const center=bounds.isEmpty()?new T.Vector3(0,1,0):bounds.getCenter(new T.Vector3());
 const radius=bounds.isEmpty()?10:Math.max(1,bounds.getBoundingSphere(new T.Sphere()).radius);
 const halfVertical=Math.PI*.32/2;
 const halfHorizontal=Math.atan(Math.tan(halfVertical)*Math.max(.1,aspect));
 const eyeDistance=radius/Math.sin(Math.min(halfVertical,halfHorizontal))*1.12;
 return {center,distance:eyeDistance/(overhead?1.05:Math.hypot(1,.48))};
}

export function rideReviewBounds(T,ride){
 const bounds=new T.Box3(),path=ride.path??ride.curve,parent=ride.cars[0].parent;
 parent.updateWorldMatrix(true,false);
 for(let i=0;i<=160;i++)bounds.expandByPoint(parent.localToWorld(path.getPointAt(i/160)));
 return bounds.expandByScalar(2);
}

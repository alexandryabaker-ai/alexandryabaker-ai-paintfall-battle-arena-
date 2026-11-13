export function createParkBuildHelpers(T,motions) {
const mats={sand:new T.MeshStandardMaterial({color:0xbc976d,roughness:1}),rock:new T.MeshStandardMaterial({color:0xa86f55,roughness:1}),cream:new T.MeshStandardMaterial({color:0xd8bb94,roughness:1}),path:new T.MeshStandardMaterial({color:0xe3ceb0}),green:new T.MeshStandardMaterial({color:0x60965c}),purple:new T.MeshStandardMaterial({color:0x9062d3}),pink:new T.MeshStandardMaterial({color:0xe575ad}),blue:new T.MeshStandardMaterial({color:0x3eaec2}),gold:new T.MeshStandardMaterial({color:0xf8c969}),dark:new T.MeshStandardMaterial({color:0x263744}),glass:new T.MeshStandardMaterial({color:0x99d9e8,transparent:true,opacity:.48,roughness:.2})};
function mesh(parent,geo,mat,x,y,z){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
function box(p,x,y,z,w,h,d,mat){return mesh(p,new T.BoxGeometry(w,h,d),mat,x,y,z);}
function cylinder(p,x,y,z,r,h,mat){return mesh(p,new T.CylinderGeometry(r,r,h,24),mat,x,y,z);}
function label(parent,text,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#172d36e8';ctx.fillRect(0,0,512,96);ctx.fillStyle='#fff8df';ctx.font='600 28px system-ui';ctx.textAlign='center';ctx.fillText(text,256,59);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const s=new T.Sprite(new T.SpriteMaterial({map:tex,depthTest:false}));s.position.set(x,y,z);s.scale.set(31,5.8,1);parent.add(s);}
function rail(parent,points,mat=mats.gold,closed=false,coaster=false){
  const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),closed,'centripetal');
  const m=mesh(parent,new T.TubeGeometry(curve,160,coaster?.19:.22,6,closed),mat,0,0,0);
  if(coaster){
    const left=[],right=[],up=new T.Vector3(0,1,0),ties=new T.InstancedMesh(new T.BoxGeometry(1.5,.15,.16),mats.dark,120),dummy=new T.Object3D();
    for(let i=0;i<=160;i++){const u=i/160,p=curve.getPointAt(u),t=curve.getTangentAt(u),side=new T.Vector3().crossVectors(t,up);if(side.lengthSq()<.001)side.set(1,0,0);side.normalize().multiplyScalar(.62);left.push(p.clone().add(side));right.push(p.clone().sub(side));}
    for(const pts of [left,right])mesh(parent,new T.TubeGeometry(new T.CatmullRomCurve3(pts,closed),180,.14,5,closed),mat,0,0,0);
    for(let i=0;i<120;i++){const u=i/120;dummy.position.copy(curve.getPointAt(u));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),curve.getTangentAt(u));dummy.updateMatrix();ties.setMatrixAt(i,dummy.matrix);}parent.add(ties);
    for(let i=0;i<14;i++){const p=curve.getPointAt(i/14);if(p.y>4)cylinder(parent,p.x,p.y/2,p.z,.22,p.y,mats.dark);}
  }
  return {curve,mesh:m,coaster};
}
function train(parent,path,mat,count=3){const cars=[];for(let i=0;i<count;i++){const car=new T.Group();box(car,0,.45,0,1.7,.65,2.8,mat);for(const z of [-.6,.65]){box(car,0,1,z,1.4,.85,.32,mats.dark);box(car,0,.9,z-.2,.13,.8,.25,mats.gold);}for(const x of [-.88,.88])for(const z of [-.8,.8]){const w=mesh(car,new T.CylinderGeometry(.28,.28,.15,10),mats.dark,x,0,z);w.rotation.z=Math.PI/2;}parent.add(car);cars.push(car);}return {path:path.curve,cars,parent,speed:path.coaster?.038:.025,progress:0,mode:'cruise',remaining:4,currentSpeed:.025,eventCount:0,spin:0};}

function skyRide(parent,name,points,mat){
  const path=rail(parent,points,mat,true,true);
  const ride=train(parent,path,mat,3);ride.name=name;ride.sky=true;ride.progress=0;ride.speed=.014;ride.currentSpeed=.014;
  motions.push(ride);
  const departure=points[0],arrival=points[points.length-2];
  box(parent,arrival[0],arrival[1]-.8,arrival[2],9,.6,7,mats.purple);
  label(parent,'Sky arrival',arrival[0],arrival[1]+5,arrival[2]);
  return ride;
}
return {mats,mesh,box,cylinder,label,rail,train,skyRide,motions};
}

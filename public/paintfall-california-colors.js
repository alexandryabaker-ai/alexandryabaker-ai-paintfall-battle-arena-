// Distinct California ride palettes. Scenery materials remain independent.
export const californiaRideColors={
 mystery:0x7544b8,castle:0xc64b30,art:0x247a96,spring:0xf06c9b,
 'garden-trees':0x337755,'garden-greenhouse':0xcf4c8c,'garden-desert':0xdd8d25,'garden-canopy':0x5356ad,
 'hub-wild':0x735146,'hub-burst-ground':0xf15d32,'hub-burst-sky':0xf15d32,'hub-tree':0x8cbd39,'hub-demonym':0x3970d1,'hub-roundabout':0xb62b55,
 'racing-blue':0x00a4d6,'racing-pink':0xe53d6e,'racing-gold':0xffc422,'racing-sky':0x7337a8,
 'paint-cliff-ground':0x00b49c,'paint-cliff-sky':0xff7851,'paint-center-sky':0x8b40ce
};
export function rideMaterial(T,key,fallback){const color=californiaRideColors[key];return color===undefined?fallback:new T.MeshStandardMaterial({color,roughness:.58});}

// Small irregular paint marks on the track ties, moving with a detachable section.
export function addPaintTrackSplatters(T,parent,path,count=30){
 const colors=[0xff4e91,0xffcf35,0x42d5ed,0x9a53f0,0xf7faf1];
 const marks=new T.Group();marks.name='Decorative track paint splatters';parent.add(marks);
 for(let i=0;i<count;i++){
  const shape=new T.Shape(),n=18;
  for(let j=0;j<=n;j++){const a=j/n*Math.PI*2,r=.55+Math.sin(j*2.7+i)*.16+Math.cos(j*4.1+i)*.1,x=Math.cos(a)*r,y=Math.sin(a)*r*.8;if(j===0)shape.moveTo(x,y);else shape.lineTo(x,y);}
  const material=new T.MeshStandardMaterial({color:colors[i%colors.length],roughness:.75,side:T.DoubleSide});
  const patch=new T.Group();patch.name='Paint splatter on track tie';const u=(i+.4)/count;patch.position.copy(path.getPointAt(u));patch.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),path.getTangentAt(u));marks.add(patch);
  const blob=new T.Mesh(new T.ShapeGeometry(shape),material);blob.rotation.x=-Math.PI/2;blob.position.y=.115;patch.add(blob);
  for(let k=0;k<3;k++){const a=i+k*2.1,dot=new T.Mesh(new T.CircleGeometry(.07+k*.025,7),material);dot.rotation.x=-Math.PI/2;dot.position.set(Math.cos(a)*.68,.116,Math.sin(a)*.43);patch.add(dot);}
 }
 return marks;
}


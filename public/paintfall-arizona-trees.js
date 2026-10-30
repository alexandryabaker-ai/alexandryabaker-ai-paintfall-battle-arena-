// Selected blue palo verde study: airy branching and small paired leaflets.
// The caller owns placement and supplies the arena's existing THREE instance.
export function buildArizonaPaloVerde(T,{group,height,variant,phase}){
 let seed=((variant+1)*2654435761+Math.floor(phase*100000))>>>0;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;},h=height,v=(x,y,z)=>new T.Vector3(x*h,y*h,z*h),segments=[],leaves=[];
 function branch(a,b,r){segments.push({a,b,r:r*h});}
 const base=v(0,-.006,0),fork=v((phase-.5)*.035,.31,0),mid=base.clone().lerp(fork,.55);mid.x+=h*.015;
 branch(base,mid,.046);branch(mid,fork,.035);
 for(let limb=0;limb<5;limb++){
  const angle=limb*Math.PI*2/5+phase*.7,reach=.36+rand()*.10,top=.73+rand()*.18;
  const bend=v(Math.cos(angle)*.16,.53+rand()*.06,Math.sin(angle)*.16),crown=v(Math.cos(angle)*reach,top,Math.sin(angle)*reach);
  branch(fork,bend,.024);branch(bend,crown,.015);
  for(let shoot=0;shoot<4;shoot++){
   const direction=angle+(shoot-1.5)*.38+(rand()-.5)*.15,start=bend.clone().lerp(crown,.45+shoot*.13),length=h*(.16+rand()*.12),tip=start.clone().add(new T.Vector3(Math.cos(direction)*length,h*(.06+rand()*.10),Math.sin(direction)*length));
   const elbow=start.clone().lerp(tip,.55);elbow.y+=h*.025;branch(start,elbow,.007);branch(elbow,tip,.004);
   for(let twig=0;twig<4;twig++){
    const origin=elbow.clone().lerp(tip,.10+twig*.27),side=twig%2?-1:1,spread=h*(.065+rand()*.025),twigEnd=origin.clone().add(new T.Vector3(Math.cos(direction+side*.9)*spread,h*(.02+rand()*.025),Math.sin(direction+side*.9)*spread));branch(origin,twigEnd,.0021);
    // Each little compound sprig has separate paired leaflets and visible gaps.
    for(let pair=0;pair<5;pair++)for(const sign of [-1,1]){
     const pos=origin.clone().lerp(twigEnd,.15+pair*.17),offset=h*.009;pos.x+=Math.cos(direction+Math.PI/2)*offset*sign;pos.z+=Math.sin(direction+Math.PI/2)*offset*sign;
     leaves.push({pos,angle:direction+sign*.4,tilt:(rand()-.5)*.7,size:h*(.009+rand()*.003)});
    }
   }
  }
 }
 const bark=new T.MeshStandardMaterial({color:0x708d78,roughness:.88}),foliage=new T.MeshStandardMaterial({color:0x8da07b,roughness:.95});
 const wood=new T.InstancedMesh(new T.CylinderGeometry(.78,1,1,9),bark,segments.length),dummy=new T.Object3D(),up=new T.Vector3(0,1,0);
 wood.name='Palo verde connected tapered branches';wood.castShadow=true;
 for(const [i,s]of segments.entries()){const d=s.b.clone().sub(s.a);dummy.position.copy(s.a).add(s.b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,d.clone().normalize());dummy.scale.set(s.r,d.length(),s.r);dummy.updateMatrix();wood.setMatrixAt(i,dummy.matrix);}wood.instanceMatrix.needsUpdate=true;group.add(wood);
 const leaflets=new T.InstancedMesh(new T.SphereGeometry(1,5,3),foliage,leaves.length);leaflets.name='Palo verde small paired leaflets';leaflets.castShadow=true;
 for(const [i,l]of leaves.entries()){dummy.position.copy(l.pos);dummy.rotation.set(l.tilt,l.angle,.15);dummy.scale.set(l.size*1.4,l.size*.18,l.size*.55);dummy.updateMatrix();leaflets.setMatrixAt(i,dummy.matrix);leaflets.setColorAt(i,new T.Color().setHSL(.27+(i%5)*.008,.08,.90+(i%3)*.025));}leaflets.instanceMatrix.needsUpdate=true;group.add(leaflets);
 group.scale.set(1.2,.8,1.2);group.name='Blue palo verde — open branching study';group.userData.treeModel='arizona-palo-verde-v2';group.userData.leafCount=leaves.length;group.userData.branchCount=segments.length;
 return group;
}

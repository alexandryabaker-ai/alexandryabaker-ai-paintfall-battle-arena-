// Romduol planting and open Cambodian garden lawns; not a replica of a sacred site.
import {createArenaSurfaceMaterial} from './paintfall-arena-surface.js';
export function buildCambodiaGarden(T,group){
 const obstacles=[],seats=[],mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.92,...extra});
 const sandstone=createArenaSurfaceMaterial(T,0xc7aa7b,'stone',3),pale=createArenaSurfaceMaterial(T,0xe1d1ab,'stone',3),darkStone=mat(0xa18b6c),leaf=mat(0x61885a),palmLeaf=mat(0x7e9b76,{side:T.DoubleSide}),trunk=mat(0x675246),petal=mat(0xf0e4ae),gold=mat(0xdac476),sphere=new T.SphereGeometry(1,8,6),dummy=new T.Object3D();
 function box(name,x,y,z,w,h,d,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.name=name;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;group.add(o);return o;}
 function block(x,z,halfX,halfZ){obstacles.push({x,z,halfX,halfZ});}
 function rod(name,points,r,m){const o=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),10,r,6,false),m);o.name=name;o.castShadow=true;group.add(o);return o;}
 box('Cambodia open garden lawn',0,.012,0,20,.025,17,createArenaSurfaceMaterial(T,0x93a96f,'grass',5));
 box('Level sandstone entrance promenade',0,.045,-1.4,3.2,.04,14.4,pale);box('Cross-garden sandstone promenade',0,.045,5.35,16,.04,2,pale);
 for(let i=0;i<17;i++)for(const x of [-1.45,1.45])box('Alternating warm stone path border',x,.075,-8+i*.82,.18,.045,.65,i%2?sandstone:darkStone);
 // A low six-petal paving rosette uses a garden-flower motif, not copied temple carvings.
 const center=new T.Mesh(new T.CircleGeometry(.45,24),sandstone);center.name='Garden paving rosette center';center.rotation.x=-Math.PI/2;center.position.set(0,.077,2.6);group.add(center);
 for(let i=0;i<6;i++){const a=i*Math.PI/3,p=new T.Mesh(sphere,darkStone);p.name='Six-petal paving rosette';p.scale.set(.17,.018,.46);p.position.set(Math.sin(a)*.46,.08,2.6+Math.cos(a)*.46);p.rotation.y=a;group.add(p);}
 // Five romduol trees with layered leaves and six waxy petals in two whorls.
 const blossoms=[];
 for(const [cx,cz]of [[-6,-5.2],[-6.7,-.8],[-6,4.2],[6,-5.4],[6.7,5.5]]){
  rod('Romduol tree trunk',[[cx,0,cz],[cx+.08,1.2,cz],[cx,2.3,cz]],.115,trunk);block(cx,cz,.22,.22);
  for(let k=0;k<4;k++){const a=k*Math.PI/2;rod('Romduol branch',[[cx,1.25,cz],[cx+Math.sin(a)*.6,2.05,cz+Math.cos(a)*.6],[cx+Math.sin(a)*1.1,2.55,cz+Math.cos(a)*1.1]],.04,trunk);}
  const leaves=new T.InstancedMesh(sphere,leaf,180);leaves.name='Romduol elliptical leaves';
  for(let i=0;i<180;i++){const a=i*2.4,r=Math.sqrt((i%37)/37)*1.35;dummy.position.set(cx+Math.sin(a)*r,2.05+(i%9)*.105,cz+Math.cos(a)*r);dummy.scale.set(.18,.035,.085);dummy.rotation.set(.15,a,.1);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix);}group.add(leaves);
  for(let i=0;i<24;i++){const a=i*2.4,r=.5+(i%4)*.2;blossoms.push({x:cx+Math.sin(a)*r,y:2.15+(i%6)*.12,z:cz+Math.cos(a)*r,a});}
 }
 const flowers=new T.InstancedMesh(sphere,petal,blossoms.length*6);flowers.name='Romduol pale six-petaled flowers';
 blossoms.forEach((p,i)=>{for(let k=0;k<6;k++){const row=Math.floor(k/3),a=p.a+(k%3)*Math.PI*2/3+row*Math.PI/3;dummy.position.set(p.x+Math.sin(a)*(row?.035:.065),p.y+row*.035,p.z+Math.cos(a)*(row?.035:.065));dummy.scale.set(row?.035:.045,.04,row?.055:.085);dummy.rotation.set(row?.4:.1,a,0);dummy.updateMatrix();flowers.setMatrixAt(i*6+k,dummy.matrix);}});group.add(flowers);
 // Palmyra-type fan leaves, with folded segments instead of a generic canopy sphere.
 for(const [cx,cz,h]of [[-8,-6,4.8],[8,2.7,5.2]]){
  const stem=new T.Mesh(new T.CylinderGeometry(.15,.23,h,10),trunk);stem.name='Sugar-palm trunk';stem.position.set(cx,h/2,cz);stem.castShadow=true;group.add(stem);block(cx,cz,.28,.28);
  for(let y=.35;y<h-.25;y+=.32){const ring=new T.Mesh(new T.TorusGeometry(.18,.013,4,12),darkStone);ring.name='Palm leaf-scar ring';ring.rotation.x=Math.PI/2;ring.position.set(cx,y,cz);group.add(ring);}
  for(let i=0;i<11;i++){
   const angle=i*Math.PI*2/11,fx=cx+Math.sin(angle)*.85,fz=cz+Math.cos(angle)*.85,fy=h+Math.sin(i)*.2;
   rod('Palm leaf stalk',[[cx,h-.15,cz],[cx+Math.sin(angle)*.4,h+.2,cz+Math.cos(angle)*.4],[fx,fy,fz]],.032,leaf);
   const vertices=[];for(let j=0;j<16;j++){const a=-1.25+j*2.5/16,b=-1.25+(j+1)*2.5/16,r=1.05+(j%2)*.13;vertices.push(0,0,0,Math.sin(a)*r,Math.cos(a)*r,(j%2)*.06,Math.sin(b)*r,Math.cos(b)*r,((j+1)%2)*.06);}
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();const fan=new T.Mesh(geometry,palmLeaf);fan.name='Sugar-palm segmented fan frond';fan.position.set(fx,fy,fz);fan.rotation.set(-.7,angle,0);fan.castShadow=true;group.add(fan);
  }
 }
 // Low planted edging preserves open views and routes around the painting corner.
 for(const x of [-8.8,8.8]){box('Low sandstone garden edge',x,.16,0,.35,.28,12,sandstone);block(x,0,.2,6.1);}
 // The benches are open to the lawn rather than housed in another pavilion.
 for(const x of [-3,3]){
  box('Cambodia garden bench seat',x,.53,6.8,2.6,.18,.75,sandstone);box('Cambodia garden bench back',x,1,7.12,2.6,.7,.15,pale);
  for(const side of [-1,1])box('Stone garden bench support',x+side*.95,.25,6.8,.27,.5,.58,darkStone);block(x,6.95,1.35,.5);seats.push({x,y:.64,z:6.7,facing:Math.PI});
 }
 // A modest masonry entrance keeps the future park marker in front, off the path.
 for(const x of [-2.2,2.2]){
  box('Cambodia garden entrance pillar',x,1.2,-7.6,.4,2.4,.45,sandstone);block(x,-7.6,.24,.27);
  for(let k=0;k<3;k++)box('Stepped garden pillar cap',x,2.42+k*.1,-7.6,.64-k*.13,.12,.7-k*.13,k%2?pale:sandstone);
 }
 box('Garden entrance lintel',0,2.42,-7.6,4.7,.18,.42,pale);
 group.userData.localIdentity='Romduol and sugar-palm garden';group.userData.storySeats=seats;
 return {obstacles,seats,flowerCount:blossoms.length,paintCorner:{x:4.5,z:-.6},theme:'Romduol and sugar-palm promenade',themeKey:'cambodia-romduol-palm',layout:'open-stone-promenade'};
}

// Luang Prabang botanical-garden inspiration; shared fantasy paint plants are separate.
export function buildLaosGarden(T,group){
 const obstacles=[],seats=[],mat=color=>new T.MeshStandardMaterial({color,roughness:.9}),green=mat(0x4c8c5b),deep=mat(0x326c49),bamboo=mat(0x829b59),wood=mat(0x88714b),cream=mat(0xe1d3ad),white=mat(0xfff9e8),yellow=mat(0xf5d266),violet=mat(0xb880c4),red=mat(0xd9858f),stone=mat(0x9ba898),sphere=new T.SphereGeometry(1,9,6),dummy=new T.Object3D();
 function box(name,x,y,z,w,h,d,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.name=name;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;group.add(o);return o;}
 function block(x,z,halfX,halfZ){obstacles.push({x,z,halfX,halfZ});}
 function ell(name,x,y,z,sx,sy,sz,m){const o=new T.Mesh(sphere,m);o.name=name;o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;group.add(o);return o;}
 function rod(name,points,r,m){const o=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),14,r,6,false),m);o.name=name;o.castShadow=true;group.add(o);return o;}
 box('Laos garden ground',0,.01,0,20,.025,17,mat(0x8ea575));
 const path=new T.CatmullRomCurve3([new T.Vector3(0,.045,-8.5),new T.Vector3(-1.5,.045,-4),new T.Vector3(.5,.045,0),new T.Vector3(-1.2,.045,4),new T.Vector3(-2,.045,7)]),vertices=[];
 for(let i=0;i<55;i++){const a=path.getPoint(i/55),b=path.getPoint((i+1)/55),ta=path.getTangent(i/55),tb=path.getTangent((i+1)/55),na=new T.Vector3(-ta.z,0,ta.x).multiplyScalar(1.25),nb=new T.Vector3(-tb.z,0,tb.x).multiplyScalar(1.25),v=[a.clone().add(na),a.clone().sub(na),b.clone().add(nb),b.clone().sub(nb)];for(const j of [0,1,2,1,3,2])vertices.push(...v[j].toArray());}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();const walkway=new T.Mesh(geo,cream);walkway.name='Winding level bamboo-garden path';walkway.material.side=T.DoubleSide;group.add(walkway);
 // Clumps of jointed bamboo and individually instanced narrow leaves.
 for(const [cx,cz]of [[-7.5,-4.5],[7.4,4.6],[-7,4.8]]){
  for(let i=0;i<6;i++){const a=i*2.4,x=cx+Math.sin(a)*.38,z=cz+Math.cos(a)*.38,h=3.5+i*.18;
   const stalk=new T.Mesh(new T.CylinderGeometry(.045,.075,h,7),bamboo);stalk.name='Jointed bamboo culm';stalk.position.set(x,h/2,z);group.add(stalk);block(x,z,.09,.09);
   for(let y=.45;y<h;y+=.52){const node=new T.Mesh(new T.TorusGeometry(.065,.013,4,8),deep);node.name='Bamboo node';node.rotation.x=Math.PI/2;node.position.set(x,y,z);group.add(node);}
  }
  const leaves=new T.InstancedMesh(sphere,green,160);leaves.name='Bamboo lance-shaped leaves';for(let i=0;i<160;i++){const a=i*2.4,r=(i%17)/17*1.4;dummy.position.set(cx+Math.sin(a)*r,2+(i%23)*.095,cz+Math.cos(a)*r);dummy.scale.set(.3,.025,.06);dummy.rotation.set(Math.sin(a)*.25,a,.2);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix);}group.add(leaves);
 }
 // Dok champa: open branching trees with white five-petaled flowers and yellow centers.
 let flowerCount=0;
 for(const [cx,cz]of [[-4.8,-.3],[5.7,-5.7]]){
  rod('Frangipani branching trunk',[[cx,0,cz],[cx-.1,1.1,cz],[cx+.2,2,cz]],.13,wood);block(cx,cz,.25,.25);
  for(let k=0;k<4;k++){const a=k*Math.PI/2,x=cx+Math.sin(a)*1.25,z=cz+Math.cos(a)*1.25;rod('Frangipani branch',[[cx,1.35,cz],[cx+Math.sin(a)*.75,2.15,cz+Math.cos(a)*.75],[x,2.6,z]],.07,wood);
   for(let i=0;i<8;i++){const b=i*Math.PI/4,l=ell('Long frangipani leaf',x+Math.sin(b)*.38,2.7+Math.cos(i)*.08,z+Math.cos(b)*.38,.14,.045,.55,green);l.rotation.y=b;}
   for(let i=0;i<5;i++){const b=i*2.4,fx=x+Math.sin(b)*.32,fz=z+Math.cos(b)*.32,fy=2.85+(i%2)*.1;
    for(let j=0;j<5;j++){const c=j*Math.PI*2/5,p=ell('White dok champa petal',fx+Math.sin(c)*.08,fy,fz+Math.cos(c)*.08,.065,.025,.13,white);p.rotation.y=c+.35;}
    ell('Dok champa golden center',fx,fy+.015,fz,.05,.025,.05,yellow);flowerCount++;
   }
  }
 }
 // Ginger and orchid collection studies echo Pha Tad Ke's botanical collections.
 for(const [x,z]of [[-4,-4.8],[6.5,.3],[3.5,5.8]]){
  block(x,z,.7,.7);for(let i=0;i<7;i++){const a=i*2.4,l=ell('Ginger broad leaf',x+Math.sin(a)*.4,.38+(i%3)*.2,z+Math.cos(a)*.4,.12,.04,.48,green);l.rotation.y=a;l.rotation.x=.25;}
  for(let i=0;i<6;i++)for(let j=0;j<3;j++){const a=j*Math.PI*2/3+i*.5,p=ell('Ornamental ginger bract',x+Math.sin(a)*.06,.5+i*.055,z+Math.cos(a)*.06,.08,.055,.08,red);p.rotation.y=a;}flowerCount++;
 }
 for(const [x,z]of [[7,-2.4],[-4.7,3.1]]){
  block(x,z,.45,.45);const pot=new T.Mesh(new T.CylinderGeometry(.4,.3,.55,10),wood);pot.name='Woven orchid planter';pot.position.set(x,.28,z);group.add(pot);
  rod('Orchid flower stem',[[x,.4,z],[x+.1,1,z],[x+.3,1.35,z]],.018,green);
  for(let i=0;i<4;i++){const y=.9+i*.16;for(let k=0;k<5;k++){const a=k*Math.PI*2/5,p=ell('Orchid petal study',x+.12+Math.sin(a)*.08,y+Math.cos(a)*.08,z+.03,.07,.055,.025,violet);p.rotation.z=-a;}ell('Orchid lip study',x+.12,y-.04,z+.07,.06,.065,.035,white);flowerCount++;}
 }
 for(const [x,z]of [[-8,1],[8,6.5]]){const rock=ell('Limestone garden rock',x,.45,z,.8,.65,1.1,stone);rock.rotation.y=x;block(x,z,.85,1.15);for(let i=0;i<10;i++){const a=i*Math.PI/5;rod('Fern frond',[[x,.18,z+1],[x+Math.sin(a)*.4,.65,z+1+Math.cos(a)*.4],[x+Math.sin(a)*.8,.5,z+1+Math.cos(a)*.8]],.022,deep);}}
 // A distinct bamboo shade canopy and two benches, with clear wheelchair-width access.
 for(const x of [-5.6,1.2])for(const z of [5.5,8]){box('Bamboo shade support',x,1.3,z,.15,2.6,.15,bamboo);block(x,z,.12,.12);}
 for(let i=0;i<24;i++)box('Open bamboo shade slat',-5.7+i*.3,2.65,6.75,.12,.1,3.1,wood);
 for(const x of [-3.8,-.7]){box('Laos garden bench seat',x,.53,7.2,2.4,.15,.7,wood);box('Laos garden bench back',x,.95,7.5,2.4,.75,.12,bamboo);for(const side of [-1,1])box('Laos garden bench leg',x+side*.9,.27,7.2,.12,.5,.5,wood);block(x,7.3,1.25,.5);seats.push({x,y:.62,z:7.15,facing:Math.PI});}
 for(const x of [-2,2]){box('Bamboo garden entry post',x,1.3,-7.7,.17,2.6,.17,bamboo);block(x,-7.7,.12,.12);}box('Bamboo entrance crossbeam',0,2.6,-7.7,4.5,.15,.4,wood);
 group.userData.localIdentity='Luang Prabang botanical-garden inspiration';group.userData.storySeats=seats;
 return {obstacles,seats,flowerCount,paintCorner:{x:4,z:.7},theme:'Dok champa and bamboo garden',themeKey:'laos-bamboo-champa',layout:'winding-botanical-path'};
}

// Owner-selected appearance/performance pairs. Specific trims and final ride
// names are still open; these are original PAINTFALL coach silhouettes.
export const nevadaRacingPairs=Object.freeze([
 {family:'angular-wedge',appearance:'Lamborghini-inspired',performance:'Ford Mustang',label:'Angular wedge car-train'},
 {family:'wide-muscle',appearance:'SRT Hellcat-inspired',performance:'Chevrolet Corvette',label:'Wide muscle car-train'},
 {family:'long-bonnet',appearance:'Rolls-Royce Wraith-inspired',performance:'Toyota GR86',label:'Long-bonnet car-train'}
]);
export function createNevadaRacingVehicles(T){
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.5,...extra});
 const paints=[mat(0xf16aa6),mat(0xffc550),mat(0x369bd7)],accents=[mat(0x43e6db),mat(0x5044a8),mat(0xb5d9f0)];
 const black=mat(0x142633),rubber=mat(0x242a30,{roughness:.95}),silver=mat(0xbacbd1,{metalness:.65,roughness:.32}),glass=mat(0x9ddde4,{metalness:.18,roughness:.22,transparent:true,opacity:.60,depthWrite:false}),seat=mat(0x3b354d),belt=mat(0x9ce45d),white=mat(0xf7edce,{emissive:0x302a18}),gold=mat(0xffd16c);
 function createCoach(lane){
  const spec=nevadaRacingPairs[lane],car=new T.Group(),parts=[],paint=paints[lane],accent=accents[lane];car.name=spec.label;
  function part(g,m,name,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.name=name;o.position.set(x,y,z);parts.push(o);return o;}
  const box=(x,y,z,w,h,d,m,name)=>part(new T.BoxGeometry(w,h,d),m,name,x,y,z);
  const body=(sections,m)=>{const vertices=[],indices=[];for(const [z,w,top]of sections)vertices.push(-w,.20,z,w,.20,z,w,top,z,-w,top,z);for(let i=0;i<sections.length-1;i++)for(let j=0;j<4;j++){const a=i*4+j,b=i*4+(j+1)%4,c=a+4,d=b+4;indices.push(a,b,c,b,d,c);}indices.push(0,2,1,0,3,2);const a=(sections.length-1)*4;indices.push(a,a+1,a+2,a,a+2,a+3);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return part(g,m,'Original '+spec.family+' body');};
  if(lane===0){
   body([[-1.35,.68,.58],[-.72,.92,.69],[.4,.9,.53],[1.4,.64,.30]],paint);
   for(const x of [-.84,.84]){const sill=box(x,.36,0,.15,.22,2.0,accent,'Wedge side intake');sill.rotation.z=x>0?-.16:.16;const light=box(x*.65,.42,1.18,.43,.065,.12,white,'Angular light slash');light.rotation.y=x>0?.28:-.28;}
   for(let i=0;i<4;i++)box(0,.67,-.88-i*.09,.84,.04,.045,black,'Rear-engine louver');box(0,.48,1.3,.92,.06,.18,black,'Low wedge splitter');
  }else if(lane===1){
   body([[-1.4,.78,.60],[-.8,.95,.69],[.8,.95,.66],[1.4,.86,.54]],paint);
   box(0,.58,1.42,1.52,.22,.07,black,'Broad muscle grille');box(0,.75,.91,.42,.14,.46,black,'Muscle hood scoop');
   for(const x of [-.65,.65])for(const dx of [-.11,.11]){const light=part(new T.CylinderGeometry(.085,.085,.035,10),white,'Twin round muscle headlight',x+dx,.61,1.47);light.rotation.x=Math.PI/2;}
   for(const x of [-.2,.2])box(x,.69,.86,.12,.028,.95,accent,'Double hood paint stripe');box(0,.92,-1.22,1.72,.10,.3,black,'Muscle rear spoiler');
  }else{
   body([[-1.5,.73,.63],[-.78,.9,.73],[.63,.9,.72],[1.5,.78,.67]],paint);
   box(0,.65,1.52,.85,.42,.055,silver,'Upright grand-tourer grille');for(let i=0;i<7;i++)box(-.33+i*.11,.65,1.56,.022,.34,.025,black,'Grille vertical flute');
   for(const x of [-.62,.62])box(x,.71,1.48,.27,.12,.10,white,'Grand-tourer lamp');box(0,.735,.83,1.22,.025,1.05,accent,'Long contrasting bonnet');
   for(const x of [-.85,.85])box(x,.60,-.25,.065,.055,1.8,silver,'Grand-tourer shoulder trim');
  }
  // Open coach cabins preserve visible, padded seats and belts in all bodies.
  box(0,.70,-.2,1.47,.08,.95,black,'Open two-seat cabin floor');
  for(const x of [-.38,.38]){
   box(x,.79,-.14,.60,.18,.62,seat,'Padded racing seat');box(x,1.10,-.51,.60,.59,.16,seat,'Padded racing seat back');box(x,1.42,-.51,.39,.21,.18,seat,'Headrest');
   box(x,.91,-.12,.61,.06,.07,belt,'Visible lap belt');const strap=box(x,1.14,-.395,.055,.48,.055,belt,'Visible shoulder belt');strap.rotation.z=x>0?-.35:.35;box(x,.93,-.08,.12,.09,.08,silver,'Seatbelt buckle');
  }
  const wind=box(0,1.0,.37,1.42,.36,.065,glass,'Short angled windshield');wind.rotation.x=-.30;
  for(const side of [-1,1])for(const z of [-.94,.94]){const tyre=part(new T.CylinderGeometry(.34,.34,.19,12),rubber,'Coaster road-wheel silhouette',side*.94,.22,z);tyre.rotation.z=Math.PI/2;const rim=part(new T.CylinderGeometry(.20,.20,.023,10),silver,'Metallic wheel hub',side*1.045,.22,z);rim.rotation.z=Math.PI/2;}
  for(const z of [-1.60,1.60]){box(0,.18,z,.19,.12,.30,black,'Connected-train coupler');const connector=part(new T.SphereGeometry(.105,8,6),silver,'Coupler pivot',0,.18,z*1.035);}
  // Paint streaks and an original crown-like crest; no manufacturer logos.
  for(let i=0;i<3;i++){const streak=box(lane===0?-.91:lane===1?.96:-.91,.52,-.72+i*.36,.035,.10,.25,accent,'PAINTFALL paint streak');streak.rotation.x=.2;}
  for(let i=0;i<3;i++)part(new T.ConeGeometry(.055,i===1?.14:.10,3),gold,'Original PAINTFALL paint crown',-.12+i*.12,lane===0?.46:lane===1?.79:.82,.91);
  for(const p of parts)p.position.y+=.28;
  for(const z of [-.82,.82]){box(0,.03,z,1.4,.14,.22,black,'Coaster running-gear axle');for(const x of [-.58,.58]){const roller=part(new T.CylinderGeometry(.14,.14,.13,10),rubber,'Rail guide roller',x,-.10,z);roller.rotation.z=Math.PI/2;}}
  // Merge by material inside each moving coach to bound draw calls on phones.
  const batches=new Map();for(const o of parts){o.updateMatrix();const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrix);let b=batches.get(o.material);if(!b)batches.set(o.material,b={positions:[],normals:[]});b.positions.push(...g.attributes.position.array);b.normals.push(...g.attributes.normal.array);g.dispose();o.geometry.dispose();}
  let i=0;for(const [m,b]of batches){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.normals,3));g.computeBoundingSphere();const mesh=new T.Mesh(g,m);mesh.name=spec.label+' material batch '+(++i);mesh.castShadow=mesh.receiveShadow=true;car.add(mesh);}
  car.userData={...spec,finalRideNameConfirmed:false,seatbelts:2,openCoach:true,materialBatches:batches.size};return car;
 }
 return {createCoach,specs:nevadaRacingPairs};
}

// Luang Prabang wooden-house reference; original layout, not all Lao housing traditions.
export function buildLaosNeighborhood(T,{land,ground,spawn,occupied=[]}){
 const group=new T.Group();group.name='laos-wooden-house-studies';land.add(group);const homes=[],obstacles=[],benches=[],mat=c=>new T.MeshStandardMaterial({color:c,roughness:.9}),wood=mat(0x976f4c),bamboo=mat(0xc8ad7e),roofMat=mat(0x85716c),accent=mat(0x9cc4bd);
 function box(g,name,x,y,z,w,h,d,m){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.name=name;g.add(mesh);return mesh;}
 for(let i=0;i<3;i++){let p;for(let j=0;j<1200;j++){const a=j*2.4+i,r=9+Math.sqrt(j)*1.3,q=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(!q||Math.hypot(q.x,q.z)>60)continue;const corners=[[-3,-3.6],[3,-3.6],[-3,3.6],[3,3.6]].map(([x,z])=>ground(q.x+x,q.z+z));if(corners.some(c=>!c)||Math.max(...corners.map(c=>c.y))-Math.min(...corners.map(c=>c.y))>2.8||[...occupied,...obstacles].some(o=>Math.abs(q.x-o.x)<o.halfX+4&&Math.abs(q.z-o.z)<o.halfZ+4.6))continue;p=q.clone();p.y=Math.max(...corners.map(c=>c.y))+.1;break;}if(!p)continue;
  const home=new T.Group();home.name='Luang Prabang-inspired wooden home '+(i+1);home.position.copy(p);home.userData.style='lao-raised-timber';group.add(home);homes.push(home);const floor=1.4;home.userData.floorLevel=floor;home.userData.wallHeight=2.4;const shell=new T.Group();shell.name='Laos house wall and roof shell';home.add(shell);home.userData.cutawayShell=shell;
  for(const x of [-2.6,0,2.6])for(const z of [-3,3]){const terrain=ground(p.x+x,p.z+z),bottom=terrain.y-p.y;box(home,'Grounded wooden post',x,(bottom+floor)/2,z,.18,floor-bottom,.18,wood);}
  box(home,'Raised veranda floor',0,floor,0,6,.18,7.2,wood);box(shell,'Side wall',-2.15,floor+1.2,-.35,.2,2.4,5.1,bamboo);box(shell,'Side wall',2.15,floor+1.2,-.35,.2,2.4,5.1,bamboo);box(shell,'Rear wall',0,floor+1.2,-2.8,4.3,2.4,.2,bamboo);box(shell,'Front wall',-1.3,floor+1.2,2.13,1.8,2.4,.2,bamboo);box(shell,'Front wall',1.3,floor+1.2,2.13,1.8,2.4,.2,bamboo);
  for(let k=0;k<16;k++)box(shell,'Bamboo-color wall panel',-2.1+k*.28,floor+1.2,2.23,.025,2.3,.03,wood);
  for(const x of [-1.2,1.2]){box(shell,'Wooden shutter',x,floor+1.55,2.29,.8,.9,.08,wood);box(shell,'Shutter accent',x,floor+1.55,2.35,.6,.035,.02,accent);}
  box(shell,'Door study',0,floor+.9,2.3,.7,1.8,.08,wood);
  const roof=new T.Mesh(new T.ConeGeometry(4.2,1.8,4),roofMat);roof.rotation.y=Math.PI/4;roof.scale.z=1.15;roof.position.set(0,floor+3.3,-.35);roof.name='Broad hipped roof study';shell.add(roof);
  for(const x of [-2.7,2.7])for(let k=0;k<7;k++)box(home,'Veranda railing post',x,floor+.45,-2.8+k*.95,.07,.9,.07,wood);for(const x of [-2.7,2.7])box(home,'Veranda handrail',x,floor+.92,0,.1,.08,6.2,accent);
  for(let step=0;step<5;step++)box(home,'Front stair',0,.14+step*.28,4.3-step*.2,1.4,.24,.3,wood);
  obstacles.push({x:p.x,z:p.z+.4,halfX:3.2,halfZ:4.3});
 }
 return{group,homes,obstacles,benches};
}


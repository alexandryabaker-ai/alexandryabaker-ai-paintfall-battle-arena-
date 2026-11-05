export function buildJapanNeighborhood(T,{land,ground,spawn,occupied=[]}){
 const group=new T.Group();group.name='japan-neighborhood';land.add(group);const homes=[],obstacles=[],benches=[];
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95}),wood=mat(0x735b54),plaster=mat(0xeee1d0),roof=mat(0x646c80),accent=mat(0xb49bcd),panel=mat(0xc2ddd4);
 function box(g,x,y,z,w,h,d,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o;}
 for(let i=0;i<4;i++){let p;for(let j=0;j<500;j++){const a=j*2.4+i,r=14+Math.sqrt(j)*1.3,q=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(!q||Math.hypot(q.x,q.z)>65)continue;const corners=[[-3,-4],[3,-4],[-3,4],[3,4]].map(([x,z])=>ground(q.x+x,q.z+z));if(corners.some(c=>!c)||Math.max(...corners.map(c=>c.y))-Math.min(...corners.map(c=>c.y))>2)continue;if([...occupied,...obstacles].some(o=>Math.abs(q.x-o.x)<o.halfX+5&&Math.abs(q.z-o.z)<o.halfZ+6))continue;p=q.clone();p.y=Math.max(...corners.map(c=>c.y))+.15;break;}if(!p)continue;
 const g=new T.Group();g.position.copy(p);g.name='Kyoto machiya-inspired exterior';group.add(g);homes.push(g);box(g,0,-.5,0,5.4,1,7,wood);box(g,0,2.5,0,5,5,6.6,plaster);
 for(const x of [-2.4,0,2.4])box(g,x,2.5,3.34,.16,5,.14,wood);for(const y of [.3,2.7,4.9])box(g,0,y,3.4,5,.16,.18,wood);
 box(g,1.3,1.4,3.45,1.3,2.4,.1,panel);box(g,-.9,1.5,3.43,2.3,1.9,.1,panel);for(let k=0;k<12;k++)box(g,-2+k*.2,1.5,3.52,.055,2,.07,wood);box(g,0,3.8,3.4,3.5,1.1,.1,panel);for(let k=0;k<10;k++)box(g,-1.7+k*.38,3.8,3.5,.06,1.15,.08,wood);
 const shape=new T.Shape();shape.moveTo(-3,0);shape.lineTo(0,1.8);shape.lineTo(3,0);shape.closePath();const top=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:7.5,bevelEnabled:false}),roof);top.position.set(0,5,-3.75);g.add(top);for(const side of [-1,1])for(let k=0;k<12;k++){const tile=box(g,side*(.15+k*.24),6.8-k*.144,0,.08,.09,7.55,k%5===0?accent:roof);tile.rotation.z=-side*.54;}box(g,0,2.8,3.85,5.7,.14,1.2,roof);box(g,0,.07,3.7,5.6,.14,.7,accent);
 const planter=box(g,-2,.25,4.2,.8,.5,.6,accent);box(g,-2,.55,4.2,.9,.15,.7,panel);obstacles.push({x:p.x,z:p.z,halfX:3,halfZ:4.7});
 }
 return {group,homes,obstacles,benches};
}

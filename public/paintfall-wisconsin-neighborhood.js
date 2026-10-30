export function buildWisconsinNeighborhood(T,{land,ground}){
 const group=new T.Group();group.name='wisconsin-neighborhood';land.add(group);const obstacles=[],homes=[],benches=[];
 const cream=new T.MeshStandardMaterial({color:0xf1debc}),roof=new T.MeshStandardMaterial({color:0x677880}),brick=new T.MeshStandardMaterial({color:0xae8176}),glass=new T.MeshStandardMaterial({color:0xa0d7e3,roughness:.25}),door=new T.MeshStandardMaterial({color:0x605c80});
 function pattern(type){const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,128,128);ctx.strokeStyle=type==='brick'?'#d3c6b9':'#bfc5c8';ctx.lineWidth=type==='brick'?3:2;for(let row=0;row<8;row++){const y=row*16;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(128,y);for(let x=(row%2)*16;x<128;x+=32){ctx.moveTo(x,y);ctx.lineTo(x,y+16);}ctx.stroke();}const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(2,2);return texture;}
 brick.map=pattern('brick');roof.map=pattern('roof');
 function box(parent,x,y,z,w,h,d,material){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material);m.position.set(x,y,z);parent.add(m);return m;}
 const colors=[0xa6c7b2,0xb7a1d1,0xd7ba8e,0x99bfcd,0xd6a8b7,0xb5c48e];
 for(let row=0;row<2;row++)for(let column=0;column<3;column++){
  const x=-32+column*14,z=24+row*24,p=ground(x,z);if(!p)continue;const i=row*3+column,duplex=i%2===1,h=duplex?6:3.8;
  const corners=[[-3,-3],[3,-3],[-3,3],[3,3]].map(([dx,dz])=>ground(x+dx,z+dz));if(corners.some(c=>!c))continue;const floor=Math.max(p.y,...corners.map(c=>c.y))+.3,g=new T.Group();g.position.set(x,floor,z);g.rotation.y=row?Math.PI:0;g.name=duplex?'Milwaukee-inspired duplex':'Milwaukee-inspired bungalow';group.add(g);homes.push(g);
  const siding=new T.MeshStandardMaterial({color:colors[i],roughness:.9});box(g,0,-.8,0,6,1.6,6,brick);box(g,0,h/2,0,5.8,h,5.8,siding);
  const triangle=new T.Shape();triangle.moveTo(-3.2,0);triangle.lineTo(0,2.1);triangle.lineTo(3.2,0);triangle.closePath();const pitched=new T.Mesh(new T.ExtrudeGeometry(triangle,{depth:6.5,bevelEnabled:false}),roof);pitched.position.set(0,h,-3.25);g.add(pitched);
  box(g,1.6,h+1.7,-1.7,.55,1.6,.55,brick);box(g,1.6,h+2.55,-1.7,.7,.12,.7,cream);for(const side of [-1,1]){box(g,side*3.05,h-.1,0,.1,.12,6,cream);box(g,side*2.9,h/2,-2.85,.08,h,.08,cream);}box(g,0,h+.02,3.28,6.4,.12,.14,cream);
  for(const x of [-2.4,2.4]){box(g,x,.6,4.9,.5,.65,.55,brick);const soil=new T.Mesh(new T.SphereGeometry(.32,8,6),new T.MeshStandardMaterial({color:0x8aab91}));soil.position.set(x,1,4.9);g.add(soil);const flower=new T.Mesh(new T.SphereGeometry(.15,8,6),new T.MeshStandardMaterial({color:0xb29bd6}));flower.position.set(x,1.26,4.9);g.add(flower);}
  box(g,0,.2,4.1,6.2,.4,2.4,cream);box(g,0,2.5,4.1,6.4,.2,2.7,roof);for(const px of [-2.7,2.7])box(g,px,1.35,5,.18,2.5,.18,cream);
  for(const side of [-1,1]){box(g,side*2.1,1.05,5.1,1.5,.1,.12,cream);for(let post=0;post<5;post++)box(g,side*(1.4+post*.35),.65,5.1,.07,.8,.07,cream);box(g,side*2.8,1.05,4.15,.12,.1,1.9,cream);}
  for(let step=0;step<3;step++)box(g,0,-.35-step*.25,5.5+step*.45,2.4,.25,.5,cream);
  for(const dx of duplex?[-.7,.7]:[0])box(g,dx,.95,2.96,.85,1.9,.1,door);
  for(const y of duplex?[1.5,4.6]:[1.7])for(const wx of [-1.9,1.9]){box(g,wx,y,2.96,1.1,1.25,.12,cream);box(g,wx,y,3.04,.92,1.05,.08,glass);box(g,wx,y,3.1,.06,1.05,.05,cream);box(g,wx,y,3.1,.92,.06,.05,cream);}
  for(const side of [-1,1])for(const y of duplex?[1.5,4.6]:[1.7])for(const z of [-1.6,1.2]){box(g,side*2.94,y,z,.12,1.2,1,cream);box(g,side*3.02,y,z,.06,1,.82,glass);}
  for(let band=1;band<h;band+=.45)box(g,0,band,2.93,5.8,.035,.04,cream);
  for(let side=0;side<2;side++)box(g,(side?1:-1)*2,.65,4.2,.8,.1,.6,door);
  obstacles.push({x,z,halfX:3.5,halfZ:6.6});
 }
 const center=ground(-18,36);if(center){const green=new T.Mesh(new T.CircleGeometry(5,32),new T.MeshStandardMaterial({color:0x8db598}));green.rotation.x=-Math.PI/2;green.position.set(center.x,center.y+.04,center.z);group.add(green);for(const x of [-21,-15]){const p=ground(x,36);if(p){box(group,x,p.y+.7,36,2.5,.15,.8,cream);box(group,x,p.y+1.1,36.4,2.5,.6,.12,door);for(const dx of [-.9,.9])box(group,x+dx,p.y+.35,36,.12,.7,.55,door);benches.push({x,z:36,y:p.y+.78});}}}
 const paths=[],pathMaterial=new T.MeshStandardMaterial({color:0xd9cab1,roughness:1,side:T.DoubleSide});
 function path(points,width=1.6){const vertices=[];for(let segment=0;segment<points.length-1;segment++){const a=points[segment],b=points[segment+1],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),nx=-dz/length*width/2,nz=dx/length*width/2,steps=Math.ceil(length);if(length===0)continue;for(let i=0;i<steps;i++){const t=i/steps,u=(i+1)/steps,quad=[[a[0]+dx*t+nx,a[1]+dz*t+nz],[a[0]+dx*t-nx,a[1]+dz*t-nz],[a[0]+dx*u-nx,a[1]+dz*u-nz],[a[0]+dx*u+nx,a[1]+dz*u+nz]].map(([x,z])=>ground(x,z));if(quad.some(p=>!p))continue;for(const k of [0,1,2,0,2,3])vertices.push(quad[k].x,quad[k].y+.07,quad[k].z);}}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();const walkway=new T.Mesh(geo,pathMaterial);walkway.name='neighborhood walking path';group.add(walkway);paths.push(walkway);}
 for(const x of [-32,-18,-4]){path([[x,32],[x,36],[-18,36]]);path([[x,40],[x,36],[-18,36]]);}
 path([[-18,36],[4,36],[4,12],[0,3]],2);
 return{group,homes,obstacles,paths,benches};
}


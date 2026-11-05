// Regional winter and mountain backdrop for the active multiplayer arena.
// Decorative only: all terrain and character movement remain on the level arena.
const coldStates=new Set(['Alaska','Colorado','Connecticut','Idaho','Illinois','Indiana','Iowa','Maine','Massachusetts','Michigan','Minnesota','Montana','Nebraska','New Hampshire','New York','North Dakota','Ohio','Pennsylvania','Rhode Island','South Dakota','Utah','Vermont','Washington','Wisconsin','Wyoming']);
const mountainStates=new Set(['Alaska','Arizona','California','Colorado','Idaho','Maine','Montana','Nevada','New Hampshire','New Mexico','North Carolina','Oregon','Tennessee','Utah','Vermont','Virginia','Washington','West Virginia','Wyoming']);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function regionClimate(destination,style,{season,month}={}){
 const state=destination?.type==='state'?destination.name:'';
 const chosen=season==='winter'||season==='summer'?season:null;
 const winter=style==='ice'||(coldStates.has(state)&&(chosen==='winter'||(!chosen&&(month===11||month===0||month===1))));
 const mountains=style==='mountain'||mountainStates.has(state);
 return {winter,mountains};
}
// Irregular layered ridgelines with side spurs, rather than a single cone.
// Snow follows the exact upper rock faces, with a tiny outward offset.
export function createMountainPeakGeometry(T,width,height,seed,snowOnly=false){
 const points=[],segments=16,levels=5;
 const rng=(i,j)=>{const v=Math.sin(seed*12.9898+i*78.233+j*37.719)*43758.5453;return v-Math.floor(v);};
 const summitX=(rng(51,1)-.5)*width*.25,summitZ=(rng(52,2)-.5)*width*.24;
 const rings=[];
 for(let j=0;j<=levels;j++){
  const t=j/levels,ring=[];
  for(let i=0;i<segments;i++){
   const a=i/segments*Math.PI*2;
   const spine=Math.sin(a*3+seed*.6)*.13+Math.cos(a*5-seed*.37)*.09;
   const rough=(rng(i,j)-.5)*.16*(1-t);
   const radius=width*Math.pow(1-t,1.12)*(1+spine+rough);
   const y=height*t+Math.sin(a*4+seed)*height*.055*(1-t)+
     (rng(i,j+10)-.5)*height*.085*(1-t);
   ring.push([Math.cos(a)*radius+summitX*t,y,Math.sin(a)*radius+summitZ*t]);
  }
  rings.push(ring);
 }
 for(let j=0;j<levels;j++){
  if(snowOnly&&j<3)continue;
  for(let i=0;i<segments;i++){
   const next=(i+1)%segments;
   const a=rings[j][i],b=rings[j][next],c=rings[j+1][i],d=rings[j+1][next];
   // Separate winding for a consistent exterior surface.
   const offset=snowOnly?.045:0;
   const out=v=>[v[0]+Math.sign(v[0]-summitX)*offset,v[1]+offset,v[2]+Math.sign(v[2]-summitZ)*offset];
   points.push(...out(a),...out(c),...out(b),...out(b),...out(c),...out(d));
  }
 }
 const geometry=new T.BufferGeometry();
 geometry.setAttribute('position',new T.Float32BufferAttribute(points,3));
 geometry.computeVertexNormals();return geometry;
}
export function buildWinterMountains(T,{land,destination,style,season,month}){
 const climate=regionClimate(destination,style,{season,month});
 const group=new T.Group();group.name='PAINTFALL regional winter and mountain backdrop';land.add(group);
 const rock=new T.MeshStandardMaterial({color:0x777f8d,roughness:1,flatShading:true,side:T.DoubleSide});
 const shaded=new T.MeshStandardMaterial({color:0x9ca4a9,roughness:1,flatShading:true,side:T.DoubleSide});
 const snow=new T.MeshStandardMaterial({color:0xe9f4f6,roughness:.93,flatShading:true,side:T.DoubleSide});
 const glacier=new T.MeshStandardMaterial({color:0xc5e5f1,roughness:.9,flatShading:true,side:T.DoubleSide});
 if(climate.mountains){
  // The arena is 160x160; all peaks sit beyond its +/-80 movement boundary.
  const specs=[[-58,-119,25,33],[-24,-124,29,39],[13,-121,27,35],[49,-117,24,30],[-122,-42,22,27],[123,-48,21,29]];
  for(let i=0;i<specs.length;i++){
   const [x,z,width,height]=specs[i],base=new T.Group();base.name='Distant mountain peak '+(i+1);base.position.set(x,0,z);group.add(base);
   const body=new T.Mesh(createMountainPeakGeometry(T,width,height,i+9),i%2?shaded:rock);body.name='faceted mountain rock';base.add(body);
   const cap=new T.Mesh(createMountainPeakGeometry(T,width,height,i+9,true),snow);cap.name='snow-covered mountain summit';base.add(cap);
  }
 }
 if(climate.winter){
  // Shallow snow mounds sit above the continuous snow surface. No colliders.
  const driftGeometry=new T.SphereGeometry(1,10,7);
  for(let i=0;i<34;i++){
   const a=i*2.39996,r=12+Math.sqrt(i)*9.2,x=Math.cos(a)*r,z=Math.sin(a)*r;
   if(Math.abs(x)>72||Math.abs(z)>72)continue;
   const drift=new T.Mesh(driftGeometry,i%5===0?glacier:snow);
   drift.position.set(x,.027,z);drift.scale.set(1.4+(i%4)*.7,.045+(i%3)*.015,.75+(i%3)*.4);
   drift.name='Shallow snow drift on playable ground';group.add(drift);
  }
  // Low decorative snow banks are placed outside the arena boundary, not on walkable paths.
  for(let i=0;i<12;i++){
   const a=(i+.35)/12*Math.PI*2,r=85+(i%3)*2,x=Math.cos(a)*r,z=Math.sin(a)*r;
   const bank=new T.Mesh(new T.SphereGeometry(1,9,6),i%3? snow:glacier);
   bank.position.set(x,.16,z);bank.scale.set(4+(i%3),.5+(i%2)*.2,2.5+(i%4)*.3);
   bank.name='Distant winter snowbank';group.add(bank);
  }
 }
 group.userData.climate=climate;
 return {group,...climate};
}

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
function peakGeometry(T,width,height,seed,snowOnly=false){
 const points=[],segments=9;
 const baseY=-.4,capY=height*.69;
 const rng=i=>((Math.sin(seed*1.73+i*18.12)*43758.5453)%1+1)%1;
 function add(a,b,c){points.push(...a,...b,...c);}
 const summit=[(rng(15)-.5)*width*.15,height,(rng(16)-.5)*width*.15];
 for(let i=0;i<segments;i++){
  const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2;
  const r1=width*(.78+rng(i)*.23),r2=width*(.78+rng((i+1)%segments)*.23);
  const edgeA=[Math.cos(a)*r1,baseY,Math.sin(a)*r1];
  const edgeB=[Math.cos(b)*r2,baseY,Math.sin(b)*r2];
  const midA=[Math.cos(a)*r1*.43,capY,Math.sin(a)*r1*.43];
  const midB=[Math.cos(b)*r2*.43,capY,Math.sin(b)*r2*.43];
  if(snowOnly){add(midA,midB,summit);}
  else {add(edgeA,edgeB,midA);add(edgeB,midB,midA);}
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
  const specs=[[-58,-102,25,33],[-24,-110,29,39],[13,-109,27,35],[49,-101,24,30],[-104,-42,22,27],[104,-48,21,29]];
  for(let i=0;i<specs.length;i++){
   const [x,z,width,height]=specs[i],base=new T.Group();base.name='Distant mountain peak '+(i+1);base.position.set(x,0,z);group.add(base);
   const body=new T.Mesh(peakGeometry(T,width,height,i+9),i%2?shaded:rock);body.name='faceted mountain rock';base.add(body);
   const cap=new T.Mesh(peakGeometry(T,width,height,i+9,true),climate.winter||style==='mountain'?snow:glacier);cap.name='snow-covered mountain summit';base.add(cap);
  }
 }
 if(climate.winter){
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

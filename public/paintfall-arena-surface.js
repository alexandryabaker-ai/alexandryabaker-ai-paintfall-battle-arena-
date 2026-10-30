// The legacy outdoor arena's seeded surface grain, adapted to level regional
// terrain. No height displacement, colliders, extra renderer or texture download.
export function createArenaSurfaceMaterial(T,color,kind='grass',repeat=18){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
 const ctx=canvas.getContext('2d');let seed=kind==='grass'?41:kind==='sand'?73:119;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 ctx.fillStyle='#f4f4f4';ctx.fillRect(0,0,256,256);
 for(let i=0;i<6200;i++){
  const shade=170+Math.floor(random()*75);ctx.fillStyle=`rgb(${shade},${shade},${shade})`;
  ctx.globalAlpha=.12+random()*.2;const x=random()*256,y=random()*256,r=1+random()*4;
  ctx.fillRect(x,y,kind==='grass'?r*.45:r,kind==='grass'?r*1.6:r*(.35+random()));
 }
 ctx.globalAlpha=1;
 const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
 map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(repeat,repeat);map.anisotropy=4;
 const material=new T.MeshStandardMaterial({color,map,roughness:kind==='stone'?.94:1});
 material.userData.arenaSurface='legacy-seeded-grain';return material;
}

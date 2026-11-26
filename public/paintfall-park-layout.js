// Creator-confirmed compass arrangement, November 25, 2026.
// North is -Z; east is +X. Distances are tester layout choices, not ride equations.
export const PARK_BOUND=300;
export const PARK_LAYOUT=Object.freeze({
 hub:Object.freeze({x:0,z:0,title:'World Hub',direction:'Center'}),
 racing:Object.freeze({x:190,z:0,title:'Racin’ Park',direction:'East'}),
 garden:Object.freeze({x:0,z:160,title:'Garden Park',direction:'South'}),
 building:Object.freeze({x:-190,z:160,title:'Building Park',direction:'West of Garden Park'}),
 paint:Object.freeze({x:0,z:-160,title:'Paint Park',direction:'North'}),
});
// Keep existing neighborhood models together, clear of park footprints.
export const NEIGHBORHOOD_OFFSET=Object.freeze({x:-190,z:-140});

export function buildParkReservations(T,group,{parks,garden}){
 const built=new Set(parks?.sites.map(site=>site.id)||[]);if(garden)built.add('garden');
 for(const [id,slot]of Object.entries(PARK_LAYOUT)){
  if(built.has(id))continue;
  const marker=new T.Group();marker.name=slot.title+' — reserved location';
  marker.position.set(slot.x,.04,slot.z);marker.userData={parkType:id,status:'reserved',direction:slot.direction};group.add(marker);
  const pad=new T.Mesh(new T.PlaneGeometry(18,12),new T.MeshStandardMaterial({color:0xc8bca3,roughness:1}));
  pad.rotation.x=-Math.PI/2;marker.add(pad);
  const c=document.createElement('canvas');c.width=640;c.height=128;const ctx=c.getContext('2d');
  ctx.fillStyle='#172d36';ctx.fillRect(0,0,640,128);ctx.fillStyle='#fff8df';ctx.font='600 30px system-ui';ctx.textAlign='center';
  ctx.fillText(slot.title+' • '+slot.direction,320,48);ctx.font='24px system-ui';ctx.fillText('Reserved location • Not built yet',320,95);
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
  const sign=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:true}));sign.position.y=4;sign.scale.set(24,4.8,1);marker.add(sign);
 }
}

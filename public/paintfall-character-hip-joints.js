// Close the existing procedural cargo pelvis and articulate covered hip sockets.
// Rest proportions, leg pivots, character height and locomotion are unchanged.
export function connectCharacterHips(T,actor){
 const p=actor.userData.parts,d=actor.userData.design;
 const seat=p.body.getObjectByName('kai-connected-cargo-seat')||p.body.getObjectByName('hips');
 const points=[[0,-.052],[.32,-.052],[.64,-.030],[.92,.005],[1,.050],[.96,.090],[0,.090]].map(([r,y])=>new T.Vector2(d.hip*r,d.legRatio+y));
 seat.geometry.dispose();seat.geometry=new T.LatheGeometry(points,28);seat.position.set(0,0,0);seat.scale.set(1,1,.66);
 if(actor.userData.character!=='Kai')seat.material=p.legL.getObjectByName('thigh').material;
 const sockets=[];
 for(const leg of [p.legL,p.legR]){
  const thigh=leg.getObjectByName('thigh'),radius=d.muscle*(actor.userData.character==='Maya'?1.35:1.08)*thigh.scale.x;
  const socket=new T.Mesh(new T.SphereGeometry(1,20,12),thigh.material);
  socket.name='cargo-hip-joint';socket.position.set(0,-.005,0);socket.scale.set(radius*.94,.035,radius*.9);
  socket.castShadow=socket.receiveShadow=true;leg.add(socket);sockets.push(socket);
 }
 actor.userData.hipConnection={seat,sockets};
 return actor.userData.hipConnection;
}

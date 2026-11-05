// Solid garment shaping: opaque clothing and full cargo pants at every stage.
export function createNovaOutfit(T, actor) {
  if(actor.userData.character!=='Nova')throw new Error('Nova outfit requires Nova');
  const p=actor.userData.parts,gear=[],pants=[],shoes=[];
  const details=new Set(['harness','utility-pouch','knee-pad','wrist-cuff','fingerless-glove','belt-buckle']);
  actor.traverse(m=>{
    if(details.has(m.name))gear.push({mesh:m,scale:m.scale.clone()});
    if(['thigh','shin','cargo-pocket','cargo-secondary-pocket'].includes(m.name))pants.push({mesh:m,scale:m.scale.clone()});
    if(m.name==='boot')shoes.push({mesh:m,scale:m.scale.clone()});
  });
  const torsoScale=p.torso.scale.clone();
  function update(value){
    const t=Math.max(0,Math.min(1,Number(value)||0));
    gear.forEach(({mesh,scale})=>{mesh.scale.copy(scale).multiplyScalar(1-.999*t);mesh.visible=t<1;});
    p.torso.scale.copy(torsoScale);p.torso.scale.x*=1-.06*t;p.torso.scale.z*=1-.06*t;
    pants.forEach(({mesh,scale})=>{mesh.scale.copy(scale);mesh.scale.x*=1-.07*t;mesh.scale.z*=1-.05*t;});
    shoes.forEach(({mesh,scale})=>mesh.scale.copy(scale).lerp(new T.Vector3(.034,.024,.060),t));
    actor.userData.novaOutfitProgress=t;
  }
  update(0);return {update,shirt:p.torso,pants,shoes};
}

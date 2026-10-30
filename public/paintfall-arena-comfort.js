export function animalAvoided(name,avoid=[]){
 const patterns={spiders:/spider|tarantula/i,snakes:/snake|python|cobra|viper|\bboa\b|anaconda|krait|adder/i,insects:/insect|butterfly|butterflies|moth|beetle|dragonfly|damselfly|mantis|cricket|\bants?\b|termite|cicada/i,bats:/\bbats?\b|flying fox/i,crocodiles:/crocodile|alligator|caiman|gharial/i};
 return avoid.some(choice=>patterns[choice]?.test(name||''));
}
export function applyArenaComfort(T,region,avoid=[]){
 for(const animal of region.wildlife?.animals||[])animal.root.visible=!animalAvoided(animal.kind||animal.root.name,avoid);
 // Hide named water scenery and low cyan water surfaces, preserving the shared
 // solid ground and collision geometry. This is a visual comfort setting only.
 region.group.traverse(object=>{
  if(!object.isMesh)return;
  if(object.userData.comfortWater===undefined){
   const name=/water|river|pool|stream|cascade|lake|canal|lagoon|ocean|pond/i.test(object.name);
   const materials=Array.isArray(object.material)?object.material:[object.material];
   const blue=materials.some(m=>m?.color&&m.color.b>m.color.r*1.4&&m.color.g>m.color.r*1.2);
   const bounds=blue?new T.Box3().setFromObject(object):null;
   object.userData.comfortWater=name||!!(bounds&&bounds.max.y-bounds.min.y<.4&&bounds.max.x-bounds.min.x>1&&bounds.max.z-bounds.min.z>1);
  }
  if(object.userData.comfortWater)object.visible=!avoid.includes('deep-water');
 });
}

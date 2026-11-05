import {refineTreeStudies} from './paintfall-regional-tree-studies.js';
export function buildFinalScenery(T,{land,ground,spawn,profile}){
 const group=new T.Group();group.name='Regional ecology and planting studies';land.add(group);
 const result={group,visits:[],obstacles:[],clearings:[],waterBounds:[]},setting=profile.architecture.setting;
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:1,side:T.DoubleSide}),bark=mat(0x76614c),green=mat(0x6d8058),pale=mat(0xc5b18b),ice=mat(0xd5e7e8),stone=mat(0x8a8e87);
 const mesh=(geo,m,p,n)=>{const o=new T.Mesh(geo,m);o.position.copy(p);o.name=n;o.castShadow=o.receiveShadow=true;group.add(o);return o;};
 const plant=(form,q)=>{
  if(form==='none')return;
  if(/grass|tussock|heath|low-shrub/.test(form)){
   for(let j=0;j<13;j++){const a=j*2.4,o=mesh(new T.ConeGeometry(.025,form==='tussock'?.7:.32,3),green,q.clone().add(new T.Vector3(Math.cos(a)*.3,.16,Math.sin(a)*.3)),'Low '+form+' vegetation');o.rotation.z=Math.sin(a)*.35;}return;
  }
  if(form==='cactus'){
   mesh(new T.CylinderGeometry(.18,.23,2.2,10),green,q.clone().add(new T.Vector3(0,1.1,0)),'Dryland columnar cactus');for(const s of [-1,1])mesh(new T.CylinderGeometry(.1,.12,1.1,8),green,q.clone().add(new T.Vector3(s*.45,1.3,0)),'Cactus upright arm');result.obstacles.push({x:q.x,z:q.z,halfX:.7,halfZ:.3});return;
  }
  if(form==='pandanus'){
   mesh(new T.CylinderGeometry(.12,.18,2.5,8),bark,q.clone().add(new T.Vector3(0,1.25,0)),'Pandanus branching trunk');for(let j=0;j<17;j++){const a=j*2.4,o=mesh(new T.BoxGeometry(.1,.035,1.7),green,q.clone().add(new T.Vector3(Math.sin(a)*.8,2.5+(j%3)*.15,Math.cos(a)*.8)),'Pandanus strap leaf');o.rotation.set(.28,a,0);}result.obstacles.push({x:q.x,z:q.z,halfX:.4,halfZ:.4});return;
  }
  // The established tree renderer replaces these staging meshes with leaf/branch studies.
  mesh(new T.CylinderGeometry(.3,.6,6,8),bark,q.clone().add(new T.Vector3(0,3,0)),'Tree form placement');mesh(new T.IcosahedronGeometry(2.3,1),green,q.clone().add(new T.Vector3(0,6,0)),'Tree canopy placement');result.obstacles.push({x:q.x,z:q.z,halfX:.6,halfZ:.6});
 };
 const trees=profile.planting.trees,converted=trees.map(f=>/palm/.test(f)?'palm':/norfolk-pine|araucaria/.test(f)?'pine':/ceiba|mahogany|pisonia|ficus|ombu/.test(f)?'buttress-tree':/divi-divi/.test(f)?'acacia':f);
 for(let i=0;i<3;i++){
  let q;for(let j=0;j<2200;j++){const a=i*2.1+j*2.4,r=26+Math.sqrt(j)*.4,p=ground(spawn.x+Math.cos(a)*r,spawn.z+Math.sin(a)*r);if(p&&Math.hypot(p.x,p.z)<55&&result.visits.every(v=>v.target.distanceTo(p)>9)){q=p;break;}}
  if(!q)continue;
  const label=setting==='glacier'?['Ice ridge','Snow basin','Exposed moraine'][i]:setting==='polar'?['Coastal rock','Open colony habitat','Low vegetation study'][i]:setting==='reef'?['Coral-cay ground','Coastal vegetation','Exposed shore stone'][i]:[trees[0].replaceAll('-',' ')+' planting',trees[1].replaceAll('-',' ')+' planting','Open landscape clearing'][i];
  result.visits.push({name:profile.name+' — '+label,point:q.clone().add(new T.Vector3(0,0,3)),target:q.clone().add(new T.Vector3(0,1,0)),viewOffset:new T.Vector3(8,7,10)});result.clearings.push({x:q.x,z:q.z,radius:5});
  if(setting==='glacier'||setting==='polar'||trees[0]==='none'||i===2){for(let j=0;j<6;j++){const p=ground(q.x+Math.cos(j*2.4)*2,q.z+Math.sin(j*2.4)*2);if(!p)continue;const o=mesh(new T.IcosahedronGeometry(.6+j*.08,1),setting==='glacier'?ice:setting==='reef'?pale:stone,p,'Grounded '+label);o.scale.set(1,.4+(j%3)*.2,1);o.position.y+=.15;}result.obstacles.push({x:q.x,z:q.z,halfX:2.7,halfZ:2.7});}
  if(trees[0]!=='none'&&i<2)for(let j=0;j<(profile.exhibitOnly?3:5);j++){const p=ground(q.x+Math.cos(j*2.4)*3,q.z+Math.sin(j*2.4)*3);if(p)plant(trees[i],p);}
 }
 refineTreeStudies(T,result,{ground,profile:{...profile,refinement:{...profile.refinement,tree:converted[0],secondary:converted[1]}}});
 // Keep visible botanical labels tied to the selected form even where leaf-rendering primitives are shared.
 const studies=group.children.filter(o=>o.userData.treeForm);studies.forEach((g,i)=>{const form=trees[i%2];g.name=form.replaceAll('-',' ')+' planting study';g.userData.selectedPlant=form;if(/norfolk|araucaria/.test(form))g.scale.set(.8,1.25,.8);if(form==='divi-divi'){g.rotation.z=.16;g.scale.y=.8;}if(/sea-grape|calabash|breadfruit/.test(form))g.scale.set(.8,.65,.8);});
 return result;
}

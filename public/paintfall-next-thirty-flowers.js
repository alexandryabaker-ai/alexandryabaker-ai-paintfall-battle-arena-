import {addCaucasusFlowers} from './paintfall-caucasus-flowers.js';
export function addNextThirtyFlowers(T,args){
 const shape=args.profile.flower.shape,original=['rose','iris','anemone','cyclamen'].includes(shape),group=addCaucasusFlowers(T,{...args,profile:{...args.profile,flower:{...args.profile.flower,shape:original?shape:'anemone'}}});
 if(original)return group;
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95}),green=mat(0x82977c),petal=mat(args.profile.flower.color);
 const ell=(g,n,x,y,z,sx,sy,sz,m)=>{const o=new T.Mesh(new T.SphereGeometry(1,8,6),m);o.name=n;o.position.set(x,y,z);o.scale.set(sx,sy,sz);g.add(o);};
 for(const plant of group.children){if(shape==='jasmine'){for(const o of [...plant.children]){if(o.name==='Open anemone tepal'){o.scale.x=.12;o.scale.z=.045;o.name='Slender jasmine petal';}if(o.name==='Anemone dark center')o.scale.setScalar(.02);}}
  if(shape==='desert-rose'){ell(plant,'Swollen desert rose stem',0,.18,0,.13,.23,.12,green);for(const o of plant.children.filter(o=>o.name==='Open anemone tepal')){o.name='Desert rose flared petal';o.scale.x=.14;}ell(plant,'Desert rose pale throat',0,.555,0,.055,.025,.055,mat(0xe6d8c9));}
  if(shape==='hibiscus'){for(const o of plant.children.filter(o=>o.name==='Open anemone tepal')){o.name='Hibiscus broad petal';o.scale.x=.19;o.scale.z=.12;}const stamen=new T.Mesh(new T.CylinderGeometry(.012,.018,.24,6),mat(0xd6bf78));stamen.position.y=.66;stamen.name='Hibiscus projecting staminal column';plant.add(stamen);}
  if(shape==='spike'){for(const o of [...plant.children])if(/anemone/i.test(o.name))plant.remove(o);for(let j=0;j<6;j++)for(let k=0;k<5;k++){const a=k*Math.PI*2/5;ell(plant,'Tubular poker flower',Math.cos(a)*.07,.5+j*.06,Math.sin(a)*.07,.035,.07,.035,j<3?mat(0xd5bb72):petal);}}
 }return group;
}

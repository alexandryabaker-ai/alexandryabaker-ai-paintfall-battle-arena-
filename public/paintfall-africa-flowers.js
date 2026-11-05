import {addNextThirtyFlowers} from './paintfall-next-thirty-flowers.js';
export function addAfricaFlowers(T,args){
 const shape=args.profile.flower.shape,custom=['protea','umbel','cluster','daisy','periwinkle','flame','aloe'].includes(shape),group=addNextThirtyFlowers(T,{...args,profile:{...args.profile,flower:{...args.profile.flower,shape:custom?'hibiscus':shape}}});if(!custom)return group;
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95}),petal=mat(args.profile.flower.color),green=mat(0x859a79),cream=mat(0xd9ccb1),dark=mat(0x7e786b);
 const ell=(g,n,x,y,z,sx,sy,sz,m)=>{const o=new T.Mesh(new T.SphereGeometry(1,9,7),m);o.name=n;o.position.set(x,y,z);o.scale.set(sx,sy,sz);g.add(o);return o;};
 for(const plant of group.children){for(const o of [...plant.children])if(/anemone|hibiscus/i.test(o.name))plant.remove(o);
  if(shape==='protea'){for(let row=0;row<3;row++)for(let k=0;k<12;k++){const a=k*Math.PI/6+row*.16;ell(plant,'Protea pointed bract',Math.cos(a)*(.16+row*.035),.56+row*.07,Math.sin(a)*(.16+row*.035),.055,.14,.055,petal);}ell(plant,'Protea central flower head',0,.66,0,.13,.14,.13,cream);}
  if(['umbel','cluster'].includes(shape))for(let k=0;k<14;k++){const a=k*2.4,r=Math.sqrt(k/14)*.2;ell(plant,shape==='umbel'?'Agapanthus tubular flower':'Ixora clustered flower',Math.cos(a)*r,.58+Math.sin(k)*.035,Math.sin(a)*r,.035,.06,.035,petal);}
  if(shape==='daisy'||shape==='periwinkle'){for(let k=0;k<(shape==='daisy'?14:5);k++){const a=k*Math.PI*2/(shape==='daisy'?14:5),o=ell(plant,'Open garden petal',Math.cos(a)*.13,.55,Math.sin(a)*.13,shape==='daisy'?.15:.12,.025,.045,petal);o.rotation.y=-a;}ell(plant,'Garden flower center',0,.57,0,.055,.025,.055,shape==='daisy'?dark:cream);}
  if(shape==='flame')for(let k=0;k<6;k++){const a=k*Math.PI/3,o=ell(plant,'Recurved flame lily tepal',Math.cos(a)*.12,.67,Math.sin(a)*.12,.045,.17,.04,petal);o.rotation.z=.5;}
  if(shape==='aloe'){for(let k=0;k<35;k++){const a=k*2.4,r=.05+k*.007,o=ell(plant,'Spiral aloe leaf',Math.cos(a)*r,.08+k*.003,Math.sin(a)*r,.12,.03,.04,green);o.rotation.y=-a;}for(let k=0;k<12;k++){const a=k*2.4;ell(plant,'Aloe tubular flower',Math.cos(a)*.07,.48+k*.02,Math.sin(a)*.07,.025,.06,.025,petal);}}
 }return group;
}

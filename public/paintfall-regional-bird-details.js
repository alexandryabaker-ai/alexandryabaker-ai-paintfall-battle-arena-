export function addRegionalBirdDetails(T,{root,head,spec,coat,sphere,rod}){
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.9}),gold=mat(0xe5ce82),blue=mat(0x78a2bd),cream=mat(0xe9e1ce),dark=mat(0x424c53),red=mat(0xc47966),green=mat(0x708c6a);
 if(spec.variant==='cockatoo'){
  sphere(head,0,0,.02,.115,.15,.175,cream);for(let j=0;j<5;j++){const crest=sphere(head,(j-2)*.025,.2+j*.025,-.11,.024,.14,.065,gold);crest.rotation.x=-.3;crest.name='Cockatoo yellow crest';}sphere(head,0,-.025,.22,.065,.1,.08,dark);
 }else if(spec.variant==='sparrow'){
  sphere(head,0,0,.02,.115,.15,.175,dark);for(const side of [-1,1])sphere(head,side*.085,-.05,.1,.032,.065,.075,cream);sphere(head,0,-.01,.22,.05,.07,.07,gold);
 }else if(spec.variant==='imperial-pigeon')sphere(head,0,0,.02,.115,.15,.175,coat);
 else if(spec.variant==='lorikeet'){sphere(head,0,0,.02,.115,.15,.175,gold);sphere(head,0,-.02,.22,.055,.08,.06,red);sphere(root,0,.5,.3,.15,.19,.09,gold);}
 else if(spec.variant==='crowned-pigeon'){
  sphere(head,0,0,.02,.115,.15,.175,coat);sphere(root,0,.5,.3,.15,.2,.1,red);for(let j=0;j<11;j++){const a=(j-5)*.13,tip=new T.Vector3(Math.sin(a)*.4,.18+Math.cos(a)*.4,-.03+Math.sin(a)*.18);rod(head,new T.Vector3(0,.15,-.03),tip,.012,blue);sphere(head,tip.x,tip.y,tip.z,.045,.035,.024,cream).name='Crowned-pigeon lace tip';}
 }else if(spec.variant==='bird-of-paradise'){
  sphere(head,0,0,.02,.115,.15,.175,gold);sphere(head,0,-.1,.11,.095,.09,.12,green);for(const side of [-1,1])for(let j=0;j<6;j++){const plume=sphere(root,side*(.22+j*.025),.48,-.35-j*.05,.045,.07,.55,red);plume.rotation.x=-.28-j*.03;plume.rotation.z=side*.2;plume.name='Raggiana flank plume';}
 }
}

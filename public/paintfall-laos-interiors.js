import {buildVietnamInteriors as buildInteriorStudies} from './paintfall-vietnam-interiors.js';
// Reuse cutaway mechanics; furniture is an original PAINTFALL proposal.
export function buildLaosInteriors(T,{neighborhood}){
 const result=buildInteriorStudies(T,{neighborhood});
 const bamboo=new T.MeshStandardMaterial({color:0xc5aa7a,roughness:.95});
 for(const [index,study]of result.studies.entries()){
  study.furnishing.name='Riverweave home '+(index+1)+' furnishings';
  const basket=new T.Mesh(new T.CylinderGeometry(.28,.23,.35,12,true),bamboo);basket.position.set(-1.6,study.floor+.18,1.5);basket.name='Storage basket study';study.furnishing.add(basket);
  const stool=new T.Mesh(new T.CylinderGeometry(.3,.32,.3,12),bamboo);stool.position.set(-1.65,study.floor+.15,-.65);stool.name='Low woven-color stool';study.furnishing.add(stool);
 }
 return result;
}
export function createLaosInteriorControls(T,{interiors,walking,camera,controls}){
 const tools=document.createElement('section');tools.id='laos-interiors';const title=document.createElement('h3');title.textContent='Riverweave home interiors';const note=document.createElement('p');note.className='note';note.textContent='Original furnished cutaway proposals. Raised floors and verandas remain visible; walking inside is not enabled yet.';tools.append(title,note);document.getElementById('wildlife-tools').after(tools);
 for(const [index,study]of interiors.studies.entries()){const button=document.createElement('button');button.textContent='Look inside Riverweave home '+(index+1);button.onclick=()=>{walking.setActive(false);interiors.show(index);controls.minDistance=3;controls.target.copy(study.home.position).add(new T.Vector3(0,study.floor+.8,0));camera.position.copy(study.home.position).add(new T.Vector3(6,study.floor+7,9));controls.update();};tools.append(button);}
 const restore=document.createElement('button');restore.textContent='Restore Laos house exteriors';restore.onclick=()=>interiors.restore();tools.append(restore);return{tools,dispose(){interiors.restore();tools.remove();}};
}

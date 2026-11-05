// Original PAINTFALL furnishing proposals, not claims about traditional household layouts.
export function buildVietnamInteriors(T,{neighborhood}){
 const studies=[],materials={wood:new T.MeshStandardMaterial({color:0x92735e,roughness:.9}),cream:new T.MeshStandardMaterial({color:0xe4d4b5,roughness:.9}),violet:new T.MeshStandardMaterial({color:0xb69bce,roughness:.9}),green:new T.MeshStandardMaterial({color:0x94b99e,roughness:.9})};
 function box(parent,name,x,y,z,w,h,d,material){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.name=name;mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 for(const [index,home] of neighborhood.homes.entries()){
  const floor=home.userData.floorLevel+.1,shell=home.userData.cutawayShell;if(!shell)continue;
  const furnishing=new T.Group();furnishing.name='Vietnam home '+(index+1)+' interior study';furnishing.userData.style=home.userData.style;home.add(furnishing);
  const stilt=home.userData.style==='stilt';
  box(furnishing,'Woven-color mat',0,floor+.025,.2,3.5,.05,3.6,materials.cream);
  for(let i=0;i<8;i++)box(furnishing,'Mat stripe',0,floor+.052,-1.3+i*.42,3.3,.008,.06,materials.violet);
  box(furnishing,'Low gathering table',-.65,floor+.48,.25,1.5,.12,1.05,materials.wood);
  for(const x of [-1.2,-.1])for(const z of [-.1,.6])box(furnishing,'Table leg',x,floor+.2,z,.09,.4,.09,materials.wood);
  for(const z of [-.8,1.35])box(furnishing,'Floor cushion',-.65,floor+.12,z,.6,.18,.6,stilt?materials.green:materials.violet);
  box(furnishing,'Storage shelf',1.65,floor+.62,-1.8,.85,1.2,.65,materials.wood);
  for(const y of [.35,.8,1.25])box(furnishing,'Shelf accent',1.65,floor+y,-1.43,.8,.06,.08,materials.violet);
  box(furnishing,'Sleeping platform',.8,floor+.2,1.3,1.25,.35,1.8,materials.wood);
  box(furnishing,'Sleeping mat',.8,floor+.39,1.3,1.2,.03,1.7,materials.green);
  box(furnishing,'Pillow',.8,floor+.47,.7,.8,.13,.3,materials.cream);
  box(furnishing,'Lantern stand',-1.7,floor+.7,-1.8,.07,1.4,.07,materials.wood);
  const shade=new T.Mesh(new T.SphereGeometry(.2,10,8),materials.violet);shade.name='Decorative lantern shade';shade.position.set(-1.7,floor+1.6,-1.8);furnishing.add(shade);
  const study={home,shell,furnishing,floor,style:home.userData.style,index};studies.push(study);
 }
 let active=null;const snapshots=new Map();
 function restore(){for(const [shell,visible]of snapshots)shell.visible=visible;snapshots.clear();active=null;}
 function show(index){restore();const study=studies[index];if(!study)return null;snapshots.set(study.shell,study.shell.visible);study.shell.visible=false;active=study;return study;}
 return{studies,show,restore,get active(){return active;}};
}

export function createVietnamInteriorControls(T,{interiors,camera,controls,walking}){
 const tools=document.createElement('section');tools.id='vietnam-interiors';const title=document.createElement('h3');title.textContent='Lanternbrush home interiors';
 const note=document.createElement('p');note.className='note';note.textContent='Furnished inspection cutaways. Original PAINTFALL room layouts; walking into houses is not enabled yet.';tools.append(title,note);document.getElementById('wildlife-tools').after(tools);
 for(const study of interiors.studies){const button=document.createElement('button');button.textContent='Look inside '+(study.style==='stilt'?'raised timber':'yellow-wall')+' home '+(study.index+1);button.onclick=()=>{walking.setActive(false);const view=interiors.show(study.index);controls.minDistance=3;controls.target.copy(view.home.position).add(new T.Vector3(0,view.floor+.8,0));camera.position.copy(view.home.position).add(new T.Vector3(6,view.floor+7,9));controls.update();};tools.append(button);}
 const restore=document.createElement('button');restore.textContent='Restore Vietnam house exteriors';restore.onclick=()=>interiors.restore();tools.append(restore);
 return{tools,dispose(){interiors.restore();tools.remove();}};
}

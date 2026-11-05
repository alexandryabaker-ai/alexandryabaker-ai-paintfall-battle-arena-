import {buildVietnamInteriors as buildInteriorStudies} from './paintfall-vietnam-interiors.js';
export function buildBatchInteriors(T,{neighborhood,profile}){
 const result=buildInteriorStudies(T,{neighborhood});for(const [i,s]of result.studies.entries()){s.furnishing.name=profile.homeName+' '+(i+1)+' furnishings';s.furnishing.traverse(o=>{if(o.name==='Mat stripe')o.material.color.set(profile.theme==='floodplain'?0x8cafaa:profile.theme==='lake-gardens'?0xb5a18c:0xd0ac80);});}
 if(!profile.finalFoundation)return result;
 // Generic furnishing studies are inspected separately from open courtyards and regional shells.
 const hide=()=>result.studies.forEach(s=>s.furnishing.visible=false);hide();
 return{studies:result.studies,show(i){hide();const s=result.show(i);if(s)s.furnishing.visible=true;return s;},restore(){result.restore();hide();},get active(){return result.active;}};
}
export function createBatchInteriorControls(T,{interiors,profile,walking,camera,controls}){
 const tools=document.createElement('section');tools.id='batch-interiors';const title=document.createElement('h3');title.textContent=profile.homeName+' interiors';const note=document.createElement('p');note.className='note';note.textContent='Original furnished inspection views. Regional room layouts and walking inside remain open for later refinement.';tools.append(title,note);document.getElementById('wildlife-tools').after(tools);
 for(const [i,s]of interiors.studies.entries()){const button=document.createElement('button');button.textContent='Look inside '+profile.homeName+' '+(i+1);button.onclick=()=>{walking.setActive(false);interiors.show(i);const scale=s.home.scale.x;controls.minDistance=3*scale;controls.target.copy(s.home.position).add(new T.Vector3(0,s.floor+.8,0).multiplyScalar(scale));camera.position.copy(s.home.position).add(new T.Vector3(6,s.floor+7,9).multiplyScalar(scale));controls.update();};tools.append(button);}
 const restore=document.createElement('button');restore.textContent='Restore house exteriors';restore.onclick=()=>interiors.restore();tools.append(restore);return{tools,dispose(){interiors.restore();tools.remove();}};
}

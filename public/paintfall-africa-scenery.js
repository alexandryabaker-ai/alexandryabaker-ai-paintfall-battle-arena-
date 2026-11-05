import {buildNextThirtyScenery} from './paintfall-next-thirty-scenery.js';
export function buildAfricaScenery(T,args){
 const p=args.profile,result=buildNextThirtyScenery(T,args),mat=new T.MeshStandardMaterial({color:p.style==='desert'?0xc2ac82:0x93a382,roughness:1});
 // Add low reeds/tussocks within the already-reserved rock clearing; no new walking obstacles.
 const site=result.clearings.at(-1);if(site)for(let j=0;j<18;j++){const a=j*2.4,r=3+(j%3),q=args.ground(site.x+Math.cos(a)*r,site.z+Math.sin(a)*r);if(!q)continue;const h=['wetland','lake'].includes(p.style)?1.15:.45,o=new T.Mesh(new T.ConeGeometry(.1,h,5),mat);o.name=h>1?'Wetland reed study':'Low clearing grass tuft';o.position.copy(q);o.position.y+=h/2;result.group.add(o);}return result;
}

import {refineTreeStudies} from './paintfall-regional-tree-studies.js';
import {buildHimalayaDeltaScenery} from './paintfall-himalaya-delta-scenery.js';
export function buildNextThirtyScenery(T,args){
 const result=buildHimalayaDeltaScenery(T,args),p=args.profile;
 result.group.traverse(o=>{if(o.name==='Valley boulder study'){const dry=p.style==='desert';o.scale.y*=dry?.45:p.style==='wetland'?.32:.85;o.scale.x*=dry?1.35:1;o.material.color.setHex(dry?0xbda586:p.style==='coast'?0xb3b5a6:0x9ca593);o.name=dry?'Low dryland rock shelf':p.style==='wetland'?'Riverbank stone':'Wooded ridge rock';}});
 return refineTreeStudies(T,result,args);
}

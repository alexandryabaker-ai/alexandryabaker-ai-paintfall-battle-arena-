import {buildHimalayaDeltaScenery} from './paintfall-himalaya-delta-scenery.js';
export function buildSouthAsiaScenery(T,args){
 const result=buildHimalayaDeltaScenery(T,args),visit=result.visits[2];if(visit&&args.profile.theme!=='tiled-veranda'){const Tgt=visit.target,p=args.ground(Tgt.x,Tgt.z),m=new T.MeshStandardMaterial({color:args.profile.theme==='sandstone-court'?0xc2ac8d:0xa6a395,roughness:1});if(p){for(const side of [-1,1]){const q=args.ground(p.x+side*3,p.z);if(!q)continue;const o=new T.Mesh(new T.BoxGeometry(1.4,4.2,1.5),m);o.position.set(q.x,q.y+2.1,q.z);o.name='Rock passage side';result.group.add(o);result.obstacles.push({x:q.x,z:q.z,halfX:.8,halfZ:.8});}const o=new T.Mesh(new T.BoxGeometry(7,1,1.7),m);o.position.set(p.x,p.y+4.5,p.z);o.name='Schematic rock passage cap';result.group.add(o);}}
 return result;
}

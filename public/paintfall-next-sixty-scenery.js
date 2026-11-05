import {buildNextThirtyScenery} from './paintfall-next-thirty-scenery.js';
export function buildNextSixtyScenery(T,args){
 const result=buildNextThirtyScenery(T,args);
 // Narrow islands need a smaller third clearing rather than a continental footprint.
 if(result.visits.length<3){for(let j=0;j<1200&&result.visits.length<3;j++){const a=j*2.4,r=4+Math.sqrt(j)*.5,q=args.ground(args.spawn.x+Math.cos(a)*r,args.spawn.z+Math.sin(a)*r);if(!q||Math.hypot(q.x,q.z)>54||result.visits.some(v=>q.distanceTo(v.target)<5)||result.obstacles.some(o=>Math.abs(q.x-o.x)<o.halfX+1.5&&Math.abs(q.z-o.z)<o.halfZ+1.5))continue;const rock=new T.Mesh(new T.IcosahedronGeometry(.65,1),new T.MeshStandardMaterial({color:0xb9b29b,roughness:1}));rock.position.copy(q);rock.position.y+=.35;rock.scale.y=.5;rock.name='Small island garden stone';result.group.add(rock);result.clearings.push({x:q.x,z:q.z,radius:2});result.visits.push({name:args.profile.features[0],point:q.clone().add(new T.Vector3(0,0,1)),target:q.clone().add(new T.Vector3(0,.5,0)),viewOffset:new T.Vector3(8,8,10)});}}
 return result;
}

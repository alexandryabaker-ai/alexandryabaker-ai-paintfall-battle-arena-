import {countryFinalMap} from './paintfall-country-final-map.js';
import {buildFinalHomes} from './paintfall-final-homes.js';
import {buildFinalScenery} from './paintfall-final-scenery.js';
import {buildLaosWildlife} from './paintfall-laos-wildlife.js';

// First regional arena: retain the shared, server-authoritative match footprint.
// Residential and wildlife areas sit beyond its visibly marked playing boundary.
export function buildMexicoArena(T, scene, outline) {
  const group = new T.Group();
  group.name = 'Mexico • first regional arena';
  scene.add(group);
  const surface = new T.Mesh(new T.PlaneGeometry(170, 170),
    new T.MeshStandardMaterial({color:0xbdbb91, roughness:1}));
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = .012;
  surface.receiveShadow = true;
  surface.name = 'Level limestone-colored match clearing';
  group.add(surface);
  const outsideMatch = (x,z) => Math.abs(x)>30 || Math.abs(z)>25;
  const ground = (x,z) => Math.hypot(x,z)<76 && outsideMatch(x,z)
    ? new T.Vector3(x,.012,z) : null;
  const profile = countryFinalMap.Mexico, spawn = new T.Vector3();
  const scenery = buildFinalScenery(T,{land:group,ground,spawn,profile});
  const homes = buildFinalHomes(T,{land:group,ground,spawn,occupied:scenery.obstacles,profile});
  const obstacles = [...scenery.obstacles,...homes.obstacles];
  const explorer = {position:new T.Vector3()};
  let elapsed = 0;
  const wildlife = buildLaosWildlife(T,{land:group,ground,explorer,
    canOccupy:(x,z)=>!!ground(x,z)&&!obstacles.some(o=>Math.abs(x-o.x)<o.halfX+1&&Math.abs(z-o.z)<o.halfZ+1),
    roster:profile.roster,regionName:'Mexico',getInteractionTime:()=>elapsed});
  const points = [...outline,outline[0]].map(([x,z])=>new T.Vector3(x,.045,z));
  const boundary = new T.Line(new T.BufferGeometry().setFromPoints(points),
    new T.LineBasicMaterial({color:0x236b62}));
  boundary.name = 'Shared multiplayer match boundary';
  group.add(boundary);
  return {group,homes,scenery,wildlife,update(dt,playerPosition){
    elapsed += dt;
    if(playerPosition)explorer.position.copy(playerPosition);
    wildlife.update(dt);
  }};
}

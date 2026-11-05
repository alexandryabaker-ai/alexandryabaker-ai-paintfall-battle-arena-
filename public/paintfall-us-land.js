function describeCountryWildlife(p){const n=p.roster.length;return (n?n+' wildlife '+(n===1?'individual':'individuals')+': '+p.roster.map(a=>a.kind).join(', ')+'. Early models with optional interaction; busy or elevated animals can choose space. ':'Landscape-only preview. ')+(p.wildlifeNote||'');}
import {countryFinalMap} from './paintfall-country-final-map.js';
import {countryNextSixty} from './paintfall-country-next-sixty.js';
import {refinementFor} from './paintfall-regional-refinement-profiles.js';
import {countryAfricaThirty} from './paintfall-country-africa-thirty.js';
import {addAfricaFlowers} from './paintfall-africa-flowers.js';
import {countryNextThirty} from './paintfall-country-next-thirty.js';
import {addNextThirtyFlowers} from './paintfall-next-thirty-flowers.js';
import {addCaucasusFlowers} from './paintfall-caucasus-flowers.js';
import {countryBatchOne} from './paintfall-country-batch-one.js';
import {countryBatchTwo} from './paintfall-country-batch-two.js';
import {countryBatchThree} from './paintfall-country-batch-three.js';
import {countryBatchFour} from './paintfall-country-batch-four.js';
import {countryBatchFive} from './paintfall-country-batch-five.js';
import {countryBatchSix} from './paintfall-country-batch-six.js';
import {countryBatchSeven} from './paintfall-country-batch-seven.js';
import {countryBatchEight} from './paintfall-country-batch-eight.js';
import {countryBatchNine} from './paintfall-country-batch-nine.js';
import {countryBatchTen} from './paintfall-country-batch-ten.js';
import {countryBatchEleven} from './paintfall-country-batch-eleven.js';
import {countryBatchTwelve} from './paintfall-country-batch-twelve.js';
import {countryBatchThirteen} from './paintfall-country-batch-thirteen.js';
import {countryBatchFourteen} from './paintfall-country-batch-fourteen.js';
import {countryBatchFifteen} from './paintfall-country-batch-fifteen.js';
import {countryBatchSixteen} from './paintfall-country-batch-sixteen.js';
import {addCentralAsiaFlowers} from './paintfall-central-asia-flowers.js';
const countryBatches={...countryBatchOne,...countryBatchTwo,...countryBatchThree,...countryBatchFour,...countryBatchFive,...countryBatchSix,...countryBatchSeven,...countryBatchEight,...countryBatchNine,...countryBatchTen,...countryBatchEleven,...countryBatchTwelve,...countryBatchThirteen,...countryBatchFourteen,...countryBatchFifteen,...countryBatchSixteen,...countryNextThirty,...countryAfricaThirty,...countryNextSixty,...countryFinalMap};
import {buildBatchScenery} from './paintfall-batch-scenery.js';
import {addSparseFieldFlowers} from './paintfall-island-scenery.js';
import {addSouthAsiaFlowers} from './paintfall-south-asia-flowers.js';
import {buildBatchHomes} from './paintfall-batch-homes.js';
import {buildBatchInteriors,createBatchInteriorControls} from './paintfall-batch-interiors.js';
import {buildLaosInteriors,createLaosInteriorControls} from './paintfall-laos-interiors.js';
import {buildLaosScenery} from './paintfall-laos-scenery.js';
import {buildLaosNeighborhood} from './paintfall-laos-neighborhood.js';
import {buildLaosWildlife} from './paintfall-laos-wildlife.js';
import {buildVietnamWildlife,createVietnamWildlifeControls} from './paintfall-vietnam-wildlife.js';
import {buildVietnamInteriors,createVietnamInteriorControls} from './paintfall-vietnam-interiors.js';
import {buildVietnamScenery} from './paintfall-vietnam-scenery.js';
import {finishThailandPreview} from './paintfall-thailand-details.js';
import {buildThailandWildlife} from './paintfall-thailand-wildlife.js';
import {buildThailandNeighborhood} from './paintfall-thailand-neighborhood.js';
import {buildThailandScenery} from './paintfall-thailand-scenery.js';
import {buildVietnamNeighborhood} from './paintfall-vietnam-neighborhood.js';
import {buildChinaNeighborhood} from './paintfall-china-neighborhood.js';
import {buildChinaScenery} from './paintfall-china-scenery.js';
import {buildKoreaNeighborhood} from './paintfall-korea-neighborhood.js';
import {buildJapanNeighborhood} from './paintfall-japan-neighborhood.js';
import {buildJapanScenery} from './paintfall-japan-scenery.js';
import {buildRegionalScenery} from './paintfall-regional-scenery.js';
import * as T from 'three';

const countryMode=new URLSearchParams(location.search).get('region')==='country';
const countryFoundations={},countryIdentities={};
import {OrbitControls} from '/vendor/OrbitControls.js';
import {createLandWalking} from './paintfall-land-walking.js';
import {buildLandScenery} from './paintfall-land-scenery.js';
import {buildWisconsinNeighborhood} from './paintfall-wisconsin-neighborhood.js';
import {buildWisconsinWildlife} from './paintfall-wisconsin-wildlife.js';
import {createAnimalInteractions} from './paintfall-animal-interactions.js';
import {buildWisconsinLandmarks} from './paintfall-wisconsin-landmarks.js';
import {buildCaliforniaScenery} from './paintfall-california-scenery.js';
import {buildUtahScenery} from './paintfall-utah-scenery.js';
import {buildIdahoScenery} from './paintfall-idaho-scenery.js';
import {buildOregonScenery} from './paintfall-oregon-scenery.js';
import {buildWashingtonScenery} from './paintfall-washington-scenery.js';

const host=document.getElementById('land-view'),status=document.getElementById('land-status'),select=document.getElementById('land-state');
const scene=new T.Scene();scene.background=new T.Color('#aecbd8');scene.fog=new T.Fog('#aecbd8',450,900);
const camera=new T.PerspectiveCamera(48,1,.1,1500),renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;host.prepend(renderer.domElement);renderer.domElement.setAttribute('aria-label','PAINTFALL landscape, housing and wildlife construction preview');
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=35;controls.maxDistance=650;controls.maxPolarAngle=Math.PI*.48;
scene.add(new T.HemisphereLight(0xf5ffff,0x788981,2));const sunlight=new T.DirectionalLight(0xffedcb,2.4);sunlight.position.set(-80,140,70);sunlight.shadow.mapSize.set(1024,1024);Object.assign(sunlight.shadow.camera,{left:-105,right:105,top:105,bottom:-105,near:1,far:400});sunlight.shadow.normalBias=.06;sunlight.shadow.bias=-.0002;scene.add(sunlight);
const water=new T.Mesh(new T.PlaneGeometry(850,850),new T.MeshStandardMaterial({color:0x78b5c6,roughness:.35}));water.rotation.x=-Math.PI/2;water.position.y=-3;scene.add(water);
let batchInteriors=null,batchInteriorControls=null;let laosInteriors=null,laosInteriorControls=null;let thailandDetails=null,vietnamInteriors=null,vietnamInteriorControls=null,vietnamWildlifeControls=null;
let land=null,selectedFeature=null,buildCount=0,wildlife=null,wildlifeFocus=null;const closeupHidden=new Set();function restoreCloseup(){closeupHidden.forEach(o=>o.visible=true);closeupHidden.clear();}
const walking=createLandWalking(T,{scene,camera,controls,host});
const interactions=createAnimalInteractions({walking,getWildlife:()=>wildlife});
function reset(){batchInteriors?.restore();laosInteriors?.restore();vietnamInteriors?.restore();restoreCloseup();wildlifeFocus=null;camera.up.set(0,1,0);camera.position.set(150,150,170);controls.target.set(0,7,0);controls.update();}
function clearWildlifeView(a){const scale=a.previewScale??1;const target=a.root.position.clone().add(new T.Vector3(0,a.focusHeight||.8,0)),ray=new T.Raycaster(),blockers=land.children.filter(o=>o!==wildlife.group);for(const y of [4,7,10])for(let i=0;i<16;i++){const angle=i/16*Math.PI*2,eye=a.root.position.clone().add(new T.Vector3(Math.sin(angle)*7*scale,y*scale,Math.cos(angle)*7*scale)),delta=eye.clone().sub(target);ray.set(target,delta.clone().normalize());ray.near=.3;ray.far=delta.length();if(!ray.intersectObjects(blockers,true).length){camera.position.copy(eye);return;}}camera.position.copy(a.root.position).add(new T.Vector3(0,12*scale,7*scale));}
const colors={ice:['#b8dfed','#e5f5f6'],desert:['#d8b991','#b59ac8'],volcano:['#9291af','#e6c0de'],mountain:['#93b799','#c6c4df'],lake:['#a9c5a0','#cbe2bd'],coast:['#d2caa9','#a5cead'],wetland:['#95bda8','#bbd6ad'],river:['#a1c19b','#d3d8ad'],prairie:['#bec997','#e7d69c'],forest:['#83ae95','#b4d0aa'],cave:['#b8bc9a','#d4bdd1']};
function build(feature,componentIndex=null){
 if(walking.active)walking.setActive(false);
 batchInteriorControls?.dispose();batchInteriorControls=null;batchInteriors=null;laosInteriorControls?.dispose();laosInteriorControls=null;laosInteriors=null;vietnamWildlifeControls?.dispose();vietnamWildlifeControls=null;vietnamInteriorControls?.dispose();vietnamInteriorControls=null;vietnamInteriors=null;thailandDetails?.dispose();thailandDetails=null;selectedFeature=feature;const state=feature.properties.name,foundation=countryMode?countryFoundations[state]:window.PAINTFALL_US_FOUNDATIONS[state],identity=countryMode?countryIdentities[state]:window.PAINTFALL_STATE_IDENTITY[state];
 if(land){scene.remove(land);const geometries=new Set(),materials=new Set(),textures=new Set();land.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);});for(const m of materials)for(const value of Object.values(m))if(value?.isTexture)textures.add(value);textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}
 const refinedCountry=countryMode&&countryBatches[state]?.batch>=17&&countryBatches[state]?.batch<=55;renderer.toneMapping=refinedCountry?T.ACESFilmicToneMapping:T.NoToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=refinedCountry;renderer.shadowMap.type=T.PCFSoftShadowMap;sunlight.castShadow=refinedCountry;land=new T.Group();land.name='state-land';scene.add(land);
 const sourcePolygons=feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:[feature.geometry.coordinates];
 let viewFeature=feature,schematic=false;
 if(countryMode){
  if(componentIndex===null)componentIndex=sourcePolygons.reduce((best,p,i)=>d3.geoArea({type:'Polygon',coordinates:p})>d3.geoArea({type:'Polygon',coordinates:sourcePolygons[best]})?i:best,0);
  viewFeature={type:'Feature',properties:feature.properties,geometry:{type:'Polygon',coordinates:sourcePolygons[componentIndex]}};
  const ring=viewFeature.geometry.coordinates[0];
  if(new Set(ring.map(p=>p.join(','))).size<3||d3.geoArea(viewFeature)<1e-12){
   schematic=true;const x=ring.reduce((n,p)=>n+p[0],0)/ring.length,y=ring.reduce((n,p)=>n+p[1],0)/ring.length;
   const outline=Array.from({length:6},(_,i)=>[x+Math.cos(i*Math.PI/3)*.01,y+Math.sin(i*Math.PI/3)*.01]);outline.push(outline[0]);
   if(d3.geoArea({type:'Polygon',coordinates:[outline]})>Math.PI*2)outline.reverse();
   viewFeature={...viewFeature,geometry:{type:'Polygon',coordinates:[outline]}};
  }
  let componentTools=document.getElementById('country-components');if(!componentTools){componentTools=document.createElement('div');componentTools.id='country-components';select.after(componentTools);}componentTools.replaceChildren();
  const label=document.createElement('label');label.textContent='Source land component';label.htmlFor='country-component';const componentSelect=document.createElement('select');componentSelect.id='country-component';
  sourcePolygons.forEach((p,i)=>{const option=document.createElement('option');option.value=i;option.textContent='Land component '+(i+1)+(i===componentIndex?' — current view':'');componentSelect.append(option);});componentSelect.value=componentIndex;componentSelect.onchange=()=>build(feature,Number(componentSelect.value));
  const note=document.createElement('p');note.className='note';note.textContent=schematic?'The source outline collapses at this map resolution. This is a schematic land patch, not the country boundary. Amusement parks will provide travel.':'Each source mainland or island is viewed at its own scale. These are local construction views; amusement parks will provide travel.';componentTools.append(label,componentSelect,note);
 }
 const center=d3.geoCentroid(viewFeature),projection=d3.geoAzimuthalEqualArea().rotate([-center[0],-center[1]]).fitExtent([[-85,-85],[85,85]],viewFeature);
 const polygons=countryMode?[viewFeature.geometry.coordinates]:sourcePolygons,baseMaterial=new T.MeshStandardMaterial({color:0xae98be,roughness:.95});
 for(const polygon of polygons){const projected=polygon.map(ring=>ring.map(c=>projection(c)));if(projected[0].length<4)continue;const shape=new T.Shape(projected[0].map(([x,y])=>new T.Vector2(x,-y)));for(const hole of projected.slice(1))shape.holes.push(new T.Path(hole.map(([x,y])=>new T.Vector2(x,-y))));const base=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:2.5,bevelEnabled:false}),baseMaterial);base.rotation.x=-Math.PI/2;base.position.y=-2.5;land.add(base);}
 const seed=Number(feature.id)||1||[...state].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7),style=identity.style,amplitude=countryBatches[state]?.terrainAmplitude??({ice:24,desert:19,volcano:29,mountain:27,lake:6,coast:7,wetland:4,river:10,prairie:7,forest:14,cave:17}[style]||12);
 const peaks=Array.from({length:4},(_,i)=>({x:Math.sin(seed*1.71+i*2.4)*57,z:Math.cos(seed*.93+i*3.1)*55,r:18+i*5}));
 const projectedPolygons=polygons.map(p=>p.map(r=>r.map(c=>projection(c)))),insideCache=new Map();
 const inside=(x,z)=>{const key=x+','+z;if(!insideCache.has(key))insideCache.set(key,projectedPolygons.some(rings=>d3.polygonContains(rings[0],[x,z])&&!rings.slice(1).some(hole=>d3.polygonContains(hole,[x,z]))));return insideCache.get(key);};
 let stateLake=null;if(state==='Idaho'||state==='Oregon')for(let i=0;i<800&&!stateLake;i++){const r=Math.sqrt(i)*2,a=i*2.4,x=(state==='Oregon'?16:0)+Math.cos(a)*r,z=(state==='Oregon'?18:-4)+Math.sin(a)*r;if(inside(x,z)&&Array.from({length:16},(_,j)=>inside(x+Math.cos(j/16*Math.PI*2)*8,z+Math.sin(j/16*Math.PI*2)*8)).every(Boolean))stateLake={x,z};}function height(x,z){let h=.7;for(const p of peaks){const d=((x-p.x)**2+(z-p.z)**2)/(p.r*p.r);h+=Math.exp(-d)*amplitude*(style==='desert'?.8:1);}h+=Math.sin(x*.13+seed)*Math.cos(z*.11)*(countryBatches[state]?.terrainNoise??1.1);if((state==='Idaho'||state==='Oregon')&&stateLake){const blend=1-T.MathUtils.smoothstep(Math.hypot(x-stateLake.x,z-stateLake.z),4.5,7);h=T.MathUtils.lerp(h,state==='Oregon'?3:2,blend);}if(state==='Wisconsin'){h+=4*Math.exp(-((x+19)**2/48+(z+8)**2/230));const d=Math.hypot(x-18,z+3),d2=Math.hypot(x-18,(z+16)*1.35),blend=Math.max(1-T.MathUtils.smoothstep(d,6,10),1-T.MathUtils.smoothstep(d2,4.5,7));h=T.MathUtils.lerp(h,1.5,blend);}return Math.max(.3,h);}
 const palette=refinedCountry?({desert:['#b99b71','#d2ba8d'],forest:['#647c56','#a2a27b'],coast:['#9b9f76','#b8b38a'],ice:['#b4c9cc','#e0e9e6'],wetland:['#718362','#a4a47e'],lake:['#7c8b62','#aca77e']}[style]||colors.forest):(colors[style]||colors.forest);const vertices=[],vertexColors=[],edges=new Map(),lo=new T.Color(palette[0]),hi=new T.Color(palette[1]),accent=new T.Color(refinedCountry?'#b6ac8f':'#b9a2d3');const step=2;
 function triangle(points){for(let i=0;i<3;i++){const a=points[i],b=points[(i+1)%3],key=[a.join(','),b.join(',')].sort().join('|');const edge=edges.get(key);if(edge)edge.count++;else edges.set(key,{a,b,count:1});}for(const [x,z] of points){const h=height(x,z);vertices.push(x,h,z);const color=lo.clone().lerp(hi,Math.min(1,h/(amplitude*1.2)));if(h>amplitude*.72&&Math.floor(h/3)%4===0)color.lerp(accent,.3);vertexColors.push(color.r,color.g,color.b);}}
 for(let x=-86;x<86;x+=step)for(let z=-86;z<86;z+=step){const a=[x,z],b=[x,z+step],c=[x+step,z+step],d=[x+step,z];if([a,b,c].every(([px,pz])=>inside(px,pz)))triangle([a,b,c]);if([a,c,d].every(([px,pz])=>inside(px,pz)))triangle([a,c,d]);}
 if(countryMode&&vertices.length<90){vertices.length=0;vertexColors.length=0;edges.clear();for(const rings of projectedPolygons){const contour=rings[0].map(([x,z])=>new T.Vector2(x,z)),holes=rings.slice(1).map(r=>r.map(([x,z])=>new T.Vector2(x,z))),points=[...contour,...holes.flat()];for(const indices of T.ShapeUtils.triangulateShape(contour,holes)){const tri=indices.map(i=>[points[i].x,points[i].y]);triangle(tri);}}}
 if(!vertices.length){status.textContent=state+' • Source outline is too small for walking; a detailed outline is needed.';}const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setAttribute('color',new T.Float32BufferAttribute(vertexColors,3));geometry.computeVertexNormals();const walkSurface=new T.Mesh(geometry,new T.MeshStandardMaterial({vertexColors:true,roughness:.88,side:T.DoubleSide}));walkSurface.receiveShadow=refinedCountry;land.add(walkSurface);
 const walls=[];for(const {a,b,count} of edges.values())if(count===1){const ah=height(...a),bh=height(...b);walls.push(a[0],0,a[1],b[0],bh,b[1],a[0],ah,a[1],a[0],0,a[1],b[0],0,b[1],b[0],bh,b[1]);}const wallGeometry=new T.BufferGeometry();wallGeometry.setAttribute('position',new T.Float32BufferAttribute(walls,3));wallGeometry.computeVertexNormals();const cliff=new T.Mesh(wallGeometry,new T.MeshStandardMaterial({color:lo.clone().lerp(accent,.22),roughness:1,side:T.DoubleSide}));cliff.name='solid-terrain-edges';land.add(cliff);
 for(const polygon of polygons){const points=polygon[0].map(c=>{const p=projection(c);return new T.Vector3(p[0],.15,p[1]);});land.add(new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0xf0ddac})));}
 document.getElementById('land-title').textContent=state;document.getElementById('land-name').textContent=foundation.name+' • editable PAINTFALL identity';const regionalStudy=countryBatches[state]&&refinementFor(countryBatches[state]);document.getElementById('land-description').textContent=foundation.landscape+'.'+(countryBatches[state]?.exhibitOnly?' '+countryBatches[state].planting.note:regionalStudy?' Refined housing and '+regionalStudy.tree.replaceAll('-',' ')+' / '+regionalStudy.secondary.replaceAll('-',' ')+' planting studies; exact local species and details remain for review.':'');const list=document.getElementById('land-cues');list.replaceChildren();for(const cue of identity.cues){const li=document.createElement('li');li.textContent='Reference direction: '+cue;list.append(li);}document.getElementById('state-plan').href='/world-build.html?'+(countryMode?'country=':'focus=us&state=')+encodeURIComponent(state);document.getElementById('state-count').textContent=(countryMode?states.length+' country/territory land previews':'50 state land previews')+' • Parks and park travel deferred';status.textContent=state+' • Land construction study • Four outer areas remain open';if(countryMode){document.getElementById('state-count').textContent=states.length+' country and territory outline drafts';document.getElementById('state-plan').href='/world-build.html';}if(countryMode&&!vertices.length){status.textContent=state+' • Detailed outline needed before walking';document.getElementById('land-description').textContent='The bundled outline has no usable walking surface at this scale. This region remains reserved pending a detailed source.';}select.value=state;buildCount++;reset();
 walking.setTerrain(walkSurface,state);
 const scenery=countryMode?{group:new T.Group(),placed:0,features:[]}:buildLandScenery(T,{land,state,style,ground:walking.ground,spawn:walking.avatar.position});if(countryMode)land.add(scenery.group);
 const landmarks=countryMode&&countryBatches[state]?buildBatchScenery(T,{land,ground:walking.ground,spawn:walking.avatar.position,profile:countryBatches[state]}):countryMode&&state==='Laos'?buildLaosScenery(T,{land,ground:walking.ground,spawn:walking.avatar.position}):countryMode&&state==='Vietnam'?buildVietnamScenery(T,{land,ground:walking.ground,spawn:walking.avatar.position}):countryMode&&state==='Thailand'?buildThailandScenery(T,{land,ground:walking.ground,spawn:walking.avatar.position}):countryMode&&state==='China'?buildChinaScenery(T,{land,ground:walking.ground,spawn:walking.avatar.position}):countryMode&&state==='Japan'?buildJapanScenery(T,{land,ground:walking.ground,spawn:walking.avatar.position}):!countryMode&&state==='Wisconsin'?buildWisconsinLandmarks(T,{land,ground:walking.ground}):state==='California'?buildCaliforniaScenery(T,{land,ground:walking.ground}):state==='Utah'?buildUtahScenery(T,{land,ground:walking.ground}):state==='Idaho'?buildIdahoScenery(T,{land,ground:walking.ground,lakeCenter:stateLake}):state==='Oregon'?buildOregonScenery(T,{land,ground:walking.ground,lakeCenter:stateLake}):state==='Washington'?buildWashingtonScenery(T,{land,ground:walking.ground}):buildRegionalScenery(T,{land,ground:walking.ground,style,cues:identity.cues,spawn:walking.avatar.position});if(landmarks)for(const o of [...scenery.group.children]){if(landmarks.obstacles.some(b=>Math.abs(o.position.x-b.x)<b.halfX+.3&&Math.abs(o.position.z-b.z)<b.halfZ+.3)||(landmarks.clearings||[]).some(c=>Math.hypot(o.position.x-c.x,o.position.z-c.z)<c.radius)){scenery.group.remove(o);o.traverse(child=>child.geometry?.dispose());}}
 const housingObstacles=[...(landmarks?.obstacles||[]),...((countryBatches[state]?.theme==='river-homes'?[]:landmarks?.waterBounds||[]).map(b=>({x:(b.min.x+b.max.x)/2,z:(b.min.z+b.max.z)/2,halfX:(b.max.x-b.min.x)/2+.35,halfZ:(b.max.z-b.min.z)/2+.35})))];
 const neighborhood=countryMode&&countryBatches[state]?buildBatchHomes(T,{land,ground:walking.ground,spawn:walking.avatar.position,occupied:housingObstacles,profile:countryBatches[state]}):countryMode&&state==='Laos'?buildLaosNeighborhood(T,{land,ground:walking.ground,spawn:walking.avatar.position,occupied:housingObstacles}):countryMode&&state==='Thailand'?buildThailandNeighborhood(T,{land,ground:walking.ground,spawn:walking.avatar.position,occupied:housingObstacles}):countryMode&&state==='Vietnam'?buildVietnamNeighborhood(T,{land,ground:walking.ground,spawn:walking.avatar.position,occupied:housingObstacles}):countryMode&&state==='China'?buildChinaNeighborhood(T,{land,ground:walking.ground,spawn:walking.avatar.position,occupied:housingObstacles}):countryMode&&state==='South Korea'?buildKoreaNeighborhood(T,{land,ground:walking.ground,spawn:walking.avatar.position,occupied:housingObstacles}):countryMode&&state==='Japan'?buildJapanNeighborhood(T,{land,ground:walking.ground,spawn:walking.avatar.position,occupied:housingObstacles}):!countryMode&&state==='Wisconsin'?buildWisconsinNeighborhood(T,{land,ground:walking.ground}):null;walking.setObstacles(neighborhood?.obstacles||[]);walking.setBenches(neighborhood?.benches||[]);document.querySelector('aside > p.note:last-child').textContent=neighborhood?(countryMode?(countryBatches[state]?countryBatches[state].landscape+'. Furnished inspection views are available; final regional detail and walkable interiors remain open.':state==='Laos'?'Laos has Luang Prabang-inspired raised wooden homes with veranda and broad hipped-roof studies. Furnished inspection cutaways are available; walkable interiors and other regional housing remain open.':state==='Thailand'?'Thailand has central Thai-inspired raised timber homes with steep gabled roofs. Interiors and other regional housing styles remain pending.':state==='Vietnam'?'Vietnam has separate Hoi An-inspired yellow houses and Mai Chau-inspired stilt-house studies, with furnished inspection cutaways. Walkable interiors and other housing styles remain pending.':state==='China'?'China has a Beijing siheyuan-inspired exterior courtyard study. Other regional and modern housing styles and interiors remain pending.':state==='South Korea'?'South Korea has hanok-inspired courtyard homes with timber frames and curved roof studies. Interiors and other regional styles remain pending.':'Japan has a small group of early machiya-inspired exterior homes. Interiors and other regional housing styles remain pending.'):'Wisconsin has one early neighborhood with exterior-only homes. The rest of the land remains open for later design; new parks and finished character animations are still pending.'):(countryBatches[state]?.exhibitOnly?countryBatches[state].landscape:'Housing and new parks remain deferred here. Existing Nevada and Arizona parks stay in their separate preview. Additional wildlife comes later. Travel between places will be provided by the amusement parks.');
 if(countryMode&&countryBatches[state]?.batch===2&&neighborhood)addSparseFieldFlowers(T,{land,ground:walking.ground,profile:countryBatches[state],neighborhood,landmarks});
 if(countryMode&&countryBatches[state]?.batch>=29&&countryBatches[state]?.batch<=55&&neighborhood)addAfricaFlowers(T,{land,ground:walking.ground,profile:countryBatches[state],neighborhood,landmarks});
 if(countryMode&&countryBatches[state]?.batch>=23&&countryBatches[state]?.batch<=28&&neighborhood)addAfricaFlowers(T,{land,ground:walking.ground,profile:countryBatches[state],neighborhood,landmarks});
 if(countryMode&&countryBatches[state]?.batch>=17&&countryBatches[state]?.batch<=22&&neighborhood)addNextThirtyFlowers(T,{land,ground:walking.ground,profile:countryBatches[state],neighborhood,landmarks});
 if(countryMode&&[15,16].includes(countryBatches[state]?.batch)&&neighborhood)addCaucasusFlowers(T,{land,ground:walking.ground,profile:countryBatches[state],neighborhood,landmarks});
 if(countryMode&&countryBatches[state]?.batch===14&&neighborhood)addCentralAsiaFlowers(T,{land,ground:walking.ground,profile:countryBatches[state],neighborhood,landmarks});
 if(countryMode&&countryBatches[state]?.batch===13&&neighborhood)addSouthAsiaFlowers(T,{land,ground:walking.ground,profile:countryBatches[state],neighborhood,landmarks});
 wildlife=countryMode&&countryBatches[state]?buildLaosWildlife(T,{land,ground:walking.ground,canOccupy:(x,z)=>walking.canOccupy(x,z)&&!(landmarks?.obstacles||[]).some(o=>Math.abs(x-o.x)<o.halfX+.6&&Math.abs(z-o.z)<o.halfZ+.6),explorer:walking.avatar,waterBounds:landmarks.waterBounds,roster:countryBatches[state].roster,regionName:state,getInteractionTime:()=>interactions.time}):countryMode&&state==='Laos'?buildLaosWildlife(T,{land,ground:walking.ground,canOccupy:(x,z)=>walking.canOccupy(x,z)&&!(landmarks?.obstacles||[]).some(o=>Math.abs(x-o.x)<o.halfX+.6&&Math.abs(z-o.z)<o.halfZ+.6),explorer:walking.avatar,waterBounds:landmarks.waterBounds,getInteractionTime:()=>interactions.time}):countryMode&&state==='Vietnam'?buildVietnamWildlife(T,{land,ground:walking.ground,canOccupy:(x,z)=>walking.canOccupy(x,z)&&!(landmarks?.obstacles||[]).some(o=>Math.abs(x-o.x)<o.halfX+.6&&Math.abs(z-o.z)<o.halfZ+.6),explorer:walking.avatar,getInteractionTime:()=>interactions.time}):countryMode&&state==='Thailand'?buildThailandWildlife(T,{land,ground:walking.ground,canOccupy:(x,z)=>walking.canOccupy(x,z)&&!(landmarks?.obstacles||[]).some(o=>Math.abs(x-o.x)<o.halfX+.6&&Math.abs(z-o.z)<o.halfZ+.6),explorer:walking.avatar}):!countryMode&&state==='Wisconsin'?buildWisconsinWildlife(T,{land,ground:walking.ground,canOccupy:walking.canOccupy,scenery,explorer:walking.avatar}):null;
 walking.setObstacles([...(neighborhood?.obstacles||[]),...(landmarks?.obstacles||[]),...(wildlife?.habitatObstacles||[])]);
 if(countryMode&&['Japan','South Korea','China','Vietnam','Thailand','Laos',...Object.keys(countryBatches)].includes(state)&&neighborhood?.homes.length){const homeScale=neighborhood.homes[0].scale.x,target=neighborhood.homes[0].position.clone().add(new T.Vector3(0,2*homeScale,0));for(let i=0;i<100;i++){const a=i*2.4,p=walking.ground(target.x+Math.cos(a)*9,target.z+Math.sin(a)*9);if(p&&walking.canOccupy(p.x,p.z)){landmarks.visits.push({name:countryBatches[state]?countryBatches[state].homeName:state==='Laos'?'Riverweave Homes':state==='Thailand'?'Teakglow Homes':state==='Vietnam'?'Lanternbrush Homes':state==='China'?'Colorhaven Courtyard':state==='South Korea'?'Prism Courtyard Homes':'Paintwood Homes',target,point:p,viewOffset:new T.Vector3(10,9,16).multiplyScalar(homeScale)});break;}}}
 if(countryMode&&['Japan','South Korea','China','Vietnam','Thailand','Laos',...Object.keys(countryBatches)].includes(state))for(const v of landmarks.visits){if(v.point&&walking.canOccupy(v.point.x,v.point.z))continue;for(let i=0;i<150;i++){const a=i*2.4,r=9+i*.08,p=walking.ground(v.target.x+Math.cos(a)*r,v.target.z+Math.sin(a)*r);if(p&&walking.canOccupy(p.x,p.z)){v.point=p;break;}}}
 let landmarkTools=document.getElementById('landmark-tools');if(!landmarkTools){landmarkTools=document.createElement('section');landmarkTools.id='landmark-tools';document.getElementById('land-description').after(landmarkTools);}landmarkTools.replaceChildren();if(landmarks){const note=document.createElement('p');note.className='note';note.textContent=countryMode&&state==='Japan'?'Japan scenery studies • Snowpeak, bamboo path and ornamental blossom clearing • Creative placements; parks deferred.':state==='Washington'?'Washington landscape studies • Cascade peak, rainforest and coastal waterways • Parks deferred.':state==='Oregon'?'Oregon landscape studies • Sea stacks, forest waterfall and crater-lake basin • Parks deferred.':state==='Idaho'?'Idaho landscape studies • Lava rock, mountain lake and river gorge • Parks deferred.':state==='Utah'?'Utah landscape studies • Sandstone arches, hoodoos and pale salt surfaces • Parks deferred.':state==='California'?'California landscape studies • Giant trees, granite and coastal rocks • Parks deferred.':state==='Wisconsin'?state==='Wisconsin'?'Madison and Dells landmark studies • Original PAINTFALL placements, not amusement parks.':'Regional landscape drafts • Parks deferred.':'Original regional landscape studies • Parks and their travel connections deferred.';landmarkTools.append(note);for(const v of landmarks.visits){if(!v.point||!v.target)continue;const view=document.createElement('button');view.textContent='Look at '+v.name;view.onclick=()=>{batchInteriors?.restore();laosInteriors?.restore();vietnamInteriors?.restore();walking.setActive(false);restoreCloseup();wildlifeFocus=null;controls.minDistance=countryBatches[state]?.theme==='roof-loft'?1:5;controls.target.copy(v.target);camera.position.copy(v.target).add(v.viewOffset||new T.Vector3(14,14,18));const sight=new T.Raycaster();for(let attempt=0;attempt<6;attempt++){const delta=v.target.clone().sub(camera.position);sight.set(camera.position,delta.clone().normalize());sight.far=Math.max(0,delta.length()-.5);if(!sight.intersectObject(walkSurface,false).length)break;camera.position.y+=8;}if(neighborhood&&v.name===neighborhood.group.name){const blockers=[walkSurface,landmarks.group,scenery.group].filter(Boolean),ray=new T.Raycaster();let found=false;const homeScale=neighborhood.homes[0].scale.x;for(const height of (countryBatches[state]?.batch>=23?[17,22,27]:countryBatches[state]?.batch===16?[20,25,30]:[12,17,22])){for(let i=0;i<12;i++){const a=(state==='Turkey'?Math.PI/3:0)+i*Math.PI/6,eye=v.target.clone().add(new T.Vector3(Math.sin(a)*18*homeScale,height*homeScale,Math.cos(a)*18*homeScale)),d=eye.clone().sub(v.target);ray.set(v.target,d.clone().normalize());ray.near=.3;ray.far=d.length();const clear=countryBatches[state]?.batch>=23?[-2,0,2].every(x=>{const focus=v.target.clone().add(new T.Vector3(x,0,0)),line=eye.clone().sub(focus);ray.set(focus,line.clone().normalize());ray.far=line.length();return !ray.intersectObjects(blockers,true).length;}):!ray.intersectObjects(blockers,true).length;if(clear){camera.position.copy(eye);found=true;break;}}if(found)break;}}controls.update();};const visit=document.createElement('button');visit.textContent='Visit '+v.name;visit.onclick=()=>{batchInteriors?.restore();laosInteriors?.restore();vietnamInteriors?.restore();walking.setActive(true);walking.avatar.position.copy(v.point);camera.position.copy(v.point).add(new T.Vector3(0,6,10));controls.target.copy(v.point).add(new T.Vector3(0,1,0));host.querySelector('canvas').focus();};landmarkTools.append(view,visit);}}
 let tools=document.getElementById('wildlife-tools');if(!tools){tools=document.createElement('div');tools.id='wildlife-tools';document.getElementById('animal-interactions').after(tools);}tools.replaceChildren();if(wildlife){const note=document.createElement('p');note.className='note';note.textContent=countryBatches[state]?describeCountryWildlife(countryBatches[state]):state==='Laos'?'Five Lao wildlife prototypes: elephant, white-cheeked gibbon, sambar, gaur and silver pheasant. Watch their routines or Walk to approach gently; busy canopy animals can decline company.':state==='Vietnam'?'Five Vietnam wildlife individuals: pangolin, civet, douc, squirrel and bear. Watch their different routines or Walk to approach gently. Canopy animals remain out of petting reach.':state==='Thailand'?'Five Thai wildlife species have early ground-roaming models. Use the living-world controls below for climbing, canal swimming, day/night activity and interior cutaways. Use Walk to approach; animals choose company or space.':'All ten Wisconsin animals now have early models and roaming movement. Use a close-up button to inspect each one.';tools.append(note);for(const a of wildlife.animals){const b=document.createElement('button');b.textContent='Look at '+(a.kind==='White-tailed deer'?'deer':a.kind.toLowerCase());b.onclick=()=>{batchInteriors?.restore();laosInteriors?.restore();vietnamInteriors?.restore();if(walking.active)walking.setActive(false);restoreCloseup();wildlifeFocus=a;for(const o of scenery.group.children){if(Math.hypot(o.position.x-a.root.position.x,o.position.z-a.root.position.z)<6&&o!==a.perchTree&&!/lake|stream/i.test(o.name)){o.visible=false;closeupHidden.add(o);}}controls.minDistance=3*(a.previewScale??1);controls.target.copy(a.root.position).add(new T.Vector3(0,a.focusHeight||.8,0));clearWildlifeView(a);controls.update();};tools.append(b);}}
 if(countryMode&&state==='Thailand'&&wildlife)thailandDetails=finishThailandPreview(T,{land,wildlife,landmarks,neighborhood,ground:walking.ground,canOccupy:walking.canOccupy,scene,sunlight,camera,controls,walking});
 if(countryMode&&state==='Vietnam'&&neighborhood){vietnamInteriors=buildVietnamInteriors(T,{neighborhood});vietnamInteriorControls=createVietnamInteriorControls(T,{interiors:vietnamInteriors,camera,controls,walking});}
 if(countryMode&&state==='Vietnam'&&wildlife)vietnamWildlifeControls=createVietnamWildlifeControls({wildlife});
 if(countryMode&&state==='Laos'&&neighborhood){laosInteriors=buildLaosInteriors(T,{neighborhood});laosInteriorControls=createLaosInteriorControls(T,{interiors:laosInteriors,walking,camera,controls});}
 if(countryMode&&countryBatches[state]&&neighborhood){batchInteriors=buildBatchInteriors(T,{neighborhood,profile:countryBatches[state]});batchInteriorControls=createBatchInteriorControls(T,{interiors:batchInteriors,profile:countryBatches[state],walking,camera,controls});}
 window.PAINTFALL_US_LAND={batchInteriors,laosInteriors,vietnamInteriors,thailandDetails,scene,renderer,camera,land,state,feature,ready:true,buildCount,terrainVertexCount:vertices.length/3,build,states,walking,scenery,neighborhood,wildlife,interactions,landmarks};
}
let states=[];
try{
 const r=await fetch(countryMode?'/world-data/countries.json':'/world-data/states.json');if(!r.ok)throw Error('Land outlines unavailable');const data=await r.json();
 states=topojson.feature(data,countryMode?data.objects.countries:data.objects.states).features.filter(f=>countryMode||window.PAINTFALL_US_FOUNDATIONS[f.properties.name]).sort((a,b)=>a.properties.name.localeCompare(b.properties.name));
 if(countryMode){
  for(const f of states){const polygons=f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates];for(const rings of polygons)if(d3.geoArea({type:'Polygon',coordinates:rings})>Math.PI*2)rings.forEach(r=>r.reverse());const name=f.properties.name;
   // Broad creative palettes only; no claim of an accurate country's biome or elevation.
   const latitude=Math.abs(d3.geoCentroid(f)[1]),style=latitude>60?'ice':latitude<23?'forest':'mountain';
   countryFoundations[name]={name:name+' landscape',landscape:'Creative placeholder terrain within the source outline; native plants, regional landmarks and accurate elevation have not been added'};
   countryIdentities[name]={style,cues:style==='ice'?['Pastel ice ridges','Meltwater stream']:style==='forest'?['Paintlight grove','Quiet waterway']:['Prism ridge overlook','Quiet waterway']};
  }
  for(const [country,profile]of Object.entries(countryBatches)){countryFoundations[country]={name:profile.name,landscape:profile.landscape};countryIdentities[country]={style:profile.style,cues:profile.features};}countryFoundations.Laos={name:'Riverweave Reach',landscape:'Kuang Si-inspired stepped pools and a quiet river bend with Luang Prabang-inspired raised wooden houses; separate references combined in original placements'};countryIdentities.Laos={style:'forest',cues:['Turquoise stepped cascades','Quiet river bends','Raised wooden veranda homes']};countryFoundations.Thailand={name:'Teakglow Reach',landscape:'Central Thai-inspired raised timber homes, Krabi-inspired limestone cliff studies and a quiet canal; separate regional references combined in a creative preview'};countryIdentities.Thailand={style:'forest',cues:['Limestone cliff scenery','Raised timber housing','Quiet canal']};countryFoundations.Vietnam={name:'Lanternbrush Valley',landscape:'Hoi An-inspired yellow houses and Mai Chau-inspired raised homes with Ninh Binh-inspired karst forms, Mu Cang Chai-inspired paddy terraces and a valley waterway; separate regional references combined in a creative preview'};countryIdentities.Vietnam={style:'forest',cues:['Ninh Binh-inspired karst valley','Mu Cang Chai-inspired paddy terraces','Hoi An and Mai Chau housing studies']};countryFoundations.China={name:'Colorhaven Peaks',landscape:'South China karst-inspired towers and waterway alongside a Beijing siheyuan-inspired housing study; these distant references are combined in a creative preview, not geographic replicas'};countryIdentities.China={style:'mountain',cues:['Karst tower landscape','Quiet waterway']};countryFoundations['South Korea']={name:'Prism Courtyard Hills',landscape:'Rocky mountain and quiet stream studies with hanok-inspired courtyard housing; original placements, not exact geography'};countryIdentities['South Korea']={style:'mountain',cues:['Rocky mountain overlook','Quiet valley waterway']};countryFoundations.Japan={name:'Blossom Prism Isles',landscape:'Fuji-inspired snowpeak, a Kyoto-inspired bamboo walk and ornamental blossom clearing; creative placements rather than exact geography'};countryIdentities.Japan={style:'mountain',cues:['Volcanic mountain silhouette','Bamboo garden path','Seasonal blossom scenery']};document.title='PAINTFALL — Country land construction';document.querySelector('.heading').textContent='PAINTFALL / COUNTRY LAND CONSTRUCTION';document.querySelector('header small').textContent='Country and territory landscape foundations • Parks provide future travel';document.querySelector('header a').href='/world-build.html';document.querySelector('header a').textContent='Back to the world map';document.querySelector('label[for="land-state"]').textContent='Explore a country or territory';document.getElementById('state-plan').textContent='View this region’s ideas';
 }
 for(const f of states){const option=document.createElement('option');option.value=f.properties.name;option.textContent=f.properties.name==='Congo'?'Republic of the Congo (Congo)':f.properties.name==='Dem. Rep. Congo'?'Democratic Republic of the Congo':f.properties.name;select.append(option);}
 let pendingCountryBuild;
 select.onchange=()=>{clearTimeout(pendingCountryBuild);const selected=select.value;status.textContent='Building '+selected+' preview…';pendingCountryBuild=setTimeout(()=>{try{build(states.find(f=>f.properties.name===selected));}catch(e){status.textContent='This preview could not finish: '+e.message;console.error(e);}},0);};const requested=new URLSearchParams(location.search).get(countryMode?'country':'state');build(states.find(f=>f.properties.name===requested)||states.find(f=>f.properties.name===(countryMode?'United States of America':'Wisconsin'))||states[0]);
 if(countryMode){if(document.getElementById('walk-help'))document.getElementById('walk-help').textContent='Walk this region with WASD or arrow keys. These are local preview controls; future travel will use amusement parks.';}
}catch(e){status.textContent='Terrain could not load: '+e.message;console.error(e);}
document.getElementById('reset-land').onclick=()=>{if(walking.active)walking.setActive(false);else reset();};const resize=new ResizeObserver(()=>{camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight,false);});resize.observe(host);let lastFrame=performance.now();function animate(now){const dt=Math.max(0,Math.min((now-lastFrame)/1000,.05));lastFrame=now;if(!document.hidden){walking.update(dt);window.PAINTFALL_US_LAND?.landmarks?.update?.(dt);interactions.update(dt);wildlife?.update(dt);if(wildlifeFocus&&!walking.active){const target=wildlifeFocus.root.position.clone().add(new T.Vector3(0,wildlifeFocus.focusHeight||.8,0));camera.position.add(target.clone().sub(controls.target));controls.target.copy(target);}else if(closeupHidden.size)restoreCloseup();controls.update();renderer.render(scene,camera);}requestAnimationFrame(animate);}requestAnimationFrame(animate);

















































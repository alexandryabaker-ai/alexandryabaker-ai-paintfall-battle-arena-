const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../public/paintfall-winter-mountains.js'),'utf8').replace(/export /g,'');
const {regionClimate,buildWinterMountains}=vm.runInNewContext(source+';({regionClimate,buildWinterMountains})');
const state=name=>({type:'state',name});
test('cold states get snow only in winter, unless permanently icy',()=>{
 assert.equal(regionClimate(state('Wisconsin'),'lake',{season:'winter',month:9}).winter,true);
 assert.equal(regionClimate(state('Wisconsin'),'lake',{season:'summer',month:0}).winter,false);
 assert.equal(regionClimate(state('Wisconsin'),'lake',{month:0}).winter,true);
 assert.equal(regionClimate(state('Alaska'),'ice',{season:'summer',month:6}).winter,true);
 assert.equal(regionClimate(state('Florida'),'coast',{season:'winter',month:0}).winter,false);
});
test('mountainous regions retain peaks in all seasons without turning flat states into mountains',()=>{
 assert.equal(regionClimate(state('Colorado'),'mountain',{season:'summer',month:6}).mountains,true);
 assert.equal(regionClimate(state('Vermont'),'forest',{season:'summer',month:6}).mountains,true);
 assert.equal(regionClimate(state('Wisconsin'),'lake',{season:'winter',month:0}).mountains,false);
});
test('decorative mountains remain outside the arena movement boundary',()=>{
 class Obj{constructor(){this.children=[];this.position={set(x,y,z){this.x=x;this.y=y;this.z=z}};this.scale={set(){}};this.userData={};}add(v){this.children.push(v);}}
 class Mesh extends Obj{constructor(g,m){super();this.geometry=g;this.material=m;}}
 class Geometry{setAttribute(name,v){this.positions=v.array;}computeVertexNormals(){}}
 const T={Group:Obj,Mesh,MeshStandardMaterial:class{},BufferGeometry:Geometry,Float32BufferAttribute:class{constructor(array){this.array=array}},SphereGeometry:class{},DoubleSide:2};
 const land=new Obj(),result=buildWinterMountains(T,{land,destination:state('Colorado'),style:'mountain',season:'winter',month:0});
 const peaks=result.group.children.filter(x=>x.name.startsWith('Distant mountain'));
 assert.equal(peaks.length,6);
 assert.ok(peaks.every(p=>Math.abs(p.position.x)>80||Math.abs(p.position.z)>80));
 assert.ok(peaks.every(p=>p.children[0].geometry.positions.length>0));
});

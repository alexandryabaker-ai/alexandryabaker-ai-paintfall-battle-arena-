import {refinementFor} from './paintfall-regional-refinement-profiles.js';
// Form studies and selected cultivated planting; these labels do not assert native status.
export function refineTreeStudies(T,result,{ground,profile}){
 const p=refinementFor(profile);if(!p)return result;const stems=result.group.children.filter(o=>o.geometry?.type==='CylinderGeometry'&&o.geometry.parameters.height===6&&o.geometry.parameters.radiusBottom===.6),canopies=result.group.children.filter(o=>o.geometry?.type==='IcosahedronGeometry'&&o.geometry.parameters.radius===2.3);
 const positions=stems.map(o=>({x:o.position.x,z:o.position.z}));for(const o of [...stems,...canopies]){result.group.remove(o);o.geometry.dispose();}
 const bark=new T.MeshStandardMaterial({color:0x76634b,roughness:1}),leaf=new T.MeshStandardMaterial({color:0x5d7750,roughness:.92,side:T.DoubleSide}),silver=new T.MeshStandardMaterial({color:0x87917a,roughness:.95,side:T.DoubleSide}),leafGeo=new T.SphereGeometry(1,5,3),dummy=new T.Object3D();
 const line=(g,a,b,r)=>{const d=b.clone().sub(a),o=new T.Mesh(new T.CylinderGeometry(r*.65,r,d.length(),8),bark);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());o.castShadow=true;g.add(o);return o;};
 for(const [i,pos]of positions.entries()){
  const q=ground(pos.x,pos.z);if(!q)continue;const form=i%2?p.secondary:p.tree,g=new T.Group();g.name='Regional '+form+' tree study';g.position.copy(q);g.userData.treeForm=form;g.userData.plantingNote='Regional form / garden planting study; exact species and nativity remain open for local review';result.group.add(g);const leaves=[],v=(x,y,z)=>new T.Vector3(x,y,z);
  const cluster=(x,y,z,rx,ry,rz,count=65)=>{for(let k=0;k<count;k++){const a=k*2.399+i,t=(k+.5)/count,yy=1-2*t,r=Math.sqrt(1-yy*yy),rr=.4+.6*((k*17%count)/count);leaves.push({x:x+Math.cos(a)*r*rx*rr,y:y+yy*ry*rr,z:z+Math.sin(a)*r*rz*rr,sx:.14,sy:.035,sz:.06,ry:a,rz:Math.sin(k)*.7});}};
  if(['date-palm','palm','fan-palm'].includes(form)){
   const h=form==='date-palm'?5.4:6.2;line(g,v(0,0,0),v(.18,h,0),.22);for(let j=0;j<13;j++){const a=j*Math.PI*2/13,start=v(.18,h,0),end=v(Math.cos(a)*2.1,h-.65,Math.sin(a)*2.1);line(g,start,end,.025);for(let k=1;k<10;k++){const t=k/10,c=start.clone().lerp(end,t);for(const s of [-1,1]){const x=c.x+Math.cos(a+Math.PI/2)*s*.42*(1-t*.6),z=c.z+Math.sin(a+Math.PI/2)*s*.42*(1-t*.6);leaves.push({x,y:c.y-.08,z,sx:form==='fan-palm'?.3:.38,sy:.018,sz:.055,ry:-a+s*.65,rz:.4});}}}for(let j=0;j<12;j++){const a=j*2.4,o=new T.Mesh(new T.TorusGeometry(.19+j*.001,.015,4,12),bark);o.position.set(j*.003,.4+j*.35,0);o.rotation.x=Math.PI/2;g.add(o);}
  }else if(['cypress','juniper','pine','spruce','larch'].includes(form)){
   line(g,v(0,0,0),v(0,7,0),.25);for(let j=0;j<7;j++){const y=1.8+j*.7,r=form==='cypress'?.48:1.75-j*.2;cluster(0,y,0,r,.8,r,45);if(form!=='cypress')for(let k=0;k<4;k++){const a=k*Math.PI/2+j;line(g,v(0,y,0),v(Math.cos(a)*r,y+.2,Math.sin(a)*r),.04);}}
  }else if(/dwarf|low-willow|heath/.test(form)){
   const h=form==='heath'?.25:.65;for(let j=0;j<7;j++){const a=j*2.4,x=Math.cos(a)*.7,z=Math.sin(a)*.7;line(g,v(0,0,0),v(x,h,z),.018);cluster(x,h,z,.38,.17,.38,35);}g.userData.plantingNote='Low native-region shrub/heath form study; not a tall forest.';
  }else if(form==='baobab'){
   line(g,v(0,0,0),v(0,4.4,0),.56);for(let j=0;j<7;j++){const a=j*Math.PI*2/7,end=v(Math.cos(a)*1.4,5.2+(j%2)*.5,Math.sin(a)*1.4);line(g,v(0,3.4,0),end,.16);line(g,end,end.clone().add(v(Math.cos(a)*.35,.7,Math.sin(a)*.35)),.08);cluster(end.x,end.y+.45,end.z,.65,.42,.65,40);}
  }else{
   const flat=['acacia','miombo','olive'].includes(form),h=form==='olive'?3.1:form==='mopane'?3.8:form==='willow'?4:form==='birch'?5.8:form==='gumwood'?3.2:form==='hawthorn'?3.4:5;line(g,v(0,0,0),v(.12,h-.8,0),form==='buttress-tree'?.42:form==='birch'?.18:.28);
   if(form==='birch'){for(let j=0;j<9;j++){const o=new T.Mesh(new T.CylinderGeometry(.29,.29,.22,8),j%3?new T.MeshStandardMaterial({color:0xd9d5bf,roughness:1}):bark);o.position.y=.4+j*.4;o.name='Birch pale bark band';g.add(o);}}
   if(form==='cork-oak')for(let j=0;j<12;j++){const o=new T.Mesh(new T.BoxGeometry(.12,.3,.07),bark);o.position.set(Math.sin(j*2.4)*.29,.4+j*.22,Math.cos(j*2.4)*.29);o.name='Cork bark relief';g.add(o);}
   if(form==='buttress-tree')for(let j=0;j<5;j++){const a=j*Math.PI*2/5;line(g,v(Math.cos(a)*.48,.05,Math.sin(a)*.48),v(0,1.5,0),.12);}
   for(let j=0;j<7;j++){const a=j*2.4,end=v(Math.cos(a)*1.35,h+(j%3)*.2,Math.sin(a)*1.35);line(g,v(0,h-1.4,0),end,.07);cluster(end.x,end.y,end.z,.85,form==='miombo'?.55:flat?.35:.75,.85,form==='buttress-tree'?95:75);if(form==='willow')for(let k=0;k<4;k++){const x=end.x+Math.cos(k)*.25,z=end.z+Math.sin(k)*.25;line(g,v(x,h,z),v(x+.1,h-1.5,z),.012);cluster(x,h-.8,z,.13,.8,.13,15);}}
  }
  if(!['date-palm','palm','fan-palm','cypress','pine','juniper'].includes(form))for(const l of leaves){l.sx=form==='tamarisk'?.055:form==='olive'?.17:form==='acacia'?.12:.24;l.sz=form==='tamarisk'?.025:form==='olive'?.055:form==='acacia'?.065:.1;}
  if(form==='mopane')for(const l of [...leaves]){l.sx=.14;l.sz=.12;leaves.push({...l,x:l.x+.13,ry:l.ry+.6});}
  let selectedLeaf=leafGeo;
  if(profile.architecture&&!['palm','fan-palm','date-palm'].includes(form)){
   const shape=new T.Shape(),points=[];
   if(form==='maple'||form==='chestnut')for(let j=0;j<20;j++){const a=j*Math.PI/10,r=j%4===0?1:j%2===0?.65:.35;points.push([Math.cos(a)*r,Math.sin(a)*r]);}
   else if(form==='oak'||form==='cork-oak')for(let j=0;j<28;j++){const a=j*Math.PI/14,r=1+.2*Math.sin(a*7);points.push([Math.cos(a)*r*.55,Math.sin(a)*r]);}
   else if(['pine','spruce','larch','juniper','cypress'].includes(form))points.push([0,-1],[.08,0],[0,1],[-.08,0]);
   else if(form==='lime')for(let j=0;j<24;j++){const a=j*Math.PI/12;points.push([Math.sin(a)*(.6+.2*Math.cos(a)),Math.cos(a)*.75-.15*Math.cos(2*a)]);}
   else points.push([0,-1],[-.48,-.25],[-.4,.35],[0,1],[.4,.35],[.48,-.25]);
   points.forEach(([x,y],j)=>j?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();selectedLeaf=new T.ShapeGeometry(shape);selectedLeaf.rotateX(Math.PI/2);g.userData.leafShape=form;
  }
  const foliage=new T.InstancedMesh(selectedLeaf,form==='olive'||form==='tamarisk'?silver:leaf,leaves.length);foliage.name='Instanced individual foliage';foliage.castShadow=true;for(const [j,l]of leaves.entries()){dummy.position.set(l.x,l.y,l.z);dummy.rotation.set(.15,l.ry,l.rz);dummy.scale.set(l.sx,l.sy,l.sz);dummy.updateMatrix();foliage.setMatrixAt(j,dummy.matrix);}foliage.instanceMatrix.needsUpdate=true;g.add(foliage);g.userData.leafCount=leaves.length;
 }
 result.group.userData.treeStudies={primary:p.tree,secondary:p.secondary,count:positions.length};return result;
}

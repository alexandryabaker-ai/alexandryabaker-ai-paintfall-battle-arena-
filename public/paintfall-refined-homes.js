import {refinementFor} from './paintfall-regional-refinement-profiles.js';
import {makeSurfaceMaterials} from './paintfall-surface-materials.js';
export function refineRegionalHomes(T,result,profile){
 const p=refinementFor(profile);if(!p)return result;const m=makeSurfaceMaterials(T,profile.homeColors),layout=p.layout;
 const box=(g,n,x,y,z,w,h,d,material)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),material);o.name=n;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
 const rod=(g,n,a,b,r,material)=>{const d=b.clone().sub(a),o=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),8),material);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());o.name=n;o.castShadow=true;g.add(o);return o;};
 function cylinder(g,n,x,y,z,r,h,material,top=r){const o=new T.Mesh(new T.CylinderGeometry(top,r,h,32),material);o.name=n;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
 function gable(g,x,z,w,d,y,r,hip=false){const pts=[[x-w,y,z-d],[x+w,y,z-d],[x-w,y,z+d],[x+w,y,z+d],[x,y+r,z-(hip?d*.4:d)],[x,y+r,z+(hip?d*.4:d)]],idx=[0,2,5,0,5,4,1,3,5,1,5,4,0,1,4,2,3,5],geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(idx.flatMap(i=>pts[i]),3));geo.computeVertexNormals();const o=new T.Mesh(geo,m.roof);o.name=hip?'Four-sided hip roof':'Sloping gable roof';o.castShadow=true;g.add(o);if(!hip)for(const s of [-1,1])for(let j=0;j<10;j++){const zz=z-d+j*d/4.5;rod(g,'Roof seam',new T.Vector3(x,y+r,zz),new T.Vector3(x+s*w,y,zz),.012,m.wood);}}
 function window(g,x,y,z,w=.8,h=1){box(g,'Deep window reveal',x,y,z,w+.18,h+.18,.16,m.trim);box(g,'Recessed window pane',x,y,z+.09,w,h,.05,m.glass);box(g,'Window mullion',x,y,z+.13,.045,h,.05,m.wood);}
 function walls(g,x,z,w,d,h=2.6){box(g,'Rear room wall',x,h/2+.3,z-d,w*2,h,.18,m.wall);for(const s of [-1,1])box(g,'Room side wall',x+s*w,h/2+.3,z,.18,h,d*2,m.wall);for(const s of [-1,1])box(g,'Front room wall',x+s*(w/2+.3),h/2+.3,z+d,w-.6,h,.18,m.wall);box(g,'Door lintel',x,2.55,z+d,1.2,.7,.18,m.wall);if(h>3)box(g,'Upper facade above door',x,2.85+(h-2.55)/2,z+d,1.2,h-2.55,.18,m.wall);}
 function arch(g,x,y,z,r=.6){const o=new T.Mesh(new T.TorusGeometry(r,.09,7,20,Math.PI),m.trim);o.name='Arched opening crown';o.position.set(x,y,z);o.castShadow=true;g.add(o);for(const s of [-1,1])box(g,'Arcade pier',x+s*r,y-.75,z,.17,1.5,.22,m.trim);}
 for(const [index,home]of result.homes.entries()){
  const shell=home.userData.cutawayShell;for(const o of [...shell.children]){shell.remove(o);o.traverse(n=>n.geometry?.dispose());}
  const g=new T.Group();g.name='Refined regional structure';g.scale.set(p.width,1,p.depth);shell.add(g);const round=/round|thatch/.test(layout)&&layout!=='rounded-towers'&&(!profile.architecture||/round/.test(layout)),court=/court|riad|arcade|rounded-towers|patio/.test(layout),vault=/vault/.test(layout),tall=/townhouse|gallery|loft|tower-bands|oriel|chalet|palazzo|maltese|canal-bell/.test(layout);
  // Follow the load-bearing plan rather than leaving the same square podium under every home.
  if(round){const radius=layout==='round-compound'?2.55:3.1;for(const block of [...home.children])if(block.name==='Grounded masonry foundation'){const x=block.position.x/p.width,z=block.position.z/p.depth,main=Math.hypot(x,z)<radius,annex=layout==='round-compound'&&Math.hypot(x+2.5,z-2.1)<1.3;if(!main&&!annex){home.remove(block);block.geometry.dispose();}else block.material=m.stone;}const oldFloor=home.getObjectByName('Main room floor');if(oldFloor){home.remove(oldFloor);oldFloor.geometry.dispose();}const floor=cylinder(home,'Main room floor',0,.3,0,(layout==='round-compound'?2.35:2.9)*Math.min(p.width,p.depth),.18,m.wood);floor.castShadow=false;const step=home.getObjectByName('Entry step');if(step)step.position.z=(layout==='round-compound'?2.7:3.3)*p.depth;}
  else for(const block of home.children.filter(o=>o.name==='Grounded masonry foundation'))block.material=m.stone;
  if(round){
   const stone=layout.includes('stone'),r=layout==='round-compound'?2.35:2.9;cylinder(g,'Enclosed round wall',0,1.5,0,r,2.4,stone?m.stone:m.wall);cylinder(g,'Deep thatch conical roof',0,3.6,0,r+.6,2.3,m.thatch,.03);box(g,'Round entrance frame',0,1.2,r,1.15,1.9,.16,m.wood);box(g,'Round recessed doorway',0,1.15,r+.1,.87,1.7,.06,m.glass);
   for(let j=0;j<40;j++){const a=j*Math.PI/20;rod(g,'Radial thatch rib',new T.Vector3(0,4.75,0),new T.Vector3(Math.cos(a)*(r+.58),2.48,Math.sin(a)*(r+.58)),.012,m.wood);if(layout.includes('timber')||layout.includes('woven'))box(g,'Exposed wall upright',Math.cos(a)*(r+.03),1.5,Math.sin(a)*(r+.03),.055,2.35,.055,m.wood);}
   if(layout==='round-compound'){cylinder(g,'Secondary round room',-2.5,1,2.1,1.05,1.4,m.wall);cylinder(g,'Secondary room thatch cap',-2.5,2.1,2.1,1.3,.9,m.thatch,.03);}if(stone)for(let j=0;j<8;j++)for(let k=0;k<26;k++){const a=k*Math.PI/13+j%2*.1,o=box(g,'Rounded stone masonry joint',Math.cos(a)*(r+.015),.5+j*.28,Math.sin(a)*(r+.015),.4,.025,.035,m.trim);o.rotation.y=-a+Math.PI/2;}
  }else if(court){
   walls(g,0,-1.9,3.8,1.15,2.8);for(const s of [-1,1]){box(g,'Courtyard wing outer wall',s*3.8,1.7,.85,.2,2.8,5.6,m.wall);box(g,'Courtyard inner wall',s*2.2,1.7,.2,.14,2.8,4.3,m.wall);box(g,'Courtyard room roof',s*3,3.15,.3,1.85,.2,5.1,m.roof);}box(g,'Rear courtyard roof',0,3.2,-2,7.8,.2,2.65,m.roof);for(const s of [-1,1])box(g,'Low court entry wall',s*2.5,.85,3.75,2.7,1.1,.18,m.wall);
   for(const s of [-1,1]){window(g,s*3,1.7,2.9,.65,.95);if(/arch|arcade|riad/.test(layout))arch(g,s*1.65,2.25,1.5,.57);}
   if(/gable|compound-gable/.test(layout))for(const s of [-1,1])gable(g,s*3,.2,1,2.6,3.2,1.05);
   if(/shade|screen|vent/.test(layout))for(let j=0;j<11;j++)box(g,'Open court pergola beam',-2.1+j*.42,2.8,2.8,.09,.12,1.7,m.wood);
   if(/najdi|buttress/.test(layout)){for(const x of [-3.6,3.6])box(g,'Earthen courtyard buttress',x,1.6,3,.45,2.6,.7,m.brick);for(let j=0;j<8;j++)box(g,'Earthen parapet rhythm',-3.5+j,3.55,-2.8,.35,.55,.3,m.wall);}
   if(layout==='rounded-towers'){for(const x of [-2.8,2.8]){cylinder(g,'Rounded residential corner tower',x,2.3,1.8,1,4,m.wall,.85);cylinder(g,'Tower conical cover',x,4.85,1.8,1.15,1.1,m.thatch,.03);}}
   if(layout==='stepped-court')for(let j=0;j<3;j++)box(g,'Stepped parapet vent',-2+j*2,3.6+j*.3,-2.1,.65,1+j*.6,.9,m.wall);
   if(layout==='brick-court')for(let j=0;j<8;j++)for(const x of [-3.9,3.9])box(g,'Brick court masonry band',x,.5+j*.3,.4,.035,.025,4.2,m.brick);
   if(layout==='open-riad'){box(g,'Dry courtyard inset',0,.42,.6,2.7,.08,2.5,m.trim);for(const s of [-1,1])for(let j=0;j<6;j++)box(g,'Inset court tile band',s*2.1,.7+j*.14,1,.06,.08,.2,m.trim);}
  }else if(vault){
   walls(g,0,0,3.3,2.7,2.5);const count=layout==='twin-vault'?2:1;box(g,'Vault support terrace',0,2.9,0,6.8,.14,5.7,m.stone);for(let j=0;j<count;j++){const w=count===2?1.55:2.5,x=count===2?(j-.5)*3.1:0;const verts=[],point=(a,z)=>[x+Math.cos(a)*w,2.9+Math.sin(a)*w,z];for(let k=0;k<24;k++){const a=k*Math.PI/24,b=(k+1)*Math.PI/24,A=point(a,-2.75),B=point(b,-2.75),C=point(b,2.75),D=point(a,2.75);verts.push(...A,...B,...C,...A,...C,...D,...[x,2.9,-2.75],...B,...A,...[x,2.9,2.75],...D,...C);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.computeVertexNormals();const o=new T.Mesh(geo,m.wall);o.name='Exposed barrel vault';o.castShadow=true;g.add(o);}for(const x of [-2.2,2.2])window(g,x,1.5,2.86);arch(g,0,1.9,2.9,.6);
  }else{
   const tower=layout==='tower-bands',height=tower?8:tall?5.4:2.6,w=tower?2.2:3.15,d=tower?2.3:2.8;walls(g,0,0,w,d,height);
   for(let y=1.5;y<height;y+=2.1)for(const x of [-w*.65,w*.65])window(g,x,y,d+.12,tower?.65:.95,1.05);
   const flat=/wind|flat|skylight|terrace|domes/.test(layout)||tower||layout==='maltese-balcony';
   if(flat){box(g,'Roof terrace slab',0,height+.4,0,w*2+.2,.18,d*2+.2,m.roof);for(const s of [-1,1])box(g,'High terrace parapet',s*w,height+.8,0,.18,.8,d*2,m.wall);box(g,'Rear parapet',0,height+.8,-d,w*2,.8,.18,m.wall);}
   else gable(g,0,0,w+.45,d+.4,height+.35,layout==='highland-loft'?2.8:1.7,/hip|creole|island/.test(layout));
   if(/wind/.test(layout)){for(let j=0;j<(layout==='double-wind'?2:1);j++){const x=j?2:-2;for(const s of [-1,1])box(g,'Open wind-tower side',x+s*.5,height+1.3,-1.5,.13,1.9,1.2,m.wall);box(g,'Wind-tower cap',x,height+2.3,-1.5,1.3,.16,1.4,m.trim);for(const z of [-1.8,-1.2])box(g,'Wind-tower baffle',x,height+1.5,z,1.05,.9,.06,m.wood);}}
   if(tower)for(let y=2.6;y<8;y+=2.1){box(g,'Tower plaster band',0,y,d+.15,w*2,.18,.08,m.trim);for(const x of [-1.4,1.4])arch(g,x,y-.5,d+.18,.38);}
   if(tall&&!tower){box(g,'Upper storey floor',0,3,0,w*2,.16,d*2,m.wood);box(g,'Upper balcony deck',0,3,3.5,6.6,.18,1.4,m.wood);for(let j=0;j<15;j++)box(g,'Balcony baluster',-3+j*.43,3.55,4.12,.07,1.05,.07,m.wood);box(g,'Balcony handrail',0,4.1,4.12,6.4,.1,.1,m.wood);for(const x of [-2.8,2.8])box(g,'Gallery support pier',x,1.6,4.1,.2,2.6,.2,m.trim);}
   if(/veranda|hip|creole|eave|longhouse|boarded/.test(layout)){box(g,'Deep veranda roof',0,2.8,3.55,7.3,.15,1.7,m.roof);for(const x of [-3,0,3])box(g,'Veranda post',x,1.55,4.2,.14,2.5,.14,m.wood);if(/creole|island/.test(layout)){for(const x of [-3.5,3.5])box(g,'Wraparound side veranda roof',x,2.8,0,.9,.15,6.4,m.roof);for(let j=0;j<21;j++)box(g,'Veranda fretwork',-3+j*.3,2.5,4.2,.07,.3,.07,m.trim);}}
   if(/timber|plank|board|creole/.test(layout))for(let j=0;j<11;j++)for(const s of [-1,1])box(g,'Timber siding course',s*2, .5+j*.22,d+.13,2.05,.025,.045,m.wood);
   if(/stone|brick/.test(layout))for(let j=0;j<8;j++)for(const s of [-1,1])box(g,'Masonry facade course',s*2,.55+j*.28,d+.13,1.9,.025,.04,m.stone);
   if(layout==='cape-gable'){for(let j=0;j<4;j++)box(g,'Cape stepped gable',0,3.4+j*.45,3.36,3.2-j*.65,.5,.22,m.wall);window(g,0,3.65,3.52,.6,.8);}
   if(layout==='stone-double-gable')for(const x of [-1.6,1.6])gable(g,x,1.5,1.5,1.6,2.95,1.1);
   if(layout==='skylight-house'){box(g,'Raised roof lantern',0,height+1.15,0,1.6,1.2,1.6,m.wall);for(const x of [-.6,.6])window(g,x,height+1.2,.88,.35,.6);}
  }
  if(layout==='white-domes'){walls(g,0,0,3.4,2.8);for(const x of [-1.7,1.7]){const o=new T.Mesh(new T.SphereGeometry(1.6,24,12,0,Math.PI*2,0,Math.PI/2),m.wall);o.name='Low domestic dome';o.position.set(x,3,0);o.castShadow=true;g.add(o);}}
  home.userData.refinedLayout=layout;home.userData.treeStudy=p.tree;home.userData.materialPass='textured-residential-study';
 }
 result.group.userData.refinement=p;return result;
}




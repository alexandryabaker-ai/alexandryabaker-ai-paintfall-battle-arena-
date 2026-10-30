// Selected residential variants within the named local tradition. No copied monuments.
const plans={
 'Sierra Leone':['hip',1.6,'porch'],Liberia:['thatch-hip',1.8,'rear-room'],'Cabo Verde':['gable',1.05,'side-room'],'São Tomé and Principe':['hip',1.4,'porch'],'Saint Helena':['side-gable',1.25,'rear-room'],
 Albania:['hip',2.1,'upper-wing'],Andorra:['side-gable',2.5,'stone-wing'],Austria:['half-hip',2.2,'balcony'],Belgium:['gable',2.5,'rear-room'],'Bosnia and Herz.':['hip',2.1,'upper-wing'],Bulgaria:['hip',1.4,'wide-bay'],Croatia:['side-gable',1.5,'stone-wing'],France:['cross-gable',2.5,'timber-wing'],Germany:['half-hip',2.6,'hall-bay'],Hungary:['side-gable',1.8,'long-porch'],Kosovo:['hip',1.8,'upper-wing'],Liechtenstein:['side-gable',1.8,'log-wing'],Luxembourg:['half-hip',2.15,'stone-wing'],Macedonia:['hip',1.3,'wide-bay'],Monaco:['hip',1.2,'rear-room'],Montenegro:['side-gable',1.65,'stone-wing'],Netherlands:['gable',2.1,'rear-room'],Portugal:['side-gable',1.1,'chimney'],Romania:['half-hip',3.1,'gable-porch'],
 'San Marino':['side-gable',1.3,'stone-wing'],Serbia:['hip',1.9,'long-porch'],Slovakia:['half-hip',2.5,'log-wing'],Slovenia:['cross-gable',2.5,'drying-gallery'],Switzerland:['side-gable',1.65,'balcony'],Vatican:['hip',1.1,'rear-room'],Denmark:['thatch-hip',2.2,'timber-wing'],Estonia:['half-hip',2.5,'hall-bay'],Finland:['cross-gable',1.9,'boarded-wing'],Iceland:['turf-gable',1.5,'turf-wing'],Ireland:['thatch-hip',1.7,'rear-room'],Latvia:['thatch-hip',2.6,'log-wing'],Lithuania:['half-hip',2.35,'gable-porch'],Norway:['turf-gable',1.9,'log-wing'],Poland:['cross-gable',3.2,'gable-porch'],Sweden:['side-gable',1.75,'boarded-wing'],'United Kingdom':['cross-gable',2.5,'stone-wing'],Belarus:['gable',2.15,'log-wing'],Moldova:['hip',1.5,'long-porch'],Ukraine:['thatch-hip',2,'rear-room'],Gibraltar:['hip',1,'wide-bay'],Guernsey:['side-gable',1.6,'stone-wing'],Jersey:['half-hip',2.15,'stone-wing'],'Isle of Man':['thatch-hip',1.4,'rear-room'],'Faeroe Is.':['turf-gable',1.8,'turf-wing'],'Åland':['cross-gable',2.1,'boarded-wing'],Greenland:['side-gable',1.8,'entry-porch']
};
export function varyHouseMassing(T,{home,group:g,profile:p,index:i,ground}){
 const country=p.refinement.country,plan=plans[country];if(!plan)return;
 const[type,rise,annex]=plan,mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95,side:T.DoubleSide}),wall=mat(p.homeColors[0]),roof=mat(type.startsWith('turf')?0x6c8055:type.startsWith('thatch')?0xa3946e:p.homeColors[1]),wood=mat(p.homeColors[2]),glass=mat(0x748e92);
 const tall=/townhouse|gallery|loft|tower-bands|oriel|chalet|palazzo|maltese|canal-bell/.test(p.architecture.layout),eave=(tall?5.4:2.6)+.35;
 const box=(name,x,y,z,w,h,d,m=wall)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.name=name;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o;};
 function pitched(name,x,z,w,d,y,r,hip=false,side=false){const inset=typeof hip==='number'?hip:.42,v=[[-w,y,-d],[w,y,-d],[-w,y,d],[w,y,d],[0,y+r,hip?-d*inset:-d],[0,y+r,hip?d*inset:d]],ix=[0,2,5,0,5,4,1,3,5,1,5,4,0,1,4,2,3,5],geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(ix.flatMap(k=>v[k]),3));geo.computeVertexNormals();const o=new T.Mesh(geo,roof);o.name=name;o.position.set(x,0,z);if(side)o.rotation.y=Math.PI/2;o.castShadow=true;g.add(o);return o;}
 for(const o of [...g.children])if(/^(Sloping gable roof|Four-sided hip roof|Deep mountain roof overhang|Thick planted sod roof|Deep rounded thatch roof|Roof seam|Low roof grass tuft)$/.test(o.name)){g.remove(o);o.geometry?.dispose();}
 const side=type==='side-gable'||(i===1&&type==='gable'),hip=type.includes('hip'),mainRise=rise+(i===2?.2:0);
 pitched('Selected local '+type+' roof',0,0,side?3.25:3.65,side?3.65:3.25,eave,mainRise,type==='half-hip'?.8:hip,side);
 // Roof-end triangular walls are solidly supported, rather than floating dormers.
 if(type==='cross-gable'||(i===2&&['boarded-wing','timber-wing','stone-wing'].includes(annex))){box('Cross-gable projecting room',-1.65,1.6,2.55,2.6,2.6,2.3);pitched('Lower cross-gable roof',-1.65,2.55,1.55,1.35,2.98,Math.min(1.6,rise*.65));box('Cross-gable room window',-1.65,1.65,3.74,.8,1.1,.08,glass);}
 else if(['stone-wing','log-wing','boarded-wing','timber-wing','rear-room','hall-bay'].includes(annex)){
  const sideRoom=i!==1,x=sideRoom?-3.15:0,z=sideRoom?1.1:-2.6,w=sideRoom?1.2:2.15,d=sideRoom?1.85:1.2,h=annex==='hall-bay'?3.1:2.2;
  box('Attached '+annex+' volume',x,.3+h/2,z,w*2,h,d*2);pitched('Attached wing lower roof',x,z,w+.25,d+.25,h+.4,Math.min(1.4,rise*.6),hip);box('Annex recessed window',x,.3+h*.55,z+d+.04,.75,.8,.06,glass);
  if(/log|board|timber/.test(annex))for(let j=0;j<9;j++)box('Annex timber wall course',x,.5+j*.21,z+d+.08,w*2,.04,.04,wood);
  if(ground)for(let xx=x-w;xx<x+w;xx+=.45)for(let zz=z-d;zz<z+d;zz+=.45){const px=(xx+.225)*g.scale.x,pz=(zz+.225)*g.scale.z,q=ground(home.position.x+px,home.position.z+pz);if(!q)continue;const bottom=q.y-home.position.y,o=new T.Mesh(new T.BoxGeometry(.45*g.scale.x,.3-bottom,.45*g.scale.z),wall);o.position.set(px,(bottom+.3)/2,pz);o.name='Grounded annex foundation';home.add(o);}
 }
 else if(annex==='upper-wing'||annex==='wide-bay'){
  const x=annex==='wide-bay'?0:i===1?-1.5:1.5,w=annex==='wide-bay'?5.3:2.5;
  box('Offset upper residential wing',x,4.35,2.85,w,2.4,1.6);pitched('Upper wing separate hip roof',x,2.85,w/2+.25,1,5.65,1.15,true);for(const offset of [-.6,.6])box('Upper wing window',x+offset,4.4,3.7,.7,1.3,.08,glass);
 }
 else if(annex==='gable-porch'||annex==='entry-porch'){
  const w=annex==='entry-porch'?.95:1.4,x=i===1?1.6:0;box('Enclosed sheltered entrance volume',x,1.4,3.25,w*2,2.2,1.65);pitched('Entry projecting gable',x,3.25,w+.2,1.05,2.6,1.1);box('Entry vestibule door',x,1.2,4.12,.75,1.8,.06,wood);
 }
 else if(annex==='turf-wing'){
  const x=i===1?2.5:-2.5;box('Low connected turf room',x,1.15,.5,1.7,1.7,3.8);pitched('Secondary sod-roofed volume',x,.5,1.05,2.1,2.1,1.05);box('Turf wing timber gable',x,1.25,2.47,1.65,1.8,.09,wood);box('Turf wing recessed window',x,1.4,2.54,.65,.65,.06,glass);
 }
 if(annex==='drying-gallery'){for(let j=0;j<10;j++)box('Open drying gallery upright',-2.9+j*.65,3.6,4.2,.07,1.1,.08,wood);for(const y of [3.2,3.7,4.2])box('Long drying gallery rail',0,y,4.2,6.3,.08,.08,wood);}
 if(annex==='chimney'){box('Alentejo broad chimney hood',1.6,4,-1.4,1.25,1.9,.9);for(let j=0;j<4;j++)box('Chimney ventilation slot',1.15+j*.3,4.7,-.91,.13,.25,.04,glass);}
 if(['Albania','Bulgaria','Macedonia','Kosovo','Netherlands','Belgium','Monaco','Vatican'].includes(country))for(const o of [...g.children])if(/Upper balcony deck|Balcony baluster|Balcony handrail|Gallery support pier/.test(o.name)){g.remove(o);o.geometry?.dispose();}
 if(country==='Netherlands'){for(const o of [...g.children])if(o.name==='Bell gable curved shoulder study'){g.remove(o);o.geometry?.dispose();}const s=new T.Shape();s.moveTo(-2.9,5.65);s.quadraticCurveTo(-2.9,6.15,-2,6.15);s.bezierCurveTo(-.65,6.15,-1.3,7.35,-.6,7.65);s.lineTo(.6,7.65);s.bezierCurveTo(1.3,7.35,.65,6.15,2,6.15);s.quadraticCurveTo(2.9,6.15,2.9,5.65);s.closePath();const o=new T.Mesh(new T.ExtrudeGeometry(s,{depth:.2,bevelEnabled:false}),wood);o.position.z=3.24;o.name='Curved Dutch bell gable facade';g.add(o);}
 if(type==='turf-gable')for(let j=0;j<24;j++){const x=(j%8-3.5)*.8,z=(Math.floor(j/8)-1)*2.5;box('Turf roof short grass',x,eave+mainRise*(1-Math.abs(x)/3.65)+.08,z,.08,.15,.08,roof);}
 home.userData.massingPlan={country,roof:type,annex,variant:i};
}



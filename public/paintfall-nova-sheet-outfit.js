// Nova-only, reviewable regular-outfit pass against the owner's October 27 sheet.
export function applyNovaSheetOutfit(T,actor){
  if(actor.userData.character!=='Nova')throw new Error('Nova outfit only');
  if(actor.userData.novaSheetOutfit)return actor.userData.novaSheetOutfit;
  const p=actor.userData.parts,d=actor.userData.design;
  const fabric=new T.MeshStandardMaterial({color:0x151c1b,roughness:.92});
  const green=new T.MeshStandardMaterial({color:0x64d82e,roughness:.6});
  const rubber=new T.MeshStandardMaterial({color:0x090e0e,roughness:.82});
  const metal=new T.MeshStandardMaterial({color:0x58635c,roughness:.38,metalness:.65});
  const hide=new Set(['tailored-torso','fitted-chest-panel','hips','harness','outfit-piping','chest-emblem','belt','belt-buckle','utility-pouch','knee-pad','cargo-pocket','cargo-secondary-pocket','cargo-diagonal-seam','cargo-ankle-cuff','boot','boot-sole','shoe-lace','wrist-cuff','fingerless-glove']);
  actor.traverse(m=>{if(hide.has(m.name))m.visible=false;});
  const root=new T.Group();root.name='nova-sheet-garments';p.body.add(root);
  function add(parent,g,m,pos,name){const a=new T.Mesh(g,m);a.position.set(...pos);a.name=name;parent.add(a);return a;}
  function box(parent,m,pos,size,name){return add(parent,new T.BoxGeometry(...size),m,pos,name);}
  function tube(parent,m,points,r,name){return add(parent,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),24,r,6,false),m,[0,0,0],name);}
  function lathe(parent,m,profile,pos,depth,name){const a=add(parent,new T.LatheGeometry(profile.map(v=>new T.Vector2(...v)),40),m,pos,name);a.scale.z=depth;return a;}
  const tummy=lathe(root,p.head.material,[[.088,0],[.077,.035],[.067,.068],[.070,.093]],[0,.613,0],.61,'nova-midriff');
  const top=lathe(root,fabric,[[.073,0],[.078,.016],[.091,.052],[.109,.092],[.101,.122],[.043,.144]],[0,.699,0],.63,'nova-sheet-crop-top');
  for(const y of [.701,.708]){const band=add(root,new T.TorusGeometry(.073,.0025,6,48),green,[0,y,0],'nova-top-hem');band.rotation.x=Math.PI/2;band.scale.y=.63;}
  const collar=lathe(root,fabric,[[.041,0],[.041,.014],[.038,.017]],[0,.840,0],.89,'nova-standing-collar');
  tube(root,green,[[0,.714,-.048],[0,.775,-.066],[0,.825,-.046],[0,.850,-.035]],.002,'nova-front-zip-trim');
  // Shoulder harness wraps front and back instead of floating on a chest plate.
  for(const side of [-1,1]){
    tube(root,green,[[side*.068,.708,-.033],[side*.081,.766,-.045],[side*.078,.820,-.043],[side*.071,.836,.005],[side*.075,.789,.055],[side*.069,.715,.036]],.006,'nova-green-harness');
    box(root,rubber,[side*.076,.792,-.047],[.018,.021,.009],'nova-harness-buckle');
    box(root,green,[side*.076,.792,-.053],[.012,.012,.003],'nova-harness-inset');
  }
  const waist=lathe(root,fabric,[[.093,0],[.094,.034],[.085,.047]],[0,.598,0],.65,'nova-cargo-waist');
  const belt=lathe(root,rubber,[[.092,0],[.092,.015]],[0,.637,0],.65,'nova-cargo-belt');
  box(root,green,[0,.644,-.061],[.026,.020,.007],'nova-belt-buckle');
  box(root,rubber,[0,.644,-.066],[.014,.010,.003],'nova-belt-inset');
  for(const side of [-1,1])box(root,green,[side*.066,.642,-.040],[.011,.024,.009],'nova-belt-loop');
  const limbs=[];
  for(const [i,leg] of [p.legL,p.legR].entries()){
    const side=i===0?-1:1,thigh=(d.legRatio-.04)*.51,shinLen=(d.legRatio-.04)*.49;
    const thighMesh=leg.getObjectByName('thigh'),shinMesh=leg.userData.shin.getObjectByName('shin');
    // Folded fabric profiles replace muscle-shaped trousers, keeping the existing pivots.
    function trouser(mesh,length,upper,lower){
      const profile=[[lower,-length/2],[lower*1.08,-length*.40],[upper*.97,-length*.19],[upper*1.04,0],[upper*.99,length*.27],[upper,length/2]];
      mesh.geometry=new T.LatheGeometry(profile.map(v=>new T.Vector2(...v)),32);mesh.material=fabric;mesh.scale.set(1,1,.88);
      const verts=mesh.geometry.attributes.position;for(let k=0;k<verts.count;k++){const x=verts.getX(k),y=verts.getY(k),z=verts.getZ(k),a=Math.atan2(z,x),r=1+.024*Math.sin(a*7+y*53)+.018*Math.sin(y*94+a*3);verts.setXYZ(k,x*r,y,z*r);}mesh.geometry.computeVertexNormals();
      mesh.children.filter(c=>c.name==='donghua-contour').forEach(c=>c.visible=false);
    }
    trouser(thighMesh,thigh,.043,.035);trouser(shinMesh,shinLen,.034,.023);
    const knee=add(leg,new T.SphereGeometry(1,24,16),fabric,[0,-thigh,.003],'nova-cloth-knee');knee.scale.set(.035,.033,.030);
    const cargo=new T.Group();cargo.name='nova-layered-cargo';cargo.position.set(side*.037,-thigh*.42,0);leg.add(cargo);
    const pocket=box(cargo,fabric,[side*.005,0,0],[.025,.085,.066],'nova-cargo-bellows');
    box(cargo,green,[side*.019,.020,-.002],[.008,.045,.069],'nova-cargo-flap-border');
    box(cargo,rubber,[side*.024,.023,-.002],[.006,.032,.051],'nova-cargo-flap');
    for(const z of [-.020,.020])box(cargo,metal,[side*.028,.030,z],[.004,.008,.008],'nova-pocket-fastener');
    tube(leg,green,[[side*.027,-.015,-.030],[side*.038,-.082,-.030],[side*.039,-.170,-.022],[side*.029,-thigh,-.015]],.003,'nova-trouser-side-tape');
    const shin=leg.userData.shin;
    const cuff=lathe(shin,rubber,[[.024,0],[.025,.026]],[0,-shinLen+.008,-.005],1,'nova-gathered-cuff');
    for(let j=0;j<5;j++)tube(shin,fabric,[[.025*Math.cos(j*1.256),-shinLen+.038,.025*Math.sin(j*1.256)],[.022*Math.cos(j*1.256),-shinLen+.01,.022*Math.sin(j*1.256)]],.0015,'nova-cuff-fold');
    const boot=add(shin,new T.SphereGeometry(1,24,16),rubber,[0,-shinLen-.010,-.023],'nova-sheet-boot');boot.scale.set(.036,.030,.064);
    const sole=add(shin,new T.SphereGeometry(1,24,12),green,[0,-shinLen-.034,-.023],'nova-boot-green-sole');sole.scale.set(.037,.007,.065);
    lathe(shin,rubber,[[.026,0],[.027,.045],[.024,.053]],[0,-shinLen+.006,-.004],1,'nova-boot-ankle');
    for(let j=0;j<4;j++)box(shin,green,[0,-shinLen+.012,-.026-j*.009],[.035,.003,.003],'nova-boot-laces');
    for(const z of [-.013,.004,.020]){const mark=box(shin,green,[side*.031,-shinLen+.002,z],[.004,.020,.008],'nova-boot-side-panel');mark.rotation.x=-.2;}
    const arm=[p.armL,p.armR][i];
    const shoulder=arm.getObjectByName('deltoid');shoulder.material=fabric;shoulder.scale.set(.031,.043,.038);
    const sleeve=lathe(arm,fabric,[[.033,0],[.034,.037],[.032,.069]],[side*.002,-.060,0],1.02,'nova-short-sleeve');
    const sleeveTrim=lathe(arm,green,[[.034,0],[.034,.008]],[side*.002,-.060,0],1.02,'nova-sleeve-green-trim');
    const glove=add(arm,new T.SphereGeometry(1,20,12),rubber,[side*.012,-d.armLength,-.027],'nova-padded-glove');glove.scale.set(.023,.025,.022);
    for(let k=0;k<3;k++)box(arm,green,[side*.012+(k-1)*.011,-d.armLength+.007,-.046],[.008,.012,.005],'nova-green-knuckle');
    limbs.push({leg,cargo,sleeve,sleeveTrim});
  }
  // Small original crown-shaped accent, used on the back harness as in the sheet.
  tube(root,green,[[-.022,.785,.066],[-.025,.806,.066],[-.010,.796,.066],[0,.815,.066],[.010,.796,.066],[.025,.806,.066],[.022,.785,.066],[-.022,.785,.066]],.0025,'nova-back-crown');
  const data={root,top,limbs};actor.userData.novaSheetOutfit=data;return data;
}

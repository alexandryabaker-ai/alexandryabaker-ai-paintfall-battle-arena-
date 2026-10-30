import { CHARACTER_DESIGNS } from './paintfall-character-designs.js';
import { applyCharacterSheetDetails } from './paintfall-character-sheet-details.js';

// Individually proportioned, articulated bases. The outdoor world owns THREE.
export function createCharacterFactory(T, {style='donghua'}={}) {
  const donghua=style==='donghua';
  const gradient=new T.DataTexture(new Uint8Array([82,82,130,130,190,190,244,255]),8,1,T.RedFormat);
  gradient.minFilter=T.LinearFilter;gradient.magFilter=T.LinearFilter;gradient.generateMipmaps=false;gradient.needsUpdate=true;
  const mat = (color, roughness=.68, metalness=.04) => donghua&&roughness>=.55&&metalness<=.04
    ? new T.MeshToonMaterial({color,gradientMap:gradient})
    : new T.MeshPhysicalMaterial({color,roughness,metalness});
  function add(parent, geometry, material, position, scale, name) {
    const part = new T.Mesh(geometry, material); part.position.set(...position);
    if (scale) part.scale.set(...scale);
    part.name = name || ''; parent.add(part); return part;
  }
  const sphere = (p,m,pos,s,name) => add(p,new T.SphereGeometry(1,24,16),m,pos,s,name);
  function box(p,m,pos,s,name) {
    // Bevel hard gear edges so highlights describe the shape in motion.
    const radius=Math.min(...s)*.18, shape=new T.Shape(), x=s[0]/2-radius,y=s[1]/2-radius;
    shape.moveTo(-x,-y-radius);shape.lineTo(x,-y-radius);
    shape.quadraticCurveTo(x+radius,-y-radius,x+radius,-y);
    shape.lineTo(x+radius,y);shape.quadraticCurveTo(x+radius,y+radius,x,y+radius);
    shape.lineTo(-x,y+radius);shape.quadraticCurveTo(-x-radius,y+radius,-x-radius,y);
    shape.lineTo(-x-radius,-y);shape.quadraticCurveTo(-x-radius,-y-radius,-x,-y-radius);
    const geometry=new T.ExtrudeGeometry(shape,{depth:s[2]-radius*2,bevelEnabled:true,bevelThickness:radius,bevelSize:radius*.45,bevelSegments:2,steps:1,curveSegments:4});
    geometry.translate(0,0,-(s[2]-radius*2)/2);
    geometry.computeBoundingBox();
    const size=geometry.boundingBox.getSize(new T.Vector3());
    geometry.scale(s[0]/size.x,s[1]/size.y,s[2]/size.z);
    return add(p,geometry,m,pos,null,name);
  }
  function bone(p,m,a,b,r1,r2,name) {
    const start=new T.Vector3(...a), end=new T.Vector3(...b), direction=end.clone().sub(start);
    const length=direction.length();
    const anatomical=['upper-arm','forearm','thigh','shin'].includes(name);
    const profile=anatomical?[[r1*.70,0],[r1*.96,length*.12],[r1*1.10,length*.30],[r1*.94,length*.50],[r2*1.08,length*.76],[r2,length]]:[[r1,0],[r2,length]];
    const geometry=new T.LatheGeometry(profile.map(([r,y])=>new T.Vector2(r,y-length/2)),20);
    const part=add(p,geometry,m,start.clone().add(end).multiplyScalar(.5).toArray(),null,name);
    part.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize()); return part;
  }
  function curve(p,m,points,r,name) {
    const path=new T.CatmullRomCurve3(points.map(point=>new T.Vector3(...point)));
    const part=add(p,new T.TubeGeometry(path,12,r,6,false),m,[0,0,0],null,name);
    part.userData.curveRoot=points[0].slice();return part;
  }
  const ring=(p,m,pos,r,tube,name)=>add(p,new T.TorusGeometry(r,tube,6,20),m,pos,null,name);
  return function makeCharacter(character) {
    const d=CHARACTER_DESIGNS[character]||CHARACTER_DESIGNS.Maya;
    const group=new T.Group(), body=new T.Group(); group.add(body);
    const skin=mat(d.skin), hair=mat(d.hair,.42), cloth=mat(d.outfit,.78), accent=mat(d.accent,.42,.22);
    if(skin.isMeshPhysicalMaterial){skin.roughness=.57;skin.metalness=0;skin.clearcoat=.12;skin.clearcoatRoughness=.65;}
    if(cloth.isMeshPhysicalMaterial){cloth.sheen=.45;cloth.sheenColor.set(d.outfit);cloth.sheenRoughness=.8;}
    hair.clearcoat=.32;hair.clearcoatRoughness=.4;
    const dark=mat(0x20212b,.8), metal=mat(0x3b424c,.38,.5), white=mat(0xf4ead9,.85);
    const leg=d.legRatio, shoulderY=.805, hipY=leg+.018, torsoLength=shoulderY-hipY;
    const profile=[[d.hip*.8,0],[d.hip,.045],[d.waist,torsoLength*.42],[d.shoulder*.90,torsoLength*.80],[d.shoulder,torsoLength],[.05,torsoLength+.035]];
    const torso=add(body,new T.LatheGeometry(profile.map(([r,y])=>new T.Vector2(r,y)),24),cloth,[0,hipY,0],[1,1,.59],'tailored-torso');
    sphere(body,cloth,[0,hipY+.035,.004],[d.hip,.062,d.hip*.61],'hips');
    bone(body,skin,[0,.825,0],[0,.885,0],.040,.035,'neck');
    const cheek=d.babyface?.079:.069, jaw=d.babyface?.057:.044;
    const headProfile=[[.012,0],[jaw*.75,.007],[jaw,.019],[cheek*.88,.037],[cheek,.064],[cheek,.078],[cheek*.97,.098],[cheek*.90,.119],[.045,.141],[0,.15]];
    const head=add(body,new T.LatheGeometry(headProfile.map(([r,y])=>new T.Vector2(r,y)),28),skin,[0,.85,0],[1,1,.86],'head');
    for(const side of [-1,1]) {
      sphere(body,skin,[side*cheek,.922,0],[.013,.023,.011],'ear');
      const x=side*.027,y=d.babyface?.924:.929;
      const eyeZ=-Math.sqrt(cheek*cheek-x*x)*.86-.002;
      sphere(body,white,[x,y,eyeZ],[.021,.011,.006],'eye-white');
      sphere(body,mat(d.eyes,.3),[x,y,eyeZ-.0055],[.008,.009,.003],'iris');
      sphere(body,dark,[x,y,eyeZ-.008],[.0037,.006,.0015],'pupil');
      sphere(body,white,[x-.002,y+.003,eyeZ-.009],[.0018,.002,.001],'eye-highlight');
      curve(body,hair,[[x-.019,y+.016,eyeZ],[x,y+.020,eyeZ-.004],[x+.017,y+.016,eyeZ]],.003,'eyebrow');
      curve(body,dark,[[x-.020,y,eyeZ-.004],[x,y+.010,eyeZ-.006],[x+.020,y,eyeZ-.004]],.0015,'upper-lid');
      curve(body,skin,[[x-.019,y-.002,eyeZ-.003],[x,y-.010,eyeZ-.005],[x+.019,y-.002,eyeZ-.003]],.0018,'lower-lid');
      const paint=box(body,accent,[side*.049,.902,-.051],[.020,.005,.002],'cheek-paint'); paint.rotation.z=side*-.20;
      box(body,accent,[side*.050,.893,-.048],[.018,.003,.002],'cheek-paint');
    }
    sphere(body,skin,[0,.911,-cheek*.86-.003],[.010,.016,.012],'nose');
    for(const side of [-1,1])sphere(body,skin,[side*.007,.903,-cheek*.86-.007],[.005,.004,.005],'nose-wing');
    const mouthZ=-(jaw+(cheek*.95-jaw)*.857)*.86-.003;
    curve(body,mat(0x9d4f48),[[-.017,.886,mouthZ+.003],[0,.883,mouthZ],[.018,.887,mouthZ+.003]],.0027,'mouth');
    curve(body,mat(0xb57065,.57),[[-.014,.884,mouthZ+.002],[0,.880,mouthZ-.001],[.014,.885,mouthZ+.002]],.0024,'lower-lip');
    sphere(body,skin,[0,.870,-.027],[jaw*.72,.010,.017],'chin');
    const hairCap=add(body,new T.SphereGeometry(1,24,14,0,Math.PI*2,0,Math.PI*.52),hair,[0,.955,.005],[cheek*1.07,.057,.067],'hair-cap');
    if(character==='Kai'){
      const vertices=hairCap.geometry.getAttribute('position');
      for(let i=0;i<vertices.count;i++){
        const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i),angle=Math.atan2(z,x),edge=Math.sqrt(x*x+z*z);
        const uneven=1+.045*Math.sin(angle*3+y*2)+.025*Math.cos(angle*7-y);
        vertices.setXYZ(i,x*uneven,y+.025*Math.sin(angle*4)*edge,z*uneven);
      }
      hairCap.geometry.computeVertexNormals();hairCap.material=hair.clone();hairCap.material.roughness=.65;hairCap.material.clearcoat=.08;
    }
    const hairstyle=new T.Group(); hairstyle.name=d.hairstyle; body.add(hairstyle);
    // Swept surface strands give the scalp a directional silhouette and highlights.
    for(let strand=0;strand<(['Kai','Dante'].includes(character)?0:12);strand++) {
      const a=(strand/11-.5)*2.5,x=Math.sin(a)*cheek;
      curve(hairstyle,hair,[[x,.960,-Math.cos(a)*.057],[x*.78,.991,-.030],[x*.40,1.006,.012],[x*.25,.986,.057]],.0028,'scalp-strand');
    }
   if(character==='Maya') {
  // Maya: curly high ponytail.
  sphere(hairstyle,hair,[0,1.005,.048],[.058,.070,.065],'ponytail-root');
  ring(hairstyle,accent,[0,1.012,.078],.029,.006,'ponytail-tie').rotation.x=Math.PI/2;

  for(let i=0;i<16;i++) {
    const a=i*2.39996;
    const x=Math.cos(a)*.045;
    const y=.96+Math.sin(a)*.07;
    const z=.13+(i%4)*.022;
    sphere(hairstyle,hair,[x,y,z],[.022,.025,.023],'maya-curl');
  }

  for(const side of [-1,1]) {
    curve(hairstyle,hair,[
      [side*.044,.99,-.01],
      [side*.064,.96,-.045],
      [side*.069,.89,-.014]
    ],.008,'maya-face-curl');
  }

} else if(character==='Skye') {
  // Skye: half-up, half-down hairstyle.
  sphere(hairstyle,hair,[0,1.005,.048],[.047,.043,.045],'half-up-root');
  ring(hairstyle,accent,[0,1.012,.075],.024,.005,'half-up-tie').rotation.x=Math.PI/2;

  for(let i=0;i<7;i++) {
    const x=(i-3)*.012;
    curve(hairstyle,hair,[
      [x,1.03,.075],
      [x*1.4,1.05,.13],
      [x*1.6,.97,.19],
      [x*1.3,.89,.19]
    ],.009,'skye-upper-ponytail');
  }

  for(const side of [-1,1]) {
    for(let i=0;i<6;i++) {
      const x=side*(.045+i*.007);
      curve(hairstyle,hair,[
        [x,.98,.025],
        [x*1.2,.92,.055],
        [x*1.25,.84,.075],
        [x*1.1,.76,.085]
      ],.009,'skye-loose-hair');
    }
  }

  // Preserve Skye's headphones.
  add(hairstyle,new T.TorusGeometry(.081,.009,6,24,Math.PI),dark,[0,.925,.006],null,'headphone-band');

  for(const side of [-1,1]) {
    sphere(hairstyle,dark,[side*.083,.923,0],[.016,.035,.030],'headphone-earcup');
    sphere(hairstyle,accent,[side*.099,.923,0],[.006,.021,.018],'headphone-inset');
  }

  curve(hairstyle,hair,[
    [-.05,.99,-.03],
    [0,.97,-.065],
    [.05,.94,-.055]
  ],.012,'skye-swept-bangs');
    } else if(character==='Nova') {
      sphere(hairstyle,hair,[.034,1.005,.045],[.045,.052,.048],'ponytail-root');
      // Retain the user's segmented bubble hairstyle as one long tied ponytail.
      for(let i=0;i<6;i++) {
        const y=.998-i*.061,z=.11+Math.sin(i*.65)*.028;
        sphere(hairstyle,hair,[.065,y,z],[.033-i*.002,.033,.030],'bubble-braid');
        ring(hairstyle,accent,[.065,y-.026,z],.025-i*.002,.003,'bubble-tie').rotation.x=Math.PI/2;
      }
      for(let i=0;i<5;i++)curve(hairstyle,hair,[[-.05+i*.019,.990,-.025],[-.066+i*.020,.950,-.055],[-.061+i*.019,.929,-.047]],.007,'swept-bangs');
    } else if(character==='Zara'||character==='Jax') {
      for(let i=0;i<14;i++) {
        const angle=i/14*Math.PI*2,x=Math.cos(angle)*.060,z=Math.sin(angle)*.047,endY=.70+(i%3)*.025;
        const side=x<0?-1:1, sweepX=z<0?side*Math.max(.080,Math.abs(x)*1.3):x*1.25;
        // Front strands sweep beside the cheeks, keeping the eyes and face clear.
        const lowerHairZ=character==='Jax'?.14:.035+z*.4;
        const strand=curve(hairstyle,hair,[[x*.45,.999,z*.3],[x,.972,z],[sweepX,.91,Math.max(character==='Jax'?.075:.008,z*1.5)],
          [sweepX*1.1,.80,character==='Jax'?.13:Math.max(.015,z*1.5)],[sweepX*1.2,endY,lowerHairZ]],character==='Jax'?.008:.006,character==='Jax'?'loc':'braid');
        strand.userData.hairTip=[sweepX*1.2,endY,lowerHairZ];
        if(character==='Zara')for(let j=0;j<7;j++)sphere(hairstyle,hair,[sweepX*(1+j*.025),.93-j*.026,Math.max(.01,z*1.4)],[.0068,.010,.0068],'braid-plait');
        if(i%3===0)sphere(hairstyle,accent,[sweepX*1.15,endY+.02,lowerHairZ],[.010,.009,.010],'hair-bead');
      }
      if(character==='Zara') {
        const hood=add(hairstyle,new T.SphereGeometry(1,20,16,0,Math.PI*2,0,Math.PI*.72),white,[0,.94,.053],[.103,.105,.083],'white-hood'); hood.rotation.x=-.35;
        curve(hairstyle,white,[[-.097,.97,-.002],[-.11,.89,-.010],[-.08,.85,-.042],[0,.84,-.070],[.08,.85,-.042],[.11,.89,-.010],[.097,.97,-.002]],.013,'hood-edge');
      }
    } else if(character==='Rico') {
      const red=mat(0xce3c29,.78);
      add(hairstyle,new T.SphereGeometry(1,20,12,0,Math.PI*2,0,Math.PI*.5),red,[0,.969,.005],[.078,.063,.074],'backward-cap');
      sphere(hairstyle,red,[0,.982,.088],[.071,.007,.055],'rear-cap-brim');
      box(hairstyle,dark,[0,.980,-.068],[.036,.012,.005],'cap-adjuster');
      for(const side of [-1,1])curve(hairstyle,hair,[[side*.064,.963,.013],[side*.070,.934,.010],[side*.064,.907,.023]],.011,'side-lock');
    } else if(character==='Kai') {
      // Tousled bed-head lies along the scalp rather than standing in cone spikes.
      const kaiHair=hairCap.material;
      for(let i=0;i<4;i++){
        const x=.040-i*.022;
        curve(hairstyle,kaiHair,[[x,.993,-.022],[x-.011,.985,-.047],[x+(i%2?.008:-.008),.966,-.060],[x+.004,.950+(i%3)*.004,-.056]],.006+(i%2)*.001,'bangs');
      }
      for(const side of [-1,1])curve(hairstyle,kaiHair,[[side*.051,.975,.015],[side*.071,.956,.025],[side*.075,.939,.040]],.006,'side-lock');
      curve(hairstyle,accent,[[.052,.979,.006],[.061,.967,-.015],[.063,.955,-.028]],.0015,'kai-purple-hair-accent');
    } else if(character==='Dante') {
      // Owner chose the sheet's braided low bun on October 29.
      hairCap.scale.set(.071,.047,.068);
      const braidMat=mat(0x251b16,.48);
      for(let row=0;row<7;row++){
        const x=(row-3)*.017,points=[];
        for(let j=0;j<=18;j++){const t=j/18,angle=-Math.PI*.46+t*Math.PI*.89;
          points.push([x*(1-t*.68)+Math.sin(j*Math.PI)*.0025,.951+Math.cos(angle)*(.057-Math.abs(x)*.22),.009+Math.sin(angle)*.068]);}
        curve(hairstyle,braidMat,points,.0045,'dante-scalp-braid');
        for(let j=1;j<points.length-1;j+=2)sphere(hairstyle,braidMat,points[j],[.005,.0038,.004],'braid-plait');
      }
      sphere(hairstyle,braidMat,[0,.948,.090],[.029,.024,.024],'dante-braided-low-bun');
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5;curve(hairstyle,braidMat,[[Math.sin(a)*.025,.948+Math.cos(a)*.020,.095],[0,.948,.116],[Math.sin(a+.9)*.025,.948+Math.cos(a+.9)*.020,.095]],.0038,'bun-braid');}
      for(const side of [-1,1])curve(hairstyle,braidMat,[[side*.043,.977,-.045],[side*.052,.940,-.055],[side*.048,.905,-.053]],.003,'side-lock');
      curve(hairstyle,mat(0xb98454,.75),[[.067,.963,-.010],[.069,.950,-.029],[.070,.952,-.010],[.072,.939,.008]],.0015,'faded-lightning-design');
    } else {
      for(let i=0;i<13;i++) {
        const angle=i*2.39996,r=.015+(i%3)*.021,x=Math.cos(angle)*r,z=Math.sin(angle)*r;
        const top=new T.Vector3(x*1.45,1.07+(i%3)*.015,z*1.4-.01),base=new T.Vector3(x,.993,z);
        const spike=add(hairstyle,new T.ConeGeometry(.020,base.distanceTo(top),7),character==='Dante'&&i%3===0?accent:hair,base.clone().add(top).multiplyScalar(.5).toArray(),null,'hair-spike');
        spike.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),top.clone().sub(base).normalize());
      }
      for(const side of [-1,1])curve(hairstyle,hair,[[side*.03,1.01,-.02],[side*.018,.98,-.069],[side*.026,.944,-.057]],.010,'bangs');
    }
    if(['Maya','Nova','Zara'].includes(character))for(const side of [-1,1])ring(body,mat(0xe2b552,.3,.65),[side*.079,.886,-.006],.015,.0025,'hoop-earring');

    const arms=[],legs=[];
    for(const side of [-1,1]) {
      const arm=new T.Group();arm.name=side<0?'left-arm':'right-arm';arm.position.set(side*(d.shoulder+.020),shoulderY,0);body.add(arm);
      const upper=d.armLength*.51,lower=d.armLength*.49,r=d.muscle*.63;
      const bare=['Jax','Rico','Nova','Maya','Skye'].includes(character);
      sphere(arm,bare?skin:cloth,[0,-.016,0],[d.muscle,.042,.035],'deltoid');
      bone(arm,bare?skin:cloth,[0,-.025,0],[side*.008,-upper,-.014],r*1.22,r*.86,'upper-arm');
      sphere(arm,skin,[side*.008,-upper,-.014],[r*.96,.020,.018],'elbow');
      bone(arm,skin,[side*.008,-upper,-.014],[side*.012,-upper-lower,-.027],r,r*.66,'forearm');
      sphere(arm,dark,[side*.012,-d.armLength,-.027],[.022,.025,.021],'fingerless-glove');
      for(let finger=0;finger<4;finger++)bone(arm,skin,[side*.012+(finger-1.5)*.009,-d.armLength-.008,-.031],[side*.012+(finger-1.5)*.009,-d.armLength-.034,-.035],.0036,.003,'finger');
      box(arm,accent,[side*.014,-upper-lower*.75,-.031],[.032,.018,.010],'wrist-cuff');arms.push(arm);
      const limb=new T.Group();limb.name=side<0?'left-leg':'right-leg';limb.position.set(side*d.hip*.49,leg,0);body.add(limb);
      const thigh=(leg-.04)*.51,shinLength=(leg-.04)*.49,thighRadius=d.muscle*(character==='Maya'?1.35:1.08),pants=character==='Rico'?cloth:dark;
      bone(limb,pants,[0,-.008,0],[0,-thigh,.006],thighRadius,thighRadius*.75,'thigh');
      // Individual cargo cuts with articulated pockets in each hero's colors.
      const cargo={Maya:[1.30,.064,.055],Zara:[1.48,.076,.060],Nova:[1.40,.060,.052],Skye:[1.42,.070,.054],Jax:[1.32,.082,.069],Rico:[1.36,.075,.064],Kai:[1.45,.069,.057],Dante:[1.26,.061,.050]}[character]||[1.35,.065,.055];
      const trouser=limb.getObjectByName('thigh');trouser.scale.x=cargo[0];trouser.scale.z=cargo[0];
      const pocket=box(limb,pants,[side*thighRadius*cargo[0],-thigh*.47,0],[.025,cargo[1],cargo[2]],'cargo-pocket');
      box(pocket,dark,[side*.001,cargo[1]*.35,-.002],[.028,.016,cargo[2]*1.06],character==='Dante'?'cargo-zip-flap':'cargo-pocket-flap');
      box(pocket,accent,[side*.014,.008,-cargo[2]*.22],[.004,.012,.016],'cargo-pocket-tab');
      if(character==='Jax'||character==='Rico')box(limb,pants,[side*thighRadius*.94,-thigh*.78,.004],[.026,.042,.048],'cargo-secondary-pocket');
      if(character==='Kai'||character==='Skye')curve(limb,accent,[[side*.012,-thigh*.22,-thighRadius],[side*thighRadius,-thigh*.31,-.022],[side*thighRadius,-thigh*.44,.012]],.002,'cargo-diagonal-seam');
      sphere(limb,metal,[0,-thigh,-.013],[thighRadius*.78,.023,.017],'knee-pad');
      const shin=new T.Group();shin.position.set(0,-thigh,.006);limb.add(shin);
      bone(shin,pants,[0,0,0],[0,-shinLength,-.006],thighRadius*.72,thighRadius*.52,'shin');
      const lowerCargo=shin.getObjectByName('shin');lowerCargo.scale.x=cargo[0]*1.08;lowerCargo.scale.z=cargo[0];
      const cuff=add(shin,new T.CylinderGeometry(thighRadius*.69,thighRadius*.64,.018,20),dark,[0,-shinLength+.018,-.005],null,'cargo-ankle-cuff');
      sphere(shin,character==='Skye'?white:dark,[0,-shinLength-.010,-.023],[.035,.030,.064],'boot');
      box(shin,accent,[0,-shinLength-.036,-.023],[.066,.008,.104],'boot-sole');
      for(let lace=0;lace<3;lace++)box(shin,accent,[0,-shinLength+.018,-.025-lace*.013],[.041,.003,.003],'shoe-lace');
      limb.userData.shin=shin;legs.push(limb);
    }
    const belt=add(body,new T.CylinderGeometry(d.hip*.97,d.hip*.98,.022,22),dark,[0,hipY+.075,0],[1,1,.62],'belt');
    box(body,accent,[0,hipY+.075,-d.hip*.64],[.027,.026,.009],'belt-buckle');
    for(const side of [-1,1])box(body,dark,[side*d.hip*.91,hipY+.038,0],[.034,.060,.038],'utility-pouch');
    const chestY=shoulderY-.070;
    for(const side of [-1,1]) {
      const female=['Maya','Nova','Skye'].includes(character);
      const panelDepth=female?(character==='Nova'?.021:.033):.018;
      sphere(body,character==='Rico'?skin:cloth,[side*d.shoulder*.40,chestY,female?-.045:-.070],
        [d.shoulder*.47,female?.043:.040,panelDepth],female?'fitted-chest-panel':'pectoral-panel');
      const strap=box(body,dark,[side*d.shoulder*.65,female?.795:chestY,-.065],[.023,female?.095:.154,.014],'harness');strap.rotation.z=side*.14;
      if(female)curve(body,accent,[[side*d.shoulder*.79,chestY,-.061],[side*d.waist,hipY+.11,-.047]],.003,'outfit-piping');
      else if(character!=='Rico')sphere(arms[side<0?0:1],cloth,[side*.016,-.009,0],[d.muscle*1.25,.025,.048],'shoulder-armor');
    }
    if(['Maya','Nova','Skye'].includes(character))box(body,accent,[0,chestY-.05,-.072],[.023,.025,.007],'chest-emblem');
    else for(let row=0;row<3;row++)for(const side of [-1,1])box(body,accent,[side*.034,chestY-.05-row*.029,-.068],[.055,.020,.007],'vest-detail');
    if(character==='Dante'||character==='Zara') {
      const scarf=character==='Zara'?white:accent;
      ring(body,scarf,[0,.851,0],.055,.015,'scarf').rotation.x=Math.PI/2;
      curve(body,scarf,[[-.05,.84,-.015],[-.065,.77,-.072],[-.018,.70,-.071]],.013,'scarf-tail');
      for(const side of [-1,1])ring(arms[side<0?0:1],accent,[0,-.021,-.043],.019,.003,'armor-emblem');
    }
    if(character==='Kai') {
      curve(body,cloth,[[-.09,.823,.014],[0,.76,.094],[.09,.823,.014]],.020,'folded-hood');
      for(const side of [-1,1])curve(body,white,[[side*.030,.82,-.047],[side*.035,.72,-.073]],.0025,'hood-drawstring');
    }
    if(character==='Jax')curve(body,accent,[[-.065,.77,-.080],[-.025,.79,-.086],[0,.75,-.087],[.025,.79,-.086],[.065,.77,-.080]],.004,'dragon-insignia');

    const blaster=new T.Group();blaster.name='paint-blaster';blaster.position.set(.008,-d.armLength-.003,-.025);arms[1].add(blaster);
    sphere(blaster,cloth,[0,.018,-.055],[.018,.022,.065],'blaster-receiver');
    bone(blaster,metal,[0,.020,-.075],[0,.020,-.17],.010,.009,'paint-barrel');
    bone(blaster,accent,[0,.020,-.168],[0,.020,-.190],.012,.012,'paint-muzzle');
    box(blaster,dark,[0,-.012,-.026],[.017,.045,.020],'blaster-grip');
    sphere(blaster,accent,[0,.069,-.050],[.030,.020,.044],'paint-hopper');
    bone(blaster,dark,[0,.039,-.05],[0,.060,-.05],.006,.006,'hopper-neck');
    sphere(blaster,metal,[0,.012,.022],[.018,.018,.039],'paint-air-tank');
    let mayaTransformation=null;
    if(character==='Maya'){
      const ponytail=new T.Group();ponytail.name='Maya transforming ponytail';ponytail.position.set(0,1.005,.075);
      for(const part of [...hairstyle.children])if(['ponytail-root','ponytail-tie','maya-curl'].includes(part.name)){
        part.position.sub(ponytail.position);ponytail.add(part);
      }
      hairstyle.add(ponytail);
      const afro=new T.Group();afro.name='Maya confidence afro';afro.position.set(0,1.005,.012);hairstyle.add(afro);
      const curlGeometry=new T.SphereGeometry(1,10,8);
      for(let i=0;i<64;i++){
        const y=(i+.5)/64,angle=i*2.399963,r=Math.sqrt(1-y*y);
        const curl=new T.Mesh(curlGeometry,hair);curl.name='Confidence afro curl';
        curl.position.set(Math.cos(angle)*r,y*.9,Math.sin(angle)*r*.84);
        curl.scale.set(.18+(i%3)*.015,.19,.17);afro.add(curl);
      }
      afro.scale.setScalar(.015);afro.visible=false;
      const aura=new T.Group();aura.name='Maya rainbow shadow aura';group.add(aura);
      [0xff667c,0xffb05c,0xffe078,0x78dcab,0x72d6ed,0x8c99ef,0xcb8be6].forEach((color,i)=>{
        const band=new T.Mesh(new T.RingGeometry(.23+i*.025,.253+i*.025,48),new T.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}));
        band.rotation.x=-Math.PI/2;band.position.y=.015+i*.0002;aura.add(band);
      });aura.visible=false;mayaTransformation={ponytail,afro,aura};
    }
    const zaraEyes=[];if(character==='Zara')body.traverse(part=>{
      if(['eye-white','iris','pupil','eye-highlight'].includes(part.name)){
        // Whites and pupils otherwise share materials with gear and accessories.
        part.material=part.material.clone();zaraEyes.push(part);
      }
    });
    let jaxEffects=null;
    if(character==='Jax'){
      const muscles=[];body.traverse(part=>{if(['deltoid','upper-arm','forearm','pectoral-panel'].includes(part.name))muscles.push(part);});
      const dragon=new T.Group();dragon.name='Ryujin — Jax companion dragon';group.add(dragon);
      const blue=mat(0x277cce,.42),pale=mat(0xb5edff,.48),cyan=mat(0x58d4ef,.34),navy=mat(0x103b74,.46);
      sphere(dragon,blue,[0,-.015,.015],[.12,.145,.27],'dragon-body');
      sphere(dragon,pale,[0,-.045,-.105],[.083,.10,.16],'dragon-belly');
      // Raised reptilian neck and long, angular muzzle instead of a round mascot head.
      curve(dragon,blue,[[0,.035,-.14],[0,.13,-.20],[0,.23,-.23],[0,.255,-.29]],.059,'dragon-neck');
      curve(dragon,pale,[[0,.045,-.193],[0,.13,-.25],[0,.21,-.285]],.026,'dragon-throat');
      sphere(dragon,blue,[0,.26,-.30],[.080,.067,.105],'dragon-head');
      sphere(dragon,blue,[0,.232,-.425],[.067,.033,.13],'dragon-muzzle');
      sphere(dragon,pale,[0,.205,-.414],[.058,.014,.122],'dragon-lower-jaw');
      for(let i=0;i<5;i++){
        const plate=sphere(dragon,pale,[0,-.04+i*.025,-.245+i*.031],[.061-i*.004,.013,.027],'dragon-belly-scale');plate.rotation.x=-.35;
        bone(dragon,navy,[0,.125-i*.013,.01+i*.046],[0,.215-i*.017,.045+i*.046],.028,.002,'dragon-back-spine');
      }
      const tail=new T.Group();tail.position.set(0,-.035,.22);dragon.add(tail);
      curve(tail,blue,[[0,0,0],[.04,-.05,.10],[.12,-.04,.22]],.039,'dragon-tail-base');
      curve(tail,blue,[[.12,-.04,.22],[.22,-.005,.34],[.26,.07,.44]],.023,'dragon-tail-middle');
      curve(tail,blue,[[.26,.07,.44],[.24,.14,.53],[.18,.18,.59]],.010,'dragon-tail-tip');
      bone(tail,navy,[.18,.18,.59],[.10,.20,.66],.026,.001,'dragon-tail-spade');
      for(const side of [-1,1]){
        sphere(dragon,cyan,[side*.069,.277,-.348],[.019,.013,.020],'dragon-eye');
        sphere(dragon,navy,[side*.070,.278,-.365],[.004,.011,.005],'dragon-slit-pupil');
        curve(dragon,navy,[[side*.048,.296,-.375],[side*.075,.302,-.34],[side*.081,.285,-.31]],.009,'dragon-brow-ridge');
        curve(dragon,pale,[[side*.052,.304,-.259],[side*.083,.365,-.22],[side*.09,.40,-.15]],.015,'dragon-swept-horn');
        bone(dragon,pale,[side*.09,.40,-.15],[side*.08,.415,-.11],.015,.001,'dragon-horn-tip');
        bone(dragon,blue,[side*.09,-.06,.12],[side*.14,-.17,.08],.046,.03,'dragon-haunch');
        bone(dragon,blue,[side*.14,-.17,.08],[side*.13,-.23,-.035],.027,.019,'dragon-hind-leg');
        bone(dragon,blue,[side*.075,.035,-.13],[side*.11,-.10,-.20],.025,.016,'dragon-foreleg');
        for(const [x,y,z] of [[side*.13,-.235,-.07],[side*.11,-.12,-.23]]){
          sphere(dragon,blue,[x,y,z],[.032,.018,.048],'dragon-foot');
          for(let claw=0;claw<3;claw++)bone(dragon,pale,[x+(claw-1)*.018,y-.003,z-.03],[x+(claw-1)*.019,y-.014,z-.07],.006,.001,'dragon-claw');
        }
        sphere(dragon,navy,[side*.037,.25,-.523],[.009,.005,.014],'dragon-nostril');
        curve(dragon,navy,[[side*.055,.211,-.51],[side*.061,.211,-.43],[side*.058,.219,-.36]],.0025,'dragon-mouth-line');
        for(let tooth=0;tooth<3;tooth++)bone(dragon,white,[side*.052,.216,-.49+tooth*.033],[side*.05,.201,-.49+tooth*.033],.004,.001,'dragon-tooth');
      }
      const wings=[];
      for(const side of [-1,1]){
        const wing=new T.Group();wing.position.set(side*.085,.065,.035);dragon.add(wing);wings.push(wing);
        const shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(side*.16,.24);shape.lineTo(side*.48,.40);
        shape.quadraticCurveTo(side*.38,.20,side*.55,.035);shape.quadraticCurveTo(side*.36,.08,side*.35,-.135);
        shape.quadraticCurveTo(side*.19,-.04,side*.13,-.21);shape.lineTo(0,-.07);shape.closePath();
        const membrane=new T.Mesh(new T.ShapeGeometry(shape),new T.MeshPhysicalMaterial({color:0x3e9dce,side:T.DoubleSide,roughness:.55}));wing.add(membrane);
        curve(wing,navy,[[0,0,0],[side*.16,.24,0],[side*.48,.40,0]],.013,'dragon-wing-arm');
        for(const [x,y] of [[.55,.035],[.35,-.135],[.13,-.21]])curve(wing,cyan,[[side*.16,.24,-.003],[side*x*.8,y+.06,-.005],[side*x,y,-.005]],.006,'dragon-wing-finger');
        bone(wing,pale,[side*.16,.24,0],[side*.13,.31,0],.012,.001,'dragon-wing-claw');
      }
      const fire=new T.Group();fire.name='Harmless magical fire';fire.position.set(0,.218,-.54);dragon.add(fire);
      [0x42bfff,0x9becff,0xf4f3bd].forEach((color,i)=>{
        const flame=new T.Mesh(new T.ConeGeometry(.055-i*.014,.36-i*.04,10),new T.MeshBasicMaterial({color,transparent:true,opacity:.65,depthWrite:false}));
        flame.rotation.x=-Math.PI/2;flame.position.z=-.15+i*.035;fire.add(flame);
      });
      const rings=[];
      for(let i=0;i<2;i++){
        const ripple=new T.Mesh(new T.RingGeometry(.27,.292,12),new T.MeshBasicMaterial({color:0x76dfff,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}));
        ripple.rotation.x=-Math.PI/2;ripple.position.y=.009+i*.001;group.add(ripple);ripple.visible=false;rings.push(ripple);
      }
      dragon.scale.setScalar(.001);dragon.position.set(.63,.70,.06);dragon.visible=false;fire.visible=false;
      jaxEffects={muscles,dragon,wings,tail,fire,rings};
    }
    const hairDynamics=[];
    function hairPivot(items,root,strength){
      if(!items.length)return;
      const pivot=new T.Group();pivot.name='hair-motion-pivot';pivot.position.set(...root);hairstyle.add(pivot);
      for(const item of items){item.position.sub(pivot.position);pivot.add(item);}
      hairDynamics.push({pivot,strength,phase:hairDynamics.length*.83});
    }
    const hairParts=[...hairstyle.children];
    if(character==='Maya')hairPivot([mayaTransformation.ponytail],[0,1.005,.075],.30);
    else if(character==='Nova')hairPivot(hairParts.filter(p=>['bubble-braid','bubble-tie'].includes(p.name)),[.034,1.005,.045],.34);
    else if(character==='Jax'||character==='Zara')hairPivot(hairParts.filter(p=>['loc','braid','braid-plait','hair-bead'].includes(p.name)),[0,.99,.03],.30);
    else for(const part of hairParts){
      if(['skye-upper-ponytail','skye-loose-hair','side-lock','bangs'].includes(part.name))hairPivot([part],part.userData.curveRoot||[0,.99,0],character==='Skye'?.27:.07);
    }
    const heightMeters=d.heightInches*.0254;
    group.scale.setScalar(heightMeters);
    group.userData.character=character;group.userData.design={...d,heightMeters};
    group.userData.standingHeight=heightMeters;group.userData.eyeHeight=.929*heightMeters;
    group.userData.baseBodyY=0;body.position.y=0;
    group.userData.parts={body,armL:arms[0],armR:arms[1],legL:legs[0],legR:legs[1],blaster,shirt:cloth,accent,head,torso,hairstyle,belt,mayaTransformation,zaraEyes,jaxEffects,hairDynamics};
    applyCharacterSheetDetails(T,group,{box,curve,ring,sphere,mat,skin});
    if(donghua){
      // A small set of restrained silhouette lines, not an outline on every detail.
      const contourMaterial=new T.MeshBasicMaterial({color:0x252335,side:T.BackSide,transparent:true,opacity:.48,depthWrite:false});
      const contours=[];group.traverse(part=>{if(['head','hair-cap','tailored-torso','upper-arm','forearm','thigh','shin','dragon-body','dragon-head','dragon-muzzle'].includes(part.name))contours.push(part);});
      for(const part of contours){const contour=new T.Mesh(part.geometry,contourMaterial);contour.name='donghua-contour';contour.scale.setScalar(1.012);contour.userData.decorative=true;part.add(contour);}
    }
    group.userData.visualStyle=style;
    group.traverse(part=>{if(part.isMesh&&!part.userData.decorative){part.castShadow=true;part.receiveShadow=true;}});
    return group;
  };
}

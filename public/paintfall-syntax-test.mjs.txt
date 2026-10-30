import { CHARACTER_DESIGNS } from './paintfall-character-designs.js';

// Individually proportioned, articulated bases. The outdoor world owns THREE.
export function createCharacterFactory(T) {
  const mat = (color, roughness=.68, metalness=.04) => new T.MeshPhysicalMaterial({color,roughness,metalness});
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
    return add(p,new T.TubeGeometry(path,12,r,6,false),m,[0,0,0],null,name);
  }
  const ring=(p,m,pos,r,tube,name)=>add(p,new T.TorusGeometry(r,tube,6,20),m,pos,null,name);
  return function makeCharacter(character) {
    const d=CHARACTER_DESIGNS[character]||CHARACTER_DESIGNS.Maya;
    const group=new T.Group(), body=new T.Group(); group.add(body);
    const skin=mat(d.skin), hair=mat(d.hair,.42), cloth=mat(d.outfit,.78), accent=mat(d.accent,.42,.22);
    skin.roughness=.57;skin.metalness=0;skin.clearcoat=.12;skin.clearcoatRoughness=.65;
    cloth.sheen=.45;cloth.sheenColor.set(d.outfit);cloth.sheenRoughness=.8;
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
    add(body,new T.SphereGeometry(1,24,14,0,Math.PI*2,0,Math.PI*.52),hair,[0,.955,.005],[cheek*1.07,.057,.067],'hair-cap');
    const hairstyle=new T.Group(); hairstyle.name=d.hairstyle; body.add(hairstyle);
    // Swept surface strands give the scalp a directional silhouette and highlights.
    for(let strand=0;strand<12;strand++) {
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
        curve(hairstyle,hair,[[x*.45,.999,z*.3],[x,.972,z],[sweepX,.91,Math.max(.008,z*1.5)],
          [sweepX*1.1,.80,Math.max(.015,z*1.5)],[sweepX*1.2,endY,.035+z*.4]],character==='Jax'?.008:.006,character==='Jax'?'loc':'braid');
        if(character==='Zara')for(let j=0;j<7;j++)sphere(hairstyle,hair,[sweepX*(1+j*.025),.93-j*.026,Math.max(.01,z*1.4)],[.0068,.010,.0068],'braid-plait');
        if(i%3===0)sphere(hairstyle,accent,[sweepX*1.15,endY+.02,.035+z*.4],[.010,.009,.010],'hair-bead');
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
      sphere(limb,metal,[0,-thigh,-.013],[thighRadius*.78,.023,.017],'knee-pad');
      const shin=new T.Group();shin.position.set(0,-thigh,.006);limb.add(shin);
      bone(shin,pants,[0,0,0],[0,-shinLength,-.006],thighRadius*.72,thighRadius*.52,'shin');
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
    const heightMeters=d.heightInches*.0254;
    group.scale.setScalar(heightMeters);
    group.userData.character=character;group.userData.design={...d,heightMeters};
    group.userData.standingHeight=heightMeters;group.userData.eyeHeight=.929*heightMeters;
    group.userData.baseBodyY=0;body.position.y=0;
    group.userData.parts={body,armL:arms[0],armR:arms[1],legL:legs[0],legR:legs[1],blaster,shirt:cloth,accent,head,torso,hairstyle,belt};
    group.traverse(part=>{if(part.isMesh){part.castShadow=true;part.receiveShadow=true;}});
    return group;
  };
}

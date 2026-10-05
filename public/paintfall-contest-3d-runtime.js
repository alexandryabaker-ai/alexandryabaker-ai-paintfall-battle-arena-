(()=> {
  if (window.__pfContest3DRuntime) return;
  window.__pfContest3DRuntime = true;

  function boot() {
    const arena = document.getElementById('arena');
    if (arena) arena.style.display = 'none';
    const game = document.getElementById('game');
    if (!game) {
      setTimeout(boot, 100);
      return;
    }

    const previousWorld = document.getElementById('paintfallContest3D');
    if (previousWorld) previousWorld.remove();
    const host = document.createElement('div');
    host.id = 'paintfallContest3D';
    host.style.cssText = 'position:relative;width:100%;height:clamp(420px,70vw,700px);min-height:420px;overflow:hidden;border-radius:18px;background:#101722;border:2px solid #29364b;box-shadow:0 18px 50px rgba(0,0,0,.45)';
    game.insertBefore(host, game.firstChild);

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    host.appendChild(canvas);
    const badge = document.createElement('div');
    badge.textContent = '🌎 PAINTFALL • 3D WORLD';
    badge.style.cssText = 'position:absolute;top:10px;left:12px;color:#fff;font:900 12px system-ui;text-shadow:0 2px 5px #000;pointer-events:none';
    host.appendChild(badge);
    const status = document.createElement('div');
    status.textContent = 'WORLD LOADING';
    status.style.cssText = 'position:absolute;top:10px;right:12px;color:#fff;background:rgba(15,70,55,.85);padding:6px 9px;border-radius:10px;font:900 11px system-ui;pointer-events:none';
    host.appendChild(status);

    const cameraButton = document.createElement('button');
    cameraButton.type = 'button';
    cameraButton.textContent = '🎥 THIRD PERSON';
    cameraButton.style.cssText = 'position:absolute;top:48px;right:12px;padding:9px 11px;border:2px solid #fff;border-radius:11px;background:rgba(18,24,39,.92);color:#fff;font:900 11px system-ui;cursor:pointer;box-shadow:0 4px 12px #000';
    host.appendChild(cameraButton);
    const cameraHint = document.createElement('div');
    cameraHint.textContent = 'Camera can be changed anytime';
    cameraHint.style.cssText = 'position:absolute;top:91px;right:12px;color:#fff;background:rgba(18,24,39,.72);padding:5px 8px;border-radius:9px;font:800 9px system-ui;pointer-events:none';
    host.appendChild(cameraHint);

    let cameraMode = 'third';
    let camYaw = 0;
    let camPitch = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    function pointerDown(event) {
      if (event.target === cameraButton) return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      host.setPointerCapture?.(event.pointerId);
    }
    function pointerMove(event) {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      camYaw -= dx * .008;
      camPitch = Math.max(-1.15, Math.min(1.15, camPitch - dy * .006));
    }
    function pointerUp() { dragging = false; }
    host.addEventListener('pointerdown', pointerDown);
    host.addEventListener('pointermove', pointerMove);
    host.addEventListener('pointerup', pointerUp);
    host.addEventListener('pointercancel', pointerUp);
    function toggleCamera() {
      cameraMode = cameraMode === 'third' ? 'first' : 'third';
      cameraButton.textContent = cameraMode === 'third' ? '🎥 THIRD PERSON' : '👁️ FIRST PERSON';
    }
    cameraButton.addEventListener('click', toggleCamera);
    host.tabIndex = 0;
    host.addEventListener('keydown', event => {
      if (event.key.toLowerCase() === 'c') toggleCamera();
    });

    let gl = null;
    try {
      gl = canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' }) ||
        canvas.getContext('experimental-webgl', { antialias: true, alpha: false });
    } catch (_) {}
    if (!gl) {
      status.textContent = '3D UNAVAILABLE';
      return;
    }

    const vertexShader = [
      'attribute vec3 a_position;',
      'attribute vec3 a_normal;',
      'attribute vec3 a_color;',
      'attribute vec2 a_material;',
      'uniform mat4 u_mvp;',
      'varying vec3 v_position;',
      'varying vec3 v_normal;',
      'varying vec3 v_color;',
      'varying vec2 v_material;',
      'void main(){',
      '  v_position=a_position;',
      '  v_normal=a_normal;',
      '  v_color=a_color;',
      '  v_material=a_material;',
      '  gl_Position=u_mvp*vec4(a_position,1.0);',
      '}'
    ].join('\n');
    const fragmentShader = [
      'precision mediump float;',
      'uniform vec3 u_camera;',
      'uniform vec3 u_light;',
      'uniform vec3 u_fogColor;',
      'varying vec3 v_position;',
      'varying vec3 v_normal;',
      'varying vec3 v_color;',
      'varying vec2 v_material;',
      'void main(){',
      '  vec3 n=normalize(v_normal);',
      '  vec3 l=normalize(u_light);',
      '  vec3 v=normalize(u_camera-v_position);',
      '  vec3 h=normalize(l+v);',
      '  float diffuse=max(dot(n,l),0.0);',
      '  float ambient=0.22+0.14*max(n.y,0.0);',
      '  float rough=clamp(v_material.x,0.08,1.0);',
      '  float metal=clamp(v_material.y,0.0,1.0);',
      '  float spec=pow(max(dot(n,h),0.0),mix(96.0,8.0,rough));',
      '  vec3 base=v_color*(ambient+0.72*diffuse)*(1.0-0.24*metal);',
      '  base+=mix(vec3(0.18),v_color,metal)*spec*(0.10+0.38*(1.0-rough));',
      '  float distanceToCamera=length(u_camera-v_position);',
      '  float fog=smoothstep(44.0,92.0,distanceToCamera);',
      '  gl_FragColor=vec4(mix(base,u_fogColor,fog),1.0);',
      '}'
    ].join('\n');
    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        status.textContent = '3D SHADER ERROR';
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }
    const vertexShaderObject = compileShader(gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertexShaderObject || !fragment) return;
    const program = gl.createProgram();
    gl.attachShader(program, vertexShaderObject);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      status.textContent = '3D LINK ERROR';
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const normalLocation = gl.getAttribLocation(program, 'a_normal');
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    const materialLocation = gl.getAttribLocation(program, 'a_material');
    const matrixLocation = gl.getUniformLocation(program, 'u_mvp');
    const cameraLocation = gl.getUniformLocation(program, 'u_camera');
    const lightLocation = gl.getUniformLocation(program, 'u_light');
    const fogLocation = gl.getUniformLocation(program, 'u_fogColor');
    const vertexBuffer = gl.createBuffer();

    const vertices = [];
    const colliders = [];
    function vertex(position, normal, color, roughness, metalness) {
      vertices.push(
        position[0], position[1], position[2],
        normal[0], normal[1], normal[2],
        color[0], color[1], color[2],
        roughness, metalness
      );
    }
    function triangle(a, b, c, normal, color, roughness, metalness) {
      vertex(a, normal, color, roughness, metalness);
      vertex(b, normal, color, roughness, metalness);
      vertex(c, normal, color, roughness, metalness);
    }
    const cubeFaces = [
      { n: [0, 0, -1], p: [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1]] },
      { n: [0, 0, 1], p: [[-1,-1,1],[-1,1,1],[1,1,1],[1,-1,1]] },
      { n: [0, -1, 0], p: [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]] },
      { n: [0, 1, 0], p: [[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]] },
      { n: [1, 0, 0], p: [[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]] },
      { n: [-1, 0, 0], p: [[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]] }
    ];
    function addBox(x, y, z, width, height, depth, color, roughness = .78, metalness = 0, rotation = 0, solid = false) {
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const transform = point => {
        const px = point[0] * width * .5;
        const py = point[1] * height * .5;
        const pz = point[2] * depth * .5;
        return [x + px * cos + pz * sin, y + py, z - px * sin + pz * cos];
      };
      const transformNormal = normal => [normal[0]*cos+normal[2]*sin,normal[1],-normal[0]*sin+normal[2]*cos];
      for (const face of cubeFaces) {
        const p = face.p.map(transform);
        const normal=transformNormal(face.n);
        triangle(p[0], p[1], p[2], normal, color, roughness, metalness);
        triangle(p[0], p[2], p[3], normal, color, roughness, metalness);
      }
      if (solid) {
        colliders.push({
          type: 'box',
          min: [x - (Math.abs(width*cos)+Math.abs(depth*sin))*.5, y-height*.5, z-(Math.abs(width*sin)+Math.abs(depth*cos))*.5],
          max: [x + (Math.abs(width*cos)+Math.abs(depth*sin))*.5, y+height*.5, z+(Math.abs(width*sin)+Math.abs(depth*cos))*.5]
        });
      }
    }
    function addSphere(x, y, z, sx, sy, sz, color, roughness = .8, metalness = 0, segments = 12, rings = 8) {
      for (let r = 0; r < rings; r++) {
        const phi0 = Math.PI * r / rings;
        const phi1 = Math.PI * (r + 1) / rings;
        for (let j = 0; j < segments; j++) {
          const theta0 = 2 * Math.PI * j / segments;
          const theta1 = 2 * Math.PI * (j + 1) / segments;
          const point = (phi, theta) => {
            const nx = Math.sin(phi) * Math.cos(theta);
            const ny = Math.cos(phi);
            const nz = Math.sin(phi) * Math.sin(theta);
            return {
              p: [x + sx*nx, y + sy*ny, z + sz*nz],
              n: [nx/sx, ny/sy, nz/sz]
            };
          };
          const a = point(phi0, theta0);
          const b = point(phi1, theta0);
          const c = point(phi1, theta1);
          const d = point(phi0, theta1);
          triangle(a.p,b.p,c.p,a.n,color,roughness,metalness);
          triangle(a.p,c.p,d.p,a.n,color,roughness,metalness);
        }
      }
    }
    function addCylinder(x, y, z, radius, height, color, roughness = .7, metalness = 0, segments = 16) {
      for (let i = 0; i < segments; i++) {
        const a0 = 2*Math.PI*i/segments;
        const a1 = 2*Math.PI*(i+1)/segments;
        const p0 = [x+radius*Math.cos(a0),y-height*.5,z+radius*Math.sin(a0)];
        const p1 = [x+radius*Math.cos(a1),y-height*.5,z+radius*Math.sin(a1)];
        const p2 = [x+radius*Math.cos(a1),y+height*.5,z+radius*Math.sin(a1)];
        const p3 = [x+radius*Math.cos(a0),y+height*.5,z+radius*Math.sin(a0)];
        const n0 = [Math.cos(a0),0,Math.sin(a0)];
        const n1 = [Math.cos(a1),0,Math.sin(a1)];
        triangle(p0,p1,p2,n0,color,roughness,metalness);
        triangle(p0,p2,p3,n0,color,roughness,metalness);
        triangle([x,y-height*.5,z],p1,p0,[0,-1,0],color,roughness,metalness);
        triangle([x,y+height*.5,z],p3,p2,[0,1,0],color,roughness,metalness);
      }
    }
    function addSoftShadow(x, z, rx, rz, floorColor) {
      const rings = 5;
      const segments = 20;
      for (let ring = 0; ring < rings; ring++) {
        const outer = 1 - ring / rings;
        const inner = 1 - (ring + 1) / rings;
        const darken = .78 + ring * .035;
        const color = floorColor.map(value => value * darken);
        for (let i = 0; i < segments; i++) {
          const a0 = 2*Math.PI*i/segments;
          const a1 = 2*Math.PI*(i+1)/segments;
          const p = (radius, angle) => [x+Math.cos(angle)*rx*radius,.038,z+Math.sin(angle)*rz*radius];
          const a = p(outer,a0), b = p(outer,a1), c = p(inner,a1), d = p(inner,a0);
          triangle(a,b,c,[0,1,0],color,.98,0);
          triangle(a,c,d,[0,1,0],color,.98,0);
        }
      }
    }

    const floorColors = [[.23,.27,.28],[.25,.29,.30],[.27,.30,.30],[.24,.28,.29]];
    const concrete = [.30,.34,.34];
    const wallSteel = [.18,.24,.28];
   function solidBox(x,y,z,w,h,d,color,roughness=.78,metalness=0,rotation=0) {
      addBox(x,y,z,w,h,d,color,roughness,metalness,rotation,true);
   }

    addBox(0,-.58,0,52,1.12,40,[.20,.24,.25],.94,.02);
    colliders.push({type:'box',min:[-26,-1.14,-20],max:[26,-.02,20]});
    for (let ix=-6;ix<=6;ix++) {
      for (let iz=-5;iz<=5;iz++) {
        const seed=(ix*37+iz*71+ix*iz*13+1000)%11;
        const color=floorColors[Math.abs(seed)%floorColors.length];
        addBox(ix*4,-.005,iz*3.4,3.94,.035,3.34,color,.96,.01);
        if ((ix+iz)%6===0) {
          const stainColor=seed%2?[.34,.10,.16]:[.10,.22,.34];
          addSphere(ix*4+(seed%3)*.3,.025,iz*3.4+.4,.8,.025,.44,stainColor,.92,0,12,4);
        }
      }
    }
    for(let x=-24;x<=24;x+=8) {
      addBox(x,.045,0,.16,.045,37,[.56,.60,.57],.82,.1);
    }
    for(let z=-17;z<=17;z+=8.5) {
      addBox(0,.045,z,49,.045,.15,[.53,.57,.55],.85,.05);
    }
    addBox(0,.055,-13,2.8,.05,11,[.78,.45,.13],.85,.02);
    addBox(0,.055,13,2.8,.05,11,[.78,.45,.13],.85,.02);

    const wallColor=[.21,.27,.30];
    const wallTrim=[.36,.42,.43];
    solidBox(0,2.5,-19,52,5,1.2,wallColor,.8,.12);
    // The preserved third-person camera follows the player's x coordinate
    // from 24 units outside the south edge. Keep only short corner returns
    // above the continuous low curb so any legal spawn has a clear sightline.
    solidBox(-24.75,2.5,19,2.5,5,1.2,wallColor,.8,.12);
    solidBox(24.75,2.5,19,2.5,5,1.2,wallColor,.8,.12);
    // Keep the side boundaries, but make them open guard rails: the full-height
    // opaque walls dominated the preserved camera's view of the playable floor.
    solidBox(-25,.48,0,1.2,.96,38,[.29,.34,.34],.82,.08);
    solidBox(25,.48,0,1.2,.96,38,[.29,.34,.34],.82,.08);
    for(let z=-18.5;z<=18.5;z+=.55) {
      addBox(-25,2.86,z,.10,3.8,.10,[.28,.36,.38],.48,.62);
      addBox(25,2.86,z,.10,3.8,.10,[.28,.36,.38],.48,.62);
    }
    for(const y of [1.15,2.85,4.75]) {
      addBox(-25,y,0,.14,.12,38,[.34,.42,.43],.42,.68);
      addBox(25,y,0,.14,.12,38,[.34,.42,.43],.42,.68);
    }
    for(let x=-24;x<=24;x+=6) {
      addBox(x,2.6,-18.34,.28,4.5,.10,wallTrim,.45,.6);
      if(Math.abs(x)>=24)addBox(x,2.6,18.34,.28,4.5,.10,wallTrim,.45,.6);
      addBox(x<0?-24.34:24.34,2.6,x/25*18,.10,4.5,.28,wallTrim,.45,.6);
    }
    addBox(0,.28,-18.25,50,.42,.18,[.34,.39,.39],.68,.18);
    addBox(0,.28,18.25,50,.42,.18,[.34,.39,.39],.68,.18);
    addBox(-24.25,.28,0,.18,.42,36,[.34,.39,.39],.68,.18);
    addBox(24.25,.28,0,.18,.42,36,[.34,.39,.39],.68,.18);

    // Overhead steel gantries add scale and a readable arena silhouette.
    for(let x=-20;x<=20;x+=10) {
      addBox(x,6.2,-18.35,.22,.22,1.1,[.22,.29,.31],.48,.72);
      addBox(x,6.2,18.35,.22,.22,1.1,[.22,.29,.31],.48,.72);
      addBox(-24.35,6.2,x*.82,1.1,.22,.22,[.22,.29,.31],.48,.72);
      addBox(24.35,6.2,x*.82,1.1,.22,.22,[.22,.29,.31],.48,.72);
      addBox(x,9,0,.18,.18,37,[.19,.25,.27],.5,.74,0);
    }
    addBox(0,8.95,0,50,.22,.22,[.19,.25,.27],.5,.74);

    // Industrial floodlights with bright diffusers and metal housings.
    for(const x of [-17,-6,6,17]) {
      addBox(x,8.72,-1,2.2,.28,.9,[.18,.23,.25],.34,.72);
      addBox(x,8.52,-1,1.78,.08,.58,[.92,.82,.62],.3,.08);
      addBox(x,8.72,-15,1.8,.25,.75,[.17,.22,.24],.36,.7);
      addBox(x,8.52,-15,1.45,.07,.48,[.88,.82,.67],.3,.08);
    }

    // Floor contact shadows, then low, walkable-width cover and container props.
    const shadows=[
      [-20,-11,5,2.2],[-15,-9,2.8,1.4],[15,-9,3.0,1.6],[16,5,5,2.1],
      [11,-10,2.4,1.2],[-18,-9,3.2,1.4],[1,10,3.6,1.5]
    ];
    shadows.forEach(([x,z,rx,rz])=>addSoftShadow(x,z,rx,rz,[.25,.29,.30]));
    const cover=[
      {x:-20,z:-11,w:7.8,h:2.8,d:2.7,c:[.25,.32,.35],r:.72,m:.32},
      {x:16,z:5,w:7.8,h:2.8,d:2.7,c:[.27,.31,.33],r:.72,m:.34},
      {x:-15,z:-9,w:4.4,h:1.7,d:2.1,c:[.38,.32,.22],r:.82,m:.08},
      {x:15,z:-9,w:4.4,h:1.7,d:2.1,c:[.22,.34,.38],r:.82,m:.08},
      {x:11,z:-10,w:3.5,h:1.35,d:1.7,c:[.30,.32,.30],r:.9,m:.02},
      {x:-18,z:-9,w:3.8,h:1.45,d:1.9,c:[.34,.30,.27],r:.9,m:.02},
      {x:1,z:10,w:4.8,h:1.5,d:1.8,c:[.30,.34,.33],r:.88,m:.05}
    ];
    for(const item of cover) {
      solidBox(item.x,item.h*.5+.04,item.z,item.w,item.h,item.d,item.c,item.r,item.m);
      const frontZ=item.z-item.d*.5-.025;
      addBox(item.x,item.h*.5+.08,frontZ,item.w*.88,.12,.055,[.48,.52,.49],.55,.45);
      addBox(item.x-item.w*.5+.12,item.h*.5,item.z,.12,item.h*.92,item.d+.08,[.48,.53,.53],.38,.64);
      addBox(item.x+item.w*.5-.12,item.h*.5,item.z,.12,item.h*.92,item.d+.08,[.48,.53,.53],.38,.64);
      const ribs=Math.floor(item.w/1.25);
      for(let i=1;i<ribs;i++) {
        const ribX=item.x-item.w*.5+i*item.w/ribs;
        addBox(ribX,item.h*.5,item.z-item.d*.5-.04,.055,item.h*.84,.06,[.17,.22,.24],.52,.55);
      }
      addBox(item.x,item.h+.16,item.z,item.w+.08,.20,item.d+.08,[.17,.22,.24],.48,.58);
    }

    // Concrete jersey barriers and stacked field crates provide varied silhouettes.
    const barriers=[[-19,-3,5.2,1.05,1.15],[-7,-12,4.5,1.0,1.0],[4,8,4.8,1.0,1.05],[19,-7,4.7,1.0,1.05]];
    for(const [x,z,w,h,d] of barriers) {
      solidBox(x,h*.5+.05,z,w,h,d,[.42,.43,.39],.92,.03,(x%2)*.12);
      addBox(x,h-.04,z,w+.12,.12,d+.12,[.55,.54,.47],.8,.04);
      addBox(x,h*.35+.05,z-d*.5-.025,w*.72,.10,.045,[.88,.59,.15],.72,.05);
    }
    const crates=[[-21,-14,1.7],[-19,-12,1.5],[18,-12,1.6],[20,-10,1.8]];
    for(const [x,z,size] of crates) {
      solidBox(x,size*.5+.04,z,size,size,size,[.40,.32,.22],.88,.04);
      for(const sign of [-1,1]) {
        addBox(x+sign*size*.28,size*.5+.04,z-size*.5-.025,.08,size*.84,.05,[.25,.22,.17],.78,.08);
      }
      addBox(x,size*.5+.04,z-size*.5-.04,size*.72,.08,.06,[.57,.48,.33],.8,.05);
    }

    // A low raised service deck, two-step entry, and metal handrails add a second level.
    solidBox(0,.32,-8.8,12,.64,4.2,[.37,.42,.42],.82,.18);
    solidBox(0,.11,-6.0,5.2,.22,1.15,[.45,.47,.43],.88,.08);
    solidBox(0,.22,-7.1,5.2,.44,1.15,[.39,.44,.42],.86,.10);
    addBox(-5.8,1.02,-8.8,.14,1.45,4.2,[.43,.49,.49],.48,.66);
    addBox(5.8,1.02,-8.8,.14,1.45,4.2,[.43,.49,.49],.48,.66);
    addBox(0,1.72,-10.8,11.7,.10,.12,[.64,.69,.62],.44,.7);
    for(let x=-5.25;x<=5.25;x+=1.05) {
      addBox(x,.67,-10.92,.60,.04,.14,[.98,.66,.12],.82,.02);
    }

    // Safety lines, numbered bay marks, drain grates, and painted splashes.
    for(let x=-21;x<=21;x+=6) {
      addBox(x,.07,-17.45,2.6,.055,.16,[.96,.66,.14],.8,.02);
      addBox(x,.07,17.45,2.6,.055,.16,[.96,.66,.14],.8,.02);
    }
    for(const z of [-11,0,11]) {
      for(let i=-2;i<=2;i++) addBox(-23.35,.12,z+i*.22,.12,.025,.12,[.12,.16,.17],.6,.34);
      addBox(-23.35,.14,z,.32,.03,1.1,[.18,.22,.22],.58,.3);
    }
    const splashes=[
      [-8,4,.75,.4,[.55,.10,.18]],[-6,5,.32,.22,[.12,.25,.56]],
      [8,-4,.58,.36,[.55,.28,.06]],[17,10,.4,.28,[.16,.38,.30]],
      [-18,-10,.52,.27,[.42,.12,.17]]
    ];
    for(const [x,z,rx,rz,color] of splashes) {
      addSphere(x,.045,z,rx,.018,rz,color,.95,0,12,4);
      addSphere(x+.24,.046,z-.1,rx*.52,.014,rz*.58,color,.95,0,10,4);
    }

    window.PAINTFALL_ARENA_COLLIDERS = colliders.slice();
    window.PAINTFALL_ARENA_SURFACE = { width: 52, depth: 40, floorTop: .0125, units: 'world' };
    const vertexStride = 11;
    const vertexData = new Float32Array(vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    const strideBytes = vertexStride * Float32Array.BYTES_PER_ELEMENT;
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation,3,gl.FLOAT,false,strideBytes,0);
    gl.enableVertexAttribArray(normalLocation);
    gl.vertexAttribPointer(normalLocation,3,gl.FLOAT,false,strideBytes,3*4);
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation,3,gl.FLOAT,false,strideBytes,6*4);
    gl.enableVertexAttribArray(materialLocation);
    gl.vertexAttribPointer(materialLocation,2,gl.FLOAT,false,strideBytes,9*4);
    gl.enable(gl.DEPTH_TEST);
   const vertexCount=vertexData.length/vertexStride;

    let latest={players:[],id:null};
    window.addEventListener('paintfall-3d-state',event=>{
      const state=event.detail;
      if(!state)return;
      if(Array.isArray(state.players))latest.players=state.players;
      if(state.id)latest.id=state.id;
    });
    function playerWorld() {
      const player=latest.players.find(item=>item.id===latest.id)||latest.players.find(item=>item.id);
      if(!player)return {x:0,z:5};
      return {
        x:(Math.max(0,Math.min(1200,player.x))-600)/40,
        z:(350-Math.max(0,Math.min(700,player.y)))/25
      };
    }

    // Collision-ready boxes are exported as metadata; movement remains owned by the existing game.
    function resize() {
      const rect=host.getBoundingClientRect();
      const pixelRatio=Math.min(window.devicePixelRatio||1,1.75);
      canvas.width=Math.max(1,Math.floor(rect.width*pixelRatio));
      canvas.height=Math.max(1,Math.floor(rect.height*pixelRatio));
      gl.viewport(0,0,canvas.width,canvas.height);
    }
    function onResize() { resize(); }
    const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(onResize) : null;
    if(resizeObserver)resizeObserver.observe(host);
    addEventListener('resize',onResize);
    resize();

    const fogColor=[.45,.53,.58];
    const lightDirection=[-.45,.86,.30];
    function perspective(fovy,aspect,near,far) {
      const f=1/Math.tan(fovy/2),nf=1/(near-far);
      return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,(2*far*near)*nf,0]);
    }
    function lookAt(ex,ey,ez,cx,cy,cz,ux,uy,uz) {
      let zx=ex-cx,zy=ey-cy,zz=ez-cz,l=Math.hypot(zx,zy,zz)||1;
      zx/=l;zy/=l;zz/=l;
      let xx=uy*zz-uz*zy,xy=uz*zx-ux*zz,xz=ux*zy-uy*zx;
      l=Math.hypot(xx,xy,xz)||1;xx/=l;xy/=l;xz/=l;
      const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
      return new Float32Array([
        xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,
        -(xx*ex+xy*ey+xz*ez),-(yx*ex+yy*ey+yz*ez),-(zx*ex+zy*ey+zz*ez),1
      ]);
    }
    function multiply(a,b) {
      const out=new Float32Array(16);
      for(let col=0;col<4;col++)for(let row=0;row<4;row++)
        out[col*4+row]=a[row]*b[col*4]+a[4+row]*b[col*4+1]+a[8+row]*b[col*4+2]+a[12+row]*b[col*4+3];
      return out;
    }
    const projectionFov=Math.PI*.38;
    function render() {
      const rect=host.getBoundingClientRect();
      if(rect.width>0&&rect.height>0&&(canvas.width===0||canvas.height===0))resize();
      gl.clearColor(fogColor[0],fogColor[1],fogColor[2],1);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      const player=playerWorld(),targetY=1.1;
      let ex,ey,ez,cx,cy,cz;
      if(cameraMode==='first') {
        ex=player.x;ey=targetY+1.15;ez=player.z;
        const cp=Math.cos(camPitch),sp=Math.sin(camPitch),sy=Math.sin(camYaw),cyaw=Math.cos(camYaw);
        cx=ex+sy*cp*10;cy=ey+sp*10;cz=ez-cyaw*cp*10;
      } else {
        const cp=Math.cos(camPitch),sp=Math.sin(camPitch),sy=Math.sin(camYaw),cyaw=Math.cos(camYaw);
        ex=player.x-sy*cp*24;ey=1.5+sp*10;ez=player.z+cyaw*cp*24;
        cx=player.x;cy=1.1;cz=player.z;
      }
      const projection=perspective(projectionFov,Math.max(.5,canvas.width/canvas.height),.1,120);
      const view=lookAt(ex,ey,ez,cx,cy,cz,0,1,0);
      const mvp=multiply(projection,view);
      gl.useProgram(program);
      gl.uniformMatrix4fv(matrixLocation,false,mvp);
      gl.uniform3fv(cameraLocation,[ex,ey,ez]);
      gl.uniform3fv(lightLocation,lightDirection);
      gl.uniform3fv(fogLocation,fogColor);
      gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
      gl.drawArrays(gl.TRIANGLES,0,vertexCount);
      status.textContent='🌎 PAINTFALL WORLD • '+(cameraMode==='third'?'THIRD-PERSON':'FIRST-PERSON');
      requestAnimationFrame(render);
    }

    window.PAINTFALL_CONTEST_3D_ACTIVE=true;
    window.dispatchEvent(new Event('paintfall-3d-ready'));
    render();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();

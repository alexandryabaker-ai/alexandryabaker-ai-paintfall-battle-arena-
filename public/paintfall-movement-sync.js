// Shared movement rules: the browser predicts exactly the steps the server applies.
(function (root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./paintfall-arena-catalog.js') : root.PaintfallArenaCatalog || {});
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PaintfallMovement = api;
})(typeof window === 'object' ? window : globalThis, function (regions) {
  const SPEED = 300, MAX_DT = .1;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  // Legacy contest footprint; regional rooms use their shared catalog bounds.
  // 0.49 m encloses the measured animated body envelope of all eight characters.
  const CONTEST_RADIUS = .49;
  const FENCE_POST_HALF_WIDTH = .06; // Existing perimeter posts are 0.12 m wide.
  const ARENA_OUTLINE = [[-20,-21],[20,-21],[26,-15],[26,15],[20,21],[-20,21],[-26,15],[-26,-15]];
  const planes = ARENA_OUTLINE.map((a,i) => {
    const b=ARENA_OUTLINE[(i+1)%ARENA_OUTLINE.length],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
    const x=dz/length,z=-dx/length;
    return {x,z,limit:x*a[0]+z*a[1]-CONTEST_RADIUS-FENCE_POST_HALF_WIDTH*(Math.abs(x)+Math.abs(z))};
  });
  const inset = planes.map((b,i) => {
    const a=planes[(i+planes.length-1)%planes.length],d=a.x*b.z-b.x*a.z;
    return {x:(a.limit*b.z-b.limit*a.z)/d,z:(a.x*b.limit-b.x*a.limit)/d};
  });
  function toWorld(p) { return {x:(p.x-600)/40,z:(350-p.y)/25}; }
  function toGameplay(p) { return {x:600+p.x*40,y:350-p.z*25}; }
  function inside(p) { return planes.every(n=>n.x*p.x+n.z*p.z<=n.limit+1e-8); }
  function project(p) {
    if(inside(p))return {...p};
    let best, distance=Infinity;
    inset.forEach((a,i)=>{const b=inset[(i+1)%inset.length],dx=b.x-a.x,dz=b.z-a.z;
      const t=clamp(((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz),0,1);
      const q={x:a.x+t*dx,z:a.z+t*dz},d=(q.x-p.x)**2+(q.z-p.z)**2;
      if(d<distance){best=q;distance=d;}});
    return best;
  }
  function constrain(position, target) {
    const region=regions[position.arenaRegion];
    if(region)return constrainRegion(position,target,region);
    const origin=toWorld(position), goal=toWorld(target);
    let p=project(origin), remaining={x:goal.x-origin.x,z:goal.z-origin.z};
    // Sweep the body center to the first inset edge, then slide along it.
    for(let iteration=0;iteration<8;iteration++) {
      let fraction=1,hit=null;
      for(const n of planes){const outward=n.x*remaining.x+n.z*remaining.z;
        if(outward<=1e-12)continue;
        const t=Math.max(0,(n.limit-n.x*p.x-n.z*p.z)/outward);
        if(t<fraction){fraction=t;hit=n;}}
      p={x:p.x+remaining.x*fraction,z:p.z+remaining.z*fraction};
      if(!hit)break;
      remaining={x:remaining.x*(1-fraction),z:remaining.z*(1-fraction)};
      const outward=hit.x*remaining.x+hit.z*remaining.z;
      remaining.x-=hit.x*outward;remaining.z-=hit.z*outward;
    }
    return toGameplay(project(p));
  }
  function constrainRegion(position,target,region){
    const bound=region.bound-CONTEST_RADIUS;
    const limit=p=>({x:clamp(p.x,-bound,bound),z:clamp(p.z,-bound,bound)});
    let p=limit(toWorld(position)),goal=limit(toWorld(target));
    const boxes=region.obstacles.map(o=>({x:o.x,z:o.z,hx:o.halfX+CONTEST_RADIUS,hz:o.halfZ+CONTEST_RADIUS}));
    // Recover safely if a stale authoritative position is inside an obstacle.
    for(const b of boxes)if(Math.abs(p.x-b.x)<b.hx&&Math.abs(p.z-b.z)<b.hz){
      const options=[{x:b.x-b.hx-.001,z:p.z},{x:b.x+b.hx+.001,z:p.z},{x:p.x,z:b.z-b.hz-.001},{x:p.x,z:b.z+b.hz+.001}];
      options.sort((a,c)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(c.x-p.x,c.z-p.z));p=limit(options[0]);
    }
    let delta={x:goal.x-p.x,z:goal.z-p.z};
    for(let iteration=0;iteration<8;iteration++){
      let fraction=1,normal=null;
      for(const b of boxes){
        let enter=-Infinity,leave=Infinity,n=null,miss=false;
        for(const [axis,half]of [['x',b.hx],['z',b.hz]]){
          const d=delta[axis],offset=p[axis]-b[axis];
          if(Math.abs(d)<1e-12){if(Math.abs(offset)>=half)miss=true;continue;}
          const a=(-half-offset)/d,c=(half-offset)/d,near=Math.min(a,c),far=Math.max(a,c);
          if(near>enter){enter=near;n={x:0,z:0};n[axis]=d>0?-1:1;}
          leave=Math.min(leave,far);
        }
        if(!miss&&enter>=-1e-9&&enter<=leave&&leave>=0&&enter<fraction){fraction=Math.max(0,enter);normal=n;}
      }
      p.x+=delta.x*fraction;p.z+=delta.z*fraction;
      if(!normal)break;
      p.x+=normal.x*.00001;p.z+=normal.z*.00001;
      delta.x*=1-fraction;delta.z*=1-fraction;
      const inward=delta.x*normal.x+delta.z*normal.z;
      if(inward<0){delta.x-=normal.x*inward;delta.z-=normal.z*inward;}
    }
    return toGameplay(limit(p));
  }
  function apply(position, input) {
    const dt = clamp(input.dt, 0, MAX_DT);
    const length = Math.max(1, Math.hypot(input.x, input.y));
    return constrain(position,{x:position.x+input.x/length*SPEED*dt,
      y:position.y+input.y/length*SPEED*dt});
  }
  function valid(input) {
    return Number.isSafeInteger(input.seq) && input.seq > 0 &&
      Number.isSafeInteger(input.round) && input.round >= 0 &&
      Number.isFinite(input.dt) && input.dt > 0 && input.dt <= MAX_DT &&
      Number.isFinite(input.x) && Math.abs(input.x) <= 1 &&
      Number.isFinite(input.y) && Math.abs(input.y) <= 1;
  }
  function createPredictor() {
    let id, round, seq = 0, ack = 0, pending = [], player = null;
    function receive(authoritative, nextRound) {
      if (!authoritative) { player = null; pending = []; return null; }
      if (round !== undefined && nextRound < round) return player;
      if(id===authoritative.id&&round===nextRound&&(authoritative.dropRevision||0)<(player?.dropRevision||0))return player;
      if (id !== authoritative.id || round !== nextRound || player?.arenaRegion!==authoritative.arenaRegion || (player?.dropRevision||0)!==(authoritative.dropRevision||0)) {
        id = authoritative.id; round = nextRound;
        seq = ack = authoritative.moveAck || 0; pending = [];
      }
      const nextAck = authoritative.moveAck || 0;
      if (nextAck < ack) return player;
      ack = nextAck;
      pending = authoritative.alive === false || authoritative.bullRide ? [] : pending.filter(input => input.seq > ack);
      player = { ...authoritative };
      for (const input of pending) Object.assign(player, apply(player, input));
      return player;
    }
    function step(x, y, dt) {
      if (!player || player.alive === false || player.bullRide || (!x && !y) || !(dt > 0)) return null;
      const input = { type: 'move', seq: ++seq, round, x, y, dt: Math.min(dt, MAX_DT) };
      if(player.dropRevision!==undefined)input.dropRevision=player.dropRevision;
      pending.push(input); player = { ...player, ...apply(player, input) };
      return input;
    }
    return { receive, step, get player() { return player; }, get pendingCount() { return pending.length; } };
  }
  // Frame-rate-independent remote smoothing; local players never pass through it.
  function interpolate(from, to, dt) {
    const alpha = 1 - Math.exp(-Math.max(0, dt) / .08);
    return { x: from.x + (to.x - from.x) * alpha,
      y: from.y + (to.y - from.y) * alpha, z: from.z + (to.z - from.z) * alpha };
  }
  return { SPEED, MAX_DT, apply, valid, createPredictor, interpolate,
    CONTEST_RADIUS, FENCE_POST_HALF_WIDTH, ARENA_OUTLINE, toWorld, toGameplay, inside, constrain, regions };
});

(()=>{
  const STATES={
    sadness:{motif:'teardrop',speed:.28,spread:.55,drift:.18},
    excitement:{motif:'burst',speed:1.65,spread:1.35,drift:.5},
    calm:{motif:'breath',speed:.5,spread:.72,drift:.12},
    fear:{motif:'fracture',speed:1.05,spread:.9,drift:.8},
    anger:{motif:'flame',speed:1.25,spread:1.05,drift:.65}
  };
  const OUTFIT={
    id:'zara-emotional-pattern-recognition',
    mastery:'emotional-pattern-recognition',
    top:{style:'indie',silhouette:'asymmetrical-cropped',base:'#d8c5a8',options:['asymmetrical-crop','layered-collar-crop']},
    pants:{style:'hippie',silhouette:'high-waisted-wide-leg',base:'#b59a70'},
    jacket:{options:[{id:'brown-leather',style:'edgy',base:'#5b3827'},{id:'geometric-embroidered',style:'artistic',base:'#eee5d4'}]},
    boots:{style:'bohemian',base:'#6a4936'},
    accessory:{bellyPiercing:'handmade-bohemian-geometric'},
    hair:{style:'half-up-half-down',options:['two-french-braids','two-flat-twists'],bangs:'chinese-bang'},
    fabric:{breathable:true,embroidered:true,geometricFragments:'woven-in'},
    progression:['fragment','movement','connection','repetition','recognition']
  };
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const hash=(n)=>{let x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
  const makeState=()=>({primary:'happiness',secondary:null,primaryProgress:.2,secondaryProgress:0,learning:.15,stage:0,confidence:.25,ownEmotion:'curious',phase:0});
  const state=makeState();
  function setSignals(s={}){
    if(s.primary)state.primary=s.primary;
    if(s.secondary!==undefined)state.secondary=s.secondary;
    state.primaryProgress=clamp(Number(s.primaryProgress??state.primaryProgress));
    state.secondaryProgress=clamp(Number(s.secondaryProgress??state.secondaryProgress));
    state.learning=clamp(Number(s.learning??state.learning));
    state.confidence=clamp(Number(s.confidence??state.confidence));
    state.ownEmotion=s.ownEmotion||state.ownEmotion;
    state.stage=Math.min(4,Math.floor(state.learning*5));
    window.dispatchEvent(new CustomEvent('paintfall-zara-pattern-update',{detail:{...state}}));
  }
  function advance(amount=.08){state.learning=clamp(state.learning+amount);state.confidence=clamp(state.confidence+amount*.5);state.stage=Math.min(4,Math.floor(state.learning*5));}
  function colorFor(name,t){
    const palettes={
      happiness:['#ffe47a','#fff1b8'],sadness:['#6aa7d8','#b9d7ef'],excitement:['#ffb04a','#ffe07a'],calm:['#9fd8c2','#d7efe3'],fear:['#8e7cae','#c7bddc'],anger:['#c84d3f','#ef9b6f']
    };
    const p=palettes[name]||palettes.calm;return p[Math.floor(Math.abs(t*2))%p.length];
  }
  function drawPattern(ctx,p,t,x,y,scale){
    const primary=p.primary||'happiness';const sec=p.secondary;const a=clamp(p.primaryProgress);const b=clamp(p.secondaryProgress);
    const drawOne=(name,weight,offset,section)=>{
      if(!name||weight<=.01)return;
      const cfg=STATES[name]||STATES.calm;const base=offset+t*cfg.speed;
      ctx.save();ctx.globalAlpha=.18+.48*weight;ctx.strokeStyle=colorFor(name,base);ctx.fillStyle=colorFor(name,base+.5);ctx.lineWidth=Math.max(1,1.2*scale);
      const count=section==='top'?5:7;
      for(let i=0;i<count;i++){
        const u=i/(count-1||1);const px=x+(-16+32*u)*scale;const py=y+(section==='top'?-8:18+u*14)*scale;
        if(cfg.motif==='teardrop'){ctx.beginPath();ctx.arc(px+Math.sin(base+i)*2,py,2.4*scale,0,Math.PI*2);ctx.stroke();}
        else if(cfg.motif==='burst'){for(let q=0;q<5;q++){const ang=q*Math.PI*2/5+base;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+Math.cos(ang)*7*scale,py+Math.sin(ang)*7*scale);ctx.stroke();}}
        else if(cfg.motif==='breath'){const r=(2.5+2*Math.sin(base+i*.7))*scale;ctx.beginPath();ctx.arc(px,py,Math.max(1,r),0,Math.PI*2);ctx.stroke();}
        else if(cfg.motif==='fracture'){ctx.beginPath();ctx.moveTo(px-4*scale,py-3*scale);ctx.lineTo(px+Math.sin(base+i)*5*scale,py+4*scale);ctx.lineTo(px+5*scale,py-1*scale);ctx.stroke();}
        else {ctx.beginPath();ctx.moveTo(px,py+5*scale);ctx.quadraticCurveTo(px-4*scale,py-2*scale,px,py-7*scale);ctx.quadraticCurveTo(px+4*scale,py-2*scale,px,py+5*scale);ctx.stroke();}
      }
      ctx.restore();
    };
    drawOne(primary,a,t*.02,'top');
    drawOne(primary,a*(.35+.45*(1-p.stage/4)),t*.02+.7,'pants');
    drawOne(sec,b,t*.02+.35,'top');
    drawOne(sec,b*(.35+.45*(1-p.stage/4)),t*.02+1.1,'pants');
  }
  function drawZara(ctx,p,t){
    const sx=p.x, sy=p.y-3, s=1;
    ctx.save();ctx.translate(sx,sy);
    // Soft earthy shadow and body base; keep existing character readable.
    ctx.globalAlpha=p.alive?1:.3;
    ctx.fillStyle='#0006';ctx.beginPath();ctx.ellipse(0,27,22,7,0,0,Math.PI*2);ctx.fill();
    // High-waisted wide-leg hippie pants.
    ctx.fillStyle=OUTFIT.pants.base;ctx.beginPath();ctx.moveTo(-14,9);ctx.lineTo(14,9);ctx.lineTo(22,31);ctx.lineTo(7,31);ctx.lineTo(2,18);ctx.lineTo(-3,31);ctx.lineTo(-22,31);ctx.closePath();ctx.fill();
    // Asymmetrical cropped indie top.
    ctx.fillStyle=OUTFIT.top.base;ctx.beginPath();ctx.moveTo(-14,-1);ctx.lineTo(12,-3);ctx.lineTo(15,10);ctx.lineTo(3,13);ctx.lineTo(-15,9);ctx.closePath();ctx.fill();
    // Head and hair with Chinese bang / half-up silhouette.
    ctx.fillStyle='#8d5a3b';ctx.beginPath();ctx.arc(0,-14,12,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#17110e';ctx.beginPath();ctx.arc(0,-18,12,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-11,-19,22,5);
    // Eyes: subtle recognition cues, not the loud overload state.
    const eyeMood=colorFor(p.primary||'calm',t*.08);ctx.fillStyle=eyeMood;ctx.fillRect(-7,-15,4,2);ctx.fillRect(3,-15,4,2);
    // Embedded emotional pattern travels from shirt to pants.
    drawPattern(ctx,p,t,sx*0+1,sy*0+0,1);
    // Handmade geometric belly piercing.
    ctx.fillStyle='#c8a46b';ctx.beginPath();ctx.arc(0,9,1.5,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  function overlay(){
    const canvas=document.getElementById('arena');if(!canvas||!window.players)return;
    const ctx=canvas.getContext('2d');const selected=window.PAINTFALL_SELECTED_CHARACTER||localStorage.getItem('paintfallCharacter');if(selected!=='Zara')return;
    const me=[...window.players].find(p=>p.character==='Zara');if(!me)return;
    state.phase+=.045;drawZara(ctx,{...me,...state},state.phase);
  }
  window.PAINTFALL_ZARA_PATTERN={OUTFIT,STATES,state,setSignals,advance,drawZara};
  window.paintfallZaraPatternSignal=setSignals;
  window.paintfallZaraPatternAdvance=advance;
  function boot(){setInterval(overlay,90);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

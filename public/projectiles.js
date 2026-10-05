(()=>{
  const style=document.createElement('style');
  style.textContent='#paintfallProjectileLayer{position:absolute;inset:0;pointer-events:none;z-index:30}#paintfallProjectileLayer canvas{position:absolute;inset:0;width:100%;height:100%;background:transparent!important;border-radius:18px}';
  document.head.appendChild(style);
  function setup(){
    const arena=document.getElementById('arena'); if(!arena||document.getElementById('paintfallProjectileLayer'))return;
    const wrap=arena.parentElement; if(!wrap)return;
    if(getComputedStyle(wrap).position==='static')wrap.style.position='relative';
    const layer=document.createElement('div');layer.id='paintfallProjectileLayer';
    const c=document.createElement('canvas');c.width=1200;c.height=700;layer.appendChild(c);wrap.appendChild(layer);
    const x=c.getContext('2d');let projectiles=[];
    function render(){
      x.clearRect(0,0,1200,700);const now=Date.now();
      for(const p of projectiles){
        const t=Math.max(0,Math.min(1,(now-p.createdAt)/(p.duration||350)));
        const px=p.x+(p.tx-p.x)*t,py=p.y+(p.ty-p.y)*t;
        x.beginPath();x.arc(px,py,9,0,Math.PI*2);x.fillStyle='#ffffff';x.fill();
        x.beginPath();x.arc(px,py,6,0,Math.PI*2);x.fillStyle='#67e8f9';x.fill();
        x.beginPath();x.moveTo(px-(p.tx-p.x)*.035,py-(p.ty-p.y)*.035);x.lineTo(px,py);x.strokeStyle='#ff5cff';x.lineWidth=5;x.stroke();
      }
      projectiles=projectiles.filter(p=>now-p.createdAt<(p.duration||350)+80);requestAnimationFrame(render);
    }
    window.addEventListener('paintfall-3d-state',e=>{const list=e.detail?.projectiles||[];projectiles=list.slice()});
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
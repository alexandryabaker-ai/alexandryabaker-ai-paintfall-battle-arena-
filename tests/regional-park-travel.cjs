'use strict';
const assert=require('node:assert/strict');
const WebSocket=require('ws');
const catalog=require('../public/paintfall-arena-catalog.js');
const movement=require('../public/paintfall-movement-sync.js');
const base=process.env.PAINTFALL_TEST_HTTP||'http://127.0.0.1:8194';

(async()=>{
 const response=await fetch(base+'/api/account/guest',{method:'POST',
  headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({birthYear:1990})});
 assert.equal(response.status,200);
 const socket=new WebSocket(base.replace(/^http/,'ws'),{
  headers:{Cookie:response.headers.get('set-cookie').split(';')[0],Origin:base}});
 let state,joined;
 socket.on('message',raw=>{
  const message=JSON.parse(raw);
  if(message.type==='state')state=message;
  if(message.type==='joined')joined=message;
 });
 async function until(predicate){
  const end=Date.now()+15000;
  while(Date.now()<end){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,30));}
  throw Error('Timed out waiting for regional travel');
 }
 const send=message=>socket.send(JSON.stringify(message));
 try{
  await new Promise((resolve,reject)=>{socket.once('open',resolve);socket.once('error',reject);});
  send({type:'create',mode:'paintball',character:'Maya',name:'Park regression',
   rules:{map:'state:Nevada',players:2,bots:0,rides:true}});
  await until(()=>joined);
  const room=joined.code;
  send({type:'start'});
  await until(()=>state?.started);
  const own=()=>state.players.find(player=>player.id===joined.id);
  for(const region of ['state:Nevada','state:California','state:Nevada']){
   const entry=catalog[region];
   for(const spawn of entry.spawns.map((point,index)=>({point,index})).filter(x=>/visitor plaza/.test(x.point.label||''))){
    send({type:'chooseDrop',region,spawn:spawn.index});
    await until(()=>own()?.arenaRegion===region&&own()?.dropPoint===spawn.index);
    const point=movement.toWorld(own());
    assert.ok(Math.hypot(point.x-spawn.point.x,point.z-spawn.point.z)<.1);
    assert.ok(own().alive);
    assert.equal(joined.code,room);
    const blocked=entry.obstacles.some(o=>Math.abs(point.x-o.x)<o.halfX+.6&&Math.abs(point.z-o.z)<o.halfZ+.6);
    assert.equal(blocked,false,'plaza entry must be outside collision fences');
   }
  }
  console.log('PASS: live room travel between both Nevada and California park plazas with authoritative positions and clear entries.');
 }finally{socket.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

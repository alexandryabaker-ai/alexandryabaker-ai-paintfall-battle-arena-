// Private, host-approved mixed-age rooms. Ordinary rooms retain cohort isolation.
const {randomBytes}=require('node:crypto');
function createFamilyRooms({rooms,send,admit,setTimer=setTimeout,clearTimer=clearTimeout,waitMs=120000}){
 function code(){let value;do value=randomBytes(9).toString('hex').toUpperCase();while(rooms.has(value));return value;}
 function notify(room){const host=room.players.get(room.hostId)?.ws;if(host)send(host,{type:'family-requests',requests:[...(room.familyPending?.values()||[])].map(p=>({id:p.id,name:p.message.name,character:p.message.character}))});}
 function remove(p){clearTimer(p.timer);p.room.familyPending.delete(p.id);p.ws.familyPending=null;notify(p.room);}
 function reject(p,message){remove(p);send(p.ws,{type:'error',message});}
 function request(room,ws,id,message){
  room.familyPending??=new Map();
  if(!room.players.get(room.hostId)?.ws)return send(ws,{type:'error',message:'The Family Room host is unavailable.'});
  if(room.familyPending.size>=16)return send(ws,{type:'error',message:'This Family Room has too many waiting requests. Try again later.'});
  const clean={name:String(message.name||'Player').replace(/[<>"']/g,'').slice(0,24),character:String(message.character||'Maya').slice(0,24)};
  const p={room,ws,id,message:clean};room.familyPending.set(id,p);ws.familyPending=p;
  p.timer=setTimer(()=>reject(p,'The Family Room invitation request expired. Ask the host and try again.'),waitMs);p.timer.unref?.();
  send(ws,{type:'family-waiting',message:'Waiting for the Family Room host to approve you. Only join a family you know.'});notify(room);
 }
 function handle(ws,m){
  if(m.type==='family-cancel'){if(ws.familyPending)reject(ws.familyPending,'Family Room request cancelled.');return true;}
  if(m.type!=='family-approve'&&m.type!=='family-decline')return false;
  const room=ws.room;if(!room?.family||ws.pid!==room.hostId)return true;
  const p=room.familyPending?.get(m.id);if(!p)return true;
  if(m.type==='family-decline'){reject(p,'The host declined this Family Room request.');return true;}
  if(p.ws.readyState!==1){remove(p);return true;}
  if([...room.players.values()].filter(p=>!p.bot).length>=room.rules.players){reject(p,'The Family Room is full.');return true;}
  remove(p);admit(room,p.ws,p.id,p.message);return true;
 }
 function disconnect(ws){
  if(ws.familyPending)remove(ws.familyPending);
  const room=ws.room;if(!room?.family||room.hostId!==ws.pid)return;
  rooms.delete(room.code);
  for(const p of [...(room.familyPending?.values()||[])])reject(p,'The Family Room closed because the host left.');
  for(const p of room.players.values())if(p.ws&&p.ws!==ws){send(p.ws,{type:'family-closed',message:'The Family Room closed because the host left. Return to the menu to join another room.'});p.ws.close(1000,'Family Room host left');}
 }
 return {code,request,handle,disconnect};
}
module.exports={createFamilyRooms};

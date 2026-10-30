// Compatibility transport only: all game commands still enter the existing
// authoritative party handlers, using the same signed-in/guest session.
const {EventEmitter}=require('node:events');
const {randomBytes}=require('node:crypto');
function createHttpParty({accounts,connect,clients,now=Date.now,idleMs=30000}){
 const sessions=new Map();
 const reply=(res,status,data)=>{if(res.writableEnded||res.destroyed)return;res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 async function body(req){let bytes=0,text='';for await(const chunk of req){bytes+=chunk.length;if(bytes>16384)throw Object.assign(Error('Party message is too large.'),{status:413});text+=chunk;}try{return JSON.parse(text||'{}');}catch{throw Object.assign(Error('Invalid party message.'),{status:400});}}
 class PartySocket extends EventEmitter{
  constructor(token,hash){super();this.token=token;this.ownerHash=hash;this.readyState=1;this.queue=[];this.touched=now();this.batch=0;}
  send(raw){if(this.readyState!==1)return;const message=JSON.parse(raw);
   // Keep the latest snapshot, but preserve ordered join/error/drop events.
   if(['state','account-saved'].includes(message.type))this.queue=this.queue.filter(m=>m.type!==message.type);
   this.queue.push(message);if(this.queue.length>256){this.close(1009,'Party backlog exceeded.');return;}
   if(this.waiter&&!this.flushTimer)this.flushTimer=setTimeout(()=>this.flush(),['state','account-saved'].includes(message.type)?60:0);
  }
  flush(){clearTimeout(this.flushTimer);this.flushTimer=null;if(!this.waiter)return;const res=this.waiter;this.waiter=null;clearTimeout(this.pollTimer);reply(res,200,{messages:this.queue.splice(0),closed:this.readyState===3,code:this.closeCode||1000});}
  close(code=1000){if(this.readyState===3)return;this.readyState=3;this.closeCode=code;this.flush();clearTimeout(this.flushTimer);sessions.delete(this.token);clients?.delete(this);this.emit('close',code);}
  terminate(){this.close(1006);}
 }
 async function handle(req,res){
  try{
   if(!accounts.sameOrigin(req))return reply(res,403,{error:'Open PAINTFALL on this server.'});
   const session=accounts.session(req);if(!session?.hash||!session.serverGroup)return reply(res,401,{error:'Sign in or choose guest play first.'});
   const route=(req.url||'').split('?')[0];
   if(route==='/api/party/open'&&req.method==='POST'){
    await body(req);if(sessions.size>=256||[...sessions.values()].filter(s=>s.ownerHash===session.hash).length>=4)return reply(res,429,{error:'Close another party connection before opening one.'});
    const token=randomBytes(32).toString('hex'),socket=new PartySocket(token,session.hash);sessions.set(token,socket);clients?.add(socket);connect(socket,req);
    if(socket.readyState!==1)return reply(res,403,{error:'Party connection was rejected.'});return reply(res,201,{token});
   }
   const token=(req.headers.authorization||'').replace(/^Bearer /,''),socket=sessions.get(token);
   if(!socket||socket.ownerHash!==session.hash)return reply(res,403,{error:'Party connection does not belong to this session.'});
   if(!accounts.sessionValid(socket.ownerHash)){socket.close(4001);return reply(res,401,{error:'Your session expired.'});}socket.touched=now();
   if(route==='/api/party/receive'&&req.method==='GET'){
    if(socket.waiter)return reply(res,409,{error:'A party receive request is already active.'});socket.waiter=res;
    res.on('close',()=>{if(socket.waiter===res){socket.waiter=null;clearTimeout(socket.pollTimer);}});
    if(socket.queue.length)socket.flush();else socket.pollTimer=setTimeout(()=>socket.flush(),12000);return;
   }
   if(route==='/api/party/send'&&req.method==='POST'){
    const data=await body(req);if(!Number.isSafeInteger(data.batch)||data.batch<1||!Array.isArray(data.messages)||!data.messages.length||data.messages.length>16||data.messages.some(m=>!m||typeof m!=='object'||Array.isArray(m)||typeof m.type!=='string'))return reply(res,400,{error:'Invalid party command batch.'});
    if(data.batch<=socket.batch)return reply(res,200,{ack:socket.batch});
    if(data.batch!==socket.batch+1)return reply(res,409,{error:'Party commands arrived out of order.'});
    socket.batch=data.batch;for(const message of data.messages){if(socket.readyState!==1)break;socket.emit('message',JSON.stringify(message));}return reply(res,200,{ack:socket.batch});
   }
   if(route==='/api/party/close'&&req.method==='POST'){await body(req);socket.close();return reply(res,200,{ok:true});}
   return reply(res,404,{error:'Unknown party transport action.'});
  }catch(error){reply(res,error.status||500,{error:error.status?error.message:'Party connection failed. Please reconnect.'});}
 }
 const cleanup=setInterval(()=>{for(const s of sessions.values())if(!accounts.sessionValid(s.ownerHash))s.close(4001);else if(now()-s.touched>idleMs)s.close(1001);},5000);cleanup.unref();
 return {handles:req=>(req.url||'').split('?')[0].startsWith('/api/party/'),handle,close(){clearInterval(cleanup);for(const s of [...sessions.values()])s.close();}};
}
module.exports={createHttpParty};

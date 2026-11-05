// One room-entry request at a time. No automatic room creation retries.
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallPartyConnection=api;})(globalThis,()=>{
 function create({url,Socket,onSocket=()=>{},onMessage=()=>{},onStatus=()=>{},onPending=()=>{},onExpired=()=>{},setTimer=setTimeout,clearTimer=clearTimeout,timeoutMs=12000,heartbeatMs=0,heartbeatTimeoutMs=15000,now=Date.now,isPaused=()=>false}){
  let socket=null,pending=null,joined=false,heartbeat=null,lastMessage=0;
  function stopHeartbeat(){if(heartbeat!==null)clearTimer(heartbeat);heartbeat=null;}
  function watch(){
   stopHeartbeat();if(!heartbeatMs||!joined)return;
   heartbeat=setTimer(()=>{heartbeat=null;if(!joined)return;
    if(isPaused()){watch();return;}
    if(now()-lastMessage>=heartbeatTimeoutMs){fail('Party connection lost. Rejoin your room to continue.');return;}
    try{socket.send(JSON.stringify({type:'ping'}));}catch{fail('Party connection lost. Rejoin your room to continue.');return;}watch();
   },heartbeatMs);
  }
  function finish(){if(pending)clearTimer(pending.timer);pending=null;onPending(false);}
  function retire(){stopHeartbeat();const old=socket;socket=null;joined=false;if(old&&old.readyState<2)old.close(1000,'Room entry restarted');}
  function fail(message){finish();retire();onStatus(message);}
  function send(){if(!pending||pending.sent||socket?.readyState!==1)return;pending.sent=true;
   onStatus(pending.message.type==='join'?'Connected. Joining your room…':'Connected. Creating your room…');
   try{socket.send(JSON.stringify(pending.message));}catch{fail('Room request could not be sent. Please try again.');}
  }
  function connect(){if(socket&&socket.readyState<=1)return socket;const current=new Socket(url);socket=current;onSocket(current);
   current.onopen=()=>{if(socket!==current)return;send();};
   current.onmessage=event=>{if(socket!==current)return;let m;try{m=JSON.parse(event.data);}catch{return;}if(!m||typeof m!=='object'||Array.isArray(m))return;
    lastMessage=now();
    if(m.type==='joined'){joined=true;finish();watch();onStatus('Room connected. Choose your drop point.');}
    else if(m.type==='family-waiting'){if(pending)clearTimer(pending.timer);onStatus(m.message||'Waiting for Family Room host approval…');}
    else if(m.type==='family-closed'){joined=false;stopHeartbeat();finish();onStatus(m.message);}
    else if(m.type==='error'){finish();onStatus(m.message||'Room entry failed. Please try again.');}
    onMessage(m);
   };
   current.onerror=()=>{if(socket===current)fail('Party connection failed. Please try Create or Join again.');};
   current.onclose=event=>{if(socket!==current)return;stopHeartbeat();socket=null;joined=false;finish();if(event.code===4001)onExpired();onStatus(event.code===4001?'Your session expired. Please sign in again.':'Party connection closed. Please try Create or Join again.');};
   return current;
  }
  function request(message){if(pending)return false;if(joined){onStatus('Leave your current room before entering another.');return false;}
   // A fresh handshake picks up the current signed-in/guest session cookie.
   retire();pending={message,sent:false,timer:setTimer(()=>fail(pending?.sent?'The room server did not acknowledge your request. Please try again.':'The party network connection timed out before opening. Please try again.'),timeoutMs)};onPending(true);onStatus('Connecting to party network…');
   try{connect();}catch{fail('Party connection could not start. Please try again.');}return true;
  }
  return {request,resume(){if(!joined||socket?.readyState!==1)return;lastMessage=now();try{socket.send(JSON.stringify({type:'ping'}));}catch{fail('Party connection lost. Rejoin your room to continue.');return;}watch();},dispose(){finish();retire();}};
 }
 return {create};
});

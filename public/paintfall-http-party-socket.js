// Browser-compatible socket interface over authenticated same-origin HTTP.
// Selected explicitly; never silently replays an uncertain room request.
(()=>{
 class HttpPartySocket extends EventTarget{
  constructor(){super();this.readyState=0;this.queue=[];this.batch=0;this.controller=new AbortController();this.open();}
  emit(type,data){const event=type==='message'?new MessageEvent(type,{data:JSON.stringify(data)}):type==='close'?new CloseEvent(type,{code:data||1000}):new Event(type);this.dispatchEvent(event);this['on'+type]?.(event);}
  async call(route,data,keepalive=false){const res=await fetch('/api/party/'+route,{method:data===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json',...(this.token?{Authorization:'Bearer '+this.token}:{})},body:data===undefined?undefined:JSON.stringify(data),...(keepalive?{keepalive:true}:{signal:this.controller.signal})});const value=await res.json();if(!res.ok)throw Object.assign(Error(value.error||'Party connection failed.'),{code:res.status===401?4001:1006});return value;}
  async open(){try{const result=await this.call('open',{});if(this.readyState!==0){this.token=result.token;this.call('close',{},true).catch(()=>{});return;}this.token=result.token;this.readyState=1;this.emit('open');this.poll();}catch(error){this.failed(error);}}
  async poll(){try{while(this.readyState===1){const result=await this.call('receive');if(this.readyState!==1)return;for(const message of result.messages||[])this.emit('message',message);if(result.closed){this.close(result.code);return;}}}catch(error){this.failed(error);}}
  send(raw){if(this.readyState!==1)throw Error('Party connection is not open.');const message=JSON.parse(raw);if(!message||typeof message.type!=='string')throw Error('Invalid party command.');this.queue.push(message);if(this.queue.length>256){this.failed(Error('Party commands could not be sent.'));return;}this.schedule();}
  schedule(){if(this.sending||this.timer||!this.queue.length||this.readyState!==1)return;this.timer=setTimeout(()=>{this.timer=null;this.flush();},30);}
  async flush(){if(this.sending||this.readyState!==1||!this.queue.length)return;this.sending=true;const messages=this.queue.splice(0,16);try{await this.call('send',{batch:++this.batch,messages});}catch(error){this.failed(error);}finally{this.sending=false;this.schedule();}}
  failed(error){if(this.readyState===3)return;this.close(error.code||1006);}
  close(code=1000){if(this.readyState===3)return;this.readyState=3;clearTimeout(this.timer);this.queue=[];this.controller.abort();if(this.token)this.call('close',{},true).catch(()=>{});this.emit('close',code);}
 }
 Object.assign(HttpPartySocket,{CONNECTING:0,OPEN:1,CLOSING:2,CLOSED:3});window.PaintfallHttpPartySocket=HttpPartySocket;
})();

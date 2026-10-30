// Family invitations and approvals remain accessible inside the actual game.
(()=>{function init(){
 const panel=document.createElement('section');panel.id='pf-family-room';panel.hidden=true;
 panel.innerHTML='<h2>Private Family Room</h2><p id="pf-family-info"></p><div class="pf-family-code"><span>Invitation code: </span><strong id="pf-family-code"></strong><button id="pf-family-copy" type="button">Copy code</button></div><p id="pf-family-copy-status" role="status"></p><button id="pf-family-manage" type="button" hidden>Manage invitations</button><button id="pf-family-return" type="button" hidden>Return to menu</button>';
 document.getElementById('game').prepend(panel);
 const approval=document.createElement('dialog');approval.id='pf-family-approval';approval.setAttribute('aria-labelledby','pf-family-approval-title');approval.innerHTML='<h2 id="pf-family-approval-title">Family Room invitations</h2><p>Approve only the people you invited.</p><div id="pf-family-requests" aria-live="polite"></div><button id="pf-family-close" type="button">Back to arena</button>';document.body.append(approval);
 const manage=document.getElementById('pf-family-manage');
 function openApproval(){window.PAINTFALL_FAMILY_MANAGING=true;window.dispatchEvent(new Event('blur'));if(!approval.open)approval.showModal();}
 manage.onclick=openApproval;document.getElementById('pf-family-close').onclick=()=>approval.close();
 approval.addEventListener('close',()=>{window.PAINTFALL_FAMILY_MANAGING=false;window.dispatchEvent(new Event('blur'));manage.focus();});
 const waiting=document.createElement('div');waiting.id='pf-family-waiting';waiting.hidden=true;waiting.setAttribute('role','status');
 waiting.innerHTML='<p>Waiting for the Family Room host to approve you. Only join a family you know.</p><button type="button">Cancel request</button>';
 document.getElementById('paintfallPartyLobby').append(waiting);
 let family=false,host=false,requests=[],code='';
 const send=message=>{const socket=window.paintfallSocket;if(socket?.readyState===1)socket.send(JSON.stringify(message));};
 function render(){
  panel.hidden=!family;
  manage.hidden=!family||!host;manage.textContent='Manage invitations ('+requests.length+')';
  document.getElementById('pf-family-code').textContent=code;
  document.getElementById('pf-family-info').textContent=host?'You host this private kids-and-adults room. Approve only the people you invited. The room closes when you leave.':'Kids and adults can play together here by invitation and host approval.';
  const list=document.getElementById('pf-family-requests');list.replaceChildren();
  if(!host)return;
  const heading=document.createElement('p');heading.textContent=requests.length?'Waiting to join:':'No requests waiting.';list.append(heading);
  for(const person of requests){
   const row=document.createElement('div');row.className='pf-family-request';
   const label=document.createElement('span');label.textContent=person.name+' — '+person.character;row.append(label);
   for(const [text,type] of [['Approve','family-approve'],['Decline','family-decline']]){
    const button=document.createElement('button');button.type='button';button.textContent=text;button.setAttribute('aria-label',text+' '+person.name);button.onclick=()=>{button.disabled=true;send({type,id:person.id});};row.append(button);
   }list.append(row);
  }
 }
 waiting.querySelector('button').onclick=()=>send({type:'family-cancel'});
 document.getElementById('pf-family-copy').onclick=async()=>{const message=document.getElementById('pf-family-copy-status');try{
  if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(code);
  else {const field=document.createElement('textarea');field.value=code;panel.append(field);field.select();const copied=document.execCommand('copy');field.remove();if(!copied)throw Error('copy');}
  message.textContent='Invitation code copied. Share it privately with your family.';
 }catch{message.textContent='Copy this invitation code: '+code;}};
 document.getElementById('pf-family-return').onclick=()=>location.reload();
 window.addEventListener('paintfall-family-message',e=>{const m=e.detail;
  if(m.type==='family-waiting'){waiting.hidden=false;return;}
  if(m.type==='joined'){waiting.hidden=true;family=!!m.family;host=m.hostId===m.id;code=m.code;render();}
  if(m.type==='family-requests'){requests=m.requests||[];render();if(host&&requests.length)openApproval();else if(approval.open)approval.close();}
  if(m.type==='error'||m.type==='connection-closed')waiting.hidden=true;
  if(m.type==='family-closed'){
   if(approval.open)approval.close();manage.hidden=true;
   waiting.hidden=true;document.getElementById('pf-family-info').textContent=m.message;
   document.getElementById('pf-family-requests').replaceChildren();document.getElementById('pf-family-return').hidden=false;
  }
 });
 const style=document.createElement('style');style.textContent='#pf-family-room{border:1px solid #69d6da;background:#142738;padding:14px;border-radius:16px;margin:12px 0}#pf-family-room[hidden],#pf-family-waiting[hidden]{display:none!important}#pf-family-room h2{font-size:18px;margin:0 0 8px}.pf-family-code{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pf-family-code strong{overflow-wrap:anywhere;letter-spacing:1px;color:#84edf2}.pf-family-request{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:16px 0}.pf-family-request span{flex-basis:100%;overflow-wrap:anywhere}#pf-family-waiting{padding:12px;border:1px solid #69d6da;margin:10px 0;border-radius:12px}#pf-family-approval{width:min(520px,94vw);max-height:85dvh;overflow:auto;padding:20px;border:2px solid #69d6da;border-radius:16px;background:#142738;color:#fff}#pf-family-approval::backdrop{background:#06121de8}#pf-family-approval button{min-height:48px}#pf-family-close{margin-top:14px;background:#334d60}';document.head.append(style);
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();

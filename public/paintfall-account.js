(()=>{
 function init(){
  if(document.getElementById('pf-login'))return;
  let account=null,guest=false,group=null,definition=null,restoring=false,configuredRoot=null;
  let pending={},saveTimer=null,saving=null,authMode='login';
  const catalog=window.PaintfallArenaCatalog||{},year=new Date().getFullYear();
  const readGuest=()=>{try{return JSON.parse(localStorage.getItem('paintfall-guest-settings')||'{}');}catch{return {};}};
  let guestProfile=readGuest();
  const bar=document.createElement('section');bar.id='pf-account-bar';bar.setAttribute('aria-label','Player account');
  bar.innerHTML='<div class="pf-account-summary"><strong id="pf-player-label">Welcome to PAINTFALL</strong><small id="pf-player-group"></small><small id="pf-progress"></small></div><span id="pf-save-state" role="status" aria-live="polite"></span><button id="pf-open-questionnaire" class="pf-secondary" type="button">Optional questionnaire</button><button id="pf-account-action" class="pf-secondary" type="button">Sign in</button>';
  document.body.prepend(bar);
  const login=document.createElement('dialog');login.id='pf-login';login.className='pf-account-dialog';login.setAttribute('aria-labelledby','pf-login-title');
  login.innerHTML=`<span class="pf-optional">Your world. Your way.</span><h1 id="pf-login-title">PAINTFALL</h1><p>Welcome back, player. Sign in to save your progress, heroes and preferences automatically on this game server.</p><div class="pf-tabs" role="tablist" aria-label="Account action"><button id="pf-login-tab" role="tab" aria-selected="true" type="button">Sign in</button><button id="pf-register-tab" role="tab" aria-selected="false" type="button">Create account</button></div><form id="pf-auth-form"><label for="pf-username">Player name</label><input id="pf-username" name="username" autocomplete="username" minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" required><small>3–24 letters, numbers or underscores. No real name needed.</small><label for="pf-password">Password</label><input id="pf-password" name="password" type="password" autocomplete="current-password" minlength="10" maxlength="128" required><div id="pf-register-fields" hidden><label for="pf-confirm">Confirm password</label><input id="pf-confirm" name="confirmation" type="password" autocomplete="new-password" minlength="10" maxlength="128"><label for="pf-birth-year">Birth year (required)</label><input id="pf-birth-year" name="birthYear" type="number" min="${year-120}" max="${year}" inputmode="numeric"><small>Used for your birth-year server group. Your birth year is not shown to other players. We do not ask for your full birth date.</small></div><button id="pf-auth-submit" class="pf-primary" type="submit">Sign in</button></form><p id="pf-auth-message" class="pf-feedback" role="status" aria-live="polite"></p><hr class="pf-divider"><button id="pf-guest-open" class="pf-secondary" type="button">Play as guest</button><form id="pf-guest-form" hidden><label for="pf-guest-year">Birth year (required for guest server grouping)</label><input id="pf-guest-year" type="number" min="${year-120}" max="${year}" inputmode="numeric" required><button class="pf-primary" type="submit">Continue as guest</button></form><small>Guest settings stay in this browser. Sign in to keep game progress in your account.</small>`;
  document.body.append(login);
  const quiz=document.createElement('dialog');quiz.id='pf-questionnaire';quiz.className='pf-account-dialog';quiz.setAttribute('aria-labelledby','pf-quiz-title');
  quiz.innerHTML='<span class="pf-optional">Optional • every answer can be skipped</span><h2 id="pf-quiz-title">Make PAINTFALL feel like you</h2><p>Your answers are private. Choose your play style, starting place and things you would prefer to avoid. You can change or clear them later.</p><form id="pf-quiz-form"><div id="pf-questions"></div><p id="pf-comfort-note"></p><div class="pf-actions"><button class="pf-primary" type="submit">Save my choices</button><button id="pf-quiz-skip" class="pf-secondary" type="button">Skip questionnaire</button><button id="pf-quiz-close" class="pf-secondary" type="button">Back to game</button></div></form><p id="pf-quiz-message" class="pf-feedback" role="status" aria-live="polite"></p><button id="pf-quiz-clear" class="pf-secondary" type="button">Clear my optional answers</button>';
  document.body.append(quiz);
  const topSkip=document.createElement('button');topSkip.type='button';topSkip.className='pf-secondary';topSkip.textContent='Skip for now';quiz.querySelector('form').before(topSkip);
  const $=id=>document.getElementById(id);
  const status=(message,state='saved')=>{$('pf-save-state').textContent=message;$('pf-save-state').dataset.state=state;};
  const profile=()=>account?.profile||guestProfile;
  async function api(route,body){
   const response=await fetch('/api/account'+route,{method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
   const result=await response.json();if(!response.ok)throw Object.assign(new Error(result.error||'Please try again.'),{status:response.status});return result;
  }
  function comfort(){
   window.PAINTFALL_COMFORT_CHOICES=profile()?.questionnaire?.answers?.avoid||[];
   window.dispatchEvent(new CustomEvent('paintfall-comfort-changed',{detail:{avoid:window.PAINTFALL_COMFORT_CHOICES}}));
  }
  function renderBar(){
   $('pf-player-label').textContent=account?'Welcome, '+account.username:guest?'Guest player':'Welcome to PAINTFALL';
   const labels={younger:'Younger-player server group',teen:'Teen server group',adult:'Adult server group',family:'Private Family Room — invitation only'};
   $('pf-player-group').textContent=labels[group]||'';
   const p=profile()?.progress;
   $('pf-progress').textContent=p?`${p.paintHits} paint hits • ${p.visitedRegions.length} places visited`:'';
   $('pf-account-action').textContent=account?'Sign out':'Sign in';
  }
  function lock(){window.PAINTFALL_ACCOUNT_LOCKED=true;window.dispatchEvent(new Event('blur'));document.body.classList.add('pf-account-locked');if(!login.open)login.showModal();}
  function unlock(){window.PAINTFALL_ACCOUNT_LOCKED=false;document.body.classList.remove('pf-account-locked');login.close();$('pf-password').value=$('pf-confirm').value='';}
  function applyPreferences(){
   const p=profile()?.preferences||{};restoring=true;
   window.PAINTFALL_PREFERRED_SPAWN=p.spawnRegion||p.arenaRegion||null;
   try{
    const hero=$('ccHeroSelect');if(hero&&p.character){hero.value=p.character;window.PAINTFALL_SELECTED_CHARACTER=p.character;}
    const map=document.querySelector('#paintfallCreateChaos select[aria-label="Arena"]');
    if(map&&catalog[p.spawnRegion||p.arenaRegion]){map.value=p.spawnRegion||p.arenaRegion;map.dispatchEvent(new Event('change',{bubbles:true}));}
    for(const [label,value]of Object.entries(p.matchRules||{})){
     const select=[...document.querySelectorAll('#paintfallCreateChaos .ccCard select')].find(el=>el.getAttribute('aria-label')===label);
     if(select&&[...select.options].some(o=>!o.disabled&&o.value===String(value))){select.value=String(value);select.dispatchEvent(new Event('change',{bubbles:true}));}
    }
    if(p.party){for(const [key,value]of [['h',p.party.humans],['b',p.party.bots]]){const button=[...document.querySelectorAll('#paintfallCreateChaos [data-'+key+']')].find(b=>b.dataset[key]===String(value));button?.click();}}
    if(account){window.PAINTFALL_PLAYER_NAME=account.username;if($('name'))$('name').value=account.username;}
   }finally{restoring=false;}
  }
  function schedule(){clearTimeout(saveTimer);saveTimer=setTimeout(flush,450);}
  async function flush(){
   if(saving){await saving;if(Object.keys(pending).length)return flush();return true;}
   if(!Object.keys(pending).length)return true;
   const preferences=pending;pending={};
   if(!account){guestProfile={...guestProfile,preferences:{...guestProfile.preferences,...preferences}};try{localStorage.setItem('paintfall-guest-settings',JSON.stringify(guestProfile));status('Guest settings saved on this browser');}catch{status('Browser storage unavailable — settings are temporary','error');}return true;}
   status('Saving…','saving');
   saving=(async()=>{try{const result=await api('/save',{preferences});account=result.account;status('Saved to your account');return true;}catch(e){pending={...preferences,...pending};status('Not saved — '+e.message,'error');clearTimeout(saveTimer);saveTimer=setTimeout(flush,5000);return false;}})();
   const ok=await saving;saving=null;return ok;
  }
  function changed(){
   if(restoring||(!account&&!guest))return;
   const hero=$('ccHeroSelect'),map=document.querySelector('#paintfallCreateChaos select[aria-label="Arena"]'),matchRules={};
   for(const select of document.querySelectorAll('#paintfallCreateChaos .ccCard select'))if(select.getAttribute('aria-label')!=='Arena')matchRules[select.getAttribute('aria-label')]=select.value;
   const humans=Number(document.querySelector('#paintfallCreateChaos [data-h].active')?.dataset.h||1),bots=document.querySelector('#paintfallCreateChaos [data-b].active')?.dataset.b||'0';
   pending={...pending,character:hero?.value||'Maya',arenaRegion:map?.value||'country:Mexico',matchRules,party:{humans,bots}};status(account?'Saving…':'Saving guest settings…','saving');schedule();
  }
  document.addEventListener('change',e=>{if(e.target.closest('#paintfallCreateChaos'))changed();});
  document.addEventListener('click',e=>{if(e.target.closest('#paintfallCreateChaos [data-h],#paintfallCreateChaos [data-b]'))changed();});
  new MutationObserver(()=>{const root=$('paintfallCreateChaos');if(root&&root!==configuredRoot){configuredRoot=root;root.setAttribute('aria-label','Gaming menu');const title=root.querySelector('.ccHead b');if(title)title.textContent='🎮 GAMING MENU';applyPreferences();}}).observe(document.body,{childList:true,subtree:true});
  function authTab(mode){authMode=mode;const registering=mode==='register';$('pf-register-fields').hidden=!registering;$('pf-confirm').required=registering;$('pf-birth-year').required=registering;$('pf-auth-submit').textContent=registering?'Create account':'Sign in';$('pf-password').autocomplete=registering?'new-password':'current-password';$('pf-login-tab').setAttribute('aria-selected',String(!registering));$('pf-register-tab').setAttribute('aria-selected',String(registering));$('pf-auth-message').textContent='';}
  $('pf-login-tab').onclick=()=>authTab('login');$('pf-register-tab').onclick=()=>authTab('register');
  login.addEventListener('cancel',e=>e.preventDefault());
  $('pf-auth-form').onsubmit=async e=>{
   e.preventDefault();if(authMode==='register'&&$('pf-password').value!==$('pf-confirm').value){$('pf-auth-message').textContent='The passwords do not match.';return;}
   $('pf-auth-submit').disabled=true;$('pf-auth-message').textContent=authMode==='register'?'Creating your account…':'Signing in…';
   try{
    const result=await api('/'+authMode,{username:$('pf-username').value,password:$('pf-password').value,...(authMode==='register'?{birthYear:Number($('pf-birth-year').value)}:{})});
    account=result.account;guest=false;
    const current=await api('');definition=current.questionnaire;group=current.serverGroup;
    if(!Number.isInteger(account.profile.birthYear))throw new Error('This account needs a birth year before it can enter a server.');
    window.paintfallSocket?.close(1000,'Account changed');pending={};applyPreferences();comfort();renderBar();unlock();status('Saved to your account');
    if(account.profile.questionnaire.status==='not-started')await openQuiz();
   }catch(error){$('pf-auth-message').textContent=error.message;}finally{$('pf-auth-submit').disabled=false;}
  };
  $('pf-guest-open').onclick=()=>{$('pf-guest-form').hidden=false;$('pf-guest-year').focus();};
  $('pf-guest-form').onsubmit=async e=>{e.preventDefault();try{const result=await api('/guest',{birthYear:Number($('pf-guest-year').value)});guest=true;account=null;group=result.serverGroup;window.paintfallSocket?.close(1000,'Guest server group chosen');applyPreferences();comfort();renderBar();unlock();status('Guest progress is not saved to an account');if(!guestProfile.questionnaire||guestProfile.questionnaire.status==='not-started')await openQuiz();}catch(error){$('pf-auth-message').textContent=error.message;}};
  function questionElement(question,answers){
   const field=document.createElement('fieldset');field.className='pf-question';const legend=document.createElement('legend');legend.textContent=question.label;field.append(legend);
   if(question.hint){const hint=document.createElement('small');hint.textContent=question.hint;field.append(hint);}
   if(question.type==='multiple')for(const option of question.options){const label=document.createElement('label');label.className='pf-check';const input=document.createElement('input');input.type='checkbox';input.name=question.id;input.value=option.value;input.checked=(answers[question.id]||[]).includes(option.value);label.append(input,document.createTextNode(option.label));field.append(label);}
   else{
    const select=document.createElement('select');select.name=question.id;select.setAttribute('aria-label',question.label);const blank=document.createElement('option');blank.value='';blank.textContent='Prefer not to answer';select.append(blank);
    const options=question.type==='country'||question.type==='destination'?Object.values(catalog).filter(r=>question.type!=='country'||r.type==='country').sort((a,b)=>a.name.localeCompare(b.name)).map(r=>({value:r.id,label:r.name+(r.type==='state'?' — U.S. state':'')})):question.options;
    for(const option of options){const o=document.createElement('option');o.value=option.value;o.textContent=option.label;select.append(o);}select.value=answers[question.id]||'';field.append(select);
   }
   return field;
  }
  async function openQuiz(){
   $('pf-quiz-message').textContent='';
   try{const current=await api('');definition=current.questionnaire;}catch(e){status('Could not load the current questionnaire. Please try again.','error');return;}
   const answers=profile()?.questionnaire?.answers||{};const container=$('pf-questions');container.replaceChildren();
   const addEvent=()=>{if(definition.event){const eventAnswers=profile()?.questionnaire?.eventId===definition.event.id?answers:{};container.append(questionElement({id:'eventChoice',label:definition.event.question,hint:definition.event.title+' • this question changes with game events',type:'single',options:definition.event.options},eventAnswers));}};
   definition.questions.forEach((question,index)=>{container.append(questionElement(question,answers));if(index===1)addEvent();});
   $('pf-comfort-note').textContent='Selected animals are hidden for you. These early arenas already use daylight and level ground, with no sudden-scare effects. Full comfort-based arena layouts are still being built.';
   if(!quiz.open)quiz.showModal();
  }
  async function saveQuiz(skipped=false){
   const form=new FormData($('pf-quiz-form')),answers={};
   if(!skipped){for(const q of definition.questions){if(q.type==='multiple')answers[q.id]=form.getAll(q.id);else if(form.get(q.id))answers[q.id]=form.get(q.id);}if(form.get('eventChoice'))answers.eventChoice=form.get('eventChoice');}
   if((answers.spawnAtBirth==='yes'&&!answers.birthCountry)||(answers.spawnAtBirth==='no'&&!answers.preferredSpawn)){$('pf-quiz-message').textContent='Choose a starting place, or leave the starting-place question unanswered.';return;}
   const questionnaire={status:skipped?'skipped':'completed',answers,eventId:definition.event?.id||null};
   $('pf-quiz-message').textContent='Saving your choices…';
   try{
    if(account){const result=await api('/save',{questionnaire});account=result.account;}
    else{guestProfile={...guestProfile,questionnaire};if(answers.spawnAtBirth){const spawnRegion=answers.spawnAtBirth==='yes'?answers.birthCountry:answers.preferredSpawn;guestProfile.preferences={...guestProfile.preferences,arenaRegion:spawnRegion,spawnRegion};}else if(guestProfile.preferences)delete guestProfile.preferences.spawnRegion;localStorage.setItem('paintfall-guest-settings',JSON.stringify(guestProfile));}
    applyPreferences();comfort();renderBar();status(account?'Saved to your account':'Guest choices saved on this browser');quiz.close();
   }catch(e){$('pf-quiz-message').textContent=e.message;}
  }
  const skipQuiz=()=>profile()?.questionnaire?.status==='completed'?quiz.close():saveQuiz(true);
  topSkip.onclick=skipQuiz;
  $('pf-open-questionnaire').onclick=openQuiz;$('pf-quiz-form').onsubmit=e=>{e.preventDefault();saveQuiz();};$('pf-quiz-skip').onclick=skipQuiz;$('pf-quiz-clear').onclick=()=>saveQuiz(true);$('pf-quiz-close').onclick=()=>quiz.close();
  $('pf-account-action').onclick=async()=>{
   if(!account){lock();return;}
   if(!(await flush())){status('Please wait for your latest preferences to save before signing out.','error');return;}
   try{await api('/logout',{});location.reload();}catch(e){status(e.message,'error');}
  };
  window.addEventListener('paintfall-account-saved',e=>{if(account){account.profile.progress=e.detail.progress;account.profile.updatedAt=e.detail.savedAt;renderBar();if(!saving&&!Object.keys(pending).length)status('Progress saved to your account');}});
  window.addEventListener('paintfall-account-save-error',e=>status(e.detail.message,'error'));
  window.addEventListener('paintfall-account-expired',()=>{account=null;guest=false;renderBar();lock();$('pf-auth-message').textContent='Please sign in again to continue saving to your account.';});
  window.addEventListener('online',()=>flush());
  window.addEventListener('pagehide',()=>{if(account&&Object.keys(pending).length)navigator.sendBeacon('/api/account/save',new Blob([JSON.stringify({preferences:pending})],{type:'application/json'}));});
  window.addEventListener('paintfall-party-state',e=>{if(e.detail.serverGroup){group=e.detail.serverGroup;renderBar();}});
  lock();
  api('').then(result=>{definition=result.questionnaire;account=result.account;group=result.serverGroup;if(account&&Number.isInteger(account.profile.birthYear)){applyPreferences();comfort();renderBar();unlock();status('Your saved profile is ready');if(account.profile.questionnaire.status==='not-started')return openQuiz();}else renderBar();}).catch(()=>{$('pf-auth-message').textContent='The account server is unavailable. Please retry when the game server is connected.';});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

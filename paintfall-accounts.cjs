const {DatabaseSync}=require('node:sqlite');
const {randomBytes,randomUUID,scrypt,timingSafeEqual,createHash}=require('node:crypto');
const {promisify}=require('node:util');
const fs=require('node:fs'),path=require('node:path');
const derive=promisify(scrypt),SESSION_MS=30*24*60*60*1000;
const animalMemory=require('./public/paintfall-animal-memory.js');
const animalCatalog=require('./paintfall-animal-memory-catalog.json');
const CHARACTERS=['Maya','Zara','Nova','Skye','Jax','Rico','Kai','Dante'];
const error=(status,message)=>Object.assign(new Error(message),{status});
const hash=s=>createHash('sha256').update(s).digest('hex');

function createAccounts({databasePath=path.join(__dirname,'.paintfall-data','accounts.sqlite'),regions={},trustProxy=false,now=Date.now,questionnairePath=path.join(__dirname,'paintfall-questionnaire.json')}={}){
 if(databasePath!==':memory:')fs.mkdirSync(path.dirname(databasePath),{recursive:true});
 const db=new DatabaseSync(databasePath);
 db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, salt TEXT NOT NULL, profile TEXT NOT NULL, created_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY, account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS session_account ON sessions(account_id);
 CREATE TABLE IF NOT EXISTS guest_sessions(hash TEXT PRIMARY KEY,birth_year INTEGER NOT NULL,expires_at INTEGER NOT NULL);`);
 db.exec('CREATE TABLE IF NOT EXISTS account_recovery(account_id TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,code_hash TEXT NOT NULL);');
 const query={account:db.prepare('SELECT * FROM accounts WHERE id=?'),user:db.prepare('SELECT * FROM accounts WHERE username=?'),
  create:db.prepare('INSERT INTO accounts VALUES(?,?,?,?,?,?)'),save:db.prepare('UPDATE accounts SET profile=? WHERE id=?'),
  session:db.prepare('SELECT s.*,a.username FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.hash=? AND s.expires_at>?'),
  addSession:db.prepare('INSERT INTO sessions VALUES(?,?,?)'),removeSession:db.prepare('DELETE FROM sessions WHERE hash=?'),prune:db.prepare('DELETE FROM sessions WHERE expires_at<=?')};
 const limits=new Map(),animalLimits=new Map();let busy=0,onRevoke=()=>{};
 const recoveryCode=()=>randomBytes(24).toString('hex').match(/.{8}/g).join('-');
 const recoveryHash=code=>hash('paintfall-recovery-v1:'+code);
 const normalizeRecovery=code=>typeof code==='string'?code.replace(/[\s-]/g,'').toLowerCase():'';
 function storeRecovery(id,code){db.prepare('INSERT INTO account_recovery VALUES(?,?) ON CONFLICT(account_id) DO UPDATE SET code_hash=excluded.code_hash').run(id,recoveryHash(normalizeRecovery(code)));}
 const defaults=birthYear=>({version:1,birthYear,preferences:{character:'Maya',arenaRegion:'country:Mexico'},questionnaire:{status:'not-started',answers:{}},progress:{paintHits:0,kills:0,roundsEntered:0,visitedRegions:[],unlockedEpics:[],lastRegion:null,lastPosition:null},updatedAt:now()});
 function validateYear(value){const year=new Date(now()).getUTCFullYear();if(!Number.isInteger(value)||value<year-120||value>year)throw error(400,'Enter a valid birth year to choose your server group.');return value;}
 function serverGroup(birthYear){if(!Number.isInteger(birthYear))return null;const minimumAge=new Date(now()).getUTCFullYear()-birthYear-1;return minimumAge>=18?'adult':minimumAge>=13?'teen':'younger';}
 function session(req){
  const cookie=(req?.headers?.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('paintfall_session='));
  if(!cookie){
   const guest=(req?.headers?.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('paintfall_guest='));
   const token=guest?.slice('paintfall_guest='.length);if(!/^[a-f0-9]{64}$/.test(token||''))return null;
   const row=db.prepare('SELECT * FROM guest_sessions WHERE hash=? AND expires_at>?').get(hash(token),now());
   return row?{hash:row.hash,expiresAt:row.expires_at,serverGroup:serverGroup(row.birth_year),guest:true}:null;
  }
  const token=cookie.slice('paintfall_session='.length);if(!/^[a-f0-9]{64}$/.test(token))return null;
  const row=query.session.get(hash(token),now());return row?{accountId:row.account_id,hash:row.hash,expiresAt:row.expires_at,username:row.username,serverGroup:serverGroup(JSON.parse(query.account.get(row.account_id).profile).birthYear)}:null;
 }
 const publicAccount=id=>{if(typeof id!=='string')return null;const row=query.account.get(id);return row?{id:row.id,username:row.username,profile:JSON.parse(row.profile)}:null;};
 function questionnaire(){return JSON.parse(fs.readFileSync(questionnairePath,'utf8'));}
 function sameOrigin(req){
  const origin=req?.headers?.origin;
  if(!origin)return req?.headers?.['sec-fetch-site']!=='cross-site';
  try{return new URL(origin).host===req.headers.host;}catch{return false;}
 }
 function rate(req,username){
  const ip=req.socket?.remoteAddress||'local',time=now();
  if(limits.size>5000)for(const [key,v]of limits)if(v.until<time)limits.delete(key);
  for(const key of username==='guest'?['ip:'+ip]:['ip:'+ip,'user:'+username]){
   let item=limits.get(key);if(!item||item.until<time)item={count:0,until:time+15*60*1000};
   if(++item.count>20)throw error(429,'Too many sign-in attempts. Please try again in 15 minutes.');limits.set(key,item);
  }
 }
 function cookie(req,token,maxAge){
  const secure=!!req.socket?.encrypted||(trustProxy&&req.headers['x-forwarded-proto']==='https');
  return `paintfall_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure?'; Secure':''}`;
 }
 function newSession(req,res,id){
  query.prune.run(now());const previous=session(req);if(previous){query.removeSession.run(previous.hash);onRevoke(previous.hash);}
  const token=randomBytes(32).toString('hex');query.addSession.run(hash(token),id,now()+SESSION_MS);
  res.setHeader('Set-Cookie',[cookie(req,token,SESSION_MS/1000),cookie(req,'',0).replace('paintfall_session=','paintfall_guest=')]);
 }
 async function body(req){
  if(!String(req.headers['content-type']||'').startsWith('application/json'))throw error(415,'Use JSON for this request.');
  let text='',size=0;
  for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>8192)throw error(413,'That request is too large.');text+=chunk;}
  try{const value=JSON.parse(text);if(!value||typeof value!=='object'||Array.isArray(value))throw Error();return value;}catch{throw error(400,'Please send a valid request.');}
 }
 function updateProfile(id,data){
  const account=publicAccount(id);if(!account)throw error(401,'Please sign in again.');
  const p=account.profile;
  if(data.birthYear!==undefined){const year=validateYear(data.birthYear);if(p.birthYear!==undefined&&p.birthYear!==null&&p.birthYear!==year)throw error(400,'Birth year cannot be changed from this screen.');p.birthYear=year;}
  if(data.preferences!==undefined){
   const v=data.preferences;if(!v||typeof v!=='object'||Array.isArray(v))throw error(400,'Invalid preferences.');
   if(v.character!==undefined){if(!CHARACTERS.includes(v.character))throw error(400,'Choose an available hero.');p.preferences.character=v.character;}
   if(v.arenaRegion!==undefined){if(!Object.hasOwn(regions,v.arenaRegion))throw error(400,'Choose an available arena.');p.preferences.arenaRegion=v.arenaRegion;}
   if(v.matchRules!==undefined){
    const options={'Mode':['paintball','team','ffa','survival','zombies'],'Room Size':Array.from({length:15},(_,i)=>String(i+2)),'Minutes':['5','10','15','20'],'Score Limit':['10','20','30','50'],'Ability Cooldown':['180','240','300'],'Dragon':['true','false'],'Special Rides':['true','false'],'Respawns':['true','false'],'Room Privacy':['true','false']};
    const rules={};for(const [key,allowed]of Object.entries(options))if(v.matchRules[key]!==undefined){const value=String(v.matchRules[key]);if(!allowed.includes(value))throw error(400,'Choose a listed room setting.');rules[key]=value;}p.preferences.matchRules=rules;
   }
   if(v.party!==undefined){if(!Number.isInteger(v.party?.humans)||v.party.humans<1||v.party.humans>8||![...Array.from({length:9},(_,i)=>String(i)),'fill'].includes(String(v.party?.bots)))throw error(400,'Choose a listed party size.');p.preferences.party={humans:v.party.humans,bots:String(v.party.bots)};}
  }
  if(data.questionnaire!==undefined){
   const q=data.questionnaire;
   if(!q||!['completed','skipped'].includes(q.status))throw error(400,'Invalid questionnaire.');
   const answers={},definition=questionnaire();
   for(const question of definition.questions){
    const value=q.answers?.[question.id],allowed=question.type==='country'?Object.values(regions).filter(r=>r.type==='country').map(r=>r.id):question.type==='destination'?Object.keys(regions):question.options.map(o=>o.value);
    if(value===undefined||value==='')continue;
    if(question.type==='multiple'){
     if(!Array.isArray(value)||value.length>allowed.length||!value.every(v=>allowed.includes(v)))throw error(400,'Choose listed questionnaire answers.');
     answers[question.id]=[...new Set(value)];
    }else{if(!allowed.includes(value))throw error(400,'Choose a listed questionnaire answer.');answers[question.id]=value;}
   }
   if(answers.spawnAtBirth==='yes'&&!answers.birthCountry)throw error(400,'Choose your birth country or leave the starting-place question blank.');
   if(answers.spawnAtBirth==='no'&&!answers.preferredSpawn)throw error(400,'Choose where you would like to start or leave the starting-place question blank.');
   if(q.answers?.eventChoice){
    if(q.eventId!==definition.event?.id)throw error(409,'The event question has changed. Reopen the questionnaire to see the new question.');
    if(!definition.event.options.some(o=>o.value===q.answers.eventChoice))throw error(400,'Choose a listed event answer.');answers.eventChoice=q.answers.eventChoice;
   }
   p.questionnaire={status:q.status,answers:q.status==='skipped'?{}:answers,eventId:q.status==='skipped'?null:definition.event?.id||null};
   if(q.status==='completed'&&answers.spawnAtBirth){p.preferences.spawnRegion=answers.spawnAtBirth==='yes'?answers.birthCountry:answers.preferredSpawn;p.preferences.arenaRegion=p.preferences.spawnRegion;}else delete p.preferences.spawnRegion;
  }
  // Progress and unlocks are deliberately not accepted from browser requests.
  p.updatedAt=now();query.save.run(JSON.stringify(p),id);return publicAccount(id);
 }
 function savePlayer(ws,player,room,{force=false}={}){
  if(!ws?.accountId||!player||player.bot)return null;
  const time=now(),previous=player.accountCheckpoint||{kills:0,paintHits:0,round:null,time:0};
  const round=room.started?room.code+':'+room.round:null;
  const changed=player.kills!==previous.kills||player.paintHits!==previous.paintHits||round!==previous.round;
  if(!force&&!changed&&time-previous.time<2000)return null;
  const account=publicAccount(ws.accountId);if(!account)return null;
  const p=account.profile,g=p.progress,region=player.arenaRegion||room.rules.arenaRegion;
  g.kills+=Math.max(0,(player.kills||0)-previous.kills);g.paintHits+=Math.max(0,(player.paintHits||0)-previous.paintHits);
  if(round&&round!==previous.round)g.roundsEntered++;
  if(region&&Object.hasOwn(regions,region)){
   g.lastRegion=region;if(!g.visitedRegions.includes(region))g.visitedRegions.push(region);
   p.preferences.arenaRegion=p.preferences.spawnRegion||region;g.lastPosition={x:player.x,y:player.y,arenaRegion:region};
  }
  if(CHARACTERS.includes(player.character))p.preferences.character=player.character;
  if(player.epic&&!g.unlockedEpics.includes(player.epic))g.unlockedEpics.push(player.epic);
  p.updatedAt=time;query.save.run(JSON.stringify(p),ws.accountId);
  player.accountCheckpoint={kills:player.kills||0,paintHits:player.paintHits||0,round,time};
  return {type:'account-saved',savedAt:time,progress:g};
 }
 async function handle(req,res){
  const pathname=(req.url||'').split('?')[0];
  res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
  const reply=(status,data)=>{res.writeHead(status);res.end(JSON.stringify(data));};
  try{
   if(!sameOrigin(req))throw error(403,'Open PAINTFALL on this server to continue.');
   if(pathname==='/api/account'&&req.method==='GET'){const s=session(req);return reply(200,{account:s?.accountId?publicAccount(s.accountId):null,serverGroup:s?.serverGroup||null,questionnaire:questionnaire()});}
   if(req.method!=='POST')throw error(405,'That action is not supported.');
   const data=await body(req);
   if(pathname==='/api/account/guest'){
    const year=validateYear(data.birthYear);rate(req,'guest');const token=randomBytes(32).toString('hex');
    db.prepare('DELETE FROM guest_sessions WHERE expires_at<=?').run(now());
    db.prepare('INSERT INTO guest_sessions VALUES(?,?,?)').run(hash(token),year,now()+24*60*60*1000);
    res.setHeader('Set-Cookie',cookie(req,token,86400).replace('paintfall_session=','paintfall_guest='));return reply(200,{guest:true,serverGroup:serverGroup(year)});
   }
   if(pathname==='/api/account/register'||pathname==='/api/account/login'){
    const username=typeof data.username==='string'?data.username.trim().toLowerCase():'';
    const password=data.password;
    rate(req,username);
    if(!/^[a-z0-9_]{3,24}$/.test(username)||typeof password!=='string'||password.length<10||password.length>128)throw error(400,'Use a player name with 3–24 letters, numbers or underscores and a password with 10–128 characters.');
    if(busy>=4)throw error(429,'Sign-in is busy. Please try again shortly.');
    busy++;try{
     if(pathname.endsWith('/register')){
      const birthYear=validateYear(data.birthYear);
      if(query.user.get(username))throw error(409,'That player name is taken. Choose another one.');
      const salt=randomBytes(16).toString('hex'),key=await derive(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024});
      const id=randomUUID();
      try{query.create.run(id,username,key.toString('hex'),salt,JSON.stringify(defaults(birthYear)),now());}catch(e){if(query.user.get(username))throw error(409,'That player name is taken. Choose another one.');throw e;}
      const code=recoveryCode();storeRecovery(id,code);
      newSession(req,res,id);return reply(201,{account:publicAccount(id),recoveryCode:code});
     }
     const account=query.user.get(username),salt=account?.salt||'0'.repeat(32),key=await derive(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024});
     if(!account||!timingSafeEqual(key,Buffer.from(account.password_hash,'hex')))throw error(401,'Player name or password is incorrect.');
     newSession(req,res,account.id);return reply(200,{account:publicAccount(account.id)});
    }finally{busy--;}
   }
   if(pathname==='/api/account/reset-password'){
    const username=typeof data.username==='string'?data.username.trim().toLowerCase():'';
    rate(req,'recovery:'+username);
    if(typeof data.password!=='string'||data.password.length<10||data.password.length>128)throw error(400,'Use a new password with 10–128 characters.');
    if(busy>=4)throw error(429,'Account recovery is busy. Please try again shortly.');
    busy++;try{
     const account=query.user.get(username),code=normalizeRecovery(data.recoveryCode);
     const saved=account?db.prepare('SELECT code_hash FROM account_recovery WHERE account_id=?').get(account.id):null;
     const matches=timingSafeEqual(Buffer.from(recoveryHash(code),'hex'),Buffer.from(saved?.code_hash||'0'.repeat(64),'hex'));
     const salt=randomBytes(16).toString('hex'),key=await derive(data.password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024});
     if(!account||!/^[a-f0-9]{48}$/.test(code)||!saved||!matches)throw error(401,'Player name or recovery code is incorrect. Use the private code you saved earlier.');
     const next=recoveryCode();
     db.exec('BEGIN IMMEDIATE');
     let revoked;
     try{
      // Claim the old code atomically: a concurrent request cannot reuse it.
      const claim=db.prepare('UPDATE account_recovery SET code_hash=? WHERE account_id=? AND code_hash=?').run(recoveryHash(normalizeRecovery(next)),account.id,saved.code_hash);
      if(claim.changes!==1)throw error(401,'Player name or recovery code is incorrect. Use the private code you saved earlier.');
      db.prepare('UPDATE accounts SET password_hash=?,salt=? WHERE id=?').run(key.toString('hex'),salt,account.id);
      revoked=db.prepare('SELECT hash FROM sessions WHERE account_id=?').all(account.id);
      db.prepare('DELETE FROM sessions WHERE account_id=?').run(account.id);db.exec('COMMIT');
     }catch(e){db.exec('ROLLBACK');throw e;}
     for(const item of revoked)onRevoke(item.hash);
     return reply(200,{ok:true,recoveryCode:next});
    }finally{busy--;}
   }
   const s=session(req);if(!s?.accountId)throw error(401,'Please sign in to save to your account.');
   if(pathname==='/api/account/recovery-code'){
    rate(req,'recovery:'+s.username);
    if(typeof data.password!=='string'||data.password.length<10||data.password.length>128)throw error(400,'Enter your current password.');
    if(busy>=4)throw error(429,'Account recovery is busy. Please try again shortly.');
    busy++;try{
     const row=query.account.get(s.accountId),key=await derive(data.password,row.salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024});
     if(!timingSafeEqual(key,Buffer.from(row.password_hash,'hex')))throw error(401,'Your current password is incorrect.');
     // A reset or logout during password verification must invalidate this request.
     const current=query.account.get(s.accountId);
     if(!session(req)?.accountId||current.password_hash!==row.password_hash)throw error(401,'Please sign in again.');
     const code=recoveryCode();storeRecovery(s.accountId,code);return reply(200,{recoveryCode:code});
    }finally{busy--;}
   }
   if(pathname==='/api/account/logout'){query.removeSession.run(s.hash);onRevoke(s.hash);res.setHeader('Set-Cookie',cookie(req,'',0));return reply(200,{ok:true});}
   if(pathname==='/api/account/animal'){
    if(data.accountId!==s.accountId)throw error(409,'Your player account changed. Please try the interaction again.');
    const animal=animalCatalog[data.animalId];
    if(!animal||!Object.hasOwn(regions,animal.region)||!animalMemory.actions.includes(data.action))throw error(400,'Choose an available animal interaction.');
    const account=publicAccount(s.accountId),p=account.profile;
    // Private narrative memories only: no score, health or unlock is awarded here.
    // Proximity and aimed paint contact are checked in the rendered client scene.
    const time=now(),last=animalLimits.get(s.accountId)||0;
    if(time-last<600)throw error(429,'Give your animal friend a moment to respond.');
    if(animalLimits.size>5000)for(const [id,t]of animalLimits)if(time-t>60000)animalLimits.delete(id);
    animalLimits.set(s.accountId,time);
    const memories=p.animalMemories||{},previous=memories[data.animalId];
    const memory=animalMemory.remember(previous,data.action,time);
    memories[data.animalId]=memory;p.animalMemories=memories;p.updatedAt=time;
    query.save.run(JSON.stringify(p),s.accountId);
    return reply(200,{animalId:data.animalId,memory,savedAt:time,dialogue:animalMemory.dialogue(animal.kind,data.action,memory,account.username)});
   }
   if(pathname==='/api/account/save')return reply(200,{account:updateProfile(s.accountId,data)});
   throw error(404,'That account action was not found.');
  }catch(e){reply(e.status||500,{error:e.status?e.message:'Your account could not be updated. Please try again.'});}
 }
 return {handles:req=>(req.url||'').split('?')[0].startsWith('/api/account'),handle,session,sameOrigin,savePlayer,publicAccount,
  sessionValid:sessionHash=>!!query.session.get(sessionHash,now())||!!db.prepare('SELECT hash FROM guest_sessions WHERE hash=? AND expires_at>?').get(sessionHash,now()),onLogout:fn=>{onRevoke=fn;},close:()=>db.close(),serverGroup};
}
module.exports={createAccounts};

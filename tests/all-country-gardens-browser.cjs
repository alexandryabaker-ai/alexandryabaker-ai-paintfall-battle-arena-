const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),net=require('node:net'),{spawn}=require('node:child_process'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const out=path.resolve(process.env.PAINTFALL_REVIEW_OUT||'art/gardens-all-countries-2026-11-04');fs.mkdirSync(out,{recursive:true});
const fullPlaces=JSON.parse(fs.readFileSync('public/paintfall-arena-destinations.json')).filter(p=>p.type==='country').sort((a,b)=>a.name.localeCompare(b.name));
const requested=process.env.PAINTFALL_GARDEN_PLACES?.split('|'),places=requested?fullPlaces.filter(p=>requested.includes(p.name)):fullPlaces;
if(requested)assert.equal(places.length,requested.length,'all requested smoke-test destinations exist');
const pictures=process.env.PAINTFALL_GARDEN_CAPTURE!=='0',slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-');
(async()=>{
 const port=await new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});}),base=process.env.PAINTFALL_TEST_HTTP||'http://127.0.0.1:'+port;
 const server=process.env.PAINTFALL_TEST_HTTP?null:spawn(process.execPath,['server.js'],{env:{...process.env,HOST:'127.0.0.1',PORT:String(port),PAINTFALL_DATA_DIR:fs.mkdtempSync(path.join(os.tmpdir(),'paintfall-all-gardens-'))},stdio:['ignore','pipe','pipe']});let browser,log='';server?.stdout.on('data',d=>log+=d);server?.stderr.on('data',d=>log+=d);const checks=[],errors=[],gardenImages=[];
 try{
  for(let i=0;i<100;i++){try{if((await fetch(base+'/api/account')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1100,height:850}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/arena-world-tour.html?place=country%3AVietnam&view=garden');await page.waitForFunction(()=>document.getElementById('view').dataset.ready==='true');
  const catalogCoverage=await page.evaluate(()=>Object.values(window.PaintfallArenaCatalog).filter(p=>p.type==='country'));assert.equal(catalogCoverage.length,255);assert.ok(catalogCoverage.every(p=>p.garden.identityStatus==='owner-review'));
  if(process.env.PAINTFALL_GARDEN_SKIP_TOUR==='1'){
   const prior=JSON.parse(fs.readFileSync(path.join(out,'verification.json')));assert.ok(prior.checks.some(s=>s.startsWith('255 of 255')),'reuse only a completed tour check');
   for(let i=0;i<places.length;i++){const item={name:places[i].name,file:String(i+1).padStart(3,'0')+'-'+slug(places[i].name)+'.jpg'};assert.ok(fs.existsSync(path.join(out,item.file)));gardenImages.push(item);}
  }else for(let i=0;i<places.length;i++){
   const {name,id}=places[i];await page.getByLabel('Destination').selectOption(id);await page.waitForFunction(id=>document.getElementById('view').dataset.destination===id,id);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const status=await page.evaluate(id=>window.PaintfallArenaCatalog[id].garden,id);assert.equal(status.identityStatus,'owner-review',name+' locally designed');assert.ok((await page.locator('#garden-note').innerText()).includes(status.theme));assert.equal(await page.locator('#view canvas').count(),1);assert.ok(await page.locator('#garden-note a').count());
   if(pictures){const file=String(i+1).padStart(3,'0')+'-'+slug(name)+'.jpg';await page.locator('#view').screenshot({path:path.join(out,file),type:'jpeg',quality:78});gardenImages.push({name,file});}
   if(i%25===24)console.log('Tour checked '+(i+1)+' / '+places.length);
  }
  checks.push(places.length+' of '+places.length+' tour scenes checked: garden identities, linked botanical references, one tour renderer; full catalog has 255 place-specific gardens');
  await page.setViewportSize({width:390,height:844});for(const name of ['Mexico','South Africa','Madagascar','Norway','Japan','Guyana','Fiji','Antarctica']){await page.getByLabel('Destination').selectOption('country:'+name);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));if(pictures)await page.locator('#view').screenshot({path:path.join(out,slug(name)+'-phone.jpg'),type:'jpeg',quality:80});}
  checks.push('eight representative botanical and conservatory scenes also render at phone dimensions');
  fs.writeFileSync(path.join(out,'images.json'),JSON.stringify(gardenImages,null,2));
  await page.setViewportSize({width:1100,height:850});await page.goto(base);await page.locator('#pf-guest-open').click();await page.locator('#pf-guest-year').fill('1990');await page.locator('#pf-guest-form button').click();await page.locator('#pf-quiz-skip').click();await page.locator('#pf-play-paintball').click();await page.getByLabel('Arena',{exact:true}).selectOption('country:Vietnam');await page.locator('#pf-party-compatibility').check();await page.locator('.ccStart').click();
  async function drop(name){
   await page.locator('#pf-arena-drop').waitFor({state:'visible'});await page.waitForFunction(()=>!document.getElementById('pf-drop-confirm').disabled);await page.locator('#pf-drop-region').selectOption('country:'+name);
   try{await page.locator('#pf-drop-confirm').click({timeout:30000});}catch(error){
    // An acknowledged travel can close the dialog while Playwright is finishing
    // its click. Accept only the verified result, never force a hidden button.
    try{await page.waitForFunction(id=>!document.getElementById('pf-arena-drop').open&&window.PAINTFALL_PREFERRED_SPAWN===id,'country:'+name,{timeout:10000});}catch{
     const state=await page.evaluate(()=>({selection:document.getElementById('pf-drop-region').value,dialogOpen:document.getElementById('pf-arena-drop').open,disabled:document.getElementById('pf-drop-confirm').disabled,preferred:window.PAINTFALL_PREFERRED_SPAWN,region:window.PAINTFALL_LAST_PLAYER_STATE?.arenaRegion,status:document.getElementById('pf-drop-status').textContent}));fs.writeFileSync(path.join(out,'travel-error-context.json'),JSON.stringify({target:name,state},null,2));throw error;
    }
    console.log('Travel acknowledgement verified after dialog closed: '+name);
   }
   await page.locator('#pf-arena-drop').waitFor({state:'hidden'});
  }
  await drop('Vietnam');await page.getByRole('button',{name:'🚀 Enter Match',exact:true}).click();await page.waitForFunction(()=>window.PAINTFALL_LAST_PLAYER_STATE?.alive);if(await page.locator('#pf-arena-drop').isVisible())await drop('Vietnam');
  const startIndex=Number(process.env.PAINTFALL_GARDEN_START_INDEX||0),progressPath=path.join(out,'room-travel-progress.json');
  const progress=startIndex?JSON.parse(fs.readFileSync(progressPath)):[];assert.equal(progress.length,startIndex,'resume only documented successful checks');
  for(let i=startIndex;i<places.length;i++){
   const {name,id}=places[i];if((await page.evaluate(()=>window.PAINTFALL_LAST_PLAYER_STATE.arenaRegion))!==id){await page.locator('#pf-arena-map-button').click();await drop(name);}
   await page.waitForFunction(({id,name})=>window.PAINTFALL_LAST_PLAYER_STATE?.arenaRegion===id&&!!window.PAINTFALL_3D_SCENE_HOST?.__paintfallScene.getObjectByName('Garden Park foundation — '+name),{id,name});
   const actual=await page.evaluate(()=>{let garden;const scene=window.PAINTFALL_3D_SCENE_HOST.__paintfallScene;scene.traverse(o=>{if(o.userData.gardenPark)garden=o;});return{seats:garden?.userData.storySeats.length,identity:garden?.userData.identityStatus,sign:!!garden?.getObjectByName('Garden Park — Coming Soon'),paint:!!garden?.getObjectByName('Harmless animated paint-flower droplets'),colliders:window.PAINTFALL_ARENA_COLLIDERS.length,expected:window.PaintfallArenaCatalog[window.PAINTFALL_LAST_PLAYER_STATE.arenaRegion].obstacles.length};});
   assert.equal(actual.seats,2,name);assert.equal(actual.identity,'owner-review',name);assert.ok(actual.sign&&actual.paint,name);assert.equal(actual.colliders,actual.expected,name);assert.equal(await page.locator('#paintfallContest3D canvas').count(),1);
   progress.push({id,passed:true});fs.writeFileSync(progressPath,JSON.stringify(progress,null,2));
   if(i%25===24)console.log('Connected arena travel checked '+(i+1)+' / '+places.length);
  }
  checks.push('actual HTTP-connected room travels to all '+places.length+' requested countries/territories: two benches, animated paint plants, front park sign, exact collision catalog and one arena renderer');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'images.json'),JSON.stringify(gardenImages,null,2));fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify({passed:true,base,checks,errors,placeCount:places.length,deployed:!!process.env.PAINTFALL_TEST_HTTP,physicalPhoneTest:false},null,2));console.log('PASS: '+checks.join('; '));
 }catch(e){fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify({passed:false,checks,errors,error:e.message,deployed:false},null,2));throw e;}
 finally{await browser?.close();server?.kill();fs.writeFileSync(path.join(out,'server.log'),log);}
})().catch(e=>{console.error(e);process.exitCode=1;});

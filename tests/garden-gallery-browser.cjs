const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.PAINTFALL_TEST_HTTP||'http://127.0.0.1:8192',out=path.resolve(process.env.PAINTFALL_REVIEW_OUT||'art/gardens-all-countries-2026-11-04');
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true});const errors=[];try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/garden-gallery.html');assert.equal(await page.locator('figure').count(),255);assert.equal(await page.locator('figure:visible').count(),255);
 const search=page.getByLabel('Find a garden by place');await search.fill('Madagascar');assert.equal(await page.locator('figure:visible').count(),1);assert.equal(await page.locator('#count').innerText(),'1 of 255 gardens');
 await page.locator('figure:visible img').evaluate(i=>i.decode());await page.screenshot({path:path.join(out,'gallery-search-desktop.jpg'),type:'jpeg'});
 await search.fill('aland');assert.deepEqual(await page.locator('figure:visible figcaption').allTextContents(),['Åland','New Zealand']);
 await search.fill('not-a-place');assert.equal(await page.locator('figure:visible').count(),0);assert.equal(await page.locator('#count').innerText(),'0 of 255 gardens');
 await search.fill('');assert.equal(await page.locator('figure:visible').count(),255);
 // Check every static image by response and image signature without causing 255 WebGL scenes.
 const images=await page.locator('figure img').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')));for(const src of images){const response=await page.request.get(base+src);assert.equal(response.status(),200,src);const bytes=await response.body();assert.ok(bytes.length>1000&&bytes[0]===255&&bytes[1]===216,src);}
 await page.setViewportSize({width:390,height:844});await search.fill('South Africa');await page.locator('figure:visible img').evaluate(i=>i.decode());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'phone page fits viewport');await page.screenshot({path:path.join(out,'gallery-phone.jpg'),type:'jpeg'});
 await page.locator('figure:visible a').click();await page.waitForFunction(()=>document.getElementById('view')?.dataset.ready==='true');assert.equal(await page.locator('#view').getAttribute('data-destination'),'country:South Africa');assert.equal(await page.locator('#view canvas').count(),1);assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'gallery-page-verification.json'),JSON.stringify({passed:true,base,images:255,checks:['search and clear','accent-insensitive search','zero matches','all 255 JPEG responses','phone layout fits','gallery link opens requested 3D tour'],errors,physicalPhoneTest:false},null,2));console.log('PASS: gallery search, all 255 pictures, phone layout and 3D destination link.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

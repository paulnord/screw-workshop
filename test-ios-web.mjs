// Browser integration for bundled file:// content. This is NOT an iOS simulator test.
// Requires Playwright + Chromium; CHROMIUM_PATH can select a system executable.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {existsSync} from 'node:fs';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const executablePath=process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
const browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox']});
const url=new URL('./ios/Web/index.html',import.meta.url).href;
const failures=[],requests=[];
async function pageFor(width,seed=null,reducedMotion='reduce'){
 const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true,reducedMotion});
 await context.addInitScript(savedProgress=>{
  window.nativeSaves=[];
  window.ScrewWorkshopNative={savedProgress,saveProgress(value){window.nativeSaves.push(JSON.parse(JSON.stringify(value)));}};
 },seed);
 await context.route(/^https?:/,route=>route.abort());
 const page=await context.newPage();page.on('pageerror',error=>failures.push(error.message));
 page.on('request',request=>{if(!request.url().startsWith('file:'))requests.push(request.url());});
 await page.goto(url);await page.waitForFunction(()=>document.querySelector('#number').textContent.includes('/ 80'));
 return {page,context};
}
async function tap(page,selector){await page.locator(selector).tap();}
async function transforms(page){return page.locator('[data-plate]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('transform')));}
try{
 for(const width of [320,390]){
  const {page,context}=await pageFor(width);
  assert.equal(await page.locator('.native-app').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
  assert.equal(await page.locator('#moves').textContent(),'0 moves');
  await tap(page,'#levels');assert.equal(await page.locator('[data-level]').count(),80);
  await tap(page,'[data-level="79"]');assert.match(await page.locator('#lockmessage').textContent(),/seven puzzles/);
  await tap(page,'#close');
  await tap(page,'#install');assert.match(await page.locator('#dialogbody').textContent(),/80 puzzles.*offline/);
  assert.match(await page.locator('#dialogbody').textContent(),/Safari progress is separate/);
  await tap(page,'#close');
  // Hints choose a real exposed screw; tap its highlighted physical target.
  for(let i=0;i<12&&await page.locator('#win').getAttribute('hidden')!==null;i++){
   await tap(page,'#hint');assert.equal(await page.locator('.bolt.selected').count(),1);
   await tap(page,'.hole.hinted');
  }
  assert.equal(await page.locator('#win').getAttribute('hidden'),null,'Hint route physically completes');
  assert.match(await page.locator('.complete-stars').textContent(),/★★★/);
  let save=await page.evaluate(()=>window.nativeSaves.at(-1));
  assert.ok(save.done.includes('v4-first-turn'));assert.ok(save.bests['v4-first-turn']>0);
  const best=save.bests['v4-first-turn'];
  await tap(page,'#next');assert.match(await page.locator('#number').textContent(),/PUZZLE 02/);
  save=await page.evaluate(()=>window.nativeSaves.at(-1));
  assert.notEqual(save.levelId,'v4-first-turn');
  await context.close();
  const restored=await pageFor(width,save);
  assert.match(await restored.page.locator('#number').textContent(),/PUZZLE 02/);
  await tap(restored.page,'#levels');await tap(restored.page,'[data-level="0"]');
  assert.match(await restored.page.locator('#scoreline').textContent(),new RegExp(`Best: ${best}`));
  assert.equal(await restored.page.locator('#moves').textContent(),'0 moves');
  await restored.context.close();
 }
 // Run animation without reduced motion, suspend it, then continue the same attempt.
 const {page,context}=await pageFor(390,null,'no-preference');
 await tap(page,'#hint');await tap(page,'.hole.hinted');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('screw-workshop-lifecycle',{detail:{active:false}})));
 const stopped=await transforms(page);await page.waitForTimeout(350);
 assert.deepEqual(await transforms(page),stopped,'Physics stays paused while inactive');
 assert.equal(await page.locator('#moves').textContent(),'1 move');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('screw-workshop-lifecycle',{detail:{active:true}})));
 await page.waitForFunction(previous=>JSON.stringify([...document.querySelectorAll('[data-plate]')].map(node=>node.getAttribute('transform')))!==JSON.stringify(previous),stopped);
 await tap(page,'#undo');assert.equal(await page.locator('#moves').textContent(),'0 moves');
 await tap(page,'#hint');await tap(page,'.hole.hinted');
 for(let i=0;i<2;i++){
  await tap(page,'#restart');assert.equal(await page.locator('#dialog').evaluate(node=>node.open),true);
  await tap(page,'#close');assert.equal(await page.locator('#moves').textContent(),'1 move');
 }
 await tap(page,'#restart');await tap(page,'#confirmrestart');
 assert.equal(await page.locator('#dialog').evaluate(node=>node.open),false);
 assert.equal(await page.locator('#moves').textContent(),'0 moves');
 // Brand does not navigate a file directory or reset gameplay in the native shell.
 await tap(page,'.brand');assert.equal(await page.locator('[data-level]').count(),80);
 assert.equal(page.url(),url);await tap(page,'#close');
 await context.close();
 assert.deepEqual(failures,[],'No browser JavaScript errors');assert.deepEqual(requests,[],'Offline bundle makes no external requests');
 console.log('PASS iOS bundled-web integration: 80 puzzles, 320/390px touch, offline resources, physical completion/stars, native-save seed/reload, pause/resume, undo, repeated restart dismissal, native brand/about.');
 console.log('Native Swift, WKWebView, simulator, signing and device behavior require separate Xcode verification.');
}finally{await browser.close();}

import firebaseConfig from './firebase-config.mjs';
import {recordBest,normalizeProgress,serializeProgress,starsFor,packProgress,isLevelUnlocked,PACK_SIZE,unlockedPackCount} from './progress.mjs?v=20261029-daily1';
import {levels,cells,holes,createWorld,snapshot,move,complete,step,settle,accessible,destinations,hint,isSpare,plateForBolt,attachmentCount,STEP,validateDailyRecipe,compileDailyRecipe} from './engine.mjs?v=20261029-daily1';
import {levelRecipes} from './levels.mjs?v=20261029-daily1';
import {createDailyStore} from './daily-data.mjs?v=20261029-daily1';
const $=s=>document.querySelector(s),ns='http://www.w3.org/2000/svg',colors=['#557f79','#c67d57','#c9a75d','#739381'];
const native=window.ScrewWorkshopNative;
let saved={};try{saved=native?native.savedProgress:JSON.parse(localStorage.getItem('screw-workshop-physics-v4')||'{}')}catch{}
let {bests,done,index,unlockedPacks}=normalizeProgress(saved,levels);
let daily=null,dailyRequest=0,dailyCatalog=null;
let accountUID=null,accountDaily={},syncController=null,accountTools=null,accountEpoch=0,cloudConfirmed=false;
const accountSaveKey=uid=>'screw-workshop-account-campaign:'+encodeURIComponent(uid);
function readSave(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}}
const fallbackRecipe={...levelRecipes[0],id:'daily-practice-fallback',name:'Offline practice'};
let dailyStorage;try{dailyStorage=localStorage}catch{}
const dailyStore=createDailyStore({baseURL:new URL('./daily/',location.href),storage:dailyStorage??null,validateGeometry:validateDailyRecipe,networkEnabled:!native,fallbackPuzzle:{schemaVersion:1,rulesetVersion:'matter020-workshop-v1',id:'daily-practice-fallback',name:'Offline practice',recipe:fallbackRecipe,targetMoves:fallbackRecipe.solution.length,witnessPolicy:'settle-after-each-move-2400'}});
const currentLevel=()=>daily?.level||levels[index];
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function dailyBest(){try{return daily?(accountUID?accountDaily[daily.identity]:dailyStore.readProgress()[daily.identity]):undefined}catch{return undefined}}
function bestFor(l){return daily?dailyBest():bests[l.id]}
let sim,history=[],selected=null,hintHole=null,frame=null,busy=false,plateNodes=[],pinNodes=[],holeNodes=[];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function persist(){unlockedPacks=unlockedPackCount(levels,done,unlockedPacks);const value=serializeProgress(index,levels,done,bests,unlockedPacks);try{if(native)native.saveProgress(value);else localStorage.setItem(accountUID?accountSaveKey(accountUID):'screw-workshop-physics-v4',JSON.stringify(value))}catch{}}
let nativeActive=true;
function syncActivity(){if(document.hidden||!nativeActive){cancelMotion();persist()}else if(sim&&!sim.settled)animate()}
document.addEventListener('visibilitychange',syncActivity);
window.addEventListener('pagehide',()=>{cancelMotion();persist()});
window.addEventListener('pageshow',syncActivity);
window.addEventListener('screw-workshop-lifecycle',event=>{nativeActive=event.detail?.active===true;syncActivity()});
window.addEventListener('screw-workshop-save-error',()=>say('Your progress could not be saved on this device. Keep the app open and check available storage.'));
function cancelMotion(){if(frame!==null)cancelAnimationFrame(frame);frame=null;busy=false}
function start(i){if(!isLevelUnlocked(i,levels,done,unlockedPacks)){say('Complete seven puzzles in the preceding pack to unlock this one.');return}dailyRequest++;cancelMotion();daily=null;index=i;sim=createWorld(levels[i]);settle(sim);history=[];selected=null;hintHole=null;persist();render();say(levels[i].tip);if(!sim.settled)animate()}
function say(t){$('#message').textContent=t}
function pos(el,h){el.style.left=cells[h].x/350*100+'%';el.style.top=cells[h].y/430*100+'%'}
function svgEl(name,attrs={}){const e=document.createElementNS(ns,name);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e}
function stars(n){return '★'.repeat(n)+'☆'.repeat(3-n)}
function scoreText(l){const best=bestFor(l);return `${stars(starsFor(best,l.solution.length)||(!daily&&done.has(l.id)?1:0))} · Best: ${best??'—'} · 3★ target: ${l.solution.length} moves ⓘ`}
function render(){const l=currentLevel(),board=$('#board');board.replaceChildren();plateNodes=[];pinNodes=[];holeNodes=[];$('#number').textContent=daily?(daily.source==='fallback'?'OFFLINE PRACTICE':`DAILY · ${daily.date} UTC`):`PUZZLE ${String(index+1).padStart(2,'0')} / ${levels.length}`;$('#dailycontext').hidden=!daily;$('#dailystatus').textContent=daily?daily.status:'';$('#name').textContent=l.name;$('#moves').textContent=`${sim.moves} ${sim.moves===1?'move':'moves'}`;$('#scoreline').textContent=scoreText(l);$('#undo').disabled=!history.length;$('#hint').disabled=false;
 const avail=destinations(sim),svg=svgEl('svg',{viewBox:'0 0 350 430','aria-hidden':'true',class:'physics-scene'});board.append(svg);
 for(const h of holes(l)){const c=cells[h];svg.append(svgEl('circle',{cx:c.x,cy:c.y,r:8,fill:'#473a2c',stroke:'#ddba85','stroke-width':1}));const b=document.createElement('button');b.className='hole physics-hole'+(selected!==null&&avail.includes(h)?' target':'')+(hintHole===h?' hinted':'');pos(b,h);b.setAttribute('aria-label',`${isSpare(l,h)?'Spare':'Board'} hole ${h+1}${sim.positions.includes(h)?', occupied':', empty'}`);b.disabled=!avail.includes(h);b.onclick=e=>activate('hole',h,e);board.append(b);holeNodes.push({h,el:b})}
 l.plates.forEach((_,p)=>{const body=sim.plates[p],g=svgEl('g',{'data-plate':p}),outer=body.plugin.outline,cutouts=body.plugin.holes;
 const ring=points=>points.map((v,i)=>`${i?'L':'M'} ${v.x} ${v.y}`).join(' ')+' Z';
 const path=ring(outer)+' '+cutouts.map(q=>ring([{x:q.x-10,y:q.y-10},{x:q.x-10,y:q.y+10},{x:q.x+10,y:q.y+10},{x:q.x+10,y:q.y-10}])).join(' ');
 g.append(svgEl('path',{d:path,fill:colors[p%colors.length],'fill-rule':'evenodd',stroke:'#e7e7cd','stroke-width':1.2,class:'material'}));
 for(const q of cutouts)g.append(svgEl('rect',{x:q.x-10,y:q.y-10,width:20,height:20,fill:'none',stroke:'#29443a','stroke-width':1.8,class:'material-hole'}));
 const area=poly=>Math.abs(poly.reduce((a,v,i)=>{const n=poly[(i+1)%poly.length];return a+v.x*n.y-n.x*v.y},0));const largest=body.plugin.material.reduce((a,b)=>area(a)>area(b)?a:b),cx=largest.reduce((a,v)=>a+v.x,0)/largest.length,cy=largest.reduce((a,v)=>a+v.y,0)/largest.length;
 const label=svgEl('text',{x:cx,y:cy+3,'text-anchor':'middle',fill:'#ffffff70','font-size':8,'font-weight':700,'letter-spacing':2});label.textContent=String.fromCharCode(65+p);g.append(label);svg.append(g);plateNodes.push(g)});
 const label=document.createElement('div');label.className='storage-label';label.textContent=`${l.spares.length===1?'ONE SPARE':'TWO SPARES'} · PLAN THE CLEAR PATH`;board.append(label);
 sim.positions.forEach((h,b)=>{const el=document.createElement('button');el.className='bolt'+(sim.removed&(1<<b)?' parked':'')+(selected===b?' selected':'');pos(el,h);el.style.zIndex=30;el.setAttribute('aria-label',`Screw ${b+1}${sim.removed&(1<<b)?', parked':`, plate ${String.fromCharCode(65+plateForBolt(sim,b))}`}`);el.setAttribute('aria-pressed',selected===b);el.onclick=e=>activate('screw',b,e);board.append(el);pinNodes.push(el)});draw();
 const win=$('#win');win.hidden=!complete(sim);if(!win.hidden){if(daily){try{saveDailyBest(daily.identity,sim.moves)}catch{daily.status='Completed, but your daily best could not be saved on this device.';$('#dailystatus').textContent=daily.status}}else{done.add(l.id);bests=recordBest(bests,l.id,sim.moves);persist();queueAccountScore('campaign',l.id,'shapes80-v1',sim.moves)}$('#scoreline').textContent=scoreText(l);const best=bestFor(l)??sim.moves,earned=starsFor(sim.moves,l.solution.length),nextOpen=!daily&&isLevelUnlocked(index+1,levels,done,unlockedPacks);win.innerHTML=`<span class="complete-stars" aria-label="${earned} of 3 stars">${stars(earned)}</span><h3>Nicely undone.</h3><p>Every plate has fallen clear.<br>${sim.moves} moves on your route.</p><p class="win-score">Best: ${best} moves · ${stars(starsFor(best,l.solution.length))}<br>3★: ${l.solution.length} or fewer · 2★: ${l.solution.length+2} or fewer<br>1★: every completed puzzle</p><button class="primary" id="next">${daily?'Daily archive':nextOpen?'Next puzzle →':'Choose a puzzle'}</button>`;$('#next').onclick=()=>daily?showDaily():nextOpen?start(index+1):showLevels()}

}
function draw(){sim.plates.forEach((b,p)=>{plateNodes[p].setAttribute('transform',`translate(${b.position.x} ${b.position.y}) rotate(${b.angle*180/Math.PI})`);plateNodes[p].style.display=b.plugin.cleared?'none':''});pinNodes.forEach((el,b)=>{const visible=accessible(sim,b);el.disabled=!visible;el.style.visibility=visible?'visible':'hidden'});const left=sim.plates.filter(b=>!b.plugin.cleared).length,loose=sim.plates.filter((b,p)=>!b.plugin.cleared&&attachmentCount(sim,p)===0).length;$('#remaining').textContent=`${left} plates left${loose?` · ${loose} loose`:''}`;$('#board').setAttribute('aria-busy','false');const liveTargets=destinations(sim);holeNodes.forEach(({h,el})=>{el.disabled=!liveTargets.includes(h);el.classList.toggle('available',!el.disabled);el.classList.toggle('target',selected!==null&&!el.disabled)});if(selected!==null&&!accessible(sim,selected)){selected=null;hintHole=null;pinNodes.forEach(el=>{el.classList.remove('selected');el.setAttribute('aria-pressed','false')});holeNodes.forEach(({el})=>el.classList.remove('target'));say('That screw is now covered by a moving plate. Choose an exposed screw.')}}
function afterMotion(){busy=false;frame=null;if(complete(sim))render();else draw();if(complete(sim))say('Every plate has physically cleared the board. Take a breather.');else if(!destinations(sim).length)say('No free holes. Undo the last move and try another screw.');else if(sim.plates.some((b,p)=>!b.plugin.cleared&&attachmentCount(sim,p)===0))say('A loose plate is caught. Move a supporting screw or free the plate underneath.');else if(selected===null)say('Ready when you are. You can move screws while the pieces are moving, too.')}
function animate(){
 if(frame!==null||document.hidden||!nativeActive)return;busy=true;
 if(reduced.matches){settle(sim,2400);draw();if(sim.settled)afterMotion();else frame=requestAnimationFrame(()=>{frame=null;animate()});return}
 let last=performance.now(),acc=0;function tick(now){acc+=Math.min(50,now-last);last=now;while(acc>=STEP&&!sim.settled){step(sim);acc-=STEP}draw();if(sim.settled){afterMotion();return}frame=requestAnimationFrame(tick)}frame=requestAnimationFrame(tick)
}
function activate(kind,id,event){
 if(event.detail!==0){const rect=$('#board').getBoundingClientRect(),x=(event.clientX-rect.left)*350/rect.width,y=(event.clientY-rect.top)*430/rect.height,options=[...sim.positions.map((h,b)=>({kind:'screw',id:b,h})).filter(o=>accessible(sim,o.id)),...destinations(sim).map(h=>({kind:'hole',id:h,h}))];let nearest=null,distance=Infinity;for(const o of options){const c=cells[o.h],d=Math.hypot((c.x-x)*rect.width/350,(c.y-y)*rect.height/430);if(d<distance){distance=d;nearest=o}}if(nearest&&distance<=28){kind=nearest.kind;id=nearest.id}}
 kind==='screw'?select(id):place(id)
}
function select(b){if(complete(sim)||!accessible(sim,b))return;selected=selected===b?null:b;hintHole=null;render();say(selected===null?'Choose another screw when you’re ready.':destinations(sim).length?'Tap a glowing clear board hole. You can move screws while the pieces move.':(sim.settled?'No clear parking holes. Undo and try a different screw.':'No clear parking holes right now. Wait for an opening or undo.'))}
function place(h){if(complete(sim))return;if(selected===null){say('Tap an exposed silver screw first, then a glowing wood hole.');return}
 const before=snapshot(sim),next=move(sim,selected,h);if(!next){if(!accessible(sim,selected))selected=null;render();say('The pieces moved: that screw or hole is now covered. Choose an exposed screw and clear wood hole.');return}
 history.push(before);sim=next;selected=null;hintHole=null;render();say('Keep going—screws can move while the pieces swing and slide.');animate()
}
$('#undo').onclick=()=>{if(!history.length)return;cancelMotion();sim=createWorld(currentLevel(),history.pop());selected=null;hintHole=null;render();say('Restored the previous positions and momentum. Moving pieces continue from there.');if(!sim.settled)animate()};
function openDialog(title,html){dailyRequest++;$('#dialogtitle').textContent=title;$('#dialogbody').innerHTML=html;if(!$('#dialog').open)$('#dialog').showModal()}
$('#close').onclick=()=>$('#dialog').close();$('#dialog').addEventListener('close',()=>{dailyRequest++});$('#dialog').addEventListener('click',e=>{if(e.target===$('#dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
function restartCurrent(){if(!daily){start(index);return}cancelMotion();sim=createWorld(daily.level);settle(sim);history=[];selected=null;hintHole=null;render();say(daily.level.tip);if(!sim.settled)animate()}
$('#restart').onclick=()=>{if(!sim.moves){restartCurrent();return}openDialog('A fresh start?','<p>Restart this puzzle? Your other completed puzzles stay saved.</p><button class="primary" id="confirmrestart">Restart puzzle</button>');$('#confirmrestart').onclick=()=>{$('#dialog').close();restartCurrent()}};
$('#hint').onclick=()=>{const h=hint(sim);if(h.b!==undefined){selected=h.b;hintHole=h.h;render()}say(h.text)};
function showLevels(){dailyRequest++;const packs=packProgress(levels,done,unlockedPacks);openDialog('Your workshop',`<p>Complete any <strong>7 of 10</strong> puzzles in a pack to open the next. Previously unlocked packs stay open. One star is enough; replay for a tidier route whenever you like.</p><p id="lockmessage" role="status" aria-live="polite"></p><div class="packlist">${packs.map(p=>`<section class="pack"><h3>${p.index+1}. ${escapeHTML(p.name)} <small>${p.completed}/${PACK_SIZE} complete${p.unlocked?'':' · Locked'}</small></h3><div class="levelgrid">${levels.slice(p.index*PACK_SIZE,(p.index+1)*PACK_SIZE).map((l,j)=>{const i=p.index*PACK_SIZE+j,n=starsFor(bests[l.id],l.solution.length)||(done.has(l.id)?1:0);return `<button data-level="${i}" aria-disabled="${!p.unlocked}">${String(i+1).padStart(2,'0')} · ${escapeHTML(l.name)}<small>${!p.unlocked?'Locked · finish 7 in the preceding pack':n?`${stars(n)}${bests[l.id]?` · ${bests[l.id]} moves`:''}`:i===index?'Currently playing':'Ready when you are'}</small></button>`}).join('')}</div></section>`).join('')}</div>`);document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{const i=+b.dataset.level;if(!isLevelUnlocked(i,levels,done,unlockedPacks)){$('#lockmessage').textContent='Complete seven puzzles in the preceding pack to unlock this pack. No perfect scores needed.';return}$('#dialog').close();start(i)})}$('#levels').onclick=showLevels;

function dailySourceStatus(result){
 if(result.source==='fallback')return native?'Practice from the bundled game. This iPhone build cannot download daily puzzles yet.':'Offline practice from the bundled game—not today’s shared challenge. Campaign progress is unchanged.';
 if(result.source==='network'&&result.cacheSaved===false)return 'Downloaded for this session. Offline saving is unavailable on this device.';
 return result.source==='cache'?'Saved on this device for offline play. Same dated puzzle; no streak to maintain.':'Downloaded and saved for offline play. Everyone gets the same puzzle for this UTC date.';
}
async function loadDailyDate(date){
 const request=++dailyRequest;const status=$('#dailyloadstatus');if(status)status.textContent='Opening puzzle…';
 document.querySelectorAll('[data-daily-date]').forEach(b=>b.disabled=true);
 try{
  const result=await dailyStore.load(date);
  if(request!==dailyRequest||!$('#dialog').open)return;
  cancelMotion();const level=compileDailyRecipe(result.recipe);
  level.name=result.puzzle.name;daily={...result,level,status:dailySourceStatus(result)};
  sim=createWorld(level);settle(sim);history=[];selected=null;hintHole=null;
  $('#dialog').close();render();say(level.tip);if(!sim.settled)animate();
 }catch{
  if(request!==dailyRequest||!$('#dialog').open)return;
  if(status)status.textContent='That puzzle could not be opened. Try another saved date, or return to the campaign.';
  document.querySelectorAll('[data-daily-date]').forEach(b=>b.disabled=false);
 }
}
function dailyMenu(catalog){
 const today=catalog.today,entries=catalog.entries||[],hasToday=entries.some(e=>e.date===today);
 const state=native?'This iPhone build plays bundled puzzles offline; daily downloading is not enabled yet.':catalog.error?'The daily feed is unavailable. Saved dates still work offline; if a date is unavailable, a clearly labeled practice puzzle is offered.':'One shared puzzle per UTC date. Past challenges stay playable. There are no timers, streaks, or penalties.';
 const rows=entries.slice().sort((a,b)=>b.date.localeCompare(a.date));
 openDialog('Daily workshop',`<p>${escapeHTML(state)}</p><p class="daily-date">Today: <strong>${escapeHTML(today)} UTC</strong></p><button class="primary daily-today" data-daily-date="${escapeHTML(today)}">${hasToday?'Play today’s puzzle':'Check today / offline practice'}</button><p id="dailyloadstatus" role="status" aria-live="polite"></p><h3>Past challenges</h3><div class="dailyarchive">${rows.filter(e=>e.date<today).map(e=>`<button data-daily-date="${escapeHTML(e.date)}"><span>${escapeHTML(e.date)} UTC</span><small>Replay this dated puzzle</small></button>`).join('')||'<p>No earlier challenges are available yet.</p>'}</div><button id="dailycampaign" class="secondary">Return to campaign</button>`);
 document.querySelectorAll('[data-daily-date]').forEach(b=>b.onclick=()=>loadDailyDate(b.dataset.dailyDate));
 $('#dailycampaign').onclick=()=>{$('#dialog').close();start(index)};
}
async function showDaily(){
 openDialog('Daily workshop','<p id="dailyloadstatus" role="status" aria-live="polite">Checking the daily puzzle and saved archive…</p>');
 const request=++dailyRequest;
 try{const catalog=await dailyStore.refresh();if(request!==dailyRequest||!$('#dialog').open)return;dailyCatalog=catalog;dailyMenu(catalog)}
 catch{if(request!==dailyRequest||!$('#dialog').open)return;dailyMenu({today:new Date().toISOString().slice(0,10),entries:dailyStore.archive?.()||[],error:'unavailable'})}
}
$('#daily').onclick=showDaily;$('#returncampaign').onclick=()=>start(index);

$('#help').onclick=()=>openDialog('Real weight. Real obstacles.','<ol><li>Tap an exposed screw, then a glowing hole in <strong>clear wood</strong>. The clearly visible top holes are your parking spaces. This campaign uses visible parking choices, not extra secret holes under every piece.</li><li>With two or more anchors, a piece stays fixed. With one anchor, it pivots about that screw. Every square cutout stays in the material—even triangles and brackets.</li><li>With no anchors left, the piece falls—but other plates and screw shafts can catch it. Plates can tip and slide against each other.</li><li>A loose plate is not cleared until it actually falls out below the board. Move its support to free it.</li></ol><p>You can move screws while pieces swing and slide. Exposed screws and clear board targets are checked at the instant you tap. A round board hole is reusable once the screw shaft and a small safety margin are clear—even if part of its rim is covered. An aligned plate cutout can receive a parked peg, but does not create a new hinge. Original hinges and newly parked solid pegs are different.</p><p>Hints follow a tested route and suggest undoing a deviation; other solutions can work. Undo and restart are always free, even mid-swing.</p><p>Original game and artwork. Physics: Matter.js 0.20.0, MIT license. No ads, purchases, timers, streaks, or random rewards.</p>');
$('#scoreline').onclick=()=>openDialog('A little less, not a little faster.','<p>Your score is the number of screw moves on your completed route. Lower is a personal challenge—not a requirement to progress.</p><p><strong>Undo removes that move from the count.</strong> Restart begins at zero. Hints are free and do not change your score. Every completed puzzle counts as a success.</p><p>The tested target is one verified working route, <strong>not a proven minimum</strong>. If you find a shorter route, your best can beat it.</p><p>Bests stay in this browser only. Earn one star for any completion, two within two moves of the tested target, and three at or below it. The next pack unlocks after seven of ten puzzles are complete—not perfect scores. Packs you unlocked before the expansion stay open. There are no timers, leaderboards, streaks, or penalties.</p>');
$('#install').onclick=()=>openDialog('Keep the workshop handy.','<p>On iPhone, open this link in <strong>Safari</strong>, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</p><p>This is a web game, not an App Store download. Internet and site access may be needed to open it. Progress stays in this browser; clearing browser data removes it.</p>');
if(native){
 document.documentElement.classList.add('native-app');
 $('.brand').onclick=event=>{event.preventDefault();showLevels()};
 $('#install').textContent='About this iPhone app';
 $('#install').onclick=()=>openDialog('Your pocket workshop.','<p>All 80 puzzles are bundled in this app and play offline. No ads, purchases, timers, tracking, or network connection.</p><p>Completed puzzles, personal bests, unlocked packs, and your selected puzzle save on this device. The current attempt stays while the app is in memory; after relaunch or a system reload it starts fresh. Deleting the app removes its save. Safari progress is separate.</p><p>The workshop is intentionally silent. Physics: Matter.js 0.20.0, MIT license.</p>');
 const browserScoreHelp=$('#scoreline').onclick;
 $('#scoreline').onclick=()=>{browserScoreHelp();$('#dialogbody').innerHTML=$('#dialogbody').innerHTML.replace('in this browser only','on this device in the app')};
}
start(index);

function queueAccountScore(kind,puzzleId,revision,bestMoves){if(!accountUID||!syncController)return;try{syncController.enqueue({schema:1,kind,puzzleId,revision,bestMoves,completed:true});void flushAccount()}catch{say('Completed locally, but account synchronization is unavailable.')}}
function saveDailyBest(identity,moves){if(!accountUID){dailyStore.recordBest(identity,moves);return}accountDaily[identity]=Math.min(accountDaily[identity]??Infinity,moves);const r=accountTools?.dailyScoreRecord(identity,moves);if(r)queueAccountScore(r.kind,r.puzzleId,r.revision,moves);else if(daily){daily.status='Practice best kept for this session only; not synced to your account.';$('#dailystatus').textContent=daily.status}}
function applySyncState(state){if(state.uid!==accountUID||!accountUID)return;for(const r of state.records){if(r.kind==='campaign'&&r.revision==='shapes80-v1'&&levels.some(l=>l.id===r.puzzleId)){bests=recordBest(bests,r.puzzleId,r.bestMoves);done.add(r.puzzleId)}else if(r.kind==='daily'){const id=r.puzzleId+'@'+r.revision;accountDaily[id]=Math.min(accountDaily[id]??Infinity,r.bestMoves)}}persist();if(sim)$('#scoreline').textContent=scoreText(currentLevel());const el=$('#accountstatus');if(el)el.textContent=state.error||(state.busy?'Checking account sync…':!state.persisted?'Account progress is in memory only: device saving is unavailable.':state.pending.length?`${state.pending.length} score updates waiting to sync.`:cloudConfirmed?'Completed scores synced. Current attempts stay on this device.':'Account scores saved locally; cloud sync is not yet confirmed.');}
async function flushAccount(){const uid=accountUID,epoch=accountEpoch;if(!uid||!syncController)return;try{const result=await syncController.flush();if(uid!==accountUID||epoch!==accountEpoch)return;if(!result?.stale&&!result?.error&&!result?.pending?.length)cloudConfirmed=true;applySyncState(syncController.state())}catch{if(uid===accountUID&&epoch===accountEpoch){cloudConfirmed=false;const el=$('#accountstatus');if(el)el.textContent='Not yet synced. Account scores remain saved locally.'}}}
function switchAccount(user,adapter,core){
 const next=user?.uid||null;if(next===accountUID)return;
 persist();cancelMotion();dailyRequest++;daily=null;accountUID=next;accountEpoch++;cloudConfirmed=false;accountDaily={};
 const loaded=normalizeProgress(readSave(next?accountSaveKey(next):'screw-workshop-physics-v4'),levels);({bests,done,index,unlockedPacks}=loaded);
 if(!syncController)syncController=core.createSyncController({storage:dailyStorage??null,adapter,onChange:applySyncState});syncController.setUser(next);start(index);$('#accountstatus').hidden=!next;
 if(next){const epoch=accountEpoch;void syncController.load().then(result=>{if(next!==accountUID||epoch!==accountEpoch||result?.stale)return;if(result?.error){applySyncState(syncController.state());return}return flushAccount()}).catch(()=>{if(next===accountUID&&epoch===accountEpoch){cloudConfirmed=false;$('#accountstatus').textContent='Cloud scores unavailable. Account progress remains local.'}})}else $('#accountstatus').textContent='';
}
async function setupAccount(){
 if(native||typeof firebaseConfig==='undefined'||!firebaseConfig.enabled)return;
 const [ui,fb,core]=await Promise.all([import('./account-ui.mjs'),import('./firebase-adapter.mjs'),import('./progress-sync.mjs')]);
 if(!fb.isFirebaseConfigured(firebaseConfig))return;accountTools=ui;
 const button=$('#account');
 ui.installAccountUI({button,loadAdapter:()=>fb.createFirebaseAdapter({config:firebaseConfig}),
  onUser(user,adapter){switchAccount(user,adapter,core)},
  async importGuest(){if(!accountUID)return;const guest=normalizeProgress(readSave('screw-workshop-physics-v4'),levels);const records=Object.entries(guest.bests).map(([id,moves])=>ui.scoreRecord('campaign',id,'shapes80-v1',moves));for(const[id,moves]of Object.entries(dailyStore.readProgress())){const r=ui.dailyScoreRecord(id,moves);if(r)records.push(r)}syncController.importGuest(records,{confirmed:true});await flushAccount()},
  exportLocal(){return {sync:syncController.exportData(),campaign:serializeProgress(index,levels,done,bests,unlockedPacks),daily:{...accountDaily}}},
  clearAccount(uid){try{localStorage.removeItem(accountSaveKey(uid));localStorage.removeItem('screw-workshop-sync-v1:'+encodeURIComponent(uid))}catch{}},
  onError(){say('Account action unavailable. You can keep playing; guest progress is unchanged.')}
 });window.addEventListener('online',()=>{if(accountUID)void flushAccount()});
}
void setupAccount().catch(()=>{const b=$('#account');if(b)b.hidden=true});

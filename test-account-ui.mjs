import assert from 'node:assert/strict';
import {installAccountUI,dailyScoreRecord,scoreRecord} from './dist/account-ui.mjs';
assert.equal(dailyScoreRecord('fallback:practice@matter020-workshop-v1',2),null);
assert.equal(dailyScoreRecord('day@wrong',2),null);
assert.deepEqual(dailyScoreRecord('daily-2026-10-29-v1@'+'a'.repeat(64),12),scoreRecord('daily','daily-2026-10-29-v1','a'.repeat(64),12));
class El{constructor(){this.map=new Map();this.listeners={};this.value='';this.open=false;this.textContent='';this.disabled=false;this.hidden=true}set innerHTML(x){this.html=x;this.map=new Map()}get innerHTML(){return this.html}querySelector(s){if(!this.map.has(s))this.map.set(s,new El());return this.map.get(s)}querySelectorAll(s){return [...this.map].filter(([k])=>s==='button'?k.startsWith('[data-'):s==='input[type="password"]'?k.includes('password'):false).map(([,v])=>v)}addEventListener(k,f){this.listeners[k]=f}showModal(){this.open=true}close(){this.open=false;this.listeners.close?.()}append(e){this.child=e}remove(){}click(){}}
const body=new El();globalThis.document={body,createElement:()=>new El()};const button=new El();let user=null,watch=null,loads=0,imports=0,deleted=0,signins=0,resolveSignIn=null,fail=false;
const adapter={onAuth(fn){watch=fn;fn(user);return()=>{}},async signIn(email,password){signins++;assert.equal(password,'secret');if(resolveSignIn)await new Promise(r=>resolveSignIn=r);if(fail)throw Error('fail');user={uid:'alice',email};watch(user)},async signUp(e,p){return this.signIn(e,p)},async resetPassword(){},async signOut(){user=null;watch(null)},async deleteAccount(p){assert.equal(p,'secret');deleted++;user=null;watch(null)}};
const seen=[];const ui=installAccountUI({button,loadAdapter:async()=>{loads++;return adapter},onUser:u=>seen.push(u?.uid||null),importGuest:async()=>{imports++},exportLocal:()=>({}),clearAccount(){}});
assert.equal(loads,0);assert.equal(button.hidden,false);await button.onclick();assert.equal(loads,1);const d=body.child;assert(d.open);d.querySelector('[name="email"]').value='a@example.test';d.querySelector('[name="password"]').value='secret';await d.querySelector('form').onsubmit({preventDefault(){}});await new Promise(r=>setImmediate(r));assert.equal(user.uid,'alice');assert.equal(imports,0);assert(d.innerHTML.includes('Guest progress remains separate'));
d.querySelector('[data-import]').onclick();assert.equal(imports,0);await d.querySelector('[data-import]').onclick();assert.equal(imports,1);assert.equal(loads,1);
await d.querySelector('[data-out]').onclick();assert.equal(user,null);assert(d.innerHTML.includes('Optional:'));
// A canceled slow login must never reopen a dialog; duplicate submit is ignored.
d.querySelector('[name="email"]').value='a@example.test';d.querySelector('[name="password"]').value='secret';resolveSignIn=true;d.querySelector('form').onsubmit({preventDefault(){}});await Promise.resolve();d.querySelector('form').onsubmit({preventDefault(){}});assert.equal(signins,2);ui.close();resolveSignIn();await new Promise(r=>setImmediate(r));resolveSignIn=null;assert.equal(d.open,false);assert.equal(user.uid,'alice');await button.onclick();assert(d.open);d.querySelector('[data-delete-password]').value='secret';await d.querySelector('[data-delete]').onclick();assert.equal(deleted,1);assert.equal(user,null);
// Failed credentials clear password and leave the same form usable.
d.querySelector('[name="email"]').value='a@example.test';d.querySelector('[name="password"]').value='secret';fail=true;d.querySelector('form').onsubmit({preventDefault(){}});await new Promise(r=>setImmediate(r));assert.equal(d.querySelector('[name="password"]').value,'');assert.match(d.querySelector('[role="status"]').textContent,/could not finish/);assert.equal(user,null);ui.destroy();
console.log('PASS account UI: lazy SDK, explicit guest import, signout, delete reauthentication input, duplicate submit, closed late auth, password clearing, revision-safe daily identity.');

// Exercise actual app account switching with the existing small DOM/physics harness.
const fs=await import('node:fs'),vm=await import('node:vm');
const progress=await import('./dist/progress.mjs');
const core=await import('./dist/progress-sync.mjs');
const appPath=new URL('./dist/app.mjs',import.meta.url).pathname;
let harness=fs.readFileSync(new URL('./test-daily-ui.mjs',import.meta.url),'utf8').split('const ui=context.testUI;')[0].replace(/^import .*;\n/gm,'').replace("new URL('./dist/app.mjs',import.meta.url)",JSON.stringify(appPath));
harness=harness.replace('restartCurrent,render,openDialog,state:()=>({index,daily,sim,done,bests})','restartCurrent,render,openDialog,switchAccount,saveDailyBest,applySyncState,showDailyResult,setAccountTools:tools=>{accountTools=tools},state:()=>({index,daily,sim,done,bests,accountUID,accountDaily})');
const dailySummary=await import('./dist/daily-summary.mjs');
const h=new Function('fs','vm','dailySummary',harness+'\nreturn {context,get,setLoadResult:value=>{loadResult=value},getLoadResult:()=>loadResult};')(fs,vm,dailySummary);const game=h.context.testUI;
const memory=new Map();h.context.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
h.context.normalizeProgress=progress.normalizeProgress;h.context.recordBest=progress.recordBest;
// A guest win exists before the first sign-in; it must not be imported automatically.
game.start(0);game.state().sim.moves=2;game.render();const guestBefore=memory.get('screw-workshop-physics-v4');assert(guestBefore);
let resolveAlice;const writes=[];const backend={readAll:uid=>uid==='alice'?new Promise(r=>resolveAlice=r):Promise.resolve([]),putBest:async(uid,r)=>{writes.push({uid,...r});return r},deleteAll:async()=>{}};
game.switchAccount({uid:'alice'},backend,core);assert.equal(game.state().accountUID,'alice');assert.equal(game.state().done.size,0);assert(!h.get('#accountstatus').textContent.includes('scores synced'));
game.start(1);game.state().sim.moves=2;game.render();await new Promise(r=>setImmediate(r));assert.equal(memory.get('screw-workshop-physics-v4'),guestBefore);assert(writes.every(r=>r.uid==='alice'));
game.switchAccount({uid:'bob'},backend,core);assert.equal(game.state().accountUID,'bob');assert(!game.state().done.has('level-1'));await new Promise(r=>setImmediate(r));
// Resolve stale Alice load after Bob is active; it cannot populate Bob or cause writes.
resolveAlice([{schema:1,kind:'campaign',puzzleId:'level-5',revision:'shapes80-v1',bestMoves:2,completed:true}]);await new Promise(r=>setImmediate(r));assert(!game.state().done.has('level-5'));assert.equal(game.state().accountUID,'bob');
game.switchAccount(null,backend,core);assert.equal(game.state().accountUID,null);assert(game.state().done.has('level-0'));assert(!game.state().done.has('level-1'));assert.equal(memory.get('screw-workshop-physics-v4'),guestBefore);
// Logout before load completion cannot flush through a null or different account.
let resolveLate;const late={readAll:()=>new Promise(r=>resolveLate=r),putBest:async()=>{throw Error('unexpected write')},deleteAll:async()=>{}};
// The controller retains its adapter, so use Alice's deferred read again.
game.switchAccount({uid:'alice'},backend,core);game.switchAccount(null,backend,core);resolveAlice([]);await new Promise(r=>setImmediate(r));assert.equal(game.state().accountUID,null);assert.equal(memory.get('screw-workshop-physics-v4'),guestBefore);
console.log('PASS account integration: guest preservation, UID-local campaign isolation, no implicit merge, late cross-account load ignored, logout-before-load race, honest initial status.');

// Signed-in opening must survive synchronous busy/final sync notifications:
// refreshing the calendar must not cancel its own open-puzzle request.
game.setAccountTools({dailyScoreRecord,scoreRecord});
game.switchAccount({uid:'bob'},backend,core);await new Promise(r=>setImmediate(r));
await game.showDaily();await game.loadDailyDate('2026-10-29');
assert.equal(game.state().daily?.date,'2026-10-29');assert.equal(h.get('#dialog').open,false);
// A competing device completed first in 16 moves. The local 12-move finish is
// provisional until ack; every visible final-result surface must reconcile.
backend.putBest=async(uid,r)=>{writes.push({uid,...r});return r.kind==='daily'?{...r,bestMoves:16}:r};
game.state().sim.moves=12;game.render();assert.match(h.get('#win').innerHTML,/12 moves/);
await new Promise(r=>setImmediate(r));
assert.equal(game.state().accountDaily[h.getLoadResult().identity],16);
assert.match(h.get('#win').innerHTML,/Final result: 16 moves/);assert.doesNotMatch(h.get('#win').innerHTML,/12 moves/);
assert.match(h.get('#scoreline').textContent,/16 moves/);assert.equal(h.get('#restart').disabled,true);
// A historical unknown revision may lock a currently open same-date puzzle, but
// neither the overlay nor score line may invent its stars from today's target.
game.start(0);const currentFixture=h.getLoadResult();
h.setLoadResult({...currentFixture,date:'2026-10-30',identity:'daily-2026-10-30-v1@711ce807a69e733e9561a4e8e2a433fbccaed11c2b06889dc3e3e6787c4548bf'});
await game.showDaily();await game.loadDailyDate('2026-10-30');assert.equal(game.state().daily?.date,'2026-10-30');
const historical={schema:1,kind:'daily',puzzleId:'daily-2026-10-30-v2',revision:'f'.repeat(64),bestMoves:7,completed:true};
game.applySyncState({uid:'bob',records:[historical],pending:[],persisted:true,busy:false,error:null});
assert.match(h.get('#win').innerHTML,/Historical stars unavailable/);assert.doesNotMatch(h.get('#win').innerHTML,/[★☆]/);
assert.match(h.get('#scoreline').textContent,/Stars unavailable/);assert.doesNotMatch(h.get('#scoreline').textContent,/[★☆]/);
assert.equal(h.get('#restart').disabled,true);assert.equal(h.get('#undo').disabled,true);
// An already-open read-only result also reconciles later sync, but closed
// dialogs stay closed rather than reappearing when an acknowledgement arrives.
game.showDailyResult('2026-10-30');assert.equal(h.get('#dialog').open,true);assert.match(h.get('#dialogbody').innerHTML,/7 moves/);
game.applySyncState({uid:'bob',records:[{...historical,bestMoves:9}],pending:[],persisted:true,busy:false,error:null});
assert.equal(h.get('#dialog').open,true);assert.match(h.get('#dialogbody').innerHTML,/9 moves/);assert.doesNotMatch(h.get('#dialogbody').innerHTML,/7 moves/);
h.get('#dialog').close();game.applySyncState({uid:'bob',records:[{...historical,bestMoves:10}],pending:[],persisted:true,busy:false,error:null});assert.equal(h.get('#dialog').open,false);
// A late auth change must dismiss an already-rendered prior identity's daily
// calendar or read-only result rather than display its totals under the new UID.
game.openDialog('Daily complete','<p>Prior account private result</p>');
game.switchAccount(null,backend,core);assert.equal(h.get('#dialog').open,false);assert.equal(game.state().daily,null);assert.deepEqual(Object.keys(game.state().accountDaily),[]);
await game.showDaily();assert.equal(h.get('#dialog').open,true);
game.switchAccount({uid:'bob'},backend,core);assert.equal(h.get('#dialog').open,false);await new Promise(r=>setImmediate(r));
assert.equal(memory.get('screw-workshop-physics-v4'),guestBefore);
console.log('PASS daily/account regression: sync-safe puzzle opening, competing final score visible reconciliation, unknown-revision stars never invented, and modal identity isolation.');

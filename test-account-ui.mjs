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
harness=harness.replace('restartCurrent,render,openDialog,state:()=>({index,daily,sim,done,bests})','restartCurrent,render,openDialog,switchAccount,saveDailyBest,applySyncState,state:()=>({index,daily,sim,done,bests,accountUID,accountDaily})');
const h=new Function('fs','vm',harness+'\nreturn {context,get};')(fs,vm);const game=h.context.testUI;
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

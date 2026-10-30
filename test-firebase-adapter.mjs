import assert from 'node:assert/strict';
import config from './dist/firebase-config.mjs';
import {createFirebaseAdapter,isFirebaseConfigured} from './dist/firebase-adapter.mjs';
const configured={enabled:true,firebase:{apiKey:'public-test-key',authDomain:'demo-screw-workshop.firebaseapp.com',projectId:'demo-screw-workshop',appId:'1:test:web:test'}};
const record={schema:1,kind:'campaign',puzzleId:'first-turn',revision:'rev1',bestMoves:5,completed:true};
const key=r=>`${r.kind}__${r.puzzleId}__${r.revision}`;
function mock(){
 const records=new Map(),calls=[],listeners=[],auth={currentUser:{uid:'alice',email:'a@example.test',emailVerified:true}};
 let failDelete=false,failReauth=false,readBarrier=null,txBarrier=null;
 const change=uid=>{auth.currentUser=uid?{uid,email:uid+'@example.test'}:null;listeners.forEach(cb=>cb(auth.currentUser))};
 const docs=q=>[...records.entries()].filter(([id])=>id.startsWith(q.path+'/')).slice(0,q.limit??Infinity).map(([id,data])=>({id:id.split('/').at(-1),ref:{path:id},data:()=>data}));
 const sdk={initializeApp:()=>({}),getAuth:()=>auth,setPersistence:async(a,v)=>calls.push(v),browserSessionPersistence:'session',initializeFirestore:(a,o)=>{assert.equal(o.localCache,'memory');return{}},memoryLocalCache:()=> 'memory',onAuthStateChanged:(a,cb)=>listeners.push(cb),collection:(d,...path)=>({path:path.join('/')}),doc:(d,...path)=>({path:path.join('/')}),serverTimestamp:()=> 'server-time',query:(q,l)=>({...q,...l}),limit:n=>({limit:n}),
 getDocsFromServer:async q=>{if(readBarrier)await readBarrier;return {docs:docs(q)}},
 runTransaction:async(d,fn)=>{let writes=[];const value=await fn({get:async ref=>{if(txBarrier)await txBarrier;return{exists:()=>records.has(ref.path),data:()=>records.get(ref.path)}},set:(ref,r)=>writes.push([ref.path,r])});for(const[id,r]of writes){records.set(id,r);calls.push(id.endsWith('/control/account')?'tombstone':'write')}return value},
 writeBatch:()=>{const dels=[];return {delete:ref=>dels.push(ref.path),commit:async()=>{calls.push('batch');if(failDelete)throw Error('offline');dels.forEach(k=>records.delete(k))}}},
 EmailAuthProvider:{credential:(email,password)=>({email,password})},reauthenticateWithCredential:async()=>{calls.push('reauth');if(failReauth)throw Error('wrong-password')},deleteUser:async()=>{calls.push('delete-user');change(null)},
 signInWithEmailAndPassword:async(a,e,p)=>{calls.push('signin');change('alice')},createUserWithEmailAndPassword:async()=>calls.push('signup'),sendPasswordResetEmail:async()=>calls.push('reset'),signOut:async()=>change(null)};
 return{sdk,records,calls,change,set failDelete(v){failDelete=v},set failReauth(v){failReauth=v},set readBarrier(v){readBarrier=v},set txBarrier(v){txBarrier=v}};
}
assert.equal(isFirebaseConfigured(config),false);let loads=0;
await assert.rejects(createFirebaseAdapter({config,loadSDK:()=>{loads++}}),/not configured/);assert.equal(loads,0);
const m=mock(),a=await createFirebaseAdapter({config:configured,loadSDK:async()=>m.sdk});
assert.deepEqual(a.currentUser(),{uid:'alice',email:'a@example.test',emailVerified:true});
await a.putBest('alice',record);await a.putBest('alice',{...record,bestMoves:9});assert.equal((await a.readAll('alice'))[0].bestMoves,5);
await a.putBest('alice',{...record,bestMoves:3});assert.equal((await a.readAll('alice'))[0].bestMoves,3);
await a.putBest('alice',{...record,revision:'rev2',bestMoves:10});assert.equal((await a.readAll('alice')).length,2);
await assert.rejects(a.putBest('bob',record),/Account changed/);await assert.rejects(a.putBest('alice',{...record,bestMoves:0}),/Invalid/);await assert.rejects(a.putBest('alice',{...record,extra:true}),/Invalid/);
let release;m.readBarrier=new Promise(r=>release=r);const pendingRead=a.readAll('alice');m.change('bob');release();await assert.rejects(pendingRead,/Account changed/);m.readBarrier=null;m.change('alice');
m.txBarrier=new Promise(r=>release=r);const pendingWrite=a.putBest('alice',{...record,bestMoves:1});m.change('bob');release();await assert.rejects(pendingWrite,/Account changed/);m.txBarrier=null;m.change('alice');
m.failReauth=true;await assert.rejects(a.deleteAccount('wrong'),/wrong-password/);assert.equal(m.calls.includes('batch'),false);assert.equal(m.calls.includes('delete-user'),false);assert.equal(m.records.has('users/alice/control/account'),false);m.failReauth=false;
m.failDelete=true;await assert.rejects(a.deleteAccount('password'),/offline/);assert.equal(m.calls.includes('delete-user'),false);assert.equal(a.currentUser().uid,'alice');assert.equal(m.records.get('users/alice/control/account').deleting,true);assert.ok(m.calls.indexOf('tombstone')<m.calls.indexOf('batch'));await assert.rejects(a.putBest('alice',record),/deletion has started/);m.failDelete=false;
await a.deleteAccount('password');assert.deepEqual([...m.records.keys()],['users/alice/control/account']);assert.equal(m.calls.at(-1),'delete-user');assert.equal(a.currentUser(),null);
// Drain an already started transaction before deleting: it cannot recreate data.
const n=mock(),b=await createFirebaseAdapter({config:configured,loadSDK:async()=>n.sdk});n.txBarrier=new Promise(r=>release=r);const writing=b.putBest('alice',record);const deleting=b.deleteAccount('pw');release();await assert.rejects(writing,/deletion/);await deleting;assert.deepEqual([...n.records.keys()],['users/alice/control/account']);
// Pagination never deletes another user's records; multiple bounded batches work.
const p=mock(),c=await createFirebaseAdapter({config:configured,loadSDK:async()=>p.sdk});for(let i=0;i<801;i++)p.records.set(`users/alice/progress/p${i}`,record);p.records.set('users/bob/progress/private',record);await c.deleteAll('alice','pw');assert.equal(p.calls.filter(x=>x==='batch').length,3);assert.equal(p.records.size,1);assert.equal(c.currentUser().uid,'alice');
console.log('PASS Firebase adapter: disabled gate, lazy SDK, memory/session isolation, transactional revision-specific minima, stale-user cancellation, reauth-first bounded deletion, failure recovery in-flight write drain, tombstone ordering and retained deletion flags.');

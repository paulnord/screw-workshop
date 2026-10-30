import assert from 'node:assert/strict';
import {createServer} from 'node:net';
import * as appSDK from 'firebase/app';
import * as authSDK from 'firebase/auth';
import * as firestoreSDK from 'firebase/firestore';
import {createFirebaseAdapter} from './dist/firebase-adapter.mjs';
import {createSyncController} from './dist/progress-sync.mjs';

// Fail closed before creating an SDK app. This test never imports production
// config, contacts production Firebase, sends email, or creates persistent users.
const projectId='demo-screw-workshop';
for(const name of ['FIREBASE_AUTH_EMULATOR_HOST','FIRESTORE_EMULATOR_HOST']){
 if(!/^127\.0\.0\.1:\d+$/.test(process.env[name]||''))throw Error(`Run npm run test:emulators: ${name} must be a localhost emulator`);
}
if(process.env.GCLOUD_PROJECT&&process.env.GCLOUD_PROJECT!==projectId)throw Error('Only demo-screw-workshop is permitted');
const config={enabled:true,firebase:{apiKey:'demo-api-key',authDomain:`${projectId}.firebaseapp.com`,projectId,appId:'1:000000000000:web:emulator'}};
const [firestoreHost,firestorePort]=process.env.FIRESTORE_EMULATOR_HOST.split(':');
const authURL=`http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`;
firestoreSDK.setLogLevel('silent');
const clients=[],runId=`${Date.now()}-${Math.random().toString(36).slice(2)}`;
const password='Local-emulator-only-20261030!';
const watchdog=setTimeout(()=>{console.error('FAIL: local emulator integration exceeded 90 seconds');process.exit(1)},90_000);
let assertions=0;
const check=(actual,expected)=>{assert.deepEqual(actual,expected);assertions++};
const denied=async operation=>{await assert.rejects(operation,error=>error.code==='permission-denied');assertions++};
const rejected=async(operation,pattern)=>{await assert.rejects(operation,pattern);assertions++};
const record=(bestMoves,revision='shapes80-v1',puzzleId='first-turn')=>({schema:1,kind:'campaign',puzzleId,revision,bestMoves,completed:true});
const key=r=>`${r.kind}__${r.puzzleId}__${r.revision}`;
const progressRef=(client,uid,value=record(8))=>firestoreSDK.doc(client.db,'users',uid,'progress',key(value));
const controlRef=(client,uid)=>firestoreSDK.doc(client.db,'users',uid,'control','account');
const progressCollection=(client,uid)=>firestoreSDK.collection(client.db,'users',uid,'progress');
const nextTurn=()=>new Promise(resolve=>setImmediate(resolve));

async function createClient(label,{port=Number(firestorePort)}={}){
 const client={label,failNextPurge:false};clients.push(client);
 const sdk={...appSDK,...authSDK,...firestoreSDK,
  initializeApp(options){assert.equal(options.projectId,projectId);client.app=appSDK.initializeApp(options,`emulator-${label}-${runId}`);return client.app},
  getAuth(app){client.auth=authSDK.getAuth(app);authSDK.connectAuthEmulator(client.auth,authURL,{disableWarnings:true});return client.auth},
  // Node has no browser sessionStorage. Substitute memory persistence in this
  // test ONLY. Real browser session persistence/CDN/CORS/device UI are NOT tested.
  browserSessionPersistence:authSDK.inMemoryPersistence,
  initializeFirestore(app,options){client.db=firestoreSDK.initializeFirestore(app,options);firestoreSDK.connectFirestoreEmulator(client.db,firestoreHost,port);return client.db},
  runTransaction(db,update,options){return firestoreSDK.runTransaction(db,transaction=>update({
   async get(ref){const snapshot=await transaction.get(ref);if(ref.path.includes('/progress/')&&client.progressReadBarrier){const barrier=client.progressReadBarrier;client.progressReadBarrier=null;await barrier()}return snapshot},
   set:(...args)=>transaction.set(...args)
  }),options)},
  writeBatch(db){const batch=firestoreSDK.writeBatch(db);return {delete(ref){batch.delete(ref)},async commit(){if(client.failNextPurge){client.failNextPurge=false;throw Error('Simulated interrupted purge before commit')}return batch.commit()}}}
 };
 client.adapter=await createFirebaseAdapter({config,loadSDK:async()=>sdk});
 await client.auth.authStateReady();await nextTurn();
 return client;
}

console.log('LOCAL INTEGRATION: production adapter + real Firebase SDK + Auth/Firestore emulators; demo-only ephemeral accounts.');
console.log('LIMITATION: Node in-memory Auth persistence substitutes for browser session persistence; no real email, browser/CDN or device acceptance claimed.');
try{
 const alice=await createClient('alice-device-1'),aliceSecond=await createClient('alice-device-2'),bob=await createClient('bob'),guest=await createClient('guest');
 const aliceEmail=`alice-${runId}@example.test`,bobEmail=`bob-${runId}@example.test`;
 check(alice.adapter.currentUser(),null);
 await alice.adapter.signUp(aliceEmail,password);await nextTurn();
 const aliceUID=alice.adapter.currentUser().uid;
 check(alice.adapter.currentUser().email,aliceEmail);
 await alice.adapter.signOut();await nextTurn();check(alice.adapter.currentUser(),null);
 await rejected(alice.adapter.readAll(aliceUID),/Account changed/);
 await alice.adapter.signIn(aliceEmail,password);await nextTurn();check(alice.adapter.currentUser().uid,aliceUID);
 await aliceSecond.adapter.signIn(aliceEmail,password);await nextTurn();check(aliceSecond.adapter.currentUser().uid,aliceUID);
 await bob.adapter.signUp(bobEmail,password);await nextTurn();
 const bobUID=bob.adapter.currentUser().uid;assert.notEqual(bobUID,aliceUID);assertions++;
 console.log('PASS emulator signup, sign-out, sign-in and second-device identity.');

 await alice.adapter.putBest(aliceUID,record(8));
 await aliceSecond.adapter.putBest(aliceUID,record(5));
 await alice.adapter.putBest(aliceUID,record(9));
 check((await alice.adapter.readAll(aliceUID))[0].bestMoves,5);
 console.log('PASS sequential cross-device minimum score; testing simultaneous transactions.');
 // Two live SDK clients transact on the same revision, retaining the minimum.
 // Synchronize the first real progress reads so both devices see the same old
 // value. Subsequent retries are unmodified real SDK transactions.
 let releaseReads,readers=0;const bothRead=new Promise(resolve=>{releaseReads=resolve});
 const waitBarrier=async promise=>{let timer;try{await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Concurrent read barrier timed out')),5000)})])}finally{clearTimeout(timer)}};
 const readBarrier=async()=>{if(++readers===2)releaseReads();await waitBarrier(bothRead)};
 let releaseWinningWrite;const winningWrite=new Promise(resolve=>{releaseWinningWrite=resolve});
 // Commit the better score first while the other client holds its real stale
 // snapshot. This deterministically exercises rules denial before SDK retry.
 alice.progressReadBarrier=async()=>{await readBarrier();await waitBarrier(winningWrite)};aliceSecond.progressReadBarrier=readBarrier;
 const concurrent=await Promise.allSettled([alice.adapter.putBest(aliceUID,record(4)),aliceSecond.adapter.putBest(aliceUID,record(3)).finally(releaseWinningWrite)]);
 const concurrentErrors=concurrent.filter(result=>result.status==='rejected').map(result=>result.reason.code||result.reason.message);
 if(concurrentErrors.length)console.log('CONCURRENT TRANSACTION FAILURE (remaining lifecycle checks continue):',concurrentErrors);
 check((await aliceSecond.adapter.readAll(aliceUID))[0].bestMoves,3);
 await aliceSecond.adapter.putBest(aliceUID,record(20,'different-revision'));
 const daily={schema:1,kind:'daily',puzzleId:'daily-2026-10-30-v1',revision:'a'.repeat(64),bestMoves:12,completed:true};
 // Both devices start from an absent daily record. The first transaction to
 // commit is final even when the waiting device submitted a more efficient route.
 let releaseDailyReads,dailyReaders=0,releaseDailyWinner;
 const dailyReads=new Promise(resolve=>{releaseDailyReads=resolve}),dailyWinner=new Promise(resolve=>{releaseDailyWinner=resolve});
 const dailyBarrier=async()=>{if(++dailyReaders===2)releaseDailyReads();await waitBarrier(dailyReads)};
 alice.progressReadBarrier=dailyBarrier;
 aliceSecond.progressReadBarrier=async()=>{await dailyBarrier();await waitBarrier(dailyWinner)};
 const dailyConcurrent=await Promise.all([
  alice.adapter.putBest(aliceUID,daily).finally(releaseDailyWinner),
  aliceSecond.adapter.putBest(aliceUID,{...daily,bestMoves:8})
 ]);
 check(dailyConcurrent.map(r=>r.bestMoves),[12,12]);
 check((await aliceSecond.adapter.putBest(aliceUID,{...daily,bestMoves:8})).bestMoves,12);
 check((await aliceSecond.adapter.putBest(aliceUID,{...daily,bestMoves:20})).bestMoves,12);
 // Explicit historical import may preserve a better already-earned guest score;
 // ordinary gameplay still cannot change the completed daily afterward.
 check((await aliceSecond.adapter.putBest(aliceUID,{...daily,bestMoves:10},{preserveHistoricalBest:true})).bestMoves,10);
 check((await alice.adapter.putBest(aliceUID,{...daily,bestMoves:7})).bestMoves,10);
 const exported=await aliceSecond.adapter.exportData(aliceUID);
 check(exported.schema,1);check(exported.uid,aliceUID);check(exported.progress.length,3);
 check(exported.progress.find(r=>r.revision==='different-revision').bestMoves,20);
 check(exported.progress.find(r=>r.kind==='daily').bestMoves,10);
 await rejected(bob.adapter.readAll(aliceUID),/Account changed/);
 await denied(firestoreSDK.getDocsFromServer(progressCollection(bob,aliceUID)));
 await denied(firestoreSDK.getDocFromServer(progressRef(bob,aliceUID)));
 await denied(firestoreSDK.setDoc(progressRef(bob,aliceUID),{...record(1),updatedAt:firestoreSDK.serverTimestamp()}));
 await denied(firestoreSDK.getDocsFromServer(progressCollection(guest,aliceUID)));
 await denied(firestoreSDK.setDoc(progressRef(guest,aliceUID),{...record(1),updatedAt:firestoreSDK.serverTimestamp()}));
 check(await bob.adapter.readAll(bobUID),[]);
 console.log('PASS cross-device minimum/revision scores, daily export and cross-user/guest denial.');

 // A separate real SDK client points at an unused loopback port to model an
 // unreachable Firestore service. disableNetwork() alone does not stop Node
 // transaction RPCs. The queue must survive reload into the reachable client.
 // Map storage substitutes only for browser localStorage in this Node test.
 const cache=new Map([['guest-progress','unchanged']]);
 const storage={getItem:key=>cache.get(key)??null,setItem:(key,value)=>cache.set(key,value),removeItem:key=>cache.delete(key)};
 const portProbe=createServer();await new Promise(resolve=>portProbe.listen(0,'127.0.0.1',resolve));
 const offlinePort=portProbe.address().port;await new Promise(resolve=>portProbe.close(resolve));
 const bobOffline=await createClient('bob-offline',{port:offlinePort});await bobOffline.adapter.signIn(bobEmail,password);await nextTurn();
 const queue=createSyncController({storage,adapter:bobOffline.adapter});queue.setUser(bobUID);
 check(queue.state().records,[]);
 assert.throws(()=>queue.importGuest([record(7,'shapes80-v1','guest-proof')]),/Explicit merge confirmation/);assertions++;
 check(queue.state().pending,[]);
 queue.importGuest([record(7,'shapes80-v1','guest-proof')],{confirmed:true});
 const offline=await queue.flush();check(offline.pending.length,1);check(!!offline.error,true);
 const resumed=createSyncController({storage,adapter:bob.adapter});resumed.setUser(bobUID);check(resumed.state().pending.length,1);
 check((await resumed.flush()).pending,[]);check((await bob.adapter.readAll(bobUID))[0].bestMoves,7);
 resumed.setUser(null);check(resumed.state().records,[]);
 resumed.setUser(aliceUID);check(resumed.state().records,[]);
 resumed.setUser(bobUID);check(resumed.state().records.length,1);check(cache.get('guest-progress'),'unchanged');
 console.log('PASS explicit-only guest import, real offline pending queue/reload/reconnect and UID-cache isolation.');

 // A wrong password must fail before the irreversible deletion marker or purge.
 await rejected(alice.adapter.deleteAccount('wrong-local-password'),/auth\/(invalid-credential|wrong-password)/);
 check((await firestoreSDK.getDocFromServer(controlRef(aliceSecond,aliceUID))).exists(),false);
 check((await alice.adapter.readAll(aliceUID)).length,3);
 // Interrupt only the SDK batch commit: real reauthentication and tombstone
 // transaction still run against the emulators. Retry must finish safely.
 alice.failNextPurge=true;
 await rejected(alice.adapter.deleteAccount(password),/Simulated interrupted purge/);
 check(alice.adapter.currentUser().uid,aliceUID);
 const tombstone=await firestoreSDK.getDocFromServer(controlRef(aliceSecond,aliceUID));
 check(tombstone.data().deleting,true);
 check(Object.keys(tombstone.data()).sort(),['deleting','updatedAt']);
 check((await alice.adapter.readAll(aliceUID)).length,3);
 await rejected(aliceSecond.adapter.putBest(aliceUID,record(1)),/deletion has started/);
 await denied(firestoreSDK.setDoc(progressRef(aliceSecond,aliceUID,record(2,'new-revision')),{...record(2,'new-revision'),updatedAt:firestoreSDK.serverTimestamp()}));
 await denied(firestoreSDK.deleteDoc(controlRef(aliceSecond,aliceUID)));
 const deleted=await alice.adapter.deleteAccount(password);await nextTurn();
 check(deleted,{uid:aliceUID,deletedAccount:true});check(alice.adapter.currentUser(),null);
 // The second device still has its old session. It cannot recreate deleted data.
 check(aliceSecond.adapter.currentUser().uid,aliceUID);
 check((await firestoreSDK.getDocsFromServer(progressCollection(aliceSecond,aliceUID))).size,0);
 check((await firestoreSDK.getDocFromServer(controlRef(aliceSecond,aliceUID))).data().deleting,true);
 await denied(firestoreSDK.setDoc(progressRef(aliceSecond,aliceUID),{...record(1),updatedAt:firestoreSDK.serverTimestamp()}));
 await rejected(alice.adapter.signIn(aliceEmail,password),/auth\/(invalid-credential|user-not-found)/);
 // Deleting the second account also purges its imported score; all users were emulator-only.
 check(await bob.adapter.deleteAccount(password),{uid:bobUID,deletedAccount:true});await nextTurn();check(bob.adapter.currentUser(),null);
 check(concurrentErrors,[]);
 console.log(`PASS Firebase adapter/Auth/Firestore emulators: ${assertions} assertions; reauthentication, interrupted deletion retry, purge, permanent tombstone and stale-session denial.`);
}finally{
 await Promise.allSettled(clients.map(async client=>{if(client.db)await firestoreSDK.terminate(client.db);if(client.app)await appSDK.deleteApp(client.app)}));
 clearTimeout(watchdog);
}

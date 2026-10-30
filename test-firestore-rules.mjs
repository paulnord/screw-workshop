import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {initializeTestEnvironment, assertFails, assertSucceeds} from '@firebase/rules-unit-testing';
import {doc, collection, setDoc, updateDoc, getDoc, getDocs, deleteDoc, serverTimestamp, Timestamp, runTransaction, writeBatch, setLogLevel} from 'firebase/firestore';

// Fail closed: this test must never target a production project or network database.
if (!/^127\.0\.0\.1:\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST || '')) throw Error('Run npm run test:rules with the local demo emulator');
// Permission-denied requests below are intentional error-detection tests.
setLogLevel('silent');
console.log('ERROR-DETECTION TESTS: deliberately rejecting unauthorized and malformed progress writes.');
const env = await initializeTestEnvironment({projectId:'demo-screw-workshop',firestore:{rules:readFileSync(new URL('./firebase/firestore.rules',import.meta.url),'utf8')}});
const alice=env.authenticatedContext('alice').firestore(), bob=env.authenticatedContext('bob').firestore(), guest=env.unauthenticatedContext().firestore();
const key=(p='first-turn',r='sha256-abc',k='campaign')=>`${k}__${p}__${r}`;
const ref=(db,p='first-turn',r='sha256-abc',k='campaign',uid='alice')=>doc(db,'users',uid,'progress',key(p,r,k));
const record=(overrides={})=>({schema:1,kind:'campaign',puzzleId:'first-turn',revision:'sha256-abc',bestMoves:8,completed:true,updatedAt:serverTimestamp(),...overrides});
let checks=0;const ok=async p=>{await assertSucceeds(p);checks++},no=async p=>{await assertFails(p);checks++};
try {
 await env.clearFirestore();
 await no(setDoc(ref(guest),record()));
 await no(setDoc(ref(bob),record()));
 await ok(setDoc(ref(alice),record()));
 await ok(getDoc(ref(alice)));
 await no(getDoc(ref(bob)));await no(getDoc(ref(guest)));
 await ok(getDocs(collection(alice,'users','alice','progress')));
 await no(getDocs(collection(bob,'users','alice','progress')));
 await no(getDocs(collection(guest,'users','alice','progress')));
 await no(getDocs(collection(alice,'users')));
 await no(setDoc(doc(alice,'public','anything'),{open:true}));
 await no(setDoc(doc(alice,'users','alice'),{name:'Alice'}));
 await no(setDoc(doc(alice,'users','alice','progress','wrong-key'),record()));
 const invalid=[{schema:2},{kind:'other'},{puzzleId:'bad/id'},{puzzleId:''},{puzzleId:'a'.repeat(97)},{revision:'bad/rev'},{revision:'x'.repeat(97)},{bestMoves:0},{bestMoves:-1},{bestMoves:100001},{bestMoves:1.5},{bestMoves:'2'},{completed:false},{completed:1},{updatedAt:Timestamp.fromMillis(0)},{extra:'forbidden'}];
 for(const value of invalid) await no(setDoc(ref(alice),record(value)));
 for(const field of ['schema','kind','puzzleId','revision','bestMoves','completed','updatedAt']) {const r=record();delete r[field];await no(setDoc(ref(alice),r));}
 await no(updateDoc(ref(alice),{bestMoves:9,updatedAt:serverTimestamp()}));
 await no(updateDoc(ref(alice),{revision:'sha256-new',updatedAt:serverTimestamp()}));
 await no(updateDoc(ref(bob),{bestMoves:1,updatedAt:serverTimestamp()}));
 await ok(runTransaction(alice,async tx=>{const r=ref(alice),snap=await tx.get(r);tx.set(r,record({bestMoves:Math.min(snap.data().bestMoves,5)}));}));
 assert.equal((await getDoc(ref(alice))).data().bestMoves,5);
 await ok(updateDoc(ref(alice),{bestMoves:5,updatedAt:serverTimestamp()}));
 // Concurrent devices retry transactions rather than overwrite a better result.
 const aliceSecond=env.authenticatedContext('alice').firestore();
 const concurrentWrite=async(db,moves)=>{for(let attempt=0;attempt<3;attempt++){try{return await runTransaction(db,async tx=>{const r=ref(db),snap=await tx.get(r);tx.set(r,record({bestMoves:Math.min(snap.data().bestMoves,moves)}));});}catch(e){if(e.code!=='permission-denied'||attempt===2)throw e;const deletion=await getDoc(doc(db,'users','alice','control','account'));if(deletion.exists())throw e;}}};
 await ok(Promise.all([concurrentWrite(alice,4),concurrentWrite(aliceSecond,3)]));
 assert.equal((await getDoc(ref(alice))).data().bestMoves,3);
 // Different puzzle revisions do not overwrite each other or compare unlike scores.
 await ok(setDoc(ref(alice,'first-turn','sha256-new'),record({revision:'sha256-new',bestMoves:20})));
 await ok(setDoc(ref(alice,'daily-2026-10-29-v1','a'.repeat(64),'daily'),record({kind:'daily',puzzleId:'daily-2026-10-29-v1',revision:'a'.repeat(64),bestMoves:12})));
 await no(deleteDoc(ref(bob)));await no(deleteDoc(ref(guest)));
 const exported=await getDocs(collection(alice,'users','alice','progress'));assert.equal(exported.size,3);
 const batch=writeBatch(alice);exported.forEach(d=>batch.delete(d.ref));await ok(batch.commit());
 assert.equal((await getDocs(collection(alice,'users','alice','progress'))).size,0);
 // A mixed-owner batch must fail atomically.
 const mixed=writeBatch(alice);mixed.set(ref(alice),record());mixed.set(ref(alice,'first-turn','sha256-abc','campaign','bob'),record());await no(mixed.commit());
 assert.equal((await getDocs(collection(alice,'users','alice','progress'))).size,0);
 // Permanent deletion tombstone blocks stale sessions from recreating data.
 await ok(setDoc(ref(alice),record()));
 const tomb=(db,uid='alice')=>doc(db,'users',uid,'control','account');
 const deletion=()=>({deleting:true,updatedAt:serverTimestamp()});
 await no(setDoc(tomb(bob),deletion()));await no(setDoc(tomb(guest),deletion()));
 await no(setDoc(tomb(alice),{deleting:false,updatedAt:serverTimestamp()}));
 await no(setDoc(tomb(alice),{...deletion(),extra:true}));
 const deletingBatch=writeBatch(alice);deletingBatch.set(tomb(alice),deletion());deletingBatch.set(ref(alice,'new-puzzle'),record({puzzleId:'new-puzzle'}));await no(deletingBatch.commit());
 await ok(setDoc(tomb(alice),deletion()));
 await ok(getDoc(tomb(alice)));await no(getDoc(tomb(bob)));await no(getDoc(tomb(guest)));
 await ok(setDoc(tomb(alice),deletion()));await no(deleteDoc(tomb(alice)));
 await no(updateDoc(tomb(alice),{deleting:false,updatedAt:serverTimestamp()}));
 await no(updateDoc(ref(aliceSecond),{bestMoves:1,updatedAt:serverTimestamp()}));
 await no(setDoc(ref(aliceSecond,'new-puzzle'),record({puzzleId:'new-puzzle'})));
 await ok(getDocs(collection(alice,'users','alice','progress')));
 await ok(deleteDoc(ref(alice)));await no(setDoc(ref(aliceSecond),record()));
 console.log(`PASS Firestore emulator: ${checks} authorization/schema assertions; UID-only access, strict fields, monotonic revision scores, transactions, export and owner deletion.`);
} finally {await env.cleanup();}

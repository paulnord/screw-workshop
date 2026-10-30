import assert from 'node:assert/strict';
import {normalizeRecord,recordKey,mergeRecords,createSyncController} from './dist/progress-sync.mjs';
const rec=(moves=5,revision='rev1',puzzleId='first-turn')=>({schema:1,kind:'campaign',puzzleId,revision,bestMoves:moves,completed:true});
const storage=()=>{const m=new Map([['screw-workshop-physics-v4','guest-original']]);return {m,getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}};
const basic=()=>({readAll:async()=>[],putBest:async(_,r)=>r,deleteAll:async()=>{}});
assert.equal(normalizeRecord({...rec(),puzzleId:undefined}),null);
for(const r of [null,{}, {...rec(),bestMoves:NaN},{...rec(),bestMoves:0},{...rec(),bestMoves:100001},{...rec(),kind:'evil'},{...rec(),revision:'a/b'},{...rec(),completed:false}])assert.equal(normalizeRecord(r),null);
assert.equal(recordKey(rec()),'campaign__first-turn__rev1');
assert.deepEqual(mergeRecords([rec(8)],[rec(4),rec(7,'rev2')]).map(r=>r.bestMoves),[4,7]);
const s=storage(), c=createSyncController({storage:s,adapter:basic()});
assert.throws(()=>c.enqueue(rec()),/Sign in/);c.setUser('alice');c.enqueue(rec());assert.equal(c.state().pending.length,1);
assert.equal(s.m.get('screw-workshop-physics-v4'),'guest-original');c.setUser('bob');assert.equal(c.state().records.length,0);c.enqueue(rec(7));c.setUser('alice');assert.equal(c.state().records[0].bestMoves,5);
assert.throws(()=>c.importGuest([rec(3)]),/confirmation/);c.importGuest([rec(3)],{confirmed:true});assert.equal(c.state().pending[0].bestMoves,3);await c.flush();assert.equal(c.state().pending.length,0);
const exported=c.exportData();exported.records[0].bestMoves=99;assert.equal(c.state().records[0].bestMoves,3);
c.enqueue(rec(10));assert.equal(c.state().pending.length,0);c.enqueue(rec(2,'rev2'));assert.equal(c.state().records.length,2);
let online=false;const a=basic();a.putBest=async(_,r)=>{if(!online)throw Error('offline');return r};const d=createSyncController({storage:s,adapter:a});d.setUser('alice');await d.flush();assert.equal(d.state().pending.length,1);assert.match(d.state().error,/Not yet synced/);online=true;await d.flush();assert.equal(d.state().pending.length,0);
// A synchronous adapter throw must not leave a permanently resolved flush lock.
let fail=true;const z=basic();z.putBest=(_,r)=>{if(fail)throw Error();return Promise.resolve(r)};const zc=createSyncController({storage:storage(),adapter:z});zc.setUser('a');zc.enqueue(rec());await zc.flush();fail=false;await zc.flush();assert.equal(zc.state().pending.length,0);
// An old account load cannot replace the new account's records.
const read=deferred(),ra=basic();ra.readAll=()=>read.promise;const rc=createSyncController({storage:storage(),adapter:ra});rc.setUser('alice');const lp=rc.load();rc.setUser('bob');rc.enqueue(rec(9));read.resolve([rec(1)]);assert.deepEqual(await lp,{stale:true});assert.equal(rc.state().records[0].bestMoves,9);
// An in-flight old account write cannot clear the new account's queue.
const write=deferred(),wa=basic(),seen=[];wa.putBest=(uid,r)=>{seen.push(uid);return write.promise};const wc=createSyncController({storage:storage(),adapter:wa});wc.setUser('alice');wc.enqueue(rec());const wp=wc.flush();await Promise.resolve();wc.setUser('bob');wc.enqueue(rec(7));write.resolve(rec());await wp;assert.equal(wc.state().pending[0].bestMoves,7);assert.deepEqual(seen,['alice']);
// A better move earned during a transaction stays pending and is sent next.
const first=deferred(),ba=basic();let calls=0;ba.putBest=async(_,r)=>++calls===1?first.promise:r;const bc=createSyncController({storage:storage(),adapter:ba});bc.setUser('alice');bc.enqueue(rec(8));const bp=bc.flush();await Promise.resolve();bc.enqueue(rec(4));first.resolve(rec(8));await bp;assert.equal(calls,2);assert.equal(bc.state().records[0].bestMoves,4);assert.equal(bc.state().pending.length,0);
// Deletion waits for already-started writes and blocks new writes until done.
const last=deferred(),da=basic(),order=[];da.putBest=async(_,r)=>{await last.promise;order.push('write');return r};da.deleteAll=async()=>order.push('delete');const dc=createSyncController({storage:storage(),adapter:da});dc.setUser('alice');dc.enqueue(rec());const fp=dc.flush();await Promise.resolve();await assert.rejects(dc.deleteAll({confirmed:false}),/confirmation/);const dp=dc.deleteAll({confirmed:true,password:'not-retained'});assert.throws(()=>dc.enqueue(rec(1)),/deletion/);last.resolve();await fp;await dp;assert.deepEqual(order,['write','delete']);assert.equal(dc.state().records.length,0);assert.equal(dc.state().pending.length,0);

// Failure retains queue and records; failed local persistence is reported.
const bad=basic();bad.deleteAll=async()=>{throw Error('reauth needed')};const failc=createSyncController({storage:storage(),adapter:bad});failc.setUser('a');failc.enqueue(rec());await failc.deleteAll({confirmed:true});assert.equal(failc.state().pending.length,1);assert.match(failc.state().error,/deletion/);
const quota={getItem:()=>null,setItem:()=>{throw Error()},removeItem:()=>{throw Error()}};const qc=createSyncController({storage:quota,adapter:basic()});qc.setUser('a');qc.enqueue(rec());assert.equal(qc.state().persisted,false);assert.equal(qc.state().records.length,1);
const corrupt=storage();corrupt.setItem('screw-workshop-sync-v1:a','{broken');const cc=createSyncController({storage:corrupt,adapter:basic()});cc.setUser('a');assert.equal(cc.state().records.length,0);assert.match(cc.state().error,/cache/);
// Read replaces deleted remote entries, retaining only genuinely pending local work.
const lc=createSyncController({storage:storage(),adapter:basic()});lc.setUser('a');lc.enqueue(rec());await lc.flush();await lc.load();assert.equal(lc.state().records.length,0);lc.enqueue(rec(2));await lc.load();assert.equal(lc.state().records.length,1);
// A stale read cannot erase a score earned and flushed while that read was pending.
const delayed=deferred(),raceAdapter=basic();raceAdapter.readAll=()=>delayed.promise;const race=createSyncController({storage:storage(),adapter:raceAdapter});race.setUser('alice');const oldLoad=race.load();race.enqueue(rec(2));await race.flush();delayed.resolve([]);await oldLoad;assert.equal(race.state().records[0].bestMoves,2);
console.log('PASS optional sync core: isolated accounts, explicit merge, revision-specific minima, offline retry, auth races, transaction races, deletion ordering/failure, bounded invalid data and guest preservation.');

import assert from 'node:assert/strict';
import {createSyncController,recordKey,mergeRecords} from './dist/progress-sync.mjs';
const daily=(bestMoves=12,revision='a'.repeat(64),puzzleId='daily-2026-10-30-v1')=>({schema:1,kind:'daily',puzzleId,revision,bestMoves,completed:true});
const storage=()=>{const m=new Map([['guest','untouched']]);return {m,getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve}};
const adapter=()=>({readAll:async()=>[],putBest:async(_,r)=>r,deleteAll:async()=>{}});
const s=storage(),a=adapter(),calls=[];
a.putBest=async(uid,r,options)=>{calls.push({uid,r,options});return r};
const c=createSyncController({storage:s,adapter:a});c.setUser('alice');
c.enqueue(daily(15));c.enqueue(daily(11));c.enqueue(daily(10,'b'.repeat(64)));c.enqueue(daily(6,'c'.repeat(64),'daily-2026-10-30-v2'));
assert.deepEqual(c.state().records,[daily(15)]);assert.equal(c.state().pending.length,1);
await c.flush();assert.equal(calls.length,1);assert.equal(calls[0].options.preserveHistoricalBest,false);
await c.load();assert.deepEqual(c.state().records,[daily(15)],'empty cloud snapshot must not reopen daily');
c.setUser('bob');assert.equal(c.state().records.length,0);c.setUser(null);assert.equal(c.state().records.length,0);c.setUser('alice');assert.deepEqual(c.state().records,[daily(15)]);
assert.equal(s.m.get('guest'),'untouched');
// A late snapshot cannot erase a newly finished daily even after it was flushed.
const delayed=deferred();a.readAll=()=>delayed.promise;const loading=c.load();
c.enqueue(daily(8,'c'.repeat(64),'daily-2026-10-29-v1'));await c.flush();delayed.resolve([]);await loading;assert.equal(c.state().records.length,2);
// First server completion wins over a competing local attempt, including when
// the server took more moves. The pending queue empties, rather than retrying.
const r=adapter();r.putBest=async()=>daily(16);const race=createSyncController({storage:storage(),adapter:r});race.setUser('a');race.enqueue(daily(10));await race.flush();assert.deepEqual(race.state().records,[daily(16)]);assert.equal(race.state().pending.length,0);assert.equal(race.state().error,null);
// Learning another device's first result via load has the same resolution.
const server=adapter();server.readAll=async()=>[daily(17)];const remote=createSyncController({storage:storage(),adapter:server});remote.setUser('a');remote.enqueue(daily(9));await remote.load();assert.deepEqual(remote.state().records,[daily(17)]);assert.equal(remote.state().pending.length,0);
// Historical guest imports remain explicit, keep minima, survive offline reload
// and carry import intent separately from the immutable Firestore record shape.
assert.throws(()=>c.importGuest([daily(7)]),/confirmation/);
c.importGuest([daily(7),daily(8)],{confirmed:true});assert.equal(c.state().records.find(r=>r.puzzleId===daily().puzzleId).bestMoves,7);
const resumed=createSyncController({storage:s,adapter:a});resumed.setUser('alice');await resumed.flush();assert.equal(calls.at(-1).options.preserveHistoricalBest,true);assert.equal(resumed.state().pending.length,0);
assert.deepEqual(Object.keys(calls.at(-1).r).sort(),['bestMoves','completed','kind','puzzleId','revision','schema']);
assert.deepEqual(mergeRecords([daily(10)],[daily(7),daily(8)]),[daily(7)]);
// Upgrade an old pending daily best without silently discarding it.
const legacy=storage();legacy.setItem('screw-workshop-sync-v1:a',JSON.stringify({schema:1,records:[daily(9)],pending:[daily(9)]}));
const upgraded=createSyncController({storage:legacy,adapter:a});upgraded.setUser('a');await upgraded.flush();assert.equal(calls.at(-1).options.preserveHistoricalBest,true);
// An import arriving during a normal finish transaction is still sent after it.
const first=deferred(),during=adapter(),seen=[];during.putBest=async(_,r,opt)=>{seen.push({r,opt});return seen.length===1?first.promise:r};
const concurrent=createSyncController({storage:storage(),adapter:during});concurrent.setUser('a');concurrent.enqueue(daily(12));const flushing=concurrent.flush();await Promise.resolve();concurrent.importGuest([daily(6)],{confirmed:true});first.resolve(daily(15));await flushing;
assert.equal(seen.length,2);assert.equal(seen[1].opt.preserveHistoricalBest,true);assert.deepEqual(concurrent.state().records,[daily(6)]);assert.equal(concurrent.state().pending.length,0);
// An explicitly imported historical score equal to an in-flight local result
// still upgrades its provenance, so a prior worse server result cannot erase it.
const equalFirst=deferred(),equalAdapter=adapter(),equalSeen=[];equalAdapter.putBest=async(_,r,opt)=>{equalSeen.push({r,opt});return equalSeen.length===1?equalFirst.promise:r};
const equal=createSyncController({storage:storage(),adapter:equalAdapter});equal.setUser('a');equal.enqueue(daily(12));const equalFlush=equal.flush();await Promise.resolve();equal.importGuest([daily(12)],{confirmed:true});equalFirst.resolve(daily(15));await equalFlush;
assert.equal(equalSeen.length,2);assert.equal(equalSeen[1].opt.preserveHistoricalBest,true);assert.deepEqual(equal.state().records,[daily(12)]);
// A delayed old UID acknowledgement cannot leak into a newly selected account.
const slow=deferred(),swapAdapter=adapter();swapAdapter.putBest=()=>slow.promise;const swap=createSyncController({storage:storage(),adapter:swapAdapter});swap.setUser('alice');swap.enqueue(daily(9));const old=swap.flush();await Promise.resolve();swap.setUser('bob');swap.enqueue(daily(13));slow.resolve(daily(15));await old;assert.deepEqual(swap.state().records,[daily(13)]);assert.equal(swap.state().pending.length,1);
console.log('PASS daily sync locks: first completion, duplicate/revision rejection, UID isolation, stale-load retention, first server result reconciliation, explicit historical imports, offline migration/reload and racing import.');

import assert from 'node:assert/strict';
import Matter from './dist/vendor/matter-0.20.0.min.js';
globalThis.Matter=Matter;
const E=await import('./dist/engine.mjs');
const cases=[
 ['v7-two-sails',[[0,31,30],[3,32,30]]],
 ['v5-locksmith',[[3,32,120],[2,31,120],[1,38,120]]],
 ['v7-side-door',[[0,32,30],[5,31,30],[4,179,30],[3,343,30],[2,342,30],[1,341,30]]]
];
for(const[id,actions]of cases){
 const s=E.createWorld(E.levels.find(l=>l.id===id));E.settle(s);
 for(const[b,h,wait]of actions){assert.ok(E.move(s,b,h),id+' legal reproduction');E.step(s,wait)}
 let speed=0,depth=0,hinge=0;
 for(let f=0;f<7200;f++){
  E.step(s);
  if(s.contactDiagnostics){assert.ok(s.contactDiagnostics.maxCorrection<=4+1e-9,'Per-frame material correction budget');assert.ok(s.contactDiagnostics.maxImpulseEnergyGain<1e-8,'Normal impulses never add kinetic energy');}
  for(let b=0;b<s.positions.length;b++)if(!(s.removed&(1<<b)))hinge=Math.max(hinge,E.hingeError(s,b));
  for(const b of s.plates)assert.ok(Number.isFinite(b.position.x+b.position.y+b.angle+b.velocity.x+b.velocity.y));
  if(f>=6960){for(const b of s.plates)if(!b.plugin.cleared&&!b.isStatic)speed=Math.max(speed,b.speed+Math.abs(b.angularVelocity)*b.plugin.settleRadius);for(const p of s.engine.pairs.list)if(p.isActive)depth=Math.max(depth,p.collision.depth)}
 }
 assert.ok(s.settled,id+' stops numerical jiggling');assert.ok(speed<.35,id+' late material speed '+speed);assert.ok(depth<.5,id+' sustained overlap '+depth);assert.ok(hinge<.02,id+' pivots remain fixed');
 assert.equal(E.complete(s),false,id+' supported pieces are not falsely cleared');
 const saved=E.snapshot(s),a=E.createWorld(s.level,saved),b=E.createWorld(s.level,saved);assert.deepEqual(E.snapshot(a),saved);E.step(a,240);E.step(b,240);assert.deepEqual(E.snapshot(a),E.snapshot(b),'Recovery state survives Undo deterministically');
 console.log(id,{lateSpeed:speed,lateOverlap:depth,maxHingeError:hinge});
}
console.log('PASS: three alternate-order contact regressions over 60 seconds; fixed pivots, finite motion, legitimate blocking, recovery snapshots.');

// These four routes reproduce visible continuous motion using the app's exact
// stop-on-settled rule (the preceding cases additionally stress continuous stepping).
const uiCases=[['v7-two-sails',[[3,32,30],[0,31,30]]],['v5-locksmith',[[3,32,120],[2,31,120],[1,38,120]]],['v5-locksmith',[[0,32,5],[3,31,5],[1,190,5]]],['v7-side-door',[[2,32,30],[0,340,30],[1,31,30]]]];
for(const[id,actions]of uiCases){const s=E.createWorld(E.levels.find(l=>l.id===id));E.settle(s);let saved=null;for(const[b,h,w]of actions){assert.ok(E.move(s,b,h));for(let f=0;f<w&&!s.settled;f++){E.step(s);if(s.recoveryPlates.length&&!s.settled)saved=E.snapshot(s)}}for(let f=0;f<2400&&!s.settled;f++){E.step(s);if(s.recoveryPlates.length&&!s.settled)saved=E.snapshot(s)}assert.ok(s.settled,id+' faithful UI replay stops');assert.equal(E.complete(s),false,'Caught arrangements remain puzzles, not auto-completed');for(const c of s.constraints)assert.equal(c.damping,s.recoveryPlates.includes(c.bodyA.plugin.plate)?0:.2,'Unrelated hinges retain their behavior');if(saved){const a=E.createWorld(s.level,saved),b=E.createWorld(s.level,saved);assert.deepEqual(E.snapshot(a),saved);E.step(a,120);E.step(b,120);assert.deepEqual(E.snapshot(a),E.snapshot(b),'Mid-motion recovery Undo remains deterministic')}}
console.log('PASS: four faithful UI reproductions settle; unrelated hinges and mid-motion Undo preserved.');
// Recovery is not a freeze: removing the remaining supports releases both bodies.
{
 const s=E.createWorld(E.levels.find(l=>l.id==='v7-two-sails'));E.settle(s);
 for(const[b,h,w]of [[3,32,30],[0,31,30]]){assert.ok(E.move(s,b,h));for(let f=0;f<w&&!s.settled;f++)E.step(s)}E.settle(s,2400);
 assert.ok(s.recoveryPlates.length);assert.equal(E.complete(s),false);
 const engine=s.engine,body=s.plates[0],v={...body.velocity},w=body.angularVelocity;
 assert.ok(E.move(s,1,102));assert.equal(s.engine,engine);assert.equal(s.plates[0],body);assert.deepEqual(body.velocity,v);assert.equal(body.angularVelocity,w);
 E.settle(s,2400);assert.ok(E.move(s,2,103));E.settle(s,2400);assert.ok(E.complete(s),'Recovered pieces still fall off the board when supports are removed');
}
console.log('PASS: post-recovery live release preserves world/momentum and physically completes.');
// Contact correction must not leave a displaced body frozen in Matter's sleep state.
{
 const s=E.createWorld({plates:[[6,8],[16,18]]});E.move(s,0,25);E.move(s,1,26);E.step(s,600);
 const b=s.plates[0];s.recoveryPlates=[0];Matter.Body.translate(b,{x:0,y:2});Matter.Sleeping.set(b,true);const y=b.position.y;
 E.repairHingeContacts(s);assert.ok(b.position.y<y);assert.equal(b.isSleeping,false);assert.ok(s.contactDiagnostics.wokenBodies>0);
 Matter.Body.translate(b,{x:0,y:-100});Matter.Sleeping.set(b,true);E.repairHingeContacts(s);assert.equal(b.isSleeping,true,'No blanket wake for bodies receiving no correction');
}
console.log('PASS: corrected sleepers wake; untouched sleepers remain asleep.');

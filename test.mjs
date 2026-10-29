import assert from 'node:assert/strict';
import fs from 'node:fs';
import Matter from './dist/vendor/matter-0.20.0.min.js';
globalThis.Matter=Matter;
const E=await import('./dist/engine.mjs');
const M=Matter;
const {normalizeBests,recordBest}=await import('./dist/progress.mjs');
assert.deepEqual(normalizeBests({good:4,bad:-1,fraction:2.5,text:'3'}),{good:4});
let scores=recordBest({},'first-opening',4);assert.equal(scores['first-opening'],4);scores=recordBest(scores,'first-opening',6);assert.equal(scores['first-opening'],4);scores=recordBest(scores,'first-opening',2);assert.equal(scores['first-opening'],2);assert.deepEqual(recordBest(scores,'first-opening',0),scores);

const fixtures=[{name:"Hinge fixture",plates:[[6,8]]},{name:"Shelf fixture",plates:[[6,8],[16,18]]},{name:"Ramp fixture",plates:[[1,3],[10,13],[21,23]],order:[2,0,1,4,5,3]}];
let sim=E.createWorld(fixtures[0]);const initial=E.snapshot(sim);
assert.equal(E.move(sim,0,8),null,'Occupied destination rejected');
sim=E.move(sim,0,25);assert.ok(sim);assert.equal(E.destinations(sim).includes(6),true,'Aligned material cutout has shaft clearance');
let maxHinge=0;for(let i=0;i<600;i++){E.step(sim);maxHinge=Math.max(maxHinge,E.hingeError(sim,1));}
assert.ok(maxHinge<.01,'Remaining screw stays a fixed pivot');assert.ok(Math.abs(sim.plates[0].angle)>.5,'Single pin allows real rotation');
const holeCenters=E.localHoles(sim.level,0).map(v=>E.worldPoint(sim.plates[0],v));assert.ok(Math.abs(Math.hypot(holeCenters[0].x-holeCenters[1].x,holeCenters[0].y-holeCenters[1].y)-140)<1e-8);
for(const q of holeCenters)assert.equal(M.Query.point([sim.plates[0]],q).length,0,'Compound-body holes contain no collision material');
assert.equal(E.materialAt(sim,holeCenters[0]),false,'Moving opening remains open');assert.ok(E.destinations(sim).includes(6),'Rotated plate exposes original wood hole');
const restored=E.createWorld(fixtures[0],initial);assert.deepEqual(E.snapshot(restored),initial,'Undo restores full geometry');assert.deepEqual(E.snapshot(E.createWorld(fixtures[0])),initial,'Restart is deterministic');
let moving=E.move(restored,0,25);E.step(moving,40);const saved=E.snapshot(moving),r1=E.createWorld(moving.level,saved),r2=E.createWorld(moving.level,saved);E.step(r1,500);E.step(r2,500);assert.deepEqual(E.snapshot(r1),E.snapshot(r2),'Snapshot rebuild + same time gives identical trajectories');
// A fully unscrewed plate rests on another, and does NOT count as cleared.
sim=E.createWorld(fixtures[1]);sim=E.move(sim,0,25);sim=E.move(sim,1,26);E.step(sim,600);assert.equal(sim.plates[0].plugin.cleared,false);assert.ok(sim.plates[0].position.y<300,'Lower plate catches upper plate');assert.equal(E.complete(sim),false);
sim=E.move(sim,2,27);sim=E.move(sim,3,28);E.step(sim,1200);assert.ok(E.complete(sim),'Removing support releases caught plate');
// Screw shafts act as actual solid collision obstacles.
sim=E.createWorld(fixtures[0]);sim=E.move(sim,0,25);sim=E.move(sim,1,26);const blockers=[M.Bodies.circle(125,300,7.5,{isStatic:true}),M.Bodies.circle(225,300,7.5,{isStatic:true})];M.Composite.add(sim.engine.world,blockers);E.step(sim,600);assert.equal(E.complete(sim),false);assert.ok(sim.plates[0].position.y<300,'Screw-sized obstacles catch plate');blockers.forEach(b=>M.Composite.remove(sim.engine.world,b));M.Sleeping.set(sim.plates[0],false);E.step(sim,1200);assert.ok(E.complete(sim),'Moving blocking screws frees plate');
// Live interaction: releasing the next screw must not rebuild the world or erase momentum.
let live=E.createWorld(fixtures[0]);E.settle(live);E.move(live,0,25);E.step(live,45);assert.equal(live.settled,false);
const engineIdentity=live.engine,bodyIdentity=live.plates[0],motionBefore=E.snapshot(live),velocityBefore={...bodyIdentity.velocity},angularBefore=bodyIdentity.angularVelocity;
assert.ok(Math.abs(angularBefore)>.001,'Plate is visibly swinging before the next move');assert.equal(E.move(live,1,26),live);assert.equal(live.engine,engineIdentity);assert.equal(live.plates[0],bodyIdentity);assert.deepEqual(bodyIdentity.velocity,velocityBefore);assert.equal(bodyIdentity.angularVelocity,angularBefore,'Release preserves existing angular momentum');
const undone=E.createWorld(live.level,motionBefore);assert.equal(undone.settled,false,'Mid-motion undo resumes motion');assert.deepEqual(E.snapshot(undone),motionBefore);const beforeResume={...undone.plates[0].position};E.step(undone,30);assert.notDeepEqual(undone.plates[0].position,beforeResume);
E.step(live,900);assert.ok(E.complete(live));assert.equal(E.move(live,0,6),null,'Completion rejects late queued moves');
// Revalidate a once-clear target after the geometry changes, without consuming a move.
let stale=E.createWorld(fixtures[0]);E.move(stale,0,25);E.step(stale,600);assert.ok(E.destinations(stale).includes(6));M.Body.setAngle(stale.plates[0],0);M.Body.setPosition(stale.plates[0],{x:105,y:180});const oldMoves=stale.moves;assert.equal(E.move(stale,1,6),null,'Newly covered destination is rejected');assert.equal(stale.moves,oldMoves);
let hidden=E.createWorld(fixtures[1]);M.Body.setPosition(hidden.plates[1],{x:105,y:180});assert.equal(E.accessible(hidden,0),false);assert.equal(E.move(hidden,0,25),null,'A screw occluded since selection cannot be moved');
// Rapid successive legal releases, including while an already loose plate is sliding/falling.
let rapid=E.createWorld(fixtures[1]);for(const [b,h] of [[0,25],[1,26],[2,27],[3,28]]){assert.ok(E.move(rapid,b,h));E.step(rapid,5)}E.step(rapid,1800);assert.ok(E.complete(rapid));
let totalMoves=0,maxDepth=0,rampContact=false,rampSlide=0;
for(const level of [...E.levels,fixtures[2]]){sim=E.createWorld(level);E.settle(sim);let count=0;
 if(level.solution){assert.equal(new Set(sim.positions).size,sim.positions.length,'No overlapping initial screws');for(let a=0;a<sim.plates.length;a++)for(let b=a+1;b<sim.plates.length;b++)assert.equal(M.Query.collides(sim.plates[a],[sim.plates[b]]).filter(c=>c.depth>.01).length,0,level.name+' initial materials do not overlap');const hintBefore=E.snapshot(sim);E.hint(sim);assert.deepEqual(E.snapshot(sim),hintBefore,'Hints never charge moves or alter physics');assert.equal(E.destinations(sim).length,level.spares.length,'Visible parking targets match authored count');for(const h of level.hidden)assert.ok(E.shaftBlocked(sim,E.cells[h]),'Hidden wood hole starts covered');for(const bad of level.deadEnds||[]){const trapped=E.createWorld(level);E.move(trapped,bad,25);E.settle(trapped,2400);assert.equal(E.destinations(trapped).length,0,level.name+' has a real wrong-first-move trap');}}
const startX=sim.plates[0].position.x;
 while(!E.complete(sim)&&count<30){const h=E.hint(sim);assert.notEqual(h.b,undefined,`${level.name}: authored solution has a move`);sim=E.move(sim,h.b,h.h);assert.ok(sim,`${level.name}: legal move`);
 for(let f=0;f<2400&&!sim.settled;f++){E.step(sim);for(const pair of sim.engine.pairs.list)if(pair.isActive){maxDepth=Math.max(maxDepth,pair.collision.depth);if(level.name==='Ramp fixture'&&pair.bodyA.parent.label.startsWith('plate-')&&pair.bodyB.parent.label.startsWith('plate-'))rampContact=true;}
 for(let b=0;b<sim.positions.length;b++)if(!(sim.removed&(1<<b)))assert.ok(E.hingeError(sim,b)<.02,'Hinge drift bounded through collisions');
 if(level.name==='Ramp fixture')rampSlide=Math.max(rampSlide,Math.abs(sim.plates[0].position.x-startX));
 }assert.ok(sim.settled,`${level.name}: settles without freezing a moving world`);count++;
 }assert.ok(E.complete(sim),`${level.name}: actual off-board completion`);if(level.solution)totalMoves+=count;
}
assert.ok(rampContact&&rampSlide>15,'Authored ramp level has real contact-driven lateral sliding');assert.ok(maxDepth<2.5,'Bounded collision penetration; no tunneling in solution replays');
// Exact shaft clearance, not decorative rim or touch target: edge, corner and cutout tangencies.
const clearance=E.createWorld(fixtures[0]),cb=clearance.plates[0],L=cb.plugin.length,R=E.SHAFT_CLEARANCE;
for(const angle of [0,.33,Math.PI/4,Math.PI/2,2.2]){M.Body.setAngle(cb,angle);for(const[x,y,blocked]of [[0,17+R-.01,true],[0,17+R+.01,false],[L/2+18+R-.01,0,true],[L/2+18+R+.01,0,false],[L/2+18+(R-.01)/Math.sqrt(2),17+(R-.01)/Math.sqrt(2),true],[L/2+18+(R+.01)/Math.sqrt(2),17+(R+.01)/Math.sqrt(2),false],[-L/2,0,false],[-L/2+10-R-.01,0,false],[-L/2+10-R+.01,0,true]])assert.equal(E.shaftBlocked(clearance,E.worldPoint(cb,{x,y})),blocked)}
const app=fs.readFileSync(new URL('./dist/app.mjs',import.meta.url),'utf8');assert.match(app,/class:'material-hole'/);assert.doesNotMatch(app,/if\(busy\)return/);assert.doesNotMatch(app,/disabled=busy/);assert.match(app,/Math\.min\(50,now-last\)/);
console.log(`PASS: ${E.levels.length} physical level solutions, ${totalMoves} moves; real hinges (max initial drift ${maxHinge.toFixed(7)}px), compound holes, moving occlusion, plate/screw blockers, actual sliding, completion, deterministic snapshots/undo/restart. Max replay contact overlap ${maxDepth.toFixed(2)}px; ramp lateral travel ${rampSlide.toFixed(1)}px.`);

await import('./test-shapes.mjs');

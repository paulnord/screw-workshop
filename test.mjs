import assert from 'node:assert/strict';
import fs from 'node:fs';
import Matter from './dist/vendor/matter-0.20.0.min.js';
globalThis.Matter=Matter;
const E=await import('./dist/engine.mjs');
const M=Matter;
let sim=E.createWorld(E.levels[0]);const initial=E.snapshot(sim);
assert.equal(E.move(sim,0,8),null,'Occupied destination rejected');
sim=E.move(sim,0,25);assert.ok(sim);assert.equal(E.destinations(sim).includes(6),false,'A material opening is not a parking target');
let maxHinge=0;for(let i=0;i<600;i++){E.step(sim);maxHinge=Math.max(maxHinge,E.hingeError(sim,1));}
assert.ok(maxHinge<.01,'Remaining screw stays a fixed pivot');assert.ok(Math.abs(sim.plates[0].angle)>.5,'Single pin allows real rotation');
const holeCenters=E.localHoles(sim.level,0).map(v=>E.worldPoint(sim.plates[0],v));assert.ok(Math.abs(Math.hypot(holeCenters[0].x-holeCenters[1].x,holeCenters[0].y-holeCenters[1].y)-140)<1e-8);
for(const q of holeCenters)assert.equal(M.Query.point([sim.plates[0]],q).length,0,'Compound-body holes contain no collision material');
assert.equal(E.materialAt(sim,holeCenters[0]),false,'Moving opening remains open');assert.ok(E.destinations(sim).includes(6),'Rotated plate exposes original wood hole');
const restored=E.createWorld(E.levels[0],initial);assert.deepEqual(E.snapshot(restored),initial,'Undo restores full geometry');assert.deepEqual(E.snapshot(E.createWorld(E.levels[0])),initial,'Restart is deterministic');
let moving=E.move(restored,0,25);E.step(moving,40);const saved=E.snapshot(moving),r1=E.createWorld(moving.level,saved),r2=E.createWorld(moving.level,saved);E.step(r1,500);E.step(r2,500);assert.deepEqual(E.snapshot(r1),E.snapshot(r2),'Snapshot rebuild + same time gives identical trajectories');
// A fully unscrewed plate rests on another, and does NOT count as cleared.
sim=E.createWorld(E.levels[1]);sim=E.move(sim,0,25);sim=E.move(sim,1,26);E.step(sim,600);assert.equal(sim.plates[0].plugin.cleared,false);assert.ok(sim.plates[0].position.y<300,'Lower plate catches upper plate');assert.equal(E.complete(sim),false);
sim=E.move(sim,2,27);sim=E.move(sim,3,28);E.step(sim,1200);assert.ok(E.complete(sim),'Removing support releases caught plate');
// Screw shafts act as actual solid collision obstacles.
sim=E.createWorld(E.levels[0]);sim=E.move(sim,0,25);sim=E.move(sim,1,26);const blockers=[M.Bodies.circle(125,300,7.5,{isStatic:true}),M.Bodies.circle(225,300,7.5,{isStatic:true})];M.Composite.add(sim.engine.world,blockers);E.step(sim,600);assert.equal(E.complete(sim),false);assert.ok(sim.plates[0].position.y<300,'Screw-sized obstacles catch plate');blockers.forEach(b=>M.Composite.remove(sim.engine.world,b));M.Sleeping.set(sim.plates[0],false);E.step(sim,1200);assert.ok(E.complete(sim),'Moving blocking screws frees plate');
let totalMoves=0,maxDepth=0,rampContact=false,rampSlide=0;
for(const level of E.levels){sim=E.createWorld(level);E.settle(sim);let count=0;const startX=sim.plates[0].position.x;
 while(!E.complete(sim)&&count<30){const h=E.hint(sim);assert.notEqual(h.b,undefined,`${level.name}: authored solution has a move`);sim=E.move(sim,h.b,h.h);assert.ok(sim,`${level.name}: legal move`);
 for(let f=0;f<2400&&!sim.settled;f++){E.step(sim);for(const pair of sim.engine.pairs.list)if(pair.isActive){maxDepth=Math.max(maxDepth,pair.collision.depth);if(level.name==='A sliding start'&&pair.bodyA.parent.label.startsWith('plate-')&&pair.bodyB.parent.label.startsWith('plate-'))rampContact=true;}
 for(let b=0;b<sim.positions.length;b++)if(!(sim.removed&(1<<b)))assert.ok(E.hingeError(sim,b)<.02,'Hinge drift bounded through collisions');
 if(level.name==='A sliding start')rampSlide=Math.max(rampSlide,Math.abs(sim.plates[0].position.x-startX));
 }assert.ok(sim.settled,`${level.name}: settles without freezing a moving world`);count++;
 }assert.ok(E.complete(sim),`${level.name}: actual off-board completion`);totalMoves+=count;
}
assert.ok(rampContact&&rampSlide>15,'Authored ramp level has real contact-driven lateral sliding');assert.ok(maxDepth<2.5,'Bounded collision penetration; no tunneling in solution replays');
const app=fs.readFileSync(new URL('./dist/app.mjs',import.meta.url),'utf8');assert.match(app,/class:'material-hole'/);assert.match(app,/if\(busy\)return/);assert.match(app,/Math\.min\(50,now-last\)/);
console.log(`PASS: ${E.levels.length} physical level solutions, ${totalMoves} moves; real hinges (max initial drift ${maxHinge.toFixed(7)}px), compound holes, moving occlusion, plate/screw blockers, actual sliding, completion, deterministic snapshots/undo/restart. Max replay contact overlap ${maxDepth.toFixed(2)}px; ramp lateral travel ${rampSlide.toFixed(1)}px.`);

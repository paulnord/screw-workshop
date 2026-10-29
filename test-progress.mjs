import assert from 'node:assert/strict';
import Matter from './dist/vendor/matter-0.20.0.min.js';
globalThis.Matter=Matter;
const E=await import('./dist/engine.mjs');
import {normalizeProgress,serializeProgress,recordBest,starsFor,packProgress,isLevelUnlocked} from './dist/progress.mjs';
const {levels}=E;
for(const l of levels){const t=l.solution.length;assert.equal(starsFor(t,t),3);assert.equal(starsFor(Math.max(1,t-1),t),3);assert.equal(starsFor(t+1,t),2);assert.equal(starsFor(t+2,t),2);assert.equal(starsFor(t+3,t),1);assert.equal(starsFor(undefined,t),0)}
let p=normalizeProgress({},levels);assert.equal(p.index,0);assert.deepEqual(packProgress(levels,p.done).map(p=>p.unlocked),[true,false,false]);assert.equal(isLevelUnlocked(4,levels,p.done),false);assert.equal(isLevelUnlocked(12,levels,p.done),false);
// Three of four, regardless of score. Sequential gates cannot be bypassed.
p.done=new Set(levels.slice(4,7).map(l=>l.id));assert.equal(isLevelUnlocked(8,levels,p.done),false);
p.done=new Set(levels.slice(0,2).map(l=>l.id));assert.equal(isLevelUnlocked(4,levels,p.done),false);p.done.add(levels[3].id);assert.equal(isLevelUnlocked(4,levels,p.done),true);assert.equal(isLevelUnlocked(8,levels,p.done),false);
levels.slice(4,7).forEach(l=>p.done.add(l.id));assert.equal(isLevelUnlocked(8,levels,p.done),true);
// Old numeric resume migrates, subsequent saves use stable IDs.
let old=normalizeProgress({level:2,done:[levels[0].id,'stale',3],bests:{[levels[1].id]:50,stale:5}},levels);assert.equal(old.index,2);assert.equal(old.done.has(levels[1].id),true);assert.equal(old.done.size,2);assert.deepEqual(Object.keys(old.bests),[levels[1].id]);
assert.equal(normalizeProgress({level:11},levels).index,0);assert.equal(normalizeProgress({levelId:'missing'},levels).index,0);assert.equal(normalizeProgress(null,levels).index,0);
let saved=serializeProgress(8,levels,p.done,{[levels[0].id]:4});let restored=normalizeProgress(JSON.parse(JSON.stringify(saved)),levels);assert.equal(restored.index,8);assert.equal(restored.bests[levels[0].id],4);assert.deepEqual([...restored.done],[...p.done]);
const reordered=[levels[1],levels[0],...levels.slice(2)];assert.equal(normalizeProgress({levelId:levels[0].id,level:0},reordered).index,1);
let best=recordBest({},levels[0].id,10);best=recordBest(best,levels[0].id,12);assert.equal(best[levels[0].id],10);best=recordBest(best,levels[0].id,2);assert.equal(best[levels[0].id],2);
// Actual physics snapshots undo the route move count; hints do not spend a move.
let sim=E.createWorld(levels[0]);E.settle(sim);const before=E.snapshot(sim);const h=E.hint(sim);assert.equal(sim.moves,0);assert.ok(h);sim=E.move(sim,...levels[0].solution[0]);assert.equal(sim.moves,1);sim=E.createWorld(levels[0],before);assert.equal(sim.moves,0);assert.equal(E.createWorld(levels[0]).moves,0);
console.log('PASS: 12 level star boundaries, 3-of-4 sequential packs, locked resume, stable IDs, v4 migration, persistence, personal bests, free hints, Undo and restart scoring.');

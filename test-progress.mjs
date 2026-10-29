import assert from 'node:assert/strict';
import Matter from './dist/vendor/matter-0.20.0.min.js';
globalThis.Matter=Matter;
const E=await import('./dist/engine.mjs');
import {normalizeProgress,serializeProgress,recordBest,starsFor,packProgress,isLevelUnlocked,legacyLevelIds,unlockedPackCount,PACK_SIZE,PACK_REQUIRED} from './dist/progress.mjs';
// The fixture permits migration verification while designers build the extra puzzles;
// on the final release, run all of these same assertions on the actual campaign too.
const fixture=Array.from({length:8},(_,p)=>[...legacyLevelIds.slice(p*4,p*4+4).map(id=>({id})),...Array.from({length:6},(_,j)=>({id:`test-pack-${p}-${j}`}))]).flat();
function checkCampaign(levels){
 assert.equal(levels.length,80);assert.equal(PACK_SIZE,10);assert.equal(PACK_REQUIRED,7);
 const idAt=i=>levels[i].id;
 let p=normalizeProgress({},levels);
 assert.equal(p.index,0);assert.equal(p.unlockedPacks,1);
 assert.deepEqual(packProgress(levels,p.done,p.unlockedPacks).map(x=>x.unlocked),[true,...Array(7).fill(false)]);
 for(const bad of [null,[],{level:-1},{level:999},{levelId:'missing'},{campaign:'shapes-80',unlockedPacks:'8'}])assert.equal(normalizeProgress(bad,levels).index,0);
 // New players need seven of ten, any seven, and late-pack completions do not skip a gate.
 p.done=new Set(levels.slice(10,17).map(l=>l.id));assert.equal(isLevelUnlocked(20,levels,p.done),false);
 p.done=new Set(levels.slice(0,6).map(l=>l.id));assert.equal(isLevelUnlocked(10,levels,p.done),false);
 p.done.add(idAt(9));assert.equal(isLevelUnlocked(10,levels,p.done),true);assert.equal(isLevelUnlocked(20,levels,p.done),false);
 for(let target=1;target<8;target++){
  const earned=new Set(levels.slice(0,target*10).filter((l,i)=>i%10>=3).map(l=>l.id));
  assert.equal(isLevelUnlocked(target*10,levels,earned),true);
  assert.equal(isLevelUnlocked(target*10+9,levels,earned),true);
  earned.delete(idAt((target-1)*10+3));assert.equal(isLevelUnlocked(target*10,levels,earned),false);
 }
 // Every formerly unlocked pack remains unlocked, including a pack with zero completions.
 for(const campaign of ['shapes-12','shapes-16','shapes-32',undefined])for(let count=0;count<8;count++){
  const done=legacyLevelIds.slice(0,count*4).filter((_,i)=>i%4!==3);
  const old=normalizeProgress({campaign,done,levelId:legacyLevelIds[count*4],bests:{[legacyLevelIds[0]]:2}},levels);
  assert.equal(old.unlockedPacks,count+1);
  assert.equal(old.index,count*10);
  assert.equal(old.bests[legacyLevelIds[0]],2);
  const restored=normalizeProgress(JSON.parse(JSON.stringify(serializeProgress(old.index,levels,old.done,old.bests,old.unlockedPacks))),levels);
  assert.equal(restored.unlockedPacks,count+1);assert.equal(restored.index,count*10);
  assert.equal(isLevelUnlocked(count*10+9,levels,restored.done,restored.unlockedPacks),true);
 }
 // Old numeric resumes use original ordering, not the newly interleaved position.
 for(let oldIndex=0;oldIndex<32;oldIndex++){
  const old=normalizeProgress({campaign:'shapes-32',level:oldIndex,done:legacyLevelIds},levels);
  assert.equal(levels[old.index].id,legacyLevelIds[oldIndex]);
 }
 const resume=normalizeProgress({campaign:'shapes-16',level:15,done:legacyLevelIds.slice(0,16)},levels);
 assert.equal(resume.index,33);assert.equal(resume.unlockedPacks,5);
 // Best scores are completion evidence; malformed IDs and values cannot create progress.
 const bests=Object.fromEntries(legacyLevelIds.slice(0,12).filter((_,i)=>i%4!==3).map(id=>[id,6]));
 const fromBests=normalizeProgress({bests:{...bests,stale:5,[idAt(9)]:-1},done:['stale',null,3]},levels);
 assert.equal(fromBests.unlockedPacks,4);assert.equal(fromBests.done.size,9);
 assert.equal(Object.hasOwn(fromBests.bests,'stale'),false);
 // Migration happens once: three old completions in a NEW save do not earn the old gate.
 const migrated=normalizeProgress({campaign:'shapes-80',done:legacyLevelIds.slice(0,3),unlockedPacks:1},levels);
 assert.equal(migrated.unlockedPacks,1);
 // A grandfathered pack opens the next with seven completions, without redoing earlier packs.
 const grandfathered=normalizeProgress({campaign:'shapes-32',done:legacyLevelIds.slice(0,8)},levels);
 assert.equal(grandfathered.unlockedPacks,3);
 levels.slice(20,27).forEach(l=>grandfathered.done.add(l.id));
 const saved=serializeProgress(20,levels,grandfathered.done,{},grandfathered.unlockedPacks);
 assert.equal(saved.unlockedPacks,4);assert.equal(normalizeProgress(saved,levels).unlockedPacks,4);
 assert.equal(unlockedPackCount(levels,new Set(),4),4); // earned unlocks are permanent
 const newResume=normalizeProgress({campaign:'shapes-80',level:17,unlockedPacks:2},levels);assert.equal(newResume.index,17);
 assert.equal(normalizeProgress({campaign:'shapes-80',level:17,unlockedPacks:1},levels).index,0);
 const wrongNumeric=normalizeProgress({campaign:'shapes-80',levelId:levels[30].id,level:0,unlockedPacks:4},levels);assert.equal(wrongNumeric.index,30);
}
checkCampaign(fixture);
if(E.levels.length===80)checkCampaign(E.levels);
else assert.equal(E.levels.length,32,'intermediate campaign must be original32; final campaign must be80');
for(const l of E.levels){const t=l.solution.length;assert.equal(starsFor(t,t),3);assert.equal(starsFor(Math.max(1,t-1),t),3);assert.equal(starsFor(t+1,t),2);assert.equal(starsFor(t+2,t),2);assert.equal(starsFor(t+3,t),1);assert.equal(starsFor(undefined,t),0)}
let best=recordBest({},E.levels[0].id,10);best=recordBest(best,E.levels[0].id,12);assert.equal(best[E.levels[0].id],10);best=recordBest(best,E.levels[0].id,2);assert.equal(best[E.levels[0].id],2);
let sim=E.createWorld(E.levels[0]);E.settle(sim);const before=E.snapshot(sim);assert.ok(E.hint(sim));assert.equal(sim.moves,0);sim=E.move(sim,...E.levels[0].solution[0]);assert.equal(sim.moves,1);sim=E.createWorld(E.levels[0],before);assert.equal(sim.moves,0);assert.equal(E.createWorld(E.levels[0]).moves,0);
console.log(`PASS: 80-puzzle fixture${E.levels.length===80?' and live campaign':''}; 7-of-10 gates, permanent legacy unlocks, all32 old numeric resumes, stable IDs, bests migration, scoring, Undo and free hints.`);

import assert from 'node:assert/strict';
import fs from 'node:fs';
import Matter from './dist/vendor/matter-0.20.0.min.js';
globalThis.Matter=Matter;
const E=await import('./dist/engine.mjs');
let witnesses=0;
for(const filename of ['chain-reactions-cradle.json','chain-reactions-samples.json']){
 const data=JSON.parse(fs.readFileSync(new URL('./analysis/'+filename,import.meta.url)));
 for(const result of data.results){
  if(filename.includes('samples')&&result.id==='v5-cradle')continue;
  const level=E.levels.find(l=>l.id===result.id);assert.ok(level);
  for(const t of result.trials.filter(t=>t.status==='solved')){
   const s=E.createWorld(level);E.settle(s,5000);
   for(const [b,p] of t.coordinateRoute){const h=E.cells.findIndex(c=>c.x===p[0]&&c.y===p[1]);assert.ok(h>=0);assert.ok(E.move(s,b,h));E.settle(s,5000);assert.ok(s.settled)}
   assert.ok(E.complete(s));witnesses++;
  }
 }
}
for(const level of E.levels.slice(12)){
 const sim=E.createWorld(level);E.settle(sim);const snap=E.snapshot(sim);
 const [b,h]=level.solution[0];assert.ok(E.move(sim,b,h));E.step(sim,20);
 const undo=E.createWorld(level,snap);assert.deepEqual(E.snapshot(undo),snap);
 for(const [b,h] of level.solution){assert.ok(E.move(undo,b,h));E.settle(undo,5000)}assert.ok(E.complete(undo));
}
console.log(`PASS: ${witnesses} new-pack winning witnesses replayed against integrated geometry, plus Undo recovery.`);

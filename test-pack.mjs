import assert from 'node:assert/strict';
import fs from 'node:fs';
import Matter from './dist/vendor/matter-0.20.0.min.js';
globalThis.Matter=Matter;
const E=await import('./dist/engine.mjs');
const changed=JSON.parse(fs.readFileSync(new URL('./analysis/contact-route-changes.json',import.meta.url))).filter(r=>!r.pack);
let witnesses=0,blockedRoutes=0;
for(const filename of ['chain-reactions-cradle.json','chain-reactions-samples.json']){
 const data=JSON.parse(fs.readFileSync(new URL('./analysis/'+filename,import.meta.url)));
 for(const result of data.results){
  if(filename.includes('samples')&&result.id==='v5-cradle')continue;
  const level=E.levels.find(l=>l.id===result.id);assert.ok(level);
  for(const[trial,t]of result.trials.entries()){if(t.status!=='solved')continue;const revised=changed.find(r=>r.source===filename&&r.id===result.id&&r.trial===trial);
   const s=E.createWorld(level);E.settle(s,5000);
   if(revised){
    assert.deepEqual(t.coordinateRoute,revised.route);assert.ok(revised.baseline.completed&&revised.baseline.maxDepth>2.5);
    let observed=null;
    for(const[b,p]of t.coordinateRoute){const h=E.cells.findIndex(c=>c.x===p[0]&&c.y===p[1]);if(!E.move(s,b,h)){observed={kind:'blocked',b,p,move:s.moves};break}E.settle(s,5000);assert.ok(s.settled,'Corrected contact settles');}
    if(!observed&&!E.complete(s))observed={kind:'notcomplete'};
    assert.deepEqual(observed,revised.fail,'Explicit contact-sensitive historical outcome');blockedRoutes++;continue;
   }
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
assert.equal(blockedRoutes,changed.length);assert.equal(witnesses+blockedRoutes,119);
console.log(`PASS: ${witnesses} new-pack winning witnesses and ${blockedRoutes} explicitly blocked historical routes, plus Undo recovery.`);

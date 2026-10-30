import crypto from 'node:crypto';import {levelRecipes} from './dist/levels.mjs';
import assert from 'node:assert/strict';import fs from 'node:fs';
import Matter from './dist/vendor/matter-0.20.0.min.js';globalThis.Matter=Matter;
const E=await import('./dist/engine.mjs');
const changed=JSON.parse(fs.readFileSync(new URL('./analysis/contact-route-changes.json',import.meta.url))).filter(r=>r.pack);
let wins=0,blockedRoutes=0;
for(let pack=5;pack<=8;pack++){
 const data=JSON.parse(fs.readFileSync(new URL(`./analysis/pack${pack}-orders.json`,import.meta.url)));
 for(const result of data.results){const level=E.levels.find(l=>l.id===result.id);assert.ok(level);
  for(const[trial,t]of result.trials.entries()){if(t.status!=='solved')continue;const revised=changed.find(r=>r.id===result.id&&r.trial===trial);const s=E.createWorld(level);E.settle(s,5000);
   if(revised){
    assert.deepEqual(t.coordinateRoute,revised.route,'Historical evidence is retained verbatim');
    assert.ok(revised.baseline.completed&&revised.baseline.maxDepth>2.5,'Changed witness previously exceeded contact tolerance');
    let observed=null;
    for(const[b,p]of t.coordinateRoute){const h=E.cells.findIndex(c=>c.x===p[0]&&c.y===p[1]);if(!E.move(s,b,h)){observed={kind:'blocked',b,p,move:s.moves};break}E.settle(s,5000);assert.ok(s.settled,'Revised route settles, not a numerical jam');}
    if(!observed&&!E.complete(s))observed={kind:'notcomplete'};
    assert.deepEqual(observed,revised.fail,'Corrected collision geometry keeps this historical target blocked');blockedRoutes++;continue;
   }
   for(const[b,p]of t.coordinateRoute){const h=E.cells.findIndex(c=>c.x===p[0]&&c.y===p[1]);assert.ok(h>=0);assert.ok(E.move(s,b,h),`pack${pack} ${result.id} order${t.order} move${s.moves} screw${b} target${p} index${h}`);E.settle(s,5000);assert.ok(s.settled)}assert.ok(E.complete(s));wins++;
  }
 }
}
assert.equal(E.levels.length,80);assert.equal(new Set(E.levels.map(l=>l.id)).size,80);
for(const l of E.levels.filter(l=>l.id.startsWith('v6-'))){const s=E.createWorld(l);E.settle(s);const start=E.snapshot(s);assert.ok(E.move(s,...l.solution[0]));E.step(s,20);const undone=E.createWorld(l,start);assert.deepEqual(E.snapshot(undone),start);for(const[b,h]of l.solution){assert.ok(E.move(undone,b,h));E.settle(undone,5000)}assert.ok(E.complete(undone));}
assert.equal(blockedRoutes,changed.length);assert.equal(wins+blockedRoutes,175);
console.log(`PASS: ${wins} expansion winning routes, ${blockedRoutes} explicitly revalidated blocked historical routes, and16 Undo recoveries;80 distinct levels.`);

assert.equal(crypto.createHash('sha256').update(JSON.stringify(levelRecipes.filter(r=>!r.id.startsWith('v7-')).slice(0,16))).digest('hex'),'feb090b5e0487a7bc344d941e3edefb44a131c025838da00ad1cf90f988b758f','Original16 recipes, IDs and routes must stay unchanged');

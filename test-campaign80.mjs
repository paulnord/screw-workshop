import assert from 'node:assert/strict';
import fs from 'node:fs';
import Matter from './dist/vendor/matter-0.20.0.min.js';
globalThis.Matter=Matter;
const E=await import('./dist/engine.mjs');
const {levelRecipes}=await import('./dist/levels.mjs');
const originals=JSON.parse(fs.readFileSync(new URL('./analysis/original-32-recipes.json',import.meta.url)));
assert.equal(levelRecipes.length,80);
assert.equal(new Set(levelRecipes.map(r=>r.id)).size,80);
for(let p=0;p<8;p++)for(let j=0;j<4;j++)assert.deepEqual(levelRecipes[p*10+j],originals[p*4+j],`Pack${p+1} original${j+1} unchanged`);
const added=E.levels.filter(l=>l.id.startsWith('v7-'));
assert.equal(added.length,48);
let exactBounds=0;
for(const l of added){
 const s=E.createWorld(l);E.settle(s);const initial=E.snapshot(s);
 assert.ok(E.move(s,...l.solution[0]));E.step(s,20);
 const undo=E.createWorld(l,initial);assert.deepEqual(E.snapshot(undo),initial);
 for(const[b,h]of l.solution){assert.ok(E.move(undo,b,h),l.id+' legal route after Undo');E.settle(undo,2400);assert.ok(undo.settled,l.id+' settles');}
 assert.ok(E.complete(undo),l.id+' physically clears');
 assert.equal(undo.moves,l.solution.length);
 const originalScrews=l.plates.flat().length;
 assert.ok(l.solution.length>=originalScrews,'Route must release original anchors');
 const moved=new Set(l.solution.map(([b])=>b));assert.equal(moved.size,originalScrews);
 if(l.solution.length===originalScrews)exactBounds++;
}
console.log(`PASS:80 IDs,32 unchanged originals,48 added routes replay after Undo;${exactBounds}/48 reach original-anchor lower bound under intended rules.`);

import assert from'node:assert/strict';import Matter from'./dist/vendor/matter-0.20.0.min.js';globalThis.Matter=Matter;const E=await import('./dist/engine.mjs');const{levelRecipes}=await import('./dist/levels.mjs');
const baseline=E.cells.length,original=structuredClone(levelRecipes[0]);
for(let i=0;i<100;i++){
 const r=structuredClone(original);const delta=(i+1)/100;r.plates=r.plates.map(p=>p.map(([x,y])=>[x+delta,y]));r.solution=r.solution.map(([b,p])=>[b,p[1]===35?p:[p[0]+delta,p[1]]]);
 assert.equal(E.validateDailyRecipe(r),true);const l=E.compileDailyRecipe(r);assert.ok(E.cells.length<=baseline+3,'Dynamic coordinates bounded per board');
 const s=E.createWorld(l);E.settle(s);const saved=E.cells.map(p=>({...p})),snapshot=E.snapshot(s);E.validateDailyRecipe(original);assert.deepEqual(E.cells,saved);assert.deepEqual(E.snapshot(s),snapshot);
 const bad={...r,plates:[...r.plates,...r.plates]};assert.throws(()=>E.compileDailyRecipe(bad));assert.deepEqual(E.cells,saved,'Failed new board preserves active registry');
 for(const[b,h]of l.solution){assert.ok(E.move(s,b,h));E.settle(s,2400)}assert.ok(E.complete(s));
}
for(const l of [E.levels[0],E.levels[71],E.levels[79]]){const s=E.createWorld(l);E.settle(s);for(const[b,h]of l.solution){assert.ok(E.move(s,b,h));E.settle(s,2400)}assert.ok(E.complete(s),'Campaign remains valid after daily switches')}
console.log('PASS daily engine:100 loads bounded cells,transactional validation/failure,active-board integrity,campaign routes after daily.');

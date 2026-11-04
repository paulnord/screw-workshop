import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import Matter from './dist/vendor/matter-0.20.0.min.js';
globalThis.Matter=Matter;
const E=await import('./dist/engine.mjs');
const {levelRecipes}=await import('./dist/levels.mjs');
const {nearDuplicate}=await import('./scripts/daily-novelty.mjs');
assert.equal(levelRecipes.length,100);
assert.equal(new Set(levelRecipes.map(r=>r.id)).size,100);
// Record the exact first80 at the pre-redesign publication, not just first32.
assert.equal(crypto.createHash('sha256').update(JSON.stringify(levelRecipes.slice(0,80))).digest('hex'),'81f8283d1977b9e8ef34faef725abffbbd4b0ba06e19e9375732797b71ae7611');
const added=E.levels.slice(80),recipes=levelRecipes.slice(80);
const shapeOnly=r=>({...r,spares:[[175,35]],hidden:[]});
const geometryBaseline=levelRecipes.slice(0,80).map(shapeOnly);
for(const r of recipes){assert.ok(!geometryBaseline.some(old=>nearDuplicate(old,shapeOnly(r))),r.id+' must change actual material/anchor geometry, not just a hidden target or title');geometryBaseline.push(shapeOnly(r));}
let totalMoves=0,maxOverlap=0,maxDrift=0,hiddenFreeBranches=0,lateCatches=0;
function replay(level,{interrupted=false}={}){
 let s=E.createWorld(level);E.settle(s);const result={maxOverlap:0,maxDrift:0,frames:0,caught:0,soleHidden:0};
 const step=()=>{E.step(s);result.frames++;for(const p of s.engine.pairs.list)if(p.isActive)result.maxOverlap=Math.max(result.maxOverlap,p.collision.depth);for(let b=0;b<s.positions.length;b++)if(!(s.removed&(1<<b)))result.maxDrift=Math.max(result.maxDrift,E.hingeError(s,b));};
 for(const [n,[b,h]]of level.solution.entries()){
  const destinations=E.destinations(s);if(destinations.length===1&&level.hidden.includes(destinations[0]))result.soleHidden++;
  assert.ok(E.move(s,b,h),`${level.id} live move ${n+1} is legal`);let frames=0;
  if(interrupted){for(let k=0;k<5&&!s.settled;k++){step();frames++;}s=E.createWorld(level,E.snapshot(s));}
  for(;frames<2400&&!s.settled;frames++)step();
  assert.ok(s.settled,`${level.id} move ${n+1} settles`);
  for(const body of s.plates)assert.ok([body.position.x,body.position.y,body.angle,body.velocity.x,body.velocity.y,body.angularVelocity].every(Number.isFinite));
  if(s.plates.some((body,p)=>!body.plugin.cleared&&E.attachmentCount(s,p)===0))result.caught++;
 }
 assert.ok(E.complete(s),level.id+' physically clears on a fresh uninterrupted/resumed world');
 assert.ok(result.maxOverlap<2.5,level.id+' collision overlap bound');assert.ok(result.maxDrift<.02,level.id+' hinge drift bound');assert.ok(result.soleHidden>=1,level.id+' concealed hole is the only available next target on the route');
 return result;
}
for(const [index,l]of added.entries()){
 assert.equal(l.id,`v9-discovery-${String(index+1).padStart(2,'0')}`);assert.equal(l.packIndex,8+Math.floor(index/10));
 assert.equal(l.spares.length,1,l.id+' starts with one top spare');assert.deepEqual(E.cells[l.spares[0]],{x:175,y:35});assert.equal(l.hidden.length,1,l.id+' has one purposeful discovery, no extra decorative parking');
 const s=E.createWorld(l);E.settle(s);const initial=E.snapshot(s);
 assert.deepEqual(E.destinations(s),l.spares,l.id+' no other initial empty destinations');
 for(let a=0;a<s.plates.length;a++){for(let b=a+1;b<s.plates.length;b++)assert.ok(!Matter.Query.collides(s.plates[a],[s.plates[b]]).some(c=>c.depth>.01),l.id+' no initial material overlap');for(const p of s.plates[a].plugin.outline){const q=E.worldPoint(s.plates[a],p);assert.ok(q.x>=4&&q.x<=346&&q.y>=65&&q.y<=422,l.id+' material fits board');}}
 const points=E.holes(l).map(h=>E.cells[h]);for(let a=0;a<points.length;a++)for(let b=0;b<a;b++)assert.ok(Math.hypot(points[a].x-points[b].x,points[a].y-points[b].y)>=44,l.id+' touch targets spaced at least44px');
 const p=E.cells[l.hidden[0]],coverage=Array.from({length:360},(_,k)=>E.materialAt(s,{x:p.x+8.6*Math.cos(k*Math.PI/180),y:p.y+8.6*Math.sin(k*Math.PI/180)}));
 assert.ok(E.shaftBlocked(s,p),l.id+' discovery starts unusable');
 if(index<2){assert.ok(coverage.some(Boolean)&&coverage.some(v=>!v),l.id+' teaching level has a small visible rim');}else assert.ok(coverage.every(Boolean),l.id+' the complete8.5px rendered rim is hidden');
 assert.ok(l.solution.some(([,h])=>h===l.hidden[0]));
 // Exhaustive in the normal settle-after-each-move model: without discovery,
 // every possible first screw consumes the only spare and exposes no destination.
 // This is not a claim about arbitrary mid-motion shortcuts.
 const absent={...l,hidden:[]};
 for(let b=0;b<s.positions.length;b++){const branch=E.createWorld(absent);E.settle(branch);assert.ok(E.accessible(branch,b));assert.ok(E.move(branch,b,l.spares[0]));E.settle(branch,2400);assert.ok(branch.settled);assert.equal(E.destinations(branch).length,0,l.id+' hidden-free opening '+b+' deadlocks');hiddenFreeBranches++;}
 assert.ok(E.move(s,...l.solution[0]));E.step(s,20);const undone=E.createWorld(l,initial);assert.deepEqual(E.snapshot(undone),initial,l.id+' Undo restores initial positions and cover');assert.deepEqual(E.snapshot(E.createWorld(l)),E.snapshot(E.createWorld(l)),l.id+' restart deterministic');
 const evidence=replay(l),repeat=replay(l),interrupted=replay(l,{interrupted:true});assert.deepEqual(repeat,evidence,l.id+' uninterrupted replay deterministic');
 totalMoves+=l.solution.length;maxOverlap=Math.max(maxOverlap,evidence.maxOverlap,interrupted.maxOverlap);maxDrift=Math.max(maxDrift,evidence.maxDrift,interrupted.maxDrift);if(index>=10)lateCatches+=evidence.caught;
 if(index>=12)assert.ok(l.plates.length>=5,'late campaign has genuinely larger assemblies');
}
assert.ok(lateCatches>=10,'later routes include real loose-but-caught material rather than independent easy panels');
console.log(`PASS:20 original discovery boards;60 uninterrupted/repeated/resumed replays;${totalMoves} moves;${hiddenFreeBranches} exhaustive hidden-free first moves deadlock;first2 edge clues,18 fully concealed;geometry novelty,44px spacing,Undo/restart. Max overlap${maxOverlap.toFixed(3)}px;max hinge drift${maxDrift.toFixed(6)}px.`);

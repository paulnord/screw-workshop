import fs from 'node:fs';import Matter from '../dist/vendor/matter-0.20.0.min.js';globalThis.Matter=Matter;const E=await import(process.env.ENGINE_MODULE||'../dist/engine.mjs');const output=process.env.AUDIT_OUTPUT||'analysis/order-audit-raw.json';const continuous=process.env.AUDIT_CONTINUOUS==='1';
function tick(s){E.step(s);if(s.contactDiagnostics&&(s.contactDiagnostics.maxCorrection>4+1e-8||s.contactDiagnostics.maxImpulseEnergyGain>1e-8))throw Error('Contact solver budget/energy invariant');for(const b of s.plates)if(!Number.isFinite(b.position.x+b.position.y+b.angle+b.velocity.x+b.velocity.y))throw Error('Non-finite body');}
let seed=99173;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);const results=[];
const recipes=fs.readdirSync('dist/daily').filter(x=>x!=='index.json').map(x=>JSON.parse(fs.readFileSync('dist/daily/'+x)));
const boards=[...E.levels,...recipes.map(r=>({daily:r}))];
for(let li=0;li<boards.length;li++){const level=boards[li].daily?E.compileDailyRecipe(boards[li].daily.recipe||boards[li].daily):boards[li];for(let trial=0;trial<12;trial++){const s=E.createWorld(level);E.settle(s);const actions=[];let maxDepth=0,maxHinge=0,lateSpeed=0;
 for(let move=0;move<Math.min(30,s.positions.length*2)&&!E.complete(s);move++){
 const dest=E.destinations(s), bolts=s.positions.map((_,b)=>b).filter(b=>E.accessible(s,b));if(!dest.length||!bolts.length)break;
 const pinned=bolts.filter(b=>!(s.removed&(1<<b))), pool=pinned.length&&rand()<.85?pinned:bolts;const b=pool[Math.floor(rand()*pool.length)],h=dest[Math.floor(rand()*dest.length)],wait=[0,5,30,120,600][trial%5];E.move(s,b,h);actions.push([b,h,wait]);
 for(let f=0;f<wait&&(continuous||!s.settled);f++){tick(s);for(const c of s.engine.pairs.list)if(c.isActive)maxDepth=Math.max(maxDepth,c.collision.depth);for(let b=0;b<s.positions.length;b++)if(!(s.removed&(1<<b)))maxHinge=Math.max(maxHinge,E.hingeError(s,b));}
 }
 for(let f=0;f<2400&&(continuous||!s.settled);f++){tick(s);if(f>2160){for(const b of s.plates)if(!b.plugin.cleared&&!b.isStatic)lateSpeed=Math.max(lateSpeed,b.speed+Math.abs(b.angularVelocity)*b.plugin.settleRadius);for(const c of s.engine.pairs.list)if(c.isActive)maxDepth=Math.max(maxDepth,c.collision.depth);}}
 results.push({id:level.id,li,trial,actions,maxDepth,maxHinge,lateSpeed,settled:s.settled,complete:E.complete(s),bodies:E.snapshot(s).bodies});
 } console.log(li,level.id,results.slice(-12).filter(r=>r.maxDepth>3||r.maxHinge>.1||r.lateSpeed>1).map(r=>[r.trial,r.maxDepth,r.maxHinge,r.lateSpeed]));fs.writeFileSync(output,JSON.stringify(results));}

console.log(JSON.stringify({mode:continuous?'continuous-stress':'faithful-ui',seed:99173,trials:results.length,boards:boards.length,completed:results.filter(r=>r.complete).length,unsettled:results.filter(r=>!r.settled).map(r=>({id:r.id,trial:r.trial,actions:r.actions})),output},null,2));

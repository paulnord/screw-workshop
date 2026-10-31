// Offline deterministic generation. No browser/runtime generation or remote writes.
import crypto from 'node:crypto';
import Matter from '../dist/vendor/matter-0.20.0.min.js';
globalThis.Matter = Matter;
const E = await import('../dist/engine.mjs');
const D = await import('../dist/daily-data.mjs');
export const GENERATOR_VERSION = 'workshop-generator-v1';
export const LIMITS = Object.freeze({attemptsPerDate:80, simulationsPerCandidate:180, framesPerStage:2400, maxOverlap:2.5, maxHingeError:.02, minHoleSpacing:44});
export function seededRandom(seed) {
 let state = crypto.createHash('sha256').update(String(seed)).digest().readUInt32LE(0);
 return () => {state = state + 0x6D2B79F5 | 0;let t = Math.imul(state ^ state >>> 15, 1 | state);t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;return ((t ^ t >>> 14) >>> 0) / 4294967296;};
}
const round = n => Math.round(n * 100) / 100;
export function dateRange(start, count) {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(start || '') || D.utcDate(start+'T00:00:00Z') !== start) throw Error('Start must be a real UTC YYYY-MM-DD date');
 if (!Number.isInteger(count) || count < 1 || count > 31) throw Error('Days must be 1–31');
 return Array.from({length:count},(_,i)=>D.utcDate(new Date(Date.parse(start+'T00:00:00Z')+i*86400000)));
}
// New layouts are composed from independently chosen tiers, split bays, slopes,
// spans and mass profiles. No campaign/daily recipe is used as a template.
export function buildCandidate(seed, attempt=0) {
 const random=seededRandom(`${GENERATOR_VERSION}:${seed}:${attempt}`),integer=(a,b)=>a+Math.floor(random()*(b-a+1));
 const family=integer(0,4),rows=family===4?3:integer(3,5),pieces=[],layout=[];
 const startY=family===4?integer(128,134):integer(92,108),endY=family===4?integer(340,348):integer(355,375);
 for(let row=0;row<rows;row++){
  const split=random()<(family===0?.75:family===1?.4:.6);layout.push(split?2:1);
  const y=startY+(endY-startY)*row/(rows-1)+integer(-3,3);
  for(let bay=0;bay<(split?2:1);bay++){
   const center=(split?(bay?255:95):175)+integer(-14,14)+(family===1&&!split?(row%2?18:-18):0);
   const span=split?integer(48,76):integer(family===1?94:122,190),dy=integer(-18,18);
   const anchors=[[round(center-span/2),round(y-dy/2)],[round(center+span/2),round(y+dy/2)]];
   const shaped=(family===2||family===3)&&random()<.65;
   if(shaped){
    // Convex asymmetric beams: full square cutouts remain inside material.
    const angle=Math.atan2(dy,span),length=Math.hypot(span,dy),left=integer(17,25),right=integer(17,25),bottom=integer(17,24);
    const transform=([x,z])=>[round(center+x*Math.cos(angle)-z*Math.sin(angle)),round(y+x*Math.sin(angle)+z*Math.cos(angle))];
    const outline=[[-length/2-left,-17],[length/2+right,-17],[length/2+right,bottom],[-length/2-left,integer(17,24)]].map(transform);
    pieces.push({anchors,outline});
   } else pieces.push({bar:anchors});
  }
 }
 if(family===4){const corners=random()<.5?2:4;for(let i=0;i<corners;i++){const x=i%2?325:25,y=i<2?85:398;pieces.push({anchors:[[x,y]],outline:[[x-17,y-17],[x+17,y-17],[x+integer(13,17),y+21],[x-integer(13,17),y+21]]});}layout.push(corners);}
 const anchors=pieces.flatMap(p=>p.bar||p.anchors);
 const recipe={id:'candidate',name:'Candidate',tip:'Make room for falling pieces, and reuse the openings they leave.',pieces,spareCount:2,hidden:[],solution:anchors.map((_,b)=>[b,b%2?[245,35]:[105,35]])};
 return {recipe,design:{family:['split-bays','offset-bridges','weighted-rails','mixed-workshop','corner-foundry'][family],rows,layout,blocks:pieces.length,shaped:pieces.filter(p=>p.outline).length}};
}
function finite(sim){for(const b of sim.plates)if(![b.position.x,b.position.y,b.angle,b.velocity.x,b.velocity.y,b.angularVelocity].every(Number.isFinite))throw Error('Non-finite physics state');}
function measure(sim,metrics){
 finite(sim);
 for(const pair of sim.engine.pairs.list)if(pair.isActive)metrics.maxOverlap=Math.max(metrics.maxOverlap,pair.collision.depth);
 for(let b=0;b<sim.positions.length;b++)if(!(sim.removed&(1<<b)))metrics.maxHingeError=Math.max(metrics.maxHingeError,E.hingeError(sim,b));
 if(metrics.maxOverlap>=LIMITS.maxOverlap)throw Error('Contact overlap exceeds bound');
 if(metrics.maxHingeError>LIMITS.maxHingeError)throw Error('Hinge drift exceeds bound');
}
function settleChecked(sim,metrics,maxFrames=LIMITS.framesPerStage){let frames=0;while(!sim.settled&&frames<maxFrames){E.step(sim);frames++;metrics.steps++;measure(sim,metrics);}metrics.maxStageFrames=Math.max(metrics.maxStageFrames,frames);if(!sim.settled)throw Error('Assembly does not settle within bound');return frames;}
export function validateMobileGeometry(recipe){
 const level=E.compileDailyRecipe(recipe),sim=E.createWorld(level),points=E.holes(level).map(h=>E.cells[h]);let minSpacing=Infinity;
 for(let i=0;i<points.length;i++)for(let j=0;j<i;j++)minSpacing=Math.min(minSpacing,Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y));
 if(minSpacing<LIMITS.minHoleSpacing)throw Error('Initial holes too close for touch');
 for(const body of sim.plates)for(const p of body.plugin.outline){const q=E.worldPoint(body,p);if(q.x<4||q.x>346||q.y<65||q.y>422)throw Error('Initial material outside board safe area');}
 return {minHoleSpacing:minSpacing};
}
const emptyMetrics=()=>({maxOverlap:0,maxHingeError:0,steps:0,maxStageFrames:0});
export function solveCandidate(recipe,{simulationBudget=LIMITS.simulationsPerCandidate}={}){
 const mobile=validateMobileGeometry(recipe),level=E.compileDailyRecipe(recipe);let simulations=0,totalSteps=0,lastReason='No bounded route';
 for(const mode of ['bottom','top','outer']){
  let sim=E.createWorld(level),metrics=emptyMetrics(),solution=[];
  settleChecked(sim,metrics);totalSteps+=metrics.steps;
  while(!E.complete(sim)&&solution.length<sim.positions.length){
   const bolts=sim.positions.map((_,b)=>b).filter(b=>!(sim.removed&(1<<b))&&E.accessible(sim,b));
   const height=b=>level.plates[E.plateForBolt(sim,b)].reduce((n,h)=>n+E.cells[h].y,0)/level.plates[E.plateForBolt(sim,b)].length;
   bolts.sort((a,b)=>E.attachmentCount(sim,E.plateForBolt(sim,a))-E.attachmentCount(sim,E.plateForBolt(sim,b))||(mode==='bottom'?height(b)-height(a):mode==='top'?height(a)-height(b):Math.abs(height(b)-230)-Math.abs(height(a)-230))||b-a);
   const targets=E.destinations(sim).sort((a,b)=>E.cells[a].y-E.cells[b].y||E.cells[a].x-E.cells[b].x);
   let chosen=null;
   for(const b of bolts){for(const h of targets){
    if(++simulations>simulationBudget)throw Object.assign(Error('Candidate simulation budget exhausted'),{simulations:simulations-1,steps:totalSteps});
    const trial=E.createWorld(level,E.snapshot(sim)),nextMetrics=emptyMetrics();
    if(!E.move(trial,b,h))continue;
    try{settleChecked(trial,nextMetrics);chosen={sim:trial,move:[b,[E.cells[h].x,E.cells[h].y]]};}catch(error){lastReason=error.message;}
    totalSteps+=nextMetrics.steps;if(chosen)break;
   }if(chosen)break;}
   if(!chosen)break;sim=chosen.sim;solution.push(chosen.move);
  }
  if(E.complete(sim))return {recipe:{...recipe,solution},search:{simulations,steps:totalSteps,mode},mobile};
 }
 throw Object.assign(Error('No bounded route: '+lastReason),{simulations,steps:totalSteps});
}
export function makePuzzle(recipe,date){
 dateRange(date,1);const id=`daily-${date}-v1`,name=recipe.name;
 return {schemaVersion:D.DAILY_SCHEMA,rulesetVersion:D.DAILY_RULESET,id,name,recipe:{...recipe,id,name},targetMoves:recipe.solution.length,witnessPolicy:'settle-after-each-move-2400'};
}
export function verifyPuzzle(puzzle,{undoCheck=true,interrupted=false}={}){
 D.validatePuzzle(puzzle,{validateGeometry:E.validateDailyRecipe});const mobile=validateMobileGeometry(puzzle.recipe),level=E.compileDailyRecipe(puzzle.recipe),metrics=emptyMetrics(),stages=[];let sim=E.createWorld(level);
 settleChecked(sim,metrics);
 for(const [b,h] of level.solution){
  const before=E.snapshot(sim);
  if(!E.move(sim,b,h))throw Error(`Live witness move ${sim.moves+1} is illegal`);
  if(undoCheck){const restored=E.createWorld(level,before);if(JSON.stringify(E.snapshot(restored),(_,v)=>typeof v==='number'?Math.round(v*1e7)/1e7:v)!==JSON.stringify(before,(_,v)=>typeof v==='number'?Math.round(v*1e7)/1e7:v))throw Error('Undo snapshot mismatch');const interrupted=E.snapshot(sim),restart=E.createWorld(level);finite(restart);if(restart.moves!==0||restart.removed!==0)throw Error('Restart state mismatch');const resumed=E.createWorld(level,interrupted);finite(resumed);}
  if(interrupted){for(let f=0;f<5&&!sim.settled;f++){E.step(sim);metrics.steps++;measure(sim,metrics);}sim=E.createWorld(level,E.snapshot(sim));}
  stages.push(settleChecked(sim,metrics,LIMITS.framesPerStage-(interrupted?5:0)));
 }
 if(!E.complete(sim))throw Error('Live witness did not clear all material');
 return {...metrics,...mobile,blocks:level.plates.length,screws:sim.positions.length,moves:sim.moves,reachesAnchorLowerBound:sim.moves===sim.positions.length,stageFrames:stages};
}
export function hashText(raw){return crypto.createHash('sha256').update(raw).digest('hex');}
export function puzzleText(puzzle){return JSON.stringify(puzzle,null,2)+'\n';}

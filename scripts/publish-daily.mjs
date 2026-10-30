// Append immutable, data-only challenges. Usage: node scripts/publish-daily.mjs YYYY-MM-DD recipe.json
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import Matter from '../dist/vendor/matter-0.20.0.min.js';globalThis.Matter=Matter;
const E=await import('../dist/engine.mjs');
const D=await import('../dist/daily-data.mjs');
export function checkWitness(puzzle){
 D.validatePuzzle(puzzle,{validateGeometry:E.validateDailyRecipe});
 const l=E.compileDailyRecipe(puzzle.recipe),s=E.createWorld(l);E.settle(s,2400);let maxOverlap=0,steps=0;
 if(!s.settled)throw Error('Initial assembly did not settle');
 for(const[b,h]of l.solution){if(!E.move(s,b,h))throw Error(`Illegal witness move${s.moves+1}`);let f=0;while(!s.settled&&f++<2400){E.step(s);steps++;for(const p of s.engine.pairs.list)if(p.isActive)maxOverlap=Math.max(maxOverlap,p.collision.depth);for(let b=0;b<s.positions.length;b++)if(!(s.removed&(1<<b))&&E.hingeError(s,b)>.02)throw Error('Hinge drift exceeds bound');}if(!s.settled)throw Error('Witness does not settle');}
 if(!E.complete(s))throw Error('Witness does not clear all blocks');if(maxOverlap>=2.5)throw Error('Witness contact overlap exceeds bound');
 return {blocks:l.plates.length,screws:s.positions.length,moves:s.moves,maxOverlap,steps,reachesAnchorLowerBound:s.moves===s.positions.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)){
 const [date,file]=process.argv.slice(2);if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||D.utcDate(date+'T00:00:00Z')!==date||!file)throw Error('Usage: node scripts/publish-daily.mjs YYYY-MM-DD recipe.json');
 const raw=JSON.parse(fs.readFileSync(file,'utf8'));const id=`daily-${date}-v1`;const recipe={...raw,id,name:raw.name,tip:raw.tip||raw.rationale};delete recipe.packIndex;
 const puzzle={schemaVersion:D.DAILY_SCHEMA,rulesetVersion:D.DAILY_RULESET,id,name:recipe.name,recipe,targetMoves:recipe.solution.length,witnessPolicy:'settle-after-each-move-2400'};
 const evidence=checkWitness(puzzle),text=JSON.stringify(puzzle,null,2)+'\n',sha256=crypto.createHash('sha256').update(text).digest('hex'),dir=new URL('../dist/daily/',import.meta.url),indexFile=new URL('index.json',dir),out=new URL(`${date}.json`,dir);
 fs.mkdirSync(dir,{recursive:true});const index=fs.existsSync(indexFile)?D.validateIndex(JSON.parse(fs.readFileSync(indexFile))):{schemaVersion:D.DAILY_SCHEMA,rulesetVersion:D.DAILY_RULESET,entries:[]};
 if(index.entries.some(e=>e.date===date)||fs.existsSync(out))throw Error('Published date already exists; immutable challenges cannot be overwritten');
 index.entries.push({date,id,url:`${date}.json`,sha256});index.entries.sort((a,b)=>a.date.localeCompare(b.date));D.validateIndex(index);fs.writeFileSync(out,text);fs.writeFileSync(indexFile,JSON.stringify(index,null,2)+'\n');await import('./build-daily-score-catalog.mjs?refresh='+Date.now());console.log(JSON.stringify({date,id,...evidence}));
}

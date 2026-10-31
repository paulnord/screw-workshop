#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {levelRecipes} from '../dist/levels.mjs';
import {validateIndex} from '../dist/daily-data.mjs';
import {GENERATOR_VERSION,LIMITS,buildCandidate,dateRange,solveCandidate,makePuzzle,verifyPuzzle,hashText,puzzleText} from './daily-generator.mjs';
import {geometryFingerprint,nearDuplicate} from './daily-novelty.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export function readPublished(directory=path.join(root,'dist/daily')){
 const index=validateIndex(JSON.parse(fs.readFileSync(path.join(directory,'index.json'),'utf8')));
 const puzzles=index.entries.map(entry=>{const raw=fs.readFileSync(path.join(directory,entry.url),'utf8');if(hashText(raw)!==entry.sha256)throw Error('Existing daily checksum mismatch');const puzzle=JSON.parse(raw);if(puzzle.id!==entry.id)throw Error('Existing daily identity mismatch');return {entry,puzzle,raw};});
 return {index,puzzles};
}
export function generateQueue({start,days=14,seed='screw-workshop',maxAttempts=LIMITS.attemptsPerDate,published=readPublished(),onProgress=()=>{}}){
 const dates=dateRange(start,days);if(!Number.isInteger(maxAttempts)||maxAttempts<1||maxAttempts>LIMITS.attemptsPerDate)throw Error('Attempt limit must be 1–'+LIMITS.attemptsPerDate);
 if(dates.some(date=>published.index.entries.some(e=>e.date===date)))throw Error('Published dates are immutable; choose new dates');
 if(published.index.entries.length+days>400)throw Error('Daily index capacity exceeded');
 if(typeof seed!=='string'||!seed||seed.length>120)throw Error('Seed must be a nonempty string up to120characters');
 const novelty=[...levelRecipes,...published.puzzles.map(p=>p.puzzle.recipe)],accepted=[],rejections={},started=performance.now();let attempts=0,simulations=0,searchSteps=0;
 for(const date of dates){let found=false;
  for(let attempt=0;attempt<maxAttempts;attempt++){
   attempts++;try{
    const candidate=buildCandidate(`${seed}:${date}`,attempt);
    const minBlocks=Math.floor(Date.parse(date+'T00:00:00Z')/86400000)%7===2?8:4;
    if(candidate.design.blocks<minBlocks)throw Error('Too few blocks for date profile');
    // Avoid a queue of identically structured daily boards, even when geometry differs.
    const structure=JSON.stringify([candidate.design.layout,candidate.design.shaped]);
    if(accepted.some(a=>a.structure===structure))throw Error('Repeated queue structure');
    if(novelty.some(r=>nearDuplicate(r,candidate.recipe)))throw Error('Near-duplicate geometry');
    const solved=solveCandidate(candidate.recipe);simulations+=solved.search.simulations;searchSteps+=solved.search.steps;
    const titles={'split-bays':'Split-bay assembly','offset-bridges':'Offset bridges','weighted-rails':'Weighted rails','mixed-workshop':'Mixed workshop','corner-foundry':'Corner foundry'};
    const name=`${titles[candidate.design.family]} · ${candidate.design.blocks} pieces`;
    const puzzle=makePuzzle({...solved.recipe,name,tip:'Plan the release order. Vacated mounting holes make room for the remaining screws.'},date);
    // The planner uses snapshot branches; ONLY these uninterrupted live replays certify acceptance.
    const evidence=verifyPuzzle(puzzle),repeat=verifyPuzzle(puzzle,{undoCheck:false});
    if(JSON.stringify(evidence)!==JSON.stringify(repeat))throw Error('Live replay is not reproducible');
    const interruptedEvidence=verifyPuzzle(puzzle,{undoCheck:false,interrupted:true});
    const raw=puzzleText(puzzle),entry={date,id:puzzle.id,url:`${date}.json`,sha256:hashText(raw)};
    const item={entry,puzzle,raw,attempt,design:candidate.design,structure,fingerprint:geometryFingerprint(puzzle.recipe),search:solved.search,evidence,interruptedEvidence};
    accepted.push(item);novelty.push(puzzle.recipe);found=true;break;
   }catch(error){simulations+=error.simulations||0;searchSteps+=error.steps||0;rejections[error.message]=(rejections[error.message]||0)+1;}
  }
  if(found){const item=accepted.at(-1);onProgress({date,attempt:item.attempt+1,blocks:item.evidence.blocks,moves:item.evidence.moves});}
  if(!found)throw Object.assign(Error(`No verified candidate for ${date} after ${maxAttempts} attempts; no queue was installed`),{report:{attempts,accepted:accepted.length,rejections,simulations,searchSteps,runtimeMs:Math.round(performance.now()-started)}});
 }
 return {manifest:{generatorVersion:GENERATOR_VERSION,rulesetVersion:published.index.rulesetVersion,start,days,seed,maxAttempts,baseline:published.index.entries,entries:accepted.map(({entry,attempt,design,fingerprint,search,evidence,interruptedEvidence})=>({...entry,attempt,design,fingerprint,search,evidence,interruptedEvidence}))},accepted,statistics:{attempts,accepted:accepted.length,rejections,plannerMoveTrials:simulations,plannerSteps:searchSteps,acceptedReplayCount:accepted.length*3,acceptedReplaySteps:accepted.reduce((n,a)=>n+a.evidence.steps*2+a.interruptedEvidence.steps,0),runtimeMs:Math.round(performance.now()-started)}};
}
export function writeQueue(queue,out){
 const destination=path.resolve(out);if(fs.existsSync(destination))throw Error('Output exists; refusing to overwrite a queue');
 fs.mkdirSync(path.dirname(destination),{recursive:true});const staging=fs.mkdtempSync(destination+'.staging-');
 try{for(const {entry,raw}of queue.accepted)fs.writeFileSync(path.join(staging,entry.url),raw,{flag:'wx'});fs.writeFileSync(path.join(staging,'manifest.json'),JSON.stringify(queue.manifest,null,2)+'\n');fs.writeFileSync(path.join(staging,'statistics.json'),JSON.stringify(queue.statistics,null,2)+'\n');fs.renameSync(staging,destination);}catch(error){fs.rmSync(staging,{recursive:true,force:true});throw error;}
 return destination;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const args=process.argv.slice(2),options={};for(let i=0;i<args.length;i+=2){if(!['--start','--days','--seed','--out','--max-attempts'].includes(args[i])||args[i+1]===undefined)throw Error('Usage: node scripts/generate-daily.mjs --start YYYY-MM-DD --days 14 --out path [--seed value] [--max-attempts 80]');options[args[i].slice(2)]=args[i+1];}
  if(!options.start||!options.out)throw Error('--start and --out are required; generation never publishes or installs automatically');
  const queue=generateQueue({start:options.start,days:options.days===undefined?14:Number(options.days),seed:options.seed,maxAttempts:options['max-attempts']===undefined?LIMITS.attemptsPerDate:Number(options['max-attempts']),onProgress:r=>console.error(JSON.stringify(r))});
  console.log(JSON.stringify({out:writeQueue(queue,options.out),...queue.statistics},null,2));
 }catch(error){console.error(JSON.stringify({error:error.message,...error.report},null,2));process.exitCode=1;}
}

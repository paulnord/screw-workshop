#!/usr/bin/env node
// Local source update only. This command cannot push, deploy, or activate a schedule.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {levelRecipes} from '../dist/levels.mjs';import {validateIndex,DAILY_RULESET} from '../dist/daily-data.mjs';
import {readPublished} from './generate-daily.mjs';
import {GENERATOR_VERSION,dateRange,verifyPuzzle,hashText} from './daily-generator.mjs';
import {geometryFingerprint,nearDuplicate} from './daily-novelty.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export function verifyQueue(directory,{dailyDirectory=path.join(root,'dist/daily')}={}){
 const published=readPublished(dailyDirectory),manifest=JSON.parse(fs.readFileSync(path.join(directory,'manifest.json'),'utf8'));
 if(manifest.generatorVersion!==GENERATOR_VERSION||manifest.rulesetVersion!==DAILY_RULESET)throw Error('Unsupported generator queue');
 const dates=dateRange(manifest.start,manifest.days);
 if(!Array.isArray(manifest.entries)||manifest.entries.length!==dates.length||!Array.isArray(manifest.baseline))throw Error('Invalid queue manifest');
 for(const old of manifest.baseline){const current=published.index.entries.find(e=>e.date===old.date);if(!current||JSON.stringify(current)!==JSON.stringify(old))throw Error('Queue baseline changed');}
 const novelty=[...levelRecipes,...published.puzzles.map(p=>p.puzzle.recipe)],accepted=[];
 for(let i=0;i<dates.length;i++){
  const item=manifest.entries[i],entry={date:item.date,id:item.id,url:item.url,sha256:item.sha256};
  if(entry.date!==dates[i]||entry.url!==`${entry.date}.json`||entry.id!==`daily-${entry.date}-v1`)throw Error('Queue date/identity mismatch');
  validateIndex({...published.index,entries:[...published.index.entries,...accepted.map(a=>a.entry),entry]});
  if(published.index.entries.some(e=>e.date===entry.date)||fs.existsSync(path.join(dailyDirectory,entry.url)))throw Error('Immutable date/file already exists');
  const raw=fs.readFileSync(path.join(directory,entry.url),'utf8');if(hashText(raw)!==entry.sha256)throw Error('Queue checksum mismatch');const puzzle=JSON.parse(raw);
  if(puzzle.id!==entry.id||geometryFingerprint(puzzle.recipe)!==item.fingerprint)throw Error('Queue geometry/identity mismatch');
  if(novelty.some(r=>nearDuplicate(r,puzzle.recipe)))throw Error('Queue contains near-duplicate geometry');
  const evidence=verifyPuzzle(puzzle),interruptedEvidence=verifyPuzzle(puzzle,{undoCheck:false,interrupted:true});
  if(evidence.blocks<4||!evidence.reachesAnchorLowerBound)throw Error('Queue difficulty/target policy mismatch');
  accepted.push({entry,puzzle,raw,evidence,interruptedEvidence});novelty.push(puzzle.recipe);
 }
 return {published,manifest,accepted};
}
export function installQueue(directory,{distDirectory=path.join(root,'dist'),beforeIndexCommit=()=>{}}={}){
 const lockFile=path.join(distDirectory,'.daily-install.lock');let lock;
 try{lock=fs.openSync(lockFile,'wx');}catch(error){if(error.code==='EEXIST')throw Error('Another install is active (or a stale lock needs review)');throw error;}
 try{
  const dailyDirectory=path.join(distDirectory,'daily'),indexFile=path.join(dailyDirectory,'index.json'),catalogFile=path.join(distDirectory,'daily-score-catalog.mjs');
  const originalIndex=fs.readFileSync(indexFile,'utf8'),originalCatalog=fs.readFileSync(catalogFile,'utf8');
  const queue=verifyQueue(directory,{dailyDirectory}),catalog=JSON.parse(originalCatalog.split('export const dailyScoreCatalog=')[1].trim().replace(/;$/,''));
  const unchanged=()=>fs.readFileSync(indexFile,'utf8')===originalIndex&&fs.readFileSync(catalogFile,'utf8')===originalCatalog;
  if(!unchanged())throw Error('Source changed during verification');
  for(const {entry,puzzle}of queue.accepted){const row={date:entry.date,id:entry.id,revision:entry.sha256,targetMoves:puzzle.targetMoves,name:puzzle.name};if(catalog.some(r=>r.date===row.date))throw Error('Historical catalog date already exists');catalog.push(row);}
  catalog.sort((a,b)=>a.date.localeCompare(b.date)||a.revision.localeCompare(b.revision));
  const nextIndex={...queue.published.index,entries:[...queue.published.index.entries,...queue.accepted.map(a=>a.entry)].sort((a,b)=>a.date.localeCompare(b.date))};validateIndex(nextIndex);
  const nextCatalog='// Generated from verified immutable daily files. Retain historical revisions.\nexport const dailyScoreCatalog='+JSON.stringify(catalog,null,2)+';\n';
  const staging=fs.mkdtempSync(path.join(distDirectory,'.daily-install-')),created=[];let catalogChanged=false;
  try{
   // Write complete immutable files before activation. The final index rename is
   // atomic. A process crash leaves only unreferenced files/extra metadata and a
   // reviewable lock; it never activates a partially written index. Do not auto-
   // clear a stale lock: inspect the old index, catalog and unreferenced files.
   for(const {entry,raw}of queue.accepted){const temp=path.join(staging,entry.url),dest=path.join(dailyDirectory,entry.url);fs.writeFileSync(temp,raw);fs.linkSync(temp,dest);created.push({dest,raw});}
   fs.writeFileSync(path.join(staging,'catalog-backup.mjs'),originalCatalog);
   beforeIndexCommit();if(!unchanged())throw Error('Source changed during install');
   fs.writeFileSync(path.join(staging,'catalog.mjs'),nextCatalog);fs.writeFileSync(path.join(staging,'index.json'),JSON.stringify(nextIndex,null,2)+'\n');
   fs.renameSync(path.join(staging,'catalog.mjs'),catalogFile);catalogChanged=true;
   if(fs.readFileSync(indexFile,'utf8')!==originalIndex||fs.readFileSync(catalogFile,'utf8')!==nextCatalog)throw Error('Source changed before activation');
   fs.renameSync(path.join(staging,'index.json'),indexFile);
  }catch(error){
   if(catalogChanged&&fs.readFileSync(catalogFile,'utf8')===nextCatalog)fs.renameSync(path.join(staging,'catalog-backup.mjs'),catalogFile);
   for(const {dest,raw}of created)if(fs.existsSync(dest)&&fs.readFileSync(dest,'utf8')===raw)fs.rmSync(dest);throw error;
  }finally{fs.rmSync(staging,{recursive:true,force:true});}
  return {installed:queue.accepted.length,first:queue.accepted[0].entry.date,last:queue.accepted.at(-1).entry.date};
 }finally{fs.closeSync(lock);fs.rmSync(lockFile,{force:true});}
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const [mode,directory]=process.argv.slice(2);if(!['--verify','--install'].includes(mode)||!directory||process.argv.length!==4)throw Error('Usage: node scripts/install-daily-queue.mjs --verify|--install queue-directory');console.log(JSON.stringify(mode==='--verify'?{verified:verifyQueue(directory).accepted.length}:installQueue(directory),null,2));}catch(error){console.error(error.message);process.exitCode=1;}
}

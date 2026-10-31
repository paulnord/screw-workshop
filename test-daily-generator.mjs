import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {buildCandidate,dateRange,seededRandom,solveCandidate,verifyPuzzle,hashText,LIMITS} from './scripts/daily-generator.mjs';
import {generateQueue,readPublished,writeQueue} from './scripts/generate-daily.mjs';
import {verifyQueue,installQueue} from './scripts/install-daily-queue.mjs';
import {geometryFingerprint,nearDuplicate} from './scripts/daily-novelty.mjs';
import {levelRecipes} from './dist/levels.mjs';

const started=performance.now(),root=fileURLToPath(new URL('.',import.meta.url));
const queueDirectory=path.join(root,'generated/2026-11-05-queue');
const manifest=JSON.parse(fs.readFileSync(path.join(queueDirectory,'manifest.json'),'utf8'));
// The historical baseline is a private fixture, not an assumption that the
// checkout still has only seven dates. Tests keep working after queue adoption.
const currentPublished=readPublished(),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'screw-generator-tests-'));
const sourceIndex=fs.readFileSync(path.join(root,'dist/daily/index.json'),'utf8');
const sourceCatalog=fs.readFileSync(path.join(root,'dist/daily-score-catalog.mjs'),'utf8');
const sourceDailyFiles=new Map(fs.readdirSync(path.join(root,'dist/daily')).map(name=>[name,fs.readFileSync(path.join(root,'dist/daily',name),'utf8')]));
const baselineLevels=fs.readFileSync(path.join(root,'dist/levels.mjs'),'utf8');
const readCatalog=raw=>JSON.parse(raw.split('export const dailyScoreCatalog=')[1].trim().replace(/;$/,''));
const originalMetadata=readCatalog(sourceCatalog).filter(row=>manifest.baseline.some(e=>e.id===row.id&&e.sha256===row.revision));
assert.equal(originalMetadata.length,manifest.baseline.length,'Every historical baseline revision retains score metadata');
const baselineIndex=JSON.stringify({...currentPublished.index,entries:manifest.baseline},null,2)+'\n';
const baselineCatalog='// Historical baseline fixture.\nexport const dailyScoreCatalog='+JSON.stringify(originalMetadata,null,2)+';\n';
const fixtureRoot=path.join(temporary,'historical'),fixtureDist=path.join(fixtureRoot,'dist'),fixtureDaily=path.join(fixtureDist,'daily');
fs.mkdirSync(fixtureRoot);fs.cpSync(path.join(root,'dist'),fixtureDist,{recursive:true});
fs.rmSync(fixtureDaily,{recursive:true});fs.mkdirSync(fixtureDaily);
for(const entry of manifest.baseline){const raw=sourceDailyFiles.get(entry.url);assert.equal(hashText(raw),entry.sha256,'Historical fixture bytes match immutable manifest hash');fs.writeFileSync(path.join(fixtureDaily,entry.url),raw);}
fs.writeFileSync(path.join(fixtureDaily,'index.json'),baselineIndex);fs.writeFileSync(path.join(fixtureDist,'daily-score-catalog.mjs'),baselineCatalog);
// A private CLI tree exercises real argument parsing against the same baseline.
fs.cpSync(path.join(root,'scripts'),path.join(fixtureRoot,'scripts'),{recursive:true});
const published=readPublished(fixtureDaily);
function copyDist(name){const dest=path.join(temporary,name);fs.cpSync(fixtureDist,dest,{recursive:true});return dest;}
function assertOriginalData(dist){
  for(const {entry,raw}of published.puzzles)assert.equal(fs.readFileSync(path.join(dist,'daily',entry.url),'utf8'),raw,'Every original dated puzzle remains byte-identical');
  assert.equal(fs.readFileSync(path.join(dist,'levels.mjs'),'utf8'),baselineLevels,'All80 campaign source recipes remain byte-identical');
}
function assertPristine(dist){
  assertOriginalData(dist);assert.equal(fs.readFileSync(path.join(dist,'daily/index.json'),'utf8'),baselineIndex);assert.equal(fs.readFileSync(path.join(dist,'daily-score-catalog.mjs'),'utf8'),baselineCatalog);
  assert.deepEqual(fs.readdirSync(path.join(dist,'daily')).sort(),fs.readdirSync(fixtureDaily).sort());
  assert.ok(!fs.existsSync(path.join(dist,'.daily-install.lock')),'Installer releases its lock');
  assert.ok(!fs.readdirSync(dist).some(n=>n.startsWith('.daily-install-')),'Installer removes staging');
}
function singleQueue(name){const dest=path.join(temporary,name);fs.mkdirSync(dest);const one={...manifest,days:1,entries:manifest.entries.slice(0,1)};fs.writeFileSync(path.join(dest,'manifest.json'),JSON.stringify(one));fs.copyFileSync(path.join(queueDirectory,one.entries[0].url),path.join(dest,one.entries[0].url));return dest;}
try{
  assert.equal(published.index.entries.length,7,'Fixture keeps the seven previously released dates');assert.equal(levelRecipes.length,80);
  assert.equal(manifest.days,14);assert.equal(manifest.entries.length,14);assert.equal(manifest.start,'2026-11-05');
  assert.deepEqual(dateRange('2026-12-31',3),['2026-12-31','2027-01-01','2027-01-02']);
  assert.deepEqual(dateRange('2028-02-28',3),['2028-02-28','2028-02-29','2028-03-01']);
  assert.deepEqual(dateRange('2027-02-28',2),['2027-02-28','2027-03-01']);
  for(const value of ['2027-02-29','2026-11-31','2026-1-01','2026-11-05T00:00:00Z','invalid'])assert.throws(()=>dateRange(value,1));
  for(const count of [0,32,-1,1.5,NaN])assert.throws(()=>dateRange('2026-11-05',count));
  const timezoneScript="import {dateRange} from './scripts/daily-generator.mjs';console.log(JSON.stringify(dateRange('2026-12-31',3)))";
  for(const TZ of ['Pacific/Honolulu','Pacific/Kiritimati']){
    const child=spawnSync(process.execPath,['--input-type=module','-e',timezoneScript],{cwd:root,env:{...process.env,TZ},encoding:'utf8'});
    assert.equal(child.status,0,child.stderr);assert.deepEqual(JSON.parse(child.stdout),dateRange('2026-12-31',3),'UTC dates ignore local timezone');
  }
  const ra=seededRandom('repeat'),rb=seededRandom('repeat'),rc=seededRandom('different');
  const a=Array.from({length:20},ra),b=Array.from({length:20},rb),c=Array.from({length:20},rc);
  assert.deepEqual(a,b);assert.notDeepEqual(a,c);assert.ok(a.every(n=>n>=0&&n<1));
  assert.deepEqual(buildCandidate('same',2),buildCandidate('same',2));
  assert.notEqual(geometryFingerprint(buildCandidate('same',2).recipe),geometryFingerprint(buildCandidate('different',2).recipe));
  assert.notEqual(geometryFingerprint(buildCandidate('same',2).recipe),geometryFingerprint(buildCandidate('same',3).recipe));
  assert.throws(()=>generateQueue({published,start:published.index.entries[0].date,days:1}),/immutable/);
  assert.throws(()=>generateQueue({published,start:manifest.start,days:1,maxAttempts:LIMITS.attemptsPerDate+1}),/Attempt limit/);
  assert.throws(()=>generateQueue({published,start:manifest.start,days:1,seed:''}),/Seed/);

  const regenerated=generateQueue({published,start:manifest.start,days:1,seed:manifest.seed,maxAttempts:manifest.maxAttempts});
  const first=manifest.entries[0],firstRaw=fs.readFileSync(path.join(queueDirectory,first.url),'utf8');
  assert.equal(regenerated.accepted[0].raw,firstRaw,'Seed/date/version reproduce exact checked-in puzzle bytes');
  assert.equal(regenerated.accepted[0].entry.sha256,first.sha256);
  const again=generateQueue({published,start:manifest.start,days:1,seed:manifest.seed,maxAttempts:manifest.maxAttempts});
  assert.deepEqual(regenerated.manifest,again.manifest,'Same-process generation reproduces evidence and provenance, not just geometry');
  const progressError=new Error('intentional progress callback failure');
  assert.throws(()=>generateQueue({published,start:manifest.start,days:1,seed:manifest.seed,onProgress:()=>{throw progressError;}}),error=>error===progressError,'Callback errors propagate, never retry an already accepted date');
  assert.throws(()=>solveCandidate(JSON.parse(firstRaw).recipe,{simulationBudget:0}),/budget exhausted/);
  const badWitness=JSON.parse(firstRaw);badWitness.recipe.solution[1][1]=badWitness.recipe.solution[0][1];
  assert.throws(()=>verifyPuzzle(badWitness),/illegal/,'Live rules reject an occupied destination');
  const repeatEvidence=verifyPuzzle(JSON.parse(firstRaw)),interrupted=verifyPuzzle(JSON.parse(firstRaw),{interrupted:true});
  assert.equal(repeatEvidence.moves,interrupted.moves);assert.equal(repeatEvidence.screws,repeatEvidence.moves);

  const written=path.join(temporary,'written');writeQueue(regenerated,written);assert.equal(fs.readFileSync(path.join(written,first.url),'utf8'),firstRaw);
  assert.throws(()=>writeQueue(regenerated,written),/Output exists/);assert.equal(fs.readFileSync(path.join(written,first.url),'utf8'),firstRaw);
  const brokenOutput=path.join(temporary,'broken-output'),broken={...regenerated,accepted:[...regenerated.accepted,regenerated.accepted[0]]};
  assert.throws(()=>writeQueue(broken,brokenOutput),/EEXIST/);assert.ok(!fs.existsSync(brokenOutput));assert.ok(!fs.readdirSync(temporary).some(n=>n.startsWith('broken-output.staging-')),'Failed write cleans staging and never installs a partial queue');
  // The checked-in first date requires more than one candidate, giving a stable
  // bounded failure without relying on wall-clock cancellation or random luck.
  assert.ok(first.attempt>0,'Failure fixture intentionally exhausts one attempt');
  const failedOutput=path.join(temporary,'bounded-failure');
  const failed=spawnSync(process.execPath,['scripts/generate-daily.mjs','--start',manifest.start,'--days','1','--seed',manifest.seed,'--max-attempts','1','--out',failedOutput],{cwd:fixtureRoot,encoding:'utf8'});
  assert.equal(failed.status,1,failed.stderr);assert.match(failed.stderr,/No verified candidate/);assert.ok(!fs.existsSync(failedOutput),'Exhausted generation creates no output');

  const verified=verifyQueue(queueDirectory,{dailyDirectory:fixtureDaily});assert.equal(verified.accepted.length,14);
  const existing=[...levelRecipes,...published.puzzles.map(p=>p.puzzle.recipe)];
  for(const [i,item]of verified.accepted.entries()){
    assert.equal(hashText(item.raw),item.entry.sha256);assert.equal(item.entry.date,dateRange(manifest.start,14)[i]);
    assert.ok(!existing.some(r=>nearDuplicate(r,item.puzzle.recipe)),'Accepted board is not a campaign/released/queued near clone');existing.push(item.puzzle.recipe);
    assert.equal(item.evidence.moves,item.puzzle.targetMoves);assert.ok(item.evidence.reachesAnchorLowerBound);assert.ok(item.evidence.maxOverlap<LIMITS.maxOverlap);assert.ok(item.evidence.maxHingeError<LIMITS.maxHingeError);assert.ok(item.evidence.minHoleSpacing>=LIMITS.minHoleSpacing);
  }
  const corrupt=singleQueue('corrupt');fs.appendFileSync(path.join(corrupt,first.url),' ');assert.throws(()=>verifyQueue(corrupt,{dailyDirectory:fixtureDaily}),/checksum/);
  const badBaseline=singleQueue('bad-baseline'),changed=JSON.parse(fs.readFileSync(path.join(badBaseline,'manifest.json')));changed.baseline[0].sha256='0'.repeat(64);fs.writeFileSync(path.join(badBaseline,'manifest.json'),JSON.stringify(changed));assert.throws(()=>verifyQueue(badBaseline,{dailyDirectory:fixtureDaily}),/baseline changed/);

  const installed=copyDist('installed'),result=installQueue(queueDirectory,{distDirectory:installed});assert.equal(result.installed,14);assert.equal(result.first,'2026-11-05');assert.equal(result.last,'2026-11-18');
  assertOriginalData(installed);const next=readPublished(path.join(installed,'daily'));assert.equal(next.index.entries.length,21);assert.deepEqual(next.index.entries.filter(e=>e.date<'2026-11-05'),published.index.entries);
  const nextMetadata=readCatalog(fs.readFileSync(path.join(installed,'daily-score-catalog.mjs'),'utf8'));
  for(const row of originalMetadata)assert.deepEqual(nextMetadata.find(n=>n.id===row.id&&n.revision===row.revision),row,'Historical score targets remain unchanged');
  assert.equal(nextMetadata.length,originalMetadata.length+14);const installedIndex=fs.readFileSync(path.join(installed,'daily/index.json'),'utf8');
  assert.throws(()=>installQueue(queueDirectory,{distDirectory:installed}),/Duplicate daily identity|Immutable/);assert.equal(fs.readFileSync(path.join(installed,'daily/index.json'),'utf8'),installedIndex);assert.ok(!fs.existsSync(path.join(installed,'.daily-install.lock')));

  const one=singleQueue('single'),rollback=copyDist('rollback');assert.throws(()=>installQueue(one,{distDirectory:rollback,beforeIndexCommit:()=>{throw Error('injected pre-activation failure');}}),/injected pre-activation failure/);assertPristine(rollback);
  const concurrent=copyDist('concurrent'),external=manifest.entries[1];
  assert.throws(()=>installQueue(one,{distDirectory:concurrent,beforeIndexCommit:()=>{
    const f=path.join(concurrent,'daily/index.json'),index=JSON.parse(fs.readFileSync(f));index.entries.push({date:external.date,id:external.id,url:external.url,sha256:external.sha256});fs.writeFileSync(f,JSON.stringify(index));fs.copyFileSync(path.join(queueDirectory,external.url),path.join(concurrent,'daily',external.url));
  }}),/Source changed during install/);
  const concurrentIndex=JSON.parse(fs.readFileSync(path.join(concurrent,'daily/index.json')));assert.ok(concurrentIndex.entries.some(e=>e.date===external.date),'External edit is preserved, not overwritten or rolled back');assert.ok(fs.existsSync(path.join(concurrent,'daily',external.url)));assert.ok(!fs.existsSync(path.join(concurrent,'daily',first.url)),'Only this installer\'s unactivated files are removed');assert.equal(fs.readFileSync(path.join(concurrent,'daily-score-catalog.mjs'),'utf8'),baselineCatalog);assert.ok(!fs.existsSync(path.join(concurrent,'.daily-install.lock')));
  const locked=copyDist('locked'),lockFile=path.join(locked,'.daily-install.lock');fs.writeFileSync(lockFile,'held');assert.throws(()=>installQueue(one,{distDirectory:locked}),/Another install is active/);assert.equal(fs.readFileSync(lockFile,'utf8'),'held','Rejected installer does not remove another installer\'s lock');fs.rmSync(lockFile);assertPristine(locked);

  // All mutation tests target private temporary copies, never the current app.
  assert.equal(fs.readFileSync(path.join(root,'dist/daily/index.json'),'utf8'),sourceIndex);assert.equal(fs.readFileSync(path.join(root,'dist/daily-score-catalog.mjs'),'utf8'),sourceCatalog);assertOriginalData(path.join(root,'dist'));
  assert.deepEqual(fs.readdirSync(path.join(root,'dist/daily')).sort(),[...sourceDailyFiles.keys()].sort());
  for(const [name,raw]of sourceDailyFiles)assert.equal(fs.readFileSync(path.join(root,'dist/daily',name),'utf8'),raw,'All current daily content, including later adopted dates, stays unchanged');
  console.log(`PASS daily generator:14 live+interrupted verified boards; deterministic seeds/bytes/evidence; UTC rollover/leap/timezones; novelty; bounded failure; hash/schema protection; atomic install/rollback/concurrent-edit preservation; original80+7content and historical scores unchanged. ${Math.round(performance.now()-started)}ms.`);
}finally{fs.rmSync(temporary,{recursive:true,force:true});}

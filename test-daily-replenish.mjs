import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {planReplenishment,replenish} from './scripts/replenish-daily.mjs';
import {readPublished} from './scripts/generate-daily.mjs';
import {DAILY_SCHEMA,DAILY_RULESET} from './dist/daily-data.mjs';
const index=dates=>({schemaVersion:DAILY_SCHEMA,rulesetVersion:DAILY_RULESET,entries:dates.map(date=>({date,id:`daily-${date}-v1`,url:`${date}.json`,sha256:'a'.repeat(64)}))});
assert.deepEqual(planReplenishment(index([]),'2026-12-31T23:59:59Z'),{today:'2026-12-31',through:'2027-01-14',lastPublished:null,start:'2026-12-31',days:15,changed:true,futureDays:14,capacityRemaining:385});
assert.equal(planReplenishment(index([]),'2028-02-20T10:00:00-10:00').through,'2028-03-05');
assert.equal(planReplenishment(index([]),'2026-10-31T23:30:00-02:00').today,'2026-11-01');
assert.equal(planReplenishment(index(['2026-10-01']),'2026-10-31').start,'2026-10-31','Do not silently create backdated challenges');
assert.throws(()=>planReplenishment(index(['2026-10-31','2026-11-02']),'2026-10-31'),/gap/);
const old=Array.from({length:400},(_,i)=>new Date(Date.UTC(2025,0,1+i)).toISOString().slice(0,10));assert.throws(()=>planReplenishment(index(old),'2026-10-31'),/capacity/);
const sourceIndex=fs.readFileSync('dist/daily/index.json','utf8'),published=readPublished(),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'screw-replenish-'));
try{
 const dist=path.join(tmp,'dist');fs.cpSync('dist',dist,{recursive:true});
 const through=published.index.entries.map(e=>e.date).sort().at(-1),coveredToday=new Date(Date.parse(through+'T00:00:00Z')-14*86400000),needsOne=new Date(+coveredToday+86400000);
 const beforeIndex=fs.readFileSync(path.join(dist,'daily/index.json'),'utf8'),beforeCatalog=fs.readFileSync(path.join(dist,'daily-score-catalog.mjs'),'utf8');
 assert.equal(replenish({now:coveredToday,distDirectory:dist,apply:true}).changed,false,'Covered horizon is a safe no-op');
 assert.equal(replenish({now:needsOne,distDirectory:dist}).days,1,'Planning does not write');
 assert.throws(()=>replenish({now:needsOne,distDirectory:dist,apply:true,outputDirectory:path.join(tmp,'failed'),generate(){throw Error('bounded generation failed')}}),/bounded generation failed/);
 assert.equal(fs.readFileSync(path.join(dist,'daily/index.json'),'utf8'),beforeIndex);assert.equal(fs.readFileSync(path.join(dist,'daily-score-catalog.mjs'),'utf8'),beforeCatalog);assert.ok(!fs.existsSync(path.join(tmp,'failed')));
 const result=replenish({now:needsOne,distDirectory:dist,apply:true,outputDirectory:path.join(tmp,'queue')});assert.equal(result.installed,1);assert.equal(result.days,1);
 const after=readPublished(path.join(dist,'daily'));assert.equal(after.index.entries.length,published.index.entries.length+1);
 for(const {entry,raw}of published.puzzles)assert.equal(fs.readFileSync(path.join(dist,'daily',entry.url),'utf8'),raw);
 assert.equal(replenish({now:needsOne,distDirectory:dist,apply:true}).changed,false,'Repeated scheduled run is idempotent');
 assert.equal(fs.readFileSync('dist/daily/index.json','utf8'),sourceIndex);
 console.log('PASS scheduled replenishment:14future-day horizon, UTC/year/leap boundaries, gap/capacity fail-closed, no past backfill, no-op, one actual verified append, repeated-run idempotency, generation failure leaves feed/catalog intact.');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}

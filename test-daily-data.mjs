import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createDailyStore,validateIndex,validatePuzzle,utcDate,DAILY_RULESET,DAILY_LIMITS} from './dist/daily-data.mjs';
const clone=structuredClone,geometry=()=>{};
const puzzle={schemaVersion:1,rulesetVersion:DAILY_RULESET,id:'daily-one',name:'Daily one',recipe:{id:'daily-one',name:'Daily one',tip:'Release a bar.',plates:[[[105,180],[245,180]]],spareCount:1,hidden:[],solution:[[0,[175,35]],[1,[105,180]]]},targetMoves:2,witnessPolicy:'settle-after-each-move-2400'};
const raw=JSON.stringify(puzzle),sha=Buffer.from(await webcrypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))).toString('hex');
const entry={date:'2026-10-29',id:puzzle.id,url:'2026-10-29.json',sha256:sha};
const manifest={schemaVersion:1,rulesetVersion:DAILY_RULESET,entries:[entry]};
const mem=()=>{const values=new Map();return{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),values}};
let requests=[];const fetchOK=async(url,opts)=>{requests.push({url,opts});return new Response(url.endsWith('index.json')?JSON.stringify(manifest):raw)};
const storage=mem(),options={baseURL:'https://example.test/daily/',cryptoImpl:webcrypto,storage,validateGeometry:geometry,fallbackPuzzle:puzzle};
assert.throws(()=>createDailyStore({...options,expectedOrigin:'https://different.test'}),/same-origin/);assert.throws(()=>createDailyStore({...options,baseURL:'https://user:secret@example.test/daily/'}),/credentials/);
let store=createDailyStore({...options,fetchImpl:fetchOK});
assert.equal(utcDate('2026-10-30T00:30:00+02:00'),'2026-10-29');assert.throws(()=>utcDate('bad'));
let refreshed=await store.refresh({now:'2026-10-29T23:59:59Z'});assert.equal(refreshed.today,entry.date);assert.equal(refreshed.entries.length,1);
let result=await store.load(entry.date);assert.equal(result.source,'network');assert.equal(result.cacheSaved,true);assert.deepEqual(result.puzzle,puzzle);assert.equal(result.identity,`${puzzle.id}@${sha}`);assert.ok(requests.every(x=>x.opts.credentials==='same-origin'&&x.opts.redirect==='error'));
assert.equal(store.recordBest(result.identity,5),5);assert.equal(store.recordBest(result.identity,7),5);assert.equal(store.recordBest(result.identity,2),2);assert.equal(store.readProgress()[result.identity],2);assert.equal(storage.getItem('screw-workshop-physics-v4'),null);
store=createDailyStore({...options,fetchImpl:async()=>{throw Error('offline')}});assert.equal((await store.refresh({now:'2026-10-29T12:00Z'})).error,'offline');assert.equal((await store.load(entry.date)).source,'cache');
assert.equal((await store.load('2026-10-28')).source,'fallback');await assert.rejects(()=>store.load('2026-10-30'),/Future/);await assert.rejects(()=>store.load('2026-02-30'),/date/);
// A corrupted cache is never executed or counted as the shared daily.
const cacheKey=[...storage.values.keys()].find(k=>k.includes('cache'));storage.setItem(cacheKey,JSON.stringify({[entry.date]:{raw:raw.replace('Daily one','Hacked')}}));store=createDailyStore({...options,fetchImpl:async()=>{throw Error('offline')}});await store.refresh({now:'2026-10-29'});assert.equal((await store.load(entry.date)).source,'fallback');
const native=createDailyStore({...options,baseURL:'file:///App/Web/daily/',networkEnabled:false,fetchImpl:()=>{throw Error('must not run')}});await native.refresh({now:'2026-10-29'});assert.equal((await native.load(entry.date)).source,'fallback');
const mutate=fn=>{let p=clone(puzzle);fn(p);assert.throws(()=>validatePuzzle(p,{validateGeometry:geometry}));};
mutate(p=>p.recipe.name='<img src=x onerror=alert(1)>');mutate(p=>p.rulesetVersion='future');mutate(p=>p.targetMoves=1);mutate(p=>p.recipe.plates[0][0]=[Infinity,180]);mutate(p=>p.recipe.plates[0][0]=[-1,180]);mutate(p=>p.recipe.solution[0][1]=[15,15]);mutate(p=>p.recipe.solution[0][0]=99);mutate(p=>p.recipe.hidden=[[175,35]]);mutate(p=>p.recipe.solution=Array(41).fill([0,[175,35]]));mutate(p=>p.recipe.plates=Array(11).fill([[105,180],[245,180]]));mutate(p=>Object.defineProperty(p.recipe,'__proto__',{value:'bad',enumerable:true}));
assert.throws(()=>validatePuzzle(puzzle),/validator/);assert.throws(()=>validatePuzzle(puzzle,{validateGeometry:()=>{throw Error('overlap')}}),/overlap/);
const badIndex=fn=>{let i=clone(manifest);fn(i);assert.throws(()=>validateIndex(i));};badIndex(i=>i.entries[0].url='https://evil.test/p.json');badIndex(i=>i.entries[0].url='../p.json');badIndex(i=>i.entries.push(i.entries[0]));badIndex(i=>i.entries[0].date='2026-02-30');badIndex(i=>i.entries[0].sha256='x');
// Future published rows are not offered or loadable until the UTC day arrives.
const future=clone(manifest);future.entries.push({...entry,date:'2026-10-30',id:'daily-two',url:'two.json'});let f=createDailyStore({...options,storage:mem(),fetchImpl:async()=>new Response(JSON.stringify(future))});assert.equal((await f.refresh({now:'2026-10-29'})).entries.length,1);await assert.rejects(()=>f.load('2026-10-30'),/Future/);
// Published dates cannot silently acquire a different ID/hash on refresh.
const changed=clone(manifest);changed.entries[0].sha256='f'.repeat(64);let imm=createDailyStore({...options,fetchImpl:async()=>new Response(JSON.stringify(changed))});assert.match((await imm.refresh({now:'2026-10-29'})).error,/identity changed/);
for(const response of [()=>new Response('x'.repeat(DAILY_LIMITS.indexBytes+1)),()=>new Response('{}',{headers:{'content-length':String(DAILY_LIMITS.indexBytes+1)}}),()=>new Response('{broken'),()=>new Response('{}',{status:503})]){let s=createDailyStore({...options,storage:mem(),fetchImpl:async()=>response()});assert.ok((await s.refresh({now:'2026-10-29'})).error);assert.equal((await s.load(entry.date)).source,'fallback');}
// Bad storage, unknown fields and hostile cached text fail closed.
const broken={getItem:()=>'{broken',setItem:()=>{throw Error('quota')}};let safe=createDailyStore({...options,storage:broken,networkEnabled:false});assert.deepEqual(safe.readProgress(),{});assert.throws(()=>safe.recordBest(`${puzzle.id}@${sha}`,3),/could not be saved/);
const oversizedPuzzle=createDailyStore({...options,storage:mem(),fetchImpl:async url=>new Response(url.endsWith('index.json')?JSON.stringify(manifest):'x'.repeat(DAILY_LIMITS.puzzleBytes+1))});await oversizedPuzzle.refresh({now:'2026-10-29'});assert.equal((await oversizedPuzzle.load(entry.date)).source,'fallback');
const noStorage=createDailyStore({...options,storage:null,networkEnabled:false});assert.throws(()=>noStorage.recordBest(`${puzzle.id}@${sha}`,2),/could not be saved/);
const quotaStore=createDailyStore({...options,storage:null,fetchImpl:fetchOK});await quotaStore.refresh({now:'2026-10-29'});assert.equal((await quotaStore.load(entry.date)).cacheSaved,false);
const pruned=createDailyStore({...options,fetchImpl:async()=>new Response(JSON.stringify({...manifest,entries:[]}))});assert.equal((await pruned.refresh({now:'2026-10-29'})).entries.length,1);assert.equal(pruned.archive()[0].id,puzzle.id);
const noCrypto=createDailyStore({...options,storage:mem(),cryptoImpl:null,fetchImpl:fetchOK});await noCrypto.refresh({now:'2026-10-29'});const practice=await noCrypto.load(entry.date);assert.equal(practice.source,'fallback');assert.match(practice.error,/hashing unavailable/);assert.equal(noCrypto.recordBest(practice.identity,2),2);
console.log('PASS daily data:UTC,strict schema,hashes,network/cache/fallback,future dates,immutable dates,unsafe URLs/text,oversize/corrupt storage,separate bests,native network-disabled.');

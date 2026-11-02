// Local-only contract tests: injected tag loader never contacts Google.
import assert from 'node:assert/strict';
import {createAnalytics} from './dist/analytics.mjs';

const KEY='screw-workshop-analytics-consent-v1';
const ID='G-DG754SQQL6';
const events=fixture=>(fixture.window.dataLayer||[]).filter(row=>row[0]==='event');
function fixture(options={}){
 const values=new Map(Object.entries(options.saved||{}));
 const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
 const window={location:{href:'https://paulnord.github.io/screw-workshop/?email=secret@example.test#private',origin:'https://paulnord.github.io',pathname:'/screw-workshop/'},document:{title:'Screw Workshop',referrer:'https://example.test/?email=secret@example.test'}};
 let loads=0;
 const loadTag=async id=>{loads++;assert.equal(id,ID);if(options.loader)await options.loader(id)};
 const controller=createAnalytics({window,storage,loadTag,native:false,enabled:true,measurementId:ID,...options.overrides});
 return {controller,window,storage,values,get loads(){return loads}};
}
const f=fixture(),a=f.controller;
assert.equal(a.consent(),'unknown');
assert.equal(f.loads,0);
assert.equal(a.track('login',{method:'password'}),false);
a.newAttempt('campaign');a.firstMove();a.completeAttempt();
assert.equal(f.loads,0);assert.equal(events(f).length,0);
await a.choose('denied');
assert.equal(a.consent(),'denied');assert.equal(f.values.get(KEY),'denied');assert.equal(f.loads,0);
await a.choose('granted');
assert.equal(a.consent(),'granted');assert.equal(f.values.get(KEY),'granted');assert.equal(f.loads,1);
assert.equal(events(f).filter(e=>e[1]==='page_view').length,1);
assert.equal(events(f).filter(e=>e[1]==='level_start'||e[1]==='level_end').length,0,'No replay of pre-consent activity');
await a.choose('granted');assert.equal(f.loads,1);
assert.equal(events(f).filter(e=>e[1]==='page_view').length,1,'Repeated grant does not duplicate a visit');

a.newAttempt('campaign');a.firstMove();a.firstMove();a.completeAttempt();a.completeAttempt();
assert.equal(events(f).filter(e=>e[1]==='level_start').length,1);
assert.equal(events(f).filter(e=>e[1]==='level_end').length,1);
assert.equal(events(f).find(e=>e[1]==='level_start')[2].game_mode,'campaign');
assert.equal(events(f).find(e=>e[1]==='level_end')[2].success,true);
for(const mode of ['daily','practice']){a.newAttempt(mode);a.firstMove();a.completeAttempt()}
assert.deepEqual(events(f).filter(e=>e[1]==='level_start').map(e=>e[2].game_mode),['campaign','daily','practice']);
const beforeNoStart=events(f).length;a.newAttempt('daily');a.completeAttempt();assert.equal(events(f).length,beforeNoStart,'Read-only daily results are not completions');

assert.equal(a.track('sign_up',{method:'password',email:'secret@example.test',uid:'private-uid',progress:{moves:123}}),true);
assert.equal(a.track('login',{method:'password',email:'secret@example.test'}),true);
assert.equal(a.track('unapproved_event',{email:'secret@example.test'}),false);
const serialized=JSON.stringify(f.window.dataLayer);
assert(!serialized.includes('secret@example.test'),'Do not leak query strings, referrers or event fields');
assert(!serialized.includes('private-uid'));assert(!serialized.includes('progress'));
for(const e of events(f).filter(e=>e[1]==='sign_up'||e[1]==='login'))assert.equal(e[2].method,'password');

a.newAttempt('campaign');a.firstMove();
await a.choose('denied');const deniedCount=events(f).length;
a.completeAttempt();a.track('login',{method:'password'});
assert.equal(events(f).length,deniedCount);assert.equal(f.window['ga-disable-'+ID],true);
await a.choose('granted');const resumedCount=events(f).length;
a.completeAttempt();a.firstMove();assert.equal(events(f).length,resumedCount,'Consent generation changes never resume an old attempt');
a.newAttempt('campaign');a.firstMove();a.completeAttempt();assert.equal(events(f).length,resumedCount+2);

const denied=fixture({saved:{[KEY]:'denied'}});await denied.controller.ready();assert.equal(denied.controller.consent(),'denied');assert.equal(denied.loads,0);
const remembered=fixture({saved:{[KEY]:'granted'}});await remembered.controller.ready();assert.equal(remembered.loads,1);assert.equal(events(remembered).filter(e=>e[1]==='page_view').length,1);
const corrupt=fixture({saved:{[KEY]:'invalid'}});await corrupt.controller.ready();assert.equal(corrupt.controller.consent(),'unknown');assert.equal(corrupt.loads,0);
for(const overrides of [{native:true},{enabled:false}]){
 const inert=fixture({saved:{[KEY]:'granted'},overrides});await inert.controller.ready();await inert.controller.choose('granted');inert.controller.track('login',{method:'password'});
 assert.equal(inert.loads,0);assert.equal(events(inert).length,0);
}

let finishLoad;
const race=fixture({loader:()=>new Promise(resolve=>{finishLoad=resolve})});
const pending=race.controller.choose('granted');
await Promise.resolve();assert.equal(race.loads,1);
race.controller.newAttempt('daily');race.controller.firstMove();
await race.controller.choose('denied');
finishLoad();await pending;
assert.equal(events(race).length,0,'Late script load after withdrawal must not configure a visit or send events');
assert.equal(race.window['ga-disable-'+ID],true);
assert.equal(race.controller.consent(),'denied');

let completeSharedLoad;
const regrant=fixture({loader:()=>new Promise(resolve=>{completeSharedLoad=resolve})});
const firstGrant=regrant.controller.choose('granted');
await Promise.resolve();
await regrant.controller.choose('denied');
const secondGrant=regrant.controller.choose('granted');
const repeatedGrant=regrant.controller.choose('granted');
await Promise.resolve();
assert.equal(regrant.loads,1,'Repeated grant and withdrawal/regrant share a pending tag load');
completeSharedLoad();await Promise.all([firstGrant,secondGrant,repeatedGrant]);
assert.equal(events(regrant).filter(e=>e[1]==='page_view').length,1);
assert.equal(regrant.window['ga-disable-'+ID],false);
assert.equal(regrant.controller.track('login',{method:'password'}),true);

// Choices other than the two explicitly supported states cannot authorize loading.
const invalid=fixture();
for(const choice of [true,false,'yes','',null,undefined])await invalid.controller.choose(choice);
assert.equal(invalid.controller.consent(),'unknown');assert.equal(invalid.loads,0);
for(const measurementId of ['G-<script>','',null]){
 const badConfig=fixture({overrides:{measurementId}});
 await badConfig.controller.choose('granted');assert.equal(badConfig.loads,0);assert.equal(events(badConfig).length,0);
}

const blocked=fixture({loader:()=>{throw Error('blocked')}});
await assert.doesNotReject(()=>blocked.controller.choose('granted'));
assert.equal(blocked.controller.track('login',{method:'password'}),false);assert.equal(events(blocked).length,0);
const unavailable=fixture({overrides:{storage:{getItem(){throw Error('blocked')},setItem(){throw Error('quota')}}}});
assert.equal(unavailable.controller.consent(),'unknown');await assert.doesNotReject(()=>unavailable.controller.choose('granted'));
unavailable.controller.newAttempt('campaign');unavailable.controller.firstMove();unavailable.controller.completeAttempt();
await assert.doesNotReject(()=>unavailable.controller.choose('denied'));
console.log('PASS opt-in analytics: no pre-consent network/events, strict payloads, attempt deduplication, withdrawal/races, persistence, native exclusion, and isolated failures. No live analytics requests were sent.');

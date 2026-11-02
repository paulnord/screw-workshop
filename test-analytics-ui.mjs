// DOM-double consent integration tests; no browser or live analytics requests.
import assert from 'node:assert/strict';
import {createAnalytics,CONSENT_KEY,ANALYTICS_ID} from './dist/analytics.mjs';
import {installAnalyticsUI} from './dist/analytics-ui.mjs';
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.attrs={};this.dataset={};this.hidden=false;this.textContent='';this.focused=0;this.scrolled=0}
 append(...elements){this.children.push(...elements)}
 setAttribute(name,value){this.attrs[name]=value}
 set innerHTML(html){this.html=html;this.buttons=[...html.matchAll(/<button data-analytics="([^"]+)">([^<]+)<\/button>/g)].map(([,choice,label])=>{const button=new Element('button');button.dataset.analytics=choice;button.textContent=label;return button});this.status=new Element('p')}
 get innerHTML(){return this.html}
 querySelectorAll(selector){return selector==='[data-analytics]'?this.buttons:[]}
 querySelector(selector){if(selector==='[data-analytics-status]')return this.status;if(selector==='button')return this.buttons[0];return null}
 focus(){this.focused++}scrollIntoView(){this.scrolled++}
}
const flush=async()=>{await Promise.resolve();await Promise.resolve();await Promise.resolve()};
function fixture({choice,enabled=true,native=false,shared=null}={}){
 const values=shared?.values||new Map(choice?[[CONSENT_KEY,choice]]:[]),listeners=new Map();
 const main=new Element('main'),footer=new Element('footer'),cookieWrites=[],actions=[];
 let loads=0,reloads=0,writes=0,gameplayMoves=9;
 const doc={createElement:tag=>new Element(tag),querySelector:selector=>selector==='main'?main:selector==='footer'?footer:null,get cookie(){return '_ga=keep; _ga_OTHER=keep; screw_workshop_ga=old; screw_workshop_ga_DG754SQQL6=old; unrelated=keep'},set cookie(value){cookieWrites.push(value)}};
 const win={document:doc,location:{hostname:'paulnord.github.io',reload(){actions.push('reload');assert.equal(win['ga-disable-'+ANALYTICS_ID],true,'Disable must precede reload');reloads++}},addEventListener:(name,listener)=>listeners.set(name,listener)};
 const storage={getItem:key=>values.get(key)??null,setItem(key,value){writes++;const oldValue=values.get(key)??null;values.set(key,value);actions.push('store:'+value);if(oldValue!==value)shared?.notify?.({key,newValue:value,oldValue},win)}};
 const analytics=createAnalytics({window:win,storage,enabled,native,loadTag:async()=>{loads++}});
 installAnalyticsUI({analytics,enabled,native,document:doc,window:win});
 return {analytics,win,doc,main,footer,values,listeners,cookieWrites,actions,panel:main.children[0],settings:footer.children[0],get loads(){return loads},get reloads(){return reloads},get writes(){return writes},get gameplayMoves(){return gameplayMoves}};
}
for(const flags of [{enabled:false},{native:true}]){
 const f=fixture(flags);assert.equal(f.main.children.length,0);assert.equal(f.footer.children.length,0);assert.equal(f.listeners.size,0);assert.equal(f.loads,0);
}
const unknown=fixture();
assert.equal(unknown.panel.hidden,false);assert.equal(unknown.panel.tagName,'section','Consent never blocks gameplay with a modal');
assert.equal(unknown.panel.attrs['aria-label'],'Optional usage analytics');assert.equal(unknown.loads,0);
assert.deepEqual(unknown.panel.buttons.map(b=>b.dataset.analytics),['denied','granted']);
assert.deepEqual(unknown.panel.buttons.map(b=>b.textContent),['No thanks','Allow analytics']);
assert(!unknown.panel.html.includes('class="primary"'),'Both choices use equal button styling');
assert.match(unknown.panel.html,/rel="noopener noreferrer"/);
unknown.panel.buttons[0].onclick();await flush();
assert.equal(unknown.analytics.consent(),'denied');assert.equal(unknown.panel.hidden,true);assert.equal(unknown.loads,0);assert.equal(unknown.reloads,0);assert.equal(unknown.gameplayMoves,9);
assert(unknown.cookieWrites.length>0);
assert(unknown.cookieWrites.every(value=>/^screw_workshop_ga(?:_|=)/.test(value)&&value.includes('path=/screw-workshop/')),'Delete only this game’s analytics cookies, never other projects’ cookies');
unknown.settings.onclick();assert.equal(unknown.panel.hidden,false);assert.match(unknown.panel.status.textContent,/off/);assert.equal(unknown.panel.buttons[0].focused,1);
unknown.settings.onclick();assert.equal(unknown.panel.hidden,true);unknown.settings.onclick();assert.equal(unknown.panel.hidden,false);assert.equal(unknown.panel.scrolled,2);
unknown.panel.buttons[1].onclick();await unknown.analytics.ready();await flush();
assert.equal(unknown.analytics.consent(),'granted');assert.equal(unknown.loads,1);assert.equal(unknown.panel.hidden,true);
unknown.settings.onclick();assert.match(unknown.panel.status.textContent,/withdraw consent/);
unknown.panel.buttons[0].onclick();await flush();
assert.equal(unknown.analytics.consent(),'denied');assert.equal(unknown.reloads,1);assert.equal(unknown.win['ga-disable-'+ANALYTICS_ID],true);assert.equal(unknown.gameplayMoves,9);
for(const choice of ['granted','denied']){const f=fixture({choice});await f.analytics.ready();assert.equal(f.panel.hidden,true);assert.equal(f.loads,choice==='granted'?1:0)}

// A real storage event fires only in other windows and only when the value changes.
const peers=[],shared={values:new Map([[CONSENT_KEY,'granted']]),notify(event,source){for(const peer of peers)if(peer.win!==source)peer.listeners.get('storage')?.(event)}};
const first=fixture({shared}),second=fixture({shared});peers.push(first,second);await Promise.all(peers.map(p=>p.analytics.ready()));
first.settings.onclick();first.panel.buttons[0].onclick();await flush();
assert.equal(first.analytics.consent(),'denied');assert.equal(second.analytics.consent(),'denied');assert.equal(first.reloads,1);assert.equal(second.reloads,1);
assert(first.writes+second.writes<=2,'A same-value storage write must not produce a ping-pong loop');
const unrelatedWrites=second.writes;second.listeners.get('storage')({key:'unrelated',newValue:'granted'});assert.equal(second.writes,unrelatedWrites);
const removed=fixture({choice:'granted'});await removed.analytics.ready();removed.listeners.get('storage')({key:CONSENT_KEY,newValue:null});await flush();assert.equal(removed.analytics.consent(),'denied');assert.equal(removed.reloads,1);
const cleared=fixture({choice:'granted'});await cleared.analytics.ready();cleared.listeners.get('storage')({key:null,newValue:null});await flush();assert.equal(cleared.analytics.consent(),'denied','Clearing browser storage in another tab revokes consent');assert.equal(cleared.reloads,1);
console.log('PASS analytics consent UI gates, choice states, equal controls, non-modal decline, settings reopening, disable-before-reload withdrawal, and cross-tab revocation without write loops. DOM double only; no live tracking.');

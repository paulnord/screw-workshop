// UI state/race tests with a small DOM and engine double; real browser/physics QA is separate.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('./dist/app.mjs',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
const elements=new Map(),campaignWrites=[],dailyWrites=[];
class El{
 constructor(){this.textContent='';this._html='';this.children=[];this.style={};this.attrs={};this.listeners={};this.classList={add(){},remove(){},toggle(){}};this.dataset={};this.open=false}
 set innerHTML(s){this._html=s;for(const m of s.matchAll(/id="([^"]+)"/g))get('#'+m[1]);this.buttons=[...s.matchAll(/data-daily-date="([^"]+)"/g)].map(m=>{const b=new El();b.dataset.dailyDate=m[1];return b})}
 get innerHTML(){return this._html}
 append(...x){this.children.push(...x)}replaceChildren(...x){this.children=x}setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]}addEventListener(k,f){this.listeners[k]=f}showModal(){this.open=true}close(){this.open=false;this.listeners.close?.()}getBoundingClientRect(){return {left:0,top:0,right:350,bottom:430,width:350,height:430}}
}
function get(k){if(!elements.has(k))elements.set(k,new El());return elements.get(k)}
const levels=Array.from({length:80},(_,i)=>({id:'level-'+i,name:'Puzzle '+i,tip:'A safe tip',plates:[[0,1]],spares:[2],solution:[[0,2],[1,0]]}));
const originalRecipe={id:'first',name:'First',tip:'Tip',plates:[[[105,180],[245,180]]],spareCount:1,hidden:[],solution:[[0,[175,35]],[1,[105,180]]]};
const triangle=[{x:0,y:0},{x:10,y:0},{x:0,y:10}];
const createWorld=(level,snap)=>({level,moves:snap?.moves||0,positions:[0,1],removed:0,settled:true,plates:[{position:{x:0,y:0},angle:0,plugin:{outline:triangle,holes:[],material:[triangle],cleared:false}}]});
let bests={},loadResult={date:'2026-10-29',identity:'day@hash',recipe:{...levels[0],id:'daily'},puzzle:{name:'Dated puzzle'},source:'network'},pendingLoad=null,pendingRefresh=null,saveFails=false;
const store={readProgress:()=>bests,recordBest:(id,moves)=>{if(saveFails)throw Error('quota');bests[id]=Math.min(bests[id]??Infinity,moves);dailyWrites.push({id,moves});return bests[id]},refresh:()=>pendingRefresh||Promise.resolve({today:'2026-10-29',entries:[],error:null}),load:()=>pendingLoad||Promise.resolve(loadResult),archive:()=>[]};
const document={querySelector:get,querySelectorAll:s=>s==='[data-daily-date]'?get('#dialogbody').buttons||[]:[],createElement:()=>new El(),createElementNS:()=>new El(),addEventListener(){},hidden:false,documentElement:{classList:{add(){}}}};
const context={document,window:{addEventListener(){}},location:{href:'https://example.test/'},URL,Date,console,localStorage:{getItem(){return null},setItem(k,v){campaignWrites.push({k,value:JSON.parse(v)})}},matchMedia:()=>({matches:true}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},performance,
 levels,levelRecipes:[originalRecipe],cells:[{x:105,y:180},{x:245,y:180},{x:175,y:35}],holes:()=>[0,1,2],createWorld,snapshot:s=>({moves:s.moves}),move:s=>{s.moves++;return s},complete:s=>s.moves>=2,step(){},settle:s=>{s.settled=true},accessible:()=>true,destinations:()=>[2],hint:()=>({text:'Hint'}),isSpare:(l,h)=>h===2,plateForBolt:()=>0,attachmentCount:()=>2,STEP:8,validateDailyRecipe(){},compileDailyRecipe:r=>({...r}),createDailyStore:()=>store,
 recordBest:(b,id,n)=>({...b,[id]:n}),normalizeProgress:()=>({bests:{},done:new Set(),index:0,unlockedPacks:8}),serializeProgress:(i,l,d,b,u)=>({campaign:'shapes-80',levelId:l[i].id,level:i,done:[...d],bests:b,unlockedPacks:u}),starsFor:(n,t)=>n? n<=t?3:n<=t+2?2:1:0,packProgress:()=>[],isLevelUnlocked:i=>i>=0&&i<80,PACK_SIZE:10,unlockedPackCount:()=>8};
vm.createContext(context);vm.runInContext(source+'\nglobalThis.testUI={start,showDaily,loadDailyDate,currentLevel,restartCurrent,render,openDialog,state:()=>({index,daily,sim,done,bests})};',context);
const ui=context.testUI;
ui.start(17);assert.equal(ui.state().index,17);const campaignBefore=JSON.stringify(campaignWrites.at(-1));
await ui.showDaily();assert.equal(get('#dialog').open,true);await ui.loadDailyDate('2026-10-29');
assert.equal(ui.state().index,17);assert.equal(ui.currentLevel().id,'daily');assert.equal(get('#number').textContent,'DAILY · 2026-10-29 UTC');
ui.state().sim.moves=2;ui.render();assert.equal(dailyWrites.at(-1).id,'day@hash');assert.equal(JSON.stringify(campaignWrites.at(-1)),campaignBefore);assert.equal(ui.state().done.size,0);assert.equal(get('#next').textContent,'');assert.match(get('#win').innerHTML,/Daily archive/);
ui.restartCurrent();assert.equal(ui.state().sim.moves,0);assert.equal(ui.currentLevel().id,'daily');get('#returncampaign').onclick();assert.equal(ui.currentLevel().id,'level-17');assert.equal(ui.state().daily,null);
// Close or navigate while a load is pending: late resolution must not replace campaign.
await ui.showDaily();let resolveLoad;pendingLoad=new Promise(r=>resolveLoad=r);const p=ui.loadDailyDate('2026-10-29');get('#dialog').close();ui.start(23);resolveLoad(loadResult);await p;pendingLoad=null;assert.equal(ui.currentLevel().id,'level-23');
// A newer modal also invalidates a pending refresh.
let resolveRefresh;pendingRefresh=new Promise(r=>resolveRefresh=r);const q=ui.showDaily();ui.openDialog('Help','<p>Help</p>');resolveRefresh({today:'2026-10-29',entries:[],error:null});await q;pendingRefresh=null;assert.equal(get('#dialogtitle').textContent,'Help');
// Fallback is clearly practice, separate from dated credit and campaign progress.
loadResult={...loadResult,source:'fallback',identity:'fallback:practice@hash',puzzle:{name:'Offline practice'}};await ui.showDaily();await ui.loadDailyDate('2026-10-29');assert.equal(get('#number').textContent,'OFFLINE PRACTICE');assert.match(get('#dailystatus').textContent,/not today/);
saveFails=true;ui.state().sim.moves=2;ui.render();assert.match(get('#dailystatus').textContent,/could not be saved/);
// Remote text never enters the level heading as HTML; archive values are escaped.
assert.match(source,/\$\('#name'\)\.textContent=l\.name/);assert.match(source,/escapeHTML\(e\.date\)/);assert.doesNotMatch(source,/\$\('#name'\)\.innerHTML/);
console.log('PASS daily UI mode isolation, bests, restart, fallback labels, save failures, close/navigation/loading races and safe text boundaries. Browser layout and real physics tested separately.');

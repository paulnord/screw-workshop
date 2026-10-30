// Read-only score/calendar calculations. Dates are UTC; practice never counts.
import {starsFor} from './progress.mjs';
import {dailyScoreCatalog} from './daily-score-catalog.mjs';
export {dailyScoreCatalog};
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
export function dailyDateForIdentity(identity,catalog=dailyScoreCatalog){
 const known=catalog.find(e=>`${e.id}@${e.revision}`===identity);if(known)return known.date;
 const match=/^daily-(\d{4}-\d{2}-\d{2})-v\d+@[a-f0-9]{64}$/.exec(identity||'');return match&&validDate(match[1])?match[1]:null;
}
export function summarizeDaily(progress={},catalog=dailyScoreCatalog){
 const byDate={};
 for(const [identity,moves] of Object.entries(progress||{})){
  if(!Number.isInteger(moves)||moves<1||moves>100000)continue;
  const date=dailyDateForIdentity(identity,catalog);if(!date)continue;
  const meta=catalog.find(e=>`${e.id}@${e.revision}`===identity),earned=meta?starsFor(moves,meta.targetMoves):null;
  const value={date,identity,moves,stars:earned,name:meta?.name||'Daily challenge',targetMoves:meta?.targetMoves??null};
  const old=byDate[date];
  // Multiple imported/historical revisions count as one completed date. Preserve
  // the highest known earned stars; never guess a target for an unknown revision.
  if(!old||(earned??-1)>(old.stars??-1)||(earned===old.stars&&moves<old.moves))byDate[date]=value;
 }
 const values=Object.values(byDate),total=items=>({completed:items.length,stars:items.reduce((n,r)=>n+(r.stars??0),0),unknownStars:items.filter(r=>r.stars===null).length});
 return {byDate,...total(values),month:month=>total(values.filter(r=>r.date.startsWith(month+'-')))};
}
export function shiftMonth(month,offset){
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)||!Number.isInteger(offset))throw Error('Invalid calendar month');
 const d=new Date(month+'-01T00:00:00Z');d.setUTCMonth(d.getUTCMonth()+offset);return d.toISOString().slice(0,7);
}
export function calendarMonth(month,today,entries=[],progress={},catalog=dailyScoreCatalog){
 shiftMonth(month,0);if(!validDate(today))throw Error('Invalid UTC date');
 const first=new Date(month+'-01T00:00:00Z'),next=new Date(shiftMonth(month,1)+'-01T00:00:00Z'),count=Math.round((next-first)/86400000),summary=summarizeDaily(progress,catalog);
 const days=Array.from({length:count},(_,i)=>{const date=month+'-'+String(i+1).padStart(2,'0'),result=summary.byDate[date]||null,state=result?'completed':date>today?'future':entries.some(e=>e.date===date)?'available':'unavailable';return {date,day:i+1,result,state,today:date===today}});
 return {month,label:first.toLocaleDateString('en',{month:'long',year:'numeric',timeZone:'UTC'}),offset:(first.getUTCDay()+6)%7,days,summary:summary.month(month),allTime:{completed:summary.completed,stars:summary.stars,unknownStars:summary.unknownStars}};
}

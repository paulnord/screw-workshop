#!/usr/bin/env node
// Scheduled build-time replenishment. Local files only; Git/Pages are workflow-owned.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {utcDate,validateIndex,DAILY_LIMITS} from '../dist/daily-data.mjs';
import {dateRange} from './daily-generator.mjs';
import {readPublished,generateQueue,writeQueue} from './generate-daily.mjs';
import {installQueue} from './install-daily-queue.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export const FUTURE_DAYS=14;
const plus=(date,n)=>utcDate(Date.parse(date+'T00:00:00Z')+n*86400000);
export function planReplenishment(index,now=new Date()){
 validateIndex(index);const today=utcDate(now),through=plus(today,FUTURE_DAYS),dates=index.entries.map(e=>e.date).sort(),last=dates.at(-1)||null,set=new Set(dates);
 // Do not hide a hole in an existing future queue behind its latest date.
 if(last&&last>=today)for(let date=today;date<=last;date=plus(date,1))if(!set.has(date))throw Error(`Existing future queue has a gap at ${date}; review before replenishing`);
 const start=last&&last>=today?plus(last,1):today;
 const days=start>through?0:Math.round((Date.parse(through+'T00:00:00Z')-Date.parse(start+'T00:00:00Z'))/86400000)+1;
 if(days>31||dates.length+days>DAILY_LIMITS.entries)throw Error('Daily archive capacity/batch limit reached; preserve content and request maintenance');
 return {today,through,lastPublished:last,start:days?start:null,days,changed:days>0,futureDays:FUTURE_DAYS,capacityRemaining:DAILY_LIMITS.entries-dates.length-days};
}
export function replenish({now=new Date(),distDirectory=path.join(root,'dist'),outputDirectory,apply=false,generate=generateQueue}={}){
 const published=readPublished(path.join(distDirectory,'daily')),plan=planReplenishment(published.index,now);
 if(!apply||!plan.changed)return {...plan,installed:0};
 if(!outputDirectory)throw Error('An output directory is required to apply replenishment');
 const queue=generate({start:plan.start,days:plan.days,published});
 // No install is attempted until the entire requested batch verifies/generates.
 writeQueue(queue,outputDirectory);const installed=installQueue(outputDirectory,{distDirectory});
 return {...plan,...installed,queueDirectory:path.resolve(outputDirectory),statistics:queue.statistics};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const args=process.argv.slice(2),apply=args[0]==='--apply';if(!['--plan','--apply'].includes(args[0])||(apply?(args.length!==3||args[1]!=='--output'):args.length!==1))throw Error('Usage: node scripts/replenish-daily.mjs --plan | --apply --output directory');console.log(JSON.stringify(replenish({apply,outputDirectory:args[2]}),null,2));}
 catch(error){console.error(JSON.stringify({error:error.message,...error.report},null,2));process.exitCode=1;}
}

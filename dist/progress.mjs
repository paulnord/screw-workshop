// Local, low-pressure move scores. No timers, streaks, ranks, or network storage.
export function normalizeBests(value){const result={};if(!value||typeof value!=='object'||Array.isArray(value))return result;for(const[id,n]of Object.entries(value))if(/^[a-z0-9-]+$/.test(id)&&Number.isInteger(n)&&n>0&&n<=100000)result[id]=n;return result}
export function recordBest(bests,id,moves){const clean=normalizeBests(bests);if(!/^[a-z0-9-]+$/.test(id)||!Number.isInteger(moves)||moves<1||moves>100000)return clean;clean[id]=Math.min(clean[id]??Infinity,moves);return clean}
export const packNames=['First turns','Shape workshop','Master assemblies','Chain reactions','Pivot craft','Hidden in plain sight','Support systems','Master keys'];
export function starsFor(moves,target){if(!Number.isInteger(moves)||moves<1)return 0;if(!Number.isInteger(target)||target<1)return 1;return moves<=target?3:moves<=target+2?2:1}
// Stable pre-expansion order: old numeric resumes must not land on a new puzzle.
export const legacyLevelIds=["v4-first-turn","v4-choose-hinge","v4-hanging-keystone","v4-catch-and-release","v4-broken-chevron","v4-swing-gate","v4-three-point-balance","v4-switchback","v4-the-hook","v4-open-basket","v4-crossbar-gate","v4-top-heavy-lever","v5-cradle","v5-pendulum-relay","v5-offset-key","v5-locksmith","v6-pivot-fan","v6-pivot-hammer","v6-pivot-stair","v6-pivot-crown","v6-pocket-lid","v6-turnstile","v6-secret-shelf","v6-offset-escapement","v6-cantilever-cargo","v6-stair-descent","v6-split-trestle","v6-fork-lift","v6-suspended-switch","v6-arrow-lock","v6-cornerstone","v6-final-turn"];
export const PACK_SIZE=10, PACK_REQUIRED=7;
const safeUnlocked=n=>Number.isInteger(n)?Math.max(1,Math.min(packNames.length,n)):1;
export function packProgress(levels,done,unlockedPacks=1){
 const earned=safeUnlocked(unlockedPacks), packs=[];
 for(let i=0;i<packNames.length;i++)packs.push({name:packNames[i],index:i,completed:levels.slice(i*PACK_SIZE,(i+1)*PACK_SIZE).filter(l=>done.has(l.id)).length,unlocked:i<earned||(i>0&&packs[i-1].unlocked&&packs[i-1].completed>=PACK_REQUIRED)});
 return packs;
}
export function unlockedPackCount(levels,done,unlockedPacks=1){return packProgress(levels,done,unlockedPacks).filter(p=>p.unlocked).length}
export function isLevelUnlocked(index,levels,done,unlockedPacks=1){return Number.isInteger(index)&&index>=0&&index<levels.length&&!!packProgress(levels,done,unlockedPacks)[Math.floor(index/PACK_SIZE)]?.unlocked}
function legacyUnlocks(done){let count=1;for(let p=0;p<packNames.length-1;p++){if(legacyLevelIds.slice(p*4,p*4+4).filter(id=>done.has(id)).length<3)break;count++}return count}
export function normalizeProgress(saved,levels){
 if(!saved||typeof saved!=='object')saved={};
 const ids=new Set(levels.map(l=>l.id)),bests=Object.fromEntries(Object.entries(normalizeBests(saved.bests)).filter(([id])=>ids.has(id)));
 const done=new Set([...(Array.isArray(saved.done)?saved.done:[]),...Object.keys(bests)].filter(id=>ids.has(id)));
 const current=saved.campaign==='shapes-80';
 // Old 3-of-4 unlocks are honored once. New saves cannot repeatedly earn them.
 const unlockedPacks=unlockedPackCount(levels,done,current?safeUnlocked(saved.unlockedPacks):legacyUnlocks(done));
 const resumeId=typeof saved.levelId==='string'?saved.levelId:!current&&Number.isInteger(saved.level)?legacyLevelIds[saved.level]:null;
 let index=resumeId!==null?levels.findIndex(l=>l.id===resumeId):saved.level;
 if(!isLevelUnlocked(index,levels,done,unlockedPacks))index=0;
 return {bests,done,index,unlockedPacks};
}
export function serializeProgress(index,levels,done,bests,unlockedPacks=1){return {campaign:'shapes-80',levelId:levels[index].id,level:index,done:[...done],bests:normalizeBests(bests),unlockedPacks:unlockedPackCount(levels,done,unlockedPacks)}}

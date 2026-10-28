export const levels = [
 {name:'First turn',tip:'Tap a silver screw, then a glowing empty hole. Free both screws to drop a plate.',plates:[[10,14]]},
 {name:'One at a time',tip:'Finish one plate before starting the next. Empty holes are precious.',plates:[[5,9],[15,19]]},
 {name:'The crossover',tip:'An upper plate can hide a screw below. Clear the top layer first.',plates:[[10,12],[2,22]]},
 {name:'Three beams',tip:'Look for a plate whose two screws are exposed.',plates:[[5,9],[15,19],[2,22]]},
 {name:'Interlocked',tip:'Covered holes only open up when the plate above them falls.',plates:[[10,12],[2,22],[6,8],[16,18]]},
 {name:'The ladder',tip:'You can always undo. There is no clock to beat.',plates:[[0,20],[4,24],[5,9],[15,19],[11,13]]},
 {name:'Cross grain',tip:'A little planning saves a lot of turning.',plates:[[0,4],[20,24],[5,15],[9,19],[10,14],[2,22]]},
 {name:'Loose ends',tip:'Find the layer that gives you room to work.',plates:[[0,20],[4,24],[5,9],[15,19],[1,21],[3,23],[10,14]]},
 {name:'The cabinet',tip:'Work from the exposed screws inward.',plates:[[0,4],[20,24],[5,15],[9,19],[1,21],[3,23],[10,14]]},
 {name:'Final assembly',tip:'One last puzzle. Take your time—this workshop can wait.',plates:[[0,20],[4,24],[1,3],[21,23],[5,9],[15,19],[10,14],[2,22]]}
];
export const cells = Array.from({length:27},(_,i)=>i<25?{x:35+(i%5)*70,y:110+Math.floor(i/5)*70}:{x:i===25?105:245,y:35});
export function coverage(pair){const[a,b]=pair,step=a%5===b%5?5:1;return Array.from({length:(b-a)/step+1},(_,i)=>a+i*step)}
export function holes(level){return [...new Set([...level.plates.flat(),25,26])]}
export function setup(level){return {positions:level.plates.flat(),removed:0,moves:0}}
export function active(level,s,p){return (s.removed & (3<<(p*2)))!==(3<<(p*2))}
export function covered(level,s,h){return level.plates.some((p,i)=>active(level,s,i)&&coverage(p).includes(h))}
export function accessible(level,s,b){if(s.removed&(1<<b))return true;const home=level.plates.flat()[b];return !level.plates.some((p,i)=>i>Math.floor(b/2)&&active(level,s,i)&&coverage(p).includes(home))}
export function destinations(level,s){return holes(level).filter(i=>!s.positions.includes(i)&&!covered(level,s,i))}
export function move(level,s,b,h){if(!accessible(level,s,b)||!destinations(level,s).includes(h))return null;return {positions:s.positions.map((p,i)=>i===b?h:p),removed:s.removed|(1<<b),moves:s.moves+1}}
export function complete(level,s){return s.removed===(1<<(level.plates.length*2))-1}
export function solve(level,s){const failed=new Set();function visit(mask){if(mask===(1<<(level.plates.length*2))-1)return [];if(failed.has(mask))return null;const state={removed:mask};const empty=holes(level).filter(i=>!covered(level,state,i)).length-popcount(mask);if(empty<=0){failed.add(mask);return null}for(let b=0;b<level.plates.length*2;b++){if(!(mask&(1<<b))&&accessible(level,state,b)){const rest=visit(mask|(1<<b));if(rest)return[b,...rest]}}failed.add(mask);return null}return visit(s.removed)}
function popcount(n){let c=0;for(;n;n&=n-1)c++;return c}

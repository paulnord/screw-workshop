// Matter.js 0.20.0 is loaded before this module (and imported by the Node tests).
const M=globalThis.Matter;
export const STEP=1000/120, WIDTH=350, HEIGHT=430, EXIT=490;
export const cells=Array.from({length:31},(_,i)=>i<25?{x:35+i%5*70,y:110+Math.floor(i/5)*70}:{x:35+(i-25)*56,y:35});
cells[25]={x:175,y:35};
import {levelRecipes} from './levels.mjs';
function pointId([x,y]){if(y===35)return 25;let i=cells.findIndex(p=>p.x===x&&p.y===y);if(i<0){i=cells.length;cells.push({x,y})}return i}
export const levels=levelRecipes.map(r=>({...r,plates:r.plates.map(p=>p.map(pointId)),hidden:r.hidden.map(pointId),spares:[25],solution:r.solution.map(([b,p])=>[b,pointId(p)])}));
export function holes(level){return [...new Set([...level.plates.flat(),...(level.hidden||[]),...(level.spares||[25,26,27,28,29,30])])]}
export function isSpare(level,h){return (level.spares||[25,26,27,28,29,30]).includes(h)}
export function localHoles(level,p){const [a,b]=level.plates[p].map(h=>cells[h]),length=Math.hypot(b.x-a.x,b.y-a.y);return [{x:-length/2,y:0},{x:length/2,y:0}]}
export function worldPoint(body,v){const c=Math.cos(body.angle),s=Math.sin(body.angle);return {x:body.position.x+v.x*c-v.y*s,y:body.position.y+v.x*s+v.y*c}}
export function createWorld(level,snapshot=null){
 const engine=M.Engine.create({enableSleeping:true,positionIterations:12,velocityIterations:10,constraintIterations:12});engine.gravity.y=1.2;engine.gravity.scale=.001;
 const sim={level,engine,plates:[],pins:[],constraints:[],positions:snapshot?.positions.slice()||level.plates.flat(),removed:snapshot?.removed||0,moves:snapshot?.moves||0,actions:snapshot?.actions?.map(a=>a.slice())||[],elapsed:snapshot?.elapsed||0,quiet:snapshot?.quiet||0,settled:snapshot?.settled||false};
 level.plates.forEach((pair,p)=>{const a=cells[pair[0]],b=cells[pair[1]],length=Math.hypot(b.x-a.x,b.y-a.y),cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;
 // Five material pieces make two genuine 20px square openings. The SVG uses the same cutouts.
 const rect=(x,y,w,h)=>M.Bodies.rectangle(cx+x,cy+y,w,h,{friction:.35,restitution:.12,slop:.02});
 const parts=[rect(0,-13.5,length+36,7),rect(0,13.5,length+36,7),rect(0,0,length-20,20),rect(-length/2-14,0,8,20),rect(length/2+14,0,8,20)];
 const body=M.Body.create({parts,friction:.35,frictionStatic:.55,frictionAir:.045,restitution:.12,sleepThreshold:80,label:`plate-${p}`});
 M.Body.setAngle(body,Math.atan2(b.y-a.y,b.x-a.x));const saved=snapshot?.bodies[p];
 if(saved){M.Body.setPosition(body,saved.position);M.Body.setAngle(body,saved.angle);M.Body.setVelocity(body,saved.velocity);M.Body.setAngularVelocity(body,saved.angularVelocity)}
 const attached=[0,1].filter(e=>!(sim.removed&(1<<(p*2+e))));M.Body.setStatic(body,attached.length===2);body.plugin={plate:p,length,cleared:!!saved?.cleared};sim.plates.push(body);
 if(!body.plugin.cleared)M.Composite.add(engine.world,body);
 });
 sim.positions.forEach((h,b)=>{const pin=M.Bodies.circle(cells[h].x,cells[h].y,7.5,{isStatic:true,friction:.4,restitution:.1,label:`screw-${b}`});sim.pins.push(pin);M.Composite.add(engine.world,pin);
 if(!(sim.removed&(1<<b))){const p=Math.floor(b/2),body=sim.plates[p],local=localHoles(level,p)[b%2];const q=M.Constraint.create({bodyA:body,pointA:{x:local.x*Math.cos(body.angle),y:local.x*Math.sin(body.angle)},pointB:{...cells[h]},length:0,stiffness:1,damping:.2});q.plugin={screw:b};sim.constraints.push(q);M.Composite.add(engine.world,q)}
 });
 return sim;
}
export function snapshot(sim){return {positions:sim.positions.slice(),removed:sim.removed,moves:sim.moves,actions:sim.actions.map(a=>a.slice()),elapsed:sim.elapsed,quiet:sim.quiet,settled:sim.settled,bodies:sim.plates.map(b=>({position:{...b.position},angle:b.angle,velocity:{...b.velocity},angularVelocity:b.angularVelocity,cleared:b.plugin.cleared}))}}
export function materialAt(sim,point,ignore=-1,padding=0){return sim.plates.some((b,p)=>{if(p===ignore||b.plugin.cleared)return false;const dx=point.x-b.position.x,dy=point.y-b.position.y,c=Math.cos(b.angle),s=Math.sin(b.angle),x=dx*c+dy*s,y=-dx*s+dy*c,L=b.plugin.length;
 if(Math.abs(x)>L/2+18+padding||Math.abs(y)>17+padding)return false;
 // A screw can be seen through a material opening, but parking requires clearance for its whole shaft.
 return ![-L/2,L/2].some(h=>Math.abs(x-h)<10-padding&&Math.abs(y)<10-padding);
 })}
export function accessible(sim,b){const p=sim.removed&(1<<b)?-1:Math.floor(b/2);return !materialAt(sim,cells[sim.positions[b]],p,3)}
export function footprintAt(sim,point,padding=0){return sim.plates.some(b=>{if(b.plugin.cleared)return false;const dx=point.x-b.position.x,dy=point.y-b.position.y,c=Math.cos(b.angle),s=Math.sin(b.angle);return Math.abs(dx*c+dy*s)<b.plugin.length/2+18+padding&&Math.abs(-dx*s+dy*c)<17+padding})}
export const SHAFT_CLEARANCE=8.25; // 7.5px shaft + 0.75px safety margin; visual rim and 44px hit area do not block reuse.
export function shaftBlocked(sim,point,radius=SHAFT_CLEARANCE){return sim.plates.some(b=>{if(b.plugin.cleared)return false;const dx=point.x-b.position.x,dy=point.y-b.position.y,c=Math.cos(b.angle),s=Math.sin(b.angle),x=dx*c+dy*s,y=-dx*s+dy*c,L=b.plugin.length;
 const rectangles=[[0,-13.5,L+36,7],[0,13.5,L+36,7],[0,0,L-20,20],[-L/2-14,0,8,20],[L/2+14,0,8,20]];
 return rectangles.some(([cx,cy,w,h])=>{const qx=Math.max(Math.abs(x-cx)-w/2,0),qy=Math.max(Math.abs(y-cy)-h/2,0);return qx*qx+qy*qy<radius*radius});
})}
export function destinations(sim){return holes(sim.level).filter(h=>!sim.positions.includes(h)&&!shaftBlocked(sim,cells[h]))}
export function complete(sim){return sim.plates.every(b=>b.plugin.cleared)}
export function step(sim,count=1){for(let k=0;k<count;k++){M.Engine.update(sim.engine,STEP);sim.elapsed+=STEP;
 for(const body of sim.plates){if(!body.plugin.cleared&&body.bounds.min.y>EXIT){body.plugin.cleared=true;M.Composite.remove(sim.engine.world,body)}}
 const still=sim.plates.filter(b=>!b.plugin.cleared&&!b.isStatic).every(b=>b.isSleeping||(b.speed+Math.abs(b.angularVelocity)*b.plugin.length/2<.35));sim.quiet=still?sim.quiet+1:0;sim.settled=sim.quiet>24||complete(sim);
 }return sim}
export function settle(sim,maxFrames=1440){for(let k=0;k<maxFrames&&!sim.settled;k++)step(sim);return sim}
export function move(sim,b,h){
 // Commit against this instant's geometry. Mutate the existing world so contacts and momentum survive rapid moves.
 if(complete(sim)||!Number.isInteger(b)||b<0||b>=sim.positions.length||!accessible(sim,b)||!destinations(sim).includes(h))return null;
 const p=Math.floor(b/2),wasPinned=!(sim.removed&(1<<b)),wasDouble=(sim.removed&(3<<(p*2)))===0;
 if(wasPinned){const joint=sim.constraints.find(c=>c.plugin.screw===b);if(joint)M.Composite.remove(sim.engine.world,joint);sim.constraints=sim.constraints.filter(c=>c!==joint);if(wasDouble)M.Body.setStatic(sim.plates[p],false)}
 sim.positions[b]=h;sim.removed|=1<<b;sim.moves++;sim.actions.push([b,h]);M.Body.setPosition(sim.pins[b],cells[h]);
 sim.plates.forEach(body=>{if(!body.plugin.cleared)M.Sleeping.set(body,false)});sim.settled=false;sim.quiet=0;
 if(wasPinned&&wasDouble){const body=sim.plates[p],remaining=localHoles(sim.level,p)[1-b%2],free=localHoles(sim.level,p)[b%2],anchor=worldPoint(body,remaining),loose=worldPoint(body,free);if(Math.abs(loose.x-anchor.x)<.01&&loose.y<anchor.y)M.Body.setAngularVelocity(body,anchor.x<175?.025:-.025)}
 return sim;
}
export function hingeError(sim,b){const p=Math.floor(b/2),q=worldPoint(sim.plates[p],localHoles(sim.level,p)[b%2]),anchor=cells[sim.positions[b]];return Math.hypot(q.x-anchor.x,q.y-anchor.y)}
export function hint(sim){
 if(sim.level.solution){if(!sim.settled)return{text:'For a tested hint, let the pieces settle first. You can still keep playing now.'};const route=sim.level.solution;let prefix=0;while(prefix<sim.actions.length&&prefix<route.length&&sim.actions[prefix][0]===route[prefix][0]&&sim.actions[prefix][1]===route[prefix][1])prefix++;
 if(prefix<sim.actions.length)return{text:`For a tested route, undo ${sim.actions.length-prefix} ${sim.actions.length-prefix===1?'move':'moves'}, then ask for a hint. Other routes may also work.`};
 const next=route[prefix];if(!next)return{text:'Let the last pieces fall clear. If a piece is caught, you can undo and retry the last move after it settles.'};
 if(!accessible(sim,next[0])||!destinations(sim).includes(next[1]))return{text:'This timing left the next opening covered. Undo the last move, let the pieces settle, then try the hint again.'};
 return{b:next[0],h:next[1],text:'This is the next move on a tested route. The highlighted wood hole is clear right now.'};}
const order=sim.level.order||sim.positions.map((_,i)=>i),targets=destinations(sim);const b=order.find(b=>!(sim.removed&(1<<b))&&accessible(sim,b));if(b!==undefined&&targets.length){const h=targets.find(h=>isSpare(sim.level,h))??targets[0];return {b,h,text:'Try this screw and the highlighted empty hole. Watch what it was supporting.'}}
 if(targets.length){const b=sim.positions.findIndex((h,b)=>!isSpare(sim.level,h)&&(sim.removed&(1<<b))&&accessible(sim,b));if(b>=0)return{b,h:targets.find(h=>isSpare(sim.level,h))??targets[0],text:'This parked screw may be catching a loose plate. Move it to make room.'}}
 return {text:'A plate may be caught on a screw or another plate. Undo and try a different order or parking hole.'};}

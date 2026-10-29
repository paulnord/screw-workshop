// Matter.js 0.20.0 is loaded before this module (and imported by the Node tests).
const M=globalThis.Matter;
export const STEP=1000/120, WIDTH=350, HEIGHT=430, EXIT=490;
export const cells=Array.from({length:31},(_,i)=>i<25?{x:35+i%5*70,y:110+Math.floor(i/5)*70}:{x:35+(i-25)*56,y:35});
cells[25]={x:175,y:35};
import {levelRecipes} from './levels.mjs';
function pointId(p){if(Number.isInteger(p))return p;const [x,y]=p;let i=cells.findIndex(q=>q.x===x&&q.y===y);if(i<0){i=cells.length;cells.push({x,y})}return i}
export function compileRecipe(r){const pieces=r.pieces,visible=r.spares||(r.spareCount===2?[[105,35],[245,35]]:[[175,35]]),spares=visible.map(pointId),target=p=>!r.spares&&r.spareCount===undefined&&Array.isArray(p)&&p[1]===35?spares[0]:pointId(p);return {...r,plates:pieces?pieces.map(p=>(p.anchors||p.bar).map(pointId)):r.plates.map(p=>p.map(pointId)),geometry:pieces?pieces.map(p=>p.outline||p.components?({outline:p.outline,components:p.components,holes:p.holes||p.anchors||p.bar}):undefined):r.geometry,hidden:(r.hidden||[]).map(pointId),spares,solution:r.solution?.map(([b,p])=>[b,target(p)])}}
export const levels=levelRecipes.map(compileRecipe);
export function holes(level){return [...new Set([...level.plates.flat(),...(level.hidden||[]),...(level.spares||[25,26,27,28,29,30])])]}
export function isSpare(level,h){return (level.spares||[25,26,27,28,29,30]).includes(h)}
const xy=p=>Array.isArray(p)?{x:p[0],y:p[1]}:{x:p.x,y:p.y};
const rectangle=(x0,y0,x1,y1)=>[{x:x0,y:y0},{x:x1,y:y0},{x:x1,y:y1},{x:x0,y:y1}];
function signedArea(v){return v.reduce((n,p,i)=>{const q=v[(i+1)%v.length];return n+p.x*q.y-q.x*p.y},0)/2}
function centroid(v){const area=signedArea(v);if(Math.abs(area)<1e-8)return {x:v.reduce((n,p)=>n+p.x,0)/v.length,y:v.reduce((n,p)=>n+p.y,0)/v.length};let x=0,y=0;v.forEach((p,i)=>{const q=v[(i+1)%v.length],k=p.x*q.y-q.x*p.y;x+=(p.x+q.x)*k;y+=(p.y+q.y)*k});return{x:x/(6*area),y:y/(6*area)}}
function clip(poly,axis,bound,keepGreater){const result=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],inside=p=>keepGreater?p[axis]>=bound-1e-8:p[axis]<=bound+1e-8,ia=inside(a),ib=inside(b);if(ia)result.push(a);if(ia!==ib){const t=(bound-a[axis])/(b[axis]-a[axis]);result.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t})}}return result}
function cleanPolygon(poly){const p=poly.filter((v,i)=>i===0||Math.hypot(v.x-poly[i-1].x,v.y-poly[i-1].y)>1e-7);if(p.length>1&&Math.hypot(p[0].x-p.at(-1).x,p[0].y-p.at(-1).y)<1e-7)p.pop();return p.filter((v,i)=>{const a=p[(i+p.length-1)%p.length],b=p[(i+1)%p.length];return Math.abs((v.x-a.x)*(b.y-v.y)-(v.y-a.y)*(b.x-v.x))>1e-7})}
// Partition convex components at every square-hole boundary, then clip each cell.
// The retained polygons are the actual material used for BOTH collision and rendering.
function cutMaterial(components,cutouts){const parts=[];for(const poly of components){const minX=Math.min(...poly.map(p=>p.x)),maxX=Math.max(...poly.map(p=>p.x)),minY=Math.min(...poly.map(p=>p.y)),maxY=Math.max(...poly.map(p=>p.y));const xs=[...new Set([minX,maxX,...cutouts.flatMap(h=>[h.x-10,h.x+10]).filter(x=>x>minX&&x<maxX)])].sort((a,b)=>a-b),ys=[...new Set([minY,maxY,...cutouts.flatMap(h=>[h.y-10,h.y+10]).filter(y=>y>minY&&y<maxY)])].sort((a,b)=>a-b);
 for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){const x=(xs[i]+xs[i+1])/2,y=(ys[j]+ys[j+1])/2;if(cutouts.some(h=>Math.abs(x-h.x)<10&&Math.abs(y-h.y)<10))continue;let v=clip(poly,'x',xs[i],true);v=clip(v,'x',xs[i+1],false);v=clip(v,'y',ys[j],true);v=clip(v,'y',ys[j+1],false);v=cleanPolygon(v);if(v.length>=3&&Math.abs(signedArea(v))>.0001)parts.push(v)}
 }if(!parts.length||parts.length>256)throw new Error('Plate geometry must contain 1–256 convex material pieces');return parts}
function convexIntersection(subject,boundary){let output=subject,orientation=Math.sign(signedArea(boundary));for(let i=0;i<boundary.length&&output.length;i++){const a=boundary[i],b=boundary[(i+1)%boundary.length],side=p=>orientation*((b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x)),next=[];for(let j=0;j<output.length;j++){const u=output[j],v=output[(j+1)%output.length],su=side(u),sv=side(v),iu=su>=-1e-8,iv=sv>=-1e-8;if(iu)next.push(u);if(iu!==iv){const t=su/(su-sv);next.push({x:u.x+(v.x-u.x)*t,y:u.y+(v.y-u.y)*t})}}output=next}return output}
function pointInOutline(poly,p){let result=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[j],b=poly[i],cross=(p.x-a.x)*(b.y-a.y)-(p.y-a.y)*(b.x-a.x);if(Math.abs(cross)<1e-7&&p.x>=Math.min(a.x,b.x)-1e-7&&p.x<=Math.max(a.x,b.x)+1e-7&&p.y>=Math.min(a.y,b.y)-1e-7&&p.y<=Math.max(a.y,b.y)+1e-7)return true;if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)result=!result}return result}
function validateGeometry(outline,components,cutouts){
 for(const poly of components){if(poly.length<3||Math.abs(signedArea(poly))<1e-5)throw new Error('Material components must have positive area');let sign=0;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],c=poly[(i+2)%poly.length],z=(b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x);if(Math.abs(z)>1e-7){if(sign&&Math.sign(z)!==sign)throw new Error('Each material component must be convex; supply non-overlapping convex components for L/T pieces');sign=Math.sign(z)}}if(poly.some(p=>!pointInOutline(outline,p)))throw new Error('Material components must lie within their rendered outline')}
 for(let i=0;i<components.length;i++)for(let j=i+1;j<components.length;j++)if(Math.abs(signedArea(convexIntersection(components[i],components[j])))>1e-5)throw new Error('Material components must not overlap');
 const area=components.reduce((n,p)=>n+Math.abs(signedArea(p)),0);if(Math.abs(area-Math.abs(signedArea(outline)))>1e-4)throw new Error('Rendered outline and material components must cover the same area');
 for(let i=0;i<cutouts.length;i++){const h=cutouts[i],square=rectangle(h.x-10,h.y-10,h.x+10,h.y+10),covered=components.reduce((n,p)=>n+Math.abs(signedArea(convexIntersection(square,p))),0);if(Math.abs(covered-400)>1e-4)throw new Error('Every square cutout must be wholly inside the material outline');for(let j=0;j<i;j++)if(Math.abs(h.x-cutouts[j].x)<20-1e-7&&Math.abs(h.y-cutouts[j].y)<20-1e-7)throw new Error('Square cutouts must not overlap')}
}
function geometry(level,p){const anchors=level.plates[p].map(h=>({...cells[h]}));if(!anchors.length)throw new Error('Every plate needs at least one original screw');const custom=level.geometry?.[p];
 if(!custom&&anchors.length===2){const[a,b]=anchors,L=Math.hypot(b.x-a.x,b.y-a.y),origin={x:(a.x+b.x)/2,y:(a.y+b.y)/2},angle=Math.atan2(b.y-a.y,b.x-a.x);if(L<=20)throw new Error('Bar anchors must be more than 20px apart');return{legacy:true,length:L,origin,angle,outline:rectangle(-L/2-18,-17,L/2+18,17),holes:[{x:-L/2,y:0},{x:L/2,y:0}],anchors:[{x:-L/2,y:0},{x:L/2,y:0}],material:[rectangle(-L/2-18,-17,L/2+18,-10),rectangle(-L/2-18,10,L/2+18,17),rectangle(-L/2+10,-10,L/2-10,10),rectangle(-L/2-18,-10,-L/2-10,10),rectangle(L/2+10,-10,L/2+18,10)]}}
 const fallback=rectangle(Math.min(...anchors.map(a=>a.x))-36,Math.min(...anchors.map(a=>a.y))-17,Math.max(...anchors.map(a=>a.x))+36,Math.max(...anchors.map(a=>a.y))+17),outline=(custom?.outline||fallback).map(xy),components=(custom?.components||[outline]).map(v=>v.map(xy));
 // Duplicate hole centers would subtract the same region twice in an SVG path.
 const cutouts=[...anchors,...(custom?.holes||[]).map(xy)].filter((h,i,a)=>a.findIndex(q=>Math.hypot(q.x-h.x,q.y-h.y)<1e-7)===i);validateGeometry(outline,components,cutouts);const material=cutMaterial(components,cutouts);let area=0,cx=0,cy=0;for(const poly of material){const a=Math.abs(signedArea(poly)),c=centroid(poly);area+=a;cx+=c.x*a;cy+=c.y*a}const origin={x:cx/area,y:cy/area},local=q=>({x:q.x-origin.x,y:q.y-origin.y});return{legacy:false,length:Math.hypot(Math.max(...outline.map(q=>q.x))-Math.min(...outline.map(q=>q.x)),Math.max(...outline.map(q=>q.y))-Math.min(...outline.map(q=>q.y))),origin,angle:0,outline:outline.map(local),holes:cutouts.map(local),anchors:anchors.map(local),material:material.map(v=>v.map(local))}
}
export function localHoles(level,p){return geometry(level,p).anchors.map(v=>({...v}))}
export function worldPoint(body,v){const c=Math.cos(body.angle),s=Math.sin(body.angle);return {x:body.position.x+v.x*c-v.y*s,y:body.position.y+v.x*s+v.y*c}}
export function worldHoles(sim,p){return sim.plates[p].plugin.holes.map(h=>worldPoint(sim.plates[p],h))}
export function plateForBolt(sim,b){return sim.boltPlate[b]}
export function anchorForBolt(sim,b){return sim.boltAnchor[b]}
export function attachmentCount(sim,p){return sim.boltsByPlate[p].filter(b=>!(sim.removed&(1<<b))).length}
export function createWorld(level,snapshot=null){
 if(new Set(level.plates.flat()).size!==level.plates.flat().length)throw new Error('Original screws need distinct board holes');
 if(level.plates.flat().length>30)throw new Error('Assemblies support up to 30 screws');
 const engine=M.Engine.create({enableSleeping:true,positionIterations:12,velocityIterations:10,constraintIterations:12});engine.gravity.y=1.2;engine.gravity.scale=.001;
 const sim={level,engine,plates:[],pins:[],constraints:[],boltPlate:[],boltAnchor:[],boltsByPlate:[],positions:snapshot?.positions.slice()||level.plates.flat(),removed:snapshot?.removed||0,moves:snapshot?.moves||0,actions:snapshot?.actions?.map(a=>a.slice())||[],elapsed:snapshot?.elapsed||0,quiet:snapshot?.quiet||0,settled:snapshot?.settled||false};
 let bolt=0;level.plates.forEach((anchors,p)=>{sim.boltsByPlate[p]=anchors.map((_,a)=>{sim.boltPlate[bolt]=p;sim.boltAnchor[bolt]=a;return bolt++})});
 level.plates.forEach((_,p)=>{const g=geometry(level,p),{x:cx,y:cy}=g.origin,L=g.length;let parts;
 if(g.legacy){const rect=(x,y,w,h)=>M.Bodies.rectangle(cx+x,cy+y,w,h,{friction:.35,restitution:.12,slop:.02});parts=[rect(0,-13.5,L+36,7),rect(0,13.5,L+36,7),rect(0,0,L-20,20),rect(-L/2-14,0,8,20),rect(L/2+14,0,8,20)]}
 else parts=g.material.map(poly=>{const vertices=poly.map(v=>({x:v.x+cx,y:v.y+cy})),position=centroid(vertices);return M.Body.create({position,vertices,friction:.35,restitution:.12,slop:.02})});
 const body=M.Body.create({parts,friction:.35,frictionStatic:.55,frictionAir:.045,restitution:.12,sleepThreshold:80,label:`plate-${p}`});if(!g.legacy)M.Body.setInertia(body,parts.reduce((n,part)=>n+part.inertia+4*part.mass*((part.position.x-body.position.x)**2+(part.position.y-body.position.y)**2),0));M.Body.setAngle(body,g.angle);
 // Compound COM is material-weighted, so anchor offsets cannot be assumed symmetric.
 const delta={x:g.origin.x-body.position.x,y:g.origin.y-body.position.y},adjust=v=>({x:v.x+delta.x,y:v.y+delta.y});const outline=g.outline.map(adjust),cutouts=g.holes.map(adjust),localAnchors=g.anchors.map(adjust),material=g.material.map(poly=>poly.map(adjust));
 body.plugin={plate:p,length:L,radius:Math.max(...outline.map(v=>Math.hypot(v.x,v.y))),settleRadius:g.legacy?L/2:Math.max(...outline.map(v=>Math.hypot(v.x,v.y))),outline,holes:cutouts,anchors:localAnchors,material,cleared:!!snapshot?.bodies[p]?.cleared};
 const saved=snapshot?.bodies[p];if(saved){M.Body.setPosition(body,saved.position);M.Body.setAngle(body,saved.angle);M.Body.setVelocity(body,saved.velocity);M.Body.setAngularVelocity(body,saved.angularVelocity)}
 M.Body.setStatic(body,attachmentCount(sim,p)>=2);sim.plates.push(body);if(!body.plugin.cleared)M.Composite.add(engine.world,body);
 });
 sim.positions.forEach((h,b)=>{const pin=M.Bodies.circle(cells[h].x,cells[h].y,7.5,{isStatic:true,friction:.4,restitution:.1,label:`screw-${b}`});sim.pins.push(pin);M.Composite.add(engine.world,pin);
 if(!(sim.removed&(1<<b))){const p=plateForBolt(sim,b),body=sim.plates[p],local=body.plugin.anchors[anchorForBolt(sim,b)],c=Math.cos(body.angle),s=Math.sin(body.angle);const q=M.Constraint.create({bodyA:body,pointA:{x:local.x*c-local.y*s,y:local.x*s+local.y*c},pointB:{...cells[h]},length:0,stiffness:1,damping:.2});q.plugin={screw:b};sim.constraints.push(q);M.Composite.add(engine.world,q)}
 });return sim;
}
export function snapshot(sim){return {positions:sim.positions.slice(),removed:sim.removed,moves:sim.moves,actions:sim.actions.map(a=>a.slice()),elapsed:sim.elapsed,quiet:sim.quiet,settled:sim.settled,bodies:sim.plates.map(b=>({position:{...b.position},angle:b.angle,velocity:{...b.velocity},angularVelocity:b.angularVelocity,cleared:b.plugin.cleared}))}}
function toLocal(body,p){const dx=p.x-body.position.x,dy=p.y-body.position.y,c=Math.cos(body.angle),s=Math.sin(body.angle);return{x:dx*c+dy*s,y:-dx*s+dy*c}}
function inside(poly,p){let sign=0;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],cross=(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);if(Math.abs(cross)<1e-8)continue;const next=Math.sign(cross);if(sign&&next!==sign)return false;sign=next}return true}
function circleTouches(poly,p,radius){if(inside(poly,p))return true;const r2=radius*radius;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));if((p.x-a.x-t*dx)**2+(p.y-a.y-t*dy)**2<r2)return true}return false}
export function materialAt(sim,point,ignore=-1,padding=0){return sim.plates.some((b,p)=>p!==ignore&&!b.plugin.cleared&&b.plugin.material.some(poly=>circleTouches(poly,toLocal(b,point),padding)))}
export function accessible(sim,b){if(!Number.isInteger(b)||b<0||b>=sim.positions.length)return false;const p=sim.removed&(1<<b)?-1:plateForBolt(sim,b);return !materialAt(sim,cells[sim.positions[b]],p,3)}
// Conservatively treats a concave outline as its material plus holes; unlike shaftBlocked it closes cutouts.
export function footprintAt(sim,point,padding=0){return sim.plates.some(b=>{if(b.plugin.cleared)return false;const q=toLocal(b,point);return b.plugin.material.some(poly=>circleTouches(poly,q,padding))||b.plugin.holes.some(h=>Math.abs(q.x-h.x)<=10+padding&&Math.abs(q.y-h.y)<=10+padding)})}
export const SHAFT_CLEARANCE=8.25;
export function shaftBlocked(sim,point,radius=SHAFT_CLEARANCE){return materialAt(sim,point,-1,radius)}
export function destinations(sim){return holes(sim.level).filter(h=>!sim.positions.includes(h)&&!shaftBlocked(sim,cells[h]))}
export function complete(sim){return sim.plates.every(b=>b.plugin.cleared)}
export function step(sim,count=1){for(let k=0;k<count;k++){M.Engine.update(sim.engine,STEP);sim.elapsed+=STEP;for(const body of sim.plates){if(!body.plugin.cleared&&body.bounds.min.y>EXIT){body.plugin.cleared=true;M.Composite.remove(sim.engine.world,body)}}const still=sim.plates.filter(b=>!b.plugin.cleared&&!b.isStatic).every(b=>b.isSleeping||(b.speed+Math.abs(b.angularVelocity)*b.plugin.settleRadius<.35));sim.quiet=still?sim.quiet+1:0;sim.settled=sim.quiet>24||complete(sim)}return sim}
export function settle(sim,maxFrames=1440){for(let k=0;k<maxFrames&&!sim.settled;k++)step(sim);return sim}
export function move(sim,b,h){
 if(complete(sim)||!Number.isInteger(b)||b<0||b>=sim.positions.length||!accessible(sim,b)||!destinations(sim).includes(h))return null;
 const p=plateForBolt(sim,b),wasPinned=!(sim.removed&(1<<b)),before=attachmentCount(sim,p);
 if(wasPinned){const joint=sim.constraints.find(c=>c.plugin.screw===b);if(joint)M.Composite.remove(sim.engine.world,joint);sim.constraints=sim.constraints.filter(c=>c!==joint)}
 sim.positions[b]=h;sim.removed|=1<<b;sim.moves++;sim.actions.push([b,h]);M.Body.setPosition(sim.pins[b],cells[h]);
 const after=attachmentCount(sim,p);if(wasPinned&&before>=2&&after<2)M.Body.setStatic(sim.plates[p],false);
 sim.plates.forEach(body=>{if(!body.plugin.cleared)M.Sleeping.set(body,false)});sim.settled=false;sim.quiet=0;
 if(wasPinned&&before===2&&after===1){const body=sim.plates[p],other=sim.boltsByPlate[p].find(q=>!(sim.removed&(1<<q))),remaining=body.plugin.anchors[anchorForBolt(sim,other)],free=body.plugin.anchors[anchorForBolt(sim,b)],anchor=worldPoint(body,remaining),loose=worldPoint(body,free);if(Math.abs(body.position.x-anchor.x)<.01&&body.position.y<anchor.y)M.Body.setAngularVelocity(body,anchor.x<175?.025:-.025)}return sim;
}
export function hingeError(sim,b){const p=plateForBolt(sim,b),q=worldPoint(sim.plates[p],sim.plates[p].plugin.anchors[anchorForBolt(sim,b)]),anchor=cells[sim.positions[b]];return Math.hypot(q.x-anchor.x,q.y-anchor.y)}
export function hint(sim){
 if(sim.level.solution){if(!sim.settled)return{text:'For a tested hint, let the pieces settle first. You can still keep playing now.'};const route=sim.level.solution;let prefix=0;while(prefix<sim.actions.length&&prefix<route.length&&sim.actions[prefix][0]===route[prefix][0]&&sim.actions[prefix][1]===route[prefix][1])prefix++;
 if(prefix<sim.actions.length)return{text:`For a tested route, undo ${sim.actions.length-prefix} ${sim.actions.length-prefix===1?'move':'moves'}, then ask for a hint. Other routes may also work.`};
 const next=route[prefix];if(!next)return{text:'Let the last pieces fall clear. If a piece is caught, you can undo and retry the last move after it settles.'};
 if(!accessible(sim,next[0])||!destinations(sim).includes(next[1]))return{text:'This timing left the next opening covered. Undo the last move, let the pieces settle, then try the hint again.'};
 return{b:next[0],h:next[1],text:'This is the next move on a tested route. The highlighted wood hole is clear right now.'};}
const order=sim.level.order||sim.positions.map((_,i)=>i),targets=destinations(sim);const b=order.find(b=>!(sim.removed&(1<<b))&&accessible(sim,b));if(b!==undefined&&targets.length){const h=targets.find(h=>isSpare(sim.level,h))??targets[0];return {b,h,text:'Try this screw and the highlighted empty hole. Watch what it was supporting.'}}
 if(targets.length){const b=sim.positions.findIndex((h,b)=>!isSpare(sim.level,h)&&(sim.removed&(1<<b))&&accessible(sim,b));if(b>=0)return{b,h:targets.find(h=>isSpare(sim.level,h))??targets[0],text:'This parked screw may be catching a loose plate. Move it to make room.'}}
 return {text:'A plate may be caught on a screw or another plate. Undo and try a different order or parking hole.'};}

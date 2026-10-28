// Matter.js 0.20.0 is loaded before this module (and imported by the Node tests).
const M=globalThis.Matter;
export const STEP=1000/120, WIDTH=350, HEIGHT=430, EXIT=490;
export const cells=Array.from({length:31},(_,i)=>i<25?{x:35+i%5*70,y:110+Math.floor(i/5)*70}:{x:35+(i-25)*56,y:35});
export const levels=[
{name:'A real hinge',tip:'Move one screw and watch the plate swing around the other. Its holes stay with it.',plates:[[6,8]]},
{name:'One catches another',tip:'Loose does not mean clear. A plate can land on the one below.',plates:[[6,8],[16,18]]},
{name:'Open doors',tip:'Each plate is a solid object. Leave space for its swing.',plates:[[5,15],[9,19]]},
{name:'The shelf',tip:'A loose plate rests on the shelf. Remove its support to let both fall.',plates:[[6,8],[15,19]]},
{name:'Between the posts',tip:'Screws are solid too. Park them away from a falling plate’s path.',plates:[[5,15],[9,19],[11,13]]},
{name:'A sliding start',tip:'Release the left end of the middle plate first. The bottom plate catches it to make a ramp.',plates:[[1,3],[10,13],[21,23]],order:[2,0,1,4,5,3]},
{name:'Staggered shelves',tip:'These plates catch, tip, and slide against one another.',plates:[[5,7],[12,14],[15,17]]},
{name:'Four stories',tip:'Six spare holes. Reuse exposed board holes, but keep the exit clear.',plates:[[0,3],[6,8],[10,13],[16,19]]},
{name:'Side by side',tip:'Clear the middle, then let the side pieces swing past the parked screws.',plates:[[0,5],[4,9],[11,13],[16,18]],order:[6,7,4,5,0,1,2,3]},
{name:'Final assembly',tip:'Watch where each plate can travel. Undo is always available.',plates:[[1,3],[5,15],[9,19],[11,13]],order:[0,1,6,7,2,3,4,5]}
];
export function holes(level){return [...new Set([...level.plates.flat(),25,26,27,28,29,30])]}
export function localHoles(level,p){const [a,b]=level.plates[p].map(h=>cells[h]),length=Math.hypot(b.x-a.x,b.y-a.y);return [{x:-length/2,y:0},{x:length/2,y:0}]}
export function worldPoint(body,v){const c=Math.cos(body.angle),s=Math.sin(body.angle);return {x:body.position.x+v.x*c-v.y*s,y:body.position.y+v.x*s+v.y*c}}
export function createWorld(level,snapshot=null){
 const engine=M.Engine.create({enableSleeping:true,positionIterations:12,velocityIterations:10,constraintIterations:12});engine.gravity.y=1;engine.gravity.scale=.001;
 const sim={level,engine,plates:[],pins:[],constraints:[],positions:snapshot?.positions.slice()||level.plates.flat(),removed:snapshot?.removed||0,moves:snapshot?.moves||0,elapsed:0,quiet:0,settled:!!snapshot};
 level.plates.forEach((pair,p)=>{const a=cells[pair[0]],b=cells[pair[1]],length=Math.hypot(b.x-a.x,b.y-a.y),cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;
 // Five material pieces make two genuine 20px square openings. The SVG uses the same cutouts.
 const rect=(x,y,w,h)=>M.Bodies.rectangle(cx+x,cy+y,w,h,{friction:.35,restitution:.12,slop:.02});
 const parts=[rect(0,-13.5,length+36,7),rect(0,13.5,length+36,7),rect(0,0,length-20,20),rect(-length/2-14,0,8,20),rect(length/2+14,0,8,20)];
 const body=M.Body.create({parts,friction:.35,frictionStatic:.55,frictionAir:.055,restitution:.12,sleepThreshold:80,label:`plate-${p}`});
 M.Body.setAngle(body,Math.atan2(b.y-a.y,b.x-a.x));const saved=snapshot?.bodies[p];
 if(saved){M.Body.setPosition(body,saved.position);M.Body.setAngle(body,saved.angle);M.Body.setVelocity(body,saved.velocity);M.Body.setAngularVelocity(body,saved.angularVelocity)}
 const attached=[0,1].filter(e=>!(sim.removed&(1<<(p*2+e))));M.Body.setStatic(body,attached.length===2);body.plugin={plate:p,length,cleared:!!saved?.cleared};sim.plates.push(body);
 if(!body.plugin.cleared)M.Composite.add(engine.world,body);
 });
 sim.positions.forEach((h,b)=>{const pin=M.Bodies.circle(cells[h].x,cells[h].y,7.5,{isStatic:true,friction:.4,restitution:.1,label:`screw-${b}`});sim.pins.push(pin);M.Composite.add(engine.world,pin);
 if(!(sim.removed&(1<<b))){const p=Math.floor(b/2),body=sim.plates[p],local=localHoles(level,p)[b%2];const q=M.Constraint.create({bodyA:body,pointA:{x:local.x*Math.cos(body.angle),y:local.x*Math.sin(body.angle)},pointB:{...cells[h]},length:0,stiffness:1,damping:.2});sim.constraints.push(q);M.Composite.add(engine.world,q)}
 });
 return sim;
}
export function snapshot(sim){return {positions:sim.positions.slice(),removed:sim.removed,moves:sim.moves,bodies:sim.plates.map(b=>({position:{...b.position},angle:b.angle,velocity:{...b.velocity},angularVelocity:b.angularVelocity,cleared:b.plugin.cleared}))}}
export function materialAt(sim,point,ignore=-1,padding=0){return sim.plates.some((b,p)=>{if(p===ignore||b.plugin.cleared)return false;const dx=point.x-b.position.x,dy=point.y-b.position.y,c=Math.cos(b.angle),s=Math.sin(b.angle),x=dx*c+dy*s,y=-dx*s+dy*c,L=b.plugin.length;
 if(Math.abs(x)>L/2+18+padding||Math.abs(y)>17+padding)return false;
 // A screw can be seen through a material opening, but parking requires clearance for its whole shaft.
 return ![-L/2,L/2].some(h=>Math.abs(x-h)<10-padding&&Math.abs(y)<10-padding);
 })}
export function accessible(sim,b){const p=sim.removed&(1<<b)?-1:Math.floor(b/2);return !materialAt(sim,cells[sim.positions[b]],p,3)}
export function footprintAt(sim,point,padding=0){return sim.plates.some(b=>{if(b.plugin.cleared)return false;const dx=point.x-b.position.x,dy=point.y-b.position.y,c=Math.cos(b.angle),s=Math.sin(b.angle);return Math.abs(dx*c+dy*s)<b.plugin.length/2+18+padding&&Math.abs(-dx*s+dy*c)<17+padding})}
export function destinations(sim){return holes(sim.level).filter(h=>!sim.positions.includes(h)&&!footprintAt(sim,cells[h],9))}
export function complete(sim){return sim.plates.every(b=>b.plugin.cleared)}
export function step(sim,count=1){for(let k=0;k<count;k++){M.Engine.update(sim.engine,STEP);sim.elapsed+=STEP;
 for(const body of sim.plates){if(!body.plugin.cleared&&body.bounds.min.y>EXIT){body.plugin.cleared=true;M.Composite.remove(sim.engine.world,body)}}
 const still=sim.plates.filter(b=>!b.plugin.cleared&&!b.isStatic).every(b=>b.isSleeping||(b.speed+Math.abs(b.angularVelocity)*b.plugin.length/2<.35));sim.quiet=still?sim.quiet+1:0;sim.settled=sim.quiet>24||complete(sim);
 }return sim}
export function settle(sim,maxFrames=1440){for(let k=0;k<maxFrames&&!sim.settled;k++)step(sim);return sim}
export function move(sim,b,h){if(!Number.isInteger(b)||b<0||b>=sim.positions.length||!accessible(sim,b)||!destinations(sim).includes(h))return null;
 const s=snapshot(sim);s.positions[b]=h;s.removed|=1<<b;s.moves++;const next=createWorld(sim.level,s);next.settled=false;
 const p=Math.floor(b/2),wasPinned=!(sim.removed&(1<<b)),wasDouble=(sim.removed&(3<<(p*2)))===0;
 if(wasPinned&&wasDouble){const body=next.plates[p],remaining=localHoles(next.level,p)[1-b%2],free=localHoles(next.level,p)[b%2],anchor=worldPoint(body,remaining),loose=worldPoint(body,free);if(Math.abs(loose.x-anchor.x)<.01&&loose.y<anchor.y)M.Body.setAngularVelocity(body,anchor.x<175?.025:-.025)}
 return next;
}
export function hingeError(sim,b){const p=Math.floor(b/2),q=worldPoint(sim.plates[p],localHoles(sim.level,p)[b%2]),anchor=cells[sim.positions[b]];return Math.hypot(q.x-anchor.x,q.y-anchor.y)}
export function hint(sim){const order=sim.level.order||sim.positions.map((_,i)=>i),targets=destinations(sim);const b=order.find(b=>!(sim.removed&(1<<b))&&accessible(sim,b));if(b!==undefined&&targets.length){const h=targets.find(h=>h>=25)??targets[0];return {b,h,text:'Try this screw and the highlighted empty hole. Watch what it was supporting.'}}
 if(targets.length){const b=sim.positions.findIndex((h,b)=>h<25&&(sim.removed&(1<<b))&&accessible(sim,b));if(b>=0)return{b,h:targets.find(h=>h>=25)??targets[0],text:'This parked screw may be catching a loose plate. Move it to make room.'}}
 return {text:'A plate may be caught on a screw or another plate. Undo and try a different order or parking hole.'};}

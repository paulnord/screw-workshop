import assert from 'node:assert/strict';
import {geometryFingerprint,geometryDistance,nearDuplicate,NEAR_DUPLICATE_PIXELS} from './scripts/daily-novelty.mjs';
import {levelRecipes} from './dist/levels.mjs';

const base={id:'original',name:'Original',plates:[[[65,100],[145,110]],[[215,150],[285,180]],[[90,280],[260,280]]],spareCount:2,hidden:[],solution:[]};
const mapPoints=(recipe,fn)=>{
  const r=structuredClone(recipe);
  if(r.plates)r.plates=r.plates.map(p=>p.map(fn));
  if(r.pieces)r.pieces=r.pieces.map(p=>Object.fromEntries(Object.entries(p).map(([key,value])=>[key,key==='components'?value.map(c=>c.map(fn)):['anchors','bar','outline','holes'].includes(key)?value.map(fn):value])));
  r.hidden=r.hidden.map(fn);return r;
};
const fingerprint=geometryFingerprint(base);
for(const changed of [
  {...base,id:'daily-2030-01-01-v1',name:'Renamed',solution:[[4,[105,35]]]},
  mapPoints(base,([x,y])=>[x+25,y-17]),
  mapPoints(base,([x,y])=>[350-x,y]),
  {...base,plates:base.plates.slice().reverse().map(p=>p.slice().reverse())},
  {...base,spares:[[75,35],[270,35]],spareCount:undefined}
]){
  assert.equal(geometryFingerprint(changed),fingerprint,'Trivial identity/order/position/mirror changes share a fingerprint');
  assert.ok(nearDuplicate(base,changed));assert.ok(geometryDistance(base,changed)<1e-7);
}
assert.notEqual(geometryFingerprint(mapPoints(base,([x,y])=>[x+(y%7)-3,y+(x%7)-3])),fingerprint);
assert.ok(nearDuplicate(base,mapPoints(base,([x,y])=>[x+(y%7)-3,y+(x%7)-3])),'Up to3px per-axis jitter is a near clone');
const slight=structuredClone(base);slight.plates[0][0][0]-=10;slight.plates[0][1][0]+=10;
assert.ok(nearDuplicate(base,slight),'20px length change is below12px endpoint gate');
const longer=structuredClone(base);longer.plates[0][0][0]-=30;longer.plates[0][1][0]+=30;
assert.ok(!nearDuplicate(base,longer),'Meaningful60px length change is accepted');
const tilt=structuredClone(base);tilt.plates[2]=[[90,240],[260,320]];
assert.ok(!nearDuplicate(base,tilt),'Meaningful slope change is accepted');
const layout=structuredClone(base);layout.plates[1]=layout.plates[1].map(([x,y])=>[x-70,y+40]);
assert.ok(!nearDuplicate(base,layout),'Meaningful layout change is accepted');
assert.ok(!nearDuplicate(base,{...base,plates:base.plates.slice(0,2)}),'Different block count is distinct');
assert.ok(!nearDuplicate(base,{...base,spareCount:1}),'Different parking count is distinct');
assert.ok(!nearDuplicate(base,{...base,hidden:[[175,225]]}),'Different hidden-hole count is distinct');
const custom={pieces:[{anchors:[[90,120],[230,120]],outline:[[72,103],[248,103],[248,137],[72,137]],components:[[[72,103],[248,103],[248,137],[72,137]]]}],hidden:[],spareCount:2};
const bar={plates:[[[90,120],[230,120]]],hidden:[],spareCount:2};
assert.equal(geometryFingerprint(custom),geometryFingerprint(bar),'Equivalent custom/legacy material is the same geometry');
assert.equal(geometryDistance(custom,bar),0);
const reorder=structuredClone(custom);reorder.pieces[0].outline=[[248,137],[248,103],[160,103],[72,103],[72,137]];
reorder.pieces[0].anchors.reverse();delete reorder.pieces[0].components;
assert.equal(geometryFingerprint(custom),geometryFingerprint(reorder),'Polygon winding/start/collinear subdivision and material partition do not fake novelty');
assert.equal(geometryDistance(custom,reorder),0);
const notch=structuredClone(custom);notch.pieces[0].outline=[[72,103],[160,100],[248,103],[248,137],[72,137]];
assert.ok(nearDuplicate(custom,notch),'A3px notch cannot fake a new polygon type');
const cutout=structuredClone(custom);cutout.pieces[0].holes=[[160,120]];
assert.ok(!nearDuplicate(custom,cutout),'A genuinely additional cutout is distinct');
const rectangle={pieces:[{anchors:[[100,100]],outline:[[80,80],[120,80],[120,120],[80,120]]}],hidden:[],spareCount:2};
const asymmetric={pieces:[{anchors:[[100,100]],outline:[[80,80],[140,80],[120,120],[80,120]]}],hidden:[],spareCount:2};
assert.ok(!nearDuplicate(rectangle,asymmetric),'Meaningful outline change is accepted');
// Ten interchangeable pieces exercise the bounded assignment rather than greedy matching.
const ten={plates:Array.from({length:10},(_,i)=>[[40+(i%2)*170,85+Math.floor(i/2)*60],[100+(i%2)*170,85+Math.floor(i/2)*60]]),hidden:[],spareCount:2};
const shuffled={...ten,plates:[...ten.plates.slice(5),...ten.plates.slice(0,5)].map(p=>p.slice().reverse())};
assert.equal(geometryDistance(ten,shuffled),0);assert.ok(nearDuplicate(ten,shuffled));
assert.throws(()=>nearDuplicate(base,base,-1));
assert.throws(()=>geometryFingerprint({...base,plates:[...ten.plates,...base.plates]}));
assert.throws(()=>geometryFingerprint({...base,plates:[[[NaN,2],[3,4]]]}));
assert.throws(()=>geometryFingerprint({...base,plates:[[[1e30,2],[3,4]]]}));
for(const recipe of levelRecipes){
  assert.match(geometryFingerprint(recipe),/^[a-f0-9]{64}$/);
  assert.ok(nearDuplicate(recipe,mapPoints(recipe,([x,y])=>[350-x+13,y+9])),recipe.id+' mirrored translated campaign clone');
  const jitter=([x,y])=>[x+(Math.round(x*17+y*31)%7)-3,y+(Math.round(x*23+y*11)%7)-3];
  assert.ok(nearDuplicate(recipe,mapPoints(recipe,jitter)),recipe.id+' tiny-coordinate-jitter campaign clone');
}
console.log(`PASS daily novelty:80 campaign recipes; exact label/order/translation/mirror invariance;<=3px jitter and near clones; structural/shape changes;<=10-piece minimax matching;${NEAR_DUPLICATE_PIXELS}px gate.`);

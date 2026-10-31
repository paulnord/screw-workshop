// Geometry-only novelty checks. This is a conservative visual/layout gate, not a
// proof that two boards require different strategies. No physics state is used.
import {createHash} from 'node:crypto';

export const NEAR_DUPLICATE_PIXELS = 12;
const MAX_PIECES = 10, EPSILON = 1e-7;
const point = p => {
  if (!Array.isArray(p) || p.length !== 2 || !p.every(n=>Number.isFinite(n)&&Math.abs(n)<=10000))
    throw new Error('Novelty comparison needs bounded finite coordinate pairs');
  return [p[0], p[1]];
};
const length = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1]);
const rounded = v => Math.round(v * 1e6) / 1e6 || 0;
const ordered = points => points.map(p=>p.map(rounded)).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
const unique = points => points.filter((p,i)=>points.findIndex(q=>length(p,q)<EPSILON)===i);
function cleanRing(points) {
  if(!Array.isArray(points)||points.length<3||points.length>64)throw new Error('Novelty outline supports3–64 vertices');
  const ring=points.map(point).filter((p,i,a)=>!i||length(p,a[i-1])>EPSILON);
  if(ring.length>1&&length(ring[0],ring.at(-1))<EPSILON)ring.pop();
  let changed=true;
  while(changed&&ring.length>3){changed=false;for(let i=0;i<ring.length;i++){
    const a=ring[(i+ring.length-1)%ring.length],b=ring[i],c=ring[(i+1)%ring.length];
    const cross=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);
    const dot=(b[0]-a[0])*(c[0]-b[0])+(b[1]-a[1])*(c[1]-b[1]);
    if(Math.abs(cross)<EPSILON&&dot>=0){ring.splice(i,1);changed=true;break;}
  }}
  if(ring.length<3)throw new Error('Novelty comparison needs a polygon outline');
  return ring;
}
function barOutline([a,b]) {
  const dx=b[0]-a[0],dy=b[1]-a[1],size=Math.hypot(dx,dy);
  if(size<=20)throw new Error('Novelty comparison needs a valid bar');
  const u=[dx/size,dy/size],v=[-dy/size,dx/size];
  return [[-18,-17],[size+18,-17],[size+18,17],[-18,17]].map(([x,y])=>[
    a[0]+u[0]*x+v[0]*y,a[1]+u[1]*x+v[1]*y
  ]);
}
function describe(recipe) {
  const raw=recipe.pieces||recipe.plates;
  if(!Array.isArray(raw)||!raw.length||raw.length>MAX_PIECES)
    throw new Error('Novelty comparison supports 1–10 pieces');
  const pieces=raw.map(p=>{
    const anchors=(recipe.pieces?(p.anchors||p.bar):p).map(point);
    if(!anchors.length||anchors.length>6)throw new Error('Invalid novelty anchor count');
    if(!(recipe.pieces&&p.outline)&&anchors.length!==2)throw new Error('Non-bar pieces need an explicit outline');
    const outline=recipe.pieces&&p.outline?cleanRing(p.outline):barOutline(anchors);
    const holes=(recipe.pieces&&p.holes)||[];
    if(!Array.isArray(holes)||holes.length>12)throw new Error('Too many novelty cutouts');
    return {anchors,outline,cutouts:unique([...anchors,...holes.map(point)])};
  });
  const all=pieces.flatMap(p=>p.anchors),origin=all.reduce((n,p)=>[n[0]+p[0]/all.length,n[1]+p[1]/all.length],[0,0]);
  if(!Array.isArray(recipe.hidden||[])||(recipe.hidden||[]).length>4)throw new Error('Too many novelty hidden holes');
  const hidden=(recipe.hidden||[]).map(point);
  const spareCount=recipe.spares?.length??recipe.spareCount??1;
  return {pieces,origin,hidden,spareCount};
}
function normalized(desc,reflect=1) {
  const transform=p=>[(p[0]-desc.origin[0])*reflect,p[1]-desc.origin[1]];
  return {spareCount:desc.spareCount,hidden:desc.hidden.map(transform),pieces:desc.pieces.map(p=>({
    anchors:p.anchors.map(transform),outline:p.outline.map(transform),cutouts:p.cutouts.map(transform)
  }))};
}
function canonicalRing(points) {
  const p=points.map(v=>v.map(rounded)),options=[];
  for(const ring of [p,p.slice().reverse()])for(let i=0;i<ring.length;i++)
    options.push(JSON.stringify([...ring.slice(i),...ring.slice(0,i)]));
  return options.sort()[0];
}
function canonical(desc) {
  return JSON.stringify({spareCount:desc.spareCount,hidden:ordered(desc.hidden),pieces:desc.pieces.map(p=>JSON.stringify({
    anchors:ordered(p.anchors),outline:canonicalRing(p.outline),cutouts:ordered(p.cutouts)
  })).sort()});
}
/** Stable SHA-256; ignores labels, date, solution, polygon start/winding, piece
 * ordering, anchor ordering, translation, mirror, and material partition choices.
 * Rail-hole positions are deliberately ignored (rail-hole count is retained):
 * moving parking holes alone must not turn an old assembly into a new puzzle. */
export function geometryFingerprint(recipe) {
  const desc=describe(recipe),key=[canonical(normalized(desc)),canonical(normalized(desc,-1))].sort()[0];
  return createHash('sha256').update(key).digest('hex');
}

// Exact bottleneck assignment: binary-search costs and test a perfect bipartite
// matching. Polynomial rather than factorial; supports ten pieces and up to18
// cutouts (six anchors plus twelve explicit holes), without unbounded search.
function assignment(a,b,cost) {
  if(a.length!==b.length)return Infinity;
  const n=a.length;if(!n)return 0;
  const matrix=a.map(x=>b.map(y=>cost(x,y)));
  const thresholds=[...new Set(matrix.flat().filter(Number.isFinite))].sort((x,y)=>x-y);
  const possible=limit=>{
    const owner=new Int16Array(n).fill(-1);
    const augment=(row,visited)=>{
      for(let col=0;col<n;col++)if(!visited[col]&&matrix[row][col]<=limit){
        visited[col]=1;
        if(owner[col]<0||augment(owner[col],visited)){owner[col]=row;return true;}
      }
      return false;
    };
    for(let row=0;row<n;row++)if(!augment(row,new Uint8Array(n)))return false;
    return true;
  };
  if(!thresholds.length||!possible(thresholds.at(-1)))return Infinity;
  let lo=0,hi=thresholds.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(possible(thresholds[mid]))hi=mid;else lo=mid+1;}
  return thresholds[lo];
}
function segmentDistance(p,a,b) {
  const dx=b[0]-a[0],dy=b[1]-a[1],denom=dx*dx+dy*dy;
  const t=denom?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/denom)):0;
  return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);
}
function boundaryDistanceUpperBound(a,b) {
  // Differing vertex counts can be a tiny notch/collinear jitter rather than a
  // different shape. Distance to a fixed boundary is1-Lipschitz: sampled values
  // plus half the sample spacing bound the unsampled portion of each edge.
  let maximum=0;
  for(let i=0;i<a.length;i++){
    const u=a[i],v=a[(i+1)%a.length],edge=length(u,v),steps=Math.max(1,Math.ceil(edge/4));
    let edgeMaximum=0;
    for(let k=0;k<=steps;k++){
      const t=k/steps,p=[u[0]+(v[0]-u[0])*t,u[1]+(v[1]-u[1])*t];
      edgeMaximum=Math.max(edgeMaximum,Math.min(...b.map((q,j)=>segmentDistance(p,q,b[(j+1)%b.length]))));
    }
    maximum=Math.max(maximum,edgeMaximum+edge/(2*steps));
  }
  return maximum;
}
function outlineDistance(a,b) {
  // Ring correspondence preserves concavities rather than equating polygons
  // with the same bounding box. Collinear subdivision is removed by cleanRing.
  if(a.length!==b.length)return Math.max(boundaryDistanceUpperBound(a,b),boundaryDistanceUpperBound(b,a));
  let best=Infinity;
  for(const ring of [b,b.slice().reverse()])for(let shift=0;shift<ring.length;shift++){
    let maximum=0;
    for(let i=0;i<a.length;i++)maximum=Math.max(maximum,length(a[i],ring[(i+shift)%ring.length]));
    best=Math.min(best,maximum);
  }
  return best;
}
function pieceDistance(a,b) {
  if(a.anchors.length!==b.anchors.length||a.cutouts.length!==b.cutouts.length)return Infinity;
  return Math.max(assignment(a.anchors,b.anchors,length),assignment(a.cutouts,b.cutouts,length),outlineDistance(a.outline,b.outline));
}
/** Pixel minimax distance after global anchor-centroid translation, allowing a
 * horizontal reflection and optimal piece/anchor/cutout/ring correspondence.
 * Incompatible piece counts, spare counts or hole counts yield Infinity. For
 * differing polygon vertex counts a sampled Lipschitz boundary upper bound
 * prevents tiny notches/collinear jitter from faking a new shape. A value <=12
 * bounds matched feature displacement/boundary distance by12 board pixels. */
export function geometryDistance(a,b) {
  const da=describe(a),db=describe(b);
  if(da.pieces.length!==db.pieces.length||da.spareCount!==db.spareCount||da.hidden.length!==db.hidden.length)return Infinity;
  const left=normalized(da);
  return Math.min(...[1,-1].map(reflect=>{
    const right=normalized(db,reflect);
    return Math.max(assignment(left.hidden,right.hidden,length),assignment(left.pieces,right.pieces,pieceDistance));
  }));
}
export function nearDuplicate(a,b,threshold=NEAR_DUPLICATE_PIXELS) {
  if(!Number.isFinite(threshold)||threshold<0)throw new Error('Invalid novelty threshold');
  return geometryDistance(a,b)<=threshold+EPSILON;
}

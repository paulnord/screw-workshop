/** Optional sync core: no SDK, credentials, browser globals, or guest-save access.
 * normalizeRecord/recordKey/mergeRecords use revision-specific identities. updatedAt
 * belongs to the adapter (serverTimestamp on writes), never to local assertions.
 * createSyncController({storage,adapter,onChange}) exposes setUser, state, load,
 * enqueue, flush, importGuest(records,{confirmed:true}), exportData, clearLocal,
 * deleteAll({confirmed:true}). Caller must reauthenticate before adapter.deleteAll.
 * Adapter: readAll(uid)->records, putBest(uid,record)->transaction's best record,
 * deleteAll(uid). Every operation must bind its authorization to the supplied UID.
 * UI must use the returned account state, not copy it into guest save keys.
 */
const PREFIX='screw-workshop-sync-v1:';
const MAX_RECORDS=1500, MAX_BYTES=2*1024*1024;
const idPattern=/^[a-z0-9-]{1,96}$/, revisionPattern=/^[a-zA-Z0-9_-]{1,96}$/;
export function normalizeRecord(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const {kind,puzzleId,revision,bestMoves}=value;
 if(value.schema!==1||value.completed!==true||!['campaign','daily'].includes(kind)||typeof puzzleId!=='string'||typeof revision!=='string'||!idPattern.test(puzzleId)||!revisionPattern.test(revision)||!Number.isInteger(bestMoves)||bestMoves<1||bestMoves>100000)return null;
 return {schema:1,kind,puzzleId,revision,bestMoves,completed:true};
}
export function recordKey(value){const r=normalizeRecord(value);if(!r)throw Error('Invalid progress record');return `${r.kind}__${r.puzzleId}__${r.revision}`}
export function mergeRecords(...groups){
 const map=new Map();
 for(const group of groups){if(!Array.isArray(group))continue;for(const value of group){const r=normalizeRecord(value);if(!r)continue;const key=recordKey(r),old=map.get(key);if(!old||r.bestMoves<old.bestMoves)map.set(key,r);if(map.size>MAX_RECORDS)throw Error('Progress record limit exceeded');}}
 return [...map.values()].sort((a,b)=>recordKey(a).localeCompare(recordKey(b)));
}
function validUID(uid){return typeof uid==='string'&&uid.length>0&&uid.length<=128&&!/[\u0000-\u001f\u007f]/.test(uid)}
export function createSyncController({storage=null,adapter,onChange=()=>{}}={}){
 if(!adapter||!['readAll','putBest','deleteAll'].every(k=>typeof adapter[k]==='function'))throw Error('Missing sync adapter');
 let uid=null,generation=0,mutation=0,loadSerial=0,records=[],pending=[],error=null,persisted=true,busy=false,activeFlush=null,deleting=false;
 const keyFor=id=>PREFIX+encodeURIComponent(id);
 const current=(id,gen)=>uid===id&&generation===gen;
 const copy=a=>a.map(r=>({...r}));
 function state(){return {uid,records:copy(records),pending:copy(pending),error,persisted,busy};}
 function emit(){onChange(state());}
 function save(){
  if(!uid)return;
  try{const raw=JSON.stringify({schema:1,records,pending});if(raw.length>MAX_BYTES)throw Error('Progress cache limit exceeded');if(!storage)throw Error('Local storage unavailable');storage.setItem(keyFor(uid),raw);persisted=true;}catch{persisted=false;}
 }
 function requireUser(){if(!uid)throw Error('Sign in before syncing progress');if(deleting)throw Error('Account deletion is in progress');return [uid,generation];}
 function setUser(next){
  if(next!==null&&!validUID(next))throw Error('Invalid account identifier');
  generation++;loadSerial++;mutation++;uid=next;records=[];pending=[];error=null;persisted=true;busy=false;activeFlush=null;deleting=false;
  if(uid){try{const raw=storage?.getItem(keyFor(uid));if(raw){if(raw.length>MAX_BYTES)throw Error('Cache too large');const data=JSON.parse(raw);if(data.schema!==1)throw Error('Unknown cache');records=mergeRecords(data.records);pending=mergeRecords(data.pending);records=mergeRecords(records,pending);}}catch{error='Saved account cache could not be read';}}
  emit();return state();
 }
 async function load(){
  const [id,gen]=requireUser(),serial=++loadSerial,epoch=mutation;busy=true;emit();
  try{const remote=await adapter.readAll(id);if(!current(id,gen)||serial!==loadSerial)return {stale:true};if(!Array.isArray(remote)||remote.some(r=>!normalizeRecord(r)))throw Error('Invalid cloud progress');records=mutation===epoch?mergeRecords(remote,pending):mergeRecords(remote,records,pending);error=null;save();return state();}
  catch(e){if(current(id,gen)&&serial===loadSerial){error='Cloud progress unavailable; local progress is retained';return state();}return {stale:true};}
  finally{if(current(id,gen)&&serial===loadSerial){busy=false;emit();}}
 }
 function enqueue(value){
  requireUser();const r=normalizeRecord(value);if(!r)throw Error('Invalid progress record');
  const key=recordKey(r),old=records.find(x=>recordKey(x)===key);if(old&&old.bestMoves<=r.bestMoves)return state();
  const nextRecords=mergeRecords(records,[r]),nextPending=mergeRecords(pending,[r]);records=nextRecords;pending=nextPending;mutation++;save();emit();return state();
 }
 async function flush(){
  const [id,gen]=requireUser();if(activeFlush&&activeFlush.gen===gen)return activeFlush.promise;
  const run=Promise.resolve().then(async()=>{
   if(!current(id,gen))return {stale:true};
   busy=true;emit();
   try{while(current(id,gen)&&pending.length){
    const item={...pending[0]},key=recordKey(item);const result=normalizeRecord(await adapter.putBest(id,item));
    if(!current(id,gen))return {stale:true};
    if(!result||recordKey(result)!==key||result.bestMoves>item.bestMoves)throw Error('Invalid transaction result');
    mutation++;records=mergeRecords(records,[result]);pending=pending.filter(r=>recordKey(r)!==key||r.bestMoves<result.bestMoves);error=null;save();emit();
   }return current(id,gen)?state():{stale:true};}
   catch{if(current(id,gen)){error='Not yet synced; your pending moves will retry when online';save();return state();}return {stale:true};}
   finally{if(current(id,gen)){busy=false;activeFlush=null;emit();}}
  });activeFlush={gen,promise:run};return run;
 }
 function importGuest(values,{confirmed=false}={}){
  requireUser();if(confirmed!==true)throw Error('Explicit merge confirmation required');
  if(!Array.isArray(values)||values.some(v=>!normalizeRecord(v)))throw Error('Invalid guest progress');
  // Validate the whole merge first so a limit failure cannot partially import.
  const imported=mergeRecords(values),nextRecords=mergeRecords(records,imported);
  const changes=imported.filter(r=>{const old=records.find(x=>recordKey(x)===recordKey(r));return !old||r.bestMoves<old.bestMoves;});
  const nextPending=mergeRecords(pending,changes);records=nextRecords;pending=nextPending;mutation++;save();emit();return state();
 }
 function exportData(){const [id]=requireUser();return {schema:1,uid:id,records:copy(records),pending:copy(pending)};}
 function clearLocal(){
  const [id]=requireUser();generation++;records=[];pending=[];error=null;busy=false;activeFlush=null;
  try{if(!storage)throw Error();storage.removeItem(keyFor(id));persisted=true;}catch{persisted=false;}
  emit();return state();
 }
 async function deleteAll({confirmed=false,password}={}){
  const [id]=requireUser();if(confirmed!==true)throw Error('Explicit deletion confirmation required');
  // Stop future queued writes, then await the already-started write before deleting.
  const previous=activeFlush?.promise;generation++;const gen=generation;activeFlush=null;busy=true;deleting=true;emit();
  try{if(previous)await previous;if(!current(id,gen))return {stale:true};await adapter.deleteAll(id,password);if(!current(id,gen))return {stale:true};records=[];pending=[];error=null;try{storage?.removeItem(keyFor(id));persisted=!!storage;}catch{persisted=false;}return state();}
  catch{if(current(id,gen)){error='Cloud deletion did not complete; retry after signing in again';return state();}return {stale:true};}
  finally{if(current(id,gen)){busy=false;deleting=false;emit();}}
 }
 return {setUser,state,load,enqueue,flush,importGuest,exportData,clearLocal,deleteAll};
}
